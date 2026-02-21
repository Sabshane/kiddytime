# Guide de déploiement - KiddyTime

## Déploiement sur Infomaniak

### 1. Préparation

Assurez-vous d'avoir un compte Infomaniak avec un hébergement web actif.

### 2. Build de production

Dans le terminal, exécutez :

```bash
npm run build
```

Cela génère un dossier `dist/` contenant tous les fichiers de production.

### 3. Upload des fichiers

#### Option A : Via FTP/SFTP

1. Connectez-vous à votre hébergement Infomaniak via FTP (utilisez FileZilla ou un client similaire)
2. Naviguez vers le dossier racine de votre site (généralement `/web` ou `/public_html`)
3. Uploadez **tout le contenu** du dossier `dist/` (pas le dossier lui-même)
4. Assurez-vous que le fichier `.htaccess` est bien uploadé

#### Option B : Via le gestionnaire de fichiers Infomaniak

1. Connectez-vous à votre console Infomaniak
2. Accédez au gestionnaire de fichiers
3. Supprimez le contenu existant du dossier web
4. Uploadez tout le contenu du dossier `dist/`

### 4. Configuration du serveur

Le fichier `.htaccess` est déjà inclus dans le build et gère :

- Le routing pour la SPA (Single Page Application)
- La mise en cache des assets
- La compression gzip

**Important** : Vérifiez que le fichier `.htaccess` est bien présent dans le dossier racine après l'upload.

### 5. Configuration du domaine

Si vous utilisez un sous-domaine ou un domaine personnalisé :

1. Dans la console Infomaniak, configurez votre domaine pour pointer vers le dossier où vous avez uploadé l'application
2. Assurez-vous que HTTPS est activé (Infomaniak le propose gratuitement)

### 6. Vérification

1. Accédez à votre site via le navigateur
2. Vérifiez que l'application charge correctement
3. Testez la navigation entre les différentes pages
4. Ouvrez les DevTools (F12) et vérifiez qu'il n'y a pas d'erreurs dans la console
5. Testez l'installation de la PWA (bouton d'installation dans la barre d'adresse)

### 7. Mode hors ligne (PWA)

La PWA est configurée pour fonctionner en mode hors ligne une fois installée :

- Les fichiers essentiels sont mis en cache
- L'application peut être utilisée sans connexion Internet
- Les données sont stockées localement dans le navigateur

### Mise à jour de l'application

Pour déployer une nouvelle version :

1. Effectuez vos modifications
2. Lancez à nouveau `npm run build`
3. Remplacez les fichiers sur le serveur par le nouveau contenu de `dist/`
4. Les navigateurs des utilisateurs téléchargeront automatiquement la nouvelle version (grâce au service worker)

### Dépannage

#### L'application affiche une page blanche

- Vérifiez que tous les fichiers ont été uploadés
- Vérifiez la console du navigateur pour les erreurs
- Assurez-vous que le fichier `.htaccess` est présent

#### Les routes ne fonctionnent pas (erreur 404)

- Vérifiez que le fichier `.htaccess` est bien présent
- Vérifiez que `mod_rewrite` est activé sur le serveur (généralement activé par défaut sur Infomaniak)

#### La PWA ne s'installe pas

- Vérifiez que le site est servi en HTTPS
- Vérifiez que les icônes sont bien présentes dans `/public`
- Ouvrez les DevTools, onglet "Application" pour voir les erreurs du service worker

### Sauvegarde

Pensez à sauvegarder régulièrement :

- Le code source (via Git)
- Les données des utilisateurs si nécessaire (export du localStorage)

### Support

Pour toute question relative à l'hébergement :

- Documentation Infomaniak : https://www.infomaniak.com/fr/support
- Support technique Infomaniak disponible 24/7
