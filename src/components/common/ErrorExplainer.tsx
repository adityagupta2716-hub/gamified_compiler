import React from 'react';
import { CompilerError } from '../../compiler/types';
import { AlertCircle, Wrench, Lightbulb, MapPin, Sparkles } from 'lucide-react';

interface ErrorExplainerProps {
  errors: CompilerError[];
  onFixSuggestionClick?: (suggestion: string) => void;
}

export const ErrorExplainer: React.FC<ErrorExplainerProps> = ({ errors }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-rose-400">
        <div className="flex items-center space-x-1.5">
          <AlertCircle className="h-4 w-4 text-rose-500 animate-pulse" />
          <span>Compiler Diagnostics ({errors.length} {errors.length === 1 ? 'Error' : 'Errors'})</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">B.Tech Diagnostic Engine</span>
      </div>

      <div className="space-y-3">
        {errors.map((err, idx) => {
          const phaseColor =
            err.phase === 'lexical'
              ? 'border-amber-500/40 bg-amber-950/20 text-amber-300'
              : err.phase === 'syntax'
              ? 'border-rose-500/40 bg-rose-950/20 text-rose-300'
              : 'border-purple-500/40 bg-purple-950/20 text-purple-300';

          const badgeTitle =
            err.phase === 'lexical'
              ? 'LEXICAL ERROR'
              : err.phase === 'syntax'
              ? 'SYNTAX ERROR'
              : 'SEMANTIC ERROR';

          return (
            <div
              key={idx}
              className="rounded-xl border border-rose-500/30 bg-gradient-to-r from-rose-950/30 via-slate-900/60 to-slate-900/80 p-4 shadow-lg"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-500/20 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-extrabold tracking-wider ${phaseColor}`}>
                    {badgeTitle}
                  </span>
                  <span className="text-xs font-semibold text-white">{err.message}</span>
                </div>

                <div className="flex items-center space-x-1.5 rounded bg-slate-900 px-2 py-1 text-[11px] font-mono text-slate-400">
                  <MapPin className="h-3 w-3 text-cyan-400" />
                  <span>Line {err.line}, Column {err.column}</span>
                </div>
              </div>

              {/* Body */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Expected vs Actual */}
                <div className="space-y-1 rounded-lg border border-slate-800 bg-slate-950/60 p-2.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Grammar Expectations
                  </div>
                  {err.expected && (
                    <div className="flex items-baseline space-x-2">
                      <span className="text-slate-400 font-mono text-[11px]">Expected:</span>
                      <code className="text-emerald-300 font-mono font-semibold">{err.expected}</code>
                    </div>
                  )}
                  {err.actual && (
                    <div className="flex items-baseline space-x-2">
                      <span className="text-slate-400 font-mono text-[11px]">Found:</span>
                      <code className="text-rose-400 font-mono font-semibold">{err.actual}</code>
                    </div>
                  )}
                </div>

                {/* How to Fix */}
                <div className="space-y-1 rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-2.5">
                  <div className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                    <Wrench className="h-3 w-3" />
                    <span>How To Fix</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {err.suggestion || 'Review statement structure against the Language Reference.'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
