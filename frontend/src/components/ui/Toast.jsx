// TODO: top-right notification pop
export function Toast({ message, type = 'info', duration = 3000 }) {
  return <div className={	oast toast-${type}}>{message}</div>
}

