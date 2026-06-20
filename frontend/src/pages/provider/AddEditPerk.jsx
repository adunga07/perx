import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { GlassCard } from '../../components/ui/GlassCard'
import { Button }    from '../../components/ui/Button'
import { Tag }       from '../../components/ui/Tag'
import { toast }     from '../../store/notificationStore'
import { CATEGORIES } from '../../lib/constants'
import { discountedPrice, formatPrice } from '../../lib/utils'
import './AddEditPerk.css'

const EMPTY = {
  title:          '',
  description:    '',
  category:       'fitness',
  price:          0,
  currency:       'ALL',
  discount:       0,
  tags:           [],
  image:          null,
  validFrom:      '',
  validUntil:     '',
  quantity: '',
  status:         'active',
}

export function AddEditPerk() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const editing   = location.state?.editing ?? false
  const existing  = location.state?.perk    ?? null

  const [form, setForm]       = useState(existing ? { ...EMPTY, ...existing } : EMPTY)
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving]   = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  function setProp(key, value) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function addTag() {
    const t = tagInput.trim()
    if (t && !form.tags.includes(t)) {
      setProp('tags', [...form.tags, t])
    }
    setTagInput('')
  }

  function removeTag(t) {
    setProp('tags', form.tags.filter(x => x !== t))
  }

  function handleTagKey(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  function handleImage(file) {
    if (!file?.type.startsWith('image/')) return
    setProp('image', URL.createObjectURL(file))
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    handleImage(e.dataTransfer.files?.[0])
  }

  async function handleSave() {
    if (!form.title.trim()) {
      toast.error('Please enter a title for your offer.')
      return
    }
    if (!form.price || form.price <= 0) {
      toast.error('Please enter a valid price.')
      return
    }
    setSaving(true)
    await new Promise(r => setTimeout(r, 950))
    setSaving(false)
    toast.success(editing ? 'Offer updated!' : 'Offer created and is now live!')
    navigate('/provider/offers')
  }

  const finalPrice = discountedPrice(Number(form.price) || 0, Number(form.discount) || 0)
  const catIcon    = CATEGORIES.find(c => c.id === form.category)?.icon ?? '🎁'

  return (
    <div className="aep-root">

      {/* ── Header ── */}
      <div className="aep-header">
        <button className="aep-back" onClick={() => navigate(-1)} aria-label="Go back">
          ←
        </button>
        <div className="aep-header-text">
          <p className="aep-kicker">{editing ? 'Edit Offer' : 'New Offer'}</p>
          <h1 className="aep-title">
            {editing ? 'Update Your Offer' : 'Create a New Offer'}
          </h1>
        </div>
      </div>

      <div className="aep-body">

        {/* ── Form ── */}
        <div className="aep-form">

          {/* Basic Info */}
          <GlassCard className="aep-section" padding="lg">
            <h2 className="aep-section-title">Basic Info</h2>

            <div className="aep-field">
              <label className="aep-label">Title *</label>
              <input
                className="aep-input"
                placeholder="e.g. Monthly Gym Membership"
                value={form.title}
                onChange={e => setProp('title', e.target.value)}
              />
            </div>

            <div className="aep-field">
              <label className="aep-label">Description</label>
              <textarea
                className="aep-textarea"
                rows={3}
                placeholder="What's included? What makes this special?"
                value={form.description}
                onChange={e => setProp('description', e.target.value)}
              />
            </div>

            <div className="aep-field">
              <label className="aep-label">Category</label>
              <select
                className="aep-select"
                value={form.category}
                onChange={e => setProp('category', e.target.value)}
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
          </GlassCard>

          {/* Pricing */}
          <GlassCard className="aep-section" padding="lg">
            <h2 className="aep-section-title">Pricing</h2>

            <div className="aep-row">
              <div className="aep-field">
                <label className="aep-label">Price *</label>
                <input
                  className="aep-input"
                  type="number"
                  min="0"
                  placeholder="e.g. 3000"
                  value={form.price || ''}
                  onChange={e => setProp('price', e.target.value)}
                />
              </div>
              <div className="aep-field">
                <label className="aep-label">Currency</label>
                <select
                  className="aep-select"
                  value={form.currency}
                  onChange={e => setProp('currency', e.target.value)}
                >
                  <option value="ALL">🇦🇱 ALL — Lek</option>
                  <option value="EUR">🇪🇺 EUR — Euro</option>
                  <option value="USD">🇺🇸 USD — Dollar</option>
                </select>
              </div>
            </div>

            <div className="aep-field">
              <label className="aep-label">Discount % (0 = no discount)</label>
              <div className="aep-discount-row">
                <input
                  className="aep-input"
                  type="number"
                  min="0"
                  max="100"
                  value={form.discount}
                  onChange={e => setProp('discount', Math.min(100, Math.max(0, Number(e.target.value))))}
                />
                <input
                  type="range"
                  className="aep-slider"
                  min="0"
                  max="100"
                  value={form.discount}
                  onChange={e => setProp('discount', Number(e.target.value))}
                />
                {form.price > 0 && form.discount > 0 && (
                  <span className="aep-discount-preview">
                    → <strong>{formatPrice(finalPrice, form.currency)}</strong>
                  </span>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Media & Tags */}
          <GlassCard className="aep-section" padding="lg">
            <h2 className="aep-section-title">Media & Tags</h2>

            {/* Image */}
            <div className="aep-field">
              <label className="aep-label">Cover Image</label>
              <div
                className={`aep-dropzone ${dragOver ? 'drag-over' : ''}`}
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={e => handleImage(e.target.files?.[0])}
                />
                {form.image ? (
                  <>
                    <img src={form.image} alt="preview" className="aep-img-preview" />
                    <div className="aep-img-overlay">📷 Change</div>
                  </>
                ) : (
                  <>
                    <span className="aep-dropzone-icon">🖼️</span>
                    <span className="aep-dropzone-text">Drop image here or click to upload</span>
                    <span className="aep-dropzone-sub">PNG, JPG, WEBP — max 5 MB</span>
                  </>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="aep-field">
              <label className="aep-label">Tags</label>
              <div className="aep-tags-wrap">
                <div className="aep-tag-input-row">
                  <input
                    className="aep-input"
                    placeholder="Add a tag and press Enter…"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleTagKey}
                  />
                  <Button variant="ghost" size="sm" onClick={addTag}>Add</Button>
                </div>
                {form.tags.length > 0 && (
                  <div className="aep-tag-chips">
                    {form.tags.map(t => (
                      <Tag key={t} label={t} onRemove={() => removeTag(t)} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Schedule & Limits */}
          <GlassCard className="aep-section" padding="lg">
            <h2 className="aep-section-title">Schedule & Limits</h2>

            <div className="aep-row">
              <div className="aep-field">
                <label className="aep-label">Valid From</label>
                <input
                  className="aep-input"
                  type="date"
                  value={form.validFrom}
                  onChange={e => setProp('validFrom', e.target.value)}
                />
              </div>
              <div className="aep-field">
                <label className="aep-label">Valid Until</label>
                <input
                  className="aep-input"
                  type="date"
                  value={form.validUntil}
                  onChange={e => setProp('validUntil', e.target.value)}
                />
              </div>
            </div>

            <div className="aep-field">
              <label className="aep-label">Quantity available (leave blank for unlimited)</label>
              <input
                className="aep-input"
                type="number"
                min="1"
                placeholder="e.g. 50"
                value={form.quantity}
                onChange={e => setProp('quantity', e.target.value)}
              />
            </div>

            {/* Active toggle */}
            <div className="aep-toggle-row">
              <div className="aep-toggle-info">
                <span className="aep-toggle-label-main">Active</span>
                <span className="aep-toggle-label-sub">
                  {form.status === 'active'
                    ? 'Visible to employees on the marketplace'
                    : 'Hidden — not visible to employees'}
                </span>
              </div>
              <label className="aep-toggle">
                <input
                  type="checkbox"
                  checked={form.status === 'active'}
                  onChange={() => setProp('status', form.status === 'active' ? 'inactive' : 'active')}
                />
                <span className="aep-toggle-track" />
              </label>
            </div>
          </GlassCard>

          {/* Footer actions */}
          <div className="aep-footer">
            <Button variant="primary" loading={saving} onClick={handleSave}>
              {editing ? 'Update Offer' : 'Create Offer'}
            </Button>
            <Button variant="ghost" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>

        </div>

        {/* ── Live Preview ── */}
        <div className="aep-preview-panel">
          <span className="aep-preview-label">Live Preview</span>
          <div className="aep-preview-card">
            <div className="aep-preview-img">
              {form.image
                ? <img src={form.image} alt="preview" />
                : <div className="aep-preview-img-placeholder">{catIcon}</div>
              }
              {form.discount > 0 && (
                <span className="aep-preview-badge">-{form.discount}%</span>
              )}
            </div>
            <div className="aep-preview-body">
              <h4 className="aep-preview-title">
                {form.title || <span style={{ opacity: 0.3 }}>Offer title…</span>}
              </h4>
              {form.tags.length > 0 && (
                <div className="aep-preview-tags">
                  {form.tags.slice(0, 3).map(t => (
                    <span key={t} className="aep-preview-tag">{t}</span>
                  ))}
                </div>
              )}
              <div className="aep-preview-price">
                {form.price > 0 && form.discount > 0 && (
                  <span className="aep-preview-old">
                    {formatPrice(Number(form.price), form.currency)}
                  </span>
                )}
                <span className="aep-preview-new">
                  {form.price > 0
                    ? formatPrice(finalPrice, form.currency)
                    : <span style={{ opacity: 0.3 }}>0 L</span>
                  }
                </span>
              </div>
            </div>
          </div>
          <p className="aep-preview-hint">
            This is exactly how employees will see your offer in the marketplace.
          </p>
        </div>

      </div>
    </div>
  )
}
