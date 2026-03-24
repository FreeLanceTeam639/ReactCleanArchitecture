export const fallbackAdminContent = {
  users: [
    {
      id: 'usr_101',
      fullName: 'Sarah Khan',
      email: 'sarah@example.com',
      username: 'sarahkhan',
      role: 'member',
      status: 'active',
      isVerified: true,
      verificationStatus: 'verified',
      phone: '+994501234567',
      country: 'Azerbaijan',
      bio: 'Senior UI/UX specialist focused on SaaS and marketplace interfaces.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      registeredAt: '2026-03-15T08:30:00Z'
    },
    {
      id: 'usr_102',
      fullName: 'John Carter',
      email: 'john@example.com',
      username: 'johncarter',
      role: 'member',
      status: 'active',
      isVerified: false,
      verificationStatus: 'pending',
      phone: '+15552224411',
      country: 'United States',
      bio: 'Founder hiring product and growth freelancers for multiple brands.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      registeredAt: '2026-03-14T11:14:00Z'
    },
    {
      id: 'usr_103',
      fullName: 'Aysel Rahimova',
      email: 'aysel@example.com',
      username: 'ayselr',
      role: 'member',
      status: 'blocked',
      isVerified: false,
      verificationStatus: 'rejected',
      phone: '+994553456789',
      country: 'Azerbaijan',
      bio: 'Brand and identity designer with packaging and launch campaign experience.',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
      registeredAt: '2026-03-12T09:46:00Z'
    },
    {
      id: 'usr_104',
      fullName: 'Michael Lee',
      email: 'michael@example.com',
      username: 'mlee',
      role: 'member',
      status: 'active',
      isVerified: true,
      verificationStatus: 'verified',
      phone: '+447700900111',
      country: 'United Kingdom',
      bio: 'Product manager posting frontend and dashboard improvement tasks.',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      registeredAt: '2026-03-11T15:22:00Z'
    },
    {
      id: 'usr_105',
      fullName: 'Leyla Abbasova',
      email: 'leyla@example.com',
      username: 'leylaa',
      role: 'member',
      status: 'active',
      isVerified: false,
      verificationStatus: 'unverified',
      phone: '+994707654321',
      country: 'Azerbaijan',
      bio: 'Creative designer for social assets, product launch kits and web visuals.',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      registeredAt: '2026-03-10T13:08:00Z'
    },
    {
      id: 'usr_106',
      fullName: 'Emma Wilson',
      email: 'emma@example.com',
      username: 'emmawilson',
      role: 'admin',
      status: 'active',
      isVerified: true,
      verificationStatus: 'verified',
      phone: '+353871112233',
      country: 'Ireland',
      bio: 'Growth client focused on copy, funnels and acquisition assets.',
      avatarUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80',
      registeredAt: '2026-03-09T10:42:00Z'
    }
  ],
  verificationTickets: [
    {
      id: 'ver_101',
      userId: 'usr_102',
      fullName: 'John Carter',
      email: 'john@example.com',
      subject: 'Need posting access for product hiring',
      message: 'I will use this account to publish product and growth related jobs for my team.',
      portfolioUrl: 'https://northwind.example/jobs',
      status: 'pending',
      createdAt: '2026-03-18T09:15:00Z',
      reviewedAt: '',
      adminNote: ''
    },
    {
      id: 'ver_102',
      userId: 'usr_103',
      fullName: 'Aysel Rahimova',
      email: 'aysel@example.com',
      subject: 'Re-apply for account verification',
      message: 'Updated my account details and want to request approval again.',
      portfolioUrl: 'https://aysel.example/portfolio',
      status: 'rejected',
      createdAt: '2026-03-12T11:40:00Z',
      reviewedAt: '2026-03-13T08:05:00Z',
      adminNote: 'Please add clearer identity and business details before reapplying.'
    }
  ],
  categories: [
    {
      id: 'cat_101',
      name: 'Programming & Tech',
      slug: 'programming-tech',
      status: 'active',
      iconUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=220&q=80'
    },
    {
      id: 'cat_102',
      name: 'Graphics & Design',
      slug: 'graphics-design',
      status: 'active',
      iconUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=220&q=80'
    },
    {
      id: 'cat_103',
      name: 'Digital Marketing',
      slug: 'digital-marketing',
      status: 'active',
      iconUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=220&q=80'
    },
    {
      id: 'cat_104',
      name: 'Smart AI Services',
      slug: 'smart-ai-services',
      status: 'active',
      iconUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=220&q=80'
    },
    {
      id: 'cat_105',
      name: 'Content Writing',
      slug: 'content-writing',
      status: 'inactive',
      iconUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=220&q=80'
    },
    {
      id: 'cat_106',
      name: 'Video Editing',
      slug: 'video-editing',
      status: 'active',
      iconUrl: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=220&q=80'
    }
  ],
  jobs: [
    {
      id: 'job_201',
      title: 'Build a React landing page',
      categoryId: 'cat_101',
      categoryName: 'Programming & Tech',
      budget: 500,
      ownerId: 'usr_102',
      ownerName: 'John Carter',
      status: 'active',
      visibility: 'visible',
      description: 'Need a responsive landing page with clean sections, smooth animations and reusable UI blocks.',
      coverImageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      media: [
        {
          id: 'med_201_1',
          url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
          type: 'image',
          isPrimary: true,
          sortOrder: 1
        },
        {
          id: 'med_201_2',
          url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
          type: 'image',
          isPrimary: false,
          sortOrder: 2
        }
      ],
      tags: ['React', 'Landing Page', 'Frontend'],
      createdAt: '2026-03-15T10:00:00Z'
    },
    {
      id: 'job_202',
      title: 'Design a premium product deck',
      categoryId: 'cat_102',
      categoryName: 'Graphics & Design',
      budget: 320,
      ownerId: 'usr_104',
      ownerName: 'Michael Lee',
      status: 'pending',
      visibility: 'visible',
      description: 'Need a 12-slide investor-facing pitch deck with premium product visuals.',
      coverImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      media: [
        {
          id: 'med_202_1',
          url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
          type: 'image',
          isPrimary: true,
          sortOrder: 1
        }
      ],
      tags: ['Pitch Deck', 'Presentation'],
      createdAt: '2026-03-14T09:18:00Z'
    },
    {
      id: 'job_203',
      title: 'SEO landing copy refresh',
      categoryId: 'cat_103',
      categoryName: 'Digital Marketing',
      budget: 150,
      ownerId: 'usr_106',
      ownerName: 'Emma Wilson',
      status: 'active',
      visibility: 'hidden',
      description: 'Refresh existing landing copy for clarity, conversion and search intent.',
      coverImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      media: [],
      tags: ['SEO', 'Copywriting'],
      createdAt: '2026-03-13T17:42:00Z'
    },
    {
      id: 'job_204',
      title: 'AI customer support flow',
      categoryId: 'cat_104',
      categoryName: 'Smart AI Services',
      budget: 760,
      ownerId: 'usr_102',
      ownerName: 'John Carter',
      status: 'active',
      visibility: 'visible',
      description: 'Need a chatbot support flow with escalation states, prompts and FAQ coverage.',
      coverImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
      media: [
        {
          id: 'med_204_1',
          url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
          type: 'image',
          isPrimary: true,
          sortOrder: 1
        },
        {
          id: 'med_204_2',
          url: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=800&q=80',
          type: 'image',
          isPrimary: false,
          sortOrder: 2
        }
      ],
      tags: ['AI', 'Support Flow'],
      createdAt: '2026-03-12T13:26:00Z'
    }
  ],
  talent: [
    {
      id: 'tal_301',
      name: 'Sarah Khan',
      title: 'Senior UI/UX Designer',
      skill: 'Figma',
      categoryId: 'cat_102',
      categoryName: 'Graphics & Design',
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      status: 'active',
      featured: true,
      bio: 'Product-focused designer for marketplace and dashboard experiences.'
    },
    {
      id: 'tal_302',
      name: 'Kamran Hasanov',
      title: 'Full Stack Developer',
      skill: 'React / Node.js',
      categoryId: 'cat_101',
      categoryName: 'Programming & Tech',
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      status: 'active',
      featured: true,
      bio: 'Builds scalable SaaS dashboards and marketplace flows.'
    },
    {
      id: 'tal_303',
      name: 'Nadia Aksoy',
      title: 'AI Automation Consultant',
      skill: 'Automation',
      categoryId: 'cat_104',
      categoryName: 'Smart AI Services',
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      status: 'active',
      featured: false,
      bio: 'Maps operational workflows into support and marketing automations.'
    },
    {
      id: 'tal_304',
      name: 'Fatima Rahimli',
      title: 'Growth Strategist',
      skill: 'Paid Media',
      categoryId: 'cat_103',
      categoryName: 'Digital Marketing',
      rating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=300&q=80',
      status: 'inactive',
      featured: false,
      bio: 'Focuses on acquisition channels, campaign structure and reporting.'
    }
  ],
  pricing: [
    {
      id: 'pkg_401',
      name: 'Starter',
      price: 29,
      features: ['10 job posts', 'Basic support', 'Featured visibility'],
      status: 'active',
      badge: 'New'
    },
    {
      id: 'pkg_402',
      name: 'Growth',
      price: 79,
      features: ['Unlimited job posts', 'Priority support', 'Talent shortlist'],
      status: 'active',
      badge: 'Popular'
    },
    {
      id: 'pkg_403',
      name: 'Enterprise',
      price: 149,
      features: ['Team access', 'Custom onboarding', 'Account manager'],
      status: 'inactive',
      badge: 'Recommended'
    }
  ]
};
