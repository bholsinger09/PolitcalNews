import { describe, it, expect } from 'vitest';
import { NewsService } from '../services/news.js';

describe('NewsService', () => {
    const service = new NewsService();

    it('should fetch top headlines', async () => {
        const result = await service.getTopHeadlines('us', 'politics', 1, 10);
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('articles');
        expect(Array.isArray(result.articles)).toBe(true);
        result.articles.forEach(article => {
            expect(article).toHaveProperty('id');
            expect(article).toHaveProperty('title');
            expect(article).toHaveProperty('description');
        });
    });

    it('should search news', async () => {
        const result = await service.searchNews('politics', 1, 10);
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('articles');
        expect(Array.isArray(result.articles)).toBe(true);
    });

    it('should get political news', async () => {
        const result = await service.getPoliticalNews(1, 10);
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('articles');
        expect(Array.isArray(result.articles)).toBe(true);
    });
});
