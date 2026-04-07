import { useI18n } from '../i18n/I18nProvider.jsx';

export default function LanguageSwitcher({ className = '' }) {
  const { language, setLanguage, t, languageOptions = [] } = useI18n();
  const wrapperClassName = className ? `languageSwitcher ${className}` : 'languageSwitcher';
  const options = Array.isArray(languageOptions) && languageOptions.length ? languageOptions : [];
  const activeIndex = Math.max(
    0,
    options.findIndex((item) => item.value === language)
  );

  return (
    <div className={wrapperClassName} aria-label={t('Language switcher')} data-i18n-skip="true">
      <span
        className="languageSwitchTrack"
        aria-hidden="true"
        style={{
          width: options.length ? `${100 / options.length}%` : '0%',
          transform: `translateX(${activeIndex * 100}%)`
        }}
      />
      {options.map((item) => (
        <button
          key={item.value}
          type="button"
          className={language === item.value ? 'languageSwitchButton active interactive' : 'languageSwitchButton interactive'}
          onClick={() => setLanguage(item.value)}
          aria-pressed={language === item.value}
          aria-label={item.nativeLabel || item.label}
          title={item.nativeLabel || item.label}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
