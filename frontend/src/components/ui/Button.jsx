import './ui.css'
import { Spinner } from './Spinner'

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  iconLeft,
  iconRight,
  block = false,
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn-${variant} btn-${size} ${loading ? 'btn-loading' : ''} ${block ? 'btn-block' : ''} ${className}`}
    >
      {loading ? (
        <Spinner size={size === 'sm' ? 14 : size === 'lg' ? 20 : 17} color="white" />
      ) : (
        <>
          {iconLeft  && <span className="btn-icon btn-icon-left">{iconLeft}</span>}
          {children}
          {iconRight && <span className="btn-icon btn-icon-right">{iconRight}</span>}
        </>
      )}
    </button>
  )
}
