import React, { useState } from 'react';
import { useHydration } from '../context/HydrationContext';
import { comicAudio } from '../utils/audio';

const mascotQuotes = [
  '“Hourly vibe check: Time to lock in. It’s giving dried sponge right now, take a sip!”',
  '“YOU’RE CRUSHING IT, CHAMP! HALFWAY TO MAXIMUM SPLASH!”',
  '“KA-POW! YOUR CELLS ARE DANCING WITH HYDRATION!”',
  '“BOOM! HYDRA-HERO LEVEL REACHED! KEEP GUZZLING!”',
  '“ONE MORE GLASS TO SUPERCHARGE YOUR BRAIN BATTERY!”',
  '“SUPERSONIC SIP COMPLETE! WATER LEVEL SURGING!”',
];

export const HomeScreen: React.FC = () => {
  const {
    todayRecord,
    preferences,
    addWater,
    undoLastDrink,
    deleteDrink,
    resetToday,
    toastMessage,
    showToast,
  } = useHydration();

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [customMl, setCustomMl] = useState(300);
  const [customType, setCustomType] = useState('Mineral Water');

  // Radar alert state
  const [alertStatus, setAlertStatus] = useState<string>('(IN 60 MINS)');
  const [alertTime, setAlertTime] = useState<string>('3:45 PM');

  const currentTotal = todayRecord.drinks.reduce((sum, d) => sum + d.ml, 0);
  const goal = todayRecord.goal || preferences.dailyGoalMl || 2500;
  const percent = Math.min(100, Math.round((currentTotal / goal) * 100));
  const remaining = Math.max(0, goal - currentTotal);

  const cycleQuote = () => {
    comicAudio.playPop();
    setQuoteIndex((prev) => (prev + 1) % mascotQuotes.length);
  };

  const handleAcknowledgeAlert = () => {
    addWater(250, 'Reminder Gulp', 'ALERT ACKNOWLEDGED', 'check_circle');
    setAlertTime('4:45 PM');
    setAlertStatus('(IN 60 MINS)');
  };

  const handleSnoozeAlert = () => {
    comicAudio.playPop();
    setAlertStatus('(SNOOZED +15M)');
    showToast('SNOOZED! RADAR SET TO +15 MINS');
  };

  const handleSkipAlert = () => {
    comicAudio.playPop();
    setAlertStatus('(SKIPPED)');
    showToast('SIP SKIPPED! STAY READY FOR NEXT WAVE');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(customMl) || 250;
    addWater(amount, customType, 'CUSTOM GULP', 'bubble_chart');
    setShowCustomModal(false);
  };

  const handleExportStrip = () => {
    comicAudio.playPop();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `CHUG! Hydration Chronicle — ${new Date().toLocaleDateString()}: Ingested ${currentTotal} ML / ${goal} ML (${percent}%) with ${todayRecord.drinks.length} sips! Stay hydrated, bestie!`
      );
    }
    showToast('⚡ HYDRATION STRIP COPIED TO CLIPBOARD!');
  };

  return (
    <div className="flex flex-col w-full gap-4 max-w-lg mx-auto select-none">
      {/* Section 1: Mascot Motivation & Comic Streak Badge */}
      <div className="relative w-full flex items-start justify-between gap-3 pt-1">
        {/* Speech Dialogue Balloon */}
        <div
          onClick={cycleQuote}
          className="relative flex-1 bg-white dark:bg-[#201f1f] comic-border comic-shadow-md rounded-xl p-3 cursor-pointer hover:scale-101 active:scale-99 transition-transform"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="bg-[#FFE600] text-black font-label-sm text-[10px] px-1.5 py-0.5 rounded comic-border-2 uppercase font-bold rotate-[-2deg]">
              HYDRO-BOT VIBE CHECK
            </span>
            <span className="material-symbols-outlined text-[#00677f] dark:text-[#7cf4ff] text-[18px]">
              electric_bolt
            </span>
          </div>
          <p className="font-title-md text-[14px] text-black dark:text-[#e5e2e1] uppercase leading-tight font-bold">
            {mascotQuotes[quoteIndex]}
          </p>
          {/* Comic Bubble Vector Tail Pointing Down/Left */}
          <div className="absolute -bottom-3 left-6 w-4 h-4 bg-white dark:bg-[#201f1f] comic-border-2 border-t-0 border-r-0 rotate-[-45deg]" />
        </div>

        {/* Comic Streak Starburst Sticker */}
        <div
          onClick={() => {
            comicAudio.playPop();
            showToast('5-DAY STREAK ON FIRE! UNSTOPPABLE!');
          }}
          className="shrink-0 flex flex-col items-center justify-center p-2 bg-[#FFE600] comic-border comic-shadow-md rounded-lg rotate-3 active:rotate-0 transition-transform cursor-pointer"
        >
          <span className="font-headline text-[18px] text-black uppercase leading-none">
            STREAK
          </span>
          <div className="flex items-center gap-0.5">
            <span className="font-headline text-[32px] text-black leading-none font-bold">
              5
            </span>
            <span className="text-[20px] leading-none">🔥</span>
          </div>
          <span className="font-label-sm text-[9px] bg-white text-black comic-border-2 px-1 rounded uppercase tracking-wider font-bold">
            HYDRATED ERA 🔥
          </span>
        </div>
      </div>

      {/* Mascot Visual Anchor Row */}
      <div className="flex items-center gap-2 -mt-1 pl-2">
        <div className="w-12 h-12 rounded-full comic-border-2 comic-shadow-sm bg-[#00D2FF] flex items-center justify-center overflow-hidden shrink-0">
          <img
            alt="Hydro-Bot Droplet Mascot"
            className="w-full h-full object-contain p-0.5"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAue1IhkgsZUV6rN6oRcqqCz-OnbTWouRkJ08LbzzNGiAC6dxcdqxanDTse7LYa_OuhS3eLzP8LfY0glmE7rUBR2t07G8YJes2LGez43sTym61Qfp6ouy7P_QMSYFfJf4mjvqkaa2Rdn8dD89BsZaI3LRVpuZBzSqQ_qRuCfXVjM8K4O0UwlDxm67SHEjZvhFmFoQ4-MebLgPVS0YbFZMAuZobaBn86eWgbRyijn4aloXkBKwRr53Mqtw"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-label-md text-[11px] uppercase text-black dark:text-[#c4c5d9] tracking-wider font-bold">
              TARGET PACE:
            </span>
            <span className="comic-border-2 px-1.5 py-0.5 rounded bg-white dark:bg-[#0e0e0e] font-label-sm text-[10px] font-bold text-black dark:text-[#7cf4ff] uppercase tracking-wide">
              LET HIM COOK ⚡ (OPTIMAL PACE)
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Hero Hydration Beaker Card */}
      <div
        className="relative w-full rounded-xl comic-border comic-shadow-md bg-[#2455FF] dark:bg-[#1a3ec4] text-white p-4 overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(#002db3 2px, transparent 2px)',
          backgroundSize: '14px 14px',
        }}
      >
        <div className="flex items-center justify-between gap-2 mb-3 relative z-20">
          <div className="inline-flex items-center gap-1.5 bg-white dark:bg-[#0e0e0e] text-black dark:text-[#e5e2e1] comic-border-2 comic-shadow-sm px-2.5 py-1 rounded-md uppercase font-label-md text-[11px] rotate-[-1deg] font-bold">
            <span className="material-symbols-outlined text-[#2455FF] dark:text-[#7cf4ff] text-[18px]">
              water_full
            </span>
            <span className="tracking-wide">VOLUME SURGE</span>
          </div>
          <div className="comic-border-2 comic-shadow-sm bg-[#FFE600] text-black px-3 py-1 rounded-lg rotate-[-2deg] select-none shadow-md font-bold">
            <span className="font-headline text-[18px] uppercase tracking-wide">
              {percent}% HYDRATED
            </span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Beaker Vessel */}
          <div className="relative w-40 h-56 comic-border bg-white dark:bg-[#0e0e0e] comic-shadow-md rounded-2xl overflow-hidden flex flex-col justify-end p-0 border-[3px] border-black dark:border-white/80 select-none shrink-0">
            <div className="absolute inset-y-2 left-2 z-30 flex flex-col justify-between text-black dark:text-[#e5e2e1] font-label-sm text-[9px] font-bold pointer-events-none select-none">
              <span className="flex items-center gap-1 leading-none">
                <span className="w-3 border-b-2 border-black dark:border-white/70 block" />
                2500
              </span>
              <span className="flex items-center gap-1 leading-none">
                <span className="w-2 border-b border-black dark:border-white/50 opacity-70 block" />
                2000
              </span>
              <span className="flex items-center gap-1 leading-none">
                <span className="w-3 border-b-2 border-black dark:border-white/70 block" />
                1500
              </span>
              <span className="flex items-center gap-1 leading-none">
                <span className="w-2 border-b border-black dark:border-white/50 opacity-70 block" />
                1000
              </span>
              <span className="flex items-center gap-1 leading-none">
                <span className="w-3 border-b-2 border-black dark:border-white/70 block" />
                500
              </span>
              <span className="flex items-center gap-1 leading-none">
                <span className="w-3 border-b-2 border-black dark:border-white/70 block" />0 ML
              </span>
            </div>

            {/* Glass reflection gloss */}
            <div className="absolute top-2 right-3 bottom-2 w-2 rounded-full bg-black/10 dark:bg-white/10 z-30 pointer-events-none" />
            <div className="absolute top-6 right-5 w-1.5 h-10 rounded-full bg-black/10 dark:bg-white/10 z-30 pointer-events-none rotate-12" />

            {/* Liquid Level */}
            <div
              className="relative w-full transition-all duration-700 ease-out flex flex-col justify-start z-10"
              style={{
                height: `${percent === 0 ? 0 : Math.min(96, Math.max(12, percent))}%`,
                background: 'linear-gradient(180deg, #29dbe7 0%, #003cd7 100%)',
              }}
            >
              {/* Wave SVG top */}
              <div className="absolute -top-3 left-0 w-[200%] h-4 overflow-hidden pointer-events-none z-20">
                <svg
                  className="w-full h-full text-[#7cf4ff] fill-current"
                  preserveAspectRatio="none"
                  viewBox="0 0 1200 40"
                >
                  <path d="M0,20 C150,40 350,0 500,20 C650,40 850,0 1000,20 C1150,40 1350,0 1500,20 L1500,40 L0,40 Z" />
                </svg>
              </div>
              {/* Rising Bubbles */}
              <div className="absolute bottom-3 right-5 w-4 h-4 rounded-full bg-white opacity-75 comic-border-2 animate-bounce" />
              <div className="absolute bottom-10 left-12 w-2.5 h-2.5 rounded-full bg-white opacity-70 comic-border-2" />
              <div className="absolute bottom-20 right-8 w-3 h-3 rounded-full bg-white opacity-85 comic-border-2" />
            </div>
          </div>

          {/* Stats Readout Column */}
          <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left z-20 w-full">
            <div className="flex items-baseline gap-1.5 my-1">
              <span className="font-headline text-[48px] uppercase text-white tracking-normal leading-none drop-shadow-[3px_3px_0px_#171717]">
                {currentTotal.toLocaleString()}
              </span>
              <span className="font-headline text-[22px] uppercase text-[#FFE600] drop-shadow-[2px_2px_0px_#171717]">
                ML
              </span>
            </div>

            <div className="bg-[#FFE600] text-black comic-border-2 px-2.5 py-0.5 rounded font-label-sm text-[11px] font-bold uppercase rotate-[-1deg] shadow-sm mb-1 inline-block">
              {currentTotal === 0
                ? 'TANK EMPTY — TIME TO CHUG! ⚡'
                : percent >= 100
                ? 'GOD-TIER HYDRATION ACHIEVED! 👑'
                : 'OFFICIALLY IN MY HYDRATED ERA ✨'}
            </div>

            <div className="bg-white dark:bg-[#0e0e0e] text-black dark:text-[#e5e2e1] comic-border-2 px-2.5 py-1 rounded-md font-label-md text-[11px] font-bold uppercase tracking-wide shadow-sm my-1 inline-block">
              GOAL: {goal.toLocaleString()} ML • ({remaining.toLocaleString()} ML TO GO)
            </div>

            <div className="text-white font-label-sm text-[10px] font-bold uppercase tracking-wide drop-shadow-[2px_2px_0px_#171717] mt-1">
              {currentTotal === 0
                ? 'Zero hydration detected. First gulp unlocks main character aura!'
                : percent >= 100
                ? 'Maximum splash attained! Cells floating in victory.'
                : 'You are low key parched right now. Fix that with H2O.'}
            </div>

            {/* Horizontal Progress Bar */}
            <div className="w-full mt-2 bg-white dark:bg-[#0e0e0e] comic-border-2 rounded-lg p-1.5 comic-shadow-sm flex items-center gap-2">
              <div className="w-full bg-[#f4eedd] dark:bg-[#201f1f] rounded h-3.5 overflow-hidden comic-border-2 flex">
                <div
                  className="h-full bg-[#FFE600] transition-all duration-500 ease-out"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="font-label-sm text-[11px] text-black dark:text-[#e5e2e1] font-bold min-w-[34px] text-right">
                {percent}%
              </span>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center gap-2 mt-3 w-full justify-center sm:justify-start">
              <button
                onClick={undoLastDrink}
                className="flex-1 max-w-[140px] h-10 inline-flex items-center justify-center gap-1.5 px-3 py-2 comic-border-2 bg-white dark:bg-[#0e0e0e] text-black dark:text-white comic-shadow-sm rounded-lg text-[12px] font-label font-bold uppercase tracking-wide whitespace-nowrap active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-[#201f1f]"
              >
                <span className="material-symbols-outlined text-[18px] leading-none">undo</span>
                <span className="leading-none">UNDO SIP</span>
              </button>
              <button
                onClick={() => {
                  comicAudio.playPop();
                  setShowResetModal(true);
                }}
                className="flex-1 max-w-[140px] h-10 inline-flex items-center justify-center gap-1.5 px-3 py-2 comic-border-2 bg-white dark:bg-[#0e0e0e] text-[#ff3b30] comic-shadow-sm rounded-lg text-[12px] font-label font-bold uppercase tracking-wide whitespace-nowrap active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer hover:bg-rose-50 dark:hover:bg-[#201f1f]"
              >
                <span className="material-symbols-outlined text-[18px] leading-none">
                  restart_alt
                </span>
                <span className="leading-none">RESET</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pop Toast Alert Banner (Comic WHAM! / SPLASH!) */}
      {toastMessage && (
        <div className="w-full bg-[#FFE600] text-black comic-border comic-shadow-md rounded-xl p-3 flex items-center justify-between z-30 animate-bounce transition-all">
          <div className="flex items-center gap-2">
            <span className="bg-[#ff3b30] text-white font-headline text-[16px] px-2 py-0.5 rounded comic-border-2 rotate-[-4deg]">
              SPLASH!
            </span>
            <span className="font-title-md text-[13px] uppercase font-bold text-black tracking-wide">
              {toastMessage}
            </span>
          </div>
          <span className="material-symbols-outlined text-black text-[24px]">verified</span>
        </div>
      )}

      {/* Section 3: Quick-Add Drink Sticker Buttons Grid */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[#00677f] dark:text-[#7cf4ff] text-[20px]">
              local_cafe
            </span>
            <h2 className="font-headline text-[18px] uppercase text-black dark:text-[#e5e2e1] tracking-wide">
              QUICK-SIP STAMP MATRIX
            </h2>
          </div>
          <span className="font-label-sm text-[10px] uppercase bg-white dark:bg-[#201f1f] comic-border-2 px-2 py-0.5 rounded font-bold text-black dark:text-[#e5e2e1] comic-shadow-sm">
            TAP TO GULP
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {/* Option 1: 150ml */}
          <button
            onClick={() => addWater(150, 'Shot / Mini Cup', 'VALID SIP', 'coffee')}
            className="group relative flex flex-col items-center justify-center p-3 rounded-xl comic-border comic-shadow-md active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer text-black"
            style={{ backgroundColor: '#29dbe7' }}
          >
            <span className="absolute top-1 right-1.5 font-label-sm text-[9px] font-bold bg-white text-black px-1 rounded comic-border-2">
              VALID SIP
            </span>
            <span className="material-symbols-outlined text-[32px] group-hover:scale-110 transition-transform">
              coffee
            </span>
            <span className="font-headline text-[20px] uppercase mt-1 leading-none">+150 ML</span>
            <span className="font-label-sm text-[10px] uppercase font-bold text-black opacity-85 mt-0.5">
              Espresso Quickie
            </span>
          </button>

          {/* Option 2: 250ml */}
          <button
            onClick={() => addWater(250, 'Pure Water', 'CRISP H2O', 'water_full')}
            className="group relative flex flex-col items-center justify-center p-3 rounded-xl comic-border comic-shadow-md active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer bg-[#FFE600] text-black"
          >
            <span className="absolute top-1 right-1.5 font-label-sm text-[9px] font-bold bg-[#ff3b30] text-white px-1 rounded comic-border-2 rotate-2">
              BUSSIN' FR
            </span>
            <span className="material-symbols-outlined text-[32px] group-hover:scale-110 transition-transform">
              water_full
            </span>
            <span className="font-headline text-[20px] uppercase mt-1 leading-none">+250 ML</span>
            <span className="font-label-sm text-[10px] uppercase font-bold text-black opacity-85 mt-0.5">
              Crisp H2O
            </span>
          </button>

          {/* Option 3: 350ml */}
          <button
            onClick={() => addWater(350, 'Large Ceramic Mug', 'WARM BREW', 'emoji_food_beverage')}
            className="group relative flex flex-col items-center justify-center p-3 rounded-xl comic-border comic-shadow-md active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer text-black bg-[#ffdad6]"
          >
            <span className="absolute top-1 right-1.5 font-label-sm text-[9px] font-bold bg-white text-black px-1 rounded comic-border-2">
              ATE THAT
            </span>
            <span className="material-symbols-outlined text-[32px] group-hover:scale-110 transition-transform text-[#ba1a1a]">
              emoji_food_beverage
            </span>
            <span className="font-headline text-[20px] uppercase mt-1 leading-none">+350 ML</span>
            <span className="font-label-sm text-[10px] uppercase font-bold text-black opacity-85 mt-0.5">
              Warm Brew
            </span>
          </button>

          {/* Option 4: 500ml */}
          <button
            onClick={() => addWater(500, 'Sport Flask Refill', 'LOCK IN', 'fitness_center')}
            className="group relative flex flex-col items-center justify-center p-3 rounded-xl comic-border comic-shadow-md active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer bg-[#2455FF] text-white"
          >
            <span className="absolute top-1 right-1.5 font-label-sm text-[9px] font-bold bg-[#FFE600] text-black px-1 rounded comic-border-2">
              LOCK IN
            </span>
            <span className="material-symbols-outlined text-[32px] text-[#7cf4ff] group-hover:scale-110 transition-transform">
              fitness_center
            </span>
            <span className="font-headline text-[20px] uppercase mt-1 leading-none text-white">
              +500 ML
            </span>
            <span className="font-label-sm text-[10px] uppercase font-bold text-[#dde1ff] mt-0.5">
              Gym Flask
            </span>
          </button>
        </div>

        {/* Custom Volume Drawer Trigger */}
        <button
          onClick={() => {
            comicAudio.playPop();
            setShowCustomModal(true);
          }}
          className="w-full comic-border comic-shadow-md bg-white dark:bg-[#1c1b1b] text-black dark:text-[#e5e2e1] py-2.5 px-4 rounded-xl flex items-center justify-between active:translate-x-0.5 active:translate-y-0.5 transition-transform cursor-pointer hover:bg-slate-50 dark:hover:bg-[#201f1f]"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00677f] dark:text-[#7cf4ff] font-bold">
              add_circle
            </span>
            <span className="font-headline text-[16px] uppercase tracking-wide">
              ENTER CUSTOM LOG / BEVERAGE
            </span>
          </div>
          <span className="font-label-sm text-[10px] bg-[#FFE600] text-black comic-border-2 px-2 py-0.5 rounded font-bold uppercase">
            CUSTOM +
          </span>
        </button>
      </div>

      {/* Section 4: Smart Reminder Action Panel */}
      <div className="relative w-full rounded-xl comic-border comic-shadow-md bg-[#FFE600] text-black p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded comic-border-2 bg-black text-[#FFE600] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </div>
            <div>
              <span className="font-label-sm text-[9px] uppercase font-bold tracking-wider text-black opacity-80 leading-none block">
                RADAR DISPATCH
              </span>
              <span className="font-headline text-[15px] uppercase text-black leading-tight">
                NEXT HYDRATION ALERT: HOURLY VIBE CHECK
              </span>
            </div>
          </div>
          {/* Countdown Pill */}
          <div className="bg-white dark:bg-[#0e0e0e] comic-border-2 px-2 py-1 rounded text-black dark:text-white font-label text-[11px] font-bold uppercase shadow-sm">
            <span>{alertTime}</span>{' '}
            <span className="text-[#ff3b30] font-bold">{alertStatus}</span>
          </div>
        </div>

        <div className="font-label-sm text-[11px] text-black dark:text-white font-bold uppercase bg-white dark:bg-[#0e0e0e] comic-border-2 rounded-lg p-2 shadow-sm">
          That ice-cold water hits bussin' fr! No cap, your skin will thank you.
        </div>

        <div className="grid grid-cols-3 gap-2 mt-1">
          <button
            onClick={handleAcknowledgeAlert}
            className="flex items-center justify-center gap-1 comic-border-2 bg-[#2455FF] text-white py-2 rounded-lg font-headline text-[15px] uppercase comic-shadow-sm active:translate-x-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">check</span>
            <span>DRANK</span>
          </button>
          <button
            onClick={handleSnoozeAlert}
            className="flex items-center justify-center gap-1 comic-border-2 bg-white dark:bg-[#201f1f] text-black dark:text-white py-2 rounded-lg font-headline text-[15px] uppercase comic-shadow-sm active:translate-x-0.5 active:translate-y-0.5 transition-transform cursor-pointer hover:bg-slate-100 dark:hover:bg-[#2a2a2a]"
          >
            <span className="material-symbols-outlined text-[18px]">snooze</span>
            <span>+15M</span>
          </button>
          <button
            onClick={handleSkipAlert}
            className="flex items-center justify-center gap-1 comic-border-2 bg-[#e8e2d1] dark:bg-[#2a2a2a] text-black dark:text-white py-2 rounded-lg font-headline text-[15px] uppercase comic-shadow-sm active:translate-x-0.5 active:translate-y-0.5 transition-transform cursor-pointer hover:bg-[#dfdac9]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
            <span>SKIP</span>
          </button>
        </div>

        {/* Quiet Hours Sleep Shield Note */}
        <div className="flex items-center justify-between bg-white dark:bg-[#0e0e0e] comic-border-2 rounded-lg px-2 py-1 text-black dark:text-white font-label-sm text-[10px] font-bold uppercase">
          <div className="flex items-center gap-1">
            <span>🌙</span>
            <span>SLEEP SHIELD ACTIVE</span>
          </div>
          <span className="text-[#00677f] dark:text-[#7cf4ff] font-bold">{preferences.quietHours}</span>
        </div>
      </div>

      {/* Section 5: Today's Comic Notebook Water Timeline */}
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-black dark:text-[#e5e2e1] text-[20px]">
              menu_book
            </span>
            <h3 className="font-headline text-[18px] uppercase text-black dark:text-[#e5e2e1] tracking-wide">
              TODAY'S COMIC INTAKE CHRONICLE
            </h3>
          </div>
          <span className="bg-[#2455FF] text-white comic-border-2 px-2 py-0.5 rounded font-label-sm text-[10px] font-bold uppercase comic-shadow-sm">
            {todayRecord.drinks.length} SIPS LOGGED
          </span>
        </div>

        {/* Notebook Paper Container */}
        <div className="comic-border comic-shadow-md rounded-xl bg-white dark:bg-[#1c1b1b] p-3 flex flex-col divide-y-2 divide-black/10 dark:divide-white/10">
          <div className="flex flex-col gap-2">
            {todayRecord.drinks.length === 0 ? (
              <div className="py-6 px-3 text-center rounded-lg comic-border-2 bg-[#FFE600]/25 border-dashed border-black dark:border-white/30">
                <div className="font-headline text-[16px] uppercase text-black dark:text-white mb-0.5">
                  NO SIPS YET TODAY • TIME TO LOCK IN!
                </div>
                <div className="font-label-sm text-[11px] font-bold uppercase text-black/70 dark:text-white/70 tracking-wider">
                  TAP A QUICK-SIP STAMP TO CHUG YOUR FIRST GLASS! ⚡
                </div>
              </div>
            ) : (
              todayRecord.drinks.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#2a2a2a] transition-colors comic-border-2 bg-white dark:bg-[#201f1f]"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded comic-border-2 bg-[#FFE600] text-black flex items-center justify-center font-bold shrink-0">
                      <span className="material-symbols-outlined text-[20px]">
                        {item.icon || 'water_drop'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-headline text-[16px] uppercase text-black dark:text-[#e5e2e1] leading-none">
                          {item.ml} ML
                        </span>
                        <span className="bg-[#FFE600] text-black font-label-sm text-[9px] px-1 rounded comic-border-2 font-bold uppercase">
                          {item.tag || 'VALID SIP'}
                        </span>
                      </div>
                      <span className="font-label-sm text-[11px] text-black/70 dark:text-white/70 font-bold">
                        {item.time} &bull; {item.name}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteDrink(item.id)}
                    className="text-black dark:text-white hover:text-red-500 p-1.5 comic-border-2 rounded bg-white dark:bg-[#131313] active:translate-x-0.5 active:translate-y-0.5 transition-transform"
                    title="Remove Entry"
                    aria-label="Remove drink entry"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Quick Export / Notebook Footer Details */}
          <div className="pt-2 mt-2 flex items-center justify-between text-black dark:text-[#e5e2e1] font-label-sm text-[10px]">
            <span className="flex items-center gap-1 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#FFE600] border border-black inline-block" />
              NO CAP: THINKING ICED LATTE COUNTS AS WATER IS PURE DELULU. GLOWING WITH HYDRATED MAIN CHARACTER ENERGY!
            </span>
            <button
              onClick={handleExportStrip}
              className="text-[#00677f] dark:text-[#7cf4ff] font-bold uppercase underline shrink-0 hover:opacity-80"
            >
              EXPORT STRIP
            </button>
          </div>
        </div>
      </div>

      {/* Custom Entry Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-sm comic-border comic-shadow-md bg-white dark:bg-[#201f1f] rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-1 border-b-2 border-black dark:border-white">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#00677f] dark:text-[#7cf4ff] text-[24px]">
                  local_drink
                </span>
                <span className="font-headline text-[18px] uppercase text-black dark:text-[#e5e2e1]">
                  CUSTOM WATER DOSAGE
                </span>
              </div>
              <button
                className="w-7 h-7 comic-border-2 rounded bg-[#f4eedd] text-black flex items-center justify-center font-bold hover:bg-[#FFE600]"
                onClick={() => setShowCustomModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCustomSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-[11px] uppercase text-black dark:text-white font-bold">
                  Volume Amount (ML):
                </label>
                <input
                  className="w-full comic-border-2 px-3 py-2 text-[20px] font-headline text-black bg-[#FFFDF5] rounded focus:outline-none focus:bg-white"
                  max="2000"
                  min="50"
                  step="50"
                  type="number"
                  value={customMl}
                  onChange={(e) => setCustomMl(Number(e.target.value))}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-md text-[11px] uppercase text-black dark:text-white font-bold">
                  Fluid Category:
                </label>
                <select
                  className="w-full comic-border-2 px-3 py-2 font-label-md text-[13px] uppercase text-black bg-[#FFFDF5] rounded"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                >
                  <option value="Mineral Water">⚡ Mineral Water</option>
                  <option value="Electrolytes">🔥 Electrolyte Blend</option>
                  <option value="Iced Herbal Tea">🌿 Iced Herbal Tea</option>
                  <option value="Sparkling Citrus">🍋 Sparkling Citrus</option>
                  <option value="Coconut Water">🥥 Coconut Water</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  type="submit"
                  className="w-full comic-border-2 comic-shadow-sm bg-[#FFE600] text-black py-2.5 rounded-lg font-headline text-[16px] uppercase active:translate-x-0.5 active:translate-y-0.5 transition-transform"
                >
                  LOG INTAKE!
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="w-full comic-border-2 comic-shadow-sm bg-[#e8e2d1] text-black py-2.5 rounded-lg font-headline text-[16px] uppercase active:translate-x-0.5 active:translate-y-0.5 transition-transform"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-xs comic-border comic-shadow-md bg-white dark:bg-[#201f1f] rounded-xl p-4 flex flex-col gap-3 text-center">
            <div className="flex justify-center -mt-8">
              <div className="w-14 h-14 rounded-full comic-border-2 comic-shadow-md bg-[#FFE600] flex items-center justify-center text-[#ff3b30]">
                <span className="material-symbols-outlined text-[32px]">warning</span>
              </div>
            </div>
            <span className="font-headline text-[18px] uppercase text-black dark:text-[#e5e2e1]">
              PURGE FLUID TANK?
            </span>
            <p className="font-body-md text-[12px] text-black/80 dark:text-[#c4c5d9] font-bold uppercase leading-tight">
              This will reset your intake back to 0 ML and clear today's intake chronicle logs!
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => {
                  resetToday();
                  setShowResetModal(false);
                }}
                className="comic-border-2 comic-shadow-sm bg-[#ff3b30] text-white py-2.5 rounded-lg font-headline text-[15px] uppercase active:translate-x-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
              >
                RESET 0 ML!
              </button>
              <button
                onClick={() => setShowResetModal(false)}
                className="comic-border-2 comic-shadow-sm bg-[#e8e2d1] text-black py-2.5 rounded-lg font-headline text-[15px] uppercase active:translate-x-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
