import { Search } from 'lucide-react';

export default function AdminToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  actionLabel,
  onAction,
  actionTone = 'primary'
}) {
  return (
    <div className="adminToolbar cardLift">
      <label className="adminSearchField">
        <Search size={16} />
        <input value={searchValue} onChange={(event) => onSearchChange(event.target.value)} placeholder={searchPlaceholder} />
      </label>

      <div className="adminToolbarFilters">
        {filters.map((filter) => (
          <label key={filter.key} className="adminFilterField">
            <span>{filter.label}</span>
            <select value={filter.value} onChange={(event) => filter.onChange(event.target.value)}>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}

        {actionLabel ? (
          <button type="button" className={`btn ${actionTone} interactive adminToolbarButton`} onClick={onAction}>
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
