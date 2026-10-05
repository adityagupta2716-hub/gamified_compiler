import React from 'react';
import { useGame } from '../../context/GameContext';
import {
  Award,
  Search,
  Network,
  FolderTree,
  ShieldCheck,
  Terminal,
  Zap,
  Cpu,
  Crown,
  Flame,
  BookOpen,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BadgeUnlockModal: React.FC = () => {
  const { activeBadgeUnlocked, dismissBadgeUnlock } = useGame();

  if (!activeBadgeUnlocked) return null;

  const renderBadgeIcon = (iconName: string) => {
    const props = { className: 'h-10 w-10 text-cyan-300' };
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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          className="relative max-w-sm w-full rounded-2xl border border-cyan-500/40 bg-gradient-to-b from-[#0f172a] to-[#070b18] p-6 text-center shadow-[0_0_50px_-10px_rgba(0,240,255,0.3)]"
        >
          <button
            onClick={dismissBadgeUnlock}
            className="absolute top-4 right-4 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 shadow-lg shadow-cyan-500/30">
            {renderBadgeIcon(activeBadgeUnlocked.icon)}
          </div>

          <div className="mt-4 text-xs font-bold uppercase tracking-wider text-cyan-400">
            Achievement Unlocked!
          </div>

          <h3 className="mt-1 text-xl font-extrabold text-white">
            {activeBadgeUnlocked.name}
          </h3>

          <p className="mt-2 text-xs text-slate-300 leading-relaxed">
            {activeBadgeUnlocked.description}
          </p>

          <div className="mt-6">
            <button
              onClick={dismissBadgeUnlock}
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:brightness-110"
            >
              Collect Badge
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
