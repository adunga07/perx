export const ROLES = ['employee', 'employer', 'provider']

export const ROLE_COLORS = {
  employee: '#7c3aed',
  employer: '#06b6d4',
  provider: '#f59e0b',
}

export const CATEGORIES = [
  { id: 'fitness',   label: 'Fitness',    labelSq: 'Fitness',     icon: '🏋️', color: '#7c3aed' },
  { id: 'food',      label: 'Food',       labelSq: 'Ushqim',      icon: '🍽️', color: '#f59e0b' },
  { id: 'health',    label: 'Health',     labelSq: 'Shëndet',     icon: '💊', color: '#10b981' },
  { id: 'travel',    label: 'Travel',     labelSq: 'Udhëtim',     icon: '✈️', color: '#06b6d4' },
  { id: 'learning',  label: 'Learning',   labelSq: 'Arsim',       icon: '📚', color: '#818cf8' },
  { id: 'wellness',  label: 'Wellness',   labelSq: 'Mirëqenie',   icon: '🧘', color: '#34d399' },
  { id: 'retail',    label: 'Retail',     labelSq: 'Shitje',      icon: '🛍️', color: '#f472b6' },
  { id: 'telecom',   label: 'Telecom',    labelSq: 'Telekom',     icon: '📱', color: '#60a5fa' },
  { id: 'childcare', label: 'Childcare',  labelSq: 'Kujdes fëmijë', icon: '🧒', color: '#fb923c' },
]

export const CURRENCIES = {
  ALL: { symbol: 'L',  name: 'Albanian Lek',  locale: 'sq-AL', decimals: 0 },
  EUR: { symbol: '€',  name: 'Euro',          locale: 'de-DE', decimals: 2 },
  USD: { symbol: '$',  name: 'US Dollar',     locale: 'en-US', decimals: 2 },
}

export const STATUS_COLORS = {
  pending:    '#f59e0b',
  approved:   '#10b981',
  rejected:   '#ef4444',
  expired:    '#6b7280',
  processing: '#38bdf8',
  paid:       '#10b981',
}

export const DEFAULT_CURRENCY = 'ALL'
export const DEFAULT_LANG     = 'en'
