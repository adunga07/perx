import './ui.css'

const STATUS_META = {
  pending:    { label: 'Pending',    icon: '⏳' },
  approved:   { label: 'Approved',   icon: '✓'  },
  rejected:   { label: 'Rejected',   icon: '✕'  },
  expired:    { label: 'Expired',    icon: '⊘'  },
  active:     { label: 'Active',     icon: '●'  },
  paid:       { label: 'Paid',       icon: '✓'  },
  processing: { label: 'Processing', icon: '↻'  },
}

export function StatusBadge({ status, showIcon = true, label: overrideLabel }) {
  const meta = STATUS_META[status] ?? { label: status ?? '—', icon: '•' }
  const displayLabel = overrideLabel ?? meta.label

  return (
    <span className={`status-badge status-${status}`}>
      {showIcon && <span className="status-icon" aria-hidden>{meta.icon}</span>}
      {displayLabel}
    </span>
  )
}
