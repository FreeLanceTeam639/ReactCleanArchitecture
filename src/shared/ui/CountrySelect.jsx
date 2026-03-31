export default function CountrySelect({
  value,
  countries,
  onChange,
  disabled = false,
  required = false,
  placeholder = 'Select country',
  className = ''
}) {
  return (
    <select
      className={`countrySelectInput ${className}`.trim()}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      required={required}
    >
      <option value="">{disabled ? 'Loading countries...' : placeholder}</option>
      {countries.map((country) => (
        <option key={country.iso2} value={country.name}>
          {country.name} ({country.dialCode})
        </option>
      ))}
    </select>
  );
}
