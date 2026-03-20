import { fallbackHomeContent } from '../../home/data/fallbackHomeContent.js';
import { createSlug } from '../../../shared/lib/slug/createSlug.js';

const categoryContentByType = {
  AI: {
    title: 'AI-powered content package for your brand',
    summary:
      'Launch polished AI-assisted video and visual assets designed to help your campaign stand out across every digital touchpoint.',
    highlights: [
      'Concept planning tailored to your campaign goal and target audience.',
      'Storyboard-first workflow for faster approvals and fewer revisions.',
      'AI-enhanced visuals, editing, voice direction, and export-ready delivery.',
      'Social-first formatting for web, mobile, ads, and landing page placements.',
      'Consistent brand language, typography, pacing, and messaging structure.',
      'Delivery files prepared for easy reuse inside your internal content workflow.'
    ],
    faqs: [
      {
        question: 'Will you help with the creative direction before production?',
        answer:
          'Yes. We start with a clear creative brief, mood direction, and output plan so the final asset matches your campaign objective.'
      },
      {
        question: 'Can I request different aspect ratios for social platforms?',
        answer:
          'Absolutely. The standard and premium packages include multiple export ratios for social, web, and ad placements.'
      },
      {
        question: 'Do you provide source assets?',
        answer:
          'Source-ready files and reusable prompt notes are included in the higher package tiers.'
      }
    ]
  },
  'Programming & Tech': {
    title: 'Professional website for your business',
    summary:
      'Build a responsive, conversion-friendly product or marketing website with modern React implementation and a polished user experience.',
    highlights: [
      'Custom interface design aligned with your business goals and user journey.',
      'Responsive layouts optimized for desktop, tablet, and mobile devices.',
      'Reusable sections and clean component structure for easier future scaling.',
      'Performance-minded implementation with tidy frontend architecture.',
      'SEO-friendly content sections and clear call-to-action hierarchy.',
      'Delivery support to help you launch, review, and confidently iterate after handoff.'
    ],
    faqs: [
      {
        question: 'How long will it take to complete my website?',
        answer:
          'Most starter packages are delivered within one week, while multi-page or custom interaction-heavy projects need a little more time.'
      },
      {
        question: 'Will my website be mobile-friendly?',
        answer:
          'Yes. Every package is designed responsively and reviewed across common desktop, tablet, and mobile breakpoints.'
      },
      {
        question: 'Can I add more pages later?',
        answer:
          'Yes. The structure is prepared to scale, so new pages or sections can be added without redesigning everything from scratch.'
      }
    ]
  },
  'Digital Marketing': {
    title: 'Growth-focused campaign setup for your brand',
    summary:
      'Get a conversion-minded campaign foundation with clear targeting, ad structure, messaging direction, and measurable optimization steps.',
    highlights: [
      'Offer positioning and campaign structure aligned to your acquisition goals.',
      'Audience segmentation and keyword or creative direction planning.',
      'Reporting-friendly setup designed for easier performance review.',
      'Landing page and message alignment recommendations to improve conversion.',
      'Practical optimization notes for reducing waste and increasing qualified leads.',
      'Actionable handoff documentation so your team can keep scaling after launch.'
    ],
    faqs: [
      {
        question: 'Is this suitable for a brand-new campaign?',
        answer:
          'Yes. The workflow works well for both fresh launches and existing campaigns that need a stronger structure.'
      },
      {
        question: 'Will I receive optimization recommendations?',
        answer:
          'Yes. Every package includes clear next-step recommendations, while larger tiers include deeper performance guidance.'
      },
      {
        question: 'Can this work together with an existing landing page?',
        answer:
          'Absolutely. Existing pages can be reviewed and improved as part of the campaign setup process.'
      }
    ]
  },
  'Graphics & Design': {
    title: 'Premium brand and website design for your business',
    summary:
      'Create a memorable visual system with clean layouts, strong hierarchy, and polished brand assets ready for launch.',
    highlights: [
      'Design direction built around your audience, brand tone, and product goals.',
      'Responsive visual layouts with strong typography, color, and spacing harmony.',
      'High-quality presentation files and collaboration-ready revision workflow.',
      'Component-minded design thinking for a smoother handoff into development.',
      'Visual consistency across hero banners, sections, and supporting assets.',
      'Clear documentation so your team can confidently continue the design system later.'
    ],
    faqs: [
      {
        question: 'Do you include mockups and source files?',
        answer:
          'Yes. Source and presentation files are included in the higher package tiers, while starter work includes the essential deliverables.'
      },
      {
        question: 'Can you follow an existing brand guide?',
        answer:
          'Yes. Existing brand colors, typography, and messaging can all be used as the creative base.'
      },
      {
        question: 'Is this suitable for startups?',
        answer:
          'Definitely. The scope works well for both early-stage brands and established businesses that need a cleaner visual refresh.'
      }
    ]
  }
};

function formatCategoryLabel(category = '') {
  return category.replace(/\s+/g, ' ').trim();
}

function buildPackages(hourlyRate = 50, title = 'Service') {
  const basePrice = Math.max(120, Math.round(hourlyRate * 4));

  return [
    {
      key: 'basic',
      name: 'Basic',
      price: basePrice,
      delivery: '7 Days',
      revisions: '2 Revisions',
      description: `A clean starter version of the ${title.toLowerCase()} with the essential deliverables you need to launch.`
    },
    {
      key: 'standard',
      name: 'Standard',
      price: Math.round(basePrice * 1.65),
      delivery: '10 Days',
      revisions: '4 Revisions',
      description: `An expanded ${title.toLowerCase()} package with deeper polish, more coverage, and a stronger conversion-ready structure.`
    },
    {
      key: 'premium',
      name: 'Premium',
      price: Math.round(basePrice * 2.35),
      delivery: '14 Days',
      revisions: 'Unlimited Revisions',
      description: `A premium delivery path with advanced assets, strategic support, and more room for collaboration before final handoff.`
    }
  ];
}

export const fallbackTaskDetails = fallbackHomeContent.talents.map((talent, index) => {
  const preset = categoryContentByType[talent.category] || categoryContentByType['Programming & Tech'];
  const slug = createSlug(`${talent.name}-${talent.title}`);
  const packages = buildPackages(talent.hourlyRate, preset.title);
  const categoryLabel = formatCategoryLabel(talent.category);
  const views = 4200 + index * 715 + talent.reviews * 19;
  const sales = Math.max(1, Math.round(talent.reviews / 3));
  const userRating = Number(talent.rating || 4.8).toFixed(1);

  return {
    id: slug,
    slug,
    title: preset.title,
    summary: preset.summary,
    category: categoryLabel,
    name: talent.name,
    role: talent.title,
    location: talent.location,
    rating: userRating,
    reviews: talent.reviews,
    views,
    sales,
    hourlyRate: talent.hourlyRate,
    delivery: talent.duration,
    banner: talent.banner,
    avatar: talent.avatar,
    badge: talent.badge,
    tools: talent.tools,
    gallery: [
      talent.banner,
      `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80&sig=${index + 1}`,
      `https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80&sig=${index + 7}`
    ],
    packages,
    included: [
      `${categoryLabel} strategy and planning`,
      `${talent.tools[0] || 'Design'} assets tailored to your business goals`,
      'Responsive experience with conversion-focused structure',
      'Implementation or handoff notes for smoother collaboration',
      'Quality review before final delivery'
    ],
    highlights: preset.highlights,
    overview: [
      `Need a polished ${categoryLabel.toLowerCase()} solution that still feels premium and conversion-ready? This service is designed to help your team move faster without sacrificing quality, clarity, or consistency.`,
      `I combine ${talent.tools.join(', ')} workflows with a structured delivery process to keep communication simple, timelines realistic, and outcomes aligned with your business goals.`,
      'Whether you are launching something new, refreshing an existing offer, or preparing a higher-converting digital presence, the final delivery is organized to be practical, scalable, and easy to continue building on.'
    ],
    faqs: preset.faqs,
    review: {
      score: userRating,
      timeAgo: `${2 + index} years ago`,
      author: `Client of ${talent.name}`,
      text: `${talent.name} delivered a thoughtful, high-quality result and communicated clearly through every milestone. The process felt organized, the final outcome matched the brief, and the overall experience made future collaboration an easy decision.`
    },
    tags: [categoryLabel, ...talent.tools, 'Responsive', 'Business'],
    sellerStats: {
      sales,
      ratingPercent: Math.min(100, 92 + index * 2),
      deliveryDays: talent.duration
    },
    contact: {
      email: 'hello@workreap.co',
      phone: '+62 877 7726 3549'
    }
  };
});

export function getFallbackTaskDetailBySlug(slug = '') {
  return fallbackTaskDetails.find((item) => item.slug === slug) || fallbackTaskDetails[0];
}
