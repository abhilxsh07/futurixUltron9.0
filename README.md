# Ultron 9.0 Hackathon App

Ultron 9.0 is a full-stack hackathon submission platform for Futurix. It includes a Vite React frontend, PHP API endpoints on Vercel, and a MySQL database with invite-only authentication.

## Stack

- React + Vite + TypeScript
- TailwindCSS
- PHP (vercel-community/php runtime)
- MySQL with PDO

## Project Structure

- api: PHP endpoints and shared helpers
- db: MySQL schema and seed
- src: React application

## Requirements

- Node.js 18+
- PHP 8.1+
- MySQL 8+

## Environment Variables

Copy `.env.example` to `.env` and fill in:

- MYSQL_HOST
- MYSQL_PORT
- MYSQL_DATABASE
- MYSQL_USER
- MYSQL_PASSWORD
- TURNSTILE_SITE_KEY
- TURNSTILE_SECRET_KEY
- VITE_TURNSTILE_SITE_KEY
- SUBMISSION_DEADLINE_ISO
- APP_BASE_URL

`SUBMISSION_DEADLINE_ISO` can be empty or omitted to allow edits with a `Deadline: TBD` UI.

## Database Setup

1. Create the database.
2. Apply schema and seed data.

```
mysql -u root -p < db/schema.sql
mysql -u root -p < db/seed.sql
```

Seed data includes an admin account:

- Email: admin@futurix.io
- Password: AdminPass123!

## Local Development

### MySQL via Docker

```
docker-compose up -d
```

### PHP API

```
php -S localhost:8000 -t api
```

### Frontend

```
npm install
npm run dev
```

Vite proxies `/api` to `http://localhost:8000`.

## Build

```
npm run build
```

## Deployment (Vercel)

1. Set environment variables in Vercel.
2. Deploy the repository.
3. The `vercel.json` file configures PHP API endpoints and SPA routing.

## Admin Features

- Create users
- Reset passwords
- Moderate projects
- Export CSV

## Participant Flow

- Sign in via invite-only account
- Submit project
- Edit project before deadline
