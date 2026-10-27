import React, { useState, useMemo } from 'react';
import {
  ROSETTA_STONE_TABLE,
  MHC_VS_SPACE_HIGHWAYS_COMPARISON
} from '../data/bridgesAndCompendium';
import { Calculator, Cpu, ArrowRight, Layers, Sparkles } from 'lucide-react';

export const OperatorCalculusLab: React.FC = () => {
  // 1. Polynomial vector p(x) = c0 + c1 x + c2 x^2 + c3 x^3 in P_3(R)
  const [c0, setC0] = useState<number>(5);
  const [c1, setC1] = useState<number>(3);
  const [c2, setC2] = useState<number>(-4);
  const [c3, setC3] = useState<number>(2);

  // 2. Dual Number ℝ[ε]/(ε^2) Automatic Differentiation evaluator
  const [dualX, setDualX] = useState<number>(2.0);
  const [dualFunc, setDualFunc] = useState<'poly' | 'sin_exp' | 'rational'>('poly');

  // 3. Sinkhorn-Knopp Birkhoff Polytope (DeepSeek mHC) simulator
  const [sinkhornSteps, setSinkhornSteps] = useState<number>(6);

  // Derivative matrix action A_D * [c0, c1, c2, c3]^T
  const d1 = useMemo(() => [c1, 2 * c2, 3 * c3, 0], [c1, c2, c3]);
  const d2 = useMemo(() => [2 * c2, 6 * c3, 0, 0], [c2, c3]);

  // Dual Number step-by-step evaluation
  const dualResult = useMemo(() => {
    const x = dualX;
    if (dualFunc === 'poly') {
      // f(x) = x^3 - 3x^2 + 4x + 2
      // (x + ε)^3 = x^3 + 3x^2 ε (since ε^2 = ε^3 = 0)
      const val = x * x * x - 3 * x * x + 4 * x + 2;
      const deriv = 3 * x * x - 6 * x + 4;
      return {
        expr: 'f(x) = x³ - 3x² + 4x + 2',
        expansion: `(x+ε)³ - 3(x+ε)² + 4(x+ε) + 2 = (x³ + 3x²ε) - 3(x² + 2xε) + (4x + 4ε) + 2`,
        val,
        deriv
      };
    } else if (dualFunc === 'sin_exp') {
      // f(x) = e^x * sin(x)
      const val = Math.exp(x) * Math.sin(x);
      const deriv = Math.exp(x) * (Math.sin(x) + Math.cos(x));
      return {
        expr: 'f(x) = eˣ · sin(x)',
        expansion: `e^{x+ε} sin(x+ε) = (eˣ + eˣε)(sin x + cos x · ε) = eˣ sin x + eˣ(sin x + cos x)ε + eˣ cos x · ε²(=0)`,
        val,
        deriv
      };
    } else {
      // f(x) = (x^2 + 1) / (x + 2)
      const denom = x + 2;
      const val = (x * x + 1) / denom;
      const deriv = (2 * x * denom - (x * x + 1)) / (denom * denom);
      return {
        expr: 'f(x) = (x² + 1) / (x + 2)',
        expansion: `[(x²+1) + 2xε] · [(x+2) - ε] / (x+2)² = (x²+1)/(x+2) + [(2x(x+2) - (x²+1))/(x+2)²]ε`,
        val,
        deriv
      };
    }
  }, [dualX, dualFunc]);

  // Sinkhorn-Knopp projection onto Birkhoff Polytope B_3
  const sinkhornData = useMemo(() => {
    // Raw unnormalized positive matrix exp(W)
    let M = [
      [4.2, 0.8, 1.5],
      [0.5, 3.1, 2.4],
      [1.8, 2.2, 0.4]
    ];

    for (let s = 0; s < sinkhornSteps; s++) {
      // Row normalization
      M = M.map((row) => {
        const sum = row[0] + row[1] + row[2];
        return row.map((v) => v / sum);
      });
      // Column normalization
      for (let col = 0; col < 3; col++) {
        const colSum = M[0][col] + M[1][col] + M[2][col];
        for (let row = 0; row < 3; row++) {
          M[row][col] /= colSum;
        }
      }
    }

    const rowSums = M.map((r) => r[0] + r[1] + r[2]);
    const colSums = [0, 1, 2].map((c) => M[0][c] + M[1][c] + M[2][c]);
    return { matrix: M, rowSums, colSums };
  }, [sinkhornSteps]);

  return (
    <div className="space-y-8">
      {/* Section 1: Derivative as a Matrix & Infinite-Dimensional Linear Algebra */}
      <div className="bg-[#0f131c] border border-slate-800/90 rounded-lg p-6 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="text-xs font-mono-tech text-emerald-400 uppercase tracking-wider">
            Ponte Fondamentale: L’Analisi Matematica è Algebra Lineare in Dimensione Infinita
          </div>
          <h2 className="text-2xl font-serif-editorial font-semibold text-slate-100 mt-1">
            L’Operatore Derivata D = d/dx come Matrice Nilpotente & Gli Esponenziali come Autovettori
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sullo spazio vettoriale dei polinomi P₃(ℝ) con base ordinata &#123;1, x, x², x³&#125;, derivare non è un processo misterioso: è il prodotto riga per colonna con la matrice sovradiagonale A_D!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Polynomial Controls */}
          <div className="lg:col-span-4 bg-[#090b10] border border-slate-800 rounded p-4 space-y-3 text-xs">
            <div className="font-mono-tech text-amber-400 uppercase text-[11px]">
              Vettore Polinomio p(x) = c₀ + c₁x + c₂x² + c₃x³
            </div>
            {[
              { label: 'c₀ (Termine costante ∈ ker D)', val: c0, set: setC0, color: 'accent-rose-400' },
              { label: 'c₁ (Coeff. di x)', val: c1, set: setC1, color: 'accent-sky-400' },
              { label: 'c₂ (Coeff. di x²)', val: c2, set: setC2, color: 'accent-emerald-400' },
              { label: 'c₃ (Coeff. di x³)', val: c3, set: setC3, color: 'accent-amber-400' }
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between font-mono-tech text-[11px] mb-0.5">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="text-slate-100 font-semibold">{item.val}</span>
                </div>
                <input
                  type="range"
                  min="-9"
                  max="9"
                  step="1"
                  value={item.val}
                  onChange={(e) => item.set(parseInt(e.target.value, 10))}
                  className={`w-full ${item.color}`}
                />
              </div>
            ))}
            <div className="pt-2 border-t border-slate-800 font-mono-tech text-[11px] text-rose-300">
              Nota: Variando c₀, la derivata prima p'(x) NON cambia! Perché c₀·1 appartiene al Nucleo ker(D) (le rette orizzontali vengono schiacciate a zero, origine geometrica del "+ C").
            </div>
          </div>

          {/* Matrix Multiplication Visualizer */}
          <div className="lg:col-span-8 bg-[#090b10] border border-slate-800 rounded p-5 space-y-4">
            <div className="text-xs font-mono-tech text-slate-400">
              Azione Matriciale Esatta: A_D · v_p = v_&#123;p'&#125; (e nilpotenza A_D⁴ = 0 su P₃)
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 font-mono-tech text-xs">
              {/* 4x4 Derivative Matrix */}
              <div className="bg-slate-900/90 border border-slate-700 p-2.5 rounded">
                <div className="text-[10px] text-slate-400 text-center mb-1">Matrice A_D</div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <span className="text-slate-600">0</span>
                  <span className="text-emerald-400 font-bold">1</span>
                  <span className="text-slate-600">0</span>
                  <span className="text-slate-600">0</span>

                  <span className="text-slate-600">0</span>
                  <span className="text-slate-600">0</span>
                  <span className="text-emerald-400 font-bold">2</span>
                  <span className="text-slate-600">0</span>

                  <span className="text-slate-600">0</span>
                  <span className="text-slate-600">0</span>
                  <span className="text-slate-600">0</span>
                  <span className="text-emerald-400 font-bold">3</span>

                  <span className="text-slate-600">0</span>
                  <span className="text-slate-600">0</span>
                  <span className="text-slate-600">0</span>
                  <span className="text-slate-600">0</span>
                </div>
              </div>

              <span className="text-lg text-slate-400">×</span>

              {/* Input Vector */}
              <div className="bg-slate-900/90 border border-sky-500/40 p-2.5 rounded text-center">
                <div className="text-[10px] text-sky-400 mb-1">p(x)</div>
                <div className="flex flex-col gap-1 text-sky-200">
                  <span>{c0} (·1)</span>
                  <span>{c1} (·x)</span>
                  <span>{c2} (·x²)</span>
                  <span>{c3} (·x³)</span>
                </div>
              </div>

              <span className="text-lg text-slate-400">=</span>

              {/* First Derivative Vector */}
              <div className="bg-slate-900/90 border border-amber-500/40 p-2.5 rounded text-center">
                <div className="text-[10px] text-amber-400 mb-1">p'(x) = A_D v</div>
                <div className="flex flex-col gap-1 text-amber-200 font-semibold">
                  <span>{d1[0]} (·1)</span>
                  <span>{d1[1]} (·x)</span>
                  <span>{d1[2]} (·x²)</span>
                  <span className="text-slate-500">0 (·x³)</span>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-500" />

              {/* Second Derivative Vector */}
              <div className="bg-slate-900/90 border border-pink-500/40 p-2.5 rounded text-center">
                <div className="text-[10px] text-pink-400 mb-1">p''(x) = A_D² v</div>
                <div className="flex flex-col gap-1 text-pink-200">
                  <span>{d2[0]} (·1)</span>
                  <span>{d2[1]} (·x)</span>
                  <span className="text-slate-500">0 (·x²)</span>
                  <span className="text-slate-500">0 (·x³)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-[#0d121d] border border-slate-800 p-3 rounded">
                <div className="font-semibold text-emerald-300 mb-1">
                  Perché e^&#123;λx&#125; è l’autovettore della derivata?
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Nello spazio infinito-dimensionale delle serie di Taylor <code className="text-sky-300">e^&#123;λx&#125; = [1, λ, λ²/2!, λ³/3!, ...]ᵀ</code>, moltiplicare per la matrice infinita <code className="text-emerald-300">A_D</code> (con 1, 2, 3,... sulla sovradiagonale) sposta il vettore di un posto in alto e semplifica i fattoriali: <code className="text-amber-300">k · λ^k / k! = λ · λ^&#123;k-1&#125; / (k-1)!</code>, restituendo <code className="text-amber-300">λ · e^&#123;λx&#125;</code>!
                </p>
              </div>
              <div className="bg-[#0d121d] border border-slate-800 p-3 rounded">
                <div className="font-semibold text-pink-300 mb-1">
                  Integrazione per Parti = Trasposta Antisimmetrica (Dᵀ = -D)
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Con il prodotto scalare funzionale <code className="text-sky-300">⟨f, g⟩ = ∫ f(x)g(x) dx</code> (con funzioni nulle al bordo), l’integrazione per parti <code className="text-amber-300">∫ f' g dx = - ∫ f g' dx</code> si scrive <code className="text-emerald-300">⟨Df, g⟩ = ⟨f, -Dg⟩</code>: la derivata ha come matrice trasposta <code className="text-pink-300">Dᵀ = -D</code>!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Dual Numbers ℝ[ε]/(ε²) & Birkhoff Polytope Sinkhorn-Knopp (DeepSeek mHC) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dual Numbers Automatic Differentiation */}
        <div className="bg-[#0f131c] border border-slate-800/90 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-mono-tech text-amber-400 uppercase flex items-center gap-1">
                <Calculator className="w-3.5 h-3.5" />
                Ponte Algebra ↔ Analisi ↔ IA
              </span>
              <h3 className="text-lg font-serif-editorial font-semibold text-slate-100">
                Numeri Duali ℝ[ε]/(ε²) & Automatic Differentiation
              </h3>
            </div>
            <span className="text-xs font-mono-tech bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
              ε ≠ 0 ma ε² = 0
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setDualFunc('poly')}
              className={`px-2.5 py-1 rounded font-mono-tech cursor-pointer ${
                dualFunc === 'poly' ? 'bg-amber-500 text-slate-950 font-semibold' : 'bg-slate-900 text-slate-300'
              }`}
            >
              x³ - 3x² + 4x + 2
            </button>
            <button
              onClick={() => setDualFunc('sin_exp')}
              className={`px-2.5 py-1 rounded font-mono-tech cursor-pointer ${
                dualFunc === 'sin_exp' ? 'bg-amber-500 text-slate-950 font-semibold' : 'bg-slate-900 text-slate-300'
              }`}
            >
              eˣ · sin(x)
            </button>
            <button
              onClick={() => setDualFunc('rational')}
              className={`px-2.5 py-1 rounded font-mono-tech cursor-pointer ${
                dualFunc === 'rational' ? 'bg-amber-500 text-slate-950 font-semibold' : 'bg-slate-900 text-slate-300'
              }`}
            >
              (x² + 1) / (x + 2)
            </button>
          </div>

          <div className="text-xs">
            <div className="flex justify-between font-mono-tech mb-1">
              <span className="text-slate-300">Punto di valutazione x₀ (input duale x₀ + 1·ε):</span>
              <span className="text-sky-300">{dualX.toFixed(2)} + 1·ε</span>
            </div>
            <input
              type="range"
              min="-1.5"
              max="3.0"
              step="0.05"
              value={dualX}
              onChange={(e) => setDualX(parseFloat(e.target.value))}
              className="w-full accent-sky-400"
            />
          </div>

          <div className="bg-[#090b10] border border-slate-800 rounded p-3.5 space-y-2 font-mono-tech text-xs">
            <div className="text-[11px] text-slate-400">Espansione nell’anello quoziente ℝ[ε]/(ε²):</div>
            <div className="text-slate-300 text-[11px] leading-relaxed">{dualResult.expansion}</div>
            <div className="pt-2 border-t border-slate-800 flex flex-wrap justify-between gap-2">
              <div>
                <span className="text-slate-400 block text-[10px]">Parte Reale f(x₀):</span>
                <span className="text-sky-300 text-sm font-semibold">{dualResult.val.toFixed(4)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Coeff. di ε = Derivata Esatta f'(x₀):</span>
                <span className="text-emerald-300 text-sm font-semibold">{dualResult.deriv.toFixed(4)} · ε</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sinkhorn-Knopp & Birkhoff Polytope (DeepSeek mHC) */}
        <div className="bg-[#0f131c] border border-slate-800/90 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-mono-tech text-sky-400 uppercase flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" />
                DeepSeek mHC (ArXiv 2512.24880)
              </span>
              <h3 className="text-lg font-serif-editorial font-semibold text-slate-100">
                Proiezione di Sinkhorn-Knopp sul Politopo di Birkhoff B_n
              </h3>
            </div>
            <span className="text-xs font-mono-tech bg-sky-500/15 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded">
              ||H||₂ ≤ 1.000
            </span>
          </div>

          <div className="text-xs">
            <div className="flex justify-between font-mono-tech mb-1">
              <span className="text-slate-300">Iterazioni di Sinkhorn-Knopp (0 = Matrice grezza instabile):</span>
              <span className="text-amber-300">k = {sinkhornSteps} passi</span>
            </div>
            <input
              type="range"
              min="0"
              max="8"
              step="1"
              value={sinkhornSteps}
              onChange={(e) => setSinkhornSteps(parseInt(e.target.value, 10))}
              className="w-full accent-amber-400"
            />
          </div>

          <div className="bg-[#090b10] border border-slate-800 rounded p-3.5 font-mono-tech text-xs space-y-2">
            <div className="grid grid-cols-4 gap-2 text-center items-center">
              <span className="text-[10px] text-slate-500">H^(k)</span>
              <span className="text-[10px] text-slate-400">Col 1</span>
              <span className="text-[10px] text-slate-400">Col 2</span>
              <span className="text-[10px] text-amber-400">Somma Riga</span>

              {sinkhornData.matrix.map((row, rIdx) => (
                <React.Fragment key={rIdx}>
                  <span className="text-sky-300">{row[0].toFixed(3)}</span>
                  <span className="text-sky-300">{row[1].toFixed(3)}</span>
                  <span className="text-sky-300">{row[2].toFixed(3)}</span>
                  <span className="text-amber-300 font-semibold">
                    = {sinkhornData.rowSums[rIdx].toFixed(3)}
                  </span>
                </React.Fragment>
              ))}

              <span className="text-emerald-400 font-semibold">
                Σ = {sinkhornData.colSums[0].toFixed(3)}
              </span>
              <span className="text-emerald-400 font-semibold">
                Σ = {sinkhornData.colSums[1].toFixed(3)}
              </span>
              <span className="text-emerald-400 font-semibold">
                Σ = {sinkhornData.colSums[2].toFixed(3)}
              </span>
              <span className="text-[10px] text-emerald-300">Birkhoff B₃</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Per il <strong>Teorema di Birkhoff-von Neumann</strong>, le matrici doppiamente stocastiche (somma righe = 1, somma colonne = 1) sono l’inviluppo convesso delle matrici di permutazione. Vincolando le Hyper-Connections su questo politopo, il segnale nei modelli LLM profondi non può mai esplodere!
          </p>
        </div>
      </div>

      {/* Section 3: Comparison Table — DeepSeek mHC vs Sub-Riemannian Space Highways */}
      <div className="bg-[#0f131c] border border-slate-800/90 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <h3 className="text-xl font-serif-editorial font-semibold text-slate-100">
            Analogia Strutturale Trasversale: Varietà mHC (DeepSeek) ↔ Autostrade Spaziali Sub-Riemanniane (Meccanica Celeste)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono-tech">
                <th className="py-2.5 px-3">Dimensione Strutturale</th>
                <th className="py-2.5 px-3 text-sky-300">IA & Deep Learning: mHC (ArXiv 2512.24880)</th>
                <th className="py-2.5 px-3 text-amber-300">Meccanica Celeste: Autostrade Spaziali (Baresi-Owen / Todorović)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {MHC_VS_SPACE_HIGHWAYS_COMPARISON.map((row, i) => (
                <tr key={i} className="hover:bg-slate-900/50">
                  <td className="py-3 px-3 font-semibold text-slate-200">{row.aspect}</td>
                  <td className="py-3 px-3 text-slate-300 leading-relaxed">{row.deepseekMhc}</td>
                  <td className="py-3 px-3 text-slate-300 leading-relaxed">{row.spaceHighways}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 4: The Complete Rosetta Stone Table */}
      <div className="bg-[#0f131c] border border-slate-800/90 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xl font-serif-editorial font-semibold text-slate-100">
            La "Stele di Rosetta" della Matematica (Algebra Lineare ↔ Analisi Funzionale ↔ Fisica)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono-tech">
                <th className="py-2.5 px-3">Concetto Strutturale</th>
                <th className="py-2.5 px-3 text-sky-300">Algebra Lineare (Dimensione Finita ℝⁿ)</th>
                <th className="py-2.5 px-3 text-emerald-300">Analisi Matematica (Dimensione Infinita L²/C^∞)</th>
                <th className="py-2.5 px-3 text-amber-300">Significato Fisico & Geometrico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {ROSETTA_STONE_TABLE.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-200">{row.concept}</td>
                  <td className="py-2.5 px-3 font-mono-tech text-slate-300">{row.linearAlgebraFinite}</td>
                  <td className="py-2.5 px-3 font-mono-tech text-slate-300">{row.functionalAnalysisInfinite}</td>
                  <td className="py-2.5 px-3 text-slate-300">{row.physicalGeometricMeaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
