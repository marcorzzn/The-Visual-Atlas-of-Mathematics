/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { MathView } from './MathView';
import { Play, RotateCcw, Sparkles, Sliders, Layers, ChevronRight, Check } from 'lucide-react';

interface GraphicalMethodRendererProps {
  methodId: string;
}

export const GraphicalMethodRenderer: React.FC<GraphicalMethodRendererProps> = ({ methodId }) => {
  // Preset selectors for different diagram types
  const [hassePreset, setHassePreset] = useState<'div12' | 'cube3d' | 'klein4'>('cube3d');
  const [cayleyPreset, setCayleyPreset] = useState<'d4' | 'q8' | 'c6'>('d4');
  const [dynkinType, setDynkinType] = useState<'A3' | 'B3' | 'G2' | 'E8'>('E8');
  const [partitionIdx, setPartitionIdx] = useState<number>(0);
  const [commutativePreset, setCommutativePreset] = useState<'pullback' | 'snake' | 'adjunction'>('pullback');
  const [phaseSystem, setPhaseSystem] = useState<'pendulum' | 'harmonic' | 'saddle'>('pendulum');
  const [zxStep, setZxStep] = useState<'initial' | 'fused'>('initial');

  // Canvas ref for interactive phase portrait
  const phaseCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // =========================================================================
  // 1. PHASE PORTRAIT INTERACTIVE SIMULATOR (HTML5 Canvas)
  // =========================================================================
  useEffect(() => {
    if (methodId !== 'phase_portraits') return;
    const canvas = phaseCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;
    const width = canvas.width;
    const height = canvas.height;

    // Grid of vector arrows
    const render = () => {
      ctx.fillStyle = '#070a12';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle coordinate axes
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      const scaleX = 40;
      const scaleY = 40;
      const step = 28;

      // Draw vector field
      for (let px = 20; px < width; px += step) {
        for (let py = 20; py < height; py += step) {
          const x = (px - width / 2) / scaleX;
          const y = -(py - height / 2) / scaleY;

          let dx = 0;
          let dy = 0;

          if (phaseSystem === 'pendulum') {
            dx = y;
            dy = -Math.sin(x) - 0.15 * y;
          } else if (phaseSystem === 'harmonic') {
            dx = y;
            dy = -x;
          } else {
            // Saddle point
            dx = x;
            dy = -y;
          }

          const len = Math.hypot(dx, dy) || 0.001;
          const arrowLen = 14;
          const nx = (dx / len) * arrowLen;
          const ny = (-dy / len) * arrowLen;

          // Velocity color
          const speed = Math.min(len / 2.5, 1);
          ctx.strokeStyle = `hsl(${180 + speed * 60}, 90%, ${45 + speed * 25}%)`;
          ctx.lineWidth = 1.2;

          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + nx, py + ny);
          ctx.stroke();

          // Arrow tip
          ctx.fillStyle = ctx.strokeStyle;
          ctx.beginPath();
          ctx.arc(px + nx, py + ny, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw stream orbits
      const orbits = phaseSystem === 'pendulum'
        ? [-2.2, -1.5, -0.8, 0, 0.8, 1.5, 2.2]
        : [-2, -1.2, -0.6, 0.6, 1.2, 2];

      orbits.forEach((startE, i) => {
        ctx.strokeStyle = `hsla(${40 + i * 45}, 90%, 65%, 0.75)`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();

        let sx = -Math.PI + 0.5 + i * 0.8;
        let sy = startE;
        let px = width / 2 + sx * scaleX;
        let py = height / 2 - sy * scaleY;
        ctx.moveTo(px, py);

        const dt = 0.04;
        for (let step = 0; step < 160; step++) {
          let dx = 0;
          let dy = 0;
          if (phaseSystem === 'pendulum') {
            dx = sy;
            dy = -Math.sin(sx) - 0.05 * sy;
          } else if (phaseSystem === 'harmonic') {
            dx = sy;
            dy = -sx;
          } else {
            dx = sx;
            dy = -sy;
          }
          sx += dx * dt;
          sy += dy * dt;
          px = width / 2 + sx * scaleX;
          py = height / 2 - sy * scaleY;
          if (px < 0 || px > width || py < 0 || py > height) break;
          ctx.lineTo(px, py);
        }
        ctx.stroke();
      });

      t += 0.02;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [methodId, phaseSystem]);

  // =========================================================================
  // RENDER PER METHOD ID
  // =========================================================================

  // 1. DIAGRAMMI DI HASSE
  if (methodId === 'hasse_diagrams') {
    return (
      <div className="space-y-4">
        {/* Preset Selector */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="text-xs font-mono-tech text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Visualizzazione Vettoriale: Reticolo di Hasse
          </div>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'cube3d', label: 'Cubo Booleano P({x,y,z})' },
              { id: 'div12', label: 'Divisori di 12 (Divisibilità)' },
              { id: 'klein4', label: 'Gruppo Klein V₄' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setHassePreset(p.id as any)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono-tech transition-colors cursor-pointer ${
                  hassePreset === p.id
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Drawing */}
        <div className="w-full h-72 bg-[#06080e] rounded-xl border border-slate-800/80 flex items-center justify-center relative overflow-hidden shadow-inner">
          <svg viewBox="0 0 460 260" className="w-full h-full max-h-72">
            <defs>
              <linearGradient id="hasseLineGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {hassePreset === 'cube3d' && (
              <g>
                {/* Lines of the Boolean 3-Cube */}
                {/* Level 0 to Level 1 */}
                <line x1="230" y1="225" x2="130" y2="160" stroke="url(#hasseLineGrad)" strokeWidth="2" />
                <line x1="230" y1="225" x2="230" y2="160" stroke="url(#hasseLineGrad)" strokeWidth="2" />
                <line x1="230" y1="225" x2="330" y2="160" stroke="url(#hasseLineGrad)" strokeWidth="2" />

                {/* Level 1 to Level 2 */}
                <line x1="130" y1="160" x2="130" y2="95" stroke="url(#hasseLineGrad)" strokeWidth="2" />
                <line x1="130" y1="160" x2="230" y2="95" stroke="url(#hasseLineGrad)" strokeWidth="2" />
                <line x1="230" y1="160" x2="130" y2="95" stroke="url(#hasseLineGrad)" strokeWidth="2" />
                <line x1="230" y1="160" x2="330" y2="95" stroke="url(#hasseLineGrad)" strokeWidth="2" />
                <line x1="330" y1="160" x2="230" y2="95" stroke="url(#hasseLineGrad)" strokeWidth="2" />
                <line x1="330" y1="160" x2="330" y2="95" stroke="url(#hasseLineGrad)" strokeWidth="2" />

                {/* Level 2 to Level 3 */}
                <line x1="130" y1="95" x2="230" y2="35" stroke="url(#hasseLineGrad)" strokeWidth="2" />
                <line x1="230" y1="95" x2="230" y2="35" stroke="url(#hasseLineGrad)" strokeWidth="2" />
                <line x1="330" y1="95" x2="230" y2="35" stroke="url(#hasseLineGrad)" strokeWidth="2" />

                {/* Level 0: ∅ */}
                <circle cx="230" cy="225" r="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <text x="230" y="230" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="monospace">∅</text>

                {/* Level 1: {x}, {y}, {z} */}
                <circle cx="130" cy="160" r="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <text x="130" y="164" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="monospace">{'{x}'}</text>

                <circle cx="230" cy="160" r="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <text x="230" y="164" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="monospace">{'{y}'}</text>

                <circle cx="330" cy="160" r="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <text x="330" y="164" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="monospace">{'{z}'}</text>

                {/* Level 2: {x,y}, {x,z}, {y,z} */}
                <circle cx="130" cy="95" r="18" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                <text x="130" y="99" textAnchor="middle" fill="#f59e0b" fontSize="10" fontFamily="monospace">{'{x,y}'}</text>

                <circle cx="230" cy="95" r="18" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                <text x="230" y="99" textAnchor="middle" fill="#f59e0b" fontSize="10" fontFamily="monospace">{'{x,z}'}</text>

                <circle cx="330" cy="95" r="18" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                <text x="330" y="99" textAnchor="middle" fill="#f59e0b" fontSize="10" fontFamily="monospace">{'{y,z}'}</text>

                {/* Level 3: {x,y,z} */}
                <circle cx="230" cy="35" r="22" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
                <text x="230" y="39" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold" fontFamily="monospace">{'{x,y,z}'}</text>
              </g>
            )}

            {hassePreset === 'div12' && (
              <g>
                <line x1="230" y1="225" x2="160" y2="165" stroke="#38bdf8" strokeWidth="2" />
                <line x1="230" y1="225" x2="300" y2="165" stroke="#38bdf8" strokeWidth="2" />
                <line x1="160" y1="165" x2="160" y2="105" stroke="#38bdf8" strokeWidth="2" />
                <line x1="160" y1="165" x2="300" y2="105" stroke="#38bdf8" strokeWidth="2" />
                <line x1="300" y1="165" x2="300" y2="105" stroke="#38bdf8" strokeWidth="2" />
                <line x1="160" y1="105" x2="230" y2="45" stroke="#f59e0b" strokeWidth="2" />
                <line x1="300" y1="105" x2="230" y2="45" stroke="#f59e0b" strokeWidth="2" />

                {/* Nodes: 1, 2, 3, 4, 6, 12 */}
                <circle cx="230" cy="225" r="16" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
                <text x="230" y="230" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold" fontFamily="monospace">1</text>

                <circle cx="160" cy="165" r="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <text x="160" y="170" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="monospace">2</text>

                <circle cx="300" cy="165" r="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <text x="300" y="170" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="monospace">3</text>

                <circle cx="160" cy="105" r="16" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                <text x="160" y="110" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold" fontFamily="monospace">4</text>

                <circle cx="300" cy="105" r="16" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                <text x="300" y="110" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold" fontFamily="monospace">6</text>

                <circle cx="230" cy="45" r="20" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                <text x="230" y="50" textAnchor="middle" fill="#10b981" fontSize="13" fontWeight="bold" fontFamily="monospace">12</text>
              </g>
            )}

            {hassePreset === 'klein4' && (
              <g>
                <line x1="230" y1="220" x2="130" y2="130" stroke="#38bdf8" strokeWidth="2" />
                <line x1="230" y1="220" x2="230" y2="130" stroke="#38bdf8" strokeWidth="2" />
                <line x1="230" y1="220" x2="330" y2="130" stroke="#38bdf8" strokeWidth="2" />
                <line x1="130" y1="130" x2="230" y2="40" stroke="#f59e0b" strokeWidth="2" />
                <line x1="230" y1="130" x2="230" y2="40" stroke="#f59e0b" strokeWidth="2" />
                <line x1="330" y1="130" x2="230" y2="40" stroke="#f59e0b" strokeWidth="2" />

                <circle cx="230" cy="220" r="16" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
                <text x="230" y="225" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="monospace">{'{e}'}</text>

                <circle cx="130" cy="130" r="18" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <text x="130" y="135" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="monospace">⟨a⟩</text>

                <circle cx="230" cy="130" r="18" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <text x="230" y="135" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="monospace">⟨b⟩</text>

                <circle cx="330" cy="130" r="18" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <text x="330" y="135" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="monospace">⟨ab⟩</text>

                <circle cx="230" cy="40" r="22" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
                <text x="230" y="45" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold" fontFamily="monospace">V₄</text>
              </g>
            )}
          </svg>
        </div>
      </div>
    );
  }

  // 2. GRAFI DI CAYLEY
  if (methodId === 'cayley_graphs') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="text-xs font-mono-tech text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Visualizzazione Vettoriale: Grafo di Cayley
          </div>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'd4', label: 'Gruppo Diedrale D₄ (Quadrato)' },
              { id: 'c6', label: 'Ciclico C₆ (Esagono)' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setCayleyPreset(p.id as any)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono-tech transition-colors cursor-pointer ${
                  cayleyPreset === p.id
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full h-72 bg-[#06080e] rounded-xl border border-slate-800/80 flex items-center justify-center relative overflow-hidden shadow-inner">
          <svg viewBox="0 0 460 260" className="w-full h-full max-h-72">
            <defs>
              <marker id="arrowCyan" markerWidth="6" markerHeight="6" refX="8" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#38bdf8" />
              </marker>
              <marker id="arrowAmber" markerWidth="6" markerHeight="6" refX="8" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#f59e0b" />
              </marker>
            </defs>

            {cayleyPreset === 'd4' && (
              <g>
                {/* Outer square (rotations by r, ciano) */}
                <line x1="160" y1="60" x2="300" y2="60" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrowCyan)" />
                <line x1="300" y1="60" x2="300" y2="200" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrowCyan)" />
                <line x1="300" y1="200" x2="160" y2="200" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrowCyan)" />
                <line x1="160" y1="200" x2="160" y2="60" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrowCyan)" />

                {/* Inner square (rotations by r, ciano) */}
                <line x1="200" y1="100" x2="260" y2="100" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrowCyan)" />
                <line x1="260" y1="100" x2="260" y2="160" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrowCyan)" />
                <line x1="260" y1="160" x2="200" y2="160" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrowCyan)" />
                <line x1="200" y1="160" x2="200" y2="100" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrowCyan)" />

                {/* Connecting spokes (reflections s, ambra) */}
                <line x1="160" y1="60" x2="200" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
                <line x1="300" y1="60" x2="260" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
                <line x1="300" y1="200" x2="260" y2="160" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
                <line x1="160" y1="200" x2="200" y2="160" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />

                {/* Outer nodes */}
                <circle cx="160" cy="60" r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <text x="160" y="64" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="monospace">1</text>

                <circle cx="300" cy="60" r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <text x="300" y="64" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="monospace">r</text>

                <circle cx="300" cy="200" r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <text x="300" y="204" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="monospace">r²</text>

                <circle cx="160" cy="200" r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <text x="160" y="204" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="monospace">r³</text>

                {/* Inner nodes */}
                <circle cx="200" cy="100" r="14" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                <text x="200" y="104" textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="monospace">s</text>

                <circle cx="260" cy="100" r="14" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                <text x="260" y="104" textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="monospace">sr</text>

                <circle cx="260" cy="160" r="14" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                <text x="260" y="164" textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="monospace">sr²</text>

                <circle cx="200" cy="160" r="14" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                <text x="200" y="164" textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="monospace">sr³</text>
              </g>
            )}

            {cayleyPreset === 'c6' && (
              <g>
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const angle1 = (i * 60 - 90) * (Math.PI / 180);
                  const angle2 = ((i + 1) * 60 - 90) * (Math.PI / 180);
                  const r = 85;
                  const x1 = 230 + r * Math.cos(angle1);
                  const y1 = 130 + r * Math.sin(angle1);
                  const x2 = 230 + r * Math.cos(angle2);
                  const y2 = 130 + r * Math.sin(angle2);
                  return (
                    <g key={i}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrowCyan)" />
                      <circle cx={x1} cy={y1} r="16" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                      <text x={x1} y={y1 + 4} textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="monospace">
                        {i === 0 ? 'e' : i === 1 ? 'g' : `g^${i}`}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-2 right-3 text-[10px] font-mono-tech flex items-center gap-3 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800">
            <span className="flex items-center gap-1 text-sky-400">
              <span className="w-3 h-0.5 bg-sky-400 inline-block" /> Generatore r (rotazione)
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-3 h-0.5 bg-amber-400 inline-block border-dashed" /> Generatore s (riflessione)
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 3. DIAGRAMMI DI DYNKIN
  if (methodId === 'dynkin_diagrams') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="text-xs font-mono-tech text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Diagramma di Dynkin & Matrice di Cartan
          </div>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'E8', label: 'E₈ (Eccezionale)' },
              { id: 'A3', label: 'A₃ (SU(4))' },
              { id: 'B3', label: 'B₃ (SO(7))' },
              { id: 'G2', label: 'G₂ (Triplo legame)' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setDynkinType(p.id as any)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono-tech transition-colors cursor-pointer ${
                  dynkinType === p.id
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full h-72 bg-[#06080e] rounded-xl border border-slate-800/80 flex items-center justify-center relative overflow-hidden shadow-inner">
          <svg viewBox="0 0 460 220" className="w-full h-full max-h-72">
            {dynkinType === 'E8' && (
              <g transform="translate(15, 40)">
                {/* Horizontal Spine: 7 nodes */}
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <g key={i}>
                    {i < 6 && (
                      <line
                        x1={50 + i * 55}
                        y1="90"
                        x2={50 + (i + 1) * 55}
                        y2="90"
                        stroke="#f59e0b"
                        strokeWidth="3"
                      />
                    )}
                    <circle cx={50 + i * 55} cy="90" r="11" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                    <text x={50 + i * 55} y="115" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                      α{i + 1}
                    </text>
                  </g>
                ))}

                {/* The 8th branch node on alpha_3 */}
                <line x1={50 + 2 * 55} y1="90" x2={50 + 2 * 55} y2="35" stroke="#f59e0b" strokeWidth="3" />
                <circle cx={50 + 2 * 55} cy="35" r="11" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
                <text x={50 + 2 * 55 + 16} y="40" textAnchor="start" fill="#10b981" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  α₈ (Braccio eccezionale)
                </text>
              </g>
            )}

            {dynkinType === 'A3' && (
              <g transform="translate(60, 40)">
                <line x1="80" y1="70" x2="180" y2="70" stroke="#f59e0b" strokeWidth="3" />
                <line x1="180" y1="70" x2="280" y2="70" stroke="#f59e0b" strokeWidth="3" />
                <circle cx="80" cy="70" r="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                <circle cx="180" cy="70" r="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                <circle cx="280" cy="70" r="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                <text x="80" y="98" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="monospace">α₁</text>
                <text x="180" y="98" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="monospace">α₂</text>
                <text x="280" y="98" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="monospace">α₃</text>
              </g>
            )}

            {dynkinType === 'G2' && (
              <g transform="translate(90, 40)">
                {/* Triple Bond */}
                <line x1="100" y1="64" x2="220" y2="64" stroke="#f59e0b" strokeWidth="2" />
                <line x1="100" y1="70" x2="220" y2="70" stroke="#f59e0b" strokeWidth="2" />
                <line x1="100" y1="76" x2="220" y2="76" stroke="#f59e0b" strokeWidth="2" />

                {/* Arrow pointing to short root */}
                <path d="M 168,60 L 152,70 L 168,80" fill="none" stroke="#38bdf8" strokeWidth="3" />

                <circle cx="100" cy="70" r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                <circle cx="220" cy="70" r="14" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
                <text x="100" y="100" textAnchor="middle" fill="#38bdf8" fontSize="11" fontFamily="monospace">α₁ (corta)</text>
                <text x="220" y="100" textAnchor="middle" fill="#10b981" fontSize="11" fontFamily="monospace">α₂ (lunga)</text>
              </g>
            )}
          </svg>
        </div>
      </div>
    );
  }

  // 4. TABLEAUX DI YOUNG
  if (methodId === 'young_tableaux') {
    const partitions = [
      { name: '[4, 2, 1] ⊢ 7', rows: [4, 2, 1], hooks: [[6, 4, 2, 1], [3, 1], [1]], dim: 35 },
      { name: '[3, 3] ⊢ 6', rows: [3, 3], hooks: [[4, 3, 2], [3, 2, 1]], dim: 5 },
      { name: '[3, 2, 1] ⊢ 6', rows: [3, 2, 1], hooks: [[5, 3, 1], [3, 1], [1]], dim: 16 },
    ];
    const part = partitions[partitionIdx] || partitions[0];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="text-xs font-mono-tech text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Tableau di Young & Hook Length Formula
          </div>
          <div className="flex items-center gap-1.5">
            {partitions.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setPartitionIdx(idx)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono-tech transition-colors cursor-pointer ${
                  partitionIdx === idx
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full min-h-72 bg-[#06080e] rounded-xl border border-slate-800/80 p-6 flex flex-col md:flex-row items-center justify-around gap-6 shadow-inner">
          {/* Young Diagram with Hook Lengths in each cell */}
          <div className="space-y-1">
            {part.rows.map((cols, r) => (
              <div key={r} className="flex gap-1">
                {Array.from({ length: cols }).map((_, c) => {
                  const hookVal = part.hooks[r]?.[c] || 1;
                  return (
                    <div
                      key={c}
                      className="w-12 h-12 rounded bg-[#0f172a] border-2 border-amber-400 flex flex-col items-center justify-center text-amber-300 shadow-md group hover:bg-amber-500/20 transition-colors"
                    >
                      <span className="text-[10px] text-slate-400 font-mono">h=</span>
                      <span className="text-base font-bold font-mono">{hookVal}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Hook Length Calculation Banner */}
          <div className="p-4 rounded-lg bg-[#0b0f19] border border-slate-800 space-y-2 text-xs font-mono-tech max-w-xs">
            <div className="text-emerald-400 font-bold">
              Calcolo Dimensione Rappresentazione:
            </div>
            <div className="text-slate-300">
              dim(V_λ) = n! / ∏ h(i,j)
            </div>
            <div className="text-amber-300 text-sm font-bold pt-1">
              = {part.dim} (Dimensione Modulo di Specht)
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed pt-1">
              Ogni scatola indica la lunghezza del gancio h(i,j) (braccio destro + gamba inferiore + 1).
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 5. DIAGRAMMI COMMUTATIVI
  if (methodId === 'commutative_diagrams') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="text-xs font-mono-tech text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Diagramma Commutativo & Proprietà Universale
          </div>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'pullback', label: 'Pullback (X ×_Z Y)' },
              { id: 'adjunction', label: 'Aggiunzione F ⊣ G' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setCommutativePreset(p.id as any)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono-tech transition-colors cursor-pointer ${
                  commutativePreset === p.id
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full h-72 bg-[#06080e] rounded-xl border border-slate-800/80 flex items-center justify-center relative overflow-hidden shadow-inner">
          <svg viewBox="0 0 460 240" className="w-full h-full max-h-72">
            <defs>
              <marker id="arr" markerWidth="6" markerHeight="6" refX="7" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#38bdf8" />
              </marker>
              <marker id="arrDashed" markerWidth="6" markerHeight="6" refX="7" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#10b981" />
              </marker>
            </defs>

            {commutativePreset === 'pullback' && (
              <g transform="translate(60, 20)">
                {/* W test cone */}
                <text x="60" y="45" textAnchor="middle" fill="#10b981" fontSize="16" fontWeight="bold" fontFamily="monospace">W</text>

                {/* Pullback P */}
                <text x="180" y="85" textAnchor="middle" fill="#f59e0b" fontSize="14" fontWeight="bold" fontFamily="monospace">X ×_Z Y</text>

                {/* X and Y */}
                <text x="180" y="175" textAnchor="middle" fill="#38bdf8" fontSize="16" fontWeight="bold" fontFamily="monospace">X</text>
                <text x="300" y="85" textAnchor="middle" fill="#38bdf8" fontSize="16" fontWeight="bold" fontFamily="monospace">Y</text>

                {/* Target Z */}
                <text x="300" y="175" textAnchor="middle" fill="#e2e8f0" fontSize="16" fontWeight="bold" fontFamily="monospace">Z</text>

                {/* Arrows */}
                <line x1="80" y1="45" x2="280" y2="78" stroke="#10b981" strokeWidth="1.8" strokeDasharray="4,4" markerEnd="url(#arrDashed)" />
                <line x1="60" y1="60" x2="160" y2="165" stroke="#10b981" strokeWidth="1.8" strokeDasharray="4,4" markerEnd="url(#arrDashed)" />
                <line x1="75" y1="52" x2="155" y2="80" stroke="#10b981" strokeWidth="2.2" strokeDasharray="3,3" markerEnd="url(#arrDashed)" />
                <text x="105" y="60" fill="#10b981" fontSize="11" fontFamily="monospace">∃! u</text>

                <line x1="180" y1="100" x2="180" y2="155" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arr)" />
                <text x="190" y="130" fill="#94a3b8" fontSize="11" fontFamily="monospace">p₁</text>

                <line x1="220" y1="80" x2="280" y2="80" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arr)" />
                <text x="250" y="72" fill="#94a3b8" fontSize="11" fontFamily="monospace">p₂</text>

                <line x1="200" y1="170" x2="280" y2="170" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arr)" />
                <text x="240" y="190" fill="#94a3b8" fontSize="11" fontFamily="monospace">f</text>

                <line x1="300" y1="100" x2="300" y2="155" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arr)" />
                <text x="312" y="130" fill="#94a3b8" fontSize="11" fontFamily="monospace">g</text>

                {/* Pullback corner mark */}
                <path d="M 200,95 L 210,95 L 210,105" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
              </g>
            )}

            {commutativePreset === 'adjunction' && (
              <g transform="translate(60, 40)">
                <text x="120" y="80" textAnchor="middle" fill="#38bdf8" fontSize="18" fontWeight="bold" fontFamily="monospace">C</text>
                <text x="260" y="80" textAnchor="middle" fill="#f59e0b" fontSize="18" fontWeight="bold" fontFamily="monospace">D</text>

                {/* Functor F: C -> D */}
                <path d="M 140,65 Q 190,30 240,65" fill="none" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#arr)" />
                <text x="190" y="38" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold" fontFamily="monospace">F (Aggiunto Sinistro)</text>

                {/* Functor G: D -> C */}
                <path d="M 240,95 Q 190,130 140,95" fill="none" stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#arr)" />
                <text x="190" y="145" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="bold" fontFamily="monospace">G (Aggiunto Destro)</text>

                {/* Adjunction symbol in the center */}
                <text x="190" y="88" textAnchor="middle" fill="#10b981" fontSize="22" fontWeight="bold">⊣</text>
              </g>
            )}
          </svg>
        </div>
      </div>
    );
  }

  // 6. STRING DIAGRAMS (SNAKE EQUATION)
  if (methodId === 'string_diagrams') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="text-xs font-mono-tech text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Diagrammi a Stringhe & Snake Equation (Zig-Zag)
          </div>
          <div className="text-xs text-slate-400 font-mono-tech">
            (ev ⊗ id) ∘ (id ⊗ coev) = id
          </div>
        </div>

        <div className="w-full h-72 bg-[#06080e] rounded-xl border border-slate-800/80 flex items-center justify-around p-6 relative overflow-hidden shadow-inner">
          <svg viewBox="0 0 460 220" className="w-full h-full max-h-72">
            {/* The Snake curve (Zig-zag) */}
            <path
              d="M 120,20 L 120,90 C 120,150 170,150 170,90 C 170,30 220,30 220,90 L 220,200"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Cap label (evaluation) */}
            <text x="145" y="170" textAnchor="middle" fill="#f59e0b" fontSize="12" fontFamily="monospace">Cup (coev)</text>
            {/* Cup label (coevaluation) */}
            <text x="195" y="25" textAnchor="middle" fill="#10b981" fontSize="12" fontFamily="monospace">Cap (ev)</text>

            {/* Isomorphism arrow */}
            <text x="280" y="115" textAnchor="middle" fill="#e2e8f0" fontSize="26" fontWeight="bold">≅</text>

            {/* Straightened string */}
            <line x1="360" y1="20" x2="360" y2="200" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
            <text x="360" y="215" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold" fontFamily="monospace">id_A</text>
            <text x="380" y="115" textAnchor="start" fill="#94a3b8" fontSize="11" fontFamily="monospace">Tirando il filo!</text>
          </svg>
        </div>
      </div>
    );
  }

  // 7. ZX-CALCULUS
  if (methodId === 'zx_calculus') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="text-xs font-mono-tech text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            ZX-Calculus: Spider Fusion Rule
          </div>
          <button
            onClick={() => setZxStep(zxStep === 'initial' ? 'fused' : 'initial')}
            className="px-3 py-1 rounded text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            {zxStep === 'initial' ? 'Esegui Fusione Z(α) ∘ Z(β)' : 'Ripristina Ragni'}
          </button>
        </div>

        <div className="w-full h-72 bg-[#06080e] rounded-xl border border-slate-800/80 flex items-center justify-center relative overflow-hidden shadow-inner">
          <svg viewBox="0 0 460 220" className="w-full h-full max-h-72">
            {zxStep === 'initial' ? (
              <g transform="translate(40, 20)">
                {/* Wires */}
                <line x1="50" y1="90" x2="130" y2="90" stroke="#94a3b8" strokeWidth="2.5" />
                <line x1="170" y1="90" x2="250" y2="90" stroke="#94a3b8" strokeWidth="2.5" />
                <line x1="290" y1="90" x2="370" y2="90" stroke="#94a3b8" strokeWidth="2.5" />

                {/* Spider 1 (Z alpha) */}
                <circle cx="150" cy="90" r="20" fill="#10b981" stroke="#34d399" strokeWidth="2" />
                <text x="150" y="95" textAnchor="middle" fill="#042f2e" fontSize="13" fontWeight="bold" fontFamily="monospace">α</text>

                {/* Spider 2 (Z beta) */}
                <circle cx="270" cy="90" r="20" fill="#10b981" stroke="#34d399" strokeWidth="2" />
                <text x="270" y="95" textAnchor="middle" fill="#042f2e" fontSize="13" fontWeight="bold" fontFamily="monospace">β</text>

                <text x="210" y="145" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontFamily="monospace">
                  Z-Spider(α) connesso a Z-Spider(β)
                </text>
              </g>
            ) : (
              <g transform="translate(40, 20)">
                {/* Wires */}
                <line x1="80" y1="90" x2="185" y2="90" stroke="#94a3b8" strokeWidth="2.5" />
                <line x1="235" y1="90" x2="340" y2="90" stroke="#94a3b8" strokeWidth="2.5" />

                {/* Fused Spider */}
                <circle cx="210" cy="90" r="26" fill="#10b981" stroke="#34d399" strokeWidth="3" />
                <text x="210" y="95" textAnchor="middle" fill="#042f2e" fontSize="12" fontWeight="bold" fontFamily="monospace">α+β</text>

                <text x="210" y="150" textAnchor="middle" fill="#10b981" fontSize="13" fontWeight="bold" fontFamily="monospace">
                  ✓ Fuso in un singolo ragno Z(α + β)
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>
    );
  }

  // 8. RITRATTI DI FASE (CANVAS STREAMLINES)
  if (methodId === 'phase_portraits') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="text-xs font-mono-tech text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Simulatore Dinamico del Ritratto di Fase
          </div>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'pendulum', label: 'Pendolo Non Lineare (Sella & Centro)' },
              { id: 'harmonic', label: 'Oscillatore Armonico' },
              { id: 'saddle', label: 'Sella Iperbolica' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPhaseSystem(p.id as any)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono-tech transition-colors cursor-pointer ${
                  phaseSystem === p.id
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-800/80 relative shadow-inner">
          <canvas
            ref={phaseCanvasRef}
            width={640}
            height={320}
            className="w-full h-full block"
          />
          <div className="absolute bottom-2 left-3 text-[10px] font-mono-tech bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800 text-slate-400">
            Campo vettoriale (dot&#123;x&#125;, dot&#123;y&#125;) con orbite nello spazio delle fasi (q, p)
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT / OTHER METHODS: GENERIC HIGH-FIDELITY VECTOR SCHEMATIC
  return (
    <div className="space-y-4">
      <div className="border-b border-slate-800 pb-3 text-xs font-mono-tech text-amber-400 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5" />
        Struttura Topologica & Diagrammatica
      </div>

      <div className="w-full h-64 bg-[#06080e] rounded-xl border border-slate-800/80 p-6 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden shadow-inner">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg">
          <Layers className="w-8 h-8" />
        </div>
        <div className="max-w-md space-y-1">
          <h4 className="text-base font-serif-editorial font-bold text-slate-100">
            Diagrammatic Reasoning Attivo
          </h4>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Questo metodo opera come calcolo formale rigoroso: ogni manipolazione visiva è isomorfa a una deduzione algebrica o topologica esatta garantita da teoremi di coerenza.
          </p>
        </div>
      </div>
    </div>
  );
};
