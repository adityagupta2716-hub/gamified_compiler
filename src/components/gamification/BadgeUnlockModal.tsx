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
    const props = { className: 'h-10 w-10 text-zinc-200' };
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          className="relative max-w-sm w-full rounded-2xl border border-zinc-700 bg-zinc-950 p-6 text-center shadow-2xl"
        >
          <button
            onClick={dismissBadgeUnlock}
            className="absolute top-4 right-4 text-zinc-500 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-800 border border-zinc-700 shadow-lg">
            {renderBadgeIcon(activeBadgeUnlocked.icon)}
          </div>

          <div className="mt-4 text-xs font-bold uppercase tracking-wider text-zinc-400">
            Achievement Unlocked!
          </div>

          <h3 className="mt-1 text-xl font-extrabold text-white">
            {activeBadgeUnlocked.name}
          </h3>

          <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
            {activeBadgeUnlocked.description}
          </p>

          <div className="mt-6">
            <button
              onClick={dismissBadgeUnlock}
              className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-100 hover:bg-white active:bg-zinc-200 py-2.5 text-xs font-semibold text-zinc-950 shadow-sm border border-zinc-200 transition-all hover:-translate-y-0.5"
            >
              Collect Badge
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
