/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HydrationProvider, useHydration } from './context/HydrationContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { InsightsScreen } from './screens/InsightsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AuthModal } from './components/AuthModal';

const AppContent: React.FC = () => {
  const { activeTab, preferences } = useHydration();

  const isDark = preferences.visualTheme === 'midnight_ink';

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'dark bg-[#131313] text-[#e5e2e1]' : 'bg-[#FDFBF7] text-black'} transition-colors duration-200`}>
      {/* Top Sticky Header */}
      <Header />

      {/* Main Screen Content */}
      <main className="flex-1 w-full pt-24 pb-28 px-4 flex flex-col items-center">
        {activeTab === 'daily-hydration' && <HomeScreen />}
        {activeTab === 'hydration-history' && <HistoryScreen />}
        {activeTab === 'hydration-insights' && <InsightsScreen />}
        {activeTab === 'profile-settings' && <ProfileScreen />}
      </main>

      {/* Auth & Onboarding Modal */}
      <AuthModal />

      {/* Fixed Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <HydrationProvider>
      <AppContent />
    </HydrationProvider>
  );
}
