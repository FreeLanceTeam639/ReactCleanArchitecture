import BrandLogo from '../../shared/ui/BrandLogo.jsx';

export default function HomeFooter() {
  return (
    <footer className="footer">
      <div className="wrap footerGrid">
        <div>
          <BrandLogo href="#home" />
          <p>
            Our platform helps businesses hire top freelancers and discover digital services with speed.
          </p>
        </div>
        <div>
          <h4>Top Rated Categories</h4>
          <ul>
            <li>AI Development</li>
            <li>Graphic Design</li>
            <li>Programming</li>
            <li>Video Editing</li>
          </ul>
        </div>
        <div>
          <h4>Post Free To Share Your Question</h4>
          <ul>
            <li>+44 877 723 4554</li>
            <li>hello@freelanceaze.az</li>
            <li>Mon-Sat 09:00 - 18:00</li>
          </ul>
        </div>
      </div>
      <div className="wrap footBottom">
        <span>Copyright 2026 FreelanceAze</span>
        <div className="socials">
          <span>in</span>
          <span>f</span>
          <span>x</span>
          <span>ig</span>
        </div>
      </div>
    </footer>
  );
}
