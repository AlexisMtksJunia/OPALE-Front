// src/components/promotions/PromoEditDialog.jsx
import React from 'react'
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
                                        }) {
    const {
        totalStudents,
        groupsTotal,
        specialtiesTotal,
        groupsMismatch,
        specialtiesMismatch,
    } = computePromoTotals(editingPromo)

    if (!editingPromo) return null

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

                    {/* Colonne droite : Groupes (haut) + Spécialités (bas) */}
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