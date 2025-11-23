import { A } from '@solidjs/router';
import './Header.css';

export default function Header() {
  return (
    <header class="header">
      <div class="container">
        <nav class="nav">
          <A href="/" class="logo">
            <span class="logo-icon">📰</span>
            PoliticalNews
          </A>
          <div class="nav-links">
            <A href="/" class="nav-link" activeClass="active" end>
              Latest News
            </A>
            <A href="/whitehouse" class="nav-link" activeClass="active">
              White House
            </A>
            <A href="/saved" class="nav-link" activeClass="active">
              Saved
            </A>
          </div>
        </nav>
      </div>
    </header>
  );
}
