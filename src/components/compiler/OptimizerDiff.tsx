import React from 'react';
import { TACInstruction, OptimizationPassStats } from '../../compiler/types';
import { IntermediateCodeGenerator } from '../../compiler/intermediateCode';
import { Zap, CheckCircle2, TrendingDown, ArrowRight, Sparkles } from 'lucide-react';

interface OptimizerDiffProps {
  originalTac: TACInstruction[];
  optimizedTac: TACInstruction[];
  stats: OptimizationPassStats;
}

export const OptimizerDiff: React.FC<OptimizerDiffProps> = ({
  originalTac,
  optimizedTac,
  stats,
}) => {
  const originalLines = originalTac.map((i) => IntermediateCodeGenerator.formatInstruction(i));
  const optimizedLines = optimizedTac.map((i) => IntermediateCodeGenerator.formatInstruction(i));

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <div className="text-[10px] uppercase font-bold text-slate-400">Before Optimization</div>
          <div className="mt-1 text-xl font-extrabold text-slate-200">
            {stats.initialInstructions} <span className="text-xs font-normal text-slate-500">instr</span>
          </div>
        </div>

        <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3">
          <div className="text-[10px] uppercase font-bold text-cyan-300">After Optimization</div>
          <div className="mt-1 text-xl font-extrabold text-cyan-400">
            {stats.optimizedInstructions} <span className="text-xs font-normal text-slate-500">instr</span>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3">
          <div className="text-[10px] uppercase font-bold text-emerald-300 flex items-center space-x-1">
            <TrendingDown className="h-3.5 w-3.5" />
            <span>Code Reduction</span>
          </div>
          <div className="mt-1 text-xl font-extrabold text-emerald-400">
            {stats.reductionPercentage}%
          </div>
        </div>

        <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-3">
          <div className="text-[10px] uppercase font-bold text-purple-300">Transformations</div>
          <div className="mt-1 text-xl font-extrabold text-purple-300">
            {stats.constantFoldingCount +
              stats.constantPropagationCount +
              stats.algebraicSimplificationCount +
              stats.deadCodeCount}
          </div>
        </div>
      </div>

      {/* Applied Techniques Tags */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="flex items-center space-x-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-cyan-300">
          <CheckCircle2 className="h-3 w-3 text-cyan-400" />
          <span>Constant Folding ({stats.constantFoldingCount})</span>
        </span>
        <span className="flex items-center space-x-1.5 rounded-full border border-purple-500/30 bg-purple-950/40 px-3 py-1 text-purple-300">
          <CheckCircle2 className="h-3 w-3 text-purple-400" />
          <span>Constant Propagation ({stats.constantPropagationCount})</span>
        </span>
        <span className="flex items-center space-x-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-emerald-300">
          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
          <span>Algebraic Simplification ({stats.algebraicSimplificationCount})</span>
        </span>
        <span className="flex items-center space-x-1.5 rounded-full border border-amber-500/30 bg-amber-950/40 px-3 py-1 text-amber-300">
          <CheckCircle2 className="h-3 w-3 text-amber-400" />
          <span>Dead Code Elimination ({stats.deadCodeCount})</span>
        </span>
      </div>

      {/* Side-by-Side Code Diff */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 min-h-[260px]">
        {/* Left: Original TAC */}
        <div className="flex flex-col rounded-xl border border-slate-800 bg-[#060812] overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-3 py-2 text-xs font-bold text-slate-300">
            <span>BEFORE OPTIMIZATION</span>
            <span className="text-[10px] text-slate-500 font-mono">{originalLines.length} lines</span>
          </div>
          <div className="flex-1 p-3 overflow-auto font-mono text-xs space-y-1">
            {originalLines.length === 0 ? (
              <p className="text-slate-600 text-xs italic">No TAC available.</p>
            ) : (
              originalLines.map((line, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-slate-400">
                  <span className="w-6 text-right select-none text-[10px] text-slate-600">{idx + 1}</span>
                  <span className="text-slate-300">{line}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Optimized TAC */}
        <div className="flex flex-col rounded-xl border border-cyan-500/30 bg-[#060812] overflow-hidden">
          <div className="flex items-center justify-between border-b border-cyan-500/20 bg-cyan-950/30 px-3 py-2 text-xs font-bold text-cyan-300">
            <span className="flex items-center space-x-1.5">
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              <span>AFTER OPTIMIZATION</span>
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">{optimizedLines.length} lines</span>
          </div>
          <div className="flex-1 p-3 overflow-auto font-mono text-xs space-y-1">
            {optimizedLines.length === 0 ? (
              <p className="text-slate-600 text-xs italic">No optimized TAC available.</p>
            ) : (
              optimizedLines.map((line, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-cyan-300 bg-cyan-950/20 px-1 py-0.5 rounded">
                  <span className="w-6 text-right select-none text-[10px] text-cyan-600">{idx + 1}</span>
                  <span className="font-semibold text-emerald-300">{line}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Optimization Notes Log */}
      {stats.notes.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs">
          <div className="flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Optimization Audit Log ({stats.notes.length} Actions)</span>
          </div>
          <div className="max-h-24 overflow-y-auto space-y-1 text-[11px] text-slate-300 font-mono">
            {stats.notes.map((note, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="text-cyan-400 mt-0.5">❯</span>
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
