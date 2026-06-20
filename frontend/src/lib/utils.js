export function formatDate(d, locale = 'en-GB') {
  if (!d) return '—'
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatPrice(n, currency = 'ALL') {
  if (n === null || n === undefined) return '—'
  if (currency === 'ALL') return `${Number(n).toLocaleString('sq-AL')} L`
  if (currency === 'EUR') return `€${Number(n).toFixed(2)}`
  return `${Number(n).toLocaleString()} ${currency}`
}

export function truncate(s, n = 80) {
  if (!s) return ''
  return s.length <= n ? s : s.slice(0, n).trimEnd() + '…'
}

export function relativeTime(d) {
  if (!d) return '—'
  const date = typeof d === 'string' ? new Date(d) : d
  const diff  = Date.now() - date.getTime()
  const mins  = Math.floor(diff / 60000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs  < 24)  return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7)   return `${days}d ago`
  return formatDate(date)
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function discountedPrice(price, discount) {
  if (!discount) return price
  return price - (price * discount) / 100
}
