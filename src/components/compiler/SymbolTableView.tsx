import React, { useState } from 'react';
import { SymbolEntry } from '../../compiler/types';
import { Search, Database, CheckCircle2, XCircle } from 'lucide-react';

interface SymbolTableViewProps {
  symbols: SymbolEntry[];
}

export const SymbolTableView: React.FC<SymbolTableViewProps> = ({ symbols }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [scopeFilter, setScopeFilter] = useState('ALL');

  const scopes = ['ALL', ...Array.from(new Set(symbols.map((s) => s.scope)))];

  const filteredSymbols = symbols.filter((sym) => {
    const matchesScope = scopeFilter === 'ALL' || sym.scope === scopeFilter;
    const matchesSearch =
      sym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sym.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesScope && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search identifier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/90 pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Scope Filter */}
        <div className="flex items-center space-x-1.5 text-xs">
          <span className="text-slate-400 text-[11px]">Scope:</span>
          <select
            value={scopeFilter}
            onChange={(e) => setScopeFilter(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            {scopes.map((sc) => (
              <option key={sc} value={sc}>
                {sc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Symbol Table */}
      <div className="flex-1 overflow-auto rounded-xl border border-slate-800/90 bg-slate-950/60 shadow-inner">
        {symbols.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-slate-500 text-xs">
            <Database className="h-8 w-8 text-slate-600 mb-2" />
            <p>No symbols registered in the symbol table.</p>
            <p className="text-[11px] text-slate-600 mt-1">Declare variables in code to populate the table.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-[#0b0f1f] text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Identifier</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Value</th>
                <th className="py-2.5 px-3">Scope</th>
                <th className="py-2.5 px-3">Line : Col</th>
                <th className="py-2.5 px-3">Initialized</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 font-mono">
              {filteredSymbols.map((sym, i) => {
                const typeColor =
                  sym.type === 'int'
                    ? 'text-cyan-400'
                    : sym.type === 'float'
                    ? 'text-emerald-400'
                    : sym.type === 'string'
                    ? 'text-amber-400'
                    : 'text-purple-400';

                return (
                  <tr key={i} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-slate-100 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {sym.name}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`font-semibold ${typeColor}`}>{sym.type}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-slate-300">
                        {sym.value !== null && sym.value !== undefined ? String(sym.value) : '-'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] text-purple-300 border border-purple-500/20">
                        {sym.scope}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                      {sym.line} : {sym.column}
                    </td>
                    <td className="py-2.5 px-3">
                      {sym.initialized ? (
                        <span className="flex items-center space-x-1 text-emerald-400 text-[11px]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>true</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 text-slate-500 text-[11px]">
                          <XCircle className="h-3.5 w-3.5" />
                          <span>false</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
        <span>Displaying {filteredSymbols.length} of {symbols.length} symbols</span>
        <span>Scoped Symbol Table</span>
      </div>
    </div>
  );
};
