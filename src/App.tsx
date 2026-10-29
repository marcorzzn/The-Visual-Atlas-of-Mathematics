/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { VisualConceptAtlasLab } from './components/VisualConceptAtlasLab';
import { AtlasGraph3D } from './components/AtlasGraph3D';
import { UnifiedDimensionalLab } from './components/UnifiedDimensionalLab';
import { TensorEllipsoidLab } from './components/TensorEllipsoidLab';
import { OperatorCalculusLab } from './components/OperatorCalculusLab';
import { RotationsAndProjectiveLab } from './components/RotationsAndProjectiveLab';
import { OntologyAndCompendiumView } from './components/OntologyAndCompendiumView';
import { BookOpen } from 'lucide-react';

type ActiveModule =
  | 'visual_atlas'
  | 'graph3d'
  | 'dimensional'
  | 'tensor'
  | 'operator'
  | 'rotations'
  | 'ontology';

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('visual_atlas');
  const [ontologySubSection, setOntologySubSection] = useState<
    'taxonomy40' | 'bridges9' | 'book24' | 'cnl_lean'
  >('taxonomy40');

  const handleOpenLabFromGraph = (
    lab: 'dimensional' | 'tensor' | 'operator' | 'rotations' | 'cnl'
  ) => {
    if (lab === 'cnl') {
      setOntologySubSection('cnl_lean');
      setActiveModule('ontology');
    } else {
      setActiveModule(lab);
    }
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-[#e8ecf4] flex flex-col">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-[#090b10]/95 border-b border-slate-800/90 px-6 py-3.5">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveModule('visual_atlas');
            }}
            className="text-lg font-serif-editorial font-bold tracking-tight text-slate-100 whitespace-nowrap shrink-0"
          >
            ATHLAS · MATH-ATLAS
          </a>

          {/* Zone 2: 5 Concise Single-Line Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
            {[
              { id: 'visual_atlas', label: 'Atlante Visuale' },
              { id: 'dimensional', label: 'Dimensioni & ℂ' },
              { id: 'rotations', label: 'Rotazioni & Proiettiva' },
              { id: 'tensor', label: 'Tensori & Operatori' },
              { id: 'graph3d', label: 'Grafo 3D' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id as ActiveModule)}
                className={`whitespace-nowrap shrink-0 py-1 transition-colors cursor-pointer border-b-2 ${
                  activeModule === item.id ||
                  (item.id === 'tensor' && activeModule === 'operator')
                    ? 'border-amber-400 text-amber-300 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 Primary Action Button */}
          <button
            onClick={() => {
              setOntologySubSection('taxonomy40');
              setActiveModule('ontology');
            }}
            className={`px-4 py-2 rounded text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeModule === 'ontology'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Enciclopedia 40 Cat.
          </button>
        </div>
      </header>

      {/* Secondary Sub-Bar when in Tensor/Operator mode or mobile */}
      {(activeModule === 'tensor' || activeModule === 'operator') && (
        <div className="bg-[#0d111a] border-b border-slate-800/80 px-6 py-2">
          <div className="max-w-[1600px] mx-auto flex items-center gap-3 text-xs">
            <span className="text-slate-400 font-mono-tech">Seleziona Laboratorio:</span>
            <button
              onClick={() => setActiveModule('tensor')}
              className={`px-3 py-1 rounded font-mono-tech cursor-pointer whitespace-nowrap ${
                activeModule === 'tensor'
                  ? 'bg-amber-400 text-slate-950 font-semibold'
                  : 'bg-slate-900 text-slate-300 border border-slate-800'
              }`}
            >
              Lab Tensori 3D (Inerzia, Sforzo, Ricci)
            </button>
            <button
              onClick={() => setActiveModule('operator')}
              className={`px-3 py-1 rounded font-mono-tech cursor-pointer whitespace-nowrap ${
                activeModule === 'operator'
                  ? 'bg-amber-400 text-slate-950 font-semibold'
                  : 'bg-slate-900 text-slate-300 border border-slate-800'
              }`}
            >
              Lab Operatori, Spazio Duale & Politopo di Birkhoff (mHC)
            </button>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 py-6">
        {activeModule === 'visual_atlas' && <VisualConceptAtlasLab />}
        {activeModule === 'graph3d' && (
          <AtlasGraph3D onOpenLab={handleOpenLabFromGraph} />
        )}
        {activeModule === 'dimensional' && <UnifiedDimensionalLab />}
        {activeModule === 'tensor' && <TensorEllipsoidLab />}
        {activeModule === 'operator' && <OperatorCalculusLab />}
        {activeModule === 'rotations' && <RotationsAndProjectiveLab />}
        {activeModule === 'ontology' && (
          <OntologyAndCompendiumView
            key={ontologySubSection}
            initialSection={ontologySubSection}
          />
        )}
      </main>

      {/* Subtle Academic Footer */}
      <footer className="border-t border-slate-800/80 bg-[#07090d] px-6 py-4 text-xs text-slate-400 font-mono-tech">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            ATHLAS · Prodotto Visuale Multi-Formalismo (Algebra Lineare · Geometria Analitica/Proiettiva · Circuiti & Grafi)
          </div>
          <div>
            Dal Triangolo (2-Simplesso) alla Piramide e all’Ipercubo 4D, dai Circuiti di Karnaugh alla Macchina di Turing e HoTT
          </div>
        </div>
      </footer>
    </div>
  );
}
