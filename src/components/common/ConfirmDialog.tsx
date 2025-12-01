// src/components/common/ConfirmDialog.tsx
import React, { useEffect } from 'react'

interface ConfirmDialogProps {
    open: boolean
    title?: string
    message: React.ReactNode
    confirmLabel?: string
    cancelLabel?: string
    onConfirm: () => void
    onCancel: () => void

    // classes de boutons optionnelles
    confirmClassName?: string
    cancelClassName?: string

    // optionnel : pour “fermer seulement le popup” (ESC, croix, overlay)
    onRequestClose?: () => void
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
                                                         open,
                                                         title = 'Confirmer les modifications',
                                                         message,
                                                         confirmLabel = 'Confirmer',
                                                         cancelLabel = 'Annuler',
                                                         onConfirm,
                                                         onCancel,
                                                         confirmClassName = 'btn-primary',
                                                         cancelClassName = 'btn-tertiary',
                                                         onRequestClose,
                                                     }) => {
    if (!open) return null

    // 👇 centralise la logique de “fermeture passive”
    const handleRequestClose = () => {
        if (onRequestClose) {
            onRequestClose()
        } else {
            // fallback : se comporte comme le bouton "Annuler"
            onCancel()
        }
    }

    // ESC → ferme seulement le popup (pas la card)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return
            event.stopPropagation()
            handleRequestClose()
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onRequestClose, onCancel])

    const handleOverlayClick = () => {
        handleRequestClose()
    }

    const stopPropagation: React.MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation()
    }

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="card confirm-dialog-card" onClick={stopPropagation}>
                {/* ✕ en haut à droite */}
                <button
                    type="button"
                    className="confirm-dialog-close"
                    aria-label="Fermer la fenêtre"
                    onClick={handleRequestClose}
                >
                    ✕
                </button>

                {title && <h3 className="confirm-dialog-title">{title}</h3>}

                <div className="confirm-dialog-body">
                    {typeof message === 'string' ? <p>{message}</p> : message}
                </div>

                <div className="confirm-dialog-actions">
                    <button
                        type="button"
                        className={cancelClassName}
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        className={confirmClassName}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDialog