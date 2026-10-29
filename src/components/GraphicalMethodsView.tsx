import React, { useState, useMemo } from 'react';
import {
  GRAPHICAL_METHODS_CATALOG,
  DOMAIN_META,
  GraphicalMethodEntry,
  MathematicalDomain,
} from '../data/graphicalMethodsCatalog';
import { MathView } from './MathView';
import { GraphicalMethodRenderer } from './GraphicalMethodRenderer';
import {
  Search,
  BookOpen,
  Sparkles,
  GitBranch,
  Layers,
  Code2,
  Terminal,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const GraphicalMethodsView: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<MathematicalDomain | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethodId, setSelectedMethodId] = useState<string>(
    GRAPHICAL_METHODS_CATALOG[0].id
  );

  const filteredMethods = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return GRAPHICAL_METHODS_CATALOG.filter((item) => {
      const matchDomain = selectedDomain === 'all' || item.domain === selectedDomain;
      if (!matchDomain) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.italianTitle.toLowerCase().includes(q) ||
        item.theoreticalSummary.toLowerCase().includes(q) ||
        item.formalIsomorphismTheorem.toLowerCase().includes(q) ||
        item.targetMathematicalObjects.some((obj) => obj.toLowerCase().includes(q)) ||
        item.searchKeywords.some((kw) => kw.toLowerCase().includes(q))
      );
    });
  }, [selectedDomain, searchQuery]);

  const activeMethod = useMemo(() => {
    return (
      GRAPHICAL_METHODS_CATALOG.find((m) => m.id === selectedMethodId) ||
      filteredMethods[0] ||
      GRAPHICAL_METHODS_CATALOG[0]
    );
  }, [selectedMethodId, filteredMethods]);

  const activeMeta = DOMAIN_META[activeMethod.domain];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Editorial Header */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono-tech text-amber-300 bg-amber-500/10 border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Tassonomia dei Formalismi Visuali & Diagrammatic Reasoning
          </div>
          <h1 className="text-3xl font-serif-editorial font-bold text-slate-100 tracking-tight">
            Metodi Grafici Formali della Matematica
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            La visualizzazione matematica non è mera illustrazione, ma calcolo formale esatto
            garantito da teoremi di coerenza (Mac Lane, Joyal-Street, Penrose). Ogni struttura
            algebrica, topologica e fisica possiede un linguaggio grafico isomorfo in cui
            manipolare un diagramma equivale a dimostrare un teorema.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca metodo, oggetto (es. Hasse, Dynkin, gruppi, nodi, qubit)..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#07090e] border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Domain Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedDomain('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedDomain === 'all'
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              Tutte le Branche ({GRAPHICAL_METHODS_CATALOG.length})
            </button>
            {(Object.keys(DOMAIN_META) as MathematicalDomain[]).map((dom) => {
              const meta = DOMAIN_META[dom];
              const count = GRAPHICAL_METHODS_CATALOG.filter((m) => m.domain === dom).length;
              const isActive = selectedDomain === dom;
              return (
                <button
                  key={dom}
                  onClick={() => setSelectedDomain(dom)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-100 text-slate-950 font-semibold'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                  <span>{meta.label}</span>
                  <span className="text-[10px] opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Two-Column Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Master List (4 Cols) */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[820px] overflow-y-auto pr-1">
          {filteredMethods.length === 0 ? (
            <div className="p-8 text-center bg-[#0b0f19] border border-slate-800 rounded-lg text-slate-400 text-xs">
              Nessun metodo grafico trovato con i filtri correnti.
            </div>
          ) : (
            filteredMethods.map((method) => {
              const isSelected = method.id === activeMethod.id;
              const meta = DOMAIN_META[method.domain];
              return (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethodId(method.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#101726] border-amber-400 shadow-md ring-1 ring-amber-400/20'
                      : 'bg-[#0b0f19] hover:bg-[#0f1422] border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-semibold"
                      style={{
                        backgroundColor: meta.badgeBg,
                        color: meta.color,
                        border: `1px solid ${meta.borderColor}`,
                      }}
                    >
                      {meta.label}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {method.historicalOrigin.split('(')[1]?.replace(')', '') || ''}
                    </span>
                  </div>

                  <h3 className="text-base font-serif-editorial font-bold text-slate-100 flex items-center justify-between">
                    <span>{method.name}</span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'translate-x-1 text-amber-400' : 'text-slate-600'
                      }`}
                    />
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-snug">
                    {method.italianTitle}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex flex-wrap gap-1">
                    {method.targetMathematicalObjects.slice(0, 2).map((obj, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono"
                      >
                        {obj}
                      </span>
                    ))}
                    {method.targetMathematicalObjects.length > 2 && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        +{method.targetMathematicalObjects.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Detail Dossier (8 Cols) */}
        <div className="lg:col-span-8 bg-[#0b0f19] border border-slate-800 rounded-xl p-6 lg:p-8 space-y-6 shadow-2xl">
          {/* Header of Active Method */}
          <div className="space-y-2 pb-5 border-b border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="px-2.5 py-1 rounded text-xs font-mono-tech font-semibold"
                style={{
                  backgroundColor: activeMeta.badgeBg,
                  color: activeMeta.color,
                  border: `1px solid ${activeMeta.borderColor}`,
                }}
              >
                {activeMeta.label}
              </span>
              <span className="text-xs text-slate-400 font-mono-tech">
                Origine: {activeMethod.historicalOrigin}
              </span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-serif-editorial font-bold text-slate-100">
              {activeMethod.name}
            </h2>
            <p className="text-sm font-medium text-amber-300 font-serif-editorial">
              {activeMethod.italianTitle}
            </p>
          </div>

          {/* Visual Diagrammatic Laboratory / Interactive Canvas */}
          <GraphicalMethodRenderer methodId={activeMethod.id} />

          {/* Key Formula (Rendered with KaTeX) */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono-tech uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              Equazione / Formula Canonica del Linguaggio Grafico
            </div>
            <MathView math={activeMethod.keyEquationOrFormula} block />
          </div>

          {/* Formal Isomorphism / Soundness Theorem Box */}
          <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/25 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 font-mono-tech">
              <Sparkles className="w-4 h-4" />
              TEOREMA DI ISOMORFISMO & COERENZA FORMALE (SOUNDNESS)
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {activeMethod.formalIsomorphismTheorem}
            </p>
          </div>

          {/* Theoretical Summary */}
          <div className="space-y-2 text-xs leading-relaxed">
            <h4 className="text-sm font-serif-editorial font-semibold text-slate-200 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-sky-400" />
              Fondamenti Teorici e Meccanismo Grafico
            </h4>
            <p className="text-slate-300 leading-relaxed font-sans">
              {activeMethod.theoreticalSummary}
            </p>
          </div>

          {/* Example of Interpretation / Calculation */}
          <div className="p-4 rounded-lg bg-[#07090e] border border-slate-800 space-y-2">
            <div className="text-xs font-semibold text-sky-300 font-mono-tech flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" />
              Esempio Concreto di Calcolo e Interpretazione Geometrica
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {activeMethod.exampleInterpretation}
            </p>
          </div>

          {/* Target Objects Tag Cloud */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono-tech uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              Oggetti Matematici Trattati con questo Metodo
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeMethod.targetMathematicalObjects.map((obj, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded bg-[#07090e] border border-slate-800 text-xs font-mono-tech text-slate-300"
                >
                  {obj}
                </span>
              ))}
            </div>
          </div>

          {/* Tools & Bibliography Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            {/* Computational Tools */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono-tech uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Strumenti Computazionali & Software
              </div>
              <ul className="space-y-1 text-xs text-slate-300 font-mono-tech">
                {activeMethod.computationalTools.map((tool, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{tool}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Primary Bibliography */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono-tech uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                Fonti & Bibliografia Primaria
              </div>
              <ul className="space-y-1 text-xs text-slate-400 font-serif-editorial">
                {activeMethod.primaryBibliography.map((bib, idx) => (
                  <li key={idx} className="leading-snug">
                    • {bib}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
