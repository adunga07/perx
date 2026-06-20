import './ui.css'

export function GlassCard({
  children,
  className = '',
  style,
  glow = false,
  padding = 'md',
  onClick,
}) {
  const paddingClass = padding ? `glass-card-p-${padding}` : ''
  const clickable    = onClick ? 'glass-card-clickable' : ''

  return (
    <div
      className={`glass-card ${paddingClass} ${glow ? 'glass-card-glow' : ''} ${clickable} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
