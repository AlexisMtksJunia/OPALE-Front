// import React, { useState } from 'react'
import icModif from '../assets/ic-modif.png'
import icMoins from '../assets/ic-moins.png'
import icPlus from '../assets/ic-plus.png'   // icône d’ajout
import icWarning from '../assets/ic-warning.png'
import React, { useState, useEffect } from 'react'

const DEFAULT = [
    { id: 'cycle-adi',   name: 'ADI',   years: 2 },
    { id: 'cycle-sir',   name: 'SIR',   years: 2 },
    { id: 'cycle-isen',  name: 'ISEN',  years: 3 },
    { id: 'cycle-fisen', name: 'FISEN', years: 3 },
]

const uid = (p = 'id') => `${p}-${Math.random().toString(36).slice(2, 9)}`

const makePromotions = (name, years) =>
    Array.from({ length: years }, (_, i) => ({
        id: uid('promo'),
        label: `${name} ${i + 1}`,
        students: 0,
        startDate: '',
        endDate: '',
        groups: [],
        specialties: [],
    }))

export default function Promotions() {
    const [cycles, setCycles] = useState(() =>
        DEFAULT.map(c => ({
            id: c.id,
            name: c.name,
            promotions: makePromotions(c.name, c.years),
        }))
    )

    const [adjustPopup, setAdjustPopup] = useState({
        open: false,
        groups: false,
        specialties: false,
    })

    const [lastStudentsPrompt, setLastStudentsPrompt] = useState(null)

    // Édition d’une promotion
    const [editingPromo, setEditingPromo] = useState(null)
    // editingPromo = { cycleId, promoId, name, students, startDate, endDate }

    // const [adjustPopup, setAdjustPopup] = useState({
    //     open: false,
    //     groups: false,
    //     specialties: false,
    // })

    const addCycle = () => {
        const name = (window.prompt('Nom du cycle (diplôme) ?', 'Nouveau cycle') || '').trim()
        if (!name) return
        let years = Number(window.prompt('Nombre d’années (1 à 6) ?', '3'))
        if (!Number.isFinite(years)) years = 3
        years = Math.max(1, Math.min(6, years))
        const newCycle = { id: uid('cycle'), name, promotions: makePromotions(name, years) }
        setCycles(prev => {
            const next = [...prev, newCycle]
            console.log('[CYCLES] add', newCycle)
            return next
        })
    }

    const removeCycle = (cycleId) =>
        setCycles(prev => {
            const next = prev.filter(c => c.id !== cycleId)
            console.log('[CYCLES] remove', cycleId)
            return next
        })

    const renameCycle = (cycleId, name) =>
        setCycles(prev => prev.map(c => {
            if (c.id !== cycleId) return c
            const renamed = {
                ...c,
                name,
                promotions: c.promotions.map((p, i) => ({
                    ...p,
                    label: `${name} ${i + 1}`,
                })),
            }
            console.log('[CYCLES] rename', { cycleId, name })
            return renamed
        }))

    const removePromotion = (cycleId, promoId) =>
        setCycles(prev =>
            prev.map(c =>
                c.id === cycleId
                    ? { ...c, promotions: c.promotions.filter(p => p.id !== promoId) }
                    : c
            )
        )

    const openEditPromotion = (cycleId, promoId) => {
        const cycle = cycles.find(c => c.id === cycleId)
        const promo = cycle?.promotions.find(p => p.id === promoId)
        if (!cycle || !promo) return

        const normalizeList = (rawList, prefix) =>
            (rawList || []).map(item =>
                typeof item === 'string'
                    ? { id: uid(prefix), name: item, students: 0 }
                    : { id: item.id || uid(prefix), name: item.name || '', students: item.students ?? 0 }
            )

        setEditingPromo({
            cycleId,
            promoId,
            name: promo.label || '',
            students: promo.students ?? 0,
            startDate: promo.startDate || '',
            endDate: promo.endDate || '',
            groups: normalizeList(promo.groups, 'grp'),
            specialties: normalizeList(promo.specialties, 'spec'),
        })

        setLastStudentsPrompt(promo.students ?? 0)
        setAdjustPopup({ open: false, groups: false, specialties: false })
    }

    const closeEditPromotion = () => setEditingPromo(null)

    const handleEditFieldChange = (field, value) => {
        setEditingPromo(prev => (prev ? { ...prev, [field]: value } : prev))
    }

    const handleSavePromotion = (event) => {
        event.preventDefault()
        if (!editingPromo) return

        setCycles(prev =>
            prev.map(c => {
                if (c.id !== editingPromo.cycleId) return c
                return {
                    ...c,
                    promotions: c.promotions.map(p => {
                        if (p.id !== editingPromo.promoId) return p
                        const updated = {
                            ...p,
                            label: editingPromo.name,
                            students: Number(editingPromo.students) || 0,
                            startDate: editingPromo.startDate,
                            endDate: editingPromo.endDate,
                            groups: editingPromo.groups || [],
                            specialties: editingPromo.specialties || [],
                        }
                        console.log('[PROMO] updated', updated)
                        return updated
                    }),
                }
            })
        )

        setEditingPromo(null)
    }

    const addGroup = () => {
        const name = (window.prompt('Nom du groupe ?', `Groupe ${(editingPromo?.groups?.length || 0) + 1}`) || '').trim()
        if (!name || !editingPromo) return

        setEditingPromo(prev => {
            if (!prev) return prev
            const current = prev.groups || []
            const next = [...current, { id: uid('grp'), name, students: 0 }]
            const distributed = distributeEvenly(prev.students, next)
            console.log('[GROUPS] add', distributed)
            return { ...prev, groups: distributed }
        })
    }

    const removeGroup = (index) => {
        setEditingPromo(prev => {
            if (!prev) return prev
            const groups = prev.groups.filter((_, i) => i !== index)
            return { ...prev, groups }
        })
    }

    const addSpecialty = () => {
        const name = (window.prompt('Nom de la spécialité ?', `Spécialité ${(editingPromo?.specialties?.length || 0) + 1}`) || '').trim()
        if (!name || !editingPromo) return

        setEditingPromo(prev => {
            if (!prev) return prev
            const current = prev.specialties || []
            const next = [...current, { id: uid('spec'), name, students: 0 }]
            const distributed = distributeEvenly(prev.students, next)
            console.log('[SPECIALTIES] add', distributed)
            return { ...prev, specialties: distributed }
        })
    }

    const removeSpecialty = (index) => {
        setEditingPromo(prev => {
            if (!prev) return prev
            const specialties = prev.specialties.filter((_, i) => i !== index)
            return { ...prev, specialties }
        })
    }

    const distributeEvenly = (total, items) => {
        if (!items.length) return items
        const safeTotal = Number(total) || 0
        if (safeTotal <= 0) {
            return items.map(it => ({ ...it, students: 0 }))
        }
        const base = Math.floor(safeTotal / items.length)
        let remainder = safeTotal % items.length

        return items.map((it, idx) => ({
            ...it,
            students: base + (idx < remainder ? 1 : 0),
        }))
    }

    const handleGroupChange = (index, field, value) => {
        setEditingPromo(prev => {
            if (!prev) return prev
            const groups = prev.groups.map((g, i) =>
                i === index
                    ? {
                        ...g,
                        [field]: field === 'students' ? (Number(value) || 0) : value,
                    }
                    : g
            )
            return { ...prev, groups }
        })
    }

    const handleSpecialtyChange = (index, field, value) => {
        setEditingPromo(prev => {
            if (!prev) return prev
            const specialties = prev.specialties.map((s, i) =>
                i === index
                    ? {
                        ...s,
                        [field]: field === 'students' ? (Number(value) || 0) : value,
                    }
                    : s
            )
            return { ...prev, specialties }
        })
    }

    const handleStudentsBlur = () => {
        if (!editingPromo) return

        const current = Number(editingPromo.students) || 0

        // Si on a déjà une valeur de référence ET que rien n'a changé → on ne fait rien
        if (lastStudentsPrompt !== null && current === lastStudentsPrompt) {
            return
        }

        // S'il n'y a ni groupes ni spécialités, pas d'intérêt d'ouvrir le pop-up
        if (
            (!editingPromo.groups || editingPromo.groups.length === 0) &&
            (!editingPromo.specialties || editingPromo.specialties.length === 0)
        ) {
            return
        }

        // On mémorise la nouvelle valeur de référence et on ouvre le pop-up
        setLastStudentsPrompt(current)
        setAdjustPopup({
            open: true,
            groups: false,
            specialties: false,
        })
    }

    const handleAdjustValidate = () => {
        if (!editingPromo) {
            setAdjustPopup({ open: false, groups: false, specialties: false })
            return
        }

        setEditingPromo(prev => {
            if (!prev) return prev
            let next = { ...prev }

            if (adjustPopup.groups && prev.groups && prev.groups.length > 0) {
                next.groups = distributeEvenly(prev.students, prev.groups)
            }

            if (adjustPopup.specialties && prev.specialties && prev.specialties.length > 0) {
                next.specialties = distributeEvenly(prev.students, prev.specialties)
            }

            console.log('[PROMO] auto adjust', {
                students: next.students,
                groups: next.groups,
                specialties: next.specialties,
            })

            return next
        })

        setAdjustPopup({ open: false, groups: false, specialties: false })
    }

    const toggleAdjustGroups = () => {
        setAdjustPopup(prev => ({ ...prev, groups: !prev.groups }))
    }

    const toggleAdjustSpecialties = () => {
        setAdjustPopup(prev => ({ ...prev, specialties: !prev.specialties }))
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key !== 'Escape') return

            // Si le pop-up d'ajustement est ouvert, on ferme d'abord celui-là
            if (adjustPopup.open) {
                setAdjustPopup({ open: false, groups: false, specialties: false })
                return
            }

            // Sinon, si on est en train d'éditer une promo, on ferme la card d'édition
            if (editingPromo) {
                setEditingPromo(null)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [adjustPopup.open, setAdjustPopup, editingPromo])

    // Met à jour un flag global si au moins une promo a un mauvais total
    useEffect(() => {
        const anyMismatch = cycles.some(cycle =>
            (cycle.promotions || []).some(promo => hasPromoMismatch(promo))
        )

        if (typeof window !== 'undefined') {
            window.localStorage.setItem('opale:promosMismatch', anyMismatch ? '1' : '0')
        }
    }, [cycles])

    // Vérification cohérence effectifs (pour l'édition)
    let totalStudents = 0
    let groupsTotal = 0
    let specialtiesTotal = 0
    let groupsMismatch = false
    let specialtiesMismatch = false

    if (editingPromo) {
        totalStudents = Number(editingPromo.students) || 0

        groupsTotal = (editingPromo.groups || []).reduce(
            (sum, g) => sum + (Number(g.students) || 0),
            0
        )

        specialtiesTotal = (editingPromo.specialties || []).reduce(
            (sum, s) => sum + (Number(s.students) || 0),
            0
        )

        if ((editingPromo.groups || []).length > 0 && groupsTotal !== totalStudents) {
            groupsMismatch = true
        }

        if ((editingPromo.specialties || []).length > 0 && specialtiesTotal !== totalStudents) {
            specialtiesMismatch = true
        }
    }

    // Vérifie si une promo a une incohérence d'effectifs (groupes ou spécialités)
    const hasPromoMismatch = (promo) => {
        const totalStudents = Number(promo.students) || 0
        const groups = promo.groups || []
        const specialties = promo.specialties || []

        let groupsTotal = 0
        let specialtiesTotal = 0

        if (groups.length > 0) {
            groupsTotal = groups.reduce(
                (sum, g) => sum + (Number(g.students) || 0),
                0
            )
        }

        if (specialties.length > 0) {
            specialtiesTotal = specialties.reduce(
                (sum, s) => sum + (Number(s.students) || 0),
                0
            )
        }

        const groupsMismatch =
            groups.length > 0 && groupsTotal !== totalStudents
        const specialtiesMismatch =
            specialties.length > 0 && specialtiesTotal !== totalStudents

        return groupsMismatch || specialtiesMismatch
    }

    return (
        <div className="promos">
            <div className="promos-header">
                <h2 className="page-title">Promotions</h2>
            </div>

            <div className="promos-grid">
                {cycles.map(cycle => (
                    <section key={cycle.id} className="card cycle-card">
                        <div className="cycle-head">
                            <input
                                className="cycle-name"
                                value={cycle.name}
                                onChange={(e) => renameCycle(cycle.id, e.target.value)}
                            />
                            <div className="cycle-actions">
                                <button
                                    className="btn-danger btn-icon-responsive"
                                    onClick={() => removeCycle(cycle.id)}
                                    aria-label="Supprimer le cycle"
                                    title="Supprimer le cycle"
                                >
                                    <img src={icMoins} alt="" aria-hidden="true" />
                                    <span className="btn-label">Supprimer le cycle</span>
                                </button>
                            </div>
                        </div>

                        <div className="promotions">
                            {cycle.promotions.length === 0 && (
                                <div className="empty">Aucune promotion affichée pour ce cycle.</div>
                            )}
                            {cycle.promotions.map(promo => (
                                <div key={promo.id} className="promo-row">
                                    <div className="promo-main">
                                        <span className="promo-label">{promo.label}</span>
                                        {hasPromoMismatch(promo) && (
                                            <img
                                                src={icWarning}
                                                alt="Répartition d'étudiants incohérente"
                                                className="promo-warning"
                                            />
                                        )}
                                    </div>
                                    <div className="promo-actions">
                                        <button
                                            className="btn-tertiary btn-icon-responsive"
                                            onClick={() => openEditPromotion(cycle.id, promo.id)}
                                            aria-label="Modifier la promotion"
                                            title="Modifier la promotion"
                                        >
                                            <img src={icModif} alt="" aria-hidden="true" />
                                            <span className="btn-label">Modifier</span>
                                        </button>
                                        <button
                                            className="btn-danger btn-icon-responsive"
                                            onClick={() => removePromotion(cycle.id, promo.id)}
                                            aria-label="Supprimer la promotion"
                                            title="Supprimer la promotion"
                                        >
                                            <img src={icMoins} alt="" aria-hidden="true" />
                                            <span className="btn-label">Supprimer</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}

                {/* Carte "Ajouter un cycle" — toujours en dernier dans le flux grid */}
                <button
                    type="button"
                    className="card add-cycle-card"
                    onClick={addCycle}
                    aria-label="Ajouter un cycle"
                    title="Ajouter un cycle"
                >
                    <img src={icPlus} alt="" />
                </button>
            </div>

            {/* Overlay d’édition de promotion */}
            {editingPromo && (
                <div className="promo-edit-overlay">
                    <form className="card promo-edit-card" onSubmit={handleSavePromotion}>
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
                                            onChange={(e) => handleEditFieldChange('name', e.target.value)}
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
                                            onChange={(e) => handleEditFieldChange('students', e.target.value)}
                                            onBlur={handleStudentsBlur}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault()
                                                    handleStudentsBlur()
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
                                            onChange={(e) => handleEditFieldChange('startDate', e.target.value)}
                                        />
                                    </label>

                                    <label className="promo-edit-field">
                                        <span className="promo-edit-label">Date de fin</span>
                                        <input
                                            type="date"
                                            className="promo-edit-input"
                                            value={editingPromo.endDate}
                                            onChange={(e) => handleEditFieldChange('endDate', e.target.value)}
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
                                        onClick={addGroup}
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
                                                        onChange={(e) => handleGroupChange(index, 'name', e.target.value)}
                                                    />
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className="promo-edit-input promo-list-count"
                                                        value={g.students}
                                                        onChange={(e) => handleGroupChange(index, 'students', e.target.value)}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn-danger btn-icon-responsive"
                                                    onClick={() => removeGroup(index)}
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
                                        onClick={addSpecialty}
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
                                                        onChange={(e) => handleSpecialtyChange(index, 'name', e.target.value)}
                                                    />
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className="promo-edit-input promo-list-count"
                                                        value={s.students}
                                                        onChange={(e) => handleSpecialtyChange(index, 'students', e.target.value)}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn-danger btn-icon-responsive"
                                                    onClick={() => removeSpecialty(index)}
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
                                        Le total d&apos;étudiants des groupes est de {groupsTotal} pour {totalStudents} élèves dans la promo.
                                    </p>
                                )}
                                {specialtiesMismatch && (
                                    <p className="promo-mismatch">
                                        Le total d&apos;étudiants des spécialités est
                                        de {specialtiesTotal} pour {totalStudents} étudiants dans la promo.
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="promo-edit-actions">
                            <button
                                type="button"
                                className="btn-tertiary"
                                onClick={closeEditPromotion}
                            >
                                Annuler
                            </button>
                            <button type="submit" className="btn-primary">
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {adjustPopup.open && (
                <div className="promo-adjust-overlay">
                    <div className="card promo-adjust-card">
                        <h4 className="promo-adjust-title">Ajuster la répartition ?</h4>
                        <p className="promo-adjust-text">
                            Vous avez modifié le nombre d&apos;étudiants de la promotion.
                            Souhaitez-vous recalculer automatiquement les effectifs ?
                        </p>

                        <div className="promo-adjust-row" onClick={toggleAdjustGroups}>
                            <span className="promo-adjust-label">Groupes</span>
                            <label className="radio-toggle">
                                <input
                                    type="checkbox"
                                    className="radio-toggle-input"
                                    checked={adjustPopup.groups}
                                    onChange={() => {}}
                                />
                                <span className="radio-toggle-dot"/>
                            </label>
                        </div>

                        <div className="promo-adjust-row" onClick={toggleAdjustSpecialties}>
                            <span className="promo-adjust-label">Spécialités</span>
                            <label className="radio-toggle">
                                <input
                                    type="checkbox"
                                    className="radio-toggle-input"
                                    checked={adjustPopup.specialties}
                                    onChange={() => {}}
                                />
                                <span className="radio-toggle-dot"/>
                            </label>
                        </div>

                        <div className="promo-adjust-actions">
                            <button
                                type="button"
                                className="btn-primary"
                                onClick={handleAdjustValidate}
                            >
                                Valider
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}