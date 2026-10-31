-- ============================================================
-- SAREE SHOP — DATABASE SCHEMA
-- Run this in Supabase Dashboard > SQL Editor (new query).
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- helper: updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- ---------- admins (who may manage the site) ----------
create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

-- is_admin(): true when the current auth user is listed in admins
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins a where a.id = auth.uid());
$$;

-- ---------- categories ----------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text default '',
  image_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- products ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  product_code text not null unique,            -- human SKU, e.g. SR-0001
  name text not null,
  slug text not null unique,
  description text default '',
  category_id uuid references public.categories(id) on delete set null,
  collection text default '',                   -- e.g. Festive 2025
  price numeric(10,2) not null default 0,
  discount_price numeric(10,2),                 -- null = no discount
  stock int not null default 0,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  is_new_arrival boolean not null default false,
  is_best_seller boolean not null default false,
  images text[] not null default '{}',          -- ordered list of public image urls
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_available_idx on public.products(is_available);

-- ---------- offers / promotional banners ----------
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text default '',
  description text default '',
  image_url text,
  cta_label text default 'Shop Now',
  cta_link text default '/shop',
  discount_text text default '',                -- e.g. "Flat 20% OFF"
  is_active boolean not null default true,
  sort_order int not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- orders (submitted via WhatsApp flow) ----------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  address text not null,
  product_id uuid references public.products(id) on delete set null,
  product_code text,
  product_name text,
  quantity int not null default 1,
  unit_price numeric(10,2),
  notes text default '',
  status text not null default 'new',           -- new | confirmed | shipped | delivered | cancelled
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_status_idx on public.orders(status);

-- ---------- site settings (single row, key 'global') ----------
create table if not exists public.site_settings (
  id text primary key default 'global',
  business_name text not null default 'Saanvi Sarees',
  logo_url text,
  favicon_url text,
  whatsapp_number text not null default '919876543210',
  contact_email text default 'hello@saanvisarees.com',
  contact_phone text default '+91 98765 43210',
  address text default '',
  instagram_url text default '',
  facebook_url text default '',
  seo_title text default 'Saanvi Sarees — Premium Handcrafted Sarees',
  seo_description text default 'Shop premium silk, cotton, bridal and party-wear sarees. Order easily on WhatsApp.',
  seo_og_image text,
  nav_links jsonb not null default '[]'::jsonb,
  footer_text text default '',
  updated_at timestamptz not null default now()
);

-- ---------- page content (home sections, about, contact, policies) ----------
create table if not exists public.page_content (
  key text primary key,            -- e.g. 'home', 'about', 'contact', 'privacy', 'terms'
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------- updated_at triggers ----------
do $$
declare t text;
begin
  foreach t in array array['categories','products','offers','orders','site_settings','page_content']
  loop
    execute format('drop trigger if exists set_%1$s_updated_at on public.%1$s;', t);
    execute format('create trigger set_%1$s_updated_at before update on public.%1$s for each row execute function public.set_updated_at();', t);
  end loop;
end $$;
