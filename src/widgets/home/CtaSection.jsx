import { ROUTES } from '../../shared/constants/routes.js';
import { navigateWithScroll } from '../../shared/lib/navigation/navigateWithScroll.js';

export default function CtaSection({ navigate }) {
  return (
    <section className="cta">
      <div className="wrap ctaRow cardLift" id="cta">
        <div>
          <p className="eyebrow">Get Started</p>
          <h2>Join and get a unique opportunity</h2>
          <p>Connect with skilled professionals, optimize collaborations, and unlock success.</p>
        </div>
        <a
          href={ROUTES.login}
          className="btn primary interactive"
          onClick={(event) => navigateWithScroll(event, ROUTES.login, navigate)}
        >
          Get Started Now
        </a>
      </div>
    </section>
  );
}
