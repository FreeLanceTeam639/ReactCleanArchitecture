import { ROUTES } from './routes.js';

export const HOME_NAVIGATION_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Find Work', href: '#services' },
  { label: 'Find By Category', href: '#services' },
  { label: 'Talent', href: '#talents' },
  { label: 'Pricing', href: '#pricing' }
];

export const AUTHENTICATED_NAVIGATION_LINKS = [
  { label: 'Home', route: ROUTES.home },
  { label: 'My Orders', route: ROUTES.orders },
  { label: 'Messages', route: ROUTES.messages },
  { label: 'Notifications', route: ROUTES.notifications },
  { label: 'Wallet', route: ROUTES.wallet },
  { label: 'Reviews', route: ROUTES.reviews }
];

export const PROFILE_NAVIGATION_LINKS = [
  ...AUTHENTICATED_NAVIGATION_LINKS,
  { label: 'Security', route: ROUTES.security }
];
