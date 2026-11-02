"use client"

import { X } from "lucide-react"
import { type ReactNode, useEffect, useRef } from "react"

/**
 * A native modal dialog: the browser traps focus, closes it on Escape and puts the rest of the page out of reach.
 * The page behind keeps its scroll position, and the dialog's own body scrolls, so long comment threads stay
 * inside it with the close button always in view.
 */
export function Modal({
  open,
  onClose,
  label,
  closeLabel,
  children,
}: {
  open: boolean
  onClose: () => void
  label: string
  closeLabel: string
  children: ReactNode
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const box = dialog.current
    if (!box) return
    if (open && !box.open) box.showModal()
    if (!open && box.open) box.close()
  }, [open])

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: The click is on the backdrop only; Escape closes it natively.
    <dialog
      ref={dialog}
      className="board-modal"
      aria-label={label}
      onClose={() => open && onClose()}
      onClick={(event) => event.target === dialog.current && onClose()}
    >
      {open && (
        <div className="board-modal-panel">
          <button type="button" className="board-modal-close" onClick={onClose} aria-label={closeLabel}>
            <X aria-hidden="true" />
          </button>
          <div className="board-modal-body">{children}</div>
        </div>
      )}
    </dialog>
  )
}
