import { onMount, For, Show, createMemo, createSignal } from 'solid-js';
import { whitehouseStore } from '../store/whitehouseStore';
import './WhiteHouse.css';

export default function WhiteHouse() {
  const [selectedType, setSelectedType] = createSignal<string | undefined>(undefined);

  onMount(() => {
    whitehouseStore.fetchWhiteHouseNews();
  });

  const articles = createMemo(() => whitehouseStore.whiteHouseNews());

  const handleTypeFilter = (type: string | undefined) => {
    setSelectedType(type);
    whitehouseStore.fetchWhiteHouseNews(type);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTypeBadgeClass = (type: string) => {
    const classes: Record<string, string> = {
      briefing: 'type-badge-briefing',
      statement: 'type-badge-statement',
      'press-release': 'type-badge-release',
    };
    return `type-badge ${classes[type] || ''}`;
  };

  return (
    <div class="container whitehouse-page">
      <div class="page-header">
        <h1>🏛️ White House Updates</h1>
        <p class="subtitle">Official statements, briefings, and press releases</p>
      </div>

      <div class="filter-buttons">
        <button
          class={`filter-btn ${selectedType() === undefined ? 'active' : ''}`}
          onClick={() => handleTypeFilter(undefined)}
        >
          All Updates
        </button>
        <button
          class={`filter-btn ${selectedType() === 'briefing' ? 'active' : ''}`}
          onClick={() => handleTypeFilter('briefing')}
        >
          Briefings
        </button>
        <button
          class={`filter-btn ${selectedType() === 'statement' ? 'active' : ''}`}
          onClick={() => handleTypeFilter('statement')}
        >
          Statements
        </button>
        <button
          class={`filter-btn ${selectedType() === 'press-release' ? 'active' : ''}`}
          onClick={() => handleTypeFilter('press-release')}
        >
          Press Releases
        </button>
      </div>

      <Show when={whitehouseStore.error()}>
        <div class="error">{whitehouseStore.error()}</div>
      </Show>

      <Show when={whitehouseStore.loading()}>
        <div class="loading">
          <div class="spinner"></div>
        </div>
      </Show>

      <div class="whitehouse-list">
        <For each={articles()}>
          {(article) => (
            <article class="whitehouse-card card">
              <div class="whitehouse-header">
                <span class={getTypeBadgeClass(article.type)}>
                  {article.type.replace('-', ' ').toUpperCase()}
                </span>
                <span class="whitehouse-date">{formatDate(article.publishedAt)}</span>
              </div>
              <h3 class="whitehouse-title">{article.title}</h3>
              <p class="whitehouse-description">{article.description}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-primary"
              >
                Read Full Update →
              </a>
            </article>
          )}
        </For>
      </div>

      <Show when={!whitehouseStore.loading() && articles().length === 0}>
        <div class="empty-state">
          <p>No White House updates found.</p>
        </div>
      </Show>
    </div>
  );
}
