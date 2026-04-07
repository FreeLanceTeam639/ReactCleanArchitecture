import BrandLogo from '../../shared/ui/BrandLogo.jsx';
import { useI18n } from '../../shared/i18n/I18nProvider.jsx';

export default function HomeFooter() {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div className="wrap footerGrid">
        <div>
          <BrandLogo href="#home" />
          <p>
            {t('Our platform helps businesses discover verified professionals and launch digital collaborations faster.')}
          </p>
        </div>
        <div>
          <h4>{t('Top Rated Categories')}</h4>
          <ul>
            <li>{t('AI Development')}</li>
            <li>{t('Graphic Design')}</li>
            <li>{t('Programming')}</li>
            <li>{t('Video Editing')}</li>
          </ul>
        </div>
        <div>
          <h4>{t('Contact our team')}</h4>
          <ul>
            <li>+44 877 723 4554</li>
            <li>hello@freelanceaze.az</li>
            <li>Mon-Sat 09:00 - 18:00</li>
          </ul>
        </div>
      </div>
      <div className="wrap footBottom">
        <span>{t('Copyright © 2026 FreelanceAze')}</span>
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
