export default function HeroSection({ popularCategories }) {
  return (
    <section className="hero wrap" id="home">
      <div className="heroText fadeUp">
        <h1>
          Thrive in the <span>World of</span> Freelance Marketplace!
        </h1>
        <p>
          Flourish in a thriving freelance ecosystem dedicated to excellent and limitless opportunities.
        </p>
        <div className="row">
          <a href="#talents" className="btn primary interactive">
            Find Freelancers
          </a>
          <a href="#services" className="btn soft interactive">
            Learn More
          </a>
        </div>
        <div className="popular">
          <small>Popular categories</small>
          <div className="chips">
            {popularCategories.map((category) => (
              <span key={category} className="chip">
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="heroArt fadeUp delayOne">
        <div className="laptop displayFloat">
          <div className="screen">
            <div className="loginCard">
              <b>Free login</b>
              <span className="line" />
              <span className="line" />
              <span className="line short" />
              <button className="interactive">Login</button>
            </div>
          </div>
          <div className="touch">●</div>
        </div>
      </div>
    </section>
  );
}
