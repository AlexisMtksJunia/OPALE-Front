# OPALE Front (v1.8)

Interface web du projet **OPALE**, développée en **React** avec **Vite**.  
Objectif : piloter la génération d’un planning **macro** annuel et des vues **micro** par promotion et par enseignant.

> ⚠️ Portée actuelle : **front uniquement** — toute action côté back est simulée via `console.log()`.

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

Application disponible sur : **http://localhost:5173**

---

## 🧭 Routing

Le projet utilise **react-router-dom** (routing minimal) :

- `/planning` — Génération du planning **macro**
- `/promotions` — Gestion des cycles et promotions (CRUD local + contraintes académiques)
- `/enseignants` — Liste des enseignants + détail + disponibilités
- `/evenements`, `/salles`, `/parametres` — placeholders
- `/` → redirection vers `/planning`
- Non trouvé → page 404 (placeholder)

---

# ✨ Nouveautés de la version 1.8 (Enseignants)

La version **1.8** introduit une **refonte complète de la page Enseignants**, avec une modale de détail très avancée.

## 👨‍🏫 Refonte totale de la page Enseignants

### ✔ Nouvelle grille d’enseignants

* Cards modernes avec icône du mode d’enseignement
* Hover, animations, thème sombre
* Barre de recherche + filtres stylés
* Icônes dédiées distanciel / présentiel / hybride

---

## 🪪 **Nouvelle “Teacher Detail Card” — modale de détail moderne**

Une refonte majeure, incluant :

### 🔹 **3 colonnes structurées**

1. **Informations personnelles**

  * nom, prénom, email, téléphone
  * mode d’enseignement (select)

2. **Matières enseignées**

  * ajout/suppression dynamique
  * édition en ligne
  * structure en deux inputs > matière + promo

3. **Disponibilités**

  * gestion de **périodes** (ajout, suppression, sélection)
  * plage de dates avec `DateRangePill` (nouveau composant common)
  * tableau 6×3 (2 créneaux par journée × 5 jours)
  * clic = bascule disponible / indisponible
  * légende + couleurs cohérentes thème clair/sombre

---

## 🧩 **Refactorisation : composants communs**

Afin d’assurer une homogénéité UI/UX :

### 🔸 `DateRangePill` (Common)

Utilisé par :

* promotions
* enseignants

Supporte :

* édition inline
* suppression
* thème sombre
* style unifié

### 🔸 `ActionButtonsWithConfirm`

Déplace les boutons “Annuler / Enregistrer” dans `components/common/`

* évite duplication
* gère pop-up de confirmation
* utilisé désormais dans :

  * Promotions
  * Enseignants

---

## 🎨 Nouveau header unifié dans la modale enseignant

`TeacherModeBadge` supporte maintenant deux variantes :

### 🟩 `variant="header"`

Grosse pill avec :

* titre (ex: *Détail enseignant*)
* nom complet
* icône du mode
* couleur de fond unique selon mode
* design responsive

### 🟦 `variant="card"`

Utilisé dans les cards liste (v1.7).

---

## 🌙 Améliorations thème sombre

* Input, pills, modale, icônes adaptés
* Meilleure lisibilité du badge présentiel/distanciel/hybride
* Ombres ajustées
* Contrastes respectés dans la grille de disponibilités

---

## 🎨 Thème sombre

L’application inclut désormais un switch dans la Sidebar permettant de basculer entre :
- Thème clair
- Thème sombre

Le switch applique automatiquement :
```js
document.documentElement.setAttribute('data-theme', 'dark')
// ou
document.documentElement.setAttribute('data-theme', 'light')
```
Le thème repose sur styles/themes/dark.css + variables CSS globales.
Le choix peut être persistant via localStorage.

---

# 📂 Structure du projet (mise à jour v1.8)

```
src/
├─ assets/
├─ components/
│   ├─ teachers/
│   │   ├── TeacherCard.jsx
│   │   ├── TeacherDetailCard.jsx
│   │   ├── TeacherModeBadge.jsx
│   │   └── section/
│   │        ├── TeacherInfoColumn.jsx
│   │        ├── TeacherSubjectsColumn.jsx
│   │        └── TeacherAvailabilityColumn.jsx
│   ├─ common/
│   │   ├── DateRangePill.jsx
│   │   ├── ActionButtonsWithConfirm.jsx
│   │   └── ConfirmDialog.jsx
│   └── promotions/
│       └── ... (inchangé v1.8)
├─ hooks/
│   ├─ teachers/
│   │    └── useTeacherDetail.js
│   └─ promotions/
├─ pages/
│   ├── PlanningMacro.jsx
│   ├── Promotions.jsx
│   ├── Teachers.jsx   <-- NOUVEAU COMPLET
│   └── Placeholder.jsx
├─ styles/
│   ├─ token.css
│   ├─ base.css
│   ├─ components.css
│   ├─ pages/
│   │   ├── promotions/
│   │   └── teachers/
│   │        ├── _layout.css
│   │        ├── _card.css
│   │        ├── _detail-modal.css
│   │        ├── _toolbar.css
│   │        └── index.css
│   └── themes/dark.css
```

---

# ✨ Fonctionnalités actuelles (v1.8)

* ✔ Sidebar responsive
* ✔ Thème clair / sombre
* ✔ Planning macro
* ✔ Promotions : cycles, groupes, matières, contraintes
* ✔ **Enseignants : gestion complète**

  * liste
  * modale détail
  * édition complète
  * disponibilités
  * périodes
* ✔ Composants communs :

  * DateRangePill
  * ConfirmDialog
  * ActionButtonsWithConfirm

---

## 🛠️ Scripts

- `npm run dev` — développement
- `npm run build` — build production
- `npm run preview` — prévisualiser la build
- `npm run lint` — ESLint

---

## 📌 Technologies

- React  
- Vite  
- react-router-dom  
- JavaScript (ES2022)  
- CSS moderne (layers, tokens)

---

## 🧑‍💻 Conventions Git & Versioning

Fidèle aux priorités du projet :

- **Commit lint : Conventional Commits**
- **Branches :**
  - `master` = stable
  - `feat/*`, `fix/*`, `refactor/*`, …
- **Versioning : SemVer**
  - v1.7 = refacto majeure Promotions + système complet des contraintes

---

## 🗺️ Roadmap (extraits)

- Vue micro par promotion
- Événements campus
- Amélioration accessibilité
- Intégration backend future

---

💡 Projet développé dans le cadre d’AP5 à Junia.
