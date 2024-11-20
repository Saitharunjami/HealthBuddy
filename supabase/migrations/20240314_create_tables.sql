-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  date_of_birth date,
  gender text,
  height numeric,
  weight numeric,
  medical_conditions text[],
  medications text[],
  emergency_contact text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile"
  on public.profiles for update
  using ( auth.uid() = id );

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

-- Create health_metrics table
create table if not exists public.health_metrics (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  heart_rate integer not null,
  blood_pressure_systolic integer not null,
  blood_pressure_diastolic integer not null,
  bmi numeric not null,
  sleep_hours numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.health_metrics enable row level security;

-- Create health_metrics policies
create policy "Users can view their own health metrics"
  on public.health_metrics for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own health metrics"
  on public.health_metrics for insert
  with check ( auth.uid() = user_id );

-- Create function to handle profile updates
create or replace function public.handle_profile_updated()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Create trigger for profile updates
create trigger on_profile_updated
  before update on public.profiles
  for each row
  execute procedure public.handle_profile_updated();