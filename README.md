# Dino Camp Roster

Full-stack roster app with a React frontend and an Express + PostgreSQL backend.

## Project Structure

- `frontend/`: React + Vite UI (`http://localhost:8080`)
- `backend/`: Express API (`http://localhost:3001`)
- `db/`: SQL scripts for schema and seed data

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind, shadcn/ui, React Query
- Backend: Node.js, Express, `pg`, `dotenv`
- Database: PostgreSQL

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL running locally on port `5432`
- `psql` CLI available in your terminal

## Initial Setup

1. Install dependencies:

```bash
cd frontend && npm install
cd ../backend && npm install
cd ..
```

2. Create backend environment file:

```bash
cp backend/.env.example backend/.env
```

3. Edit `backend/.env` and set valid database credentials:

```env
PORT=3001
DATABASE_URL=postgres://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:5432/dinocamp
```

Note: If your password contains special characters (like `!`), URL-encode them in `DATABASE_URL` (example: `!` becomes `%21`).

4. Create and seed the database:

```bash
psql -h localhost -U YOUR_DB_USER -d postgres -c "CREATE DATABASE dinocamp;"
psql -h localhost -U YOUR_DB_USER -d dinocamp -f db/schema.sql
psql -h localhost -U YOUR_DB_USER -d dinocamp -f db/seed.sql
```

## Run the App (Split Terminal)

Use two terminal tabs/windows.

Terminal 1 (backend):

```bash
cd backend
npm run dev
```

Terminal 2 (frontend):

```bash
cd frontend
npm run dev
```

Open `http://localhost:8080`.

## API Endpoints

- `GET /health`: backend + DB health check
- `GET /users`: list users
- `PATCH /users/:id`: update user `username`

## Common Questions / Troubleshooting

### `psql: command not found`

- Install PostgreSQL CLI (macOS Homebrew): `brew install postgresql@16`
- Add to PATH if needed: `export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"`

### Frontend loads but user edits reset after refresh

- Ensure backend is running on port `3001`
- Ensure request succeeds in browser network tab: `PATCH /users/:id`
- Ensure database credentials in `backend/.env` are valid

### Backend says database auth failed

- Verify credentials by direct login:

```bash
psql -h localhost -U YOUR_DB_USER -d dinocamp
```

- If that fails, reset the database user password in PostgreSQL and update `backend/.env`.

### Frontend cannot reach backend (CORS or connection errors)

- Confirm backend is running: `curl http://localhost:3001/health`
- Confirm frontend uses API base URL `http://localhost:3001` (default in code)
- Restart both dev servers after env/config changes

## Useful Commands

- Backend health:

```bash
curl http://localhost:3001/health
```

- List users:

```bash
curl http://localhost:3001/users
```
