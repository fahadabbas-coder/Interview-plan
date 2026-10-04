const Badge = ({ tone = 'neutral', className = '', children }) => (
  <span className={`badge badge--${tone} ${className}`.trim()}>
    {children}
  </span>
)

export default Badge
