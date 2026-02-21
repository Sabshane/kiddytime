# Guide de déploiement Node.js - KiddyTime sur Infomaniak

## Configuration Infomaniak Node.js

Voici les paramètres à utiliser dans le panneau de configuration Node.js d'Infomaniak :

### 📦 Paramètres de lancement de Node.js

#### Lancement de l'application

✅ **Lancer automatiquement l'application une fois l'installation terminée** : Coché

#### Construction de l'application

✅ **Construire automatiquement l'application une fois l'installation terminée** : Coché

**Commande de construction** :

```bash
npm run build
```

#### Exécution de l'application

**Commande d'exécution** :

```bash
npm start
```

**Port d'écoute** :

```
3000
```

### 📁 Variables d'environnement

Avant le déploiement, créez un fichier `.env` sur le serveur avec :

```env
PORT=3000
NODE_ENV=production
SESSION_SECRET=your-super-secret-key-change-this
DATA_DIR=./server/data
```

**⚠️ IMPORTANT** : Changez `SESSION_SECRET` par une chaîne aléatoire sécurisée !

Vous pouvez générer un secret aléatoire avec :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🚀 Processus de déploiement complet

### 1. Préparer le code

Sur votre machine locale :

```bash
# S'assurer que tout est à jour
git add .
git commit -m "Ready for production"
git push
```

### 2. Sur Infomaniak

#### Option A : Via Git (Recommandé)

1. Connectez-vous à votre interface Infomaniak
2. Accédez à la section Node.js
3. Configurez le repository Git :
   - URL du repository
   - Branche à déployer (main/master)
4. Configurez les paramètres comme indiqués ci-dessus
5. Sauvegardez

Infomaniak va automatiquement :

- Cloner le repository
- Exécuter `npm install`
- Exécuter `npm run build`
- Démarrer l'application avec `npm start`

#### Option B : Via upload manuel

1. Sur votre machine, créez une archive :

```bash
# Exclure node_modules et autres fichiers inutiles
tar -czf kiddytime.tar.gz \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  --exclude='server/data' \
  .
```

2. Uploadez l'archive sur Infomaniak via FTP/SFTP
3. Décompressez sur le serveur
4. Suivez les étapes de configuration

### 3. Configuration post-déploiement

Une fois l'application déployée :

1. **Vérifiez les logs** dans l'interface Infomaniak pour vous assurer qu'il n'y a pas d'erreurs

2. **Testez l'accès** :

   ```
   https://votre-domaine.ch/
   ```

3. **Testez l'API** :

   ```
   https://votre-domaine.ch/api/health
   ```

   Devrait retourner :

   ```json
   {
     "status": "ok",
     "timestamp": "2026-02-21T..."
   }
   ```

### 4. Première connexion

1. Accédez à votre site
2. Créez votre mot de passe (minimum 4 caractères)
3. Commencez à utiliser l'application !

## 🔧 Structure du projet en production

```
/
├── server/              # Code backend
│   ├── index.js        # Serveur Express principal
│   ├── db.js           # Gestion des données (fichiers JSON)
│   ├── middleware/     # Middleware d'authentification
│   └── routes/         # Routes API
│       ├── auth.js
│       ├── children.js
│       └── entries.js
├── dist/               # Application React compilée
│   ├── index.html
│   ├── assets/
│   └── ...
├── server/data/        # Données (créé automatiquement)
│   ├── users.json
│   ├── children.json
│   └── entries.json
├── package.json
├── .env               # Configuration (à créer)
└── node_modules/
```

## 📊 Comment fonctionne l'application

### Architecture

1. **Frontend (React)** : Compilé dans `dist/` lors du build
2. **Backend (Node.js/Express)** : Sert le frontend et fournit l'API
3. **Données** : Stockées dans des fichiers JSON dans `server/data/`

### Flux de requêtes

```
Utilisateur → https://votre-domaine.ch
           ↓
      Serveur Node.js (port 3000)
           ↓
      ├── / → Sert le React App (dist/)
      └── /api/* → API endpoints
              ↓
         Fichiers JSON (server/data/)
```

## 🔒 Sécurité

### Authentification

- Mot de passe hashé avec bcrypt (10 rounds)
- Sessions sécurisées avec express-session
- Cookies HTTPOnly en production

### Données

- Stockées localement sur le serveur
- Pas de backup automatique (à configurer manuellement)
- Accès restreint par authentification

### Recommandations

1. **HTTPS obligatoire** : Assurez-vous qu'Infomaniak sert votre site en HTTPS
2. **Mot de passe fort** : Utilisez un mot de passe complexe
3. **Backup régulier** : Sauvegardez le dossier `server/data/` régulièrement
4. **Session secret** : Utilisez un secret unique et complexe

## 💾 Sauvegarde des données

### Backup manuel

Via SSH/SFTP, téléchargez le dossier :

```
server/data/
```

Ce dossier contient :

- `users.json` : Utilisateur et mot de passe hashé
- `children.json` : Liste des enfants
- `entries.json` : Entrées horaires

### Restauration

Uploadez simplement les fichiers JSON dans `server/data/` sur le serveur et redémarrez l'application.

## 🔄 Mise à jour de l'application

### Via Git

1. Poussez vos modifications :

```bash
git push
```

2. Dans l'interface Infomaniak :
   - Cliquez sur "Redéployer" ou "Pull & Rebuild"
   - L'application sera automatiquement mise à jour

### Manuel

1. Préparez le nouveau code localement
2. Uploadez les fichiers modifiés
3. Redémarrez l'application via l'interface Infomaniak

**⚠️ Attention** : Ne remplacez JAMAIS le dossier `server/data/` lors d'une mise à jour, vous perdriez toutes les données !

## 🐛 Dépannage

### L'application ne démarre pas

1. **Vérifiez les logs** dans l'interface Infomaniak
2. **Erreurs communes** :
   - Port déjà utilisé → Vérifiez le PORT dans .env
   - Module manquant → Relancez `npm install`
   - Erreur de syntaxe → Vérifiez le code

### Erreur 502 Bad Gateway

- Le serveur Node.js ne répond pas
- Vérifiez que l'application est démarrée
- Consultez les logs d'erreur

### Page blanche

1. Vérifiez que `dist/` existe et contient des fichiers
2. Relancez `npm run build`
3. Vérifiez les logs du navigateur (F12)

### API ne répond pas

1. Testez : `https://votre-domaine.ch/api/health`
2. Vérifiez les logs du serveur
3. Vérifiez la configuration CORS si vous avez un sous-domaine séparé

### Données perdues

Si vous n'avez pas de backup :

- Les données sont perdues définitivement
- Créez un nouveau mot de passe et recommencez

**Solution** : Mettez en place des backups automatiques !

## 📈 Monitoring

### Vérifications régulières

1. **Santé de l'API** : `/api/health`
2. **Logs d'erreur** : Interface Infomaniak
3. **Performance** : Temps de réponse
4. **Espace disque** : Taille du dossier `server/data/`

### Logs

Les logs sont accessibles via l'interface Infomaniak :

- Logs d'application (console.log)
- Logs d'erreur (console.error)
- Logs de démarrage

## 🎯 Checklist de déploiement

Avant de déployer :

- [ ] Code testé localement
- [ ] `npm run build` fonctionne sans erreur
- [ ] `.env.example` documenté
- [ ] `.gitignore` à jour
- [ ] Documentation à jour

Configuration Infomaniak :

- [ ] Port : 3000
- [ ] Commande de build : `npm run build`
- [ ] Commande de start : `npm start`
- [ ] Auto-build : Activé
- [ ] Auto-start : Activé

Post-déploiement :

- [ ] Application accessible
- [ ] API répond (`/api/health`)
- [ ] Login fonctionne
- [ ] CRUD enfants fonctionne
- [ ] Calendrier fonctionne
- [ ] PWA installable

## 📞 Support

### Infomaniak

- Documentation : https://www.infomaniak.com/fr/support
- Support : 24/7 via votre espace client

### Application

Pour toute question sur l'application, référez-vous au README.md principal.

---

**Note** : Ce guide est spécifique au déploiement sur Infomaniak avec Node.js. Les étapes peuvent varier légèrement selon votre configuration spécifique.
