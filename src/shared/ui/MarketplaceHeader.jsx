import { Search, ChevronDown, Menu, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ROUTES } from '../constants/routes.js';
import { navigateWithScroll } from '../lib/navigation/navigateWithScroll.js';
import BrandLogo from './BrandLogo.jsx';

function resolveLinkNavigation(event, link, navigate, closeMenu) {
  if (link.route) {
    navigateWithScroll(event, link.route, navigate);
  }

  closeMenu();
}

export default function MarketplaceHeader({
  navigate,
  links = [],
  showPromo = false,
  promoText = 'Discover the top freelance platform on the market.',
  promoAction = { label: 'Learn more', route: ROUTES.home },
  brandHref = ROUTES.home,
  brandLabel = 'Workreap'
}) {
  const [isOpen, setIsOpen] = useState(false);

  const mappedLinks = useMemo(
    () =>
      links.map((link) => ({
        ...link,
        href: link.href || link.route || ROUTES.home
      })),
    [links]
  );

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {showPromo ? (
        <div className="marketStrip">
          <div className="wrap marketStripRow">
            <span>{promoText}</span>
            <a
              href={promoAction.href || promoAction.route || ROUTES.home}
              onClick={(event) => resolveLinkNavigation(event, promoAction, navigate, closeMenu)}
            >
              {promoAction.label}
            </a>
          </div>
        </div>
      ) : null}

      <header className="detailHeader detailHeaderShared">
        <div className="wrap detailHeaderRow">
          <BrandLogo
            href={brandHref}
            label={brandLabel}
            onClick={(event) => navigateWithScroll(event, ROUTES.home, navigate)}
          />

          <button
            type="button"
            className="detailMenuButton interactive"
            onClick={() => setIsOpen((currentState) => !currentState)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <nav className={isOpen ? 'detailHeaderNav open' : 'detailHeaderNav'}>
            {mappedLinks.map((link) => (
              <a
                key={`${link.label}-${link.href}`}
                href={link.href}
                onClick={(event) => resolveLinkNavigation(event, link, navigate, closeMenu)}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className={isOpen ? 'detailHeaderActions open' : 'detailHeaderActions'}>
            <div className="detailSearchShell">
              <Search size={16} />
              <input type="text" placeholder="Search" aria-label="Search" />
              <button type="button" className="detailSearchType interactive">
                Freelancers
                <ChevronDown size={15} />
              </button>
            </div>

            <a
              href={ROUTES.login}
              className="detailHeaderLink interactive"
              onClick={(event) => resolveLinkNavigation(event, { route: ROUTES.login }, navigate, closeMenu)}
            >
              Sign In
            </a>
            <a
              href={ROUTES.register}
              className="btn primary interactive detailHeaderRegister"
              onClick={(event) => resolveLinkNavigation(event, { route: ROUTES.register }, navigate, closeMenu)}
            >
              Register
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
