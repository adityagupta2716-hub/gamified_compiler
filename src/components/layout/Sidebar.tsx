import React from 'react';
import {
  Home,
  LayoutDashboard,
  Terminal,
  Trophy,
  Swords,
  BookOpen,
  BarChart3,
  User,
  ExternalLink,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const { state } = useGame();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, badge: null },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'compiler', label: 'Compiler IDE', icon: Terminal, badge: 'Core' },
    { id: 'challenges', label: 'Challenges', icon: Trophy, badge: `${state.completedChallenges.length}/10` },
    { id: 'boss', label: 'Boss Battle', icon: Swords, badge: state.bossDefeated ? 'Cleared' : 'Active' },
    { id: 'learn', label: 'Learn', icon: BookOpen, badge: 'Syllabus' },
    { id: 'leaderboard', label: 'Leaderboard', icon: BarChart3, badge: null },
    { id: 'profile', label: 'Profile', icon: User, badge: null },
  ];

  return (
    <aside className="fixed bottom-0 left-0 z-30 flex w-full border-t border-zinc-800 bg-black/95 backdrop-blur-lg md:top-16 md:bottom-0 md:w-64 md:flex-col md:border-r md:border-t-0 md:p-4">
      {/* Navigation List */}
      <div className="flex w-full items-center justify-around py-2 md:flex-col md:items-stretch md:justify-start md:space-y-1.5 md:py-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 font-semibold shadow-sm'
                  : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive ? 'text-zinc-100' : 'text-zinc-500 group-hover:text-zinc-200'
                  }`}
                />
                <span className="hidden md:inline">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`hidden md:inline rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                    isActive
                      ? 'bg-zinc-700 text-zinc-200 border border-zinc-600'
                      : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Compiler Specs Card at bottom of sidebar on desktop */}
      <div className="hidden md:flex flex-col mt-auto pt-6 border-t border-zinc-800">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3.5 text-left">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-200">
            <span>Compiler Pipeline</span>
            <span className="text-[10px] text-emerald-400 font-mono">6/6 Online</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            Pure in-browser execution with TAC intermediate code and multi-pass optimizer.
          </p>
          <button
            onClick={() => setActivePage('compiler')}
            className="mt-3 flex w-full items-center justify-center space-x-1.5 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 hover:text-white py-1.5 text-[11px] font-medium text-zinc-300 transition-colors"
          >
            <span>Open Playground</span>
            <ExternalLink className="h-3 w-3 text-zinc-400" />
          </button>
        </div>
      </div>
    </aside>
  );
};
