import SelectOne from '../../components/ui/select-1.jsx';

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
    <SelectOne
      className={className}
      triggerClassName="countrySelectInput"
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={disabled ? 'Loading countries...' : placeholder}
      options={countries.map((country) => ({
        value: country.name,
        label: `${country.name} (${country.dialCode})`
      }))}
      showClear={!required}
    />
  );
}
