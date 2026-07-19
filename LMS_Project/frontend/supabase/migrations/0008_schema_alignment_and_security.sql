begin;

create extension if not exists pgcrypto;

-- Align older 0001 installations with the admin and subscription schema.
alter table public.profiles
  add column if not exists account_state text not null default 'TRIAL'
    check (account_state in ('FREE', 'TRIAL', 'PAID')),
  add column if not exists blocked_at timestamptz,
  add column if not exists removed_at timestamptz,
  add column if not exists removed_by uuid references auth.users(id) on delete set null;

alter table public.courses
  add column if not exists access_type text not null default 'FREE'
    check (access_type in ('FREE', 'TRIAL_PREVIEW', 'PAID')),
  add column if not exists price_bdt integer not null default 0,
  add column if not exists preview_lesson_limit integer,
  add column if not exists trial_visible boolean not null default true,
  add column if not exists deleted_at timestamptz;

create table if not exists public.user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_code text not null check (plan_code in ('FREE', 'TRIAL', 'PAID')),
  status text not null default 'ACTIVE'
    check (status in ('ACTIVE', 'EXPIRED', 'CANCELLED', 'PENDING_APPROVAL')),
  payment_required boolean not null default false,
  start_at timestamptz not null default now(),
  end_at timestamptz,
  approved_at timestamptz,
  approved_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_subscriptions_user_id_idx
  on public.user_subscriptions(user_id);

create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_name text not null,
  transaction_id text not null,
  payment_method text not null default 'BANK_TRANSFER',
  amount integer not null default 0,
  currency text not null default 'BDT',
  screenshot_url text,
  status text not null default 'PENDING'
    check (status in ('PENDING', 'APPROVED', 'REJECTED')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  review_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payment_requests_user_id_idx
  on public.payment_requests(user_id);
create index if not exists payment_requests_status_idx
  on public.payment_requests(status);

create table if not exists public.admin_activity_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_activity_logs_admin_user_id_idx
  on public.admin_activity_logs(admin_user_id);

-- Public signup may choose a learner language, but can never self-assign ADMIN.
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  safe_role text;
  safe_language text;
begin
  safe_role := case
    when new.raw_user_meta_data ->> 'role' = 'LEARNER_BN' then 'LEARNER_BN'
    else 'LEARNER_EN'
  end;

  safe_language := case
    when safe_role = 'LEARNER_BN' then 'bn'
    when new.raw_user_meta_data ->> 'preferred_language' = 'bn' then 'bn'
    else 'en'
  end;

  insert into public.profiles (
    id, full_name, role, account_state, preferred_language
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    safe_role,
    'TRIAL',
    safe_language
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    role = excluded.role,
    account_state = excluded.account_state,
    preferred_language = excluded.preferred_language,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user_profile();

-- Every public signup starts as TRIAL. Trusted admin APIs promote accounts later.
create or replace function public.assign_default_subscription()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_subscriptions (
    user_id, plan_code, status, payment_required, start_at, end_at
  )
  select
    new.id, 'TRIAL', 'ACTIVE', false, now(), now() + interval '30 days'
  where not exists (
    select 1
    from public.user_subscriptions
    where user_id = new.id and status = 'ACTIVE'
  );

  update public.profiles
  set account_state = 'TRIAL', updated_at = now()
  where id = new.id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_subscription_created on auth.users;
create trigger on_auth_user_subscription_created
after insert on auth.users
for each row execute function public.assign_default_subscription();

-- Keep subscriptions aligned when a trusted admin changes account_state.
create or replace function public.sync_subscription_from_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.account_state is not distinct from old.account_state then
    return new;
  end if;

  update public.user_subscriptions
  set status = 'CANCELLED', updated_at = now()
  where user_id = new.id
    and status = 'ACTIVE'
    and plan_code <> new.account_state;

  insert into public.user_subscriptions (
    user_id, plan_code, status, payment_required, start_at, end_at, approved_at
  )
  select
    new.id,
    new.account_state,
    'ACTIVE',
    false,
    now(),
    case when new.account_state = 'TRIAL' then now() + interval '30 days' else null end,
    case when new.account_state = 'PAID' then now() else null end
  where not exists (
    select 1
    from public.user_subscriptions
    where user_id = new.id
      and plan_code = new.account_state
      and status = 'ACTIVE'
  );

  return new;
end;
$$;

drop trigger if exists on_profile_account_state_changed on public.profiles;
create trigger on_profile_account_state_changed
after update of account_state on public.profiles
for each row execute function public.sync_subscription_from_profile();

-- Existing admins receive paid access; existing learners remain trial users.
update public.profiles
set account_state = 'PAID', updated_at = now()
where role = 'ADMIN' and account_state <> 'PAID';

update public.user_subscriptions subscription
set status = 'CANCELLED', updated_at = now()
from public.profiles profile
where subscription.user_id = profile.id
  and subscription.status = 'ACTIVE'
  and subscription.plan_code <> profile.account_state;

insert into public.user_subscriptions (
  user_id, plan_code, status, payment_required, start_at, end_at, approved_at
)
select
  profile.id,
  profile.account_state,
  'ACTIVE',
  false,
  profile.created_at,
  case
    when profile.account_state = 'TRIAL' then profile.created_at + interval '30 days'
    else null
  end,
  case when profile.account_state = 'PAID' then now() else null end
from public.profiles profile
where not exists (
  select 1
  from public.user_subscriptions subscription
  where subscription.user_id = profile.id
    and subscription.plan_code = profile.account_state
    and subscription.status = 'ACTIVE'
);

create or replace function public.is_active_profile(target_user uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = target_user
      and coalesce(is_suspended, false) = false
      and removed_at is null
  );
$$;

create or replace function public.is_active_admin(target_user uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = target_user
      and role = 'ADMIN'
      and coalesce(is_suspended, false) = false
      and removed_at is null
  );
$$;

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.user_subscriptions enable row level security;
alter table public.payment_requests enable row level security;
alter table public.admin_activity_logs enable row level security;

-- Learners may edit display fields only; role and account access stay server-managed.
revoke update on table public.profiles from anon, authenticated;
grant update (full_name, preferred_language, updated_at)
  on table public.profiles to authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id and public.is_active_profile(auth.uid()))
with check (auth.uid() = id and public.is_active_profile(auth.uid()));

-- Learners can request access but cannot self-approve or create manual access.
drop policy if exists "enrollments_select_own" on public.enrollments;
create policy "enrollments_select_own"
on public.enrollments
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "enrollments_insert_own" on public.enrollments;
create policy "enrollments_insert_own"
on public.enrollments
for insert
to authenticated
with check (
  auth.uid() = user_id
  and public.is_active_profile(auth.uid())
  and status = 'PENDING'
  and source = 'REQUEST'
  and reviewed_at is null
  and reviewed_by is null
);

drop policy if exists "user_subscriptions_select_own" on public.user_subscriptions;
create policy "user_subscriptions_select_own"
on public.user_subscriptions
for select
to authenticated
using (auth.uid() = user_id and public.is_active_profile(auth.uid()));

drop policy if exists "user_subscriptions_select_admin" on public.user_subscriptions;
create policy "user_subscriptions_select_admin"
on public.user_subscriptions
for select
to authenticated
using (public.is_active_admin(auth.uid()));

-- Payment proof is no longer required. screenshot_url must be null for new requests.
drop policy if exists "payment_requests_select_own" on public.payment_requests;
create policy "payment_requests_select_own"
on public.payment_requests
for select
to authenticated
using (auth.uid() = user_id and public.is_active_profile(auth.uid()));

drop policy if exists "payment_requests_select_admin" on public.payment_requests;
create policy "payment_requests_select_admin"
on public.payment_requests
for select
to authenticated
using (public.is_active_admin(auth.uid()));

drop policy if exists "payment_requests_insert_own" on public.payment_requests;
create policy "payment_requests_insert_own"
on public.payment_requests
for insert
to authenticated
with check (
  auth.uid() = user_id
  and public.is_active_profile(auth.uid())
  and status = 'PENDING'
  and amount > 0
  and reviewed_at is null
  and reviewed_by is null
  and review_notes is null
  and screenshot_url is null
  and length(btrim(plan_name)) > 0
  and length(btrim(transaction_id)) > 0
  and length(btrim(payment_method)) > 0
  and length(btrim(currency)) > 0
);

drop policy if exists "payment_requests_update_admin_review" on public.payment_requests;
create policy "payment_requests_update_admin_review"
on public.payment_requests
for update
to authenticated
using (public.is_active_admin(auth.uid()))
with check (
  public.is_active_admin(auth.uid())
  and status in ('APPROVED', 'REJECTED')
  and reviewed_at is not null
  and reviewed_by = auth.uid()
  and amount > 0
  and length(btrim(plan_name)) > 0
  and length(btrim(transaction_id)) > 0
  and length(btrim(payment_method)) > 0
  and length(btrim(currency)) > 0
);

drop policy if exists "admin_activity_logs_select_admin" on public.admin_activity_logs;
create policy "admin_activity_logs_select_admin"
on public.admin_activity_logs
for select
to authenticated
using (public.is_active_admin(auth.uid()));

drop policy if exists "admin_activity_logs_insert_admin" on public.admin_activity_logs;
create policy "admin_activity_logs_insert_admin"
on public.admin_activity_logs
for insert
to authenticated
with check (
  public.is_active_admin(auth.uid())
  and admin_user_id = auth.uid()
);

-- Remove obsolete proof policies without deleting historical storage objects.
drop policy if exists "payment_proofs_select_owner_or_admin" on storage.objects;
drop policy if exists "payment_proofs_insert_owner" on storage.objects;
drop policy if exists "payment_proofs_update_owner_or_admin" on storage.objects;
drop policy if exists "payment_proofs_update_admin_only" on storage.objects;
drop policy if exists "payment_proofs_delete_owner_or_admin" on storage.objects;
drop policy if exists "payment_proofs_delete_admin_only" on storage.objects;

drop function if exists public.is_owned_payment_proof_path(uuid, text);

commit;
