# Admin Sprint Tasks

## Goal

Deliver the first practical admin module for the LMS using the current
`Next.js + Supabase` architecture.

## Implementation Status Audit

Last checked: `2026-07-13`

### Covered

- `profiles`, `courses`, `user_subscriptions`, `payment_requests`, and `admin_activity_logs` foundations exist
- Admin dashboard API returns free/trial/paid counts, pending payments, approved payments, revenue, and top courses
- Admin user create, edit, suspend, activate, remove, and restore backend routes now exist
- Manual course access assign/remove backend routes exist
- Payment request list, approve, reject, and screenshot preview wiring now exist
- Activity log writer helper and activity log reader API now exist
- Admin dashboard UI shows expanded analytics cards and top-course leaderboard
- Admin dashboard now includes user-create form and course access/pricing edit UI
- Admin dashboard now includes safe-delete confirmation UX for courses
- Admin dashboard now includes manual course access assign/remove controls with history panel
- Admin dashboard now includes admin activity timeline filters for user, course, access, and payment actions
- Secure `payment-proofs` storage migration and upload helpers now exist in code
- Trial expiry cron route and lifecycle helper now exist

### Partial

- Secure bucket migration is written, but it still needs to be applied in the actual Supabase project
- Course edit and safe delete routes/UI now exist, but full end-to-end verification is still pending
- Activity timeline renders and filters in the dashboard, but final live-data acceptance testing is still pending
- Manual course access history panel is visible in the dashboard, but final live-data acceptance testing is still pending
- Validation and test checklist are not fully verified by a clean production build
- Payment screenshot upload needs live Supabase verification after migration apply

### Missing

- Final end-to-end verification for all admin flows is still missing

### Recommended Next Tasks

1. Apply `0004_payment_proof_storage.sql` in Supabase and verify screenshot upload end-to-end
2. Run full build verification and fix remaining TypeScript issues
3. Run final admin and learner acceptance testing against live Supabase data
4. Finish full build verification and fix remaining unrelated TypeScript blockers
5. Verify admin activity and manual access history against real Supabase rows

## Sprint Outcome

At the end of this sprint, admin should be able to:

- manage dashboard sections from a complete admin menu
- mark courses as free or paid
- edit and safely delete courses
- create, edit, block, remove, and manage users
- assign or remove course access manually
- review and approve payment requests
- view better admin analytics

---

## Scope

### In Scope

- admin dashboard structure
- admin menu structure
- course free/paid settings
- course edit/delete flow
- user create/edit/delete flow
- user block/remove flow
- user free/trial/paid/admin state handling
- manual course access assign/remove
- payment approval management
- admin analytics cards

### Out of Scope For This Sprint

- certificate generation
- learner notification center
- full subscription expiry automation
- advanced email workflows
- instructor module
- bundles and yearly plans

---

## Key Architecture Rule

- Keep `ADMIN / LEARNER_EN / LEARNER_BN` as authorization roles
- Keep `FREE / TRIAL / PAID` as subscription or account state
- Do not merge these two concepts into one field

---

## Database Tasks

### 1. Extend `courses`

- add `access_type`
- allowed values:
  - `FREE`
  - `TRIAL_PREVIEW`
  - `PAID`
- add `price_bdt`
- add `preview_lesson_limit`
- add `trial_visible`
- add `deleted_at` for soft delete

### 2. Extend `profiles`

- add `account_state`
- allowed values:
  - `FREE`
  - `TRIAL`
  - `PAID`
- add `blocked_at`
- add `removed_at`
- add `removed_by`

### 3. Create `payment_requests`

- `id`
- `user_id`
- `plan_name`
- `transaction_id`
- `payment_method`
- `amount`
- `currency`
- `screenshot_url`
- `status`
- `submitted_at`
- `reviewed_at`
- `reviewed_by`
- `review_notes`

### 4. Create `admin_activity_logs`

- `id`
- `admin_user_id`
- `action`
- `entity_type`
- `entity_id`
- `metadata`
- `created_at`

### 5. RLS and Policy Tasks

- add RLS for new tables
- allow admin-only access for payment review
- allow learner-only payment request creation
- block non-admin updates to admin-controlled fields

---

## Backend Tasks

### 1. Admin Dashboard API

- extend `GET /api/admin/dashboard`
- add:
  - total users
  - free users
  - trial users
  - paid users
  - blocked users
  - pending payments
  - approved payments
  - revenue total
  - top courses

### 2. Admin Course APIs

- extend existing course create/update logic
- add course edit endpoint
- add safe delete endpoint
- validate delete only if no critical dependency is broken
- support access type and pricing fields

### 3. Admin User APIs

- add admin user create endpoint
- extend admin user edit endpoint
- add block endpoint
- add unblock endpoint
- add remove endpoint
- add restore endpoint if soft delete is used
- add account state update endpoint:
  - `FREE`
  - `TRIAL`
  - `PAID`

### 4. Admin Course Access APIs

- add manual access assign endpoint
- add manual access remove endpoint
- log all course access overrides

### 5. Admin Payment APIs

- `GET /api/admin/payment-requests`
- `POST /api/admin/payment-requests/[id]/approve`
- `POST /api/admin/payment-requests/[id]/reject`
- on approval:
  - activate paid state
  - store review audit log
- on rejection:
  - keep previous state
  - store reason

### 6. Admin Audit APIs

- add activity log reader endpoint
- return recent actions with filters

---

## Frontend Tasks

### 1. Admin Menu Structure

- build complete admin sidebar or menu
- include:
  - Dashboard
  - Users
  - Courses
  - Course Access
  - Payments
  - Analytics
  - Activity Logs
  - Settings

### 2. Dashboard Screen

- add business metric cards
- add pending payment summary
- add user-state breakdown
- add top-course summary
- add recent admin activity section

### 3. User Management Screen

- create user list
- add search and filter
- add create user form
- add edit user modal or page
- add block/remove buttons
- add account state selector
- add role selector for admin vs learner roles

### 4. Course Management Screen

- add free/paid selector
- add course edit form
- add price field
- add preview config fields
- add soft delete confirmation flow

### 5. Course Access Screen

- select user
- select course
- assign access
- remove access
- show manual override history

### 6. Payment Review Screen

- pending payment table
- screenshot preview
- transaction ID display
- approve action
- reject action
- review note input

### 7. Analytics Screen

- free/trial/paid breakdown
- pending payment funnel
- revenue summary
- popular course list

---

## Logging Tasks

- log course edit
- log course delete
- log user create
- log user edit
- log user block
- log user remove
- log account state change
- log manual course access assign/remove
- log payment approve/reject

---

## Validation Rules

- only admin can access admin routes
- blocked users cannot access learner or admin dashboard
- removed users should not appear in default active lists
- paid-only courses must not unlock without valid state or manual access
- reject invalid or duplicate transaction IDs where possible
- require payment screenshot before payment review entry is created

---

## Suggested File Work Breakdown

### Migrations

- add migration for course access fields
- add migration for profile account-state fields
- add migration for payment requests
- add migration for admin activity logs

### Backend

- update `src/lib/supabase/lms-server.ts`
- update admin route handlers under `app/api/admin/*`
- add payment routes
- add audit log helpers

### Frontend

- update `src/auth/DashboardView.tsx`
- add admin payment review section
- add admin analytics widgets
- add admin menu navigation component if needed

---

## Testing Checklist

### Admin Auth

- admin can open admin dashboard
- learner cannot open admin endpoints

### Users

- create user works
- edit user works
- block user works
- remove user works
- account state update works

### Courses

- free course save works
- paid course save works
- course edit works
- safe delete works

### Course Access

- manual assign works
- manual remove works

### Payments

- learner payment request appears in admin queue
- approve changes account state to paid
- reject stores review note

### Analytics

- dashboard counts match data
- pending payments card updates
- revenue widget updates

---

## Recommended Build Order

1. migrations
2. backend helpers
3. admin APIs
4. dashboard data aggregation
5. admin menu
6. users UI
7. courses UI
8. payment review UI
9. analytics UI
10. test pass and polish

---

## Definition of Done

- admin menu is complete and navigable
- courses can be marked free or paid
- courses can be edited and safely deleted
- users can be created, edited, blocked, removed, and state-managed
- manual course access can be assigned and removed
- payment requests can be approved and rejected
- admin dashboard shows useful analytics
- major admin actions are logged
