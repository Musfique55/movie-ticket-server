# Ticket Booking Server

A TypeScript Express API for a movie ticket booking platform with authentication, seat reservation, payment processing, email delivery, and queue-driven background workflows.

## Tech Stack

- Node.js + TypeScript
- Express 5
- Prisma ORM
- PostgreSQL
- Redis
- RabbitMQ
- Stripe
- Resend
- Swagger UI
- JWT, cookie-based auth, Google OAuth hooks

## Project Structure

```text
ticket-booking-server/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   ├── docs/
│   ├── helper/
│   ├── lib/
│   ├── middleware/
│   ├── modules/
│   ├── routes/
│   └── utils/
├── prisma/
├── docker-compose.yml
├── Dockerfile
├── package.json
└── .env.example
```

## Features

- User registration, login, refresh-token handling, email verification, and Google auth support.
- Movie, theatre, hall, showtime, and seat management endpoints.
- Reservation creation, status updates, and expiration workflows.
- Payment integration via Stripe and webhooks.
- Email sending through Resend.
- Queue consumers for reservation, payment, and auth events via RabbitMQ.
- Swagger-generated API documentation at `/api/docs`.
- Health check route at `/health`.

## Prerequisites

Install the following tools before running the project:

- Node.js 18+
- npm
- PostgreSQL
- Redis
- RabbitMQ
- Docker and Docker Compose (optional but recommended for local services)

## Environment Variables

Copy the example file and configure your environment:

```bash
cp .env.example .env
```

The project expects these variables:

```env
PORT=4000
NODE_ENV=development

DATABASE_URL="postgresql://postgres:12345@localhost:5432/ticket-booking?schema=public"
REDIS_URL="redis://localhost:6379"
RABBITMQ_URL="amqp://guest:guest@localhost:5672"

JWT_SECRET="your_jwt_secret"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"

RESEND_SECRET="your_resend_secret"
RESEND_EMAIL="no-reply@example.com"

STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"
STRIPE_SECRET_KEY="your_stripe_secret_key"

FRONTEND_URL="http://localhost:3000"

GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_SECRET="your_google_secret"
GOOGLE_REDIRECT_URL="http://localhost:4000/api/v1/auth/google/callback"
```

## Local Development

Install dependencies:

```bash
npm install
```

Start the required services with Docker Compose:

```bash
docker compose up -d postgres redis rabbitmq
```

Generate Prisma client and apply schema migrations:

```bash
npm run db:generate
npm run db:migrate
```

Start the development server:

```bash
npm run dev
```

The API will run on the port from `PORT` (default: `4000`).

## Production Build

Create the production build:

```bash
npm run build
```

Run the compiled server:

```bash
npm start
```

## Available Scripts

```json
{
  "dev": "tsx watch src/server.ts",
  "build": "tsc && tsc-alias --resolve-full-paths && node -e \"require('node:fs').cpSync('src/docs', 'dist/docs', { recursive: true })\"",
  "start": "node dist/server.js",
  "db:migrate": "npx prisma migrate dev",
  "db:generate": "npx prisma generate",
  "stripe:webhook": "stripe listen --forward-to localhost:4000/webhook"
}
```

## API Documentation

Swagger UI is mounted at:

```text
http://localhost:4000/api/docs
```

## Health Check

```text
GET /health
```

Returns a simple JSON status response when the service is running.

## Payment Webhook

Stripe webhook endpoint:

```text
POST /webhook
```

Use the `stripe:webhook` script to forward Stripe events locally:

```bash
npm run stripe:webhook
```

## Docker

A Dockerfile is included for packaging the server. The Docker Compose file starts PostgreSQL, Redis, and RabbitMQ for local development.

## License

ISC
