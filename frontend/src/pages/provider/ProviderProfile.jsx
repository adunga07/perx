import { useState, useRef } from 'react'
import { useAuthStore } from '../../store/authStore'
import { GlassCard } from '../../components/ui/GlassCard'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Avatar } from '../../components/ui/Avatar'
import { toast } from '../../store/notificationStore'
import { CATEGORIES } from '../../lib/constants'
import './ProviderProfile.css'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const DEFAULT_HOURS = Object.fromEntries(
  DAYS.map(d => [d, { open: d !== 'Sunday', from: '09:00', to: '18:00' }])
)

const TEAM_SIZES = ['1-5', '5-10', '10-25', '25-50', '50+']

export function ProviderProfile() {
  const user = useAuthStore(s => s.user)

  const [profile, setProfile] = useState({
    name:        user?.name ?? 'My Business',
    description: '',
    phone:       '+355 69 ',
    email:       user?.email ?? '',
    website:     '',
    instagram:   '',
    address:     'Tiranë, Shqipëri',
    founded:     '2020',
    teamSize:    '1-10',
    logo:        null,
    banner:      null,
  })

  const [hours, setHours]       = useState(DEFAULT_HOURS)
  const [editing, setEditing]   = useState(false)
  const [saving, setSaving]     = useState(false)
  const [activeCats, setActiveCats] = useState(['fitness', 'health'])

  const logoRef   = useRef()
  const bannerRef = useRef()

  function setProp(key, value) {
    setProfile(p => ({ ...p, [key]: value }))
  }

  function toggleDay(day) {
    setHours(h => ({ ...h, [day]: { ...h[day], open: !h[day].open } }))
  }

  function setDayTime(day, field, value) {
    setHours(h => ({ ...h, [day]: { ...h[day], [field]: value } }))
  }

  function toggleCategory(id) {
    setActiveCats(cats =>
      cats.includes(id) ? cats.filter(c => c !== id) : [...cats, id]
    )
  }

  function handleLogoChange(e) {
    const file = e.target.files?.[0]
    if (file) setProp('logo', URL.createObjectURL(file))
  }

  function handleBannerChange(e) {
    const file = e.target.files?.[0]
    if (file) setProp('banner', URL.createObjectURL(file))
  }

  async function handleSave() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 900))
    setSaving(false)
    setEditing(false)
    toast.success('Profile saved successfully!')
  }

  function handleCancel() {
    setEditing(false)
  }

  const activeCategories = CATEGORIES.filter(c => activeCats.includes(c.id))

  return (
    <div className="pp-root">

      {/* ── BANNER ── */}
      <div
        className="pp-banner"
        style={profile.banner ? { backgroundImage: `url(${profile.banner})` } : undefined}
      >
        <div className="pp-banner-overlay" />

        {editing && (
          <>
            <input
              ref={bannerRef}
              type="file"
              accept="image/*"
              className="pp-file-input"
              onChange={handleBannerChange}
            />
            <button className="pp-banner-change" onClick={() => bannerRef.current?.click()}>
              📷 Change cover
            </button>
          </>
        )}

        <div className="pp-logo-wrap">
          <div className="pp-logo" onClick={editing ? () => logoRef.current?.click() : undefined}>
            {profile.logo
              ? <img src={profile.logo} alt="Business logo" className="pp-logo-img" />
              : <Avatar name={profile.name} size="2xl" />
            }
            {editing && <div className="pp-logo-overlay">📷</div>}
          </div>
          <input
            ref={logoRef}
            type="file"
            accept="image/*"
            className="pp-file-input"
            onChange={handleLogoChange}
          />
        </div>
      </div>

      {/* ── HEADER INFO ── */}
      <div className="pp-header-info">
        <div className="pp-name-row">
          {editing
            ? <input
                className="pp-name-input"
                value={profile.name}
                onChange={e => setProp('name', e.target.value)}
                placeholder="Business name"
              />
            : <h1 className="pp-name">{profile.name}</h1>
          }
          <span className="pp-verified">✓ Verified</span>
        </div>

        <div className="pp-meta-row">
          <span className="pp-location">🇦🇱 Tiranë, Shqipëri</span>
          {activeCategories.slice(0, 2).map(c => (
            <Badge key={c.id} color="amber">{c.icon} {c.label}</Badge>
          ))}
        </div>

        <div className="pp-actions-row">
          {editing ? (
            <>
              <Button variant="primary" loading={saving} onClick={handleSave}>
                Save Changes
              </Button>
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setEditing(true)} iconLeft="✏️">
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* ── STATS STRIP ── */}
      <div className="pp-stats">
        <StatCard icon="🎁" label="Active Offers"  value="4" />
        <StatCard icon="🔄" label="Redemptions"    value="128" />
        <StatCard icon="⭐" label="Avg Rating"      value="4.7 / 5" />
        <StatCard icon="💰" label="Revenue / Month" value="142,500 L" />
      </div>

      {/* ── CONTENT GRID ── */}
      <div className="pp-grid">

        {/* ABOUT */}
        <GlassCard className="pp-section" padding="lg">
          <h2 className="pp-section-title">About</h2>

          {editing
            ? <textarea
                className="pp-textarea"
                rows={4}
                placeholder="Describe your business, what makes you unique, and what employees can expect..."
                value={profile.description}
                onChange={e => setProp('description', e.target.value)}
              />
            : <p className="pp-description">
                {profile.description || (
                  <span className="pp-placeholder">
                    No description yet — click Edit Profile to add one.
                  </span>
                )}
              </p>
          }

          <div className="pp-fields">
            <div className="pp-field">
              <span className="pp-field-label">Founded</span>
              {editing
                ? <input
                    className="pp-input"
                    value={profile.founded}
                    onChange={e => setProp('founded', e.target.value)}
                    placeholder="e.g. 2018"
                  />
                : <span className="pp-field-value">{profile.founded || '—'}</span>
              }
            </div>
            <div className="pp-field">
              <span className="pp-field-label">Team Size</span>
              {editing
                ? <select
                    className="pp-input"
                    value={profile.teamSize}
                    onChange={e => setProp('teamSize', e.target.value)}
                  >
                    {TEAM_SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
                  </select>
                : <span className="pp-field-value">{profile.teamSize} employees</span>
              }
            </div>
          </div>
        </GlassCard>

        {/* CONTACT */}
        <GlassCard className="pp-section" padding="lg">
          <h2 className="pp-section-title">Contact & Location</h2>
          <div className="pp-fields">
            <ContactField
              icon="📞" label="Phone"
              value={profile.phone} editing={editing}
              onChange={v => setProp('phone', v)}
            />
            <ContactField
              icon="✉️" label="Email"
              value={profile.email} editing={editing}
              onChange={v => setProp('email', v)}
              placeholder="you@business.al"
            />
            <ContactField
              icon="🌐" label="Website"
              value={profile.website} editing={editing}
              onChange={v => setProp('website', v)}
              placeholder="https://yourbusiness.al"
            />
            <ContactField
              icon="📸" label="Instagram"
              value={profile.instagram} editing={editing}
              onChange={v => setProp('instagram', v)}
              placeholder="@yourbusiness"
            />
            <ContactField
              icon="📍" label="Address"
              value={profile.address} editing={editing}
              onChange={v => setProp('address', v)}
              placeholder="Street, City"
            />
          </div>
        </GlassCard>

        {/* CATEGORIES */}
        <GlassCard className="pp-section" padding="lg">
          <h2 className="pp-section-title">Categories</h2>
          <div className="pp-cat-grid">
            {CATEGORIES.map(cat => {
              const active = activeCats.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  className={`pp-cat-chip ${active ? 'pp-cat-active' : ''}`}
                  style={active ? { '--cat-color': cat.color } : undefined}
                  onClick={editing ? () => toggleCategory(cat.id) : undefined}
                  disabled={!editing}
                  aria-pressed={active}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  {active && editing && <span className="pp-cat-remove" aria-hidden>×</span>}
                </button>
              )
            })}
          </div>
          {!editing && <p className="pp-hint">Edit profile to change categories</p>}
        </GlassCard>

        {/* OPERATING HOURS */}
        <GlassCard className="pp-section" padding="lg">
          <h2 className="pp-section-title">Operating Hours</h2>
          <div className="pp-hours">
            {DAYS.map(day => (
              <div key={day} className="pp-hours-row">
                <span className="pp-day">{day.slice(0, 3)}</span>

                {editing
                  ? <label className="pp-toggle">
                      <input
                        type="checkbox"
                        checked={hours[day].open}
                        onChange={() => toggleDay(day)}
                      />
                      <span className="pp-toggle-track" />
                    </label>
                  : <span className={`pp-open-dot ${hours[day].open ? 'open' : 'closed'}`} />
                }

                {hours[day].open
                  ? editing
                    ? <div className="pp-time-range">
                        <input
                          type="time"
                          className="pp-time-input"
                          value={hours[day].from}
                          onChange={e => setDayTime(day, 'from', e.target.value)}
                        />
                        <span>—</span>
                        <input
                          type="time"
                          className="pp-time-input"
                          value={hours[day].to}
                          onChange={e => setDayTime(day, 'to', e.target.value)}
                        />
                      </div>
                    : <span className="pp-time-text">{hours[day].from} — {hours[day].to}</span>
                  : <span className="pp-closed">Closed</span>
                }
              </div>
            ))}
          </div>
        </GlassCard>

      </div>
    </div>
  )
}

function StatCard({ icon, label, value }) {
  return (
    <GlassCard className="pp-stat" glow>
      <span className="pp-stat-icon">{icon}</span>
      <span className="pp-stat-value">{value}</span>
      <span className="pp-stat-label">{label}</span>
    </GlassCard>
  )
}

function ContactField({ icon, label, value, editing, onChange, placeholder = '' }) {
  return (
    <div className="pp-contact-field">
      <span className="pp-contact-icon">{icon}</span>
      <div className="pp-contact-body">
        <span className="pp-contact-label">{label}</span>
        {editing
          ? <input
              className="pp-input"
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder={placeholder}
            />
          : <span className="pp-contact-value">
              {value || <span className="pp-placeholder">—</span>}
            </span>
        }
      </div>
    </div>
  )
}
