import { Search, Sparkles, TrendingUp } from 'lucide-react';
import { ROUTES } from '../../shared/constants/routes.js';
import { useAuthSessionState } from '../../shared/hooks/useAuthSessionState.js';
import { useI18n } from '../../shared/i18n/I18nProvider.jsx';
import { navigateWithScroll } from '../../shared/lib/navigation/navigateWithScroll.js';

export default function HeroSection({
  popularCategories,
  heroHighlights,
  trustIndicators,
  navigate,
  searchQuery,
  onSearchChange,
  activeTalentCategory,
  onCategoryPick,
  isLoading
}) {
  const { t } = useI18n();
  const authSession = useAuthSessionState();
  const isAuthenticated = Boolean(authSession);
  const secondaryAction = isAuthenticated
    ? { label: t('Open profile'), route: ROUTES.profile }
    : { label: t('Member sign in'), route: ROUTES.login };

  return (
    <section className="hero wrap" id="home">
      <div className="heroText fadeUp">
        <p className="eyebrow">{t('Verified digital marketplace')}</p>
        <h1>
          {t('Build faster with')} <span>{t('specialists')}</span> {t('already matched to your goals.')}
        </h1>
        <p>
          {t('Search verified members, compare portfolios and move from brief to delivery with a cleaner workflow.')}
        </p>

        <div className="heroSearchShell cardLift">
          <div className="heroSearchField">
            <Search size={18} />
            <input
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={t('Search by skill, focus or category')}
              aria-label={t('Search members')}
            />
          </div>
          <button
            type="button"
            className="btn primary interactive heroSearchButton"
            onClick={() => {
              const talentsSection = document.getElementById('talents');
              talentsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            {t('Find matches')}
          </button>
        </div>

        <div className="heroCategoryRow">
          {popularCategories.map((category) => (
            <button
              key={category}
              type="button"
              className={activeTalentCategory === category ? 'heroCategoryChip active interactive' : 'heroCategoryChip interactive'}
              onClick={() => onCategoryPick(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="row heroActionRow">
          <a href="#talents" className="btn primary interactive">
            {t('Explore members')}
          </a>
          <a
            href={secondaryAction.route}
            className="btn soft interactive"
            onClick={(event) => navigateWithScroll(event, secondaryAction.route, navigate)}
          >
            {secondaryAction.label}
          </a>
        </div>

        <div className="heroTrustRow">
          {trustIndicators.map((item) => (
            <span key={item} className="heroTrustItem">
              <Sparkles size={15} />
              {t(item)}
            </span>
          ))}
        </div>
      </div>

      <div className="heroArt fadeUp delayOne">
        <div className="heroDashboard cardLift displayFloat">
          <div className="heroDashboardTop">
            <div>
              <span className="heroKicker">{t('Live dashboard preview')}</span>
              <h3>{activeTalentCategory === 'All' ? t('Top marketplace overview') : activeTalentCategory}</h3>
            </div>
            <span className="heroSignal">o {t('Online')}</span>
          </div>

          <div className="heroDashboardGrid">
            {(heroHighlights || []).map((item) => (
              <article key={item.label} className="heroMetricCard">
                <span>{t(item.label)}</span>
                <strong>{isLoading ? '...' : item.value}</strong>
              </article>
            ))}
          </div>

          <div className="heroSpotlight">
            <div>
              <p className="heroSpotlightLabel">{t('Member pipeline')}</p>
              <strong>{t('Matched profiles in minutes')}</strong>
              <span>{t('Shortlist, compare rates and move directly into project scope.')}</span>
            </div>
            <div className="heroSpotlightBadge">
              <TrendingUp size={18} />
              {t('Live activity')}
            </div>
          </div>

          <div className="heroMiniCards">
            <div className="heroMiniCard">
              <span>{t('Categories')}</span>
              <strong>{isLoading ? t('Loading categories...') : `${popularCategories.length || 0} ${t('categories online')}`}</strong>
            </div>
            <div className="heroMiniCard accent">
              <span>{t('Live jobs')}</span>
              <strong>{isLoading ? t('Loading job posts...') : `${heroHighlights[2]?.value || 0} ${t('job posts live')}`}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
