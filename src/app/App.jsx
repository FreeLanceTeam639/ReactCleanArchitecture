import HomePage from '../pages/home/HomePage.jsx';
import LoginPage from '../pages/login/LoginPage.jsx';
import TaskDetailPage from '../pages/task-detail/TaskDetailPage.jsx';
import { isTaskDetailRoute, ROUTES } from '../shared/constants/routes.js';
import { usePathname } from '../shared/hooks/usePathname.js';
import RegisterPage from '../pages/register/RegisterPage.jsx';
import ProfilePage from '../pages/profile/ProfilePage.jsx';
import OrdersPage from '../pages/orders/OrdersPage.jsx';
import MessagesPage from '../pages/messages/MessagesPage.jsx';
import NotificationsPage from '../pages/notifications/NotificationsPage.jsx';
import PostTaskPage from '../pages/post-task/PostTaskPage.jsx';
import WalletPage from '../pages/wallet/WalletPage.jsx';
import ReviewsPage from '../pages/reviews/ReviewsPage.jsx';
import SecurityPage from '../pages/security/SecurityPage.jsx';

function App() {
  const [pathname, navigate] = usePathname();

  if (pathname === ROUTES.login) {
    return <LoginPage navigate={navigate} />;
  }

  if (pathname === ROUTES.register) {
    return <RegisterPage navigate={navigate} />;
  }

  if (pathname === ROUTES.profile) {
    return <ProfilePage navigate={navigate} />;
  }

  if (pathname === ROUTES.orders) {
    return <OrdersPage navigate={navigate} />;
  }

  if (pathname === ROUTES.messages) {
    return <MessagesPage navigate={navigate} />;
  }

  if (pathname === ROUTES.notifications) {
    return <NotificationsPage navigate={navigate} />;
  }

  if (pathname === ROUTES.postTask) {
    return <PostTaskPage navigate={navigate} />;
  }

  if (pathname === ROUTES.wallet) {
    return <WalletPage navigate={navigate} />;
  }

  if (pathname === ROUTES.reviews) {
    return <ReviewsPage navigate={navigate} />;
  }

  if (pathname === ROUTES.security) {
    return <SecurityPage navigate={navigate} />;
  }

  if (isTaskDetailRoute(pathname)) {
    return <TaskDetailPage navigate={navigate} pathname={pathname} />;
  }

  return <HomePage navigate={navigate} />;
}

export default App;
