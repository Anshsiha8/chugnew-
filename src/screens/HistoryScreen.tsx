import React, { useState } from 'react';
import { useHydration } from '../context/HydrationContext';
import { DrinkItem } from '../types';
import { comicAudio } from '../utils/audio';

const MONTH_NAMES = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];
const DAY_NAMES = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export const HistoryScreen: React.FC = () => {
  const { database, addPastDrink, deleteDrink, editDrink } = useHydration();

  // Calendar navigation state (defaults to October 2026)
  const [viewYear, setViewYear] = useState<number>(2026);
  const [viewMonth, setViewMonth] = useState<number>(9); // 9 = October
  const [selectedDay, setSelectedDay] = useState<number>(24);

  // Quick log modal state
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [modalDrinkType, setModalDrinkType] = useState<string>('Plain Water');
  const [modalAmount, setModalAmount] = useState<number>(350);
  const [modalTime, setModalTime] = useState<string>('14:30');

  const selectedKey = `${viewYear}-${viewMonth}-${selectedDay}`;
  const dayData = database[selectedKey] || { goal: 2500, drinks: [] };
  const totalMl = dayData.drinks.reduce((sum, d) => sum + d.ml, 0);
  const goalMl = dayData.goal || 2500;
  const percent = Math.round((totalMl / goalMl) * 100);

  const selectedDateObj = new Date(viewYear, viewMonth, selectedDay);
  const dayOfWeekName = DAY_NAMES[selectedDateObj.getDay()];
  const monthShort = MONTH_NAMES[viewMonth].substring(0, 3);
  const formattedSelectedDate = `${dayOfWeekName}, ${monthShort} ${selectedDay}, ${viewYear}`;

  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const startingCol = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Monday start
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  const handlePrevMonth = () => {
    comicAudio.playPop();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    comicAudio.playPop();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDayClick = (day: number) => {
    comicAudio.playPop();
    setSelectedDay(day);
  };

  const handlePastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [h, m] = modalTime.split(':');
    let hours = parseInt(h, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedTime = `${String(hours).padStart(2, '0')}:${m} ${ampm}`;

    const newDrink: DrinkItem = {
      id: `past-${Date.now()}`,
      time: formattedTime,
      name: modalDrinkType,
      ml: modalAmount,
      tag: 'LOGGED',
      sub: 'Manual Entry',
      icon: modalDrinkType.includes('Tea')
        ? 'emoji_food_beverage'
        : modalDrinkType.includes('Electrolyte')
        ? 'bolt'
        : modalDrinkType.includes('Coffee')
        ? 'coffee'
        : 'water_drop',
      bg: 'bg-[#FFE600]',
      iconColor: 'text-black',
    };

    addPastDrink(selectedKey, newDrink);
    setShowLogModal(false);
  };

  // Determine comic callout badge status
  let badgeTitle = 'DRY!';
  let badgeSubtitle = 'NO LOGS YET';
  let badgeBg = 'bg-[#FAF6EE] text-black';

  if (percent >= 100) {
    badgeTitle = 'NO CRUMBS!';
    badgeSubtitle = 'YOU ATE THAT BOTTLE & LEFT ZERO CRUMBS!';
    badgeBg = 'bg-[#FFE600] text-black rotate-[3deg]';
  } else if (percent >= 50) {
    badgeTitle = 'NICE!';
    badgeSubtitle = `${percent}% CRUSHED`;
    badgeBg = 'bg-[#00D2FF] text-black rotate-[-2deg]';
  } else if (totalMl > 0) {
    badgeTitle = 'CHUG!';
    badgeSubtitle = 'MORE WATER!';
    badgeBg = 'bg-[#FFE600] text-black rotate-[2deg]';
  }

  return (
    <div className="flex flex-col w-full gap-4 max-w-lg mx-auto select-none">
      {/* POP ART RETRO CALENDAR PANEL */}
      <div className="relative w-full bg-white dark:bg-[#1c1b1b] comic-border comic-shadow-md rounded-xl p-4 overflow-hidden">
        {/* Retro Comic Corner Sticker */}
        <div className="absolute top-2 right-2 bg-[#FFE600] text-black comic-border-2 font-label-sm text-[10px] px-2 py-0.5 rounded comic-shadow-sm rotate-[3deg] z-10 uppercase tracking-wider font-bold">
          ✨ IN MY HYDRATED ERA • ISSUE #{(viewYear % 100) * 12 + (viewMonth + 1)}
        </div>

        {/* CALENDAR MONTH SWITCHER */}
        <div className="flex items-center justify-between gap-2 mb-3 mt-4">
          <button
            onClick={handlePrevMonth}
            aria-label="Previous Month"
            className="w-10 h-10 flex items-center justify-center comic-border-2 comic-shadow-sm bg-[#FAF6EE] dark:bg-[#2a2a2a] hover:bg-[#FFE600] text-black dark:text-white rounded-lg transition-transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <span className="material-symbols-outlined font-bold text-[22px]">
              arrow_back_ios_new
            </span>
          </button>
          <div className="flex flex-col items-center">
            <span className="font-label-sm text-[9px] uppercase tracking-wider text-[#00677f] dark:text-[#7cf4ff] font-bold text-center">
              TIMELINE LOG • GOAL SLAYED. SEE YOU TOMORROW, BESTIE.
            </span>
            <h2 className="font-headline text-[22px] uppercase tracking-wider text-black dark:text-white flex items-center gap-1.5 mt-0.5">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h2>
          </div>
          <button
            onClick={handleNextMonth}
            aria-label="Next Month"
            className="w-10 h-10 flex items-center justify-center comic-border-2 comic-shadow-sm bg-[#FAF6EE] dark:bg-[#2a2a2a] hover:bg-[#FFE600] text-black dark:text-white rounded-lg transition-transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <span className="material-symbols-outlined font-bold text-[22px]">
              arrow_forward_ios
            </span>
          </button>
        </div>

        {/* DAYS OF WEEK BAR */}
        <div className="grid grid-cols-7 gap-1 bg-[#FFE600] comic-border-2 rounded-lg p-1 mb-2 text-center comic-shadow-sm">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((dayChar, i) => (
            <span key={i} className="font-label text-[12px] text-black font-bold py-0.5">
              {dayChar}
            </span>
          ))}
        </div>

        {/* CALENDAR GRID */}
        <div className="grid grid-cols-7 gap-1.5 text-center select-none">
          {/* Previous month trailing days */}
          {Array.from({ length: startingCol }).map((_, i) => {
            const prevDayNum = prevMonthDays - (startingCol - 1 - i);
            return (
              <div
                key={`prev-${i}`}
                className="h-10 flex items-center justify-center font-label-sm text-[11px] text-black/30 dark:text-white/30 select-none"
              >
                {prevDayNum}
              </div>
            );
          })}

          {/* Current month days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const key = `${viewYear}-${viewMonth}-${dayNum}`;
            const cellData = database[key] || { goal: 2500, drinks: [] };
            const cellTotal = cellData.drinks.reduce((acc, c) => acc + c.ml, 0);
            const cellGoal = cellData.goal || 2500;
            const cellPercent = Math.min(100, Math.round((cellTotal / cellGoal) * 100));

            const isSelected = selectedDay === dayNum;
            const isGoalMet = cellTotal >= cellGoal;

            let bgClass = 'bg-white dark:bg-[#2a2a2a] text-black dark:text-white';
            if (isGoalMet) {
              bgClass = 'bg-[#FFE600] text-black font-bold';
            } else if (cellTotal > 0) {
              bgClass = 'bg-[#00D2FF]/30 dark:bg-[#00D2FF]/20 text-black dark:text-white';
            }

            return (
              <button
                key={`day-${dayNum}`}
                type="button"
                onClick={() => handleDayClick(dayNum)}
                className={`h-10 rounded flex flex-col items-center justify-center relative active:translate-x-0.5 active:translate-y-0.5 transition-transform cursor-pointer ${bgClass} ${
                  isSelected
                    ? 'border-[3px] border-black dark:border-white scale-105 z-10 comic-shadow-md pt-1 ring-2 ring-[#00D2FF]'
                    : 'comic-border-2 comic-shadow-sm'
                }`}
              >
                {isSelected && (
                  <span className="absolute -top-2.5 bg-[#00D2FF] text-black comic-border-2 font-label-sm text-[7px] px-1 py-0 rounded uppercase tracking-tighter shadow-sm font-black z-10">
                    SELECTED
                  </span>
                )}
                <span className="font-label text-[11px] leading-none font-bold mt-0.5">
                  {dayNum}
                </span>
                {isGoalMet ? (
                  <span
                    className="material-symbols-outlined text-[11px] text-black font-bold"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    water_drop
                  </span>
                ) : cellTotal > 0 ? (
                  <span className="font-label-sm text-[8px] leading-none text-black dark:text-[#7cf4ff] font-extrabold">
                    {cellPercent}%
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* POP ART SELECTED DAY BANNER */}
      <div className="relative w-full bg-[#00D2FF] dark:bg-[#2455FF] text-black dark:text-white comic-border comic-shadow-md rounded-xl p-4 overflow-hidden">
        {/* Starburst SVG icon background */}
        <div className="absolute -right-6 -bottom-6 opacity-20 pointer-events-none text-black dark:text-white">
          <svg fill="currentColor" height="150" viewBox="0 0 100 100" width="150">
            <polygon points="50,0 63,35 98,35 70,57 81,91 50,70 19,91 30,57 2,35 37,35" />
          </svg>
        </div>

        {/* Comic Ribbon Tag */}
        <div className="flex items-center mb-3">
          <div className="inline-flex items-center gap-1.5 bg-white dark:bg-[#0e0e0e] text-black dark:text-white comic-border-2 comic-shadow-sm px-2.5 py-1 rounded font-label text-[11px] uppercase rotate-[-1.5deg] font-bold">
            <span
              className="material-symbols-outlined text-[16px] text-black dark:text-[#7cf4ff]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              event
            </span>
            <span className="tracking-wide">{formattedSelectedDate}</span>
          </div>
        </div>

        {/* Hero Intakes & Punchy Celebration */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="font-label-sm text-[10px] text-black dark:text-[#dde1ff] font-bold uppercase tracking-wider block">
              TOTAL INGESTED
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-headline text-[36px] tracking-tight text-black dark:text-white leading-none">
                {totalMl.toLocaleString()}
              </span>
              <span className="font-title-md text-[14px] text-black dark:text-white/80 font-bold opacity-90">
                / {goalMl.toLocaleString()} ML
              </span>
            </div>
          </div>

          {/* Action Comic Burst Callout Badge */}
          <div
            className={`comic-border-2 comic-shadow-sm px-2 py-1 rounded text-center flex flex-col items-center shrink-0 ${badgeBg}`}
          >
            <span className="font-headline text-[16px] leading-none text-black">
              {badgeTitle}
            </span>
            <span className="font-label-sm text-[9px] uppercase font-bold tracking-tighter leading-none mt-0.5 text-black">
              {badgeSubtitle}
            </span>
          </div>
        </div>

        {/* Progress Meter with Pop-Art Segment Lines */}
        <div className="w-full bg-white dark:bg-[#0e0e0e] comic-border-2 rounded-full h-4 mt-2.5 overflow-hidden p-0.5 flex">
          <div
            className="bg-[#FFE600] border-r-2 border-black h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, percent)}%` }}
          />
        </div>

        {/* Day Overview Quick Badges */}
        <div className="flex items-center justify-between gap-1 bg-white dark:bg-[#0e0e0e] comic-border-2 rounded px-2 py-1 mt-2 text-[10px] font-label font-bold tracking-wide uppercase text-black dark:text-white">
          <span className="flex items-center gap-1">✨ NO CAP, YOUR SKIN WILL THANK YOU</span>
          <span className="bg-[#FFE600] text-black comic-border-2 px-1.5 py-0.5 rounded text-[9px] font-bold">
            LEVEL UP YOUR DRIP: 2L+ REACHED 💧
          </span>
        </div>

        {/* 3 Overview Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t-2 border-black dark:border-white/30 text-center font-label text-black dark:text-white">
          <div className="bg-white dark:bg-[#0e0e0e]/50 rounded comic-border-2 p-1.5 comic-shadow-sm">
            <span className="block text-black dark:text-[#c4c5d9] font-bold text-[9px]">DRINKS</span>
            <span className="font-headline text-[15px] text-black dark:text-white">
              {dayData.drinks.length} LOGS
            </span>
          </div>
          <div className="bg-white dark:bg-[#0e0e0e]/50 rounded comic-border-2 p-1.5 comic-shadow-sm">
            <span className="block text-black dark:text-[#c4c5d9] font-bold text-[9px]">FIRST SIP</span>
            <span className="font-headline text-[15px] text-black dark:text-white">
              {dayData.drinks.length > 0 ? dayData.drinks[0].time : '--:--'}
            </span>
          </div>
          <div className="bg-white dark:bg-[#0e0e0e]/50 rounded comic-border-2 p-1.5 comic-shadow-sm">
            <span className="block text-black dark:text-[#c4c5d9] font-bold text-[9px]">LAST SIP</span>
            <span className="font-headline text-[15px] text-black dark:text-white">
              {dayData.drinks.length > 0
                ? dayData.drinks[dayData.drinks.length - 1].time
                : '--:--'}
            </span>
          </div>
        </div>
      </div>

      {/* DETAILED INTAKE ACTIVITY TIMELINE */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1 mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="material-symbols-outlined text-black dark:text-[#e5e2e1] text-[22px] shrink-0 font-bold">
              receipt_long
            </span>
            <h3 className="font-headline text-[18px] uppercase text-black dark:text-[#e5e2e1] tracking-wide truncate">
              ACTIVITY LOGS
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-label-sm text-[10px] uppercase bg-[#FFE600] text-black px-2 py-0.5 rounded font-bold comic-border-2 shrink-0 tracking-wider whitespace-nowrap rotate-[-1.5deg] comic-shadow-sm">
              ⚡ VALID SIP LOGGED
            </span>
            <span className="font-label-sm text-[10px] uppercase bg-white dark:bg-[#1c1b1b] text-black dark:text-white px-2 py-0.5 rounded font-bold comic-border-2 shrink-0 tracking-wider whitespace-nowrap comic-shadow-sm">
              CHRONO VIEW
            </span>
          </div>
        </div>

        {/* LOG ENTRIES */}
        <div className="flex flex-col gap-2">
          {dayData.drinks.length === 0 ? (
            <div className="comic-border comic-shadow-sm bg-white dark:bg-[#1c1b1b] rounded-xl p-6 text-center flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-4xl text-black dark:text-white">
                water_drop
              </span>
              <p className="font-headline text-[16px] uppercase text-black dark:text-white">
                No entries logged for this date!
              </p>
              <p className="font-body-md text-[13px] text-black/70 dark:text-white/70">
                Tap the yellow button below to record past drinks.
              </p>
            </div>
          ) : (
            dayData.drinks.map((item) => (
              <div
                key={item.id}
                className="comic-border comic-shadow-sm bg-white dark:bg-[#1c1b1b] rounded-xl p-3 flex items-center justify-between gap-3 transition-transform active:translate-x-0.5 active:translate-y-0.5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-lg ${
                      item.bg || 'bg-[#00D2FF]'
                    } comic-border-2 comic-shadow-sm flex items-center justify-center shrink-0`}
                  >
                    <span
                      className={`material-symbols-outlined text-[24px] ${
                        item.iconColor || 'text-black'
                      } font-bold`}
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {item.icon || 'water_drop'}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-headline text-[16px] text-black dark:text-[#e5e2e1] leading-none">
                        {item.ml} ML
                      </span>
                      <span className="bg-[#FFE600] text-black font-label-sm text-[9px] px-1 py-0.2 rounded font-bold uppercase comic-border-2">
                        {item.tag || 'DRINK'}
                      </span>
                    </div>
                    <span className="font-title-md text-[14px] text-black dark:text-white truncate mt-0.5 font-bold">
                      {item.name}
                    </span>
                    <span className="font-label-sm text-[10px] text-black/70 dark:text-white/70 uppercase font-bold">
                      {item.time} • {item.sub || 'Hydration'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      const newAmount = prompt(
                        `Update volume (ML) for ${item.name}:`,
                        String(item.ml)
                      );
                      if (newAmount && !isNaN(Number(newAmount)) && Number(newAmount) > 0) {
                        editDrink(item.id, parseInt(newAmount, 10), selectedKey);
                      }
                    }}
                    className="w-8 h-8 rounded comic-border-2 bg-[#FAF6EE] dark:bg-[#2a2a2a] hover:bg-[#FFE600] hover:text-black flex items-center justify-center text-black dark:text-white"
                    title="Edit amount"
                    aria-label="Edit drink amount"
                  >
                    <span className="material-symbols-outlined text-[16px] font-bold">edit</span>
                  </button>
                  <button
                    onClick={() => deleteDrink(item.id, selectedKey)}
                    className="w-8 h-8 rounded comic-border-2 bg-[#FAF6EE] dark:bg-[#2a2a2a] hover:bg-[#ba1a1a] hover:text-white flex items-center justify-center text-black dark:text-white"
                    title="Delete entry"
                    aria-label="Delete drink entry"
                  >
                    <span className="material-symbols-outlined text-[16px] font-bold">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* STICKY RETRO ACTION BUTTON */}
      <div className="sticky bottom-2 w-full pt-1 z-30">
        <button
          onClick={() => {
            comicAudio.playPop();
            setShowLogModal(true);
          }}
          className="w-full h-14 bg-[#FFE600] hover:bg-[#fae100] text-black comic-border comic-shadow-md rounded-xl font-headline text-[18px] uppercase tracking-wide flex items-center justify-center gap-2 transition-transform active:translate-x-1 active:translate-y-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[28px] font-bold text-black">
            add_circle
          </span>
          + LOG PAST DRINK
        </button>
      </div>

      {/* RETRO COMIC MODAL: LOG PAST DRINK */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-[#1c1b1b] comic-border comic-shadow-md rounded-xl p-4 flex flex-col gap-3 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00677f] dark:text-[#7cf4ff] text-2xl font-bold">
                  local_drink
                </span>
                <h3 className="font-headline text-[18px] uppercase tracking-wide text-black dark:text-white">
                  QUICK LOG DRINK
                </h3>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="w-8 h-8 rounded comic-border-2 bg-[#FAF6EE] dark:bg-[#2a2a2a] hover:bg-[#ba1a1a] hover:text-white flex items-center justify-center font-bold text-black dark:text-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#FFE600] comic-border-2 rounded-lg p-2 text-center text-black flex items-center justify-center gap-1.5 shadow-sm">
              <span className="material-symbols-outlined text-[18px] text-black shrink-0 font-bold">
                psychology_alt
              </span>
              <span className="font-label-sm text-[10px] font-bold uppercase tracking-tight text-black">
                REALITY CHECK: THINKING ICED LATTE COUNTS AS WATER IS PURE DELULU! 🙅‍♂️
              </span>
            </div>

            <form onSubmit={handlePastSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-[11px] uppercase font-bold text-black dark:text-white">
                  DRINK TYPE
                </label>
                <select
                  value={modalDrinkType}
                  onChange={(e) => setModalDrinkType(e.target.value)}
                  className="w-full comic-border-2 rounded-lg p-2 font-label text-[13px] bg-white dark:bg-[#2a2a2a] font-bold text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D2FF]"
                >
                  <option value="Plain Water">💧 Plain Water</option>
                  <option value="Sparkling Water">🫧 Sparkling Water</option>
                  <option value="Electrolyte Hydration">⚡ Electrolyte Drink</option>
                  <option value="Green Tea">🍵 Green Tea</option>
                  <option value="Chamomile Tea">🌼 Chamomile Tea</option>
                  <option value="Cold Brew Coffee">☕ Iced Americano</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-[11px] uppercase font-bold text-black dark:text-white">
                  AMOUNT (ML)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[250, 350, 500, 750].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setModalAmount(amt)}
                      className={`comic-border-2 rounded-lg py-1.5 font-headline text-[16px] text-black ${
                        modalAmount === amt
                          ? 'bg-[#FFE600] font-bold'
                          : 'bg-white dark:bg-[#2a2a2a] dark:text-white hover:bg-[#FFE600]/50'
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={modalAmount}
                  onChange={(e) => setModalAmount(Number(e.target.value))}
                  className="w-full comic-border-2 rounded-lg p-2 text-center font-headline text-[20px] bg-white dark:bg-[#2a2a2a] text-black dark:text-white mt-1 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-[11px] uppercase font-bold text-black dark:text-white">
                  TIME
                </label>
                <input
                  type="time"
                  value={modalTime}
                  onChange={(e) => setModalTime(e.target.value)}
                  className="w-full comic-border-2 rounded-lg p-2 font-label text-[14px] bg-white dark:bg-[#2a2a2a] text-black dark:text-white font-bold text-center focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[#FFE600] hover:bg-[#fae100] text-black comic-border comic-shadow-sm rounded-lg font-headline text-[16px] uppercase tracking-wide flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                <span className="material-symbols-outlined font-bold text-black">bolt</span>
                LET HIM COOK ⚡ LOG TO ARCHIVE
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
