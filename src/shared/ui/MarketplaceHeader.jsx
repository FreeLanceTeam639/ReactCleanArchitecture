import { Search, Menu, X, LogOut, UserRound } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { logoutUser } from '../../features/auth/services/authService.js';
import { fetchCurrentUserProfile } from '../../features/profile/services/profileService.js';
import { ROUTES } from '../constants/routes.js';
import { navigateWithScroll } from '../lib/navigation/navigateWithScroll.js';
import { clearAuthenticatedUser, hasAuthenticatedSession } from '../lib/storage/authStorage.js';
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
  brandLabel = 'Workreap',
  actionButton = null
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchWrapRef = useRef(null);
  const searchInputRef = useRef(null);

  const mappedLinks = useMemo(
    () =>
      links.map((link) => ({
        ...link,
        href: link.href || link.route || ROUTES.home
      })),
    [links]
  );

  useEffect(() => {
    let isCancelled = false;

    async function loadAuthenticatedUser() {
      if (!hasAuthenticatedSession()) {
        setAuthenticatedUser(null);
        return;
      }

      try {
        const profile = await fetchCurrentUserProfile();

        if (!isCancelled) {
          setAuthenticatedUser(profile);
        }
      } catch {
        if (!isCancelled && !hasAuthenticatedSession()) {
          setAuthenticatedUser(null);
        }
      }
    }

    loadAuthenticatedUser();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isSearchOpen) {
      return undefined;
    }

    const nextFrame = window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });

    function handlePointerDown(event) {
      if (!searchWrapRef.current?.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      window.cancelAnimationFrame(nextFrame);
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isSearchOpen]);

  const closeMenu = () => setIsOpen(false);

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
    closeMenu();
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    if (!searchValue.trim()) {
      return;
    }

    if (window.location.pathname !== ROUTES.home) {
      navigate(ROUTES.home);
      window.setTimeout(() => {
        window.location.hash = 'talents';
      }, 0);
    } else {
      window.location.hash = 'talents';
    }

    setIsSearchOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
    } catch {
      // backend logout failsa bele local auth temizlenir
    }

    clearAuthenticatedUser();
    setAuthenticatedUser(null);
    closeMenu();
    navigate(ROUTES.home);
  };

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
        <div className={isSearchOpen ? 'wrap detailHeaderRow searchOpen' : 'wrap detailHeaderRow'}>
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

          <nav className={`${isOpen ? 'detailHeaderNav open' : 'detailHeaderNav'}${isSearchOpen ? ' searchHidden' : ''}`}>
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
            <form
              ref={searchWrapRef}
              className={isSearchOpen ? 'detailSearchShell open' : 'detailSearchShell'}
              onSubmit={handleSearchSubmit}
            >
              <button
                type="button"
                className="detailSearchActivator interactive"
                onClick={handleOpenSearch}
                aria-label="Open search"
              >
                <Search size={16} />
              </button>

              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search talent, services, jobs"
                aria-label="Search"
                value={searchValue}
                onFocus={handleOpenSearch}
                onChange={(event) => setSearchValue(event.target.value)}
              />

              <button
                type="button"
                className={isSearchOpen ? 'detailSearchClose interactive visible' : 'detailSearchClose interactive'}
                onClick={handleCloseSearch}
                aria-label="Close search"
              >
                <X size={16} />
              </button>
            </form>

            {authenticatedUser ? (
              <>
                {actionButton ? (
                  <a
                    href={actionButton.href || actionButton.route || ROUTES.home}
                    className="btn primary interactive detailHeaderRegister detailHeaderActionButton"
                    onClick={(event) => resolveLinkNavigation(event, actionButton, navigate, closeMenu)}
                  >
                    {actionButton.label}
                  </a>
                ) : null}
                <button
                  type="button"
                  className="detailHeaderUser interactive detailHeaderProfileButton"
                  onClick={() => {
                    closeMenu();
                    navigate(ROUTES.profile);
                  }}
                  aria-label="Open profile"
                  title={authenticatedUser.firstName || authenticatedUser.fullName || 'Profile'}
                >
                  <UserRound size={18} />
                </button>
                <button type="button" className="detailHeaderLogout interactive" onClick={handleSignOut} aria-label="Sign out">
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
