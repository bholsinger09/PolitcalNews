import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import newsRoutes from './routes/news.js';
import whitehouseRoutes from './routes/whitehouse.js';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.route('/api/news', newsRoutes);
app.route('/api/whitehouse', whitehouseRoutes);

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

console.log(`🚀 Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;
