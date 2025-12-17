-- Midtrans Premium Subscription Tables for Fitmate GO
-- Run this migration in Supabase SQL Editor

-- SUBSCRIPTIONS
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null unique,
  plan_type text not null default 'free', -- 'free' | 'basic' | 'standard' | 'premium' | 'ultimate'
  duration_months integer default 0, -- 1, 3, 6, or 12
  status text not null default 'inactive', -- 'active' | 'inactive' | 'expired'
  started_at timestamp with time zone,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscription" on public.subscriptions
  for select using (auth.uid() = user_id);

-- TRANSACTIONS
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  order_id text not null unique,
  plan_type text not null, -- 'basic' | 'standard' | 'premium' | 'ultimate'
  duration_months integer not null, -- 1, 3, 6, or 12
  amount numeric not null,
  status text not null default 'pending', -- 'pending' | 'success' | 'failed' | 'expired'
  payment_type text,
  snap_token text,
  snap_redirect_url text,
  midtrans_response jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.transactions enable row level security;

create policy "Users can view own transactions" on public.transactions
  for select using (auth.uid() = user_id);

create policy "Users can insert own transactions" on public.transactions
  for insert with check (auth.uid() = user_id);
