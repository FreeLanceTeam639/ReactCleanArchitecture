export const fallbackAdminContent = {
  users: [
    { id: 'usr_101', fullName: 'Sarah Khan', email: 'sarah@example.com', role: 'freelancer', status: 'active', registeredAt: '2026-03-15T08:30:00Z' },
    { id: 'usr_102', fullName: 'John Carter', email: 'john@example.com', role: 'client', status: 'active', registeredAt: '2026-03-14T11:15:00Z' },
    { id: 'usr_103', fullName: 'Aylin Mammadova', email: 'aylin@example.com', role: 'freelancer', status: 'blocked', registeredAt: '2026-03-13T09:42:00Z' },
    { id: 'usr_104', fullName: 'Michael Lee', email: 'michael@example.com', role: 'client', status: 'active', registeredAt: '2026-03-12T15:20:00Z' },
    { id: 'usr_105', fullName: 'Nigar Aliyeva', email: 'nigar@example.com', role: 'freelancer', status: 'active', registeredAt: '2026-03-11T13:05:00Z' },
    { id: 'usr_106', fullName: 'Emma Wilson', email: 'emma@example.com', role: 'client', status: 'active', registeredAt: '2026-03-10T18:12:00Z' },
    { id: 'usr_107', fullName: 'Kamran Hasanov', email: 'kamran@example.com', role: 'freelancer', status: 'active', registeredAt: '2026-03-09T10:45:00Z' },
    { id: 'usr_108', fullName: 'Olivia Brown', email: 'olivia@example.com', role: 'client', status: 'blocked', registeredAt: '2026-03-08T16:55:00Z' },
    { id: 'usr_109', fullName: 'David Miller', email: 'david@example.com', role: 'freelancer', status: 'active', registeredAt: '2026-03-07T07:32:00Z' },
    { id: 'usr_110', fullName: 'Leyla Abbasova', email: 'leyla@example.com', role: 'freelancer', status: 'active', registeredAt: '2026-03-06T14:40:00Z' },
    { id: 'usr_111', fullName: 'Noah Smith', email: 'noah@example.com', role: 'client', status: 'active', registeredAt: '2026-03-05T12:10:00Z' },
    { id: 'usr_112', fullName: 'Fatima Rahimli', email: 'fatima@example.com', role: 'freelancer', status: 'active', registeredAt: '2026-03-04T19:18:00Z' }
  ],
  categories: [
    { id: 'cat_101', name: 'Web Development', slug: 'web-development', status: 'active' },
    { id: 'cat_102', name: 'UI/UX Design', slug: 'ui-ux-design', status: 'active' },
    { id: 'cat_103', name: 'Mobile Apps', slug: 'mobile-apps', status: 'active' },
    { id: 'cat_104', name: 'Branding', slug: 'branding', status: 'inactive' },
    { id: 'cat_105', name: 'Content Writing', slug: 'content-writing', status: 'active' },
    { id: 'cat_106', name: 'Video Editing', slug: 'video-editing', status: 'active' }
  ],
  jobs: [
    { id: 'job_201', title: 'Build a React landing page', categoryId: 'cat_101', categoryName: 'Web Development', budget: 500, ownerId: 'usr_102', ownerName: 'John Carter', status: 'active', visibility: 'visible', description: 'Need a responsive, high-converting landing page for a new SaaS product.', createdAt: '2026-03-15T10:00:00Z' },
    { id: 'job_202', title: 'Redesign dashboard experience', categoryId: 'cat_102', categoryName: 'UI/UX Design', budget: 760, ownerId: 'usr_104', ownerName: 'Michael Lee', status: 'pending', visibility: 'visible', description: 'Improve dashboard usability and create polished admin flows.', createdAt: '2026-03-14T13:20:00Z' },
    { id: 'job_203', title: 'Flutter MVP polish', categoryId: 'cat_103', categoryName: 'Mobile Apps', budget: 1200, ownerId: 'usr_106', ownerName: 'Emma Wilson', status: 'active', visibility: 'hidden', description: 'Final polish and QA fixes for an existing Flutter MVP.', createdAt: '2026-03-13T09:00:00Z' },
    { id: 'job_204', title: 'Brand kit for freelance startup', categoryId: 'cat_104', categoryName: 'Branding', budget: 340, ownerId: 'usr_108', ownerName: 'Olivia Brown', status: 'closed', visibility: 'visible', description: 'Create logo, color system, and simple brand application guide.', createdAt: '2026-03-12T17:40:00Z' },
    { id: 'job_205', title: 'SEO articles for marketplace blog', categoryId: 'cat_105', categoryName: 'Content Writing', budget: 220, ownerId: 'usr_111', ownerName: 'Noah Smith', status: 'active', visibility: 'visible', description: 'Write three SEO-friendly blog posts focused on freelancing trends.', createdAt: '2026-03-11T08:15:00Z' },
    { id: 'job_206', title: 'Promo reel editing', categoryId: 'cat_106', categoryName: 'Video Editing', budget: 430, ownerId: 'usr_102', ownerName: 'John Carter', status: 'pending', visibility: 'visible', description: 'Create a 30-second social promo reel from supplied clips.', createdAt: '2026-03-10T11:58:00Z' },
    { id: 'job_207', title: 'Convert Figma to HTML/CSS', categoryId: 'cat_101', categoryName: 'Web Development', budget: 280, ownerId: 'usr_104', ownerName: 'Michael Lee', status: 'active', visibility: 'visible', description: 'Pixel-clean implementation from provided design files.', createdAt: '2026-03-09T15:12:00Z' },
    { id: 'job_208', title: 'Improve onboarding microcopy', categoryId: 'cat_105', categoryName: 'Content Writing', budget: 180, ownerId: 'usr_106', ownerName: 'Emma Wilson', status: 'closed', visibility: 'hidden', description: 'Rewrite onboarding steps and success messages for clarity.', createdAt: '2026-03-08T12:22:00Z' }
  ],
  talent: [
    { id: 'tal_301', name: 'Sarah Khan', title: 'Senior UI/UX Designer', skill: 'Figma', rating: 4.9, imageUrl: '/images/talent-1.png', status: 'active', featured: true },
    { id: 'tal_302', name: 'Kamran Hasanov', title: 'Full Stack Developer', skill: 'React / Node.js', rating: 4.8, imageUrl: '/images/talent-2.png', status: 'active', featured: true },
    { id: 'tal_303', name: 'Leyla Abbasova', title: 'Brand Designer', skill: 'Brand Identity', rating: 4.7, imageUrl: '/images/talent-3.png', status: 'active', featured: false },
    { id: 'tal_304', name: 'David Miller', title: 'Mobile App Engineer', skill: 'Flutter', rating: 4.8, imageUrl: '/images/talent-4.png', status: 'inactive', featured: false },
    { id: 'tal_305', name: 'Fatima Rahimli', title: 'Content Strategist', skill: 'SEO Writing', rating: 4.6, imageUrl: '/images/talent-5.png', status: 'active', featured: false }
  ],
  pricing: [
    { id: 'pkg_401', name: 'Starter', price: 29, features: ['10 job posts', 'Basic support', 'Featured visibility'], status: 'active' },
    { id: 'pkg_402', name: 'Growth', price: 79, features: ['Unlimited job posts', 'Priority support', 'Talent shortlist'], status: 'active' },
    { id: 'pkg_403', name: 'Enterprise', price: 149, features: ['Team access', 'Custom onboarding', 'Account manager'], status: 'inactive' }
  ]
};
