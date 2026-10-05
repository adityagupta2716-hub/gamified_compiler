import React, { useState, useEffect, useRef } from 'react';
import { Compiler } from '../../compiler/compiler';
import { CompilationResult, CompilerPhase } from '../../compiler/types';
import { EXAMPLE_PROGRAMS, ExampleProgram } from '../../compiler/examples';
import { useGame } from '../../context/GameContext';
import { TokenTable } from './TokenTable';
import { ASTVisualizer } from './ASTVisualizer';
import { SymbolTableView } from './SymbolTableView';
import { TACViewer } from './TACViewer';
import { OptimizerDiff } from './OptimizerDiff';
import { TargetCodeView } from './TargetCodeView';
import { ErrorExplainer } from '../common/ErrorExplainer';
import { LanguageRefModal } from './LanguageRefModal';
import {
  Play,
  RotateCcw,
  Trash2,
  BookOpen,
  Sparkles,
  Layers,
  Network,
  Database,
  Terminal,
  Zap,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Code2,
} from 'lucide-react';

interface CompilerIDEProps {
  initialCode?: string;
}

export const CompilerIDE: React.FC<CompilerIDEProps> = ({ initialCode }) => {
  const { recordCompilation, playSound } = useGame();

  const [code, setCode] = useState<string>(
    initialCode ||
      `int a = 10 * 2;
int b = a + 0;
int c = b * 1;
int d = c + 5;
print(d);`
  );

  const [selectedExample, setSelectedExample] = useState<string>('optimization');
  const [activeTab, setActiveTab] = useState<CompilerPhase>('lexical');
  const [compilationResult, setCompilationResult] = useState<CompilationResult | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [showLanguageRef, setShowLanguageRef] = useState(false);

  // Initial compilation on mount
  useEffect(() => {
    handleRunCompile(code);
  }, []);

  const handleRunCompile = (sourceCodeToRun = code) => {
    setIsCompiling(true);
    playSound('compile');

    // Slight timeout to let UI show compiling animation
    setTimeout(() => {
      const result = Compiler.compile(sourceCodeToRun);
      setCompilationResult(result);
      setIsCompiling(false);

      // Record to gamification engine
      recordCompilation(sourceCodeToRun, result.success, result.phaseProgress);

      if (result.success) {
        playSound('success');
      } else {
        playSound('error');
        // Automatically switch to tab where first error occurred
        if (result.errors.length > 0) {
          const firstErrPhase = result.errors[0].phase;
          if (firstErrPhase) {
            setActiveTab(firstErrPhase);
          }
        }
      }
    }, 180);
  };

  const handleLoadExample = (exampleId: string) => {
    const example = EXAMPLE_PROGRAMS.find((e) => e.id === exampleId);
    if (example) {
      setCode(example.code);
      setSelectedExample(exampleId);
      handleRunCompile(example.code);
    }
  };

  const handleClear = () => {
    setCode('');
    setCompilationResult(null);
  };

  const handleReset = () => {
    handleLoadExample('addition');
  };

  // Keyboard shortcut: Ctrl + Enter to compile
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunCompile();
    }
    // Allow Tab key indent in textarea
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(1, lineCount) }, (_, i) => i + 1);

  const pipelineStages: Array<{
    id: CompilerPhase;
    label: string;
    icon: any;
    completed: boolean;
  }> = [
    {
      id: 'lexical',
      label: '1. Lexer',
      icon: Layers,
      completed: compilationResult?.phaseProgress.lexical || false,
    },
    {
      id: 'syntax',
      label: '2. Parser (AST)',
      icon: Network,
      completed: compilationResult?.phaseProgress.syntax || false,
    },
    {
      id: 'semantic',
      label: '3. Semantic',
      icon: Database,
      completed: compilationResult?.phaseProgress.semantic || false,
    },
    {
      id: 'ir',
      label: '4. TAC IR',
      icon: Terminal,
      completed: compilationResult?.phaseProgress.ir || false,
    },
    {
      id: 'optimization',
      label: '5. Optimizer',
      icon: Zap,
      completed: compilationResult?.phaseProgress.optimization || false,
    },
    {
      id: 'codegen',
      label: '6. Target Code',
      icon: Cpu,
      completed: compilationResult?.phaseProgress.codegen || false,
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-3 md:p-6 space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-[#070b18]/80 px-4 py-2.5 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3">
          {/* Run Button */}
          <button
            onClick={() => handleRunCompile()}
            disabled={isCompiling}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            <Play className={`h-4 w-4 fill-white ${isCompiling ? 'animate-spin' : ''}`} />
            <span>{isCompiling ? 'Compiling Pipeline...' : 'Run Pipeline'}</span>
            <span className="hidden sm:inline text-[10px] text-cyan-200/80 font-mono">(Ctrl+Enter)</span>
          </button>

          {/* Example Selector */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 text-[11px] hidden sm:inline">Example:</span>
            <select
              value={selectedExample}
              onChange={(e) => handleLoadExample(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              {EXAMPLE_PROGRAMS.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.title}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleClear}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
            title="Clear Editor"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            title="Reset Default Example"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Right Info & Language Reference */}
        <div className="flex items-center space-x-3">
          {compilationResult && (
            <div className="hidden sm:flex items-center space-x-2 text-xs font-mono">
              <span className="text-slate-400">{compilationResult.executionTimeMs}ms</span>
              <span className="h-3 w-px bg-slate-700" />
              {compilationResult.success ? (
                <span className="flex items-center space-x-1 text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Build Succeeded</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1 text-rose-400">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>{compilationResult.errors.length} Errors</span>
                </span>
              )}
            </div>
          )}

          <button
            onClick={() => setShowLanguageRef(true)}
            className="flex items-center space-x-1.5 rounded-xl border border-cyan-500/30 bg-cyan-950/30 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/40 transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
            <span>Language Ref</span>
          </button>
        </div>
      </div>

      {/* Main Split Screen Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        {/* Left Side: Code Editor (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl border border-slate-800 bg-[#060814] shadow-2xl overflow-hidden min-h-[320px]">
          {/* Editor Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/80 px-4 py-2.5 text-xs">
            <div className="flex items-center space-x-2 text-slate-300 font-mono">
              <Code2 className="h-4 w-4 text-cyan-400" />
              <span>main.cq</span>
              <span className="text-[10px] text-slate-500">C-like Source</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {lineCount} lines | {code.length} chars
            </span>
          </div>

          {/* Editor Body */}
          <div className="flex-1 relative flex overflow-hidden font-mono text-xs">
            {/* Line Numbers */}
            <div className="select-none py-3 px-3 text-right text-slate-600 bg-[#050711] border-r border-slate-900/80 leading-relaxed font-mono w-10">
              {lineNumbers.map((n) => (
                <div key={n} className="leading-6">
                  {n}
                </div>
              ))}
            </div>

            {/* Code Input Area */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              placeholder="// Write your C-like program here...&#10;int a = 10;&#10;print(a);"
              className="flex-1 resize-none bg-transparent p-3 leading-6 text-slate-200 outline-none placeholder-slate-700 font-mono overflow-auto selection:bg-cyan-500/30 selection:text-white"
            />
          </div>
        </div>

        {/* Right Side: Compiler Phase Output (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border border-slate-800 bg-[#070b18] shadow-2xl overflow-hidden min-h-[360px]">
          {/* Analysis Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto border-b border-slate-800/80 bg-slate-900/80 px-3 py-2 text-xs">
            {pipelineStages.map((st) => {
              const Icon = st.icon;
              const isActive = activeTab === st.id;

              return (
                <button
                  key={st.id}
                  onClick={() => setActiveTab(st.id)}
                  className={`flex items-center space-x-2 rounded-xl px-3 py-2 font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className="whitespace-nowrap">{st.label}</span>
                  {st.completed && (
                    <CheckCircle2 className="h-3 w-3 text-emerald-400 ml-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Phase Display */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {/* Show diagnostics if errors present */}
            {compilationResult && compilationResult.errors.length > 0 && (
              <ErrorExplainer errors={compilationResult.errors} />
            )}

            {/* Render Tab Content */}
            {activeTab === 'lexical' && (
              <TokenTable tokens={compilationResult?.tokens || []} />
            )}

            {activeTab === 'syntax' && (
              <ASTVisualizer ast={compilationResult?.ast || null} />
            )}

            {activeTab === 'semantic' && (
              <SymbolTableView symbols={compilationResult?.symbolTable || []} />
            )}

            {activeTab === 'ir' && (
              <TACViewer instructions={compilationResult?.tac || []} />
            )}

            {activeTab === 'optimization' && (
              <OptimizerDiff
                originalTac={compilationResult?.tac || []}
                optimizedTac={compilationResult?.optimizedTac || []}
                stats={
                  compilationResult?.optimizationStats || {
                    constantFoldingCount: 0,
                    constantPropagationCount: 0,
                    algebraicSimplificationCount: 0,
                    deadCodeCount: 0,
                    initialInstructions: 0,
                    optimizedInstructions: 0,
                    reductionPercentage: 0,
                    notes: [],
                  }
                }
              />
            )}

            {activeTab === 'codegen' && (
              <TargetCodeView instructions={compilationResult?.targetCode || []} />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Pipeline Progression Navigation Bar */}
      <div className="rounded-2xl border border-slate-800 bg-[#060814]/90 p-3 backdrop-blur-md">
        <div className="flex items-center justify-between mb-2 px-1 text-xs">
          <div className="flex items-center space-x-2 text-slate-300 font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Interactive Compiler Pipeline</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Click any phase to inspect representation
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {pipelineStages.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = activeTab === stage.id;
            const isCompleted = stage.completed;

            return (
              <button
                key={stage.id}
                onClick={() => setActiveTab(stage.id)}
                className={`relative flex items-center justify-between rounded-xl p-2.5 text-xs transition-all border ${
                  isActive
                    ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                    : isCompleted
                    ? 'border-emerald-500/30 bg-emerald-950/10 text-slate-300 hover:border-emerald-500/50'
                    : 'border-slate-800 bg-slate-900/40 text-slate-500 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : isCompleted ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span className="truncate font-semibold text-[11px]">{stage.label}</span>
                </div>
                {isCompleted && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Language Reference Drawer / Modal */}
      <LanguageRefModal isOpen={showLanguageRef} onClose={() => setShowLanguageRef(false)} />
    </div>
  );
};
