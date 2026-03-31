import { useI18n } from '../i18n/I18nProvider.jsx';

const LANGUAGE_OPTIONS = [
  { value: 'az', label: 'AZ' },
  { value: 'ru', label: 'RU' },
  { value: 'en', label: 'EN' }
];

export default function LanguageSwitcher({ className = '' }) {
  const { language, setLanguage, t } = useI18n();
  const wrapperClassName = className ? `languageSwitcher ${className}` : 'languageSwitcher';

  return (
    <div className={wrapperClassName} aria-label={t('Language switcher')} data-i18n-skip="true">
      {LANGUAGE_OPTIONS.map((item) => (
        <button
          key={item.value}
          type="button"
          className={language === item.value ? 'languageSwitchButton active interactive' : 'languageSwitchButton interactive'}
          onClick={() => setLanguage(item.value)}
          aria-pressed={language === item.value}
          title={item.label}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
