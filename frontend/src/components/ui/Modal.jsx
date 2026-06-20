// TODO: backdrop + centered dialog
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null
  return <div className='modal-backdrop'><div className='modal'>{children}</div></div>
}

