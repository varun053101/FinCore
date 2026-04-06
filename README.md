# FinCore — Finance Data Processing and Access Control Backend

A backend API for a finance dashboard that provides role-based access control, financial record management, and aggregate analytics.

## Tech Stack

- **Runtime**: Node.js + Express v5
- **ORM**: Prisma v7 with the native pg adapter (driver-adapter mode)
- **Database**: PostgreSQL
- **Auth**: JSON Web Tokens (JWT)
- **Logging**: Morgan (`dev` format in development, compact in production)
- **API Docs**: Swagger UI (OpenAPI 3.0) via `swagger-ui-express` + `swagger-jsdoc`

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

## API Documentation

Once the server is running, interactive API docs are available at:

```
http://localhost:5000/api-docs
```

> The Swagger UI lists all 11 endpoints across 4 tag groups — **Auth**, **Users**, **Transactions**, and **Dashboard**.

### How to authorize in Swagger UI

1. Call `POST /api/auth/login` with your credentials
2. Copy the `token` from the response
3. Click the **Authorize 🔒** button (top-right of the page)
4. Paste the token as `Bearer <token>` and click **Authorize**
5. All protected endpoints will now include your JWT automatically

---

## Project Structure

```
FinCore/
├── config/
│   ├── prisma.js       # Prisma client singleton
│   └── swagger.js      # OpenAPI spec (components, schemas, security)
├── controllers/        # Route handler functions
├── docs/               # Markdown documentation
├── middleware/         # Auth, RBAC, validation, logging
├── prisma/             # Schema and migration files
├── routes/             # Express routers (with Swagger JSDoc annotations)
├── services/           # Business logic layer
└── utils/              # AppError, asyncHandler, response helpers, sanitize
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
- **Interactive Docs** → [`/api-docs`](http://localhost:5000/api-docs) (Swagger UI, requires running server)
