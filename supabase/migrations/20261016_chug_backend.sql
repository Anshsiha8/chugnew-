-- =========================================================================
-- CHUG! — “Sip Happens. Stay Hydrated.”
-- PostgreSQL Database Schema & Row Level Security (RLS) Policies
-- Run this migration in your Supabase SQL Editor.
-- =========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- -------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null default 'Alex Rivera',
  email text,
  age integer default 28,
  weight_kg numeric default 72,
  activity_level text default 'moderately_active' check (activity_level in ('mostly_sitting', 'lightly_active', 'moderately_active', 'very_active')),
  preferred_unit text default 'ml' check (preferred_unit in ('ml', 'fl_oz')),
  role_tag text default 'INTREPID RUNNER',
  quote text default '“GLOWING WITH HYDRATED MAIN CHARACTER ENERGY! Sweat hard, hydrate harder! Let’s crush the 2.5L bar today!”',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- -------------------------------------------------------------------------
-- 2. SCHEDULE & HYDRATION PREFERENCES TABLE
-- -------------------------------------------------------------------------
create table if not exists public.schedule_preferences (
  user_id uuid references auth.users on delete cascade primary key,
  wake_up_time text default '07:00' not null,
  bedtime text default '22:30' not null,
  first_reminder_time text default '07:30' not null,
  last_reminder_time text default '21:45' not null,
  different_weekend_schedule boolean default false not null,
  daily_goal_ml integer default 2500 not null check (daily_goal_ml >= 250 and daily_goal_ml <= 10000),
  reminder_interval_minutes integer default 60 not null check (reminder_interval_minutes in (30, 45, 60, 90, 120)),
  reminders_enabled boolean default true not null,
  quiet_hours text default '22:30 — 07:00 AM' not null,
  reminder_style text default 'balanced' not null check (reminder_style in ('gentle', 'balanced', 'frequent')),
  pause_when_goal_reached boolean default true not null,
  intelligent_pacing boolean default true not null,
  sfx_enabled boolean default true not null,
  visual_theme text default 'pop_cream' not null check (visual_theme in ('pop_cream', 'midnight_ink')),
  updated_at timestamptz default now() not null
);

-- Enable RLS on schedule_preferences
alter table public.schedule_preferences enable row level security;

create policy "Users can view their own preferences"
  on public.schedule_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert their own preferences"
  on public.schedule_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own preferences"
  on public.schedule_preferences for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- -------------------------------------------------------------------------
-- 3. WORKOUT ACTIVITIES TABLE
-- -------------------------------------------------------------------------
create table if not exists public.workout_activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  type text not null,
  custom_name text,
  start_time text not null,
  end_time text not null,
  days_of_week text[] not null default array['Mon', 'Wed', 'Fri'],
  pause_reminders boolean default true not null,
  resume_after_activity boolean default true not null,
  created_at timestamptz default now() not null
);

-- Index for user activity lookups
create index if not exists idx_workout_activities_user on public.workout_activities(user_id);

-- Enable RLS on workout_activities
alter table public.workout_activities enable row level security;

create policy "Users can view their own workout activities"
  on public.workout_activities for select
  using (auth.uid() = user_id);

create policy "Users can insert their own workout activities"
  on public.workout_activities for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own workout activities"
  on public.workout_activities for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own workout activities"
  on public.workout_activities for delete
  using (auth.uid() = user_id);

-- -------------------------------------------------------------------------
-- 4. WATER LOGS TABLE
-- -------------------------------------------------------------------------
create table if not exists public.water_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  date_key text not null, -- Format: YYYY-M-D or YYYY-MM-DD
  amount_ml integer not null check (amount_ml > 0 and amount_ml <= 5000),
  name text not null,
  tag text default 'VALID SIP' not null,
  sub text default 'Hydration Intake' not null,
  time_str text not null,
  icon text default 'water_drop' not null,
  logged_at timestamptz default now() not null
);

-- Performance Indexes
create index if not exists idx_water_logs_user_date on public.water_logs(user_id, date_key);
create index if not exists idx_water_logs_logged_at on public.water_logs(logged_at desc);

-- Enable RLS on water_logs
alter table public.water_logs enable row level security;

create policy "Users can view their own water logs"
  on public.water_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own water logs"
  on public.water_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own water logs"
  on public.water_logs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own water logs"
  on public.water_logs for delete
  using (auth.uid() = user_id);

-- -------------------------------------------------------------------------
-- 5. AUTOMATIC PROFILE & PREFERENCES INITIALIZATION TRIGGER
-- -------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Insert default profile
  insert into public.profiles (id, display_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'name', 'Hydra Hero'),
    new.email
  )
  on conflict (id) do nothing;

  -- Insert default schedule preferences
  insert into public.schedule_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  -- Insert starter default workout routines
  insert into public.workout_activities (user_id, type, custom_name, start_time, end_time, days_of_week)
  values
    (new.id, 'Running', 'Morning Trail Run', '07:30', '08:30', array['Mon', 'Wed', 'Fri']),
    (new.id, 'Gym', 'Gym Strength Protocol', '17:30', '18:45', array['Tue', 'Thu']);

  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution on auth.users sign-up
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
