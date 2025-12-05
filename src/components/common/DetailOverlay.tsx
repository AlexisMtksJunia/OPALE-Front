import React, { useEffect } from 'react'

export interface DetailOverlayProps {
    open: boolean
    /** Appelé quand l'utilisateur demande à fermer (overlay, ESC, etc.) */
    onRequestClose?: () => void
    children: React.ReactNode
    /** Désactive la fermeture par clic sur le fond */
    closeOnOverlayClick?: boolean
    /** Désactive la fermeture par touche ESC */
    closeOnEsc?: boolean
    /** Label accessible pour le dialog */
    ariaLabel?: string
}

/**
 * Overlay plein écran pour toutes les cards de détail.
 * Gère :
 * - fond semi-transparent
 * - blocage du scroll en arrière-plan
 * - fermeture par ESC (optionnelle)
 * - fermeture par clic sur l’overlay (optionnelle)
 */
const DetailOverlay: React.FC<DetailOverlayProps> = ({
                                                         open,
                                                         onRequestClose,
                                                         children,
                                                         closeOnOverlayClick = true,
                                                         closeOnEsc = true,
                                                         ariaLabel = 'Fenêtre de détail',
                                                     }) => {
    // Gestion de la touche ESC
    useEffect(() => {
        if (!open || !closeOnEsc || !onRequestClose) return

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.stopPropagation()
                onRequestClose()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [open, closeOnEsc, onRequestClose])

    // Bloque le scroll de la page quand l’overlay est ouvert
    useEffect(() => {
        if (!open) return

        const previousOverflow = document.documentElement.style.overflow
        document.documentElement.style.overflow = 'hidden'

        return () => {
            document.documentElement.style.overflow = previousOverflow
        }
    }, [open])

    if (!open) return null

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!closeOnOverlayClick || !onRequestClose) return

        // On ne ferme que si le clic vient vraiment de l’overlay,
        // pas d’un élément enfant (la card de détail par exemple).
        if (event.target === event.currentTarget) {
            onRequestClose()
        }
    }

    return (
        <div
            className="detail-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            onClick={handleOverlayClick}
        >
            {/* 
                La card elle-même (RoomDetailCard, EventDetailCard, etc.)
                sera rendue dans {children}, typiquement avec sa propre
                classe .room-detail-card, .event-detail-card, etc.
            */}
            {children}
        </div>
    )
}

export default DetailOverlay