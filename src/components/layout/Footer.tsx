import React from 'react';
import { Terminal, ShieldCheck, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#050711] py-8 text-center text-xs text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <Terminal className="h-4 w-4 text-cyan-400" />
          <span className="font-semibold text-slate-300">
            Compiler Quest — An Interactive Compiler Design Learning Platform
          </span>
        </div>

        <div className="flex items-center space-x-6 text-[11px] text-slate-400">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>3rd-Year B.Tech Compiler Design Project</span>
          </span>
          <span className="flex items-center space-x-1">
            <Cpu className="h-3.5 w-3.5 text-purple-400" />
            <span>Pure Client-Side TypeScript Engine</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
