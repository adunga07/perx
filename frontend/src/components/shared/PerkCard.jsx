// TODO: core display unit for a PERX — used in 3 portals
import './PerkCard.css'
export function PerkCard({ perk, business, showActions, compact, onSelect, onApprove, onReject }) {
  return <div className='perk-card'>{perk?.title}</div>
}

