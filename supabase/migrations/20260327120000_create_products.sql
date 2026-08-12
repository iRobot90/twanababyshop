-- Twaana products table + RLS + storage bucket
-- Run this in Supabase SQL Editor (not the app terminal):
-- 1. Open your Supabase project dashboard
-- 2. Go to SQL Editor
-- 3. Paste and run this file contents
-- 4. Then create an Auth user and assign admin role if needed

create extension if not exists "pgcrypto";

create table if not exists public.products (
    id uuid primary key default gen_random_uuid(),
    title text not null check (char_length(trim(title)) > 0),
    description text,
    price numeric(12, 2) not null check (price > 0),
    stock_quantity integer not null default 0 check (stock_quantity >= 0),
    category text,
    image_url text[] not null default '{}',
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);

create index if not exists products_is_active_idx on public.products (is_active);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_created_at_idx on public.products (created_at desc);

alter table public.products enable row level security;

-- Public storefront: read active products only
create policy "Public can view active products"
    on public.products
    for select
    to anon, authenticated
    using (is_active = true);

-- Admins: full CRUD (role stored in app_metadata, not user_metadata)
create policy "Admins can select all products"
    on public.products
    for select
    to authenticated
    using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can insert products"
    on public.products
    for insert
    to authenticated
    with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can update products"
    on public.products
    for update
    to authenticated
    using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admins can delete products"
    on public.products
    for delete
    to authenticated
    using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Storage bucket for product images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'product-images',
    'product-images',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Public read for product images
create policy "Public can view product images"
    on storage.objects
    for select
    to anon, authenticated
    using (bucket_id = 'product-images');

-- Admin upload / replace / delete
create policy "Admins can upload product images"
    on storage.objects
    for insert
    to authenticated
    with check (
        bucket_id = 'product-images'
        and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    );

create policy "Admins can update product images"
    on storage.objects
    for update
    to authenticated
    using (
        bucket_id = 'product-images'
        and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    )
    with check (
        bucket_id = 'product-images'
        and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    );

create policy "Admins can delete product images"
    on storage.objects
    for delete
    to authenticated
    using (
        bucket_id = 'product-images'
        and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    );

-- After creating an admin user in Supabase Auth, grant the admin role:
-- update auth.users
-- set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
-- where email = 'admin@twana.com';
