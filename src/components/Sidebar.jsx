import React from 'react'
import { NavLink } from 'react-router-dom'
import logoFull from '../assets/logo-full.png'
import logoCompact from '../assets/logo-compact.png'
import icPlanning from '../assets/ic-planning.png'
import icPromotions from '../assets/ic-promos.png'
import icEvenements from '../assets/ic-events.png'
import icEnseignants from '../assets/ic-profs.png'
import icSalles from '../assets/ic-salles.png'
import icPara from '../assets/ic-para.png'

const items = [
    { to: '/planning',   label: 'Planning',    ic: icPlanning },
    { to: '/promotions', label: 'Promotions',  ic: icPromotions },
    { to: '/evenements', label: 'Evenements',  ic: icEvenements },
    { to: '/enseignants',label: 'Enseignants', ic: icEnseignants },
    { to: '/salles',     label: 'Salles',      ic: icSalles },
]

export default function Sidebar() {
    return (
        <aside className="card sidebar">
            <div className="brand">
                <img className="logo-full" src={logoFull} alt="OPALE"/>
                <img className="logo-compact" src={logoCompact} alt="O"/>
            </div>

            <nav className="nav">
                {items.map(it => (
                    <NavLink
                        key={it.to}
                        to={it.to}
                        className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
                        onClick={() => console.log(`[NAV] ${it.label}`)}
                    >
                        <span className="nav-label">{it.label}</span>
                        <img className="nav-icon-right" src={it.ic} alt="" />
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <NavLink
                    to="/parametres"
                    className={({ isActive }) => `nav-btn-footer ${isActive ? 'active' : ''}`}
                    onClick={() => console.log('[NAV] Paramètres')}
                >
                    <img className="nav-icon-left" src={icPara} alt="" />
                    <span className="nav-label">Paramètres</span>
                </NavLink>
            </div>
        </aside>
    )
}