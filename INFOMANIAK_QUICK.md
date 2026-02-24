# 📋 Infomaniak - Aide-mémoire rapide

## Configuration rapide dans l'interface Infomaniak

### 📦 Page "Node.js" > Configuration

#### Section: Construction de l'application

```
npm install && npm run build
```

☑️ Cochez : "Construire automatiquement l'application une fois l'installation terminée"

#### Section: Exécution de l'application

**Commande d'exécution:**

```
npm start
```

**Port d'écoute:**

```
3000
```

☑️ Cochez : "Lancer automatiquement l'application une fois l'installation terminée"

---

## 🔐 Variables d'environnement

Dans l'interface Infomaniak > Variables d'environnement > Ajouter :

| Variable         | Valeur          | Description                       |
| ---------------- | --------------- | --------------------------------- |
| `PORT`           | `3000`          | Port du serveur                   |
| `NODE_ENV`       | `production`    | Mode production                   |
| `SESSION_SECRET` | `[GÉNÉRER]`     | Secret sessions (voir ci-dessous) |
| `DATA_DIR`       | `./server/data` | Dossier données                   |

### Générer SESSION_SECRET sécurisé

Via terminal SSH sur Infomaniak ou localement :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copier-coller la valeur générée (ex: `a8f5f167f44f4964e6c998dee827110c055c29dcb88f7e45f1b6f6c2f5a6e0b4`)

---

## 🚀 Redéploiement rapide

### Via Git

1. Poussez vos changements :

   ```bash
   git push
   ```

2. Dans Infomaniak :
   - Cliquez sur **"Redéployer"** ou **"Pull & Restart"**
   - Attendez la fin du build
   - Vérifiez les logs

### Via FTP (si pas de Git)

1. Uploadez les fichiers modifiés :
   - `server/` (tout le dossier)
   - `dist/` (si vous avez fait un build local)
   - `package.json` (si modifié)

2. Redémarrez dans l'interface Infomaniak

---

## ✅ Tests rapides après déploiement

### 1. Test API santé

```bash
curl https://votre-domaine.ch/api/health
```

✅ Attendu : `{"status":"ok","timestamp":"..."}`

### 2. Test frontend

Ouvrir dans le navigateur : `https://votre-domaine.ch`

✅ Attendu : Page de login

### 3. Test données

1. Connectez-vous
2. Ajoutez un enfant
3. Ajoutez des entrées horaires
4. Changez de vue (Calendrier ↔ FullCalendar)
5. ✅ Les données doivent persister

---

## 🆘 Commandes utiles (SSH)

### Vérifier les logs

```bash
# Dans le dossier de l'application
tail -f logs/output.log
```

### Redémarrer manuellement

```bash
# Via l'interface Infomaniak > Redémarrer
# ou via SSH si configuré
pm2 restart kiddytime
```

### Vérifier l'espace disque

```bash
df -h
du -sh server/data/
```

### Backup des données

```bash
# Créer une sauvegarde
tar -czf backup-$(date +%Y%m%d).tar.gz server/data/

# Télécharger via FTP/SFTP
```

---

## 📞 Checklist pré-déploiement

- [ ] `.env` configuré avec `SESSION_SECRET` unique
- [ ] `NODE_ENV=production` défini
- [ ] `PORT=3000` configuré
- [ ] Git repository connecté (si déploiement Git)
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm start`
- [ ] Auto-build activé ✅
- [ ] Auto-start activé ✅

---

## 📊 Monitoring

### Métriques à surveiller

- ✅ Temps de réponse API : < 500ms
- ✅ Taille `server/data/` : surveillez la croissance
- ✅ Logs d'erreurs : vérifiez régulièrement
- ✅ Uptime : doit être proche de 100%

### Alertes recommandées

Dans l'interface Infomaniak, configurez des alertes pour :

- Application down
- Utilisation CPU > 80%
- Utilisation RAM > 80%
- Espace disque < 10%

---

**Dernière mise à jour** : 24 février 2026  
**Version app** : 0.1.0

Pour plus de détails :

- [INFOMANIAK_CONFIG.md](./INFOMANIAK_CONFIG.md) - Configuration complète
- [INFOMANIAK_UPDATE.md](./INFOMANIAK_UPDATE.md) - Guide de mise à jour
- [DEPLOYMENT_NODEJS.md](./DEPLOYMENT_NODEJS.md) - Documentation détaillée
