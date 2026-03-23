export const TEST_LOGIN_CREDENTIALS = {
  email: 'demo@freelanceaze.az',
  password: 'google'
};

export function buildDemoSession(rememberMe = false) {
  return {
    accessToken: 'demo-access-token',
    refreshToken: 'demo-refresh-token',
    csrfToken: 'demo-csrf-token',
    expiresAt: null,
    authType: 'demo',
    rememberMe: Boolean(rememberMe)
  };
}

export function buildMockProfile(overrides = {}) {
  return {
    id: 'demo-freelancer-01',
    firstName: 'Orkhan',
    fullName: 'Orkhan Mammadov',
    email: TEST_LOGIN_CREDENTIALS.email,
    profession: 'Frontend Developer & UI Specialist',
    headline: 'React, Vite ve marketplace dashboard UI qurulumu',
    location: 'Baku, Azerbaijan',
    memberSince: '2024',
    badge: 'Top Rated Talent',
    bio: 'Frontend ve UI sahəsində freelance işləyirəm. Marketplace, dashboard və landing page layihələrində fokuslanıram.',
    availability: 'Available now',
    hourlyRate: '$25',
    avatarInitials: 'OM',
    avatarUrl: '',
    completionRate: 98,
    responseTime: '1 saat',
    skills: ['React', 'Vite', 'JavaScript', 'UI Design', 'REST API'],
    ...overrides
  };
}

export function buildMockSummary(overrides = {}) {
  return {
    monthlyEarnings: '$1,250',
    tasksCompleted: 24,
    responseRate: '98%',
    rating: 4.9,
    reviewsCount: 37,
    earnings: '$4,280',
    availableBalance: '$1,240',
    activeTasks: 5,
    pendingRequests: 3,
    savedItems: 12,
    unreadMessages: 2,
    completionRate: '98%',
    responseTime: '1 saat',
    ...overrides
  };
}

export function buildMockTasks() {
  return [
    { id: 'task-1', title: 'SaaS Landing Page redesign', status: 'In progress', budget: '$350' },
    { id: 'task-2', title: 'React dashboard UI polish', status: 'Waiting feedback', budget: '$220' },
    { id: 'task-3', title: 'Portfolio website fixes', status: 'Ready for review', budget: '$180' }
  ];
}

export function buildMockListings() {
  return [
    { id: 'listing-1', title: 'Build responsive React landing page', status: 'active', category: 'Web Development', budget: '$300', updatedAt: '2h ago' },
    { id: 'listing-2', title: 'Dashboard UI/UX cleanup', status: 'paused', category: 'UI Design', budget: '$180', updatedAt: '1 day ago' },
    { id: 'listing-3', title: 'Frontend performance optimization', status: 'active', category: 'Optimization', budget: '$260', updatedAt: '3 days ago' }
  ];
}

export function buildMockProposals() {
  return [
    { id: 'proposal-1', jobTitle: 'Admin panel improvements', status: 'pending', amount: '$400', submittedAt: '2 days ago', clientName: 'Aysel Studio' },
    { id: 'proposal-2', jobTitle: 'Marketing website frontend', status: 'shortlisted', amount: '$520', submittedAt: '5 days ago', clientName: 'Northwind' },
    { id: 'proposal-3', jobTitle: 'Analytics dashboard components', status: 'accepted', amount: '$780', submittedAt: '1 week ago', clientName: 'Databrick' }
  ];
}

export function buildMockReviews() {
  return [
    { id: 'review-1', author: 'Murad T.', rating: 5, comment: 'Təmiz kod və çox sürətli kommunikasiya.', timeAgo: '1 week ago' },
    { id: 'review-2', author: 'Aysel R.', rating: 4.8, comment: 'UI tərəfi çox səliqəli həll olundu.', timeAgo: '2 weeks ago' }
  ];
}

export function buildMockSavedItems() {
  return [
    { id: 'saved-1', title: 'Fintech dashboard revamp', type: 'Project', meta: '$650 • Remote' },
    { id: 'saved-2', title: 'React admin template customization', type: 'Listing', meta: '$280 • Baku' }
  ];
}

export function buildMockNotifications() {
  return [
    { id: 'notification-1', title: 'Update', message: 'Withdrawal request approved.', isRead: false },
    { id: 'notification-2', title: 'Review', message: 'Client left a 5-star review on dashboard redesign.', isRead: false },
    { id: 'notification-3', title: 'Proposal', message: 'New proposal request added to your account.', isRead: true }
  ];
}

export function buildMockMessages() {
  return [
    { id: 'message-1', sender: 'Aysel R.', text: 'Homepage hero section ready, baxib feedback ver.', isRead: false, timeAgo: '1h ago' },
    { id: 'message-2', sender: 'Murad T.', text: 'API integration ucun endpoint listini gonderdim.', isRead: false, timeAgo: '3h ago' },
    { id: 'message-3', sender: 'Kamran S.', text: 'Sabah review call eliyek?', isRead: true, timeAgo: 'Yesterday' }
  ];
}
