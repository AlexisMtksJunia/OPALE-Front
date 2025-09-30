import React, { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Checklist from './components/Checklist.jsx'
import Promotions from './pages/Promotions.jsx'
import userIcon from './assets/ic-user.png'

export default function App() {
    const [active, setActive] = useState('planning')

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

    const handleDisconnect = () => {
        console.log('[AUTH] Se déconnecter')
    }

    const isPromotions = active === 'promotions' || active === 'promos' || active === 'promotion'

    const renderMain = () => {
        if (isPromotions) {
            // Onglet Promotions : CRUD cycles / classes
            return <Promotions />
        }

        // Onglet Planning (par défaut)
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

    return (
        <div className="app">
            <Sidebar active={active} onNavigate={setActive} />

            {/* Colonne droite */}
            <div className="right-col">
                {/* Carte indépendante pour la déconnexion */}
                <div className="disconnect-card card">
                    <button className="btn-disconnect" onClick={handleDisconnect}>
                        <span>Se déconnecter</span>
                        <img src={userIcon} alt="" />
                    </button>
                </div>

                {/* Carte principale (change selon l'onglet actif) */}
                <main className="card main-card">
                    <div className="main-inner">
                        {renderMain()}
                    </div>
                </main>
            </div>
        </div>
    )
}
