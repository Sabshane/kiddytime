# KiddyTime - Full-Stack PWA

Application mobile-first Progressive Web App avec backend Node.js pour le suivi des horaires d'arrivée et de départ des enfants.

## 🚀 Démarrage rapide

### Installation

```bash
npm install
```

### Développement

```bash
# Option 1 : Frontend + Backend ensemble
npm run dev:full

# Option 2 : Séparément
npm run dev          # Frontend (port 5173)
npm run dev:server   # Backend (port 3000)
```

### Production locale

```bash
npm run build   # Build le frontend
npm start       # Démarre le serveur (port 3000)
```

## 📦 Déploiement sur Infomaniak Node.js

### ⚙️ Configuration requise

| Paramètre                    | Valeur          |
| ---------------------------- | --------------- |
| **Commande de construction** | `npm run build` |
| **Commande d'exécution**     | `npm start`     |
| **Port d'écoute**            | `3000`          |
| **Auto-build**               | ✅ Coché        |
| **Auto-start**               | ✅ Coché        |

### 🔐 Variables d'environnement

Créez `.env` sur le serveur :

```env
PORT=3000
NODE_ENV=production
SESSION_SECRET=VOTRE-SECRET-ALEATOIRE-SECURISE
DATA_DIR=./server/data
```

### 📖 Guides de déploiement

- **[INFOMANIAK_CONFIG.md](./INFOMANIAK_CONFIG.md)** - Configuration rapide
- **[DEPLOYMENT_NODEJS.md](./DEPLOYMENT_NODEJS.md)** - Guide complet

## 🏗️ Architecture

### Stack

**Frontend**: React 18 + TypeScript + Material-UI + Vite + PWA  
**Backend**: Node.js + Express + bcrypt + JSON storage

### Structure

```
kiddytime/
├── src/                # Frontend React
├── server/             # Backend Node.js
│   ├── index.js       # Serveur Express
│   ├── db.js          # Gestion données JSON
│   ├── middleware/    # Auth middleware
│   └── routes/        # API routes
├── dist/              # Build frontend
└── package.json
```

## 🔑 Fonctionnalités

- ✅ **Authentification sécurisée** (bcrypt + sessions)
- 👶 **Gestion des enfants** (CRUD complet)
- 📅 **Calendrier** (vue jour/semaine/mois)
- ⏰ **Horaires par défaut** pour chaque enfant
- 💾 **Stockage JSON** (pas de BDD externe)
- 📱 **PWA** (installable, offline-ready)
- 🔒 **API protégée** par authentification

## 📡 API Endpoints

### Auth

- `POST /api/auth/setup` - Créer mot de passe
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/check` - Vérifier session

### Children

- `GET /api/children` - Liste
- `POST /api/children` - Créer
- `PUT /api/children/:id` - Modifier
- `DELETE /api/children/:id` - Supprimer

### Entries

- `GET /api/entries?startDate=...&endDate=...` - Par période
- `POST /api/entries` - Créer/Modifier
- `PUT /api/entries/:childId/:date` - Modifier

### Health

- `GET /api/health` - Status serveur

## 💾 Données

Stockées dans `server/data/` (JSON) :

- `users.json` - Utilisateur et mot de passe hashé
- `children.json` - Liste des enfants
- `entries.json` - Entrées horaires

**Backup** : Sauvegarder régulièrement le dossier `server/data/`

## 🔒 Sécurité

- Mots de passe hashés (bcrypt, 10 rounds)
- Sessions HTTPOnly cookies
- API routes protégées par authentification
- HTTPS requis en production (PWA)

## 📝 Scripts disponibles

```bash
npm run dev              # Vite dev server
npm run dev:server       # Node.js backend
npm run dev:full         # Frontend + Backend
npm run build            # Build production
npm start                # Serveur production
npm run lint             # Lint TypeScript
```

## 🐛 Dépannage

### Serveur ne démarre pas

```bash
# Vérifier le port
lsof -i :3000
# Changer le port dans .env si nécessaire
```

### API ne répond pas

```bash
curl http://localhost:3000/api/health
# Devrait retourner {"status":"ok",...}
```

### Reset données (⚠️ perte de données)

```bash
rm -rf server/data
# Les fichiers seront recréés au prochain démarrage
```

## 📚 Documentation complète

- [INFOMANIAK_CONFIG.md](./INFOMANIAK_CONFIG.md) - Config rapide Infomaniak
- [DEPLOYMENT_NODEJS.md](./DEPLOYMENT_NODEJS.md) - Guide déploiement détaillé
- [PROJECT_README.md](./PROJECT_README.md) - Doc utilisateur complète

## ✅ Checklist déploiement

**Avant déploiement**

- [ ] `npm run build` fonctionne
- [ ] Tests locaux OK
- [ ] `.env` configuré avec SESSION_SECRET unique

**Configuration Infomaniak**

- [ ] Build: `npm run build`
- [ ] Start: `npm start`
- [ ] Port: `3000`
- [ ] Auto-build et auto-start activés

**Après déploiement**

- [ ] Site accessible
- [ ] `/api/health` retourne OK
- [ ] Login fonctionne
- [ ] Création enfant OK
- [ ] Calendrier OK

---

## 🎉 Prêt pour Infomaniak !

Suivez [INFOMANIAK_CONFIG.md](./INFOMANIAK_CONFIG.md) pour déployer en 5 minutes.

**Version**: 0.1.0 | **Licence**: Private
