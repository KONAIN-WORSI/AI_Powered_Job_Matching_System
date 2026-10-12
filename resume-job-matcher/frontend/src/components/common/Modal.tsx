import type { PropsWithChildren } from 'react'

interface ModalProps extends PropsWithChildren {
  open: boolean
  onClose: () => void
  title: string
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null
  return (
    <div role="presentation" onClick={onClose}>
      <section
        aria-labelledby="modal-title"
        aria-modal="true"
        className="panel"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="modal-title">{title}</h2>
        {children}
        <button type="button" onClick={onClose}>Close</button>
      </section>
    </div>
  )
}
