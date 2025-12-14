-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (extends default auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  height numeric, -- in cm
  weight numeric, -- in kg
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- FOOD LOGS
create table public.food_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  name text not null,
  calories numeric not null,
  protein numeric,
  carbs numeric,
  fat numeric,
  fiber numeric,
  source text, -- 'SCAN', 'MANUAL', etc.
  confidence numeric,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.food_logs enable row level security;

create policy "Users can view own food logs" on public.food_logs
  for select using (auth.uid() = user_id);

create policy "Users can insert own food logs" on public.food_logs
  for insert with check (auth.uid() = user_id);


-- RUN LOGS
create table public.run_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  duration_seconds integer not null,
  distance_meters numeric not null,
  calories_burned numeric not null,
  pace_seconds_per_km numeric,
  route_path jsonb, -- Store array of coordinates
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.run_logs enable row level security;

create policy "Users can view own run logs" on public.run_logs
  for select using (auth.uid() = user_id);

create policy "Users can insert own run logs" on public.run_logs
  for insert with check (auth.uid() = user_id);


-- SPORTS RECOMMENDATIONS
create table public.sports_plans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  goal text not null, -- 'bulking', 'cutting', etc.
  current_height numeric,
  current_weight numeric,
  plan_data jsonb not null, -- Store the generated plan structure
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.sports_plans enable row level security;

create policy "Users can view own sports plans" on public.sports_plans
  for select using (auth.uid() = user_id);

create policy "Users can insert own sports plans" on public.sports_plans
  for insert with check (auth.uid() = user_id);
