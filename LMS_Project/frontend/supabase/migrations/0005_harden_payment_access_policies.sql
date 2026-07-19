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
      and coalesce(removed_at, null) is null
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
      and coalesce(removed_at, null) is null
  );
$$;

create or replace function public.is_owned_payment_proof_path(target_user uuid, proof_path text)
returns boolean
language sql
stable
as $$
  select
    proof_path is not null
    and proof_path <> ''
    and split_part(proof_path, '/', 1) = target_user::text
    and array_length(string_to_array(proof_path, '/'), 1) = 2
    and position('..' in proof_path) = 0
    and left(proof_path, 1) <> '/';
$$;

drop policy if exists "payment_requests_select_own" on public.payment_requests;
create policy "payment_requests_select_own"
on public.payment_requests
for select
to authenticated
using (
  auth.uid() = user_id
  and public.is_active_profile(auth.uid())
);

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
  and length(btrim(plan_name)) > 0
  and length(btrim(transaction_id)) > 0
  and length(btrim(payment_method)) > 0
  and length(btrim(currency)) > 0
  and public.is_owned_payment_proof_path(user_id, screenshot_url)
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
  and public.is_owned_payment_proof_path(user_id, screenshot_url)
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

drop policy if exists "payment_proofs_select_owner_or_admin" on storage.objects;
create policy "payment_proofs_select_owner_or_admin"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'payment-proofs'
  and (
    (
      public.is_active_profile(auth.uid())
      and public.is_owned_payment_proof_path(auth.uid(), name)
    )
    or public.is_active_admin(auth.uid())
  )
);

drop policy if exists "payment_proofs_insert_owner" on storage.objects;
create policy "payment_proofs_insert_owner"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'payment-proofs'
  and public.is_active_profile(auth.uid())
  and public.is_owned_payment_proof_path(auth.uid(), name)
);

drop policy if exists "payment_proofs_update_owner_or_admin" on storage.objects;
drop policy if exists "payment_proofs_update_admin_only" on storage.objects;
create policy "payment_proofs_update_admin_only"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'payment-proofs'
  and public.is_active_admin(auth.uid())
)
with check (
  bucket_id = 'payment-proofs'
  and public.is_active_admin(auth.uid())
  and public.is_owned_payment_proof_path(((storage.foldername(name))[1])::uuid, name)
);

drop policy if exists "payment_proofs_delete_owner_or_admin" on storage.objects;
drop policy if exists "payment_proofs_delete_admin_only" on storage.objects;
create policy "payment_proofs_delete_admin_only"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'payment-proofs'
  and public.is_active_admin(auth.uid())
);
