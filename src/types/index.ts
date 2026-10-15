export interface DrinkItem {
  id: string;
  time: string;
  name: string;
  ml: number;
  tag?: string;
  sub?: string;
  icon?: string;
  bg?: string;
  iconColor?: string;
}

export interface DayRecord {
  goal: number;
  drinks: DrinkItem[];
}

export type PreferredUnit = 'ml' | 'fl_oz';
export type ActivityLevel = 'mostly_sitting' | 'lightly_active' | 'moderately_active' | 'very_active';
export type ReminderStyle = 'gentle' | 'balanced' | 'frequent';
export type VisualTheme = 'pop_cream' | 'midnight_ink';

export interface UserProfile {
  displayName: string;
  email: string;
  age: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  preferredUnit: PreferredUnit;
  roleTag: string;
  quote: string;
}

export interface DailySchedule {
  wakeUpTime: string;
  bedtime: string;
  firstReminderTime: string;
  lastReminderTime: string;
  differentWeekendSchedule: boolean;
}

export interface WorkoutActivity {
  id: string;
  type: string;
  customName: string;
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
  pauseReminders: boolean;
  resumeAfterActivity: boolean;
}

export interface HydrationPreferences {
  dailyGoalMl: number;
  reminderIntervalMinutes: number;
  remindersEnabled: boolean;
  quietHours: string;
  reminderStyle: ReminderStyle;
  pauseWhenGoalReached: boolean;
  intelligentPacing: boolean;
  sfxEnabled: boolean;
  visualTheme: VisualTheme;
}

export type ScreenTab = 'daily-hydration' | 'hydration-history' | 'hydration-insights' | 'profile-settings';
