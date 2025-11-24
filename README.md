# OPALE Front (v1.7)

Interface web du projet **OPALE**, développée en **React** avec **Vite**.  
Objectif : piloter la génération d’un planning **macro** annuel et des vues **micro** par promotion.

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
- `/evenements`, `/enseignants`, `/salles`, `/parametres` — placeholders
- `/` → redirection vers `/planning`
- Non trouvé → page 404 (placeholder)

---

## ✨ Nouveautés de la version 1.7

### 🧩 **Refactorisation majeure de la page Promotions**

- Extraction de toute la logique dans **des hooks dédiés** :
  - `usePromotionCycles`
  - `usePromotionEditing`
  - `usePromotionAdjustPopup`
  - `usePromotionConstraints`
- `Promotions.jsx` est désormais **beaucoup plus léger**, lisible et maintenable.

### 📦 **Nouveau système de contraintes académiques**

Chaque promotion dispose désormais de **5 catégories de contraintes** :

- Vacances (ou **Entreprise** si le nom de la promo commence par “AP”)
- Stages
- International
- Partiels
- Rattrapages

### 🗂️ **Refacto UI en composants**

Création de composants réutilisables :

```
src/components/promotions/constraints/
 ├── ConstraintsSection.jsx
 └── ConstraintCard.jsx
```

Les 5 cartes de contraintes utilisent maintenant le même composant générique.

### 📅 **Gestion complète des plages de dates**

- Bouton **+** dans chaque carte
- Ajout d’une plage avec deux champs `date`
- Modification inline (“jj/mm/aaaa - jj/mm/aaaa”)
- Bouton **−** pour supprimer une plage
- Stylisation colorée harmonisée selon la catégorie

### 🏷️ **Support automatique AP → Entreprise**

Si le nom de la promo commence par **“AP”** :  
→ le bloc “Vacances” devient automatiquement **Entreprise**  
→ avec ses couleurs dédiées.

### ⚠️ **Correction du système de warning**

- Le warning s’affiche uniquement si `hasPromoMismatch(promo)` retourne **true**
- Suppression des faux positifs sur les promotions avec 0 étudiant

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

## 📂 Structure du projet (mise à jour v1.7)

```
src/
├─ assets/
├─ components/
│   ├─ promotions/
│   │   ├── PromoEditDialog.jsx
│   │   ├── PromoAdjustDialog.jsx
│   │   └── constraints/
│   │        ├── ConstraintsSection.jsx
│   │        └── ConstraintCard.jsx
│   │        └── ConstraintPill.jsx
│   ├─ Checklist.jsx
│   └─ Sidebar.jsx
├─ hooks/
│   └─ promotions/
│        ├── usePromotionCycles.js
│        ├── usePromotionEditing.js
│        ├── usePromotionAdjustPopup.js
│        └── usePromotionConstraints.js
├─ pages/
│   ├── PlanningMacro.jsx
│   ├── Promotions.jsx
│   └── Placeholder.jsx
├─ utils/
│   └── promoUtils.js
├─ styles/
│   ├─ token.css
│   ├─ base.css
│   ├─ components.css
│   ├─ pages/
│   │   └── promotions/
│   │        ├── _layout.css
│   │        ├── _promo-row.css
│   │        ├── _edit-modal.css
│   │        ├── _lists.css
│   │        ├── _adjust-popup.css
│   │        └── index.css
│   └── themes/dark.css
├─ App.jsx
└─ main.jsx
```

---

## ✨ Fonctionnalités actuelles

- Sidebar responsive
- Routing complet du projet
- Checklist planning macro
- Gestion cycles + promotions
- Ajustements automatiques
- Système de contraintes académiques (v1.7)
- Mode sombre prêt
- CSS modulaire

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
