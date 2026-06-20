import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlassCard }  from '../../components/ui/GlassCard'
import { Button }     from '../../components/ui/Button'
import { Modal }      from '../../components/ui/Modal'
import { EmptyState } from '../../components/ui/EmptyState'
import { toast }      from '../../store/notificationStore'
import { perks as PERKS } from '../../mock/perks'
import { formatPrice, discountedPrice } from '../../lib/utils'
import './OfferListings.css'

const PROVIDER_BIZ = 'biz-1'

const CATEGORY_ICONS = {
  fitness: '🏋️', food: '🍽️', health: '💊', travel: '✈️',
  learning: '📚', wellness: '🧘', retail: '🛍️', telecom: '📱', childcare: '🧒',
}

export function OfferListings() {
  const navigate = useNavigate()

  const [offers, setOffers]       = useState(
    PERKS.filter(p => p.businessId === PROVIDER_BIZ)
  )
  const [search, setSearch]       = useState('')
  const [filter, setFilter]       = useState('all')
  const [toDelete, setToDelete]   = useState(null)

  const filtered = offers.filter(o => {
    const matchSearch = !search ||
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchFilter =
      filter === 'all'      ? true :
      filter === 'active'   ? o.status === 'active' :
      filter === 'inactive' ? o.status === 'inactive' : true
    return matchSearch && matchFilter
  })

  function toggleStatus(id) {
    setOffers(prev => prev.map(o =>
      o.id === id
        ? { ...o, status: o.status === 'active' ? 'inactive' : 'active' }
        : o
    ))
    const offer = offers.find(o => o.id === id)
    const next  = offer?.status === 'active' ? 'inactive' : 'active'
    toast.success(`"${offer?.title}" is now ${next}.`)
  }

  function confirmDelete() {
    setOffers(prev => prev.filter(o => o.id !== toDelete.id))
    toast.success(`"${toDelete.title}" has been removed.`)
    setToDelete(null)
  }

  function handleEdit(offer) {
    navigate('/provider/offers/new', { state: { editing: true, perk: offer } })
  }

  return (
    <div className="ol-root">

      {/* ── Header ── */}
      <div className="ol-header">
        <div className="ol-header-text">
          <p className="ol-kicker">My Offers</p>
          <h1 className="ol-title">Offer Listings</h1>
        </div>
        <Button variant="primary" onClick={() => navigate('/provider/offers/new')}>
          + Add Offer
        </Button>
      </div>

      {/* ── Toolbar ── */}
      <div className="ol-toolbar">
        <div className="ol-search">
          <span className="ol-search-icon">🔍</span>
          <input
            placeholder="Search offers…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="ol-filters">
          {['all', 'active', 'inactive'].map(f => (
            <button
              key={f}
              className={`ol-filter-pill ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div className="ol-empty">
          <GlassCard padding="lg">
            <EmptyState
              icon={search ? '🔍' : '🎁'}
              title={search ? 'No offers match your search' : 'No offers yet'}
              message={search
                ? 'Try a different search term or clear the filter.'
                : 'Add your first offer to start reaching employees on Perx.'
              }
              actionLabel={!search ? '+ Add First Offer' : undefined}
              onAction={!search ? () => navigate('/provider/offers/new') : undefined}
            />
          </GlassCard>
        </div>
      ) : (
        <div className="ol-grid">
          {filtered.map(offer => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onToggle={() => toggleStatus(offer.id)}
              onEdit={() => handleEdit(offer)}
              onDelete={() => setToDelete(offer)}
            />
          ))}
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      <Modal
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete Offer"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setToDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <div className="ol-delete-body">
          <div className="ol-delete-icon">🗑️</div>
          <p className="ol-delete-text">
            Are you sure you want to delete{' '}
            <span className="ol-delete-name">{toDelete?.title}</span>?
            This action cannot be undone.
          </p>
        </div>
      </Modal>

    </div>
  )
}

function OfferCard({ offer, onToggle, onEdit, onDelete }) {
  const final = discountedPrice(offer.price, offer.discount)
  const catIcon = CATEGORY_ICONS[offer.category] ?? '🎁'

  return (
    <GlassCard className="ol-card">
      {/* Image */}
      <div className="ol-card-img">
        {offer.image
          ? <img src={offer.image} alt={offer.title} />
          : <div className="ol-card-img-placeholder">{catIcon}</div>
        }
        {offer.discount > 0 && (
          <span className="ol-discount-badge">-{offer.discount}%</span>
        )}
        <span className={`ol-status-dot ${offer.status}`}>
          {offer.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Body */}
      <div className="ol-card-body">
        <h3 className="ol-card-title">{offer.title}</h3>

        <div className="ol-card-tags">
          {offer.tags.slice(0, 3).map(t => (
            <span key={t} className="ol-card-tag">{t}</span>
          ))}
        </div>

        <div className="ol-card-pricing">
          {offer.discount > 0 && (
            <span className="ol-old-price">{formatPrice(offer.price, offer.currency)}</span>
          )}
          <span className="ol-new-price">{formatPrice(final, offer.currency)}</span>
        </div>

        <div className="ol-card-meta">
          <span className="ol-used">
            🔄 {offer.used} used
            {offer.quantity ? ` / ${offer.quantity} qty` : ''}
          </span>

          <label className="ol-toggle">
            <input
              type="checkbox"
              checked={offer.status === 'active'}
              onChange={onToggle}
            />
            <span className="ol-toggle-track" />
            <span className="ol-toggle-label">
              {offer.status === 'active' ? 'On' : 'Off'}
            </span>
          </label>
        </div>

        <div className="ol-card-actions">
          <Button variant="ghost" size="sm" onClick={onEdit} block>
            ✏️ Edit
          </Button>
          <Button variant="danger" size="sm" onClick={onDelete}>
            🗑️
          </Button>
        </div>
      </div>
    </GlassCard>
  )
}
