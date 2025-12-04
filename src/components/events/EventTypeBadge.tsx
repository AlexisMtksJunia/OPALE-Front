// src/components/events/EventTypeBadge.tsx
import React from 'react'
import { EventType, EventSource } from '../../models/CampusEvent'
import EntityBadge from '../common/EntityBadge'

import icEventJpo from '../../assets/events/ic-event-jpo.png'
import icEventExam from '../../assets/events/ic-event-exam.png'
import icEventConference from '../../assets/events/ic-event-conference.png'
import icEventForum from '../../assets/events/ic-event-forum.png'
import icEventSalon from '../../assets/events/ic-event-salon.png'
import icEventOther from '../../assets/events/ic-event-other.png'

interface EventTypeBadgeProps {
    type: EventType
    source: EventSource
}

/**
 * Métadonnées par type d'événement :
 * - label affiché
 * - icône
 */
export const TYPE_META: Record<
    EventType,
    { icon: string; label: string }
> = {
    JOURNEE_PO: { icon: icEventJpo, label: 'Journée Portes Ouvertes' },
    EXAMEN: { icon: icEventExam, label: 'Examen / Partiels' },
    CONFERENCE: { icon: icEventConference, label: 'Conférence' },
    FORUM: { icon: icEventForum, label: 'Forum' },
    SALON: { icon: icEventSalon, label: 'Salon / Expo' },
    AUTRE: { icon: icEventOther, label: 'Autre évènement' },
}

/**
 * Helper exporté pour la fiche détail
 * (EventDetailCard utilise getEventTypeMeta)
 */
export function getEventTypeMeta(type: EventType) {
    return TYPE_META[type] ?? TYPE_META.AUTRE
}

export default function EventTypeBadge({ type, source }: EventTypeBadgeProps) {
    const meta = getEventTypeMeta(type)
    const sourceClass =
        source === 'JUNIA'
            ? 'event-badge-type--junia'
            : 'event-badge-type--external'

    return (
        <EntityBadge
            iconSrc={meta.icon}
            label={meta.label}
            className={`event-badge-type ${sourceClass}`}
            // variant par défaut = "card" (pastille dans la colonne droite)
        />
    )
}