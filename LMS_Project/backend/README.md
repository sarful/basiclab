# LMS Backend

Backend Phase 1 scaffold for the LMS project.

## Included

- Next.js App Router backend service
- TypeScript, ESLint, Prettier, Tailwind/PostCSS setup
- Environment variable validation with Zod
- MongoDB connection bootstrap with Mongoose
- Mongoose models for core LMS entities
- Starter API folder structure
- Auth foundation for admin and learner registration
- Upload and storage service abstraction
- System services overview for auth, access, notifications, progress, and analytics
- Security layer with rate limiting, CSRF token flow, secure headers, and safe JSON parsing
- Backup and restore endpoints for database and uploaded files
- Basic CI workflow

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

## Initial Routes

- `GET /api/health`
- `POST /api/auth/register-admin`
- `POST /api/auth/register-user-english`
- `POST /api/auth/register-user-bangla`
- `GET /api/auth/csrf-token`
- `GET /api/admin/system/services`
- `GET /api/admin/security/status`
- `GET/POST /api/admin/backups`
