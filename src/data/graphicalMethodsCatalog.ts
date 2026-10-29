/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MathematicalDomain =
  | 'algebra_groups'
  | 'categories_logic'
  | 'topology_geometry'
  | 'physics_tensors'
  | 'dynamical_systems'
  | 'discrete_combinatorics'
  | 'analysis_complex';

export interface GraphicalMethodEntry {
  id: string;
  name: string;
  italianTitle: string;
  domain: MathematicalDomain;
  domainLabel: string;
  historicalOrigin: string;
  targetMathematicalObjects: string[];
  theoreticalSummary: string;
  formalIsomorphismTheorem: string;
  keyEquationOrFormula: string;
  primaryBibliography: string[];
  computationalTools: string[];
  searchKeywords: string[];
  exampleInterpretation: string;
}

export const DOMAIN_META: Record<
  MathematicalDomain,
  { label: string; color: string; badgeBg: string; borderColor: string }
> = {
  algebra_groups: {
    label: 'Algebra, Gruppi & Lie',
    color: '#f59e0b',
    badgeBg: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
  categories_logic: {
    label: 'Categorie & Logica Formale',
    color: '#a855f7',
    badgeBg: 'rgba(168, 85, 247, 0.12)',
    borderColor: 'rgba(168, 85, 247, 0.35)',
  },
  topology_geometry: {
    label: 'Topologia, Varietà & Nodi',
    color: '#38bdf8',
    badgeBg: 'rgba(56, 189, 248, 0.12)',
    borderColor: 'rgba(56, 189, 248, 0.35)',
  },
  physics_tensors: {
    label: 'Fisica Matematica & Tensori',
    color: '#ef4444',
    badgeBg: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  dynamical_systems: {
    label: 'Sistemi Dinamici & Caos',
    color: '#10b981',
    badgeBg: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  discrete_combinatorics: {
    label: 'Combinatoria & Strutture Discrete',
    color: '#ec4899',
    badgeBg: 'rgba(236, 72, 153, 0.12)',
    borderColor: 'rgba(236, 72, 153, 0.35)',
  },
  analysis_complex: {
    label: 'Analisi Complessa & Continuo',
    color: '#06b6d4',
    badgeBg: 'rgba(6, 182, 212, 0.12)',
    borderColor: 'rgba(6, 182, 212, 0.35)',
  },
};

export const GRAPHICAL_METHODS_CATALOG: GraphicalMethodEntry[] = [
  // 1. DIAGRAMMI DI HASSE
  {
    id: 'hasse_diagrams',
    name: 'Diagrammi di Hasse',
    italianTitle: 'Diagrammi di Hasse per Insiemi Parzialmente Ordinati e Reticoli',
    domain: 'algebra_groups',
    domainLabel: 'Algebra, Gruppi & Lie',
    historicalOrigin: 'Helmut Hasse (1932); formalizzati da Garrett Birkhoff (1940)',
    targetMathematicalObjects: [
      'Insiemi parzialmente ordinati (Poset)',
      'Reticoli di sottogruppi di un gruppo finito G',
      'Reticoli booleani delle parti P(X)',
      'Ideali di un anello commutativo',
      'Partizioni e partizioni di interi',
    ],
    theoreticalSummary:
      'Rappresentazione grafica dell’ordine parziale (P, ≤) come grafo diretto orientato verticalmente verso l’alto, in cui gli archi indicano esclusivamente la relazione di copertura immediata (x ⋖ y, cioè x < y e non esiste z tale che x < z < y). L’orientamento verticale rende implicita la transitività e la riflessività eliminando tutti gli archi ridondanti.',
    formalIsomorphismTheorem:
      'Teorema di Rappresentazione di Birkhoff per Reticoli Distributivi: ogni reticolo distributivo finito L è canonicamente isomorfo al reticolo degli insiemi inferiori (down-sets) del poset dei suoi elementi unione-irriducibili: L ≅ J(P(L)). Manipolare il diagramma di Hasse equivale a calcolare join (∨) e meet (∧).',
    keyEquationOrFormula:
      'x \\lessdot y \\iff x < y \\;\\land\\; \\neg \\exists z (x < z < y), \\quad L \\cong \\mathcal{J}(\\mathcal{P}(L))',
    primaryBibliography: [
      'Birkhoff, G. (1940). Lattice Theory. AMS Colloquium Publications.',
      'Stanley, R.P. (2011). Enumerative Combinatorics, Vol. 1. Cambridge University Press.',
      'Davey, B.A., & Priestley, H.A. (2002). Introduction to Lattices and Order.',
    ],
    computationalTools: ['SageMath (Posets)', 'Graphviz (dot rankdir=BT)', 'TikZ (matrix of math nodes)', 'Mathematica (HasseDiagram)'],
    searchKeywords: ['hasse', 'poset', 'reticolo', 'ordine parziale', 'sottogruppi', 'copertura', 'birkhoff', 'ideali', 'booleano'],
    exampleInterpretation:
      'Nel reticolo dei divisori di 60 ordinati per divisibilità, 60 è in cima e 1 alla base; due interi sono collegati se e solo se il loro quoziente è un numero primo. Nel reticolo dei sottogruppi del gruppo simmetrico S₃, il diagramma visualizza immediatamente la torre di Sylow e la normalità (i sottogruppi normali sono invarianti per coniugazione).',
  },

  // 2. GRAFI DI CAYLEY
  {
    id: 'cayley_graphs',
    name: 'Grafi di Cayley',
    italianTitle: 'Grafi di Cayley per Gruppi Generati Finiti',
    domain: 'algebra_groups',
    domainLabel: 'Algebra, Gruppi & Lie',
    historicalOrigin: 'Arthur Cayley (1878); Teoria geometrica dei gruppi sviluppata da Mikhail Gromov (1987)',
    targetMathematicalObjects: [
      'Gruppi astratti con presentazione ⟨S | R⟩',
      'Cammini di parole e Problema della Parola (Word Problem)',
      'Gruppi iperbolici nel senso di Gromov',
      'Tassellature regolari del piano euclideo e iperbolico',
    ],
    theoreticalSummary:
      'Dato un gruppo G e un insieme di generatori S, il grafo di Cayley Γ(G, S) ha come vertici gli elementi di G e come archi colorati ed orientati le coppie (g, gs) per g ∈ G, s ∈ S. La moltiplicazione a destra per un generatore corrisponde a percorrere un arco; la moltiplicazione a sinistra è un automorfismo del grafo.',
    formalIsomorphismTheorem:
      'Teorema di Švarc-Milnor: Se un gruppo G agisce in modo geometrico (isocoro, proprio e cocompatto) su uno spazio metrico geodetico X, allora G (con la metrica della parola d_S) è quasi-isometrico a X. I cicli chiusi nel grafo corrispondono biunivocamente alle relazioni formali r ∈ R del gruppo.',
    keyEquationOrFormula:
      'V(\\Gamma) = G, \\quad E(\\Gamma) = \\{(g, gs) : g \\in G, s \\in S\\}, \\quad w \\in R \\iff \\text{cammino}(w) \\text{ è chiuso}',
    primaryBibliography: [
      'Cayley, A. (1878). Desiderata and suggestions: No. 2. The Theory of groups: graphical representation.',
      'Gromov, M. (1987). Hyperbolic Groups. Essays in Group Theory, MSRI.',
      'de la Harpe, P. (2000). Topics in Geometric Group Theory. Chicago Lectures in Mathematics.',
    ],
    computationalTools: ['GAP (Gruppi e rappresentazioni)', 'SageMath (CayleyGraph)', 'Gephi / Three.js', 'TikZ-graph'],
    searchKeywords: ['cayley', 'grafo di cayley', 'gruppo finito', 'presentazione gruppo', 'gromov', 'parola', 'svarc-milnor', 'iperbolico'],
    exampleInterpretation:
      'Il gruppo diedrale D₄ (simmetrie del quadrato) generato dalla rotazione r e dalla riflessione s genera un grafo bidimensionale ottagonale con due colori per gli archi (rosso per r, blu per s). Percorrere rrrr = 1 riporta al vertice identità.',
  },

  // 3. DIAGRAMMI DI DYNKIN E GRAFI DI COXETER
  {
    id: 'dynkin_diagrams',
    name: 'Diagrammi di Dynkin & Grafi di Coxeter',
    italianTitle: 'Classificazione di Dynkin per Algebre di Lie Semisemplici e Sistemi di Radici',
    domain: 'algebra_groups',
    domainLabel: 'Algebra, Gruppi & Lie',
    historicalOrigin: 'Wilhelm Killing (1888), Élie Cartan (1894), Eugene Dynkin (1947), Harold Coxeter (1934)',
    targetMathematicalObjects: [
      'Algebre di Lie semisemplici complesse',
      'Sistemi di radici cristallografici irriducibili',
      'Gruppi di riflessione finiti e gruppi di Weyl',
      'Fisica teorica: teorie di gauge Yang-Mills, supersimmetria e String Theory',
    ],
    theoreticalSummary:
      'Grafo decorato che codifica completamente la matrice di Cartan di un sistema di radici. I vertici rappresentano le radici semplici; il numero di archi tra due vertici (0, 1, 2 o 3) codifica l’angolo geometrico tra le radici (90°, 120°, 135° o 150°). Una freccia indica quale radice ha lunghezza minore nei legami multipli.',
    formalIsomorphismTheorem:
      'Teorema di Classificazione di Killing-Cartan-Dynkin: Esiste una biiezione canonica tra le algebre di Lie semisemplici semplici complesse a meno di isomorfismo e i diagrammi di Dynkin connessi: le quattro famiglie infinite classiche A_n, B_n, C_n, D_n e i cinque casi eccezionali G₂, F₄, E₆, E₇, E₈.',
    keyEquationOrFormula:
      'A_{ij} = \\frac{2\\langle \\alpha_i, \\alpha_j \\rangle}{\\langle \\alpha_j, \\alpha_j \\rangle}, \\quad n_{ij} = A_{ij}A_{ji} = 4\\cos^2(\\theta_{ij}) \\in \\{0, 1, 2, 3\\}',
    primaryBibliography: [
      'Dynkin, E.B. (1947). The structure of semi-simple algebras. Uspekhi Mat. Nauk.',
      'Humphreys, J.E. (1972). Introduction to Lie Algebras and Representation Theory. Springer GTM 9.',
      'Coxeter, H.S.M. (1934). Discrete groups generated by reflections. Annals of Mathematics.',
    ],
    computationalTools: ['SageMath (RootSystem, DynkinDiagram)', 'LiE software', 'GAP Package QuaGroup', 'LaTeX package dynkin-diagrams'],
    searchKeywords: ['dynkin', 'coxeter', 'algebre di lie', 'matrice di cartan', 'radici semplici', 'weyl', 'e8', 'su(n)', 'so(n)'],
    exampleInterpretation:
      'A_n corrisponde a SU(n+1) (catena lineare di n vertici con archi singoli); E₈ corrisponde al gruppo di Lie eccezionale di dimensione 248, descritto da 8 nodi collegati con un singolo snodo a stella sul terzo vertice.',
  },

  // 4. TABLEAUX DI YOUNG E DIAGRAMMI DI FERRERS
  {
    id: 'young_tableaux',
    name: 'Tableaux di Young & Diagrammi di Ferrers',
    italianTitle: 'Tableaux di Young per Rappresentazioni del Gruppo Simmetrico e Partizioni',
    domain: 'algebra_groups',
    domainLabel: 'Algebra, Gruppi & Lie',
    historicalOrigin: 'Alfred Young (1900), Norman Macleod Ferrers (1853)',
    targetMathematicalObjects: [
      'Partizioni di interi λ ⊢ n',
      'Rappresentazioni irriducibili del gruppo simmetrico S_n (Specht modules)',
      'Rappresentazioni irriducibili di GL(n, ℂ) e SU(N)',
      'Funzioni simmetriche di Schur s_λ e calcolo di Schubert',
    ],
    theoreticalSummary:
      'Un diagramma di Ferrers/Young è un insieme di scatole disposte in righe allineate a sinistra con lunghezze decrescenti λ₁ ≥ λ₂ ≥ ... ≥ λ_k. Un Tableau di Young standard riempie le n scatole con 1, 2, ..., n in modo strettamente crescente lungo ogni riga e colonna.',
    formalIsomorphismTheorem:
      'Formula della Lunghezza dei Ganci (Hook Length Formula di Frame-Robinson-Thrall): la dimensione della rappresentazione irriducibile V_λ di S_n è esattamente n! diviso per il prodotto delle lunghezze dei ganci h(i,j) di ogni casella: dim(V_λ) = n! / ∏ h(i,j).',
    keyEquationOrFormula:
      '\\dim(V_\\lambda) = \\frac{n!}{\\prod_{(i,j) \\in \\lambda} h(i,j)}, \\quad h(i,j) = (\\lambda_i - j) + (\\lambda\'_j - i) + 1',
    primaryBibliography: [
      'Young, A. (1900). On quantitative substitutional analysis. Proc. London Math. Soc.',
      'Fulton, W. (1997). Young Tableaux. Cambridge University Press.',
      'Frame, J.S., Robinson, G.d.B., & Thrall, R.M. (1954). The hook graphs of the symmetric group.',
    ],
    computationalTools: ['SageMath (Tableaux, Partitions)', 'Schur software', 'SymPy combinatorics', 'LaTeX ytables / youngtab'],
    searchKeywords: ['young', 'tableaux', 'ferrers', 'partizioni', 'hook length', 'specht', 'schur', 'rappresentazioni', 'littlewood-richardson'],
    exampleInterpretation:
      'Per n=3 ci sono tre partizioni: [3] (rappresentazione banale, dim 1), [2,1] (rappresentazione standard bidimensionale, dim 2), [1,1,1] (rappresentazione segno, dim 1). Il modello a quark di Gell-Mann per gli adroni è interamente calcolato componendo tableaux di SU(3).',
  },

  // 5. DIAGRAMMI COMMUTATIVI
  {
    id: 'commutative_diagrams',
    name: 'Diagrammi Commutativi',
    italianTitle: 'Diagrammi Commutativi in Teoria delle Categorie e Algebra Omologica',
    domain: 'categories_logic',
    domainLabel: 'Categorie & Logica Formale',
    historicalOrigin: 'Saunders Mac Lane, Samuel Eilenberg (1945); Alexander Grothendieck (1957)',
    targetMathematicalObjects: [
      'Oggetti e morfismi in qualsiasi categoria C',
      'Proprietà universali (Pullback, Pushout, Prodotti fibrati)',
      'Sequenze esatte corte e lunghe, complessi di catene',
      'Lemmi diagrammatici: Lemma del Serpente, Lemma dei Cinque, Lemma dei Nove',
    ],
    theoreticalSummary:
      'Un grafo diretto i cui vertici sono oggetti di una categoria e i cui archi orientati sono morfismi. Il diagramma è detto commutativo se, per ogni coppia di vertici sorgente e bersaglio, qualsiasi cammino orientato tra di essi produce, tramite composizione dei morfismi, lo stesso identico morfismo finale.',
    formalIsomorphismTheorem:
      'Lemma del Diagram Chase (Inseguimento Diagrammatico / Teorema di Embedding di Freyd-Mitchell): qualsiasi teorema dimostrato tramite inseguimento diagrammatico su elementi in una categoria abeliana astratta è valido e semanticamente corretto, poiché ogni categoria abeliana piccola si immerge pienamente ed esattamente nella categoria R-Mod dei moduli su un anello.',
    keyEquationOrFormula:
      'g \\circ f = h, \\quad 0 \\to A \\xrightarrow{f} B \\xrightarrow{g} C \\to 0 \\;\\implies\\; \\ker(g) = \\mathrm{Im}(f)',
    primaryBibliography: [
      'Mac Lane, S. (1971). Categories for the Working Mathematician. Springer GTM 5.',
      'Aluffi, P. (2009). Algebra: Chapter 0. Graduate Studies in Mathematics.',
      'Freyd, P. (1964). Abelian Categories. Harper & Row.',
    ],
    computationalTools: ['TikZ-CD (LaTeX standard)', 'Quiver (q.uiver.app)', 'Catlab.jl / AlgebraicJulia', 'Agda / Lean 4 category_theory'],
    searchKeywords: ['diagrammi commutativi', 'frecce', 'morfismi', 'categorie', 'pullback', 'pushout', 'lemma del serpente', 'diagram chase'],
    exampleInterpretation:
      'La definizione universale di prodotto fibrato (pullback) P = X ×_Z Y assicura che per ogni cono concorrente (W → X, W → Y) che rende commutativo il quadrato esterno, esiste un unico morfismo u: W → P che fattorizza l’intero diagramma.',
  },

  // 6. STRING DIAGRAMS (DIAGRAMMI A STRINGHE)
  {
    id: 'string_diagrams',
    name: 'String Diagrams (Diagrammi a Stringhe)',
    italianTitle: 'Diagrammi a Stringhe per Categorie Monoidali e Calcolo Quantistico',
    domain: 'categories_logic',
    domainLabel: 'Categorie & Logica Formale',
    historicalOrigin: 'André Joyal e Ross Street (1991); esteso da John Baez e Bob Coecke (2000-2010)',
    targetMathematicalObjects: [
      'Categorie monoidali (tensoriali), braided, simmetriche e compatte chiuse',
      'Algebre e coalgebra di Frobenius, algebre di Hopf',
      'Circuiti quantistici, teletrasporto e misura',
      'Teoria dei nodi e invarianti quantistici di 3-varietà',
    ],
    theoreticalSummary:
      'Notazione grafica bidimensionale duale ai diagrammi commutativi: gli oggetti sono linee o fili (stringhe 1D), i morfismi sono scatole o nodi (vertici 2D), la composizione categoriale (∘) è la connessione verticale, e il prodotto tensoriale (⊗) è l’accostamento orizzontale in parallelo.',
    formalIsomorphismTheorem:
      'Teorema di Coerenza di Joyal-Street: Un’equazione algebrica tra morfismi in una categoria monoidale autonoma/compatta chiusa vale se e solo se i loro rispettivi diagrammi a stringhe sono isotopicamente equivalenti per deformazione continua nel piano/spazio, preservando le connessioni.',
    keyEquationOrFormula:
      'f: A \\otimes B \\to C \\implies \\begin{array}{c} A \\quad B \\\\ \\boxed{f} \\\\ C \\end{array}, \\quad (\\mathrm{ev}_A \\otimes \\mathrm{id}_A) \\circ (\\mathrm{id}_A \\otimes \\mathrm{coev}_A) = \\mathrm{id}_A',
    primaryBibliography: [
      'Joyal, A., & Street, R. (1991). The geometry of tensor calculus, I. Advances in Mathematics, 88(1).',
      'Selinger, P. (2010). A survey of graphical languages for monoidal categories. Springer LNP 813.',
      'Coecke, B., & Kissinger, A. (2017). Picturing Quantum Processes. Cambridge University Press.',
    ],
    computationalTools: ['DisCoPy (Python for Monoidal Categories)', 'TikZ', 'Quantomatic', 'PyZX'],
    searchKeywords: ['string diagrams', 'diagrammi a stringhe', 'joyal-street', 'monoidale', 'tensore', 'coerenza', 'frobenius', 'hopf'],
    exampleInterpretation:
      'L’assioma del serpente (Snake Equation o Zig-Zag) per la dualità esprime il fatto che tirare le estremità di una corda piegata a S la raddrizza in una linea retta: geometricamente banale, algebricamente corrisponde all’identità fondamentale (ev ⊗ id) ∘ (id ⊗ coev) = id.',
  },

  // 7. NOTAZIONE GRAFICA DI PENROSE & BIRDTRACKS
  {
    id: 'penrose_birdtracks',
    name: 'Notazione Grafica di Penrose & Birdtracks',
    italianTitle: 'Calcolo Tensoriale Diagrammatico e Invarianti di Gruppi di Lie',
    domain: 'physics_tensors',
    domainLabel: 'Fisica Matematica & Tensori',
    historicalOrigin: 'Roger Penrose (1971), Predrag Cvitanović (Birdtracks, 1976-2008)',
    targetMathematicalObjects: [
      'Tensori di rango generico T^{i₁...i_k}_{j₁...j_m} in Relatività Generale',
      'Spinori a due componenti e formalismo NP (Newman-Penrose)',
      'Invarianti di Casimir e decomposizione in rappresentazioni irriducibili di algebre di Lie (SU(N), SO(N), Sp(N))',
      'Identità di Bianchi, contrazioni di Riemann e Ricci',
    ],
    theoreticalSummary:
      'Ogni tensore è una forma geometrica chiusa; ogni indice controvariante (in alto) è una linea che esce dal tensore verso l’alto, mentre ogni indice covariante (in basso) scende verso il basso. La contrazione di due indici (sommatoria di Einstein) consiste semplicemente nel saldare insieme i due rami creando un collegamento continuo.',
    formalIsomorphismTheorem:
      'Equivalenza Grafico-Tensoriale: Qualsiasi manipolazione diagrammatica (inversioni, simmetrizzazioni con barre orizzontali bianche/nere, antisimmetrizzazioni) preserva in modo esatto la covarianza sotto trasformazioni di coordinate diffeomorfe.',
    keyEquationOrFormula:
      'T^i_j \\to \\boxed{T}\\!\\begin{array}{l}\\uparrow^i \\\\ \\downarrow_j \\end{array}, \\quad T^i_i = \\mathrm{Tr}(T) \\to \\text{anello chiuso}, \\quad R_{\\mu\\nu} = R^\\lambda_{\\ \\mu\\lambda\\nu}',
    primaryBibliography: [
      'Penrose, R. (1971). Applications of negative dimensional tensors. Combinatorial Mathematics and its Applications.',
      'Cvitanović, P. (2008). Group Theory: Birdtracks, Lie\'s, and Exceptional Groups. Princeton University Press.',
      'Penrose, R., & Rindler, W. (1984). Spinors and Space-Time, Vol. 1. Cambridge University Press.',
    ],
    computationalTools: ['xAct / xTensor per Mathematica', 'Birdtracks scripts', 'TikZ', 'TensorGraphics'],
    searchKeywords: ['penrose', 'birdtracks', 'tensori', 'contrazione', 'relativita', 'spinori', 'riemann', 'cvitanovic', 'lie'],
    exampleInterpretation:
      'La contrazione completa del tensore di Riemann con due metriche inverse genera lo scalare di Ricci R: nella notazione di Penrose, il blocco a 4 rami di Riemann è chiuso ad anello su due lati, eliminando ogni traccia di indici greci astratti.',
  },

  // 8. ZX-CALCULUS
  {
    id: 'zx_calculus',
    name: 'ZX-Calculus',
    italianTitle: 'ZX-Calculus: Calcolo Grafico Completo per l’Informazione Quantistica',
    domain: 'physics_tensors',
    domainLabel: 'Fisica Matematica & Tensori',
    historicalOrigin: 'Bob Coecke e Ross Duncan (2008-2011); completato da Emmanuel Jeandel et al. (2018)',
    targetMathematicalObjects: [
      'Circuiti quantistici e porte logiche (Hadamard, CNOT, Phase, T-gate)',
      'Stati di cluster e Quantum Error Correction (Surface Codes)',
      'Compilazione e ottimizzazione di circuiti quantistici per NISQ',
      'Misura a una via (Measurement-based Quantum Computation, MBQC)',
    ],
    theoreticalSummary:
      'Un calcolo grafico rigoroso composto da due famiglie di generatori: Ragni Verdi (Z-spiders, base computazionale {|0⟩, |1⟩}) e Ragni Rossi (X-spiders, base di Hadamard {|+⟩, |-⟩}) con n fili entranti, m fili uscenti e una fase angolare α ∈ [0, 2π). Regole di riscrittura locali sostituiscono integralmente la moltiplicazione di matrici complesse 2^n × 2^n.',
    formalIsomorphismTheorem:
      'Teorema di Completezza del Calcolo ZX: Il calcolo ZX è sound and complete per l’intera meccanica quantistica pura a stati finiti: due diagrammi ZX rappresentano lo stesso operatore lineare se e solo se è possibile trasformare l’uno nell’altro applicando esclusivamente le regole grafiche locali di riscrittura ZX (Spider fusion, Bialgebra, Hopf, Pi-commutation).',
    keyEquationOrFormula:
      'Z_n^m(\\alpha) = |0\\rangle^{\\otimes m}\\langle 0|^{\\otimes n} + e^{i\\alpha}|1\\rangle^{\\otimes m}\\langle 1|^{\\otimes n}, \\quad Z(\\alpha) \\circ Z(\\beta) = Z(\\alpha + \\beta)',
    primaryBibliography: [
      'Coecke, B., & Duncan, R. (2011). Interacting quantum observables: categorical quantum mechanics with ZX calculus. NJP.',
      'Jeandel, E., Perdrix, S., & Vilmart, R. (2018). A Complete Axiomatisation of the ZX-Calculus for Clifford+T.',
      'van de Wetering, J. (2020). ZX-calculus for the working quantum computer scientist.',
    ],
    computationalTools: ['PyZX (Python compiler open source)', 'Quipper (Haskell)', 'Quantomatic', 'TikZ'],
    searchKeywords: ['zx-calculus', 'ragni verdi rossi', 'qubit', 'calcolo quantistico', 'coecke', 'pyzx', 'cnot', 'hadamard', 'clifford'],
    exampleInterpretation:
      'Due ragni verdi Z connessi da uno o più fili si fondono istantaneamente in un singolo ragno Z sommando le loro fasi (α + β): una fusione visiva che riduce immediatamente la complessità del circuito prima di mandarlo in esecuzione su hardware quantistico reale.',
  },

  // 9. DIAGRAMMI DI FEYNMAN
  {
    id: 'feynman_diagrams',
    name: 'Diagrammi di Feynman',
    italianTitle: 'Diagrammi di Feynman in Elettrodinamica Quantistica e Teoria dei Campi',
    domain: 'physics_tensors',
    domainLabel: 'Fisica Matematica & Tensori',
    historicalOrigin: 'Richard Feynman (1948-1949); formalizzati da Freeman Dyson (1949)',
    targetMathematicalObjects: [
      'Espansione perturbativa della matrice S di diffusione (S-Matrix)',
      'Funzioni di correlazione di Green a n-punti in QED e QCD',
      'Correzioni radiative a 1-loop, 2-loop e rinormalizzazione',
    ],
    theoreticalSummary:
      'Traduzione grafico-spaziotemporale dell’integrale di cammino (Path Integral) e del Teorema di Wick. Le linee continue rappresentano fermioni (elettroni/positroni), le linee ondulate rappresentano bosoni di gauge (fotoni), le linee a spirale sono gluoni. Ogni vertice introduce una costante di accoppiamento.',
    formalIsomorphismTheorem:
      'Teorema di Equivalenza di Dyson: Ogni diagramma topologico di Feynman con V vertici ed E propagatori interni corrisponde biunivocamente a un termine preciso nell’espansione della serie di Dyson: S = T\\{\\exp(-i \\int H_I dt)\\}. L’ordine perturbativo corrisponde al numero di anelli (loop expansion = ordine in ℏ).',
    keyEquationOrFormula:
      '\\mathcal{M} = \\int \\prod d^4 k_i \\; \\prod_{\\text{vertici}} (-ie\\gamma^\\mu) \\prod_{\\text{propagatori}} \\frac{i(\\not{p}+m)}{p^2 - m^2 + i\\epsilon} \\frac{-i g_{\\mu\\nu}}{q^2 + i\\epsilon}',
    primaryBibliography: [
      'Feynman, R.P. (1949). Space-time approach to quantum electrodynamics. Physical Review, 76(6).',
      'Dyson, F.J. (1949). The radiation theories of Tomonaga, Schwinger, and Feynman. Physical Review.',
      'Peskin, M.E., & Schroeder, D.V. (1995). An Introduction to Quantum Field Theory.',
    ],
    computationalTools: ['FeynArts / FormCalc (Mathematica)', 'QGRAF', 'TikZ-Feynman (LaTeX)', 'MadGraph5'],
    searchKeywords: ['feynman', 'qed', 'qft', 'loop', 'propagatore', 'matrice s', 'scattering', 'rinormalizzazione', 'dyson'],
    exampleInterpretation:
      'Lo scattering Møller elettrone-elettrone e⁻e⁻ → e⁻e⁻ si visualizza con due linee fermioniche che entrano, scambiano un singolo fotone ondulato virtuale (t-channel e u-channel), e si allontanano: la sezione d’urto differenziale si ottiene calcolando l’ampiezza invariante di questo diagramma.',
  },

  // 10. RITRATTI DI FASE, MAPPE DI POINCARÉ & BIFORCAZIONI
  {
    id: 'phase_portraits',
    name: 'Ritratti di Fase, Mappe di Poincaré & Diagrammi di Biforcazione',
    italianTitle: 'Geometria Qualitativa dei Sistemi Dinamici nello Spazio delle Fasi',
    domain: 'dynamical_systems',
    domainLabel: 'Sistemi Dinamici & Caos',
    historicalOrigin: 'Henri Poincaré (1892), Aleksandr Lyapunov (1892), Mitchell Feigenbaum (1978)',
    targetMathematicalObjects: [
      'Campi vettoriali non lineari su varietà differenziabili dot{x} = f(x)',
      'Equilibri stabili, selle iperboliche, cicli limite (Teorema di Poincaré-Bendixson)',
      'Biforcazioni locali: sella-nodo, transcritica, a forcone, di Hopf',
      'Attrattori caotici (Lorenz, Rössler) ed esponenti di Lyapunov',
    ],
    theoreticalSummary:
      'Lo spazio di stato euclideo o simplettico è riempito con le orbite integrali del flusso dinamico. Una Mappa di Poincaré interseca trasversalmente il flusso continuo riducendolo a una mappa discreta P: Σ → Σ che preserva le proprietà di stabilità e periodicità.',
    formalIsomorphismTheorem:
      'Teorema di Hartman-Grobman: Vicino a un punto di equilibrio iperbolico, il flusso non lineare è topologicamente coniugato (omeomorfo) al suo flusso linearizzato governato dalla matrice Jacobiana: dot{x} = J(x_0)x.',
    keyEquationOrFormula:
      '\\dot{\\mathbf{x}} = \\mathbf{f}(\\mathbf{x}), \\quad \\mathbf{x}_{n+1} = P(\\mathbf{x}_n), \\quad \\delta = \\lim_{n\\to\\infty} \\frac{\\mu_n - \\mu_{n-1}}{\\mu_{n+1} - \\mu_n} \\approx 4.6692016',
    primaryBibliography: [
      'Poincaré, H. (1892). Les méthodes nouvelles de la mécanique céleste. Gauthier-Villars.',
      'Strogatz, S.H. (1994). Nonlinear Dynamics and Chaos. Westview Press.',
      'Guckenheimer, J., & Holmes, P. (1983). Nonlinear Oscillations, Dynamical Systems, and Bifurcations of Vector Fields.',
    ],
    computationalTools: ['Matplotlib / Streamplot', 'Julia DynamicalSystems.jl', 'AUTO-07p', 'SageMath'],
    searchKeywords: ['ritratto di fase', 'poincare', 'biforcazione', 'caos', 'feigenbaum', 'lorenz', 'ciclo limite', 'lyapunov', 'hartman-grobman'],
    exampleInterpretation:
      'Nel pendolo non lineare smorzato con forzante, le traiettorie si avvolgono nello spazio tridimensionale (angolo, velocità angolare, tempo); sezionando lo spazio ogni periodo T con una mappa di Poincaré stroboscopica, emerge la struttura frattale dell’attrattore caotico.',
  },

  // 11. DIAGRAMMI DI VORONOI E TRIANGOLAZIONI DI DELAUNAY
  {
    id: 'voronoi_delaunay',
    name: 'Diagrammi di Voronoi & Triangolazioni di Delaunay',
    italianTitle: 'Decomposizione Spaziale Duale e Complessi Simplessiali Geometrici',
    domain: 'discrete_combinatorics',
    domainLabel: 'Combinatoria & Strutture Discrete',
    historicalOrigin: 'Georgy Voronoy (1908), Boris Delaunay (1934), Peter Dirichlet (1850)',
    targetMathematicalObjects: [
      'Insieme discreto di siti P = {p₁, ..., p_n} nello spazio metrico ℝ^d',
      'Celle di prossimità poliedriche convesse V(p_i)',
      'Complessi simpliciali di Delaunay DT(P) e Alpha-Shapes',
      'Topologia computazionale: Analisi Topologica dei Dati (TDA) e omologia persistente',
    ],
    theoreticalSummary:
      'Il diagramma di Voronoi partiziona lo spazio in regioni convesse, dove la cella di p_i racchiude tutti i punti più vicini a p_i che a qualunque altro sito. La triangolazione di Delaunay è il grafo duale planare: due siti sono uniti da un arco se le loro celle di Voronoi condividono una faccia d-1 dimensionale.',
    formalIsomorphismTheorem:
      'Teorema della Sfera Vuota di Delaunay: Un simplesso appartiene alla triangolazione di Delaunay se e solo se la sua ipersfera circoscritta non contiene alcun altro sito dell’insieme al proprio interno. In 2D, massimizza l’angolo minimo di tutti i triangoli (evita triangoli degeneri/sottili).',
    keyEquationOrFormula:
      'V(p_i) = \\{x \\in \\mathbb{R}^d : \\|x - p_i\\| \\le \\|x - p_j\\| \\; \\forall j \\neq i\\}, \\quad \\mathrm{DT}(P) \\cong \\mathrm{Dual}(\\mathrm{Vor}(P))',
    primaryBibliography: [
      'Voronoi, G. (1908). Nouvelles applications des paramètres continus à la théorie des formes quadratiques.',
      'Delaunay, B. (1934). Sur la sphère vide. Bulletin de l\'Académie des Sciences de l\'URSS.',
      'de Berg, M. et al. (2008). Computational Geometry: Algorithms and Applications. Springer.',
    ],
    computationalTools: ['Scipy.spatial (Voronoi, Delaunay)', 'CGAL (C++ Geometric Algorithms)', 'd3-delaunay', 'Three.js / WebGL'],
    searchKeywords: ['voronoi', 'delaunay', 'tda', 'topologia computazionale', 'celle', 'geometria computazionale', 'tassellazione'],
    exampleInterpretation:
      'Nei generatori procedurali di mappe e nei modelli di crescita cellulare, le celle di Voronoi rappresentano territori biologici o bacini idrografici; nella computer graphics, Delaunay fornisce la mesh poligonale ottimale per il rendering di superfici 3D.',
  },

  // 12. DIAGRAMMI A TRECCIA E MOSSE DI REIDEMEISTER
  {
    id: 'braids_reidemeister',
    name: 'Diagrammi di Trecce & Mosse di Reidemeister',
    italianTitle: 'Teoria dei Nodi, Gruppi di Trecce di Artin e Invarianti Topologici',
    domain: 'topology_geometry',
    domainLabel: 'Topologia, Varietà & Nodi',
    historicalOrigin: 'Emil Artin (1925), Kurt Reidemeister (1927), Vaughan Jones (1984)',
    targetMathematicalObjects: [
      'Nodi K ⊂ S³ e Link (nodi concatenati)',
      'Gruppi di trecce B_n su n fili con generatori σ_i',
      'Invarianti polinomiali di nodi: Polinomio di Jones, Polinomio di Alexander, HOMFLY-PT',
      'Teoria di Chern-Simons e computazione quantistica topologica (Anyoni)',
    ],
    theoreticalSummary:
      'Un nodo tridimensionale viene proiettato su un piano generico con incroci regolari (sotto/sopra). Il Teorema di Reidemeister afferma che due diagrammi planari rappresentano lo stesso nodo nello spazio 3D a meno di isotopia ambiente se e solo se possono essere trasformati l’uno nell’altro tramite una sequenza finita di tre mosse elementari (R1: ricciolo, R2: sovrapposizione, R3: scorrimento dell’incrocio).',
    formalIsomorphismTheorem:
      'Teorema di Alexander & Markov: Ogni nodo in S³ è la chiusura di una treccia in B_n (Teorema di Alexander). Due trecce hanno la stessa chiusura se e solo se sono correlate dalle due mosse di Markov (coniugazione e stabilizzazione).',
    keyEquationOrFormula:
      '\\sigma_i \\sigma_{i+1} \\sigma_i = \\sigma_{i+1} \\sigma_i \\sigma_{i+1}, \\quad \\sigma_i \\sigma_j = \\sigma_j \\sigma_i \\;(|i-j| \\ge 2), \\quad V(L) = \\text{Polinomio di Jones}',
    primaryBibliography: [
      'Artin, E. (1925). Theorie der Zöpfe. Abh. Math. Sem. Univ. Hamburg.',
      'Reidemeister, K. (1927). Elementare Begründung der Knotentheorie.',
      'Jones, V.F.R. (1985). A polynomial invariant for knots via von Neumann algebras. BAMS.',
    ],
    computationalTools: ['KnotPlot', 'SageMath (BraidGroup, Knot)', 'SnapPy (3-manifold topology)', 'TikZ knots library'],
    searchKeywords: ['trecce', 'nodi', 'reidemeister', 'artin', 'jones', 'link', 'topologia 3d', 'treccia', 'invariante'],
    exampleInterpretation:
      'Il nodo a trifoglio (trefoil knot 3₁) è la chiusura della treccia (σ₁)^3 in B₂. Le sue proprietà di chiralità (non è equivalente alla sua immagine speculare) sono immediatamente verificate poiché il suo polinomio di Jones t + t³ - t⁴ non è palindromo.',
  },

  // 13. SUPERFICI DI RIEMANN & DOMAIN COLORING
  {
    id: 'riemann_domain_coloring',
    name: 'Superfici di Riemann & Domain Coloring',
    italianTitle: 'Visualizzazione di Funzioni Olomorfe e Punti di Ramificazione',
    domain: 'analysis_complex',
    domainLabel: 'Analisi Complessa & Continuo',
    historicalOrigin: 'Bernhard Riemann (1851); Domain Coloring formalizzato da Larry Crone (1990) e Frank Farris',
    targetMathematicalObjects: [
      'Funzioni complesse f: ℂ → ℂ o f: Ĉ → Ĉ (Sfera di Riemann)',
      'Punti di diramazione (branch points) e tagli di diramazione (branch cuts) per log(z), √z',
      'Poli, zeri e singolarità essenziali (Teorema di Picard)',
      'Mappe conformi che preservano gli angoli e metrica di Poincaré nel disco unitario',
    ],
    theoreticalSummary:
      'Nel Domain Coloring ogni punto z = x + iy del piano complesso viene colorato associando l’argomento arg(f(z)) alla tonalità cromatica (Hue nel cerchio dei colori) e il modulo |f(z)| a bande logaritmiche di luminosità/saturazione. I poli emergono come centri di ruote arcobaleno che girano in senso orario, gli zeri in senso antiorario.',
    formalIsomorphismTheorem:
      'Principio dell’Argomento di Cauchy: L’indice di avvolgimento del ciclo cromatico attorno a un punto isolato z_0 conta esattamente l’ordine dello zero (se positivo) o del polo (se negativo): N - P = (1 / 2πi) ∮ (f\' / f) dz.',
    keyEquationOrFormula:
      'f(z) = u(x,y) + i v(x,y), \\quad \\frac{\\partial u}{\\partial x} = \\frac{\\partial v}{\\partial y}, \\; \\frac{\\partial u}{\\partial y} = -\\frac{\\partial v}{\\partial x}, \\quad \\frac{1}{2\\pi} \\oint_\\gamma d(\\arg f) = Z - P',
    primaryBibliography: [
      'Riemann, B. (1851). Grundlagen für eine allgemeine Theorie der Functionen einer veränderlichen complexen Grösse.',
      'Needham, T. (1997). Visual Complex Analysis. Oxford University Press.',
      'Wegert, E. (2012). Visual Complex Functions: An Introduction with Phase Portraits. Birkhäuser.',
    ],
    computationalTools: ['ComplexPlot.jl (Julia)', 'Matplotlib phase_portrait', 'WebGL fragment shaders', 'SageMath'],
    searchKeywords: ['riemann', 'domain coloring', 'analisi complessa', 'polo', 'zero', 'cauchy', 'fase', 'conforme', 'olomorfa'],
    exampleInterpretation:
      'Visualizzando la funzione zeta di Riemann ζ(s), i suoi zeri banali e non-banali sulla retta critica Re(s) = 1/2 appaiono chiaramente come vortici cromatici dove tutti i colori dell’arcobaleno convergono a modulo nullo.',
  },

  // 14. FARETRE E RAPPRESENTAZIONI (QUIVERS)
  {
    id: 'quiver_representations',
    name: 'Faretre e Rappresentazioni (Quivers)',
    italianTitle: 'Teoria delle Rappresentazioni di Faretre e Grafi di Auslander-Reiten',
    domain: 'algebra_groups',
    domainLabel: 'Algebra, Gruppi & Lie',
    historicalOrigin: 'Peter Gabriel (1972), Maurice Auslander e Idun Reiten (1975)',
    targetMathematicalObjects: [
      'Grafi diretti Q = (Q₀, Q₁) con nodi (spazi vettoriali) e frecce (applicazioni lineari)',
      'Algebre di cammini kQ e kQ-moduli',
      'Rappresentazioni indecomponibili e classificazione di tipo finito, docile e selvaggio',
    ],
    theoreticalSummary:
      'Una faretra associa a ogni vertice i ∈ Q₀ uno spazio vettoriale V_i e a ogni freccia orientata α: i → j una trasformazione lineare f_α: V_i → V_j. È la concretizzazione geometrica più flessibile dell’algebra lineare multispazio.',
    formalIsomorphismTheorem:
      'Teorema di Gabriel: Una faretra connessa Q ammette solo un numero finito di rappresentazioni indecomponibili (a meno di isomorfismo) se e solo se il suo grafo non orientato sottostante è un diagramma di Dynkin di tipo A_n, D_n, E₆, E₇, E₈! Le dimensioni dei moduli indecomponibili corrispondono alle radici positive del sistema.',
    keyEquationOrFormula:
      'V = ((V_i)_{i \\in Q_0}, (f_\\alpha)_{\\alpha \\in Q_1}), \\quad \\mathbf{dim}(V) = (\\dim V_i) \\in \\Phi^+(\\mathfrak{g})',
    primaryBibliography: [
      'Gabriel, P. (1972). Unzerlegbare Darstellungen I. Manuscripta Mathematica, 6.',
      'Assem, I., Simson, D., & Skowroński, A. (2006). Elements of the Representation Theory of Associative Algebras.',
      'Auslander, M., Reiten, I., & Smalø, S.O. (1995). Representation Theory of Artin Algebras.',
    ],
    computationalTools: ['QPA (GAP package for Quivers)', 'SageMath (Quiver)', 'Macaulay2', 'LaTeX TikZ'],
    searchKeywords: ['faretre', 'quiver', 'gabriel', 'dynkin', 'auslander-reiten', 'algebre di cammini', 'indecomponibile'],
    exampleInterpretation:
      'La faretra a freccia singola • → • rappresenta una trasformazione lineare f: V₁ → V₂; per il teorema di rango-nullità, f è determinata completamente a meno di basi solo da tre numeri interi (dim ker f, rk f, dim coker f), che corrispondono alle 3 radici positive del diagramma A₂.',
  },

  // 15. ALBERI DI DEDUZIONE NATURALE E PROOF NETS
  {
    id: 'natural_deduction_proof_nets',
    name: 'Alberi di Deduzione Naturale & Proof Nets',
    italianTitle: 'Dimostrazioni Strutturali di Gentzen e Reti di Prova di Girard',
    domain: 'categories_logic',
    domainLabel: 'Categorie & Logica Formale',
    historicalOrigin: 'Gerhard Gentzen (1935); Jean-Yves Girard (Logica Lineare, 1987)',
    targetMathematicalObjects: [
      'Dimostrazioni formali sintattiche in logica classica, intuizionista e lineare',
      'Teorema di normalizzazione forte ed eliminazione del taglio (Cut Elimination)',
      'Corrispondenza di Curry-Howard (Dimostrazioni come Programmi, Proposizioni come Tipi)',
    ],
    theoreticalSummary:
      'La deduzione naturale dispone le inferenze ad albero, dove le premesse poggiano sulle foglie in alto e la conclusione poggia alla radice in basso. Le Proof Nets eliminano la burocrazia sintattica dell’ordine delle regole sequenziali, visualizzando il flusso puro dell’informazione logica come un grafo con fili di dualità non incrociabili.',
    formalIsomorphismTheorem:
      'Isomorfismo di Curry-Howard-Lambek: Esiste un isomorfismo tridirezionale esatto tra Logica Intuizionista (dimostrazioni ad albero), Calcolo Lambda Tipato (termini e computazioni funzionali) e Categorie Cartesiane Chiuse (oggetti e morfismi). La normalizzazione della prova corrisponde all’esecuzione del programma.',
    keyEquationOrFormula:
      '\\frac{\\Gamma \\vdash A \\implies B \\quad \\Gamma \\vdash A}{\\Gamma \\vdash B} \\; (\\implies_E), \\quad \\text{Proof}(A) \\cong \\text{Term}(t: A) \\cong \\mathrm{Hom}(1, A)',
    primaryBibliography: [
      'Gentzen, G. (1935). Untersuchungen über das logische Schließen. Mathematische Zeitschrift.',
      'Girard, J.-Y. (1987). Linear logic. Theoretical Computer Science, 50(1).',
      'Girard, J.-Y., Lafont, Y., & Taylor, P. (1989). Proofs and Types. Cambridge Tracts in Theoretical CS.',
    ],
    computationalTools: ['Coq / Lean 4 (alberi di derivazione)', 'LaTeX ebproof / bussproofs', 'TikZ proof nets'],
    searchKeywords: ['deduzione naturale', 'gentzen', 'proof nets', 'girard', 'curry-howard', 'cut elimination', 'logica lineare', 'sequenti'],
    exampleInterpretation:
      'Nel Modus Ponens, collegare l’introduzione di un’implicazione con la sua eliminazione crea un "taglio" (cut); la cut-elimination è un algoritmo grafico di riduzione che cancella il passaggio intermedio e accorcia la dimostrazione alla sua forma canonica irriducibile.',
  },
];
