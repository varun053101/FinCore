# Authentication and Access Control

## JWT Authentication

- Login returns a JWT token.
- Protected routes require:
  - `Authorization: Bearer <token>`
- Invalid/expired token returns `401`.

## Registration Rules

Endpoint: `POST /api/auth/register`

- Default registration role is `VIEWER`.
- You can explicitly set:
  - `role: VIEWER`
  - `role: ANALYST`
  - `role: ADMIN` (guarded)

### Admin Registration Guard

To create an admin user:
- Include `role: "ADMIN"`
- Include `adminSecretKey`
- `adminSecretKey` must match `ADMIN_SECRET_KEY` from `.env`

If key is missing or invalid, API returns `403`.

Example:

```json
{
  "name": "Super Admin",
  "email": "admin@example.com",
  "password": "StrongPass@123",
  "role": "ADMIN",
  "adminSecretKey": "your_admin_secret"
}
```

## Role Authorization Matrix

| API Area | VIEWER | ANALYST | ADMIN |
|---|---|---|---|
| Auth profile (`/api/auth/me`) | Yes | Yes | Yes |
| List transactions | Yes | Yes | Yes |
| Create/update/delete transactions | No | No | Yes |
| Dashboard summary | Yes | Yes | Yes |
| User management (`/api/users`) | No | No | Yes |

## Inactive User Policy

- If `status=false`, protected APIs are blocked with `403`.
- This is enforced during authentication middleware.
