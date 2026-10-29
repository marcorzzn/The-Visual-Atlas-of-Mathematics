/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useState } from 'react';
import { BottomControlDock } from './BottomControlDock';
import { MegaPromptModal } from './MegaPromptModal';
import {
  PantheonCanvas,
  PantheonSimulationState,
} from './PantheonCanvas';
import { CHAMBERS, ChamberId, HARDWARE_PEDESTALS } from '../data/pantheonData';
import { soundEngine } from '../utils/soundEngine';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Compass,
  ArrowRight,
  Eye,
  Layers,
  Network,
  Cpu,
} from 'lucide-react';

interface AtlasPortalMapping {
  atlasModule: string;
  portalTitle: string;
  portalDescription: string;
  iconName: string;
}

const CHAMBER_ATLAS_PORTALS: Record<ChamberId, AtlasPortalMapping> = {
  pantheon_overview: {
    atlasModule: 'graph3d',
    portalTitle: 'Grafo Ontologico 3D & 40 Categorie',
    portalDescription: 'Visione d’insieme del cosmo matematico e dei cammini didattici.',
    iconName: 'Network',
  },
  hardware_elevator: {
    atlasModule: 'visual_atlas',
    portalTitle: 'Atlante dei Concetti (Circuiti, Turing & Karnaugh)',
    portalDescription: 'Dalla transizione della materia solida alla logica computazionale pura.',
    iconName: 'Cpu',
  },
  matrices_tensors: {
    atlasModule: 'tensor',
    portalTitle: 'Lab Tensori 3D & Deformazioni Spaziali',
    portalDescription: 'Ellissoide di sforzo di Cauchy, inerzia e autovalori geometrici.',
    iconName: 'Layers',
  },
  hydraulic_nn: {
    atlasModule: 'operator',
    portalTitle: 'Lab Operatori & Politopo di Birkhoff',
    portalDescription: 'Trasformazioni matriciali, spazi duali e matrici bistocastiche.',
    iconName: 'Compass',
  },
  manifolds_metrics: {
    atlasModule: 'dimensional',
    portalTitle: 'Lab Dimensioni & Analisi Complessa ℂ',
    portalDescription: 'Superfici di Riemann, piano di Gauss e proiezioni stereografiche.',
    iconName: 'Layers',
  },
  category_symmetries: {
    atlasModule: 'graphical_methods',
    portalTitle: 'Compendio Metodi Grafici Formali',
    portalDescription: 'Diagrammi commutativi, string diagrams e simmetrie di Dynkin.',
    iconName: 'Sparkles',
  },
};

interface PantheonModuleProps {
  onNavigateAtlasModule?: (module: string) => void;
}

export const PantheonModule: React.FC<PantheonModuleProps> = ({
  onNavigateAtlasModule,
}) => {
  const [simState, setSimState] = useState<PantheonSimulationState>({
    activeChamber: 'pantheon_overview',
    selectedPedestalIndex: 3, // Default to Silicon Transistor (04. MOSFET)
    elevatorExplosion: 0.75,
    matrix: { a: 1.15, b: 0.35, c: -0.2, d: 1.05 },
    tensorSliceAxis: 'Y',
    tensorSliceIndex: 1,
    synapticWeight: 1.1,
    biasPressure: 0.15,
    backpropTriggerCount: 0,
    metricType: 'euclidean_l2',
    coordSystem: 'cartesian',
    symmetrySpeed: 1.0,
  });

  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Keyboard shortcut 'H' for toggling the bottom control dock (Cinema / Zen Mode)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key.toLowerCase() === 'h') {
        setIsDockCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleSelectPedestal = useCallback((index: number) => {
    soundEngine.playChime(360 + index * 55, 0.2);
    setSimState((prev) => ({
      ...prev,
      activeChamber: 'hardware_elevator',
      selectedPedestalIndex: index,
      elevatorExplosion:
        prev.elevatorExplosion < 0.35 ? 0.85 : prev.elevatorExplosion,
    }));
  }, []);

  const handleTriggerBackprop = useCallback(() => {
    soundEngine.playBackpropWave();
    setSimState((prev) => ({
      ...prev,
      backpropTriggerCount: prev.backpropTriggerCount + 1,
      synapticWeight: Number(
        Math.max(0.4, Math.min(1.8, prev.synapticWeight + (Math.random() - 0.45) * 0.35)).toFixed(2)
      ),
    }));
  }, []);

  const handleNavigateChamber = (chamberId: ChamberId) => {
    soundEngine.playChime(480, 0.18);
    setSimState((prev) => ({
      ...prev,
      activeChamber: chamberId,
      elevatorExplosion:
        chamberId === 'hardware_elevator' && prev.elevatorExplosion < 0.3
          ? 0.85
          : prev.elevatorExplosion,
    }));
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.enabled = next;
    if (next) soundEngine.playChime(523.25, 0.15);
  };

  const activeChamberInfo =
    CHAMBERS.find((c) => c.id === simState.activeChamber) || CHAMBERS[0];
  const activePedestal =
    HARDWARE_PEDESTALS[simState.selectedPedestalIndex] || HARDWARE_PEDESTALS[3];
  const currentPortal = CHAMBER_ATLAS_PORTALS[simState.activeChamber];

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[700px] overflow-hidden rounded-xl border border-slate-800 bg-[#07090e] text-slate-100 select-none shadow-2xl">
      {/* Sub-Header Navigation: Meta-Vision Navigation */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between gap-4 px-6 py-3 bg-[#07090e]/92 backdrop-blur-md border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-md shadow-amber-400/50" />
          <div className="flex flex-col">
            <span className="text-sm font-serif-editorial font-bold text-slate-100 flex items-center gap-1.5">
              <span>Cattedrale Pantheon 3D</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Meta-Visione del Sito
              </span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono-tech">
              L'intero Atlante osserva e naviga se stesso nello spazio 3D
            </span>
          </div>
        </div>

        {/* Chamber switcher */}
        <nav className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono-tech py-1">
          {CHAMBERS.map((ch) => {
            const isActive = simState.activeChamber === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => handleNavigateChamber(ch.id)}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {ch.shortTitle}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleToggleSound}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs flex items-center gap-1 cursor-pointer transition-colors"
            title={soundEnabled ? 'Disattiva Audio (Web Audio API)' : 'Attiva Audio'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Architettura & Blueprint</span>
          </button>
        </div>
      </div>

      {/* Floating Meta-Portal Radar & Chamber Card (Top-Left) */}
      {!isDockCollapsed && (
        <div className="absolute top-20 left-6 z-20 max-w-sm pointer-events-auto space-y-3 bg-[#080c16]/85 backdrop-blur-md p-5 rounded-xl border border-slate-700/80 shadow-2xl">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono-tech border-b border-slate-800 pb-2">
            <span className="text-amber-400 font-semibold">{activeChamberInfo.axisLabel}</span>
            <span>{activePedestal.name}</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-serif-editorial font-bold text-white tracking-tight">
              {activeChamberInfo.title}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
              {activeChamberInfo.description}
            </p>
          </div>

          {/* Hyper-Jump Portal into Math-Atlas */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
            <div className="text-[10px] uppercase tracking-wider font-mono-tech text-emerald-400 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Ponte Verso l'Atlante Matematico:
            </div>
            <div className="text-xs text-slate-300 font-medium font-sans">
              {currentPortal.portalDescription}
            </div>

            {onNavigateAtlasModule && (
              <button
                onClick={() => {
                  soundEngine.playChime(660, 0.25);
                  onNavigateAtlasModule(currentPortal.atlasModule);
                }}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center justify-between transition-all shadow-md group cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  <span>Entra in: {currentPortal.portalTitle}</span>
                </span>
                <span className="text-[10px] bg-slate-950/20 px-1.5 py-0.5 rounded font-mono">
                  Salta ➔
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Three.js 3D WebGL Canvas */}
      <div className="w-full h-full">
        <PantheonCanvas
          simState={simState}
          onSelectPedestal={handleSelectPedestal}
        />
      </div>

      {/* Unified Collapsible Bottom Control Dock */}
      <BottomControlDock
        simState={simState}
        isCollapsed={isDockCollapsed}
        onToggleCollapse={() => setIsDockCollapsed((p) => !p)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onChangeState={setSimState}
        onTriggerBackprop={handleTriggerBackprop}
      />

      {/* Mega-Prompt & Architectural Blueprint Modal */}
      <MegaPromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onJumpToChamber={(chamberId) => handleNavigateChamber(chamberId)}
      />
    </div>
  );
};
