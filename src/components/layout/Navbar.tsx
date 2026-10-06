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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-black/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div
          onClick={() => setActivePage('home')}
          className="flex cursor-pointer items-center space-x-3 transition-transform hover:scale-[1.02]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 border border-zinc-700 shadow-sm">
            <Terminal className="h-5 w-5 text-zinc-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tight text-white">
                COMPILER <span className="text-zinc-400">QUEST</span>
              </span>
              <span className="rounded-md border border-zinc-700 bg-zinc-900 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-zinc-400">
                B.TECH
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono">Interactive Educational Compiler</p>
          </div>
        </div>

        {/* Center / Gamification Bar */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Level & XP Capsule */}
          <div className="flex items-center space-x-3 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-1.5 shadow-sm">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-zinc-300">
              <Shield className="h-4 w-4" />
              <span>LVL {state.level}</span>
            </div>
            <div className="h-3 w-px bg-zinc-700" />
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-300">
                <span>{currentLevelInfo.title}</span>
                <span className="ml-2 text-zinc-400">{state.xp} XP</span>
              </div>
              <div className="mt-1 h-1.5 w-32 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-zinc-400 transition-all duration-500"
                  style={{ width: `${xpProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Streak Indicator */}
          <div className="flex items-center space-x-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-semibold text-zinc-300">
            <Flame className="h-4 w-4 text-zinc-400" />
            <span>{state.currentStreak} Streak</span>
          </div>

          {/* Badges Count */}
          <div
            onClick={() => setActivePage('profile')}
            className="flex cursor-pointer items-center space-x-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-semibold text-zinc-300 hover:border-zinc-600 hover:text-white transition-colors"
          >
            <Award className="h-4 w-4 text-zinc-400" />
            <span>{state.unlockedBadgeIds.length} Badges</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2.5">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={state.soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-colors"
          >
            {state.soundEnabled ? <Volume2 className="h-4 w-4 text-zinc-300" /> : <VolumeX className="h-4 w-4 text-zinc-600" />}
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => setActivePage('compiler')}
            className="hidden sm:inline-flex items-center space-x-2 rounded-xl bg-zinc-100 hover:bg-white active:bg-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-950 shadow-sm border border-zinc-200 transition-all hover:-translate-y-0.5"
          >
            <Terminal className="h-4 w-4" />
            <span>Launch IDE</span>
          </button>
        </div>
      </div>
    </header>
  );
};
