export default function BrandLogo({
  as = 'a',
  href = '#home',
  label = 'FreelanceAze',
  className = 'brand',
  onClick
}) {
  const Tag = as;
  const hasAccentWord = label.endsWith('Aze');
  const labelMain = hasAccentWord ? label.slice(0, -3) : label;
  const labelAccent = hasAccentWord ? label.slice(-3) : '';
  const sharedProps = {
    className,
    onClick,
    'data-i18n-skip': 'true'
  };

  if (Tag === 'a') {
    sharedProps.href = href;
  }

  return (
    <Tag {...sharedProps}>
      <span className="brandMark" aria-hidden="true">
        <svg viewBox="0 0 64 64" className="brandSymbol" role="presentation">
          <rect x="6" y="6" width="52" height="52" rx="18" fill="#ff5a14" />
          <path
            d="M37 8c10 2 18 10 21 20-7-3-14-4-21-3 0-7 0-12 0-17Z"
            fill="#ff9d72"
            opacity="0.95"
          />
          <path d="M18 17h18v6H24v7h10v6H24v11h-6V17Z" fill="#ffffff" />
          <path
            d="M39 47l7.2-18h5.8L59.2 47h-5.5l-1.2-3.3H46L44.8 47h-5.8Zm8.2-12.9-1.9 5.2h3.8l-1.9-5.2Z"
            fill="#fff2e9"
          />
          <circle cx="49" cy="16" r="4" fill="#fff2e9" />
        </svg>
      </span>
      <span className="brandLabel">
        <span className="brandLabelMain">{labelMain}</span>
        {labelAccent ? <span className="brandLabelAccent">{labelAccent}</span> : null}
      </span>
    </Tag>
  );
}
