create table if not exists public.certificate_eligibility_rules (
  id uuid primary key default gen_random_uuid(),
  course_slug text not null unique,
  min_completed_lessons integer not null default 10,
  min_completion_rate integer not null default 70 check (min_completion_rate >= 0 and min_completion_rate <= 100),
  require_paid_account boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.certificate_eligibility_rules (
  course_slug,
  min_completed_lessons,
  min_completion_rate,
  require_paid_account,
  is_active
)
select
  'basics-electronics-and-electrical',
  10,
  70,
  false,
  true
where not exists (
  select 1
  from public.certificate_eligibility_rules
  where course_slug = 'basics-electronics-and-electrical'
);

create table if not exists public.learner_certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  rule_id uuid references public.certificate_eligibility_rules(id) on delete set null,
  certificate_code text not null unique,
  status text not null default 'ISSUED' check (status in ('ISSUED', 'REVOKED')),
  issued_at timestamptz not null default now(),
  revoked_at timestamptz,
  completion_rate_snapshot integer not null default 0 check (completion_rate_snapshot >= 0 and completion_rate_snapshot <= 100),
  completed_lessons_snapshot integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists learner_certificates_user_id_idx
  on public.learner_certificates(user_id);

create index if not exists learner_certificates_course_slug_idx
  on public.learner_certificates(course_slug);

alter table public.certificate_eligibility_rules enable row level security;
alter table public.learner_certificates enable row level security;

drop policy if exists "certificate_rules_select_authenticated" on public.certificate_eligibility_rules;
create policy "certificate_rules_select_authenticated"
on public.certificate_eligibility_rules
for select
to authenticated
using (is_active = true);

drop policy if exists "learner_certificates_select_own" on public.learner_certificates;
create policy "learner_certificates_select_own"
on public.learner_certificates
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "learner_certificates_insert_own" on public.learner_certificates;
create policy "learner_certificates_insert_own"
on public.learner_certificates
for insert
to authenticated
with check (
  auth.uid() = user_id
  and status = 'ISSUED'
);

drop policy if exists "learner_certificates_select_admin" on public.learner_certificates;
create policy "learner_certificates_select_admin"
on public.learner_certificates
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'ADMIN'
      and coalesce(profiles.is_suspended, false) = false
      and coalesce(profiles.removed_at, null) is null
  )
);
