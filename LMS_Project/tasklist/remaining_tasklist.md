# Remaining Task List

Last updated: `2026-07-13`

## Progress Update

- local compatibility fallback added for outdated Supabase `profiles` columns:
  - `account_state`
  - `blocked_at`
  - `removed_at`
- local compatibility fallback added for outdated Supabase `courses` columns:
  - `access_type`
  - `price_bdt`
- admin dashboard schema-mismatch handling is now more graceful while live migration apply is still pending
- live verification confirmed `payment-proofs` bucket is still missing in Supabase, so `0004_payment_proof_storage.sql` has not been applied yet
- live verification confirmed admin dashboard cannot run without fallback yet because the Supabase project is still missing:
  - `profiles.account_state`
  - `courses.access_type`
  - `user_subscriptions`
  - `payment_requests`
  - `admin_activity_logs`

## Purpose

This file consolidates the remaining work from:

- `admin_sprint_tasks.md`
- `course_platform_implementation_tasks.md`
- `course_platform_improvement_plan.md`

It is focused only on unfinished or partially verified items.

---

## Sprint 2 Roadmap

### Sprint Goal

Stabilize the `admin + learner + Supabase` flows with live verification,
clean production build readiness, and final acceptance testing.

### Sprint Outcome

At the end of Sprint 2, the platform should be ready for dependable
real-project use with verified payment proof upload, working access gating,
stable admin controls, and clean build confidence.

### Sprint Milestones

#### Milestone 1: Supabase Live Verification

- apply `frontend/supabase/migrations/0004_payment_proof_storage.sql`
- verify `payment-proofs` bucket exists and policies are active
- verify learner screenshot upload works
- verify admin screenshot preview works
- verify signed preview links work correctly

Success criteria:
- learner can submit payment proof successfully
- admin can preview uploaded proof securely
- storage policy does not allow public unsafe access

#### Milestone 2: Build and Type Stability

- fix remaining unrelated TypeScript blockers
- run clean `npm run build`
- verify admin dashboard build path
- verify learner dashboard build path
- confirm no Supabase integration build regressions remain

Success criteria:
- production build completes without TypeScript failure
- no broken route from admin or learner dashboard remains

#### Milestone 3: Admin Acceptance Verification

- verify safe course delete with dependency-block cases
- verify `deleted_at` soft delete behavior
- verify course disappears from normal active workflow
- verify activity timeline with real actions
- verify manual course access history with live rows

Success criteria:
- admin can safely manage courses without destructive mistakes
- audit trail is visible for user, course, access, and payment actions

#### Milestone 4: Learner Acceptance Verification

- verify duplicate payment submission rules
- verify pending request blocks duplicate submit
- verify rejected request re-submit flow
- verify learner payment history preview and review notes
- verify course gating across dashboard, course page, and lesson routes

Success criteria:
- learner payment flow behaves correctly for pending, rejected, and approved states
- free, trial, and paid gating is consistent everywhere

### Sprint 2 Workstreams

#### Workstream A: Payments and Storage

- payment-proof bucket migration apply
- screenshot upload verification
- screenshot preview verification
- duplicate transaction validation verification

#### Workstream B: Admin Control Reliability

- safe delete verification
- activity log verification
- manual access history verification

#### Workstream C: Learner Access Reliability

- payment history verification
- course access gating verification
- trial and paid state outcome verification

#### Workstream D: Production Readiness

- TypeScript blocker cleanup
- final production build pass
- regression sweep on admin and learner routes

### Recommended Execution Order

1. Apply Supabase storage migration and verify upload flow
2. Fix remaining TypeScript/build blockers
3. Verify admin flows against live Supabase data
4. Verify learner flows against live Supabase data
5. Prepare next phase after Sprint 2 sign-off

### Sprint 2 Exit Criteria

- payment proof upload and preview are verified live
- clean production build passes
- safe course delete is verified
- activity logs and manual access history are verified
- learner payment flow and course gating are verified

---

## Highest Priority

### 1. Live Supabase Verification

- apply `frontend/supabase/migrations/0004_payment_proof_storage.sql`
- verify `payment-proofs` bucket policies in live Supabase
- test learner screenshot upload end-to-end
- test signed screenshot preview from learner and admin dashboard

### 2. Final Build Verification

- fix remaining unrelated TypeScript blockers in frontend lessons/modules
- run clean `npm run build`
- confirm admin dashboard builds successfully
- confirm learner dashboard builds successfully
- continue reducing dashboard boot failures caused by partial live Supabase schema mismatch

### 3. Final Admin Acceptance Testing

- verify safe course delete with real dependency-block cases
- verify course soft delete updates `deleted_at` and archived status
- verify admin activity timeline shows real user, course, access, and payment actions
- verify manual course access history panel reflects assign/remove events correctly

---

## Admin Remaining Tasks

### Course Management

- code verification completed for safe course delete flow:
  - slug-confirmation UX exists in admin dashboard
  - backend delete blocks `PENDING` and `APPROVED` enrollments
  - successful delete archives course and sets `deleted_at`
- live Supabase verification is still blocked until migration `0003_admin_subscription_foundation.sql` is applied
- verify safe delete flow against:
  - course with `PENDING` enrollments
  - course with `APPROVED` enrollments
  - course with no active dependencies
- verify slug-confirmation UX before delete
- verify deleted course no longer appears in normal admin active workflow

### Activity Logs

- code verification completed for activity logs:
  - `/api/admin/activity-logs` exists and enforces admin auth
  - backend supports `action`, `entityType`, and text search filters
  - dashboard timeline UI supports category filters for `USER`, `COURSE`, `ACCESS`, and `PAYMENT`
  - dashboard search filter checks action, entity type, entity id, admin id, and metadata JSON
- live Supabase verification is still blocked until migration `0003_admin_subscription_foundation.sql` is applied because `admin_activity_logs` is missing in the current project
- verify `/api/admin/activity-logs` with live data
- test category filter:
  - `USER`
  - `COURSE`
  - `ACCESS`
  - `PAYMENT`
- test search filter against metadata and entity IDs
- confirm new admin actions are logged consistently

### Manual Course Access

- code verification completed for manual course access:
  - assign API exists and logs `COURSE_ACCESS_ASSIGNED`
  - remove API exists and logs `COURSE_ACCESS_REMOVED`
  - assign flow upserts access to `APPROVED` with `MANUAL` source
  - remove flow sets access to `REMOVED` with audit notes
  - history panel filters correctly by selected user and selected course
- live admin verification is still blocked until migration `0003_admin_subscription_foundation.sql` is applied and the dashboard can load against the real Supabase schema
- verify assign access writes enrollment override correctly
- verify remove access writes `REMOVED` state correctly
- verify history panel filters by:
  - selected user
  - selected course
- confirm audit notes are visible and preserved

---

## Learner Remaining Tasks

### Payment and Upgrade Flow

- code verification completed for learner payment request flow:
  - learner submit API requires `planName`, `transactionId`, and `screenshotUrl`
  - duplicate transaction validation blocks reuse when an existing request is `PENDING` or `APPROVED`
  - pending-request blocking prevents the same user from submitting another request while one is `PENDING`
  - rejected requests are not included in the duplicate check, so re-submission remains possible after rejection
  - learner payment history UI shows screenshot preview link and rejected review notes when available
  - learner payment history status labels map correctly:
    - `APPROVED` -> `Paid`
    - `REJECTED` -> `Fix`
    - `PENDING` -> `Wait`
- live learner verification is still blocked until migration `0003_admin_subscription_foundation.sql` is applied because `payment_requests` is missing in the current Supabase project
- verify payment request duplicate transaction validation with live data
- verify pending payment blocks duplicate submission
- verify rejected payment can be re-submitted with new transaction ID
- verify learner payment history shows:
  - screenshot preview link
  - rejected review notes
  - correct status labels

### Course Access Gating

- code verification completed for course access gating:
  - lesson route groups are protected by `CourseAccessGate` layouts before learner content renders
  - course page CTA logic maps `ALLOW`, `LOCKED_UPGRADE_REQUIRED`, `LOCKED_TRIAL_EXPIRED`, and `LOCKED_PAYMENT_PENDING` to the expected learner action
  - learner access hook applies `FREE`, `TRIAL_PREVIEW`, and `PAID` course rules across dashboard-linked learner flow
  - server-side decision helper defines matching outcomes for `FREE`, `TRIAL`, and `PAID` states, including pending-payment and trial-expiry branches
- live learner verification is still blocked until migration `0003_admin_subscription_foundation.sql` is applied because the current Supabase project is still missing `profiles.account_state`, `courses.access_type`, `user_subscriptions`, and `payment_requests`
- verify access rules on dashboard with live Supabase learner data
- verify access rules on course page with live Supabase learner data
- verify access rules on lesson routes with live Supabase learner data
- verify these account states live:
  - `FREE`
  - `TRIAL`
  - `PAID`
- verify these outcomes live:
  - `ALLOW`
  - `LOCKED_UPGRADE_REQUIRED`
  - `LOCKED_TRIAL_EXPIRED`
  - `LOCKED_PAYMENT_PENDING`
  - `LOCKED_ENROLLMENT_REQUIRED`

---

## Platform Remaining Tasks

### Security and Hardening

- complete live verification of storage security policies
- review payment-proof protection rules
- review admin-only access for payment review routes
- review learner-only submission rules for payment requests

### Product Features Still Missing

- lesson progress tracking tables and APIs
- certificate system
- notification system
- password reset and broader auth hardening
- final production readiness checklist

---

## Recommended Execution Order

1. Apply Supabase storage migration and verify upload flow
2. Fix remaining TypeScript/build blockers
3. Run end-to-end admin verification
4. Run end-to-end learner verification
5. Start next feature phase:
   - progress tracking
   - certificates
   - notifications

---

## Ready-to-Use Prompts

- `Apply Supabase payment-proofs migration and verify upload + preview flow end-to-end.`
- `Fix remaining frontend TypeScript build blockers and run clean production build.`
- `Run final admin verification for safe delete, activity logs, and manual course access history.`
- `Run final learner verification for payment history, duplicate transaction validation, and course access gating.`
- `Start next feature phase by implementing lesson progress tracking tables and APIs.`
