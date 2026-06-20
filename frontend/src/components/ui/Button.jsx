// TODO: variants: primary / ghost / danger
export function Button({ children, variant = 'primary', size = 'md', loading, onClick, type = 'button' }) {
  return <button type={type} onClick={onClick}>{children}</button>
}

