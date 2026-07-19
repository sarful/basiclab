begin;

alter table public.courses
  add column if not exists trial_days integer not null default 7;

alter table public.courses
  drop constraint if exists courses_trial_days_check;

alter table public.courses
  add constraint courses_trial_days_check
  check (trial_days between 1 and 365);

commit;
