import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { newsService } from '../services/news.js';
import { db } from '../db/index.js';
import { newsQuerySchema, createSavedNewsSchema, updateSavedNewsSchema } from '../schemas/news.js';

const app = new Hono();

// GET all news (with filters)
app.get('/', zValidator('query', newsQuerySchema), async (c) => {
  const { q, category, country, page, pageSize } = c.req.valid('query');

  try {
    let result;
    
    if (q) {
      result = await newsService.searchNews(q, page, pageSize);
    } else if (category === 'politics') {
      result = await newsService.getPoliticalNews(page, pageSize);
    } else {
      result = await newsService.getTopHeadlines(country || 'us', category, page, pageSize);
    }

    return c.json(result);
  } catch (error) {
    console.error('Error fetching news:', error);
    return c.json({ error: 'Failed to fetch news' }, 500);
  }
});

// GET all saved news
app.get('/saved', (c) => {
  const saved = db.getAll();
  return c.json({ articles: saved, total: saved.length });
});

// GET single saved news by ID
app.get('/saved/:id', (c) => {
  const id = c.req.param('id');
  const saved = db.getById(id);

  if (!saved) {
    return c.json({ error: 'Saved news not found' }, 404);
  }

  return c.json(saved);
});

// CREATE - Save news article
app.post('/saved', zValidator('json', createSavedNewsSchema), (c) => {
  const data = c.req.valid('json');

  if (db.exists(data.id)) {
    return c.json({ error: 'Article already saved' }, 409);
  }

  const saved = db.save({
    ...data,
    savedAt: new Date().toISOString(),
    saved: true,
  });

  return c.json(saved, 201);
});

// UPDATE - Update saved news
app.patch('/saved/:id', zValidator('json', updateSavedNewsSchema), (c) => {
  const id = c.req.param('id');
  const updates = c.req.valid('json');

  const updated = db.update(id, updates);

  if (!updated) {
    return c.json({ error: 'Saved news not found' }, 404);
  }

  return c.json(updated);
});

// DELETE - Remove saved news
app.delete('/saved/:id', (c) => {
  const id = c.req.param('id');
  const deleted = db.delete(id);

  if (!deleted) {
    return c.json({ error: 'Saved news not found' }, 404);
  }

  return c.json({ message: 'Saved news deleted successfully' });
});

export default app;
