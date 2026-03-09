export const fallbackHomeContent = {
  popular: ['Digital Marketing', 'Graphics & Design', 'Programming & Tech'],
  services: [
    { title: 'Digital Marketing', emoji: '📣', items: ['Ads Strategy', 'SEO', 'Growth', 'Social Media'] },
    { title: 'Smart AI Services', emoji: '🤖', items: ['AI Models', 'Chatbots', 'Vision', 'Automation'] },
    { title: 'Graphics & Design', emoji: '🎨', items: ['Logo', 'Brand', 'Web Design', 'UI Kits'] },
    { title: 'Writing & Translation', emoji: '✍️', items: ['Blog', 'Copy', 'Scripts', 'Docs'] },
    { title: 'Programming & Tech', emoji: '💻', items: ['Web Apps', 'Cloud', 'Data', 'Security'] },
    { title: 'Music & Audio', emoji: '🎵', items: ['Voice Over', 'Editing', 'Mixing', 'Sound Design'] }
  ],
  testimonials: [
    {
      name: 'Samantha Reed',
      role: 'Growth Lead at Youtube',
      quote: 'I am truly impressed by the outstanding service I experienced. The team ensured seamless execution by tailoring every detail to perfection.',
      quote2: 'Their work exceeded all expectations in terms of quality, attention and speed.'
    }
  ],
  tabs: ['AI', 'Programming & Tech', 'Smart AI Services', 'Digital Marketing', 'Graphics & Design'],
  talents: [
    { name: 'Michael Troy', title: 'Embedded systems developer', location: 'United States', rating: 4.9, reviews: 34, price: 70, icon: '👨‍💻', label: 'Team standup' },
    { name: 'Sophia Lee', title: 'Full-stack web specialist', location: 'Singapore', rating: 4.8, reviews: 28, price: 65, icon: '🧠', label: 'Product strategy' },
    { name: 'Anna Muller', title: 'AI video creator', location: 'Germany', rating: 4.9, reviews: 51, price: 85, icon: '🎬', label: 'Studio setup' },
    { name: 'Lisa Johnson', title: 'Google Ads specialist', location: 'United Kingdom', rating: 4.7, reviews: 21, price: 79, icon: '📈', label: 'Campaign analytics' },
    { name: 'Jane Nguyen', title: 'Logo designer', location: 'Vietnam', rating: 5.0, reviews: 60, price: 55, icon: '✨', label: 'Brand identity' },
    { name: 'Ana Anderson', title: 'Content writer', location: 'Spain', rating: 4.8, reviews: 44, price: 49, icon: '📝', label: 'Content planning' }
  ],
  plans: [
    { name: 'Starter Plan', monthly: 11, yearly: 99, text: 'Budget-friendly access for first-time users.', features: ['5 project posts', '30 proposal views', 'Basic profile tools', 'Standard support'] },
    { name: 'Economy Plan', monthly: 55, yearly: 540, text: 'The best fit for growing teams and premium reach.', features: ['15 project posts', 'Featured listing slots', 'Priority support', 'Verified badge'] },
    { name: 'Extended Plan', monthly: 100, yearly: 999, text: 'Advanced tools for high-volume hiring.', features: ['Unlimited project posts', '1 year visibility', 'Advanced analytics', 'Success rep'] }
  ],
  blogs: [
    { category: 'Creative', date: 'Mar 18, 2025', title: 'Will remote work drive the next wave of creative talent?', summary: 'A fresh look at how digital-first teams discover better specialists faster.', icon: '🧑‍🎨' },
    { category: 'Inspiration', date: 'Apr 09, 2025', title: 'How to send project briefs that experts actually love', summary: 'Five practical rules to help clients get cleaner proposals and faster delivery.', icon: '🧾' },
    { category: 'Growth', date: 'Jun 04, 2025', title: 'Why flexible hiring unlocks better momentum for modern teams', summary: 'Short-term specialists can accelerate launches without compromising quality.', icon: '🚀' }
  ]
};

export const defaultTalentCategory = fallbackHomeContent.tabs[0];
