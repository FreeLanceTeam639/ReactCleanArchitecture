import { buildTaskDetailRoute } from '../constants/routes.js';
import { createSlug } from '../lib/slug/createSlug.js';

function renderStars(rating) {
  const safeRating = Number(rating || 0);
  const fullStars = Math.round(safeRating);

  return Array.from({ length: 5 }, (_, index) => (
    <span key={`${safeRating}-${index}`} className={index < fullStars ? 'star active' : 'star'}>
      ★
    </span>
  ));
}

export default function FreelancerProfileCard({ talent, navigate }) {
  const {
    name,
    title,
    avatar,
    banner,
    rating,
    reviews,
    hourlyRate,
    duration,
    location,
    tools = [],
    featured,
    badge
  } = talent;

  const initials = name
    ?.split(' ')
    ?.map((part) => part[0])
    ?.join('')
    ?.slice(0, 2);

  const detailRoute = buildTaskDetailRoute(createSlug(`${name}-${title}`));
  const handleNavigate = () => navigate(detailRoute);

  return (
    <article
      className="freelancerCard cardLift interactive"
      role="button"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleNavigate();
        }
      }}
    >
      <div className="freelancerBannerWrap">
        {banner ? (
          <img src={banner} alt={`${name} banner`} className="freelancerBanner" />
        ) : (
          <div className="freelancerBanner freelancerBannerFallback" />
        )}

        <button
          type="button"
          className="freelancerBookmark interactive"
          aria-label="Save profile"
          onClick={(event) => event.stopPropagation()}
        >
          ☆
        </button>

        <div className="freelancerAvatarWrap">
          {avatar ? (
            <img src={avatar} alt={name} className="freelancerAvatar" />
          ) : (
            <div className="freelancerAvatar freelancerAvatarFallback">{initials || 'FR'}</div>
          )}
        </div>
      </div>

      <div className="freelancerCardBody">
        <div className="freelancerTopRow">
          <div>
            <h3>{name}</h3>
            <p>{title}</p>
          </div>

          <div className="freelancerTools">
            <div className="freelancerToolList">
              {tools.slice(0, 3).map((tool) => (
                <span key={tool} className="freelancerToolBadge">
                  {tool}
                </span>
              ))}
            </div>
            <small>Tools</small>
          </div>
        </div>

        <div className="freelancerStats">
          <div className="freelancerStat">
            <div className="freelancerStatValue withStars">
              <span className="starsRow">{renderStars(rating)}</span>
              <strong>{rating ?? '0.0'}</strong>
            </div>
            <span>rating</span>
          </div>

          <div className="freelancerDivider" />

          <div className="freelancerStat">
            <div className="freelancerStatValue">
              <strong>{duration || '8 Days'}</strong>
            </div>
            <span>duration</span>
          </div>

          <div className="freelancerDivider" />

          <div className="freelancerStat">
            <div className="freelancerStatValue">
              <strong>${hourlyRate || 40}/hr</strong>
            </div>
            <span>rate</span>
          </div>
        </div>

        <div className="freelancerMetaRow">
          <span>{location || 'Remote'}</span>
          <span>{reviews ? `${reviews} reviews` : 'Top rated'}</span>
        </div>

        {(badge || featured) && (
          <div className="freelancerBadgeRow">
            <span className="freelancerFeaturedBadge">{badge || 'Featured Talent'}</span>
          </div>
        )}

        <button
          type="button"
          className="btn primary interactive freelancerAction"
          onClick={(event) => {
            event.stopPropagation();
            handleNavigate();
          }}
        >
          View task details
        </button>
      </div>
    </article>
  );
}
