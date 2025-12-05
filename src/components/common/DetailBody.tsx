import React from 'react'

export interface DetailBodyProps {
    children: React.ReactNode
    /**
     * Active un comportement "scrollable" (overflow auto + padding adapté)
     * dans le corps de la card.
     */
    scrollable?: boolean
    /** Classes additionnelles pour personnaliser par page */
    className?: string
}

/**
 * Corps de la card de détail.
 * Permet de centraliser le padding, la gestion du scroll, etc.
 */
const DetailBody: React.FC<DetailBodyProps> = ({
                                                   children,
                                                   scrollable = true,
                                                   className = '',
                                               }) => {
    const rootClasses = [
        'detail-body',
        scrollable ? 'detail-body--scrollable' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ')

    return <section className={rootClasses}>{children}</section>
}

export default DetailBody