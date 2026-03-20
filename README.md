# ELITEFORCE.GLOBAL - Senior Technical Test

## Project Overview
MultiServices platform built with React Native (Expo), Node.js (Express), PostgreSQL (Prisma), and Socket.io. This project is a complete production-ready MVP featuring real-time tracking, secure Stripe payments, and a premium mobile design system.

## Features
- **Mobile**: High-radius premium design, real-time service tracking, debounced search & filters, deep linking, and secure checkout.
- **Backend**: JWT Authentication (saltRounds: 12), Role-based Authorization, Stripe Webhooks, Socket.io for live tracking, Rate Limiting, and Swagger API Documentation.
- **Real-time**: Live provider location updates and instant booking status synchronization.

## Prerequisites
- Node.js v20+
- PostgreSQL v15+
- Docker & Docker Compose (Optional for deployment)
- Expo CLI

## Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-repo/eliteforce-test.git
cd eliteforce-test
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env # Fill with your credentials
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

### 3. Mobile Setup
```bash
cd mobile
npm install
cp .env.example .env # Fill API_URL with your local IP
npx expo start
```

## API Documentation
The API is documented using Swagger. Once the backend is running, visit:
`http://localhost:3000/api/docs`

## Docker Deployment
Run the entire stack with a single command:
```bash
docker-compose up --build
```

## Project Structure
- `mobile/`: React Native Expo application.
- `backend/`: Node.js Express API with Prisma.
- `docker-compose.yml`: Root orchestration file.

---
**EliteForce Technical Test - 2024**
