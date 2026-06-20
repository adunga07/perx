import './ui.css'
import { Button } from './Button'

export function EmptyState({
  icon = '📭',
  title,
  message,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state-icon" aria-hidden>{icon}</div>
      {title   && <h3 className="empty-state-title">{title}</h3>}
      {message && <p  className="empty-state-message">{message}</p>}
      {actionLabel && onAction && (
        <Button variant="ghost" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
