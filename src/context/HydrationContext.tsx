import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DrinkItem,
  DayRecord,
  UserProfile,
  DailySchedule,
  WorkoutActivity,
  HydrationPreferences,
  ScreenTab,
  VisualTheme,
} from '../types';
import { comicAudio } from '../utils/audio';

const STORAGE_KEY = 'CHUG_APP_STORAGE_V2';

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
  profile: UserProfile;
  schedule: DailySchedule;
  activities: WorkoutActivity[];
  preferences: HydrationPreferences;
  database: Record<string, DayRecord>;
  todayKey: string;
  todayRecord: DayRecord;
  addWater: (amount: number, label: string, tag: string, icon?: string) => void;
  undoLastDrink: () => void;
  deleteDrink: (id: string, dateKey?: string) => void;
  editDrink: (id: string, newMl: number, dateKey?: string) => void;
  resetToday: () => void;
  addPastDrink: (dateKey: string, item: DrinkItem) => void;
  wipeAllData: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateSchedule: (updates: Partial<DailySchedule>) => void;
  updatePreferences: (updates: Partial<HydrationPreferences>) => void;
  addActivity: (act: WorkoutActivity) => void;
  updateActivity: (act: WorkoutActivity) => void;
  deleteActivity: (id: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  setVisualTheme: (theme: VisualTheme) => void;
}

const HydrationContext = createContext<HydrationContextType | undefined>(undefined);

export const HydrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ScreenTab>('daily-hydration');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authViewMode, setAuthViewMode] = useState<'landing' | 'register' | 'login' | 'forgot' | 'onboarding'>('landing');

  // Today key defaults to October 24, 2026 matching the Stitch design
  const [todayKey, setTodayKey] = useState<string>('2026-9-24');

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

  // Sync SFX state with audio engine
  useEffect(() => {
    comicAudio.enabled = preferences.sfxEnabled;
  }, [preferences.sfxEnabled]);

  // Sync theme with HTML class & body styles
  useEffect(() => {
    if (preferences.visualTheme === 'midnight_ink') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#131313';
      document.body.style.color = '#e5e2e1';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#FDFBF7';
      document.body.style.color = '#000000';
    }
  }, [preferences.visualTheme]);

  // Persist state to localStorage
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    comicAudio.playSplash();
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  const todayRecord: DayRecord = database[todayKey] || {
    goal: preferences.dailyGoalMl,
    drinks: [],
  };

  const addWater = (amount: number, label: string, tag: string, icon?: string) => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const timeStr = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

    const newDrink: DrinkItem = {
      id: `drink-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      time: timeStr,
      name: label,
      ml: amount,
      tag: tag || 'VALID SIP',
      sub: 'Hydration Intake',
      icon: icon || 'water_drop',
      bg: 'bg-[#00D2FF]',
      iconColor: 'text-black',
    };

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
  };

  const undoLastDrink = () => {
    const currentDay = database[todayKey];
    if (!currentDay || currentDay.drinks.length === 0) {
      showToast('NO SIP TO UNDO, HERO!');
      return;
    }
    const removed = currentDay.drinks[0];
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
  };

  const deleteDrink = (id: string, dateKey = todayKey) => {
    setDatabase((prev) => {
      const day = prev[dateKey];
      if (!day) return prev;
      const target = day.drinks.find((d) => d.id === id);
      const updatedDrinks = day.drinks.filter((d) => d.id !== id);
      if (target) {
        showToast(`REMOVED -${target.ml} ML ENTRY`);
      }
      return {
        ...prev,
        [dateKey]: {
          ...day,
          drinks: updatedDrinks,
        },
      };
    });
  };

  const editDrink = (id: string, newMl: number, dateKey = todayKey) => {
    setDatabase((prev) => {
      const day = prev[dateKey];
      if (!day) return prev;
      const updated = day.drinks.map((d) => (d.id === id ? { ...d, ml: newMl } : d));
      return {
        ...prev,
        [dateKey]: {
          ...day,
          drinks: updated,
        },
      };
    });
    showToast(`UPDATED TO ${newMl} ML!`);
  };

  const addPastDrink = (dateKey: string, item: DrinkItem) => {
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
  };

  const resetToday = () => {
    setDatabase((prev) => ({
      ...prev,
      [todayKey]: {
        goal: preferences.dailyGoalMl,
        drinks: [],
      },
    }));
    comicAudio.playBoing();
    showToast('RESET COMPLETE! BACK TO ZERO — TIME TO CHUG!');
  };

  const wipeAllData = () => {
    setDatabase({
      [todayKey]: {
        goal: preferences.dailyGoalMl,
        drinks: [],
      },
    });
    comicAudio.playBoing();
    showToast('HYDRATION DATA WIPED CLEAN!');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    showToast('PROFILE UPDATED!');
  };

  const updateSchedule = (updates: Partial<DailySchedule>) => {
    setSchedule((prev) => ({ ...prev, ...updates }));
    showToast('CADENCE UPDATED!');
  };

  const updatePreferences = (updates: Partial<HydrationPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
    showToast('PREFERENCES SAVED!');
  };

  const setVisualTheme = (theme: VisualTheme) => {
    setPreferences((prev) => ({ ...prev, visualTheme: theme }));
    showToast(theme === 'midnight_ink' ? '🌙 MIDNIGHT INK ACTIVATED!' : '☀️ POP CREAM ACTIVATED!');
  };

  const addActivity = (act: WorkoutActivity) => {
    setActivities((prev) => [...prev, act]);
    showToast(`ADDED SESSION: ${act.customName || act.type}`);
  };

  const updateActivity = (act: WorkoutActivity) => {
    setActivities((prev) => prev.map((a) => (a.id === act.id ? act : a)));
    showToast('SESSION UPDATED!');
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    showToast('SESSION REMOVED');
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
