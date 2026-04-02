import HomePage from '../../pages/home/HomePage.jsx';
import LoginPage from '../../pages/login/LoginPage.jsx';
import ForgotPasswordPage from '../../pages/forgot-password/ForgotPasswordPage.jsx';
import TaskDetailPage from '../../pages/task-detail/TaskDetailPage.jsx';
import RegisterPage from '../../pages/register/RegisterPage.jsx';
import ExploreMembersPage from '../../pages/explore-members/ExploreMembersPage.jsx';
import ProfilePage from '../../pages/profile/ProfilePage.jsx';
import VerificationPage from '../../pages/verification/VerificationPage.jsx';
import OrdersPage from '../../pages/orders/OrdersPage.jsx';
import MessagesPage from '../../pages/messages/MessagesPage.jsx';
import NotificationsPage from '../../pages/notifications/NotificationsPage.jsx';
import PostTaskPage from '../../pages/post-task/PostTaskPage.jsx';
import BillingPage from '../../pages/billing/BillingPage.jsx';
import WalletPage from '../../pages/wallet/WalletPage.jsx';
import ReviewsPage from '../../pages/reviews/ReviewsPage.jsx';
import SecurityPage from '../../pages/security/SecurityPage.jsx';
import AdminDashboardPage from '../../pages/admin/AdminDashboardPage.jsx';
import AdminUsersPage from '../../pages/admin/AdminUsersPage.jsx';
import AdminJobsPage from '../../pages/admin/AdminJobsPage.jsx';
import AdminCategoriesPage from '../../pages/admin/AdminCategoriesPage.jsx';
import AdminTalentPage from '../../pages/admin/AdminTalentPage.jsx';
import AdminPricingPage from '../../pages/admin/AdminPricingPage.jsx';
import AdminVerificationPage from '../../pages/admin/AdminVerificationPage.jsx';
import AdminAuditLogsPage from '../../pages/admin/AdminAuditLogsPage.jsx';
import { isTaskDetailRoute, ROUTES } from '../../shared/constants/routes.js';

const routeEntries = [
  { path: ROUTES.login, component: LoginPage },
  { path: ROUTES.forgotPassword, component: ForgotPasswordPage },
  { path: ROUTES.register, component: RegisterPage },
  { path: ROUTES.exploreMembers, component: ExploreMembersPage },
  { path: ROUTES.profile, component: ProfilePage },
  { path: ROUTES.verification, component: VerificationPage },
  { path: ROUTES.orders, component: OrdersPage },
  { path: ROUTES.messages, component: MessagesPage },
  { path: ROUTES.notifications, component: NotificationsPage },
  { path: ROUTES.postTask, component: PostTaskPage },
  { path: ROUTES.billing, component: BillingPage },
  { path: ROUTES.wallet, component: WalletPage },
  { path: ROUTES.reviews, component: ReviewsPage },
  { path: ROUTES.security, component: SecurityPage },
  { path: ROUTES.admin, component: AdminDashboardPage },
  { path: ROUTES.adminUsers, component: AdminUsersPage },
  { path: ROUTES.adminJobs, component: AdminJobsPage },
  { path: ROUTES.adminCategories, component: AdminCategoriesPage },
  { path: ROUTES.adminTalent, component: AdminTalentPage },
  { path: ROUTES.adminPricing, component: AdminPricingPage },
  { path: ROUTES.adminVerification, component: AdminVerificationPage },
  { path: ROUTES.adminAuditLogs, component: AdminAuditLogsPage }
];

const routeMap = new Map(routeEntries.map((entry) => [entry.path, entry.component]));
const authRoutes = new Set([ROUTES.login, ROUTES.register, ROUTES.forgotPassword]);

export function isAuthenticationRoute(pathname = '') {
  return authRoutes.has(pathname);
}

export function resolveAuthenticatedRoute(session) {
  const roles = session?.user?.roles || [];
  const isAdmin = roles.some((role) => String(role).toLowerCase() === 'admin');

  return isAdmin ? ROUTES.admin : ROUTES.profile;
}

export function renderAppRoute(pathname, navigate) {
  const RouteComponent = routeMap.get(pathname);

  if (RouteComponent) {
    return <RouteComponent navigate={navigate} pathname={pathname} />;
  }

  if (isTaskDetailRoute(pathname)) {
    return <TaskDetailPage navigate={navigate} pathname={pathname} />;
  }

  return <HomePage navigate={navigate} />;
}
