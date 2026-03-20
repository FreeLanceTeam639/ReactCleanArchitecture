function resolveServiceItemLabel(item) {
  return typeof item === 'string' ? item : item?.name ?? item?.title;
}

export default function ServicesSection({ services, selectedService, activeServiceTitle, onSelectService }) {
  return (
    <section className="section wrap" id="services">
      <div className="sectionHead splitHead">
        <div>
          <p className="eyebrow">Best ways moving hire</p>
          <h2>Comprehensive range of talent services to meet your every need</h2>
          <p className="lead">
            Explore a broad range of categories, from tech experts to fashion stylists, voice artists and growth specialists.
          </p>
        </div>

        {selectedService ? (
          <div className="serviceInsightCard cardLift">
            <span className="serviceInsightLabel">Selected category</span>
            <strong>{selectedService.title}</strong>
            <p>{selectedService.description}</p>
            <div className="serviceInsightMeta">
              <span>{selectedService.projectCount || 0}+ live briefs</span>
              <span>{selectedService.averageRate || '$0/hr'} avg rate</span>
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
                <small>{service.projectCount || 0}+ briefs</small>
                <button type="button" className="more interactive" onClick={() => onSelectService(service.title)}>
                  {isActive ? 'Selected' : 'Explore All'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
