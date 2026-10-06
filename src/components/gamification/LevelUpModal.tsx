import React, { useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { Shield, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export const LevelUpModal: React.FC = () => {
  const { activeLevelUp, dismissLevelUp } = useGame();

  useEffect(() => {
    if (activeLevelUp?.show) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e4e4e7', '#a1a1aa', '#71717a', '#ffffff'],
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [activeLevelUp?.show]);

  if (!activeLevelUp?.show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          className="relative max-w-md w-full rounded-2xl border border-zinc-700 bg-zinc-950 p-6 text-center shadow-2xl"
        >
          {/* Header Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-800 border border-zinc-700 shadow-lg">
            <Shield className="h-10 w-10 text-zinc-100" />
          </div>

          <div className="mt-4 flex items-center justify-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <Sparkles className="h-4 w-4" />
            <span>Level Promoted!</span>
            <Sparkles className="h-4 w-4" />
          </div>

          <h2 className="mt-2 text-2xl font-extrabold text-white">
            Level {activeLevelUp.level} Unlocked!
          </h2>
          <p className="mt-1 text-sm font-semibold text-zinc-300">
            "{activeLevelUp.title}"
          </p>

          <p className="mt-3 text-xs text-zinc-400 leading-relaxed">
            Congratulations, engineer! Your compiler pipeline mastery has advanced. You've unlocked new challenges and deeper compiler capabilities.
          </p>

          <div className="mt-6">
            <button
              onClick={dismissLevelUp}
              className="inline-flex w-full items-center justify-center space-x-2 rounded-xl bg-zinc-100 hover:bg-white active:bg-zinc-200 py-3 text-xs font-semibold text-zinc-950 shadow-sm border border-zinc-200 transition-all hover:-translate-y-0.5"
            >
              <span>Continue Quest</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
