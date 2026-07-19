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
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'EXPIRED', 'CANCELLED', 'PENDING_APPROVAL')),
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
  status text not null default 'PENDING' check (status in ('PENDING', 'APPROVED', 'REJECTED')),
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

create or replace function public.assign_default_subscription()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text;
  initial_plan text;
  trial_end timestamptz;
begin
  requested_role := coalesce(new.raw_user_meta_data ->> 'role', 'LEARNER_EN');
  initial_plan := case
    when requested_role = 'ADMIN' then 'PAID'
    else 'TRIAL'
  end;
  trial_end := case
    when initial_plan = 'TRIAL' then now() + interval '30 days'
    else null
  end;

  insert into public.user_subscriptions (
    user_id,
    plan_code,
    status,
    payment_required,
    start_at,
    end_at,
    approved_at
  )
  values (
    new.id,
    initial_plan,
    'ACTIVE',
    initial_plan = 'PAID',
    now(),
    trial_end,
    case when initial_plan = 'PAID' then now() else null end
  );

  update public.profiles
  set
    account_state = initial_plan,
    updated_at = now()
  where id = new.id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_subscription_created on auth.users;
create trigger on_auth_user_subscription_created
after insert on auth.users
for each row execute function public.assign_default_subscription();

alter table public.user_subscriptions enable row level security;
alter table public.payment_requests enable row level security;
alter table public.admin_activity_logs enable row level security;

drop policy if exists "user_subscriptions_select_own" on public.user_subscriptions;
create policy "user_subscriptions_select_own"
on public.user_subscriptions
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "payment_requests_select_own" on public.payment_requests;
create policy "payment_requests_select_own"
on public.payment_requests
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "payment_requests_insert_own" on public.payment_requests;
create policy "payment_requests_insert_own"
on public.payment_requests
for insert
to authenticated
with check (auth.uid() = user_id);
