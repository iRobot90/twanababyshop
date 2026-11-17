-- Preserve all legacy orders and receipt cookies. Apply to isolated sandbox first.
begin;
alter table public.orders drop constraint orders_reference_check;
alter table public.orders add constraint orders_reference_check
  check (reference ~ '^twa[-_][0-9a-f]{32}$');
commit;
