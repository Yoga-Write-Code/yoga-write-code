alter table public.profiles
  add column if not exists dodo_customer_id text,
  add column if not exists dodo_subscription_id text,
  add column if not exists subscription_status text not null default 'free';
