import './ui.css'

export function Avatar({ src, name, size = 'md', ring = false, className = '' }) {
  const initials = name
    ? name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <div className={`avatar avatar-${size} ${ring ? 'avatar-ring' : ''} ${className}`}>
      {src
        ? <img src={src} alt={name ?? 'avatar'} className="avatar-img" />
        : <span className="avatar-initials">{initials}</span>
      }
    </div>
  )
}
