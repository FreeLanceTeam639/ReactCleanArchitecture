import { HOME_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import { ROUTES } from '../../shared/constants/routes.js';
import { navigateWithScroll } from '../../shared/lib/navigation/navigateWithScroll.js';
import BrandLogo from '../../shared/ui/BrandLogo.jsx';

export default function HomeHeader({ isMenuOpen, onToggleMenu, navigate }) {
  return (
    <header className="nav">
      <div className="wrap navRow">
        <BrandLogo href="#home" />
        <button className="menu interactive" onClick={onToggleMenu} aria-label="Open menu">
          ☰
        </button>
        <nav className={isMenuOpen ? 'navLinks open' : 'navLinks'}>
          {HOME_NAVIGATION_LINKS.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="navBtns">
          <a
            href={ROUTES.login}
            className="btn ghost interactive"
            onClick={(event) => navigateWithScroll(event, ROUTES.login, navigate)}
          >
            Sign In
          </a>
          <a href="#cta" className="btn primary interactive">
            Join Now
          </a>
        </div>
      </div>
    </header>
  );
}
