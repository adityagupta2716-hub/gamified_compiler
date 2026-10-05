import React from 'react';
import { useGame } from '../../context/GameContext';
import { ALL_BADGES } from '../../types/game';
import {
  Shield,
  Zap,
  Flame,
  Trophy,
  Award,
  ArrowRight,
  Terminal,
  CheckCircle2,
  Circle,
  Swords,
  BookOpen,
  Sparkles,
} from 'lucide-react';

interface DashboardProps {
  onContinueQuest: () => void;
  onOpenChallenges: () => void;
  onOpenBoss: () => void;
  onOpenLearn: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onContinueQuest,
  onOpenChallenges,
  onOpenBoss,
  onOpenLearn,
}) => {
  const { state, currentLevelInfo, nextLevelInfo, xpProgressPercent } = useGame();

  const pipelineStages = [
    { name: 'Lexical Analysis', key: 'lexical', desc: 'Scanning tokens and regular expressions' },
    { name: 'Syntax Analysis', key: 'syntax', desc: 'Recursive descent & AST construction' },
    { name: 'Semantic Analysis', key: 'semantic', desc: 'Symbol table & static type safety' },
    { name: 'Intermediate Code', key: 'ir', desc: 'Three Address Code generation' },
    { name: 'Optimization', key: 'optimization', desc: 'Constant folding & dead code elimination' },
    { name: 'Target Code', key: 'codegen', desc: 'Pseudo-assembly with registers' },
  ];

  const xpNeeded = nextLevelInfo ? nextLevelInfo.minXp : 6000;

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Top Welcome / Continue Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-[#0c142e] via-[#090d20] to-[#120e2e] p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-semibold text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Welcome back, {state.username}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Level {state.level} — {currentLevelInfo.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {currentLevelInfo.description}
            </p>
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={onContinueQuest}
              className="flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 hover:brightness-110 active:scale-95"
            >
              <span>Continue Quest</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* XP Capsule */}
        <div className="rounded-2xl border border-slate-800 bg-[#090d1e]/80 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Experience Points</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {state.xp} <span className="text-xs font-normal text-slate-500">/ {xpNeeded} XP</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
              style={{ width: `${xpProgressPercent}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {nextLevelInfo ? `${nextLevelInfo.minXp - state.xp} XP to Level ${state.level + 1}` : 'Max Level Reached!'}
          </div>
        </div>

        {/* Current Streak */}
        <div className="rounded-2xl border border-slate-800 bg-[#090d1e]/80 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Active Streak</span>
            <Flame className="h-4 w-4 text-amber-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            {state.currentStreak} Days
          </div>
          <p className="text-[11px] text-slate-400">
            Keep running compilations and completing challenges to preserve your streak.
          </p>
        </div>

        {/* Completed Challenges */}
        <div className="rounded-2xl border border-slate-800 bg-[#090d1e]/80 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Challenges Solved</span>
            <Trophy className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300">
            {state.completedChallenges.length} <span className="text-xs font-normal text-slate-500">/ 10 Solved</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Earn up to 1,500 bonus XP by clearing all categorized challenge sets.
          </div>
        </div>

        {/* Badges Collected */}
        <div className="rounded-2xl border border-slate-800 bg-[#090d1e]/80 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Badges Unlocked</span>
            <Award className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300">
            {state.unlockedBadgeIds.length} <span className="text-xs font-normal text-slate-500">/ {ALL_BADGES.length} Badges</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Unlock achievements across compilation phases and boss fights.
          </div>
        </div>
      </div>

      {/* Pipeline Mastery Checklist */}
      <div className="rounded-3xl border border-slate-800 bg-[#080c1a] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Compiler Pipeline Progression</h3>
            <p className="text-xs text-slate-400">
              Execute each phase successfully in the IDE to achieve full pipeline mastery
            </p>
          </div>
          <div className="text-xs font-mono text-cyan-400">
            {Object.values(state.pipelineMastery).filter(Boolean).length} / 6 Stages Mastered
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {pipelineStages.map((st) => {
            const isDone = (state.pipelineMastery as any)[st.key];

            return (
              <div
                key={st.key}
                className={`flex items-start space-x-3 rounded-2xl border p-4 transition-colors ${
                  isDone
                    ? 'border-emerald-500/30 bg-emerald-950/20'
                    : 'border-slate-800 bg-slate-900/40 text-slate-500'
                }`}
              >
                <div className="mt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-600" />
                  )}
                </div>
                <div>
                  <div className={`text-xs font-bold ${isDone ? 'text-white' : 'text-slate-400'}`}>
                    {st.name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{st.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={onOpenChallenges}
          className="cursor-pointer rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-[#070a18] p-5 space-y-2 hover:border-cyan-500/40 transition-all hover:-translate-y-1"
        >
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase">
            <Trophy className="h-4 w-4" />
            <span>Practice Arena</span>
          </div>
          <h4 className="text-base font-bold text-white">Categorized Challenges</h4>
          <p className="text-xs text-slate-400">
            Solve problems on DFAs, LL(1) grammars, type inference, and 3-address quads.
          </p>
        </div>

        <div
          onClick={onOpenBoss}
          className="cursor-pointer rounded-2xl border border-purple-500/30 bg-gradient-to-b from-purple-950/20 to-[#070a18] p-5 space-y-2 hover:border-purple-500/50 transition-all hover:-translate-y-1"
        >
          <div className="flex items-center space-x-2 text-purple-400 text-xs font-bold uppercase">
            <Swords className="h-4 w-4" />
            <span>Boss Raid</span>
          </div>
          <h4 className="text-base font-bold text-white">The Compiler Boss</h4>
          <p className="text-xs text-slate-400">
            Debug 5 sequential compiler stages to defeat Malwareus and earn 500 XP.
          </p>
        </div>

        <div
          onClick={onOpenLearn}
          className="cursor-pointer rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-[#070a18] p-5 space-y-2 hover:border-emerald-500/40 transition-all hover:-translate-y-1"
        >
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase">
            <BookOpen className="h-4 w-4" />
            <span>Curriculum Guide</span>
          </div>
          <h4 className="text-base font-bold text-white">B.Tech Textbook & Viva</h4>
          <p className="text-xs text-slate-400">
            Explore phase theories, ASCII diagrams, and sample viva exam questions.
          </p>
        </div>
      </div>
    </div>
  );
};
