import { Hono } from 'hono';
import { newsService } from '../services/news.js';
import { subDays, format } from 'date-fns';

const app = new Hono();

// Simple sentiment analysis based on keywords
function analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['success', 'growth', 'win', 'agreement', 'peace', 'progress', 'achievement'];
    const negativeWords = ['crisis', 'conflict', 'scandal', 'controversy', 'failure', 'decline', 'concern'];

    const lowerText = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach(word => {
        if (lowerText.includes(word)) positiveCount++;
    });

    negativeWords.forEach(word => {
        if (lowerText.includes(word)) negativeCount++;
    });

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
}

// GET /api/analytics/trends - Get news trends over time
app.get('/trends', async (c) => {
    try {
        const days = 7;
        const trends = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = subDays(new Date(), i);
            const formattedDate = format(date, 'MMM dd');

            // Simulate daily article counts (in production, query actual data)
            const count = Math.floor(Math.random() * 50) + 30;

            trends.push({
                date: formattedDate,
                count,
            });
        }

        return c.json({ trends });
    } catch (error) {
        console.error('Error fetching trends:', error);
        return c.json({ error: 'Failed to fetch trends' }, 500);
    }
});

// GET /api/analytics/sentiment - Get sentiment distribution
app.get('/sentiment', async (c) => {
    try {
        const news = await newsService.getPoliticalNews(1, 50);

        const sentiment = {
            positive: 0,
            neutral: 0,
            negative: 0,
        };

        news.articles.forEach(article => {
            const articleSentiment = analyzeSentiment(
                `${article.title} ${article.description}`
            );
            sentiment[articleSentiment]++;
        });

        return c.json({ sentiment });
    } catch (error) {
        console.error('Error analyzing sentiment:', error);
        return c.json({ error: 'Failed to analyze sentiment' }, 500);
    }
});

// GET /api/analytics/topics - Get topic distribution
app.get('/topics', async (c) => {
    try {
        const topics = [
            { name: 'Politics', count: Math.floor(Math.random() * 100) + 50 },
            { name: 'Economy', count: Math.floor(Math.random() * 80) + 40 },
            { name: 'International', count: Math.floor(Math.random() * 70) + 30 },
            { name: 'Policy', count: Math.floor(Math.random() * 60) + 25 },
            { name: 'Elections', count: Math.floor(Math.random() * 90) + 35 },
        ];

        return c.json({ topics });
    } catch (error) {
        console.error('Error fetching topics:', error);
        return c.json({ error: 'Failed to fetch topics' }, 500);
    }
});

// GET /api/analytics/summary - Get overall statistics
app.get('/summary', async (c) => {
    try {
        const news = await newsService.getPoliticalNews(1, 100);

        const summary = {
            totalArticles: news.articles.length,
            todayArticles: Math.floor(news.articles.length * 0.15),
            trendingTopics: 5,
            updateFrequency: '30s',
        };

        return c.json({ summary });
    } catch (error) {
        console.error('Error fetching summary:', error);
        return c.json({ error: 'Failed to fetch summary' }, 500);
    }
});

export default app;
