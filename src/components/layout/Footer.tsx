import React from 'react';
import { Terminal, ShieldCheck, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-800 bg-black py-8 text-center text-xs text-zinc-500">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <Terminal className="h-4 w-4 text-zinc-400" />
          <span className="font-medium text-zinc-400">
            Compiler Quest — Interactive Compiler Engineering Platform
          </span>
        </div>

        <div className="flex items-center space-x-6 text-[11px] text-zinc-500">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" />
            <span>Educational CS Laboratory</span>
          </span>
          <span className="flex items-center space-x-1">
            <Cpu className="h-3.5 w-3.5 text-zinc-400" />
            <span>Pure Client-Side TypeScript Engine</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
