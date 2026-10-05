import React, { useState } from 'react';
import { TACInstruction } from '../../compiler/types';
import { IntermediateCodeGenerator } from '../../compiler/intermediateCode';
import { Terminal, Copy, Check } from 'lucide-react';

interface TACViewerProps {
  instructions: TACInstruction[];
}

export const TACViewer: React.FC<TACViewerProps> = ({ instructions }) => {
  const [copied, setCopied] = useState(false);

  const formattedText = instructions
    .map((instr) => IntermediateCodeGenerator.formatInstruction(instr))
    .join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getInstructionTokens = (instr: TACInstruction) => {
    const formatted = IntermediateCodeGenerator.formatInstruction(instr);
    return formatted;
  };

  return (
    <div className="flex flex-col h-full space-y-3 font-mono">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center space-x-2 text-xs text-slate-300">
          <Terminal className="h-4 w-4 text-cyan-400" />
          <span className="font-semibold text-white">Three Address Code (TAC)</span>
          <span className="text-[10px] text-slate-500 font-sans">Linearized Quadruples</span>
        </div>

        <button
          onClick={handleCopy}
          disabled={instructions.length === 0}
          className="flex items-center space-x-1.5 rounded-lg border border-slate-700/60 bg-slate-900/90 px-2.5 py-1 text-xs text-slate-300 hover:border-cyan-500/40 hover:text-cyan-400 transition-colors disabled:opacity-40"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Copied' : 'Copy TAC'}</span>
        </button>
      </div>

      {/* Terminal Display */}
      <div className="flex-1 overflow-auto rounded-xl border border-slate-800 bg-[#060812] p-4 shadow-2xl min-h-[300px]">
        {/* Terminal Header Dots */}
        <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-slate-900 text-xs text-slate-500">
          <div className="flex space-x-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 font-mono text-[11px] text-slate-400">tac_engine@compiler-quest: ~</span>
        </div>

        {instructions.length === 0 ? (
          <div className="flex h-56 flex-col items-center justify-center text-slate-600 text-xs font-sans">
            <p>No intermediate instructions generated.</p>
            <p className="text-[11px] text-slate-700 mt-1">Compile code to inspect Three Address Code instructions.</p>
          </div>
        ) : (
          <div className="space-y-1 text-xs">
            {instructions.map((instr, idx) => {
              const lineText = getInstructionTokens(instr);
              const isLabel = instr.op === 'LABEL';
              const isJump = instr.op === 'GOTO' || instr.op === 'IF_FALSE_GOTO';

              return (
                <div
                  key={idx}
                  className={`flex items-baseline space-x-4 py-0.5 px-2 rounded hover:bg-slate-900/50 transition-colors ${
                    isLabel ? 'text-amber-300 font-bold bg-amber-950/20' : ''
                  }`}
                >
                  <span className="w-8 select-none text-[11px] text-slate-600 text-right">
                    {idx + 1}
                  </span>
                  <div className="flex-1 flex items-baseline justify-between">
                    <span
                      className={`${
                        isLabel
                          ? 'text-amber-400'
                          : isJump
                          ? 'text-purple-400'
                          : instr.op === 'PRINT'
                          ? 'text-emerald-400'
                          : 'text-cyan-300'
                      }`}
                    >
                      {lineText}
                    </span>
                    {instr.comment && (
                      <span className="ml-4 text-[10px] text-slate-600 italic font-sans">
                        // {instr.comment}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
        <span>Total Instructions: {instructions.length}</span>
        <span>Machine Independent IR</span>
      </div>
    </div>
  );
};
