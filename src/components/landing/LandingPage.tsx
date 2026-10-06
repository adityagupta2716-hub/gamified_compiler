import React from 'react';
import {
  Terminal,
  ArrowRight,
  Layers,
  Network,
  Database,
  Zap,
  Cpu,
  Shield,
  Trophy,
  Swords,
  BookOpen,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onStartQuest: () => void;
  onExploreCompiler: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartQuest,
  onExploreCompiler,
}) => {
  const pipelineSteps = [
    { name: 'Source Code', desc: 'C-like Grammar', icon: Terminal },
    { name: 'Lexer', desc: 'Token Stream', icon: Layers },
    { name: 'Parser', desc: 'Recursive AST', icon: Network },
    { name: 'Semantic', desc: 'Symbol Table & Types', icon: Database },
    { name: 'IR Generator', desc: 'Three Address Code', icon: Terminal },
    { name: 'Optimizer', desc: 'Folding & DCE', icon: Zap },
    { name: 'Target Code', desc: 'Pseudo-Assembly', icon: Cpu },
  ];

  return (
    <div className="relative overflow-hidden py-12 md:py-20 bg-black">
      {/* Subtle Minimalist Center Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[220px] bg-white/[0.02] blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Tactile Grey Pill Badge */}
          <div className="inline-flex items-center space-x-2.5 rounded-full border border-zinc-800 bg-zinc-900/90 px-4 py-1.5 text-xs font-medium text-zinc-300 shadow-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-zinc-400" />
            <span>Educational Compiler Design Suite</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-300 font-medium">CS Laboratory</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            COMPILER QUEST
          </h1>

          <p className="text-lg sm:text-xl font-normal text-zinc-400">
            Learn Compiler Design. One Level at a Time.
          </p>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            An interactive educational compiler lab to explore every stage of the compilation pipeline—from tokenizing source strings and building abstract syntax trees, to intermediate code optimization and register-allocated pseudo-assembly.
          </p>

          {/* Grey Shade Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
            <button
              onClick={onStartQuest}
              className="flex items-center space-x-2.5 rounded-xl bg-zinc-100 hover:bg-white active:bg-zinc-200 text-zinc-950 font-semibold px-7 py-3.5 text-sm shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Start Quest</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onExploreCompiler}
              className="flex items-center space-x-2.5 rounded-xl border border-zinc-700/80 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-850 text-zinc-200 font-medium px-7 py-3.5 text-sm shadow-sm hover:border-zinc-600 hover:text-white transition-all active:scale-[0.99]"
            >
              <Terminal className="h-4 w-4 text-zinc-400" />
              <span>Explore Compiler</span>
            </button>
          </div>
        </div>

        {/* Visual Compiler Pipeline */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-500">
              Pipeline Architecture
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">The Six-Phase Compiler Pipeline</h2>
            <p className="text-xs text-zinc-400">Processes user code across each stage in real time</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-2.5 items-center">
            {pipelineSteps.map((step, idx) => {
              const Icon = step.icon;

              return (
                <React.Fragment key={step.name}>
                  <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800/90 bg-zinc-950 p-4 text-center shadow-sm transition-all hover:border-zinc-700 hover:bg-zinc-900/60">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 mb-2.5 text-zinc-300">
                      <Icon className="h-4 w-4 text-zinc-300" />
                    </div>
                    <div className="text-xs font-semibold text-zinc-200">{step.name}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">{step.desc}</div>
                  </div>

                  {/* Minimalist arrow */}
                  {idx < pipelineSteps.length - 1 && (
                    <div className="hidden md:flex justify-center text-zinc-600">
                      <ArrowRight className="h-3.5 w-3.5 text-zinc-600" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* What is Compiler Quest? Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-sm">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider text-zinc-400">
              <Shield className="h-4 w-4 text-zinc-400" />
              <span>Project Overview</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              What is Compiler Quest?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Compiler Quest transforms abstract compiler theory into a tactile, visual laboratory. Designed for students studying <span className="text-zinc-200 font-medium">Compiler Design</span>, it eliminates guesswork by rendering live ASTs, scoped symbol tables, Three Address Code quads, and instruction reduction percentages as you write code.
            </p>
            <div className="space-y-2 pt-2 text-xs text-zinc-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                <span>Pure client-side TypeScript compiler execution (zero mocked data)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                <span>Multi-pass optimizer with live diffs and reduction statistics</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                <span>Built-in diagnostic explainer highlighting Expected vs Actual tokens</span>
              </div>
            </div>
          </div>

          {/* Code Preview Card */}
          <div className="rounded-xl border border-zinc-800 bg-black p-5 shadow-sm font-mono text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 text-[11px] text-zinc-500">
              <span>sample_pipeline.cq</span>
              <span className="text-zinc-300 font-medium">Compiled Successfully</span>
            </div>
            <div className="text-zinc-300 space-y-1">
              <div><span className="text-zinc-400">int</span> a = <span className="text-zinc-300">10</span> * <span className="text-zinc-300">2</span>;</div>
              <div><span className="text-zinc-400">int</span> b = a + <span className="text-zinc-300">0</span>;</div>
              <div><span className="text-zinc-400">print</span>(b);</div>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-[11px] text-zinc-300">
              <div className="font-semibold text-xs mb-1 text-zinc-200">Optimizer Result:</div>
              <div>t1 = 10 * 2 <span className="text-zinc-400">→ folded to 20</span></div>
              <div>b = a + 0 <span className="text-zinc-400">→ algebraic identity (b = 20)</span></div>
              <div className="text-zinc-500 mt-1">Instructions reduced by 40%!</div>
            </div>
          </div>
        </div>

        {/* Feature Cards Section */}
        <div className="space-y-8">
          <div className="text-center space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-500">
              Features
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Interactive Learning Architecture</h2>
            <p className="text-xs text-zinc-400">Earn XP, level up your rank, collect badges, and analyze compilation passes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-3 hover:border-zinc-700 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                <Trophy className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-white">8 Mastery Levels</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Advance from <span className="text-zinc-300 font-medium">Token Rookie</span> to <span className="text-zinc-300 font-medium">Compiler Architect</span> by completing code challenges, analyzing AST structures, and compiling programs.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-3 hover:border-zinc-700 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                <Swords className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-white">The Compiler Boss</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Diagnose bugs across 5 sequential stages—from lexical glitches to dead code—to resolve the AST errors and earn the Boss Slayer badge.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-3 hover:border-zinc-700 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                <BookOpen className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-white">Curriculum Companion</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Master university exam viva questions, Chomsky grammar hierarchies, recursive-descent parsing algorithms, and register allocation.
              </p>
            </div>
          </div>
        </div>

        {/* Learning Outcomes Callout */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 text-center space-y-4 shadow-sm">
          <h3 className="text-xl font-bold text-white tracking-tight">Ready to Explore Compiler Design?</h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Test yourself with 10 interactive challenges, investigate real compilation passes, and prepare for your lab examinations.
          </p>
          <div className="pt-2">
            <button
              onClick={onStartQuest}
              className="rounded-xl bg-zinc-100 hover:bg-white active:bg-zinc-200 text-zinc-950 font-semibold px-8 py-3 text-xs shadow-sm transition-all hover:scale-[1.01]"
            >
              Enter Dashboard & Start Quest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
