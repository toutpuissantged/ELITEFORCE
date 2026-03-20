# ELITEFORCE MultiServices Platform

Une plateforme complète (Mobile + Backend) de mise en relation entre clients et prestataires de services à domicile (ménage, plomberie, etc.). Le projet intègre un système de recherche avec filtres, un suivi en temps réel via Socket.io, des paiements sécurisés via Stripe, et une architecture backend robuste.

---

## 🚀 Fonctionnalités Clés

- **Authentification Sécurisée** : Inscription avec validation stricte, connexion JWT, et hachage Bcrypt.
- **Recherche & Filtres** : Recherche de services par nom, catégorie, prix maximum, et note moyenne.
- **Temps Réel & Tracking** : Suivi de la position du prestataire en temps réel sur une carte (`react-native-maps` + `Socket.io`).
- **Paiements Stripe** : Intégration complète de `@stripe/stripe-react-native` pour les paiements sécurisés.
- **Notifications Push** : Alertes automatiques via Expo Notifications à chaque changement de statut de la mission.

---

## 🛠 Prérequis

Assurez-vous d'avoir installé les outils suivants sur votre machine :

- [Node.js](https://nodejs.org/en/) (v18+ recommandé)
- [PostgreSQL](https://www.postgresql.org/) (v14+ recommandé)
- [Docker](https://www.docker.com/) (Optionnel, pour le déploiement)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)
- Simulateur iOS ou Emulateur Android (ou l'application Expo Go sur un téléphone physique).

---

## ⚙️ Installation & Configuration

### 1. Base de Données

Si vous utilisez Docker, vous pouvez lancer PostgreSQL rapidement :
```bash
docker-compose up -d db
```
Sinon, assurez-vous que votre instance PostgreSQL locale est en cours d'exécution.

### 2. Backend (API REST)

```bash
cd backend
npm install
```

Créez un fichier `.env` dans le dossier `backend/` :
```env
# Variables essentielles
PORT=3000
DATABASE_URL="postgresql://eliteforce:eliteforce_password@localhost:5432/eliteforce_db?schema=public"
JWT_SECRET="super_secret_jwt_key_2026"
JWT_EXPIRES_IN="7d"

# Configuration Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

Générez le client Prisma et peuplez la base de données :
```bash
npx prisma db push
npm run seed
```

Lancez le serveur de développement :
```bash
npm run dev
```
*(L'API et le backend Socket.io démarreront sur le port 3000, et la doc Swagger sera disponible sur `/api/docs`)*

### 3. Application Mobile (React Native + Expo)

```bash
cd mobile
npm install
```

Créez un fichier `.env` dans le dossier `mobile/` :
```env
# URL de l'API (Remplacez localhost par votre IP locale si vous testez sur un téléphone physique)
EXPO_PUBLIC_API_URL="http://localhost:3000/api"

# Clés Publiques
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
EXPO_PUBLIC_MAPS_API_KEY="AIzaSy..."
```

Lancez l'application Mobile :
```bash
npx expo start
```
*Scannez le QR Code avec Expo Go ou appuyez sur `i` ou `a` pour ouvrir dans le simulateur.*

---

## 🐳 Déploiement avec Docker

Le projet est fourni avec une configuration Docker prête pour la production. Pour lancer l'ensemble des services (Base de données et Backend) :

```bash
docker-compose up --build -d
```
Ceci exposera l'API sur le port `3000` de votre machine hôte.

---

## 📱 Screenshots

*Note: En situation réelle, les captures d'écran (minimum 3 requises: Accueil, Recherche avec filtres, Suivi en temps réel) seront insérées ici.*
- **Accueil** : Liste des services et ajout au panier.
- **Recherche** : Écran avec le slider de prix et la sélection de note.
- **Suivi** : Carte interactive affichant le prestataire.

---

## 🏛 Architecture

- **Backend** : Architecture MVC (`routes`, `controllers`, `models`), `Express`, `Prisma ORM`. Middleware pour l'authentification (`authenticate`, `authorize`) et la sécurité (`helmet`, `express-rate-limit`).
- **Mobile** : Pattern MVVM structuré avec `Redux Toolkit` pour le state management (`authSlice`, `servicesSlice`, `bookingSlice`), intercepteurs `Axios` pour le JWT, système de navigation `react-navigation`.

Merci de consulter le dossier `backend/src/docs` ou d'accéder à `/api/docs` au démarrage du serveur backend pour la spécification technique complète de l'API REST.
