import { buildPhoneNumberValue, extractLocalPhoneNumber } from '../lib/forms/countryPhone.js';

export default function PhoneNumberField({
  countryValue,
  countries,
  value,
  onChange,
  placeholder = 'Enter phone number',
  disabled = false,
  required = false,
  className = ''
}) {
  const localValue = extractLocalPhoneNumber(value, countryValue, countries);

  return (
    <div className={`phoneNumberField ${className}`.trim()}>
      <input
        type="tel"
        className="phoneNumberInput"
        inputMode="tel"
        value={localValue}
        onChange={(event) => onChange(buildPhoneNumberValue(countryValue, event.target.value, countries))}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
      />
    </div>
  );
}
