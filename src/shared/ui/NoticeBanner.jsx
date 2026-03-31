import { Sparkles } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider.jsx';

export default function NoticeBanner({ message }) {
  const { t } = useI18n();

  if (!message) {
    return null;
  }

  return (
    <div className="notice wrap fadeUp" role="status">
      <div className="noticeIcon">
        <Sparkles size={16} />
      </div>
      <div className="noticeCopy">
        <strong>{t('Marketplace update')}</strong>
        <p>{t(message)}</p>
      </div>
    </div>
  );
}
