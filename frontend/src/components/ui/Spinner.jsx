import './ui.css'

export function Spinner({ size = 20, color = 'purple' }) {
  const borderWidth = Math.max(2, Math.round(size / 9))
  return (
    <span
      className={`spinner spinner-${color}`}
      style={{ width: size, height: size, borderWidth }}
      aria-label="Loading"
    />
  )
}
