import React, { useState } from 'react';
import { useHydration } from '../context/HydrationContext';
import { WorkoutActivity, VisualTheme, PreferredUnit } from '../types';
import { comicAudio } from '../utils/audio';

export const ProfileScreen: React.FC = () => {
  const {
    profile,
    schedule,
    activities,
    preferences,
    updateProfile,
    updateSchedule,
    updatePreferences,
    addActivity,
    updateActivity,
    deleteActivity,
    wipeAllData,
    setVisualTheme,
    showToast,
    setShowAuthModal,
    setAuthViewMode,
  } = useHydration();

  const [showGoalModal, setShowGoalModal] = useState<boolean>(false);
  const [tempGoal, setTempGoal] = useState<number>(preferences.dailyGoalMl);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  // Activity modal state
  const [showActivityModal, setShowActivityModal] = useState<boolean>(false);
  const [editActId, setEditActId] = useState<string | null>(null);
  const [actType, setActType] = useState<string>('Gym');
  const [actCustomName, setActCustomName] = useState<string>('');
  const [actStart, setActStart] = useState<string>('17:30');
  const [actEnd, setActEnd] = useState<string>('18:45');
  const [actDays, setActDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);
  const [actPause, setActPause] = useState<boolean>(true);
  const [actResume, setActResume] = useState<boolean>(true);

  const handleInstallPWA = () => {
    comicAudio.playPop();
    showToast('⚡ APP SHORTCUT INSTALLED! POP SFX PRIMED!');
  };

  const handleToggleReminders = () => {
    comicAudio.playPop();
    updatePreferences({ intelligentPacing: !preferences.intelligentPacing });
  };

  const handleCadenceSelect = (minutes: number) => {
    comicAudio.playPop();
    updatePreferences({ reminderIntervalMinutes: minutes });
  };

  const handleOpenEditActivity = (act: WorkoutActivity) => {
    setEditActId(act.id);
    setActType(act.type);
    setActCustomName(act.customName || act.type);
    setActStart(act.startTime);
    setActEnd(act.endTime);
    setActDays(act.daysOfWeek);
    setActPause(act.pauseReminders);
    setActResume(act.resumeAfterActivity);
    setShowActivityModal(true);
  };

  const handleOpenAddActivity = () => {
    setEditActId(null);
    setActType('Gym');
    setActCustomName('');
    setActStart('17:30');
    setActEnd('18:45');
    setActDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    setActPause(true);
    setActResume(true);
    setShowActivityModal(true);
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (editActId) {
      updateActivity({
        id: editActId,
        type: actType,
        customName: actCustomName || actType,
        startTime: actStart,
        endTime: actEnd,
        daysOfWeek: actDays,
        pauseReminders: actPause,
        resumeAfterActivity: actResume,
      });
    } else {
      addActivity({
        id: `act-${Date.now()}`,
        type: actType,
        customName: actCustomName || actType,
        startTime: actStart,
        endTime: actEnd,
        daysOfWeek: actDays,
        pauseReminders: actPause,
        resumeAfterActivity: actResume,
      });
    }
    setShowActivityModal(false);
  };

  const toggleDay = (day: string) => {
    if (actDays.includes(day)) {
      setActDays(actDays.filter((d) => d !== day));
    } else {
      setActDays([...actDays, day]);
    }
  };

  return (
    <div className="flex flex-col w-full gap-4 max-w-lg mx-auto select-none">
      {/* TOP NOTIFICATION BANNER / PWA INSTALL */}
      <div className="w-full bg-[#FFE600] text-black p-3 rounded-lg comic-border-2 comic-shadow-md flex items-center justify-between gap-2 rotate-[-1deg] transition-transform hover:rotate-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[#00677f] text-[24px] animate-bounce shrink-0">
            install_mobile
          </span>
          <div className="flex flex-col min-w-0">
            <span className="font-headline text-[15px] uppercase tracking-wide leading-none truncate text-black">
              PWA READY!
            </span>
            <span className="font-label-sm text-[10px] uppercase tracking-wider text-black/80 truncate font-bold">
              ADD TO HOMESCREEN FOR INSTANT POP SFX
            </span>
          </div>
        </div>
        <button
          onClick={handleInstallPWA}
          className="bg-[#00D2FF] text-black font-label text-[11px] font-bold uppercase px-3 py-1.5 rounded comic-border-2 comic-shadow-sm active:translate-x-0.5 active:translate-y-0.5 shrink-0 hover:bg-[#47d6ff] cursor-pointer"
        >
          INSTALL
        </button>
      </div>

      {/* SECTION 1: HERO USER PROFILE */}
      <section className="relative bg-white dark:bg-[#1c1b1b] rounded-xl p-4 comic-border-2 comic-shadow-md overflow-visible">
        {/* Comic Sticker Badge */}
        <div className="absolute -top-3.5 right-4 bg-[#FFE600] text-black px-3 py-0.5 rounded comic-border-2 comic-shadow-sm rotate-[2.5deg] z-10 flex items-center gap-1 font-bold">
          <span
            className="material-symbols-outlined text-[16px] text-black"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span className="font-label text-[10px] uppercase tracking-wider">
            OFFICIALLY ENTERING MY HYDRATED ERA
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full comic-border-2 overflow-hidden bg-[#00D2FF] comic-shadow-sm relative z-0">
              <img
                alt="Alex Rivera Avatar"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-ua20YpWxt4HgkugZCskywBEdRyqErMEirHxAdwGToPk5hSsDvoT6s8L_jaxQ1aGed7vRHm6bv5oUlvinXEl-pE0XpYafAJTJh7xjrDNNlgfYn1LVSTA4WqomIUkaerDHBKuI07CS7Bi7jBWTy2YP9nhfTtYYvVYXF8vzC_1JAQ3q_JHtahqBQmWH7UAnhsw5XpSUFnGsLWJJPLCyE68s9ZcJpORZax1-qLjes89C7956L3x8U1bxcw"
              />
            </div>
            <div className="absolute -bottom-2 -left-2 bg-[#00D2FF] text-black font-headline text-[11px] leading-tight px-2 py-0.5 rounded comic-border-2 comic-shadow-sm rotate-[-6deg] z-10 font-bold">
              POWER: 98%
            </div>
          </div>

          {/* Identity & Details */}
          <div className="flex flex-col text-center sm:text-left min-w-0 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-1.5">
              <h1 className="font-headline text-[26px] uppercase tracking-wide text-black dark:text-white m-0 leading-none">
                {profile.displayName}
              </h1>
              <span
                className="material-symbols-outlined text-[#00677f] dark:text-[#7cf4ff] text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
              <span className="font-label text-[11px] text-black/70 dark:text-[#c4c5d9] uppercase font-bold">
                AGE: {profile.age}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white" />
              <span className="font-label text-[11px] text-black/70 dark:text-[#c4c5d9] uppercase font-bold">
                WEIGHT: {profile.weightKg} KG
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white" />
              <span className="font-label text-[11px] text-[#00677f] dark:text-[#7cf4ff] uppercase font-bold">
                {profile.roleTag}
              </span>
            </div>

            {/* Speech Bubble */}
            <div className="relative mt-2 bg-[#F5EFE6] dark:bg-[#2a2a2a] rounded-lg p-2 px-3 comic-border-2 comic-shadow-sm text-left">
              <span className="font-body-md text-[12px] text-black dark:text-white italic font-bold">
                {profile.quote}
              </span>
              <div className="absolute -top-2 left-6 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-[#F5EFE6] dark:border-b-[#2a2a2a]" />
            </div>
          </div>
        </div>

        {/* Daily Calculated Hydration Target Pill Banner */}
        <div className="mt-4 pt-2 flex flex-wrap items-center justify-between gap-2 bg-[#F5EFE6] dark:bg-[#201f1f] rounded-lg p-2.5 comic-border-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#00D2FF] text-black flex items-center justify-center comic-border-2 comic-shadow-sm">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                water_drop
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-[9px] uppercase text-black/70 dark:text-white/70 font-bold">
                LEVEL UP YOUR DRIP • DAILY QUOTA
              </span>
              <span className="font-headline text-[18px] text-[#00677f] dark:text-[#7cf4ff] uppercase tracking-wide">
                {preferences.dailyGoalMl.toLocaleString()} ML / DAY
              </span>
              <span className="font-label-sm text-[9px] text-black/70 dark:text-white/70 uppercase font-bold">
                GOAL SLAYED. SEE YOU TOMORROW, BESTIE.
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              comicAudio.playPop();
              setTempGoal(preferences.dailyGoalMl);
              setShowGoalModal(true);
            }}
            className="bg-[#FFE600] text-black font-label text-[11px] uppercase px-3 py-1.5 rounded comic-border-2 comic-shadow-sm hover:bg-[#fae100] transition-transform active:translate-x-0.5 active:translate-y-0.5 font-bold cursor-pointer"
          >
            EDIT GOAL
          </button>
        </div>
      </section>

      {/* SECTION 2: SMART REMINDER ENGINE */}
      <section className="flex flex-col w-full bg-white dark:bg-[#1c1b1b] rounded-xl comic-border-2 comic-shadow-md overflow-hidden">
        {/* Header Comic Bar */}
        <div className="bg-[#00D2FF] p-2.5 px-4 flex items-center justify-between text-black border-b-2 border-black">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-black text-[22px]">bolt</span>
            <h2 className="font-headline text-[17px] uppercase tracking-wider text-black m-0">
              SMART REMINDER ENGINE
            </h2>
          </div>
          <span className="bg-[#FFE600] text-black font-label-sm text-[10px] px-2 py-0.5 rounded comic-border-2 comic-shadow-sm uppercase font-bold">
            AI SYNC
          </span>
        </div>

        <div className="p-4 flex flex-col gap-3">
          {/* Master Switch */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b-2 border-black/10 dark:border-white/10">
            <div className="flex flex-col">
              <span className="font-title-md text-[14px] text-black dark:text-white uppercase font-bold">
                INTELLIGENT PACING
              </span>
              <span className="font-body-md text-[12px] text-black/70 dark:text-[#c4c5d9]">
                Triggers adaptive prompts based on metabolic load
              </span>
            </div>
            {/* Comic Toggle Switch */}
            <button
              onClick={handleToggleReminders}
              aria-label="Toggle Reminders"
              className={`w-14 h-8 rounded-full comic-border-2 p-0.5 flex items-center px-1 comic-shadow-sm transition-colors cursor-pointer ${
                preferences.intelligentPacing
                  ? 'bg-[#00D2FF] justify-end'
                  : 'bg-gray-300 dark:bg-gray-700 justify-start'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full comic-border-2 comic-shadow-sm block ${
                  preferences.intelligentPacing ? 'bg-[#FFE600]' : 'bg-white'
                }`}
              />
            </button>
          </div>

          {/* Cadence Selector */}
          <div className="flex flex-col gap-1">
            <label className="font-label-lg text-[12px] uppercase text-black dark:text-white flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[18px] text-[#00677f] dark:text-[#7cf4ff]">
                timer
              </span>
              INTERVAL CADENCE
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[45, 60, 90, 120].map((mins) => {
                const isSelected = preferences.reminderIntervalMinutes === mins;
                return (
                  <button
                    key={mins}
                    onClick={() => handleCadenceSelect(mins)}
                    className={`py-2 text-center rounded comic-border-2 comic-shadow-sm font-label text-[11px] uppercase transition-transform active:translate-x-0.5 active:translate-y-0.5 font-bold cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFE600] text-black rotate-[-1deg]'
                        : 'bg-[#F5EFE6] dark:bg-[#2a2a2a] text-black dark:text-white hover:bg-[#FFE600]/40'
                    }`}
                  >
                    {mins} MIN
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sleep Schedule Guard Panel */}
          <div className="bg-[#F5EFE6] dark:bg-[#201f1f] rounded-lg p-3 comic-border-2 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-label-lg text-[12px] uppercase text-black dark:text-white flex items-center gap-1 font-bold">
                <span className="material-symbols-outlined text-[18px] text-[#00677f] dark:text-[#7cf4ff]">
                  bedtime
                </span>
                SLEEP SCHEDULE GUARD
              </span>
              <span className="font-label-sm text-[9px] text-black uppercase font-bold bg-[#7cf4ff] px-1.5 py-0.5 rounded comic-border-2">
                ACTIVE
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="flex flex-col bg-white dark:bg-[#131313] p-2 rounded comic-border-2 comic-shadow-sm">
                <span className="font-label-sm text-[9px] uppercase text-black/70 dark:text-white/70 font-bold">
                  WAKE-UP TIME
                </span>
                <span className="font-headline text-[16px] text-black dark:text-white uppercase">
                  {schedule.wakeUpTime} AM
                </span>
              </div>
              <div className="flex flex-col bg-white dark:bg-[#131313] p-2 rounded comic-border-2 comic-shadow-sm">
                <span className="font-label-sm text-[9px] uppercase text-black/70 dark:text-white/70 font-bold">
                  BEDTIME DND
                </span>
                <span className="font-headline text-[16px] text-black dark:text-white uppercase">
                  {schedule.bedtime} PM
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-black/70 dark:text-white/70">
              <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">
                do_not_disturb_on
              </span>
              <span className="font-body-md text-[11px]">
                Reminders silenced during sleep automatically.
              </span>
            </div>
          </div>

          {/* Active Reminder Vibes */}
          <div className="flex flex-col gap-1.5 mt-1">
            <label className="font-label text-[12px] uppercase text-black dark:text-white flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[18px] text-[#00677f] dark:text-[#7cf4ff]">
                notifications_active
              </span>
              ACTIVE REMINDER VIBES
            </label>
            <div className="flex flex-col gap-1.5">
              {[
                { label: 'HOURLY VIBE CHECK: GRAB YOUR BOTTLE AND DRINK UP', dot: 'bg-[#00D2FF]' },
                { label: 'TIME TO LOCK IN: DOWN 500ML BEFORE YOUR NEXT TASK', dot: 'bg-[#FFE600]' },
                {
                  label: 'THAT AFTERNOON HEADACHE LIVING RENT FREE? FIX IT WITH H2O',
                  dot: 'bg-[#a3e635]',
                },
              ].map((vibe, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-[#F5EFE6] dark:bg-[#201f1f] rounded comic-border-2"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${vibe.dot} border border-black`} />
                    <span className="font-label-sm text-[10px] uppercase font-bold text-black dark:text-white">
                      {vibe.label}
                    </span>
                  </div>
                  <span className="font-label-sm text-[9px] uppercase text-black font-bold bg-[#FFE600] px-1.5 py-0.5 rounded comic-border-2">
                    ON
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Skip Logic */}
          <div className="flex items-center justify-between p-2 bg-[#F5EFE6] dark:bg-[#201f1f] rounded comic-border-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-[#2455FF] text-white flex items-center justify-center comic-border-2 comic-shadow-sm font-bold text-[12px]">
                ✓
              </span>
              <span className="font-label-md text-[11px] uppercase text-black dark:text-white font-bold">
                SMART SKIP LOGIC (PAUSE AFTER 3 SKIPS)
              </span>
            </div>
            <span className="font-label-sm text-[9px] uppercase text-black font-bold bg-[#a3e635] px-1.5 py-0.5 rounded comic-border-2">
              ENABLED
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 3: WORKOUT ADAPTATIONS */}
      <section className="flex flex-col w-full bg-white dark:bg-[#1c1b1b] rounded-xl comic-border-2 comic-shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#FFE600] p-2.5 px-4 flex items-center justify-between text-black border-b-2 border-black">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[24px]">directions_run</span>
            <h2 className="font-headline text-[17px] uppercase tracking-wider text-black m-0">
              WORKOUT ADAPTATIONS
            </h2>
          </div>
          <span className="bg-white text-black font-label-sm text-[10px] px-2 py-0.5 rounded comic-border-2 font-bold uppercase">
            {activities.length} ACTIVE
          </span>
        </div>

        <div className="p-4 flex flex-col gap-2.5">
          <p className="font-body-md text-[12px] text-black/70 dark:text-[#c4c5d9] m-0">
            Chug calculates pre-hydration primers &amp; post-session sweat replenishment windows based on scheduled drills.
          </p>

          <div className="grid grid-cols-1 gap-1.5 my-1">
            <div className="bg-[#FFE600]/30 p-2 px-3 rounded-lg comic-border-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00677f] dark:text-[#7cf4ff] text-[18px]">
                verified
              </span>
              <span className="font-label-sm text-[10px] uppercase text-black dark:text-white font-bold">
                NO CAP: YOUR SKIN WILL THANK YOU FOR THIS GLASS
              </span>
            </div>
            <div className="bg-[#ffa9ba]/40 p-2 px-3 rounded-lg comic-border-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">
                psychology_alt
              </span>
              <span className="font-label-sm text-[10px] uppercase text-black dark:text-white font-bold">
                THINKING ICED LATTE COUNTS AS WATER IS PURE DELULU
              </span>
            </div>
          </div>

          {/* Activities List */}
          {activities.map((act) => (
            <div
              key={act.id}
              className="flex items-center justify-between p-2.5 bg-[#F5EFE6] dark:bg-[#201f1f] rounded-lg comic-border-2 comic-shadow-sm"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded bg-[#00D2FF] text-black flex items-center justify-center comic-border-2 comic-shadow-sm rotate-[-2deg] shrink-0">
                  <span className="material-symbols-outlined text-[22px]">
                    {act.type === 'Running' ? 'sprint' : 'fitness_center'}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-title-md text-[13px] uppercase text-black dark:text-white leading-tight font-bold truncate">
                    {act.customName || act.type}
                  </span>
                  <span className="font-label-sm text-[10px] text-[#00677f] dark:text-[#7cf4ff] uppercase font-bold truncate">
                    {act.startTime} - {act.endTime} • Days: {act.daysOfWeek.join(', ')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleOpenEditActivity(act)}
                  className="text-black dark:text-white hover:text-[#00677f] p-1.5 rounded comic-border-2 bg-white dark:bg-[#131313]"
                  aria-label="Edit activity"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button
                  onClick={() => deleteActivity(act.id)}
                  className="text-black dark:text-white hover:text-red-500 p-1.5 rounded comic-border-2 bg-white dark:bg-[#131313]"
                  aria-label="Delete activity"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          ))}

          {/* Add Activity Button */}
          <button
            onClick={handleOpenAddActivity}
            className="w-full mt-1 py-2.5 bg-[#F5EFE6] dark:bg-[#201f1f] text-black dark:text-white rounded-lg comic-border-2 comic-shadow-sm font-label text-[12px] uppercase flex items-center justify-center gap-1.5 hover:bg-[#FFE600] hover:text-black transition-transform active:translate-x-0.5 active:translate-y-0.5 font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#00677f]">
              add_circle
            </span>
            + ADD ACTIVITY SESSION
          </button>
        </div>
      </section>

      {/* SECTION 4: PREFERENCES & DATA VAULT */}
      <section className="flex flex-col w-full bg-white dark:bg-[#1c1b1b] rounded-xl comic-border-2 comic-shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#F5EFE6] dark:bg-[#2a2a2a] p-2.5 px-4 flex items-center justify-between text-black dark:text-white border-b-2 border-black">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[22px]">tune</span>
            <h2 className="font-headline text-[17px] uppercase tracking-wider m-0">
              PREFERENCES &amp; DATA VAULT
            </h2>
          </div>
          <span className="bg-[#FFE600] text-black font-label-sm text-[10px] px-2 py-0.5 rounded comic-border-2 font-bold uppercase">
            LOCAL GUEST
          </span>
        </div>

        <div className="p-4 flex flex-col gap-3">
          {/* Unit Selector & Audio SFX */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Unit */}
            <div className="flex flex-col bg-[#F5EFE6] dark:bg-[#201f1f] p-3 rounded-lg comic-border-2">
              <span className="font-label-sm text-[10px] uppercase text-black/70 dark:text-white/70 font-bold">
                MEASUREMENT UNIT
              </span>
              <div className="flex items-center gap-2 mt-1.5">
                {(['ml', 'fl_oz'] as PreferredUnit[]).map((u) => {
                  const isSel = profile.preferredUnit === u;
                  return (
                    <button
                      key={u}
                      onClick={() => {
                        comicAudio.playPop();
                        updateProfile({ preferredUnit: u });
                      }}
                      className={`flex-1 py-1.5 rounded comic-border-2 font-label text-[11px] uppercase text-center font-bold transition-transform cursor-pointer ${
                        isSel
                          ? 'bg-[#00D2FF] text-black comic-shadow-sm'
                          : 'bg-white dark:bg-[#131313] text-black dark:text-white'
                      }`}
                    >
                      {u === 'ml' ? 'ML (METRIC)' : 'FL OZ'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Audio SFX */}
            <div className="flex flex-col bg-[#F5EFE6] dark:bg-[#201f1f] p-3 rounded-lg comic-border-2">
              <span className="font-label-sm text-[10px] uppercase text-black/70 dark:text-white/70 font-bold">
                AUDIO &amp; HAPTIC IMPACT
              </span>
              <div className="flex items-center justify-between mt-1.5">
                <span className="font-title-md text-[13px] uppercase text-black dark:text-white font-bold">
                  COMIC SFX
                </span>
                <button
                  onClick={() => {
                    comicAudio.playBoing();
                    updatePreferences({ sfxEnabled: !preferences.sfxEnabled });
                  }}
                  className={`px-3 py-1 rounded comic-border-2 font-label text-[11px] uppercase font-bold comic-shadow-sm cursor-pointer ${
                    preferences.sfxEnabled
                      ? 'bg-[#FFE600] text-black'
                      : 'bg-gray-300 dark:bg-gray-700 text-black dark:text-white'
                  }`}
                >
                  {preferences.sfxEnabled ? 'BOING & POP ON' : 'SFX MUTED'}
                </button>
              </div>
            </div>
          </div>

          {/* Theme Switcher */}
          <div className="flex items-center justify-between p-3 bg-[#F5EFE6] dark:bg-[#201f1f] rounded-lg comic-border-2">
            <div className="flex flex-col">
              <span className="font-title-md text-[13px] uppercase text-black dark:text-white font-bold">
                VISUAL THEME
              </span>
              <span className="font-body-md text-[11px] text-black/70 dark:text-[#c4c5d9]">
                High-voltage Pop Art aesthetic profile
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setVisualTheme('pop_cream')}
                className={`px-3 py-1.5 rounded comic-border-2 font-label text-[10px] uppercase font-bold cursor-pointer transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
                  preferences.visualTheme === 'pop_cream'
                    ? 'bg-[#FFE600] text-black comic-shadow-sm ring-2 ring-black dark:ring-white scale-102'
                    : 'bg-white dark:bg-[#131313] text-black dark:text-white hover:bg-slate-100'
                }`}
              >
                ☀️ POP CREAM
              </button>
              <button
                type="button"
                onClick={() => setVisualTheme('midnight_ink')}
                className={`px-3 py-1.5 rounded comic-border-2 font-label text-[10px] uppercase font-bold cursor-pointer transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
                  preferences.visualTheme === 'midnight_ink'
                    ? 'bg-[#FFE600] text-black comic-shadow-sm ring-2 ring-black dark:ring-white scale-102'
                    : 'bg-white dark:bg-[#131313] text-black dark:text-white hover:bg-slate-100'
                }`}
              >
                🌙 MIDNIGHT INK
              </button>
            </div>
          </div>

          {/* Data Export & Reset */}
          <div className="grid grid-cols-1 gap-2 pt-1">
            <button
              onClick={() => {
                comicAudio.playPop();
                setShowResetModal(true);
              }}
              className="py-2.5 bg-[#ffdad6] text-[#ba1a1a] rounded-lg comic-border-2 comic-shadow-sm font-label text-[12px] uppercase flex items-center justify-center gap-1 hover:bg-[#ba1a1a] hover:text-white transition-all active:translate-x-0.5 active:translate-y-0.5 font-bold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">delete_forever</span>
              RESET DATA
            </button>
          </div>
        </div>
      </section>

      {/* MODAL: EDIT GOAL */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#201f1f] rounded-xl p-4 comic-border-2 comic-shadow-md w-full max-w-sm flex flex-col gap-3">
            <div className="flex items-center justify-between pb-1 border-b-2 border-black dark:border-white">
              <span className="font-headline text-[18px] uppercase text-black dark:text-white">
                ADJUST DAILY QUOTA
              </span>
              <button
                onClick={() => setShowGoalModal(false)}
                className="w-7 h-7 rounded comic-border-2 bg-[#F5EFE6] text-black font-bold"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-label text-[11px] uppercase text-black dark:text-white font-bold">
                Goal (ML):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="50"
                  min="500"
                  max="6000"
                  value={tempGoal}
                  onChange={(e) => setTempGoal(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-[#131313] font-headline text-[22px] text-black dark:text-white comic-border-2 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setTempGoal((g) => Math.max(500, g - 250))}
                  className="w-9 h-9 bg-white dark:bg-[#2a2a2a] text-black dark:text-white comic-border-2 rounded font-headline text-[18px]"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setTempGoal((g) => Math.min(6000, g + 250))}
                  className="w-9 h-9 bg-white dark:bg-[#2a2a2a] text-black dark:text-white comic-border-2 rounded font-headline text-[18px]"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  updatePreferences({ dailyGoalMl: tempGoal });
                  setShowGoalModal(false);
                }}
                className="flex-1 py-2 bg-[#FFE600] text-black font-headline text-[15px] uppercase comic-border-2 comic-shadow-sm rounded"
              >
                SAVE GOAL
              </button>
              <button
                onClick={() => setShowGoalModal(false)}
                className="flex-1 py-2 bg-[#e8e2d1] text-black font-headline text-[15px] uppercase comic-border-2 rounded"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RESET CONFIRMATION */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#201f1f] rounded-xl p-4 comic-border-2 comic-shadow-md w-full max-w-sm flex flex-col gap-3 rotate-[1deg]">
            <div className="flex items-center gap-2 text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[32px]">warning</span>
              <h3 className="font-headline text-[18px] uppercase m-0">DANGER ZONE!</h3>
            </div>
            <p className="font-body-md text-[13px] text-black dark:text-white m-0">
              This will wipe all local hydration logs and reset your streak progress. Are you super sure, hero?
            </p>
            <div className="flex items-center justify-end gap-2 mt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 bg-[#F5EFE6] text-black rounded comic-border-2 font-label text-[12px] uppercase font-bold"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  wipeAllData();
                  setShowResetModal(false);
                }}
                className="px-4 py-2 bg-[#ba1a1a] text-white rounded comic-border-2 comic-shadow-sm font-label text-[12px] uppercase font-bold"
              >
                WIPE ALL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT ACTIVITY */}
      {showActivityModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#201f1f] comic-border-2 rounded-2xl p-5 max-w-md w-full shadow-pop-lg relative animate-fade-in flex flex-col gap-3">
            <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2">
              <div>
                <span className="font-label-sm text-[10px] text-[#ff4d8d] uppercase font-bold">
                  SCHEDULE SLOT
                </span>
                <h4 className="font-headline text-[20px] uppercase text-black dark:text-white">
                  {editActId ? 'EDIT ACTIVITY' : 'ADD ACTIVITY'}
                </h4>
              </div>
              <button
                onClick={() => setShowActivityModal(false)}
                className="w-7 h-7 comic-border-2 rounded bg-[#F5EFE6] text-black font-bold hover:bg-[#ffdad6]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="flex flex-col gap-3">
              <div>
                <label className="block font-label text-[11px] uppercase tracking-wider text-black dark:text-white mb-1 font-bold">
                  Activity Type
                </label>
                <select
                  value={actType}
                  onChange={(e) => setActType(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5EFE6] dark:bg-[#131313] font-label text-[13px] text-black dark:text-white comic-border-2 rounded-xl font-bold"
                >
                  <option value="Gym">Gym / Workout 🏋️</option>
                  <option value="Running">Running / Cardio 🏃</option>
                  <option value="Work">Office / Deep Work 💻</option>
                  <option value="College">College / School 🎓</option>
                  <option value="Study">Study Session 📚</option>
                  <option value="Sports">Team Sports ⚽</option>
                  <option value="Nap">Power Nap 💤</option>
                  <option value="Outdoor">Outdoor Activity 🌲</option>
                  <option value="Custom">Custom Activity ✨</option>
                </select>
              </div>

              <div>
                <label className="block font-label text-[11px] uppercase tracking-wider text-black dark:text-white mb-1 font-bold">
                  Session Name
                </label>
                <input
                  type="text"
                  value={actCustomName}
                  onChange={(e) => setActCustomName(e.target.value)}
                  placeholder="e.g. Martial Arts or Morning Run"
                  className="w-full px-3 py-2 bg-[#F5EFE6] dark:bg-[#131313] font-label text-[13px] text-black dark:text-white comic-border-2 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label text-[11px] uppercase tracking-wider text-black dark:text-white mb-1 font-bold">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={actStart}
                    onChange={(e) => setActStart(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#F5EFE6] dark:bg-[#131313] font-label text-[13px] text-black dark:text-white comic-border-2 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-label text-[11px] uppercase tracking-wider text-black dark:text-white mb-1 font-bold">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={actEnd}
                    onChange={(e) => setActEnd(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#F5EFE6] dark:bg-[#131313] font-label text-[13px] text-black dark:text-white comic-border-2 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label text-[11px] uppercase tracking-wider text-black dark:text-white mb-1 font-bold">
                  Repeat Days
                </label>
                <div className="flex gap-1.5 justify-between">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => {
                    const isDaySelected = actDays.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDay(d)}
                        className={`w-9 h-9 font-label font-bold text-[11px] comic-border-2 rounded cursor-pointer ${
                          isDaySelected
                            ? 'bg-[#FFE600] text-black comic-shadow-sm'
                            : 'bg-white dark:bg-[#131313] text-black dark:text-white'
                        }`}
                      >
                        {d.charAt(0)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5 pt-1 border-t border-black/10 dark:border-white/10">
                <label className="flex items-center gap-2 cursor-pointer font-label text-[11px] font-bold text-black dark:text-white">
                  <input
                    type="checkbox"
                    checked={actPause}
                    onChange={(e) => setActPause(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2455FF] border-2 border-black"
                  />
                  <span>Pause regular reminders during this session</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-label text-[11px] font-bold text-black dark:text-white">
                  <input
                    type="checkbox"
                    checked={actResume}
                    onChange={(e) => setActResume(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2455FF] border-2 border-black"
                  />
                  <span>Send hydration reminder immediately when session finishes</span>
                </label>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowActivityModal(false)}
                  className="flex-1 py-2.5 bg-white dark:bg-[#131313] text-black dark:text-white comic-border-2 rounded-xl font-label text-[12px] uppercase font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#2455FF] text-white comic-border-2 rounded-xl font-headline text-[16px] uppercase tracking-wider comic-shadow-sm hover:bg-blue-600 cursor-pointer"
                >
                  SAVE SESSION
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
