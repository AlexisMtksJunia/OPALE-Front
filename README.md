# OPALE Front (v1.8.4.2)

Interface web du projet **OPALE**, développée en **React** avec **Vite**.  
Objectif : piloter la génération d’un planning **macro** annuel et des vues **micro** par promotion et par enseignant.

> ⚠️ Portée actuelle : **front uniquement** — toute action côté back est simulée via `console.log()`.

---

# 🚀 Installation

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

# 🧭 Routing

Le projet utilise **react-router-dom** (routing minimal) :

- `/planning` — Génération du planning **macro**
- `/promotions` — Gestion des cycles et promotions (CRUD local + contraintes académiques)
- `/enseignants` — Liste des enseignants + détail + disponibilités
- `/evenements`, `/salles`, `/parametres` — placeholders
- `/` → redirection vers `/planning`
- Non trouvé → page 404 (placeholder)

---

# ✨ **Nouveautés des versions 1.8.2 → 1.8.4.2**

Cette série de versions 1.8.x représente un **énorme travail de stabilisation, refactorisation et unification de l’interface**, ainsi que l’arrivée de nouvelles pages (Rooms, Events) et d’une architecture plus modulaire.

---

## 🧩 **v1.8.2 — Unification des dialogs + Drag & Drop promotions**

### ✔ Refonte du système de fenêtres modales (`ConfirmDialog`)

* Fermeture unifiée via :

  * **ESC**
  * clic **overlay**
  * bouton **✕**
* Support du **cross-button** (teachers + promotions)
* Suppression de la duplication de logique dans les cartes et dialogs
* Sécurisation des fermetures intempestives

### ✔ Amélioration UX : correction des comportements ESC / Cancel

### ✔ Promotions : nouvelles fonctionnalités

* **Drag & Drop Excel**
* **Refactor CycleCard** (structure simplifiée + CSS réduit)
* **Introduction de mock data** pour les cycles et promotions
  → début de la séparation données / UI.

---

## 🏫 **v1.8.3 — Page Salles + état dirty unifié**

### ✔ Fix du système de dirty-state

* Le bouton “Enregistrer” remet correctement `hasChanges = false`
* Correction des fermetures intempestives après sauvegarde

### ✔ Nouvelle page **Rooms**

* Liste des salles
* **RoomDetailCard initiale** avec :

  * types disponibles
  * type principal
  * champs nom + surnom
* Début d’un système commun aux modales Teachers / Rooms

---

## 🎨 **v1.8.4.0 — Refactorisation UI massive**

## 🧱 Réorganisation structurelle du front

* Répartition des assets dans des sous-dossiers cohérents
* Refonte du *header* des pages (uniformisation Teachers / Rooms / Events)
* Refonte du *toolbar* (search + filtres)
* Nettoyage CSS transversal :

  * badges
  * cards
  * listes
  * couleurs
  * supports dark mode

> Cette version pose les bases du **design system** utilisé dans 1.8.4.1 et 1.8.4.2.

---

## 📆 **v1.8.4.1 — Nouvelle page Événements + Card détail événement**

### ✔ Page Événements complète

* Recherche
* Filtre par cible (Tous / Junia / Externe)
* Filtre par type d’événement
* Filtre par date (du / au)
* Groupement automatique par **mois** et par **année**

### ✔ EventCard moderne (alignée avec Teachers & Rooms)

* badges unifiés
* icônes par type
* couleurs harmonisées
* responsive + dark mode

### ✔ EventDetailCard (nouvelle modale)

* structure à **2 colonnes**
* header unifié (badge + icône)
* édition du nom, dates, type, cible, lieu, description
* support ESC + overlay close
* intégration de `ActionButtonsWithConfirm`
* flow **Création d’événement** avec card vide (bouton "+")
* snapshot + détection des modifications

---

## 🏛️ **v1.8.4.2 — Factorisation majeure & refonte RoomDetailCard**

> C’est LA version clé de la branche 1.8.x.
> Elle transforme le front en un système cohérent, modulaire et extensible.

### 🧩 **1. Composants transverses pour toutes les modales**

#### 🔸 `ActionButtonsWithConfirm`

Maintenant utilisé dans :

* Teachers
* Promotions
* Events
* Rooms

Fonctionnalités :

* Confirmations d’annulation/sauvegarde
* Gestion état dirty
* Fermeture automatique après save
* Support ESC / overlay intégré

#### 🔸 Système de **header unifié**

Pour :

* Teachers
* Rooms
* Events

Toujours même structure :

* icône
* label
* couleur spécifique
* responsive

#### 🔸 Style unifié des inputs, pills, textarea

→ même expérience dans toutes les modales.

---

### 🧱 **2. Refonte complète de la RoomDetailCard**

#### Nouveau layout 2 colonnes

* **Gauche** : nom, surnom, type principal, types disponibles
* **Droite** : description étirable

#### Footer séparé

→ les boutons n’affectent plus l’alignement vertical.

#### Pills unifiées :

* dot radio pour type principal
* checkbox visuelle pour types disponibles

#### Alignement vertical parfait entre colonnes

→ expérience identique à EventDetailCard.

---

### 🧼 **3. Nettoyage & réduction massive du CSS**

* fusion des styles dupliqués
* simplification des variables
* réduction des règles pour pills, inputs, cards
* facteur commun entre Events, Teachers, Rooms
* dark mode homogène

---

### 🏗️ **4. Architecture stabilisée**

* début d’un vrai **design system minimal**
* séparation logique/UI via hooks (ex : `useEventDetail`)
* modales désormais construites via un **schéma commun**
  → très facile de créer une nouvelle fiche détail (campus, matières, etc.)

---

## ⭐ **Résumé des apports de 1.8.4.2**

| Domaine      | Améliorations                                              |
| ------------ | ---------------------------------------------------------- |
| UI           | unification complète modales + cards                       |
| UX           | comportements cohérents (focus, ESC, overlay, dirty state) |
| Architecture | composants transverses, factorisation, structure modulable |
| CSS          | réduction, homogénéisation, dark mode propre               |
| Fonctionnel  | Refonte RoomDetailCard + perfectionnement EventDetailCard  |

# 📂 Structure du projet (mise à jour v1.8)

```
src/
├─ assets/
│   ├── icons/
│   │   ├── ic-add.svg
│   │   ├── ic-arrow-down.svg
│   │   ├── ic-arrow-left.svg
│   │   ├── ic-arrow-right.svg
│   │   ├── ic-calendar.svg
│   │   ├── ic-close.svg
│   │   ├── ic-delete.svg
│   │   ├── ic-edit.svg
│   │   ├── ic-filter.svg
│   │   ├── ic-plus.svg
│   │   ├── ic-search.svg
│   │   └── ic-warning.svg
│   │
│   ├── rooms/
│   │   ├── ic-room-autre.png
│   │   ├── ic-room-projet.png
│   │   ├── ic-room-td.png
│   │   ├── ic-room-tp_electronique.png
│   │   └── ic-room-tp_numerique.png
│   │
│   ├── events/
│   │   ├── ic-event-conference.png
│   │   ├── ic-event-exam.png
│   │   ├── ic-event-forum.png
│   │   ├── ic-event-jpo.png
│   │   ├── ic-event-other.png
│   │   ├── ic-event-salon.png
│   │   └── ic-event-workshop.png
│   │
│   └── teachers/
│   │   ├── ic-teacher-distanciel.png
│   │   ├── ic-teacher-hybride.png
│   │   ├── ic-teacher-presentiel.png
│   │   └── icon-avatar.png
│   │ 
│   ├── ic-modif.png
│   ├── ic-moins.png
│   ├── ic-plus.png
│   ├── ic-search.png
│   ├── ic-tel.png
│   ├── ic-user.png
│   └── ic-warning.png
│
├─ components/
│   ├─ common/
│   │   ├── ActionButtonsWithConfirm.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── DetailCardBody.tsx
│   │   ├── DetailCardBody.tsx
│   │   ├── DetailCardFooter.tsx
│   │   ├── DateRangeHeader.tsx
│   │   ├── EntityBadge.tsx
│   │   ├── EntityCard.tsx
│   │   ├── PageHeader.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── Toolbar.tsx
│   │   └── ToolbarSearch.tsx
│   │
│   ├─ events/
│   │   ├── EventCard.tsx
│   │   ├── EventDetailCard.tsx
│   │   ├── EventSection.tsx
│   │   ├── EventTypeBadge.tsx
│   │   └── EventsToolbar.tsx
│   │
│   ├─ promotions/
│   │   ├─ constraints/
│   │   │   ├── ConstraintCard.tsx
│   │   │   ├── ConstraintPill.tsx
│   │   │   └── ConstraintsSection.tsx
│   │   │
│   │   ├─ cycles/
│   │   │   ├── CycleCard.tsx
│   │   │   ├── CycleImportDropzone.tsx
│   │   │   └── ConstraintsSection.tsx
│   │   │
│   │   ├─ sections/
│   │   │   ├── PromoGroups.tsx
│   │   │   ├── PromoMainInfo.tsx
│   │   │   └── PromoSpecialities.tsx
│   │   │
│   │   ├── PromoAdjustDialog.tsx
│   │   └── PromoEditDialog.tsx
│   │
│   ├─ rooms/
│   │    ├── RoomCard.tsx
│   │    ├── RoomTypeBadge.tsx
│   │    ├── RoomSection.tsx
│   │    └── RoomTypeBadge.tsx
│   │
│   ├── teachers/
│   │    ├── sections/
│   │    │   ├── TeacherAvailabilityColumn.tsx
│   │    │   ├── TeacherInfoColumn.tsx
│   │    │   └──TeacherSubjectsColumn.tsx
│   │    ├── TeacherCard.tsx
│   │    ├── TeacherCardsGrid.tsx
│   │    ├── TeacherDetailCard.tsx
│   │    ├── TeacherModeBadge.tsx
│   │    ├── TeacherSection.tsx
│   │    └── TeacherToolbar.tsx
│   │
│   ├── Checklist.tsx
│   ├── Sidebar.tsx
│   └── ThemeToogle.tsx
│   
├─ hooks/
│   ├─ common/
│   │    ├── useDetailDirtyClose.ts
│   │    └── useDetailEscapeClose.ts
│   │
│   ├─ events/
│   │    └── useEventDetail.ts
│   │
│   ├─ promotions/
│   │    ├── index.ts
│   │    ├── usePromotionAdjustPopup.js
│   │    ├── usePromotionConstraints.js
│   │    ├── usePromotionCycles.js
│   │    └── usePromotionEditing.js
│   │
│   └─ teachers/
│   │    └── useTeacherDetail.js
│   │
│   └── useTheme.js
│
├─ mocks/
│   ├── events.mock.ts
│   ├── promotions.mock.ts
│   ├── rooms.mock.ts
│   └── teachers.mock.ts
│
├─ models/
│   ├── CampusEvent.ts
│   ├── Constraints.ts
│   ├── Cycle.ts
│   ├── DateRange.ts
│   ├── GroupSpecialtyItem.ts
│   ├── index.ts
│   ├── Promotion.ts
│   ├── Room.ts
│   ├── Teacher.ts
│   └── Theme.ts
│
├─ pages/
│   Events.tsx
│   Placeholder.tsx
│   PlanningMacro.tsx
│   Promotions.tsx
│   Rooms.tsx
│   Teachers.tsx
│
├─ services/
│   ├── api/
│   │    ├── coursesApi.ts
│   │    ├── edtApi.ts
│   │    ├── maquetteApi.ts
│   │    ├── professorsApi.ts
│   │    ├── promotionsApi.ts
│   │    └── roomsApi.ts
│   │
│   ├── base/
│   │    ├── ApiClient.ts
│   │    ├── AuthService.ts
│   │    └── type.ts
│   └── index.ts
│
├─ styles/
│   ├─ common/
│   │    ├── _action-buttons.css
│   │    ├── _buttons.css
│   │    ├── _checklist.css
│   │    ├── _confirm-dialog.css
│   │    ├── _date-range-pill.css
│   │    ├── _detail-card-footer.css
│   │    ├── _detail-card-header.css
│   │    ├── _detail-card-footer.css
│   │    ├── _entity-badge.css
│   │    ├── _entity-card.css
│   │    ├── _nav-links.css
│   │    ├── _page-header.css
│   │    ├── _section-header.css
│   │    ├── _theme-toogle.css
│   │    └── toolbar.css
│   │
│   ├─ pages/
│   │   ├─ events/
│   │   │    ├── _cards.css
│   │   │    ├── _detail-modal.css
│   │   │    ├── _layout.css
│   │   │    ├── _toolbar.css
│   │   │    └── index.css
│   │   │
│   │   ├─ login/
│   │   │    └── _login-page.css
│   │   │
│   │   ├─ promotions/
│   │   │    ├── _adjust-popup.css
│   │   │    ├── _edit-modal.css
│   │   │    ├── _layout.css
│   │   │    ├── _lists.css
│   │   │    ├── _promo-row.css
│   │   │    └── index.css
│   │   │
│   │   ├─ rooms/
│   │   │    ├── _cards.css
│   │   │    ├── _detail-modal.css
│   │   │    ├── _layout.css
│   │   │    ├── _sections.css
│   │   │    └── index.css
│   │   │
│   │   └── teachers/
│   │        ├── _availability.css
│   │        ├── _cards.css
│   │        ├── _detail-modal.css
│   │        ├── _layout.css
│   │        ├── _sections.css
│   │        ├── _toolbar.css
│   │        └── index.css
│   │
│   └─ themes/
│   │    └── dark.css
│   ├── token.css
│   ├── base.css
│   └── components.css
│
└─ utils/
│   └── promoUtils.ts
│
├──  App.tsx
├──  main.tsx
└──  vite-env.d.ts
```

---

# ✨ Fonctionnalités actuelles (**v1.8.4.2**)

## 🧭 **Structure générale**

* ✔ **Sidebar responsive**
* ✔ **Thème clair / sombre** (persistant)
* ✔ **Routing complet**
  Pages : Planning, Promotions, Enseignants, Événements, Salles

---

## 📅 **Planning Macro**

* Gestion des checklists et prérequis
* Interface unifiée avec tokens et dark mode

---

## 🎓 **Promotions**

* Gestion complète :

  * cycles
  * groupes
  * matières
  * contraintes académiques (5 catégories)
* Modales d’édition + ajustements automatiques
* Drag & Drop Excel (v1.8.2)
* Refactorisation des cartes et des hooks

---

## 👨‍🏫 **Enseignants**

* Liste des enseignants (carte moderne)
* **TeacherDetailCard** complète :

  * informations personnelles
  * matières
  * disponibilités avancées
  * gestion des périodes
* UI unifiée (inputs, pills, badges)
* Dark mode propre

---

## 🏫 **Salles**

* Page de gestion des salles
* **Refonte totale de la RoomDetailCard (v1.8.4.2)** :

  * layout 2 colonnes
  * type principal + types disponibles
  * description étirable
  * footer unifié (actions)

---

## 📆 **Événements** *(nouveauté 1.8.4.1 / 1.8.4.2)*

* Page Événements complète :

  * recherche
  * filtres (type, cible, dates)
  * regroupement automatique par mois et année
* **EventDetailCard** :

  * édition complète
  * header unifié
  * description
  * création d’événement (flow “+”)

---

## 🧩 **Composants communs & factorisation (v1.8.2 → v1.8.4.2)**

### Composants transverses

* ✔ **DateRangePill**
* ✔ **ConfirmDialog**
* ✔ **ActionButtonsWithConfirm**
* ✔ **Header Pills (badges unifiés)**
* ✔ **SectionHeader** (collapsable dans Événements)

### Unification globale

* Inputs cohérents
* Pills cohérentes (radio/checkbox)
* Comportements modaux identiques (ESC, overlay, closable)
* Footer standard pour toutes les cards détail
* CSS factorisé (cards, badges, modales, toolbars)

---

## 🧱 **Architecture & Code**

* Séparation logique via hooks (`useEventDetail`, `useRoomDetail`, `useTeacherDetail`, …)
* Réduction massive du CSS dupliqué
* Réorganisation des assets (1.8.4.0)
* Structure des pages alignée Teachers / Rooms / Events
* Base solide pour la future **vue micro** et les futures entités

---

# ⭐ Résumé

La version **1.8.4.2** marque l’aboutissement d’une **unification UX/UI** et d’une **stabilisation technique profonde**, rendant le projet :

* plus lisible
* plus cohérent
* plus maintenable
* plus scalable pour les prochains modules

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