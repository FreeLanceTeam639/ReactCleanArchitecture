function resolveServiceItemLabel(item) {
  return typeof item === 'string' ? item : item?.name ?? item?.title;
}

export default function ServicesSection({ services }) {
  return (
    <section className="section wrap" id="services">
      <p className="eyebrow">Best ways moving hire</p>
      <h2>Comprehensive range of talent services to meet your every need</h2>
      <p className="lead">
        Explore a broad range of categories, from tech experts to fashion stylists, voice artists, and gourmet chefs.
      </p>
      <div className="grid serviceGrid">
        {services.map((service) => (
          <article key={service.title} className="card service cardLift">
            <div className="serviceTop">
              <h3>{service.title}</h3>
              <span className="emoji">{service.emoji || '✨'}</span>
            </div>
            <ul>
              {(service.items || []).slice(0, 4).map((item) => (
                <li key={resolveServiceItemLabel(item)}>{resolveServiceItemLabel(item)}</li>
              ))}
            </ul>
            <a href="#talents" className="more">
              Explore All
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
