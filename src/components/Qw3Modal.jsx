export default function Qw3Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="modal show">
      <div className="modal__overlay" onClick={onClose}></div>
      <div className="modal__content">
        {children}
      </div>
    </div>
  )
}