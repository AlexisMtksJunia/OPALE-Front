// src/components/rooms/RoomDetailCard.tsx
import React, { useEffect, useState } from 'react'
import { Room, RoomType } from '../../models/Room'
import { ROOM_TYPES } from '../../mocks/rooms.mock'
import RoomTypeBadge from './RoomTypeBadge'
import ActionButtonsWithConfirm from '../common/ActionButtonsWithConfirm'

interface RoomDetailCardProps {
    room: Room
    onClose: () => void
    onChange: (room: Room) => void
}

const ROOM_TYPE_LABELS: Record<RoomType, string> = {
    TD: 'TD',
    TP_ELECTRONIQUE: 'TP électronique',
    TP_NUMERIQUE: 'TP numérique',
    PROJET: 'Projet',
    AUTRE: 'Autre',
}

type DraftRoomState = {
    name: string
    fullName: string
    mainType: RoomType
    types: RoomType[]
    description: string
}

const makeInitialDraft = (room: Room): DraftRoomState => ({
    name: room.name,
    fullName: room.fullName ?? '',
    mainType: room.mainType,
    types: room.types,
    description: room.description ?? '',
})

const floorLabel = (floor: Room['floor']): string => {
    switch (floor) {
        case 0:
            return 'Rez-de-chaussée'
        case 1:
            return '1er étage'
        case 2:
            return '2e étage'
        default:
            return `Étage ${floor}`
    }
}

const areTypesEqual = (a: RoomType[], b: RoomType[]) =>
    a.length === b.length && a.every((t, idx) => t === b[idx])

const buildRoomFromDraft = (room: Room, draft: DraftRoomState): Room => ({
    ...room,
    name: draft.name.trim() || room.name,
    fullName: draft.fullName.trim() || undefined,
    description: draft.description.trim() || undefined,
    mainType: draft.mainType,
    types: draft.types.length ? draft.types : [draft.mainType],
})

export default function RoomDetailCard({ room, onClose, onChange }: RoomDetailCardProps) {
    const [draft, setDraft] = useState<DraftRoomState>(() => makeInitialDraft(room))

    // Si on ouvre une autre salle, on reset le brouillon
    useEffect(() => {
        setDraft(makeInitialDraft(room))
    }, [room])

    const { name, fullName, mainType, types, description } = draft
    const headerTitle = (fullName || name).trim() || room.name

    const hasChanges =
        room.name !== name ||
        (room.fullName ?? '') !== fullName ||
        (room.description ?? '') !== description ||
        room.mainType !== mainType ||
        !areTypesEqual(room.types, types)

    const handleChangeName = (value: string) => {
        setDraft((prev) => ({ ...prev, name: value }))
    }

    const handleChangeFullName = (value: string) => {
        setDraft((prev) => ({ ...prev, fullName: value }))
    }

    const handleSelectMainType = (type: RoomType) => {
        setDraft((prev) => {
            let nextTypes = prev.types
            if (!nextTypes.includes(type)) {
                nextTypes = [...nextTypes, type]
            }

            console.log('[ROOMS] Change main type', { roomId: room.id, type })
            return {
                ...prev,
                mainType: type,
                types: nextTypes,
            }
        })
    }

    const handleToggleType = (type: RoomType) => {
        // On empêche de désélectionner le type principal
        if (type === mainType) {
            return
        }

        setDraft((prev) => {
            const exists = prev.types.includes(type)
            const nextTypes = exists
                ? prev.types.filter((t) => t !== type)
                : [...prev.types, type]

            console.log('[ROOMS] Toggle type', { roomId: room.id, type, nextTypes })

            return {
                ...prev,
                types: nextTypes,
            }
        })
    }

    const handleChangeDescription = (value: string) => {
        setDraft((prev) => ({ ...prev, description: value }))
    }

    const handleSave = () => {
        const nextRoom = buildRoomFromDraft(room, draft)
        console.log('[ROOMS] Save room (mock)', nextRoom)
        onChange(nextRoom)
    }

    return (
        <div className="room-detail-overlay" role="dialog" aria-modal="true">
            <div className="room-detail-card">
                <button
                    type="button"
                    className="room-detail-close"
                    onClick={onClose}
                    aria-label="Fermer la fiche salle"
                >
                    ✕
                </button>

                {/* Header pill (inchangé) */}
                <div className="room-detail-header-badge">
                    <RoomTypeBadge
                        type={mainType}
                        variant="header"
                        title={headerTitle}
                        subtitle={`${name || room.name} · ${floorLabel(room.floor)}`}
                    />
                </div>

                {/* Layout 2 colonnes */}
                <div className="room-detail-layout">
                    {/* Colonne gauche : identité + types */}
                    <div className="room-detail-main-column">
                        <section className="room-detail-section">
                            <h3 className="room-detail-section-title">
                                Identité de la salle &amp; types
                            </h3>

                            {/* Nom + surnom */}
                            <div className="room-detail-identity-grid">
                                <div className="room-detail-field">
                                    <label
                                        className="room-detail-field-label"
                                        htmlFor="room-name-input"
                                    >
                                        Nom court (code salle)
                                    </label>
                                    <input
                                        id="room-name-input"
                                        className="room-detail-input"
                                        value={name}
                                        onChange={(e) => handleChangeName(e.target.value)}
                                        placeholder="Ex. J001"
                                    />
                                </div>

                                <div className="room-detail-field">
                                    <label
                                        className="room-detail-field-label"
                                        htmlFor="room-fullname-input"
                                    >
                                        Surnom / nom complet
                                    </label>
                                    <input
                                        id="room-fullname-input"
                                        className="room-detail-input"
                                        value={fullName}
                                        onChange={(e) => handleChangeFullName(e.target.value)}
                                        placeholder="Ex. J001_Projet"
                                    />
                                </div>
                            </div>

                            {/* Deux colonnes : type principal / types disponibles */}
                            <div className="room-detail-types-grid">
                                {/* Colonne gauche : type principal */}
                                <div className="room-detail-types-column">
                                    <h3 className="room-detail-section-title">Type principal</h3>
                                    <p className="room-detail-hint-small">
                                        Utilisé pour l’icône, le filtrage et la planification.
                                    </p>

                                    <div className="room-detail-types">
                                        {ROOM_TYPES.map((type) => {
                                            const isSelected = type === mainType
                                            const chipClassName = [
                                                'room-type-chip',
                                                'room-type-chip-main',
                                                isSelected
                                                    ? 'room-type-chip-selected room-type-chip-main-selected'
                                                    : '',
                                            ]
                                                .filter(Boolean)
                                                .join(' ')

                                            return (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    className={chipClassName}
                                                    onClick={() => handleSelectMainType(type)}
                                                    aria-pressed={isSelected}
                                                >
                                                <span
                                                    className="room-type-chip-dot"
                                                    aria-hidden="true"
                                                />
                                                    <span className="room-type-chip-label">
                                                    {ROOM_TYPE_LABELS[type]}
                                                </span>
                                                    {isSelected && (
                                                        <span className="room-type-chip-main-tag">
                                                        Principal
                                                    </span>
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Colonne droite : types disponibles */}
                                <div className="room-detail-types-column">
                                    <h3 className="room-detail-section-title">Types disponibles</h3>
                                    <p className="room-detail-hint-small">
                                        Coche les types compatibles avec cette salle. Le type principal
                                        est toujours inclus.
                                    </p>

                                    <div className="room-detail-types">
                                        {ROOM_TYPES.map((type) => {
                                            const isChecked = types.includes(type)
                                            const isMain = type === mainType

                                            const chipClassName = [
                                                'room-type-chip',
                                                isChecked ? 'room-type-chip-selected' : '',
                                            ]
                                                .filter(Boolean)
                                                .join(' ')

                                            const checkboxClassName = [
                                                'room-type-chip-checkbox',
                                                isChecked ? 'is-checked' : '',
                                            ]
                                                .filter(Boolean)
                                                .join(' ')

                                            return (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    className={chipClassName}
                                                    onClick={() => handleToggleType(type)}
                                                    aria-pressed={isChecked}
                                                >
                                                <span
                                                    className={checkboxClassName}
                                                    aria-hidden="true"
                                                />
                                                    <span className="room-type-chip-label">
                                                    {ROOM_TYPE_LABELS[type]}
                                                </span>
                                                    {isMain && (
                                                        <span className="room-type-chip-main-lock">
                                                        Principal
                                                    </span>
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Colonne droite : description seule (sans boutons) */}
                    <aside className="room-detail-aside-column">
                        <section className="room-detail-section room-detail-description-section">
                            <h3 className="room-detail-section-title">
                                Description / commentaires
                            </h3>
                            <textarea
                                className="room-detail-textarea"
                                placeholder="Notes sur la salle, équipements, contraintes d’utilisation…"
                                value={description}
                                onChange={(e) => handleChangeDescription(e.target.value)}
                                rows={8}
                            />
                        </section>
                    </aside>
                </div>

                {/* Footer boutons – hors des 2 colonnes */}
                <footer className="room-detail-footer">
                    <div className="room-detail-actions">
                        <ActionButtonsWithConfirm
                            saveLabel="Enregistrer"
                            cancelLabel="Annuler"
                            confirmTitle="Enregistrer les modifications"
                            confirmMessage="Souhaites-tu enregistrer les modifications apportées à cette salle ?"
                            confirmLabel="Enregistrer"
                            hasChanges={hasChanges}
                            cancelDirtyTitle="Modifications non enregistrées"
                            cancelDirtyMessage={
                                <>
                                    Tu as des modifications non enregistrées sur cette salle.
                                    <br />
                                    Souhaites-tu les enregistrer avant de fermer ?
                                </>
                            }
                            cancelDirtyConfirmLabel="Enregistrer et fermer"
                            cancelDirtyDiscardLabel="Fermer sans enregistrer"
                            onSave={handleSave}
                            onCancel={onClose}
                            onAfterSaveConfirm={onClose}
                        />
                    </div>
                </footer>
            </div>
        </div>
    )

}