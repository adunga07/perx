// TODO: image or initials fallback
export function Avatar({ src, name, size = 'md' }) {
  return src ? <img src={src} alt={name} /> : <div>{name?.[0]}</div>
}

