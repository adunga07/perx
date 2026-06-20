import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import './ui.css'

const ICONS = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' }

function ToastItem({ id, message, type = 'info', duration = 3500, onDismiss }) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const hideTimer = setTimeout(() => setExiting(true), duration)
    return () => clearTimeout(hideTimer)
  }, [duration])

  useEffect(() => {
    if (!exiting) return
    const removeTimer = setTimeout(() => onDismiss?.(id), 300)
    return () => clearTimeout(removeTimer)
  }, [exiting, id, onDismiss])

  return (
    <div
      className={`toast toast-${type} ${exiting ? 'toast-exit' : 'toast-enter'}`}
      onClick={() => setExiting(true)}
      role="alert"
    >
      <span className="toast-icon" aria-hidden>{ICONS[type]}</span>
      <span className="toast-message">{message}</span>
      <button
        className="toast-close"
        onClick={e => { e.stopPropagation(); setExiting(true) }}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}

export function ToastContainer({ toasts = [], onDismiss }) {
  return createPortal(
    <div className="toast-container" aria-live="polite">
      {toasts.map(t => (
        <ToastItem key={t.id} {...t} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body
  )
}

export function Toast(props) {
  return <ToastItem {...props} />
}
