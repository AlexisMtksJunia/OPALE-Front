// src/pages/Promotions.jsx
import React, { useState, useEffect } from 'react'
import icModif from '../assets/ic-modif.png'
import icMoins from '../assets/ic-moins.png'
import icPlus from '../assets/ic-plus.png'
import icWarning from '../assets/ic-warning.png'

import {
    uid,
    makePromotions,
    distributeEvenly,
    hasPromoMismatch,
} from '../utils/promoUtils'

import PromoEditDialog from '../components/promotions/PromoEditDialog.jsx'
import PromoAdjustDialog from '../components/promotions/PromoAdjustDialog.jsx'

const DEFAULT = [
    { id: 'cycle-adi',   name: 'ADI',   years: 2 },
    { id: 'cycle-sir',   name: 'SIR',   years: 2 },
    { id: 'cycle-isen',  name: 'ISEN',  years: 3 },
    { id: 'cycle-fisen', name: 'FISEN', years: 3 },
]

const createEmptyConstraints = () => ({
    vacances: [],
    stages: [],
    international: [],
    partiels: [],
    rattrapages: [],
})

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
    // editingPromo = { cycleId, promoId, name, students, startDate, endDate, groups, specialties }

    /* =========================
     *  CYCLES & PROMOS
     * ========================= */

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

    /* =========================
     *  EDIT PROMO
     * ========================= */

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
            constraints: {
                ...createEmptyConstraints(),
                ...(promo.constraints || {}),
            },
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
                            constraints: editingPromo.constraints || createEmptyConstraints(),
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

        if (lastStudentsPrompt !== null && current === lastStudentsPrompt) {
            return
        }

        if (
            (!editingPromo.groups || editingPromo.groups.length === 0) &&
            (!editingPromo.specialties || editingPromo.specialties.length === 0)
        ) {
            return
        }

        setLastStudentsPrompt(current)
        setAdjustPopup({
            open: true,
            groups: false,
            specialties: false,
        })
    }

    const handleAddConstraint = (type) => {
        setEditingPromo(prev => {
            if (!prev) return prev
            const base = prev.constraints || createEmptyConstraints()
            const list = base[type] || []

            const newRange = {
                id: uid(`ctr-${type}`),
                startDate: '',
                endDate: '',
            }

            return {
                ...prev,
                constraints: {
                    ...base,
                    [type]: [...list, newRange],
                },
            }
        })
    }

    const handleRemoveConstraint = (type, id) => {
        setEditingPromo(prev => {
            if (!prev) return prev
            const base = prev.constraints || createEmptyConstraints()
            const list = base[type] || []

            return {
                ...prev,
                constraints: {
                    ...base,
                    [type]: list.filter(r => r.id !== id),
                },
            }
        })
    }

    const handleUpdateConstraintRange = (type, id, field, value) => {
        setEditingPromo(prev => {
            if (!prev) return prev
            const prevConstraints = prev.constraints || {}
            const ranges = prevConstraints[type] || []

            const updatedRanges = ranges.map(r =>
                r.id === id ? { ...r, [field]: value } : r
            )

            return {
                ...prev,
                constraints: {
                    ...prevConstraints,
                    [type]: updatedRanges,
                },
            }
        })
    }

    /* =========================
     *  POPUP AJUSTEMENT
     * ========================= */

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

    /* =========================
     *  ESCAPE / LOCALSTORAGE
     * ========================= */

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key !== 'Escape') return

            if (adjustPopup.open) {
                setAdjustPopup({ open: false, groups: false, specialties: false })
                return
            }

            if (editingPromo) {
                setEditingPromo(null)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [adjustPopup.open, editingPromo])

    // Optionnel : flag global si une promo a une incohérence
    useEffect(() => {
        const anyMismatch = cycles.some(cycle =>
            (cycle.promotions || []).some(promo => hasPromoMismatch(promo))
        )

        if (typeof window !== 'undefined') {
            window.localStorage.setItem('opale:promosMismatch', anyMismatch ? '1' : '0')
        }
    }, [cycles])

    /* =========================
     *  RENDER
     * ========================= */

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

                {/* Carte "Ajouter un cycle" */}
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

            {/* Modale d’édition */}
            {editingPromo && (
                <PromoEditDialog
                    editingPromo={editingPromo}
                    onSubmit={handleSavePromotion}
                    onClose={closeEditPromotion}
                    onFieldChange={handleEditFieldChange}
                    onGroupChange={handleGroupChange}
                    onAddGroup={addGroup}
                    onRemoveGroup={removeGroup}
                    onSpecialtyChange={handleSpecialtyChange}
                    onAddSpecialty={addSpecialty}
                    onRemoveSpecialty={removeSpecialty}
                    onStudentsBlur={handleStudentsBlur}
                    constraints={editingPromo.constraints}
                    onAddConstraint={handleAddConstraint}
                    onRemoveConstraint={handleRemoveConstraint}
                    onUpdateConstraintRange={handleUpdateConstraintRange}
                />
            )}

            {/* Pop-up d’ajustement */}
            {adjustPopup.open && (
                <PromoAdjustDialog
                    adjustPopup={adjustPopup}
                    onToggleGroups={toggleAdjustGroups}
                    onToggleSpecialties={toggleAdjustSpecialties}
                    onValidate={handleAdjustValidate}
                />
            )}
        </div>
    )
}