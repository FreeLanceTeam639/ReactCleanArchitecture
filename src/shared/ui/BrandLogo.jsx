export default function BrandLogo({ href = '#home', label = 'Worklance', className = 'brand', onClick }) {
  return (
    <a href={href} className={className} onClick={onClick}>
      <span className="brandMark" aria-hidden="true">
        <span className="dot">W</span>
        <span className="brandSticker" />
      </span>
      <span className="brandLabel">{label}</span>
    </a>
  );
}
