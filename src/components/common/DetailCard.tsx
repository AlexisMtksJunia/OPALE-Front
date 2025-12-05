import React from 'react'
import DetailCardHeader, { DetailHeaderProps } from './DetailCardHeader'
import DetailBody from './DetailBody'
import DetailFooter, { DetailFooterProps, DetailFooterAlign } from './DetailFooter'

export type DetailCardSize = 'medium' | 'large' | 'full'

export interface DetailCardProps {
    /**
     * Titre affiché dans le header.
     */
    title: string

    /**
     * Sous-titre (code, campus, date…).
     */
    subtitle?: string

    /**
     * Badge / pill affiché à droite du header.
     */
    badge?: React.ReactNode

    /**
     * Icône affichée à gauche du titre.
     */
    icon?: React.ReactNode

    /**
     * Appelé lorsqu'on souhaite fermer la card (bouton ✕).
     */
    onRequestClose?: DetailHeaderProps['onRequestClose']

    /**
     * Alignement du contenu du header.
     */
    headerAlign?: DetailHeaderProps['align']

    /**
     * Header sticky en haut de la card.
     */
    stickyHeader?: DetailHeaderProps['sticky']

    /**
     * Contenu central de la card (formulaire, infos, sections…).
     */
    children: React.ReactNode

    /**
     * Contenu du footer (boutons).
     * Si `undefined`, aucun footer n'est rendu.
     */
    footer?: React.ReactNode

    /**
     * Alignement horizontal du footer.
     */
    footerAlign?: DetailFooterAlign

    /**
     * Ajoute une bordure séparatrice entre body et footer.
     */
    footerWithBorder?: DetailFooterProps['withBorder']

    /**
     * Active le comportement scrollable du body.
     */
    scrollBody?: boolean

    /**
     * Taille de la card (gère la largeur max).
     */
    size?: DetailCardSize

    /**
     * Classes additionnelles sur la card.
     */
    className?: string

    /**
     * Label accessible (ARIA) pour la card.
     */
    ariaLabel?: string
}

/**
 * Card de détail générique.
 * N'inclut PAS l'overlay : on l'utilise à l'intérieur de <DetailOverlay>.
 *
 * Exemple d'usage :
 * <DetailOverlay open={open} onRequestClose={close}>
 *   <DetailCard
 *     title="Détail de la salle"
 *     subtitle="F401 • Campus Lille"
 *     badge={<RoomTypePill type="TP" />}
 *     onRequestClose={close}
 *     footer={(
 *       <>
 *         <button>Annuler</button>
 *         <button>Enregistrer</button>
 *       </>
 *     )}
 *   >
 *     {...contenu...}
 *   </DetailCard>
 * </DetailOverlay>
 */
const DetailCard: React.FC<DetailCardProps> = ({
                                                   title,
                                                   subtitle,
                                                   badge,
                                                   icon,
                                                   onRequestClose,
                                                   headerAlign = 'left',
                                                   stickyHeader = false,
                                                   children,
                                                   footer,
                                                   footerAlign = 'right',
                                                   footerWithBorder = true,
                                                   scrollBody = true,
                                                   size = 'large',
                                                   className = '',
                                                   ariaLabel,
                                               }) => {
    const rootClasses = [
        'detail-card',
        `detail-card--size-${size}`,
        className,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <article
            className={rootClasses}
            aria-label={ariaLabel ?? title}
            role="document"
        >
            <DetailCardHeader
                title={title}
                subtitle={subtitle}
                badge={badge}
                icon={icon}
                onRequestClose={onRequestClose}
                align={headerAlign}
                sticky={stickyHeader}
            />

            <DetailBody scrollable={scrollBody}>{children}</DetailBody>

            {footer && (
                <DetailFooter
                    align={footerAlign}
                    withBorder={footerWithBorder}
                >
                    {footer}
                </DetailFooter>
            )}
        </article>
    )
}

export default DetailCard