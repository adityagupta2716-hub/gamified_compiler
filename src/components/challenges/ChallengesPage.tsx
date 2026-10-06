import React, { useState } from 'react';
import { CHALLENGES } from '../../data/challengesData';
import { Challenge, ChallengeCategory } from '../../types/game';
import { useGame } from '../../context/GameContext';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Filter,
  Lightbulb,
} from 'lucide-react';

export const ChallengesPage: React.FC = () => {
  const { state, completeChallenge, playSound } = useGame();

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>(CHALLENGES[0]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const categories: Array<'ALL' | ChallengeCategory> = [
    'ALL',
    'LEXICAL',
    'SYNTAX',
    'SEMANTIC',
    'INTERMEDIATE CODE',
    'OPTIMIZATION',
    'COMPILER PIPELINE',
  ];

  const filteredChallenges = CHALLENGES.filter((c) =>
    activeCategory === 'ALL' ? true : c.category === activeCategory
  );

  const handleSelectChallenge = (ch: Challenge) => {
    setSelectedChallenge(ch);
    setSelectedOption(null);
    setSubmitted(false);
    setShowHint(false);
  };

  const isCompleted = state.completedChallenges.includes(selectedChallenge.id);

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setSubmitted(true);

    const isCorrect = selectedOption === selectedChallenge.correctAnswerIndex;
    if (isCorrect) {
      playSound('success');
      completeChallenge(selectedChallenge.id, selectedChallenge.xpReward);
    } else {
      playSound('error');
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'border-zinc-600 bg-zinc-800 text-zinc-300';
      case 'Medium':
        return 'border-zinc-600 bg-zinc-800 text-zinc-200';
      default:
        return 'border-rose-500/30 bg-rose-950/30 text-rose-300';
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-zinc-400 text-xs font-bold uppercase tracking-wider">
            <Trophy className="h-4 w-4" />
            <span>Interactive Assessment Arena</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Compiler Challenges</h1>
          <p className="text-xs text-zinc-500">
            Reinforce key compiler concepts across all 6 phases and earn bonus XP
          </p>
        </div>

        {/* Solved Progress Counter */}
        <div className="flex items-center space-x-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300">
          <Sparkles className="h-4 w-4 text-zinc-400" />
          <span>
            {state.completedChallenges.length} / {CHALLENGES.length} Completed
          </span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 text-xs">
        <Filter className="h-4 w-4 text-zinc-600 mr-1 flex-shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap rounded-xl px-3 py-1.5 font-medium transition-all ${
              activeCategory === cat
                ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm border border-zinc-200'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Challenge List (Left) + Detail & Answer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List: 5 cols */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
          {filteredChallenges.map((ch) => {
            const isSelected = selectedChallenge.id === ch.id;
            const completed = state.completedChallenges.includes(ch.id);

            return (
              <div
                key={ch.id}
                onClick={() => handleSelectChallenge(ch)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  isSelected
                    ? 'border-zinc-500 bg-zinc-900 shadow-sm'
                    : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-[10px] font-mono">
                      <span className="text-zinc-300 font-bold">{ch.category}</span>
                      <span className="text-zinc-700">•</span>
                      <span className={`rounded px-1.5 py-0.2 border ${getDifficultyBadge(ch.difficulty)}`}>
                        {ch.difficulty}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white line-clamp-1">{ch.title}</div>
                  </div>

                  <div className="flex items-center space-x-1.5 flex-shrink-0">
                    <span className="text-[11px] font-bold text-zinc-400">+{ch.xpReward} XP</span>
                    {completed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-zinc-700" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Pane: 7 cols */}
        <div className="lg:col-span-7 flex flex-col rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-5">
          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="text-zinc-300 font-bold">{selectedChallenge.category}</span>
                <span className="text-zinc-700">•</span>
                <span className={`rounded px-2 py-0.5 border text-[10px] ${getDifficultyBadge(selectedChallenge.difficulty)}`}>
                  {selectedChallenge.difficulty}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{selectedChallenge.title}</h3>
            </div>

            <div className="flex items-center space-x-2">
              <span className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-bold text-zinc-300">
                +{selectedChallenge.xpReward} XP
              </span>
              {isCompleted && (
                <span className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-3 py-1 text-xs font-bold text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Solved</span>
                </span>
              )}
            </div>
          </div>

          {/* Question Prompt */}
          <div className="text-sm font-medium text-zinc-200 leading-relaxed">
            {selectedChallenge.question}
          </div>

          {/* Code Snippet (if provided) */}
          {selectedChallenge.codeSnippet && (
            <div className="rounded-xl border border-zinc-800 bg-black p-4 font-mono text-xs text-zinc-300 overflow-x-auto shadow-inner">
              <pre>{selectedChallenge.codeSnippet}</pre>
            </div>
          )}

          {/* Options */}
          <div className="space-y-2 pt-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Select Your Answer:
            </div>
            {selectedChallenge.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === selectedChallenge.correctAnswerIndex;

              let style = 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800';
              if (isSelected && !submitted) {
                style = 'border-zinc-400 bg-zinc-800 text-zinc-100 shadow-md';
              }
              if (submitted) {
                if (isCorrectAnswer) {
                  style = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-bold';
                } else if (isSelected && !isCorrectAnswer) {
                  style = 'border-rose-500 bg-rose-950/40 text-rose-200 line-through';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => !submitted && setSelectedOption(idx)}
                  disabled={submitted}
                  className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-xs text-left transition-all ${style}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-[11px] font-bold">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="font-mono">{opt}</span>
                  </div>

                  {submitted && isCorrectAnswer && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  )}
                  {submitted && isSelected && !isCorrectAnswer && (
                    <XCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Hint & Submit Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center space-x-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <Lightbulb className="h-4 w-4 text-zinc-500" />
              <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
            </button>

            {!submitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="flex items-center space-x-2 rounded-xl bg-zinc-100 hover:bg-white active:bg-zinc-200 px-6 py-2.5 text-xs font-semibold text-zinc-950 shadow-sm border border-zinc-200 hover:-translate-y-0.5 disabled:opacity-40 transition-all"
              >
                <span>Check Answer</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  const currentIndex = CHALLENGES.findIndex((c) => c.id === selectedChallenge.id);
                  const nextIndex = (currentIndex + 1) % CHALLENGES.length;
                  handleSelectChallenge(CHALLENGES[nextIndex]);
                }}
                className="flex items-center space-x-2 rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors"
              >
                <span>Next Challenge</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Hint Card */}
          {showHint && (
            <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-3.5 text-xs text-zinc-300">
              <div className="font-bold flex items-center space-x-1.5 mb-1">
                <Lightbulb className="h-4 w-4 text-zinc-400" />
                <span>Compiler Hint</span>
              </div>
              <p className="text-[11px] leading-relaxed">{selectedChallenge.hint}</p>
            </div>
          )}

          {/* Explanation Banner when Submitted */}
          {submitted && (
            <div
              className={`rounded-2xl border p-4 space-y-2 ${
                selectedOption === selectedChallenge.correctAnswerIndex
                  ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200'
                  : 'border-rose-500/40 bg-rose-950/30 text-rose-200'
              }`}
            >
              <div className="flex items-center space-x-2 font-bold text-xs">
                {selectedOption === selectedChallenge.correctAnswerIndex ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Excellent! Correct Answer (+{selectedChallenge.xpReward} XP)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-rose-400" />
                    <span>Incorrect Choice</span>
                  </>
                )}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {selectedChallenge.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
