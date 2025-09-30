// src/pages/PlanningMacro.jsx
import React, { useState } from 'react'
import Checklist from '../components/Checklist.jsx'

export default function PlanningMacro() {
    const [items, setItems] = useState([
        { id: 'promos',    label: 'Toutes les promotions sont créé',                     status: 'ok',    checked: true },
        { id: 'periodes',  label: 'Toutes les période de présence ont été remplit',      status: 'ok',    checked: true },
        { id: 'maquettes', label: 'Les maquettes de chaque promos créé ont été ajoutée', status: 'ok',    checked: true },
        { id: 'events',    label: 'Les évènements majeur du campus ont été renseignés',  status: 'alert', checked: false },
    ])

    const toggleItem = (index, checked) => {
        setItems(prev => {
            const next = [...prev]
            next[index] = { ...next[index], checked }
            return next
        })
    }

    const handleGenerate = () => {
        const payload = items.map(i => ({ id: i.id, checked: i.checked }))
        console.log('[GENERATION PLANNING MACRO]', payload)
    }

    return (
        <>
            <h2 className="page-title">Génération planning macro</h2>
            <p className="page-sub">Sélectionnez chacun de ces points s’il a été renseigné.</p>

            <Checklist items={items} onToggle={toggleItem} />

            <button className="btn-primary btn-generate" onClick={handleGenerate}>
                Générer Planning<br/>Macro
            </button>
        </>
    )
}
