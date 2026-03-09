import { useState } from 'react';
import { useHomePageData } from '../../features/home/hooks/useHomePageData.js';
import NoticeBanner from '../../shared/ui/NoticeBanner.jsx';
import BlogSection from '../../widgets/home/BlogSection.jsx';
import CtaSection from '../../widgets/home/CtaSection.jsx';
import HomeFooter from '../../widgets/home/HomeFooter.jsx';
import HomeHeader from '../../widgets/home/HomeHeader.jsx';
import HeroSection from '../../widgets/home/HeroSection.jsx';
import PricingSection from '../../widgets/home/PricingSection.jsx';
import ServicesSection from '../../widgets/home/ServicesSection.jsx';
import TalentSection from '../../widgets/home/TalentSection.jsx';
import TestimonialSection from '../../widgets/home/TestimonialSection.jsx';

export default function HomePage({ navigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const {
    homeData,
    notice,
    activeTalentCategory,
    setActiveTalentCategory
  } = useHomePageData();

  return (
    <div>
      <HomeHeader
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen((currentState) => !currentState)}
        navigate={navigate}
      />
      <HeroSection popularCategories={homeData.popular} />
      <NoticeBanner message={notice} />
      <ServicesSection services={homeData.services} />
      <TestimonialSection testimonial={homeData.testimonials[0]} />
      <TalentSection
        tabs={homeData.tabs}
        activeTab={activeTalentCategory}
        onTabChange={setActiveTalentCategory}
        talents={homeData.talents}
      />
      <PricingSection
        billingPeriod={billingPeriod}
        onBillingChange={setBillingPeriod}
        plans={homeData.plans}
      />
      <BlogSection blogs={homeData.blogs} />
      <CtaSection navigate={navigate} />
      <HomeFooter />
    </div>
  );
}
