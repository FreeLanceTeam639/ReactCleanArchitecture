import { BadgeCheck, ChevronLeft, ChevronRight, Heart, MapPin, Star } from 'lucide-react';
import { useRef } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider.jsx';
import { buildTaskDetailRoute } from '../../../shared/constants/routes.js';

function RatingLine({ rating = 0, reviewCount = 0, t }) {
  const safeRating = Number(rating || 0);
  const filledStars = Math.max(0, Math.min(5, Math.round(safeRating)));

  return (
    <div className="exploreTaskRatingLine">
      <span className="exploreTaskStars">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={14}
            className={index < filledStars ? 'exploreTaskStar active' : 'exploreTaskStar'}
            fill={index < filledStars ? 'currentColor' : 'none'}
          />
        ))}
      </span>
      <span>
        {safeRating ? `${safeRating.toFixed(1)} / 5.0` : '0 / 5.0'}{' '}
        {reviewCount ? `${reviewCount} ${t(reviewCount === 1 ? 'review' : 'reviews')}` : t('User review')}
      </span>
    </div>
  );
}

function TaskCard({ task, owner, navigate }) {
  const { t } = useI18n();

  return (
    <article className="exploreTaskCard cardLift">
      <div className="exploreTaskVisual">
        {task.coverImageUrl ? (
          <img src={task.coverImageUrl} alt={task.title} className="exploreTaskImage" />
        ) : (
          <div className="exploreTaskImage placeholder">{task.title}</div>
        )}

        <button type="button" className="exploreTaskFavourite interactive" aria-label={t('Save')}>
          <Heart size={16} />
        </button>
      </div>

      <div className="exploreTaskBody">
        <div className="exploreTaskOwnerRow">
          <div className="exploreTaskOwner">
            {owner.avatarUrl ? (
              <img src={owner.avatarUrl} alt={owner.name} className="exploreTaskOwnerAvatar" />
            ) : (
              <div className="exploreTaskOwnerAvatar placeholder">{owner.name.slice(0, 2).toUpperCase()}</div>
            )}

            <div>
              <strong>{owner.name}</strong>
              <span>{owner.title}</span>
            </div>
          </div>

          {task.isVerifiedOwner ? (
            <span className="exploreTaskVerified" title={t('Verified')}>
              <BadgeCheck size={16} />
            </span>
          ) : null}
        </div>

        <h3>{task.title}</h3>
        <RatingLine rating={owner.rating} reviewCount={owner.reviews} t={t} />

        <div className="exploreTaskLocation">
          <MapPin size={14} />
          <span>{owner.country}</span>
        </div>

        <div className="exploreTaskPriceRow">
          <span className="exploreTaskPriceLabel">{t('Starting from')}</span>
          <strong>{task.budgetLabel}</strong>
        </div>

        <button
          type="button"
          className="btn primary interactive exploreTaskButton"
          onClick={() => navigate(buildTaskDetailRoute(task.slug))}
        >
          {t('View task details')}
        </button>
      </div>
    </article>
  );
}

export default function ExploreMemberRow({ item, navigate }) {
  const { t, language } = useI18n();
  const sliderRef = useRef(null);
  const detailRoute = item.profileSlug ? buildTaskDetailRoute(item.profileSlug) : (item.tasks[0]?.slug ? buildTaskDetailRoute(item.tasks[0].slug) : '');

  const formatTasksFromName = (count, name) => {
    if (language === 'az') {
      return `${name} terefinden ${count} tapsiriq`;
    }

    if (language === 'ru') {
      return `${count} задач от ${name}`;
    }

    return `${count} tasks from ${name}`;
  };

  const formatActiveTasks = (count) => {
    if (language === 'az') {
      return `${count} aktiv tapsiriq`;
    }

    if (language === 'ru') {
      return `${count} активных задач`;
    }

    return `${count} active tasks`;
  };

  const handleScroll = (direction) => {
    sliderRef.current?.scrollBy({
      left: direction === 'right' ? 360 : -360,
      behavior: 'smooth'
    });
  };

  return (
    <article className="exploreRow cardLift">
      <aside className="exploreMemberSummary">
        <div className="exploreMemberBanner">
          {item.bannerUrl ? <img src={item.bannerUrl} alt={`${item.name} banner`} /> : null}
        </div>

        <div className="exploreMemberIdentity">
          {item.avatarUrl ? (
            <img src={item.avatarUrl} alt={item.name} className="exploreMemberAvatar" />
          ) : (
            <div className="exploreMemberAvatar placeholder">{item.name.slice(0, 2).toUpperCase()}</div>
          )}

          <div>
            <strong>{item.name}</strong>
            <span>{item.title}</span>
          </div>
        </div>

        <div className="exploreMemberStats">
          <span><Star size={14} /> {item.rating.toFixed(1)} {t('rating')}</span>
          <span><MapPin size={14} /> {item.country}</span>
          <span>{formatActiveTasks(item.taskCount)}</span>
        </div>

        <p className="exploreMemberBio">{item.bio}</p>

        <div className="exploreMemberBadges">
          <span className="exploreMemberBadge">{item.badge}</span>
          <span className="exploreMemberBadge muted">{item.availability}</span>
        </div>

        <div className="exploreMemberSkills">
          {item.skills.map((skill) => (
            <span key={`${item.userId}-${skill}`} className="exploreSkillPill">{skill}</span>
          ))}
        </div>

        {detailRoute ? (
          <button
            type="button"
            className="btn soft interactive exploreProfileButton"
            onClick={() => navigate(detailRoute)}
          >
            {t(item.profileActionLabel)}
          </button>
        ) : null}
      </aside>

      <div className="exploreMemberTasks">
        <div className="exploreTasksHeader">
          <div>
            <span className="eyebrow">{t('Published tasks')}</span>
            <h3>{formatTasksFromName(item.taskCount, item.name)}</h3>
          </div>

          <div className="exploreTasksActions">
            <button type="button" className="exploreScrollButton interactive" onClick={() => handleScroll('left')} aria-label={t('Scroll tasks left')}>
              <ChevronLeft size={18} />
            </button>
            <button type="button" className="exploreScrollButton interactive" onClick={() => handleScroll('right')} aria-label={t('Scroll tasks right')}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="exploreTaskScroller" ref={sliderRef}>
          {item.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              owner={{
                avatarUrl: item.avatarUrl,
                name: item.name,
                title: item.title,
                country: item.country,
                rating: item.rating,
                reviews: item.reviews
              }}
              navigate={navigate}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
