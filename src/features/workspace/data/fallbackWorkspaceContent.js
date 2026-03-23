export const fallbackWorkspaceContent = {
  orders: [
    {
      id: 'ord-101',
      title: 'SaaS onboarding redesign',
      client: 'NovaStack',
      freelancer: 'Orkhan Mammadov',
      status: 'active',
      role: 'freelancer',
      stage: 'in-progress',
      budget: '$1,200',
      progress: 68,
      dueDate: '2026-03-22',
      priority: 'high',
      category: 'UI/UX',
      lastUpdate: 'Wireframes approved, hi-fi in progress.'
    },
    {
      id: 'ord-102',
      title: 'Marketplace API integration',
      client: 'Aysel R.',
      freelancer: 'Orkhan Mammadov',
      status: 'review',
      role: 'freelancer',
      stage: 'awaiting-feedback',
      budget: '$820',
      progress: 92,
      dueDate: '2026-03-17',
      priority: 'medium',
      category: 'Frontend',
      lastUpdate: 'Backend contract matched, waiting QA signoff.'
    },
    {
      id: 'ord-103',
      title: 'Landing page copy and visuals',
      client: 'FreelanceAze',
      freelancer: 'Studio Verve',
      status: 'active',
      role: 'client',
      stage: 'draft-delivered',
      budget: '$540',
      progress: 44,
      dueDate: '2026-03-26',
      priority: 'medium',
      category: 'Marketing',
      lastUpdate: 'First concept deck delivered this morning.'
    },
    {
      id: 'ord-104',
      title: 'Admin dashboard animations',
      client: 'Murat T.',
      freelancer: 'Orkhan Mammadov',
      status: 'completed',
      role: 'freelancer',
      stage: 'paid',
      budget: '$960',
      progress: 100,
      dueDate: '2026-03-05',
      priority: 'low',
      category: 'Frontend',
      lastUpdate: 'Client accepted final delivery and review sent.'
    }
  ],
  conversations: [
    {
      id: 'conv-1',
      title: 'NovaStack • SaaS onboarding redesign',
      participant: 'Aysel R.',
      role: 'client',
      unreadCount: 2,
      lastMessage: 'Homepage hero section ready, baxib feedback ver.',
      updatedAt: '5m ago',
      status: 'active'
    },
    {
      id: 'conv-2',
      title: 'Murat T. • API integration',
      participant: 'Murat T.',
      role: 'client',
      unreadCount: 1,
      lastMessage: 'Endpoint listini yoxladim, security de lazimdir.',
      updatedAt: '28m ago',
      status: 'active'
    },
    {
      id: 'conv-3',
      title: 'Studio Verve • Landing page visuals',
      participant: 'Studio Verve',
      role: 'freelancer',
      unreadCount: 0,
      lastMessage: 'Moodboardu gonderdim, baxa bilersiz?',
      updatedAt: '2h ago',
      status: 'archived'
    }
  ],
  messagesByConversation: {
    'conv-1': [
      { id: 'msg-1', sender: 'Aysel R.', direction: 'inbound', text: 'Homepage hero section ready, baxib feedback ver.', sentAt: '09:40', isRead: false },
      { id: 'msg-2', sender: 'You', direction: 'outbound', text: 'Baxdim, CTA hierarchy çox yaxşı alınıb.', sentAt: '09:45', isRead: true },
      { id: 'msg-3', sender: 'Aysel R.', direction: 'inbound', text: 'Animasiya intensity-ni biraz azaldaq?', sentAt: '09:47', isRead: false }
    ],
    'conv-2': [
      { id: 'msg-4', sender: 'Murat T.', direction: 'inbound', text: 'Endpoint listini yoxladim, security de lazimdir.', sentAt: '08:12', isRead: false },
      { id: 'msg-5', sender: 'You', direction: 'outbound', text: 'Oldu, security settings page-ni də route-a əlavə edəcəm.', sentAt: '08:18', isRead: true }
    ],
    'conv-3': [
      { id: 'msg-6', sender: 'Studio Verve', direction: 'inbound', text: 'Moodboardu gonderdim, baxa bilersiz?', sentAt: 'Yesterday', isRead: true },
      { id: 'msg-7', sender: 'You', direction: 'outbound', text: 'Bəli, axşam review göndərəcəm.', sentAt: 'Yesterday', isRead: true }
    ]
  },
  notifications: [
    {
      id: 'not-1',
      type: 'payment',
      title: 'Withdrawal request approved',
      message: 'Your $480 withdrawal will arrive within 1 business day.',
      isRead: false,
      createdAt: '10m ago'
    },
    {
      id: 'not-2',
      type: 'order',
      title: 'Milestone submitted for review',
      message: 'NovaStack job has moved to review stage.',
      isRead: false,
      createdAt: '1h ago'
    },
    {
      id: 'not-3',
      type: 'security',
      title: 'New sign-in detected',
      message: 'Chrome on macOS signed in from Baku, Azerbaijan.',
      isRead: true,
      createdAt: 'Yesterday'
    },
    {
      id: 'not-4',
      type: 'review',
      title: 'New 5-star review added',
      message: 'Murat T. left feedback for Admin dashboard animations.',
      isRead: true,
      createdAt: '2 days ago'
    }
  ],
  walletSummary: {
    availableBalance: '$2,840',
    pendingClearance: '$620',
    thisMonthInflow: '$4,360',
    thisMonthOutflow: '$1,120'
  },
  transactions: [
    {
      id: 'txn-1',
      type: 'income',
      title: 'Admin dashboard animations payout',
      amount: '+$960',
      status: 'completed',
      method: 'Escrow release',
      createdAt: '2026-03-05'
    },
    {
      id: 'txn-2',
      type: 'withdrawal',
      title: 'Bank transfer withdrawal',
      amount: '-$480',
      status: 'processing',
      method: 'Visa •••• 9012',
      createdAt: '2026-03-13'
    },
    {
      id: 'txn-3',
      type: 'income',
      title: 'Marketplace API integration milestone',
      amount: '+$410',
      status: 'pending',
      method: 'Escrow release',
      createdAt: '2026-03-12'
    },
    {
      id: 'txn-4',
      type: 'fee',
      title: 'Platform service fee',
      amount: '-$86',
      status: 'completed',
      method: 'FreelanceAze fee',
      createdAt: '2026-03-10'
    }
  ],
  reviews: [
    {
      id: 'rev-1',
      author: 'Murat T.',
      project: 'Admin dashboard animations',
      role: 'client',
      rating: 5,
      status: 'featured',
      createdAt: '2 days ago',
      comment: 'Çox sürətli və çox səliqəli işlədi. Kod strukturu çox təmiz idi.'
    },
    {
      id: 'rev-2',
      author: 'NovaStack',
      project: 'SaaS onboarding redesign',
      role: 'client',
      rating: 5,
      status: 'visible',
      createdAt: '1 week ago',
      comment: 'UX istiqamətində güclü qərarlar verdi və feedback dövrəsi çox rahat idi.'
    },
    {
      id: 'rev-3',
      author: 'You',
      project: 'Landing page copy and visuals',
      role: 'freelancer',
      rating: 4,
      status: 'visible',
      createdAt: '1 week ago',
      comment: 'Vizual istiqamət güclü idi, amma ikinci iterasiyada deadline bir az uzandı.'
    }
  ],
  security: {
    settings: {
      twoFactorEnabled: true,
      loginAlerts: true,
      sessionLock: false
    },
    sessions: [
      {
        id: 'sess-1',
        device: 'Chrome on macOS',
        location: 'Baku, Azerbaijan',
        lastActive: 'Current session',
        isCurrent: true
      },
      {
        id: 'sess-2',
        device: 'Safari on iPhone',
        location: 'Baku, Azerbaijan',
        lastActive: '3 hours ago',
        isCurrent: false
      }
    ]
  },
  postTaskMeta: {
    categories: ['Frontend Development', 'UI/UX Design', 'Backend Development', 'Branding', 'Marketing'],
    durations: ['3 days', '1 week', '2 weeks', '1 month', 'Flexible'],
    budgetTypes: ['Fixed Price', 'Hourly'],
    suggestedSkills: ['React', 'Node.js', 'Figma', 'Tailwind', 'REST API', 'Animation']
  }
};
