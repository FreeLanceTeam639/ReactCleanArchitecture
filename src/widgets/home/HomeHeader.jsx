import { AUTHENTICATED_NAVIGATION_LINKS, HOME_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';

export default function HomeHeader({ navigate }) {
  return <MarketplaceHeader navigate={navigate} links={HOME_NAVIGATION_LINKS} authenticatedLinks={AUTHENTICATED_NAVIGATION_LINKS} />;
}
