import { ArrowRight, BadgeCheck, Heart, MapPin, Star } from 'lucide-react';
import { buildTaskDetailRoute, ROUTES } from '../../shared/constants/routes.js';
import { useAuthSessionState } from '../../shared/hooks/useAuthSessionState.js';
import { useI18n } from '../../shared/i18n/I18nProvider.jsx';
import { navigateWithScroll } from '../../shared/lib/navigation/navigateWithScroll.js';

function JobAvatar({ name, avatarUrl }) {
  const initials = String(name || 'MB')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((value) => value[0])
    .join('')
    .toUpperCase();

  if (avatarUrl) {
    return <img src={avatarUrl} alt={name} className="liveJobAvatar" />;
  }

  return <div className="liveJobAvatar liveJobAvatarFallback">{initials || 'MB'}</div>;
}

function RatingLine({ rating = 0, reviewCount = 0, t }) {
  const safeRating = Number(rating || 0);
  const filledStars = Math.max(0, Math.min(5, Math.round(safeRating)));

  return (
    <div className="liveJobRatingLine">
      <span className="liveJobStars">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={14}
            className={index < filledStars ? 'liveJobStar active' : 'liveJobStar'}
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

export default function LiveJobsSection({ jobs, navigate }) {
  const { t } = useI18n();
  const isAuthenticated = Boolean(useAuthSessionState());
  const safeJobs = Array.isArray(jobs) ? jobs : [];
  const primaryAction = isAuthenticated
    ? { label: t('Open workspace'), route: ROUTES.orders }
    : { label: t('Join the marketplace'), route: ROUTES.register };

  return (
    <section className="section wrap liveJobsSection" id="live-jobs">
      <div className="liveJobsShell cardLift fadeUp">
        <div className="sectionHead splitHead liveJobsHead">
          <div>
            <p className="eyebrow">{t('Live opportunities')}</p>
            <h2>{t('Fresh job posts are now visible on the public homepage')}</h2>
            <p className="lead">
              {t('Recent verified briefs, delivery windows and budgets stay visible so the marketplace feels active and trustworthy.')}
            </p>
          </div>

          <div className="liveJobsSummary">
            <span>{t('Open briefs')}</span>
            <strong>{safeJobs.length || 0}</strong>
            <small>{t('Updated from the real backend feed')}</small>
          </div>
        </div>

        {safeJobs.length ? (
          <div className="liveJobsGrid">
            {safeJobs.map((job, index) => (
              <article
                key={job.id}
                className="liveJobCard interactive"
                style={{ animationDelay: `${index * 0.08}s` }}
                role="button"
                tabIndex={job.slug ? 0 : -1}
                onClick={() => {
                  if (job.slug) {
                    navigate(buildTaskDetailRoute(job.slug));
                  }
                }}
                onKeyDown={(event) => {
                  if ((event.key === 'Enter' || event.key === ' ') && job.slug) {
                    event.preventDefault();
                    navigate(buildTaskDetailRoute(job.slug));
                  }
                }}
              >
                <div className="liveJobVisual">
                  {job.coverImageUrl ? (
                    <img src={job.coverImageUrl} alt={job.title} className="liveJobCoverImage" />
                  ) : (
                    <div className="liveJobCoverImage liveJobCoverPlaceholder">{job.title}</div>
                  )}

                  <button
                    type="button"
                    className="liveJobFavourite interactive"
                    aria-label={t('Save')}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Heart size={16} />
                  </button>
                </div>

                <div className="liveJobContent">
                  <div className="liveJobOwnerRow">
                    <div className="liveJobOwner">
                      <JobAvatar name={job.ownerName} avatarUrl={job.ownerAvatarUrl} />
                      <div>
                        <strong>{job.ownerName}</strong>
                        <span>{job.ownerVerified ? t('Verified member') : t('Active member')}</span>
                      </div>
                    </div>

                    {job.ownerVerified ? (
                      <span className="liveJobVerified" title={t('Verified')}>
                        <BadgeCheck size={16} />
                      </span>
                    ) : null}
                  </div>

                  <div className="liveJobHeading">
                    <strong>{job.title}</strong>
                    {job.summary ? <p>{job.summary}</p> : null}
                  </div>

                  <RatingLine rating={job.ownerRating} reviewCount={job.ownerReviewCount} t={t} />

                  <div className="liveJobLocation">
                    <MapPin size={15} />
                    <span>{job.ownerLocation || job.timeline}</span>
                  </div>

                  <div className="liveJobBottomRow">
                    <span className="liveJobBottomLabel">{t('Starting from')}</span>
                    <strong className="liveJobPrice">{job.budget}</strong>
                  </div>
                </div>

                {job.slug ? (
                  <button
                    type="button"
                    className="btn soft liveJobOpenAction interactive"
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(buildTaskDetailRoute(job.slug));
                    }}
                  >
                    {t('View task details')}
                    <ArrowRight size={15} />
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="liveJobsEmpty cardLift">
            <strong>{t('The next published jobs will appear here.')}</strong>
            <p>{t('As soon as members publish new briefs, this section will showcase them automatically.')}</p>
          </div>
        )}

        <div className="liveJobsActions">
          <a
            href={primaryAction.route}
            className="btn primary interactive"
            onClick={(event) => navigateWithScroll(event, primaryAction.route, navigate)}
          >
            {primaryAction.label}
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
