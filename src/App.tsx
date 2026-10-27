/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AtlasGraph3D } from './components/AtlasGraph3D';
import { UnifiedDimensionalLab } from './components/UnifiedDimensionalLab';
import { TensorEllipsoidLab } from './components/TensorEllipsoidLab';
import { OperatorCalculusLab } from './components/OperatorCalculusLab';
import { RotationsAndProjectiveLab } from './components/RotationsAndProjectiveLab';
import { OntologyAndCompendiumView } from './components/OntologyAndCompendiumView';
import { Network, BookOpen } from 'lucide-react';

type ActiveModule =
  | 'graph3d'
  | 'dimensional'
  | 'tensor'
  | 'operator'
  | 'rotations'
  | 'ontology';

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('graph3d');
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
      {/* Top Bar Contract: 3 distinct element groups separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-[#090b10]/95 border-b border-slate-800/90 px-6 py-3.5">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div
            onClick={() => setActiveModule('graph3d')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-8 h-8 rounded bg-amber-500/15 border border-amber-400/50 flex items-center justify-center text-amber-400">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-serif-editorial font-bold tracking-tight text-slate-100 leading-none">
                MATH-ATLAS
              </div>
              <div className="text-[10px] font-mono-tech text-slate-400 mt-0.5">
                Ontologia Formale · Grafo 3D · Laboratori Dinamici
              </div>
            </div>
          </div>

          {/* Zone 2: 5 Single-Line Navigation Links */}
          <nav className="flex flex-wrap items-center gap-5 text-xs font-medium">
            {[
              { id: 'graph3d', label: 'Grafo 3D delle Teorie' },
              { id: 'dimensional', label: 'Lab Dimensioni & ℂ' },
              { id: 'tensor', label: 'Lab Tensori 3D' },
              { id: 'operator', label: 'Lab Operatori, Duali & mHC' },
              { id: 'rotations', label: 'Lab Rotazioni & Proiettiva' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id as ActiveModule)}
                className={`whitespace-nowrap py-1 transition-colors cursor-pointer border-b-2 ${
                  activeModule === item.id
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
            className={`px-4 py-2 rounded text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              activeModule === 'ontology'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Enciclopedia 40 Cat. & Specifica
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 py-6">
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
            Math-Atlas · Architettura Lossless: 40 Categorie · 9 Ponti Strutturali · 24 Capitoli · Lean 4 & MathLingua
          </div>
          <div>
            Dal Triangolo (2-Simplesso) al Topos, dal Teorema Spettrale alla Teoria KAM e al Politopo di Birkhoff (mHC)
          </div>
        </div>
      </footer>
    </div>
  );
}
