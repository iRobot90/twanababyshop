-- Apply after products migration. Orders are accessible only through server routes.
create table public.orders (
  reference text primary key check (reference ~ '^twa_[0-9a-f]{32}$'),
  checkout_key uuid not null unique,
  checkout_hash text not null,
  authorization_url text,
  customer jsonb not null,
  items jsonb not null check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) > 0),
  amount bigint not null check (amount > 0),
  currency text not null check (currency = 'KES'),
  token_hash text not null check (token_hash ~ '^[0-9a-f]{64}$'),
  status text not null default 'pending' check (status in ('pending','paid','paid_review')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
alter table public.orders enable row level security;
revoke all on public.orders from public, anon, authenticated, service_role;
grant select, insert, update on public.orders to service_role;

-- Row lock makes callback/webhook retries idempotent. Product locks use stable ordering.
-- No stock is held for abandoned checkouts. Paid-but-unavailable stock requires manual
-- fulfilment/refund review, never an oversold automatic fulfilment or partial decrement.
create function public.settle_paid_order(p_reference text) returns text
language plpgsql security definer set search_path = public as $$
declare o public.orders; line jsonb; unavailable boolean := false; p public.products;
begin
  select * into o from public.orders where reference = p_reference for update;
  if not found then raise exception 'Unknown order'; end if;
  if o.status <> 'pending' then return o.status; end if;
  -- Validate persisted snapshots independently of HTTP normalization.
  if jsonb_typeof(o.items) is distinct from 'array' then
    raise exception 'Invalid order items' using errcode='22023';
  end if;
  if jsonb_array_length(o.items) not between 1 and 50 then
    raise exception 'Invalid order items' using errcode='22023';
  end if;
  for line in select value from jsonb_array_elements(o.items) loop
    if jsonb_typeof(line) is distinct from 'object'
       or jsonb_typeof(line->'id') is distinct from 'string'
       or (line->>'id') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
       or jsonb_typeof(line->'quantity') is distinct from 'number'
       or (line->>'quantity') !~ '^[1-9][0-9]?$' then
      raise exception 'Invalid order item' using errcode='22023';
    end if;
    if (line->>'quantity')::integer > 20 then
      raise exception 'Invalid order quantity' using errcode='22023';
    end if;
  end loop;
  if (select count(distinct lower(value->>'id')) from jsonb_array_elements(o.items)) <> jsonb_array_length(o.items) then
    raise exception 'Duplicate order items' using errcode='22023';
  end if;
  for line in select value from jsonb_array_elements(o.items) order by (value->>'id')::uuid loop
    select * into p from public.products where id = (line->>'id')::uuid for update;
    if not found or not p.is_active or p.stock_quantity < (line->>'quantity')::integer then
      unavailable := true;
    end if;
  end loop;
  if unavailable then
    update public.orders set status='paid_review', paid_at=now() where reference=p_reference;
    return 'paid_review';
  end if;
  for line in select value from jsonb_array_elements(o.items) loop
    update public.products set stock_quantity=stock_quantity-(line->>'quantity')::integer
    where id=(line->>'id')::uuid;
  end loop;
  update public.orders set status='paid', paid_at=now() where reference=p_reference;
  return 'paid';
end $$;
revoke all on function public.settle_paid_order(text) from public, anon, authenticated, service_role;
grant execute on function public.settle_paid_order(text) to service_role;

create table public.payment_request_limits (
 bucket text not null, window_start timestamptz not null, hits integer not null,
 primary key(bucket,window_start)
);
alter table public.payment_request_limits enable row level security;
revoke all on public.payment_request_limits from public,anon,authenticated,service_role;
create function public.consume_payment_limit(p_bucket text,p_max integer) returns boolean
language plpgsql security definer set search_path=public as $$
declare used integer; w timestamptz:=date_trunc('minute',now());
begin
 if p_max is null or p_max<1 or p_max>1000 or p_bucket is null or length(btrim(p_bucket))=0 or length(p_bucket)>100 then return false; end if;
 insert into public.payment_request_limits(bucket,window_start,hits) values(p_bucket,w,1)
 on conflict(bucket,window_start) do update set hits=payment_request_limits.hits+1
 returning hits into used;
 delete from public.payment_request_limits where window_start<now()-interval '2 minutes';
 return used<=p_max;
end $$;
revoke all on function public.consume_payment_limit(text,integer) from public,anon,authenticated,service_role;
grant execute on function public.consume_payment_limit(text,integer) to service_role;

create index payment_limits_window_idx on public.payment_request_limits(window_start);
