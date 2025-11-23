import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import Header from '../components/Header';

describe('Header Component', () => {
  it('renders application name', () => {
    render(() => <Header />);
    expect(screen.getByText('PoliticalNews')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(() => <Header />);
    expect(screen.getByText('Latest News')).toBeInTheDocument();
    expect(screen.getByText('White House')).toBeInTheDocument();
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });

  it('renders logo icon', () => {
    render(() => <Header />);
    expect(screen.getByText('📰')).toBeInTheDocument();
  });
});
