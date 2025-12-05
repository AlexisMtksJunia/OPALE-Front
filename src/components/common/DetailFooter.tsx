import React from 'react'

export type DetailFooterAlign = 'left' | 'right' | 'space-between' | 'center'

export interface DetailFooterProps {
    /**
     * Contenu du footer : typiquement un groupe de boutons
     * (Enregistrer / Annuler / Supprimer, etc.).
     */
    children: React.ReactNode
    /**
     * Gestion de l’alignement horizontal des boutons.
     * - left : tout à gauche
     * - right : tout à droite (par défaut)
     * - center : centré
     * - space-between : étalé sur toute la largeur
     */
    align?: DetailFooterAlign
    /**
     * Ajoute une bordure supérieure discrète pour séparer du body.
     */
    withBorder?: boolean
    /** Classes additionnelles */
    className?: string
}

/**
 * Footer commun des cards de détail.
 * Se concentre sur la structure et l’alignement ; le contenu (boutons)
 * reste libre pour chaque page.
 */
const DetailFooter: React.FC<DetailFooterProps> = ({
                                                       children,
                                                       align = 'right',
                                                       withBorder = true,
                                                       className = '',
                                                   }) => {
    const rootClasses = [
        'detail-footer',
        withBorder ? 'detail-footer--with-border' : '',
        `detail-footer--align-${align}`,
        className,
    ]
        .filter(Boolean)
        .join(' ')

    return <footer className={rootClasses}>{children}</footer>
}

export default DetailFooter