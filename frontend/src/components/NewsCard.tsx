import { createSignal } from 'solid-js';
import type { NewsArticle } from '../types/news';
import { newsStore } from '../store/newsStore';
import './NewsCard.css';

interface NewsCardProps {
    article: NewsArticle;
    showSaveButton?: boolean;
    onDelete?: (id: string) => void;
}

export default function NewsCard(props: NewsCardProps) {
    const [saving, setSaving] = createSignal(false);
    const [deleting, setDeleting] = createSignal(false);

    const handleSave = async (e: Event) => {
        e.preventDefault();
        e.stopPropagation();

        setSaving(true);
        try {
            await newsStore.saveNewsArticle(props.article);
        } catch (err) {
            console.error('Failed to save article:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (e: Event) => {
        e.preventDefault();
        e.stopPropagation();

        setDeleting(true);
        try {
            await newsStore.deleteSavedNews(props.article.id);
            props.onDelete?.(props.article.id);
        } catch (err) {
            console.error('Failed to delete article:', err);
        } finally {
            setDeleting(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <article class="news-card card">
            {props.article.urlToImage && (
                <div class="news-card-image">
                    <img
                        src={props.article.urlToImage}
                        alt={props.article.title}
                        loading="lazy"
                    />
                </div>
            )}
            <div class="news-card-content">
                <div class="news-card-meta">
                    <span class="news-source">{props.article.source.name}</span>
                    <span class="news-date">{formatDate(props.article.publishedAt)}</span>
                </div>
                <h3 class="news-title">
                    <a href={props.article.url} target="_blank" rel="noopener noreferrer">
                        {props.article.title}
                    </a>
                </h3>
                <p class="news-description">{props.article.description}</p>
                {props.article.author && (
                    <p class="news-author">By {props.article.author}</p>
                )}
                {props.article.notes && (
                    <div class="news-notes">
                        <strong>Notes:</strong> {props.article.notes}
                    </div>
                )}
                <div class="news-card-actions">
                    <a
                        href={props.article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="btn btn-primary"
                    >
                        Read More →
                    </a>
                    {props.showSaveButton && !props.article.saved && (
                        <button
                            class="btn btn-secondary"
                            onClick={handleSave}
                            disabled={saving()}
                        >
                            {saving() ? 'Saving...' : '💾 Save'}
                        </button>
                    )}
                    {props.article.saved && props.onDelete && (
                        <button
                            class="btn btn-secondary"
                            onClick={handleDelete}
                            disabled={deleting()}
                        >
                            {deleting() ? 'Deleting...' : '🗑️ Delete'}
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}
