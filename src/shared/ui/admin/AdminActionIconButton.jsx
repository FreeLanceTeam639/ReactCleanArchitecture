export default function AdminActionIconButton({
  icon: Icon,
  label,
  onClick,
  tone = 'default',
  active = false,
  disabled = false,
  type = 'button'
}) {
  const classNames = ['adminIconButton', 'interactive'];

  if (tone && tone !== 'default') {
    classNames.push(tone);
  }

  if (active) {
    classNames.push('active');
  }

  return (
    <button
      type={type}
      className={classNames.join(' ')}
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
    >
      {Icon ? <Icon size={16} /> : null}
    </button>
  );
}
