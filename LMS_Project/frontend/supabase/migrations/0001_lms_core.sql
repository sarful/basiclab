create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'LEARNER_EN' check (role in ('ADMIN', 'LEARNER_EN', 'LEARNER_BN')),
  preferred_language text not null default 'en' check (preferred_language in ('en', 'bn')),
  is_suspended boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  category_id uuid,
  status text not null default 'DRAFT' check (status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  logic_theory_en text,
  logic_theory_bn text,
  udemy_script_en text,
  udemy_script_bn text,
  simulation_url text,
  resource_pdf_url text,
  video_url text,
  downloadable_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status text not null default 'PENDING' check (status in ('PENDING', 'APPROVED', 'REJECTED', 'REMOVED')),
  source text not null default 'REQUEST' check (source in ('REQUEST', 'MANUAL')),
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role, preferred_language)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'LEARNER_EN'),
    coalesce(new.raw_user_meta_data ->> 'preferred_language', 'en')
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    role = excluded.role,
    preferred_language = excluded.preferred_language,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user_profile();

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;

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
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "courses_public_read" on public.courses;
create policy "courses_public_read"
on public.courses
for select
to authenticated, anon
using (status = 'PUBLISHED');

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
with check (auth.uid() = user_id);
