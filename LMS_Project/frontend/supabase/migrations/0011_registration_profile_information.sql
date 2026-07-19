begin;

alter table public.profiles
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
  safe_role := case when new.raw_user_meta_data ->> 'role' = 'LEARNER_BN' then 'LEARNER_BN' else 'LEARNER_EN' end;
  safe_language := case when safe_role = 'LEARNER_BN' then 'bn' when new.raw_user_meta_data ->> 'preferred_language' = 'bn' then 'bn' else 'en' end;

  insert into public.profiles (
    id, full_name, username, mobile_number, date_of_birth, gender, country, address,
    occupation, engineering_discipline, institution_or_company_name, identity_number,
    role, account_state, preferred_language
  ) values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    nullif(trim(new.raw_user_meta_data ->> 'username'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'mobile_number'), ''),
    nullif(new.raw_user_meta_data ->> 'date_of_birth', '')::date,
    nullif(new.raw_user_meta_data ->> 'gender', ''),
    nullif(trim(new.raw_user_meta_data ->> 'country'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'address'), ''),
    nullif(new.raw_user_meta_data ->> 'occupation', ''),
    nullif(new.raw_user_meta_data ->> 'engineering_discipline', ''),
    nullif(trim(new.raw_user_meta_data ->> 'institution_or_company_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'identity_number'), ''),
    safe_role, 'TRIAL', safe_language
  )
  on conflict (id) do update set
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

commit;
