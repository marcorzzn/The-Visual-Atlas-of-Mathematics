import React, { useState, useMemo } from 'react';
import {
  ROTATION_REPRESENTATIONS,
  LINEAR_SYSTEMS_COMPENDIUM,
  MATRIX_STRUCTURES_COMPENDIUM
} from '../data/bridgesAndCompendium';
import { Compass, Triangle, Layers, Sparkles, Grid } from 'lucide-react';

export const RotationsAndProjectiveLab: React.FC = () => {
  // 1. Live Multi-Representation Rotation state
  const [angleDeg, setAngleDeg] = useState<number>(60); // range 0..720 to demonstrate Spinor/Quaternion 360 vs 720
  const [ux, setUx] = useState<number>(0);
  const [uy, setUy] = useState<number>(0);
  const [uz, setUz] = useState<number>(1);

  // 2. Interactive Projective Collinearity & Homogeneous Determinant (Z = 1)
  const [p1, setP1] = useState<{ x: number; y: number }>({ x: 1, y: 1 });
  const [p2, setP2] = useState<{ x: number; y: number }>({ x: 3, y: 2 });
  const [p3, setP3] = useState<{ x: number; y: number }>({ x: 5, y: 3 }); // Default collinear!

  // Compute simultaneous representations of the 3D rotation
  const rotCalc = useMemo(() => {
    const norm = Math.hypot(ux, uy, uz) || 1;
    const nx = ux / norm;
    const ny = uy / norm;
    const nz = uz / norm;
    const rad = (angleDeg * Math.PI) / 180;
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    const t = 1 - c;

    // 3x3 Rodrigues / SO(3) Matrix
    const R = [
      [t * nx * nx + c, t * nx * ny - s * nz, t * nx * nz + s * ny],
      [t * nx * ny + s * nz, t * ny * ny + c, t * ny * nz - s * nx],
      [t * nx * nz - s * ny, t * ny * nz + s * nx, t * nz * nz + c]
    ];

    // Unit Quaternion q = cos(θ/2) + sin(θ/2)(nx i + ny j + nz k)
    const half = rad / 2;
    const qw = Math.cos(half);
    const qx = nx * Math.sin(half);
    const qy = ny * Math.sin(half);
    const qz = nz * Math.sin(half);

    // Lie Algebra generator X = θ [n]_x in so(3)
    const X = [
      [0, -rad * nz, rad * ny],
      [rad * nz, 0, -rad * nx],
      [-rad * ny, rad * nx, 0]
    ];

    return { nx, ny, nz, R, qw, qx, qy, qz, X, traceR: R[0][0] + R[1][1] + R[2][2] };
  }, [angleDeg, ux, uy, uz]);

  // Compute 3x3 Homogeneous Determinant & 2x2 Affine Difference Determinant
  const collinCalc = useMemo(() => {
    // det [[x1, y1, 1], [x2, y2, 1], [x3, y3, 1]]
    const det3 =
      p1.x * (p2.y - p3.y) -
      p1.y * (p2.x - p3.x) +
      1 * (p2.x * p3.y - p3.x * p2.y);
    const dx2 = p2.x - p1.x;
    const dy2 = p2.y - p1.y;
    const dx3 = p3.x - p1.x;
    const dy3 = p3.y - p1.y;
    const area = 0.5 * Math.abs(det3);
    const isCollinear = Math.abs(det3) < 1e-5;
    return { det3, dx2, dy2, dx3, dy3, area, isCollinear };
  }, [p1, p2, p3]);

  return (
    <div className="space-y-8">
      {/* PART 1: Parallel Representations of Rotations (SO(3) ↔ Quaternions ↔ Lie so(3) ↔ Clifford Bivectors) */}
      <div className="bg-[#0f131c] border border-slate-800/90 rounded-lg p-6 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="text-xs font-mono-tech text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            Viste Alternative Parallele: Lo Stesso Oggetto Matematico in 4 Formalismi Simultanei
          </div>
          <h2 className="text-2xl font-serif-editorial font-semibold text-slate-100 mt-1">
            Rotazioni 3D: Matrici SO(3), Quaternioni ℍ, Algebre di Lie so(3), Bivettori di Clifford & Spinori (720°)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Muovi l’angolo da 0° a 720° per osservare la copertura doppia S³ → SO(3): a θ = 360° la matrice SO(3) torna all’identità I, ma il Quaternione e lo Spinore diventano -1 (servono 720° per tornare a +1!).
          </p>
        </div>

        {/* Sliders for Angle (0..720) and Axis */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#090b10] border border-slate-800 rounded p-4 text-xs">
          <div>
            <div className="flex justify-between font-mono-tech mb-1">
              <span className="text-amber-300 font-semibold">Angolo θ (0° → 720°):</span>
              <span className="text-amber-400">{angleDeg}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="720"
              step="5"
              value={angleDeg}
              onChange={(e) => setAngleDeg(parseInt(e.target.value, 10))}
              className="w-full accent-amber-400"
            />
            <div className="flex gap-1.5 mt-1.5 font-mono-tech text-[10px]">
              {[90, 180, 360, 720].map((deg) => (
                <button
                  key={deg}
                  onClick={() => setAngleDeg(deg)}
                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>

          {[
            { label: 'Asse u_x', val: ux, set: setUx },
            { label: 'Asse u_y', val: uy, set: setUy },
            { label: 'Asse u_z', val: uz, set: setUz }
          ].map((ax) => (
            <div key={ax.label}>
              <div className="flex justify-between font-mono-tech mb-1">
                <span className="text-slate-300">{ax.label}:</span>
                <span className="text-sky-300">{ax.val.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.1"
                value={ax.val}
                onChange={(e) => ax.set(parseFloat(e.target.value))}
                className="w-full accent-sky-400"
              />
            </div>
          ))}
        </div>

        {/* 4 Parallel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 font-mono-tech text-xs">
          {/* 1. SO(3) Matrix */}
          <div className="bg-[#090b10] border border-sky-500/30 rounded p-4 space-y-2">
            <div className="text-[11px] text-sky-400 uppercase font-semibold">
              1. Gruppo di Lie SO(3) (Matrice 3×3)
            </div>
            <div className="grid grid-cols-3 gap-1 text-center bg-slate-900/90 p-2 rounded text-[11px]">
              {rotCalc.R.flat().map((v, idx) => (
                <span key={idx} className="text-slate-200">
                  {v.toFixed(2)}
                </span>
              ))}
            </div>
            <div className="text-[10px] text-slate-400 pt-1">
              Tr(R) = 1 + 2cos θ = <span className="text-sky-300">{rotCalc.traceR.toFixed(2)}</span> · det(R) = +1.00
            </div>
          </div>

          {/* 2. Unit Quaternion / Spinor */}
          <div className="bg-[#090b10] border border-amber-500/30 rounded p-4 space-y-2">
            <div className="text-[11px] text-amber-400 uppercase font-semibold">
              2. Quaternione Unitario q ∈ S³ ⊂ ℍ
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded text-amber-200 text-xs leading-relaxed">
              q = {rotCalc.qw.toFixed(3)} + ({rotCalc.qx.toFixed(2)})i + ({rotCalc.qy.toFixed(2)})j + ({rotCalc.qz.toFixed(2)})k
            </div>
            <div className="text-[10px] text-slate-400">
              θ/2 = {(angleDeg / 2).toFixed(1)}° · {Math.abs(angleDeg - 360) < 5 ? 'A 360° q = -1 (inversione spinoriale!)' : '||q||² = 1.000'}
            </div>
          </div>

          {/* 3. Lie Algebra Generator so(3) */}
          <div className="bg-[#090b10] border border-emerald-500/30 rounded p-4 space-y-2">
            <div className="text-[11px] text-emerald-400 uppercase font-semibold">
              3. Algebra di Lie X ∈ so(3) (R = e^X)
            </div>
            <div className="grid grid-cols-3 gap-1 text-center bg-slate-900/90 p-2 rounded text-[11px]">
              {rotCalc.X.flat().map((v, idx) => (
                <span key={idx} className="text-emerald-200">
                  {v.toFixed(2)}
                </span>
              ))}
            </div>
            <div className="text-[10px] text-slate-400 pt-1">
              Xᵀ = -X · Identità di Jacobi: det(e^X) = e^&#123;Tr(X)&#125; = e⁰ = 1
            </div>
          </div>

          {/* 4. Clifford Geometric Algebra Rotor */}
          <div className="bg-[#090b10] border border-pink-500/30 rounded p-4 space-y-2">
            <div className="text-[11px] text-pink-400 uppercase font-semibold">
              4. Rotore di Clifford Cl⁺(ℝ³) (Bivettore)
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded text-pink-200 text-[11px] leading-relaxed">
              R = {rotCalc.qw.toFixed(2)} - ({rotCalc.qx.toFixed(2)} e₂∧e₃ + {rotCalc.qy.toFixed(2)} e₃∧e₁ + {rotCalc.qz.toFixed(2)} e₁∧e₂)
            </div>
            <div className="text-[10px] text-slate-400">
              Ruota nel PIANO del bivettore B = *(û) senza bisogno di un asse esterno (valido in N dimensioni!).
            </div>
          </div>
        </div>

        {/* Complete Comparative Cards of all Rotation Formalisms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {ROTATION_REPRESENTATIONS.map((rep) => (
            <div key={rep.id} className="bg-[#0b0e15] border border-slate-800/80 rounded p-3.5 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-100">{rep.name}</span>
                <span className="text-[10px] font-mono-tech text-amber-400">{rep.dimensionScope}</span>
              </div>
              <code className="block text-[11px] text-sky-300 font-mono-tech bg-slate-950 p-1.5 rounded">
                {rep.coreFormula}
              </code>
              <p className="text-[11px] text-slate-300">
                <strong className="text-emerald-400">Vantaggi:</strong> {rep.strengths}
              </p>
              <p className="text-[11px] text-slate-400">
                <strong className="text-rose-400">Limiti:</strong> {rep.limitations} · <strong className="text-slate-300">Uso:</strong> {rep.applicationDomains}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* PART 2: Projective Collinearity (Why the column of 1s exists!) & Linear Systems Compendium */}
      <div className="bg-[#0f131c] border border-slate-800/90 rounded-lg p-6 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="text-xs font-mono-tech text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Triangle className="w-3.5 h-3.5" />
            Geometria Proiettiva, Allineamento & Compendio dei Sistemi Lineari
          </div>
          <h2 className="text-2xl font-serif-editorial font-semibold text-slate-100 mt-1">
            Perché compare la Colonna di 1 nei Determinanti di Allineamento e Complanarità?
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tre ragioni unificate: (1) Termine noto algebrico c·1 = 0; (2) Immersione proiettiva sul piano Z = 1 in ℝP²; (3) Riduzione affine per sottrazione di riga al determinante 2×2 dell’area orientata!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Interactive 3 Points Sliders */}
          <div className="lg:col-span-5 bg-[#090b10] border border-slate-800 rounded p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between font-mono-tech text-[11px] text-amber-400">
              <span>Coordinate Affini P₁, P₂, P₃ → Omogenee [x : y : 1]</span>
              <button
                onClick={() => {
                  setP1({ x: 1, y: 1 });
                  setP2({ x: 3, y: 2 });
                  setP3({ x: 5, y: 3 });
                }}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 cursor-pointer"
              >
                Allinea Punti
              </button>
            </div>

            {[
              { label: 'P₁', pt: p1, set: setP1, color: 'text-sky-400' },
              { label: 'P₂', pt: p2, set: setP2, color: 'text-amber-400' },
              { label: 'P₃', pt: p3, set: setP3, color: 'text-pink-400' }
            ].map((item) => (
              <div key={item.label} className="grid grid-cols-2 gap-3 items-center pt-1 border-t border-slate-800/70">
                <div>
                  <span className={`font-mono-tech ${item.color} block text-[11px]`}>
                    {item.label}.x = {item.pt.x}
                  </span>
                  <input
                    type="range"
                    min="-4"
                    max="6"
                    step="0.5"
                    value={item.pt.x}
                    onChange={(e) => item.set({ ...item.pt, x: parseFloat(e.target.value) })}
                    className="w-full accent-sky-400"
                  />
                </div>
                <div>
                  <span className={`font-mono-tech ${item.color} block text-[11px]`}>
                    {item.label}.y = {item.pt.y}
                  </span>
                  <input
                    type="range"
                    min="-4"
                    max="6"
                    step="0.5"
                    value={item.pt.y}
                    onChange={(e) => item.set({ ...item.pt, y: parseFloat(e.target.value) })}
                    className="w-full accent-amber-400"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Live Row-Reduction Proof from 3x3 with 1s to 2x2 Area */}
          <div className="lg:col-span-7 bg-[#090b10] border border-slate-800 rounded p-5 space-y-4 font-mono-tech text-xs">
            <div className="text-[11px] text-slate-400">
              Equivalenza per Riduzione di Gauss (R₂ ← R₂ - R₁, R₃ ← R₃ - R₁):
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* 3x3 Homogeneous Matrix */}
              <div className="bg-slate-900 border border-slate-700 p-3 rounded text-center">
                <div className="text-[10px] text-slate-400 mb-1">det 3×3 (Piano Z=1)</div>
                <div className="grid grid-cols-3 gap-2">
                  <span>{p1.x}</span>
                  <span>{p1.y}</span>
                  <span className="text-amber-400 font-bold">1</span>

                  <span>{p2.x}</span>
                  <span>{p2.y}</span>
                  <span className="text-amber-400 font-bold">1</span>

                  <span>{p3.x}</span>
                  <span>{p3.y}</span>
                  <span className="text-amber-400 font-bold">1</span>
                </div>
              </div>

              <span className="text-slate-400">=</span>

              {/* Row-reduced 3x3 */}
              <div className="bg-slate-900 border border-slate-700 p-3 rounded text-center">
                <div className="text-[10px] text-slate-400 mb-1">Sottraendo R₁</div>
                <div className="grid grid-cols-3 gap-2">
                  <span>{p1.x}</span>
                  <span>{p1.y}</span>
                  <span className="text-amber-400 font-bold">1</span>

                  <span className="text-sky-300">{collinCalc.dx2}</span>
                  <span className="text-sky-300">{collinCalc.dy2}</span>
                  <span className="text-slate-600">0</span>

                  <span className="text-pink-300">{collinCalc.dx3}</span>
                  <span className="text-pink-300">{collinCalc.dy3}</span>
                  <span className="text-slate-600">0</span>
                </div>
              </div>

              <span className="text-slate-400">=</span>

              {/* 2x2 Difference Matrix */}
              <div className="bg-slate-900 border border-emerald-500/40 p-3 rounded text-center">
                <div className="text-[10px] text-emerald-400 mb-1">det 2×2 (P_i - P₁)</div>
                <div className="grid grid-cols-2 gap-3">
                  <span className="text-sky-300">{collinCalc.dx2}</span>
                  <span className="text-sky-300">{collinCalc.dy2}</span>

                  <span className="text-pink-300">{collinCalc.dx3}</span>
                  <span className="text-pink-300">{collinCalc.dy3}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
              <div>
                Determinante = <span className="text-amber-300 font-bold">{collinCalc.det3.toFixed(2)}</span> · Area Triangolo = ½|det| ={' '}
                <span className="text-sky-300 font-bold">{collinCalc.area.toFixed(2)}</span>
              </div>
              <span
                className={`px-2.5 py-1 rounded text-[11px] ${
                  collinCalc.isCollinear
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {collinCalc.isCollinear
                  ? 'det = 0 ⟹ P₁, P₂, P₃ ALLINEATI!'
                  : 'det ≠ 0 ⟹ Formano un Triangolo (2-Simplesso)'}
              </span>
            </div>
          </div>
        </div>

        {/* Linear Systems & Determinant Tricks Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {LINEAR_SYSTEMS_COMPENDIUM.map((trick) => (
            <div key={trick.id} className="bg-[#0b0e15] border border-slate-800/80 rounded p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-100">{trick.title}</span>
                <span className="text-[10px] font-mono-tech text-sky-400">{trick.category}</span>
              </div>
              <code className="block text-[11px] text-amber-300 font-mono-tech bg-slate-950 p-2 rounded overflow-x-auto">
                {trick.formula}
              </code>
              <p className="text-slate-300 text-[11px] leading-relaxed">{trick.explanation}</p>
              <div className="bg-emerald-950/20 border-l-2 border-emerald-400 pl-2.5 py-1 text-[11px] text-emerald-200">
                <strong>Scorciatoia Operativa:</strong> {trick.computationalShortcut}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PART 3: Complete Algebraic Structures of Matrices (M_{m,n}(K) vs M_n(K) vs M_n(R) vs Lie vs Jordan) */}
      <div className="bg-[#0f131c] border border-slate-800/90 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Grid className="w-4 h-4 text-sky-400" />
          <h3 className="text-xl font-serif-editorial font-semibold text-slate-100">
            Classificazione Algebrica Completa degli Spazi di Matrici: M_&#123;m,n&#125;(K), M_n(K), M_n(R), Gruppi e Algebre di Lie/Jordan
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono-tech">
                <th className="py-2.5 px-3">Insieme Matriciale</th>
                <th className="py-2.5 px-3">Notazione & Condizione</th>
                <th className="py-2.5 px-3">Operazioni</th>
                <th className="py-2.5 px-3 text-amber-300">Struttura Algebrica Esatta</th>
                <th className="py-2.5 px-3 text-sky-300">Proprietà Chiave & Geometria</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {MATRIX_STRUCTURES_COMPENDIUM.map((entry, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50">
                  <td className="py-3 px-3 font-semibold text-slate-200">{entry.structureName}</td>
                  <td className="py-3 px-3 font-mono-tech text-emerald-300">
                    {entry.notation}
                    <span className="block text-[10px] text-slate-400">{entry.condition}</span>
                  </td>
                  <td className="py-3 px-3 font-mono-tech text-slate-300">{entry.operations}</td>
                  <td className="py-3 px-3 font-semibold text-amber-200">{entry.algebraicClassification}</td>
                  <td className="py-3 px-3 text-slate-300 leading-relaxed">{entry.keyPropertiesAndRole}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
