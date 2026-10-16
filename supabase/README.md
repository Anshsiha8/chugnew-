# CHUG! — Supabase Backend Setup & Migration Guide

This guide explains how to connect your Supabase project and execute the SQL migration for **CHUG! — “Sip Happens. Stay Hydrated.”**

---

## 1. Apply Database Migration & RLS Policies

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) and open your project.
2. In the left navigation, click **SQL Editor**.
3. Click **New query** (or open the query console).
4. Open the migration file:
   `supabase/migrations/20261016_chug_backend.sql`
5. Copy the entire contents of the file and paste it into the Supabase SQL Editor.
6. Click **Run** (or press `Cmd + Enter` / `Ctrl + Enter`).
7. You should see `Success. No rows returned`.

### What This Migration Sets Up:
- **`public.profiles`**: Stores user identity, display name, age, weight, activity level, preferred unit (`ml` or `fl_oz`), role badge, and quote.
- **`public.schedule_preferences`**: Stores wake-up time, bedtime, reminder interval (30, 45, 60, 90, 120 mins), daily goal in ML, quiet hours, sound effects preference, and visual theme (`pop_cream` or `midnight_ink`).
- **`public.workout_activities`**: Stores user routine sessions (Running, Gym, Sports, Study, Naps, Outings, etc.), start/end time, repeat days of the week, and reminder pause/resume preferences.
- **`public.water_logs`**: Stores real-time water entries with timestamp, volume in ML, beverage name, comic tag, sub-label, and icon.
- **Row Level Security (RLS)**: Strict RLS policies enabled on all 4 tables so each authenticated user can only access, insert, modify, and delete their own records via `auth.uid() = user_id` / `auth.uid() = id`.
- **`public.handle_new_user()` Trigger**: Automatically creates the profile record, schedule preferences, and starter activities whenever a new user signs up via Supabase Auth.

---

## 2. Configure Environment Variables

1. In your Supabase Dashboard, go to **Project Settings** → **API**.
2. Find:
   - **Project URL**: (e.g., `https://xyzcompany.supabase.co`)
   - **Project API Keys**: Copy the **`anon` / `public`** key (do **NOT** use `service_role` key in frontend).
3. In your environment or `.env` file (or Google AI Studio Secrets / Environment Variables panel):
   ```bash
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-public-key"
   ```
4. Restart the development server or rebuild:
   ```bash
   npm run build
   ```

---

## 3. Verify in the App

1. Click **⚡ ONBOARDING** in the header or open **Profile** → **LOG IN**.
2. Create an account with your email and password.
3. Supabase Auth will register your session and trigger initial row provisioning.
4. Log drinks, edit habits, update your schedule, or change visual themes — all changes persist securely to your Supabase PostgreSQL database.
5. If running without Supabase keys, the app continues to operate seamlessly in offline Guest Mode with local storage.
