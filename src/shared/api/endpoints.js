// NOTE: bu fetch hissəsi backend endpoint tələb edir
// TODO: real endpoint əlavə olunmalıdır
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const authEndpoints = {
  // NOTE: bu fetch hissəsi backend endpoint tələb edir
  // TODO: API inteqrasiyası tamamlanmalıdır
  login: import.meta.env.VITE_LOGIN_ENDPOINT || '/auth/login'
};

export const homeEndpoints = {
  // NOTE: bu fetch hissəsi backend endpoint tələb edir
  // TODO: API inteqrasiyası tamamlanmalıdır
  popularCategories: '/categories/popular',

  // NOTE: bu fetch hissəsi backend endpoint tələb edir
  // TODO: API inteqrasiyası tamamlanmalıdır
  categoryOverview: '/categories/overview',

  // NOTE: bu fetch hissəsi backend endpoint tələb edir
  // TODO: API inteqrasiyası tamamlanmalıdır
  featuredTestimonials: '/testimonials/featured',

  // NOTE: bu fetch hissəsi backend endpoint tələb edir
  // TODO: API inteqrasiyası tamamlanmalıdır
  featuredFreelancerCategories: '/freelancers/featured/categories',

  // NOTE: bu fetch hissəsi backend endpoint tələb edir
  // TODO: API inteqrasiyası tamamlanmalıdır
  featuredFreelancers: '/freelancers/featured',

  // NOTE: bu fetch hissəsi backend endpoint tələb edir
  // TODO: API inteqrasiyası tamamlanmalıdır
  pricingPlans: '/plans',

  // NOTE: bu fetch hissəsi backend endpoint tələb edir
  // TODO: API inteqrasiyası tamamlanmalıdır
  latestBlogs: '/blogs/latest?limit=3'
};
