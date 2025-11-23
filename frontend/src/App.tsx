import { lazy } from 'solid-js';
import { Route } from '@solidjs/router';
import Header from './components/Header';
import './App.css';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const SavedNews = lazy(() => import('./pages/SavedNews'));
const WhiteHouse = lazy(() => import('./pages/WhiteHouse'));

function App() {
  return (
    <div class="app">
      <Header />
      <main class="main-content">
        <Route path="/" component={Home} />
        <Route path="/saved" component={SavedNews} />
        <Route path="/whitehouse" component={WhiteHouse} />
      </main>
      <footer class="footer">
        <div class="container">
          <p>&copy; 2024 PoliticalNews. Built with Solid.js & Hono.</p>
          <p class="performance-note">
            ⚡ Optimized for performance with caching and lazy loading
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
