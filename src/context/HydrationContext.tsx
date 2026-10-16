import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  DrinkItem,
  DayRecord,
  UserProfile,
  DailySchedule,
  WorkoutActivity,
  HydrationPreferences,
  ScreenTab,
  VisualTheme,
  AuthUser,
} from '../types';
import { comicAudio } from '../utils/audio';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY = 'CHUG_APP_STORAGE_V2';

export function getTodayDateKey(date = new Date()): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

// Seeded October 2026 hydration history database matching the Stitch reference
const initialDatabase: Record<string, DayRecord> = {
  // Key format: YYYY-M-D (Month 9 = October in 0-indexed JS month)
  "2026-9-24": {
    goal: 2500,
    drinks: [
      { id: 'e1', time: '07:45 AM', name: 'Plain Water', ml: 300, tag: 'WAKE-UP', sub: 'Hydration Boost', icon: 'water_bottle', bg: 'bg-[#00D2FF]', iconColor: 'text-black' },
      { id: 'e2', time: '09:30 AM', name: 'Organic Green Tea', ml: 250, tag: 'FOCUS', sub: 'Work Session', icon: 'emoji_food_beverage', bg: 'bg-[#FFE600]', iconColor: 'text-black' },
      { id: 'e3', time: '11:45 AM', name: 'Sparkling Mineral Water', ml: 500, tag: 'POST-WALK', sub: 'Outdoor Stroll', icon: 'local_drink', bg: 'bg-[#00D2FF]', iconColor: 'text-black' },
      { id: 'e4', time: '01:15 PM', name: 'Filtered Chilled Water', ml: 350, tag: 'LUNCH', sub: 'Midday Meal', icon: 'glass_cup', bg: 'bg-white', iconColor: 'text-black' },
      { id: 'e5', time: '04:00 PM', name: 'Citrus Electrolyte Drink', ml: 500, tag: 'GYM BEAST', sub: 'Heavy Lifting', icon: 'bolt', bg: 'bg-[#FFE600]', iconColor: 'text-black' },
      { id: 'e6', time: '06:45 PM', name: 'Crisp Ice Water', ml: 500, tag: 'DINNER', sub: 'Evening Meal', icon: 'ac_unit', bg: 'bg-[#00D2FF]', iconColor: 'text-black' },
      { id: 'e7', time: '09:30 PM', name: 'Chamomile Infusion', ml: 450, tag: 'NIGHT CAP', sub: 'Sleep Prep', icon: 'bedtime', bg: 'bg-[#FAF6EE]', iconColor: 'text-black' }
    ]
  },
  "2026-9-23": {
    goal: 2500,
    drinks: [
      { id: 'e23-1', time: '08:00 AM', name: 'Plain Water', ml: 400, tag: 'MORNING', sub: 'Kickstart', icon: 'water_bottle', bg: 'bg-[#00D2FF]', iconColor: 'text-black' },
      { id: 'e23-2', time: '12:30 PM', name: 'Ice Water', ml: 600, tag: 'LUNCH', sub: 'Hydrate', icon: 'glass_cup', bg: 'bg-white', iconColor: 'text-black' },
      { id: 'e23-3', time: '03:15 PM', name: 'Sparkling Water', ml: 500, tag: 'SNACK', sub: 'Fizz', icon: 'local_drink', bg: 'bg-[#00D2FF]', iconColor: 'text-black' },
      { id: 'e23-4', time: '07:00 PM', name: 'Electrolyte Splash', ml: 600, tag: 'TRAINING', sub: 'Run Recovery', icon: 'bolt', bg: 'bg-[#FFE600]', iconColor: 'text-black' },
      { id: 'e23-5', time: '09:45 PM', name: 'Warm Mint Tea', ml: 450, tag: 'RELAX', sub: 'Night Chill', icon: 'bedtime', bg: 'bg-[#FAF6EE]', iconColor: 'text-black' }
    ]
  },
  "2026-9-22": {
    goal: 2500,
    drinks: [
      { id: 'e22-1', time: '08:30 AM', name: 'Spring Water', ml: 500, tag: 'WAKE-UP', sub: 'Fresh start', icon: 'water_bottle', bg: 'bg-[#00D2FF]', iconColor: 'text-black' },
      { id: 'e22-2', time: '01:00 PM', name: 'Chilled Water', ml: 500, tag: 'LUNCH', sub: 'Hydration', icon: 'glass_cup', bg: 'bg-white', iconColor: 'text-black' },
      { id: 'e22-3', time: '05:30 PM', name: 'Citrus Water', ml: 800, tag: 'WORKOUT', sub: 'Cycling', icon: 'bolt', bg: 'bg-[#FFE600]', iconColor: 'text-black' },
      { id: 'e22-4', time: '08:45 PM', name: 'Herbal Infusion', ml: 700, tag: 'REST', sub: 'Decompress', icon: 'emoji_food_beverage', bg: 'bg-[#FFE600]', iconColor: 'text-black' }
    ]
  },
  "2026-9-20": {
    goal: 2500,
    drinks: [
      { id: 'e20-1', time: '08:00 AM', name: 'Plain Water', ml: 500, tag: 'MORNING', sub: 'Glass 1', icon: 'water_bottle', bg: 'bg-[#00D2FF]', iconColor: 'text-black' },
      { id: 'e20-2', time: '01:00 PM', name: 'Sparkling Mineral', ml: 750, tag: 'LUNCH', sub: 'Fizzy thirst', icon: 'local_drink', bg: 'bg-[#00D2FF]', iconColor: 'text-black' },
      { id: 'e20-3', time: '06:00 PM', name: 'Electrolyte', ml: 850, tag: 'WORKOUT', sub: 'Cardio Boost', icon: 'bolt', bg: 'bg-[#FFE600]', iconColor: 'text-black' }
    ]
  },
  "2026-9-19": {
    goal: 2500,
    drinks: [
      { id: 'e19-1', time: '09:00 AM', name: 'Plain Water', ml: 600, tag: 'WAKE-UP', sub: 'Kickstart', icon: 'water_bottle', bg: 'bg-[#00D2FF]', iconColor: 'text-black' },
      { id: 'e19-2', time: '02:00 PM', name: 'Filtered Water', ml: 800, tag: 'MIDDAY', sub: 'Desk boost', icon: 'water_bottle', bg: 'bg-[#00D2FF]', iconColor: 'text-black' },
      { id: 'e19-3', time: '07:30 PM', name: 'Iced Americano', ml: 350, tag: 'BREAK', sub: 'Cafe run', icon: 'coffee', bg: 'bg-[#FFE600]', iconColor: 'text-black' },
      { id: 'e19-4', time: '09:30 PM', name: 'Night Water', ml: 750, tag: 'REST', sub: 'Recharge', icon: 'water_bottle', bg: 'bg-[#00D2FF]', iconColor: 'text-black' }
    ]
  }
};

// Fill simulated days for the 30-day heatmap & battle log consistency
for (let d = 1; d <= 21; d++) {
  const key = `2026-9-${d}`;
  if (!initialDatabase[key]) {
    if (d % 4 === 0) {
      initialDatabase[key] = {
        goal: 2500,
        drinks: [
          { id: `auto-${d}-1`, time: '08:15 AM', name: 'Tap Water', ml: 500, tag: 'MORNING', sub: 'Day starter', icon: 'water_bottle', bg: 'bg-[#00D2FF]', iconColor: 'text-black' },
          { id: `auto-${d}-2`, time: '02:00 PM', name: 'Sparkling Lime', ml: 500, tag: 'AFTERNOON', sub: 'Fizzy thirst', icon: 'local_drink', bg: 'bg-[#FFE600]', iconColor: 'text-black' },
          { id: `auto-${d}-3`, time: '07:30 PM', name: 'Water', ml: 800, tag: 'DINNER', sub: 'Evening sip', icon: 'glass_cup', bg: 'bg-white', iconColor: 'text-black' }
        ]
      };
    } else {
      initialDatabase[key] = {
        goal: 2500,
        drinks: [
          { id: `auto-${d}-1`, time: '08:00 AM', name: 'Plain Water', ml: 500, tag: 'WAKE-UP', sub: 'Kickstart', icon: 'water_bottle', bg: 'bg-[#00D2FF]', iconColor: 'text-black' },
          { id: `auto-${d}-2`, time: '11:30 AM', name: 'Spring Water', ml: 600, tag: 'MIDDAY', sub: 'Desk boost', icon: 'water_bottle', bg: 'bg-[#00D2FF]', iconColor: 'text-black' },
          { id: `auto-${d}-3`, time: '02:30 PM', name: 'Electrolyte', ml: 650, tag: 'WORKOUT', sub: 'Power', icon: 'bolt', bg: 'bg-[#FFE600]', iconColor: 'text-black' },
          { id: `auto-${d}-4`, time: '06:00 PM', name: 'Sparkling Mineral', ml: 500, tag: 'DINNER', sub: 'Table glass', icon: 'local_drink', bg: 'bg-[#00D2FF]', iconColor: 'text-black' },
          { id: `auto-${d}-5`, time: '09:00 PM', name: 'Chamomile', ml: 350, tag: 'RELAX', sub: 'Snooze', icon: 'bedtime', bg: 'bg-[#FAF6EE]', iconColor: 'text-black' }
        ]
      };
    }
  }
}

const defaultProfile: UserProfile = {
  displayName: 'Alex Rivera',
  email: 'alex@example.com',
  age: 28,
  weightKg: 72,
  activityLevel: 'moderately_active',
  preferredUnit: 'ml',
  roleTag: 'INTREPID RUNNER',
  quote: '“GLOWING WITH HYDRATED MAIN CHARACTER ENERGY! Sweat hard, hydrate harder! Let’s crush the 2.5L bar today!”',
};

const defaultSchedule: DailySchedule = {
  wakeUpTime: '07:00',
  bedtime: '22:30',
  firstReminderTime: '07:30',
  lastReminderTime: '21:45',
  differentWeekendSchedule: false,
};

const defaultActivities: WorkoutActivity[] = [
  {
    id: 'act-1',
    type: 'Running',
    customName: 'Morning Trail Run',
    startTime: '07:30',
    endTime: '08:30',
    daysOfWeek: ['Mon', 'Wed', 'Fri'],
    pauseReminders: true,
    resumeAfterActivity: true,
  },
  {
    id: 'act-2',
    type: 'Gym',
    customName: 'Gym Strength Protocol',
    startTime: '17:30',
    endTime: '18:45',
    daysOfWeek: ['Tue', 'Thu'],
    pauseReminders: true,
    resumeAfterActivity: true,
  },
];

const defaultPreferences: HydrationPreferences = {
  dailyGoalMl: 2500,
  reminderIntervalMinutes: 60,
  remindersEnabled: true,
  quietHours: '22:30 — 07:00 AM',
  reminderStyle: 'balanced',
  pauseWhenGoalReached: true,
  intelligentPacing: true,
  sfxEnabled: true,
  visualTheme: 'pop_cream',
};

interface HydrationContextType {
  activeTab: ScreenTab;
  setActiveTab: (tab: ScreenTab) => void;
  showAuthModal: boolean;
  setShowAuthModal: (open: boolean) => void;
  authViewMode: 'landing' | 'register' | 'login' | 'forgot' | 'onboarding';
  setAuthViewMode: (mode: 'landing' | 'register' | 'login' | 'forgot' | 'onboarding') => void;
  authUser: AuthUser | null;
  isLoadingAuth: boolean;
  isSyncing: boolean;
  isSupabaseReady: boolean;
  profile: UserProfile;
  schedule: DailySchedule;
  activities: WorkoutActivity[];
  preferences: HydrationPreferences;
  database: Record<string, DayRecord>;
  todayKey: string;
  todayRecord: DayRecord;
  addWater: (amount: number, label: string, tag: string, icon?: string) => Promise<void>;
  undoLastDrink: () => Promise<void>;
  deleteDrink: (id: string, dateKey?: string) => Promise<void>;
  editDrink: (id: string, newMl: number, dateKey?: string) => Promise<void>;
  resetToday: () => Promise<void>;
  addPastDrink: (dateKey: string, item: DrinkItem) => Promise<void>;
  wipeAllData: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateSchedule: (updates: Partial<DailySchedule>) => Promise<void>;
  updatePreferences: (updates: Partial<HydrationPreferences>) => Promise<void>;
  addActivity: (act: WorkoutActivity) => Promise<void>;
  updateActivity: (act: WorkoutActivity) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string) => Promise<{ error: string | null }>;
  signIn: (email: string, pass: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<{ error: string | null }>;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  setVisualTheme: (theme: VisualTheme) => void;
}

const HydrationContext = createContext<HydrationContextType | undefined>(undefined);

export const HydrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ScreenTab>('daily-hydration');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authViewMode, setAuthViewMode] = useState<'landing' | 'register' | 'login' | 'forgot' | 'onboarding'>('landing');

  // Supabase Auth and Sync State
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(isSupabaseConfigured);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Today key defaults to October 24, 2026 matching the Stitch design
  const [todayKey] = useState<string>('2026-9-24');

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_profile');
      return saved ? JSON.parse(saved) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const [schedule, setSchedule] = useState<DailySchedule>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_schedule');
      return saved ? JSON.parse(saved) : defaultSchedule;
    } catch {
      return defaultSchedule;
    }
  });

  const [activities, setActivities] = useState<WorkoutActivity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_activities');
      return saved ? JSON.parse(saved) : defaultActivities;
    } catch {
      return defaultActivities;
    }
  });

  const [preferences, setPreferences] = useState<HydrationPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_prefs');
      return saved ? JSON.parse(saved) : defaultPreferences;
    } catch {
      return defaultPreferences;
    }
  });

  const [database, setDatabase] = useState<Record<string, DayRecord>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_db');
      return saved ? JSON.parse(saved) : initialDatabase;
    } catch {
      return initialDatabase;
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    comicAudio.playSplash();
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  }, []);

  // Sync SFX state with audio engine
  useEffect(() => {
    comicAudio.enabled = preferences.sfxEnabled;
  }, [preferences.sfxEnabled]);

  // Sync theme with HTML class & body styles
  useEffect(() => {
    const isDark = preferences.visualTheme === 'midnight_ink';
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.colorScheme = 'dark';
      document.body.style.backgroundColor = '#131313';
      document.body.style.color = '#e5e2e1';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.style.colorScheme = 'light';
      document.body.style.backgroundColor = '#FDFBF7';
      document.body.style.color = '#000000';
    }
  }, [preferences.visualTheme]);

  // Persist state to localStorage for offline access
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_profile', JSON.stringify(profile));
      localStorage.setItem(STORAGE_KEY + '_schedule', JSON.stringify(schedule));
      localStorage.setItem(STORAGE_KEY + '_activities', JSON.stringify(activities));
      localStorage.setItem(STORAGE_KEY + '_prefs', JSON.stringify(preferences));
      localStorage.setItem(STORAGE_KEY + '_db', JSON.stringify(database));
    } catch (e) {
      console.warn('Failed to persist hydration state to localStorage', e);
    }
  }, [profile, schedule, activities, preferences, database]);

  // -----------------------------------------------------------------------
  // SUPABASE BACKEND DATA LOADING & REALTIME SYNC
  // -----------------------------------------------------------------------
  const loadUserDataFromSupabase = useCallback(async (userId: string) => {
    if (!supabase) return;
    setIsSyncing(true);
    try {
      // 1. Load User Profile
      const { data: profData, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profData && !profErr) {
        setProfile((prev) => ({
          ...prev,
          displayName: profData.display_name || prev.displayName,
          email: profData.email || prev.email,
          age: profData.age ?? prev.age,
          weightKg: profData.weight_kg ? Number(profData.weight_kg) : prev.weightKg,
          activityLevel: profData.activity_level || prev.activityLevel,
          preferredUnit: profData.preferred_unit || prev.preferredUnit,
          roleTag: profData.role_tag || prev.roleTag,
          quote: profData.quote || prev.quote,
        }));
      }

      // 2. Load Schedule & Hydration Preferences
      const { data: schedData, error: schedErr } = await supabase
        .from('schedule_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (schedData && !schedErr) {
        setSchedule((prev) => ({
          ...prev,
          wakeUpTime: schedData.wake_up_time || prev.wakeUpTime,
          bedtime: schedData.bedtime || prev.bedtime,
          firstReminderTime: schedData.first_reminder_time || prev.firstReminderTime,
          lastReminderTime: schedData.last_reminder_time || prev.lastReminderTime,
          differentWeekendSchedule: schedData.different_weekend_schedule ?? prev.differentWeekendSchedule,
        }));

        setPreferences((prev) => ({
          ...prev,
          dailyGoalMl: schedData.daily_goal_ml || prev.dailyGoalMl,
          reminderIntervalMinutes: schedData.reminder_interval_minutes || prev.reminderIntervalMinutes,
          remindersEnabled: schedData.reminders_enabled ?? prev.remindersEnabled,
          quietHours: schedData.quiet_hours || prev.quietHours,
          reminderStyle: schedData.reminder_style || prev.reminderStyle,
          pauseWhenGoalReached: schedData.pause_when_goal_reached ?? prev.pauseWhenGoalReached,
          intelligentPacing: schedData.intelligent_pacing ?? prev.intelligentPacing,
          sfxEnabled: schedData.sfx_enabled ?? prev.sfxEnabled,
          visualTheme: schedData.visual_theme || prev.visualTheme,
        }));
      }

      // 3. Load Workout Activities
      const { data: actData, error: actErr } = await supabase
        .from('workout_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (actData && !actErr && actData.length > 0) {
        setActivities(
          actData.map((a) => ({
            id: a.id,
            type: a.type,
            customName: a.custom_name || a.type,
            startTime: a.start_time,
            endTime: a.end_time,
            daysOfWeek: a.days_of_week || ['Mon', 'Wed', 'Fri'],
            pauseReminders: a.pause_reminders ?? true,
            resumeAfterActivity: a.resume_after_activity ?? true,
          }))
        );
      }

      // 4. Load Water Logs
      const { data: logsData, error: logsErr } = await supabase
        .from('water_logs')
        .select('*')
        .eq('user_id', userId)
        .order('logged_at', { ascending: false });

      if (logsData && !logsErr) {
        // Group logs into DayRecord map
        const userRecords: Record<string, DrinkItem[]> = {};

        logsData.forEach((row) => {
          const dKey = row.date_key;
          if (!userRecords[dKey]) userRecords[dKey] = [];
          userRecords[dKey].push({
            id: row.id,
            time: row.time_str,
            name: row.name,
            ml: row.amount_ml,
            tag: row.tag || 'VALID SIP',
            sub: row.sub || 'Hydration Intake',
            icon: row.icon || 'water_drop',
            bg: 'bg-[#00D2FF]',
            iconColor: 'text-black',
          });
        });

        // Map authenticated user's saved records
        const realDb: Record<string, DayRecord> = {};
        Object.keys(userRecords).forEach((key) => {
          realDb[key] = {
            goal: schedData?.daily_goal_ml || 2500,
            drinks: userRecords[key],
          };
        });

        // Ensure todayKey exists for active logging
        if (!realDb[todayKey]) {
          realDb[todayKey] = {
            goal: schedData?.daily_goal_ml || 2500,
            drinks: [],
          };
        }

        setDatabase(realDb);
      }
    } catch (err) {
      console.warn('Notice: Could not sync from Supabase tables yet. Local state active.', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Initialize Supabase Auth Session listener
  useEffect(() => {
    if (!supabase) {
      setIsLoadingAuth(false);
      return;
    }

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuthUser({
          id: session.user.id,
          email: session.user.email,
          displayName: session.user.user_metadata?.display_name || session.user.email?.split('@')[0],
        });
        loadUserDataFromSupabase(session.user.id);
      }
      setIsLoadingAuth(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthUser({
          id: session.user.id,
          email: session.user.email,
          displayName: session.user.user_metadata?.display_name || session.user.email?.split('@')[0],
        });
        loadUserDataFromSupabase(session.user.id);
      } else {
        setAuthUser(null);
      }
      setIsLoadingAuth(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [loadUserDataFromSupabase]);

  // -----------------------------------------------------------------------
  // AUTHENTICATION METHODS
  // -----------------------------------------------------------------------
  const signUp = async (email: string, pass: string, name: string): Promise<{ error: string | null }> => {
    if (!supabase) {
      // Local fallback
      updateProfile({ displayName: name, email });
      setAuthUser({ id: 'local-user', email, displayName: name });
      return { error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            display_name: name,
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        setAuthUser({
          id: data.user.id,
          email: data.user.email,
          displayName: name,
        });

        // Upsert default profile record
        await supabase.from('profiles').upsert({
          id: data.user.id,
          display_name: name,
          email: data.user.email,
        });

        // Upsert default schedule & preferences
        await supabase.from('schedule_preferences').upsert({
          user_id: data.user.id,
          daily_goal_ml: 2500,
          reminder_interval_minutes: 60,
        });
      }

      return { error: null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Sign-up failed' };
    }
  };

  const signIn = async (email: string, pass: string): Promise<{ error: string | null }> => {
    if (!supabase) {
      // Local fallback
      updateProfile({ email });
      setAuthUser({ id: 'local-user', email, displayName: profile.displayName });
      return { error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        setAuthUser({
          id: data.user.id,
          email: data.user.email,
          displayName: data.user.user_metadata?.display_name || data.user.email?.split('@')[0],
        });
        await loadUserDataFromSupabase(data.user.id);
      }

      return { error: null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Sign-in failed' };
    }
  };

  const signOut = async () => {
    comicAudio.playPop();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Sign out error', e);
      }
    }
    setAuthUser(null);
    setProfile(defaultProfile);
    setSchedule(defaultSchedule);
    setActivities(defaultActivities);
    setPreferences(defaultPreferences);
    setDatabase(initialDatabase);
    showToast('LOGGED OUT. RETURNED TO GUEST MODE.');
  };

  const resetPasswordForEmail = async (email: string): Promise<{ error: string | null }> => {
    if (!supabase) return { error: null };
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      return { error: error ? error.message : null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Reset failed' };
    }
  };

  // -----------------------------------------------------------------------
  // DATA OPERATIONS WITH POSTGRES & RLS PERSISTENCE
  // -----------------------------------------------------------------------
  const todayRecord: DayRecord = database[todayKey] || {
    goal: preferences.dailyGoalMl,
    drinks: [],
  };

  const addWater = async (amount: number, label: string, tag: string, icon?: string) => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const timeStr = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

    const newDrinkId = `drink-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newDrink: DrinkItem = {
      id: newDrinkId,
      time: timeStr,
      name: label,
      ml: amount,
      tag: tag || 'VALID SIP',
      sub: 'Hydration Intake',
      icon: icon || 'water_drop',
      bg: 'bg-[#00D2FF]',
      iconColor: 'text-black',
    };

    // Optimistic UI update
    setDatabase((prev) => {
      const currentDay = prev[todayKey] || { goal: preferences.dailyGoalMl, drinks: [] };
      return {
        ...prev,
        [todayKey]: {
          ...currentDay,
          drinks: [newDrink, ...currentDay.drinks],
        },
      };
    });

    comicAudio.playPop();
    showToast(`WHAM! +${amount} ML TANK CHARGED!`);

    // Supabase DB Persistence
    if (supabase && authUser?.id && authUser.id !== 'local-user') {
      try {
        const { data, error } = await supabase.from('water_logs').insert({
          user_id: authUser.id,
          date_key: todayKey,
          amount_ml: amount,
          name: label,
          tag: tag || 'VALID SIP',
          sub: 'Hydration Intake',
          time_str: timeStr,
          icon: icon || 'water_drop',
        }).select('id').maybeSingle();

        if (data?.id) {
          // Sync server-assigned UUID
          setDatabase((prev) => {
            const day = prev[todayKey];
            if (!day) return prev;
            return {
              ...prev,
              [todayKey]: {
                ...day,
                drinks: day.drinks.map((d) => (d.id === newDrinkId ? { ...d, id: data.id } : d)),
              },
            };
          });
        }
        if (error) console.warn('Supabase water_logs insert notice:', error);
      } catch (err) {
        console.warn('water_logs insert error', err);
      }
    }
  };

  const undoLastDrink = async () => {
    const currentDay = database[todayKey];
    if (!currentDay || currentDay.drinks.length === 0) {
      showToast('NO SIP TO UNDO, HERO!');
      return;
    }
    const removed = currentDay.drinks[0];

    // Optimistic update
    setDatabase((prev) => {
      const day = prev[todayKey];
      if (!day) return prev;
      return {
        ...prev,
        [todayKey]: {
          ...day,
          drinks: day.drinks.slice(1),
        },
      };
    });

    comicAudio.playPop();
    showToast(`UNDO! -${removed.ml} ML REVERSED`);

    // Supabase DB Delete
    if (supabase && authUser?.id && authUser.id !== 'local-user') {
      try {
        await supabase.from('water_logs').delete().eq('id', removed.id);
      } catch (err) {
        console.warn('undo water_logs delete error', err);
      }
    }
  };

  const deleteDrink = async (id: string, dateKey = todayKey) => {
    let removedAmount = 0;
    setDatabase((prev) => {
      const day = prev[dateKey];
      if (!day) return prev;
      const target = day.drinks.find((d) => d.id === id);
      if (target) removedAmount = target.ml;
      return {
        ...prev,
        [dateKey]: {
          ...day,
          drinks: day.drinks.filter((d) => d.id !== id),
        },
      };
    });

    if (removedAmount > 0) {
      showToast(`REMOVED -${removedAmount} ML ENTRY`);
    }

    if (supabase && authUser?.id && authUser.id !== 'local-user') {
      try {
        await supabase.from('water_logs').delete().eq('id', id);
      } catch (err) {
        console.warn('delete water_logs error', err);
      }
    }
  };

  const editDrink = async (id: string, newMl: number, dateKey = todayKey) => {
    setDatabase((prev) => {
      const day = prev[dateKey];
      if (!day) return prev;
      return {
        ...prev,
        [dateKey]: {
          ...day,
          drinks: day.drinks.map((d) => (d.id === id ? { ...d, ml: newMl } : d)),
        },
      };
    });

    showToast(`UPDATED TO ${newMl} ML!`);

    if (supabase && authUser?.id && authUser.id !== 'local-user') {
      try {
        await supabase.from('water_logs').update({ amount_ml: newMl }).eq('id', id);
      } catch (err) {
        console.warn('edit water_logs error', err);
      }
    }
  };

  const addPastDrink = async (dateKey: string, item: DrinkItem) => {
    setDatabase((prev) => {
      const day = prev[dateKey] || { goal: preferences.dailyGoalMl, drinks: [] };
      return {
        ...prev,
        [dateKey]: {
          ...day,
          drinks: [...day.drinks, item].sort((a, b) => a.time.localeCompare(b.time)),
        },
      };
    });

    comicAudio.playPop();
    showToast(`LOGGED ${item.ml} ML TO ARCHIVE!`);

    if (supabase && authUser?.id && authUser.id !== 'local-user') {
      try {
        const { data } = await supabase.from('water_logs').insert({
          user_id: authUser.id,
          date_key: dateKey,
          amount_ml: item.ml,
          name: item.name,
          tag: item.tag || 'LOGGED',
          sub: item.sub || 'Manual Entry',
          time_str: item.time,
          icon: item.icon || 'water_drop',
        }).select('id').maybeSingle();

        if (data?.id) {
          setDatabase((prev) => {
            const day = prev[dateKey];
            if (!day) return prev;
            return {
              ...prev,
              [dateKey]: {
                ...day,
                drinks: day.drinks.map((d) => (d.id === item.id ? { ...d, id: data.id } : d)),
              },
            };
          });
        }
      } catch (err) {
        console.warn('addPastDrink error', err);
      }
    }
  };

  const resetToday = async () => {
    setDatabase((prev) => ({
      ...prev,
      [todayKey]: {
        goal: preferences.dailyGoalMl,
        drinks: [],
      },
    }));

    comicAudio.playBoing();
    showToast('RESET COMPLETE! BACK TO ZERO — TIME TO CHUG!');

    if (supabase && authUser?.id && authUser.id !== 'local-user') {
      try {
        await supabase.from('water_logs').delete().eq('user_id', authUser.id).eq('date_key', todayKey);
      } catch (err) {
        console.warn('resetToday error', err);
      }
    }
  };

  const wipeAllData = async () => {
    setDatabase({
      [todayKey]: {
        goal: preferences.dailyGoalMl,
        drinks: [],
      },
    });

    comicAudio.playBoing();
    showToast('HYDRATION DATA WIPED CLEAN!');

    if (supabase && authUser?.id && authUser.id !== 'local-user') {
      try {
        await supabase.from('water_logs').delete().eq('user_id', authUser.id);
      } catch (err) {
        console.warn('wipeAllData error', err);
      }
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    showToast('PROFILE UPDATED!');

    if (supabase && authUser?.id && authUser.id !== 'local-user') {
      try {
        await supabase.from('profiles').upsert({
          id: authUser.id,
          display_name: updates.displayName || profile.displayName,
          email: updates.email || profile.email,
          age: updates.age ?? profile.age,
          weight_kg: updates.weightKg ?? profile.weightKg,
          activity_level: updates.activityLevel || profile.activityLevel,
          preferred_unit: updates.preferredUnit || profile.preferredUnit,
          role_tag: updates.roleTag || profile.roleTag,
          quote: updates.quote || profile.quote,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('updateProfile error', err);
      }
    }
  };

  const updateSchedule = async (updates: Partial<DailySchedule>) => {
    setSchedule((prev) => ({ ...prev, ...updates }));
    showToast('CADENCE UPDATED!');

    if (supabase && authUser?.id && authUser.id !== 'local-user') {
      try {
        await supabase.from('schedule_preferences').upsert({
          user_id: authUser.id,
          wake_up_time: updates.wakeUpTime || schedule.wakeUpTime,
          bedtime: updates.bedtime || schedule.bedtime,
          first_reminder_time: updates.firstReminderTime || schedule.firstReminderTime,
          last_reminder_time: updates.lastReminderTime || schedule.lastReminderTime,
          different_weekend_schedule: updates.differentWeekendSchedule ?? schedule.differentWeekendSchedule,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('updateSchedule error', err);
      }
    }
  };

  const updatePreferences = async (updates: Partial<HydrationPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
    showToast('PREFERENCES SAVED!');

    if (supabase && authUser?.id && authUser.id !== 'local-user') {
      try {
        await supabase.from('schedule_preferences').upsert({
          user_id: authUser.id,
          daily_goal_ml: updates.dailyGoalMl ?? preferences.dailyGoalMl,
          reminder_interval_minutes: updates.reminderIntervalMinutes ?? preferences.reminderIntervalMinutes,
          reminders_enabled: updates.remindersEnabled ?? preferences.remindersEnabled,
          quiet_hours: updates.quietHours || preferences.quietHours,
          reminder_style: updates.reminderStyle || preferences.reminderStyle,
          pause_when_goal_reached: updates.pauseWhenGoalReached ?? preferences.pauseWhenGoalReached,
          intelligent_pacing: updates.intelligentPacing ?? preferences.intelligentPacing,
          sfx_enabled: updates.sfxEnabled ?? preferences.sfxEnabled,
          visual_theme: updates.visualTheme || preferences.visualTheme,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('updatePreferences error', err);
      }
    }
  };

  const setVisualTheme = async (theme: VisualTheme) => {
    setPreferences((prev) => ({ ...prev, visualTheme: theme }));
    showToast(theme === 'midnight_ink' ? '🌙 MIDNIGHT INK ACTIVATED!' : '☀️ POP CREAM ACTIVATED!');

    if (supabase && authUser?.id && authUser.id !== 'local-user') {
      try {
        await supabase.from('schedule_preferences').upsert({
          user_id: authUser.id,
          visual_theme: theme,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Persist theme notice', err);
      }
    }
  };

  const addActivity = async (act: WorkoutActivity) => {
    setActivities((prev) => [...prev, act]);
    showToast(`ADDED SESSION: ${act.customName || act.type}`);

    if (supabase && authUser?.id && authUser.id !== 'local-user') {
      try {
        const { data } = await supabase.from('workout_activities').insert({
          user_id: authUser.id,
          type: act.type,
          custom_name: act.customName || act.type,
          start_time: act.startTime,
          end_time: act.endTime,
          days_of_week: act.daysOfWeek,
          pause_reminders: act.pauseReminders,
          resume_after_activity: act.resumeAfterActivity,
        }).select('id').maybeSingle();

        if (data?.id) {
          setActivities((prev) => prev.map((a) => (a.id === act.id ? { ...a, id: data.id } : a)));
        }
      } catch (err) {
        console.warn('addActivity error', err);
      }
    }
  };

  const updateActivity = async (act: WorkoutActivity) => {
    setActivities((prev) => prev.map((a) => (a.id === act.id ? act : a)));
    showToast('SESSION UPDATED!');

    if (supabase && authUser?.id && authUser.id !== 'local-user') {
      try {
        await supabase.from('workout_activities').update({
          type: act.type,
          custom_name: act.customName || act.type,
          start_time: act.startTime,
          end_time: act.endTime,
          days_of_week: act.daysOfWeek,
          pause_reminders: act.pauseReminders,
          resume_after_activity: act.resumeAfterActivity,
        }).eq('id', act.id);
      } catch (err) {
        console.warn('updateActivity error', err);
      }
    }
  };

  const deleteActivity = async (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    showToast('SESSION REMOVED');

    if (supabase && authUser?.id && authUser.id !== 'local-user') {
      try {
        await supabase.from('workout_activities').delete().eq('id', id);
      } catch (err) {
        console.warn('deleteActivity error', err);
      }
    }
  };

  return (
    <HydrationContext.Provider
      value={{
        activeTab,
        setActiveTab,
        showAuthModal,
        setShowAuthModal,
        authViewMode,
        setAuthViewMode,
        authUser,
        isLoadingAuth,
        isSyncing,
        isSupabaseReady: isSupabaseConfigured,
        profile,
        schedule,
        activities,
        preferences,
        database,
        todayKey,
        todayRecord,
        addWater,
        undoLastDrink,
        deleteDrink,
        editDrink,
        resetToday,
        addPastDrink,
        wipeAllData,
        updateProfile,
        updateSchedule,
        updatePreferences,
        addActivity,
        updateActivity,
        deleteActivity,
        signUp,
        signIn,
        signOut,
        resetPasswordForEmail,
        toastMessage,
        showToast,
        setVisualTheme,
      }}
    >
      {children}
    </HydrationContext.Provider>
  );
};

export const useHydration = () => {
  const context = useContext(HydrationContext);
  if (!context) {
    throw new Error('useHydration must be used within a HydrationProvider');
  }
  return context;
};
