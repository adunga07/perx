import './ui.css'

export function Tag({ label, color, onRemove, colored = false }) {
  return (
    <span
      className={`tag ${colored && color ? 'tag-colored' : ''}`}
      style={color ? { '--tag-color': color } : undefined}
    >
      {label}
      {onRemove && (
        <button
          className="tag-remove"
          onClick={e => { e.stopPropagation(); onRemove() }}
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  )
}
