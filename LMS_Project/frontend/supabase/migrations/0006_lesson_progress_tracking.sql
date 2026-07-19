create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  track_id text not null,
  lesson_id integer not null,
  lesson_title text not null,
  lesson_path text not null,
  status text not null default 'STARTED' check (status in ('STARTED', 'COMPLETED')),
  progress_percent integer not null default 0 check (progress_percent >= 0 and progress_percent <= 100),
  first_started_at timestamptz not null default now(),
  last_viewed_at timestamptz not null default now(),
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_path)
);

create index if not exists lesson_progress_user_id_idx
  on public.lesson_progress(user_id);

create index if not exists lesson_progress_course_slug_idx
  on public.lesson_progress(course_slug);

create index if not exists lesson_progress_status_idx
  on public.lesson_progress(status);

alter table public.lesson_progress enable row level security;

drop policy if exists "lesson_progress_select_own" on public.lesson_progress;
create policy "lesson_progress_select_own"
on public.lesson_progress
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "lesson_progress_insert_own" on public.lesson_progress;
create policy "lesson_progress_insert_own"
on public.lesson_progress
for insert
to authenticated
with check (
  auth.uid() = user_id
  and lesson_path like '/%'
  and status in ('STARTED', 'COMPLETED')
  and progress_percent >= 0
  and progress_percent <= 100
);

drop policy if exists "lesson_progress_update_own" on public.lesson_progress;
create policy "lesson_progress_update_own"
on public.lesson_progress
for update
to authenticated
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and lesson_path like '/%'
  and status in ('STARTED', 'COMPLETED')
  and progress_percent >= 0
  and progress_percent <= 100
);

drop policy if exists "lesson_progress_select_admin" on public.lesson_progress;
create policy "lesson_progress_select_admin"
on public.lesson_progress
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
