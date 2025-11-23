import { A } from '@solidjs/router';
import { createSignal } from 'solid-js';
import './Header.css';

export default function Header() {
    const [menuOpen, setMenuOpen] = createSignal(false);

    const toggleMenu = () => setMenuOpen(!menuOpen());
    const closeMenu = () => setMenuOpen(false);

    return (
        <header class="header">
            <div class="container">
                <nav class="nav">
                    <A href="/" class="logo" onClick={closeMenu}>
                        <span class="logo-icon">📰</span>
                        PoliticalNews
                    </A>
                    
                    <button 
                        class="hamburger" 
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                        classList={{ 'active': menuOpen() }}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <div class="nav-links" classList={{ 'mobile-open': menuOpen() }}>
                        <A href="/" class="nav-link" activeClass="active" end onClick={closeMenu}>
                            Latest News
                        </A>
                        <A href="/whitehouse" class="nav-link" activeClass="active" onClick={closeMenu}>
                            White House
                        </A>
                        <A href="/analytics" class="nav-link" activeClass="active" onClick={closeMenu}>
                            Analytics
                        </A>
                        <A href="/saved" class="nav-link" activeClass="active" onClick={closeMenu}>
                            Saved
                        </A>
                    </div>
                </nav>
            </div>
        </header>
    );
}
