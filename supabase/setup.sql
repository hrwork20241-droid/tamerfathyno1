-- NO1 product catalogue for the control panel.
-- Run once in Supabase → SQL Editor → New query → paste → Run.
-- Before running, put your own email in the last line (the account that may edit products).
-- Safe to run again.

-- Products ------------------------------------------------------------------
create table if not exists public.products (
  id          bigint generated always as identity primary key,
  name        text not null default '',          -- English name (shown in every language except Arabic)
  name_ar     text not null,                     -- Arabic name
  category    text not null default 'Electronics',
  price       numeric(10,3) not null check (price > 0),           -- KWD
  old_price   numeric(10,3) check (old_price is null or old_price > price),
  seller      text not null default 'NO1',
  colors      text[] not null default '{}',
  image_url   text,
  rating      numeric(2,1) default 5,
  reviews     integer default 0,
  sold        integer default 0,
  stock_pct   integer default 0 check (stock_pct between 0 and 100),
  active      boolean not null default true,      -- false = hidden from customers
  created_at  timestamptz not null default now()
);
alter table public.products enable row level security;

-- Admins: only these emails can change products. Not readable by the app.
create table if not exists public.admins (email text primary key);
alter table public.admins enable row level security;

create or replace function public.is_admin() returns boolean
  language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'));
$$;

drop policy if exists "Read visible products" on public.products;
create policy "Read visible products" on public.products
  for select using (active or public.is_admin());

drop policy if exists "Admins add products" on public.products;
create policy "Admins add products" on public.products
  for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins edit products" on public.products;
create policy "Admins edit products" on public.products
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins delete products" on public.products;
create policy "Admins delete products" on public.products
  for delete to authenticated using (public.is_admin());

-- Product photos ------------------------------------------------------------
-- Public bucket: anyone can view a photo by its link; only admins can upload or delete.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Admins upload product images" on storage.objects;
create policy "Admins upload product images" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins change product images" on storage.objects;
create policy "Admins change product images" on storage.objects
  for update to authenticated using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins delete product images" on storage.objects;
create policy "Admins delete product images" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images' and public.is_admin());

-- Your admin account ----------------------------------------------------------
-- Replace the email below with the one you use to sign in to the control panel.
insert into public.admins (email) values ('your-email@example.com') on conflict do nothing;
