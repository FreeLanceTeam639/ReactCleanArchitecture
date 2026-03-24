import HomePage from '../pages/home/HomePage.jsx';
import LoginPage from '../pages/login/LoginPage.jsx';
import ForgotPasswordPage from '../pages/forgot-password/ForgotPasswordPage.jsx';
import TaskDetailPage from '../pages/task-detail/TaskDetailPage.jsx';
import { isTaskDetailRoute, ROUTES } from '../shared/constants/routes.js';
import { usePathname } from '../shared/hooks/usePathname.js';
import RegisterPage from '../pages/register/RegisterPage.jsx';
import ProfilePage from '../pages/profile/ProfilePage.jsx';
import VerificationPage from '../pages/verification/VerificationPage.jsx';
import OrdersPage from '../pages/orders/OrdersPage.jsx';
import MessagesPage from '../pages/messages/MessagesPage.jsx';
import NotificationsPage from '../pages/notifications/NotificationsPage.jsx';
import PostTaskPage from '../pages/post-task/PostTaskPage.jsx';
import WalletPage from '../pages/wallet/WalletPage.jsx';
import ReviewsPage from '../pages/reviews/ReviewsPage.jsx';
import SecurityPage from '../pages/security/SecurityPage.jsx';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage.jsx';
import AdminUsersPage from '../pages/admin/AdminUsersPage.jsx';
import AdminJobsPage from '../pages/admin/AdminJobsPage.jsx';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage.jsx';
import AdminTalentPage from '../pages/admin/AdminTalentPage.jsx';
import AdminPricingPage from '../pages/admin/AdminPricingPage.jsx';
import AdminVerificationPage from '../pages/admin/AdminVerificationPage.jsx';

function App() {
  const [pathname, navigate] = usePathname();

  if (pathname === ROUTES.login) {
    return <LoginPage navigate={navigate} />;
  }

  if (pathname === ROUTES.forgotPassword) {
    return <ForgotPasswordPage navigate={navigate} />;
  }

  if (pathname === ROUTES.register) {
    return <RegisterPage navigate={navigate} />;
  }

  if (pathname === ROUTES.profile) {
    return <ProfilePage navigate={navigate} />;
  }

  if (pathname === ROUTES.verification) {
    return <VerificationPage navigate={navigate} />;
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

  if (pathname === ROUTES.admin) {
    return <AdminDashboardPage navigate={navigate} pathname={pathname} />;
  }

  if (pathname === ROUTES.adminUsers) {
    return <AdminUsersPage navigate={navigate} pathname={pathname} />;
  }

  if (pathname === ROUTES.adminJobs) {
    return <AdminJobsPage navigate={navigate} pathname={pathname} />;
  }

  if (pathname === ROUTES.adminCategories) {
    return <AdminCategoriesPage navigate={navigate} pathname={pathname} />;
  }

  if (pathname === ROUTES.adminTalent) {
    return <AdminTalentPage navigate={navigate} pathname={pathname} />;
  }

  if (pathname === ROUTES.adminPricing) {
    return <AdminPricingPage navigate={navigate} pathname={pathname} />;
  }

  if (pathname === ROUTES.adminVerification) {
    return <AdminVerificationPage navigate={navigate} pathname={pathname} />;
  }

  if (isTaskDetailRoute(pathname)) {
    return <TaskDetailPage navigate={navigate} pathname={pathname} />;
  }

  return <HomePage navigate={navigate} />;
}

export default App;
