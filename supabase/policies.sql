-- ============================================================
-- SAREE SHOP — ROW LEVEL SECURITY + STORAGE POLICIES
-- Run AFTER schema.sql in Supabase SQL Editor.
-- Model:
--   * Public (anon) can READ catalog/content and INSERT orders only.
--   * Admins (rows in public.admins) can do everything.
-- ============================================================

-- Enable RLS
alter table public.categories    enable row level security;
alter table public.products      enable row level security;
alter table public.offers        enable row level security;
alter table public.orders        enable row level security;
alter table public.site_settings enable row level security;
alter table public.page_content  enable row level security;
alter table public.admins        enable row level security;

-- ---------- admins table ----------
drop policy if exists admins_self_read on public.admins;
create policy admins_self_read on public.admins
  for select using (auth.uid() = id or public.is_admin());

-- ---------- categories ----------
drop policy if exists cat_public_read on public.categories;
create policy cat_public_read on public.categories
  for select using (true);
drop policy if exists cat_admin_write on public.categories;
create policy cat_admin_write on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- products ----------
drop policy if exists prod_public_read on public.products;
create policy prod_public_read on public.products
  for select using (true);
drop policy if exists prod_admin_write on public.products;
create policy prod_admin_write on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- offers ----------
drop policy if exists off_public_read on public.offers;
create policy off_public_read on public.offers
  for select using (true);
drop policy if exists off_admin_write on public.offers;
create policy off_admin_write on public.offers
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- site_settings ----------
drop policy if exists set_public_read on public.site_settings;
create policy set_public_read on public.site_settings
  for select using (true);
drop policy if exists set_admin_write on public.site_settings;
create policy set_admin_write on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- page_content ----------
drop policy if exists pc_public_read on public.page_content;
create policy pc_public_read on public.page_content
  for select using (true);
drop policy if exists pc_admin_write on public.page_content;
create policy pc_admin_write on public.page_content
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- orders ----------
-- Anyone may create an order (checkout form). Only admins may read/update/delete.
drop policy if exists ord_public_insert on public.orders;
create policy ord_public_insert on public.orders
  for insert with check (true);
drop policy if exists ord_admin_read on public.orders;
create policy ord_admin_read on public.orders
  for select using (public.is_admin());
drop policy if exists ord_admin_update on public.orders;
create policy ord_admin_update on public.orders
  for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists ord_admin_delete on public.orders;
create policy ord_admin_delete on public.orders
  for delete using (public.is_admin());

-- ============================================================
-- STORAGE: bucket 'product-images' (public read, admin write)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists storage_public_read on storage.objects;
create policy storage_public_read on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists storage_admin_insert on storage.objects;
create policy storage_admin_insert on storage.objects
  for insert with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists storage_admin_update on storage.objects;
create policy storage_admin_update on storage.objects
  for update using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists storage_admin_delete on storage.objects;
create policy storage_admin_delete on storage.objects
  for delete using (bucket_id = 'product-images' and public.is_admin());
