import './OnboardingWizard.css'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const TAG_GROUPS = [
  {
    id: 'wellbeing',
    title: 'Wellbeing',
    description: 'Things that help you feel good day to day',
    accent: '#22c55e',
    tags: ['Gym', 'Yoga', 'Meditation', 'Therapy', 'Spa'],
  },
  {
    id: 'food',
    title: 'Food & coffee',
    description: 'Lunch, coffee, and easy break moments',
    accent: '#f97316',
    tags: ['Lunch', 'Coffee', 'Healthy food', 'Restaurants', 'Snacks'],
  },
  {
    id: 'life',
    title: 'Life & leisure',
    description: 'Things you enjoy outside work',
    accent: '#3b82f6',
    tags: ['Travel', 'Movies', 'Concerts', 'Family', 'Shopping'],
  },
  {
    id: 'growth',
    title: 'Learning & growth',
    description: 'Skills, courses, and ideas to keep moving',
    accent: '#a855f7',
    tags: ['Courses', 'Books', 'Certifications', 'Language learning', 'Coaching'],
  },
]

const STEP_HINTS = [
  'Pick a few tags to start',
  'We use this to shape what you see next',
  'You can change it later',
]

const MAX_SELECTIONS = 6

export function OnboardingWizard() {
  const navigate = useNavigate()
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding)
  const user = useAuthStore((state) => state.user)
  const role = useAuthStore((state) => state.role)

  const [selectedTags, setSelectedTags] = useState([])

  const userLabel = useMemo(() => user?.name || user?.email || 'there', [user])
  const selectedPreview = selectedTags.slice(0, 4)
  const progressPercent = Math.min((selectedTags.length / MAX_SELECTIONS) * 100, 100)
  const selectionLimitReached = selectedTags.length >= MAX_SELECTIONS

  const toggleTag = (tag) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : current.length >= MAX_SELECTIONS
          ? current
          : [...current, tag],
    )
  }

  const clearTags = () => setSelectedTags([])

  const handleContinue = () => {
    completeOnboarding(selectedTags)
    navigate(`/${role}`)
  }

  if (role !== 'employee') {
    return (
      <div className="onboarding-page">
        <div className="onboarding-panel">
          <h1>This step is for employees only</h1>
          <p className="subcopy">Other roles will use a separate setup path later.</p>
          <button type="button" className="continue-btn" onClick={() => navigate(`/${role}`)}>
            Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-panel">
        <div className="onboarding-hero">
          <div>
            <p className="eyebrow">Your preferences</p>
            <h1>Hi {userLabel}, choose what you want to see first</h1>
            <p className="subcopy">
              Tap a few tags and the next screen will feel personal from the start.
            </p>
          </div>

          <div className="progress-card">
            <span className="progress-label">Selected</span>
            <strong>{selectedTags.length}</strong>
            <span className="progress-hint">of {MAX_SELECTIONS} allowed</span>
          </div>
        </div>

        <div className="progress-track">
          <span style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="onboarding-layout">
          <div className="tag-grid">
            {TAG_GROUPS.map((group) => (
              <section className="tag-group" key={group.id} style={{ '--group-accent': group.accent }}>
                <div className="tag-group-head">
                  <div>
                    <h2>{group.title}</h2>
                    <p>{group.description}</p>
                  </div>
                  <span className="tag-count">{group.tags.length}</span>
                </div>

                <div className="tag-list">
                  {group.tags.map((tag) => {
                    const active = selectedTags.includes(tag)
                    const disabled = !active && selectionLimitReached
                    return (
                      <button
                        key={tag}
                        type="button"
                        className={`interest-tag ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                        onClick={() => toggleTag(tag)}
                        aria-pressed={active}
                        disabled={disabled}
                        title={disabled ? `You can choose up to ${MAX_SELECTIONS}` : undefined}
                      >
                        {tag}
                      </button>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>

          <aside className="onboarding-summary">
            <div className="summary-card soft">
              <p className="summary-title">How this helps</p>
              <ul className="summary-list">
                {STEP_HINTS.map((hint) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ul>
            </div>

            <div className="summary-card">
              <p className="summary-title">Your choices</p>
              <p className="summary-subtitle">
                This will shape the recommendations you see first. You can choose up to {MAX_SELECTIONS}.
              </p>
              {selectionLimitReached && (
                <p className="limit-note">You reached the maximum number of choices.</p>
              )}

              {selectedPreview.length > 0 ? (
                <div className="preview-pills">
                  {selectedPreview.map((tag) => (
                    <span key={tag} className="preview-pill">
                      {tag}
                    </span>
                  ))}
                  {selectedTags.length > selectedPreview.length && (
                    <span className="preview-pill muted">
                      +{selectedTags.length - selectedPreview.length} more
                    </span>
                  )}
                </div>
              ) : (
                <p className="empty-preview">Select a few tags to continue.</p>
              )}

              <div className="summary-actions">
                <button type="button" className="ghost-btn" onClick={clearTags}>
                  Clear
                </button>

                <button type="button" className="continue-btn" onClick={handleContinue}>
                  Continue
                </button>
              </div>
            </div>
          </aside>
        </div>

        <p className="sync-note">
          Your choices are saved locally for now and can connect to stored data later.
        </p>
      </div>
    </div>
  )
}