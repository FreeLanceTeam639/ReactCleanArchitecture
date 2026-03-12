import { HOME_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';

export default function HomeHeader({ navigate }) {
  return <MarketplaceHeader navigate={navigate} links={HOME_NAVIGATION_LINKS} />;
}
