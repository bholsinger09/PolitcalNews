import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../db/index.js';
import type { SavedNews } from '../types/news.js';

describe('NewsDatabase', () => {
    const mockArticle: SavedNews = {
        id: 'test-1',
        source: { id: 'test-source', name: 'Test Source' },
        author: 'Test Author',
        title: 'Test Article',
        description: 'Test Description',
        url: 'https://example.com',
        urlToImage: 'https://example.com/image.jpg',
        publishedAt: '2024-01-01T00:00:00Z',
        content: 'Test Content',
        savedAt: new Date().toISOString(),
        saved: true,
    };

    beforeEach(() => {
        // Clear database before each test
        const all = db.getAll();
        all.forEach(article => db.delete(article.id));
    });

    describe('CREATE', () => {
        it('should save a news article', () => {
            const saved = db.save(mockArticle);
            expect(saved).toEqual(mockArticle);
            expect(db.exists('test-1')).toBe(true);
        });
    });

    describe('READ', () => {
        it('should get all saved articles', () => {
            db.save(mockArticle);
            const all = db.getAll();
            expect(all).toHaveLength(1);
            expect(all[0]).toEqual(mockArticle);
        });

        it('should get article by ID', () => {
            db.save(mockArticle);
            const found = db.getById('test-1');
            expect(found).toEqual(mockArticle);
        });

        it('should return undefined for non-existent ID', () => {
            const found = db.getById('non-existent');
            expect(found).toBeUndefined();
        });
    });

    describe('UPDATE', () => {
        it('should update existing article', () => {
            db.save(mockArticle);
            const updated = db.update('test-1', { notes: 'New notes' });
            expect(updated?.notes).toBe('New notes');
            expect(updated?.title).toBe(mockArticle.title);
        });

        it('should return null for non-existent article', () => {
            const updated = db.update('non-existent', { notes: 'Notes' });
            expect(updated).toBeNull();
        });
    });

    describe('DELETE', () => {
        it('should delete existing article', () => {
            db.save(mockArticle);
            const deleted = db.delete('test-1');
            expect(deleted).toBe(true);
            expect(db.exists('test-1')).toBe(false);
        });

        it('should return false for non-existent article', () => {
            const deleted = db.delete('non-existent');
            expect(deleted).toBe(false);
        });
    });

    describe('UTILITY', () => {
        it('should check if article exists', () => {
            expect(db.exists('test-1')).toBe(false);
            db.save(mockArticle);
            expect(db.exists('test-1')).toBe(true);
        });

        it('should count saved articles', () => {
            expect(db.count()).toBe(0);
            db.save(mockArticle);
            expect(db.count()).toBe(1);
        });
    });
});
