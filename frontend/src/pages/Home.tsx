import { onMount, For, Show, createMemo } from 'solid-js';
import { newsStore } from '../store/newsStore';
import NewsCard from '../components/NewsCard';
import FilterBar from '../components/FilterBar';
import './Home.css';

export default function Home() {
    onMount(() => {
        newsStore.fetchNews();
        newsStore.fetchSavedNews();
    });

    const newsArticles = createMemo(() => newsStore.news());

    const handleLoadMore = () => {
        const currentPage = newsStore.filters().page;
        newsStore.updateFilters({ page: currentPage + 1 });
    };

    return (
        <div class="container home-page">
            <div class="page-header">
                <h1>Latest Political News</h1>
                <p class="subtitle">Stay informed with real-time news from around the world</p>
            </div>

            <FilterBar />

            <Show when={newsStore.error()}>
                <div class="error">{newsStore.error()}</div>
            </Show>

            <Show when={newsStore.loading() && newsArticles().length === 0}>
                <div class="loading">
                    <div class="spinner"></div>
                </div>
            </Show>

            <div class="news-grid">
                <For each={newsArticles()}>
                    {(article) => (
                        <NewsCard article={article} showSaveButton={true} />
                    )}
                </For>
            </div>

            <Show when={!newsStore.loading() && newsArticles().length === 0 && !newsStore.error()}>
                <div class="empty-state">
                    <p>No news articles found. Try adjusting your filters.</p>
                </div>
            </Show>

            <Show when={newsArticles().length > 0}>
                <div class="load-more-container">
                    <button
                        class="btn btn-primary load-more-btn"
                        onClick={handleLoadMore}
                        disabled={newsStore.loading()}
                    >
                        {newsStore.loading() ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            </Show>
        </div>
    );
}
