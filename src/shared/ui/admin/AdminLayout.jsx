import { LayoutGrid, Users, BriefcaseBusiness, FolderKanban, Sparkles, BadgeDollarSign, Menu, X, ArrowLeft } from 'lucide-react';
import { useMemo, useState } from 'react';
import BrandLogo from '../BrandLogo.jsx';
import { ROUTES } from '../../constants/routes.js';
import LanguageSwitcher from '../LanguageSwitcher.jsx';

const NAV_ITEMS = [
  { label: 'Dashboard', route: ROUTES.admin, icon: LayoutGrid },
  { label: 'Users', route: ROUTES.adminUsers, icon: Users },
  { label: 'Jobs', route: ROUTES.adminJobs, icon: BriefcaseBusiness },
  { label: 'Categories', route: ROUTES.adminCategories, icon: FolderKanban },
  { label: 'Talent', route: ROUTES.adminTalent, icon: Sparkles },
  { label: 'Pricing', route: ROUTES.adminPricing, icon: BadgeDollarSign }
];

export default function AdminLayout({ navigate, pathname, title, description, actions = null, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = useMemo(
    () => NAV_ITEMS.map((item) => ({ ...item, isActive: pathname === item.route })),
    [pathname]
  );

  const handleNavigate = (route) => {
    setIsSidebarOpen(false);
    navigate(route);
  };

  return (
    <div className="adminShell">
      <aside className={`adminSidebar${isSidebarOpen ? ' open' : ''}`}>
        <div className="adminSidebarTop">
          <BrandLogo href={ROUTES.home} label="FreelanceAze" className="brand adminBrand" onClick={(event) => {
            event.preventDefault();
            handleNavigate(ROUTES.home);
          }} />
          <button
            type="button"
            className="adminSidebarClose interactive"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close admin menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="adminSidebarMeta">
          <span className="adminSidebarEyebrow">Admin panel</span>
          <p>Marketplace content və idarəetmə axınları üçün sadə mərkəz.</p>
        </div>

        <nav className="adminSidebarNav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.route}
                type="button"
                className={item.isActive ? 'adminSidebarLink active' : 'adminSidebarLink'}
                onClick={() => handleNavigate(item.route)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="adminSidebarFooter">
          <div>
            <strong>Administrator</strong>
            <span>Design-aligned control center</span>
          </div>
          <button type="button" className="adminIconButton interactive" onClick={() => handleNavigate(ROUTES.home)} aria-label="Back to site">
            <ArrowLeft size={16} />
          </button>
        </div>
      </aside>

      {isSidebarOpen ? <button type="button" className="adminSidebarBackdrop" onClick={() => setIsSidebarOpen(false)} /> : null}

      <div className="adminMain">
        <header className="adminTopbar wrapLarge">
          <div className="adminTopbarIntro">
            <button
              type="button"
              className="adminMenuButton interactive"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open admin menu"
            >
              <Menu size={18} />
            </button>
            <div>
              <span className="adminPageEyebrow">FreelanceAze Admin</span>
              <h1>{title}</h1>
              {description ? <p>{description}</p> : null}
            </div>
          </div>

          <div className="adminTopbarActions">
            <LanguageSwitcher className="adminLanguageSwitcher" />
            {actions}
          </div>
        </header>

        <main className="adminContent wrapLarge">{children}</main>
      </div>
    </div>
  );
}
