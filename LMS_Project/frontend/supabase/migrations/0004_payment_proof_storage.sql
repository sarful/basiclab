insert into storage.buckets (id, name, public)
select 'payment-proofs', 'payment-proofs', false
where not exists (
  select 1
  from storage.buckets
  where id = 'payment-proofs'
);

drop policy if exists "payment_proofs_select_owner_or_admin" on storage.objects;
create policy "payment_proofs_select_owner_or_admin"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'payment-proofs'
  and (
    ((storage.foldername(name))[1]) = auth.uid()::text
    or exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'ADMIN'
    )
  )
);

drop policy if exists "payment_proofs_insert_owner" on storage.objects;
create policy "payment_proofs_insert_owner"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'payment-proofs'
  and ((storage.foldername(name))[1]) = auth.uid()::text
);

drop policy if exists "payment_proofs_update_owner_or_admin" on storage.objects;
create policy "payment_proofs_update_owner_or_admin"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'payment-proofs'
  and (
    ((storage.foldername(name))[1]) = auth.uid()::text
    or exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'ADMIN'
    )
  )
)
with check (
  bucket_id = 'payment-proofs'
  and (
    ((storage.foldername(name))[1]) = auth.uid()::text
    or exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'ADMIN'
    )
  )
);

drop policy if exists "payment_proofs_delete_owner_or_admin" on storage.objects;
create policy "payment_proofs_delete_owner_or_admin"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'payment-proofs'
  and (
    ((storage.foldername(name))[1]) = auth.uid()::text
    or exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'ADMIN'
    )
  )
);
