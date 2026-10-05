import React, { useState } from 'react';
import { LEARN_MODULES, LearnModule } from '../../data/learnData';
import { useGame } from '../../context/GameContext';
import {
  BookOpen,
  Terminal,
  Layers,
  Network,
  Database,
  Zap,
  Cpu,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface LearningPageProps {
  onTryCodeInIDE: (code: string) => void;
}

export const LearningPage: React.FC<LearningPageProps> = ({ onTryCodeInIDE }) => {
  const { unlockBadge } = useGame();
  const [selectedModuleId, setSelectedModuleId] = useState<string>('intro');
  const [activeTab, setActiveTab] = useState<'theory' | 'viva'>('theory');

  const selectedModule =
    LEARN_MODULES.find((m) => m.id === selectedModuleId) || LEARN_MODULES[0];

  const handleSelectModule = (id: string) => {
    setSelectedModuleId(id);
    setActiveTab('theory');
    unlockBadge('scholar');
  };

  const getModuleIcon = (phaseNumber: number) => {
    switch (phaseNumber) {
      case 1:
        return Layers;
      case 2:
        return Network;
      case 3:
        return Database;
      case 4:
        return Terminal;
      case 5:
        return Zap;
      case 6:
        return Cpu;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="h-4 w-4" />
            <span>3rd-Year B.Tech Curriculum Guide</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Compiler Design Knowledge Base</h1>
          <p className="text-xs text-slate-400">
            Comprehensive phase breakdown with theory, architecture diagrams, and viva examination prep
          </p>
        </div>

        <button
          onClick={() => onTryCodeInIDE(selectedModule.exampleCode)}
          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all self-start sm:self-auto"
        >
          <Terminal className="h-4 w-4" />
          <span>Try Current Phase in IDE</span>
        </button>
      </div>

      {/* Main Grid: Sidebar Chapters + Chapter Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chapters Navigation (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          {LEARN_MODULES.map((mod) => {
            const Icon = getModuleIcon(mod.phaseNumber);
            const isSelected = selectedModule.id === mod.id;

            return (
              <div
                key={mod.id}
                onClick={() => handleSelectModule(mod.id)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-md shadow-cyan-500/20'
                    : 'border-slate-800 bg-[#070a18] hover:border-slate-700 hover:bg-slate-900/60 text-slate-400'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                      isSelected
                        ? 'border-cyan-500/40 bg-cyan-900/40 text-cyan-300'
                        : 'border-slate-800 bg-slate-900 text-slate-500'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white line-clamp-1">{mod.title}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Phase {mod.phaseNumber}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chapter Content View (8 cols) */}
        <div className="lg:col-span-8 flex flex-col rounded-3xl border border-slate-800 bg-[#080c1a] p-6 shadow-2xl space-y-6">
          {/* Chapter Title & Tab Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="text-[11px] font-mono font-bold text-purple-400">
                PHASE {selectedModule.phaseNumber} MODULE
              </div>
              <h2 className="text-xl font-extrabold text-white mt-0.5">{selectedModule.title}</h2>
              <p className="text-xs text-slate-400 italic mt-1">{selectedModule.tagline}</p>
            </div>

            <div className="flex items-center space-x-1 rounded-xl border border-slate-800 bg-slate-900 p-1 text-xs">
              <button
                onClick={() => setActiveTab('theory')}
                className={`rounded-lg px-3 py-1 font-semibold transition-colors ${
                  activeTab === 'theory' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Theory & Architecture
              </button>
              <button
                onClick={() => setActiveTab('viva')}
                className={`rounded-lg px-3 py-1 font-semibold transition-colors ${
                  activeTab === 'viva' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Viva Q&A ({selectedModule.vivaQuestions.length})
              </button>
            </div>
          </div>

          {activeTab === 'theory' ? (
            <div className="space-y-6">
              {/* Concept Paragraphs */}
              <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {selectedModule.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Key Concept Chips */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  Core Syllabus Concepts:
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedModule.keyConcepts.map((c, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-cyan-500/20 bg-cyan-950/30 px-3 py-1 text-[11px] font-semibold text-cyan-300"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Architecture Diagram */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                  Architectural Flow Diagram:
                </div>
                <div className="rounded-xl border border-slate-800 bg-[#050711] p-4 font-mono text-[11px] text-cyan-300 overflow-x-auto shadow-inner">
                  <pre>{selectedModule.diagram}</pre>
                </div>
              </div>

              {/* Example Code & Try it in IDE */}
              <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Demonstration Program</span>
                  <button
                    onClick={() => onTryCodeInIDE(selectedModule.exampleCode)}
                    className="flex items-center space-x-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 px-3 py-1 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 transition-colors"
                  >
                    <span>Try in IDE</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
                <pre className="rounded bg-slate-900 p-3 text-xs font-mono text-purple-300 overflow-x-auto">
                  {selectedModule.exampleCode}
                </pre>
              </div>
            </div>
          ) : (
            /* Viva Q&A Tab */
            <div className="space-y-4">
              <div className="text-xs text-slate-400 mb-2">
                Frequently asked oral examination (viva voce) questions for university evaluations:
              </div>
              {selectedModule.vivaQuestions.map((vq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-[#060814] p-4 space-y-2"
                >
                  <div className="flex items-start space-x-2 text-xs font-bold text-white">
                    <HelpCircle className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>Q: {vq.q}</span>
                  </div>
                  <p className="text-xs text-slate-300 pl-6 leading-relaxed border-l-2 border-cyan-500/30 ml-2">
                    {vq.a}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
