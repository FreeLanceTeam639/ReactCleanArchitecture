import { useI18n } from '../../shared/i18n/I18nProvider.jsx';

function resolveServiceItemLabel(item) {
  return typeof item === 'string' ? item : item?.name ?? item?.title;
}

export default function ServicesSection({ services, selectedService, activeServiceTitle, onSelectService }) {
  const { t } = useI18n();

  return (
    <section className="section wrap" id="services">
      <div className="sectionHead splitHead">
        <div>
          <p className="eyebrow">{t('Curated categories')}</p>
          <h2>{t('Professional service lanes built for faster decisions')}</h2>
          <p className="lead">
            {t('Explore the categories members use most, compare active briefs and see how each lane is performing right now.')}
          </p>
        </div>

        {selectedService ? (
          <div className="serviceInsightCard cardLift">
            <span className="serviceInsightLabel">{t('Selected category')}</span>
            <strong>{selectedService.title}</strong>
            <p>{selectedService.description}</p>
            <div className="serviceInsightMeta">
              <span>{selectedService.projectCount || 0}+ {t('live briefs')}</span>
              <span>{selectedService.averageRate || '$0/hr'} {t('avg rate')}</span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="grid serviceGrid">
        {services.map((service) => {
          const isActive = activeServiceTitle === service.title;

          return (
            <article
              key={service.title}
              className={isActive ? 'card service cardLift activeServiceCard' : 'card service cardLift'}
            >
              <div className="serviceTop">
                <h3>{service.title}</h3>
                <span className="emoji">{service.emoji || '✨'}</span>
              </div>
              <p className="serviceDescription">{service.description}</p>
              <ul>
                {(service.items || []).slice(0, 4).map((item) => (
                  <li key={resolveServiceItemLabel(item)}>{resolveServiceItemLabel(item)}</li>
                ))}
              </ul>
              <div className="serviceBottomRow">
                <small>{service.projectCount || 0}+ {t('active briefs')}</small>
                <button type="button" className="more interactive" onClick={() => onSelectService(service.title)}>
                  {isActive ? t('Selected') : t('View details')}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
