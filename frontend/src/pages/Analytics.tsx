import { onMount, createSignal, Show } from 'solid-js';
import { Chart, Title, Tooltip, Legend, Colors } from 'chart.js';
import { Line, Doughnut, Bar } from 'solid-chartjs';
import './Analytics.css';

Chart.register(Title, Tooltip, Legend, Colors);

interface TrendData {
    date: string;
    count: number;
}

interface SentimentData {
    positive: number;
    neutral: number;
    negative: number;
}

interface TopicData {
    name: string;
    count: number;
}

interface SummaryData {
    totalArticles: number;
    todayArticles: number;
    trendingTopics: number;
    updateFrequency: string;
}

export default function Analytics() {
    const [trends, setTrends] = createSignal<TrendData[]>([]);
    const [sentiment, setSentiment] = createSignal<SentimentData | null>(null);
    const [topics, setTopics] = createSignal<TopicData[]>([]);
    const [summary, setSummary] = createSignal<SummaryData | null>(null);
    const [loading, setLoading] = createSignal(true);

    onMount(async () => {
        try {
            const [trendsRes, sentimentRes, topicsRes, summaryRes] = await Promise.all([
                fetch('/api/analytics/trends'),
                fetch('/api/analytics/sentiment'),
                fetch('/api/analytics/topics'),
                fetch('/api/analytics/summary'),
            ]);

            const trendsData = await trendsRes.json();
            const sentimentData = await sentimentRes.json();
            const topicsData = await topicsRes.json();
            const summaryData = await summaryRes.json();

            setTrends(trendsData.trends || []);
            setSentiment(sentimentData.sentiment);
            setTopics(topicsData.topics || []);
            setSummary(summaryData.summary);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    });

    const lineChartData = () => ({
        labels: trends().map(t => t.date),
        datasets: [
            {
                label: 'Articles Published',
                data: trends().map(t => t.count),
                borderColor: 'rgb(37, 99, 235)',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    });

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'News Volume Trend (Last 7 Days)',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const sentimentChartData = () => ({
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [
            {
                data: sentiment() ? [
                    sentiment()!.positive,
                    sentiment()!.neutral,
                    sentiment()!.negative,
                ] : [],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(100, 116, 139, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderWidth: 2,
                borderColor: '#fff',
            },
        ],
    });

    const sentimentChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom' as const,
            },
            title: {
                display: true,
                text: 'Sentiment Analysis',
            },
        },
    };

    const topicsChartData = () => ({
        labels: topics().map(t => t.name),
        datasets: [
            {
                label: 'Articles',
                data: topics().map(t => t.count),
                backgroundColor: [
                    'rgba(37, 99, 235, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(251, 146, 60, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                ],
            },
        ],
    });

    const topicsChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Topic Distribution',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div class="container analytics-page">
            <div class="page-header">
                <h1>📊 Analytics Dashboard</h1>
                <p class="subtitle">Real-time insights and data visualization</p>
            </div>

            <Show when={loading()}>
                <div class="loading">
                    <div class="spinner"></div>
                </div>
            </Show>

            <Show when={!loading()}>
                {/* Summary Cards */}
                <div class="summary-grid">
                    <div class="summary-card">
                        <div class="summary-icon">📰</div>
                        <div class="summary-content">
                            <div class="summary-value">{summary()?.totalArticles || 0}</div>
                            <div class="summary-label">Total Articles</div>
                        </div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-icon">🔥</div>
                        <div class="summary-content">
                            <div class="summary-value">{summary()?.todayArticles || 0}</div>
                            <div class="summary-label">Today's Articles</div>
                        </div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-icon">📈</div>
                        <div class="summary-content">
                            <div class="summary-value">{summary()?.trendingTopics || 0}</div>
                            <div class="summary-label">Trending Topics</div>
                        </div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-icon">⚡</div>
                        <div class="summary-content">
                            <div class="summary-value">{summary()?.updateFrequency || 'N/A'}</div>
                            <div class="summary-label">Update Frequency</div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div class="charts-grid">
                    <div class="chart-card">
                        <Line data={lineChartData()} options={lineChartOptions} width={500} height={300} />
                    </div>

                    <div class="chart-card">
                        <Doughnut data={sentimentChartData()} options={sentimentChartOptions} width={300} height={300} />
                    </div>

                    <div class="chart-card chart-card-wide">
                        <Bar data={topicsChartData()} options={topicsChartOptions} width={500} height={300} />
                    </div>
                </div>
            </Show>
        </div>
    );
}
