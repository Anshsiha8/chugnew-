import React, { useState } from 'react';
import { useHydration } from '../context/HydrationContext';
import { ActivityLevel, PreferredUnit, ReminderStyle, WorkoutActivity } from '../types';
import { comicAudio } from '../utils/audio';

export const AuthModal: React.FC = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    authViewMode,
    setAuthViewMode,
    profile,
    schedule,
    activities,
    preferences,
    updateProfile,
    updateSchedule,
    updatePreferences,
    addActivity,
    deleteActivity,
    showToast,
  } = useHydration();

  // Onboarding Step (1 to 5)
  const [onboardingStep, setOnboardingStep] = useState<number>(1);

  // Form states for register/login/forgot
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regTerms, setRegTerms] = useState(false);
  const [regError, setRegError] = useState('');

  const [loginEmail, setLoginEmail] = useState('alex@example.com');
  const [loginPass, setLoginPass] = useState('waterhero123');

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Onboarding local editable values
  const [obName, setObName] = useState(profile.displayName);
  const [obAge, setObAge] = useState(profile.age);
  const [obWeight, setObWeight] = useState(profile.weightKg);
  const [obUnit, setObUnit] = useState<PreferredUnit>(profile.preferredUnit);
  const [obActLevel, setObActLevel] = useState<ActivityLevel>(profile.activityLevel);

  const [obWake, setObWake] = useState(schedule.wakeUpTime);
  const [obBed, setObBed] = useState(schedule.bedtime);
  const [obFirstAlert, setObFirstAlert] = useState(schedule.firstReminderTime);
  const [obLastAlert, setObLastAlert] = useState(schedule.lastReminderTime);
  const [obSplitSchedule, setObSplitSchedule] = useState(schedule.differentWeekendSchedule);

  const [obGoal, setObGoal] = useState(preferences.dailyGoalMl);
  const [obInterval, setObInterval] = useState(preferences.reminderIntervalMinutes);
  const [obStyle, setObStyle] = useState<ReminderStyle>(preferences.reminderStyle);
  const [obRemEnabled, setObRemEnabled] = useState(preferences.remindersEnabled);
  const [obPauseGoal, setObPauseGoal] = useState(preferences.pauseWhenGoalReached);

  if (!showAuthModal) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      setRegError('Please provide your name and email.');
      return;
    }
    if (regPass.length < 8) {
      setRegError('Password must be at least 8 characters.');
      return;
    }
    if (regPass !== regConfirm) {
      setRegError('Passwords do not match.');
      return;
    }
    comicAudio.playPop();
    updateProfile({ displayName: regName, email: regEmail });
    setAuthViewMode('onboarding');
    setOnboardingStep(1);
    showToast('DEMO PROFILE CREATED! WELCOME HERO!');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    comicAudio.playPop();
    if (loginEmail) {
      updateProfile({ email: loginEmail });
    }
    setShowAuthModal(false);
    showToast('WELCOME BACK TO CHUG!');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    comicAudio.playPop();
    setForgotSent(true);
  };

  const handleCompleteOnboarding = () => {
    comicAudio.playBoing();
    updateProfile({
      displayName: obName || 'Alex Rivera',
      age: obAge,
      weightKg: obWeight,
      preferredUnit: obUnit,
      activityLevel: obActLevel,
    });
    updateSchedule({
      wakeUpTime: obWake,
      bedtime: obBed,
      firstReminderTime: obFirstAlert,
      lastReminderTime: obLastAlert,
      differentWeekendSchedule: obSplitSchedule,
    });
    updatePreferences({
      dailyGoalMl: obGoal,
      reminderIntervalMinutes: obInterval,
      reminderStyle: obStyle,
      remindersEnabled: obRemEnabled,
      pauseWhenGoalReached: obPauseGoal,
    });
    setShowAuthModal(false);
    showToast('🎉 ONBOARDING MISSION ACCOMPLISHED!');
  };

  const stepTitles = [
    "WHO'S THE THIRST BOSS?",
    "WHEN DOES YOUR DAY START?",
    "WHAT'S ON YOUR LIST?",
    "LET'S SET YOUR FLOW!",
    "YOUR GAME PLAN",
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-3 flex items-center justify-center">
      <div className="relative w-full max-w-md bg-[#FAF7EE] dark:bg-[#131313] text-black dark:text-[#e5e2e1] comic-border-thick rounded-3xl p-4 sm:p-5 shadow-pop-lg max-h-[92vh] overflow-y-auto">
        {/* Modal close icon */}
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-3 right-3 w-8 h-8 rounded-lg comic-border-2 bg-white dark:bg-[#201f1f] text-black dark:text-white font-bold flex items-center justify-center hover:bg-rose-100 z-30"
          aria-label="Close"
        >
          ✕
        </button>

        {/* ================= VIEW: LANDING ================= */}
        {authViewMode === 'landing' && (
          <div className="flex flex-col gap-4 pt-1">
            <div className="flex justify-between items-center pr-8">
              <div className="inline-flex items-center gap-1.5 bg-[#FFE600] text-black comic-border px-3 py-1 rounded-full shadow-pop-sm -rotate-1">
                <span className="text-[11px] font-bold font-comic tracking-wide">
                  ⚡ ISSUE #1 — ZERO DEHYDRATION
                </span>
              </div>
              <div className="bg-white dark:bg-[#201f1f] comic-border px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                MOBILE V1.0
              </div>
            </div>

            {/* Superhero Banner Card */}
            <div className="relative w-full bg-[#FFE600] text-black rounded-3xl comic-border-thick p-4 shadow-pop-lg overflow-hidden">
              <div className="absolute top-2 right-2 bg-[#FF2D78] text-white font-headline text-base tracking-wider px-2.5 py-0.5 comic-border rounded-lg rotate-6 shadow-pop-sm z-20">
                BOOM!
              </div>

              <div className="relative z-10 flex flex-col items-center text-center my-2">
                <div className="w-40 h-40 animate-mascot relative flex items-center justify-center">
                  <img
                    alt="CHUG! Superhero Mascot"
                    className="w-full h-full object-contain rounded-2xl comic-border shadow-pop bg-white"
                    src="https://lh3.googleusercontent.com/aida/AEtjO1WdXx0gNN27FFqh1_U284EkOV7xkWOSTuPKrjLIIySA3_uziKHcFxts38qKpWxypR3FFrj31cyewc0171JqggQw5sJxerpazIGARSOFmbL_4YL8MOkMdTO3UDkPWzQCZP2BoMnWXJlONwXSSmbvoZLReN-yvFH4wATZ_ANJ5v_PEmbYVVkygZIs-agrFpX1DFellyo9-qex8yrx3wbWFbP5bSP3kRo_rhg1avzIVI2MCILd9RE-heLZ6K53"
                  />
                </div>
                <div className="mt-3 bg-white comic-border px-3 py-1.5 rounded-xl shadow-pop flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  <div className="text-left">
                    <p className="text-[9px] font-bold uppercase leading-none">HERO STATUS</p>
                    <p className="font-headline text-base text-[#2455FF] tracking-wide uppercase leading-tight">
                      LEVEL 5 HYDRA-BEAST
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-3 gap-1.5 text-center pt-3 border-t-4 border-black">
                <div className="bg-white comic-border py-1.5 px-1 rounded-lg shadow-pop-sm">
                  <p className="font-headline text-base leading-tight text-[#2455FF]">NO CAP</p>
                  <p className="text-[9px] font-bold uppercase leading-tight">VALID SIP</p>
                </div>
                <div className="bg-white comic-border py-1.5 px-1 rounded-lg shadow-pop-sm">
                  <p className="font-headline text-base leading-tight text-[#FF2D78]">LOCK IN</p>
                  <p className="text-[9px] font-bold uppercase leading-tight">MAIN HERO</p>
                </div>
                <div className="bg-white comic-border py-1.5 px-1 rounded-lg shadow-pop-sm">
                  <p className="font-headline text-base leading-tight text-emerald-600">0 DELULU</p>
                  <p className="text-[9px] font-bold uppercase leading-tight">LATTE ≠ H2O</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="font-headline text-4xl sm:text-5xl tracking-tight leading-[0.95] uppercase">
                READY TO{' '}
                <span className="text-[#2455FF] underline decoration-[#FF2D78] decoration-8 underline-offset-4">
                  CHUG?
                </span>
              </h1>
              <p className="font-comic text-base font-bold">"Your water. Your rhythm. Your rules."</p>
              <p className="text-xs font-medium leading-relaxed">
                Smash your daily hydration goals with personalized smart alerts, superhero tracking,
                and zero boring notification fatigue.
              </p>
              <div className="relative bg-white dark:bg-[#1c1b1b] comic-border-thick p-3 rounded-xl shadow-pop w-full rotate-1">
                <p className="font-comic font-bold text-xs uppercase text-[#2455FF] tracking-wide">
                  💬 "Time to lock in. Down 500ml before your next task!"
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2 w-full">
              <button
                onClick={() => setAuthViewMode('register')}
                className="pop-btn w-full py-3 px-4 bg-[#2455FF] text-white font-headline text-lg tracking-wide rounded-xl comic-border shadow-pop uppercase hover:bg-blue-600 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>CREATE ACCOUNT</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
              <button
                onClick={() => setAuthViewMode('login')}
                className="pop-btn w-full py-2.5 px-4 bg-[#FFE600] text-black font-headline text-lg tracking-wide rounded-xl comic-border shadow-pop uppercase hover:bg-yellow-300 text-center cursor-pointer"
              >
                LOG IN
              </button>
              <button
                onClick={() => {
                  setAuthViewMode('onboarding');
                  setOnboardingStep(1);
                }}
                className="w-full py-2 text-center text-xs font-comic font-bold text-black dark:text-white hover:text-[#2455FF] underline underline-offset-4 cursor-pointer"
              >
                ⚡ ENTER HYDRATED ERA — LOCK IN AS GUEST (NO CAP)
              </button>
            </div>
          </div>
        )}

        {/* ================= VIEW: REGISTER ================= */}
        {authViewMode === 'register' && (
          <div className="w-full">
            <button
              onClick={() => setAuthViewMode('landing')}
              className="mb-2 inline-flex items-center gap-1 font-comic font-bold text-xs uppercase hover:underline"
            >
              ← BACK TO WELCOME
            </button>
            <div className="bg-white dark:bg-[#1c1b1b] comic-border-thick rounded-2xl p-4 shadow-pop">
              <div className="inline-block bg-[#FF2D78] text-white font-bold text-[10px] px-2 py-0.5 rounded comic-border shadow-pop-sm -rotate-2 mb-2">
                FRONTEND DEMO AUTH
              </div>
              <h2 className="font-headline text-2xl uppercase leading-tight mb-1">
                JOIN THE <span className="text-[#2455FF]">CHUG!</span> SQUAD
              </h2>
              <p className="text-xs font-bold mb-3">
                Create your demo profile in seconds. All data stays in your browser.
              </p>

              {regError && (
                <div className="p-2 bg-rose-100 text-[#ba1a1a] rounded comic-border-2 text-xs font-bold mb-2">
                  {regError}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
                <div>
                  <label className="block font-comic font-bold text-[11px] uppercase tracking-wider mb-1">
                    Handle / Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-3 py-2 bg-[#FDFBF7] dark:bg-[#131313] font-bold text-sm comic-border rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-comic font-bold text-[11px] uppercase tracking-wider mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full px-3 py-2 bg-[#FDFBF7] dark:bg-[#131313] font-bold text-sm comic-border rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-comic font-bold text-[11px] uppercase tracking-wider mb-1">
                    Password * (8+ chars)
                  </label>
                  <input
                    type="password"
                    required
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-[#FDFBF7] dark:bg-[#131313] font-bold text-sm comic-border rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-comic font-bold text-[11px] uppercase tracking-wider mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-[#FDFBF7] dark:bg-[#131313] font-bold text-sm comic-border rounded-xl focus:outline-none"
                  />
                </div>
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={regTerms}
                    onChange={(e) => setRegTerms(e.target.checked)}
                    required
                    className="mt-1 w-4 h-4 rounded text-[#2455FF] border-2 border-black"
                  />
                  <label htmlFor="terms" className="text-[11px] font-semibold leading-snug">
                    I agree to the <span className="underline font-bold text-[#2455FF]">Thirst Defense Terms</span>.
                  </label>
                </div>
                <button
                  type="submit"
                  className="pop-btn w-full py-3 bg-[#FFE600] text-black font-headline text-lg tracking-wide rounded-xl comic-border shadow-pop uppercase flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                >
                  <span>LET'S GO!</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </form>
              <div className="mt-3 pt-2 border-t-2 border-black/15 text-center text-xs font-bold">
                Already have an account?{' '}
                <button
                  onClick={() => setAuthViewMode('login')}
                  className="text-[#2455FF] underline font-bold"
                >
                  LOG IN
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW: LOGIN ================= */}
        {authViewMode === 'login' && (
          <div className="w-full">
            <button
              onClick={() => setAuthViewMode('landing')}
              className="mb-2 inline-flex items-center gap-1 font-comic font-bold text-xs uppercase hover:underline"
            >
              ← BACK TO WELCOME
            </button>
            <div className="bg-white dark:bg-[#1c1b1b] comic-border-thick rounded-2xl p-4 shadow-pop">
              <div className="inline-block bg-[#00D2FF] text-black font-bold text-[10px] px-2 py-0.5 rounded comic-border shadow-pop-sm -rotate-2 mb-2">
                WELCOME BACK HERO
              </div>
              <h2 className="font-headline text-2xl uppercase leading-tight mb-1">
                LOG IN TO <span className="text-[#2455FF]">CHUG!</span>
              </h2>
              <p className="text-xs font-bold mb-3">
                Enter your credentials or test with default hero demo.
              </p>

              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div>
                  <label className="block font-comic font-bold text-[11px] uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full px-3 py-2 bg-[#FDFBF7] dark:bg-[#131313] font-bold text-sm comic-border rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-comic font-bold text-[11px] uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthViewMode('forgot')}
                      className="text-[11px] font-bold text-[#2455FF] underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-[#FDFBF7] dark:bg-[#131313] font-bold text-sm comic-border rounded-xl focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="pop-btn w-full py-3 bg-[#2455FF] text-white font-headline text-lg tracking-wide rounded-xl comic-border shadow-pop uppercase flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                >
                  <span>LOG IN</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </form>
              <div className="mt-3 pt-2 border-t-2 border-black/15 text-center text-xs font-bold">
                Need an account?{' '}
                <button
                  onClick={() => setAuthViewMode('register')}
                  className="text-[#2455FF] underline font-bold"
                >
                  SIGN UP
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW: FORGOT ================= */}
        {authViewMode === 'forgot' && (
          <div className="w-full">
            <button
              onClick={() => setAuthViewMode('login')}
              className="mb-2 inline-flex items-center gap-1 font-comic font-bold text-xs uppercase hover:underline"
            >
              ← BACK TO LOGIN
            </button>
            <div className="bg-white dark:bg-[#1c1b1b] comic-border-thick rounded-2xl p-4 shadow-pop">
              <div className="inline-block bg-[#FFE600] text-black font-bold text-[10px] px-2 py-0.5 rounded comic-border shadow-pop-sm -rotate-2 mb-2">
                RESET ACCESS
              </div>
              <h2 className="font-headline text-2xl uppercase leading-tight mb-1">
                RECOVER YOUR <span className="text-[#FF2D78]">FLOW!</span>
              </h2>

              {!forgotSent ? (
                <form onSubmit={handleForgotSubmit} className="space-y-3">
                  <p className="text-xs font-bold mb-2">
                    Enter your email to receive simulated reset instructions.
                  </p>
                  <div>
                    <label className="block font-comic font-bold text-[11px] uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full px-3 py-2 bg-[#FDFBF7] dark:bg-[#131313] font-bold text-sm comic-border rounded-xl focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="pop-btn w-full py-3 bg-[#FF2D78] text-white font-headline text-base tracking-wide rounded-xl comic-border shadow-pop uppercase"
                  >
                    SEND RESET LINK
                  </button>
                </form>
              ) : (
                <div className="text-center space-y-3 py-2">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 comic-border rounded-full flex items-center justify-center mx-auto text-2xl shadow-pop-sm">
                    ✓
                  </div>
                  <h3 className="font-headline text-xl uppercase">LINK TRANSMITTED!</h3>
                  <p className="text-xs font-bold">
                    Reset instructions dispatched for{' '}
                    <span className="font-bold text-[#2455FF]">{forgotEmail || 'your email'}</span>.
                  </p>
                  <button
                    onClick={() => setAuthViewMode('login')}
                    className="pop-btn px-4 py-2 bg-[#FFE600] text-black comic-border rounded-lg font-comic font-bold text-xs uppercase shadow-pop-sm"
                  >
                    BACK TO LOGIN
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= VIEW: 5-STEP ONBOARDING ================= */}
        {authViewMode === 'onboarding' && (
          <div className="w-full space-y-3">
            {/* Header with step progress */}
            <div className="bg-white dark:bg-[#1c1b1b] comic-border-thick rounded-2xl p-3 shadow-pop">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div>
                  <span className="font-comic font-bold text-[10px] uppercase tracking-wider text-[#2455FF]">
                    ONBOARDING MISSION
                  </span>
                  <h2 className="font-headline text-lg sm:text-xl uppercase leading-tight">
                    STEP {onboardingStep} OF 5: {stepTitles[onboardingStep - 1]}
                  </h2>
                </div>
                <span className="font-headline text-xl text-[#FF2D78]">
                  {Math.round((onboardingStep / 5) * 100)}%
                </span>
              </div>
              <div className="w-full bg-[#FDFBF7] h-3.5 comic-border rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-[#00D2FF] via-[#FFE600] to-[#FF2D78] h-full rounded-full transition-all duration-500 border-r-2 border-black"
                  style={{ width: `${(onboardingStep / 5) * 100}%` }}
                />
              </div>

              {/* Step pills */}
              <div className="flex justify-between items-center mt-2 pt-1 border-t-2 border-black/15 text-[10px] font-bold">
                {[1, 2, 3, 4, 5].map((stepNum) => (
                  <button
                    key={stepNum}
                    onClick={() => setOnboardingStep(stepNum)}
                    className={`flex items-center gap-1 ${
                      onboardingStep === stepNum ? 'text-[#2455FF] font-bold' : 'opacity-70'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full comic-border flex items-center justify-center text-[9px] ${
                        onboardingStep >= stepNum ? 'bg-[#FFE600] text-black' : 'bg-white'
                      }`}
                    >
                      {stepNum}
                    </span>
                    {stepNum === 1
                      ? 'About'
                      : stepNum === 2
                      ? 'Routine'
                      : stepNum === 3
                      ? 'Acts'
                      : stepNum === 4
                      ? 'Goals'
                      : 'Plan'}
                  </button>
                ))}
              </div>
            </div>

            {/* Step Body */}
            <div className="bg-white dark:bg-[#1c1b1b] comic-border-thick rounded-2xl p-4 shadow-pop-lg">
              {/* Step 1: About */}
              {onboardingStep === 1 && (
                <div className="space-y-3">
                  <div className="border-b-2 border-black/15 pb-2">
                    <div className="inline-block bg-[#FFE600] text-black font-bold text-[10px] px-2 py-0.5 rounded comic-border shadow-pop-sm -rotate-1 mb-1">
                      PROFILE IDENTITY
                    </div>
                    <h3 className="font-headline text-xl uppercase">WHO'S THE THIRST BOSS?</h3>
                    <p className="text-xs font-bold">
                      Calibrate your daily cadence. No clinical claims — pure smart nudging.
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold text-[11px] uppercase mb-1">
                      Superhero Name / Handle *
                    </label>
                    <input
                      type="text"
                      value={obName}
                      onChange={(e) => setObName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FDFBF7] dark:bg-[#131313] font-bold text-sm comic-border rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-[11px] uppercase mb-1">
                        Age (Years)
                      </label>
                      <input
                        type="number"
                        value={obAge}
                        onChange={(e) => setObAge(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#FDFBF7] dark:bg-[#131313] font-bold text-sm comic-border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[11px] uppercase mb-1">
                        Weight (KG)
                      </label>
                      <input
                        type="number"
                        value={obWeight}
                        onChange={(e) => setObWeight(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#FDFBF7] dark:bg-[#131313] font-bold text-sm comic-border rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[11px] uppercase mb-1">
                      Preferred Unit
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setObUnit('ml')}
                        className={`py-2 px-2 comic-border rounded-xl font-headline text-base tracking-wider text-center ${
                          obUnit === 'ml'
                            ? 'bg-[#2455FF] text-white shadow-pop'
                            : 'bg-white dark:bg-[#131313] text-black dark:text-white'
                        }`}
                      >
                        MILLILITRES (ML)
                      </button>
                      <button
                        type="button"
                        onClick={() => setObUnit('fl_oz')}
                        className={`py-2 px-2 comic-border rounded-xl font-headline text-base tracking-wider text-center ${
                          obUnit === 'fl_oz'
                            ? 'bg-[#2455FF] text-white shadow-pop'
                            : 'bg-white dark:bg-[#131313] text-black dark:text-white'
                        }`}
                      >
                        OUNCES (FL OZ)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[11px] uppercase mb-1">
                      Daily Activity Level
                    </label>
                    <div className="grid grid-cols-1 gap-1.5">
                      {[
                        { id: 'mostly_sitting', emoji: '🛋️', title: 'MOSTLY SITTING', desc: 'Desk work, study, relaxed day' },
                        { id: 'lightly_active', emoji: '🚶', title: 'LIGHTLY ACTIVE', desc: 'Casual walks, daily errands' },
                        { id: 'moderately_active', emoji: '🏃', title: 'MODERATELY ACTIVE', desc: 'Regular gym, sports, jogging' },
                        { id: 'very_active', emoji: '⚡', title: 'VERY ACTIVE', desc: 'Endurance training & sports' },
                      ].map((act) => (
                        <div
                          key={act.id}
                          onClick={() => setObActLevel(act.id as ActivityLevel)}
                          className={`cursor-pointer comic-border p-2 rounded-xl transition-all flex items-center gap-2.5 ${
                            obActLevel === act.id
                              ? 'bg-[#FFE600] text-black shadow-pop font-bold'
                              : 'bg-white dark:bg-[#131313]'
                          }`}
                        >
                          <span className="text-xl">{act.emoji}</span>
                          <div>
                            <p className="font-headline text-sm uppercase leading-tight">{act.title}</p>
                            <p className="text-[11px] font-semibold">{act.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Routine */}
              {onboardingStep === 2 && (
                <div className="space-y-3">
                  <div className="border-b-2 border-black/15 pb-2">
                    <div className="inline-block bg-[#00D2FF] text-black font-bold text-[10px] px-2 py-0.5 rounded comic-border shadow-pop-sm -rotate-1 mb-1">
                      CHRONO CADENCE
                    </div>
                    <h3 className="font-headline text-xl uppercase">WHEN DOES YOUR DAY START?</h3>
                    <p className="text-xs font-bold">Sleep guard auto-mutes notifications while resting.</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setObSplitSchedule(false)}
                      className={`flex-1 py-1.5 px-2 comic-border rounded-lg text-[11px] font-bold ${
                        !obSplitSchedule ? 'bg-[#FFE600] text-black shadow-pop-sm' : 'bg-white'
                      }`}
                    >
                      SAME SCHEDULE
                    </button>
                    <button
                      type="button"
                      onClick={() => setObSplitSchedule(true)}
                      className={`flex-1 py-1.5 px-2 comic-border rounded-lg text-[11px] font-bold ${
                        obSplitSchedule ? 'bg-[#FFE600] text-black shadow-pop-sm' : 'bg-white'
                      }`}
                    >
                      SPLIT WEEKEND
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#FAF7EE] dark:bg-[#201f1f] comic-border p-2 rounded-xl">
                      <label className="block text-[10px] font-bold uppercase mb-1">☀️ WAKE-UP</label>
                      <input
                        type="time"
                        value={obWake}
                        onChange={(e) => setObWake(e.target.value)}
                        className="w-full px-2 py-1 bg-white dark:bg-[#131313] text-sm comic-border rounded font-bold"
                      />
                    </div>
                    <div className="bg-[#FAF7EE] dark:bg-[#201f1f] comic-border p-2 rounded-xl">
                      <label className="block text-[10px] font-bold uppercase mb-1">🌙 BEDTIME</label>
                      <input
                        type="time"
                        value={obBed}
                        onChange={(e) => setObBed(e.target.value)}
                        className="w-full px-2 py-1 bg-white dark:bg-[#131313] text-sm comic-border rounded font-bold"
                      />
                    </div>
                    <div className="bg-white dark:bg-[#201f1f] comic-border p-2 rounded-xl shadow-pop-sm">
                      <label className="block text-[10px] font-bold uppercase mb-1">⏱️ 1ST ALERT</label>
                      <input
                        type="time"
                        value={obFirstAlert}
                        onChange={(e) => setObFirstAlert(e.target.value)}
                        className="w-full px-2 py-1 bg-[#FAF7EE] dark:bg-[#131313] text-sm comic-border rounded font-bold"
                      />
                    </div>
                    <div className="bg-white dark:bg-[#201f1f] comic-border p-2 rounded-xl shadow-pop-sm">
                      <label className="block text-[10px] font-bold uppercase mb-1">⏱️ LAST ALERT</label>
                      <input
                        type="time"
                        value={obLastAlert}
                        onChange={(e) => setObLastAlert(e.target.value)}
                        className="w-full px-2 py-1 bg-[#FAF7EE] dark:bg-[#131313] text-sm comic-border rounded font-bold"
                      />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#201f1f] comic-border-thick p-3 rounded-xl shadow-pop">
                    <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                      <span className="bg-[#FFE600] text-black px-2 py-0.5 rounded comic-border">
                        FLOW PREVIEW
                      </span>
                      <span className="text-[#2455FF] dark:text-[#7cf4ff] font-bold">
                        HYDRATION ACTIVE: {obWake} — {obBed}
                      </span>
                    </div>
                    <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 comic-border rounded flex overflow-hidden">
                      <div className="w-[30%] bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-[9px] font-bold border-r border-black">
                        SLEEP
                      </div>
                      <div className="w-[60%] bg-[#00D2FF] text-black flex items-center justify-center text-[9px] font-bold border-r border-black">
                        HYDRATION ACTIVE
                      </div>
                      <div className="w-[10%] bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-[9px] font-bold">
                        SLEEP
                      </div>
                    </div>
                    <p className="text-[10px] font-bold mt-1.5">
                      ⚡ Smart alerts pause during sleep guard automatically.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Activities */}
              {onboardingStep === 3 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-black/15 pb-2">
                    <div>
                      <div className="inline-block bg-[#FF2D78] text-white font-bold text-[10px] px-2 py-0.5 rounded comic-border shadow-pop-sm -rotate-1 mb-1">
                        SESSIONS &amp; ROUTINES
                      </div>
                      <h3 className="font-headline text-xl uppercase">WHAT'S ON YOUR LIST?</h3>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {activities.map((act) => (
                      <div
                        key={act.id}
                        className="bg-white dark:bg-[#201f1f] comic-border p-3 rounded-xl shadow-pop-sm flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{act.type === 'Running' ? '🏃' : '🏋️'}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-headline text-base uppercase">
                                {act.customName || act.type}
                              </h4>
                              <span className="bg-[#FFE600] text-black px-1.5 py-0.2 rounded text-[9px] font-bold comic-border">
                                {act.type}
                              </span>
                            </div>
                            <p className="text-[11px] font-bold">
                              {act.startTime} – {act.endTime} • Days: {act.daysOfWeek.join(', ')}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteActivity(act.id)}
                          className="px-2 py-1 bg-white text-red-500 comic-border rounded text-[11px] font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      addActivity({
                        id: `act-${Date.now()}`,
                        type: 'Study',
                        customName: 'Study Block',
                        startTime: '14:00',
                        endTime: '16:00',
                        daysOfWeek: ['Mon', 'Wed'],
                        pauseReminders: true,
                        resumeAfterActivity: true,
                      });
                    }}
                    className="w-full py-2 bg-[#FFE600] text-black comic-border rounded-xl font-headline text-sm uppercase shadow-pop cursor-pointer"
                  >
                    + ADD SAMPLE SESSION
                  </button>
                </div>
              )}

              {/* Step 4: Goals */}
              {onboardingStep === 4 && (
                <div className="space-y-3">
                  <div className="border-b-2 border-black/15 pb-2">
                    <div className="inline-block bg-[#FFE600] text-black font-bold text-[10px] px-2 py-0.5 rounded comic-border shadow-pop-sm -rotate-1 mb-1">
                      INTAKE TARGETS
                    </div>
                    <h3 className="font-headline text-xl uppercase">LET'S SET YOUR FLOW!</h3>
                    <p className="text-xs font-bold">Daily goal and frequency parameters.</p>
                  </div>

                  <div className="bg-[#FAF7EE] dark:bg-[#201f1f] comic-border p-3 rounded-xl">
                    <label className="block text-[11px] font-bold uppercase mb-1">
                      🎯 DAILY WATER GOAL
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="50"
                        min="500"
                        max="6000"
                        value={obGoal}
                        onChange={(e) => setObGoal(Number(e.target.value))}
                        className="w-28 px-3 py-1.5 bg-white dark:bg-[#131313] font-headline text-2xl comic-border rounded-xl"
                      />
                      <span className="font-headline text-base text-[#2455FF] dark:text-[#7cf4ff] uppercase flex-1">
                        {obUnit.toUpperCase()} / DAY
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setObGoal((g) => Math.max(500, g - 250))}
                          className="w-8 h-8 bg-white dark:bg-[#131313] comic-border rounded text-lg font-bold"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => setObGoal((g) => Math.min(6000, g + 250))}
                          className="w-8 h-8 bg-white dark:bg-[#131313] comic-border rounded text-lg font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase mb-1">
                      ⏱️ REMINDER FREQUENCY
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[30, 45, 60, 90, 120].map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setObInterval(mins)}
                          className={`py-2 px-1 rounded-xl comic-border font-headline text-sm text-center ${
                            obInterval === mins
                              ? 'bg-[#2455FF] text-white shadow-pop font-bold'
                              : 'bg-white dark:bg-[#131313]'
                          }`}
                        >
                          {mins} MIN
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase mb-1">
                      💬 REMINDER VIBE
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['gentle', 'balanced', 'frequent'] as ReminderStyle[]).map((st) => (
                        <div
                          key={st}
                          onClick={() => setObStyle(st)}
                          className={`cursor-pointer comic-border p-2 rounded-xl text-center ${
                            obStyle === st
                              ? 'bg-[#FFE600] text-black shadow-pop font-bold'
                              : 'bg-white dark:bg-[#131313]'
                          }`}
                        >
                          <p className="font-headline text-sm uppercase">{st}</p>
                          <p className="text-[9px] font-bold">
                            {st === 'gentle' ? 'Soft' : st === 'balanced' ? 'Comic' : 'Hero'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Plan Review */}
              {onboardingStep === 5 && (
                <div className="space-y-3">
                  <div className="border-b-2 border-black/15 pb-2">
                    <div className="inline-block bg-[#FF2D78] text-white font-bold text-[10px] px-2 py-0.5 rounded comic-border shadow-pop-sm -rotate-1 mb-1">
                      FINAL BRIEFING
                    </div>
                    <h3 className="font-headline text-xl uppercase">YOUR GAME PLAN</h3>
                    <p className="text-xs font-bold">Review your settings before launch.</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="bg-[#FAF7EE] dark:bg-[#201f1f] comic-border p-2.5 rounded-xl relative shadow-sm">
                      <p className="font-bold text-[10px] uppercase opacity-70">IDENTITY</p>
                      <p className="font-headline text-lg text-[#2455FF] dark:text-[#7cf4ff] uppercase">
                        {obName || 'Alex Rivera'}
                      </p>
                      <p className="font-bold">
                        Age {obAge} • {obWeight} kg • {obActLevel.replace('_', ' ').toUpperCase()}
                      </p>
                    </div>

                    <div className="bg-[#FAF7EE] dark:bg-[#201f1f] comic-border p-2.5 rounded-xl relative shadow-sm">
                      <p className="font-bold text-[10px] uppercase opacity-70">TARGET &amp; CADENCE</p>
                      <p className="font-headline text-lg text-[#FF2D78] uppercase">
                        {obGoal.toLocaleString()} {obUnit.toUpperCase()} / DAY
                      </p>
                      <p className="font-bold">
                        Every {obInterval} Minutes • {obStyle.toUpperCase()} Vibe
                      </p>
                    </div>

                    <div className="bg-[#FAF7EE] dark:bg-[#201f1f] comic-border p-2.5 rounded-xl relative shadow-sm">
                      <p className="font-bold text-[10px] uppercase opacity-70">CHRONO ROUTINE</p>
                      <p className="font-headline text-base uppercase">
                        {obWake} – {obBed}
                      </p>
                      <p className="font-bold">
                        Alerts: {obFirstAlert} – {obLastAlert}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#FFE600] text-black comic-border p-3 rounded-xl shadow-pop-sm">
                    <p className="font-headline text-sm uppercase mb-1">SAMPLE REMINDER TIMELINE</p>
                    <div className="flex flex-wrap gap-1">
                      {['08:00', '09:00', '10:00', '11:00', '12:00'].map((timeStr) => (
                        <span
                          key={timeStr}
                          className="bg-white comic-border px-2 py-0.5 rounded text-[10px] font-bold"
                        >
                          ⏰ {timeStr}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="pt-3 mt-3 border-t-2 border-black/15 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onboardingStep === 1) {
                      setAuthViewMode('landing');
                    } else {
                      setOnboardingStep((s) => s - 1);
                    }
                  }}
                  className="pop-btn py-2 px-3 bg-white dark:bg-[#131313] text-black dark:text-white font-headline text-sm uppercase rounded-xl comic-border shadow-pop"
                >
                  {onboardingStep === 1 ? '← WELCOME' : '← BACK'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onboardingStep === 5) {
                      handleCompleteOnboarding();
                    } else {
                      setOnboardingStep((s) => s + 1);
                    }
                  }}
                  className={`pop-btn py-2 px-4 font-headline text-sm uppercase rounded-xl comic-border shadow-pop flex items-center gap-1 cursor-pointer ${
                    onboardingStep === 5
                      ? 'bg-emerald-400 text-black'
                      : 'bg-[#FFE600] text-black'
                  }`}
                >
                  <span>{onboardingStep === 5 ? "LET'S CHUG!" : 'CONTINUE'}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
