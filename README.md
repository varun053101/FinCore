# FinCore — Finance Data Processing and Access Control Backend

A backend API for a finance dashboard that provides role-based access control, financial record management, and aggregate analytics.

## Tech Stack

- **Runtime**: Node.js + Express v5
- **ORM**: Prisma v7 with the native pg adapter (driver-adapter mode)
- **Database**: PostgreSQL
- **Auth**: JSON Web Tokens (JWT)
- **Logging**: Morgan (`dev` format in development, compact in production)

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your actual values
```

### 3. Prepare Prisma
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Start the server
```bash
node server.js
```

### 5. Verify the server is running
```
GET /health
```

---

## Project Structure

```
FinCore/
├── config/         # Prisma client singleton
├── controllers/    # Route handler functions
├── middleware/     # Auth, RBAC, validation, logging
├── prisma/         # Schema and migration files
├── routes/         # Express router definitions
├── services/       # Business logic layer
└── utils/          # AppError, asyncHandler, response helpers, sanitize
```

## Roles & Permissions

| Role     | Transactions (read) | Transactions (write) | User management | Dashboard |
|----------|--------------------|-----------------------|-----------------|-----------|
| ADMIN    | ✓                  | ✓                     | ✓               | ✓         |
| ANALYST  | ✓                  | ✗                     | ✗               | ✓         |
| VIEWER   | ✓                  | ✗                     | ✗               | ✓         |

## Registration Notes

- New accounts default to the `VIEWER` role.
- To register with the `ADMIN` role, include `adminSecretKey` in the request body matching `ADMIN_SECRET_KEY` in `.env`.
- `ANALYST` and `VIEWER` registrations require no additional secret.

## Documentation

- [Setup Guide](docs/setup.md)
- [Architecture & Data Flow](docs/architecture.md)
- [Authentication & Access Control](docs/authentication.md)
- [API Reference](docs/api.md)
