import React from 'react';
import { useHydration } from '../context/HydrationContext';

const screenTitles: Record<string, string> = {
  'daily-hydration': 'Daily Hydration',
  'hydration-history': 'Hydration History',
  'hydration-insights': 'Hydration Insights',
  'profile-settings': 'Profile Settings',
};

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, setShowAuthModal, setAuthViewMode } = useHydration();

  const handleProfileClick = () => {
    setActiveTab('profile-settings');
  };

  const handleLogoClick = () => {
    setActiveTab('daily-hydration');
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#FDFBF7]/95 dark:bg-[#131313]/90 backdrop-blur-xl border-b-2 border-black dark:border-[#434656] transition-colors">
      <div className="h-20 px-4 flex items-center justify-between gap-2 max-w-lg mx-auto w-full">
        <div
          className="flex items-center gap-2 cursor-pointer select-none active:translate-x-0.5 active:translate-y-0.5 transition-transform"
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
          aria-label="Home"
        >
          <img
            alt="CHUG! Logo"
            className="w-10 h-10 object-contain rounded-lg border-2 border-black dark:border-black shadow-[2px_2px_0px_#000000] bg-white p-0.5 shrink-0"
            src="https://lh3.googleusercontent.com/aida/AEtjO1WdXx0gNN27FFqh1_U284EkOV7xkWOSTuPKrjLIIySA3_uziKHcFxts38qKpWxypR3FFrj31cyewc0171JqggQw5sJxerpazIGARSOFmbL_4YL8MOkMdTO3UDkPWzQCZP2BoMnWXJlONwXSSmbvoZLReN-yvFH4wATZ_ANJ5v_PEmbYVVkygZIs-agrFpX1DFellyo9-qex8yrx3wbWFbP5bSP3kRo_rhg1avzIVI2MCILd9RE-heLZ6K53"
          />
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5 -mb-0.5">
              <span className="font-headline-sm text-[20px] font-headline uppercase text-black dark:text-[#e5e2e1] tracking-wide leading-none">
                CHUG!
              </span>
              <span className="comic-border-2 comic-shadow-sm bg-[#FFE600] text-black font-label-sm text-[10px] px-1 py-0.5 rounded uppercase rotate-[-2deg] font-bold leading-none inline-flex items-center shrink-0">
                MODE: ON
              </span>
            </div>
            <span className="font-label-sm text-[11px] uppercase text-[#00677f] dark:text-[#7cf4ff] tracking-wider leading-none font-bold block mt-1">
              {screenTitles[activeTab] || 'Daily Hydration'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Demo Auth / Onboarding button */}
          <button
            onClick={() => {
              setAuthViewMode('landing');
              setShowAuthModal(true);
            }}
            className="hidden sm:inline-flex items-center gap-1 bg-[#FFE600] text-black font-bold font-label-sm text-[10px] uppercase px-2 py-1 rounded comic-border-2 comic-shadow-sm active:translate-x-0.5 active:translate-y-0.5"
            title="Open Onboarding Mission & Auth"
          >
            <span>⚡ ONBOARDING</span>
          </button>

          <button
            onClick={handleProfileClick}
            className="w-10 h-10 comic-border-2 rounded-full overflow-hidden comic-shadow-sm bg-white cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-transform"
            aria-label="View Profile"
          >
            <img
              alt="Alex Rivera Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-ua20YpWxt4HgkugZCskywBEdRyqErMEirHxAdwGToPk5hSsDvoT6s8L_jaxQ1aGed7vRHm6bv5oUlvinXEl-pE0XpYafAJTJh7xjrDNNlgfYn1LVSTA4WqomIUkaerDHBKuI07CS7Bi7jBWTy2YP9nhfTtYYvVYXF8vzC_1JAQ3q_JHtahqBQmWH7UAnhsw5XpSUFnGsLWJJPLCyE68s9ZcJpORZax1-qLjes89C7956L3x8U1bxcw"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
