import './ui.css'

export function ProgressBar({
  value = 0,
  max = 100,
  color = 'purple',
  label,
  showPercent = false,
  thick = false,
}) {
  const pct = Math.min(100, Math.max(0, max > 0 ? (value / max) * 100 : 0))

  return (
    <div className="progress-wrap">
      {(label || showPercent) && (
        <div className="progress-label-row">
          {label      && <span className="progress-label">{label}</span>}
          {showPercent && <span className="progress-pct">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={`progress-track ${thick ? 'progress-track-lg' : ''}`}>
        <div
          className={`progress-fill progress-fill-${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
