import { onMount, For, Show, createMemo } from 'solid-js';
import { newsStore } from '../store/newsStore';
import NewsCard from '../components/NewsCard';
import './SavedNews.css';

export default function SavedNews() {
  onMount(() => {
    newsStore.fetchSavedNews();
  });

  const savedArticles = createMemo(() => newsStore.savedNews());

  return (
    <div class="container saved-page">
      <div class="page-header">
        <h1>Saved Articles</h1>
        <p class="subtitle">
          Your personal collection of saved news articles ({savedArticles().length})
        </p>
      </div>

      <Show when={savedArticles().length === 0}>
        <div class="empty-state">
          <div class="empty-icon">📚</div>
          <h2>No saved articles yet</h2>
          <p>Start saving articles from the news feed to build your collection</p>
        </div>
      </Show>

      <div class="news-grid">
        <For each={savedArticles()}>
          {(article) => (
            <NewsCard 
              article={article} 
              showSaveButton={false}
              onDelete={() => {}}
            />
          )}
        </For>
      </div>
    </div>
  );
}
