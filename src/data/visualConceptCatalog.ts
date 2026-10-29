export type ConceptFamilyId =
  | 'geom_simplex'
  | 'geom_hypercube'
  | 'geom_spheres_surfaces'
  | 'geom_conics_projective'
  | 'geom_fractals_tilings'
  | 'linalg_tensors'
  | 'analysis_ode'
  | 'logic_circuits_proofs'
  | 'cs_automata_lambda'
  | 'cat_hott_topology'
  | 'prob_stats_ai_crypto'
  | 'grand_bridges';

export type InteractiveEngineType =
  | 'simplex_pyramid_3d'
  | 'hypercube_4d'
  | 'conics_projective_3d'
  | 'spheres_surfaces_3d'
  | 'riemann_branch_3d'
  | 'logic_karnaugh_circuit'
  | 'automata_turing_chomsky'
  | 'linalg_gram_bezier'
  | 'calculus_fourier_ode'
  | 'fractals_cantor_julia'
  | 'category_hott_knots'
  | 'prob_pca_elliptic_ai';

export interface VisualConceptEntry {
  id: string;
  title: string;
  ProgressionChain: string;
  family: ConceptFamilyId;
  engineType: InteractiveEngineType;
  formalDefinition: string;
  linearAlgebraVis: {
    summary: string;
    matrixOrVectorFormula: string;
    codeSnippet: string;
  };
  analyticProjectiveDiffVis: {
    summary: string;
    equations: string;
    geometricInsight: string;
  };
  intuitiveCircuitGraphVis: {
    summary: string;
    diagramStructure: string;
    morphingStepByStep: string;
  };
  connections: string[];
  apparatus: string[];
}

export const CONCEPT_FAMILIES: {
  id: ConceptFamilyId;
  label: string;
  shortLabel: string;
  countLabel: string;
}[] = [
  { id: 'geom_simplex', label: 'A1. Punto → Triangolo → Simplesso nD → Piramide', shortLabel: 'Simplessi & Piramidi', countLabel: 'Geometria Affine & Lineare' },
  { id: 'geom_hypercube', label: 'A2. Quadrato → Cubo → Ipercubo (Tesseract 4D)', shortLabel: 'Cubo & Ipercubo 4D', countLabel: 'Politopi & Proiezioni' },
  { id: 'geom_spheres_surfaces', label: 'A3. Cerchio → Sfera → S^n, Toro, Möbius, Klein & Platonici', shortLabel: 'Sfere, Superfici & Platonici', countLabel: 'Geometria & Topologia' },
  { id: 'geom_conics_projective', label: 'A4. Coniche 3D, Geometria Analitica, Proiettiva & Differenziale', shortLabel: 'Coniche & Proiettiva', countLabel: 'Sezioni & Dualità' },
  { id: 'geom_fractals_tilings', label: 'A5. Frattali (Cantor, Sierpinski, Koch, Mandelbrot) & Penrose', shortLabel: 'Frattali & Tassellazioni', countLabel: 'Autosimilarità & Caos' },
  { id: 'linalg_tensors', label: 'A6. Algebra Lineare, Determinante, Gram-Schmidt, SVD & Tensori', shortLabel: 'Algebra Lineare & SVD', countLabel: 'Operatori & Decomposizioni' },
  { id: 'analysis_ode', label: 'A7. Analisi (ε-δ, Riemann/Lebesgue, Serie Fourier, Superfici Riemann, ODE)', shortLabel: 'Analisi, Fourier & Riemann', countLabel: 'Il Continuo & Complessi' },
  { id: 'logic_circuits_proofs', label: 'A8. Logica come Circuiti, Mappe di Karnaugh, Quantificatori & Dimostrazioni', shortLabel: 'Circuiti Logici & Karnaugh', countLabel: 'Logica Visuale & Proof' },
  { id: 'cs_automata_lambda', label: 'A9. Chomsky, Automi (DFA/PDA/Turing), P vs NP & Lambda Calcolo', shortLabel: 'Automi, Turing & Lambda', countLabel: 'Computazione & Sintassi' },
  { id: 'cat_hott_topology', label: 'A10. Categorie, Curry-Howard-Lambek, HoTT, Omotopia & Nodi', shortLabel: 'Categorie, HoTT & Nodi', countLabel: 'Fondamenti Strutturali' },
  { id: 'prob_stats_ai_crypto', label: 'A11. Probabilità, Bayes, PCA, Curve Ellittiche, ZKP & Reti Neurali/Transformer', shortLabel: 'Probabilità, Crittografia & AI', countLabel: 'Stocastica, Gruppi & Deep Learning' },
  { id: 'grand_bridges', label: 'A12. I 16 Grandi Ponti (Galois, Langlands, Noether, Atiyah-Singer, AdS/CFT)', shortLabel: 'Grandi Corrispondenze', countLabel: 'Isomorfismi Universali' }
];

export const VISUAL_CONCEPT_CATALOG: VisualConceptEntry[] = [
  // ============================================================================
  // A1. GEOMETRIA ELEMENTARE -> SIMPLESSI & PIRAMIDI
  // ============================================================================
  {
    id: 'punto_retta_piano_spazio',
    title: 'Punto, Retta, Piano, Spazio e Sottospazi Affini',
    ProgressionChain: 'Punto (0D) → Retta (1D) → Piano (2D) → Iperpiano (n-1 D) → Spazio Affine E^n',
    family: 'geom_simplex',
    engineType: 'linalg_gram_bezier',
    formalDefinition:
      'Sottospazio affine S = P₀ + W, dove P₀ ∈ E^n è il punto d’appoggio e W ≤ ℝ^n è la giacitura vettoriale di dimensione k (k=0 punto, k=1 retta, k=2 piano).',
    linearAlgebraVis: {
      summary:
        'Traslazione del sottospazio vettoriale W = Span(v₁, ..., v_k) di un vettore posizione r₀. Ogni punto è r(t) = r₀ + Σ t_i v_i; dualmente S = {x ∈ ℝ^n : Ax = b} è una fibra traslata del nucleo ker(A).',
      matrixOrVectorFormula: 'r(t₁, t₂) = r₀ + t₁ v₁ + t₂ v₂  ⇔  A x = b  con  S = x₀ + ker(A)',
      codeSnippet: `// Three.js: Piano affine r(s,t) = r0 + s*v1 + t*v2
const r0 = new THREE.Vector3(0.5, 0.8, 0);
const v1 = new THREE.Vector3(1, 0.2, 0).normalize();
const v2 = new THREE.Vector3(0, 0.6, 1).normalize();
const planeGeo = new THREE.PlaneGeometry(3, 3);
// Allinea la normale a n = v1 × v2`
    },
    analyticProjectiveDiffVis: {
      summary:
        'In geometria analitica: equazione cartesiana ax + by + cz + d = 0 con normale n=(a,b,c). In geometria proiettiva ℝP³: chiusura proiettiva [X:Y:Z:W] che include la retta impropria a W=0.',
      equations: 'ax + by + cz + d = 0  (Affine)   |   aX + bY + cZ + dW = 0  (Proiettiva ℝP³)',
      geometricInsight:
        'Due piani paralleli in ℝ³ non sono disgiunti in ℝP³: si intersecano lungo la stessa retta all’infinito nel piano improprio W=0.'
    },
    intuitiveCircuitGraphVis: {
      summary:
        'Genesi cinematica: un punto (0D) che scorre lungo un vettore traccia una retta (1D); una retta che trasla lungo un secondo vettore indipendente spazza un piano (2D); il piano traslato genera lo spazio 3D.',
      diagramStructure: 'Punto (dim 0) ──[trasla lungo v₁]──► Retta (dim 1) ──[trasla lungo v₂]──► Piano (dim 2)',
      morphingStepByStep: '0D Punto singolo → 1D Fascio direzionale → 2D Griglia planare → 3D Reticolo spaziale'
    },
    connections: ['Segmento, Semiretta, Angolo', 'Triangolo → Simplesso → Piramide', 'Nucleo e Spazio Affine (Rouché-Capelli)'],
    apparatus: ['Three.js 3D Subspace', 'SVG Parametric Vector Plot', 'Diagramma Sernesi vs Melone']
  },
  {
    id: 'segmento_semiretta_angolo',
    title: 'Segmento, Semiretta, Angolo e Prodotto Scalare',
    ProgressionChain: 'Coppia di punti → Segmento convesso [A,B] → Semiretta r ≥ 0 → Angolo θ = arccos((u·v)/(‖u‖‖v‖))',
    family: 'geom_simplex',
    engineType: 'linalg_gram_bezier',
    formalDefinition:
      'Segmento [A,B] = {(1-t)A + tB : t ∈ [0,1]}; Semiretta = {A + tv : t ≥ 0}; Angolo euclideo definito dalla forma bilineare simmetrica definita positiva ⟨u,v⟩.',
    linearAlgebraVis: {
      summary:
        'Il segmento è l’inviluppo convesso 1D (1-simplesso). L’angolo tra due semirette uscenti dall’origine è governato dal prodotto scalare u·v e dalla proiezione ortogonale proj_u(v) = ((u·v)/‖u‖²)u.',
      matrixOrVectorFormula: 'cos θ = ⟨u, v⟩ / (‖u‖ ‖v‖)   |   ‖u × v‖ = ‖u‖ ‖v‖ sin θ = √det(G)',
      codeSnippet: `// Calcolo proiezione ortogonale e angolo
const cosTheta = u.dot(v) / (u.length() * v.length());
const proj = u.clone().multiplyScalar(u.dot(v) / u.lengthSq());`
    },
    analyticProjectiveDiffVis: {
      summary:
        'In analitica: pendenza m = tan θ e formula di Carnot c² = a² + b² - 2ab cos γ. In proiettiva (formula di Laguerre): l’angolo euclideo è proporzionale al logaritmo del birapporto con i punti ciclici all’infinito I, J = [1 : ±i : 0].',
      equations: 'θ = (1 / 2i) ln( (u, v; I, J) )   |   d(A,B) = √((x₂-x₁)² + (y₂-y₁)²)',
      geometricInsight:
        'La disuguaglianza di Cauchy-Schwarz |⟨u,v⟩| ≤ ‖u‖‖v‖ garantisce che il rapporto cada in [-1, 1], rendendo ben definito l’angolo in qualsiasi dimensione n.'
    },
    intuitiveCircuitGraphVis: {
      summary:
        'Visualizzazione a cursore baricentrico t ∈ [0,1] per il segmento, cono positivo t ≥ 0 per la semiretta, e settore circolare con ombra di proiezione ortogonale per il coseno.',
      diagramStructure: 't ∈ [0,1] (Segmento) ⊂ t ∈ [0,∞) (Semiretta) ⊂ t ∈ ℝ (Retta); Arco(u,v) ↔ Proiezione',
      morphingStepByStep: 'Varia t da 0 a 1 per percorrere [A,B]; ruota v rispetto a u osservando proj_u(v) e l’area u∧v'
    },
    connections: ['Punto, Retta, Piano', 'Triangolo e Trigonometria Lineare', 'Gram-Schmidt'],
    apparatus: ['SVG Interactive Vector Projection', 'Plot Trigonometria Lineare', 'Barycentric Slider']
  },
  {
    id: 'triangolo_simplesso_piramide',
    title: 'Triangolo → Simplesso 2D/3D/nD → Piramide → Tronco di Piramide',
    ProgressionChain: 'Triangolo 2D (Δ²) → Tetraedro 3D (Δ³) → n-Simplesso (Δⁿ) → Piramide a base poligonale → Tronco di Piramide',
    family: 'geom_simplex',
    engineType: 'simplex_pyramid_3d',
    formalDefinition:
      'Un n-simplesso Δⁿ = conv{v₀, v₁, ..., v_n} è l’inviluppo convesso di n+1 punti affinemente indipendenti: P = Σ_{i=0}^n λ_i v_i con λ_i ≥ 0, Σ λ_i = 1. La piramide è il cono convesso conv(B ∪ {V}); il tronco è l’intersezione con un semispazio parallelo alla base.',
    linearAlgebraVis: {
      summary:
        'Coordinate baricentriche (λ₀, λ₁, ..., λ_n) come pesi di massa positivi. Area del triangolo = ½|det[v₁-v₀, v₂-v₀]|; Volume del tetraedro = ⅙|det[v₁-v₀, v₂-v₀, v₃-v₀]|; Volume n-simplesso = (1/n!)√det(G) tramite matrice di Gram G_ij = ⟨e_i, e_j⟩.',
      matrixOrVectorFormula:
        'Vol_n(Δⁿ) = (1 / n!) |det[v₁ - v₀, ..., v_n - v₀]| = (1 / n!) √det(AᵀA)   |   Retta di Eulero: H - O = 3(G - O)',
      codeSnippet: `// Three.js: Costruzione Tetraedro / Piramide / Tronco con piano di taglio z = h_cut
const vertices = [new THREE.Vector3(0,0,0), new THREE.Vector3(2,0,0), new THREE.Vector3(1,1.73,0), new THREE.Vector3(1,0.57,2)];
const det = new THREE.Matrix3().set(
  v1.x-v0.x, v2.x-v0.x, v3.x-v0.x,
  v1.y-v0.y, v2.y-v0.y, v3.y-v0.y,
  v1.z-v0.z, v2.z-v0.z, v3.z-v0.z
).determinant();
const volumeTetra = Math.abs(det) / 6;`
    },
    analyticProjectiveDiffVis: {
      summary:
        'Analitica: punti notevoli (Baricentro G=(A+B+C)/3, Incentro, Circocentro, Ortocentro), Teoremi di Ceva e Menelao, Formula di Erone via Gram, Volume Tronco di Piramide (Papiro di Mosca) V = (h/3)(A₁ + √(A₁A₂) + A₂). Proiettiva: un triangolo proiettivo è determinato da 3 rette in posizione generale; se il vertice V della piramide va all’infinito in ℝP³, la piramide diventa un prisma/cilindro!',
      equations:
        'V_piramide = ⅓ A_base · h   |   V_tronco = (h/3)(a² + ab + b²)   |   det [[x₁,y₁,1],[x₂,y₂,1],[x₃,y₃,1]] = 2·Area',
      geometricInsight:
        'Il tronco di piramide (quando l’apice viene tagliato da un piano parallelo) interpola continuamente tra la piramide completa (b=0) e il prisma/cubo (b=a, apice proiettivo all’infinito).'
    },
    intuitiveCircuitGraphVis: {
      summary:
        'Animazione di estrusione coniugata (Cono su Δ^{n-1}): 0-simplesso (Punto) → 1-simplesso (Segmento) → 2-simplesso (Triangolo) → 3-simplesso (Tetraedro) → 4-simplesso (Pentacoro con 5 vertici, 10 spigoli, 10 facce triangolari, 5 celle tetraedriche).',
      diagramStructure: 'Δ⁰ (1v) ──► Δ¹ (2v,1e) ──► Δ² (3v,3e,1f) ──► Δ³ (4v,6e,4f,1c) ──► Δ⁴ (5v,10e,10f,5c) [Righe del Triangolo di Tartaglia-Pascal!]',
      morphingStepByStep: '1. Triangolo 2D (equilatero/isoscele/scaleno/rettangolo) → 2. Solleva l’apice in 3D (Tetraedro/Piramide) → 3. Taglia con piano orizzontale (Tronco di Piramide) → 4. Aggiungi 5° vertice in 4D (Pentacoro)'
    },
    connections: [
      'Quadrato → Cubo → Ipercubo',
      'Matrice di Gram e Volume k-dimensionale',
      'Omologia Simpliciale & Teorema di Stokes ∂² = 0',
      'Politopo di Birkhoff'
    ],
    apparatus: ['Three.js 3D Simplex/Pyramid/Frustum Morph', 'SVG Barycentric & Euler Line', 'Pascal Simplex Combinatorics']
  },

  // ============================================================================
  // A2. QUADRATO -> CUBO -> IPERCUBO (TESSERACT) -> n-CUBO
  // ============================================================================
  {
    id: 'quadrato_cubo_ipercubo',
    title: 'Quadrato → Rettangolo/Parallelogramma → Cubo → Ipercubo (Tesseract 4D) → n-Cubo',
    ProgressionChain: 'Quadrato/Parallelogramma [0,1]² → Cubo/Parallelepipedo [0,1]³ → Ipercubo/Tesseract [0,1]⁴ → n-Cubo Q_n',
    family: 'geom_hypercube',
    engineType: 'hypercube_4d',
    formalDefinition:
      'L’n-cubo unitario è il prodotto cartesiano Q_n = [0,1]^n = {(x₁,...,x_n) ∈ ℝ^n : 0 ≤ x_i ≤ 1}, dotato di 2^n vertici, n·2^{n-1} spigoli e 2n faccette (n-1)-dimensionali.',
    linearAlgebraVis: {
      summary:
        'Immagine dell’ipercubo unitario tramite una matrice A ∈ ℝ^{n×n}: genera un parallelepipedo n-dimensionale (zonotopo) il cui volume orientato è esattamente det(A). Rotazioni 4D in SO(4) decomponibili in rotazioni isocline doppie (piani XW, YW, ZW).',
      matrixOrVectorFormula:
        'Vol(A([0,1]^n)) = |det(A)|   |   R_{xw}(θ) = [[cos θ, 0, 0, -sin θ], [0,1,0,0], [0,0,1,0], [sin θ, 0, 0, cos θ]]',
      codeSnippet: `// Proiezione stereografica 4D -> 3D dei 16 vertici del Tesseract (±1, ±1, ±1, ±1)
function project4Dto3D(v4, angleXW, angleZW, cameraW = 3.0) {
  const x = v4[0]*Math.cos(angleXW) - v4[3]*Math.sin(angleXW);
  const w = v4[0]*Math.sin(angleXW) + v4[3]*Math.cos(angleXW);
  const scale = 1 / (cameraW - w);
  return new THREE.Vector3(x * scale, v4[1] * scale, v4[2] * scale);
}`
    },
    analyticProjectiveDiffVis: {
      summary:
        'Analitica: palla unitaria nella norma infinito ‖x‖_∞ = max_i |x_i| ≤ 1 (duale di Minkowski del cross-politopo/ottaedro ‖x‖₁ = Σ|x_i| ≤ 1). Proiettiva: il diagramma di Schlegel dell’ipercubo (cubo dentro un cubo connesso ai vertici) è una proiezione prospettica centrale da ℝ⁴ a ℝ³.',
      equations:
        'Q_n = { x ∈ ℝ^n : ‖x‖_∞ ≤ 1 }   |   Sezione iperpiana: { x ∈ [0,1]⁴ : x₁ + x₂ + x₃ + x₄ = c }',
      geometricInsight:
        'Come un cubo 3D che attraversa un piano 2D lungo la diagonale produce sezioni che sono un punto → triangolo → esagono regolare → triangolo → punto, così un ipercubo 4D che attraversa il nostro spazio 3D lungo la diagonale (1,1,1,1) appare come un tetraedro che cresce, diventa un ottaedro regolato e poi si richiude!'
    },
    intuitiveCircuitGraphVis: {
      summary:
        'Costruzione ricorsiva per raddoppio e traslazione (Q_n = Q_{n-1} × [0,1]), sviluppo poliedrico (la croce di Dalì di 8 cubi 3D che si ripiega in 4D), e isomorfismo con il reticolo booleano {0,1}^n / Mappe di Karnaugh.',
      diagramStructure: 'Punto (2⁰=1) ──► Segmento (2¹=2) ──► Quadrato (2²=4) ──► Cubo (2³=8) ──► Tesseract (2⁴=16 vertici, 32 spigoli, 24 facce, 8 celle)',
      morphingStepByStep: '1. Ruota in 4D lungo il piano XW (il cubo interno ed esterno si scambiano!) → 2. Taglia con iperpiano w = cost → 3. Osserva l’ombra 3D e lo sviluppo a 8 cubi'
    },
    connections: [
      'Triangolo → Simplesso → Piramide',
      'Logica Booleana & Mappe di Karnaugh ({0,1}^n)',
      'Determinante come Fattore di Scala Volume',
      'Solidi Platonici (Dualità Cubo ↔ Ottaedro)'
    ],
    apparatus: ['Three.js 4D Tesseract Rotator & Slicer', 'SVG Schlegel & Hasse Boolean Lattice', 'Cross-Section Animator']
  },

  // ============================================================================
  // A3. CERCHIO -> SFERA -> IPERSFERA S^n, TORO, MÖBIUS, KLEIN & SOLIDI PLATONICI
  // ============================================================================
  {
    id: 'cerchio_sfera_ipersfera_superfici',
    title: 'Cerchio → Sfera → Ipersfera S^n, Toro, Nastro di Möbius, Bottiglia di Klein & Solidi Platonici',
    ProgressionChain: 'Circonferenza S¹ → Sfera S² → 3-Sfera S³ (Hopf) → S^n  |  Toro T² → Möbius → Bottiglia di Klein  |  5 Solidi Platonici',
    family: 'geom_spheres_surfaces',
    engineType: 'spheres_surfaces_3d',
    formalDefinition:
      'Ipersfera S^n = {x ∈ ℝ^{n+1} : ⟨x,x⟩ = R²}. Superfici compatte classificate per genere g e orientabilità (χ = 2 - 2g). Solidi platonici: poliedri convessi regolari con simbolo di Schläfli {p,q} e V - E + F = 2.',
    linearAlgebraVis: {
      summary:
        'S¹ ≅ SO(2) ≅ U(1) (complessi unitari e^{iθ}); S³ ≅ SU(2) ≅ Sp(1) (quaternioni unitari di rotazione 3D). I 5 solidi platonici (Tetraedro {3,3}, Cubo {4,3}, Ottaedro {3,4}, Dodecaedro {5,3}, Icosaedro {3,5}) sono orbite di sottogruppi finiti di SO(3) (A₄, S₄, A₅).',
      matrixOrVectorFormula:
        'xᵀ I x = R²   |   S³ = { q ∈ ℍ : q q* = 1 } ──[2:1]──► SO(3)   |   V - E + F = χ(S) = 2 - 2g',
      codeSnippet: `// Parametrizzazione Nastro di Möbius / Toro in Three.js
const x = (R + u * Math.cos(t / 2)) * Math.cos(t);
const y = (R + u * Math.cos(t / 2)) * Math.sin(t);
const z = u * Math.sin(t / 2); // Mezzo giro (olonomia non banale!)`
    },
    analyticProjectiveDiffVis: {
      summary:
        'Analitica & Differenziale: curvatura gaussiana K = +1/R² su S², K = 0 su cilindro/piano, K variabile (positiva fuori, negativa dentro) sul Toro con ∫_S K dA = 2πχ(S) (Teorema di Gauss-Bonnet). Proiezione stereografica S^n \\ {N} ≅ ℝ^n compattifica lo spazio con un punto all’infinito.',
      equations:
        'Vol(B^n(R)) = (π^{n/2} / Γ(n/2 + 1)) R^n   |   ∫_M K dA = 2π χ(M)   |   σ(x,y,z) = (x/(1-z), y/(1-z))',
      geometricInsight:
        'Il Nastro di Möbius è il prototipo di fibrato lineare non banale su S¹; incollando due nastri di Möbius lungo il bordo si ottiene la Bottiglia di Klein (superficie chiusa non orientabile immersa in ℝ⁴).'
    },
    intuitiveCircuitGraphVis: {
      summary:
        'Poligoni regolari inscritti/circoscritti di Archimede che convergono a π; quadratura e quadrato fondamentale di identificazione [0,1]² con frecce ai bordi per ottenere Cilindro, Toro, Nastro di Möbius, Piano Proiettivo ℝP² e Bottiglia di Klein.',
      diagramStructure: 'Quadrato [0,1]²: (a,b,a⁻¹,b⁻¹) ⇒ Toro T²  |  (a,b,a⁻¹,b) ⇒ Klein  |  (a,b,a,b) ⇒ ℝP²',
      morphingStepByStep: '1. Poligono regolare n-lati → Cerchio (n→∞) → 2. Rotazione in S² e Toro T² → 3. Torsione di 180° in Möbius e Klein → 4. Dualità dei 5 Solidi Platonici'
    },
    connections: [
      'Quaternioni e Rotazioni SO(3)',
      'Teorema di Gauss-Bonnet',
      'Sfera di Riemann & Proiezione Stereografica',
      'Gruppo Fondamentale π₁'
    ],
    apparatus: ['Three.js Surface & Platonic Explorer', 'SVG Fundamental Polygon Glueing', 'Archimedes π Exhaustion']
  },

  // ============================================================================
  // A4. CONICHE, GEOMETRIA ANALITICA, PROIETTIVA & DIFFERENZIALE
  // ============================================================================
  {
    id: 'coniche_analitica_proiettiva_diff',
    title: 'Sezioni Coniche 3D, Geometria Analitica, Proiettiva (Dualità & Omografie) e Differenziale',
    ProgressionChain: 'Doppio Cono ∩ Piano → Cerchio / Ellisse / Parabola / Iperbole → Forma Quadratica Omogenea xᵀQx = 0 → Varietà Curva',
    family: 'geom_conics_projective',
    engineType: 'conics_projective_3d',
    formalDefinition:
      'Luogo di zeri di un polinomio quadratico in ℝ² o intersezione di un cono circolare retto x² + y² = z² tan²α con un piano d’inclinazione β. In ℝP², tutte le coniche non degeneri sono proiettivamente equivalenti!',
    linearAlgebraVis: {
      summary:
        'Rappresentazione matriciale Xᵀ Q X = 0 con X = [x, y, 1]ᵀ e Q simmetrica 3×3. La sottomatrice principale A₂×₂ classifica la conica tramite il segno di det(A₂×₂) = AC - B²/4 (autovalori concordi = ellisse, un autovalore nullo = parabola, autovalori discordi = iperbole).',
      matrixOrVectorFormula:
        '[x y 1] [[A, B/2, D/2], [B/2, C, E/2], [D/2, E/2, F]] [x, y, 1]ᵀ = 0   |   Invarianti: Tr(A₂), det(A₂), det(Q)',
      codeSnippet: `// Intersezione Piano z = m*x + d con il doppio cono x^2 + y^2 = z^2
// Se |m| < 1: Ellisse; se |m| == 1: Parabola; se |m| > 1: Iperbole`
    },
    analyticProjectiveDiffVis: {
      summary:
        'Analitica: eccentricità e = PF / d(P, direttrice) (e<1 ellisse, e=1 parabola, e>1 iperbole). Proiettiva: Ellisse = nessun punto reale sulla retta impropria Z=0; Parabola = tangente alla retta impropria (1 punto all’infinito); Iperbole = secante alla retta impropria (2 punti all’infinito = direzioni degli asintoti!). Dualità Punto-Retta (Polo e Polare, Teoremi di Pascal, Brianchon e Desargues).',
      equations:
        'x²/a² ± y²/b² = 1  |  y² = 2px  |  Birapporto (A,B;C,D) = (AC/BC)/(AD/BD) invariante per omografie',
      geometricInsight:
        'In ℝP² non c’è differenza intrinseca tra ellisse, parabola e iperbole: è sempre la stessa curva vista rispetto a una diversa scelta della retta dell’orizzonte Z=0!'
    },
    intuitiveCircuitGraphVis: {
      summary:
        'Cono di Apollonio 3D interattivo tagliato da un piano luminoso orientabile, affiancato alle Sfere di Dandelin (che toccano il cono e il piano esattamente nei fuochi!) e al diagramma di dualità proiettiva.',
      diagramStructure: 'Piano β < α (Ellisse) ──► β = α (Parabola: fuoco2 → ∞) ──► β > α (Iperbole: 2 rami)',
      morphingStepByStep: 'Inclina il piano secante nel cono 3D: osserva l’ellisse allungarsi fino a toccare l’infinito (parabola) e poi spezzarsi nei due rami dell’iperbole'
    },
    connections: [
      'Teorema Spettrale e Forme Quadratiche',
      'Trasformazioni Proiettive e Collinearità',
      'Orbite Keplero-Newton',
      'Geometria Differenziale (Frenet-Serret & Geodetiche)'
    ],
    apparatus: ['Three.js 3D Cone-Plane Slicer', 'SVG Conic Focus/Directrix & Projective Horizon', 'Quadratic Matrix Inspector']
  },

  // ============================================================================
  // A5. FRATTALI & TASSELLAZIONI
  // ============================================================================
  {
    id: 'frattali_tassellazioni_penrose',
    title: 'Frattali (Cantor, Sierpinski, Koch, Peano, Mandelbrot, Julia) & Tassellazioni di Penrose',
    ProgressionChain: 'Insieme di Cantor (D≈0.63) → Koch (D≈1.26) → Sierpinski (D≈1.58) → Peano (D=2) → Mandelbrot/Julia (ℂ)',
    family: 'geom_fractals_tilings',
    engineType: 'fractals_cantor_julia',
    formalDefinition:
      'Attrattore compatto unico K = ⋃_{i=1}^m f_i(K) di un Sistema di Funzioni Iterate (IFS) contrattive nello spazio metrico completo (ℋ(ℝ^n), d_Hausdorff), con dimensione di Hausdorff D = log(N)/log(1/r).',
    linearAlgebraVis: {
      summary:
        'Ogni mappa dell’IFS è una trasformazione affine contrattiva f_i(x) = r_i R_i x + b_i con raggio spettrale < 1. Per le tassellazioni aperiodiche di Penrose, si proietta un reticolo intero 5-dimensionale ℤ⁵ su un sottospazio 2D irrazionale legato alla sezione aurea φ = (1+√5)/2 (metodo Cut-and-Project).',
      matrixOrVectorFormula:
        'f_i(x) = ½ x + ½ v_i  (Sierpinski, i=0,1,2)   |   D_H = ln(3)/ln(2) ≈ 1.58496   |   z_{n+1} = z_n² + c',
      codeSnippet: `// Iterazione IFS per il Triangolo di Sierpinski / Insieme di Julia
for (let step = 0; step < 5000; step++) {
  const v = vertices[Math.floor(Math.random() * 3)];
  p.x = 0.5 * (p.x + v.x);
  p.y = 0.5 * (p.y + v.y);
}`
    },
    analyticProjectiveDiffVis: {
      summary:
        'Analisi & Topologia: l’insieme di Cantor ha misura di Lebesgue nulla ma cardinalità del continuo 2^{ℵ₀}; la curva di Koch è continua ovunque ma non derivabile in alcun punto (lunghezza infinita in area finita); la curva di Peano-Hilbert è suriettiva da [0,1] a [0,1]². Mandelbrot classifica la connessione degli insiemi di Julia J_c.',
      equations:
        'dim_B(F) = lim_{ε→0} ln N(ε) / ln(1/ε)   |   M = { c ∈ ℂ : sup_n |z_n| < ∞, z₀ = 0 }',
      geometricInsight:
        'La frontiera dell’insieme di Mandelbrot ha dimensione di Hausdorff esattamente 2 (Teorema di Shishikura): è così frastagliata da occupare dimensionalmente quanto una superficie pur avendo area interna di frontiera nulla.'
    },
    intuitiveCircuitGraphVis: {
      summary:
        'Costruzione ricorsiva passo-passo (k = 0, 1, 2, ..., 6) con zoom autosimilare, confronto tra il Triangolo di Tartaglia modulo 2 e il Triangolo di Sierpinski, ed esplorazione accoppiata del piano dei parametri c (Mandelbrot) e del piano dinamico z (Julia).',
      diagramStructure: 'Passo k ──[Applica {f₁, ..., f_m}]──► Passo k+1 ──[k → ∞ (Punto fisso di Banach)]──► Frattale K',
      morphingStepByStep: 'Aumenta il livello ricorsivo k da 0 a 7 o muovi il parametro complesso c = Re + i·Im per vedere l’insieme di Julia connettersi o polverizzarsi in polvere di Cantor'
    },
    connections: [
      'Teorema delle Contrazioni di Banach',
      'Misura di Lebesgue e Patologie Topologiche',
      'Dinamica Complessa & Caos',
      'Simmetrie Cristallografiche e Gruppi di Coxeter'
    ],
    apparatus: ['Interactive Canvas Fractal & Julia Explorer', 'IFS Affine Contraction Matrix View', 'Box-Counting Dimension Plot']
  },

  // ============================================================================
  // A6. ALGEBRA LINEARE, DETERMINANTE, GRAM-SCHMIDT, SVD, TENSORI & BÉZIER
  // ============================================================================
  {
    id: 'algebra_lineare_gram_svd_tensori',
    title: 'Spazi Vettoriali, Rango/Nucleo, Determinante, Gram-Schmidt, SVD/QR/LU, Tensori, Spazio Duale & Curve di Bézier',
    ProgressionChain: 'Vettori & Base → Matrice (ker/Im) → det(A) Area/Volume → Gram-Schmidt & SVD → Tensore & Spazio Duale V* → Combinazioni Convesse (Bézier)',
    family: 'linalg_tensors',
    engineType: 'linalg_gram_bezier',
    formalDefinition:
      'Ogni applicazione lineare T: ℝ^n → ℝ^m si decompone via SVD come A = U Σ Vᵀ (rotazione Vᵀ → dilatazione lungo gli assi principali Σ → rotazione U). Una forma lineare ω ∈ V* è rappresentata da iperpiani di livello paralleli.',
    linearAlgebraVis: {
      summary:
        'Visualizzazione passo-passo dell’ortogonalizzazione di Gram-Schmidt (sottrazione delle proiezioni ortogonali u_k = v_k - Σ proj_{u_i}(v_k)), dell’ellissoide di deformazione SVD della sfera unitaria, e delle curve di Bézier B(t) = Σ B_{i,n}(t) P_i tramite l’algoritmo baricentrico iterativo di De Casteljau.',
      matrixOrVectorFormula:
        'A = U Σ Vᵀ   |   u₂ = v₂ - (⟨v₂, u₁⟩ / ‖u₁‖²) u₁   |   B(t) = Σ_{i=0}^n C(n,i)(1-t)^{n-i} t^i P_i',
      codeSnippet: `// Algoritmo di De Casteljau (interpolazioni lineari baricentriche annidate)
function deCasteljau(pts, t) {
  let curr = pts;
  while (curr.length > 1) {
    curr = curr.slice(0, -1).map((p, i) => ({
      x: (1 - t) * p.x + t * curr[i + 1].x,
      y: (1 - t) * p.y + t * curr[i + 1].y
    }));
  }
  return curr[0];
}`
    },
    analyticProjectiveDiffVis: {
      summary:
        'Spazio duale V*: mentre un vettore v ∈ V è una freccia, un covettore (1-forma) ω ∈ V* è una pila di iperpiani orientati {x : ω(x) = k}; l’accoppiamento ⟨ω, v⟩ conta quanti iperpiani di ω vengono perforati dalla freccia v! Il tensore metrico g_{ij} fornisce l’isomorfismo musicale (♭/♯) tra frecce e iperpiani.',
      equations:
        'dim(V) = dim(ker A) + dim(Im A)   |   ds² = g_{ij} dx^i dx^j   |   σ_i(A) = √λ_i(AᵀA)',
      geometricInsight:
        'Il determinante det(A) è l’unico funzionale multilineare alternante normalizzato: misura il fattore di dilatazione del volume e inverte l’orientazione (chiralità) quando det(A) < 0.'
    },
    intuitiveCircuitGraphVis: {
      summary:
        'String diagram / Penrose Tensor Network (scatole con fili superiori contravarianti e inferiori covarianti) affiancato al cantiere geometrico interattivo di Gram-Schmidt, all’ellissoide SVD e al poligono di controllo di Bézier.',
      diagramStructure: 'Sfera Unitaria ──[Vᵀ: Ruota]──► ──[Σ: Stira assi σ₁,σ₂]──► ──[U: Ruota]──► Ellissoide Immagine',
      morphingStepByStep: '1. Scegli due vettori v₁, v₂ → 2. Osserva il parallelogramma di area |det| e il passo di Gram-Schmidt → 3. Muovi t ∈ [0,1] per costruire la curva di Bézier sul simplesso dei punti di controllo'
    },
    connections: [
      'Lab Tensori 3D (Inerzia, Sforzo di Cauchy, Ricci)',
      'Lab Operatori, Spazio Duale & Politopo di Birkhoff',
      'PCA & Compressione di Reti Neurali',
      'Forme Differenziali e Teorema di Stokes'
    ],
    apparatus: ['Interactive SVG Gram-Schmidt & De Casteljau Bézier', 'SVD Ellipsoid Transformer', 'Penrose Tensor Diagram']
  },

  // ============================================================================
  // A7. ANALISI, SUPERFICI DI RIEMANN, FOURIER & EQUAZIONI DIFFERENZIALI
  // ============================================================================
  {
    id: 'analisi_riemann_fourier_ode',
    title: 'Analisi: Limite ε-δ, Derivata/Gradiente, Integrale Riemann vs Lebesgue, Serie di Fourier, Superfici di Riemann & ODE/Caos',
    ProgressionChain: 'Tubo ε-δ (Continuità) → Tangente/Gradiente ∇f → Somme di Riemann (verticali) vs Lebesgue (orizzontali) → Serie di Fourier → Flusso ODE',
    family: 'analysis_ode',
    engineType: 'calculus_fourier_ode',
    formalDefinition:
      'Limite: ∀ε>0 ∃δ>0 : |x-x₀|<δ ⇒ |f(x)-L|<ε. Integrale di Riemann partiziona il dominio ℝ (fette verticali dx); l’integrale di Lebesgue partiziona il codominio ℝ (curve di livello orizzontali μ({x : y_k ≤ f(x) < y_{k+1}})).',
    linearAlgebraVis: {
      summary:
        'La serie di Fourier f(x) = Σ ⟨f, e_n⟩ e_n è esattamente la proiezione ortogonale nello spazio di Hilbert infinito-dimensionale L²([-π,π]) sulla base ortonormale di autofunzioni {e^{inx}} dell’operatore derivata seconda d²/dx²!',
      matrixOrVectorFormula:
        'f(x) = a₀/2 + Σ_{n=1}^N (a_n cos(nx) + b_n sin(nx))   |   df_x(h) = J_f(x) · h   |   ẋ = A x ⇒ x(t) = e^{tA} x₀',
      codeSnippet: `// Sintesi armonica di Fourier (Onda quadra: somma di sin((2k-1)x)/(2k-1))
let y = 0;
for (let k = 1; k <= harmonics; k++) {
  const n = 2 * k - 1;
  y += (4 / (Math.PI * n)) * Math.sin(n * x);
}`
    },
    analyticProjectiveDiffVis: {
      summary:
        'Funzioni complesse polidrome (w = √z, w = log z): oltre al Domain Coloring 4D, la Superficie di Riemann incolla più fogli complessi lungo il taglio di diramazione (branch cut), rendendo la funzione olomorfa e univoca sulla varietà rivestimento!',
      equations:
        'w = √(r e^{iθ}) = √r e^{iθ/2}  (2 fogli, giro di 4π)   |   ∂u/∂x = ∂v/∂y, ∂u/∂y = -∂v/∂x (Cauchy-Riemann)',
      geometricInsight:
        'Girando di 360° attorno al punto di diramazione z=0 sulla superficie di √z non si torna al punto di partenza, ma si passa con continuità dal Foglio + al Foglio - (esattamente come gli spinori!).'
    },
    intuitiveCircuitGraphVis: {
      summary:
        'Confronto visivo diretto tra il "contabile di Riemann" (che somma colonne verticali ordinate per posizione x) e il "contabile di Lebesgue" (che raggruppa le monete per valore/altezza y), più gli epicicli di Fourier e il campo di direzioni ODE.',
      diagramStructure: 'Dominio x (Riemann: ∫ f(x)dx)  ↔  Codominio y (Lebesgue: ∫ μ({f > t})dt)  ↔  Frequenze ω (Fourier: f̂(ω))',
      morphingStepByStep: '1. Stringi la fascia ε e osserva il tubo δ adattarsi → 2. Commuta tra rettangoli verticali (Riemann) e strati orizzontali (Lebesgue) → 3. Aggiungi armoniche di Fourier → 4. Esplora i fogli di Riemann 3D di √z'
    },
    connections: [
      'Lab Dimensioni & ℂ (Domain Coloring & Riemann)',
      'Spazi di Hilbert e Teorema Spettrale',
      'Dualità di Pontryagin-Fourier',
      'Attrattore di Lorenz e Teorema KAM'
    ],
    apparatus: ['Interactive ε-δ / Riemann-Lebesgue / Fourier Canvas', 'Three.js Branch-Cut Riemann Surface (√z)', 'ODE Slope Field']
  },

  // ============================================================================
  // A8. LOGICA COME CIRCUITI, MAPPE DI KARNAUGH, QUANTIFICATORI & FLOWCHART DIMOSTRAZIONI
  // ============================================================================
  {
    id: 'logica_circuiti_karnaugh_dimostrazioni',
    title: 'Logica come Circuiti (AND/OR/NOT/XOR/Implicazione/De Morgan), Mappe di Karnaugh, Quantificatori ∀/∃ & Flowchart Dimostrativi',
    ProgressionChain: 'Porte Logiche ANSI/IEC → Circuiti di De Morgan & Implicazione → Mappa di Karnaugh Toroidale → Loop Quantificatori ∀/∃ → Flowchart & Alberi di Gödel/Gentzen',
    family: 'logic_circuits_proofs',
    engineType: 'logic_karnaugh_circuit',
    formalDefinition:
      'Isomorfismo di Boole-Shannon (1938): ogni formula della logica proposizionale su n atomi corrisponde a una funzione booleana f: {0,1}^n → {0,1}, a un sottinsieme di vertici dell’ipercubo Q_n, e a un circuito combinatorio di porte AND (∧), OR (∨), NOT (¬), XOR (⊕).',
    linearAlgebraVis: {
      summary:
        'Aritmetizzazione sul campo finito 𝔽₂ (Polinomi di Жегалкин / ANF): NOT(x) = 1 ⊕ x, AND(x,y) = x·y, XOR(x,y) = x ⊕ y (somma mod 2), OR(x,y) = x ⊕ y ⊕ x·y. In calcolo quantistico/tensoriale ogni porta reversibile (CNOT, Toffoli) è una matrice di permutazione 2^n × 2^n.',
      matrixOrVectorFormula:
        'Su 𝔽₂: ¬x = 1 + x,  x ∧ y = xy,  x ⊕ y = x + y,  (x → y) = 1 + x + xy   |   Mappa sul Toro: Codice di Gray (00, 01, 11, 10)',
      codeSnippet: `// Valutazione circuito booleano e implicanti primi su Mappa di Karnaugh 4x4
const grayOrder = ['00', '01', '11', '10'];
const implies = (p: number, q: number) => (!p || q ? 1 : 0);
const deMorgan1 = (p: number, q: number) => (!(p && q) === (!p || !q));`
    },
    analyticProjectiveDiffVis: {
      summary:
        'Geometria e Topologia della Logica: la Mappa di Karnaugh a 4 variabili (A,B,C,D) non è un semplice quadrato piatto ma una griglia sul TORO T² (il bordo destro si incolla al sinistro e il bordo superiore all’inferiore perché 10 e 00 differiscono di 1 solo bit nel codice di Gray!). Ogni rettangolo di 2^k celle adiacenti sul toro elimina k variabili ridondanti.',
      equations:
        'P → Q ≡ ¬P ∨ Q   |   ¬(P ∧ Q) ≡ ¬P ∨ ¬Q   |   ¬(∀x P(x)) ≡ ∃x ¬P(x)   |   Gödel: G ↔ ¬Prov_PA(⌜G⌝)',
      geometricInsight:
        'I quantificatori sono circuiti iterativi su un dominio D={x₁,...,x_k}: ∀x P(x) è una cascata in SERIE (porta AND multi-ingresso con short-circuit al primo falso = controesempio!), mentre ∃x P(x) è un banco in PARALLELO (porta OR multi-ingresso che si attiva al primo testimone vero!).'
    },
    intuitiveCircuitGraphVis: {
      summary:
        'Banco di prova interattivo con: (1) Porte logiche cliccabili (AND, OR, NOT, XOR, Implicazione, De Morgan) con cavi luminosi 0/1; (2) Mappa di Karnaugh 4×4 interattiva con raggruppamento implicanti; (3) Circuito Quantificatori ∀/∃; (4) Flowchart delle Tecniche Dimostrative (Diretta, Contronominale, Assurdo, Induzione) e Diagramma Metamatematico di Gödel.',
      diagramStructure: 'Input A,B ∈ {0,1} ──► [Circuito Porte ANSI] ──► Tavola Verità / Ipercubo ──► [Mappa Karnaugh Toroidale] ──► Forma Minima DNF',
      morphingStepByStep: '1. Clicca gli interruttori A, B per vedere i segnali elettrici attraversare le porte → 2. Clicca le celle della mappa di Karnaugh per minimizzare la funzione → 3. Esplora i flowchart di Assurdo, Induzione e Gödel'
    },
    connections: [
      'Quadrato → Cubo → Ipercubo Booleano',
      'Dualità di Stone (Algebre di Boole ↔ Spazi Topologici)',
      'Isomorfismo di Curry-Howard (Proposizioni = Tipi)',
      'SAT Solving & NP-Completezza'
    ],
    apparatus: ['Interactive Logic Gate Simulator SVG', 'Clickable 4x4 Toroidal Karnaugh Map', 'Proof Flowchart & Gödel Fixed-Point Diagram']
  },

  // ============================================================================
  // A9. LINGUAGGI FORMALI, CHOMSKY, AUTOMI, TURING, COMPLESSITÀ & LAMBDA CALCOLO
  // ============================================================================
  {
    id: 'chomsky_automi_turing_lambda',
    title: 'Gerarchia di Chomsky, Automi (DFA/NFA, PDA, Macchina di Turing), Problema della Fermata, P vs NP & Lambda Calcolo',
    ProgressionChain: 'Tipo 3 Regolari (DFA) ⊂ Tipo 2 Context-Free (PDA + Stack) ⊂ Tipo 1 Context-Sensitive (LBA) ⊂ Tipo 0 RE (Macchina di Turing / λ-Calcolo)',
    family: 'cs_automata_lambda',
    engineType: 'automata_turing_chomsky',
    formalDefinition:
      'Gerarchia di inclusioni strette di linguaggi formali L ⊆ Σ* generati da grammatiche G = (V, Σ, R, S) e riconosciuti da macchine astratte dotate di memoria crescente (stato finito → pila LIFO → nastro lineare → nastro infinito).',
    linearAlgebraVis: {
      summary:
        'Un automa a stati finiti (DFA/NFA) o catena di Markov su k stati è rappresentato da matrici di transizione booleane/stocastiche M_a ∈ {0,1}^{k×k} per ogni simbolo a ∈ Σ; l’accettazione di una parola w = a₁...a_m è il prodotto matriciale e_{q₀}ᵀ M_{a₁} ··· M_{a_m} u_F!',
      matrixOrVectorFormula:
        'Accetta(w) ⇔ e_{q₀}ᵀ (∏_{i=1}^m M_{w_i}) u_F > 0   |   β-riduzione: (λx. M) N ──► M[x := N]',
      codeSnippet: `// Passo di esecuzione Macchina di Turing δ(q, sym) = (q_next, write_sym, dir)
const rule = delta[state]?.[tape[head]];
if (rule) {
  tape[head] = rule.write;
  head += rule.dir === 'R' ? 1 : -1;
  state = rule.nextState;
}`
    },
    analyticProjectiveDiffVis: {
      summary:
        'Complessità e Riduzioni Polinomiali (A ≤_p B): mappa calcolabile in tempo O(n^k) che trasforma istanze di A in istanze di B (es. 3-SAT ≤_p Clique / Vertex Cover). Il problema della fermata Halting Problem si dimostra indecidibile tramite la stessa diagonalizzazione di Cantor e Gödel!',
      equations:
        'Regolari (O(n)) ⊂ CFL (O(n³) CYK) ⊂ P ⊆ NP ⊆ PSPACE ⊂ Decidibili (∆⁰₁) ⊂ RE (Σ⁰₁)',
      geometricInsight:
        'Nel Lambda Calcolo i termini sono alberi sintattici con archi di legame (binding) dalle variabili ai nodi λ; la β-riduzione è una chirurgia topologica del grafo (graph rewriting) equivalente all’eliminazione del taglio (Cut-Elimination) nelle dimostrazioni di Gentzen.'
    },
    intuitiveCircuitGraphVis: {
      summary:
        'Piramide concentrica della Gerarchia di Chomsky, simulatore passo-passo del Nastro di Turing con testina mobile e grafo degli stati, albero di parsing (mostrando l’ambiguità sintattica con due alberi distinti per la stessa frase) e riscrittura grafica della β-riduzione.',
      diagramStructure: '[Piramide Chomsky 3→2→1→0]  |  [Grafo DFA q₀→q₁→q₂]  |  [Nastro Turing ...|0|1|1|0|... ▲ q_k]  |  [Albero λ]',
      morphingStepByStep: '1. Esegui passo-passo la Macchina di Turing sul nastro → 2. Commuta tra i 4 livelli di Chomsky → 3. Applica un passo di β-riduzione sull’albero λ'
    },
    connections: [
      'Teoremi di Incompletezza di Gödel',
      'Isomorfismo di Curry-Howard-Lambek',
      'Teorema di Cook-Levin (SAT NP-Completo)',
      'Complessità di Kolmogorov e Numero Ω di Chaitin'
    ],
    apparatus: ['Interactive Turing Machine Tape & State Graph', 'Chomsky Hierarchy Pyramid SVG', 'Lambda β-Reduction Tree']
  },

  // ============================================================================
  // A10. CATEGORIE, CURRY-HOWARD-LAMBEK, HoTT, TOPOLOGIA & TEORIA DEI NODI
  // ============================================================================
  {
    id: 'categorie_hott_topologia_nodi',
    title: 'Teoria delle Categorie, Triangolo di Curry-Howard-Lambek, HoTT (Tipi come Spazi), Topologia (Aperto/Compattezza/π₁) & Nodi',
    ProgressionChain: 'Insiemi Aperti/Chiusi → Compattezza & Omeomorfismo → Gruppo Fondamentale π₁ & Nodi → Diagrammi Commutativi → HoTT (Univalenza)',
    family: 'cat_hott_topology',
    engineType: 'category_hott_knots',
    formalDefinition:
      'Una categoria 𝒞 consiste di oggetti Ob(𝒞) e morfismi Hom(A,B) con composizione associativa g ∘ f. In Homotopy Type Theory (HoTT), un tipo A è uno spazio (∞-gruppoide), a : A è un punto, e una prova di uguaglianza p : Id_A(x,y) è un cammino continuo γ: [0,1] → A da x a y!',
    linearAlgebraVis: {
      summary:
        'Rappresentazioni lineari e funtoriali: l’omologia H_k(X; ℝ) e i polinomi dei nodi (Alexander, Jones, Khovanov via parentesi di Kauffman) sono funtori che traducono spazi topologici e intrecci 3D in spazi vettoriali e matrici algebriche invarianti.',
      matrixOrVectorFormula:
        'g ∘ f = h (Diagramma Commutativo)   |   ⟨L⟩ = A⟨L_0⟩ + A⁻¹⟨L_∞⟩ (Skein di Kauffman)   |   (A ≃ B) ≃ (A =_𝒰 B)',
      codeSnippet: `// Curva parametrica 3D del Nodo Trifoglio (Trefoil Knot (2,3)-torus knot)
const x = Math.sin(t) + 2 * Math.sin(2 * t);
const y = Math.cos(t) - 2 * Math.cos(2 * t);
const z = -Math.sin(3 * t);`
    },
    analyticProjectiveDiffVis: {
      summary:
        'Topologia Generale e Algebrica: Intorno B(x,r) ⊆ U (Aperto), Frontiera ∂U = Ū \\ Int(U), Compattezza (da ogni ricoprimento aperto si estrae un sottoricoprimento finito), Omotopia continua di lacci H(s,t) nel gruppo fondamentale π₁(X, x₀).',
      equations:
        'π₁(S¹) ≅ ℤ   |   π₁(T²) ≅ ℤ × ℤ   |   Nat(Hom(A, -), F) ≅ F(A)  (Lemma di Yoneda)',
      geometricInsight:
        'Il Triangolo di Curry-Howard-Lambek mostra che Implicazione Logica (A ⇒ B), Tipo Funzione (A → B) e Oggetto Esponenziale Categoriale (B^A) sono esattamente la stessa struttura vista da tre angolazioni.'
    },
    intuitiveCircuitGraphVis: {
      summary:
        'Visualizzatore quadruplo: (1) Triangolo di Curry-Howard-Lambek e Diagrammi Commutativi (Prodotto, Pullback, Funtore, Trasformazione Naturale); (2) Spazio HoTT con punti x, y, cammini p, q : x = y e omotopia 2-cella α : p = q; (3) Topologia Aperto/Chiuso/Frontiera; (4) Nodo Trifoglio e Mosse di Reidemeister I, II, III.',
      diagramStructure: 'Logica (A ⇒ B) ◄──► Tipi (λx:A. b) ◄──► Categorie (A ──f──► B) ◄──► Omotopia HoTT (Cammino x ──p──► y)',
      morphingStepByStep: '1. Deforma con continuità il cammino p nel cammino q (omotopia 2D) aggirando un buco → 2. Esplora i diagrammi commutativi categoriali → 3. Applica le mosse di Reidemeister al nodo'
    },
    connections: [
      'Logica Intuizionista e Proof Assistants (Lean 4 / Coq / Agda)',
      'Teorema di Seifert-van Kampen',
      'String Diagrams e ZX-Calculus',
      'Superfici Compatte e Caratteristica di Eulero'
    ],
    apparatus: ['Interactive Commutative Diagram & HoTT Path SVG', 'Knot Diagram & Reidemeister Explorer', 'Topology Open/Boundary Visualizer']
  },

  // ============================================================================
  // A11. PROBABILITÀ, BAYES, PCA, CURVE ELLITTICHE, ZKP/MERKLE & RETI NEURALI/TRANSFORMER
  // ============================================================================
  {
    id: 'prob_bayes_pca_ellittiche_ai',
    title: 'Probabilità (Distribuzioni, Bayes Venn, Random Walk), PCA, Curve Ellittiche/ZKP/Merkle & Reti Neurali/Transformer',
    ProgressionChain: 'Distribuzioni & Bayes → Moto Browniano → PCA (Rotazione Assi) → Curve Ellittiche & Merkle ZKP → Loss Landscape & Attention Transformer',
    family: 'prob_stats_ai_crypto',
    engineType: 'prob_pca_elliptic_ai',
    formalDefinition:
      'Spazio di probabilità (Ω, ℱ, P) con P(A|B) = P(A∩B)/P(B). PCA diagonalizza la matrice di covarianza Σ = (1/n)XᵀX. Una curva ellittica E: y² = x³ + ax + b forma un gruppo abeliano geometrico tramite la regola della corda-tangente. Self-Attention: Softmax(QKᵀ/√d_k)V.',
    linearAlgebraVis: {
      summary:
        'PCA trova gli autovettori ortonormali della covarianza Σ = V Λ Vᵀ, ruotando gli assi nella direzione di massima varianza. Nel Transformer, i token X ∈ ℝ^{N×d} vengono proiettati in Query Q=XW_Q, Key K=XW_K, Value V=XW_V; la matrice stocastica A = Softmax(QKᵀ/√d_k) definisce un grafo bipartito pesato di trasporto dell’informazione!',
      matrixOrVectorFormula:
        'Σ v_i = λ_i v_i (PCA)   |   Attention(Q,K,V) = Softmax(Q Kᵀ / √d_k) V   |   w_{t+1} = w_t - η ∇ℒ(w_t)',
      codeSnippet: `// Legge di gruppo geometrica su Curva Ellittica y^2 = x^3 + a*x + b
const m = (yQ - yP) / (xQ - xP);
const xR = m * m - xP - xQ;
const yR = -(yP + m * (xR - xP)); // Riflessione rispetto all'asse x!`
    },
    analyticProjectiveDiffVis: {
      summary:
        'Analitica & Proiettiva: sulla curva ellittica proiettiva y²Z = x³ + axZ² + bZ³, ogni retta interseca la cubica in 3 punti (Teorema di Bézout); la somma P + Q + R = 𝒪 (dove 𝒪 = [0:1:0] è il punto all’infinito dell’asse y!) rende il luogo geometrico un gruppo abeliano. In AI/Fisica Statistica, l’entropia di Boltzmann-Shannon governa la Cross-Entropy Loss ℒ = -Σ p_i log q_i.',
      equations:
        'y² = x³ + ax + b   |   P(A|B) = P(B|A)P(A) / P(B)   |   f_N(x) = (1/√(2πσ²)) e^{-(x-μ)²/(2σ²)}',
      geometricInsight:
        'Quando si passa da ℝ al campo finito 𝔽_p, la curva ellittica liscia diventa una nuvola discreta toroidale di punti: la somma geometrica continua a valere modulo p, ma invertire k·P = Q (Logaritmo Discreto Ellittico) diventa computazionalmente intrattabile!'
    },
    intuitiveCircuitGraphVis: {
      summary:
        'Cruscotto visuale a 4 quadranti interattivi: (1) Distribuzioni (Normale, Binomiale, Poisson), Diagramma di Venn proporzionale di Bayes e Random Walk / Moto Browniano; (2) Rotazione PCA della nuvola dati; (3) Addizione geometrica P + Q = -R sulla Curva Ellittica e Albero di Merkle / ZKP; (4) Loss Landscape con discesa del gradiente e Grafo Bipartito di Self-Attention del Transformer.',
      diagramStructure: '[Bayes Venn & Random Walk]  |  [PCA Axis Rotation]  |  [Curva Ellittica P+Q & Merkle Tree]  |  [Neural Loss & Transformer Q-Kᵀ Bipartite Graph]',
      morphingStepByStep: '1. Muovi la corda per sommare due punti P e Q sulla curva ellittica → 2. Ruota gli assi PCA fino a catturare la varianza massima → 3. Ispeziona i pesi del grafo bipartito di Attention e la traiettoria SGD sulla superficie di perdita'
    },
    connections: [
      'Decomposizione SVD e Teorema Spettrale',
      'Programma di Langlands & Teorema di Fermat-Wiles (Taniyama-Shimura)',
      'Dualità Entropica di Shannon-Boltzmann',
      'Politopo di Birkhoff e Matrici Doppiamente Stocastiche'
    ],
    apparatus: ['Interactive Elliptic Curve Group Law SVG', 'PCA & Bayes Venn Explorer', 'Transformer Attention Bipartite Graph & Loss Landscape']
  },

  // ============================================================================
  // A12. LE 16 GRANDI CORRISPONDENZE E PONTI STRUTTURALI
  // ============================================================================
  {
    id: 'grandi_corrispondenze_ponti',
    title: 'I 16 Grandi Isomorfismi: Galois, Curry-Howard, Langlands, Noether, Atiyah-Singer, Mirror Symmetry, AdS/CFT, Moonshine & Shannon-Boltzmann',
    ProgressionChain: 'Cartesio (1637) → Galois (1832) → Klein (1872) → Noether (1915) →Atiyah-Singer (1963) → Langlands (1967) → Curry-Howard (1969) → AdS/CFT (1997) → HoTT (2006)',
    family: 'grand_bridges',
    engineType: 'category_hott_knots',
    formalDefinition:
      'Un ponte strutturale (isomorfismo o equivalenza di categorie F : 𝒜 ⇄ ℬ : G) è un dizionario esatto che traduce oggetti, morfismi e invarianti di un dominio matematico in un altro apparentemente distante, trasportando teoremi gratuitamente.',
    linearAlgebraVis: {
      summary:
        'Quasi ogni grande ponte passa attraverso la Teoria delle Rappresentazioni Lineari: Galois agisce permutando le radici; Langlands identifica rappresentazioni galoisiane ρ: Gal(ℚ̄/ℚ) → GL_n con rappresentazioni automorfe; Noether lega i generatori dell’algebra di Lie 𝔤 agli operatori hermitiani conservati.',
      matrixOrVectorFormula:
        'L(s, ρ_Galois) = L(s, π_Automorfa)   |   ind_analitico(D) = dim ker D - dim coker D = ∫_M ch(E) ∧ Â(TM)',
      codeSnippet: `// Reticolo duale di Galois: inversione d'ordine tra Sottocampi e Sottogruppi
// K = Q  subset  Q(sqrt(2))  subset  Q(sqrt(2), sqrt(3)) = L
// Gal(L/K) = Z2 x Z2  supset  Z2  supset  {id}`
    },
    analyticProjectiveDiffVis: {
      summary:
        'Atiyah-Singer unifica Analisi Ellittica e Topologia Differenziale (includendo Gauss-Bonnet e Riemann-Roch); Mirror Symmetry scambia la geometria simplettica ( Flussi di Hamilton / A-model ) con la geometria algebrica complessa ( B-model ) invertendo il diamante di Hodge; AdS/CFT proietta la gravità quantistica in (d+1) dimensioni su una teoria conforme sul bordo d-dimensionale.',
      equations:
        'S_Boltzmann = -k_B Σ p_i ln p_i  ↔  H_Shannon = -Σ p_i log₂ p_i   |   j(τ) = q⁻¹ + 744 + 196884 q + ··· (196884 = 1 + 196883 Mostro)',
      geometricInsight:
        'Nella corrispondenza olografica AdS/CFT (formula di Ryu-Takayanagi), l’entropia di entanglement quantistica di una regione A sul bordo è proporzionale all’area della superficie minimale geodetica γ_A immersa nello spazio iperbolico interno AdS!'
    },
    intuitiveCircuitGraphVis: {
      summary:
        'Stele di Rosetta interattiva delle 16 Grandi Corrispondenze: reticoli capovolti di Galois, disco iperbolico olografico AdS/CFT con geodetiche di Ryu-Takayanagi, diamante di Hodge speculare (Mirror Symmetry) e ponte di Langlands.',
      diagramStructure: '[Aritmetica / Galois] ◄═══[Langlands]═══► [Forme Automorfe / Analisi] ◄═══[Mirror Symmetry]═══► [Geometria Simplettica / Fisica]',
      morphingStepByStep: 'Seleziona ciascuno dei 16 ponti storici per visualizzare il dizionario a due colonne e il diagramma strutturale di traduzione'
    },
    connections: [
      'Grafo 3D delle Teorie',
      'Enciclopedia 40 Categorie (`schema_strutture.tex`)',
      'Teoria delle Categorie e Lemma di Yoneda',
      'Ultimo Teorema di Fermat (Wiles)'
    ],
    apparatus: ['Rosetta Stone Bridge Inspector', 'Galois Dual Lattice & AdS/CFT Poincaré Disk SVG', 'Hodge Diamond Mirror Flip']
  }
];

// ============================================================================
// REGISTRO COMPLETO DI COPERTURA (ELENCO A + B + C DEL CORPUS)
// Garantisce la tracciabilità 100% lossless di ogni singola voce estratta,
// incluse le voci meta-testuali o di formattazione marcate [NON VISUALIZZABILE]
// ============================================================================
export interface CorpusCoverageItem {
  term: string;
  sectionOrigin: 'Sezione A (Elenco Principale)' | 'Sezione B (Frequenza Corpus)' | 'Sezione C (Aggiunte Obbligatorie)';
  mappedConceptId: string | 'NON_VISUALIZZABILE';
  visualStatus: string;
}

export const LOSSLESS_CORPUS_COVERAGE_REGISTRY: CorpusCoverageItem[] = [
  // Sezione A & C
  { term: 'Punto, retta, piano, spazio (sottospazi affini r = r0 + t*v)', sectionOrigin: 'Sezione A (Elenco Principale)', mappedConceptId: 'punto_retta_piano_spazio', visualStatus: 'Visualizzato in 3 lenti (Vettoriale, Cartesiana/Proiettiva, Cinematica)' },
  { term: 'Segmento, semiretta, angolo (cosθ = u·v / |u||v|)', sectionOrigin: 'Sezione C (Aggiunte Obbligatorie)', mappedConceptId: 'segmento_semiretta_angolo', visualStatus: 'Visualizzato con proiezione ortogonale e cursore baricentrico' },
  { term: 'Triangolo (equilatero, isoscele, scaleno, rettangolo, punti notevoli, Ceva/Menelao)', sectionOrigin: 'Sezione A (Elenco Principale)', mappedConceptId: 'triangolo_simplesso_piramide', visualStatus: 'Visualizzato con Retta di Eulero, matrice di Gram e 2-simplesso' },
  { term: 'Triangolo → Simplesso 2D → Simplesso 3D (Tetraedro) → Simplesso nD', sectionOrigin: 'Sezione A (Elenco Principale)', mappedConceptId: 'triangolo_simplesso_piramide', visualStatus: 'Motore 3D Three.js + proiezione 4-simplesso (Pentacoro)' },
  { term: 'Piramide a base triangolare/quadrata e Tronco di piramide', sectionOrigin: 'Sezione A (Elenco Principale)', mappedConceptId: 'triangolo_simplesso_piramide', visualStatus: 'Motore 3D interattivo con piano di taglio del tronco e apice proiettivo' },
  { term: 'Area triangolo 1/2|det[v1 v2]| e Volume tetraedro 1/6|det[v1 v2 v3]|', sectionOrigin: 'Sezione C (Aggiunte Obbligatorie)', mappedConceptId: 'triangolo_simplesso_piramide', visualStatus: 'Calcolo live del determinante e della matrice di Gram' },
  { term: 'Quadrato, Rettangolo, Parallelogramma, Rombo, Trapezio', sectionOrigin: 'Sezione A (Elenco Principale)', mappedConceptId: 'quadrato_cubo_ipercubo', visualStatus: 'Visualizzato come zonotopo 2D e immagine lineare di [0,1]²' },
  { term: 'Quadrato → Cubo → Ipercubo (Tesseract 4D) → n-cubo (proiezioni, sezioni, sviluppo)', sectionOrigin: 'Sezione A (Elenco Principale)', mappedConceptId: 'quadrato_cubo_ipercubo', visualStatus: 'Motore 3D Three.js con rotazione 4D (XW, ZW), sezioni iperpiane e croce di Dalì' },
  { term: 'Cerchio, circonferenza, disco, settore, corona circolare, limite π di Archimede', sectionOrigin: 'Sezione A (Elenco Principale)', mappedConceptId: 'cerchio_sfera_ipersfera_superfici', visualStatus: 'Visualizzato con esaustione poligonale di Archimede e SO(2)' },
  { term: 'Cerchio → Sfera → Ipersfera → S^n (Fibrazione di Hopf)', sectionOrigin: 'Sezione A (Elenco Principale)', mappedConceptId: 'cerchio_sfera_ipersfera_superfici', visualStatus: 'Motore 3D con proiezione stereografica e fibrato di Hopf' },
  { term: 'Tetraedro, Cubo, Ottaedro, Dodecaedro, Icosaedro (Solidi Platonici, Archimedei, Stellati)', sectionOrigin: 'Sezione A (Elenco Principale)', mappedConceptId: 'cerchio_sfera_ipersfera_superfici', visualStatus: 'Selettore 3D interattivo dei solidi platonici e dualità V ↔ F' },
  { term: 'Cilindro, Cono, Toro, Nastro di Möbius, Bottiglia di Klein', sectionOrigin: 'Sezione A (Elenco Principale)', mappedConceptId: 'cerchio_sfera_ipersfera_superfici', visualStatus: 'Motore 3D parametrico + poligono fondamentale di identificazione topologica' },
  { term: 'Coniche: parabola, ellisse, iperbole come sezioni 3D cono-piano', sectionOrigin: 'Sezione C (Aggiunte Obbligatorie)', mappedConceptId: 'coniche_analitica_proiettiva_diff', visualStatus: 'Motore 3D Doppio Cono + Piano secante inclinabile + forma quadratica xᵀQx=0' },
  { term: 'Geometria analitica, proiettiva (punti all’infinito, dualità, omografie) e differenziale (curvatura, geodetiche)', sectionOrigin: 'Sezione A (Elenco Principale)', mappedConceptId: 'coniche_analitica_proiettiva_diff', visualStatus: 'Visualizzato con retta impropria Z=0, birapporto e curvatura di Gauss' },
  { term: 'Frattali (Cantor, Sierpinski, Koch, Peano, Mandelbrot, Julia) e Tassellazioni di Penrose', sectionOrigin: 'Sezione A (Elenco Principale)', mappedConceptId: 'frattali_tassellazioni_penrose', visualStatus: 'Motore Canvas interattivo IFS / Koch / Sierpinski / Julia-Mandelbrot' },
  { term: 'Vettori, spazi vettoriali, matrici, rango, nucleo, immagine, determinante, autovalori', sectionOrigin: 'Sezione A (Elenco Principale)', mappedConceptId: 'algebra_lineare_gram_svd_tensori', visualStatus: 'Visualizzato con griglia deformata, ellissoide SVD e teorema rango-nullità' },
  { term: 'Proiezione ortogonale, Gram-Schmidt passo-passo, decomposizioni SVD, QR, LU', sectionOrigin: 'Sezione C (Aggiunte Obbligatorie)', mappedConceptId: 'algebra_lineare_gram_svd_tensori', visualStatus: 'Simulatore geometrico passo-passo di Gram-Schmidt e SVD' },
  { term: 'Tensore (scalare, vettore, matrice, inerzia, sforzo), spazio duale e tensore metrico', sectionOrigin: 'Sezione A (Elenco Principale)', mappedConceptId: 'algebra_lineare_gram_svd_tensori', visualStatus: 'Visualizzato con covettori (pile di iperpiani), diagrammi di Penrose e Lab Tensori 3D' },
  { term: 'Curve di Bézier e spline come combinazioni convesse dei punti di controllo', sectionOrigin: 'Sezione C (Aggiunte Obbligatorie)', mappedConceptId: 'algebra_lineare_gram_svd_tensori', visualStatus: 'Simulatore interattivo dell’algoritmo di De Casteljau con t ∈ [0,1]' },
  { term: 'Funzione complessa: Domain Colouring + Superficie di Riemann multi-foglio e Branch Cut', sectionOrigin: 'Sezione A (Elenco Principale)', mappedConceptId: 'analisi_riemann_fourier_ode', visualStatus: 'Motore 3D Three.js per la superficie di Riemann di √z con taglio di diramazione' },
  { term: 'Limite ε-δ, derivata, gradiente, integrale Riemann vs Lebesgue, Serie di Fourier, ODE e Caos', sectionOrigin: 'Sezione A (Elenco Principale)', mappedConceptId: 'analisi_riemann_fourier_ode', visualStatus: 'Simulatore interattivo tubo ε-δ, fette Riemann/Lebesgue e sintesi armonica di Fourier' },
  { term: 'Logica proposizionale (AND, OR, NOT, XOR, Implicazione, De Morgan) come circuiti e Mappe di Karnaugh', sectionOrigin: 'Sezione A (Elenco Principale)', mappedConceptId: 'logica_circuiti_karnaugh_dimostrazioni', visualStatus: 'Circuito logico interattivo ANSI + Mappa di Karnaugh 4×4 cliccabile sul toro' },
  { term: 'Quantificatori ∀ ∃ come circuiti, Flowchart dimostrazioni (Assurdo, Induzione, Contronominale) e Gödel', sectionOrigin: 'Sezione A (Elenco Principale)', mappedConceptId: 'logica_circuiti_karnaugh_dimostrazioni', visualStatus: 'Circuiti serie/parallelo per ∀/∃, flowchart dimostrativi e diagramma di Gödel' },
  { term: 'Gerarchia di Chomsky, Automi (DFA/NFA, PDA, Macchina di Turing), Alberi di parsing, P vs NP, Lambda calcolo', sectionOrigin: 'Sezione A (Elenco Principale)', mappedConceptId: 'chomsky_automi_turing_lambda', visualStatus: 'Simulatore Nastro di Turing, Piramide di Chomsky e β-riduzione grafica' },
  { term: 'Curry-Howard-Lambek, Teoria delle Categorie (Diagrammi Commutativi), HoTT (Tipi come Spazi)', sectionOrigin: 'Sezione A (Elenco Principale)', mappedConceptId: 'categorie_hott_topologia_nodi', visualStatus: 'Triangolo CHL, Diagrammi Commutativi e Spazio dei Cammini HoTT' },
  { term: 'Topologia (Aperto, chiuso, frontiera, compattezza, omotopia, π₁) e Teoria dei Nodi', sectionOrigin: 'Sezione A (Elenco Principale)', mappedConceptId: 'categorie_hott_topologia_nodi', visualStatus: 'Visualizzatore topologico, lacci omotopi e Nodo Trifoglio con mosse di Reidemeister' },
  { term: 'Probabilità (Distribuzioni, Bayes Venn, Random Walk), PCA, Curve Ellittiche, ZKP/Merkle, Reti Neurali & Transformer', sectionOrigin: 'Sezione A (Elenco Principale)', mappedConceptId: 'prob_bayes_pca_ellittiche_ai', visualStatus: 'Cruscotto interattivo Bayes/PCA, legge di gruppo su Curva Ellittica e grafo Attention' },
  { term: 'Grandi Corrispondenze: Galois, Langlands, Fourier, Noether, Atiyah-Singer, Mirror Symmetry, AdS/CFT, Moonshine, Shannon-Boltzmann', sectionOrigin: 'Sezione A (Elenco Principale)', mappedConceptId: 'grandi_corrispondenze_ponti', visualStatus: 'Atlante interattivo dei 16 Ponti Strutturali con reticoli duali e disco AdS/CFT' },
  // Sezione B: Voci meta-testuali estratte automaticamente per frequenza che non sono concetti matematici autonomi
  { term: 'Frammenti lessicali/editoriali ("Esempio", "Dimostrazione.", "Capitolo 5.", "| Regola | Notazione Formale |", "togruppo] x, y ∈ H", "Teorema Cau-", "Teorema Con-")', sectionOrigin: 'Sezione B (Frequenza Corpus)', mappedConceptId: 'NON_VISUALIZZABILE', visualStatus: '[NON VISUALIZZABILE: etichetta tipografica, intestazione di tabella Markdown/LaTeX o parola spezzata da a-capo PDF; il contenuto matematico sottostante (Sottogruppo, Teorema di Cauchy, Teorema di Convergenza Dominata, Deduzione Naturale) è interamente visualizzato nei rispettivi moduli]' }
];
