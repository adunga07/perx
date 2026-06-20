import { useState, useEffect, Component } from 'react'
import { useNavigate } from 'react-router-dom'
import { Scene3D } from './Scene3D'
import { useAuthStore } from '../store/authStore'
import { useEmployeeStore } from '../store/employeeStore'
import './LoginPage.css'

class SceneErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { failed: false } }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(err) { console.error('[Scene3D error]', err) }
  render() { return this.state.failed ? null : this.props.children }
}

const ROLES = [
  { id: 'employee', icon: '👤', en: 'Employee', sq: 'Punonjës',   desc_en: 'Browse & redeem your benefits',       desc_sq: 'Shfleto dhe merr përfitimet',  color: '#7c3aed' },
  { id: 'employer', icon: '🏢', en: 'Employer', sq: 'Punëdhënës', desc_en: 'Fund & manage team welfare',           desc_sq: 'Financo mirëqenien e ekipit',  color: '#06b6d4' },
  { id: 'provider', icon: '🏪', en: 'Provider', sq: 'Ofrues',     desc_en: 'List your services & deals',          desc_sq: 'Listo shërbimet dhe ofertat',  color: '#f59e0b' },
]

const CATEGORIES = [
  { icon: '🏋️', en: 'Fitness',  sq: 'Sport',     color: '#ef4444' },
  { icon: '✈️', en: 'Travel',   sq: 'Udhëtim',   color: '#3b82f6' },
  { icon: '🍽️', en: 'Dining',   sq: 'Restorante', color: '#f97316' },
  { icon: '🏥', en: 'Health',   sq: 'Shëndet',   color: '#22c55e' },
  { icon: '📚', en: 'Learning', sq: 'Arsim',     color: '#a855f7' },
  { icon: '📱', en: 'Telecom',  sq: 'Telecom',   color: '#06b6d4' },
]

const T = {
  en: {
    headline1: 'Your benefits.',
    headline2: 'Your way.',
    email: 'your@company.com',
    password: 'Password',
    company: 'Company name',
    signIn: 'Sign In',
    or: 'or',
    haveAccount: 'Already have an account? Sign in',
    noAccount: "Don't have an account? Sign up",
  },
  sq: {
    headline1: 'Përfitimet tuaja.',
    headline2: 'Rruga juaj.',
    email: 'email@kompania.al',
    password: 'Fjalëkalimi',
    company: 'Emri i kompanisë',
    signIn: 'Hyr',
    or: 'ose',
    haveAccount: 'Keni llogari? Hyni këtu',
    noAccount: 'Nuk keni llogari? Regjistrohuni',
  },
}

export function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const persistLang = useAuthStore((state) => state.setLang)
  const savedLang = useAuthStore((state) => state.lang)

  const [role, setRole]       = useState('employee')
  const [lang, setLang]       = useState(savedLang ?? 'en')
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail]     = useState('')
  const [password, setPass]   = useState('')
  const [name, setName]       = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])
  useEffect(() => {
    persistLang(lang)
  }, [lang, persistLang])

  const t   = T[lang]
  const cur = ROLES.find(r => r.id === role)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    window.setTimeout(() => {
      if (role === 'employee') {
        const employees = useEmployeeStore.getState().employees
        const match = employees.find((emp) => emp.email === email)

        if (!match) {
          setError('No employee account found with this email.')
          setLoading(false)
          return
        }
        if (match.password !== password) {
          setError('Incorrect password.')
          setLoading(false)
          return
        }

        login({
          user: { name: match.name, email: match.email, department: match.department },
          role: 'employee',
          token: `mock-employee-${Date.now()}`,
          lang,
        })
        setLoading(false)
        navigate('/onboarding')
        return
      }

      // employer / provider — no credential check (mock)
      const user = {
        name: name || email.split('@')[0] || 'User',
        email,
        company: company || null,
      }
      login({ user, role, token: `mock-${role}-${Date.now()}`, lang })
      setLoading(false)
      navigate(`/${role}`)
    }, 500)
  }

  return (
    <div className="login-root">
      <SceneErrorBoundary><Scene3D /></SceneErrorBoundary>
      <div className="bg-glow" />

      <div
        className={`login-card ${visible ? 'visible' : ''}`}
        style={{ '--role-color': cur.color }}
      >
        {/* header */}
        <div className="card-header">
          <div className="perx-logo">
            <svg className="logo-hex" viewBox="0 0 40 40" fill="none">
              <polygon points="20,3 36,11.5 36,28.5 20,37 4,28.5 4,11.5" fill="url(#hg)" />
              <polygon points="20,3 36,11.5 20,20" fill="rgba(255,255,255,0.25)" />
              <polygon points="20,20 36,28.5 20,37" fill="rgba(255,255,255,0.1)" />
              <polygon points="20,3 20,20 4,11.5" fill="rgba(255,255,255,0.15)" />
              <defs>
                <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <span className="logo-word">Perx</span>
          </div>

          <div className="lang-pills">
            <button className={lang === 'sq' ? 'active' : ''} onClick={() => setLang('sq')}>
              🇦🇱 SQ
            </button>
            <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>
              🇬🇧 EN
            </button>
          </div>
        </div>

        {/* headline */}
        <h1 className="headline">
          {t.headline1}<br />
          <span className="shine-text">{t.headline2}</span>
        </h1>

        {/* role tabs */}
        <div className="role-tabs">
          {ROLES.map(r => (
            <button
              key={r.id}
              className={`role-tab ${role === r.id ? 'active' : ''}`}
              style={{ '--role-color': r.color }}
              onClick={() => setRole(r.id)}
            >
              <span className="tab-icon">{r.icon}</span>
              {lang === 'sq' ? r.sq : r.en}
            </button>
          ))}
        </div>

        <p className="role-desc">
          {lang === 'sq' ? cur.desc_sq : cur.desc_en}
        </p>

        {/* form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {isSignUp && role !== 'employee' && (
            <div className="field-wrap">
              <span className="field-ico">👤</span>
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}

          {isSignUp && role !== 'employee' && (
            <div className="field-wrap">
              <span className="field-ico">🏢</span>
              <input
                type="text"
                placeholder={t.company}
                value={company}
                onChange={e => setCompany(e.target.value)}
              />
            </div>
          )}

          <div className="field-wrap">
            <span className="field-ico">✉️</span>
            <input
              type="email"
              placeholder={t.email}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field-wrap">
            <span className="field-ico">🔒</span>
            <input
              type="password"
              placeholder={t.password}
              value={password}
              onChange={e => setPass(e.target.value)}
              required
            />
          </div>

          {error && (
            <p style={{ margin: '0 0 4px', color: '#fca5a5', fontSize: '0.84rem', textAlign: 'center' }}>
              {error}
            </p>
          )}

          <button type="submit" className={`submit-btn ${loading ? 'loading' : ''}`}>
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <span>{t.signIn}</span>
                <em className="btn-arrow">→</em>
              </>
            )}
          </button>
        </form>

        {role !== 'employee' && <div className="or-divider"><span>{t.or}</span></div>}

        {role !== 'employee' && (
          <button className="switch-link" onClick={() => setIsSignUp(s => !s)}>
            {isSignUp ? t.haveAccount : t.noAccount}
          </button>
        )}

        {/* benefit category pills */}
        <div className="cat-pills">
          {CATEGORIES.map(c => (
            <span
              key={c.en}
              className="cat-pill"
              style={{ '--pill-color': c.color }}
            >
              {c.icon} {lang === 'sq' ? c.sq : c.en}
            </span>
          ))}
        </div>

        <div className="al-badge">
          <span>🇦🇱</span>
          Made for Albania · Open to the world
        </div>
      </div>
    </div>
  )
}
