import { useMemo, useRef } from 'react';
import { KeyRound } from 'lucide-react';

function normalizeCode(value) {
  return String(value || '').replace(/\D/g, '').slice(0, 4);
}

function getCodePreview(value) {
  if (!value) {
    return '';
  }

  return `${value.length}/4`;
}

export function OTPVerification({
  className = '',
  title = 'Verification code',
  description = '',
  email = '',
  value = '',
  slotCount = 4,
  helperText = '',
  resendLabel = 'Resend code',
  resendLoadingLabel = 'Resending...',
  isResending = false,
  disabled = false,
  onChange,
  onResend,
  onFocus,
  onBlur
}) {
  const inputRef = useRef(null);
  const normalizedValue = useMemo(() => normalizeCode(value), [value]);
  const filledCount = Math.min(slotCount, normalizedValue.length);
  const previewText = normalizedValue ? getCodePreview(normalizedValue) : helperText;

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleChange = (event) => {
    onChange?.(normalizeCode(event.target.value));
  };

  const handlePaste = (event) => {
    const nextValue = normalizeCode(event.clipboardData.getData('text'));

    if (!nextValue) {
      return;
    }

    event.preventDefault();
    onChange?.(nextValue);
    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const classes = ['otpVerificationCard', className].filter(Boolean).join(' ');

  return (
    <section className={classes}>
      <div className="otpVerificationGlow" />

      <div className="otpVerificationIcon" aria-hidden="true">
        <KeyRound size={18} />
      </div>

      <header className="otpVerificationHeader">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
        {email ? <strong>{email}</strong> : null}
      </header>

      <div
        className={`otpVerificationSlots ${disabled ? 'is-disabled' : ''}`}
        role="button"
        tabIndex={-1}
        onClick={focusInput}
      >
        <input
          ref={inputRef}
          type="text"
          value={normalizedValue}
          onChange={handleChange}
          onPaste={handlePaste}
          onFocus={onFocus}
          onBlur={onBlur}
          autoComplete="one-time-code"
          className="otpVerificationHiddenInput"
          aria-label={title}
          disabled={disabled}
        />

        {Array.from({ length: slotCount }).map((_, index) => (
          <div
            key={`otp-slot-${index}`}
            className={`otpVerificationSlot ${index < filledCount ? 'is-filled' : ''}`}
            aria-hidden="true"
          >
            <span>{normalizedValue[index] || ''}</span>
          </div>
        ))}
      </div>

      {previewText ? <p className="otpVerificationHint">{previewText}</p> : null}

      <div className="otpVerificationActions">
        <button
          type="button"
          className="otpVerificationResendButton interactive"
          onClick={onResend}
          disabled={disabled || isResending}
        >
          {isResending ? resendLoadingLabel : resendLabel}
        </button>
      </div>
    </section>
  );
}

export default OTPVerification;
