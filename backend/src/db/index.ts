import type { SavedNews } from '../types/news.js';

// In-memory database (replace with real database in production)
class NewsDatabase {
  private savedNews: Map<string, SavedNews> = new Map();

  // CREATE
  save(news: SavedNews): SavedNews {
    this.savedNews.set(news.id, news);
    return news;
  }

  // READ
  getAll(): SavedNews[] {
    return Array.from(this.savedNews.values())
      .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
  }

  getById(id: string): SavedNews | undefined {
    return this.savedNews.get(id);
  }

  // UPDATE
  update(id: string, updates: Partial<SavedNews>): SavedNews | null {
    const existing = this.savedNews.get(id);
    if (!existing) return null;
    
    const updated = { ...existing, ...updates };
    this.savedNews.set(id, updated);
    return updated;
  }

  // DELETE
  delete(id: string): boolean {
    return this.savedNews.delete(id);
  }

  // UTILITY
  exists(id: string): boolean {
    return this.savedNews.has(id);
  }

  count(): number {
    return this.savedNews.size;
  }
}

export const db = new NewsDatabase();
