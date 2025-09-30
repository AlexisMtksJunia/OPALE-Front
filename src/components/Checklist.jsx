import React from 'react'

/**
 * Pastille gauche = checkbox cliquable
 * Couleur contrôlée par 'status': 'ok' (turquoise) | 'alert' (jaune)
 */
export default function Checklist({ items, onToggle }) {
    return (
        <div className="checklist">
            {items.map((it, idx) => (
                <button
                    key={it.id}
                    className="cl-item"
                    onClick={() => {
                        console.log(`[CHECKBOX] ${it.id} -> ${!it.checked}`)
                        onToggle?.(idx, !it.checked)
                    }}
                >
          <span
              className={`badge ${it.status === 'ok' ? 'ok' : 'alert'} ${it.checked ? 'checked' : ''}`}
              aria-hidden
          >
            {it.checked ? '✓' : ''}
          </span>
                    <span className="cl-label">{it.label}</span>
                </button>
            ))}
        </div>
    )
}