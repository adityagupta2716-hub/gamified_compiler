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
    <aside className="fixed bottom-0 left-0 z-30 flex w-full border-t border-slate-800/80 bg-[#070914]/95 backdrop-blur-lg md:top-16 md:bottom-0 md:w-64 md:flex-col md:border-r md:border-t-0 md:p-4">
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
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_-3px_rgba(0,240,255,0.2)]'
                  : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="hidden md:inline">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`hidden md:inline rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-slate-800 text-slate-400'
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
      <div className="hidden md:flex flex-col mt-auto pt-6 border-t border-slate-800/80">
        <div className="rounded-xl border border-purple-500/20 bg-gradient-to-b from-purple-950/20 to-slate-950/40 p-3.5 text-left">
          <div className="flex items-center justify-between text-xs font-bold text-purple-300">
            <span>Compiler Pipeline</span>
            <span className="text-[10px] text-emerald-400">Online</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            6/6 Live in-browser phases active with TAC and peephole optimizer.
          </p>
          <button
            onClick={() => setActivePage('compiler')}
            className="mt-3 flex w-full items-center justify-center space-x-1.5 rounded-lg border border-purple-500/30 bg-purple-900/30 py-1.5 text-[11px] font-semibold text-purple-200 hover:bg-purple-800/40 transition-colors"
          >
            <span>Open Playground</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};
