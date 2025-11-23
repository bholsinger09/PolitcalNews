import { newsStore } from '../store/newsStore';
import './FilterBar.css';

export default function FilterBar() {
  const categories = [
    { value: 'general', label: 'General' },
    { value: 'politics', label: 'Politics' },
    { value: 'business', label: 'Business' },
    { value: 'technology', label: 'Technology' },
    { value: 'world', label: 'World' },
  ];

  const handleQueryChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    newsStore.updateFilters({ query: target.value });
  };

  const handleCategoryChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    newsStore.updateFilters({ category: target.value });
  };

  return (
    <div class="filter-bar">
      <div class="filter-group">
        <input
          type="text"
          placeholder="Search news..."
          value={newsStore.filters().query}
          onInput={handleQueryChange}
          class="search-input"
        />
      </div>
      <div class="filter-group">
        <select
          value={newsStore.filters().category}
          onChange={handleCategoryChange}
          class="category-select"
        >
          {categories.map(cat => (
            <option value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
