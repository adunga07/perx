import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { GlassCard }   from '../../components/ui/GlassCard'
import { Button }      from '../../components/ui/Button'
import { Avatar }      from '../../components/ui/Avatar'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { payments }    from '../../mock/payments'
import { perks }       from '../../mock/perks'
import { formatPrice, formatDate } from '../../lib/utils'
import './ProviderDashboard.css'

const PROVIDER_BIZ = 'biz-1'

const WEEKLY = [
  { day: 'Mon', value: 32000 },
  { day: 'Tue', value: 45000 },
  { day: 'Wed', value: 38000 },
  { day: 'Thu', value: 51000 },
  { day: 'Fri', value: 67000 },
  { day: 'Sat', value: 82000 },
  { day: 'Sun', value: 48000 },
]

const STATS = [
  { icon: '💰', label: 'Revenue / Month', value: '286,000 L', delta: '+12%', up: true  },
  { icon: '🔄', label: 'Redemptions',      value: '87',        delta: '+8%',  up: true  },
  { icon: '🎁', label: 'Active Offers',    value: '3',         delta: '—',    up: null  },
  { icon: '⭐', label: 'Avg Rating',        value: '4.8 / 5',  delta: '+0.2', up: true  },
]

function Sparkline({ data, color = '#f59e0b', height = 100 }) {
  if (data.length < 2) return null
  const vals  = data.map(d => d.value)
  const min   = Math.min(...vals)
  const max   = Math.max(...vals)
  const range = max - min || 1
  const W = 100 / (data.length - 1)

  const pts = data.map((d, i) => ({
    x: i * W,
    y: 5 + (1 - (d.value - min) / range) * 85,
  }))

  const linePath = pts.reduce((acc, p, i) => {
    if (i === 0) return `M${p.x},${p.y}`
    const prev = pts[i - 1]
    const cx   = (prev.x + p.x) / 2
    return `${acc} C${cx},${prev.y} ${cx},${p.y} ${p.x},${p.y}`
  }, '')

  const last = pts[pts.length - 1]
  const areaPath = `${linePath} L${last.x},100 L0,100 Z`

  return (
    <div className="pd-sparkline-wrap" style={{ height }}>
      <svg
        className="pd-sparkline"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="sg-provider" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0"    />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#sg-provider)" />
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.5" fill={color} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
    </div>
  )
}

export function ProviderDashboard() {
  const navigate  = useNavigate()
  const user      = useAuthStore(s => s.user)
  const myPayments = payments.filter(p => p.businessId === PROVIDER_BIZ).slice(0, 6)
  const myPerks    = perks.filter(p => p.businessId === PROVIDER_BIZ)
  const topPerks   = [...myPerks].sort((a, b) => b.used - a.used)
  const maxUsed    = topPerks[0]?.used || 1

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="pd-root">

      {/* ── Header ── */}
      <div className="pd-header">
        <p className="pd-kicker">Provider Dashboard</p>
        <h1 className="pd-title">{greeting}{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋</h1>
        <p className="pd-subtitle">Here's how your offers are performing today.</p>
      </div>

      {/* ── Stats ── */}
      <div className="pd-stats">
        {STATS.map(s => (
          <GlassCard key={s.label} className="pd-stat" padding="md" glow>
            <div className="pd-stat-top">
              <div className="pd-stat-icon">{s.icon}</div>
              {s.delta !== '—' && (
                <span className={`pd-stat-delta ${s.up ? 'up' : 'down'}`}>
                  {s.up ? '↑' : '↓'} {s.delta}
                </span>
              )}
            </div>
            <div className="pd-stat-value">{s.value}</div>
            <div className="pd-stat-label">{s.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="pd-charts-row">

        {/* Revenue chart */}
        <GlassCard className="pd-chart-card" padding="lg">
          <div className="pd-card-header">
            <h3 className="pd-card-title">Revenue — Last 7 Days</h3>
            <div className="pd-chart-meta">
              <span className="pd-chart-total">363,000 L</span>
              <span className="pd-chart-sub">this week</span>
            </div>
          </div>
          <Sparkline data={WEEKLY} color="#f59e0b" height={100} />
          <div className="pd-chart-labels">
            {WEEKLY.map(d => (
              <span key={d.day} className="pd-chart-label">{d.day}</span>
            ))}
          </div>
        </GlassCard>

        {/* Top perks */}
        <GlassCard className="pd-chart-card" padding="lg">
          <div className="pd-card-header">
            <h3 className="pd-card-title">Top Offers</h3>
          </div>
          <div className="pd-top-perks">
            {topPerks.map((p, i) => (
              <div key={p.id} className="pd-top-perk-row">
                <span className="pd-top-rank">#{i + 1}</span>
                <div className="pd-top-info">
                  <span className="pd-top-name">{p.title}</span>
                  <div className="pd-top-bar-track">
                    <div
                      className="pd-top-bar-fill"
                      style={{ width: `${(p.used / maxUsed) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="pd-top-count">{p.used} used</span>
              </div>
            ))}
          </div>
        </GlassCard>

      </div>

      {/* ── Recent Redemptions ── */}
      <div className="pd-table-section">
        <GlassCard padding="lg">
          <div className="pd-table-header">
            <h3 className="pd-card-title">Recent Redemptions</h3>
            <button className="pd-table-link" onClick={() => navigate('/provider/offers')}>
              View all →
            </button>
          </div>
          <table className="pd-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Employee</th>
                <th>Offer</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {myPayments.map(p => (
                <tr key={p.id}>
                  <td><span className="pd-txn-id">{p.id}</span></td>
                  <td>
                    <div className="pd-employee-cell">
                      <Avatar name={p.employeeName} size="sm" />
                      {p.employeeName}
                    </div>
                  </td>
                  <td>{p.perkTitle}</td>
                  <td><span className="pd-amount">{formatPrice(p.amount, p.currency)}</span></td>
                  <td>{formatDate(p.date)}</td>
                  <td><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </div>

      {/* ── Quick Actions ── */}
      <div className="pd-actions">
        <Button variant="primary" onClick={() => navigate('/provider/offers/new')}>
          + Add New Offer
        </Button>
        <Button variant="ghost" onClick={() => navigate('/provider/offers')}>
          View All Offers
        </Button>
        <Button variant="ghost" onClick={() => navigate('/provider/profile')}>
          Edit Profile
        </Button>
      </div>

    </div>
  )
}
