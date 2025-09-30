import React, { useState } from 'react'
import icModif from '../assets/ic-modif.png'
import icMoins from '../assets/ic-moins.png'
import icPlus from '../assets/ic-plus.png'   // <— icône d’ajout

const DEFAULT = [
    { id: 'cycle-adi',   name: 'ADI',   years: 2 },
    { id: 'cycle-sir',   name: 'SIR',   years: 2 },
    { id: 'cycle-isen',  name: 'ISEN',  years: 3 },
    { id: 'cycle-fisen', name: 'FISEN', years: 3 },
]

const uid = (p='id') => `${p}-${Math.random().toString(36).slice(2,9)}`
const makePromotions = (name, years) =>
    Array.from({ length: years }, (_, i) => ({ id: uid('promo'), label: `${name} ${i+1}` }))

export default function Promotions() {
    const [cycles, setCycles] = useState(() =>
        DEFAULT.map(c => ({ id: c.id, name: c.name, promotions: makePromotions(c.name, c.years) }))
    )

    const addCycle = () => {
        const name = (window.prompt('Nom du cycle (diplôme) ?', 'Nouveau cycle') || '').trim()
        if (!name) return
        let years = Number(window.prompt('Nombre d’années (1 à 6) ?', '3'))
        if (!Number.isFinite(years)) years = 3
        years = Math.max(1, Math.min(6, years))
        const newCycle = { id: uid('cycle'), name, promotions: makePromotions(name, years) }
        setCycles(prev => { const next = [...prev, newCycle]; console.log('[CYCLES] add', newCycle); return next })
    }

    const removeCycle = (cycleId) =>
        setCycles(prev => { const next = prev.filter(c => c.id !== cycleId); console.log('[CYCLES] remove', cycleId); return next })

    const renameCycle = (cycleId, name) =>
        setCycles(prev => prev.map(c => {
            if (c.id !== cycleId) return c
            const renamed = { ...c, name, promotions: c.promotions.map((p,i) => ({...p, label: `${name} ${i+1}`})) }
            console.log('[CYCLES] rename', { cycleId, name })
            return renamed
        }))

    const removePromotion = (cycleId, promoId) =>
        setCycles(prev => prev.map(c => c.id === cycleId ? { ...c, promotions: c.promotions.filter(p => p.id !== promoId) } : c))

    const editPromotion = (cycleId, promoId) =>
        console.log('[PROMO] edit requested', { cycleId, promoId })

    return (
        <div className="promos">
            <div className="promos-header">
                <h2 className="page-title">Promotions</h2>
                {/* (on retire le bouton texte "Ajouter un cycle") */}
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
                                    <span className="promo-label">{promo.label}</span>
                                    <div className="promo-actions">
                                        <button
                                            className="btn-tertiary btn-icon-responsive"
                                            onClick={() => editPromotion(cycle.id, promo.id)}
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
        </div>
    )
}
