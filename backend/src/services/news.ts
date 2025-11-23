import type { NewsArticle, NewsResponse } from '../types/news.js';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_BASE = 'https://newsapi.org/v2';

export class NewsService {
    private async fetchFromNewsAPI(endpoint: string, params: URLSearchParams): Promise<NewsResponse> {
        if (!NEWS_API_KEY) {
            // Return mock data if no API key
            return this.getMockNews();
        }

        params.append('apiKey', NEWS_API_KEY);
        const url = `${NEWS_API_BASE}${endpoint}?${params.toString()}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`NewsAPI error: ${response.statusText}`);
            }

            const data = await response.json();

            // Add unique IDs to articles
            data.articles = data.articles.map((article: NewsArticle, index: number) => ({
                ...article,
                id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
            }));

            return data;
        } catch (error) {
            console.error('Error fetching from NewsAPI:', error);
            return this.getMockNews();
        }
    }

    async getTopHeadlines(
        country: string = 'us',
        category?: string,
        page: number = 1,
        pageSize: number = 20
    ): Promise<NewsResponse> {
        const params = new URLSearchParams({
            country,
            page: page.toString(),
            pageSize: pageSize.toString(),
        });

        if (category && category !== 'general') {
            params.append('category', category);
        }

        return this.fetchFromNewsAPI('/top-headlines', params);
    }

    async searchNews(
        query: string,
        page: number = 1,
        pageSize: number = 20
    ): Promise<NewsResponse> {
        const params = new URLSearchParams({
            q: query,
            page: page.toString(),
            pageSize: pageSize.toString(),
            sortBy: 'publishedAt',
            language: 'en',
        });

        return this.fetchFromNewsAPI('/everything', params);
    }

    async getPoliticalNews(
        page: number = 1,
        pageSize: number = 20
    ): Promise<NewsResponse> {
        return this.searchNews('politics OR government OR election OR congress OR senate', page, pageSize);
    }

    private getMockNews(): NewsResponse {
        const mockArticles: NewsArticle[] = [
            {
                id: `mock-${Date.now()}-1`,
                source: { id: 'bbc-news', name: 'BBC News' },
                author: 'BBC Staff',
                title: 'Global Political Summit Concludes with Historic Agreement',
                description: 'World leaders reach consensus on climate and economic policies after week-long negotiations.',
                url: 'https://example.com/article-1',
                urlToImage: 'https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?w=800',
                publishedAt: new Date().toISOString(),
                content: 'World leaders from over 50 countries concluded a historic summit today...',
                category: 'politics',
            },
            {
                id: `mock-${Date.now()}-2`,
                source: { id: 'cnn', name: 'CNN' },
                author: 'Jane Smith',
                title: 'Senate Passes Major Infrastructure Bill',
                description: 'Bipartisan legislation approved after months of debate and negotiations.',
                url: 'https://example.com/article-2',
                urlToImage: 'https://images.unsplash.com/photo-1555374018-13a8994ab246?w=800',
                publishedAt: new Date(Date.now() - 3600000).toISOString(),
                content: 'The Senate voted 72-28 to approve a comprehensive infrastructure package...',
                category: 'politics',
            },
            {
                id: `mock-${Date.now()}-3`,
                source: { id: 'reuters', name: 'Reuters' },
                author: 'John Doe',
                title: 'International Trade Agreement Signed',
                description: 'Multiple nations commit to reducing trade barriers and promoting economic cooperation.',
                url: 'https://example.com/article-3',
                urlToImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800',
                publishedAt: new Date(Date.now() - 7200000).toISOString(),
                content: 'Representatives from various countries signed a landmark trade agreement today...',
                category: 'business',
            },
        ];

        return {
            status: 'ok',
            totalResults: mockArticles.length,
            articles: mockArticles,
        };
    }
}

export const newsService = new NewsService();
