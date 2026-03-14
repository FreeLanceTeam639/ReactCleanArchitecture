export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  profile: '/profile',
  orders: '/orders',
  messages: '/messages',
  notifications: '/notifications',
  postTask: '/post-task',
  wallet: '/wallet',
  reviews: '/reviews',
  security: '/security',
  taskDetail: '/tasks'
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
