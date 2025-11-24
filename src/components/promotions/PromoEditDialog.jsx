// src/components/promotions/PromoEditDialog.jsx
import React, { useState } from 'react'
import { computePromoTotals } from '../../utils/promoUtils'

export default function PromoEditDialog({
                                            editingPromo,
                                            onSubmit,
                                            onClose,
                                            onFieldChange,
                                            onGroupChange,
                                            onAddGroup,
                                            onRemoveGroup,
                                            onSpecialtyChange,
                                            onAddSpecialty,
                                            onRemoveSpecialty,
                                            onStudentsBlur,
                                            onAddConstraint,
                                            onRemoveConstraint,
                                            onUpdateConstraintRange,
                                            constraints,
                                        }) {
    const {
        totalStudents,
        groupsTotal,
        specialtiesTotal,
        groupsMismatch,
        specialtiesMismatch,
    } = computePromoTotals(editingPromo)

    if (!editingPromo) return null

    const [editingRange, setEditingRange] = useState(null) // { type, id } ou null

    const safeConstraints = constraints || {}
    const getRanges = (type) => safeConstraints[type] || []

    const formatDateLabel = (iso) => {
        if (!iso) return 'jj/mm/aaaa'
        const [y, m, d] = iso.split('-')
        if (!y || !m || !d) return 'jj/mm/aaaa'
        return `${d}/${m}/${y}`
    }

    const formatRangeLabel = (range) =>
        `${formatDateLabel(range.start)} - ${formatDateLabel(range.end)}`

    const handleRangeClick = (type, id) => {
        setEditingRange({ type, id })
    }

    const handleRangeDateChange = (type, id, field, value) => {
        if (onUpdateConstraintRange) {
            onUpdateConstraintRange(type, id, field, value)
        }
    }

    const handleRemoveRange = (type, id) => {
        if (onRemoveConstraint) {
            onRemoveConstraint(type, id)
        }
        // Si on supprime la plage en cours d'édition, on sort du mode édition
        if (editingRange && editingRange.type === type && editingRange.id === id) {
            setEditingRange(null)
        }
    }

    // const safeConstraints = constraints || {}
    // const getRanges = (type) => safeConstraints[type] || []

    return (
        <div className="promo-edit-overlay">
            <form className="card promo-edit-card" onSubmit={onSubmit}>
                <h3 className="promo-edit-title">Modifier la promotion</h3>

                <div className="promo-edit-layout">
                    {/* Colonne gauche : Informations principales */}
                    <section className="promo-section promo-section-main">
                        <h4 className="promo-section-title">Informations principales</h4>

                        <div className="promo-section-grid">
                            <label className="promo-edit-field">
                                <span className="promo-edit-label">Nom</span>
                                <input
                                    type="text"
                                    className="promo-edit-input"
                                    value={editingPromo.name}
                                    onChange={(e) => onFieldChange('name', e.target.value)}
                                    required
                                />
                            </label>

                            <label className="promo-edit-field">
                                <span className="promo-edit-label">Nombre d&apos;étudiants</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    className="promo-edit-input"
                                    value={editingPromo.students}
                                    onChange={(e) => onFieldChange('students', e.target.value)}
                                    onBlur={onStudentsBlur}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            onStudentsBlur()
                                        }
                                    }}
                                />
                            </label>

                            <label className="promo-edit-field">
                                <span className="promo-edit-label">Date de début (rentrée)</span>
                                <input
                                    type="date"
                                    className="promo-edit-input"
                                    value={editingPromo.startDate}
                                    onChange={(e) => onFieldChange('startDate', e.target.value)}
                                />
                            </label>

                            <label className="promo-edit-field">
                                <span className="promo-edit-label">Date de fin</span>
                                <input
                                    type="date"
                                    className="promo-edit-input"
                                    value={editingPromo.endDate}
                                    onChange={(e) => onFieldChange('endDate', e.target.value)}
                                />
                            </label>
                        </div>
                    </section>

                    {/* Colonne centrale : Groupes (haut) + Spécialités (bas) */}
                    <div className="promo-edit-side">
                        <section className="promo-section">
                            <h4 className="promo-section-title">Groupes</h4>

                            <button
                                type="button"
                                className="btn-tertiary"
                                onClick={onAddGroup}
                            >
                                + Ajouter un groupe
                            </button>

                            <ul className="promo-list">
                                {editingPromo.groups?.map((g, index) => (
                                    <li key={g.id} className="promo-list-item">
                                        <div className="promo-list-main">
                                            <input
                                                type="text"
                                                className="promo-edit-input promo-list-name"
                                                value={g.name}
                                                onChange={(e) =>
                                                    onGroupChange(index, 'name', e.target.value)
                                                }
                                            />
                                            <input
                                                type="number"
                                                min="0"
                                                className="promo-edit-input promo-list-count"
                                                value={g.students}
                                                onChange={(e) =>
                                                    onGroupChange(index, 'students', e.target.value)
                                                }
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="btn-danger btn-icon-responsive"
                                            onClick={() => onRemoveGroup(index)}
                                        >
                                            <span className="btn-label">Supprimer</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="promo-section">
                            <h4 className="promo-section-title">Spécialités</h4>

                            <button
                                type="button"
                                className="btn-tertiary"
                                onClick={onAddSpecialty}
                            >
                                + Ajouter une spécialité
                            </button>

                            <ul className="promo-list">
                                {editingPromo.specialties?.map((s, index) => (
                                    <li key={s.id} className="promo-list-item">
                                        <div className="promo-list-main">
                                            <input
                                                type="text"
                                                className="promo-edit-input promo-list-name"
                                                value={s.name}
                                                onChange={(e) =>
                                                    onSpecialtyChange(index, 'name', e.target.value)
                                                }
                                            />
                                            <input
                                                type="number"
                                                min="0"
                                                className="promo-edit-input promo-list-count"
                                                value={s.students}
                                                onChange={(e) =>
                                                    onSpecialtyChange(index, 'students', e.target.value)
                                                }
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="btn-danger btn-icon-responsive"
                                            onClick={() => onRemoveSpecialty(index)}
                                        >
                                            <span className="btn-label">Supprimer</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* Colonne droite - Contraintes académiques */}
                    <section className="promo-section promo-section-constraints">
                        <h4 className="promo-section-title">Contraintes académiques</h4>

                        <div className="constraints-grid">
                            {/* Vacances */}
                            <div className="constraint-card constraint-vacances">
                                <div className="constraint-card-header">
                                    <span className="constraint-title">Vacances</span>
                                    <button
                                        type="button"
                                        className="constraint-add-btn"
                                        onClick={() => onAddConstraint && onAddConstraint('vacances')}
                                        aria-label="Ajouter une contrainte Vacances"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="constraint-tags">
                                    {getRanges('vacances').map((range) => {
                                        const isEditing =
                                            editingRange &&
                                            editingRange.type === 'vacances' &&
                                            editingRange.id === range.id

                                        return (
                                            <div
                                                key={range.id}
                                                className="constraint-pill constraint-pill-vacances"
                                            >
                                                <button
                                                    type="button"
                                                    className="constraint-pill-main"
                                                    onClick={() => handleRangeClick('vacances', range.id)}
                                                >
                                                    {isEditing ? (
                                                        <div className="constraint-pill-editor">
                                                            <input
                                                                type="date"
                                                                className="constraint-date-input"
                                                                value={range.start || ''}
                                                                onChange={(e) =>
                                                                    handleRangeDateChange(
                                                                        'vacances',
                                                                        range.id,
                                                                        'start',
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />
                                                            <span className="constraint-date-separator">-</span>
                                                            <input
                                                                type="date"
                                                                className="constraint-date-input"
                                                                value={range.end || ''}
                                                                onChange={(e) =>
                                                                    handleRangeDateChange(
                                                                        'vacances',
                                                                        range.id,
                                                                        'end',
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    ) : (
                                                        formatRangeLabel(range)
                                                    )}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="constraint-pill-remove"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleRemoveRange('vacances', range.id)
                                                    }}
                                                    aria-label="Supprimer cette plage Vacances"
                                                >
                                                    −
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Stages */}
                            <div className="constraint-card constraint-stages">
                                <div className="constraint-card-header">
                                    <span className="constraint-title">Stages</span>
                                    <button
                                        type="button"
                                        className="constraint-add-btn"
                                        onClick={() => onAddConstraint && onAddConstraint('stages')}
                                        aria-label="Ajouter une contrainte Stages"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="constraint-tags">
                                    {getRanges('stages').map((range) => {
                                        const isEditing =
                                            editingRange &&
                                            editingRange.type === 'stages' &&
                                            editingRange.id === range.id

                                        return (
                                            <div
                                                key={range.id}
                                                className="constraint-pill constraint-pill-stages"
                                            >
                                                <button
                                                    type="button"
                                                    className="constraint-pill-main"
                                                    onClick={() => handleRangeClick('stages', range.id)}
                                                >
                                                    {isEditing ? (
                                                        <div className="constraint-pill-editor">
                                                            <input
                                                                type="date"
                                                                className="constraint-date-input"
                                                                value={range.start || ''}
                                                                onChange={(e) =>
                                                                    handleRangeDateChange(
                                                                        'stages',
                                                                        range.id,
                                                                        'start',
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />
                                                            <span className="constraint-date-separator">-</span>
                                                            <input
                                                                type="date"
                                                                className="constraint-date-input"
                                                                value={range.end || ''}
                                                                onChange={(e) =>
                                                                    handleRangeDateChange(
                                                                        'stages',
                                                                        range.id,
                                                                        'end',
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    ) : (
                                                        formatRangeLabel(range)
                                                    )}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="constraint-pill-remove"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleRemoveRange('stages', range.id)
                                                    }}
                                                    aria-label="Supprimer cette plage Stages"
                                                >
                                                    −
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* International */}
                            <div className="constraint-card constraint-international">
                                <div className="constraint-card-header">
                                    <span className="constraint-title">International</span>
                                    <button
                                        type="button"
                                        className="constraint-add-btn"
                                        onClick={() => onAddConstraint && onAddConstraint('international')}
                                        aria-label="Ajouter une contrainte International"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="constraint-tags">
                                    {getRanges('international').map((range) => {
                                        const isEditing =
                                            editingRange &&
                                            editingRange.type === 'international' &&
                                            editingRange.id === range.id

                                        return (
                                            <div
                                                key={range.id}
                                                className="constraint-pill constraint-pill-international"
                                            >
                                                <button
                                                    type="button"
                                                    className="constraint-pill-main"
                                                    onClick={() => handleRangeClick('international', range.id)}
                                                >
                                                    {isEditing ? (
                                                        <div className="constraint-pill-editor">
                                                            <input
                                                                type="date"
                                                                className="constraint-date-input"
                                                                value={range.start || ''}
                                                                onChange={(e) =>
                                                                    handleRangeDateChange(
                                                                        'international',
                                                                        range.id,
                                                                        'start',
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />
                                                            <span className="constraint-date-separator">-</span>
                                                            <input
                                                                type="date"
                                                                className="constraint-date-input"
                                                                value={range.end || ''}
                                                                onChange={(e) =>
                                                                    handleRangeDateChange(
                                                                        'international',
                                                                        range.id,
                                                                        'end',
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    ) : (
                                                        formatRangeLabel(range)
                                                    )}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="constraint-pill-remove"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleRemoveRange('international', range.id)
                                                    }}
                                                    aria-label="Supprimer cette plage International"
                                                >
                                                    −
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Partiels */}
                            <div className="constraint-card constraint-partiels">
                                <div className="constraint-card-header">
                                    <span className="constraint-title">Partiels</span>
                                    <button
                                        type="button"
                                        className="constraint-add-btn"
                                        onClick={() => onAddConstraint && onAddConstraint('partiels')}
                                        aria-label="Ajouter une contrainte Partiels"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="constraint-tags">
                                    {getRanges('partiels').map((range) => {
                                        const isEditing =
                                            editingRange &&
                                            editingRange.type === 'partiels' &&
                                            editingRange.id === range.id

                                        return (
                                            <div
                                                key={range.id}
                                                className="constraint-pill constraint-pill-partiels"
                                            >
                                                <button
                                                    type="button"
                                                    className="constraint-pill-main"
                                                    onClick={() => handleRangeClick('partiels', range.id)}
                                                >
                                                    {isEditing ? (
                                                        <div className="constraint-pill-editor">
                                                            <input
                                                                type="date"
                                                                className="constraint-date-input"
                                                                value={range.start || ''}
                                                                onChange={(e) =>
                                                                    handleRangeDateChange(
                                                                        'partiels',
                                                                        range.id,
                                                                        'start',
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />
                                                            <span className="constraint-date-separator">-</span>
                                                            <input
                                                                type="date"
                                                                className="constraint-date-input"
                                                                value={range.end || ''}
                                                                onChange={(e) =>
                                                                    handleRangeDateChange(
                                                                        'partiels',
                                                                        range.id,
                                                                        'end',
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    ) : (
                                                        formatRangeLabel(range)
                                                    )}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="constraint-pill-remove"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleRemoveRange('partiels', range.id)
                                                    }}
                                                    aria-label="Supprimer cette plage Partiels"
                                                >
                                                    −
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Rattrapages */}
                            <div className="constraint-card constraint-rattrapages">
                                <div className="constraint-card-header">
                                    <span className="constraint-title">Rattrapages</span>
                                    <button
                                        type="button"
                                        className="constraint-add-btn"
                                        onClick={() => onAddConstraint && onAddConstraint('rattrapages')}
                                        aria-label="Ajouter une contrainte Rattrapages"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="constraint-tags">
                                    {getRanges('rattrapages').map((range) => {
                                        const isEditing =
                                            editingRange &&
                                            editingRange.type === 'rattrapages' &&
                                            editingRange.id === range.id

                                        return (
                                            <div
                                                key={range.id}
                                                className="constraint-pill constraint-pill-rattrapages"
                                            >
                                                <button
                                                    type="button"
                                                    className="constraint-pill-main"
                                                    onClick={() => handleRangeClick('rattrapages', range.id)}
                                                >
                                                    {isEditing ? (
                                                        <div className="constraint-pill-editor">
                                                            <input
                                                                type="date"
                                                                className="constraint-date-input"
                                                                value={range.start || ''}
                                                                onChange={(e) =>
                                                                    handleRangeDateChange(
                                                                        'rattrapages',
                                                                        range.id,
                                                                        'start',
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />
                                                            <span className="constraint-date-separator">-</span>
                                                            <input
                                                                type="date"
                                                                className="constraint-date-input"
                                                                value={range.end || ''}
                                                                onChange={(e) =>
                                                                    handleRangeDateChange(
                                                                        'rattrapages',
                                                                        range.id,
                                                                        'end',
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    ) : (
                                                        formatRangeLabel(range)
                                                    )}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="constraint-pill-remove"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleRemoveRange('rattrapages', range.id)
                                                    }}
                                                    aria-label="Supprimer cette plage Rattrapages"
                                                >
                                                    −
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* 🔴 Messages de cohérence effectifs */}
                {(groupsMismatch || specialtiesMismatch) && (
                    <div className="promo-mismatch-block">
                        {groupsMismatch && (
                            <p className="promo-mismatch">
                                Le total d&apos;étudiants des groupes est de {groupsTotal} pour{' '}
                                {totalStudents} élèves dans la promo.
                            </p>
                        )}
                        {specialtiesMismatch && (
                            <p className="promo-mismatch">
                                Le total d&apos;étudiants des spécialités est de {specialtiesTotal}{' '}
                                pour {totalStudents} élèves dans la promo.
                            </p>
                        )}
                    </div>
                )}

                <div className="promo-edit-actions">
                    <button
                        type="button"
                        className="btn-tertiary"
                        onClick={onClose}
                    >
                        Annuler
                    </button>
                    <button type="submit" className="btn-primary">
                        Enregistrer
                    </button>
                </div>
            </form>
        </div>
    )
}