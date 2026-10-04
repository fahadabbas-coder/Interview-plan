import { Link } from 'react-router'

const Button = ({
  to,
  variant = 'secondary',
  size,
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  children,
  ...rest
}) => {
  const classes = [
    'btn',
    `btn--${variant}`,
    size ? `btn--${size}` : '',
    loading ? 'btn--loading' : '',
    className,
  ].filter(Boolean).join(' ')

  const content = (
    <>
      {loading ? <span className="spinner" aria-hidden="true" /> : null}
      {children}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} aria-disabled={disabled || undefined} {...rest}>
        {content}
      </Link>
    )
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {content}
    </button>
  )
}

export default Button
