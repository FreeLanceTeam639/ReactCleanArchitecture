import FreelancerProfileCard from '../../shared/ui/FreelancerProfileCard.jsx';

export default function TalentSection({ tabs, activeTab, onTabChange, talents, navigate }) {
  const safeTabs = Array.isArray(tabs) ? tabs : [];
  const safeTalents = Array.isArray(talents) ? talents : [];

  const filteredTalents =
    activeTab && activeTab !== 'All'
      ? safeTalents.filter((talent) => talent.category === activeTab)
      : safeTalents;

  return (
    <section className="section wrap" id="talents">
      <div className="sectionHead">
        <div>
          <span className="eyebrow">Top talents</span>
          <h2>Meet the professionals ready for your next project</h2>
        </div>
      </div>

      <div className="tabs">
        {safeTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? 'tab active interactive' : 'tab interactive'}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid freelancerGrid">
        {filteredTalents.map((talent) => (
          <FreelancerProfileCard
            key={`${talent.name}-${talent.title}`}
            talent={talent}
            navigate={navigate}
          />
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