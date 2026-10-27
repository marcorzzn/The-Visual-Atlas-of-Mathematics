export type DisciplineId =
  | 'algebra'
  | 'analysis'
  | 'geometry'
  | 'discrete'
  | 'meta'
  | 'physics_ai';

export type NodeType =
  | 'Definizione'
  | 'Teorema'
  | 'Lemma'
  | 'Costruzione'
  | 'Struttura'
  | 'Strumento di Calcolo';

export type EdgeRelationType =
  | 'prerequisito_di'
  | 'generalizza'
  | 'specializza'
  | 'isomorfo_a'
  | 'duale_di'
  | 'analogo_a'
  | 'utilizzato_in'
  | 'dimostrato_da';

export type PatternId =
  | 'diagonalizzazione'
  | 'motivo_quoziente'
  | 'dualita_aggiunta'
  | 'nilpotenza'
  | 'varieta_stabilita';

export interface AtlasNode {
  id: string;
  label: string;
  subtitle: string;
  discipline: DisciplineId;
  nodeType: NodeType;
  abstractionLevel: 1 | 2 | 3 | 4; // 1=Concreto/Geometrico, 2=Struttura algebrica/analitica base, 3=Astrazione differenziale/categoriale, 4=Meta-teoria/Unificazione
  categoryNumber?: number; // 1..40 from schema_strutture.tex
  formula: string;
  definition: string;
  deepInsight: string;
  lean4Snippet: string;
  patterns: PatternId[];
  linkedLab?: 'dimensional' | 'tensor' | 'operator' | 'rotations' | 'cnl';
  pos3D: [number, number, number];
}

export interface AtlasEdge {
  id: string;
  source: string;
  target: string;
  relation: EdgeRelationType;
  explanation: string;
  formulaBridge?: string;
}

export interface TaxonomyCategory40 {
  id: number;
  title: string;
  subtitle: string;
  macroGroup: string;
  colorHex: string;
  keyFormula: string;
  nodes: {
    name: string;
    formula: string;
    details: string;
  }[];
}

export interface CrossCategoryDiscovery {
  id: string;
  fromCategory: string;
  toCategory: string;
  relationLabel: string;
  mathematicalProofOrMeaning: string;
}

export const DISCIPLINE_META: Record<
  DisciplineId,
  { name: string; color: string; shortName: string; description: string }
> = {
  algebra: {
    name: 'I. Fondamenti & Strutture Algebriche',
    shortName: 'Algebra',
    color: '#60a5fa',
    description: 'Gruppi, Anelli, Campi, Spazi Vettoriali, Moduli, Algebre di Lie, Clifford e Quozienti.'
  },
  analysis: {
    name: 'II. Analisi, Operatori & Calcolo',
    shortName: 'Analisi',
    color: '#34d399',
    description: 'Derivate e Integrali come operatori lineari ∞-dimensionali, Serie di Taylor/Fourier, Misura, PDE.'
  },
  geometry: {
    name: 'III. Geometria & Topologia',
    shortName: 'Geometria',
    color: '#f59e0b',
    description: 'Dal Triangolo al Simplesso, Geometria Proiettiva, Forme Differenziali, Varietà, Gruppi di Lie e Curvatura.'
  },
  discrete: {
    name: 'IV. Strutture Discrete & Combinatorica',
    shortName: 'Discreta',
    color: '#a78bfa',
    description: 'Politopi Convessi, Matrici di Incidenza, Caratteristica di Eulero-Poincaré, Grafi, Reticoli e Matroidi.'
  },
  meta: {
    name: 'V. Teorie Unificatrici & Meta-Matematica',
    shortName: 'Meta-Teoria',
    color: '#f472b6',
    description: 'Teoria delle Categorie, Funtori, Topos, Dualità di Pontryagin/Gelfand, Logica Formale Lean 4 e MathLingua.'
  },
  physics_ai: {
    name: 'VI. Fisica Matematica, Meccanica Celeste & IA',
    shortName: 'Fisica & IA',
    color: '#38bdf8',
    description: 'Teoria KAM, Autostrade Spaziali Sub-Riemanniane, mHC (Politopo di Birkhoff & Sinkhorn-Knopp), Embeddings LLM.'
  }
};

export const PATTERN_META: Record<
  PatternId,
  { title: string; subtitle: string; color: string; universalMechanism: string }
> = {
  diagonalizzazione: {
    title: 'Diagonalizzazione & Decomposizione Spettrale',
    subtitle: 'Cambiare sistema di coordinate per disaccoppiare un operatore in direzioni invarianti indipendenti',
    color: '#f59e0b',
    universalMechanism:
      'A = P D P⁻¹ in Algebra Lineare · Serie/Trasformata di Fourier (diagonalizza d/dx nella base e^{ikx}) · Armoniche Sferiche (diagonalizzano ∇² in 3D → orbitali atomici) · SVD (T = U Σ V* per matrici rettangolari e LLM) · Teoria KAM (tori invarianti stabili nello spazio delle fasi).'
  },
  motivo_quoziente: {
    title: 'Il Motivo Universale del Quoziente T(V) / I',
    subtitle: 'Costruire nuove algebre forzando a zero una relazione strutturale tramite passaggio al quoziente',
    color: '#60a5fa',
    universalMechanism:
      'Algebra Simmetrica Sym(V) = T(V)/⟨u⊗v - v⊗u⟩ · Algebra Esterna Λ(V) = T(V)/⟨v⊗v⟩ · Algebra di Clifford Cl(V,q) = T(V)/⟨v⊗v - q(v)1⟩ · Algebra Universale Inviluppante U(g) = T(g)/⟨x⊗y - y⊗x - [x,y]⟩ · Numeri Complessi ℝ[x]/(x²+1) · Numeri Duali ℝ[ε]/(ε²).'
  },
  dualita_aggiunta: {
    title: 'Dualità Vettore/Covettore & Operatori Aggiunti',
    subtitle: 'Accoppiamento bilineare ⟨·,·⟩ che trasferisce un operatore dallo spazio geometrico allo spazio funzionale',
    color: '#f472b6',
    universalMechanism:
      'Vettori v ∈ V ↔ Covettori ω ∈ V* (forme lineari / 1-forme dx) · Matrice Trasposta Aᵀ come pullback f ↦ f∘A · Teorema di Stokes Generalizzato ⟨∂Ω, ω⟩ = ⟨Ω, dω⟩ (∂ e d sono aggiunti!) · Integrazione per Parti Dᵀ = -D · Rouché-Capelli & Teorema del Rango.'
  },
  nilpotenza: {
    title: 'Nilpotenza Strutturale (Il Confine di un Confine è Zero)',
    subtitle: 'Operatori il cui quadrato si annulla identicamente, generando la coomologia e l’analisi esatta',
    color: '#34d399',
    universalMechanism:
      'Derivata Esterna d² = 0 (grad → rot → div = 0, fondamento geometrico delle Equazioni di Maxwell) · Operatore di Bordo Topologico ∂² = 0 (B₁ B₂ = 0 nei politopi e complessi simpliciali → Eulero-Poincaré) · Numeri Duali ε² = 0 (troncamento esatto al 1° ordine per Automatic Differentiation) · Matrice di Derivazione Troncata A_D^{n+1} = 0 su P_n.'
  },
  varieta_stabilita: {
    title: 'Vincolo su Varietà & Trasporto Stabile di Segnale/Energia',
    subtitle: 'Proiettare la dinamica su una varietà geometrica compatta o simplettica per impedire l’esplosione o la dissipazione',
    color: '#38bdf8',
    universalMechanism:
      'mHC (DeepSeek ArXiv 2512.24880): proiezione Sinkhorn-Knopp sul Politopo di Birkhoff (matrici doppiamente stocastiche, ||H||₂ ≤ 1) · Autostrade Spaziali (Baresi-Owen / Todorović): varietà invarianti sub-Riemanniane e connessioni eterocline a Δv ≈ 0 · Gruppi di Lie SO(n)/SU(n) generati da algebre antisimmetriche.'
  }
};

export const ATLAS_NODES: AtlasNode[] = [
  // LIVELLO 1: CONCRETO / OGGETTI GEOMETRICI & ALGEBRICI ELEMENTARI
  {
    id: 'punto_vettore',
    label: 'Punto, Vettore & Spazio Affine ℝⁿ',
    subtitle: 'Entità geometrica fondamentale e traslazione libera',
    discipline: 'geometry',
    nodeType: 'Definizione',
    abstractionLevel: 1,
    categoryNumber: 6,
    formula: 'P - Q = \\mathbf{v} \\in \\mathbb{R}^n,\\quad \\langle u, v \\rangle = \\sum u_i v_i',
    definition:
      'Uno spazio affine A modellato su uno spazio vettoriale euclideo (V, ⟨·,·⟩) associa a ogni coppia di punti (Q,P) un unico vettore traslazione v = P - Q. La norma ||v|| = √⟨v,v⟩ induce la metrica euclidea d(P,Q) = ||P - Q||.',
    deepInsight:
      'Supera gli assiomi sintetici di Euclide-Hilbert: punti, rette e angoli diventano oggetti algebrici calcolabili tramite prodotto scalare (Cauchy-Schwarz garantisce |⟨u,v⟩|/(||u||·||v||) ∈ [-1,1], definendo rigorosamente l’angolo θ = arccos(...)).',
    lean4Snippet: `variable {V : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V]\ndef dist_euclid (P Q : V) : ℝ := ‖P - Q‖`,
    patterns: ['dualita_aggiunta'],
    linkedLab: 'rotations',
    pos3D: [-18, -14, 10]
  },
  {
    id: 'triangolo',
    label: 'Triangolo Euclideo (2-Simplesso)',
    subtitle: 'Atomo della geometria piana e caso base simpliciale',
    discipline: 'geometry',
    nodeType: 'Costruzione',
    abstractionLevel: 1,
    categoryNumber: 35,
    formula: '\\mathrm{Area}(T) = \\frac{1}{2}|\\det[P_1-P_0,\\; P_2-P_0]| = \\frac{1}{2}\\sqrt{\\det G(u,v)}',
    definition:
      'Inviluppo convesso di 3 punti affinemente indipendenti P₀, P₁, P₂. Tutti i suoi punti notevoli (Baricentro G, Incentro I, Circocentro O, Ortocentro H), la Retta di Eulero (H - O = 3(G - O)) e il Cerchio dei 9 Punti di Feuerbach emergono puramente dall’algebra lineare.',
    deepInsight:
      'Il triangolo non è una figura isolata: è il 2-simplesso standard. La sua area è il determinante di Gram 2×2 (da cui segue la Formula di Erone), la somma degli angoli interni è π per bilinearità, e i suoi bordi soddisfano ∂²T = 0, fondamento della triangolazione topologica.',
    lean4Snippet: `structure Simplex2 (V : Type*) := (P0 P1 P2 : V)\ndef triangle_area (u v : ℝ × ℝ) : ℝ := (1/2) * |u.1 * v.2 - u.2 * v.1|`,
    patterns: ['nilpotenza'],
    linkedLab: 'rotations',
    pos3D: [-12, -14, 14]
  },
  {
    id: 'allinemento_proiettivo',
    label: 'Allineamento, Complanarità & Coordinate Omogenee',
    subtitle: 'Perché compare la colonna di 1 nei determinanti geometrici',
    discipline: 'geometry',
    nodeType: 'Teorema',
    abstractionLevel: 1,
    categoryNumber: 36,
    formula: '\\det\\begin{pmatrix} x_1 & y_1 & 1 \\\\ x_2 & y_2 & 1 \\\\ x_3 & y_3 & 1 \\end{pmatrix} = 0 \\iff P_1, P_2, P_3 \\text{ allineati}',
    definition:
      'Tre punti nel piano sono allineati se e solo se il determinante 3×3 con la colonna di 1 si annulla; quattro punti nello spazio 3D sono complanari se e solo se il determinante 4×4 con la colonna di 1 si annulla.',
    deepInsight:
      'Tre ragioni unificate per la colonna di 1: (1) Algebrica: nell’equazione ax + by + c·1 = 0 il termine noto c moltiplica 1 (sistema omogeneo con soluzione non banale iff det=0); (2) Proiettiva: immerge il piano affine in ℝ³ sul piano Z=1 (coordinate omogenee [x:y:1]); (3) Volumetrica: sottraendo la prima riga si riduce al determinante 2×2 dell’area orientata.',
    lean4Snippet: `def collinear_2d (p1 p2 p3 : ℝ × ℝ) : Prop :=\n  Matrix.det ![![p1.1, p1.2, 1], ![p2.1, p2.2, 1], ![p3.1, p3.2, 1]] = 0`,
    patterns: ['motivo_quoziente'],
    linkedLab: 'rotations',
    pos3D: [-6, -14, 12]
  },
  {
    id: 'parabola_complessa',
    label: 'Polinomio Quadratico & Radici Complesse',
    subtitle: 'Dal vertice reale in ℝ² alla superficie di Riemann in ℂ×ℂ ≅ ℝ⁴',
    discipline: 'analysis',
    nodeType: 'Costruzione',
    abstractionLevel: 1,
    categoryNumber: 1,
    formula: 'P(x) = a\\left(x + \\frac{b}{2a}\\right)^2 - \\frac{\\Delta}{4a},\\quad \\Delta = b^2 - 4ac',
    definition:
      'Un trinomio di secondo grado ax²+bx+c è strettamente positivo ∀x∈ℝ se e solo se a > 0 e Δ < 0. Quando Δ < 0 la parabola reale non interseca y=0, ma estendendo il dominio a ℂ = ℝ[x]/(x²+1) le radici emergono come z = (-b ± i√|Δ|)/(2a).',
    deepInsight:
      'Dire che il grafico complesso vive in ℝ×ℝ×ℂ è improprio: poiché x∈ℂ (2D) e y=f(z)∈ℂ (2D), il vero grafico vive in ℂ×ℂ ≅ ℝ⁴. Le sue proiezioni 3D rigorose in ℂ×ℝ sono la Superficie Modulo |f(z)| colorata per la fase arg(f(z)) (Domain Coloring) dove le radici ±i di z²+1=0 toccano quota zero.',
    lean4Snippet: `theorem quad_pos_iff (a b c : ℝ) (ha : a > 0) (hΔ : b^2 - 4*a*c < 0) :\n  ∀ x : ℝ, a * x^2 + b * x + c > 0 := by sorry`,
    patterns: ['motivo_quoziente'],
    linkedLab: 'dimensional',
    pos3D: [14, -14, 10]
  },

  // LIVELLO 2: STRUTTURE ALGEBRICHE DI BASE, OPERATORI LINEARI & SISTEMI
  {
    id: 'spazio_vettoriale',
    label: 'Spazio Vettoriale & Trasformazioni Lineari',
    subtitle: 'Il linguaggio universale della sovrapposizione lineare',
    discipline: 'algebra',
    nodeType: 'Struttura',
    abstractionLevel: 2,
    categoryNumber: 6,
    formula: 'T(\\alpha u + \\beta v) = \\alpha T(u) + \\beta T(v),\\quad \\dim V = \\dim(\\ker T) + \\dim(\\mathrm{Im}\\,T)',
    definition:
      'Modulo libero su un campo K in cui sono definite somma interna e moltiplicazione per scalare. Distinguiamo rigorosamente tra Trasformazione Lineare generale T: V → W (tra mondi diversi, rappresentata da matrice rettangolare m×n) e Operatore Lineare / Endomorfismo L: V → V (nello stesso spazio, matrice quadrata n×n dotata di autovalori, traccia e determinante).',
    deepInsight:
      'Per il Principio di Coordinazione, ogni spazio vettoriale n-dimensionale su K è isomorfo a Kⁿ, ma i vettori non sono solo frecce: polinomi P_n, funzioni C^∞, segnali audio e stati quantistici sono tutti spazi vettoriali.',
    lean4Snippet: `variable {K V W : Type*} [Field K] [AddCommGroup V] [Module K V] [AddCommGroup W] [Module K W]\n#check (LinearMap : Type*)`,
    patterns: ['dualita_aggiunta', 'diagonalizzazione'],
    linkedLab: 'operator',
    pos3D: [-14, -4, 4]
  },
  {
    id: 'rouche_capelli',
    label: 'Rouché-Capelli, Orlati di Kronecker & Isomorfismo',
    subtitle: 'Risolubilità dei sistemi lineari Ax = b e geometria affine delle soluzioni',
    discipline: 'algebra',
    nodeType: 'Teorema',
    abstractionLevel: 2,
    categoryNumber: 7,
    formula: '\\mathrm{rk}(A) = \\mathrm{rk}(A|b) = r \\iff b \\in \\mathrm{Im}(A),\\quad \\mathbb{R}^n / \\ker A \\cong \\mathrm{Im}(A)',
    definition:
      'Un sistema lineare Ax = b ammette soluzioni se e solo se il rango della matrice incompleta coincide con quello della matrice completa. L’insieme delle soluzioni è la varietà affine x₀ + ker(A) di dimensione n - r.',
    deepInsight:
      'Il Teorema degli Orlati di Kronecker evita il calcolo esplosivo di tutti i minori: basta orlare un minore k×k non nullo. Inoltre Rouché-Capelli è esattamente il Primo Teorema di Isomorfismo di Noether applicato agli spazi vettoriali: ℝⁿ/ker(A) ≅ Im(A).',
    lean4Snippet: `theorem first_isomorphism_linear (f : V →ₗ[K] W) :\n  Nonempty ((V ⧸ LinearMap.ker f) ≃ₗ[K] LinearMap.range f) := ⟨ f.quotKerEquivRange ⟩`,
    patterns: ['motivo_quoziente', 'dualita_aggiunta'],
    linkedLab: 'rotations',
    pos3D: [-20, -4, -4]
  },
  {
    id: 'matrice_gram',
    label: 'Matrice di Gram & Identità di Cauchy-Binet',
    subtitle: 'Dalla metrica astratta ai volumi di k-parallelepipedi in ℝⁿ',
    discipline: 'geometry',
    nodeType: 'Strumento di Calcolo',
    abstractionLevel: 2,
    categoryNumber: 7,
    formula: 'G_{ij} = \\langle v_i, v_j \\rangle = (A^T A)_{ij},\\quad \\mathrm{Vol}_k(v_1,\\dots,v_k) = \\sqrt{\\det G}',
    definition:
      'Data una k-upla di vettori v₁,...,v_k in uno spazio euclideo n-dimensionale, la matrice di Gram G = AᵀA racchiude tutte le lunghezze e gli angoli mutui. Il suo determinante è sempre ≥ 0 e si annulla se e solo se i vettori sono linearmente dipendenti.',
    deepInsight:
      'Per k=2 restituisce |u|²|v|² - ⟨u,v⟩² = |u|²|v|²sin²θ (da cui la Formula di Erone per il triangolo). In Geometria Differenziale delle superfici, la Matrice di Gram dei vettori tangenti (∂_u σ, ∂_v σ) diventa la Prima Forma Fondamentale I = [[E,F],[F,G]].',
    lean4Snippet: `def gramMatrix {n k : Type*} [Fintype n] [Semiring R] (A : Matrix n k R) : Matrix k k R :=\n  Aᵀ * A`,
    patterns: ['dualita_aggiunta'],
    linkedLab: 'rotations',
    pos3D: [-8, -4, 10]
  },
  {
    id: 'simplesso_politopo',
    label: 'n-Simplesso, Politopi Convessi & Eulero-Poincaré',
    subtitle: 'Generalizzazione n-dimensionale del triangolo e omologia combinatoria',
    discipline: 'discrete',
    nodeType: 'Struttura',
    abstractionLevel: 2,
    categoryNumber: 35,
    formula: '\\mathrm{Vol}_n(\\Delta^n) = \\frac{1}{n!}|\\det[P_1-P_0,\\dots,P_n-P_0]|,\\quad \\sum_{k=0}^d (-1)^k f_k = 1 - (-1)^d',
    definition:
      'L’n-simplesso è l’inviluppo convesso di n+1 punti affinemente indipendenti (0=Punto, 1=Segmento, 2=Triangolo, 3=Tetraedro). Per il Teorema di Minkowski-Weyl, ogni V-politopo (inviluppo convesso di vertici) coincide con un H-politopo limitato (intersezione di semispazi Ax ≤ b).',
    deepInsight:
      'La formula di Eulero V - E + F = 2 non è un trucco combinatorio isolato: definendo le matrici di incidenza bordo B₁ (vertici-spigoli) e B₂ (spigoli-facce), vale B₁ B₂ = 0 ("il bordo di un bordo è vuoto") e la caratteristica di Eulero segue direttamente dal Teorema del Rango applicato al complesso di catene.',
    lean4Snippet: `theorem boundary_comp_boundary_zero : B1 * B2 = 0 := by sorry`,
    patterns: ['nilpotenza', 'dualita_aggiunta'],
    linkedLab: 'rotations',
    pos3D: [-2, -4, 14]
  },
  {
    id: 'teorema_spettrale',
    label: 'Autovalori, Teorema Spettrale & SVD',
    subtitle: 'Direzioni invarianti, forme quadratiche, coniche e compressione semantica',
    discipline: 'algebra',
    nodeType: 'Teorema',
    abstractionLevel: 2,
    categoryNumber: 7,
    formula: 'A = Q \\Lambda Q^T \\;(\\text{simmetrica}),\\quad T = U \\Sigma V^* \\;(\\text{SVD universale})',
    definition:
      'Ogni operatore autoaggiunto (matrice simmetrica reale A = Aᵀ) ammette una base ortonormale di autovettori con autovalori reali. Per matrici qualsiasi (anche rettangolari m×n), la Decomposizione ai Valori Singolari T = UΣV* fattorizza l’azione in rotazione V*, stiramento Σ e rotazione U.',
    deepInsight:
      'Unifica: (1) Classificazione metrica di coniche e quadriche tramite segnatura di Sylvester (n₊, n₋, n₀); (2) Studio dei massimi/minimi liberi in Analisi II tramite la Matrice Hessiana H_f; (3) Ellissoide di tensione di Lamé nei tensori 3D; (4) Spazi latenti e Word/LLM Embeddings nell’Intelligenza Artificiale.',
    lean4Snippet: `theorem spectral_symmetric (A : Matrix n n ℝ) (hA : A.IsSymm) :\n  ∃ (Q : Matrix n n ℝ) (D : n → ℝ), Q ∈ Matrix.orthogonalGroup n ℝ ∧ A = Q * Matrix.diagonal D * Qᵀ`,
    patterns: ['diagonalizzazione'],
    linkedLab: 'tensor',
    pos3D: [0, -4, 2]
  },
  {
    id: 'derivata_operatore',
    label: 'Derivata & Integrale come Operatori Lineari',
    subtitle: 'L’Analisi Matematica è Algebra Lineare in dimensione infinita',
    discipline: 'analysis',
    nodeType: 'Struttura',
    abstractionLevel: 2,
    categoryNumber: 15,
    formula: 'D(\\alpha f + \\beta g) = \\alpha Df + \\beta Dg,\\quad A_D = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 2 \\\\ 0 & 0 & 0 \\end{pmatrix} \\text{ su } P_2',
    definition:
      'Sullo spazio vettoriale delle funzioni C^∞(ℝ), la derivata D = d/dx è un endomorfismo lineare. Sullo spazio dei polinomi P_n con base {1, x, x²,...}, D è una matrice nilpotente con [1, 2, 3,...] sulla sovradiagonale. Il suo nucleo ker(D) è lo spazio 1D delle rette orizzontali f(x)=c (origine geometrica del "+C" nell’integrale indefinito).',
    deepInsight:
      'Chi sono gli autovettori dell’operatore derivata D(f) = λf? Sono le funzioni esponenziali f(x) = e^{λx}: la serie di Taylor moltiplicata per la matrice ∞×∞ di D subisce uno shift verso l’alto che riproduce esattamente λ·f(x). L’integrazione per parti ⟨Df,g⟩ = -⟨f,Dg⟩ mostra che D è un operatore antisimmetrico (Dᵀ = -D)!',
    lean4Snippet: `def derivPolyMatrix : Matrix (Fin 3) (Fin 3) ℝ := ![![0, 1, 0], ![0, 0, 2], ![0, 0, 0]]`,
    patterns: ['diagonalizzazione', 'nilpotenza', 'dualita_aggiunta'],
    linkedLab: 'operator',
    pos3D: [12, -4, 2]
  },
  {
    id: 'fourier_armoniche',
    label: 'Trasformata di Fourier & Armoniche Sferiche',
    subtitle: 'Cambio di base verso gli autovettori della derivata e del Laplaciano ∇²',
    discipline: 'analysis',
    nodeType: 'Teorema',
    abstractionLevel: 2,
    categoryNumber: 18,
    formula: '\\mathcal{F}\\left(\\frac{d}{dx}f\\right)(\\omega) = i\\omega\\,\\hat{f}(\\omega),\\quad \\nabla^2 Y_\\ell^m = -\\ell(\\ell+1)Y_\\ell^m',
    definition:
      'La Trasformata di Fourier è un cambio di base unitario in L² che proietta una funzione f(x) sugli autovettori complessi e^{iωx} dell’operatore derivata: nella base delle frequenze, l’operatore differenziale D diventa una matrice diagonale (moltiplicazione per iω).',
    deepInsight:
      'In 3D su una sfera S², gli autovettori dell’operatore Laplaciano ∇² sono le Armoniche Sferiche Y_ℓ^m(θ,φ). In Chimica e Fisica Quantistica, questi autovettori geometrici sono letteralmente gli orbitali atomici (s, p, d, f) dell’atomo di idrogeno.',
    lean4Snippet: `-- Fourier diagonalizes differentiation into frequency multiplication`,
    patterns: ['diagonalizzazione', 'dualita_aggiunta'],
    linkedLab: 'operator',
    pos3D: [18, -4, -4]
  },
  {
    id: 'numeri_duali',
    label: 'Numeri Duali ℝ[ε]/(ε²) & Automatic Differentiation',
    subtitle: 'Il ponte algebrico tra ideali quoziente e derivate esatte nel Machine Learning',
    discipline: 'algebra',
    nodeType: 'Struttura',
    abstractionLevel: 2,
    categoryNumber: 4,
    formula: '\\mathbb{R}[\\varepsilon]/(\\varepsilon^2) = \\{a + b\\varepsilon : \\varepsilon^2 = 0\\} \\implies P(x + \\varepsilon) = P(x) + P\'(x)\\varepsilon',
    definition:
      'Quozientando l’anello dei polinomi ℝ[x] per l’ideale (x²), si ottiene l’algebra commutativa dei numeri duali in cui ε ≠ 0 ma ε² = 0. Valutando qualsiasi funzione analitica f in x + ε tramite serie di Taylor, tutti i termini di ordine ≥ 2 svaniscono algebricamente.',
    deepInsight:
      'Permette di calcolare la derivata esatta f\'(x) senza limiti né errori di troncamento numerico (differenze finite). È il cuore matematico della Forward-Mode Automatic Differentiation nei framework moderni di Deep Learning (JAX, PyTorch) e in Geometria Algebrica rappresenta un punto con un "vettore tangente infinitesimo" incollato (spazio tangente di Zariski).',
    lean4Snippet: `abbrev DualNumber (R : Type*) [CommRing R] := TrivSqZeroExt R R`,
    patterns: ['motivo_quoziente', 'nilpotenza'],
    linkedLab: 'operator',
    pos3D: [8, -4, 12]
  },
  {
    id: 'quaternioni_rotazioni',
    label: 'Rotazioni SO(3), Quaternioni ℍ & Formula di Rodrigues',
    subtitle: '13 rappresentazioni parallele del movimento rigido e copertura doppia S³ → SO(3)',
    discipline: 'geometry',
    nodeType: 'Struttura',
    abstractionLevel: 2,
    categoryNumber: 9,
    formula: 'q = \\cos\\frac{\\theta}{2} + \\hat{u}\\sin\\frac{\\theta}{2} \\in Sp(1) \\cong S^3,\\quad v\' = q v q^{-1}',
    definition:
      'Le rotazioni 3D formano il gruppo di Lie non abeliano SO(3). Mentre gli Angoli di Eulero soffrono della singolarità topologica del Gimbal Lock, i quaternioni unitari q ∈ S³ ⊂ ℍ (corpo non commutativo di Hamilton, i²=j²=k²=ijk=-1) parametrizzano SO(3) senza singolarità tramite il coniugio qvq⁻¹ e interpolano geodeticamente con SLERP.',
    deepInsight:
      'Perché compare θ/2 nei quaternioni e negli spinori? Perché S³ ≅ SU(2) è il rivestimento universale a 2 fogli di SO(3) (SO(3) ≅ S³/{±1} ≅ ℝP³): serve una rotazione di 720° (cintura di Dirac) per riportare la fase spinoriale all’identità.',
    lean4Snippet: `def rodriques (v k : ℝ³) (θ : ℝ) : ℝ³ :=\n  (Real.cos θ) • v + (Real.sin θ) • (k ×₃ v) + ((1 - Real.cos θ) * ⟪k, v⟫) • k`,
    patterns: ['motivo_quoziente', 'varieta_stabilita'],
    linkedLab: 'rotations',
    pos3D: [-12, 4, 12]
  },

  // LIVELLO 3: ASTRAZIONE TENSORIALE, DIFFERENZIALE, LIE & CATEGORIALE
  {
    id: 'tensore_ellissoide',
    label: 'Tensori, Prodotto Tensoriale V⊗W & Ellissoide di Lamé',
    subtitle: 'Oltre l’analogia delle ombre: il tensore come trasformatore geometrico attivo',
    discipline: 'geometry',
    nodeType: 'Struttura',
    abstractionLevel: 3,
    categoryNumber: 8,
    formula: 'T \\in V^* \\otimes V^* \\otimes V,\\quad \\sigma(\\mathbf{n}) = T\\,\\mathbf{n} \\;(\\text{Cauchy / Lamé})',
    definition:
      'Un tensore di tipo (r,s) è una mappa multilineare V*×...×V* × V×...×V → K (o un elemento del prodotto universale V^{⊗r} ⊗ (V*)^{⊗s}) le cui componenti si trasformano in modo covariante/controvariante per garantire che l’oggetto geometrico sottostante sia invariante rispetto al cambio di coordinate.',
    deepInsight:
      'L’analogia divulgativa delle "ombre sui tre muri x,y,z" spiega la covarianza ma è statica: nella realtà fisica un tensore simmetrico di rango 2 (stress meccanico, inerzia, permeabilità, metrica di Riemann) è una macchina attiva che deforma una sfera unitaria neutra nell’Ellissoide di Lamé (stiramento diagonale XX,YY,ZZ e taglio XY,XZ,YZ).',
    lean4Snippet: `open TensorProduct\n#check (V ⊗[ℝ] W)`,
    patterns: ['diagonalizzazione', 'dualita_aggiunta'],
    linkedLab: 'tensor',
    pos3D: [-4, 6, 4]
  },
  {
    id: 'algebra_esterna_clifford',
    label: 'Algebra Esterna Λ(V), Clifford Cl(V,q) & Funtore Volume',
    subtitle: 'Bivettori u∧v, rotori N-dimensionali e il determinante come grado topologico',
    discipline: 'algebra',
    nodeType: 'Struttura',
    abstractionLevel: 3,
    categoryNumber: 8,
    formula: '\\Lambda^n(T)(e_1 \\wedge \\dots \\wedge e_n) = (\\det T)\\, e_1 \\wedge \\dots \\wedge e_n,\\quad uv = u\\cdot v + u\\wedge v',
    definition:
      'L’Algebra Esterna di Grassmann Λ(V) = T(V)/⟨v⊗v⟩ introduce il prodotto cuneo antisimmetrico u∧v = -v∧u che rappresenta k-volumi orientati. L’Algebra Geometrica di Clifford Cl(V,q) = T(V)/⟨v⊗v - q(v)1⟩ unifica prodotto scalare e prodotto esterno nel prodotto geometrico uv = u·v + u∧v.',
    deepInsight:
      'Svela cosa sia davvero il determinante: poiché dim Λⁿ(ℝⁿ) = 1, ogni operatore lineare T: V → V induce sul massimo grado esterno Λⁿ(T) la moltiplicazione per un unico scalare, che è esattamente det(T)! In Clifford, le rotazioni in qualsiasi dimensione N avvengono nel piano generato dal bivettore B = u∧v senza mai usare l’asse esterno (che esiste solo in 3D grazie alla dualità di Hodge *(u∧v) = u×v).',
    lean4Snippet: `theorem exterior_top_power_det (T : V →ₗ[K] V) :\n  ExteriorPower.map n T = (LinearMap.det T) • LinearMap.id`,
    patterns: ['motivo_quoziente', 'nilpotenza'],
    linkedLab: 'rotations',
    pos3D: [-14, 6, -2]
  },
  {
    id: 'forme_stokes',
    label: 'Forme Differenziali ω, Derivata Esterna d & Stokes',
    subtitle: 'Covettori dx, nilpotenza d² = 0, Maxwell e aggiunzione bordo-cobordo',
    discipline: 'geometry',
    nodeType: 'Teorema',
    abstractionLevel: 3,
    categoryNumber: 34,
    formula: '\\int_{\\partial \\Omega} \\omega = \\int_\\Omega d\\omega \\iff \\langle \\partial \\Omega, \\omega \\rangle = \\langle \\Omega, d\\omega \\rangle,\\quad d^2 = 0',
    definition:
      'Una k-forma differenziale ω ∈ Ω^k(M) è una sezione liscia di Λ^k(T*M), progettata per essere integrata su sottovarietà k-dimensionali senza bisogno di una metrica. La derivata esterna d: Ω^k → Ω^{k+1} unifica gradiente (k=0), rotore (k=1) e divergenza (k=2) e soddisfa identicamente d² = 0.',
    deepInsight:
      'Rivoluziona la risposta a "cos’è dx nell’integrale?": non è un segmento magico infinitesimo, ma un covettore (1-forma) duale ai vettori tangenti. Scritto come accoppiamento di dualità ⟨∂Ω, ω⟩ = ⟨Ω, dω⟩, il Teorema di Stokes Generalizzato (che racchiude Torricelli-Barrow, Green, Ostrogradskij-Gauss e Kelvin-Stokes) rivela che la derivata esterna d è l’operatore aggiunto dell’operatore di bordo topologico ∂!',
    lean4Snippet: `-- Generalized Stokes: exterior derivative d is the formal adjoint of boundary ∂`,
    patterns: ['dualita_aggiunta', 'nilpotenza'],
    linkedLab: 'operator',
    pos3D: [4, 6, 8]
  },
  {
    id: 'gruppi_algebre_lie',
    label: 'Gruppi di Lie G, Algebre di Lie g & Mappa Esponenziale',
    subtitle: 'Simmetrie continue, matrici a traccia nulla sl(n) e identità di Jacobi',
    discipline: 'algebra',
    nodeType: 'Struttura',
    abstractionLevel: 3,
    categoryNumber: 12,
    formula: '\\exp: \\mathfrak{g} \\to G,\\quad \\det(e^X) = e^{\\mathrm{Tr}(X)},\\quad [X,[Y,Z]] + [Y,[Z,X]] + [Z,[X,Y]] = 0',
    definition:
      'Un Gruppo di Lie G (es. GL(n), SL(n), SO(n), SU(n)) è contemporaneamente un gruppo algebrico e una varietà differenziabile liscia. Il suo spazio tangente all’identità T_I G è l’Algebra di Lie g dotata del commutatore [A,B] = AB - BA. La mappa esponenziale e^X = ∑ X^k/k! proietta i generatori lineari di g negli elementi curvi di G.',
    deepInsight:
      'L’identità di Jacobi det(e^X) = e^{Tr(X)} spiega perché l’algebra di Lie del gruppo speciale lineare SL(n) (matrici con det = 1, che conservano i volumi) è esattamente sl(n) = {X : Tr(X) = 0}, mentre l’algebra di SO(n) (matrici ortogonali RᵀR = I) è so(n) = {X : Xᵀ = -X} (matrici antisimmetriche). In Meccanica Classica, le Parentesi di Poisson {f,H} formano un’algebra di Lie infinitodimensionale e per il Teorema di Noether [H,S]=0 ogni simmetria genera una legge di conservazione.',
    lean4Snippet: `class LieAlgebra (R : Type*) (L : Type*) [CommRing R] [AddCommGroup L] [Module R L] extends Bracket L L`,
    patterns: ['varieta_stabilita', 'motivo_quoziente'],
    linkedLab: 'rotations',
    pos3D: [10, 6, -4]
  },
  {
    id: 'tensore_riemann',
    label: 'Connessioni, Curvatura & Tensore di Riemann R^i_{jkl}',
    subtitle: 'Trasporto parallelo, olonomia, Prima/Seconda Forma Fondamentale e Gauss-Bonnet',
    discipline: 'geometry',
    nodeType: 'Costruzione',
    abstractionLevel: 3,
    categoryNumber: 34,
    formula: 'R(X,Y)Z = \\nabla_X \\nabla_Y Z - \\nabla_Y \\nabla_X Z - \\nabla_{[X,Y]}Z,\\quad \\int_M K\\,dA = 2\\pi \\chi(M)',
    definition:
      'Su una varietà riemanniana (M, g), la connessione di Levi-Civita ∇ definisce il trasporto parallelo compatibile con la metrica. La non-commutatività delle derivate covarianti [∇_X, ∇_Y] misura l’ostruzione locale alla piattezza euclidea, codificata nel Tensore di Curvatura di Riemann.',
    deepInsight:
      'Per le superfici in ℝ³, il Theorema Egregium di Gauss dimostra che la curvatura gaussiana K = det(II)/det(I) = κ₁κ₂ dipende solo dalla Prima Forma Fondamentale I (Matrice di Gram intrinseca). Il Teorema di Gauss-Bonnet ∫_M K dA = 2πχ(M) = 2π(2-2g) salda l’analisi locale della curvatura all’invariante topologico globale (genere g).',
    lean4Snippet: `-- Gauss-Bonnet bridges differential curvature K with topological Euler characteristic χ`,
    patterns: ['nilpotenza', 'dualita_aggiunta'],
    linkedLab: 'tensor',
    pos3D: [-2, 10, 12]
  },

  // LIVELLO 4: META-TEORIA, CATEGORIE, FISICA & INTELLIGENZA ARTIFICIALE
  {
    id: 'teoria_kam_autostrade',
    label: 'Teoria KAM & Autostrade Spaziali Sub-Riemanniane',
    subtitle: 'Tori invarianti, connessioni eterocline, teoria dei nodi e trasporto gravitazionale a Δv ≈ 0',
    discipline: 'physics_ai',
    nodeType: 'Teorema',
    abstractionLevel: 4,
    categoryNumber: 34,
    formula: 'H(I,\\theta) = H_0(I) + \\varepsilon H_1(I,\\theta),\\quad \\delta \\int L\\,dt = 0',
    definition:
      'La Teoria KAM (Kolmogorov-Arnold-Moser) dimostra che nei sistemi hamiltoniani quasi-integrabili i tori invarianti con frequenze diofantee sopravvivono a piccole perturbazioni. Attorno ai punti di Lagrange L₁, L₂ del problema dei 3 corpi ristretto, le varietà invarianti stabili e instabili (tubi di Conley-McGehee / iperboloidi nello spazio delle fasi) formano la Interplanetary Transport Network.',
    deepInsight:
      'Come mostrato dalle ricerche di Baresi & Owen (teoria dei nodi applicata ai tori quasi-periodici ed eterocline) e di Nataša Todorović (mappa di caos FLI e archi di Arches of Chaos), lo spazio-tempo possiede una struttura sub-Riemanniana: le orbite sono "binari" vincolati dove ci si sposta scivolando lungo i tubi invarianti con consumo di carburante quasi nullo, analogamente a come i segnali scorrono sulle varietà vincolate nei modelli neurali.',
    lean4Snippet: `-- Symplectic manifold (M, ω) with dω = 0 and Hamiltonian vector field i_{X_H} ω = dH`,
    patterns: ['diagonalizzazione', 'varieta_stabilita'],
    linkedLab: 'tensor',
    pos3D: [14, 14, 6]
  },
  {
    id: 'deepseek_mhc_birkhoff',
    label: 'mHC (Manifold-Constrained Hyper-Connections) & Politopo di Birkhoff',
    subtitle: 'Matrici doppiamente stocastiche, Sinkhorn-Knopp e stabilità spettrale nelle reti profonde',
    discipline: 'physics_ai',
    nodeType: 'Costruzione',
    abstractionLevel: 4,
    categoryNumber: 35,
    formula: '\\mathcal{B}_n = \\{H \\in \\mathbb{R}_+^{n\\times n} : H\\mathbf{1}=\\mathbf{1},\\; H^T\\mathbf{1}=\\mathbf{1}\\},\\quad \\|H\\|_2 \\le 1',
    definition:
      'Introdotto da DeepSeek (ArXiv 2512.24880), il framework mHC risolve l’esplosione/svanimento del segnale nelle Hyper-Connections sostituendo matrici libere con matrici vincolate a vivere sul Politopo di Birkhoff B_n (l’inviluppo convesso delle matrici di permutazione, per il Teorema di Birkhoff-von Neumann) tramite l’algoritmo iterativo di Sinkhorn-Knopp.',
    deepInsight:
      'Perché funziona matematicamente? (1) Conservazione della norma: ogni matrice doppiamente stocastica ha norma spettrale ||H||₂ ≤ 1 (non espansiva → niente esplosione dei gradienti); (2) Chiusura algebrica: il prodotto di matrici doppiamente stocastiche resta nel politopo B_n attraverso centinaia di layer; (3) Interpretazione geometrica: il flusso informativo è una combinazione convessa baricentrica su una varietà poliedrica compatta, identica concettualmente alle autostrade sub-Riemanniane nella meccanica celeste!',
    lean4Snippet: `structure DoublyStochastic (n : Type*) [Fintype n] (H : Matrix n n ℝ) : Prop :=\n  (nonneg : ∀ i j, 0 ≤ H i j) (row_sum : ∀ i, ∑ j, H i j = 1) (col_sum : ∀ j, ∑ i, H i j = 1)`,
    patterns: ['varieta_stabilita', 'diagonalizzazione'],
    linkedLab: 'operator',
    pos3D: [4, 14, -4]
  },
  {
    id: 'categorie_topos',
    label: 'Teoria delle Categorie, Funtori Aggiunti & Topos',
    subtitle: 'La "matematica della matematica": proprietà universali, Yoneda e unificazione logica',
    discipline: 'meta',
    nodeType: 'Struttura',
    abstractionLevel: 4,
    categoryNumber: 37,
    formula: '\\mathrm{Hom}_{\\mathcal{D}}(F(X), Y) \\cong \\mathrm{Hom}_{\\mathcal{C}}(X, G(Y)),\\quad \\mathrm{Nat}(\\mathrm{Hom}(-,A), F) \\cong F(A)',
    definition:
      'Una Categoria C consiste di oggetti e morfismi con composizione associativa. I Funtori F: C → D sono mappe che preservano la struttura categoriale (es. l’omologia H_k: Top → Ab o il funtore determinante Λⁿ: Vect → Vect). Un Topos di Grothendieck / Elementare generalizza sia la categoria degli insiemi Set sia gli spazi topologici (fasci Sh(X)), fornendo un universo matematico dotato di una propria logica intuizionista interna.',
    deepInsight:
      'Rivela che quasi tutte le costruzioni fondamentali della matematica (prodotti tensoriali, spazi liberi, completamenti di Cauchy, quozienti, teorema di Stokes) sono Coppie di Funtori Aggiunti (F ⊣ G).',
    lean4Snippet: `open CategoryTheory\nvariable {C D : Type*} [Category C] [Category D] (F : C ⥤ D) (G : D ⥤ C)\n#check (F ⊣ G)`,
    patterns: ['dualita_aggiunta', 'motivo_quoziente'],
    linkedLab: 'cnl',
    pos3D: [-8, 15, 2]
  },
  {
    id: 'lean4_mathlingua',
    label: 'Formalizzazione Lean 4, Mathlib & MathLingua CNL',
    subtitle: 'Dipendenze logiche verificabili, linguaggio naturale controllato e progetto Axiom Math',
    discipline: 'meta',
    nodeType: 'Strumento di Calcolo',
    abstractionLevel: 4,
    categoryNumber: 38,
    formula: '\\Gamma \\vdash t : T \\quad (\\text{Curry-Howard: Proposizioni = Tipi,\\; Dimostrazioni = Programmi})',
    definition:
      'Attraverso l’isomorfismo di Curry-Howard nel Calcolo delle Costruzioni Induttive (Lean 4 / Mathlib), ogni definizione e teorema forma un grafo aciclico orientato (DAG) formalmente verificato dal kernel. I linguaggi naturali controllati (CNL come Naproche/ForTheL e MathLingua) fanno da ponte bidirezionale tra il testo matematico umano e l’AST formale.',
    deepInsight:
      'Ispirato a Lean Atlas, TGView3D e al lavoro di Axiom Math sulla formalizzazione della Classificazione dei Gruppi Semplici Finiti ("Teorema Enorme"), Math-Atlas tratta la conoscenza matematica non come testo statico ma come un database interrogabile e computazionale.',
    lean4Snippet: `theorem even_plus_two (x : ℤ) (h : Even x) : Even (x + 2) := by\n  rcases h with ⟨k, rfl⟩\n  exact ⟨k + 1, by ring⟩`,
    patterns: ['dualita_aggiunta'],
    linkedLab: 'cnl',
    pos3D: [-16, 15, -6]
  }
];

export const ATLAS_EDGES: AtlasEdge[] = [
  // Prerequisiti fondamentali
  {
    id: 'e1',
    source: 'punto_vettore',
    target: 'triangolo',
    relation: 'prerequisito_di',
    explanation: 'I vertici P₀, P₁, P₂ e i vettori lato u = P₁-P₀, v = P₂-P₀ definiscono il triangolo nello spazio affine euclideo.',
    formulaBridge: 'u = P_1 - P_0,\\; v = P_2 - P_0'
  },
  {
    id: 'e2',
    source: 'punto_vettore',
    target: 'spazio_vettoriale',
    relation: 'generalizza',
    explanation: 'Lo spazio dei vettori geometrici liberi in ℝ², ℝ³ si astrae nella struttura assiomatica di Spazio Vettoriale V su un campo K.',
    formulaBridge: '\\mathbb{R}^3 \\hookrightarrow V \\text{ su } \\mathbb{K}'
  },
  {
    id: 'e3',
    source: 'triangolo',
    target: 'simplesso_politopo',
    relation: 'generalizza',
    explanation: 'Il triangolo è esattamente il 2-simplesso Δ²; estendendo l’inviluppo convesso a n+1 punti affinemente indipendenti si ottiene l’n-simplesso Δⁿ e i politopi convessi.',
    formulaBridge: '\\text{Triangolo } \\Delta^2 \\longrightarrow \\Delta^n = \\mathrm{conv}(P_0,\\dots,P_n)'
  },
  {
    id: 'e4',
    source: 'triangolo',
    target: 'matrice_gram',
    relation: 'utilizzato_in',
    explanation: 'L’area del triangolo e la Formula di Erone sono il caso 2×2 di Vol(T) = (1/2)√det(G(u,v)) tramite la Matrice di Gram.',
    formulaBridge: '\\mathrm{Area}(T) = \\frac{1}{2}\\sqrt{\\|u\\|^2\\|v\\|^2 - \\langle u,v\\rangle^2}'
  },
  {
    id: 'e5',
    source: 'allinemento_proiettivo',
    target: 'triangolo',
    relation: 'utilizzato_in',
    explanation: 'Il determinante 3×3 con colonna di 1 misura il doppio dell’area orientata del triangolo P₁P₂P₃; si annulla se e solo se il triangolo degenera in 3 punti allineati.',
    formulaBridge: '\\mathrm{Area}(P_1 P_2 P_3) = \\frac{1}{2}|\\det[x_i, y_i, 1]|'
  },
  {
    id: 'e6',
    source: 'spazio_vettoriale',
    target: 'rouche_capelli',
    relation: 'prerequisito_di',
    explanation: 'La teoria del rango, nucleo e immagine di una mappa lineare fonda il Teorema di Rouché-Capelli e il 1° Teorema di Isomorfismo.',
    formulaBridge: '\\dim V = \\dim(\\ker A) + \\mathrm{rk}(A)'
  },
  {
    id: 'e7',
    source: 'spazio_vettoriale',
    target: 'teorema_spettrale',
    relation: 'prerequisito_di',
    explanation: 'Gli endomorfismi lineari simmetrici su spazi euclidei ammettono decomposizione spettrale ortogonale.',
    formulaBridge: 'A v = \\lambda v \\implies A = Q \\Lambda Q^T'
  },
  {
    id: 'e8',
    source: 'spazio_vettoriale',
    target: 'derivata_operatore',
    relation: 'isomorfo_a',
    explanation: 'Lo spazio dei polinomi P_n è isomorfo a ℝ^{n+1}; su di esso la derivata d/dx è letteralmente una matrice nilpotente sovradiagonale.',
    formulaBridge: 'P_n(\\mathbb{R}) \\cong \\mathbb{R}^{n+1},\\quad \\frac{d}{dx} \\leftrightarrow A_D'
  },
  {
    id: 'e9',
    source: 'derivata_operatore',
    target: 'fourier_armoniche',
    relation: 'utilizzato_in',
    explanation: 'La Trasformata di Fourier cambia base nello spazio funzionale usando gli autovettori e^{iωx} dell’operatore derivata D.',
    formulaBridge: 'D(e^{i\\omega x}) = i\\omega e^{i\\omega x}'
  },
  {
    id: 'e10',
    source: 'teorema_spettrale',
    target: 'fourier_armoniche',
    relation: 'analogo_a',
    explanation: 'La Serie/Trasformata di Fourier e le Armoniche Sferiche sono l’esatto analogo infinito-dimensionale (Sturm-Liouville) della diagonalizzazione di una matrice simmetrica.',
    formulaBridge: 'f = \\sum \\langle e_n, f \\rangle e_n \\longleftrightarrow v = \\sum (q_i^T v) q_i'
  },
  {
    id: 'e11',
    source: 'parabola_complessa',
    target: 'numeri_duali',
    relation: 'analogo_a',
    explanation: 'Entrambi nascono dal motivo universale del quoziente polinomiale ℝ[x]/(p(x)): per p(x)=x²+1 si ottengono i Complessi ℂ; per p(x)=x² si ottengono i Numeri Duali ℝ[ε]/(ε²).',
    formulaBridge: '\\mathbb{C} = \\mathbb{R}[x]/(x^2+1) \\;\\longleftrightarrow\\; \\mathbb{D} = \\mathbb{R}[\\varepsilon]/(\\varepsilon^2)'
  },
  {
    id: 'e12',
    source: 'numeri_duali',
    target: 'derivata_operatore',
    relation: 'utilizzato_in',
    explanation: 'La nilpotenza algebrica ε²=0 calcola esattamente l’operatore derivata f\'(x) come coefficiente di ε in f(x+ε) (Automatic Differentiation).',
    formulaBridge: 'f(x+\\varepsilon) = f(x) + f\'(x)\\varepsilon'
  },
  {
    id: 'e13',
    source: 'spazio_vettoriale',
    target: 'tensore_ellissoide',
    relation: 'generalizza',
    explanation: 'Dai vettori (rango 1) e covettori si passa al prodotto tensoriale universale V^{⊗r} ⊗ (V*)^{⊗s}.',
    formulaBridge: 'V \\longrightarrow V \\otimes V^* \\cong \\mathrm{End}(V)'
  },
  {
    id: 'e14',
    source: 'teorema_spettrale',
    target: 'tensore_ellissoide',
    relation: 'utilizzato_in',
    explanation: 'Gli autovettori e autovalori di un tensore simmetrico 3×3 determinano gli assi principali e i semiassi dell’Ellissoide di tensione di Lamé.',
    formulaBridge: 'T u_i = \\sigma_i u_i \\implies \\sum \\frac{x_i^2}{\\sigma_i^2} = 1'
  },
  {
    id: 'e15',
    source: 'tensore_ellissoide',
    target: 'algebra_esterna_clifford',
    relation: 'specializza',
    explanation: 'Quozientando l’algebra tensoriale T(V) per v⊗v si ottiene l’Algebra Esterna Λ(V); quozientando per v⊗v - q(v)1 si ottiene l’Algebra di Clifford.',
    formulaBridge: '\\mathcal{T}(V) \\twoheadrightarrow \\Lambda(V),\\; \\mathrm{Cl}(V,q)'
  },
  {
    id: 'e16',
    source: 'quaternioni_rotazioni',
    target: 'algebra_esterna_clifford',
    relation: 'specializza',
    explanation: 'I quaternioni ℍ sono isomorfi alla sottoalgebra pari dell’Algebra di Clifford 3D: ℍ ≅ Cl⁺(ℝ³) generata dai bivettori e₁e₂, e₂e₃, e₃e₁.',
    formulaBridge: '\\mathbb{H} \\cong \\mathrm{Cl}_{0,2}(\\mathbb{R}) \\cong \\mathrm{Cl}^+_{3,0}(\\mathbb{R})'
  },
  {
    id: 'e17',
    source: 'quaternioni_rotazioni',
    target: 'gruppi_algebre_lie',
    relation: 'specializza',
    explanation: 'La Formula di Rodrigues e il coniugio quaternionico sono la mappa esponenziale di Lie exp: so(3) → SO(3) e su(2) → SU(2).',
    formulaBridge: 'R(\\hat{u},\\theta) = \\exp(\\theta [\\hat{u}]_\\times) \\in SO(3)'
  },
  {
    id: 'e18',
    source: 'algebra_esterna_clifford',
    target: 'forme_stokes',
    relation: 'prerequisito_di',
    explanation: 'Le k-forme differenziali ω sono campi di elementi di Λ^k(T*M) integrabili sulle varietà.',
    formulaBridge: '\\Omega^k(M) = \\Gamma(\\Lambda^k T^*M)'
  },
  {
    id: 'e19',
    source: 'simplesso_politopo',
    target: 'forme_stokes',
    relation: 'duale_di',
    explanation: 'Per il Teorema di Stokes e di De Rham, l’operatore di bordo ∂ sui simplessi/catene è il duale aggiunto della derivata esterna d sulle forme differenziali.',
    formulaBridge: '\\langle \\partial c, \\omega \\rangle = \\langle c, d\\omega \\rangle'
  },
  {
    id: 'e20',
    source: 'matrice_gram',
    target: 'tensore_riemann',
    relation: 'generalizza',
    explanation: 'La Matrice di Gram variabile punto per punto su una varietà curva diventa la Prima Forma Fondamentale / Metrica Riemanniana g_{ij}(x), da cui deriva il Tensore di Riemann.',
    formulaBridge: 'G_{ij} = \\langle \\partial_i, \\partial_j \\rangle \\longrightarrow g_{\\mu\\nu}(x) \\longrightarrow R^\\rho_{\\sigma\\mu\\nu}'
  },
  {
    id: 'e21',
    source: 'forme_stokes',
    target: 'tensore_riemann',
    relation: 'prerequisito_di',
    explanation: 'Nel formalismo di Cartan, connessione ω^i_j e curvatura Ω^i_j = dω^i_j + ω^i_k ∧ ω^k_j sono 1-forme e 2-forme differenziali a valori matriciali.',
    formulaBridge: '\\Omega = d\\omega + \\omega \\wedge \\omega'
  },
  {
    id: 'e22',
    source: 'teorema_spettrale',
    target: 'teoria_kam_autostrade',
    relation: 'analogo_a',
    explanation: 'Come la diagonalizzazione trova gli autovettori invarianti di un operatore lineare, la Teoria KAM trova i tori invarianti e le varietà stabili/instabili in meccanica celeste non lineare.',
    formulaBridge: 'A v = \\lambda v \\;\\longleftrightarrow\\; \\Phi_t(\\mathbb{T}^n) = \\mathbb{T}^n'
  },
  {
    id: 'e23',
    source: 'simplesso_politopo',
    target: 'deepseek_mhc_birkhoff',
    relation: 'utilizzato_in',
    explanation: 'Il Politopo di Birkhoff B_n usato in DeepSeek mHC è un politopo convesso (3n-2..n²-2n+1 dim) i cui vertici sono le n! matrici di permutazione.',
    formulaBridge: '\\mathcal{B}_n = \\mathrm{conv}(P_\\sigma : \\sigma \\in S_n)'
  },
  {
    id: 'e24',
    source: 'teoria_kam_autostrade',
    target: 'deepseek_mhc_birkhoff',
    relation: 'analogo_a',
    explanation: 'Connessione trasversale profonda: sia le Autostrade Spaziali sub-Riemanniane sia mHC in Deep Learning stabilizzano il trasporto vincolando la dinamica su una varietà geometrica compatta.',
    formulaBridge: '\\text{Varietà Invariante } \\mathcal{M}_{\\text{sub-Riem}} \\longleftrightarrow \\text{Politopo di Birkhoff } \\mathcal{B}_n'
  },
  {
    id: 'e25',
    source: 'forme_stokes',
    target: 'categorie_topos',
    relation: 'generalizza',
    explanation: 'La dualità tra catene simpliciali e forme differenziali si astrae in una coppia di funtori aggiunti e nella teoria dei Fasci / Topos.',
    formulaBridge: 'd \\dashv \\partial \\text{ come aggiunzione categoriale}'
  },
  {
    id: 'e26',
    source: 'categorie_topos',
    target: 'lean4_mathlingua',
    relation: 'isomorfo_a',
    explanation: 'Per la corrispondenza di Curry-Howard-Lambek, i Topos elementari e le Categorie Cartesiane Chiuse equivalgono ai sistemi di tipi dipendenti usati in Lean 4.',
    formulaBridge: '\\text{CCC / Topos} \\Longleftrightarrow \\text{Dependent Type Theory (Lean 4)}'
  }
];

export const FORTY_CATEGORIES_SCHEMA: TaxonomyCategory40[] = [
  {
    id: 1,
    title: 'Cat. 1 — Insiemi Numerici e Estensioni',
    subtitle: 'Torre canonica da ℕ ai sedenioni e campi p-adici',
    macroGroup: 'Fondamenti & Numeri',
    colorHex: '#60a5fa',
    keyFormula: '\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R} \\subset \\mathbb{C} \\subset \\mathbb{H} \\subset \\mathbb{O} \\subset \\mathbb{S}',
    nodes: [
      { name: 'Naturali ℕ, Interi ℤ, Razionali ℚ', formula: '(\\mathbb{N},+) \\to (\\mathbb{Z},+,\\cdot) \\to \\mathrm{Frac}(\\mathbb{Z})=\\mathbb{Q}', details: 'Semiring di Peano, anello euclideo e campo primo caratteristica 0.' },
      { name: 'Algebrici ℚ̄ vs Trascendenti (π, e)', formula: '[\\alpha:\\mathbb{Q}] < \\infty \\text{ vs } |\\mathbb{R}\\setminus\\overline{\\mathbb{Q}}| = \\mathfrak{c}', details: 'Teorema di Lindemann-Weierstrass e argomento diagonale di Cantor.' },
      { name: 'Reali ℝ, Complessi ℂ, Quaternioni ℍ, Ottonioni 𝕆', formula: '\\dim_{\\mathbb{R}} = 1, 2, 4, 8 \\;(\\text{Teorema di Hurwitz})', details: 'Costruzione di Cayley-Dickson: a ogni raddoppio si perde una proprietà (ordine → commutatività → associatività → alternatività).' },
      { name: 'Numeri p-adici ℚ_p & Iperreali *ℝ', formula: '|x|_p = p^{-v_p(x)},\\quad {}^*\\mathbb{R} = \\mathbb{R}^{\\mathbb{N}}/\\mathcal{U}', details: 'Completamento ultrametrico rispetto alla valutazione p-adica e analisi non-standard di Robinson tramite ultrafiltri.' }
    ]
  },
  {
    id: 2,
    title: 'Cat. 2 — Strutture a 1 Operazione (Magmi → Gruppi)',
    subtitle: 'Gerarchia dell’associatività, elemento neutro e invertibilità',
    macroGroup: 'Algebra a 1 e 2 Operazioni',
    colorHex: '#f59e0b',
    keyFormula: '\\text{Magma} \\to \\text{Semigruppo} \\to \\text{Monoide} \\to \\text{Gruppo} \\to \\text{Gruppo Abeliano}',
    nodes: [
      { name: 'Magma, Quasigruppo & Loop', formula: '(M, *) \\text{ chiuso};\\; ax=b, ya=b \\text{ unici}', details: 'Divisione sinistra/destra senza associatività (es. quadrati latini, ottonioni non nulli).' },
      { name: 'Semigruppo & Monoide', formula: '(a*b)*c = a*(b*c),\\quad e*a = a*e = a', details: 'Linguaggi formali Σ*, composizione di endomorfismi End(X).' },
      { name: 'Gruppo & Gruppo Abeliano', formula: '\\forall a \\in G,\\; \\exists a^{-1} : a*a^{-1} = e', details: 'Simmetrie reversibili; per il Teorema di Cayley ogni gruppo G si immerge in Sym(G).' }
    ]
  },
  {
    id: 3,
    title: 'Cat. 3 — Teoria Avanzata dei Gruppi',
    subtitle: 'Sottogruppi normali, quozienti, Sylow, risolubilità e gruppi semplici',
    macroGroup: 'Algebra a 1 e 2 Operazioni',
    colorHex: '#f59e0b',
    keyFormula: 'N \\trianglelefteq G \\implies G/N,\\quad |G| = |H|\\cdot [G:H] \\;(\\text{Lagrange})',
    nodes: [
      { name: 'Sottogruppo Normale & Gruppo Quoziente', formula: 'gNg^{-1} = N \\iff G/N = \\{gN\\}', details: 'Nuclei di omomorfismi e Primo Teorema di Isomorfismo G/ker(φ) ≅ Im(φ).' },
      { name: 'Teoremi di Sylow & Gruppi Risolubili', formula: 'n_p \\equiv 1 \\pmod p,\\quad G_0 \\triangleleft G_1 \\triangleleft \\dots \\triangleleft G_k = G', details: 'Criterio di Galois per la risolubilità per radicali delle equazioni polinomiali (A₅ non risolubile per n ≥ 5).' },
      { name: 'Gruppi Semplici Finiti (Teorema Enorme)', formula: '\\mathbb{Z}_p,\\; A_n (n\\ge 5),\\; \\text{Lie finiti},\\; 26 \\text{ sporadici (Monster)}', details: 'Atomi della teoria dei gruppi finiti (Teorema di Jordan-Hölder), oggetto di formalizzazione in Lean.' }
    ]
  },
  {
    id: 4,
    title: 'Cat. 4 — Strutture a 2 Operazioni: Anelli',
    subtitle: 'Domini di integrità, PID, UFD, anelli euclidei e noetheriani',
    macroGroup: 'Algebra a 1 e 2 Operazioni',
    colorHex: '#34d399',
    keyFormula: '\\text{Campo} \\subset \\text{Anello Euclideo} \\subset \\text{PID} \\subset \\text{UFD} \\subset \\text{Dominio d\'Integrità}',
    nodes: [
      { name: 'Anello, Ideale I ◁ R & Quoziente R/I', formula: 'r \\cdot I \\subseteq I \\implies R/I', details: 'I massimale ⟺ R/I campo; I primo ⟺ R/I dominio d’integrità.' },
      { name: 'Anelli Euclidei, PID & UFD', formula: '\\mathbb{Z},\\; K[x],\\; \\mathbb{Z}[i] \\;(\\text{Gauss})', details: 'Fattorizzazione unica in irriducibili e identità di Bézout.' },
      { name: 'Anello Noetheriano & Artiniano', formula: 'I_1 \\subseteq I_2 \\subseteq \\dots \\text{ stazionaria (ACC)}', details: 'Teorema della Base di Hilbert: se R è noetheriano, R[x₁,...,x_n] è noetheriano.' }
    ]
  },
  {
    id: 5,
    title: 'Cat. 5 — Campi e Teoria di Galois',
    subtitle: 'Caratteristica, campi finiti 𝔽_q, estensioni e corrispondenza fondamentale',
    macroGroup: 'Algebra a 1 e 2 Operazioni',
    colorHex: '#34d399',
    keyFormula: '\\text{Sottocampi } E/K \\;\\longleftrightarrow\\; \\text{Sottogruppi } H \\le \\mathrm{Gal}(L/K)',
    nodes: [
      { name: 'Campi Finiti di Galois 𝔽_{p^n}', formula: '\\mathbb{F}_{p^n} = \\mathbb{F}_p[x]/(f(x)) \\text{ con } \\deg f = n', details: 'Il gruppo moltiplicativo 𝔽_q* è ciclico di ordine q-1; fondamento di crittografia AES e codici Reed-Solomon.' },
      { name: 'Corrispondenza di Galois', formula: '[L:K] = |\\mathrm{Gal}(L/K)|', details: 'Biezione che inverte le inclusioni tra estensioni intermedie e sottogruppi del gruppo di automorfismi.' }
    ]
  },
  {
    id: 6,
    title: 'Cat. 6 — Moduli e Spazi Vettoriali',
    subtitle: 'Basi di Hamel, dimensione, spazio duale V* e moduli di torsione',
    macroGroup: 'Algebra Lineare, Multilineare & Algebre',
    colorHex: '#38bdf8',
    keyFormula: 'R\\text{-Modulo} \\xrightarrow{R = K \\text{ campo}} K\\text{-Spazio Vettoriale}',
    nodes: [
      { name: 'R-Modulo vs K-Spazio Vettoriale', formula: 'M \\cong R^r \\oplus \\bigoplus R/(d_i) \\;(\\text{ su PID})', details: 'Un modulo su un anello non ha sempre una base libera; su un campo K ogni spazio vettoriale è libero.' },
      { name: 'Spazio Duale V* & Biduale V**', formula: 'V^* = \\mathrm{Hom}_K(V, K),\\quad \\dim V < \\infty \\implies V \\cong V^* \\cong V^{**}', details: 'L’isomorfismo V ≅ V** è canonico (indipendente dalla base), mentre V ≅ V* richiede la scelta di un prodotto scalare (metrica).' }
    ]
  },
  {
    id: 7,
    title: 'Cat. 7 — Matrici e Operatori Lineari',
    subtitle: 'Strutture di M_{m,n}(K) vs M_n(K), gruppi classici e forme canoniche',
    macroGroup: 'Algebra Lineare, Multilineare & Algebre',
    colorHex: '#38bdf8',
    keyFormula: 'M_{m,n}(K) \\text{ Spazio Vett. vs } M_n(K) \\text{ Algebra Associativa Unitaria}',
    nodes: [
      { name: 'Matrici Rettangolari M_{m,n}(K) vs Quadrate M_n(K)', formula: '\\dim M_{m,n}(K) = mn;\\quad (M_n(K), +, \\times, \\cdot)', details: 'Per m≠n il prodotto riga-colonna non è interno; per m=n forma un anello non commutativo unitario e un’algebra associativa.' },
      { name: 'Gruppi Lineari GL(n), SL(n), O(n), SO(n), U(n), Sp(2n)', formula: 'GL(n,K) = \\{A : \\det A \\neq 0\\}', details: 'Il gruppo delle unità dell’anello M_n(K) e i suoi sottogruppi di invarianza metrica/simplettica.' },
      { name: 'Forma Canonica di Jordan, SVD & Polinomio Minimo', formula: 'A = P J P^{-1},\\quad m_A(\\lambda) \\text{ radici semplici } \\iff \\text{diagonalizzabile}', details: 'Hamilton-Cayley p_A(A)=0 (permette di calcolare A⁻¹) e Complementi di Schur det(M)=det(A)det(D-CA⁻¹B).' }
    ]
  },
  {
    id: 8,
    title: 'Cat. 8 — Algebra Multilineare e Tensoriale',
    subtitle: 'Prodotto tensoriale, algebra tensoriale T(V) e il motivo del quoziente',
    macroGroup: 'Algebra Lineare, Multilineare & Algebre',
    colorHex: '#818cf8',
    keyFormula: '\\mathcal{T}(V)/I \\longrightarrow \\mathrm{Sym}(V),\\; \\Lambda(V),\\; \\mathrm{Cl}(V,q),\\; U(\\mathfrak{g})',
    nodes: [
      { name: 'Prodotto Tensoriale V ⊗ W & Proprietà Universale', formula: '\\mathrm{Bil}(V\\times W, Z) \\cong \\mathrm{Hom}(V\\otimes W, Z)', details: 'Trasforma mappe bilineari in mappe lineari.' },
      { name: 'Algebra Simmetrica Sym(V) & Algebra Esterna Λ(V)', formula: 'u\\wedge v = -v\\wedge u,\\quad \\dim \\Lambda^k(\\mathbb{R}^n) = \\binom{n}{k}', details: 'Polinomi omogenei (bosoni) vs forme antisimmetriche di volume (fermioni).' },
      { name: 'Algebra di Clifford Cl(V,q) & Spinori', formula: 'v^2 = q(v)\\cdot 1,\\quad \\mathrm{Spin}(n) \\subset \\mathrm{Cl}^0(V,q)', details: 'Unifica scalari, vettori, bivettori, quaternioni e operatori di Dirac.' }
    ]
  },
  {
    id: 9,
    title: 'Cat. 9 — Algebre su un Campo (Associative e Non)',
    subtitle: 'Teorema di Frobenius, algebre di divisione, Lie e Jordan',
    macroGroup: 'Algebra Lineare, Multilineare & Algebre',
    colorHex: '#a78bfa',
    keyFormula: '\\text{Divisione su } \\mathbb{R}: \\mathbb{R}, \\mathbb{C}, \\mathbb{H} \\text{ (Frobenius)} \\cup \\mathbb{O} \\text{ (Hurwitz)}',
    nodes: [
      { name: 'Algebre di Divisione ℝ, ℂ, ℍ, 𝕆', formula: '\\dim_{\\mathbb{R}} \\in \\{1, 2, 4, 8\\}', details: 'Teorema di Bott-Milnor-Kervaire: le uniche sfere parallelizzabili sono S⁰, S¹, S³, S⁷.' },
      { name: 'Algebra di Lie (g, [·,·]) & Algebra di Jordan (J, ∘)', formula: '[A,B]=AB-BA,\\quad A\\circ B = \\frac{1}{2}(AB+BA)', details: 'Commutatore antisimmetrico (generatori di simmetrie) vs anticommutatore simmetrico (osservabili quantistiche autoaggiunte).' }
    ]
  },
  {
    id: 10,
    title: 'Cat. 10 — Strutture d’Ordine e Reticoli',
    subtitle: 'Poset, reticoli distributivi, algebre di Boole e di Heyting',
    macroGroup: 'Ordine, Topologia & Analisi',
    colorHex: '#2dd4bf',
    keyFormula: '\\text{Preordine} \\to \\text{Poset} \\to \\text{Reticolo } (L,\\wedge,\\vee) \\to \\text{Algebra di Boole}',
    nodes: [
      { name: 'Poset, Lemma di Zorn & Buon Ordine', formula: '\\text{Ogni catena ha maggiorante} \\implies \\exists \\text{ elemento massimale}', details: 'Equivalente all’Assioma della Scelta; garantisce l’esistenza di basi in ogni spazio vettoriale.' },
      { name: 'Algebra di Boole vs Algebra di Heyting', formula: 'a \\vee \\neg a = 1 \\text{ (Boole)} \\text{ vs Logica Intuizionista (Heyting)}', details: 'Gli aperti O(X) di uno spazio topologico formano un’algebra di Heyting completa (Locale/Frame).' }
    ]
  },
  {
    id: 11,
    title: 'Cat. 11 — Spazi Topologici e Metrici',
    subtitle: 'Aperti, compattezza, connessione, separazione T₀–T₄ e completezza di Cauchy',
    macroGroup: 'Ordine, Topologia & Analisi',
    colorHex: '#34d399',
    keyFormula: '\\text{Spazio Topologico } (X,\\tau) \\supset \\text{Metrico } (X,d) \\supset \\text{Normato } (X,\\|\\cdot\\|)',
    nodes: [
      { name: 'Assiomi di Separazione (Hausdorff T₂, Normale T₄)', formula: 'x \\neq y \\implies \\exists U_x \\cap U_y = \\emptyset', details: 'Unicità del limite delle successioni convergenti.' },
      { name: 'Spazio Metrico Completo & Contrazioni di Banach', formula: 'd(T(x), T(y)) \\le q\\,d(x,y) \\;(q<1) \\implies \\exists! x^* = T(x^*)', details: 'Per operatori lineari q < 1 equivale al Raggio Spettrale ρ(M) < 1.' }
    ]
  },
  {
    id: 12,
    title: 'Cat. 12 — Varietà e Gruppi Topologici / di Lie',
    subtitle: 'Atlanti differenziabili, varietà riemanniane, simplettiche e complesse',
    macroGroup: 'Ordine, Topologia & Analisi',
    colorHex: '#f59e0b',
    keyFormula: 'M^n \\text{ localmente } \\mathbb{R}^n,\\quad (M,g) \\text{ Riemanniana},\\quad (M,\\omega) \\text{ Simplettica}',
    nodes: [
      { name: 'Varietà Differenziabile C^∞ & Spazio Tangente T_p M', formula: '\\varphi_\\beta \\circ \\varphi_\\alpha^{-1} \\in C^\\infty', details: 'Ogni varietà liscia è localmente lineare (la matrice Jacobiana è la mappa differenziale tra spazi tangenti).' },
      { name: 'Varietà Simplettica & Sub-Riemanniana', formula: 'd\\omega = 0,\\; \\omega^n \\neq 0', details: 'Spazio delle fasi della meccanica hamiltoniana e geometria dei vincoli non olonomi.' }
    ]
  },
  {
    id: 13,
    title: 'Cat. 13 — Spazi dell’Analisi Funzionale',
    subtitle: 'Spazi di Banach, Hilbert, Sobolev H^k, Distribuzioni D\' e Algebre C*',
    macroGroup: 'Ordine, Topologia & Analisi',
    colorHex: '#38bdf8',
    keyFormula: '\\text{Hilbert } \\mathcal{H} \\subset \\text{Banach } (B,\\|\\cdot\\|) \\subset \\text{Localmente Convesso (Fréchet)}',
    nodes: [
      { name: 'Spazi di Hilbert L² & Banach L^p', formula: '\\langle f, g \\rangle = \\int \\overline{f(x)}g(x)\\,dx', details: 'Geometria euclidea in dimensione infinita: ortogonalità di funzioni e teorema di rappresentazione di Riesz.' },
      { name: 'Spazi di Sobolev W^{k,p} & Distribuzioni di Schwartz D\'', formula: '\\langle \\delta_0, \\varphi \\rangle = \\varphi(0),\\quad \\langle T\', \\varphi \\rangle = -\\langle T, \\varphi\' \\rangle', details: 'Derivate deboli per le PDE e funzione di Green come inversa L⁻¹ di un operatore differenziale.' }
    ]
  },
  {
    id: 14,
    title: 'Cat. 14 — Misura, Probabilità e Sistemi Dinamici',
    subtitle: 'σ-algebre, integrale di Lebesgue, processi stocastici ed ergodicità',
    macroGroup: 'Ordine, Topologia & Analisi',
    colorHex: '#a78bfa',
    keyFormula: '(X, \\Sigma, \\mu),\\quad \\mu(X)=1 \\implies (\\Omega, \\mathcal{F}, P) \\text{ Spazio di Kolmogorov}',
    nodes: [
      { name: 'Misura di Lebesgue & Spazio di Probabilità', formula: '\\int_X f\\,d\\mu,\\quad \\mathbb{E}[X] = \\int_\\Omega X\\,dP', details: 'Teorema della convergenza dominata e assiomatica di Kolmogorov.' },
      { name: 'Sistemi Dinamici, Caos & Esponenti di Lyapunov (FLI)', formula: '\\lambda = \\lim_{t\\to\\infty} \\frac{1}{t}\\ln\\frac{\\|\\delta x(t)\\|}{\\|\\delta x(0)\\|}', details: 'Fast Lyapunov Indicator (FLI) usato per mappare le varietà caotiche e le autostrade celesti.' }
    ]
  },
  {
    id: 15,
    title: 'Cat. 15 — Calcolo Differenziale e Integrale',
    subtitle: 'Limiti, continuità, derivate, integrali di Riemann/Lebesgue e forme differenziali',
    macroGroup: 'Analisi, Equazioni & Calcolo',
    colorHex: '#34d399',
    keyFormula: '\\int_a^b f\'(x)\\,dx = f(b) - f(a) \\longrightarrow \\int_\\Omega d\\omega = \\int_{\\partial\\Omega} \\omega',
    nodes: [
      { name: 'Derivata di Fréchet / Gateaux & Matrice Jacobiana', formula: 'f(x+h) = f(x) + J_f(x)h + o(\\|h\\|)', details: 'La derivata totale è la migliore approssimazione lineare locale.' },
      { name: 'Integrale Definito vs Indefinito (Studio del Nucleo)', formula: '\\ker\\left(\\int_{-a}^a\\right) = \\{\\text{funzioni dispari + media nulla}\\}', details: 'L’integrale definito da V a ℝ ha nucleo infinito-dimensionale; l’integrale indefinito ∫₀ˣ ha nucleo banale {0}.' }
    ]
  },
  {
    id: 16,
    title: 'Cat. 16 — Equazioni Differenziali (ODE e PDE)',
    subtitle: 'Sistemi lineari x\' = Ax, esponenziale di matrice e^{At} e classificazione PDE',
    macroGroup: 'Analisi, Equazioni & Calcolo',
    colorHex: '#f472b6',
    keyFormula: '\\dot{x} = Ax \\implies x(t) = e^{At}x(0) = P e^{Dt} P^{-1} x(0)',
    nodes: [
      { name: 'Esponenziale di Matrice per ODE Accoppiate', formula: 'e^{At} = \\sum_{k=0}^\\infty \\frac{A^k t^k}{k!}', details: 'Diagonalizzando A = PDP⁻¹, un sistema aggrovigliato (es. Lotka-Volterra linearizzato o oscillatori) si separa in n equazioni scalari.' },
      { name: 'PDE Ellittiche (Laplace), Paraboliche (Calore), Iperboliche (Onde)', formula: '\\Delta u = 0,\\quad u_t = k\\Delta u,\\quad u_{tt} = c^2\\Delta u', details: 'Classificate tramite la segnatura della matrice dei coefficienti del secondo ordine (analogo alle coniche!).' }
    ]
  },
  {
    id: 17,
    title: 'Cat. 17 — Analisi Complessa e Funzioni Speciali',
    subtitle: 'Cauchy-Riemann, funzioni olomorfe, residui, superfici di Riemann e ζ(s)',
    macroGroup: 'Analisi, Equazioni & Calcolo',
    colorHex: '#60a5fa',
    keyFormula: '\\frac{\\partial u}{\\partial x} = \\frac{\\partial v}{\\partial y},\\; \\frac{\\partial u}{\\partial y} = -\\frac{\\partial v}{\\partial x},\\quad \\oint_\\gamma f(z)\\,dz = 2\\pi i \\sum \\mathrm{Res}',
    nodes: [
      { name: 'Funzioni Olomorfe & Conformalità', formula: 'df = f\'(z)\\,dz \\implies \\text{rotazione + dilatazione locale}', details: 'Ogni funzione olomorfa ha componenti armoniche (Δu = Δv = 0) ed è analitica (sviluppabile in serie di potenze).' },
      { name: 'Superfici di Riemann & Funzione Zeta ζ(s)', formula: '\\zeta(s) = \\sum_{n=1}^\\infty n^{-s} = \\prod_p (1 - p^{-s})^{-1}', details: 'Ponte di Eulero tra analisi complessa continua e distribuzione discreta dei numeri primi.' }
    ]
  },
  {
    id: 18,
    title: 'Cat. 18 — Serie, Trasformate e Analisi Armonica',
    subtitle: 'Taylor, Laurent, Fourier, Laplace, Wavelet e Convoluzione',
    macroGroup: 'Analisi, Equazioni & Calcolo',
    colorHex: '#f59e0b',
    keyFormula: '\\mathcal{F}(f * g) = \\mathcal{F}(f)\\cdot \\mathcal{F}(g)',
    nodes: [
      { name: 'Serie di Taylor & Serie di Potenze Formali K[[x]]', formula: 'f(x) = \\sum_{n=0}^\\infty \\frac{f^{(n)}(x_0)}{n!}(x-x_0)^n', details: 'Rappresenta una funzione come vettore infinito di coordinate rispetto alla base polinomiale.' },
      { name: 'Trasformata di Fourier, Laplace & Wavelet', formula: '\\hat{f}(\\xi) = \\int_{-\\infty}^\\infty f(x)e^{-2\\pi i x\\xi}\\,dx', details: 'Dualità tempo-frequenza e teorema di Plancherel (isometria su L²).' }
    ]
  },
  {
    id: 19,
    title: 'Cat. 19 — Calcolo delle Variazioni e Ottimizzazione',
    subtitle: 'Equazione di Eulero-Lagrange, Principio di Minima Azione, Lagrangiana e Convessità',
    macroGroup: 'Analisi, Equazioni & Calcolo',
    colorHex: '#34d399',
    keyFormula: '\\delta S[q] = 0 \\iff \\frac{\\partial L}{\\partial q} - \\frac{d}{dt}\\left(\\frac{\\partial L}{\\partial \\dot{q}}\\right) = 0',
    nodes: [
      { name: 'Funzionali & Equazione di Eulero-Lagrange', formula: 'S[q] = \\int_{t_1}^{t_2} L(q, \\dot{q}, t)\\,dt', details: 'La "derivata" di un funzionale (funzione di funzione) si annulla lungo la traiettoria fisica reale (geodetica, catenaria, brachistocrona).' },
      { name: 'Ottimizzazione Convessa, Moltiplicatori di Lagrange & KKT', formula: '\\nabla f(x) = \\sum \\lambda_i \\nabla g_i(x)', details: 'Dualità di Legendre-Fenchel (che trasforma la Lagrangiana L(q,q̇) nell’Hamiltoniana H(q,p)).' }
    ]
  },
  {
    id: 20,
    title: 'Cat. 20 — Analisi Numerica e Computazionale',
    subtitle: 'Condizionamento κ(A), decomposizioni LU/QR/Cholesky, Runge-Kutta e FEM',
    macroGroup: 'Analisi, Equazioni & Calcolo',
    colorHex: '#38bdf8',
    keyFormula: '\\kappa(A) = \\|A\\|\\cdot\\|A^{-1}\\| = \\frac{\\sigma_{\\max}}{\\sigma_{\\min}},\\quad \\rho(M) < 1',
    nodes: [
      { name: 'Fattorizzazioni Matriciali (LU, QR, Cholesky, SVD)', formula: 'A = QR,\\quad A = LL^T', details: 'Algoritmo QR per il calcolo stabile degli autovalori e minimi quadrati.' },
      { name: 'Elementi Finiti (FEM) & Formulazione Debole di Galerkin', formula: 'a(u, v) = \\langle f, v \\rangle \\text{ su sottospazio finito } V_h', details: 'Proietta una PDE infinito-dimensionale su un sistema lineare finito K u = f su una mesh di simplessi (triangolazione!).' }
    ]
  },
  {
    id: 21,
    title: 'Cat. 21 — Algebra Commutativa e Geometria Algebrica',
    subtitle: 'Spettro Spec(R), Nullstellensatz di Hilbert, Varietà Affini/Proiettive e Schemi',
    macroGroup: 'Geometria Algebrica, Numeri & Discreta',
    colorHex: '#f472b6',
    keyFormula: '\\text{Varietà Algebriche } V(I) \\;\\longleftrightarrow\\; \\text{Ideali Radicali } \\sqrt{I} = I \\subset K[x_1,\\dots,x_n]',
    nodes: [
      { name: 'Nullstellensatz di Hilbert & Dizionario Algebra-Geometria', formula: 'I(V(J)) = \\sqrt{J},\\quad \\text{Punti} \\leftrightarrow \\text{Ideali Massimali}', details: 'Ogni varietà algebrica corrisponde all’anello delle coordinate K[V] = K[x₁,...,x_n]/I(V).' },
      { name: 'Schemi di Grothendieck Spec(R) & Fasci Coerenti', formula: '(\\mathrm{Spec}(R), \\mathcal{O}_{\\mathrm{Spec}(R)})', details: 'Unifica la geometria algebrica e la teoria algebrica dei numeri (dove Spec(ℤ) è una curva aritmetica i cui punti sono i numeri primi p). ' }
    ]
  },
  {
    id: 22,
    title: 'Cat. 22 — Basi di Gröbner e Invarianti',
    subtitle: 'Algoritmo di Buchberger, eliminazione algebrica e teoria degli invarianti di Hilbert',
    macroGroup: 'Geometria Algebrica, Numeri & Discreta',
    colorHex: '#a78bfa',
    keyFormula: '\\langle \\mathrm{LT}(g_1),\\dots,\\mathrm{LT}(g_m) \\rangle = \\langle \\mathrm{LT}(I) \\rangle',
    nodes: [
      { name: 'Base di Gröbner & Algoritmo di Buchberger', formula: 'S(f,g) \\xrightarrow{G}_+ 0', details: 'Unifica l’eliminazione di Gauss (per sistemi lineari) e l’algoritmo di Euclide (per il MCD di polinomi in 1 variabile) al caso polinomiale multivariato non lineare.' }
    ]
  },
  {
    id: 23,
    title: 'Cat. 23 — Teoria dei Numeri (Elementare, Algebrica, Analitica)',
    subtitle: 'Aritmetica modulare ℤ/nℤ, Teorema Cinese del Resto, Curve Ellittiche e Modulari',
    macroGroup: 'Geometria Algebrica, Numeri & Discreta',
    colorHex: '#f59e0b',
    keyFormula: '\\mathbb{Z}/(mn)\\mathbb{Z} \\cong \\mathbb{Z}/m\\mathbb{Z} \\times \\mathbb{Z}/n\\mathbb{Z} \\;(\\gcd(m,n)=1)',
    nodes: [
      { name: 'Piccolo Teorema di Fermat & Eulero come Caso di Lagrange', formula: 'a^{\\varphi(n)} \\equiv 1 \\pmod n', details: 'È il Teorema di Lagrange applicato al gruppo finito delle unità (ℤ/nℤ)*.' },
      { name: 'Curve Ellittiche E: y² = x³ + ax + b & Modularità (Wiles)', formula: 'L(E, s) = L(f, s)', details: 'I punti razionali E(ℚ) formano un gruppo abeliano finitamente generato (Mordell-Weil); cuore della dimostrazione dell’Ultimo Teorema di Fermat.' }
    ]
  },
  {
    id: 24,
    title: 'Cat. 24 — Combinatorica e Strutture Discrete',
    subtitle: 'Funzioni generatrici, partizioni, matroidi, grafi e complessi simpliciali',
    macroGroup: 'Geometria Algebrica, Numeri & Discreta',
    colorHex: '#34d399',
    keyFormula: 'A(x) = \\sum_{n=0}^\\infty a_n x^n,\\quad \\text{Matroide } (E, \\mathcal{I})',
    nodes: [
      { name: 'Matroidi (Astrazione dell’Indipendenza Lineare)', formula: 'I_1, I_2 \\in \\mathcal{I},\\; |I_1| < |I_2| \\implies \\exists e \\in I_2\\setminus I_1 : I_1\\cup\\{e\\} \\in \\mathcal{I}', details: 'Unifica l’indipendenza lineare dei vettori in una matrice e le foreste acicliche nella teoria dei grafi (ottimalità degli algoritmi Greedy).' },
      { name: 'Teoria Spettrale dei Grafi & Laplaciano L = D - A', formula: 'L = B B^T = D - A', details: 'Il secondo autovalore più piccolo λ₂ (valore di Fiedler) misura la connettività algebrica del grafo.' }
    ]
  },
  {
    id: 25,
    title: 'Cat. 25 — Teoria dei Codici e Crittografia',
    subtitle: 'Codici lineari [n,k,d], Reed-Solomon, RSA, Diffie-Hellman e Reticoli Post-Quantum',
    macroGroup: 'Geometria Algebrica, Numeri & Discreta',
    colorHex: '#38bdf8',
    keyFormula: 'H c^T = 0 \\text{ su } \\mathbb{F}_q,\\quad b_i \\in \\mathcal{L}(\\mathbf{B}) \\text{ (LWE / Lattices)}',
    nodes: [
      { name: 'Codici Correttori Lineari & Matrice di Parità H', formula: 'C = \\ker(H) \\subseteq \\mathbb{F}_q^n', details: 'Un codice lineare è un sottospazio vettoriale su un campo finito; la sindrome dell’errore è l’immagine H eᵀ.' },
      { name: 'Crittografia su Curve Ellittiche (ECC) & Reticoli (LWE)', formula: 'b = A s + e \\pmod q', details: 'Sicurezza basata sul problema del vettore più corto (SVP) in reticoli euclidei ad alta dimensione.' }
    ]
  },
  {
    id: 26,
    title: 'Cat. 26 — Topologia Algebrica (Omotopia, Omologia, Coomologia)',
    subtitle: 'Gruppo fondamentale π₁(X), gruppi di omologia H_k(X) e coomologia di De Rham',
    macroGroup: 'Topologia Algebrica, Categorie & Logica',
    colorHex: '#818cf8',
    keyFormula: 'H_k(X) = \\frac{\\ker \\partial_k}{\\mathrm{Im}\\,\\partial_{k+1}},\\quad H^k_{\\mathrm{dR}}(M) \\cong H_k(M;\\mathbb{R})^*',
    nodes: [
      { name: 'Gruppo Fondamentale π₁(X, x₀) & Spazi di Rivestimento', formula: '\\pi_1(S^1) \\cong \\mathbb{Z},\\quad \\pi_1(SO(3)) \\cong \\mathbb{Z}_2', details: 'Corrispondenza di Galois topologica tra sottogruppi di π₁(X) e rivestimenti connessi di X.' },
      { name: 'Omologia Simpliciale/Singolare & Teorema di De Rham', formula: '\\partial_{k-1}\\circ\\partial_k = 0,\\quad d^k \\circ d^{k-1} = 0', details: 'Misura i "buchi" k-dimensionali tramite il quoziente cicli/bordi; De Rham dimostra che l’omologia combinatoria coincide con la coomologia analitica delle forme differenziali.' }
    ]
  },
  {
    id: 27,
    title: 'Cat. 27 — Teoria dei Nodi, Trecce e 3-Varietà',
    subtitle: 'Gruppo delle trecce B_n, polinomi di Jones/Alexander e nodi celesti',
    macroGroup: 'Topologia Algebrica, Categorie & Logica',
    colorHex: '#f472b6',
    keyFormula: 'K \\hookrightarrow S^3,\\quad t^{-1}V(L_+) - t V(L_-) = (\\sqrt{t}-\\frac{1}{\\sqrt{t}})V(L_0)',
    nodes: [
      { name: 'Invarianti di Nodi (Alexander, Jones, Khovanov)', formula: '\\sigma_i \\sigma_{i+1} \\sigma_i = \\sigma_{i+1} \\sigma_i \\sigma_{i+1} \\in B_n', details: 'Connesso alla teoria quantistica dei campi topologica (Chern-Simons, Witten) e alle orbite periodiche/eterocline nella meccanica celeste (Baresi-Owen).' }
    ]
  },
  {
    id: 28,
    title: 'Cat. 28 — Teoria delle Rappresentazioni e Caratteri',
    subtitle: 'Lemma di Schur, caratteri ortogonali, Peter-Weyl e Langlands',
    macroGroup: 'Topologia Algebrica, Categorie & Logica',
    colorHex: '#f59e0b',
    keyFormula: '\\rho: G \\to GL(V),\\quad \\chi_\\rho(g) = \\mathrm{Tr}(\\rho(g))',
    nodes: [
      { name: 'Rappresentazioni Irriducibili & Lemma di Schur', formula: '\\langle \\chi_i, \\chi_j \\rangle = \\delta_{ij}', details: 'Trasforma problemi astratti di teoria dei gruppi in problemi concreti di algebra lineare (matrici).' },
      { name: 'Teorema di Peter-Weyl & Matrici D di Wigner', formula: 'L^2(G) \\cong \\widehat{\\bigoplus}_{\\pi \\in \\hat{G}} V_\\pi \\otimes V_\\pi^*', details: 'Generalizza la serie di Fourier da S¹ a qualsiasi gruppo di Lie compatto (es. SO(3) → armoniche sferiche e spin quantistico).' }
    ]
  },
  {
    id: 29,
    title: 'Cat. 29 — Algebra Omologica e Categorie Derivate',
    subtitle: 'Successioni esatte, funtori Ext e Tor, complessi di catene e fasci',
    macroGroup: 'Topologia Algebrica, Categorie & Logica',
    colorHex: '#a78bfa',
    keyFormula: '0 \\to A \\xrightarrow{f} B \\xrightarrow{g} C \\to 0 \\text{ esatta } \\iff \\mathrm{Im}(f) = \\ker(g)',
    nodes: [
      { name: 'Successioni Esatte & Lemma del Serpente', formula: '\\dots \\to H_n(A) \\to H_n(B) \\to H_n(C) \\xrightarrow{\\delta} H_{n-1}(A) \\to \\dots', details: 'Misura quanto un funtore fallisce nell’essere esatto tramite i funtori derivati Ext^n e Tor_n.' }
    ]
  },
  {
    id: 30,
    title: 'Cat. 30 — Logica Matematica, Insiemi e Modelli',
    subtitle: 'ZFC, cardinali transfiniti ℵ_α, Gödel, teoria dei modelli e tipi dipendenti',
    macroGroup: 'Topologia Algebrica, Categorie & Logica',
    colorHex: '#60a5fa',
    keyFormula: '|\\mathcal{P}(X)| = 2^{|X|} > |X| \\;(\\text{Cantor}),\\quad \\mathrm{ZFC} \\nvdash \\mathrm{Con}(\\mathrm{ZFC}) \\;(\\text{Gödel})',
    nodes: [
      { name: 'Gerarchia di Cantor, Cardinali ℵ₀, 𝔠 & Ipotesi del Continuo', formula: '|\\mathbb{N}| = \\aleph_0 < |\\mathbb{R}| = 2^{\\aleph_0} = \\mathfrak{c}', details: 'Dimostra l’esistenza dei numeri trascendenti senza costruirne nemmeno uno (|ℚ̄| = ℵ₀ < |ℝ| = 𝔠).' },
      { name: 'Teoremi di Incompletezza di Gödel & Completezza Semantica', formula: '\\Gamma \\vdash \\varphi \\iff \\Gamma \\models \\varphi \\;(\\text{1° ordine})', details: 'Distinzione fondamentale tra verità semantica nei modelli e dimostrabilità sintattica formale.' }
    ]
  },
  {
    id: 31,
    title: 'Cat. 31 — Teoria della Computabilità e Complessità',
    subtitle: 'Macchine di Turing, λ-calcolo, indecidibilità dell’Halting e classi P vs NP',
    macroGroup: 'Computazione, Geometria & Fisica',
    colorHex: '#34d399',
    keyFormula: '\\mathrm{P} \\subseteq \\mathrm{NP} \\subseteq \\mathrm{PSPACE} \\subseteq \\mathrm{EXPTIME}',
    nodes: [
      { name: 'Tesi di Church-Turing & λ-Calcolo Tipato', formula: '(\\lambda x.\\,M)\\,N \\to_\\beta M[x := N]', details: 'Il λ-calcolo tipato è il motore computazionale interno dei proof assistant come Lean 4 e Coq.' }
    ]
  },
  {
    id: 32,
    title: 'Cat. 32 — Geometria Euclidea, Affine e Metrica',
    subtitle: 'Isometrie E(n) = ℝⁿ ⋊ O(n), congruenza, similitudine e geometria del triangolo',
    macroGroup: 'Computazione, Geometria & Fisica',
    colorHex: '#f59e0b',
    keyFormula: 'E(n) = \\mathbb{R}^n \\rtimes O(n),\\quad T(x) = Rx + b',
    nodes: [
      { name: 'Programma di Erlangen di Klein (Geometria = Invarianti di un Gruppo)', formula: '\\text{Euclidea } E(n) \\subset \\text{Similitudini} \\subset \\text{Affine } \\mathrm{Aff}(n) \\subset \\text{Proiettiva } PGL(n+1)', details: 'Ogni geometria è completamente definita dal gruppo di trasformazioni che ne conserva le proprietà.' }
    ]
  },
  {
    id: 33,
    title: 'Cat. 33 — Geometrie Non Euclidee (Iperbolica, Ellittica, Sferica)',
    subtitle: 'V Postulato, semipiano di Poincaré ℍ, disco di Beltrami-Klein e gruppo PSL(2,ℝ)',
    macroGroup: 'Computazione, Geometria & Fisica',
    colorHex: '#38bdf8',
    keyFormula: 'ds^2 = \\frac{dx^2 + dy^2}{y^2} \\text{ su } \\mathbb{H},\\quad \\alpha + \\beta + \\gamma = \\pi + K\\cdot \\mathrm{Area}(T)',
    nodes: [
      { name: 'Geometria Iperbolica (K < 0) & Semipiano di Poincaré ℍ', formula: '\\mathrm{Isom}^+(\\mathbb{H}) \\cong PSL(2,\\mathbb{R}),\\quad z \\mapsto \\frac{az+b}{cz+d}', details: 'Le geodetiche sono semicerchi ortogonali al bordo reale; la somma degli angoli di un triangolo è < π e il difetto angolare è uguale all’area.' },
      { name: 'Geometria Sferica / Ellittica (K > 0) & Teorema di Girard', formula: '\\mathrm{Area}(T) = R^2(\\alpha + \\beta + \\gamma - \\pi)', details: 'Nessuna retta parallela; le geodetiche sono i cerchi massimi.' }
    ]
  },
  {
    id: 34,
    title: 'Cat. 34 — Geometria Differenziale di Curve, Superfici e Varietà',
    subtitle: 'Frenet-Serret, Bézier/De Casteljau, I e II Forma Fondamentale, Connessioni e Curvatura',
    macroGroup: 'Computazione, Geometria & Fisica',
    colorHex: '#f472b6',
    keyFormula: '\\begin{pmatrix} T\' \\\\ N\' \\\\ B\' \\end{pmatrix} = \\begin{pmatrix} 0 & \\kappa & 0 \\\\ -\\kappa & 0 & \\tau \\\\ 0 & -\\tau & 0 \\end{pmatrix}\\begin{pmatrix} T \\\\ N \\\\ B \\end{pmatrix}',
    nodes: [
      { name: 'Triedro di Frenet-Serret & Matrice Antisimmetrica di Darboux', formula: 'A^T = -A \\in \\mathfrak{so}(3)', details: 'Poiché T, N, B restano ortonormali lungo la curva, la loro derivata è governata da un elemento dell’algebra di Lie so(3)!' },
      { name: 'Prima (I) e Seconda (II) Forma Fondamentale & Operatore di Weingarten', formula: 'K = \\det(S) = \\kappa_1 \\kappa_2,\\quad H = \\frac{1}{2}\\mathrm{Tr}(S) = \\frac{\\kappa_1+\\kappa_2}{2}', details: 'La curvatura gaussiana K e media H sono letteralmente il determinante e la semitraccia dell’operatore lineare di forma S = I⁻¹ II.' }
    ]
  },
  {
    id: 35,
    title: 'Cat. 35 — Geometria Convessa, Simplessi e Politopi',
    subtitle: 'Separazione di iperpiani, Minkowski-Weyl, politopo di Birkhoff e f-vettori',
    macroGroup: 'Computazione, Geometria & Fisica',
    colorHex: '#34d399',
    keyFormula: 'P = \\mathrm{conv}(v_1,\\dots,v_m) = \\{x \\in \\mathbb{R}^d : Ax \\le b\\}',
    nodes: [
      { name: 'Dualità V-Politopo ↔ H-Politopo & Politopo Polare P°', formula: 'P^\\circ = \\{y \\in (\\mathbb{R}^d)^* : \\langle y, x \\rangle \\le 1,\\; \\forall x \\in P\\}', details: 'Il cubo e l’ottaedro sono duali polari; il dodecaedro e l’icosaedro sono duali; il simplesso è autoduale.' }
    ]
  },
  {
    id: 36,
    title: 'Cat. 36 — Geometria Proiettiva e Coniche / Quadriche',
    subtitle: 'Spazio proiettivo KP^n, coordinate omogenee, birapporto, dualità punto-retta e Bézout',
    macroGroup: 'Computazione, Geometria & Fisica',
    colorHex: '#818cf8',
    keyFormula: '\\mathbb{P}^n(K) = (K^{n+1}\\setminus\\{0\\})/K^*,\\quad (A,B;C,D) \\text{ invariante}',
    nodes: [
      { name: 'Unificazione Proiettiva delle Coniche (Ellisse, Parabola, Iperbole)', formula: 'X^T Q X = 0 \\text{ in } \\mathbb{P}^2(\\mathbb{R})', details: 'In ℝP² tutte le coniche non degeneri sono proiettivamente equivalenti: si distinguono nel piano affine solo per il numero di intersezioni (0, 1 tangente, 2 secanti) con la retta impropria Z = 0!' }
    ]
  },
  {
    id: 37,
    title: 'Cat. 37 — Teoria delle Categorie, Funtori, Monadi e Topos',
    subtitle: 'Limiti/Colimiti, Lemma di Yoneda, Funtori Aggiunti, Categorie Monoidali e ∞-Categorie',
    macroGroup: 'Unificazione Categoriale & Applicazioni',
    colorHex: '#f59e0b',
    keyFormula: '\\mathrm{Nat}(\\mathrm{Hom}_{\\mathcal{C}}(-, A), F) \\cong F(A) \\;(\\text{Lemma di Yoneda})',
    nodes: [
      { name: 'Lemma di Yoneda & Proprietà Universali', formula: 'A \\cong B \\iff \\mathrm{Hom}(-,A) \\cong \\mathrm{Hom}(-,B)', details: 'Un oggetto matematico è completamente determinato dalla rete di morfismi che intrattiene con tutti gli altri oggetti della categoria.' }
    ]
  },
  {
    id: 38,
    title: 'Cat. 38 — Dualità Fondamentali e Ponti Unificatori',
    subtitle: 'Pontryagin, Gelfand-Naimark, Stone, Hodge, Poincaré e Langlands',
    macroGroup: 'Unificazione Categoriale & Applicazioni',
    colorHex: '#f472b6',
    keyFormula: 'C(X)^{\\text{op}} \\simeq \\text{Top}_{\\text{comp}} \\;(\\text{Gelfand}),\\quad \\hat{\\hat{G}} \\cong G \\;(\\text{Pontryagin})',
    nodes: [
      { name: 'Dualità di Gelfand & Geometria Non Commutativa (Connes)', formula: 'X \\text{ compatto Hausdorff} \\longleftrightarrow C(X) \\text{ C*-algebra commutativa}', details: 'Permette di studiare spazi geometrici "quantistici" sostituendo C(X) con una C*-algebra non commutativa di operatori.' },
      { name: 'Operatore Stella di Hodge * : Λ^k(V*) → Λ^{n-k}(V*)', formula: '\\alpha \\wedge *\\beta = \\langle \\alpha, \\beta \\rangle\\,\\mathrm{vol}', details: 'Spiega perché il prodotto vettoriale u×v esiste solo in ℝ³: è il duale di Hodge *(u∧v) di un 2-vettore in dimensione 3 (3 - 2 = 1)!' }
    ]
  },
  {
    id: 39,
    title: 'Cat. 39 — Gruppi di Coxeter, Weyl, Edifici e Cristallografia',
    subtitle: 'Riflessioni generate, diagrammi di Dynkin ADE, politopi regolari e reticoli di Bravais',
    macroGroup: 'Unificazione Categoriale & Applicazioni',
    colorHex: '#34d399',
    keyFormula: '\\langle r_i \\mid (r_i r_j)^{m_{ij}} = 1 \\rangle,\\quad \\text{Classificazione } A_n, B_n, C_n, D_n, E_6, E_7, E_8, F_4, G_2',
    nodes: [
      { name: 'Gruppi di Coxeter & Diagrammi di Dynkin ADE', formula: 'A_n, D_n, E_6, E_7, E_8', details: 'La stessa classificazione ADE governa i solidi platonici, le algebre di Lie semplici, le singolarità di Arnold e le teorie di stringa.' }
    ]
  },
  {
    id: 40,
    title: 'Cat. 40 — Matematica della Fisica, Meccanica Celeste e Intelligenza Artificiale',
    subtitle: 'Fibrati di Gauge, Relatività Generale, Meccanica Quantistica, Autostrade Spaziali e Deep Learning',
    macroGroup: 'Unificazione Categoriale & Applicazioni',
    colorHex: '#38bdf8',
    keyFormula: '[X, P] = i\\hbar I,\\quad G_{\\mu\\nu} = \\frac{8\\pi G}{c^4}T_{\\mu\\nu},\\quad H_{\\text{mHC}} = \\mathrm{Sinkhorn}(W)',
    nodes: [
      { name: 'Principio di Indeterminazione dalla Non-Commutatività [D, X] = I', formula: '(DX - XD)f(x) = \\frac{d}{dx}(xf(x)) - x f\'(x) = f(x) \\implies [D,X] = I', details: 'Il principio di Heisenberg Δx·Δp ≥ ħ/2 non è un limite degli strumenti di misura, ma un teorema algebrico sugli operatori non commutanti in uno spazio di Hilbert.' },
      { name: 'Embeddings LLM, Attenzione QKᵀ/√d & Varietà mHC (Birkhoff)', formula: '\\mathrm{Attention}(Q,K,V) = \\mathrm{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V', details: 'Il prodotto scalare QKᵀ misura l’allineamento semantico negli spazi latenti ad alta dimensione; mHC vincola le hyper-connections sul politopo di Birkhoff.' }
    ]
  }
];

export const SEVEN_CROSS_CATEGORY_DISCOVERIES: CrossCategoryDiscovery[] = [
  {
    id: 'cc1',
    fromCategory: 'Cat. 9/37 (Automorfismo di una Struttura A)',
    toCategory: 'Cat. 2 (Gruppo Aut(A))',
    relationLabel: 'genera sempre un Gruppo',
    mathematicalProofOrMeaning:
      'L’insieme Aut(A) degli automorfismi (isomorfismi A → A) di qualsiasi struttura matematica (insieme, grafo, spazio vettoriale, campo, varietà) forma SEMPRE un Gruppo rispetto alla composizione (associativa, con identità id_A e inversi).'
  },
  {
    id: 'cc2',
    fromCategory: 'Cat. 22/28 (Teoria degli Invarianti di Hilbert)',
    toCategory: 'Cat. 4 (Anello Noetheriano)',
    relationLabel: 'ha originato storicamente',
    mathematicalProofOrMeaning:
      'Per dimostrare che l’anello degli invarianti polinomiali K[x₁,...,x_n]^G sotto l’azione di un gruppo G è finitamente generato (1890), David Hilbert dimostrò il Teorema della Base, fondando la nozione di Anello Noetheriano (ACC sugli ideali).'
  },
  {
    id: 'cc3',
    fromCategory: 'Cat. 22 (Basi di Gröbner)',
    toCategory: 'Cat. 4 (Anello Noetheriano K[x₁,...,x_n])',
    relationLabel: 'terminazione garantita da',
    mathematicalProofOrMeaning:
      'L’algoritmo di Buchberger per il calcolo delle Basi di Gröbner termina sempre in un numero finito di passi esattamente perché l’anello dei polinomi K[x₁,...,x_n] è Noetheriano (la catena ascendente degli ideali monomiali iniziali deve stabilizzarsi).'
  },
  {
    id: 'cc4',
    fromCategory: 'Cat. 23 (Aritmetica Modulare ℤ/nℤ)',
    toCategory: 'Cat. 4/23 (Teorema Cinese del Resto CRT)',
    relationLabel: 'decomposizione strutturale',
    mathematicalProofOrMeaning:
      'Per ideali coprimi I + J = R (in particolare m, n coprimi in ℤ), l’anello quoziente si fattorizza in un prodotto diretto: R/(I∩J) ≅ R/I × R/J, ovvero ℤ/(mn)ℤ ≅ ℤ/mℤ × ℤ/nℤ.'
  },
  {
    id: 'cc5',
    fromCategory: 'Cat. 23 (Piccolo Teorema di Fermat & Eulero)',
    toCategory: 'Cat. 3 (Teorema di Lagrange sui Gruppi Finiti)',
    relationLabel: 'è un caso particolare di',
    mathematicalProofOrMeaning:
      'Poiché il gruppo moltiplicativo delle unità (ℤ/nℤ)* ha ordine φ(n) (e p-1 se n=p è primo), il Teorema di Lagrange (l’ordine di ogni elemento divide |G|) implica immediatamente a^{φ(n)} ≡ 1 (mod n) e a^{p-1} ≡ 1 (mod p) in una sola riga!'
  },
  {
    id: 'cc6',
    fromCategory: 'Cat. 30 (Cardinalità Transfinita di Cantor)',
    toCategory: 'Cat. 1 (Numeri Trascendenti ℝ \\ ℚ̄)',
    relationLabel: 'dimostra l’esistenza non costruttiva',
    mathematicalProofOrMeaning:
      'I numeri algebrici ℚ̄ sono unione numerabile di insiemi finiti di radici (|ℚ̄| = ℵ₀), mentre |ℝ| = 2^{ℵ₀} = 𝔠 > ℵ₀ per l’argomento diagonale di Cantor: dunque quasi tutti i numeri reali sono trascendenti!'
  },
  {
    id: 'cc7',
    fromCategory: 'Cat. 39 (Gruppi di Riflessione di Coxeter)',
    toCategory: 'Cat. 32/39 (Gruppi Cristallografici & Reticoli)',
    relationLabel: 'classifica le simmetrie discrete',
    mathematicalProofOrMeaning:
      'I gruppi di Coxeter affini e la restrizione cristallografica (2cos(2π/n) ∈ ℤ ⟹ n ∈ {1,2,3,4,6}) classificano tutti i gruppi di Weyl, i politopi regolari n-dimensionali e i 230 gruppi spaziali cristallografici.'
  }
];
