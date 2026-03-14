import { Search, Sparkles, TrendingUp } from 'lucide-react';
import { ROUTES } from '../../shared/constants/routes.js';
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
  return (
    <section className="hero wrap" id="home">
      <div className="heroText fadeUp">
        <p className="eyebrow">Premium freelance marketplace</p>
        <h1>
          Build faster with <span>specialists</span> already matched to your goals.
        </h1>
        <p>
          Search verified freelancers, compare portfolios and move from brief to delivery with a cleaner workflow.
        </p>

        <div className="heroSearchShell cardLift">
          <div className="heroSearchField">
            <Search size={18} />
            <input
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by skill, role or category"
              aria-label="Search talent"
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
            Find matches
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
            Explore talent
          </a>
          <a
            href={ROUTES.login}
            className="btn soft interactive"
            onClick={(event) => navigateWithScroll(event, ROUTES.login, navigate)}
          >
            Client sign in
          </a>
        </div>

        <div className="heroTrustRow">
          {trustIndicators.map((item) => (
            <span key={item} className="heroTrustItem">
              <Sparkles size={15} />
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="heroArt fadeUp delayOne">
        <div className="heroDashboard cardLift displayFloat">
          <div className="heroDashboardTop">
            <div>
              <span className="heroKicker">Live dashboard preview</span>
              <h3>{activeTalentCategory === 'All' ? 'Top marketplace overview' : activeTalentCategory}</h3>
            </div>
            <span className="heroSignal">● Online</span>
          </div>

          <div className="heroDashboardGrid">
            {(heroHighlights || []).map((item) => (
              <article key={item.label} className="heroMetricCard">
                <span>{item.label}</span>
                <strong>{isLoading ? '...' : item.value}</strong>
              </article>
            ))}
          </div>

          <div className="heroSpotlight">
            <div>
              <p className="heroSpotlightLabel">Talent pipeline</p>
              <strong>Matched profiles in minutes</strong>
              <span>Shortlist, compare rates and move directly into project scope.</span>
            </div>
            <div className="heroSpotlightBadge">
              <TrendingUp size={18} />
              24h avg. hire cycle
            </div>
          </div>

          <div className="heroMiniCards">
            <div className="heroMiniCard">
              <span>Best for</span>
              <strong>Design, AI, product builds</strong>
            </div>
            <div className="heroMiniCard accent">
              <span>Marketplace health</span>
              <strong>980+ briefs this week</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
