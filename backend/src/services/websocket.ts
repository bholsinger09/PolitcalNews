import { Server as SocketIOServer } from 'socket.io';
import { newsService } from './news.js';

let io: SocketIOServer | null = null;

export function initializeWebSocket(server: any) {
    io = new SocketIOServer(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });

        socket.on('subscribe:news', () => {
            console.log('Client subscribed to news updates:', socket.id);
            socket.join('news-updates');
        });

        socket.on('unsubscribe:news', () => {
            console.log('Client unsubscribed from news updates:', socket.id);
            socket.leave('news-updates');
        });
    });

    // Simulate real-time news updates every 30 seconds
    setInterval(async () => {
        try {
            const latestNews = await newsService.getPoliticalNews(1, 3);
            if (latestNews.articles.length > 0) {
                io?.to('news-updates').emit('news:update', {
                    timestamp: new Date().toISOString(),
                    articles: latestNews.articles,
                });
                console.log('Broadcasted news update to subscribers');
            }
        } catch (error) {
            console.error('Error fetching news for broadcast:', error);
        }
    }, 30000); // Every 30 seconds

    return io;
}

export function getIO() {
    if (!io) {
        throw new Error('Socket.IO not initialized');
    }
    return io;
}

export function broadcastNewsUpdate(article: any) {
    if (io) {
        io.to('news-updates').emit('news:breaking', {
            timestamp: new Date().toISOString(),
            article,
        });
    }
}
