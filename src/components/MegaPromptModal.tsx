import React, { useState } from 'react';
import { Check, Copy, X } from 'lucide-react';
import { MEGA_PROMPT_TEXT } from '../data/pantheonData';

interface MegaPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToChamber: (chamberId: 'hardware_elevator' | 'matrices_tensors' | 'hydraulic_nn' | 'manifolds_metrics' | 'category_symmetries') => void;
}

export const MegaPromptModal: React.FC<MegaPromptModalProps> = ({
  isOpen,
  onClose,
  onJumpToChamber,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'path' | 'blueprint'>('prompt');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(MEGA_PROMPT_TEXT).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="w-full max-w-4xl max-h-[86vh] flex flex-col rounded-xl bg-[#0b101d] border border-slate-800 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 id="modal-title" className="text-xl font-semibold text-slate-100 font-display">
              Progetto Architetturale & Mega-Prompt 3D
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Dal percorso visivo in 4 passi all’infrastruttura completa del Pantheon della Mente e della Macchina
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800/70 transition-colors"
            aria-label="Chiudi finestra"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-[#080c16] border-b border-slate-800/80">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'prompt'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Mega-Prompt Ingegnerizzato
          </button>
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'blueprint'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Mappa degli Assi X · Y · Z
          </button>
          <button
            onClick={() => setActiveTab('path')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'path'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Percorso in 4 Passi (Da Zero ai Tensori)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-300 leading-relaxed">
          {activeTab === 'prompt' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-slate-400">
                  Questo Mega-Prompt definisce l’ambiente 3D che stai esplorando in tempo reale qui sotto. Puoi copiarlo per estenderlo o usarlo in motori generativi 3D.
                </p>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Prompt Copiato' : 'Copia Mega-Prompt'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-lg bg-[#060911] border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap overflow-x-auto leading-relaxed">
                {MEGA_PROMPT_TEXT}
              </pre>
            </div>
          )}

          {activeTab === 'blueprint' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-[#0e1526] border border-slate-800 space-y-2">
                <div className="text-xs text-amber-400 font-mono">Asse X & Asse Y</div>
                <h3 className="text-base font-semibold text-white">
                  1. L’Ascensore dell’Astrazione Hardware
                </h3>
                <p className="text-xs text-slate-300">
                  Ogni calcolatore (Abaco, Pascalina, Valvola, Transistor MOSFET, CPU, Server Rack, Computer Quantistico) si esplode verticalmente in 4 strati olografici: Chimica, Fisica, Informatica e Matematica Pura.
                </p>
                <button
                  onClick={() => {
                    onJumpToChamber('hardware_elevator');
                    onClose();
                  }}
                  className="mt-2 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-md transition-colors"
                >
                  Esplora Ascensore Hardware
                </button>
              </div>

              <div className="p-4 rounded-lg bg-[#0e1526] border border-slate-800 space-y-2">
                <div className="text-xs text-sky-400 font-mono">Asse Z · Ovest</div>
                <h3 className="text-base font-semibold text-white">
                  2. Stanza delle Matrici & Tensori
                </h3>
                <p className="text-xs text-slate-300">
                  La matrice è una gabbia laser 3D che deforma i poliedri in tempo reale; gli autovettori sono gli assi invarianti che non ruotano; il Tensore è un cubo sezionabile lungo piani di covarianza.
                </p>
                <button
                  onClick={() => {
                    onJumpToChamber('matrices_tensors');
                    onClose();
                  }}
                  className="mt-2 px-3 py-1.5 text-xs font-medium text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 rounded-md transition-colors"
                >
                  Entra nella Gabbia Laser
                </button>
              </div>

              <div className="p-4 rounded-lg bg-[#0e1526] border border-slate-800 space-y-2">
                <div className="text-xs text-cyan-400 font-mono">Asse Z · Centro</div>
                <h3 className="text-base font-semibold text-white">
                  3. Rete Neurale Idraulica Cinetica
                </h3>
                <p className="text-xs text-slate-300">
                  I dati scorrono come fluido fotonico in condotti di vetro; i pesi sinaptici sono valvole meccaniche; il Bias è una camera di pressione; la Backpropagation è un’onda luminosa inversa.
                </p>
                <button
                  onClick={() => {
                    onJumpToChamber('hydraulic_nn');
                    onClose();
                  }}
                  className="mt-2 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-md transition-colors"
                >
                  Aziona la Rete Idraulica
                </button>
              </div>

              <div className="p-4 rounded-lg bg-[#0e1526] border border-slate-800 space-y-2">
                <div className="text-xs text-emerald-400 font-mono">Asse Z · Est & Volta</div>
                <h3 className="text-base font-semibold text-white">
                  4. Varietà, Metriche, Categorie & Noether
                </h3>
                <p className="text-xs text-slate-300">
                  L’Altare Universale trasforma una sfera tra metrica Euclidea (L2), Manhattan (L1, ottaedro), Chebyshev (L∞, cubo) e Superficie di Riemann, sotto la Volta dei Funtori e dei Gruppi di Simmetria.
                </p>
                <button
                  onClick={() => {
                    onJumpToChamber('manifolds_metrics');
                    onClose();
                  }}
                  className="mt-2 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-md transition-colors"
                >
                  Visita l’Altare delle Metriche
                </button>
              </div>
            </div>
          )}

          {activeTab === 'path' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[#0e1526] border border-slate-800">
                <h3 className="text-base font-semibold text-white">
                  Passo 1: Capire le Matrici e i Vettori (Livello Base)
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Una matrice non è una tabella statica: è una forza che sposta, ruota o deforma lo spazio geometrico. Nella <strong className="text-amber-300">Stanza delle Matrici</strong> di questo Pantheon puoi trascinare i coefficienti <span className="font-mono">a, b, c, d</span> e vedere la gabbia laser e gli autovettori deformarsi all’istante (proprio come in GeoGebra).
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#0e1526] border border-slate-800">
                <h3 className="text-base font-semibold text-white">
                  Passo 2: Capire i Tensori e l’Intelligenza Artificiale (Livello Intermedio)
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Ispirato a TensorFlow Playground: nella <strong className="text-sky-300">Rete Neurale Idraulica</strong> vedi i flussi di dati attraversare valvole meccaniche (Pesi) e camere di pressione (Bias), con la possibilità di innescare un’onda di Backpropagation che ricalibra le valvole.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#0e1526] border border-slate-800">
                <h3 className="text-base font-semibold text-white">
                  Passo 3: La Matematica 3D in Movimento (Livello Avanzato)
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Seguendo la filosofia visiva di 3Blue1Brown (Manim), l’<strong className="text-emerald-300">Altare delle Varietà</strong> e la <strong className="text-purple-300">Volta delle Categorie</strong> trasformano concetti astratti come spazi metrici L1/L2, superfici di Riemann, Funtori e Teorema di Noether in architetture luminose manipolabili.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#0e1526] border border-slate-800">
                <h3 className="text-base font-semibold text-white">
                  Passo 4: Correlazione Verticale in Tempo Reale (Dal Silicio alla Matematica)
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Muovendo un cursore della matrice matematica al Livello 4 dell’<strong className="text-amber-300">Ascensore dell’Astrazione</strong>, vedrai istantaneamente ruotare il vettore di stato nella Sfera di Bloch (Livello 2: Fisica) e il reticolo cristallino (Livello 1: Chimica).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
