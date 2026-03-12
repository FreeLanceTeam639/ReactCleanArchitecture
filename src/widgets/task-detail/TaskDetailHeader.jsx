import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';
import { ROUTES } from '../../shared/constants/routes.js';

const TASK_DETAIL_LINKS = [
  { label: 'Main', route: ROUTES.home },
  { label: 'Explore', route: ROUTES.home },
  { label: 'Find By Categories', route: ROUTES.home }
];

export default function TaskDetailHeader({ navigate }) {
  return (
    <MarketplaceHeader
      navigate={navigate}
      links={TASK_DETAIL_LINKS}
      showPromo
      promoAction={{ label: 'Learn more', route: ROUTES.home }}
    />
  );
}
