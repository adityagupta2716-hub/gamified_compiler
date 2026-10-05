import React, { useState } from 'react';
import { GameProvider } from './context/GameContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { CompilerIDE } from './components/compiler/CompilerIDE';
import { ChallengesPage } from './components/challenges/ChallengesPage';
import { BossBattle } from './components/challenges/BossBattle';
import { LearningPage } from './components/learn/LearningPage';
import { LeaderboardPage } from './components/leaderboard/LeaderboardPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { ToastContainer } from './components/common/ToastContainer';
import { LevelUpModal } from './components/gamification/LevelUpModal';
import { BadgeUnlockModal } from './components/gamification/BadgeUnlockModal';

export const AppContent: React.FC = () => {
  const [activePage, setActivePage] = useState<string>('home');
  const [injectedCode, setInjectedCode] = useState<string | undefined>(undefined);

  const handleTryCodeInIDE = (codeToTry: string) => {
    setInjectedCode(codeToTry);
    setActivePage('compiler');
  };

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-white">
      {/* Top Navbar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Container with Sidebar */}
      <div className="flex flex-1">
        {/* Persistent Sidebar */}
        <Sidebar activePage={activePage} setActivePage={setActivePage} />

        {/* Dynamic Page Content */}
        <main className="flex-1 pb-20 md:pb-6 md:pl-64 min-w-0 transition-all">
          {activePage === 'home' && (
            <LandingPage
              onStartQuest={() => setActivePage('dashboard')}
              onExploreCompiler={() => setActivePage('compiler')}
            />
          )}

          {activePage === 'dashboard' && (
            <Dashboard
              onContinueQuest={() => setActivePage('compiler')}
              onOpenChallenges={() => setActivePage('challenges')}
              onOpenBoss={() => setActivePage('boss')}
              onOpenLearn={() => setActivePage('learn')}
            />
          )}

          {activePage === 'compiler' && (
            <CompilerIDE key={injectedCode} initialCode={injectedCode} />
          )}

          {activePage === 'challenges' && <ChallengesPage />}

          {activePage === 'boss' && <BossBattle />}

          {activePage === 'learn' && (
            <LearningPage onTryCodeInIDE={handleTryCodeInIDE} />
          )}

          {activePage === 'leaderboard' && <LeaderboardPage />}

          {activePage === 'profile' && <ProfilePage />}
        </main>
      </div>

      {/* Footer */}
      <div className="md:pl-64">
        <Footer />
      </div>

      {/* Gamification Overlays */}
      <ToastContainer />
      <LevelUpModal />
      <BadgeUnlockModal />
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
