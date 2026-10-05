import React, { useState } from 'react';
import { COMPILER_BOSS } from '../../data/bossData';
import { useGame } from '../../context/GameContext';
import {
  Swords,
  Heart,
  ShieldAlert,
  Flame,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BossBattle: React.FC = () => {
  const { state, damageBoss, playSound } = useGame();

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [stageSubmitted, setStageSubmitted] = useState(false);
  const [clearedStages, setClearedStages] = useState<number[]>([]);

  const currentStage = COMPILER_BOSS.stages[currentStageIndex];
  const isLastStage = currentStageIndex === COMPILER_BOSS.stages.length - 1;
  const isBossDefeated = state.bossDefeated || state.bossHp === 0;

  const handleStageSubmit = () => {
    if (selectedOption === null) return;
    setStageSubmitted(true);

    const isCorrect = selectedOption === currentStage.correctOptionIndex;
    if (isCorrect) {
      playSound('success');
      damageBoss(currentStage.damageToBoss);
      if (!clearedStages.includes(currentStage.stageNumber)) {
        setClearedStages([...clearedStages, currentStage.stageNumber]);
      }
    } else {
      playSound('error');
    }
  };

  const handleNextStage = () => {
    setSelectedOption(null);
    setStageSubmitted(false);
    if (!isLastStage) {
      setCurrentStageIndex((prev) => prev + 1);
    }
  };

  const handleResetBoss = () => {
    setCurrentStageIndex(0);
    setSelectedOption(null);
    setStageSubmitted(false);
  };

  const bossHpPercent = Math.max(0, Math.min(100, Math.round((state.bossHp / COMPILER_BOSS.maxHp) * 100)));

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Boss Health Bar Header */}
      <div className="relative overflow-hidden rounded-3xl border border-rose-500/40 bg-gradient-to-b from-[#180a18] via-[#0d0918] to-[#080712] p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-600/30 border border-rose-500/50 text-rose-400">
              <Flame className="h-7 w-7 animate-pulse text-rose-500" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Raid Encounter • 5 Multi-Stage Phases</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {COMPILER_BOSS.name}
              </h1>
              <p className="text-xs text-rose-300/80 font-mono">
                "{COMPILER_BOSS.title}"
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-slate-400">Boss HP:</span>
            <span className="font-bold text-rose-400 text-sm">{state.bossHp} / {COMPILER_BOSS.maxHp}</span>
          </div>
        </div>

        {/* Health Bar */}
        <div className="space-y-1">
          <div className="h-4 w-full overflow-hidden rounded-full border border-rose-900 bg-slate-950 shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]"
              initial={{ width: `${bossHpPercent}%` }}
              animate={{ width: `${bossHpPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Critical Failure Zone</span>
            <span>{bossHpPercent}% Stability</span>
          </div>
        </div>
      </div>

      {/* Stage Progression Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {COMPILER_BOSS.stages.map((st, idx) => {
          const isDone = clearedStages.includes(st.stageNumber) || isBossDefeated;
          const isCurrent = idx === currentStageIndex;

          return (
            <button
              key={st.stageNumber}
              onClick={() => {
                setCurrentStageIndex(idx);
                setSelectedOption(null);
                setStageSubmitted(false);
              }}
              className={`rounded-xl border p-2.5 text-xs text-left transition-all ${
                isCurrent
                  ? 'border-purple-400 bg-purple-950/40 text-purple-200 shadow-md shadow-purple-500/20'
                  : isDone
                  ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                  : 'border-slate-800 bg-slate-900/50 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold">Stage {st.stageNumber}</span>
                {isDone ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <span className="text-[10px] font-mono text-slate-600">{st.damageToBoss} DMG</span>
                )}
              </div>
              <div className="text-[10px] truncate text-slate-400 mt-0.5">{st.phase}</div>
            </button>
          );
        })}
      </div>

      {/* Victory Banner (if defeated) */}
      {isBossDefeated ? (
        <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 p-8 text-center space-y-4 shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
            <Sparkles className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">THE COMPILER BOSS HAS FALLEN!</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            You successfully restored the Lexer, reconstructed the Parser AST, verified the Symbol Table, decomposed expressions into Three Address Code, and eliminated dead code!
          </p>
          <div className="flex items-center justify-center space-x-3 text-xs font-bold text-amber-400 font-mono">
            <span>+500 XP AWARDED</span>
            <span>•</span>
            <span>"Boss Slayer" BADGE UNLOCKED</span>
          </div>
          <div className="pt-2">
            <button
              onClick={handleResetBoss}
              className="inline-flex items-center space-x-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Fight Again</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Stage Combat Area */
        <div className="rounded-3xl border border-slate-800 bg-[#070a18] p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Boss Speech Bubble */}
          <div className="relative rounded-2xl border border-rose-500/30 bg-rose-950/20 p-4 text-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-1 flex items-center space-x-1.5">
              <Swords className="h-3.5 w-3.5" />
              <span>Malwareus Taunts:</span>
            </div>
            <p className="text-slate-200 italic font-mono text-sm">
              "{currentStage.bossDialogue}"
            </p>
          </div>

          {/* Buggy Code Card */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold uppercase tracking-wider text-cyan-400">
                Corrupted Source Code ({currentStage.title})
              </span>
              <span className="text-[11px] font-mono text-rose-400">Bugs Detected</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-[#050711] p-4 font-mono text-xs text-rose-300 overflow-x-auto shadow-inner">
              <pre>{currentStage.buggyCode}</pre>
            </div>
          </div>

          {/* Player Action Prompt */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-white">
              {currentStage.prompt}
            </div>

            <div className="space-y-2">
              {currentStage.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentStage.correctOptionIndex;

                let style = 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700';
                if (isSelected && !stageSubmitted) {
                  style = 'border-cyan-500 bg-cyan-950/40 text-cyan-200';
                }
                if (stageSubmitted) {
                  if (isCorrect) {
                    style = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-bold';
                  } else if (isSelected && !isCorrect) {
                    style = 'border-rose-500 bg-rose-950/40 text-rose-200 line-through';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => !stageSubmitted && setSelectedOption(idx)}
                    disabled={stageSubmitted}
                    className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-xs text-left transition-all ${style}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-[11px] font-bold font-mono">
                        {idx + 1}
                      </div>
                      <span className="font-mono">{opt}</span>
                    </div>

                    {stageSubmitted && isCorrect && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    )}
                    {stageSubmitted && isSelected && !isCorrect && (
                      <XCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-2">
            {!stageSubmitted ? (
              <button
                onClick={handleStageSubmit}
                disabled={selectedOption === null}
                className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-500/20 hover:brightness-110 disabled:opacity-40 transition-all"
              >
                <Swords className="h-4 w-4" />
                <span>Execute Fix (-{currentStage.damageToBoss} HP)</span>
              </button>
            ) : (
              <button
                onClick={handleNextStage}
                className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all"
              >
                <span>{isLastStage ? 'Finish Battle' : 'Advance to Next Stage'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Explanation when submitted */}
          {stageSubmitted && (
            <div
              className={`rounded-2xl border p-4 space-y-2 ${
                selectedOption === currentStage.correctOptionIndex
                  ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200'
                  : 'border-rose-500/40 bg-rose-950/30 text-rose-200'
              }`}
            >
              <div className="flex items-center space-x-2 font-bold text-xs">
                {selectedOption === currentStage.correctOptionIndex ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Attack Successful! Malwareus took {currentStage.damageToBoss} damage!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-rose-400" />
                    <span>Fix Rejected! The compiler still rejected the input.</span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {currentStage.explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
