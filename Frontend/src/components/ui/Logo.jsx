const Logo = ({ className = '' }) => (
  <span className={`brand__mark ${className}`.trim()} aria-hidden="true">
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="3" width="16" height="18" rx="3" />
      <path d="M8 9h8" />
      <path d="M8 13h5" />
      <path d="M8 17h6" />
    </svg>
  </span>
)

export default Logo
