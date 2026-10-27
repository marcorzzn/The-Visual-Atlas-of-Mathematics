import React, { useState, useMemo } from 'react';
import {
  FORTY_CATEGORIES_SCHEMA,
  SEVEN_CROSS_CATEGORY_DISCOVERIES,
  ATLAS_NODES,
  ATLAS_EDGES
} from '../data/ontologyData';
import {
  NINE_STRUCTURAL_BRIDGES,
  TWENTY_FOUR_CHAPTERS_BOOK_SPEC,
  ANNOTATED_BIBLIOGRAPHY
} from '../data/bridgesAndCompendium';
import {
  BookOpen,
  Code2,
  Search,
  Sparkles,
  FileCode,
  GraduationCap,
  GitBranch,
  Copy,
  Check
} from 'lucide-react';

interface OntologyAndCompendiumViewProps {
  initialSection?: 'taxonomy40' | 'bridges9' | 'book24' | 'cnl_lean';
}

const CNL_PRESETS = [
  {
    id: 'even_sum',
    title: 'Parità di x + 2 (Aritmetica)',
    cnlInput: `Sia x un numero intero.\nAssumiamo che x sia pari.\nAllora esiste k intero tale che x = 2 * k.\nVogliamo dimostrare che x + 2 è pari.`,
    astOutput: `Declaration(Var: x, Type: Int)\nHypothesis(h_even: Even(x))\nWitness(k: Int, Prop: x = 2*k)\nGoal(Even(x + 2), ProofWitness: k + 1)`,
    lean4Output: `import Mathlib.Algebra.Ring.Parity\n\ntheorem sum_two_even (x : ℤ) (h : Even x) : Even (x + 2) := by\n  rcases h with ⟨k, rfl⟩\n  use k + 1\n  ring`
  },
  {
    id: 'cauchy_gram',
    title: 'Area del Triangolo da Matrice di Gram (Geometria)',
    cnlInput: `Siano u, v vettori in R^n.\nSia G la matrice di Gram 2x2 di u e v.\nVogliamo dimostrare che det(G) = ||u||^2 * ||v||^2 - <u,v>^2 >= 0.`,
    astOutput: `Declaration(Vars: [u, v], Space: EuclideanSpace(ℝ, n))\nDefinition(G: Matrix(2,2,ℝ), Entries: [[⟪u,u⟫, ⟪u,v⟫], [⟪v,u⟫, ⟪v,v⟫]])\nGoal(det(G) = ‖u‖² * ‖v‖² - ⟪u,v⟫² ∧ det(G) ≥ 0, By: real_inner_self_nonneg)`,
    lean4Output: `import Mathlib.Analysis.InnerProductSpace.Basic\n\ntheorem gram_det_two_nonneg {V : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] (u v : V) :\n    0 ≤ ‖u‖^2 * ‖v‖^2 - ⟪u, v⟫_ℝ^2 := by\n  have h := real_inner_mul_inner_self_le u v\n  linarith`
  },
  {
    id: 'stokes_duality',
    title: 'Aggiunzione Bordo-Derivata Esterna (Stokes)',
    cnlInput: `Sia M una varietà orientata con bordo dM.\nSia omega una (k-1)-forma differenziale liscia su M.\nVogliamo dimostrare che l'integrale su dM di omega uguaglia l'integrale su M di d(omega).`,
    astOutput: `Declaration(M: OrientedManifold(dim: k), omega: DifferentialForm(deg: k-1, M))\nOperator(boundary: ∂(M), extDeriv: d(omega))\nAdjointIdentity(⟨∂M, ω⟩ = ⟨M, dω⟩, Consequence: d(dω) = 0 ↔ ∂(∂M) = 0)`,
    lean4Output: `-- Formal Adjointness of Boundary ∂ and Exterior Derivative d\nstructure ChainComplexPairing (C Ω : Type*) :=\n  (pair : C → Ω → ℝ)\n  (boundary : C → C)\n  (extDeriv : Ω → Ω)\n  (stokes_adjoint : ∀ c ω, pair (boundary c) ω = pair c (extDeriv ω))`
  },
  {
    id: 'lagrange_fermat',
    title: 'Piccolo Teorema di Fermat da Lagrange (Teoria dei Gruppi)',
    cnlInput: `Sia p un numero primo e sia a non divisibile per p.\nSia G il gruppo moltiplicativo (Z/pZ)* di ordine p - 1.\nPer il teorema di Lagrange, a^(p-1) = 1 mod p.`,
    astOutput: `Declaration(p: Prime, a: ZMod(p)ˣ)\nGroupOrder(Card((ZMod p)ˣ) = p - 1)\nApplyTheorem(Lagrange: a ^ card(G) = 1)\nGoal(a ^ (p - 1) ≡ 1 [MOD p])`,
    lean4Output: `import Mathlib.FieldTheory.Finite.Basic\n\ntheorem fermat_little_from_lagrange (p : ℕ) [Fact p.Prime] (a : (ZMod p)ˣ) :\n    a ^ (p - 1) = 1 := by\n  simpa [ZMod.card_units p] using pow_card_eq_one`
  }
];

export const OntologyAndCompendiumView: React.FC<OntologyAndCompendiumViewProps> = ({
  initialSection = 'taxonomy40'
}) => {
  const [section, setSection] = useState<'taxonomy40' | 'bridges9' | 'book24' | 'cnl_lean'>(
    initialSection
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPresetIdx, setSelectedPresetIdx] = useState<number>(0);
  const [customCnl, setCustomCnl] = useState<string>(CNL_PRESETS[0].cnlInput);
  const [exportFormat, setExportFormat] = useState<'jsonld' | 'graphviz' | 'tikz'>('jsonld');
  const [copied, setCopied] = useState<boolean>(false);

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return FORTY_CATEGORIES_SCHEMA;
    return FORTY_CATEGORIES_SCHEMA.filter(
      (cat) =>
        cat.title.toLowerCase().includes(q) ||
        cat.subtitle.toLowerCase().includes(q) ||
        cat.macroGroup.toLowerCase().includes(q) ||
        cat.nodes.some(
          (n) =>
            n.name.toLowerCase().includes(q) ||
            n.details.toLowerCase().includes(q) ||
            n.formula.toLowerCase().includes(q)
        )
    );
  }, [searchQuery]);

  // Generate lossless export serialization (JSON-LD / OWL, Graphviz DOT, or LaTeX TikZ)
  const serializedSpec = useMemo(() => {
    if (exportFormat === 'jsonld') {
      const doc = {
        '@context': {
          mathAtlas: 'https://math-atlas.org/ontology#',
          lean4: 'https://leanprover-community.github.io/mathlib4_docs/',
          abstractionLevel: 'mathAtlas:abstractionLevel',
          relation: 'mathAtlas:structuralRelation'
        },
        '@id': 'mathAtlas:LosslessKnowledgeGraph_v1',
        totalCategories: FORTY_CATEGORIES_SCHEMA.length,
        coreNodes: ATLAS_NODES.map((n) => ({
          '@id': `mathAtlas:${n.id}`,
          label: n.label,
          type: n.nodeType,
          discipline: n.discipline,
          abstractionLevel: n.abstractionLevel,
          formula: n.formula,
          patterns: n.patterns
        })),
        semanticEdges: ATLAS_EDGES.map((e) => ({
          source: `mathAtlas:${e.source}`,
          relation: e.relation,
          target: `mathAtlas:${e.target}`,
          formulaBridge: e.formulaBridge
        }))
      };
      return JSON.stringify(doc, null, 2);
    } else if (exportFormat === 'graphviz') {
      const lines = [
        'digraph MathAtlas {',
        '  rankdir=BT;',
        '  bgcolor="#090b10";',
        '  node [shape=box, style="rounded,filled", fillcolor="#0f131c", fontcolor="#e2e8f0", fontname="JetBrains Mono"];',
        '  edge [fontname="JetBrains Mono", fontsize=10];',
        ...ATLAS_NODES.map(
          (n) => `  "${n.id}" [label="L${n.abstractionLevel}: ${n.label.replace(/"/g, "'")}"];`
        ),
        ...ATLAS_EDGES.map(
          (e) => `  "${e.source}" -> "${e.target}" [label="${e.relation}"];`
        ),
        '}'
      ];
      return lines.join('\n');
    } else {
      return [
        '% schema_strutture.tex — LaTeX TikZ Master Architecture (40 Categorie & 7 Archi Trasversali)',
        '\\documentclass[border=25pt]{standalone}',
        '\\usepackage[utf8]{inputenc}',
        '\\usepackage{amsmath,amssymb,amsfonts}',
        '\\usepackage{tikz}',
        '\\usetikzlibrary{arrows.meta,positioning,fit,backgrounds,shapes.geometric}',
        '',
        '% Motivo Universale del Quoziente:',
        '% T(V)/<u⊗v - v⊗u> = Sym(V)',
        '% T(V)/<v⊗v>       = \\Lambda(V)',
        '% T(V)/<v⊗v - q(v)> = Cl(V,q)',
        '% T(g)/<x⊗y-y⊗x-[x,y]> = U(g)',
        '% R[x]/(x^2+1)     = C',
        '% R[ε]/(ε^2)       = Numeri Duali (Automatic Differentiation)',
        '',
        '\\begin{document}',
        '\\begin{tikzpicture}[>=Latex, node distance=1.8cm]',
        '  \\node[draw, fill=blue!10, rounded corners] (tri) {Triangolo (2-Simplesso $\\Delta^2$)};',
        '  \\node[draw, fill=green!10, rounded corners, right=of tri] (simp) {$n$-Simplesso $\\Delta^n$ \\& Politopi};',
        '  \\node[draw, fill=orange!10, rounded corners, above=of simp] (stokes) {Forme Differenziali $\\omega$ \\& Stokes $\\langle\\partial\\Omega,\\omega\\rangle=\\langle\\Omega,d\\omega\\rangle$};',
        '  \\node[draw, fill=purple!10, rounded corners, right=of stokes] (mhc) {Politopo di Birkhoff $\\mathcal{B}_n$ (mHC) \\& Tori KAM};',
        '  \\draw[->, thick] (tri) -- node[above]{generalizza} (simp);',
        '  \\draw[<->, thick, dashed] (simp) -- node[right]{dualita $\\partial \\dashv d$} (stokes);',
        '  \\draw[->, thick] (simp) -- node[below]{Sinkhorn-Knopp} (mhc);',
        '\\end{tikzpicture}',
        '\\end{document}'
      ].join('\n');
    }
  }, [exportFormat]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(serializedSpec);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation Header */}
      <div className="bg-[#0f131c] border border-slate-800/90 rounded-lg p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono-tech text-pink-400 uppercase tracking-wider">
            Enciclopedia Strutturale Lossless & Specifica Formale Math-Atlas
          </div>
          <h2 className="text-2xl font-serif-editorial font-semibold text-slate-100 mt-1">
            40 Categorie (`schema_strutture.tex`), 9 Ponti Strutturali, Trattato in 24 Capitoli & MathLingua CNL
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'taxonomy40', label: '1. Tassonomia 40 Categorie & 7 Scoperte', icon: GitBranch },
            { id: 'bridges9', label: '2. I 9 Ponti & Bibliografia/MOOC', icon: GraduationCap },
            { id: 'book24', label: '3. Architettura Libro (24 Capitoli)', icon: BookOpen },
            { id: 'cnl_lean', label: '4. MathLingua CNL → Lean 4 & Export', icon: Code2 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSection(tab.id as any)}
                className={`px-3 py-2 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  section === tab.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-semibold'
                    : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: 40 Categories Schema + 7 Cross-Category Discoveries */}
      {section === 'taxonomy40' && (
        <div className="space-y-6">
          {/* 7 Cross-Category Discoveries Banner */}
          <div className="bg-[#0f131c] border border-amber-500/30 rounded-lg p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-lg font-serif-editorial font-semibold text-amber-200">
                I 7 Collegamenti Trasversali Espliciti (`schema_strutture.tex` — Archi Tratteggiati Cross-Categoria)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 text-xs">
              {SEVEN_CROSS_CATEGORY_DISCOVERIES.map((disc) => (
                <div
                  key={disc.id}
                  className="bg-[#090b10] border border-slate-800 rounded p-3.5 space-y-1.5"
                >
                  <div className="text-[11px] font-mono-tech text-amber-400">
                    {disc.fromCategory} → {disc.toCategory}
                  </div>
                  <div className="font-semibold text-slate-100">
                    Relazione: <span className="text-emerald-300">{disc.relationLabel}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {disc.mathematicalProofOrMeaning}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Search Bar across all 40 Categories */}
          <div className="flex items-center gap-3 bg-[#0f131c] border border-slate-800 rounded-lg px-4 py-2.5">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca tra le 40 Categorie e oltre 200 strutture (es. Noetheriano, Gröbner, Galois, Clifford, Sobolev, Poincaré, Coxeter, Birkhoff)..."
              className="w-full bg-transparent text-xs text-slate-100 focus:outline-none"
            />
            <span className="text-xs font-mono-tech text-slate-400 shrink-0">
              {filteredCategories.length} / 40 Categorie
            </span>
          </div>

          {/* 40 Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-[#0f131c] border border-slate-800/90 rounded-lg p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div>
                    <span
                      style={{ color: cat.colorHex }}
                      className="text-[11px] font-mono-tech uppercase"
                    >
                      {cat.macroGroup}
                    </span>
                    <h4 className="text-base font-serif-editorial font-semibold text-slate-100">
                      {cat.title}
                    </h4>
                    <p className="text-xs text-slate-400">{cat.subtitle}</p>
                  </div>
                </div>

                <code className="block text-[11px] font-mono-tech text-sky-300 bg-[#090b10] border border-slate-800/80 p-2 rounded overflow-x-auto">
                  {cat.keyFormula}
                </code>

                <div className="space-y-2 pt-1">
                  {cat.nodes.map((nd, idx) => (
                    <div
                      key={idx}
                      className="bg-[#090b10] border border-slate-800/60 rounded p-2.5 text-xs space-y-1"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="font-semibold text-slate-200">{nd.name}</span>
                        <code className="text-[10px] font-mono-tech text-amber-300">
                          {nd.formula}
                        </code>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{nd.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: The 9 Structural Bridges + Annotated Bibliography & 5-Phase Study Plan */}
      {section === 'bridges9' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {NINE_STRUCTURAL_BRIDGES.map((bridge) => (
              <div
                key={bridge.id}
                className="bg-[#0f131c] border border-slate-800/90 rounded-lg p-5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="text-[11px] font-mono-tech text-amber-400">
                    {bridge.subjectsConnected}
                  </div>
                  <h3 className="text-base font-serif-editorial font-semibold text-slate-100">
                    {bridge.title}
                  </h3>
                  <code className="block text-[11px] font-mono-tech text-sky-300 bg-[#090b10] border border-slate-800 p-2 rounded overflow-x-auto">
                    {bridge.coreFormula}
                  </code>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-sky-400">Lato Algebrico:</strong> {bridge.algebraicSide}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-emerald-400">Lato Analitico/Geometrico:</strong>{' '}
                    {bridge.analyticGeometricSide}
                  </p>
                </div>
                <div className="bg-amber-950/20 border-l-2 border-amber-400 pl-3 py-1.5 text-[11px] text-amber-100/90 mt-2">
                  <strong>Sintesi:</strong> {bridge.synthesisAndApplication}
                </div>
              </div>
            ))}
          </div>

          {/* Annotated Bibliography & MOOC Roadmap */}
          <div className="bg-[#0f131c] border border-slate-800/90 rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-serif-editorial font-semibold text-slate-100">
              Bibliografia Ragionata & Percorso di Studio in 5 Fasi (Testi Classici, IA & MOOC)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ANNOTATED_BIBLIOGRAPHY.map((book, idx) => (
                <div
                  key={idx}
                  className="bg-[#090b10] border border-slate-800 rounded p-4 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-tech text-sky-400 uppercase">
                      {book.category}
                    </span>
                    <span className="text-xs font-mono-tech text-amber-300">{book.author}</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-100">{book.title}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{book.whyEssential}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: 24-Chapter + 3-Appendix Book Specification */}
      {section === 'book24' && (
        <div className="space-y-4">
          <div className="bg-[#0f131c] border border-slate-800/90 rounded-lg p-5">
            <h3 className="text-xl font-serif-editorial font-semibold text-slate-100">
              Specifica Editoriale Completa: "Geometria Euclidea e Oltre — Nel Formalismo dell’Algebra Lineare" (14 Parti, 24 Capitoli, 3 Appendici)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Dal prodotto scalare in ℝⁿ alla Retta di Eulero e al Cerchio di Feuerbach, dalla Matrice di Gram ed Erone agli n-Simplessi, Politopi (Eulero-Poincaré via B₁B₂=0), Coniche/Quadriche, Proiettiva, Quaternioni, Forme Differenziali, Superfici (Gauss-Bonnet) e Semipiano Iperbolico di Poincaré.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TWENTY_FOUR_CHAPTERS_BOOK_SPEC.map((ch) => (
              <div
                key={ch.chapterNumber}
                className="bg-[#0f131c] border border-slate-800/90 rounded-lg p-5 space-y-3"
              >
                <div className="flex items-center justify-between text-[11px] font-mono-tech text-amber-400">
                  <span>
                    {ch.partNumber} — {ch.partTitle}
                  </span>
                  <span>Cap. {ch.chapterNumber}</span>
                </div>
                <h4 className="text-base font-serif-editorial font-semibold text-slate-100">
                  {ch.chapterTitle}
                </h4>
                <code className="block text-[11px] font-mono-tech text-sky-300 bg-[#090b10] border border-slate-800 p-2 rounded overflow-x-auto">
                  {ch.keyFormulas}
                </code>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc pl-4">
                  {ch.coreTheoremsAndProofs.map((thm, i) => (
                    <li key={i} className="leading-relaxed">
                      {thm}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: MathLingua CNL -> Lean 4 Translator & Formal Schema Exporter */}
      {section === 'cnl_lean' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: MathLingua CNL Workbench (7 cols) */}
          <div className="lg:col-span-7 bg-[#0f131c] border border-slate-800/90 rounded-lg p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-mono-tech text-emerald-400 uppercase">
                Ponte Linguistico Formale (Ispirato a Naproche / ForTheL / MathLingua & Axiom Math)
              </span>
              <h3 className="text-xl font-serif-editorial font-semibold text-slate-100 mt-1">
                Traduttore da Linguaggio Naturale Controllato (CNL) a AST & Lean 4 / Mathlib
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {CNL_PRESETS.map((preset, idx) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedPresetIdx(idx);
                    setCustomCnl(preset.cnlInput);
                  }}
                  className={`px-2.5 py-1.5 rounded text-xs font-mono-tech cursor-pointer border ${
                    selectedPresetIdx === idx
                      ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/50 font-semibold'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {preset.title}
                </button>
              ))}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-mono-tech text-slate-400 mb-1">
                  1. Input in Linguaggio Naturale Controllato (MathLingua Italiano):
                </label>
                <textarea
                  rows={4}
                  value={customCnl}
                  onChange={(e) => setCustomCnl(e.target.value)}
                  className="w-full bg-[#090b10] border border-slate-800 rounded p-3 font-mono-tech text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-mono-tech text-amber-400 mb-1">
                  2. Albero Sintattico Astratto (AST Semantico Intermedio):
                </label>
                <pre className="bg-[#090b10] border border-slate-800 rounded p-3 font-mono-tech text-amber-300 overflow-x-auto">
                  {CNL_PRESETS[selectedPresetIdx].astOutput}
                </pre>
              </div>

              <div>
                <label className="block font-mono-tech text-emerald-400 mb-1">
                  3. Codice Formale Verificabile Lean 4 / Mathlib:
                </label>
                <pre className="bg-[#090b10] border border-slate-800 rounded p-3 font-mono-tech text-emerald-300 overflow-x-auto">
                  {CNL_PRESETS[selectedPresetIdx].lean4Output}
                </pre>
              </div>
            </div>
          </div>

          {/* Right: JSON-LD / OWL / Graphviz DOT / TikZ Exporter (5 cols) */}
          <div className="lg:col-span-5 bg-[#0f131c] border border-slate-800/90 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono-tech text-sky-400 uppercase flex items-center gap-1">
                  <FileCode className="w-3.5 h-3.5" />
                  Esportazione Ontologia Formale
                </span>
                <h3 className="text-lg font-serif-editorial font-semibold text-slate-100">
                  JSON-LD / OWL · Graphviz DOT · LaTeX TikZ
                </h3>
              </div>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-tech flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiato' : 'Copia'}
              </button>
            </div>

            <div className="flex gap-2">
              {[
                { id: 'jsonld', label: 'JSON-LD / OWL' },
                { id: 'graphviz', label: 'Graphviz (.dot)' },
                { id: 'tikz', label: 'LaTeX TikZ' }
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setExportFormat(fmt.id as any)}
                  className={`px-3 py-1 rounded text-xs font-mono-tech cursor-pointer ${
                    exportFormat === fmt.id
                      ? 'bg-sky-500 text-slate-950 font-semibold'
                      : 'bg-slate-900 text-slate-300'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>

            <pre className="bg-[#090b10] border border-slate-800 rounded p-3 text-[11px] font-mono-tech text-slate-300 h-[360px] overflow-auto">
              {serializedSpec}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
