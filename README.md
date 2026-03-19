# MultiServices - EliteForce Test

![Node](https://img.shields.io/badge/Node.js-20-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![Postgres](https://img.shields.io/badge/PostgreSQL-15-blue) ![Expo](https://img.shields.io/badge/Expo-50-black)

MultiServices is a comprehensive platform connecting users with service providers (cleaning, plumbing, etc.) in real-time. It features a complete React Native mobile app and a robust Node.js/PostgreSQL backend, offering seamless booking, real-time tracking, push notifications, and secure Stripe payments.

## Prerequisites

- Node.js (v20 or higher recommended)
- PostgreSQL (v15 or higher)
- Expo CLI (`npm install -g expo-cli`)
- Docker & Docker Compose (optional, for deployment)

## Installation Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/eliteforce-test-[votre-prenom]-[votre-nom].git
   cd eliteforce-test-[votre-prenom]-[votre-nom]
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Make sure PostgreSQL is running and update DATABASE_URL in .env if needed
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

3. **Setup Mobile:**
   ```bash
   cd ../mobile
   npm install
   cp .env.example .env
   ```

## Running the Application

**Start the Backend:**
```bash
cd backend
npm start
```
The server will run on `http://localhost:3000`.

**Start the Mobile App:**
```bash
cd mobile
npx expo start
```
Use the Expo Go app on your phone or an emulator to scan the QR code and run the app.

## Environment Variables

### Backend (`backend/.env`)
- `PORT`: Port on which the server will run (default: 3000).
- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET`: Secret key for signing JWTs.
- `JWT_EXPIRES_IN`: JWT expiration time (e.g., `7d`).
- `STRIPE_SECRET_KEY`: Stripe API secret key.
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret.

### Mobile (`mobile/.env`)
- `API_URL`: URL of the backend API (e.g., `http://localhost:3000` or local IP).
- `STRIPE_PUBLISHABLE_KEY`: Stripe API publishable key.
- `GOOGLE_MAPS_API_KEY`: Google Maps API key for location features.

## Screenshots

*(Placeholder for screenshots - to be added later)*
- Screenshot 1: Home Screen
- Screenshot 2: Search & Filters
- Screenshot 3: Payment Screen
- Screenshot 4: Booking Details
- Screenshot 5: Profile

## Architecture Diagram

```ascii
+-------------------+       REST API       +--------------------+
|                   | <------------------> |                    |
|   React Native    |      Socket.io       |   Node.js Server   |
|   (Expo) App      | <------------------> |   (Express.js)     |
|                   |                      |                    |
+-------------------+                      +--------------------+
        ^                                            |
        | Stripe SDK                                 | Prisma ORM
        v                                            v
+-------------------+                      +--------------------+
|                   |       Webhooks       |                    |
|   Stripe API      | <------------------> |  PostgreSQL DB     |
|                   |                      |                    |
+-------------------+                      +--------------------+
```

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/services` - List services (with filters)
- `POST /api/bookings` - Create a new booking
- `POST /api/payments/create-intent` - Create Stripe PaymentIntent

More documentation can be found at `http://localhost:3000/api/docs` (Swagger) when the server is running.

## Contribution Guide

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.
