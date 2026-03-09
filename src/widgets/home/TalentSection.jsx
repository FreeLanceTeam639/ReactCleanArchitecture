function resolveTalentPrice(talent) {
  return talent.hourlyRate ?? talent.price;
}

export default function TalentSection({ tabs, activeTab, onTabChange, talents }) {
  return (
    <section className="section wrap" id="talents">
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? 'tab active interactive' : 'tab interactive'}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="grid talentGrid">
        {talents.map((talent) => (
          <article key={`${talent.name}${talent.title}`} className="card talent cardLift">
            <div className="media">
              <span>{talent.icon || '💼'}</span>
              <small>{talent.label || 'Portfolio'}</small>
            </div>
            <div className="talentBody">
              <h3>{talent.name}</h3>
              <p>{talent.title}</p>
              <div className="meta">
                <span>{talent.location}</span>
                <span>
                  ⭐ {talent.rating} ({talent.reviews})
                </span>
              </div>
              <div className="priceRow">
                <span>Starting from</span>
                <strong>${resolveTalentPrice(talent)}</strong>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="center">
        <a href="#cta" className="btn soft interactive">
          Explore More Talents
        </a>
      </div>
    </section>
  );
}
