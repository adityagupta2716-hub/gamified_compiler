import React from 'react';
import { useGame } from '../../context/GameContext';
import { Flame, Volume2, VolumeX, Shield, Award, Terminal } from 'lucide-react';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {
  const { state, currentLevelInfo, nextLevelInfo, xpProgressPercent, toggleSound } = useGame();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-[#070a16]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div
          onClick={() => setActivePage('home')}
          className="flex cursor-pointer items-center space-x-3 transition-transform hover:scale-105"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20">
            <Terminal className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
                COMPILER QUEST
              </span>
              <span className="rounded-md border border-cyan-500/30 bg-cyan-950/60 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-cyan-300">
                B.TECH
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">Interactive Educational Compiler</p>
          </div>
        </div>

        {/* Center / Gamification Bar */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Level & XP Capsule */}
          <div className="flex items-center space-x-3 rounded-full border border-purple-500/30 bg-slate-900/80 px-4 py-1.5 shadow-inner">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-400">
              <Shield className="h-4 w-4" />
              <span>LVL {state.level}</span>
            </div>
            <div className="h-3 w-px bg-slate-700" />
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span>{currentLevelInfo.title}</span>
                <span className="ml-2 text-cyan-400">{state.xp} XP</span>
              </div>
              <div className="mt-1 h-1.5 w-32 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${xpProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Streak Indicator */}
          <div className="flex items-center space-x-1.5 rounded-full border border-amber-500/30 bg-amber-950/30 px-3 py-1 text-xs font-semibold text-amber-400">
            <Flame className="h-4 w-4 animate-pulse text-amber-400" />
            <span>{state.currentStreak} Streak</span>
          </div>

          {/* Badges Count */}
          <div
            onClick={() => setActivePage('profile')}
            className="flex cursor-pointer items-center space-x-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/30 px-3 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/40 transition-colors"
          >
            <Award className="h-4 w-4 text-cyan-400" />
            <span>{state.unlockedBadgeIds.length} Badges</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={state.soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-900/80 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-400 transition-colors"
          >
            {state.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-slate-500" />}
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => setActivePage('compiler')}
            className="hidden sm:inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:brightness-110 hover:shadow-cyan-500/40"
          >
            <Terminal className="h-4 w-4" />
            <span>Launch IDE</span>
          </button>
        </div>
      </div>
    </header>
  );
};
