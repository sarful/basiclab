# Course Platform Implementation Tasks

## Purpose

This task file converts the high-level plan in `course_platform_improvement_plan.md`
into concrete implementation work for the current LMS project.

## Status Audit

Last checked: `2026-07-13`

### Now Covered

- Supabase auth and profile sync are active
- `user_subscriptions` and `payment_requests` schema foundations exist
- `courses.access_type`, `price_bdt`, `preview_lesson_limit`, and `trial_visible` exist
- `profiles.account_state`, `blocked_at`, and `removed_at` exist
- Payment request submission and admin approval backend routes exist
- Payment-proof storage migration and upload helper code now exist
- Course access decision helper now exists in backend
- Trial expiry downgrade helper and Vercel cron endpoint now exist
- Admin analytics payload now includes free/trial/paid counts, revenue, pending payments, and top courses
- Admin activity log helper and reader API now exist
- Admin user create route/form and admin course edit route/UI now exist
- Safe course delete confirmation UX, admin activity timeline UI, and manual access history panel now exist

### Still Partial

- Learner-side UI now exposes upgrade/payment-proof workflow, but live storage verification is still pending
- Admin activity timeline UI is connected, but still needs live-data verification
- Course access gating is improved but still needs end-to-end verification against all lesson routes
- Payment rejection/audit flow needs a final full live-data pass
- Course delete and course edit flows need final production verification
- Manual course access history and override audit panels need final live-data verification

### Still Missing

- Progress tracking tables and APIs
- Certificates
- Notifications
- Password reset and security hardening checklist completion
- Final clean build/test verification

## Current System Snapshot

The current implementation already has:

- Supabase auth integration
- `profiles`, `courses`, and `enrollments` tables
- Admin and learner dashboard routes
- Course publish/unpublish flow
- Enrollment request and approval flow
- Role model based on:
  - `ADMIN`
  - `LEARNER_EN`
  - `LEARNER_BN`

The current implementation does **not** yet support:

- Free / Trial / Paid subscription states
- 30-day trial lifecycle
- Payment proof submission and admin payment review
- Paid plan activation and expiry
- Course pricing / free-vs-paid backend rules
- Lesson progress persistence
- Certificates
- Notifications
- Revenue tracking
- Payment audit workflow

---

## Gap Summary

## Admin Requirement Status Check

The following admin requirements are important and should be tracked separately
from the broader subscription roadmap.

### Admin Requirement Checklist

- `[PARTIAL]` Admin dashboard structure
- `[PARTIAL]` Course free / paid classification
- `[PARTIAL]` Course edit / delete
- `[PARTIAL]` User create / edit / delete
- `[PARTIAL]` User remove / block system
- `[PARTIAL]` User role change to `Free / Trial / Paid / Admin`
- `[PARTIAL]` Assign or remove user access to a specific course
- `[PARTIAL]` Payment approval management
- `[PARTIAL]` Admin analytics dashboard
- `[PARTIAL]` Complete admin menu structure

### What Partial Means In This Repo

- Admin dashboard exists, but not the full final menu and subscription/payment widgets
- Course management exists for create and publish/archive, and safe delete UX now exists,
  but full production verification is still pending
- User management exists in the current admin backend, but subscription-state-based
  user roles are not implemented
- Blocking is partially covered through suspension logic, but final remove/deactivate
  business rules still need to be defined
- Course access assignment and removal now exist through enrollment overrides, but final
  live-data verification and richer audit UX are still pending
- Analytics exists in basic form, but not full business analytics like revenue,
  payment funnel, and free/trial/paid breakdown

---

### Gap 1: User model mismatch

The plan is based on:

- Free User
- Trial User
- Paid User

But the current system only stores role and language, not subscription status.

### Gap 2: No subscription domain

There is no subscription table, trial start date, expiry date, payment status,
or upgrade workflow in the current schema.

### Gap 3: No payment verification flow

There is no backend support for:

- plan selection
- transaction ID
- screenshot upload
- payment request review
- approval / rejection history

### Gap 4: No course access tiers

Courses currently support publish status, but not:

- free vs paid course type
- preview access
- trial-limited access
- paid-only gating

### Gap 5: No persistent lesson progress model

The learner dashboard has mock-style performance data, but there is no real:

- lesson completion
- course percentage
- learning history

### Gap 6: No certificate system

There is no table, API, or generation flow for certificates.

### Gap 7: No notification and expiry automation

The plan requires trial expiry reminders and payment status alerts, but there is
no notification or scheduled-job layer yet.

### Gap 8: Admin reporting is incomplete

The admin dashboard currently shows basic LMS stats, but not:

- free/trial/paid counts
- pending payment requests
- revenue
- subscription expiry stats

### Gap 9: Security plan is only partial

The current system has auth and some RLS, but still needs:

- password reset flow
- secure storage bucket rules
- payment proof protection
- activity logging
- stronger admin audit history

---

## Recommended Delivery Phases

## Phase 1: Subscription Foundation

Goal: add the minimum backend data model needed for Free / Trial / Paid logic.

### Tasks

- Create a `subscription_plans` table
- Create a `user_subscriptions` table
- Define plan values:
  - `FREE`
  - `TRIAL`
  - `PAID`
- Add fields:
  - `status`
  - `start_at`
  - `end_at`
  - `approved_at`
  - `approved_by`
  - `payment_required`
- Add a profile-level derived access helper to compute current subscription state
- Create a migration for automatic 30-day trial assignment on registration
- Decide whether trial starts for all learners or only selected registration variants

### Deliverables

- Supabase migration
- TypeScript types
- Server helpers for subscription lookup

---

## Phase 2: Course Access Rules

Goal: make courses enforce free vs paid access rules.

### Tasks

- Add `access_type` to `courses`
- Allowed values:
  - `FREE`
  - `TRIAL_PREVIEW`
  - `PAID`
- Add optional preview metadata fields:
  - `preview_lesson_limit`
  - `trial_visible`
- Update course list API to expose access metadata
- Update course detail API to compute current user access result
- Add a reusable backend helper:
  - `getCourseAccessDecision(user, course)`
- Add access outcomes:
  - `ALLOW`
  - `LOCKED_FREE_ONLY`
  - `LOCKED_UPGRADE_REQUIRED`
  - `LOCKED_TRIAL_EXPIRED`
  - `LOCKED_PAYMENT_PENDING`

### Deliverables

- Migration for course access fields
- Shared server-side access policy helper
- Updated learner UI messaging

---

## Phase 3: Payment Request System

Goal: support manual payment verification before premium activation.

### Tasks

- Create `payment_requests` table
- Add fields:
  - `user_id`
  - `plan_id`
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
- Create a protected Supabase storage bucket for payment proof uploads
- Add learner API route to submit payment request
- Add learner UI for upgrade form
- Add admin API route to list pending payment requests
- Add admin approve/reject endpoints
- On approval, activate the paid subscription record
- On rejection, keep prior subscription state and store audit note

### Deliverables

- Storage bucket policy
- Payment request migration
- Admin review screens
- Upgrade page integration

---

## Phase 4: Trial Expiry and Subscription Lifecycle

Goal: automate subscription transitions.

### Tasks

- Implement trial expiry check logic
- Add backend helper to downgrade expired trial users to `FREE`
- Add scheduled job path:
  - Vercel cron or Supabase Edge Function
- Add upcoming-expiry queries for notifications
- Add subscription status badges on learner dashboard
- Add upgrade CTA when trial is near expiry or expired

### Deliverables

- Scheduled lifecycle job
- Trial downgrade logic
- Dashboard subscription widgets

---

## Phase 5: Progress Tracking

Goal: persist real learner progress.

### Tasks

- Create `lesson_progress` table
- Add fields:
  - `user_id`
  - `course_id`
  - `lesson_slug`
  - `status`
  - `completed_at`
  - `last_opened_at`
- Create `course_progress_summary` helper query or server aggregation
- Add APIs to mark lesson as started/completed
- Update learner dashboard to show:
  - completed lessons
  - total lessons
  - percentage complete
  - last activity

### Deliverables

- Progress migration
- Progress APIs
- Real learner dashboard progress panels

---

## Phase 6: Certificates

Goal: issue downloadable certificates for completed paid learning.

### Tasks

- Create `certificates` table
- Add fields:
  - `user_id`
  - `course_id`
  - `certificate_no`
  - `issued_at`
  - `pdf_url`
- Define certificate eligibility rule:
  - full course completion
  - paid subscription active or course purchased
- Add certificate generation route
- Add downloadable PDF flow
- Add admin reissue support

### Deliverables

- Certificate schema
- Generation endpoint
- Learner certificate page

---

## Phase 7: Notifications

Goal: inform users about important account and payment events.

### Tasks

- Create `notifications` table or notification event model
- Add event types:
  - `TRIAL_EXPIRING`
  - `TRIAL_EXPIRED`
  - `PAYMENT_APPROVED`
  - `PAYMENT_REJECTED`
  - `SUBSCRIPTION_EXPIRING`
- Add in-app notification center
- Add optional email notification integration
- Add admin-triggered message support

### Deliverables

- Notification data model
- Notification API
- Learner/admin notification UI

---

## Phase 8: Admin Reporting and Audit

Goal: make the admin backend match the plan.

### Tasks

- Extend dashboard stats with:
  - free users
  - trial users
  - paid users
  - pending payment requests
  - approved payments
  - monthly revenue
- Create `admin_activity_logs` table
- Log important actions:
  - user role changes
  - payment approvals
  - payment rejections
  - course publish/unpublish
  - manual enrollment assignment
- Add admin activity timeline screen

### Deliverables

- Reporting queries
- Revenue widgets
- Audit log migration and UI

---

## Phase 8B: Admin Management Completion

Goal: complete the admin-side operational features requested for the LMS.

### Tasks

- Finalize admin dashboard information architecture
- Define complete admin menu sections:
  - dashboard
  - users
  - subscriptions
  - payments
  - courses
  - enrollments
  - analytics
  - notifications
  - settings
- Add `courses.access_type` management UI:
  - `FREE`
  - `TRIAL_PREVIEW`
  - `PAID`
- Add course edit form for title, slug, description, access type, and publish state
- Add safe course delete flow with dependency checks
- Add admin user create flow
- Extend user edit flow with subscription state management
- Add user delete policy:
  - soft delete preferred
  - audit log required
- Define user block/remove distinction:
  - `blocked` = login disabled
  - `removed` = access revoked and hidden from active lists
- Add subscription-level role/state controls:
  - `FREE`
  - `TRIAL`
  - `PAID`
  - `ADMIN`
- Keep `ADMIN / LEARNER_EN / LEARNER_BN` as authorization roles
- Store `FREE / TRIAL / PAID` as account/subscription state
- Add admin UI to assign course access manually
- Add admin UI to remove course access manually
- Add payment approval queue and review history
- Add analytics cards for:
  - total users
  - free users
  - trial users
  - paid users
  - pending payments
  - revenue
  - top courses

### Deliverables

- Complete admin navigation map
- Admin CRUD matrix for users and courses
- Payment review workspace
- Extended admin analytics dashboard

---

## Phase 9: Security Hardening

Goal: close security gaps before production rollout.

### Tasks

- Add password reset flow
- Add email verification enforcement policy
- Add RLS for new subscription and payment tables
- Lock payment proof storage to owner + admin review only
- Add server validation for transaction ID and amount
- Prevent client-side access to admin-only operations
- Review all server routes for role enforcement consistency

### Deliverables

- Security checklist
- RLS policy set
- Auth recovery flow

---

## Suggested Database Additions

### New Tables

- `subscription_plans`
- `user_subscriptions`
- `payment_requests`
- `lesson_progress`
- `certificates`
- `notifications`
- `admin_activity_logs`

### Existing Tables To Extend

- `profiles`
- `courses`
- `enrollments`

### Existing Fields Likely Needed

- `profiles.account_status`
- `profiles.subscription_state`
- `courses.access_type`
- `courses.price_bdt`
- `courses.preview_lesson_limit`

---

## Suggested API Work Breakdown

### Learner APIs

- `POST /api/subscriptions/upgrade-request`
- `GET /api/subscriptions/current`
- `GET /api/payments/history`
- `POST /api/learning/progress/start`
- `POST /api/learning/progress/complete`
- `GET /api/certificates`
- `GET /api/notifications`

### Admin APIs

- `GET /api/admin/payment-requests`
- `POST /api/admin/payment-requests/[id]/approve`
- `POST /api/admin/payment-requests/[id]/reject`
- `GET /api/admin/subscriptions`
- `GET /api/admin/revenue`
- `GET /api/admin/activity-logs`

---

## Priority Order

### Must Do First

- Subscription schema
- Course access policy
- Payment request flow
- Trial expiry lifecycle

### Should Do Next

- Progress tracking
- Admin payment analytics
- Notifications

### Nice To Have After Core Stability

- Certificates
- Monthly/yearly plans
- Bundles
- Instructor accounts
- AI assistant

---

## Implementation Notes For This Repo

- Keep secret-key operations inside server routes only
- Reuse existing Supabase auth and profile flow instead of introducing a second auth system
- Avoid replacing current `ADMIN / LEARNER_EN / LEARNER_BN` roles with subscription types
- Store subscription state separately from role
- Keep course publish state and course access type as separate concerns
- Reuse current dashboard and course APIs where possible instead of rebuilding from zero

---

## First Practical Sprint

If work starts now, the best first sprint is:

1. Create migration for `user_subscriptions` and `payment_requests`
2. Add `courses.access_type`
3. Add trial assignment on registration
4. Add upgrade form and payment proof upload
5. Add admin payment review page
6. Add access policy helper for free / trial / paid checks

This first sprint will close the biggest functional gap between the current LMS
and the improvement plan.

---

## Admin-Only Sprint Add-On

If the immediate focus is only the admin module, the best short sprint is:

1. Add `courses.access_type` and course pricing metadata
2. Build admin course edit form
3. Add safe course delete endpoint and UI
4. Extend admin user screen with block/remove/subscription-state actions
5. Add payment approval list and approve/reject actions
6. Expand admin dashboard cards and left menu structure

This sprint covers the exact admin checklist:

- Admin dashboard structure
- Course free/paid setup
- Course edit/delete
- User create/edit/delete
- User block/remove
- User free/trial/paid/admin state handling
- Manual course access assignment/removal
- Payment approval management
- Admin analytics
- Complete admin menu structure
