export default function AdminStatusBadge({ value = 'active', tone = '' }) {
  const normalized = String(value || '').toLowerCase();
  const className = tone ? `adminStatusBadge ${tone}` : `adminStatusBadge ${normalized}`;

  return <span className={className}>{value}</span>;
}
