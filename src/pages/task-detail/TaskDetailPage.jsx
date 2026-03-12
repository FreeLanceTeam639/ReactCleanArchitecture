import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Clock3,
  Eye,
  Globe,
  Heart,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  Star
} from 'lucide-react';
import { getFallbackTaskDetailBySlug } from '../../features/task-detail/data/fallbackTaskDetails.js';
import { getTaskSlugFromPathname, ROUTES } from '../../shared/constants/routes.js';
import { navigateWithScroll } from '../../shared/lib/navigation/navigateWithScroll.js';
import HomeFooter from '../../widgets/home/HomeFooter.jsx';
import TaskDetailHeader from '../../widgets/task-detail/TaskDetailHeader.jsx';


const transitionUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: 'easeOut' }
};

function renderStars(score) {
  const safeScore = Math.round(Number(score || 0));

  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={`${score}-${index}`}
      size={15}
      className={index < safeScore ? 'detailStar active' : 'detailStar'}
      fill={index < safeScore ? 'currentColor' : 'none'}
    />
  ));
}

export default function TaskDetailPage({ navigate, pathname }) {
  const slug = getTaskSlugFromPathname(pathname);
  const detail = useMemo(() => getFallbackTaskDetailBySlug(slug), [slug]);
  const [selectedPackage, setSelectedPackage] = useState(detail.packages[1]?.key || detail.packages[0]?.key);
  const [openFaq, setOpenFaq] = useState(0);
  const [activeImage, setActiveImage] = useState(detail.gallery[0]);

  const selectedPackageData = detail.packages.find((item) => item.key === selectedPackage) || detail.packages[0];

  return (
    <div className="detailPageShell">
      <TaskDetailHeader navigate={navigate} />

      <main className="wrap detailPage fadeUp">
        <motion.section className="detailTitleCard" {...transitionUp}>
          <div>
            <span className="detailCategoryPill">{detail.category}</span>
            <h1>{detail.title}</h1>
            <div className="detailMetaRow">
              <span className="detailMetaInline detailMetaReview">
                <span className="detailStars">{renderStars(detail.rating)}</span>
                <strong>{detail.rating}/5.0</strong>
                <span>{detail.reviews} reviews</span>
              </span>
              <span className="detailMetaInline">
                <ShoppingBag size={16} />
                {detail.sales} sales
              </span>
              <span className="detailMetaInline">
                <Eye size={16} />
                {detail.views} views
              </span>
              <button type="button" className="detailSaveButton interactive">
                <Heart size={16} />
                Save
              </button>
            </div>
          </div>
        </motion.section>

        <section className="detailGrid">
          <div className="detailMainColumn">
            <motion.div className="detailVisualCard" {...transitionUp} transition={{ duration: 0.5, delay: 0.05 }}>
              <div className="detailMainVisualWrap">
                <img src={activeImage} alt={detail.title} className="detailMainVisual" />
              </div>
              <div className="detailThumbRow">
                {detail.gallery.map((image, index) => (
                  <motion.button
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    key={`${image}-${index}`}
                    className={activeImage === image ? 'detailThumb active' : 'detailThumb'}
                    onClick={() => setActiveImage(image)}
                    aria-label={`Preview ${index + 1}`}
                  >
                    <img src={image} alt={`${detail.title} preview ${index + 1}`} />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.section className="detailContentCard" {...transitionUp} transition={{ duration: 0.5, delay: 0.1 }}>
              <p className="detailLeadText">{detail.summary}</p>
              <div className="detailChecklist">
                {detail.highlights.map((item) => (
                  <div key={item} className="detailChecklistItem">
                    <span className="detailCheckIcon">
                      <Check size={15} />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              {detail.overview.map((paragraph) => (
                <p key={paragraph} className="detailParagraph">
                  {paragraph}
                </p>
              ))}
              <div className="detailTagRow">
                <span className="detailTagLabel">Tags:</span>
                {detail.tags.map((tag) => (
                  <span key={tag} className="detailTagChip">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.section>

            <motion.section className="detailContentCard" {...transitionUp} transition={{ duration: 0.5, delay: 0.16 }}>
              <div className="detailSectionHeading">
                <div>
                  <span className="eyebrow">Frequently asked questions</span>
                  <h2>Everything you may want to know before starting</h2>
                </div>
              </div>

              <div className="detailFaqList">
                {detail.faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <motion.div key={faq.question} className={isOpen ? 'detailFaqItem open' : 'detailFaqItem'} layout>
                      <button
                        type="button"
                        className="detailFaqButton"
                        onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      >
                        <span>{faq.question}</span>
                        <ChevronDown size={18} className={isOpen ? 'detailFaqChevron open' : 'detailFaqChevron'} />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen ? (
                          <motion.div
                            key="content"
                            className="detailFaqContent"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                          >
                            <p>{faq.answer}</p>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            <motion.section className="detailContentCard" {...transitionUp} transition={{ duration: 0.5, delay: 0.22 }}>
              <div className="detailSectionHeading detailReviewHeading">
                <div>
                  <span className="eyebrow">Client reviews</span>
                  <h2>1 client review ({detail.rating} overall rating)</h2>
                </div>
              </div>

              <div className="detailReviewCard">
                <div className="detailReviewAvatarWrap">
                  <img src={detail.avatar} alt={detail.review.author} className="detailReviewAvatar" />
                </div>
                <div className="detailReviewBody">
                  <div className="detailReviewStars">{renderStars(detail.review.score)}</div>
                  <div className="detailReviewMeta">
                    <strong>{detail.review.score}</strong>
                    <span>({detail.review.timeAgo})</span>
                  </div>
                  <h3>Highly recommend</h3>
                  <p>{detail.review.text}</p>
                </div>
              </div>
            </motion.section>
          </div>

          <motion.aside className="detailSidebarColumn" {...transitionUp} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="detailStickyStack">
              <div className="detailPackageCard">
                <div className="detailPackageTabs">
                  {detail.packages.map((item) => (
                    <button
                      type="button"
                      key={item.key}
                      className={selectedPackage === item.key ? 'detailPackageTab active' : 'detailPackageTab'}
                      onClick={() => setSelectedPackage(item.key)}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedPackageData.key}
                    className="detailPackageBody"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <div className="detailPackageMetaTop">
                      <div className="detailPackageMiniAvatar">
                        <img src={detail.avatar} alt={detail.name} />
                      </div>
                      <div>
                        <span className="detailPackageLabel">{selectedPackageData.name}</span>
                        <h3>${selectedPackageData.price}</h3>
                      </div>
                    </div>

                    <p className="detailPackageDescription">{selectedPackageData.description}</p>

                    <div className="detailInfoPill">
                      <Clock3 size={16} />
                      <strong>Delivery time</strong>
                      <span>{selectedPackageData.delivery}</span>
                    </div>

                    <div className="detailInfoPill muted">
                      <BadgeCheck size={16} />
                      <strong>{selectedPackageData.revisions}</strong>
                    </div>

                    <div className="detailFeatureBlock">
                      <h4>Features included</h4>
                      {detail.included.map((feature) => (
                        <div key={`${selectedPackageData.key}-${feature}`} className="detailIncludedRow">
                          <Check size={15} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="btn primary full detailHireButton"
                  onClick={() => navigate(ROUTES.login)}
                >
                  Hire me for a task
                  <ArrowRight size={16} />
                </motion.button>
                <button type="button" className="btn soft full detailCompareButton">
                  Compare packages
                </button>

                <div className="detailSellerStats">
                  <div>
                    <strong>{detail.sellerStats.sales}</strong>
                    <span>No. of sales</span>
                  </div>
                  <div>
                    <strong>{detail.sellerStats.ratingPercent}%</strong>
                    <span>User rating</span>
                  </div>
                  <div>
                    <strong>{detail.sellerStats.deliveryDays}</strong>
                    <span>Delivery</span>
                  </div>
                </div>
              </div>

              <div className="detailSellerCard">
                <img src={detail.avatar} alt={detail.name} className="detailSellerPortrait" />
                <div className="detailSellerBody">
                  <div className="detailSellerTop">
                    <div>
                      <span className="detailSellerName">
                        {detail.name} <BadgeCheck size={15} />
                      </span>
                      <h3>{detail.role}</h3>
                    </div>
                    <div className="detailSellerRating">
                      <Star size={14} fill="currentColor" />
                      <span>
                        {detail.rating} ({detail.reviews} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="detailSellerLines">
                    <div>
                      <span>
                        <Clock3 size={16} />
                        Hourly rate
                      </span>
                      <strong>${detail.hourlyRate}/hr</strong>
                    </div>
                    <div>
                      <span>
                        <MapPin size={16} />
                        Location
                      </span>
                      <strong>{detail.location}</strong>
                    </div>
                    <div>
                      <span>
                        <Mail size={16} />
                        Email
                      </span>
                      <strong>{detail.contact.email}</strong>
                    </div>
                    <div>
                      <span>
                        <Phone size={16} />
                        Phone
                      </span>
                      <strong>{detail.contact.phone}</strong>
                    </div>
                    <div>
                      <span>
                        <Globe size={16} />
                        Delivery
                      </span>
                      <strong>{detail.delivery}</strong>
                    </div>
                  </div>

                  <div className="detailSkillRow">
                    {detail.tools.map((tool) => (
                      <span key={tool}>{tool}</span>
                    ))}
                    <span>{detail.category}</span>
                  </div>

                  <a
                    href={ROUTES.home}
                    className="btn primary full"
                    onClick={(event) => navigateWithScroll(event, ROUTES.home, navigate)}
                  >
                    View more profiles
                  </a>
                </div>
              </div>
            </div>
          </motion.aside>
        </section>
      </main>

      <HomeFooter />
    </div>
  );
}
