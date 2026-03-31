export const ROUTES = {
  home: '/',
  login: '/login',
  forgotPassword: '/forgot-password',
  register: '/register',
  exploreMembers: '/talents',
  profile: '/profile',
  verification: '/verification',
  orders: '/orders',
  messages: '/messages',
  notifications: '/notifications',
  postTask: '/post-task',
  billing: '/billing',
  wallet: '/wallet',
  reviews: '/reviews',
  security: '/security',
  taskDetail: '/tasks',
  admin: '/admin',
  adminUsers: '/admin/users',
  adminJobs: '/admin/jobs',
  adminCategories: '/admin/categories',
  adminTalent: '/admin/talent',
  adminPricing: '/admin/pricing',
  adminVerification: '/admin/verification',
  adminAuditLogs: '/admin/audit-logs'
};

export function buildTaskDetailRoute(slug = '') {
  return `${ROUTES.taskDetail}/${slug}`;
}

export function isTaskDetailRoute(pathname = '') {
  return pathname.startsWith(`${ROUTES.taskDetail}/`);
}

export function getTaskSlugFromPathname(pathname = '') {
  if (!isTaskDetailRoute(pathname)) {
    return '';
  }

  return pathname.replace(`${ROUTES.taskDetail}/`, '').split('/')[0];
}

export function isAdminRoute(pathname = '') {
  return pathname === ROUTES.admin || pathname.startsWith(`${ROUTES.admin}/`);
}
