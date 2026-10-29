import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Volume2, VolumeX } from 'lucide-react';
import {
  CHAMBERS,
  ChamberId,
  CoordinateSystemType,
  HARDWARE_PEDESTALS,
  MetricType,
} from '../data/pantheonData';
import { PantheonSimulationState } from './PantheonCanvas';

interface BottomControlDockProps {
  simState: PantheonSimulationState;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onChangeState: (updater: (prev: PantheonSimulationState) => PantheonSimulationState) => void;
  onTriggerBackprop: () => void;
}

export const BottomControlDock: React.FC<BottomControlDockProps> = ({
  simState,
  isCollapsed,
  onToggleCollapse,
  soundEnabled,
  onToggleSound,
  onChangeState,
  onTriggerBackprop,
}) => {
  const [selectedLayerIdx, setSelectedLayerIdx] = useState<number>(3); // Default top math layer

  const currentPedestal =
    HARDWARE_PEDESTALS[simState.selectedPedestalIndex] || HARDWARE_PEDESTALS[3];
  const currentLayer = currentPedestal.layers[selectedLayerIdx] || currentPedestal.layers[3];
  const currentChamber =
    CHAMBERS.find((c) => c.id === simState.activeChamber) || CHAMBERS[0];

  // Live Matrix math calculations
  const { a, b, c, d } = simState.matrix;
  const det = a * d - b * c;
  const trace = a + d;
  const disc = trace * trace - 4 * det;
  const eigenText =
    disc >= 0
      ? `λ₁ = ${((trace + Math.sqrt(disc)) / 2).toFixed(2)} · λ₂ = ${((trace - Math.sqrt(disc)) / 2).toFixed(2)}`
      : `λ = ${(trace / 2).toFixed(2)} ± ${(Math.sqrt(-disc) / 2).toFixed(2)}i (Rotazione Complessa)`;

  const setActiveChamber = (chamberId: ChamberId) => {
    onChangeState((prev) => ({
      ...prev,
      activeChamber: chamberId,
      elevatorExplosion:
        chamberId === 'hardware_elevator' && prev.elevatorExplosion < 0.25
          ? 0.85
          : prev.elevatorExplosion,
    }));
  };

  return (
    <div
      className="fixed z-30 transition-transform duration-200 ease-out"
      style={{
        bottom: '16px',
        left: '50%',
        transform: `translateX(-50%) translateY(${isCollapsed ? 'calc(100% - 36px)' : '0px'})`,
        width: 'min(940px, 94vw)',
      }}
    >
      {/* Top Drawer Collapse/Expand Handle */}
      <div className="flex items-center justify-center mb-1.5">
        <button
          onClick={onToggleCollapse}
          className="flex items-center gap-2 px-4 py-1.5 text-xs font-medium text-slate-200 bg-[#0b101d] hover:bg-[#131b2e] border border-slate-700/80 rounded-full shadow-lg transition-colors whitespace-nowrap shrink-0"
          title="Scorciatoia da tastiera: H"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Mostra Controlli Pantheon (H)</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
              <span>Nascondi Controlli · Modalità Cinema (H)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Dock Container (Solid RGBA surface, zero backdrop-filter over WebGL) */}
      <div className="rounded-xl bg-[#090d18]/96 border border-slate-800 shadow-2xl p-4 space-y-3.5">
        {/* Top Row inside Dock: Chamber Switcher Tabs + Elevator Slider + Audio Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/90">
          <div className="flex items-center gap-1 p-1 bg-[#050811] rounded-lg border border-slate-800/80 overflow-x-auto">
            {CHAMBERS.map((ch) => {
              const active = simState.activeChamber === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChamber(ch.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-amber-500 text-slate-950 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {ch.shortTitle}
                </button>
              );
            })}
          </div>

          {/* Universal Abstraction Elevator Y Slider & Audio */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 bg-[#050811] px-3 py-1.5 rounded-lg border border-slate-800/80">
              <label
                htmlFor="elevator-slider"
                className="text-xs font-medium text-slate-300 whitespace-nowrap shrink-0"
              >
                Ascensore Y (Esploso):
              </label>
              <input
                id="elevator-slider"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={simState.elevatorExplosion}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChangeState((prev) => ({
                    ...prev,
                    elevatorExplosion: val,
                  }));
                }}
                className="w-24"
              />
              <span className="text-xs font-mono text-amber-400 w-9 text-right">
                {Math.round(simState.elevatorExplosion * 100)}%
              </span>
            </div>

            <button
              onClick={onToggleSound}
              className="p-2 text-slate-300 hover:text-white bg-[#050811] hover:bg-slate-800 rounded-lg border border-slate-800/80 transition-colors"
              aria-label={soundEnabled ? 'Disattiva audio procedurale' : 'Attiva audio procedurale'}
              title={soundEnabled ? 'Audio procedurale attivo' : 'Audio procedurale disattivato'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-amber-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>
        </div>

        {/* Context-Aware Interactive Controls Area */}
        {(simState.activeChamber === 'pantheon_overview' ||
          simState.activeChamber === 'hardware_elevator') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Hardware Timeline Selector (Axis X) */}
            <div className="lg:col-span-7 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Asse X · Evoluzione Hardware (Clicca per ispezionare ed esplodere):</span>
                <span className="font-mono text-sky-400">{currentPedestal.era}</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {HARDWARE_PEDESTALS.map((ped, idx) => {
                  const selected = simState.selectedPedestalIndex === idx;
                  return (
                    <button
                      key={ped.id}
                      onClick={() =>
                        onChangeState((prev) => ({
                          ...prev,
                          selectedPedestalIndex: idx,
                          elevatorExplosion:
                            prev.elevatorExplosion < 0.2 ? 0.85 : prev.elevatorExplosion,
                        }))
                      }
                      className={`px-2 py-2 rounded-lg text-left border transition-colors ${
                        selected
                          ? 'bg-amber-500/15 border-amber-500 text-white'
                          : 'bg-[#0e1525] border-slate-800/90 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-[11px] font-mono text-amber-400">
                        0{idx + 1}
                      </div>
                      <div className="text-xs font-medium truncate mt-0.5">
                        {ped.name.replace(/^0\d\.\s*/, '').split(' ')[0]}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* 4 Abstraction Layers Selector (Axis Y) */}
              <div className="flex items-center gap-1.5 pt-1">
                {currentPedestal.layers.map((layer, lIdx) => {
                  const isSel = selectedLayerIdx === lIdx;
                  return (
                    <button
                      key={layer.domain}
                      onClick={() => {
                        setSelectedLayerIdx(lIdx);
                        if (simState.elevatorExplosion < 0.3) {
                          onChangeState((prev) => ({ ...prev, elevatorExplosion: 0.85 }));
                        }
                      }}
                      className={`flex-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 border ${
                        isSel
                          ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                          : 'bg-[#0b101d] border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {layer.level}. {layer.domain}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Pedestal & Layer Detail Readout */}
            <div className="lg:col-span-5 p-3.5 rounded-lg bg-[#0d1322] border border-slate-800/90 space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                <span className="font-semibold text-amber-400 truncate">
                  {currentPedestal.name}
                </span>
                <span>·</span>
                <span className="font-mono text-sky-300 shrink-0">
                  Livello {currentLayer.level}: {currentLayer.domain}
                </span>
              </div>
              <div className="text-sm font-semibold text-white">
                {currentLayer.title}
              </div>
              <div className="text-xs font-mono text-emerald-300 bg-[#070b14] px-2.5 py-1 rounded border border-slate-800/80 truncate">
                {currentLayer.formula}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentLayer.description}
              </p>
            </div>
          </div>
        )}

        {simState.activeChamber === 'matrices_tensors' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* 2x2 Matrix Sliders */}
            <div className="lg:col-span-5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">
                  Matrice di Trasformazione Lineare M (Gabbia Laser):
                </span>
                <span className="font-mono text-amber-400">
                  det(M) = {det.toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 bg-[#0d1322] p-2.5 rounded-lg border border-slate-800">
                {(
                  [
                    ['a (Scala X)', 'a', a],
                    ['b (Shear Y→X)', 'b', b],
                    ['c (Shear X→Y)', 'c', c],
                    ['d (Scala Y)', 'd', d],
                  ] as const
                ).map(([label, key, val]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400">{label}</span>
                      <span className="text-sky-300">{val.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min={-2.0}
                      max={2.0}
                      step={0.05}
                      value={val}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        onChangeState((prev) => ({
                          ...prev,
                          matrix: { ...prev.matrix, [key]: v },
                        }));
                      }}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Matrix Presets & Eigenvalues */}
            <div className="lg:col-span-4 space-y-2">
              <div className="text-xs text-slate-400">
                Trasformazioni Notevoli & Autovalori:
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() =>
                    onChangeState((p) => ({
                      ...p,
                      matrix: { a: 1, b: 0, c: 0, d: 1 },
                    }))
                  }
                  className="px-2.5 py-1.5 text-xs font-medium bg-[#0e1525] hover:bg-slate-800 text-slate-200 rounded border border-slate-800 whitespace-nowrap"
                >
                  Identità I₂
                </button>
                <button
                  onClick={() =>
                    onChangeState((p) => ({
                      ...p,
                      matrix: { a: 1.2, b: 0.85, c: 0.0, d: 1.0 },
                    }))
                  }
                  className="px-2.5 py-1.5 text-xs font-medium bg-[#0e1525] hover:bg-slate-800 text-slate-200 rounded border border-slate-800 whitespace-nowrap"
                >
                  Deformazione Shear
                </button>
                <button
                  onClick={() =>
                    onChangeState((p) => ({
                      ...p,
                      matrix: { a: 0.71, b: -0.71, c: 0.71, d: 0.71 },
                    }))
                  }
                  className="px-2.5 py-1.5 text-xs font-medium bg-[#0e1525] hover:bg-slate-800 text-slate-200 rounded border border-slate-800 whitespace-nowrap"
                >
                  Rotazione 45°
                </button>
                <button
                  onClick={() =>
                    onChangeState((p) => ({
                      ...p,
                      matrix: { a: -1, b: 0, c: 0, d: 1 },
                    }))
                  }
                  className="px-2.5 py-1.5 text-xs font-medium bg-[#0e1525] hover:bg-slate-800 text-slate-200 rounded border border-slate-800 whitespace-nowrap"
                >
                  Riflessione Speculare
                </button>
              </div>
              <div className="p-2 rounded bg-[#070b14] border border-slate-800/80 text-xs font-mono text-emerald-300 truncate">
                {eigenText}
              </div>
            </div>

            {/* 3D Tensor Slicing Controls */}
            <div className="lg:col-span-3 p-3 rounded-lg bg-[#0d1322] border border-slate-800 space-y-2">
              <div className="text-xs font-medium text-amber-400">
                Sezione Cubo Tensoriale 3×3×3:
              </div>
              <div className="flex items-center gap-1">
                {(['X', 'Y', 'Z'] as const).map((axis) => (
                  <button
                    key={axis}
                    onClick={() =>
                      onChangeState((p) => ({ ...p, tensorSliceAxis: axis }))
                    }
                    className={`flex-1 py-1 text-xs font-mono rounded ${
                      simState.tensorSliceAxis === axis
                        ? 'bg-amber-500 text-slate-950 font-semibold'
                        : 'bg-[#070b14] text-slate-400 hover:text-white'
                    }`}
                  >
                    Piano {axis}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1">
                {([0, 1, 2] as const).map((idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      onChangeState((p) => ({ ...p, tensorSliceIndex: idx }))
                    }
                    className={`flex-1 py-1 text-xs font-mono rounded ${
                      simState.tensorSliceIndex === idx
                        ? 'bg-sky-500 text-slate-950 font-semibold'
                        : 'bg-[#070b14] text-slate-400 hover:text-white'
                    }`}
                  >
                    Fetta #{idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {simState.activeChamber === 'hydraulic_nn' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-4 space-y-1.5 bg-[#0d1322] p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">
                  Apertura Valvole (Pesi Sinaptici w):
                </span>
                <span className="font-mono text-amber-400">
                  {simState.synapticWeight.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={0.2}
                max={2.0}
                step={0.05}
                value={simState.synapticWeight}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChangeState((p) => ({ ...p, synapticWeight: val }));
                }}
                className="w-full"
              />
              <p className="text-[11px] text-slate-400">
                Dilata o strozza le valvole meccaniche nei condotti di vetro, accelerando il flusso fotonico dei tensori.
              </p>
            </div>

            <div className="lg:col-span-4 space-y-1.5 bg-[#0d1322] p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">
                  Camera di Pressione (Bias b):
                </span>
                <span className="font-mono text-sky-400">
                  {simState.biasPressure >= 0 ? '+' : ''}
                  {simState.biasPressure.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={-1.0}
                max={1.0}
                step={0.05}
                value={simState.biasPressure}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChangeState((p) => ({ ...p, biasPressure: val }));
                }}
                className="w-full"
              />
              <p className="text-[11px] text-slate-400">
                Solleva o abbassa il pistone idraulico centrale per spostare la soglia di attivazione dei neuroni.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-between p-3 rounded-lg bg-[#0d1322] border border-slate-800 space-y-2">
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-rose-400">Retropropagazione dell’Errore:</span>{' '}
                invia un’onda luminosa inversa dall’Output all’Input per ricalibrare le valvole.
              </div>
              <button
                onClick={onTriggerBackprop}
                className="w-full py-2 px-4 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow transition-colors whitespace-nowrap"
              >
                Invia Onda di Backpropagation (∇ℒ)
              </button>
            </div>
          </div>
        )}

        {(simState.activeChamber === 'manifolds_metrics' ||
          simState.activeChamber === 'category_symmetries') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Metric Space Toggle */}
            <div className="lg:col-span-5 space-y-1.5">
              <div className="text-xs text-slate-400">
                Metrica dello Spazio sull’Altare Universale:
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {(
                  [
                    ['euclidean_l2', 'Euclidea L₂ (Sfera)'],
                    ['manhattan_l1', 'Manhattan L₁ (Ottaedro)'],
                    ['chebyshev_linf', 'Chebyshev L∞ (Cubo)'],
                    ['riemann_complex', 'Superficie di Riemann'],
                  ] as const
                ).map(([mId, label]) => (
                  <button
                    key={mId}
                    onClick={() =>
                      onChangeState((p) => ({
                        ...p,
                        metricType: mId as MetricType,
                      }))
                    }
                    className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap ${
                      simState.metricType === mId
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-semibold'
                        : 'bg-[#0d1322] border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Coordinate System Switcher */}
            <div className="lg:col-span-4 space-y-1.5">
              <div className="text-xs text-slate-400">
                Gabbia del Sistema di Coordinate:
              </div>
              <div className="flex items-center gap-1.5">
                {(
                  [
                    ['cartesian', 'Cartesiane (x,y,z)'],
                    ['cylindrical', 'Cilindriche (ρ,φ,z)'],
                    ['spherical', 'Sferiche (r,θ,φ)'],
                  ] as const
                ).map(([cId, label]) => (
                  <button
                    key={cId}
                    onClick={() =>
                      onChangeState((p) => ({
                        ...p,
                        coordSystem: cId as CoordinateSystemType,
                      }))
                    }
                    className={`flex-1 px-2.5 py-2 text-xs font-medium rounded-md border transition-colors whitespace-nowrap ${
                      simState.coordSystem === cId
                        ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-semibold'
                        : 'bg-[#0d1322] border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Symmetry Group & Functor Rotation Speed */}
            <div className="lg:col-span-3 p-3 rounded-lg bg-[#0d1322] border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Gruppo Simmetria SO(3):</span>
                <span className="font-mono text-purple-300">
                  {simState.symmetrySpeed.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min={0.0}
                max={3.0}
                step={0.1}
                value={simState.symmetrySpeed}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChangeState((p) => ({ ...p, symmetrySpeed: val }));
                }}
                className="w-full"
              />
              <div className="text-[11px] text-slate-400 truncate">
                {currentChamber.interactiveHint}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
