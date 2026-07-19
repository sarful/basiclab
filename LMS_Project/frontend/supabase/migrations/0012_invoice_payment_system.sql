begin;

alter table public.payment_requests
  add column if not exists invoice_status text not null default 'UNPAID'
    check (invoice_status in ('UNPAID', 'PENDING', 'PAID')),
  add column if not exists invoice_number text,
  add column if not exists course_id uuid references public.courses(id) on delete set null,
  add column if not exists payment_reference text,
  add column if not exists buyer_name text,
  add column if not exists buyer_email text,
  add column if not exists buyer_phone text,
  add column if not exists additional_message text,
  add column if not exists paid_at timestamptz;

drop policy if exists "payment_requests_insert_own" on public.payment_requests;
drop policy if exists "payment_requests_update_admin_review" on public.payment_requests;

alter table public.payment_requests
  alter column amount type numeric(12, 2) using amount::numeric;

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

create index if not exists payment_requests_invoice_number_idx on public.payment_requests(invoice_number);
create index if not exists payment_requests_invoice_status_idx on public.payment_requests(invoice_status);
create index if not exists payment_requests_course_id_idx on public.payment_requests(course_id);

update public.payment_requests
set invoice_status = case
  when status = 'APPROVED' then 'PAID'
  when status = 'PENDING' then 'PENDING'
  else 'UNPAID'
end,
paid_at = case when status = 'APPROVED' then coalesce(reviewed_at, updated_at, now()) else null end;

create or replace function public.sync_invoice_payment_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.invoice_status := case
    when new.status = 'APPROVED' then 'PAID'
    when new.status = 'PENDING' then 'PENDING'
    else 'UNPAID'
  end;
  new.paid_at := case
    when new.status = 'APPROVED' then coalesce(new.paid_at, new.reviewed_at, now())
    else null
  end;
  return new;
end;
$$;

drop trigger if exists sync_invoice_payment_status_trigger on public.payment_requests;
create trigger sync_invoice_payment_status_trigger
before insert or update of status on public.payment_requests
for each row execute function public.sync_invoice_payment_status();

commit;
