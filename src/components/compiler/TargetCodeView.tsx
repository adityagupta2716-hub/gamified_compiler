import React, { useState } from 'react';
import { TargetInstruction } from '../../compiler/types';
import { TargetCodeGenerator } from '../../compiler/codeGenerator';
import { Cpu, Copy, Check, Info } from 'lucide-react';

interface TargetCodeViewProps {
  instructions: TargetInstruction[];
}

export const TargetCodeView: React.FC<TargetCodeViewProps> = ({ instructions }) => {
  const [copied, setCopied] = useState(false);

  const formattedAssembly = TargetCodeGenerator.formatAssembly(instructions);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedAssembly);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full space-y-3 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center space-x-2 text-xs">
          <Cpu className="h-4 w-4 text-purple-400" />
          <span className="font-semibold text-white">Educational Target Code</span>
          <span className="rounded bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 text-[10px] text-purple-300 font-sans">
            Pseudo-Assembly (3rd-Year B.Tech)
          </span>
        </div>

        <button
          onClick={handleCopy}
          disabled={instructions.length === 0}
          className="flex items-center space-x-1.5 rounded-lg border border-slate-700/60 bg-slate-900/90 px-2.5 py-1 text-xs text-slate-300 hover:border-cyan-500/40 hover:text-cyan-400 transition-colors disabled:opacity-40"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Assembly'}</span>
        </button>
      </div>

      {/* Assembly Listing */}
      <div className="flex-1 overflow-auto rounded-xl border border-slate-800 bg-[#060812] p-4 shadow-2xl min-h-[300px]">
        {instructions.length === 0 ? (
          <div className="flex h-56 flex-col items-center justify-center text-slate-600 text-xs font-sans">
            <p>No target code generated.</p>
            <p className="text-[11px] text-slate-700 mt-1">Run compilation to generate pseudo-assembly.</p>
          </div>
        ) : (
          <div className="space-y-1 text-xs">
            {instructions.map((instr, idx) => {
              const isComment = instr.opcode.startsWith('//');
              const isSection = instr.opcode.startsWith('.');
              const isLabel = instr.opcode.endsWith(':');

              if (isComment) {
                return (
                  <div key={idx} className="text-slate-500 italic py-0.5">
                    {instr.opcode}
                  </div>
                );
              }

              if (isSection) {
                return (
                  <div key={idx} className="text-cyan-400 font-bold py-1">
                    {instr.opcode}
                  </div>
                );
              }

              if (isLabel) {
                return (
                  <div key={idx} className="text-amber-400 font-bold py-0.5 mt-1">
                    {instr.opcode}
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className="flex items-baseline space-x-4 py-0.5 px-2 rounded hover:bg-slate-900/50 transition-colors"
                >
                  <span className="w-8 select-none text-[11px] text-slate-600 text-right">
                    {instr.line}
                  </span>
                  <div className="w-24 font-bold text-purple-300">
                    {instr.opcode}
                  </div>
                  <div className="w-48 text-cyan-300">
                    {instr.operands.join(', ')}
                  </div>
                  {instr.comment && (
                    <div className="text-[11px] text-slate-500 italic font-sans">
                      ; {instr.comment}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Target Machine Specifications Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 font-sans">
        <div className="flex items-center space-x-2">
          <Info className="h-4 w-4 text-purple-400" />
          <span>Architecture: 4 General Purpose Registers (R1, R2, R3, R4) | Word size: 32-bit</span>
        </div>
        <div className="font-mono text-cyan-400">
          Instructions: {instructions.filter((i) => !i.opcode.startsWith('//')).length}
        </div>
      </div>
    </div>
  );
};
