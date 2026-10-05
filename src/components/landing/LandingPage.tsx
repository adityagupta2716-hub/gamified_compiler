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
    { name: 'Source Code', desc: 'C-like Grammar', icon: Terminal, color: 'text-slate-300' },
    { name: 'Lexer', desc: 'Token Stream', icon: Layers, color: 'text-cyan-400' },
    { name: 'Parser', desc: 'Recursive AST', icon: Network, color: 'text-purple-400' },
    { name: 'Semantic Analyzer', desc: 'Symbol Table & Types', icon: Database, color: 'text-blue-400' },
    { name: 'IR Generator', desc: 'Three Address Code', icon: Terminal, color: 'text-emerald-400' },
    { name: 'Optimizer', desc: 'Folding & DCE', icon: Zap, color: 'text-amber-400' },
    { name: 'Target Generator', desc: 'Pseudo-Assembly', icon: Cpu, color: 'text-pink-400' },
  ];

  return (
    <div className="relative overflow-hidden py-12 md:py-20">
      {/* Background Neon Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-purple-600/20 to-transparent blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-semibold text-cyan-300 shadow-inner">
            <Sparkles className="h-3.5 w-3.5" />
            <span>3rd-Year B.Tech Compiler Design Project</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            COMPILER <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">QUEST</span>
          </h1>

          <p className="text-lg sm:text-xl font-medium text-slate-300">
            Learn Compiler Design. One Level at a Time.
          </p>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            An interactive gamified compiler that lets you explore every stage of the compilation process—from tokenizing source strings and building abstract syntax trees, to intermediate code optimization and register-allocated pseudo-assembly.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartQuest}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-purple-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 hover:brightness-110 active:scale-95"
            >
              <span>Start Quest</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onExploreCompiler}
              className="flex items-center space-x-2 rounded-xl border border-slate-700/80 bg-slate-900/80 px-7 py-3.5 text-sm font-semibold text-slate-200 shadow-lg hover:border-cyan-500/40 hover:text-cyan-300 transition-all active:scale-95"
            >
              <Terminal className="h-4 w-4 text-cyan-400" />
              <span>Explore Compiler</span>
            </button>
          </div>
        </div>

        {/* Visual Compiler Pipeline with Animated Arrows */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Live Architecture
            </div>
            <h2 className="text-2xl font-bold text-white">The Six-Phase Compiler Pipeline</h2>
            <p className="text-xs text-slate-400">Genuinely processes user code across each stage in real time</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-2 items-center">
            {pipelineSteps.map((step, idx) => {
              const Icon = step.icon;

              return (
                <React.Fragment key={step.name}>
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-[#070b18]/80 p-4 text-center shadow-lg transition-transform hover:-translate-y-1 hover:border-cyan-500/40">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 mb-2">
                      <Icon className={`h-5 w-5 ${step.color}`} />
                    </div>
                    <div className="text-xs font-bold text-slate-200">{step.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{step.desc}</div>
                  </div>

                  {/* Arrow for desktop */}
                  {idx < pipelineSteps.length - 1 && (
                    <div className="hidden md:flex justify-center text-slate-600">
                      <ArrowRight className="h-4 w-4 animate-pulse text-cyan-500/50" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* What is Compiler Quest? Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center rounded-3xl border border-slate-800/80 bg-gradient-to-br from-[#0c1024] to-[#060813] p-8 shadow-2xl">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-purple-400 uppercase tracking-wider">
              <Shield className="h-4 w-4" />
              <span>Academic Purpose</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              What is Compiler Quest?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Compiler Quest transforms abstract compiler theory into a tactile, visual laboratory. Designed specifically for university students taking <span className="text-cyan-400 font-semibold">Compiler Design (CS 3rd Year)</span>, it eliminates guesswork by rendering live ASTs, scoped symbol tables, Three Address Code quads, and instruction reduction percentages as you write code.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Pure client-side TypeScript compiler execution (zero mocked data)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Multi-pass optimizer with live diffs and reduction statistics</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Built-in diagnostic explainer highlighting Expected vs Actual tokens</span>
              </div>
            </div>
          </div>

          {/* Interactive Code Preview Card */}
          <div className="rounded-2xl border border-cyan-500/30 bg-[#060814] p-5 shadow-inner font-mono text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
              <span>sample_pipeline.cq</span>
              <span className="text-emerald-400 font-semibold">Compilation Passed</span>
            </div>
            <div className="text-slate-300 space-y-1">
              <div><span className="text-purple-400">int</span> a = <span className="text-amber-400">10</span> * <span className="text-amber-400">2</span>;</div>
              <div><span className="text-purple-400">int</span> b = a + <span className="text-amber-400">0</span>;</div>
              <div><span className="text-cyan-400">print</span>(b);</div>
            </div>
            <div className="rounded-lg border border-purple-500/30 bg-purple-950/20 p-2 text-[11px] text-purple-300">
              <div className="font-bold text-xs mb-1 text-cyan-300">Optimizer Result:</div>
              <div>t1 = 10 * 2 <span className="text-emerald-400">→ folded to 20</span></div>
              <div>b = a + 0 <span className="text-emerald-400">→ algebraic identity (b = 20)</span></div>
              <div className="text-slate-400 mt-1">Instructions reduced by 40%!</div>
            </div>
          </div>
        </div>

        {/* Game Features Section */}
        <div className="space-y-8">
          <div className="text-center space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Gamified Learning
            </div>
            <h2 className="text-2xl font-bold text-white">RPG Mechanics for Computer Science</h2>
            <p className="text-xs text-slate-400">Earn XP, level up your rank, collect badges, and slay compiler bugs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 space-y-3 hover:border-cyan-500/40 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                <Trophy className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-white">8 Mastery Levels</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Advance from <span className="text-cyan-300">Token Rookie</span> to <span className="text-purple-300">Compiler Architect</span> by completing code challenges, analyzing AST structures, and compiling error-free programs.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 space-y-3 hover:border-purple-500/40 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400">
                <Swords className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-white">The Compiler Boss</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Face off against <span className="text-rose-300">Malwareus the Broken AST</span>. Diagnose bugs across 5 sequential stages—from lexical glitches to dead code—to deal massive damage and claim the Boss Slayer badge.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 space-y-3 hover:border-emerald-500/40 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                <BookOpen className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-white">B.Tech Syllabus Companion</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Master university exam viva questions, Chomsky grammar hierarchies, recursive-descent parsing algorithms, and register allocation graph coloring with interactive textbooks.
              </p>
            </div>
          </div>
        </div>

        {/* Learning Outcomes Callout */}
        <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-purple-950/30 p-8 text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Ready to Master Compiler Design?</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Test yourself with 10 interactive challenges, investigate real compilation passes, and prepare for your lab examinations and viva interviews.
          </p>
          <div className="pt-2">
            <button
              onClick={onStartQuest}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 hover:brightness-110 transition-all"
            >
              Enter Dashboard & Start Quest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
