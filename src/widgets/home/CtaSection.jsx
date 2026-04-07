import { ROUTES } from '../../shared/constants/routes.js';
import { useAuthSessionState } from '../../shared/hooks/useAuthSessionState.js';
import { useI18n } from '../../shared/i18n/I18nProvider.jsx';
import { navigateWithScroll } from '../../shared/lib/navigation/navigateWithScroll.js';

export default function CtaSection({ navigate }) {
  const { t } = useI18n();
  const isAuthenticated = Boolean(useAuthSessionState());
  const action = isAuthenticated
    ? { label: t('Open profile'), route: ROUTES.profile }
    : { label: t('Get Started Now'), route: ROUTES.login };

  return (
    <section className="cta">
      <div className="wrap ctaRow cardLift" id="cta">
        <div>
          <p className="eyebrow">{t('Start today')}</p>
          <h2>{t('Join the marketplace and unlock your next opportunity')}</h2>
          <p>{t('Connect with skilled professionals, streamline collaboration, and move projects forward with confidence.')}</p>
        </div>
        <a
          href={action.route}
          className="btn primary interactive"
          onClick={(event) => navigateWithScroll(event, action.route, navigate)}
        >
          {action.label}
        </a>
      </div>
    </section>
  );
}
