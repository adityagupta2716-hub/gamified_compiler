import React from 'react';
import { useGame } from '../../context/GameContext';
import { Zap, Award, CheckCircle2, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useGame();

  const getIcon = (type: string) => {
    switch (type) {
      case 'xp':
        return <Zap className="h-5 w-5 text-amber-400" />;
      case 'badge':
        return <Award className="h-5 w-5 text-cyan-400" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
      default:
        return <Info className="h-5 w-5 text-sky-400" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'xp':
        return 'border-amber-500/40 bg-amber-950/40 text-amber-200';
      case 'badge':
        return 'border-cyan-500/40 bg-cyan-950/40 text-cyan-200';
      case 'success':
        return 'border-emerald-500/40 bg-emerald-950/40 text-emerald-200';
      default:
        return 'border-sky-500/40 bg-slate-900/90 text-slate-200';
    }
  };

  return (
    <div className="fixed bottom-16 right-4 z-50 flex flex-col space-y-2 pointer-events-none md:bottom-6 md:right-6">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-start space-x-3 rounded-xl border p-3.5 shadow-2xl backdrop-blur-md max-w-sm w-80 ${getBorderColor(
              toast.type
            )}`}
          >
            <div className="mt-0.5 flex-shrink-0">{getIcon(toast.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold leading-tight">{toast.title}</div>
              <div className="mt-1 text-xs opacity-90 line-clamp-2">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
