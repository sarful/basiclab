begin;

-- The main course setting is the source of truth for account trial duration.
create or replace function public.get_admin_trial_days()
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select greatest(1, least(365, course.trial_days))
      from public.courses course
      where course.slug = 'basics-electronics-and-electrical'
        and course.deleted_at is null
      order by course.updated_at desc
      limit 1
    ),
    7
  );
$$;

create or replace function public.assign_default_subscription()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  trial_days integer := public.get_admin_trial_days();
begin
  insert into public.user_subscriptions (
    user_id, plan_code, status, payment_required, start_at, end_at
  )
  select
    new.id,
    'TRIAL',
    'ACTIVE',
    false,
    now(),
    now() + make_interval(days => trial_days)
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

create or replace function public.sync_subscription_from_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  trial_days integer := public.get_admin_trial_days();
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
    case
      when new.account_state = 'TRIAL' then now() + make_interval(days => trial_days)
      else null
    end,
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

create or replace function public.sync_active_trial_duration_from_course()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  trial_days integer := public.get_admin_trial_days();
begin
  update public.user_subscriptions
  set
    end_at = start_at + make_interval(days => trial_days),
    updated_at = now()
  where plan_code = 'TRIAL'
    and status = 'ACTIVE';

  return new;
end;
$$;

drop trigger if exists on_course_trial_days_changed on public.courses;
create trigger on_course_trial_days_changed
after update of trial_days on public.courses
for each row
when (new.trial_days is distinct from old.trial_days)
execute function public.sync_active_trial_duration_from_course();

-- Bring existing active trials in line with the current admin setting.
update public.user_subscriptions
set
  end_at = start_at + make_interval(days => public.get_admin_trial_days()),
  updated_at = now()
where plan_code = 'TRIAL'
  and status = 'ACTIVE';

commit;
