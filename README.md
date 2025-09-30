# OPALE Front

Interface web du projet **OPALE**, développée en **React** avec **Vite**.  
Objectif : piloter la génération d’un planning **macro** annuel et des vues **micro** par promotion.
> ⚠️ Portée actuelle : **front uniquement** — toute action côté back est simulée par `console.log()`.

---

## 🚀 Installation

Prérequis recommandés : **Node 18+** et **npm 9+**.

Cloner le dépôt :

```bash
git clone https://github.com/AlexisMtksJunia/OPALE-Front.git
cd OPALE-Front
```

Installer les dépendances :

```bash
npm install
```

Lancer le serveur de dev :

```bash
npm run dev
```

Par défaut, l’application est accessible sur **http://localhost:5173**.

---

## 🧭 Routing (v1.1.3)

Le projet utilise **react-router-dom** (routing minimal).

- `/planning` — Génération du planning **macro** (checklist + CTA)
- `/promotions` — Gestion des cycles et promotions (CRUD local)
- `/evenements`, `/enseignants`, `/salles`, `/parametres` — pages placeholder
- `/` redirige vers `/planning`
- Toute route inconnue → page 404 (placeholder)

---

## 📂 Structure du projet

```
opale-front/
 ├─ public/                 # ressources publiques
 ├─ src/
 │   ├─ assets/             # images/icônes
 │   ├─ components/
 │   │   ├─ Checklist.jsx
 │   │   └─ Sidebar.jsx
 │   ├─ pages/
 │   │   ├─ PlanningMacro.jsx
 │   │   ├─ Promotions.jsx
 │   │   └─ Placeholder.jsx
 │   ├─ App.jsx             # layout + <Routes/>
 │   ├─ main.jsx            # point d’entrée + <BrowserRouter/>
 │   └─ App.css           # styles globaux (tokens + layout)
 │   └─ index.css           # styles globaux (tokens + layout)
 ├─ package.json
 ├─ package-lock.json
 ├─ vite.config.js
 ├─ index.html
 └─ README.md
```

> ℹ️ `App.css` provient du template Vite et **n’est pas utilisé**. Vous pouvez le supprimer si souhaité.

---

## ✨ Fonctionnalités actuelles

- **Sidebar responsive** (icônes, états actifs via `NavLink`, pas de style “hyperlien”)
- **Routing minimal** (planning, promotions, placeholders)
- **Génération planning macro** : checklist interactive + `console.log()` sur action
- **Gestion des promotions** : cycles + promotions (ajout/suppression/renommage en mémoire)
- **Bouton de déconnexion** (simulé via `console.log`)
- **Responsive** desktop → mobile

---

## 🛠️ Scripts

- `npm run dev` — lance l’app en mode développement
- `npm run build` — build production (dossier `dist/`)
- `npm run preview` — prévisualise la build
- `npm run lint` — lance ESLint

---

## 📌 Technologies

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [react-router-dom](https://reactrouter.com/)
- JavaScript (JSX) + CSS

---

## 🧑‍💻 Conventions Git & Versioning

- **Branches**
    - `main` : stable
    - `feat/*`, `fix/*`, `chore/*` : travail au quotidien
- **Commits** : format *Conventional Commits*
    - `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`, `test:`, `build:`, `ci:`
    - Ex : `feat(routing): set up minimal routing with react-router-dom`
- **Versioning** : SemVer
    - **MAJOR**: rupture (2.0.0)
    - **MINOR**: nouvelle fonctionnalité rétrocompatible (1.2.0)
    - **PATCH**: correctifs/ajustements (1.1.4)
    - **Série 1.1.x** : stabilisation des bases (mise en place d’éléments simples, style, 2 vues, bonnes pratiques).

- **Tag de release**
    - Exemple : `v1.1.3` — *mise en place du routing minimal*

---

## 🔧 Développement local (mock)

Le projet ne contacte pas de backend. Les actions « réseau » sont simulées par des `console.log()`.  
Si besoin, ajoutez un `src/mocks/` pour centraliser des données de démo et garder des signatures proches d’un futur back.

---

## 🗺️ Roadmap (extraits)

- Vue **micro** par promotion (`/promotions/:promoId`)
- Gestion des **événements** (majeurs campus) côté UI
- **Tokens de design** et variantes de boutons consolidés
- Accessibilité (focus visibles, contrastes) et tests visuels

---

💡 Projet développé dans le cadre d’AP5 à Junia.
