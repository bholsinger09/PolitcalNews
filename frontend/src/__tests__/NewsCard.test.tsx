import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import NewsCard from '../components/NewsCard';
import type { NewsArticle } from '../types/news';

describe('NewsCard Component', () => {
  const mockArticle: NewsArticle = {
    id: 'test-1',
    source: { id: 'test-source', name: 'Test Source' },
    author: 'Test Author',
    title: 'Test Article Title',
    description: 'Test article description',
    url: 'https://example.com/article',
    urlToImage: 'https://example.com/image.jpg',
    publishedAt: '2024-01-01T00:00:00Z',
    content: 'Test content',
  };

  it('renders article title', () => {
    render(() => <NewsCard article={mockArticle} />);
    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
  });

  it('renders article description', () => {
    render(() => <NewsCard article={mockArticle} />);
    expect(screen.getByText('Test article description')).toBeInTheDocument();
  });

  it('renders source name', () => {
    render(() => <NewsCard article={mockArticle} />);
    expect(screen.getByText('Test Source')).toBeInTheDocument();
  });

  it('renders author when provided', () => {
    render(() => <NewsCard article={mockArticle} />);
    expect(screen.getByText(/Test Author/)).toBeInTheDocument();
  });

  it('shows save button when showSaveButton is true', () => {
    render(() => <NewsCard article={mockArticle} showSaveButton={true} />);
    expect(screen.getByText(/Save/)).toBeInTheDocument();
  });

  it('renders image when urlToImage is provided', () => {
    render(() => <NewsCard article={mockArticle} />);
    const img = screen.getByAltText('Test Article Title');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
  });
});
