# Configuration Infomaniak Node.js - KiddyTime

## 📝 Paramètres à remplir dans l'interface Infomaniak

### Construction de l'application

**Commande de construction :**

```bash
npm run build
```

✅ **Construire automatiquement l'application une fois l'installation terminée** : **Coché**

> Cette commande crée le dossier `dist/` avec les fichiers React optimisés pour la production.

### Exécution de l'application

**Commande d'exécution :**

```bash
npm start
```

**Port d'écoute :**

```
3000
```

> Le serveur Express sert à la fois l'API (`/api/*`) et les fichiers statiques du frontend.

### Lancement de l'application

✅ **Lancer automatiquement l'application une fois l'installation terminée** : **Coché**

---

## 🔐 Variables d'environnement obligatoires

Dans l'interface Infomaniak ou via un fichier `.env` :

```env
PORT=3000
NODE_ENV=production
SESSION_SECRET=CHANGEZ-CETTE-VALEUR-PAR-UN-SECRET-ALEATOIRE-SECURISE
DATA_DIR=./server/data
```

### Génération d'un SESSION_SECRET sécurisé

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**⚠️ CRITIQUE** : 
- Ne JAMAIS commiter le `SESSION_SECRET` dans Git
- Utilisez une valeur unique par environnement
- Minimum 32 caractères aléatoires

---

## 📦 Résumé rapide

| Paramètre               | Valeur                    |
|-------------------------|---------------------------|
| **Build Command**       | `npm run build`           |
| **Start Command**       | `npm start`               |
| **Port**                | `3000`                    |
| **Auto Build**          | ✅ Oui                    |
| **Auto Start**          | ✅ Oui                    |
| **Node Version**        | 18.x ou supérieur         |

---

## 🚀 Mise à jour d'une application déjà déployée

Si votre application est déjà en ligne et que vous devez la mettre à jour :

👉 **Consultez [INFOMANIAK_UPDATE.md](./INFOMANIAK_UPDATE.md)** pour les instructions détaillées.

---

## ✅ Vérifications post-déploiement

### 1. Santé du serveur

```bash
curl https://votre-domaine.ch/api/health
```

Réponse attendue :
```json
{"status":"ok","timestamp":"2026-02-24T..."}
```

### 2. Frontend accessible

Ouvrez `https://votre-domaine.ch` dans votre navigateur.

### 3. Authentification

- Première visite : Créez votre mot de passe
- Visites suivantes : Connectez-vous

### 4. Données persistantes

- Vérifiez que le dossier `server/data/` contient :
  - `users.json`
  - `children.json`
  - `entries.json`

---

## 📁 Architecture en production

```
/
├── dist/                 # Frontend compilé (créé par npm run build)
│   ├── index.html
│   ├── assets/
│   └── ...
├── server/               # Backend Node.js
│   ├── index.js         # Serveur Express principal
│   ├── db.js            # Gestion base de données JSON
│   ├── data/            # 📊 Données (créé automatiquement)
│   │   ├── users.json
│   │   ├── children.json
│   │   └── entries.json
│   ├── middleware/
│   │   └── auth.js
│   └── routes/
│       ├── auth.js
│       ├── children.js
│       └── entries.js
├── package.json
└── .env                 # ⚠️ Ne PAS commiter
```

---

## 🔒 Sécurité

- ✅ Sessions sécurisées avec `httpOnly` cookies
- ✅ Mots de passe hashés avec bcrypt
- ✅ HTTPS forcé en production
- ✅ CORS configuré correctement
- ✅ Protection CSRF via `sameSite: 'lax'`

---

## 📚 Documentation complète

- Configuration initiale : [INFOMANIAK_CONFIG.md](./INFOMANIAK_CONFIG.md) (ce fichier)
- Mise à jour : [INFOMANIAK_UPDATE.md](./INFOMANIAK_UPDATE.md)
- Déploiement détaillé : [DEPLOYMENT_NODEJS.md](./DEPLOYMENT_NODEJS.md)

---

**Dernière mise à jour** : 24 février 2026

