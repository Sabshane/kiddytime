# Configuration Infomaniak Node.js - KiddyTime

## 📝 Paramètres à remplir

### Construction de l'application

**Commande de construction :**

```
npm run build
```

✅ **Construire automatiquement l'application une fois l'installation terminée** : **Coché**

### Exécution de l'application

**Commande d'exécution :**

```
npm start
```

**Port d'écoute :**

```
3000
```

### Lancement de l'application

✅ **Lancer automatiquement l'application une fois l'installation terminée** : **Coché**

---

## 🔐 Variables d'environnement obligatoires

Créez un fichier `.env` avec :

```env
PORT=3000
NODE_ENV=production
SESSION_SECRET=CHANGEZ-CETTE-VALEUR-PAR-UN-SECRET-ALEATOIRE
DATA_DIR=./server/data
```

**⚠️ IMPORTANT** : Changez `SESSION_SECRET` par une longue chaîne aléatoire !

---

## 📦 Résumé pour Infomaniak

| Paramètre     | Valeur          |
| ------------- | --------------- |
| Build Command | `npm run build` |
| Start Command | `npm start`     |
| Port          | `3000`          |
| Auto Build    | ✅ Oui          |
| Auto Start    | ✅ Oui          |

---

Pour plus de détails, consultez [DEPLOYMENT_NODEJS.md](./DEPLOYMENT_NODEJS.md)
