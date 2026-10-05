import React, { useState } from 'react';
import { Token, TokenType } from '../../compiler/types';
import { Search, Filter, AlertTriangle } from 'lucide-react';

interface TokenTableProps {
  tokens: Token[];
}

export const TokenTable: React.FC<TokenTableProps> = ({ tokens }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const tokenTypes: Array<'ALL' | TokenType> = [
    'ALL',
    'KEYWORD',
    'IDENTIFIER',
    'NUMBER',
    'STRING',
    'OPERATOR',
    'DELIMITER',
    'BOOLEAN',
    'UNKNOWN',
  ];

  const filteredTokens = tokens.filter((tok) => {
    const matchesFilter = filterType === 'ALL' || tok.type === filterType;
    const matchesSearch =
      tok.lexeme.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tok.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tok.explanation && tok.explanation.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getBadgeStyle = (type: TokenType) => {
    switch (type) {
      case 'KEYWORD':
        return 'bg-purple-900/50 text-purple-300 border-purple-500/40';
      case 'IDENTIFIER':
        return 'bg-cyan-900/50 text-cyan-300 border-cyan-500/40';
      case 'NUMBER':
        return 'bg-emerald-900/50 text-emerald-300 border-emerald-500/40';
      case 'STRING':
        return 'bg-amber-900/50 text-amber-300 border-amber-500/40';
      case 'OPERATOR':
        return 'bg-sky-900/50 text-sky-300 border-sky-500/40';
      case 'DELIMITER':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'BOOLEAN':
        return 'bg-indigo-900/50 text-indigo-300 border-indigo-500/40';
      case 'UNKNOWN':
        return 'bg-rose-900/50 text-rose-300 border-rose-500/50 animate-pulse';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search lexeme or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/90 pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto py-1 text-xs">
          <Filter className="h-3.5 w-3.5 text-slate-500 mr-1" />
          {tokenTypes.map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
                filterType === t
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tokens Table */}
      <div className="flex-1 overflow-auto rounded-xl border border-slate-800/90 bg-slate-950/60 shadow-inner">
        {tokens.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-slate-500 text-xs">
            <p>No tokens generated yet. Run compilation to scan source code.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-[#0b0f1f] text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Lexeme</th>
                <th className="py-2.5 px-3">Token Type</th>
                <th className="py-2.5 px-3">Line : Col</th>
                <th className="py-2.5 px-3">Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 font-mono">
              {filteredTokens.map((tok, i) => {
                const isUnknown = tok.type === 'UNKNOWN';

                return (
                  <tr
                    key={i}
                    className={`transition-colors ${
                      isUnknown
                        ? 'bg-rose-950/20 hover:bg-rose-900/30'
                        : 'hover:bg-slate-900/60'
                    }`}
                  >
                    <td className="py-2 px-3 text-slate-500 text-[11px]">{i + 1}</td>
                    <td className="py-2 px-3">
                      <span className="font-semibold text-slate-100 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                        {tok.lexeme}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`inline-flex items-center space-x-1 rounded border px-2 py-0.5 text-[10px] font-bold ${getBadgeStyle(tok.type)}`}>
                        {isUnknown && <AlertTriangle className="h-3 w-3 mr-1" />}
                        <span>{tok.type}</span>
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-400 text-[11px]">
                      {tok.line} : {tok.column}
                    </td>
                    <td className="py-2 px-3 text-slate-400 font-sans text-[11px]">
                      {tok.explanation || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
        <span>Showing {filteredTokens.length} of {tokens.length} total tokens</span>
        <span>Lexical Scanner Output</span>
      </div>
    </div>
  );
};
