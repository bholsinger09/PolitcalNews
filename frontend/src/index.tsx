import { render } from 'solid-js/web';
import { Route, Router } from '@solidjs/router';
import { lazy, Show } from 'solid-js';
import Header from './components/Header';
import LiveUpdateNotification from './components/LiveUpdateNotification';
import './styles/global.css';
import './App.css';

const Home = lazy(() => import('./pages/Home'));
const SavedNews = lazy(() => import('./pages/SavedNews'));
const WhiteHouse = lazy(() => import('./pages/WhiteHouse'));
const Analytics = lazy(() => import('./pages/Analytics'));

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
    );
}

render(
    () => (
        <Router root={(props) => (
            <div class="app">
                <Header />
                <LiveUpdateNotification />
                <main class="main-content">
                    {props.children}
                </main>
                <footer class="footer">
                    <div class="container">
                        <p>&copy; 2024 PoliticalNews. Built with Solid.js & Hono.</p>
                        <p class="performance-note">
                            ⚡ Real-time updates • Analytics Dashboard • Performance Optimized
                        </p>
                    </div>
                </footer>
            </div>
        )}>
            <Route path="/" component={Home} />
            <Route path="/saved" component={SavedNews} />
            <Route path="/whitehouse" component={WhiteHouse} />
            <Route path="/analytics" component={Analytics} />
        </Router>
    ),
    root!,
);
