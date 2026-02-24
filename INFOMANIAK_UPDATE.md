# 🔄 Mise à jour KiddyTime sur Infomaniak

## Correctif appliqué : Persistance des données entre vues

### 🐛 Problème corrigé

Les données entrées dans la vue Calendrier ne persistaient pas lors du changement vers la vue FullCalendar. Le serveur ne sauvegardait que les champs legacy (`arrivalTime`, `leavingTime`, `notes`) et ignorait les nouveaux champs (`segments`, `isAbsent`, `hasMeal`, `hasSnack`, etc.).

### ✅ Fichiers modifiés

- `server/routes/entries.js` - Routes de sauvegarde des entrées (POST et PUT)
- `src/views/FullCalendarView.tsx` - Rechargement des données lors de la navigation
- `package.json` - Suppression du script `postinstall` (conflit avec build Infomaniak)

---

## 📋 Instructions de mise à jour Infomaniak

### Méthode 1 : Via Git (RECOMMANDÉ)

Si votre app est connectée à un repository Git sur Infomaniak :

1. **Poussez les changements vers le repository**

   ```bash
   git add .
   git commit -m "Fix: data persistence between views"
   git push
   ```

2. **Redéployez sur Infomaniak**
   - Connectez-vous à votre interface Infomaniak
   - Allez dans **Hébergement** > **Node.js**
   - Cliquez sur **Redéployer** ou **Pull & Restart**
   - Infomaniak va automatiquement :
     - Récupérer le nouveau code (git pull)
     - Exécuter la commande de build: `npm install && npm run build`
     - Redémarrer le serveur: `npm start`

3. **Vérifiez les logs**
   - Dans l'interface Infomaniak, consultez les logs
   - Recherchez : `🚀 Server running on port 3000`
   - Vérifiez qu'il n'y a pas d'erreurs

### Méthode 2 : Via FTP/SFTP (Si pas de Git)

1. **Créez une archive mise à jour**

   ```bash
   npm run build

   tar -czf kiddytime-update.tar.gz \
     --exclude='node_modules' \
     --exclude='.git' \
     --exclude='server/data' \
     server/ dist/ package.json package-lock.json
   ```

2. **Uploadez sur Infomaniak**
   - Connectez-vous via FTP/SFTP
   - Remplacez les fichiers suivants :
     - `server/routes/entries.js` ⚠️ CRITIQUE
     - `dist/` (tout le dossier)
     - `package.json`

3. **Redémarrez l'application**
   - Dans l'interface Infomaniak Node.js
   - Cliquez sur **Redémarrer**

---

## 🧪 Tests après mise à jour

### 1. Vérifiez que le serveur fonctionne

```bash
curl https://votre-domaine.ch/api/health
```

Réponse attendue :

```json
{
  "status": "ok",
  "timestamp": "2026-02-24T..."
}
```

### 2. Testez la persistance des données

1. **Ouvrez l'application** : `https://votre-domaine.ch`
2. **Connectez-vous** avec votre mot de passe
3. **Vue Calendrier** :
   - Sélectionnez un enfant et une date
   - Ajoutez des segments horaires (ex: 08:00 - 12:00, 14:00 - 17:00)
   - Cochez "Repas" et/ou "Goûter"
   - Ajoutez une note
4. **Changez de vue** : Cliquez sur l'onglet "Vue Calendrier" (FullCalendar)
5. **Vérifiez** : Les données doivent apparaître dans le calendrier
6. **Retournez** à la vue Calendrier classique
7. **Vérifiez** : Les données sont toujours là (segments, repas, goûter, notes)

### 3. Testez sur mobile

- Testez le même scénario depuis un téléphone
- Vérifiez que l'interface responsive fonctionne bien

---

## 📊 Vérification des données existantes

Si vous aviez déjà des données avant cette mise à jour :

### Les données SONT compatibles ✅

Le correctif utilise la fonction `migrateTimeEntry()` qui gère automatiquement :

- Les anciennes entrées (format legacy)
- Les nouvelles entrées (format avec segments)

**Aucune perte de données** : Vos données existantes restent intactes.

### Si des données manquent

Si certaines données semblent incomplètes après la mise à jour :

1. C'est normal - elles avaient été sauvegardées avec le bug
2. Ré-entrez les informations manquantes
3. Cette fois, elles seront sauvegardées correctement

---

## 🔐 Variables d'environnement (rappel)

Assurez-vous que ces variables sont configurées sur Infomaniak :

```env
PORT=3000
NODE_ENV=production
SESSION_SECRET=votre-secret-aleatoire-securise
DATA_DIR=./server/data
```

⚠️ **Important** : Ne partagez JAMAIS votre `SESSION_SECRET` !

---

## 📱 Configuration Infomaniak (rappel)

| Paramètre                    | Valeur          |
| ---------------------------- | --------------- |
| **Commande de construction** | `npm run build` |
| **Commande d'exécution**     | `npm start`     |
| **Port d'écoute**            | `3000`          |
| **Auto-construction**        | ✅ Activé       |
| **Lancement automatique**    | ✅ Activé       |

---

## 🆘 En cas de problème

### L'application ne démarre pas

1. **Consultez les logs** dans l'interface Infomaniak
2. **Vérifiez** que toutes les dépendances sont installées
3. **Redémarrez** manuellement l'application

### Les données ne persistent toujours pas

1. **Vérifiez** que `server/routes/entries.js` a bien été mis à jour
2. **Consultez les logs** pour voir si des erreurs s'affichent lors de la sauvegarde
3. **Testez l'API** directement :
   ```bash
   # Sauvegardez une entrée test
   curl -X POST https://votre-domaine.ch/api/entries \
     -H "Content-Type: application/json" \
     -d '{
       "childId": "test",
       "date": "2026-02-24",
       "segments": [{"id":"1","arrivalTime":"08:00","leavingTime":"17:00"}],
       "isAbsent": false,
       "hasMeal": true,
       "hasSnack": true,
       "notes": "Test"
     }'
   ```

### Le dossier `server/data` n'existe pas

Le dossier est créé automatiquement au démarrage du serveur. Si erreur :

```bash
# Sur le serveur Infomaniak via SSH
mkdir -p server/data
chmod 755 server/data
```

---

## 📞 Support

Pour toute question :

- Consultez les logs Infomaniak
- Vérifiez [DEPLOYMENT_NODEJS.md](./DEPLOYMENT_NODEJS.md) pour la configuration complète
- Les fichiers de données sont dans `server/data/` (sauvegarde recommandée)

---

**Date de mise à jour** : 24 février 2026  
**Version** : 0.1.0 (après correctif persistance données)
