import { createSignal } from 'solid-js';
import type { WhiteHouseArticle } from '../types/news';

const API_BASE = '/api';

// Signals for White House state
const [whiteHouseNews, setWhiteHouseNews] = createSignal<WhiteHouseArticle[]>([]);
const [loading, setLoading] = createSignal(false);
const [error, setError] = createSignal<string | null>(null);

// Fetch White House news
export async function fetchWhiteHouseNews(type?: string) {
    setLoading(true);
    setError(null);

    try {
        const url = type
            ? `${API_BASE}/whitehouse/${type}`
            : `${API_BASE}/whitehouse`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch White House news: ${response.statusText}`);
        }

        const data = await response.json();
        setWhiteHouseNews(data.articles || []);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch White House news');
        console.error('Error fetching White House news:', err);
    } finally {
        setLoading(false);
    }
}

// Export signals as store
export const whitehouseStore = {
    whiteHouseNews,
    loading,
    error,
    fetchWhiteHouseNews,
};
