# ✈️ FlyCheap

> **Une application moderne de réservation de vols développée avec Angular 20**

[![Angular](https://img.shields.io/badge/Angular-20.x-red?style=flat-square&logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Material Design](https://img.shields.io/badge/Material-Design-757575?style=flat-square&logo=material-design)](https://material.angular.io/)
[![Netlify](https://img.shields.io/badge/Deployed-Netlify-00C7B7?style=flat-square&logo=netlify)](https://fly-cheap.netlify.app/)
[![PWA](https://img.shields.io/badge/PWA-Ready-purple?style=flat-square&logo=pwa)](https://web.dev/progressive-web-apps/)

**🌐 [Demo Live](https://fly-cheap.netlify.app/)**

## 📖 Description

FlyCheap est une application web moderne de recherche et réservation de vols, construite avec **Angular 20** et utilisant les dernières fonctionnalités du framework. L'application offre une expérience utilisateur fluide avec une architecture scalable et des performances optimisées.

## ✨ Fonctionnalités

### 🔐 **Authentification & Autorisation**

- Système de connexion/inscription
- Guards de route avec protection par rôles
- Gestion des sessions utilisateur
- Panel administrateur

### ✈️ **Recherche & Réservation**

- Recherche de vols avec filtres avancés
- Affichage détaillé des informations de vol
- Système de réservation complet
- Gestion des réservations utilisateur

### 👤 **Gestion Utilisateur**

- Profil utilisateur personnalisable
- Historique des réservations
- Notifications en temps réel

### 🛠️ **Fonctionnalités Techniques**

- **Progressive Web App (PWA)** avec Service Worker
- Interface responsive (Mobile-first)
- Gestion d'état avec Angular Signals
- Lazy loading des modules
- Composants standalone

## 🚀 Technologies Utilisées

### **Frontend**

- **Angular 20** - Framework principal
- **Angular Material** - Composants UI
- **Tailwind CSS** - Styling et design system
- **RxJS** - Programmation réactive
- **TypeScript** - Langage de développement

### **Architecture & Patterns**

- **Signals** - Gestion d'état moderne
- **Standalone Components** - Architecture modulaire
- **Feature-based Architecture** - Organisation du code
- **Dependency Injection** - Pattern d'injection moderne
- **Guards & Interceptors** - Sécurité et gestion HTTP

### **Qualité de Code**

- **ESLint** - Linting TypeScript/Angular
- **Prettier** - Formatage de code
- **Husky** - Git hooks
- **Jasmine/Karma** - Tests unitaires

## 📁 Structure du Projet

```
src/
├── app/
│   ├── core/                    # Services globaux, guards, interceptors
│   │   ├── guards/              # Guards d'authentification
│   │   ├── interceptors/        # Interceptors HTTP
│   │   └── services/            # Services partagés
│   ├── features/                # Modules fonctionnels
│   │   ├── auth/                # Authentification
│   │   ├── booking/             # Réservations
│   │   ├── flights/             # Gestion des vols
│   │   ├── home/                # Page d'accueil
│   │   ├── my-bookings/         # Mes réservations
│   │   ├── user/                # Profil utilisateur
│   │   └── admin/               # Panel administrateur
│   ├── shared/                  # Composants, pipes, directives partagés
│   │   ├── components/          # Composants réutilisables
│   │   ├── pipes/               # Pipes personnalisés
│   │   ├── directives/          # Directives personnalisées
│   │   └── services/            # Services utilitaires
│   └──infrastructure/           # Couche de données et HTTP
```

## 🛠️ Installation & Développement

### **Prérequis**

- Node.js 20+
- npm ou yarn
- Angular CLI 20+

### **Installation**

```bash
# Cloner le repository
git clone https://github.com/nin-faz/fly-cheap.git
cd fly-cheap

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

L'application sera disponible sur `http://localhost:4200/`

### **Scripts Disponibles**

```bash
# Développement
npm start                 # Serveur de développement
npm run build            # Build de production
npm run watch            # Build en mode watch

# Qualité de code
npm run lint             # Linting
npm run lint:fix         # Fix automatique du linting
npm run format           # Formatage avec Prettier
npm run format:check     # Vérification du formatage

# Tests
npm test                 # Tests unitaires
```

## 🏗️ Concepts Angular Avancés Implémentés

### **🔄 Signals & Reactive Programming**

```typescript
// Gestion d'état avec Signals
private readonly currentUser = signal<User | null>(null);
public currentUser$ = this.currentUser.asReadonly();
public isAdmin = computed(() => this.currentUser()?.role === 'admin');
```

### **🛡️ Guards Fonctionnels**

```typescript
// Guard moderne avec inject()
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return toObservable(authService.currentUser$).pipe(...)
};
```

### **🧩 Standalone Components**

```typescript
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, ...],
  // ...
})
```

### **⚡ Lazy Loading**

```typescript
// Chargement à la demande des modules
{
  path: 'booking',
  loadChildren: () => import('./features/booking/booking.routes')
}
```

## 🔐 Comptes de Test

### **Utilisateur Standard**

- **Email**: `user@example.com`
- **Mot de passe**: `password123`

### **Administrateur**

- **Email**: `admin@example.com`
- **Mot de passe**: `admin123`

## 🌐 Déploiement

L'application est automatiquement déployée sur **Netlify** à chaque push sur la branche principale.

**🚀 [Accéder à l'application](https://fly-cheap.netlify.app/)**

### **Configuration Netlify**

```toml
[build]
  command = "npm install --legacy-peer-deps && npm run build"
  publish = "dist/fly-cheap/browser"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🧪 Tests

```bash
# Exécuter les tests unitaires
ng test
```

## 📱 Progressive Web App (PWA)

L'application est configurée comme PWA avec :

- **Service Worker** pour la mise en cache
- **Manifest** pour l'installation
- **Mode hors ligne** basique

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/authentification`)
3. Commit les changements (`git commit -m 'added login and register'`)
4. Push vers la branche (`git push origin feature/authentification`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**[nin-faz](https://github.com/nin-faz)**

---

⭐ **N'hésitez pas à donner une étoile si ce projet vous a été utile !**
