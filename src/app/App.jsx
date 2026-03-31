import { useEffect } from 'react';
import HomePage from '../pages/home/HomePage.jsx';
import LoginPage from '../pages/login/LoginPage.jsx';
import ForgotPasswordPage from '../pages/forgot-password/ForgotPasswordPage.jsx';
import TaskDetailPage from '../pages/task-detail/TaskDetailPage.jsx';
import { isTaskDetailRoute, ROUTES } from '../shared/constants/routes.js';
import { useAuthSessionState } from '../shared/hooks/useAuthSessionState.js';
import { usePathname } from '../shared/hooks/usePathname.js';
import { consumePostLoginRedirect } from '../shared/lib/storage/authStorage.js';
import RegisterPage from '../pages/register/RegisterPage.jsx';
import ExploreMembersPage from '../pages/explore-members/ExploreMembersPage.jsx';
import ProfilePage from '../pages/profile/ProfilePage.jsx';
import VerificationPage from '../pages/verification/VerificationPage.jsx';
import OrdersPage from '../pages/orders/OrdersPage.jsx';
import MessagesPage from '../pages/messages/MessagesPage.jsx';
import NotificationsPage from '../pages/notifications/NotificationsPage.jsx';
import PostTaskPage from '../pages/post-task/PostTaskPage.jsx';
import BillingPage from '../pages/billing/BillingPage.jsx';
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
import AdminAuditLogsPage from '../pages/admin/AdminAuditLogsPage.jsx';
import { clearActiveBillingCheckoutState, getBillingCheckoutState } from '../shared/lib/storage/billingCheckoutStorage.js';

function resolveAuthenticatedRoute(session) {
  const roles = session?.user?.roles || [];
  const isAdmin = roles.some((role) => String(role).toLowerCase() === 'admin');

  return isAdmin ? ROUTES.admin : ROUTES.profile;
}

function App() {
  const authSession = useAuthSessionState();
  const [pathname, navigate] = usePathname();
  const isAuthenticationRoute =
    pathname === ROUTES.login || pathname === ROUTES.register || pathname === ROUTES.forgotPassword;

  useEffect(() => {
    if (pathname !== ROUTES.billing) {
      clearActiveBillingCheckoutState();
    }
  }, [pathname]);

  useEffect(() => {
    if (!authSession || !isAuthenticationRoute) {
      return;
    }

    const postLoginRedirect = consumePostLoginRedirect();
    const hasBillingCheckoutState = Boolean(getBillingCheckoutState());

    if (
      postLoginRedirect &&
      postLoginRedirect !== ROUTES.login &&
      (postLoginRedirect !== ROUTES.billing || hasBillingCheckoutState)
    ) {
      navigate(postLoginRedirect, { replace: true });
      return;
    }

    navigate(resolveAuthenticatedRoute(authSession), { replace: true });
  }, [authSession, isAuthenticationRoute, navigate]);

  if (authSession && isAuthenticationRoute) {
    return null;
  }

  if (pathname === ROUTES.login) {
    return <LoginPage navigate={navigate} />;
  }

  if (pathname === ROUTES.forgotPassword) {
    return <ForgotPasswordPage navigate={navigate} />;
  }

  if (pathname === ROUTES.register) {
    return <RegisterPage navigate={navigate} />;
  }

  if (pathname === ROUTES.exploreMembers) {
    return <ExploreMembersPage navigate={navigate} />;
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

  if (pathname === ROUTES.billing) {
    return <BillingPage navigate={navigate} />;
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

  if (pathname === ROUTES.adminAuditLogs) {
    return <AdminAuditLogsPage navigate={navigate} pathname={pathname} />;
  }

  if (isTaskDetailRoute(pathname)) {
    return <TaskDetailPage navigate={navigate} pathname={pathname} />;
  }

  return <HomePage navigate={navigate} />;
}

export default App;
