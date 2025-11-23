export interface NewsArticle {
    id: string;
    source: {
        id: string | null;
        name: string;
    };
    author: string | null;
    title: string;
    description: string;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string;
    category?: string;
    country?: string;
    saved?: boolean;
    savedAt?: string;
    notes?: string;
}

export interface NewsResponse {
    status?: string;
    totalResults?: number;
    articles: NewsArticle[];
    total?: number;
}

export interface WhiteHouseArticle {
    id: string;
    title: string;
    description: string;
    url: string;
    publishedAt: string;
    type: 'briefing' | 'statement' | 'press-release';
}

export interface NewsFilters {
    query: string;
    category: string;
    country: string;
    page: number;
    pageSize: number;
}
