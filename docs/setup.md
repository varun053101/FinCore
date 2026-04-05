# Setup Guide

## Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL

## Prisma Requirement (Important)

Yes, `prisma/schema.prisma` is required for this project.

- `prisma/schema.prisma` is the source of truth for database structure.
- Prisma schema source is also provided in git at `prisma/schema.prisma.example`.
- If `prisma/schema.prisma` is missing, copy/paste all code from `prisma/schema.prisma.example` into `prisma/schema.prisma`.
- `prisma/migrations/` is required to create the same schema consistently on any machine.
- If Prisma migrations are not applied, backend APIs depending on `User` and `Transaction` tables will fail.

### Prisma v7 Runtime Note

This project uses Prisma v7 with adapter-based runtime configuration in `config/prisma.js`:

- `@prisma/adapter-pg`
- `pg`

`DATABASE_URL` is read at runtime through that adapter config.

## Schema Summary

From `prisma/schema.prisma` (or `prisma/schema.prisma.example` before copy):

- Enums: `Role`, `TransactionType`
- Models: `User`, `Transaction`
- Relation: one `User` -> many `Transaction`

If schema changes:

1. Update `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name <change_name>`
3. Run `npx prisma generate`

## 1) Install Dependencies

```bash
npm install
```

This installs Prisma runtime adapter dependencies from `package.json` (`@prisma/adapter-pg`, `pg`).

## 2) Configure Environment

Create `.env` in project root from `.env.example` (recommended), then edit values:

Windows (PowerShell):
```powershell
Copy-Item .env.example .env
```

macOS/Linux:
```bash
cp .env.example .env
```

Required values:

```env
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/fincore"
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="1d"
ADMIN_SECRET_KEY="your_admin_secret"
```

Optional:

```env
NODE_ENV=development
```

### Important

- `ADMIN_SECRET_KEY` is required for admin registration.
- Keep secrets out of version control.
- Request logging uses `morgan`:
  - `NODE_ENV=production` -> compact custom format
  - otherwise -> `dev` format

## 3) Prisma Setup (Required)

Run these commands in this exact order:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

What this does:

- `prisma generate`: creates Prisma client used by services.
- `prisma migrate dev`: creates/applies database tables from migrations.
- Runtime DB connection is handled in `config/prisma.js` using `DATABASE_URL`.

## 4) Verify Prisma Setup

```bash
npx prisma migrate status
```

Optional:

```bash
npx prisma studio
```

Expected:

- Migration status is up to date.
- You can see `User` and `Transaction` models in Prisma Studio.

## 5) Run the API

```bash
node server.js
```

Server default: `http://localhost:5000`

## 6) Smoke Test

- Health route: `GET /health`
- Auth register: `POST /api/auth/register`
- Auth login: `POST /api/auth/login`

## Suggested Postman Flow

1. Register admin (with `role=ADMIN` + `adminSecretKey`)
2. Login admin and copy token
3. Call admin APIs (`/api/users`, transaction writes)
4. Register/login viewer and verify read-only access

## Common Setup Errors

- Invalid `DATABASE_URL` -> migration or connection failure.
- Skipping Prisma migration -> missing table errors at runtime.
- Missing `ADMIN_SECRET_KEY` -> admin registration returns error.
- Prisma client not generated -> run `npx prisma generate`.
