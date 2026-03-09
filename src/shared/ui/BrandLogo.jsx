export default function BrandLogo({ href = '#home', label = 'Worklance', className = 'brand', onClick }) {
  return (
    <a href={href} className={className} onClick={onClick}>
      <span className="dot">W</span>
      {label}
    </a>
  );
}
