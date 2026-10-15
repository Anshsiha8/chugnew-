import React from 'react';
import { useHydration } from '../context/HydrationContext';
import { ScreenTab } from '../types';
import { comicAudio } from '../utils/audio';

interface NavItem {
  id: ScreenTab;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'daily-hydration', label: 'Home', icon: 'water_drop' },
  { id: 'hydration-history', label: 'History', icon: 'calendar_month' },
  { id: 'hydration-insights', label: 'Insights', icon: 'bar_chart' },
  { id: 'profile-settings', label: 'Profile', icon: 'manage_accounts' },
];

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useHydration();

  const handleTabChange = (tab: ScreenTab) => {
    comicAudio.playPop();
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-[#FDFBF7]/95 dark:bg-[#131313]/90 backdrop-blur-xl border-t-2 border-black dark:border-[#434656] transition-colors">
      <div className="flex justify-around items-center h-20 px-3 gap-2 max-w-lg mx-auto w-full">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex-1 flex flex-col items-center justify-center min-h-[46px] py-1.5 rounded-lg transition-transform active:translate-x-0.5 active:translate-y-0.5 comic-border-2 comic-shadow-sm font-bold select-none cursor-pointer ${
                isActive
                  ? 'bg-[#FFE600] text-black ring-2 ring-black dark:ring-white scale-102'
                  : 'bg-white dark:bg-[#0e0e0e] text-black dark:text-[#e5e2e1] hover:bg-[#FFE600]/30'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className="material-symbols-outlined text-[24px] leading-none"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="font-label-sm text-[11px] uppercase leading-none mt-1 font-bold">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
