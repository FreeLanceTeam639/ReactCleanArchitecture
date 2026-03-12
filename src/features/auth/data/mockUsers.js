export const TEST_LOGIN_CREDENTIALS = {
  email: 'demo@workreap.com',
  password: 'google'
};

export function buildMockAuthenticatedUser(overrides = {}) {
  return {
    id: 'demo-freelancer-01',
    fullName: 'Orkhan Mammadov',
    firstName: 'Orkhan',
    email: TEST_LOGIN_CREDENTIALS.email,
    role: 'freelancer',
    profession: 'Frontend Developer & UI Specialist',
    location: 'Baku, Azerbaijan',
    memberSince: '2024',
    badge: 'Top Rated Talent',
    avatarInitials: 'OM',
    completionRate: 98,
    responseTime: '1 saat',
    rating: 4.9,
    reviewsCount: 37,
    earnings: '$4,280',
    availableBalance: '$1,240',
    activeTasks: 5,
    pendingRequests: 3,
    tasksCompleted: 24,
    unreadMessages: 6,
    savedItems: 12,
    stats: [
      { label: 'This Month Earnings', value: '$1,250' },
      { label: 'Tasks Completed', value: '24' },
      { label: 'Response Rate', value: '98%' }
    ],
    navItems: ['Dashboard', 'My Listings', 'Proposals', 'Reviews', 'Saved', 'Settings'],
    ongoingTasks: [
      { title: 'SaaS Landing Page redesign', status: 'In progress', budget: '$350' },
      { title: 'React dashboard UI polish', status: 'Waiting feedback', budget: '$220' },
      { title: 'Portfolio website fixes', status: 'Ready for review', budget: '$180' }
    ],
    messages: [
      { sender: 'Aysel R.', text: 'Homepage hero section ready, baxib feedback ver.' },
      { sender: 'Murad T.', text: 'API integration ucun endpoint listini gonderdim.' }
    ],
    notifications: [
      'Withdrawal request approved.',
      'Client left a 5-star review on dashboard redesign.',
      'New proposal request added to your account.'
    ],
    ...overrides
  };
}
