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
          colors: ['#00f0ff', '#a855f7', '#38bdf8', '#fbbf24'],
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [activeLevelUp?.show]);

  if (!activeLevelUp?.show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          className="relative max-w-md w-full rounded-2xl border border-purple-500/40 bg-gradient-to-b from-[#14122e] to-[#0a0d1f] p-6 text-center shadow-[0_0_50px_-10px_rgba(168,85,247,0.4)]"
        >
          {/* Header Glow */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 shadow-lg shadow-purple-500/30">
            <Shield className="h-10 w-10 text-white" />
          </div>

          <div className="mt-4 flex items-center justify-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Sparkles className="h-4 w-4" />
            <span>Level Promoted!</span>
            <Sparkles className="h-4 w-4" />
          </div>

          <h2 className="mt-2 text-2xl font-extrabold text-white">
            Level {activeLevelUp.level} Unlocked!
          </h2>
          <p className="mt-1 text-sm font-semibold text-purple-300">
            "{activeLevelUp.title}"
          </p>

          <p className="mt-3 text-xs text-slate-300 leading-relaxed">
            Congratulations, engineer! Your compiler pipeline mastery has advanced. You've unlocked new challenges and deeper compiler capabilities.
          </p>

          <div className="mt-6">
            <button
              onClick={dismissLevelUp}
              className="inline-flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 py-3 text-xs font-bold text-white shadow-lg shadow-purple-500/25 transition-all hover:brightness-110"
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
