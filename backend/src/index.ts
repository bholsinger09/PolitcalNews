import { serve, createAdaptorServer } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import newsRoutes from './routes/news.js';
import whitehouseRoutes from './routes/whitehouse.js';
import analyticsRoutes from './routes/analytics.js';
import { initializeWebSocket } from './services/websocket.js';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
    origin: [
        'http://localhost:3000',
        'http://politcalnews.duckdns.org:3000',
        'https://politcalnews.duckdns.org'
    ],
    credentials: true,
}));

// Health check
app.get('/health', (c) => {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.route('/api/news', newsRoutes);
app.route('/api/whitehouse', whitehouseRoutes);
app.route('/api/analytics', analyticsRoutes);

// 404 handler
app.notFound((c) => {
    return c.json({ error: 'Not Found' }, 404);
});

// Error handler
app.onError((err, c) => {
    console.error(`${err}`);
    return c.json({ error: err.message || 'Internal Server Error' }, 500);
});

const port = parseInt(process.env.PORT || '3001');

// Create HTTP server for WebSocket support
const server = createAdaptorServer(app);

// Initialize WebSocket
initializeWebSocket(server);

server.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`⚡ WebSocket server initialized`);
});

export default app;
