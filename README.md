# Ultron 9.0 Hackathon App

Ultron 9.0 is a full-stack hackathon submission platform for Futurix. It includes a Vite + React frontend, a PHP API, and a MySQL database with invite-only authentication.

## What it does

### Authentication & Roles
- Invite-only sign-in (email + password)
- Cookie-based sessions (`ultron_session`) backed by a `sessions` table
- Roles:
  - `participant`
  - `admin`

### Projects
- Public browsing shows **approved** projects
- Signed-in participants can also view their **own** non-approved projects
- Admins can view all projects
- Submission + editing rules:
  - Participants can **create** projects only before the deadline
  - Participants can **edit** only before the deadline **and** only while their project is `pending`
  - Admins can create/edit anytime (deadline bypass)

### Moderation (Admin)
- Update project status: `pending` / `approved` / `hidden`
- Delete projects (admin-only)
- Export projects CSV
- User management:
  - Create users (invite users)
  - Reset passwords
  - List users

### Likes
- Like / Unlike projects (signed-in users only: participants + admins)
- Uses a `project_likes` table to prevent duplicate likes per user
- Project list endpoint returns `viewer_liked` when signed in

## Stack

- React + Vite + TypeScript
- TailwindCSS
- PHP 8.1+ (API)
- MySQL 8+ with PDO

## Project Structure

- `api/` — PHP endpoints + shared helpers
- `db/` — MySQL schema and seed
- `src/` — React application

## Requirements

- Node.js 18+
- PHP 8.1+
- MySQL 8+

## Environment Variables

Copy `.env.example` to `.env` and fill in:

### Database
- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_DATABASE`
- `MYSQL_USER`
- `MYSQL_PASSWORD`

### App
- `SUBMISSION_DEADLINE_ISO` (optional; ISO string, e.g. `2026-01-15T18:30:00+05:30`)
- `APP_BASE_URL` (optional; useful in some hosting setups)

`SUBMISSION_DEADLINE_ISO` can be empty or omitted to allow submissions/edits with a `Deadline: TBD` UI.


## Database Setup

1. Create the database.
2. Apply schema and seed data.

```bash
mysql -u root -p < db/schema.sql
mysql -u root -p < db/seed.sql
