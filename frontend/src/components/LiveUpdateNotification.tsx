import { Show, For, createSignal, onMount } from 'solid-js';
import { realtimeStore } from '../store/realtimeStore';
import './LiveUpdateNotification.css';

export default function LiveUpdateNotification() {
    const [hidden, setHidden] = createSignal(false);

    onMount(() => {
        realtimeStore.initialize();
    });

    const handleHide = () => {
        setHidden(true);
    };

    const handleViewUpdate = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        handleHide();
    };

    return (
        <Show when={realtimeStore.latestUpdate() && !hidden()}>
            <div class="live-update-notification">
                <div class="live-update-content">
                    <div class="live-update-header">
                        <span class="live-indicator">
                            <span class="pulse"></span>
                            LIVE
                        </span>
                        <span class="update-count">
                            {realtimeStore.latestUpdate()?.articles.length} new articles
                        </span>
                    </div>
                    <div class="live-update-preview">
                        <For each={realtimeStore.latestUpdate()?.articles.slice(0, 2)}>
                            {(article) => (
                                <div class="update-item">
                                    <span class="update-source">{article.source.name}</span>
                                    <span class="update-title">{article.title}</span>
                                </div>
                            )}
                        </For>
                    </div>
                    <div class="live-update-actions">
                        <button class="btn-view" onClick={handleViewUpdate}>
                            View Updates
                        </button>
                        <button class="btn-dismiss" onClick={handleHide}>
                            Hide
                        </button>
                    </div>
                </div>
                <Show when={realtimeStore.connected()}>
                    <div class="connection-status connected">
                        Connected
                    </div>
                </Show>
            </div>
        </Show>
    );
}
