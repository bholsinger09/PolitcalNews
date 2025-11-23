import { createSignal, onCleanup } from 'solid-js';
import { io, Socket } from 'socket.io-client';
import type { NewsArticle } from '../types/news';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

let socket: Socket | null = null;

// Signals for real-time state
const [connected, setConnected] = createSignal(false);
const [liveUpdates, setLiveUpdates] = createSignal<NewsArticle[]>([]);
const [latestUpdate, setLatestUpdate] = createSignal<{
    timestamp: string;
    articles: NewsArticle[];
} | null>(null);

export function initializeWebSocket() {
    if (socket?.connected) {
        console.log('WebSocket already connected');
        return socket;
    }

    socket = io(API_BASE, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
        console.log('✅ WebSocket connected');
        setConnected(true);
        // Subscribe to news updates
        socket?.emit('subscribe:news');
    });

    socket.on('disconnect', () => {
        console.log('❌ WebSocket disconnected');
        setConnected(false);
    });

    socket.on('news:update', (data: { timestamp: string; articles: NewsArticle[] }) => {
        console.log('📰 Received news update:', data);
        setLatestUpdate(data);
        setLiveUpdates(prev => [...data.articles, ...prev].slice(0, 20));
    });

    socket.on('news:breaking', (data: { timestamp: string; article: NewsArticle }) => {
        console.log('🚨 Breaking news:', data);
        setLiveUpdates(prev => [data.article, ...prev].slice(0, 20));
    });

    socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
    });

    return socket;
}

export function disconnectWebSocket() {
    if (socket) {
        socket.emit('unsubscribe:news');
        socket.disconnect();
        socket = null;
        setConnected(false);
    }
}

export function subscribeToNews() {
    if (socket?.connected) {
        socket.emit('subscribe:news');
    }
}

export function unsubscribeFromNews() {
    if (socket?.connected) {
        socket.emit('unsubscribe:news');
    }
}

export const realtimeStore = {
    connected,
    liveUpdates,
    latestUpdate,
    initialize: initializeWebSocket,
    disconnect: disconnectWebSocket,
    subscribe: subscribeToNews,
    unsubscribe: unsubscribeFromNews,
};
