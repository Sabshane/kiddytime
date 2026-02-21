# KiddyTime

Mobile-first Progressive Web App pour le suivi des horaires d'arrivée et de départ des enfants.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![License](https://img.shields.io/badge/license-Private-red)

## 📱 Aperçu

KiddyTime est une application web moderne conçue pour faciliter le suivi des horaires d'arrivée et de départ des enfants. Elle offre une interface intuitive, fonctionne hors ligne et peut être installée comme une application native sur mobile et desktop.

### Caractéristiques principales

- 📝 **Gestion des enfants** : Interface complète pour ajouter, modifier et supprimer des enfants
- ⏰ **Horaires par défaut** : Configuration d'horaires d'arrivée et de départ par défaut
- 📅 **Vues multiples** : Consultation des horaires en mode jour, semaine ou mois
- 💾 **Sauvegarde automatique** : Données persistées automatiquement en local
- 🔒 **Sécurité** : Protection par mot de passe avec chiffrement
- 📱 **PWA** : Installation sur l'écran d'accueil, fonctionne hors ligne
- 🎨 **Design moderne** : Interface Material Design responsive
- 🌐 **Support multilingue** : Interface en français

## 🚀 Démarrage rapide

### Installation

```bash
# Cloner le repository
git clone <votre-repo>

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

L'application sera disponible sur http://localhost:5173

### Build de production

```bash
npm run build
```

Les fichiers de production seront dans le dossier `dist/`

## 🛠️ Technologies

### Frontend

- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Material-UI** - Composants UI
- **React Router** - Navigation
- **date-fns** - Manipulation des dates

### Build & PWA

- **Vite** - Build tool ultra-rapide
- **vite-plugin-pwa** - Configuration Progressive Web App

### Storage

- **LocalStorage** - Persistance des données côté client

## 📁 Structure du projet

```
kiddytime/
├── public/                    # Assets statiques et icônes PWA
│   ├── .htaccess             # Configuration Apache
│   ├── vite.svg              # Logo Vite
│   ├── pwa-192x192.svg       # Icône PWA 192x192
│   ├── pwa-512x512.svg       # Icône PWA 512x512
│   └── apple-touch-icon.svg  # Icône Apple
├── src/
│   ├── contexts/             # Contextes React
│   │   └── AuthContext.tsx   # Gestion de l'authentification
│   ├── services/             # Logique métier
│   │   └── storage.ts        # Service de stockage local
│   ├── views/                # Composants de vue
│   │   ├── Login.tsx         # Page de connexion
│   │   ├── ChildrenManagement.tsx  # Gestion des enfants
│   │   └── CalendarView.tsx  # Vue calendrier
│   ├── types.ts              # Définitions TypeScript
│   ├── App.tsx               # Composant racine
│   └── main.tsx              # Point d'entrée
├── index.html                # Template HTML
├── vite.config.ts            # Configuration Vite
├── tsconfig.json             # Configuration TypeScript
├── package.json              # Dépendances
├── README.md                 # Ce fichier
└── DEPLOYMENT.md             # Guide de déploiement

```

## 🎯 Fonctionnalités détaillées

### 1. Gestion des enfants

#### Ajout d'un enfant

- Nom
- Heure d'arrivée par défaut
- Heure de départ par défaut

#### Actions disponibles

- ✏️ Modifier les informations
- 🗑️ Supprimer un enfant
- 👁️ Visualiser la liste

### 2. Vue calendrier

#### Modes d'affichage

- **Jour** : Vue détaillée d'une journée
- **Semaine** : Vue d'une semaine complète
- **Mois** : Vue mensuelle

#### Saisie des horaires

- Sélection facile avec input time HTML5
- Sauvegarde automatique à chaque modification
- Indication visuelle du jour actuel
- Distinction visuelle des jours passés

### 3. Authentification

#### Première connexion

- Création d'un mot de passe (minimum 4 caractères)
- Confirmation du mot de passe
- Hachage SHA-256 pour la sécurité

#### Connexions suivantes

- Saisie du mot de passe
- Vérification sécurisée
- Option de déconnexion

### 4. Progressive Web App

#### Fonctionnalités PWA

- Installation sur l'écran d'accueil
- Fonctionnement hors ligne
- Mise en cache intelligente des assets
- Mise à jour automatique en arrière-plan
- Icônes adaptatives pour différentes plateformes

## 📊 Modèle de données

### Child (Enfant)

```typescript
{
  id: string;
  name: string;
  defaultArrivalTime: string;    // Format "HH:mm"
  defaultLeavingTime: string;    // Format "HH:mm"
  photoUrl?: string;             // Optionnel, pour future évolution
}
```

### TimeEntry (Entrée horaire)

```typescript
{
  id: string;
  childId: string;
  date: string;                  // Format "YYYY-MM-DD"
  arrivalTime: string | null;    // Format "HH:mm"
  leavingTime: string | null;    // Format "HH:mm"
  notes?: string;                // Optionnel
}
```

## 🔒 Sécurité

### Authentification

- Mot de passe haché avec SHA-256
- Stockage sécurisé dans LocalStorage
- Pas de transmission réseau (application cliente uniquement)

### Recommandations

- ⚠️ Pour une utilisation en production avec plusieurs utilisateurs, envisager une authentification backend
- 🔐 Les données sont stockées en clair dans LocalStorage (acceptable pour usage personnel)
- 🛡️ HTTPS obligatoire pour le fonctionnement PWA

## 📱 Utilisation mobile

### Installation

1. Ouvrir l'application dans le navigateur
2. Suivre les instructions d'installation PWA
3. L'icône apparaît sur l'écran d'accueil

### Optimisations mobiles

- Interface tactile optimisée
- Saisie facilitée avec claviers natifs
- Navigation bottom tab pour un accès facile au pouce
- Pas de zoom accidentel

## 🚢 Déploiement

Voir le fichier [DEPLOYMENT.md](DEPLOYMENT.md) pour les instructions détaillées de déploiement sur Infomaniak.

### Checklist de déploiement

- [ ] Build de production : `npm run build`
- [ ] Upload du contenu de `dist/` sur le serveur
- [ ] Vérification du fichier `.htaccess`
- [ ] Activation HTTPS
- [ ] Test de l'installation PWA

## 🧪 Scripts disponibles

```bash
# Développement
npm run dev          # Lance le serveur de développement

# Production
npm run build        # Build de production
npm run preview      # Prévisualisation du build

# Qualité du code
npm run lint         # Lint du code
```

## 🐛 Dépannage

### Page blanche après déploiement

- Vérifier que tous les fichiers sont uploadés
- Consulter la console navigateur (F12)

### Erreur 404 sur les routes

- Vérifier la présence de `.htaccess`
- S'assurer que mod_rewrite est activé

### PWA ne s'installe pas

- Vérifier HTTPS
- Consulter DevTools > Application > Service Workers

### Perte du mot de passe

- Les données LocalStorage peuvent être effacées
- Aucun moyen de récupération (par conception)
- Recréer un nouveau mot de passe

## 📈 Évolutions futures possibles

- [ ] Export/Import des données en CSV
- [ ] Statistiques et rapports
- [ ] Photos des enfants
- [ ] Notifications push
- [ ] Synchronisation cloud optionnelle
- [ ] Support multi-utilisateurs
- [ ] Thèmes personnalisables
- [ ] Mode sombre

## 🤝 Contribution

Ce projet est privé. Pour toute suggestion ou bug, créez une issue.

## 📄 Licence

Private - Usage personnel uniquement

## 👨‍💻 Auteur

Développé pour la gestion simplifiée des horaires d'enfants.

---

**Note** : Cette application stocke toutes les données localement dans votre navigateur. Pensez à sauvegarder régulièrement vos données importantes.
