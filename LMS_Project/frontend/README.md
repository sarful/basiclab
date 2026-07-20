# Electrical Training Platform

This project is now a `Next.js` + `React` + `TypeScript` app for interactive electrical lessons, starter-project simulations, and reusable diagram components.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and fill the Supabase values when you want the new auth flow:

```bash
NEXT_PUBLIC_LMS_BACKEND_MODE=supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SECRET_KEY=...
```

Use `NEXT_PUBLIC_LMS_BACKEND_MODE=connected` to keep the legacy REST backend, or `disconnected` for preview-only mode.

## Supabase Migration

Run the starter SQL schema from [0001_lms_core.sql](C:/Users/Lab/Desktop/ET%20Project/react_components_electrical_library/LMS_Project/frontend/supabase/migrations/0001_lms_core.sql) inside the Supabase SQL editor before testing `supabase` mode. It creates:

- `profiles`
- `courses`
- `enrollments`
- signup trigger for profile creation
- starter RLS policies

## Build

```bash
npm run build
npm run start
```

## Structure

- `app/` - Next.js app router files
- `src/library/` - reusable TSX electrical components
- `src/library/dol-project/` - DOL-related diagram components

## Current Preview

The home page currently renders:

- `src/library/dol-project/DOLStarterPowerDiagram.tsx`
# basiclab
