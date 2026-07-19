insert into public.courses (title, slug, description, status)
values (
  'Basics Electronics and Electrical',
  'basics-electronics-and-electrical',
  'Single frontend course that groups the core electronics and electrical learning modules.',
  'PUBLISHED'
)
on conflict (slug) do nothing;
