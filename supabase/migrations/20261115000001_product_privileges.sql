-- Explicit grants work with automatic Data API exposure disabled. RLS still gates writes.
revoke all on public.products from public, anon, authenticated, service_role;
grant select on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;
grant select on public.products to service_role;
