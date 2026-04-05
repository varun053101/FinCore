# API Reference

Base URL (local): `http://localhost:5000`

## Health

### `GET /health`
Returns service health and uptime.

---

## Auth

### `POST /api/auth/register`

Register a new user.

Body:
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "Pass@123",
  "role": "VIEWER",
  "adminSecretKey": "required only for ADMIN role"
}
```

### `POST /api/auth/login`

Body:
```json
{
  "email": "user@example.com",
  "password": "Pass@123"
}
```

### `GET /api/auth/me`

Protected route. Returns current user profile.

---

## Users (Admin only)

### `GET /api/users`

Query params:
- `role`: `ADMIN | ANALYST | VIEWER`
- `status`: `true | false`

### `PATCH /api/users/:id/role`

Body:
```json
{
  "role": "ANALYST"
}
```

### `PATCH /api/users/:id/status`

Body:
```json
{
  "status": false
}
```

---

## Transactions

### `GET /api/transactions`

Roles: `ADMIN`, `ANALYST`, `VIEWER`

Query params:
- `type`: `INCOME | EXPENSE`
- `category`: string
- `from`: ISO date
- `to`: ISO date
- `page`: positive integer
- `limit`: positive integer

### `POST /api/transactions`

Role: `ADMIN`

Body:
```json
{
  "amount": 1200.5,
  "type": "INCOME",
  "category": "Salary",
  "date": "2026-04-01T00:00:00.000Z",
  "description": "Monthly salary"
}
```

### `PATCH /api/transactions/:id`

Role: `ADMIN`

Partial body:
```json
{
  "amount": 1000,
  "category": "Freelance"
}
```

### `DELETE /api/transactions/:id`

Role: `ADMIN`

Soft delete (`isDeleted=true`).

---

## Dashboard

### `GET /api/dashboard/summary`

Roles: `ADMIN`, `ANALYST`, `VIEWER`

Returns:
- `totalIncome`
- `totalExpense`
- `netBalance`
- `categoryTotals`
- `recentActivity`
- `monthlyTrend`

---

## Error Codes

- `400`: validation/input error
- `401`: unauthenticated/invalid token
- `403`: forbidden (role/disabled user/admin key failure)
- `404`: not found
- `409`: duplicate key/unique conflict
- `500`: server error
