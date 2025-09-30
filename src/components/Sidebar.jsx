import React from 'react'
import logoFull from '../assets/logo-full.png'
import logoCompact from '../assets/logo-compact.png'
import icPlanning from '../assets/ic-planning.png'
import icPromotions from '../assets/ic-promos.png'
import icEvenements from '../assets/ic-events.png'
import icEnseignants from '../assets/ic-profs.png'
import icSalles from '../assets/ic-salles.png'
import icPara from '../assets/ic-para.png'

const items = [
    { key: 'planning',   label: 'Planning',    ic: icPlanning },
    { key: 'promos',     label: 'Promotions',  ic: icPromotions },
    { key: 'events',     label: 'Evenements',  ic: icEvenements },
    { key: 'teachers',   label: 'Enseignants', ic: icEnseignants },
    { key: 'rooms',      label: 'Salles',      ic: icSalles },
]

export default function Sidebar({ active='planning', onNavigate }) {
    return (
        <aside className="card sidebar">
            <div className="brand">
                <img className="logo-full" src={logoFull} alt="OPALE"/>
                <img className="logo-compact" src={logoCompact} alt="O"/>
            </div>

            <nav className="nav">
                {items.map(it => (
                    <button
                        key={it.key}
                        className={`nav-btn ${active === it.key ? 'active' : ''}`}
                        onClick={() => {
                            console.log(`[NAV] ${it.label}`)
                            onNavigate?.(it.key)
                        }}
                    >
                        <span className="nav-label">{it.label}</span>
                        <img className="nav-icon-right" src={it.ic} alt=""/>
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button
                    className="nav-btn-footer"
                    onClick={() => console.log('[NAV] Paramètres')}
                >
                    <img className="nav-icon-left" src={icPara} alt=""/>
                    <span className="nav-label">Paramètres</span>
                </button>
            </div>
        </aside>
    )
}