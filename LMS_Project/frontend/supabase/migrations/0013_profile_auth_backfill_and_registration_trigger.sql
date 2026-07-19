begin;

alter table public.profiles
  add column if not exists email text,
  add column if not exists username text,
  add column if not exists mobile_number text,
  add column if not exists date_of_birth date,
  add column if not exists gender text,
  add column if not exists country text,
  add column if not exists address text,
  add column if not exists occupation text check (occupation is null or occupation in ('STUDENT', 'PROFESSIONAL')),
  add column if not exists engineering_discipline text check (engineering_discipline is null or engineering_discipline in ('ELECTRICAL_AND_ELECTRONIC_ENGINEERING', 'MECHANICAL_ENGINEERING', 'MECHATRONICS_ENGINEERING', 'AUTOMATION_ENGINEERING', 'ROBOTICS_ENGINEERING')),
  add column if not exists institution_or_company_name text,
  add column if not exists identity_number text;

create unique index if not exists profiles_username_lower_unique_idx
  on public.profiles (lower(username)) where username is not null;

create unique index if not exists profiles_email_lower_unique_idx
  on public.profiles (lower(email)) where email is not null;

create or replace function public.safe_profile_date(value text)
returns date
language sql
immutable
as $$
  select case
    when nullif(value, '') ~ '^\d{4}-\d{2}-\d{2}$' then nullif(value, '')::date
    else null
  end;
$$;

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
    id,
    email,
    full_name,
    username,
    mobile_number,
    date_of_birth,
    gender,
    country,
    address,
    occupation,
    engineering_discipline,
    institution_or_company_name,
    identity_number,
    role,
    account_state,
    preferred_language
  ) values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    nullif(trim(new.raw_user_meta_data ->> 'username'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'mobile_number'), ''),
    public.safe_profile_date(new.raw_user_meta_data ->> 'date_of_birth'),
    nullif(new.raw_user_meta_data ->> 'gender', ''),
    nullif(trim(new.raw_user_meta_data ->> 'country'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'address'), ''),
    nullif(new.raw_user_meta_data ->> 'occupation', ''),
    nullif(new.raw_user_meta_data ->> 'engineering_discipline', ''),
    nullif(trim(new.raw_user_meta_data ->> 'institution_or_company_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'identity_number'), ''),
    safe_role,
    'TRIAL',
    safe_language
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    username = excluded.username,
    mobile_number = excluded.mobile_number,
    date_of_birth = excluded.date_of_birth,
    gender = excluded.gender,
    country = excluded.country,
    address = excluded.address,
    occupation = excluded.occupation,
    engineering_discipline = excluded.engineering_discipline,
    institution_or_company_name = excluded.institution_or_company_name,
    identity_number = excluded.identity_number,
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

with auth_profile_source as (
  select
    auth_user.id,
    auth_user.email,
    auth_user.raw_user_meta_data,
    nullif(trim(auth_user.raw_user_meta_data ->> 'username'), '') as requested_username
  from auth.users auth_user
  left join public.profiles profile on profile.id = auth_user.id
  where profile.id is null
),
deduped_auth_profiles as (
  select
    *,
    count(*) over (partition by lower(requested_username)) as requested_username_count
  from auth_profile_source
)
insert into public.profiles (
  id,
  email,
  full_name,
  username,
  mobile_number,
  date_of_birth,
  gender,
  country,
  address,
  occupation,
  engineering_discipline,
  institution_or_company_name,
  identity_number,
  role,
  account_state,
  preferred_language
)
select
  source.id,
  lower(source.email),
  coalesce(source.raw_user_meta_data ->> 'full_name', split_part(source.email, '@', 1)),
  case
    when source.requested_username is not null
      and source.requested_username_count = 1
      and not exists (
        select 1
        from public.profiles profile
        where lower(profile.username) = lower(source.requested_username)
      )
    then source.requested_username
    else null
  end,
  nullif(trim(source.raw_user_meta_data ->> 'mobile_number'), ''),
  public.safe_profile_date(source.raw_user_meta_data ->> 'date_of_birth'),
  nullif(source.raw_user_meta_data ->> 'gender', ''),
  nullif(trim(source.raw_user_meta_data ->> 'country'), ''),
  nullif(trim(source.raw_user_meta_data ->> 'address'), ''),
  case
    when source.raw_user_meta_data ->> 'occupation' in ('STUDENT', 'PROFESSIONAL')
    then source.raw_user_meta_data ->> 'occupation'
    else null
  end,
  case
    when source.raw_user_meta_data ->> 'engineering_discipline' in (
      'ELECTRICAL_AND_ELECTRONIC_ENGINEERING',
      'MECHANICAL_ENGINEERING',
      'MECHATRONICS_ENGINEERING',
      'AUTOMATION_ENGINEERING',
      'ROBOTICS_ENGINEERING'
    )
    then source.raw_user_meta_data ->> 'engineering_discipline'
    else null
  end,
  nullif(trim(source.raw_user_meta_data ->> 'institution_or_company_name'), ''),
  nullif(trim(source.raw_user_meta_data ->> 'identity_number'), ''),
  case
    when source.raw_user_meta_data ->> 'role' = 'ADMIN' then 'ADMIN'
    when source.raw_user_meta_data ->> 'role' = 'LEARNER_BN' then 'LEARNER_BN'
    else 'LEARNER_EN'
  end,
  case
    when source.raw_user_meta_data ->> 'role' = 'ADMIN' then 'PAID'
    else 'TRIAL'
  end,
  case
    when source.raw_user_meta_data ->> 'role' = 'LEARNER_BN' then 'bn'
    when source.raw_user_meta_data ->> 'preferred_language' = 'bn' then 'bn'
    else 'en'
  end
from deduped_auth_profiles source
on conflict (id) do nothing;

update public.profiles profile
set email = lower(auth_user.email),
    updated_at = now()
from auth.users auth_user
where profile.id = auth_user.id
  and profile.email is distinct from lower(auth_user.email);

insert into public.user_subscriptions (
  user_id,
  plan_code,
  status,
  payment_required,
  start_at,
  end_at,
  approved_at
)
select
  profile.id,
  profile.account_state,
  'ACTIVE',
  false,
  profile.created_at,
  case
    when profile.account_state = 'TRIAL'
    then profile.created_at + make_interval(days => public.get_admin_trial_days())
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

commit;
