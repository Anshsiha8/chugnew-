import React, { useState } from 'react';
import { useHydration } from '../context/HydrationContext';
import { comicAudio } from '../utils/audio';

export const InsightsScreen: React.FC = () => {
  const { showToast } = useHydration();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('month');

  const handleShareStats = () => {
    comicAudio.playPop();
    const statsText = `CHUG! Hydration Battle Log — High Water Mark: Thursday (2,850 ML) | 5-Day Streak | Hit Rate 86% | 26/30 Days Ate Down! Goal slayed. See you tomorrow, bestie!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(statsText);
    }
    showToast('⚡ BATTLE LOG COPIED TO CLIPBOARD!');
  };

  return (
    <div className="flex flex-col w-full gap-4 max-w-lg mx-auto select-none">
      {/* Interactive Filter Tabs */}
      <div className="flex items-center justify-between gap-1 bg-[#F5EFE6] dark:bg-[#201f1f] p-1.5 rounded-lg comic-shadow-sm comic-border">
        {(['week', 'month', 'all'] as const).map((tab) => {
          const isActive = timeframe === tab;
          const label = tab === 'week' ? 'Weekly' : tab === 'month' ? 'Monthly' : 'All-Time';
          return (
            <button
              key={tab}
              onClick={() => {
                comicAudio.playPop();
                setTimeframe(tab);
              }}
              className={`flex-1 py-1.5 px-2 rounded font-label text-[12px] uppercase transition-transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
                isActive
                  ? 'bg-[#FFE600] text-black comic-border-2 comic-shadow-sm font-bold'
                  : 'bg-white dark:bg-[#131313] text-black dark:text-[#c4c5d9] comic-border-2 hover:bg-[#FFE600]/30'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Hero Insight Banner with Comic Bubble */}
      <div className="relative bg-white dark:bg-[#1c1b1b] comic-border comic-shadow-md rounded-xl p-4 overflow-hidden">
        {/* Halftone Accent Dot Decor */}
        <div
          className="absolute -right-6 -bottom-6 w-28 h-28 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#000000 2px, transparent 2px)',
            backgroundSize: '8px 8px',
          }}
        />
        <div className="flex items-start gap-3 relative z-10">
          <div className="relative shrink-0">
            <div className="w-12 h-12 bg-[#FFE600] rounded-full comic-border-2 comic-shadow-sm flex items-center justify-center rotate-[-4deg]">
              <span
                className="material-symbols-outlined text-black text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
            </div>
            <div className="absolute -top-1 -right-1 bg-[#00D2FF] text-black font-label text-[9px] font-bold px-1.5 py-0.5 rounded-full comic-border-2">
              LVL 4
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="inline-block bg-[#00D2FF] text-black font-bold font-label-sm text-[10px] uppercase px-2 py-0.5 rounded comic-border-2 mb-1">
              VIBE CHECK #07
            </div>
            <h2 className="font-headline text-[17px] uppercase text-black dark:text-[#e5e2e1] leading-tight">
              LEVEL UP YOUR DRIP: 2L GOAL REACHED
            </h2>
            <p className="font-body-md text-[13px] text-black dark:text-[#c4c5d9] mt-0.5 leading-snug">
              Glowing with hydrated main character energy!{' '}
              <span className="font-title-md text-[#2455FF] dark:text-[#7cf4ff] underline decoration-2 font-bold">
                You ate that and left zero crumbs
              </span>{' '}
              in Sector 4. Keep cooking!
            </p>
          </div>
        </div>
      </div>

      {/* Top KPI Bento Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Weekly Avg Card (Cobalt Primary) */}
        <div className="col-span-2 relative bg-[#2455FF] text-white comic-border comic-shadow-md rounded-xl p-4 overflow-hidden">
          <div className="absolute right-2 top-2 opacity-20 pointer-events-none text-white">
            <span className="material-symbols-outlined text-[80px]">water_full</span>
          </div>
          <div className="flex justify-between items-start relative z-10">
            <div className="flex flex-col">
              <span className="font-label-sm text-[10px] uppercase tracking-wider text-black dark:text-white bg-white dark:bg-[#0e0e0e] px-2 py-0.5 rounded comic-border-2 inline-block w-fit mb-1 font-bold">
                3 SIPS AWAY FROM YOUR GOAL. LET HIM COOK ⚡
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline text-[44px] uppercase tracking-tight text-white leading-none drop-shadow-[2px_2px_0px_#000000]">
                  2,420
                </span>
                <span className="font-headline text-[20px] uppercase text-[#FFE600] drop-shadow-[1px_1px_0px_#000000]">
                  ML/DAY
                </span>
              </div>
            </div>
            {/* Target Badge */}
            <div className="bg-[#FFE600] text-black comic-border-2 comic-shadow-sm px-2.5 py-1 rounded text-center rotate-2 shrink-0">
              <span className="font-label-sm text-[10px] block uppercase leading-none font-bold">
                TARGET
              </span>
              <span className="font-headline text-[16px] leading-none font-bold">97%</span>
            </div>
          </div>
          {/* Mini Progress Track */}
          <div className="w-full bg-white dark:bg-[#0e0e0e] h-4 rounded-full comic-border-2 mt-3 overflow-hidden flex relative z-10 p-0.5">
            <div
              className="bg-[#FFE600] h-full transition-all duration-500 rounded-full border-r-2 border-black"
              style={{ width: '97%' }}
            />
          </div>
        </div>

        {/* Streak Metric */}
        <div className="relative bg-white dark:bg-[#1c1b1b] comic-border comic-shadow-md rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase text-black dark:text-[#c4c5d9] font-bold">
              Streak
            </span>
            <span
              className="material-symbols-outlined text-[#FFE600] text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1", WebkitTextStroke: '1px black' }}
            >
              local_fire_department
            </span>
          </div>
          <div className="my-1">
            <span className="font-headline text-[28px] text-black dark:text-white leading-none block">
              5 DAYS
            </span>
          </div>
          <div className="bg-[#FFE600] text-black font-label-sm text-[10px] uppercase comic-border-2 px-1.5 py-0.5 rounded-sm inline-block self-start rotate-[-3deg] comic-shadow-sm font-bold">
            UNSTOPPABLE!
          </div>
        </div>

        {/* Completion Rate Metric */}
        <div className="relative bg-white dark:bg-[#1c1b1b] comic-border comic-shadow-md rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[11px] uppercase text-black dark:text-[#c4c5d9] font-bold">
              Hit Rate
            </span>
            <span className="material-symbols-outlined text-[#2455FF] dark:text-[#7cf4ff] text-[22px]">
              verified
            </span>
          </div>
          <div className="my-1">
            <span className="font-headline text-[28px] text-[#2455FF] dark:text-[#7cf4ff] leading-none block">
              86%
            </span>
          </div>
          <div className="bg-[#00D2FF] text-black font-label-sm text-[10px] uppercase comic-border-2 px-1.5 py-0.5 rounded-sm inline-block self-start rotate-[2deg] comic-shadow-sm font-bold">
            GOAL SLAYED FR
          </div>
        </div>

        {/* Best Record Card */}
        <div className="col-span-2 bg-[#F5EFE6] dark:bg-[#201f1f] comic-border comic-shadow-sm rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFE600] rounded comic-border-2 comic-shadow-sm flex items-center justify-center rotate-[-2deg] shrink-0">
              <span className="material-symbols-outlined text-black text-[24px]">emoji_events</span>
            </div>
            <div>
              <span className="font-label-sm text-[10px] uppercase text-black/70 dark:text-white/70 font-bold block leading-tight">
                High Water Mark
              </span>
              <span className="font-title-md text-[14px] text-black dark:text-white uppercase font-bold">
                Thursday (2,850 ML)
              </span>
            </div>
          </div>
          <span className="font-label-sm text-[10px] font-bold bg-[#FFE600] text-black px-2 py-1 rounded comic-border-2 uppercase whitespace-nowrap">
            GOAT SIPPER
          </span>
        </div>
      </div>

      {/* Weekly Intake Pop-Art Bar Chart */}
      <div className="bg-white dark:bg-[#1c1b1b] comic-border comic-shadow-md rounded-xl p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col gap-1">
            <div className="bg-[#FFE600] text-black font-bold font-label-sm text-[10px] px-2 py-0.5 rounded comic-border-2 inline-block w-fit uppercase mb-0.5">
              VALID SIP FREQUENCY
            </div>
            <h3 className="font-headline text-[18px] uppercase text-black dark:text-white leading-tight">
              WEEKLY BATTLE LOG
            </h3>
          </div>
          <span className="font-label-sm text-[11px] font-bold uppercase text-black bg-[#F5EFE6] dark:bg-[#2a2a2a] dark:text-white px-2 py-1 rounded comic-border-2 whitespace-nowrap shrink-0">
            OCT 14 - 20
          </span>
        </div>

        {/* Chart Panel */}
        <div className="relative w-full h-56 pt-7 pb-2 flex items-end justify-between px-1 bg-[#F5EFE6] dark:bg-[#131313] rounded-lg comic-border-2">
          {/* Goal line indicator */}
          <div className="absolute inset-x-0 top-14 border-b-2 border-dashed border-black/30 dark:border-white/30 pointer-events-none flex justify-end pr-2">
            <span className="font-label-sm text-[9px] font-bold text-black bg-white px-1 rounded comic-border-2">
              2,500 ML GOAL
            </span>
          </div>

          {/* Monday (2,500 ML) */}
          <div className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer z-10">
            <div
              className="relative w-7 sm:w-8 bg-[#FFE600] comic-border-2 comic-shadow-sm rounded-t-sm transition-transform active:scale-95"
              style={{ height: '66%' }}
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white text-black font-label text-[10px] px-1 rounded-full comic-border-2 font-bold">
                ★
              </div>
              <div
                className="w-full h-full opacity-15"
                style={{
                  backgroundImage: 'radial-gradient(#000000 1.5px, transparent 1.5px)',
                  backgroundSize: '4px 4px',
                }}
              />
            </div>
            <span className="font-label-sm text-[11px] uppercase mt-1 text-black dark:text-white font-bold">
              MON
            </span>
          </div>

          {/* Tuesday (2,200 ML) */}
          <div className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer z-10">
            <div
              className="relative w-7 sm:w-8 bg-[#00D2FF] comic-border-2 comic-shadow-sm rounded-t-sm transition-transform active:scale-95"
              style={{ height: '58%' }}
            >
              <div
                className="w-full h-full opacity-15"
                style={{
                  backgroundImage: 'radial-gradient(#000000 1.5px, transparent 1.5px)',
                  backgroundSize: '4px 4px',
                }}
              />
            </div>
            <span className="font-label-sm text-[11px] uppercase mt-1 text-black dark:text-white font-bold">
              TUE
            </span>
          </div>

          {/* Wednesday (2,750 ML) */}
          <div className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer z-10">
            <div
              className="relative w-7 sm:w-8 bg-[#2455FF] comic-border-2 comic-shadow-sm rounded-t-sm transition-transform active:scale-95"
              style={{ height: '74%' }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#FFE600] text-black font-label text-[10px] px-1.5 py-0.5 rounded comic-border-2 rotate-[-4deg] whitespace-nowrap font-bold">
                POW!
              </div>
              <div
                className="w-full h-full opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)',
                  backgroundSize: '4px 4px',
                }}
              />
            </div>
            <span className="font-label-sm text-[11px] uppercase mt-1 text-black dark:text-white font-bold">
              WED
            </span>
          </div>

          {/* Thursday (2,850 ML - Record High) */}
          <div className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer z-10">
            <div
              className="relative w-7 sm:w-8 bg-[#FFE600] comic-border-2 comic-shadow-sm rounded-t-sm transition-transform active:scale-95"
              style={{ height: '78%' }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-[#FFE600] font-label text-[10px] px-1.5 py-0.5 rounded comic-border-2 rotate-6 whitespace-nowrap font-bold">
                MAX
              </div>
              <div
                className="w-full h-full opacity-15"
                style={{
                  backgroundImage: 'radial-gradient(#000000 1.5px, transparent 1.5px)',
                  backgroundSize: '4px 4px',
                }}
              />
            </div>
            <span className="font-label-sm text-[11px] uppercase mt-1 text-black dark:text-white font-bold underline decoration-2">
              THU
            </span>
          </div>

          {/* Friday (2,400 ML) */}
          <div className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer z-10">
            <div
              className="relative w-7 sm:w-8 bg-[#00D2FF] comic-border-2 comic-shadow-sm rounded-t-sm transition-transform active:scale-95"
              style={{ height: '63%' }}
            >
              <div
                className="w-full h-full opacity-15"
                style={{
                  backgroundImage: 'radial-gradient(#000000 1.5px, transparent 1.5px)',
                  backgroundSize: '4px 4px',
                }}
              />
            </div>
            <span className="font-label-sm text-[11px] uppercase mt-1 text-black dark:text-white font-bold">
              FRI
            </span>
          </div>

          {/* Saturday (2,100 ML) */}
          <div className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer z-10">
            <div
              className="relative w-7 sm:w-8 bg-[#FFE600] comic-border-2 comic-shadow-sm rounded-t-sm transition-transform active:scale-95"
              style={{ height: '55%' }}
            >
              <div
                className="w-full h-full opacity-15"
                style={{
                  backgroundImage: 'radial-gradient(#000000 1.5px, transparent 1.5px)',
                  backgroundSize: '4px 4px',
                }}
              />
            </div>
            <span className="font-label-sm text-[11px] uppercase mt-1 text-black dark:text-white font-bold">
              SAT
            </span>
          </div>

          {/* Sunday (1,450 ML - In Progress) */}
          <div className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer z-10">
            <div
              className="relative w-7 sm:w-8 bg-white dark:bg-[#201f1f] comic-border-2 comic-shadow-sm rounded-t-sm overflow-hidden"
              style={{ height: '38%' }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0, 0, 0, 0.15) 4px, rgba(0, 0, 0, 0.15) 8px)',
                }}
              />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#FFE600] text-black font-bold font-label text-[9px] px-1 py-0.5 rounded comic-border-2 whitespace-nowrap z-50">
                DRIED SPONGE
              </div>
            </div>
            <span className="font-label-sm text-[11px] uppercase mt-1 text-[#2455FF] dark:text-[#7cf4ff] font-bold">
              SUN
            </span>
          </div>
        </div>

        {/* Chart Legend */}
        <div className="flex items-center justify-around border-t-2 border-black/15 dark:border-white/15 pt-2 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 bg-[#FFE600] comic-border-2" />
            <span className="font-label-sm text-[11px] uppercase text-black dark:text-white font-bold">
              Crushed (2.5k+)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 bg-[#00D2FF] comic-border-2" />
            <span className="font-label-sm text-[11px] uppercase text-black dark:text-white font-bold">
              Solid (&gt;2k)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 bg-white dark:bg-[#201f1f] comic-border-2" />
            <span className="font-label-sm text-[11px] uppercase text-black dark:text-white font-bold">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* 30-Day Hydration Consistency Stamp Sheet Heatmap */}
      <div className="bg-white dark:bg-[#1c1b1b] comic-border comic-shadow-md rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col gap-1">
            <div className="bg-[#2455FF] text-white font-bold font-label-sm text-[10px] px-2 py-0.5 rounded comic-border-2 inline-block w-fit uppercase mb-0.5">
              HABIT MATRIX
            </div>
            <h3 className="font-headline text-[18px] uppercase text-black dark:text-white leading-tight">
              30-DAY STAMP SHEET
            </h3>
          </div>
          <div className="font-label-sm text-[11px] uppercase text-black font-bold bg-[#FFE600] px-2 py-1 rounded comic-border-2 whitespace-nowrap shrink-0">
            26 / 30 ATE DOWN 🔥
          </div>
        </div>

        {/* 7-Column Stamp Matrix */}
        <div className="grid grid-cols-7 gap-1.5 p-2 bg-[#F5EFE6] dark:bg-[#131313] rounded-lg comic-border">
          {[
            '✓', '✓', '3', '✓', '✓', '6', '7',
            '✓', '✓', '✓', '11', '✓', '✓', '14',
            '15', '✓', '✓', '✓', '✓', '20', '✓',
            '✓', '23', '✓', '✓', '✓', '✓', '28',
            '✓', '★'
          ].map((val, idx) => {
            let cellBg = 'bg-[#FFE600] text-black font-bold comic-shadow-sm';
            if (val === '3' || val === '11' || val === '20') {
              cellBg = 'bg-[#2455FF] text-white font-bold comic-shadow-sm';
            } else if (val === '6' || val === '14' || val === '23') {
              cellBg = 'bg-[#00D2FF] text-black font-bold comic-shadow-sm';
            } else if (val === '7' || val === '15' || val === '28') {
              cellBg = 'bg-white dark:bg-[#201f1f] text-black dark:text-white';
            }

            return (
              <div
                key={idx}
                className={`aspect-square comic-border-2 rounded flex items-center justify-center font-label text-[11px] font-bold ${cellBg}`}
              >
                {val}
              </div>
            );
          })}
          {/* Empty spacer blocks for complete grid */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="aspect-square bg-white/60 dark:bg-white/10 comic-border-2 rounded opacity-40"
            />
          ))}
        </div>

        {/* Tiers Legend */}
        <div className="grid grid-cols-4 gap-1 mt-3 pt-2 border-t-2 border-black/15 dark:border-white/15 text-center">
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 bg-white dark:bg-[#201f1f] comic-border-2 mb-1" />
            <span className="font-label-sm text-[10px] text-black dark:text-[#c4c5d9] font-bold">
              &lt;1K ML
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 bg-[#00D2FF] comic-border-2 mb-1" />
            <span className="font-label-sm text-[10px] text-black dark:text-[#c4c5d9] font-bold">
              1K-2K
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 bg-[#2455FF] comic-border-2 mb-1" />
            <span className="font-label-sm text-[10px] text-black dark:text-[#c4c5d9] font-bold">
              2K-2.5K
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 bg-[#FFE600] comic-border-2 mb-1 flex items-center justify-center text-[9px] font-bold text-black">
              ✓
            </div>
            <span className="font-label-sm text-[10px] text-black dark:text-[#c4c5d9] font-bold">
              2.5K+ CRUSH
            </span>
          </div>
        </div>
      </div>

      {/* Beverage Breakdown & Hydration Quality */}
      <div className="bg-white dark:bg-[#1c1b1b] comic-border comic-shadow-md rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="bg-[#FFE600] text-black font-bold font-label-sm text-[10px] px-2 py-0.5 rounded comic-border-2 inline-block uppercase mb-0.5">
              FLUID PURITY
            </div>
            <h3 className="font-headline text-[18px] uppercase text-black dark:text-white leading-tight">
              BEVERAGE SPLIT
            </h3>
          </div>
          <span className="material-symbols-outlined text-[#2455FF] dark:text-[#7cf4ff] text-[28px]">
            local_bar
          </span>
        </div>

        {/* Stacked Visual Bar */}
        <div className="flex flex-col gap-3">
          <div className="w-full h-8 comic-border-2 rounded flex overflow-hidden comic-shadow-sm">
            <div
              className="bg-[#2455FF] flex items-center justify-center text-white font-label text-[11px] font-bold border-r-2 border-black"
              style={{ width: '75%' }}
            >
              75%
            </div>
            <div
              className="bg-[#00D2FF] flex items-center justify-center text-black font-label text-[11px] font-bold border-r-2 border-black"
              style={{ width: '15%' }}
            >
              15%
            </div>
            <div
              className="bg-[#ff4d8d] flex items-center justify-center text-white font-label text-[11px] font-bold"
              style={{ width: '10%' }}
            >
              10%
            </div>
          </div>

          {/* Segment Labels */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-1.5 bg-[#F5EFE6] dark:bg-[#201f1f] rounded comic-border-2">
              <span className="font-label-sm text-[10px] uppercase block text-[#2455FF] dark:text-[#7cf4ff] font-bold">
                PURE WATER
              </span>
              <span className="font-title-md text-[13px] text-black dark:text-white leading-none font-bold">
                1,815 ML
              </span>
            </div>
            <div className="p-1.5 bg-[#F5EFE6] dark:bg-[#201f1f] rounded comic-border-2">
              <span className="font-label-sm text-[10px] uppercase block text-black dark:text-[#c4c5d9] font-bold">
                TEAS / HERBAL
              </span>
              <span className="font-title-md text-[13px] text-black dark:text-white leading-none font-bold">
                365 ML
              </span>
            </div>
            <div className="p-1.5 bg-[#F5EFE6] dark:bg-[#201f1f] rounded comic-border-2">
              <span className="font-label-sm text-[10px] uppercase block text-[#ba1a1a] dark:text-[#ffb4ab] font-bold">
                ELECTROLYTES
              </span>
              <span className="font-title-md text-[13px] text-black dark:text-white leading-none font-bold">
                240 ML
              </span>
            </div>
          </div>
        </div>

        {/* Comic Speech Bubble Tactical Tip */}
        <div className="relative mt-4 pt-2">
          <div className="absolute top-0 left-6 -translate-y-full w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-black" />
          <div className="bg-[#FFE600] comic-border-2 comic-shadow-sm rounded-lg p-3 text-black">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[20px] text-black shrink-0 mt-0.5">
                tips_and_updates
              </span>
              <div className="flex flex-col gap-1">
                <p className="font-label-sm text-[11px] uppercase leading-snug font-bold text-black">
                  DELULU CHECK: THINKING ICED LATTE COUNTS AS WATER IS PURE DELULU.
                </p>
                <p className="font-label-sm text-[11px] uppercase leading-snug font-bold text-black">
                  THAT 3:00 PM ICE-COLD WATER HITS BUSSIN' FR! STAY HYDRATED, BESTIE.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Stats Action Card */}
      <div className="bg-[#F5EFE6] dark:bg-[#201f1f] comic-border comic-shadow-md rounded-xl p-4 flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="font-headline text-[18px] uppercase text-black dark:text-white leading-tight">
            FLEX YOUR STATS!
          </span>
          <span className="font-body-md text-[13px] text-[#2455FF] dark:text-[#7cf4ff] font-bold">
            Goal slayed. See you tomorrow, bestie.
          </span>
        </div>
        <button
          onClick={handleShareStats}
          className="shrink-0 px-4 py-2.5 bg-[#FFE600] text-black font-headline text-[16px] uppercase comic-border-2 comic-shadow-sm rounded transition-transform active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1 font-bold cursor-pointer hover:bg-[#fae100]"
        >
          <span className="material-symbols-outlined text-[20px]">share</span>
          <span>SHARE</span>
        </button>
      </div>
    </div>
  );
};
