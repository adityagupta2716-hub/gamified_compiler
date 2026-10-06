import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { ALL_BADGES } from '../../types/game';
import {
  User,
  Shield,
  Zap,
  Award,
  Trophy,
  CheckCircle2,
  RotateCcw,
  Edit2,
  Check,
  Search,
  Network,
  FolderTree,
  ShieldCheck,
  Terminal,
  Cpu,
  Crown,
  Flame,
  BookOpen,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    state,
    currentLevelInfo,
    nextLevelInfo,
    xpProgressPercent,
    setUsername,
    resetProgress,
  } = useGame();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(state.username);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setUsername(nameInput.trim());
    }
    setIsEditingName(false);
  };

  const renderBadgeIcon = (iconName: string) => {
    const props = { className: 'h-6 w-6' };
    switch (iconName) {
      case 'Search':
        return <Search {...props} />;
      case 'Network':
        return <Network {...props} />;
      case 'FolderTree':
        return <FolderTree {...props} />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} />;
      case 'Terminal':
        return <Terminal {...props} />;
      case 'Zap':
        return <Zap {...props} />;
      case 'Cpu':
        return <Cpu {...props} />;
      case 'Crown':
        return <Crown {...props} />;
      case 'Flame':
        return <Flame {...props} />;
      case 'BookOpen':
        return <BookOpen {...props} />;
      default:
        return <Award {...props} />;
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Profile Header Card */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 border border-zinc-700 text-3xl shadow-sm">
              🧑‍💻
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                {isEditingName ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-1 text-sm font-bold text-white focus:outline-none focus:border-zinc-400"
                    />
                    <button
                      onClick={handleSaveName}
                      className="rounded-lg bg-zinc-100 p-1 text-zinc-950 hover:bg-white"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white">{state.username}</h2>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-zinc-500 hover:text-white"
                      title="Edit Username"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="text-zinc-400 font-bold">Level {state.level}: {currentLevelInfo.title}</span>
                <span className="text-zinc-700">•</span>
                <span className="text-zinc-300">{state.xp} Total XP</span>
              </div>
            </div>
          </div>

          {/* Quick Rank Badge */}
          <div className="flex items-center space-x-3 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2.5">
            <Shield className="h-6 w-6 text-zinc-400" />
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-zinc-500">Standing</div>
              <div className="text-xs font-bold text-white">B.Tech Compiler Student</div>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-zinc-800">
          <div className="flex justify-between text-xs font-mono text-zinc-300">
            <span>Progress to Next Rank</span>
            <span>{xpProgressPercent}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-800 shadow-inner">
            <div
              className="h-full rounded-full bg-zinc-400 transition-all duration-500"
              style={{ width: `${xpProgressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-zinc-600 font-mono">
            <span>Current: {state.xp} XP</span>
            <span>
              {nextLevelInfo ? `Target: ${nextLevelInfo.minXp} XP (${nextLevelInfo.title})` : 'Max Level'}
            </span>
          </div>
        </div>
      </div>

      {/* Badges Collection Grid */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Badges & Honors Collection</h3>
            <p className="text-xs text-zinc-500">
              Collect all 10 badges by compiling code, inspecting trees, and finishing challenges
            </p>
          </div>
          <div className="text-xs font-mono text-zinc-400 font-bold">
            {state.unlockedBadgeIds.length} / {ALL_BADGES.length} Unlocked
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = state.unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`relative flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all ${
                  isUnlocked
                    ? 'border-zinc-600 bg-zinc-900 shadow-sm'
                    : 'border-zinc-800 bg-zinc-950 opacity-40 grayscale'
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl mb-3 border ${
                    isUnlocked
                      ? 'bg-zinc-800 border-zinc-600 text-zinc-200'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                  }`}
                >
                  {renderBadgeIcon(badge.icon)}
                </div>

                <div className="text-xs font-bold text-white mb-1">{badge.name}</div>
                <div className="text-[10px] text-zinc-500 leading-tight line-clamp-2">
                  {badge.description}
                </div>

                <div className="mt-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      isUnlocked
                        ? 'bg-zinc-700 text-zinc-200 border border-zinc-600'
                        : 'bg-zinc-900 text-zinc-600'
                    }`}
                  >
                    {isUnlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Danger Zone: Clear/Reset Progress */}
      <div className="rounded-3xl border border-rose-900/40 bg-rose-950/10 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-rose-400">Reset Local Quest Progress</h4>
          <p className="text-xs text-zinc-500 mt-0.5">
            Clear all accumulated XP, streak counters, badges, and challenge states back to Level 1.
          </p>
        </div>

        {confirmReset ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
              }}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500 transition-colors"
            >
              Confirm Reset
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-700"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="flex items-center space-x-1.5 rounded-xl border border-rose-500/30 bg-rose-950/30 px-4 py-2 text-xs font-bold text-rose-300 hover:bg-rose-900/40 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset All Progress</span>
          </button>
        )}
      </div>
    </div>
  );
};
