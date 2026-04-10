import { Suspense, lazy } from 'react';
import { EXPLORE_MEMBER_ROUTE_ALIASES, isTaskDetailRoute, normalizeAppPathname, ROUTES } from '../../shared/constants/routes.js';

const HomePage = lazy(() => import('../../pages/home/HomePage.jsx'));
const LoginPage = lazy(() => import('../../pages/login/LoginPage.jsx'));
const ForgotPasswordPage = lazy(() => import('../../pages/forgot-password/ForgotPasswordPage.jsx'));
const TaskDetailPage = lazy(() => import('../../pages/task-detail/TaskDetailPage.jsx'));
const RegisterPage = lazy(() => import('../../pages/register/RegisterPage.jsx'));
const ExploreMembersPage = lazy(() => import('../../pages/explore-members/ExploreMembersPage.jsx'));
const ProfilePage = lazy(() => import('../../pages/profile/ProfilePage.jsx'));
const VerificationPage = lazy(() => import('../../pages/verification/VerificationPage.jsx'));
const OrdersPage = lazy(() => import('../../pages/orders/OrdersPage.jsx'));
const MessagesPage = lazy(() => import('../../pages/messages/MessagesPage.jsx'));
const NotificationsPage = lazy(() => import('../../pages/notifications/NotificationsPage.jsx'));
const PostTaskPage = lazy(() => import('../../pages/post-task/PostTaskPage.jsx'));
const BillingPage = lazy(() => import('../../pages/billing/BillingPage.jsx'));
const WalletPage = lazy(() => import('../../pages/wallet/WalletPage.jsx'));
const ReviewsPage = lazy(() => import('../../pages/reviews/ReviewsPage.jsx'));
const SecurityPage = lazy(() => import('../../pages/security/SecurityPage.jsx'));
const AdminDashboardPage = lazy(() => import('../../pages/admin/AdminDashboardPage.jsx'));
const AdminUsersPage = lazy(() => import('../../pages/admin/AdminUsersPage.jsx'));
const AdminJobsPage = lazy(() => import('../../pages/admin/AdminJobsPage.jsx'));
const AdminCategoriesPage = lazy(() => import('../../pages/admin/AdminCategoriesPage.jsx'));
const AdminTalentPage = lazy(() => import('../../pages/admin/AdminTalentPage.jsx'));
const AdminPricingPage = lazy(() => import('../../pages/admin/AdminPricingPage.jsx'));
const AdminVerificationPage = lazy(() => import('../../pages/admin/AdminVerificationPage.jsx'));
const AdminAuditLogsPage = lazy(() => import('../../pages/admin/AdminAuditLogsPage.jsx'));

function RouteFallback() {
  return (
    <div className="appRouteFallback">
      <div className="appRouteFallbackSpinner" />
    </div>
  );
}

function renderLazyRoute(Component, props) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Component {...props} />
    </Suspense>
  );
}

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
EXPLORE_MEMBER_ROUTE_ALIASES.forEach((aliasPath) => {
  routeMap.set(normalizeAppPathname(aliasPath), ExploreMembersPage);
});
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
  const normalizedPathname = normalizeAppPathname(pathname);
  const routeProps = { navigate, pathname: normalizedPathname };
  const RouteComponent = routeMap.get(normalizedPathname);

  if (RouteComponent) {
    return renderLazyRoute(RouteComponent, routeProps);
  }

  if (isTaskDetailRoute(normalizedPathname)) {
    return renderLazyRoute(TaskDetailPage, routeProps);
  }

  return renderLazyRoute(HomePage, { navigate });
}
