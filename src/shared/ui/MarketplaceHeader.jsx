import { Search, Menu, X, LogOut, UserRound } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { logoutUser } from '../../features/auth/services/authService.js';
import { fetchCurrentUserProfile } from '../../features/profile/services/profileService.js';
import { ROUTES } from '../constants/routes.js';
import { useAuthSessionState } from '../hooks/useAuthSessionState.js';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { navigateWithScroll } from '../lib/navigation/navigateWithScroll.js';
import { clearAuthenticatedUser, hasAuthenticatedSession } from '../lib/storage/authStorage.js';
import BrandLogo from './BrandLogo.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';

const MENU_BREAKPOINT = 1360;
const COMPACT_BREAKPOINT = 900;

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
  brandLabel = 'FreelanceAze',
  actionButton = null,
  authenticatedLinks = []
}) {
  const { t } = useI18n();
  const authSession = useAuthSessionState();
  const isAuthenticated = Boolean(authSession);
  const [isOpen, setIsOpen] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(() => authSession?.user || null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCompactLayout, setIsCompactLayout] = useState(false);
  const [isMenuLayout, setIsMenuLayout] = useState(false);
  const searchWrapRef = useRef(null);
  const searchInputRef = useRef(null);
  const linksToRender = isAuthenticated && authenticatedLinks.length ? authenticatedLinks : links;

  const mappedLinks = useMemo(
    () =>
      linksToRender.map((link) => ({
        ...link,
        href: link.href || link.route || ROUTES.home
      })),
    [linksToRender]
  );

  useEffect(() => {
    if (!authSession) {
      setAuthenticatedUser(null);
      return undefined;
    }

    setAuthenticatedUser((currentUser) => authSession.user || currentUser || null);

    let isCancelled = false;

    async function loadAuthenticatedUser() {
      try {
        const profile = await fetchCurrentUserProfile();

        if (!isCancelled) {
          setAuthenticatedUser(profile);
        }
      } catch {
        if (!isCancelled) {
          if (!hasAuthenticatedSession()) {
            setAuthenticatedUser(null);
            return;
          }

          setAuthenticatedUser((currentUser) => currentUser || authSession.user || null);
        }
      }
    }

    loadAuthenticatedUser();

    return () => {
      isCancelled = true;
    };
  }, [authSession]);

  useEffect(() => {
    function syncScrolledState() {
      setIsScrolled(window.scrollY > 10);
    }

    syncScrolledState();
    window.addEventListener('scroll', syncScrolledState, { passive: true });

    return () => {
      window.removeEventListener('scroll', syncScrolledState);
    };
  }, []);

  useEffect(() => {
    function syncResponsiveState() {
      const compact = window.innerWidth <= COMPACT_BREAKPOINT;
      const canUseMenu = window.innerWidth <= MENU_BREAKPOINT;

      setIsCompactLayout(compact);
      setIsMenuLayout(canUseMenu);

      if (!canUseMenu) {
        setIsOpen(false);
      }

      if (!compact) {
        setIsSearchOpen(false);
      }
    }

    syncResponsiveState();
    window.addEventListener('resize', syncResponsiveState);

    return () => {
      window.removeEventListener('resize', syncResponsiveState);
    };
  }, []);

  const isSearchExpanded = isSearchOpen;

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

  useEffect(() => {
    if (!isOpen || !isMenuLayout) {
      return undefined;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, isMenuLayout]);

  const closeMenu = () => setIsOpen(false);

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
    closeMenu();
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchValue('');
    searchInputRef.current?.blur();
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    if (!searchValue.trim()) {
      return;
    }

    navigate(ROUTES.exploreMembers);

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

  const headerClassName = isScrolled ? 'detailHeader detailHeaderShared scrolled' : 'detailHeader detailHeaderShared';
  const rowClassName = `detailHeaderFrame detailHeaderRow${isSearchOpen ? ' searchOpen' : ''}${isCompactLayout ? ' compact' : ''}${
    isMenuLayout ? ' menuLayout' : ''
  }`;
  const panelClassName = `${isOpen ? 'detailHeaderPanel open' : 'detailHeaderPanel'}${isSearchOpen ? ' searchHidden' : ''}${
    isMenuLayout ? ' menuLayout' : ''
  }`;
  const navClassName = `${isSearchOpen ? 'detailHeaderNav searchHidden' : 'detailHeaderNav'}${isOpen ? ' open' : ''}`;
  const actionsClassName = `${isSearchOpen ? 'detailHeaderActions searchMode' : 'detailHeaderActions'}${
    isCompactLayout ? ' compact' : ''
  }${isMenuLayout ? ' menuLayout' : ''}`;
  const searchShellClassName = `${isSearchExpanded ? 'detailSearchShell open' : 'detailSearchShell'}${
    isCompactLayout ? ' compact' : ''
  }`;

  const authControls = isAuthenticated ? (
    <>
      {actionButton ? (
        <a
          href={actionButton.href || actionButton.route || ROUTES.home}
          className="btn primary interactive detailHeaderRegister detailHeaderActionButton"
          onClick={(event) => resolveLinkNavigation(event, actionButton, navigate, closeMenu)}
        >
          {t(actionButton.label)}
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
        title={authenticatedUser?.firstName || authenticatedUser?.fullName || t('Profile')}
      >
        {authenticatedUser?.avatarUrl ? (
          <img
            src={authenticatedUser.avatarUrl}
            alt={authenticatedUser?.fullName || t('Profile')}
            className="detailHeaderUserAvatar"
          />
        ) : (
          <UserRound size={18} />
        )}
      </button>
      <button type="button" className="detailHeaderLogout interactive" onClick={handleSignOut} aria-label={t('Sign out')}>
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
        {t('Sign In')}
      </a>
      <a
        href={ROUTES.register}
        className="btn primary interactive detailHeaderRegister"
        onClick={(event) => resolveLinkNavigation(event, { route: ROUTES.register }, navigate, closeMenu)}
      >
        {t('Register')}
      </a>
    </>
  );

  return (
    <>
      {showPromo ? (
        <div className="marketStrip">
          <div className="wrap marketStripRow">
            <span>{t(promoText)}</span>
            <a
              href={promoAction.href || promoAction.route || ROUTES.home}
              onClick={(event) => resolveLinkNavigation(event, promoAction, navigate, closeMenu)}
            >
              {t(promoAction.label)}
            </a>
          </div>
        </div>
      ) : null}

      <header className={headerClassName}>
        <div className={rowClassName}>
          <BrandLogo
            href={brandHref}
            label={brandLabel}
            onClick={(event) => {
              closeMenu();
              navigateWithScroll(event, ROUTES.home, navigate);
            }}
          />

          <div className={panelClassName}>
            <nav className={navClassName}>
              {mappedLinks.map((link) => (
                <a
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  onClick={(event) => resolveLinkNavigation(event, link, navigate, closeMenu)}
                >
                  {t(link.label)}
                </a>
              ))}
            </nav>

            {isMenuLayout ? (
              <>
                <div className="detailHeaderPanelUtility">
                  <LanguageSwitcher className="detailHeaderPanelLanguage" />
                </div>

                <div className="detailHeaderPanelActions">{authControls}</div>
              </>
            ) : null}
          </div>

          <div className={actionsClassName}>
            {isMenuLayout ? null : <LanguageSwitcher className="detailHeaderLanguage" />}

            <form ref={searchWrapRef} className={searchShellClassName} onSubmit={handleSearchSubmit}>
              <button
                type="button"
                className="detailSearchActivator interactive"
                onClick={handleOpenSearch}
                aria-label={t('Open search')}
                aria-expanded={isSearchExpanded}
              >
                <Search size={16} />
                <span className="detailSearchActivatorLabel">{t('Search')}</span>
              </button>

              <input
                ref={searchInputRef}
                type="text"
                placeholder={t('Search talent, services, jobs')}
                aria-label={t('Search')}
                value={searchValue}
                onFocus={handleOpenSearch}
                onChange={(event) => setSearchValue(event.target.value)}
              />

              <button
                type="button"
                className={isSearchExpanded ? 'detailSearchClose interactive visible' : 'detailSearchClose interactive'}
                onClick={handleCloseSearch}
                aria-label={t('Close search')}
              >
                <X size={16} />
              </button>
            </form>

            {isSearchOpen || isMenuLayout ? null : authControls}
          </div>

          {isSearchOpen ? null : (
            <button
              type="button"
              className="detailMenuButton interactive"
              onClick={() => setIsOpen((currentState) => !currentState)}
              aria-label={t('Toggle navigation')}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>

        {isMenuLayout && isOpen && !isSearchOpen ? (
          <button
            type="button"
            className="detailHeaderBackdrop"
            onClick={closeMenu}
            aria-label={t('Close navigation')}
          />
        ) : null}
      </header>
    </>
  );
}
