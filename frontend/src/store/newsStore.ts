import { createSignal, createEffect } from 'solid-js';
import type { NewsArticle, NewsResponse, NewsFilters } from '../types/news';

const isProduction = window.location.hostname !== 'localhost';
const API_BASE = isProduction 
    ? 'http://politcalnews.duckdns.org:3001/api'
    : 'http://localhost:3001/api';

// Signals for news state
const [news, setNews] = createSignal<NewsArticle[]>([]);
const [savedNews, setSavedNews] = createSignal<NewsArticle[]>([]);
const [loading, setLoading] = createSignal(false);
const [error, setError] = createSignal<string | null>(null);

// Signals for filters
const [filters, setFilters] = createSignal<NewsFilters>({
    query: '',
    category: 'general',
    country: 'us',
    page: 1,
    pageSize: 20,
});

// Cache for performance
const cache = new Map<string, { data: NewsResponse; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCacheKey(filters: NewsFilters): string {
    return `${filters.query}-${filters.category}-${filters.country}-${filters.page}-${filters.pageSize}`;
}

function getFromCache(key: string): NewsResponse | null {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    cache.delete(key);
    return null;
}

function setCache(key: string, data: NewsResponse) {
    cache.set(key, { data, timestamp: Date.now() });
}

// Fetch news with caching
export async function fetchNews(customFilters?: Partial<NewsFilters>) {
    const currentFilters = { ...filters(), ...customFilters };
    const cacheKey = getCacheKey(currentFilters);

    // Check cache first
    const cached = getFromCache(cacheKey);
    if (cached) {
        setNews(cached.articles);
        return;
    }

    setLoading(true);
    setError(null);

    try {
        const params = new URLSearchParams();
        if (currentFilters.query) params.append('q', currentFilters.query);
        if (currentFilters.category) params.append('category', currentFilters.category);
        if (currentFilters.country) params.append('country', currentFilters.country);
        params.append('page', currentFilters.page.toString());
        params.append('pageSize', currentFilters.pageSize.toString());

        const response = await fetch(`${API_BASE}/news?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch news: ${response.statusText}`);
        }

        const data: NewsResponse = await response.json();

        // Mark saved articles
        const savedIds = new Set(savedNews().map(a => a.id));
        const articlesWithSaved = data.articles.map(article => ({
            ...article,
            saved: savedIds.has(article.id),
        }));

        setNews(articlesWithSaved);
        setCache(cacheKey, { ...data, articles: articlesWithSaved });
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch news');
        console.error('Error fetching news:', err);
    } finally {
        setLoading(false);
    }
}

// Fetch saved news
export async function fetchSavedNews() {
    try {
        const response = await fetch(`${API_BASE}/news/saved`);

        if (!response.ok) {
            throw new Error(`Failed to fetch saved news: ${response.statusText}`);
        }

        const data = await response.json();
        setSavedNews(data.articles || []);
    } catch (err) {
        console.error('Error fetching saved news:', err);
    }
}

// Save news article
export async function saveNewsArticle(article: NewsArticle) {
    try {
        const response = await fetch(`${API_BASE}/news/saved`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(article),
        });

        if (!response.ok) {
            if (response.status === 409) {
                throw new Error('Article already saved');
            }
            throw new Error('Failed to save article');
        }

        const saved = await response.json();
        setSavedNews(prev => [saved, ...prev]);

        // Update the article in news list
        setNews(prev => prev.map(a => a.id === article.id ? { ...a, saved: true } : a));

        // Clear cache to refresh on next fetch
        cache.clear();

        return saved;
    } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to save article');
    }
}

// Update saved news
export async function updateSavedNews(id: string, notes: string) {
    try {
        const response = await fetch(`${API_BASE}/news/saved/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notes }),
        });

        if (!response.ok) {
            throw new Error('Failed to update saved news');
        }

        const updated = await response.json();
        setSavedNews(prev => prev.map(a => a.id === id ? updated : a));

        return updated;
    } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to update saved news');
    }
}

// Delete saved news
export async function deleteSavedNews(id: string) {
    try {
        const response = await fetch(`${API_BASE}/news/saved/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete saved news');
        }

        setSavedNews(prev => prev.filter(a => a.id !== id));
        setNews(prev => prev.map(a => a.id === id ? { ...a, saved: false } : a));

        // Clear cache
        cache.clear();
    } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to delete saved news');
    }
}

// Update filters
export function updateFilters(newFilters: Partial<NewsFilters>) {
    setFilters(prev => ({ ...prev, ...newFilters, page: newFilters.page ?? 1 }));
}

// Auto-fetch on filter change with debouncing
let debounceTimer: number;
createEffect(() => {
    const currentFilters = filters();
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        fetchNews(currentFilters);
    }, 300) as unknown as number;
});

// Export signals as store
export const newsStore = {
    news,
    savedNews,
    loading,
    error,
    filters,
    fetchNews,
    fetchSavedNews,
    saveNewsArticle,
    updateSavedNews,
    deleteSavedNews,
    updateFilters,
};
