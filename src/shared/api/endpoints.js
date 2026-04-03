import { getRuntimeConfigValue } from './runtimeConfig.js';

function normalizeApiBaseUrl(value) {
  const trimmedValue = String(value || '').trim();

  if (!trimmedValue) {
    return 'http://localhost:5270/api';
  }

  const withoutTrailingSlash = trimmedValue.replace(/\/+$/, '');

  if (withoutTrailingSlash.toLowerCase().endsWith('/api')) {
    return withoutTrailingSlash;
  }

  return `${withoutTrailingSlash}/api`;
}

export const API_BASE_URL = normalizeApiBaseUrl(getRuntimeConfigValue('API_BASE_URL') || import.meta.env.VITE_API_BASE_URL);

function normalizeEndpointPath(value) {
  const trimmedValue = String(value || '').trim();

  if (!trimmedValue) {
    return '';
  }

  let normalizedValue = trimmedValue;

  if (/^https?:\/\//i.test(normalizedValue)) {
    try {
      const parsedUrl = new URL(normalizedValue);
      normalizedValue = `${parsedUrl.pathname}${parsedUrl.search}`;
    } catch {
      normalizedValue = trimmedValue;
    }
  }

  const queryIndex = normalizedValue.indexOf('?');
  const pathPart = queryIndex >= 0 ? normalizedValue.slice(0, queryIndex) : normalizedValue;
  const queryPart = queryIndex >= 0 ? normalizedValue.slice(queryIndex) : '';

  let normalizedPathPart = pathPart.replace(/\/+$/, '');

  if (!normalizedPathPart.startsWith('/')) {
    normalizedPathPart = `/${normalizedPathPart}`;
  }

  normalizedPathPart = normalizedPathPart.replace(/^\/api(?=\/|$)/i, '');

  if (!normalizedPathPart.startsWith('/')) {
    normalizedPathPart = `/${normalizedPathPart}`;
  }

  return `${normalizedPathPart || '/'}${queryPart}`;
}

const withDefault = (envValue, fallback) => normalizeEndpointPath(envValue || fallback);

export const API_ENDPOINTS = {
  auth: {
    login: withDefault(import.meta.env.VITE_LOGIN_ENDPOINT, '/auth/login'),
    forgotPassword: withDefault(import.meta.env.VITE_FORGOT_PASSWORD_ENDPOINT, '/auth/forgot-password'),
    resetPassword: withDefault(import.meta.env.VITE_RESET_PASSWORD_ENDPOINT, '/auth/reset-password'),
    register: withDefault(import.meta.env.VITE_REGISTER_ENDPOINT, '/auth/register'),
    logout: withDefault(import.meta.env.VITE_LOGOUT_ENDPOINT, '/auth/logout'),
    me: withDefault(import.meta.env.VITE_AUTH_ME_ENDPOINT, '/auth/me'),
    refresh: withDefault(import.meta.env.VITE_REFRESH_ENDPOINT, '/auth/refresh-token')
  },
  home: {
    popularCategories: withDefault(import.meta.env.VITE_HOME_POPULAR_CATEGORIES_ENDPOINT, '/categories/popular'),
    categoryOverview: withDefault(import.meta.env.VITE_HOME_CATEGORY_OVERVIEW_ENDPOINT, '/categories/overview'),
    featuredTestimonials: withDefault(import.meta.env.VITE_HOME_TESTIMONIALS_ENDPOINT, '/testimonials/featured'),
    liveJobs: withDefault(import.meta.env.VITE_HOME_LIVE_JOBS_ENDPOINT, '/jobs/live'),
    featuredFreelancerCategories: withDefault(
      import.meta.env.VITE_HOME_FREELANCER_CATEGORIES_ENDPOINT,
      '/freelancers/featured/categories'
    ),
    featuredFreelancers: withDefault(import.meta.env.VITE_HOME_FREELANCERS_ENDPOINT, '/freelancers/featured'),
    exploreMembers: withDefault(import.meta.env.VITE_HOME_EXPLORE_MEMBERS_ENDPOINT, '/freelancers/explore'),
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
  verification: {
    me: withDefault(import.meta.env.VITE_VERIFICATION_ME_ENDPOINT, '/verification/me'),
    tickets: withDefault(import.meta.env.VITE_VERIFICATION_TICKETS_ENDPOINT, '/verification/tickets')
  },
  workspace: {
    orders: withDefault(import.meta.env.VITE_WORKSPACE_ORDERS_ENDPOINT, '/workspace/orders'),
    messages: withDefault(import.meta.env.VITE_WORKSPACE_MESSAGES_ENDPOINT, '/workspace/messages'),
    notifications: withDefault(import.meta.env.VITE_WORKSPACE_NOTIFICATIONS_ENDPOINT, '/workspace/notifications'),
    postTaskMeta: withDefault(import.meta.env.VITE_WORKSPACE_TASK_META_ENDPOINT, '/workspace/tasks/meta'),
    postTask: withDefault(import.meta.env.VITE_WORKSPACE_TASK_CREATE_ENDPOINT, '/workspace/tasks'),
    subscription: withDefault(import.meta.env.VITE_WORKSPACE_SUBSCRIPTION_ENDPOINT, '/workspace/subscription'),
    subscriptionCheckout: withDefault(import.meta.env.VITE_WORKSPACE_SUBSCRIPTION_CHECKOUT_ENDPOINT, '/workspace/subscription/checkout'),
    walletSummary: withDefault(import.meta.env.VITE_WORKSPACE_WALLET_SUMMARY_ENDPOINT, '/workspace/wallet/summary'),
    transactions: withDefault(import.meta.env.VITE_WORKSPACE_TRANSACTIONS_ENDPOINT, '/workspace/wallet/transactions'),
    topUps: withDefault(import.meta.env.VITE_WORKSPACE_TOPUPS_ENDPOINT, '/workspace/wallet/top-ups'),
    withdrawals: withDefault(import.meta.env.VITE_WORKSPACE_WITHDRAWALS_ENDPOINT, '/workspace/wallet/withdrawals'),
    reviews: withDefault(import.meta.env.VITE_WORKSPACE_REVIEWS_ENDPOINT, '/workspace/reviews'),
    security: withDefault(import.meta.env.VITE_WORKSPACE_SECURITY_ENDPOINT, '/workspace/security/settings'),
    sessions: withDefault(import.meta.env.VITE_WORKSPACE_SESSIONS_ENDPOINT, '/workspace/security/sessions')
  },
  taskDetail: {
    detail: withDefault(import.meta.env.VITE_TASK_DETAIL_ENDPOINT, '/tasks')
  },
  media: {
    uploadImage: withDefault(import.meta.env.VITE_MEDIA_UPLOAD_ENDPOINT, '/media/upload-image')
  },
  admin: {
    dashboardOverview: withDefault(import.meta.env.VITE_ADMIN_DASHBOARD_ENDPOINT, '/admin/dashboard/overview'),
    users: withDefault(import.meta.env.VITE_ADMIN_USERS_ENDPOINT, '/admin/users'),
    jobs: withDefault(import.meta.env.VITE_ADMIN_JOBS_ENDPOINT, '/admin/jobs'),
    categories: withDefault(import.meta.env.VITE_ADMIN_CATEGORIES_ENDPOINT, '/admin/categories'),
    talent: withDefault(import.meta.env.VITE_ADMIN_TALENT_ENDPOINT, '/admin/talent'),
    pricing: withDefault(import.meta.env.VITE_ADMIN_PRICING_ENDPOINT, '/admin/pricing'),
    verificationTickets: withDefault(import.meta.env.VITE_ADMIN_VERIFICATION_TICKETS_ENDPOINT, '/admin/verification-tickets'),
    auditLogs: withDefault(import.meta.env.VITE_ADMIN_AUDIT_LOGS_ENDPOINT, '/admin/audit-logs')
  },
  reference: {
    countries: withDefault(import.meta.env.VITE_REFERENCE_COUNTRIES_ENDPOINT, '/reference/countries')
  }
};

export const authEndpoints = API_ENDPOINTS.auth;
export const homeEndpoints = API_ENDPOINTS.home;
export const taskDetailEndpoints = API_ENDPOINTS.taskDetail;
export const adminEndpoints = API_ENDPOINTS.admin;
export const mediaEndpoints = API_ENDPOINTS.media;
export const verificationEndpoints = API_ENDPOINTS.verification;

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

export function buildTaskConversationEndpoint(slug) {
  return `${API_ENDPOINTS.taskDetail.detail}/${slug}/contact`;
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

export function buildWorkspaceOrderDocumentEndpoint(proposalId) {
  return `${API_ENDPOINTS.workspace.orders}/${proposalId}/document`;
}

export function buildAdminVerificationTicketEndpoint(ticketId) {
  return `${API_ENDPOINTS.admin.verificationTickets}/${ticketId}`;
}

export function buildAdminResourceEndpoint(resourcePath, resourceId) {
  return `${resourcePath}/${resourceId}`;
}

export function buildAdminUserStatusEndpoint(userId) {
  return `${API_ENDPOINTS.admin.users}/${userId}/status`;
}

export function buildAdminUserAvatarEndpoint(userId) {
  return `${API_ENDPOINTS.admin.users}/${userId}/avatar`;
}

export function buildAdminUserPasswordEndpoint(userId) {
  return `${API_ENDPOINTS.admin.users}/${userId}/password`;
}

export function buildAdminJobStatusEndpoint(jobId) {
  return `${API_ENDPOINTS.admin.jobs}/${jobId}/status`;
}

export function buildAdminJobVisibilityEndpoint(jobId) {
  return `${API_ENDPOINTS.admin.jobs}/${jobId}/visibility`;
}

export function buildAdminJobMediaEndpoint(jobId) {
  return `${API_ENDPOINTS.admin.jobs}/${jobId}/media`;
}

export function buildAdminJobMediaItemEndpoint(jobId, mediaId) {
  return `${API_ENDPOINTS.admin.jobs}/${jobId}/media/${mediaId}`;
}

export function buildAdminJobMediaPrimaryEndpoint(jobId, mediaId) {
  return `${API_ENDPOINTS.admin.jobs}/${jobId}/media/${mediaId}/primary`;
}

export function buildAdminJobMediaReorderEndpoint(jobId) {
  return `${API_ENDPOINTS.admin.jobs}/${jobId}/media/reorder`;
}

export function buildAdminCategoryStatusEndpoint(categoryId) {
  return `${API_ENDPOINTS.admin.categories}/${categoryId}/status`;
}

export function buildAdminCategoryIconEndpoint(categoryId) {
  return `${API_ENDPOINTS.admin.categories}/${categoryId}`;
}

export function buildAdminFeaturedEndpoint(talentId) {
  return `${API_ENDPOINTS.admin.talent}/${talentId}/featured`;
}

export function buildAdminTalentStatusEndpoint(talentId) {
  return `${API_ENDPOINTS.admin.talent}/${talentId}/status`;
}

export function buildAdminTalentAvatarEndpoint(talentId) {
  return `${API_ENDPOINTS.admin.talent}/${talentId}/avatar`;
}
