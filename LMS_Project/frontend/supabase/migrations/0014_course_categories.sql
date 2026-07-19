create table if not exists public.course_categories (
  id uuid primary key,
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.course_categories (id, name, slug)
values
  ('11111111-1111-4111-8111-111111111111', 'Electrical Fundamentals', 'electrical-fundamentals'),
  ('22222222-2222-4222-8222-222222222222', 'Industrial Automation', 'industrial-automation'),
  ('33333333-3333-4333-8333-333333333333', 'Sensors and Instrumentation', 'sensors-and-instrumentation'),
  ('44444444-4444-4444-8444-444444444444', 'Motor Control', 'motor-control'),
  ('55555555-5555-4555-8555-555555555555', 'PLC and Control', 'plc-and-control')
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  updated_at = now();

update public.courses
set category_id = '11111111-1111-4111-8111-111111111111'
where slug = 'basics-electronics-and-electrical'
  and category_id is null;

update public.courses
set category_id = '33333333-3333-4333-8333-333333333333'
where slug = 'industrial-sensor'
  and category_id is null;

alter table public.courses
  drop constraint if exists courses_category_id_fkey;

alter table public.courses
  add constraint courses_category_id_fkey
  foreign key (category_id)
  references public.course_categories(id)
  on delete set null
  not valid;

alter table public.course_categories enable row level security;

drop policy if exists "course_categories_select_all" on public.course_categories;
create policy "course_categories_select_all"
on public.course_categories
for select
using (true);
