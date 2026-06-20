import './ui.css'

export function Badge({ children, color = 'purple', dot = false, large = false }) {
  return (
    <span className={`badge badge-${color} ${large ? 'badge-discount' : ''}`}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  )
}
