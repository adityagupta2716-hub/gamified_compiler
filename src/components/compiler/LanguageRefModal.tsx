import React from 'react';
import { BookOpen, X, Check, Code, Shield } from 'lucide-react';

interface LanguageRefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageRefModal: React.FC<LanguageRefModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative max-w-3xl w-full max-h-[85vh] flex flex-col rounded-2xl border border-cyan-500/30 bg-[#0a0e1e] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#0f142b] px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Language Specification</h3>
              <p className="text-xs text-slate-400">Supported C-like educational grammar rules & syntax</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300">
          {/* Data Types */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center space-x-2">
              <Shield className="h-3.5 w-3.5" />
              <span>1. Supported Data Types</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5">
                <code className="text-cyan-400 font-bold">int</code>
                <p className="text-[11px] text-slate-400 mt-1">32-bit integer (e.g. 10, -5)</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5">
                <code className="text-emerald-400 font-bold">float</code>
                <p className="text-[11px] text-slate-400 mt-1">IEEE floating point (e.g. 3.14)</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5">
                <code className="text-amber-400 font-bold">string</code>
                <p className="text-[11px] text-slate-400 mt-1">Text literals ("Hello World")</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5">
                <code className="text-purple-400 font-bold">boolean</code>
                <p className="text-[11px] text-slate-400 mt-1">Logical true or false</p>
              </div>
            </div>
          </div>

          {/* Grammar & Syntax Examples */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-2">
              <Code className="h-3.5 w-3.5" />
              <span>2. Grammar Constructs & Examples</span>
            </h4>

            {/* Variable Declaration */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
              <div className="font-semibold text-white mb-1">Variable Declarations & Initialization</div>
              <p className="text-[11px] text-slate-400 mb-2">Must specify type followed by identifier and optional initializer:</p>
              <pre className="rounded bg-slate-900 p-2 text-cyan-300 font-mono text-[11px]">
{`int count = 10;
float pi = 3.14159;
string name = "Compiler Quest";
boolean active = true;`}
              </pre>
            </div>

            {/* Assignment & Arithmetic */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
              <div className="font-semibold text-white mb-1">Assignment & Arithmetic Operators</div>
              <p className="text-[11px] text-slate-400 mb-2">Supports +, -, *, /, % with standard operator precedence:</p>
              <pre className="rounded bg-slate-900 p-2 text-cyan-300 font-mono text-[11px]">
{`int a = 10;
int b = 20;
int total = a + b * 2; // b * 2 evaluates first!
count = count + 1;`}
              </pre>
            </div>

            {/* Conditionals & Loops */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
              <div className="font-semibold text-white mb-1">Control Flow (If-Else & While)</div>
              <p className="text-[11px] text-slate-400 mb-2">Branching and iterative execution:</p>
              <pre className="rounded bg-slate-900 p-2 text-cyan-300 font-mono text-[11px]">
{`if (total > 50) {
    print(total);
} else {
    print(0);
}

while (count < 20) {
    count = count + 1;
}`}
              </pre>
            </div>

            {/* Print Output */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
              <div className="font-semibold text-white mb-1">Built-in Print Statement</div>
              <p className="text-[11px] text-slate-400 mb-2">Prints expression values to target stream:</p>
              <pre className="rounded bg-slate-900 p-2 text-cyan-300 font-mono text-[11px]">
{`print(total);
print("Compilation Successful!");`}
              </pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-800 bg-[#0f142b] px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110"
          >
            Got it, Back to Code
          </button>
        </div>
      </div>
    </div>
  );
};
