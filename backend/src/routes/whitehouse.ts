import { Hono } from 'hono';
import { whitehouseService } from '../services/whitehouse.js';

const app = new Hono();

// GET all White House updates
app.get('/', async (c) => {
  try {
    const articles = await whitehouseService.getLatestUpdates();
    return c.json({ articles, total: articles.length });
  } catch (error) {
    console.error('Error fetching White House updates:', error);
    return c.json({ error: 'Failed to fetch White House updates' }, 500);
  }
});

// GET White House updates by type
app.get('/:type', async (c) => {
  const type = c.req.param('type') as 'briefing' | 'statement' | 'press-release';
  
  if (!['briefing', 'statement', 'press-release'].includes(type)) {
    return c.json({ error: 'Invalid type parameter' }, 400);
  }

  try {
    const articles = await whitehouseService.getByType(type);
    return c.json({ articles, total: articles.length });
  } catch (error) {
    console.error('Error fetching White House updates:', error);
    return c.json({ error: 'Failed to fetch White House updates' }, 500);
  }
});

export default app;
