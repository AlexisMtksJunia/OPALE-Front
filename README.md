# OPALE Front

Interface web du projet **OPALE**, développée en **React** avec **Vite**.

## 🚀 Installation

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

Par défaut, l’application est accessible sur **http://localhost:5173**

## 📂 Structure du projet

```
opale-front/
 ├─ public/           # ressources publiques (logo, icônes…)
 ├─ src/
 │   ├─ assets/       # images utilisées dans l'UI
 │   ├─ components/   # composants réutilisables (Sidebar, Checklist…)
 │   ├─ pages/        # pages principales (ex : Promotions)
 │   ├─ App.jsx       # composant racine
 │   ├─ main.jsx      # point d’entrée React
 │   └─ index.css     # styles globaux
 ├─ package.json
 ├─ vite.config.js
 └─ README.md
```

## ✨ Fonctionnalités actuelles

- **Sidebar responsive** avec navigation et icônes
- **Déconnexion** (print console)
- **Génération planning macro** avec checklist interactive
- **Gestion des promotions** : cycles, promotions, classes (structure de base)
- Responsive design (desktop / mobile)

## 🛠️ Scripts disponibles

- `npm run dev` : lance l’application en mode développement
- `npm run build` : build pour la production (sortie dans `/dist`)
- `npm run preview` : prévisualise la version buildée
- `npm run lint` : exécute ESLint

## 📌 Technologies

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript)
- [CSS3](https://developer.mozilla.org/fr/docs/Web/CSS)

---

💡 Projet développé dans le cadre d’AP5 à Junia.
