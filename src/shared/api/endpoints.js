export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const withDefault = (envValue, fallback) => envValue || fallback;

export const API_ENDPOINTS = {
  auth: {
    login: withDefault(import.meta.env.VITE_LOGIN_ENDPOINT, '/auth/login'),
    register: withDefault(import.meta.env.VITE_REGISTER_ENDPOINT, '/auth/register'),
    logout: withDefault(import.meta.env.VITE_LOGOUT_ENDPOINT, '/auth/logout'),
    me: withDefault(import.meta.env.VITE_AUTH_ME_ENDPOINT, '/auth/me'),
    refresh: withDefault(import.meta.env.VITE_REFRESH_ENDPOINT, '/auth/refresh')
  },
  home: {
    popularCategories: withDefault(import.meta.env.VITE_HOME_POPULAR_CATEGORIES_ENDPOINT, '/categories/popular'),
    categoryOverview: withDefault(import.meta.env.VITE_HOME_CATEGORY_OVERVIEW_ENDPOINT, '/categories/overview'),
    featuredTestimonials: withDefault(import.meta.env.VITE_HOME_TESTIMONIALS_ENDPOINT, '/testimonials/featured'),
    featuredFreelancerCategories: withDefault(
      import.meta.env.VITE_HOME_FREELANCER_CATEGORIES_ENDPOINT,
      '/freelancers/featured/categories'
    ),
    featuredFreelancers: withDefault(import.meta.env.VITE_HOME_FREELANCERS_ENDPOINT, '/freelancers/featured'),
    featuredFreelancerSave: withDefault(import.meta.env.VITE_HOME_FREELANCER_SAVE_ENDPOINT, '/freelancers/featured/saved'),
    pricingPlans: withDefault(import.meta.env.VITE_HOME_PRICING_ENDPOINT, '/plans'),
    latestBlogs: withDefault(import.meta.env.VITE_HOME_BLOGS_ENDPOINT, '/blogs/latest')
  },
  profile: {
    me: withDefault(import.meta.env.VITE_PROFILE_ME_ENDPOINT, '/profile/me'),
    update: withDefault(import.meta.env.VITE_PROFILE_UPDATE_ENDPOINT, '/profile/me'),
    summary: withDefault(import.meta.env.VITE_PROFILE_SUMMARY_ENDPOINT, '/profile/dashboard-summary'),
    tasks: withDefault(import.meta.env.VITE_PROFILE_TASKS_ENDPOINT, '/profile/tasks'),
    listings: withDefault(import.meta.env.VITE_PROFILE_LISTINGS_ENDPOINT, '/profile/listings'),
    proposals: withDefault(import.meta.env.VITE_PROFILE_PROPOSALS_ENDPOINT, '/profile/proposals'),
    reviews: withDefault(import.meta.env.VITE_PROFILE_REVIEWS_ENDPOINT, '/profile/reviews'),
    saved: withDefault(import.meta.env.VITE_PROFILE_SAVED_ENDPOINT, '/profile/saved'),
    notifications: withDefault(import.meta.env.VITE_PROFILE_NOTIFICATIONS_ENDPOINT, '/profile/notifications'),
    messages: withDefault(import.meta.env.VITE_PROFILE_MESSAGES_ENDPOINT, '/profile/messages')
  },
  workspace: {
    orders: withDefault(import.meta.env.VITE_WORKSPACE_ORDERS_ENDPOINT, '/workspace/orders'),
    messages: withDefault(import.meta.env.VITE_WORKSPACE_MESSAGES_ENDPOINT, '/workspace/messages'),
    notifications: withDefault(import.meta.env.VITE_WORKSPACE_NOTIFICATIONS_ENDPOINT, '/workspace/notifications'),
    postTaskMeta: withDefault(import.meta.env.VITE_WORKSPACE_TASK_META_ENDPOINT, '/workspace/tasks/meta'),
    postTask: withDefault(import.meta.env.VITE_WORKSPACE_TASK_CREATE_ENDPOINT, '/workspace/tasks'),
    walletSummary: withDefault(import.meta.env.VITE_WORKSPACE_WALLET_SUMMARY_ENDPOINT, '/workspace/wallet/summary'),
    transactions: withDefault(import.meta.env.VITE_WORKSPACE_TRANSACTIONS_ENDPOINT, '/workspace/wallet/transactions'),
    withdrawals: withDefault(import.meta.env.VITE_WORKSPACE_WITHDRAWALS_ENDPOINT, '/workspace/wallet/withdrawals'),
    reviews: withDefault(import.meta.env.VITE_WORKSPACE_REVIEWS_ENDPOINT, '/workspace/reviews'),
    security: withDefault(import.meta.env.VITE_WORKSPACE_SECURITY_ENDPOINT, '/workspace/security/settings'),
    sessions: withDefault(import.meta.env.VITE_WORKSPACE_SESSIONS_ENDPOINT, '/workspace/security/sessions')
  },
  taskDetail: {
    detail: withDefault(import.meta.env.VITE_TASK_DETAIL_ENDPOINT, '/tasks')
  },
  admin: {
    dashboardOverview: withDefault(import.meta.env.VITE_ADMIN_DASHBOARD_ENDPOINT, '/admin/dashboard/overview'),
    users: withDefault(import.meta.env.VITE_ADMIN_USERS_ENDPOINT, '/admin/users'),
    jobs: withDefault(import.meta.env.VITE_ADMIN_JOBS_ENDPOINT, '/admin/jobs'),
    categories: withDefault(import.meta.env.VITE_ADMIN_CATEGORIES_ENDPOINT, '/admin/categories'),
    talent: withDefault(import.meta.env.VITE_ADMIN_TALENT_ENDPOINT, '/admin/talent'),
    pricing: withDefault(import.meta.env.VITE_ADMIN_PRICING_ENDPOINT, '/admin/pricing')
  }
};

export const authEndpoints = API_ENDPOINTS.auth;
export const homeEndpoints = API_ENDPOINTS.home;
export const taskDetailEndpoints = API_ENDPOINTS.taskDetail;
export const adminEndpoints = API_ENDPOINTS.admin;

export function buildProfileListingStatusEndpoint(listingId) {
  return `${API_ENDPOINTS.profile.listings}/${listingId}/status`;
}

export function buildProfileProposalStatusEndpoint(proposalId) {
  return `${API_ENDPOINTS.profile.proposals}/${proposalId}/status`;
}

export function buildProfileSavedItemEndpoint(savedItemId) {
  return `${API_ENDPOINTS.profile.saved}/${savedItemId}`;
}

export function buildProfileNotificationReadEndpoint(notificationId) {
  return `${API_ENDPOINTS.profile.notifications}/${notificationId}/read`;
}

export function buildProfileMessageReadEndpoint(messageId) {
  return `${API_ENDPOINTS.profile.messages}/${messageId}/read`;
}

export function buildFeaturedTalentSaveEndpoint(talentId) {
  return `${API_ENDPOINTS.home.featuredFreelancerSave}/${talentId}`;
}

export function buildTaskDetailEndpoint(slug) {
  return `${API_ENDPOINTS.taskDetail.detail}/${slug}`;
}

export function buildWorkspaceConversationEndpoint(conversationId) {
  return `${API_ENDPOINTS.workspace.messages}/${conversationId}`;
}

export function buildWorkspaceConversationReadEndpoint(conversationId) {
  return `${API_ENDPOINTS.workspace.messages}/${conversationId}/read`;
}

export function buildWorkspaceNotificationEndpoint(notificationId) {
  return `${API_ENDPOINTS.workspace.notifications}/${notificationId}/read`;
}

export function buildWorkspaceReviewFeatureEndpoint(reviewId) {
  return `${API_ENDPOINTS.workspace.reviews}/${reviewId}/feature`;
}

export function buildWorkspaceSessionEndpoint(sessionId) {
  return `${API_ENDPOINTS.workspace.sessions}/${sessionId}`;
}

export function buildAdminResourceEndpoint(resourcePath, resourceId) {
  return `${resourcePath}/${resourceId}`;
}

export function buildAdminUserStatusEndpoint(userId) {
  return `${API_ENDPOINTS.admin.users}/${userId}/status`;
}

export function buildAdminJobStatusEndpoint(jobId) {
  return `${API_ENDPOINTS.admin.jobs}/${jobId}/status`;
}

export function buildAdminJobVisibilityEndpoint(jobId) {
  return `${API_ENDPOINTS.admin.jobs}/${jobId}/visibility`;
}

export function buildAdminCategoryStatusEndpoint(categoryId) {
  return `${API_ENDPOINTS.admin.categories}/${categoryId}/status`;
}

export function buildAdminFeaturedEndpoint(talentId) {
  return `${API_ENDPOINTS.admin.talent}/${talentId}/featured`;
}
