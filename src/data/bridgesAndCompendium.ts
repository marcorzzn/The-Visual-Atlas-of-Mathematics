export interface StructuralBridge {
  id: string;
  title: string;
  subjectsConnected: string;
  coreFormula: string;
  algebraicSide: string;
  analyticGeometricSide: string;
  synthesisAndApplication: string;
}

export interface RosettaRow {
  concept: string;
  linearAlgebraFinite: string;
  functionalAnalysisInfinite: string;
  physicalGeometricMeaning: string;
}

export interface MatrixStructureEntry {
  structureName: string;
  notation: string;
  condition: string;
  operations: string;
  algebraicClassification: string;
  keyPropertiesAndRole: string;
}

export interface RotationRepresentation {
  id: string;
  name: string;
  dimensionScope: string;
  parametersCount: string;
  coreFormula: string;
  groupOrAlgebra: string;
  strengths: string;
  limitations: string;
  applicationDomains: string;
}

export interface LinearTrickEntry {
  id: string;
  title: string;
  category: 'Allineamento & Geometria' | 'Sistemi Lineari & Rango' | 'Trucchi Spettrali & Avanzati';
  formula: string;
  explanation: string;
  computationalShortcut: string;
}

export interface BookChapterSpec {
  partNumber: string;
  partTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  coreTheoremsAndProofs: string[];
  keyFormulas: string;
}

export interface BibliographyItem {
  title: string;
  author: string;
  category: 'Ponti & Visione Unificata' | 'Analisi & Operatori' | 'Algebra, Geometria & Meccanica' | 'IA, Deep Learning & MOOC';
  whyEssential: string;
}

export const NINE_STRUCTURAL_BRIDGES: StructuralBridge[] = [
  {
    id: 'b1',
    title: '1. Numeri Duali ℝ[x]/(x²) ↔ Derivata Analitica & Automatic Differentiation',
    subjectsConnected: 'Algebra 1 (Anelli Quoziente) ↔ Analisi 1 (Polinomio di Taylor) ↔ Informatica (Deep Learning)',
    coreFormula: '\\mathbb{R}[\\varepsilon]/(\\varepsilon^2),\\quad \\varepsilon^2 = 0 \\implies P(x+\\varepsilon) = P(x) + P\'(x)\\varepsilon',
    algebraicSide:
      'Quozientando l’anello dei polinomi ℝ[x] per l’ideale principale (x²) generato da x², la classe ε = [x] diventa un elemento nilpotente non nullo (ε² = 0).',
    analyticGeometricSide:
      'Sviluppando P(x+ε) con la formula di Taylor, tutti i termini di ordine k ≥ 2 contengono ε² = 0 e svaniscono in modo algebricamente esatto, senza alcun passaggio al limite ε → 0.',
    synthesisAndApplication:
      'Rivela che la derivata è un omomorfismo algebrico (regola di Leibniz). In Geometria Algebrica Spec(ℝ[ε]/(ε²)) è un punto dotato di un vettore tangente infinitesimo; in IA è il motore esatto della Forward-Mode Automatic Differentiation.'
  },
  {
    id: 'b2',
    title: '2. Teorema di Stokes Generalizzato ↔ Operatori Aggiunti in Dualità',
    subjectsConnected: 'Analisi 2 (Integrali Multipli/Campi) ↔ Algebra Lineare (Spazio Duale) ↔ Topologia Algebrica',
    coreFormula: '\\int_{\\partial \\Omega} \\omega = \\int_\\Omega d\\omega \\iff \\langle \\partial \\Omega,\\; \\omega \\rangle = \\langle \\Omega,\\; d\\omega \\rangle',
    algebraicSide:
      'Dato un accoppiamento bilineare non degenere ⟨·,·⟩: V × W → ℝ, l’aggiunto A* di un operatore lineare è definito da ⟨Av, w⟩ = ⟨v, A*w⟩.',
    analyticGeometricSide:
      'L’integrale ∫_Ω ω è un accoppiamento bilineare tra il dominio geometrico Ω (catena simpliciale) e la forma differenziale ω (cocatena).',
    synthesisAndApplication:
      'Unifica Torricelli-Barrow, Green, Gauss (Divergenza) e Kelvin-Stokes in un’unica identità di dualità: la derivata esterna analitica d è letteralmente l’operatore aggiunto (trasposto) dell’operatore di bordo geometrico ∂! Inoltre ∂² = 0 equivale per dualità a d² = 0.'
  },
  {
    id: 'b3',
    title: '3. Parentesi di Poisson ↔ Algebre di Lie & Meccanica Quantistica',
    subjectsConnected: 'Fisica 1 / Meccanica Analitica ↔ Analisi 2 ↔ Algebra Superiore (Gruppi e Algebre di Lie)',
    coreFormula: '\\{f, g\\} = \\sum_{i=1}^n \\left(\\frac{\\partial f}{\\partial q_i}\\frac{\\partial g}{\\partial p_i} - \\frac{\\partial f}{\\partial p_i}\\frac{\\partial g}{\\partial q_i}\\right),\\quad \\dot{f} = \\{f, H\\}',
    algebraicSide:
      'Un’Algebra di Lie è uno spazio vettoriale dotato di una parentesi bilineare antisimmetrica [X,Y] = -[Y,X] che soddisfa l’Identità di Jacobi.',
    analyticGeometricSide:
      'Sullo spazio delle fasi C^∞(ℝ^{2n}), le parentesi di Poisson soddisfano bilinearità, antisimmetria e identità di Jacobi: una costante del moto soddisfa {f, H} = 0.',
    synthesisAndApplication:
      'Spiega il Teorema di Noether (simmetria ⟺ [H,S]=0 ⟺ conservazione) e la quantizzazione di Dirac: sostituendo le funzioni classiche con operatori su uno spazio di Hilbert e {f,g} con (1/iħ)[F̂,Ĝ] nasce la Meccanica Quantistica.'
  },
  {
    id: 'b4',
    title: '4. Matrice Hessiana & Ottimizzazione ↔ Teorema Spettrale & Forme Quadratiche',
    subjectsConnected: 'Analisi 2 (Massimi e Minimi Liberi) ↔ Geometria 1 (Diagonalizzazione Ortogonale & Segnatura)',
    coreFormula: 'f(x_0+h) \\approx f(x_0) + \\frac{1}{2} h^T H_f(x_0) h = f(x_0) + \\frac{1}{2}\\sum_{i=1}^n \\lambda_i y_i^2',
    algebraicSide:
      'Per il Teorema Spettrale, poiché H_f è simmetrica (Teorema di Schwarz sulle derivate miste), esiste una base ortonormale di autovettori in cui la forma quadratica diventa diagonale ∑ λ_i y_i².',
    analyticGeometricSide:
      'In un punto critico ∇f(x₀)=0, la geometria locale del grafico è un paraboloide ellittico (λ_i > 0, minimo; λ_i < 0, massimo) o iperbolico a sella (λ_i di segno discorde).',
    synthesisAndApplication:
      'Non sono regole mnemoniche sui determinanti: studiare la convessità locale di una funzione di costo L(θ) in Analisi o Deep Learning significa classificare una quadrica tramite la segnatura di Sylvester.'
  },
  {
    id: 'b5',
    title: '5. Esponenziale di Matrice e^{At} ↔ Equazioni Differenziali Accoppiate',
    subjectsConnected: 'Analisi 1/2 (Sistemi di EDO) ↔ Geometria 1 (Cambio di Base e Forma di Jordan)',
    coreFormula: '\\dot{\\mathbf{x}} = A\\mathbf{x} \\implies \\mathbf{x}(t) = e^{At}\\mathbf{x}(0) = P e^{Dt} P^{-1}\\mathbf{x}(0)',
    algebraicSide:
      'La serie di potenze ∑ (At)^k / k! converge assolutamente nello spazio normato M_n(ℂ). Se A = PDP⁻¹, allora e^{At} = P diag(e^{λ₁t},...,e^{λ_nt}) P⁻¹.',
    analyticGeometricSide:
      'Il cambio di coordinate y = P⁻¹x disaccoppia un sistema differenziale aggrovigliato in n equazioni scalari indipendenti ẏ_i = λ_i y_i.',
    synthesisAndApplication:
      'Mostra l’origine geometrica dei blocchi di Jordan: quando A non è diagonalizzabile, la parte nilpotente N (con N^k = 0) tronca la serie di e^{Nt} generando i termini polinomiali di risonanza t·e^{λt}, t²·e^{λt}.'
  },
  {
    id: 'b6',
    title: '6. Raggio Spettrale ρ(M) < 1 ↔ Contrazioni di Banach & Stabilità Numerica',
    subjectsConnected: 'Calcolo Numerico (Jacobi / Gauss-Seidel) ↔ Analisi Funzionale (Punto Fisso di Banach)',
    coreFormula: 'x^{(k+1)} = M x^{(k)} + c \\text{ converge } \\forall x^{(0)} \\iff \\rho(M) = \\max_i |\\lambda_i(M)| < 1',
    algebraicSide:
      'L’errore al passo k è e^{(k)} = M^k e^{(0)}; affinché M^k → 0 per k → ∞ tutti gli autovalori devono cadere dentro il disco unitario complesso |λ_i| < 1.',
    analyticGeometricSide:
      'Per il Lemma di Householder, ρ(M) = inf_{||·||} ||M||: dunque ρ(M) < 1 equivale all’esistenza di una norma indotta rispetto alla quale l’operatore affine T(x) = Mx+c è una contrazione di Banach.',
    synthesisAndApplication:
      'Unifica la convergenza dei metodi iterativi numerici, le catene di Markov ergodiche (Perron-Frobenius) e la stabilità del trasporto nei layer profondi (mHC di DeepSeek).'
  },
  {
    id: 'b7',
    title: '7. Il Determinante non è una Formula: è il Funtore Volume Λⁿ(T)',
    subjectsConnected: 'Geometria 1 (Determinante di Leibniz/Laplace) ↔ Algebra Multilineare (Potenza Esterna) ↔ Analisi 2 (Cambio di Variabile)',
    coreFormula: '\\Lambda^n(T)(e_1 \\wedge \\dots \\wedge e_n) = (\\det T)\\,(e_1 \\wedge \\dots \\wedge e_n)',
    algebraicSide:
      'Sullo spazio della potenza esterna massima Λⁿ(ℝⁿ), che ha dimensione (n su n) = 1, ogni operatore lineare T induce la moltiplicazione per un unico scalare: questo scalare è la definizione intrinseca di det(T).',
    analyticGeometricSide:
      'La funtorialità Λⁿ(A∘B) = Λⁿ(A)∘Λⁿ(B) rende ovvio in una riga il Teorema di Binet det(AB) = det(A)det(B).',
    synthesisAndApplication:
      'Spiega perché negli integrali multipli ∫∫ f(x,y) dx dy = ∫∫ f(Φ(u,v)) |det J_Φ| du dv compare il modulo del determinante Jacobiano: dx∧dy = (det J_Φ) du∧dv è il fattore di dilatazione locale dell’elemento di volume orientato.'
  },
  {
    id: 'b8',
    title: '8. Spazio Duale V* & Matrice Trasposta Aᵀ come Pullback Controvariante',
    subjectsConnected: 'Geometria 1 (Trasposizione) ↔ Analisi Funzionale (Distribuzioni) ↔ Meccanica Quantistica (Bra-Ket)',
    coreFormula: 'T^*: W^* \\to V^*,\\quad T^*(\\varphi) = \\varphi \\circ T \\;(\\text{Pullback delle forme lineari})',
    algebraicSide:
      'La trasposta di una matrice non è un artificio tipografico di scambio righe/colonne: è la matrice associata all’applicazione duale T* che tira indietro ("pullback") i funzionali lineari di W* su V*.',
    analyticGeometricSide:
      'Nella notazione di Dirac, i Ket |v⟩ ∈ V sono vettori colonna e i Bra ⟨φ| ∈ V* sono covettori riga; in Analisi la delta di Dirac δ₀ è un funzionale lineare nello spazio duale.',
    synthesisAndApplication:
      'Fondamento della distinzione tra componenti controvarianti v^i e covarianti ω_i nel calcolo tensoriale e in Relatività Generale.'
  },
  {
    id: 'b9',
    title: '9. Teorema di Rouché-Capelli ↔ Primo Teorema di Isomorfismo',
    subjectsConnected: 'Geometria 1 (Sistemi Lineari) ↔ Algebra 1 (Teoria dei Gruppi e Anelli di Noether)',
    coreFormula: 'V / \\ker(f) \\cong \\mathrm{Im}(f) \\implies \\dim V - \\dim(\\ker A) = \\dim(\\mathrm{Im}\\,A) = \\mathrm{rk}(A)',
    algebraicSide:
      'Per ogni omomorfismo di gruppi, anelli o moduli f: A → B, quozientare il dominio per il nucleo ker(f) rende la mappa iniettiva e isomorfa all’immagine Im(f).',
    analyticGeometricSide:
      'Per un sistema lineare Ax = b, tutte le soluzioni che differiscono per un elemento di ker(A) collassano in un unico punto dello spazio quoziente ℝⁿ/ker(A).',
    synthesisAndApplication:
      'Mostra che il Teorema della Dimensione (Nullità + Rango) è la versione additiva (logaritmica sulle dimensioni) del Teorema di Lagrange |G|/|ker φ| = |Im φ|.'
  }
];

export const ROSETTA_STONE_TABLE: RosettaRow[] = [
  {
    concept: 'Spazio di lavoro',
    linearAlgebraFinite: 'Spazio Vettoriale ℝⁿ (vettori a n componenti)',
    functionalAnalysisInfinite: 'Spazio di Hilbert L² / C^∞ (spazio infinito-dimensionale di funzioni)',
    physicalGeometricMeaning: 'Insieme di tutti gli stati possibili di un sistema o di un campo'
  },
  {
    concept: 'Oggetto base',
    linearAlgebraFinite: 'Vettore colonna v = (v₁, ..., v_n)ᵀ',
    functionalAnalysisInfinite: 'Funzione f(x) (un valore per ogni punto continuo x ∈ ℝ)',
    physicalGeometricMeaning: 'Segnale acustico, profilo di temperatura, funzione d’onda ψ(x)'
  },
  {
    concept: 'Azione / Trasformazione',
    linearAlgebraFinite: 'Matrice quadrata A ∈ M_n(ℝ)',
    functionalAnalysisInfinite: 'Operatore differenziale o integrale (D = d/dx, ∇², ∫ K(x,y)·)',
    physicalGeometricMeaning: 'Legge fisica, evoluzione dinamica o osservabile quantistica'
  },
  {
    concept: 'Prodotto Scalare',
    linearAlgebraFinite: 'Somma discreta ⟨u, v⟩ = ∑ u_i v_i',
    functionalAnalysisInfinite: 'Integrale continuo ⟨f, g⟩ = ∫ f(x) g(x) dx',
    physicalGeometricMeaning: 'Sovrapposizione, correlazione energetica o proiezione ortogonale'
  },
  {
    concept: 'Direzioni Invarianti',
    linearAlgebraFinite: 'Autovettori A v = λ v',
    functionalAnalysisInfinite: 'Autofunzioni D(f) = λ f (es. e^{λx}, e^{ikx}, armoniche sferiche Y_ℓ^m)',
    physicalGeometricMeaning: 'Modi normali di vibrazione, frequenze pure, orbitali atomici (s, p, d, f)'
  },
  {
    concept: 'Cambio di Base Ottimale',
    linearAlgebraFinite: 'Diagonalizzazione A = P D P⁻¹',
    functionalAnalysisInfinite: 'Serie e Trasformata di Fourier / Laplace',
    physicalGeometricMeaning: 'Scomposizione di un’onda complessa nello spettro di armoniche pure'
  },
  {
    concept: 'Operatore Trasposto / Aggiunto',
    linearAlgebraFinite: 'Matrice trasposta Aᵀ (⟨Au,v⟩ = ⟨u,Aᵀv⟩)',
    functionalAnalysisInfinite: 'Integrazione per parti: Dᵀ = -D (operatore antisimmetrico)',
    physicalGeometricMeaning: 'Simmetria di azione-reazione e conservazione al bordo'
  },
  {
    concept: 'Inversione di un Sistema',
    linearAlgebraFinite: 'Matrice inversa x = A⁻¹ b',
    functionalAnalysisInfinite: 'Funzione di Green G(x,s): u(x) = ∫ G(x,s) f(s) ds (L⁻¹)',
    physicalGeometricMeaning: 'Risposta impulsiva del sistema a una sorgente puntiforme δ(x-s)'
  },
  {
    concept: 'Approssimazione Locale',
    linearAlgebraFinite: 'Mappa lineare tangente J_f(x₀) h',
    functionalAnalysisInfinite: 'Serie di Taylor (coordinate rispetto alla base {1, x, x²/2!, ...})',
    physicalGeometricMeaning: 'Linearizzazione attorno a un punto di equilibrio'
  },
  {
    concept: 'Non-Commutatività',
    linearAlgebraFinite: 'Commutatore di matrici [A, B] = AB - BA ≠ 0',
    functionalAnalysisInfinite: '[d/dx, x] = I (derivare e moltiplicare per x non commutano)',
    physicalGeometricMeaning: 'Principio di Indeterminazione di Heisenberg Δx · Δp ≥ ħ/2'
  }
];

export const MATRIX_STRUCTURES_COMPENDIUM: MatrixStructureEntry[] = [
  {
    structureName: 'Matrici Rettangolari su un Campo',
    notation: 'M_{m,n}(\\mathbb{K}),\\; m \\neq n',
    condition: 'Dimensioni arbitrarie m righe × n colonne',
    operations: '(+, \\cdot_\\mathbb{K})',
    algebraicClassification: 'Spazio Vettoriale di dimensione m·n (Gruppo abeliano sotto +)',
    keyPropertiesAndRole:
      'Rappresentano Trasformazioni Lineari tra spazi diversi V → W. Con il prodotto riga-colonna NON formano alcuna struttura interna perché A·B non è definito tra due matrici m×n!'
  },
  {
    structureName: 'Matrici Quadrate su un Campo',
    notation: 'M_n(\\mathbb{K})',
    condition: 'Stesso numero di righe e colonne (m = n)',
    operations: '(+, \\times, \\cdot_\\mathbb{K})',
    algebraicClassification: 'Anello Unitario Non Commutativo (per n≥2) & Algebra Associativa Unitaria',
    keyPropertiesAndRole:
      'Rappresentano Endomorfismi V → V. Non sono un campo né un dominio di integrità perché contengono divisori dello zero (AB = 0 con A,B ≠ 0) e matrici singolari (det A = 0).'
  },
  {
    structureName: 'Matrici su un Anello Commutativo',
    notation: 'M_n(R) \\;(\\text{es. } M_n(\\mathbb{Z}), M_n(\\mathbb{K}[x]))',
    condition: 'Coefficienti in un anello R anziché un campo',
    operations: '(+, \\times, \\cdot_R)',
    algebraicClassification: 'R-Modulo Libero di rango n² & R-Algebra Associativa',
    keyPropertiesAndRole:
      'Una matrice A ∈ M_n(R) è invertibile in M_n(R) se e solo se det(A) ∈ R* è un’unità dell’anello R (es. in M_n(ℤ) solo se det(A) = ±1, gruppo GL(n,ℤ)).'
  },
  {
    structureName: 'Gruppo Generale Lineare',
    notation: 'GL(n, \\mathbb{K}) = M_n(\\mathbb{K})^\\times',
    condition: '\\det(A) \\neq 0',
    operations: '(\\times)',
    algebraicClassification: 'Gruppo di Lie di dimensione n² (non abeliano per n≥2)',
    keyPropertiesAndRole:
      'È il gruppo delle unità dell’anello M_n(K). Geometria: automorfismi dello spazio vettoriale.'
  },
  {
    structureName: 'Gruppo Speciale Lineare & Algebra sl(n)',
    notation: 'SL(n, \\mathbb{K}) \\longleftarrow \\mathfrak{sl}(n, \\mathbb{K})',
    condition: '\\det(A) = 1 \\longleftrightarrow \\mathrm{Tr}(X) = 0',
    operations: '(\\times) \\text{ e } [X,Y]=XY-YX',
    algebraicClassification: 'Gruppo di Lie semplice di dim n²-1 & Algebra di Lie a traccia nulla',
    keyPropertiesAndRole:
      'Legati dall’identità di Jacobi det(e^X) = e^{Tr(X)}: la conservazione del volume (det=1) nel gruppo equivale a traccia zero (divergenza nulla) nell’algebra tangente!'
  },
  {
    structureName: 'Gruppo Ortogonale / Unitario & Algebre so(n), u(n)',
    notation: 'O(n), SO(n), U(n), SU(n)',
    condition: 'R^T R = I \\longleftrightarrow X^T = -X',
    operations: '(\\times) \\text{ e } [X,Y]=XY-YX',
    algebraicClassification: 'Gruppi di Lie Compatti & Algebre di Lie di matrici antisimmetriche / anti-hermitiane',
    keyPropertiesAndRole:
      'Conservano il prodotto scalare euclideo o hermitiano (isometrie, rotazioni 3D, evoluzione quantistica unitaria e simmetrie di gauge del Modello Standard).'
  },
  {
    structureName: 'Algebra di Lie Generale Lineare',
    notation: '\\mathfrak{gl}(n, \\mathbb{K})',
    condition: 'Spazio M_n(K) dotato del commutatore',
    operations: '(+, \\cdot_\\mathbb{K}, [A,B] = AB - BA)',
    algebraicClassification: 'Algebra Non Associativa di Lie (soddisfa Antisimmetria e Identità di Jacobi)',
    keyPropertiesAndRole:
      'Per il Teorema di Ado ogni algebra di Lie finito-dimensionale è isomorfa a una sottoalgebra di matrici in gl(n,K).'
  },
  {
    structureName: 'Algebra di Jordan Speciale',
    notation: '\\mathcal{H}_n(\\mathbb{R}) \\text{ o } \\mathcal{H}_n(\\mathbb{C})',
    condition: 'Matrici simmetriche o hermitiane A = A*',
    operations: '(+, \\cdot_\\mathbb{R}, A \\circ B = \\frac{1}{2}(AB + BA))',
    algebraicClassification: 'Algebra Commutativa Non Associativa di Jordan (soddisfa (A∘B)∘A² = A∘(B∘A²))',
    keyPropertiesAndRole:
      'Il prodotto ordinario AB di due matrici simmetriche non è simmetrico, ma il loro anticommutatore simmetrico A∘B lo è! Modella l’algebra delle osservabili in Meccanica Quantistica.'
  }
];

export const ROTATION_REPRESENTATIONS: RotationRepresentation[] = [
  {
    id: 'rot_2d_complex',
    name: '1. Numeri Complessi Unitari U(1) vs Matrici SO(2)',
    dimensionScope: '2D (Piano ℝ² ≅ ℂ)',
    parametersCount: '1 angolo θ (2 reali con |z|=1)',
    coreFormula: 'z\' = e^{i\\theta}z = (\\cos\\theta + i\\sin\\theta)(x+iy) \\iff \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}\\begin{pmatrix} x \\\\ y \\end{pmatrix}',
    groupOrAlgebra: 'U(1) ≅ SO(2) ≅ S¹ (Gruppo di Lie abeliano)',
    strengths: 'Isomorfismo perfetto: moltiplicare per i equivale a ruotare di +90°; composizione abeliana sommandosi gli angoli.',
    limitations: 'Confinato al piano 2D (non esiste un campo commutativo 3D per il Teorema di Frobenius).',
    applicationDomains: 'Analisi armonica, fasori in elettrotecnica, grafica 2D.'
  },
  {
    id: 'rot_euler',
    name: '2. Angoli di Eulero / Tait-Bryan (Roll, Pitch, Yaw)',
    dimensionScope: '3D (Spazio ℝ³)',
    parametersCount: '3 angoli (α, β, γ)',
    coreFormula: 'R = R_z(\\psi)\\,R_y(\\theta)\\,R_x(\\phi)',
    groupOrAlgebra: 'Fattorizzazione locale di SO(3)',
    strengths: 'Intuitivo per l’interfaccia umana (imbardata, beccheggio, rollio) e non richiede vincoli di normalizzazione.',
    limitations: 'Soffre del Gimbal Lock (blocco cardanico a θ = ±90°: perdita di un grado di libertà perché due assi collassano) e non permette interpolazione uniforme.',
    applicationDomains: 'Strumentazione aeronautica, controlli camera in UI.'
  },
  {
    id: 'rot_rodrigues',
    name: '3. Asse-Angolo (Teorema di Eulero) & Formula di Rodrigues',
    dimensionScope: '3D (Spazio ℝ³)',
    parametersCount: 'Versore û ∈ S² + angolo θ (3 liberi)',
    coreFormula: 'v_{\\mathrm{rot}} = v\\cos\\theta + (\\hat{u}\\times v)\\sin\\theta + \\hat{u}(\\hat{u}\\cdot v)(1-\\cos\\theta)',
    groupOrAlgebra: 'Mappa esponenziale exp(θ [û]_×) : so(3) → SO(3)',
    strengths: 'Significato geometrico trasparente: decompone v nella componente parallela a û (invariante) e ortogonale (ruotata nel piano).',
    limitations: 'Singolarità di parametrizzazione a θ = 0 (asse indefinito) e non banalmente componibile senza passare ai quaternioni o matrici.',
    applicationDomains: 'Robotica (cinematica diretta/inversa), visione artificiale (OpenCV Rodrigues).'
  },
  {
    id: 'rot_quaternions',
    name: '4. Quaternioni Unitari (Versori di Hamilton) & SLERP',
    dimensionScope: '3D (ℝ³ immerso in Im(ℍ))',
    parametersCount: '4 componenti (w, x, y, z) con ||q|| = 1',
    coreFormula: 'q = \\cos\\frac{\\theta}{2} + (u_x i + u_y j + u_z k)\\sin\\frac{\\theta}{2},\\quad p\' = q\\,p\\,q^*',
    groupOrAlgebra: 'Sp(1) ≅ SU(2) ≅ S³ → SO(3) (Rivestimento doppio 2:1)',
    strengths: 'Zero Gimbal Lock, compatto (4 float vs 9), rinormalizzazione immediata e interpolazione geodetica perfetta su S³ tramite SLERP.',
    limitations: 'Doppia copertura q e -q rappresentano la stessa rotazione 3D.',
    applicationDomains: 'Motori grafici 3D, guida autonoma e assetto aerospaziale (GNC).'
  },
  {
    id: 'rot_dual_quat',
    name: '5. Quaternioni Duali & Matrici Omogenee 4×4',
    dimensionScope: '3D Rigido (Rotazione + Traslazione SE(3))',
    parametersCount: '8 parametri (q_r + ε q_d) / Matrice 4×4',
    coreFormula: '\\hat{q} = q_r + \\varepsilon\\,\\frac{1}{2} t\\,q_r \\;(\\varepsilon^2 = 0),\\quad T = \\begin{pmatrix} R & t \\\\ 0 & 1 \\end{pmatrix} \\in SE(3)',
    groupOrAlgebra: 'Gruppo Euclideo Speciale SE(3) = ℝ³ ⋊ SO(3) (Teorema di Mozzi-Chasles)',
    strengths: 'Unifica rotazione e traslazione in un unico prodotto algebrico (moto elicoidale / Screw Theory) evitando gli artefatti di skinning.',
    limitations: 'Richiede il vincolo di ortogonalità duale ⟨q_r, q_d⟩ = 0.',
    applicationDomains: 'Skeletal animation (Dual Quaternion Skinning), robotica seriale.'
  },
  {
    id: 'rot_clifford',
    name: '6. Algebra Geometrica di Clifford (Bivettori & Rotori)',
    dimensionScope: 'Qualsiasi dimensione N (2D, 3D, 4D, ..., N-D)',
    parametersCount: '2^{N-1} componenti nella sottoalgebra pari Cl⁺(ℝ^N)',
    coreFormula: 'R = \\exp\\left(-\\frac{\\theta}{2} B\\right) = \\cos\\frac{\\theta}{2} - B\\sin\\frac{\\theta}{2},\\quad v\' = R v \\tilde{R}',
    groupOrAlgebra: 'Gruppo Pin(N) e Spin(N) ⊂ Cl(V, q)',
    strengths: 'Elimina l’errore concettuale dell’"asse di rotazione" (che esiste solo in 3D): in qualsiasi dimensione N si ruota in un PIANO orientato generato dal bivettore B = u∧v! Per il Teorema di Cartan-Dieudonné ogni rotazione è prodotto di riflessioni (versori).',
    limitations: 'Dimensione dell’algebra cresce come 2^N per N molto grandi.',
    applicationDomains: 'Fisica relativistica (Spacetime Algebra Cl_{1,3}), computer graphics avanzata (PGA).'
  },
  {
    id: 'rot_lie_spinor',
    name: '7. Algebre di Lie, Spinori (720°), Matrici di Pauli & Wigner D',
    dimensionScope: '3D, Spaziotempo 4D e Spazi di Hilbert Quantistici',
    parametersCount: 'Generatori σ_x, σ_y, σ_z ∈ su(2) / Matrici D^j_{m\'m}',
    coreFormula: 'U(\\hat{n},\\theta) = \\exp\\left(-i\\frac{\\theta}{2}\\hat{n}\\cdot\\vec{\\sigma}\\right),\\quad \\varepsilon_{ijk} \\text{ (Levi-Civita)}',
    groupOrAlgebra: 'SU(2), SL(2,ℂ), Fibrati Principali di Gauge e Rappresentazioni SO(3)',
    strengths: 'Cattura la natura spinoriale della materia (fermioni a spin 1/2 che cambiano segno per θ=360° e tornano identici a θ=720°) e ruota campi sferici tramite le matrici D di Wigner.',
    limitations: 'Richiede algebra lineare complessa e teoria delle rappresentazioni.',
    applicationDomains: 'Meccanica Quantistica, Quantum Computing (sfera di Bloch), Chimica Quantistica.'
  }
];

export const LINEAR_SYSTEMS_COMPENDIUM: LinearTrickEntry[] = [
  {
    id: 'lt1',
    title: 'Allineamento di 3 Punti in 2D e Complanarità di 4 Punti in 3D',
    category: 'Allineamento & Geometria',
    formula: '\\det\\begin{pmatrix} x_1 & y_1 & 1 \\\\ x_2 & y_2 & 1 \\\\ x_3 & y_3 & 1 \\end{pmatrix} = 0,\\quad \\det\\begin{pmatrix} x_1 & y_1 & z_1 & 1 \\\\ x_2 & y_2 & z_2 & 1 \\\\ x_3 & y_3 & z_3 & 1 \\\\ x_4 & y_4 & z_4 & 1 \\end{pmatrix} = 0',
    explanation:
      'La colonna di 1 nasce dall’immersione in coordinate omogenee [x:y:1] nel piano Z=1 (Geometria Proiettiva) e rappresenta il coefficiente del termine noto c·1 = c nell’equazione ax+by+c=0.',
    computationalShortcut:
      'Sottraendo la prima riga a tutte le altre, la colonna di 1 diventa (1, 0, 0,...)ᵀ e il determinante n×n crolla a un determinante (n-1)×(n-1) dei vettori differenza P_i - P₁!'
  },
  {
    id: 'lt2',
    title: 'Allineamento di 3 Punti nello Spazio 3D (Senza Matrice Quadrata)',
    category: 'Allineamento & Geometria',
    formula: '\\mathrm{rk}\\begin{pmatrix} x_1 & y_1 & z_1 & 1 \\\\ x_2 & y_2 & z_2 & 1 \\\\ x_3 & y_3 & z_3 & 1 \\end{pmatrix} < 3 \\iff (P_2 - P_1) \\times (P_3 - P_1) = \\mathbf{0}',
    explanation:
      'Tre punti in 3D sono sempre complanari, quindi per essere allineati il rango della matrice 3×4 deve scendere a ≤ 2 (tutti i minori 3×3 nulli).',
    computationalShortcut:
      'Molto più veloce in 3D: calcola i due vettori differenza u = P₂-P₁ e v = P₃-P₁ e verifica che siano proporzionali u = kv (oppure che il prodotto vettoriale u × v = 0).'
  },
  {
    id: 'lt3',
    title: 'Teorema degli Orlati di Kronecker (Calcolo Lampo del Rango)',
    category: 'Sistemi Lineari & Rango',
    formula: '\\det(M_{k\\times k}) \\neq 0 \\text{ e tutti gli orlati } (k+1)\\times(k+1) \\text{ di } M \\text{ hanno } \\det = 0 \\implies \\mathrm{rk}(A) = k',
    explanation:
      'Evita l’esplosione combinatoria di calcolare tutti i (m su k+1)(n su k+1) minori di ordine k+1: basta testare solo le sottomatrici ottenute aggiungendo 1 riga e 1 colonna al minore base M non nullo.',
    computationalShortcut:
      'Per una matrice 4×5 con un minore 2×2 non nullo, invece di calcolare 40 determinanti 3×3, con Kronecker ne calcoli al massimo (4-2)×(5-2) = 6!'
  },
  {
    id: 'lt4',
    title: 'Regola di Cramer Generalizzata per Sistemi Sottodeterminati',
    category: 'Sistemi Lineari & Rango',
    formula: 'A_{\\text{rango } r} \\mathbf{x}_r = \\mathbf{b} - B\\mathbf{t} \\implies x_i = \\frac{\\det(A_i(\\mathbf{t}))}{\\det(A_r)}',
    explanation:
      'Quando rk(A) = rk(A|b) = r < n (infinite soluzioni con n-r parametri liberi), si scelgono le r colonne del minore fondamentale non nullo e si portano le restanti n-r variabili a destra come parametri t.',
    computationalShortcut:
      'Restituisce istantaneamente la parametrizzazione esplicita della varietà affine delle soluzioni x₀ + ker(A) senza fare la riduzione a gradini all’indietro.'
  },
  {
    id: 'lt5',
    title: 'Inversione di Matrice e Potenze tramite Hamilton-Cayley',
    category: 'Trucchi Spettrali & Avanzati',
    formula: 'p_A(A) = A^n + c_{n-1}A^{n-1} + \\dots + c_1 A + (-1)^n(\\det A)I = 0 \\implies A^{-1} = \\frac{(-1)^{n-1}}{\\det A}(A^{n-1} + \\dots + c_1 I)',
    explanation:
      'Ogni matrice quadrata annulla il proprio polinomio caratteristico p_A(λ) = det(A - λI).',
    computationalShortcut:
      'Permette di esprimere A⁻¹ e qualsiasi potenza alta A^{100} come combinazione lineare di {I, A, ..., A^{n-1}} senza mai calcolare la matrice dei cofattori.'
  },
  {
    id: 'lt6',
    title: 'Test del Polinomio Minimo per la Diagonalizzabilità & Relazioni di Viète',
    category: 'Trucchi Spettrali & Avanzati',
    formula: 'A \\text{ diagonalizzabile su } \\mathbb{K} \\iff \\mu_A(\\lambda) \\text{ si spezza in fattori lineari distinti}',
    explanation:
      'Il polinomio minimo μ_A(λ) ha le stesse radici di p_A(λ) ma con molteplicità pari alla dimensione del blocco di Jordan più grande. Inoltre ∑ λ_i = Tr(A) e ∏ λ_i = det(A).',
    computationalShortcut:
      'Per una matrice 2×2 il polinomio caratteristico si scrive ad occhio: λ² - Tr(A)λ + det(A) = 0!'
  },
  {
    id: 'lt7',
    title: 'Complemento di Schur per Matrici a Blocchi',
    category: 'Trucchi Spettrali & Avanzati',
    formula: 'M = \\begin{pmatrix} A & B \\\\ C & D \\end{pmatrix} \\implies \\det(M) = \\det(A)\\cdot \\det(D - C A^{-1} B)',
    explanation:
      'Riduce il determinante e l’inversione di una grande matrice a blocchi al complemento di Schur S = D - C A⁻¹ B.',
    computationalShortcut:
      'Fondamentale in statistica multivariata (condizionamento di distribuzioni gaussiane), filtro di Kalman e ottimizzazione convessa.'
  }
];

export const TWENTY_FOUR_CHAPTERS_BOOK_SPEC: BookChapterSpec[] = [
  {
    partNumber: 'PARTE I',
    partTitle: 'Fondamenti Algebrici della Geometria Euclidea',
    chapterNumber: 1,
    chapterTitle: 'Spazi Vettoriali, Prodotto Scalare e Spazi Affini Euclidei',
    coreTheoremsAndProofs: [
      'Disuguaglianza di Cauchy-Schwarz |⟨u,v⟩| ≤ ||u||·||v|| con caso di uguaglianza e definizione rigorosa di angolo θ ∈ [0,π].',
      'Teorema di Carnot (Legge dei Coseni) in 1 riga: ||u-v||² = ||u||² + ||v||² - 2||u||·||v||cos θ e Pitagora come caso ⟨u,v⟩ = 0.',
      'Identità del Parallelogramma ||u+v||² + ||u-v||² = 2(||u||² + ||v||²) e polarizzazione.'
    ],
    keyFormulas: '\\langle u,v \\rangle = \\|u\\|\\|v\\|\\cos\\theta,\\quad \\|u-v\\|^2 = \\|u\\|^2 + \\|v\\|^2 - 2\\langle u,v\\rangle'
  },
  {
    partNumber: 'PARTE I',
    partTitle: 'Fondamenti Algebrici della Geometria Euclidea',
    chapterNumber: 2,
    chapterTitle: 'Rette, Iperpiani, Distanze e Proiezioni Ortogonali',
    coreTheoremsAndProofs: [
      'Equazione vettoriale, parametrica e cartesiana ⟨n, X-P₀⟩ = 0 di iperpiani in ℝⁿ.',
      'Formula chiusa per la distanza punto-iperpiano e punto-retta tramite proiezione ortogonale proj_v(u) = (⟨u,v⟩/||v||²)v.',
      'Distanza minima tra due sottospazi affini sghembi in ℝ³ tramite prodotto misto.'
    ],
    keyFormulas: 'd(Q, H) = \\frac{|\\langle n, Q - P_0 \\rangle|}{\\|n\\|},\\quad \\mathrm{proj}_W(v) = A(A^TA)^{-1}A^T v'
  },
  {
    partNumber: 'PARTE II',
    partTitle: 'Isometrie, Similitudini e Geometria del Triangolo',
    chapterNumber: 3,
    chapterTitle: 'Il Gruppo Euclideo E(n) e i Criteri di Congruenza/Similitudine',
    coreTheoremsAndProofs: [
      'Teorema di Mazur-Ulam / classificazione delle isometrie T(x) = Rx + b con R ∈ O(n) (det R = +1 dirette, det R = -1 inverse).',
      'Dimostrazione algebrica completa dei criteri di congruenza LAL, LLL, ALA e di similitudine AA, LAL, LLL tramite matrici ortogonali e omotetie kR.',
      'Teorema di Cartan-Dieudonné: ogni isometria di ℝⁿ è composizione di al più n+1 riflessioni iperpiane.'
    ],
    keyFormulas: 'E(n) = \\mathbb{R}^n \\rtimes O(n),\\quad \\mathrm{Sim}(n) = \\mathbb{R}^n \\rtimes (\\mathbb{R}^+ \\times O(n))'
  },
  {
    partNumber: 'PARTE II',
    partTitle: 'Isometrie, Similitudini e Geometria del Triangolo',
    chapterNumber: 4,
    chapterTitle: 'Geometria Avanzata del Triangolo nel Formalismo Vettoriale',
    coreTheoremsAndProofs: [
      'Somma degli angoli interni α+β+γ = π, Teorema dei Seni, di Stewart e della Bisettrice.',
      'Esistenza e unicità di Baricentro G = (A+B+C)/3, Incentro I = (aA+bB+cC)/(a+b+c), Circocentro O e Ortocentro H.',
      'Retta di Eulero (H - O = 3(G - O)) e Cerchio dei Nove Punti di Feuerbach (centro F = (O+H)/2, raggio R/2).'
    ],
    keyFormulas: 'H - O = (A-O) + (B-O) + (C-O) = 3(G - O),\\quad R_{\\text{Feuerbach}} = \\frac{R}{2}'
  },
  {
    partNumber: 'PARTE III',
    partTitle: 'Forme Multilineari, Determinanti e Matrice di Gram',
    chapterNumber: 5,
    chapterTitle: 'Spazio Duale V*, Forme Bilineari e Prodotto Esterno Λ^k(V)',
    coreTheoremsAndProofs: [
      'Costruzione di Λ^k(V), base canonica e_{i₁}∧...∧e_{i_k} di dimensione (n su k) e definizione intrinseca del determinante su Λⁿ(V).',
      'Sviluppo di Laplace, regola di Cramer e interpretazione geometrica del determinante come volume orientato.'
    ],
    keyFormulas: 'v_1 \\wedge \\dots \\wedge v_n = (\\det A)\\,e_1 \\wedge \\dots \\wedge e_n'
  },
  {
    partNumber: 'PARTE III',
    partTitle: 'Forme Multilineari, Determinanti e Matrice di Gram',
    chapterNumber: 6,
    chapterTitle: 'Matrice di Gram, Identità di Cauchy-Binet e Formula di Erone',
    coreTheoremsAndProofs: [
      'Teorema del Volume k-dimensionale in ℝⁿ: Vol_k(P) = √det(G(v₁,...,v_k)) dove G = AᵀA.',
      'Identità di Cauchy-Binet det(AᵀB) = ∑ det(A_I)det(B_I) e Pitagora generalizzato per k-volumi proiettati.',
      'Derivazione puramente algebrica della Formula di Erone Area = √(s(s-a)(s-b)(s-c)) e del determinante di Cayley-Menger.'
    ],
    keyFormulas: '\\mathrm{Vol}_k^2 = \\det(A^T A) = \\sum_{|I|=k} (\\det A_I)^2'
  },
  {
    partNumber: 'PARTE IV',
    partTitle: 'Simplessi e Politopi Convessi in ℝⁿ',
    chapterNumber: 7,
    chapterTitle: 'L’n-Simplesso: Coordinate Baricentriche, Volume e Contenuto Simpliciale',
    coreTheoremsAndProofs: [
      'Indipendenza affine, coordinate baricentriche ∑ λ_i = 1 (λ_i ≥ 0) e volume dell’n-simplesso Vol_n(Δⁿ) = (1/n!)|det[P₁-P₀,...,P_n-P₀]|.',
      'Matrici di incidenza orientata tra facce k-dimensionali e dimostrazione algebrica di ∂_{k-1} ∘ ∂_k = 0.'
    ],
    keyFormulas: '\\mathrm{Vol}_n(\\Delta^n) = \\frac{1}{n!}\\sqrt{\\det G},\\quad B_{k-1} B_k = 0'
  },
  {
    partNumber: 'PARTE IV',
    partTitle: 'Simplessi e Politopi Convessi in ℝⁿ',
    chapterNumber: 8,
    chapterTitle: 'Politopi Convessi, Teorema di Minkowski-Weyl e Formula di Eulero-Poincaré',
    coreTheoremsAndProofs: [
      'Teorema di Separazione degli Iperpiani, Lemma di Farkas e equivalenza tra V-politopi (inviluppo convesso) e H-politopi (intersezione di semispazi).',
      'Dimostrazione con la sola algebra lineare (Teorema del Rango applicato al complesso di catene B₁, B₂,...) della Formula di Eulero-Poincaré ∑ (-1)^k f_k = 1 - (-1)^d.',
      'Classificazione completa dei 5 Solidi Platonici in ℝ³ e dei 6 politopi regolari in ℝ⁴.'
    ],
    keyFormulas: 'V - E + F = 2,\\quad \\sum_{k=0}^{d-1} (-1)^k f_k = 1 - (-1)^d'
  },
  {
    partNumber: 'PARTE V',
    partTitle: 'Trigonometria, Numeri Complessi e Rotazioni Piane',
    chapterNumber: 9,
    chapterTitle: 'Trigonometria Circolare e Iperbolica come Teoria dei Gruppi SO(2) e SO⁺(1,1)',
    coreTheoremsAndProofs: [
      'Tutte le formule di addizione, duplicazione, bisezione, Werner e prostaferesi dedotte dal prodotto matriciale R(α)R(β) = R(α+β).',
      'Formula di Eulero e^{iθ} = cos θ + i sin θ, De Moivre, radici n-esime dell’unità e poligoni regolari costruibili (Gauss-Wantzel).',
      'Trigonometria iperbolica (cosh, sinh) come gruppo delle rotazioni di Lorentz SO⁺(1,1) che conservano x² - y² = 1.'
    ],
    keyFormulas: 'R(\\alpha)R(\\beta) = R(\\alpha+\\beta),\\quad \\cosh^2 t - \\sinh^2 t = 1'
  },
  {
    partNumber: 'PARTE VI',
    partTitle: 'Teorema Spettrale, Coniche e Quadriche',
    chapterNumber: 10,
    chapterTitle: 'Operatori Autoaggiunti, Teorema Spettrale e Forme Quadratiche (Sylvester)',
    coreTheoremsAndProofs: [
      'Dimostrazione completa del Teorema Spettrale reale, Teorema di Inerzia di Sylvester e Criterio di Sylvester sui minori principali di testa.',
      'Quoziente di Rayleigh R(x) = (xᵀAx)/(xᵀx) e principio min-max di Courant-Fischer.'
    ],
    keyFormulas: 'A = Q\\Lambda Q^T,\\quad \\lambda_{\\min} \\le \\frac{x^T A x}{x^T x} \\le \\lambda_{\\max}'
  },
  {
    partNumber: 'PARTE VI',
    partTitle: 'Teorema Spettrale, Coniche e Quadriche',
    chapterNumber: 11,
    chapterTitle: 'Classificazione Completa di Coniche in ℝ² e Quadriche in ℝ³',
    coreTheoremsAndProofs: [
      'Invarianti ortogonali delle coniche (I₁ = Tr(A₀), I₂ = det(A₀), I₃ = det(A)), eccentricità, fuochi e direttrici.',
      'Classificazione delle 17 forme canoniche affini/metriche delle quadriche in ℝ³ (ellissoidi, iperboloidi a 1 e 2 falde, paraboloidi ellittico e a sella, coni e cilindri) e schiere di rette sull’iperboloide a una falda (torri di Šuchov).'
    ],
    keyFormulas: 'X^T A X = 0,\\quad \\lambda_1 x\'^2 + \\lambda_2 y\'^2 + \\lambda_3 z\'^2 + c = 0'
  },
  {
    partNumber: 'PARTE VII',
    partTitle: 'Geometria Proiettiva e Unificazione all’Infinito',
    chapterNumber: 12,
    chapterTitle: 'Spazio Proiettivo KP^n, Coordinate Omogenee, Dualità e Birapporto',
    coreTheoremsAndProofs: [
      'Costruzione di KP^n = (K^{n+1}\\{0})/K*, carte affini, iperpiano improprio all’infinito e gruppo delle omografie PGL(n+1, K).',
      'Principio di Dualità Proiettiva punto ↔ iperpiano, Invarianza del Birapporto (A,B;C,D) e Teoremi di Desargues e Pappo.',
      'Coniche proiettive, polarità XᵀQY = 0 e Teorema dell’Esagono Mistico di Pascal e di Brianchon.'
    ],
    keyFormulas: '(A,B;C,D) = \\frac{\\det[a,c]\\det[b,d]}{\\det[a,d]\\det[b,c]}'
  },
  {
    partNumber: 'PARTE VIII',
    partTitle: 'Rotazioni 3D, Quaternioni e Algebra di Clifford',
    chapterNumber: 13,
    chapterTitle: 'Il Gruppo SO(3), Teorema di Eulero, Rodrigues, Quaternioni ℍ e Rotori',
    coreTheoremsAndProofs: [
      'Dimostrazione algebrica che ogni R ∈ SO(3) ha autovalore λ = +1 (asse di rotazione) e traccia Tr(R) = 1 + 2cos θ.',
      'Mappa esponenziale exp: so(3) → SO(3), Formula di Rodrigues, isomorfismo Sp(1)/{±1} ≅ SO(3), interpolazione SLERP e Bivettori di Clifford.'
    ],
    keyFormulas: 'R = I + (\\sin\\theta)[\\hat{u}]_\\times + (1-\\cos\\theta)[\\hat{u}]_\\times^2'
  },
  {
    partNumber: 'PARTE IX',
    partTitle: 'Geometria Differenziale delle Curve Piane e Spaziali',
    chapterNumber: 14,
    chapterTitle: 'Curve Regolari, Ascissa Curvilinea, Triedro di Frenet-Serret e Curve di Bézier',
    coreTheoremsAndProofs: [
      'Curvatura κ(s) e torsione τ(s), Formule di Frenet-Serret come sistema differenziale a matrice antisimmetrica in so(3) e Teorema Fondamentale delle Curve.',
      'Polinomi di Bernstein, Algoritmo geometrico di De Casteljau e B-Spline per il CAD.'
    ],
    keyFormulas: '\\kappa = \\frac{\\|\\gamma\' \\times \\gamma\'\'\\|}{\\|\\gamma\'\\|^3},\\quad \\tau = \\frac{\\det[\\gamma\',\\gamma\'\',\\gamma\'\'\']}{\\|\\gamma\' \\times \\gamma\'\'\\|^2}'
  },
  {
    partNumber: 'PARTE X',
    partTitle: 'Geometria Differenziale delle Superfici e Varietà',
    chapterNumber: 15,
    chapterTitle: 'Prima e Seconda Forma Fondamentale, Curvatura di Gauss e Gauss-Bonnet',
    coreTheoremsAndProofs: [
      'Prima Forma Fondamentale I = [[E,F],[F,G]] come Matrice di Gram dei vettori tangenti; Mappa di Gauss N: S → S² e Operatore di Forma S = -dN.',
      'Curvatura Gaussiana K = det(S) = (eg-f²)/(EG-F²), Curvatura Media H = (1/2)Tr(S), Simboli di Christoffel e Theorema Egregium di Gauss.',
      'Geodetiche come curve autoparallele e Teorema Globale di Gauss-Bonnet ∫_S K dA = 2πχ(S).'
    ],
    keyFormulas: 'K = \\frac{\\det(\\mathrm{II})}{\\det(\\mathrm{I})} = \\kappa_1\\kappa_2,\\quad \\int_S K\\,dA + \\int_{\\partial S} \\kappa_g\\,ds = 2\\pi\\chi(S)'
  },
  {
    partNumber: 'PARTE XI',
    partTitle: 'Forme Differenziali, Calcolo Esterno e Teorema di Stokes',
    chapterNumber: 16,
    chapterTitle: 'Campi Tensoriali, k-Forme ω, Derivata Esterna d e Stokes Generalizzato',
    coreTheoremsAndProofs: [
      'Definizione rigorosa di 1-forma dx^i, prodotto esterno ω ∧ η, derivata esterna d e dimostrazione di d² = 0 dal Teorema di Schwarz.',
      'Stella di Hodge *, corrispondenza con grad, rot, div in ℝ³ e dimostrazione del Teorema di Stokes su catene simpliciali.'
    ],
    keyFormulas: 'd(d\\omega) = 0,\\quad \\int_{\\partial \\Omega} \\omega = \\int_\\Omega d\\omega'
  },
  {
    partNumber: 'PARTE XII',
    partTitle: 'Topologia Elementare e Algebrica delle Superfici',
    chapterNumber: 17,
    chapterTitle: 'Omotopia, Caratteristica di Eulero χ = 2 - 2g e Classificazione delle Superfici Compatte',
    coreTheoremsAndProofs: [
      'Triangolazioni, invarianza topologica di χ = V - E + F, orientabilità (Nastro di Möbius e Bottiglia di Klein).',
      'Teorema di Classificazione delle Superfici Compatte: somma connessa di g tori (χ = 2 - 2g) o k piani proiettivi ℝP² (χ = 2 - k).'
    ],
    keyFormulas: '\\chi(\\Sigma_g) = 2 - 2g,\\quad \\chi(N_k) = 2 - k'
  },
  {
    partNumber: 'PARTE XIII',
    partTitle: 'Geometrie Non Euclidee e Sintesi Storico-Fondazionale',
    chapterNumber: 18,
    chapterTitle: 'Geometria Sferica e Iperbolica (Poincaré ℍ, Disco di Klein e Spazio di Minkowski)',
    coreTheoremsAndProofs: [
      'Trigonometria sferica (Legge dei Coseni sferica e Teorema di Girard Area = R²(α+β+γ-π)).',
      'Modello del semipiano superiore di Poincaré ℍ con metrica ds² = (dx²+dy²)/y², gruppo delle isometrie PSL(2,ℝ) (trasformazioni di Möbius) e modello iperboloide nello spazio di Lorentz ℝ^{2,1}.'
    ],
    keyFormulas: 'd_{\\mathbb{H}}(z_1, z_2) = \\mathrm{arccosh}\\left(1 + \\frac{|z_1 - z_2|^2}{2\\,\\mathrm{Im}(z_1)\\mathrm{Im}(z_2)}\\right)'
  },
  {
    partNumber: 'PARTE XIV',
    partTitle: 'Appendici Strutturali, Operatori Infinito-Dimensionali e Sintesi Storica',
    chapterNumber: 19,
    chapterTitle: 'Da Euclide a Hilbert, Klein, Grassmann, Peano, Grothendieck e Lean 4 (Capitoli 19–24 + 3 Appendici)',
    coreTheoremsAndProofs: [
      'Evoluzione storica: lacune degli Elementi di Euclide → Assiomi di Hilbert (1899) → Programma di Erlangen di Klein (1872) → Ausdehnungslehre di Grassmann e Calcolo Geometrico di Peano (1888).',
      'Appendice A: Richiami completi di Algebra Lineare, Rouché-Capelli, Orlati di Kronecker, Hamilton-Cayley e Complementi di Schur.',
      'Appendice B: Operatori differenziali come matrici infinito-dimensionali, Serie di Fourier, Numeri Duali ℝ[ε]/(ε²) e Politopo di Birkhoff (mHC).',
      'Appendice C: Dizionario formale MathLingua ↔ Lean 4 / Mathlib.'
    ],
    keyFormulas: '\\text{Geometria Sintetica} \\xrightarrow{\\text{Descartes/Grassmann/Peano}} \\text{Algebra Lineare} \\xrightarrow{\\text{Klein/Cartan/Grothendieck}} \\text{Varietà, Gruppi di Lie e Categorie}'
  }
];

export const ANNOTATED_BIBLIOGRAPHY: BibliographyItem[] = [
  {
    title: 'Vector Calculus, Linear Algebra, and Differential Forms: A Unified Approach',
    author: 'John H. Hubbard & Barbara Burke Hubbard',
    category: 'Ponti & Visione Unificata',
    whyEssential: 'Il capolavoro didattico che fonde in un unico corso Analisi 2, Algebra Lineare, Forme Differenziali, Teorema di Stokes e Metodo di Newton-Kantorovich.'
  },
  {
    title: 'Algebra: Chapter 0',
    author: 'Paolo Aluffi',
    category: 'Ponti & Visione Unificata',
    whyEssential: 'Introduce Gruppi, Anelli, Campi, Moduli e Algebra Lineare direttamente nel linguaggio unificante della Teoria delle Categorie e delle proprietà universali.'
  },
  {
    title: 'An Infinitely Large Napkin',
    author: 'Evan Chen',
    category: 'Ponti & Visione Unificata',
    whyEssential: 'Panoramica cristallina e intuitiva dell’intera matematica moderna (dai gruppi alla coomologia di De Rham, geometria algebrica e teoria delle categorie).'
  },
  {
    title: 'Calculus on Manifolds',
    author: 'Michael Spivak',
    category: 'Ponti & Visione Unificata',
    whyEssential: 'In sole 140 pagine riscrive l’Analisi vettoriale con l’algebra multilineare delle forme differenziali, culminando nella dimostrazione rigorosa di Stokes.'
  },
  {
    title: 'Introduction to Linear Algebra & Differential Equations and Linear Algebra',
    author: 'Gilbert Strang (MIT)',
    category: 'Analisi & Operatori',
    whyEssential: 'Spiega la geometria dei 4 sottospazi fondamentali, la SVD e il ponte diretto tra matrici finite e operatori differenziali/Fourier.'
  },
  {
    title: 'Linear Algebra Done Right',
    author: 'Sheldon Axler',
    category: 'Analisi & Operatori',
    whyEssential: 'Sviluppa gli operatori lineari e il Teorema Spettrale senza fare uso dei determinanti, preparando la mente agli spazi infinito-dimensionali dell’Analisi Funzionale.'
  },
  {
    title: 'Calculus (Vol. 1 & 2)',
    author: 'Tom M. Apostol',
    category: 'Analisi & Operatori',
    whyEssential: 'Tratta gli spazi di funzioni, l’operatore derivata e l’operatore integrale come veri spazi vettoriali fin dal primo anno.'
  },
  {
    title: 'Analisi Matematica',
    author: 'Giovanni Prodi',
    category: 'Analisi & Operatori',
    whyEssential: 'Classico italiano visionario che imposta l’Analisi 1 sugli spazi metrici, normati e sulle contrazioni di Banach.'
  },
  {
    title: 'Geometria 1 & Geometria 2',
    author: 'Edoardo Sernesi',
    category: 'Algebra, Geometria & Meccanica',
    whyEssential: 'Riferimento rigoroso per spazi affini, euclidei, proiettivi, coniche, quadriche, topologia e varietà differenziabili.'
  },
  {
    title: 'Metodi Matematici della Meccanica Classica & Ordinary Differential Equations',
    author: 'Vladimir I. Arnold',
    category: 'Algebra, Geometria & Meccanica',
    whyEssential: 'Mostra che le EDO sono campi vettoriali su varietà e che la meccanica lagrangiana/hamiltoniana (inclusa la teoria KAM) è geometria simplettica e gruppi di Lie.'
  },
  {
    title: 'mHC: Manifold-Constrained Hyper-Connections (ArXiv 2512.24880) & Mathematics for Machine Learning',
    author: 'DeepSeek-AI (Zhenda Xie et al.) / Deisenroth, Faisal, Ong / Goodfellow, Bengio, Courville',
    category: 'IA, Deep Learning & MOOC',
    whyEssential: 'Collega il Politopo di Birkhoff, l’algoritmo di Sinkhorn-Knopp e la stabilità spettrale alle architetture Transformer/LLM moderne.'
  },
  {
    title: 'Percorso MOOC & Risorse Video (5 Fasi: Basi → Geometria/Analisi → ML/DL → Frontiera)',
    author: '3Blue1Brown (Grant Sanderson), Professor Leonard, StatQuest, Michael Nielsen, POK Polimi, Federica.eu',
    category: 'IA, Deep Learning & MOOC',
    whyEssential: 'Dalle intuizioni geometriche di Essence of Linear Algebra & Calculus ai corsi universitari italiani (Abate, Bramanti-Pagani-Salsa, Sperduti).'
  }
];

export const MHC_VS_SPACE_HIGHWAYS_COMPARISON = [
  {
    aspect: 'Problema di partenza',
    deepseekMhc: 'Nelle reti neurali molto profonde con Hyper-Connections libere, la moltiplicazione ripetuta di matrici H_l fa esplodere (||∏ H_l|| → ∞) o svanire (→ 0) il segnale e il gradiente.',
    spaceHighways: 'Nello spazio interplanetario, muoversi con propulsione continua contro i campi gravitazionali richiede un consumo energetico Δv proibitivo e soffre di instabilità caotica.'
  },
  {
    aspect: 'Varietà Geometrica Vincolante',
    deepseekMhc: 'Politopo di Birkhoff B_n = {H ≥ 0 : H 1 = 1, Hᵀ 1 = 1} (varietà poliedrica compatta delle matrici doppiamente stocastiche, inviluppo convesso delle permutazioni).',
    spaceHighways: 'Varietà Invarianti Sub-Riemanniane (Tubi di Conley-McGehee, Tori KAM e Connessioni Eterocline attorno ai punti di Lagrange L₁, L₂).'
  },
  {
    aspect: 'Operatore / Algoritmo di Proiezione',
    deepseekMhc: 'Operatore non lineare di Sinkhorn-Knopp (normalizzazione alternata di righe e colonne su exp(W)) che proietta qualsiasi matrice sul politopo di Birkhoff.',
    spaceHighways: 'Mappa di Poincaré, Fast Lyapunov Indicator (FLI di Nataša Todorović) e invarianti della Teoria dei Nodi (Baresi & Owen) per individuare le orbite di trasferimento.'
  },
  {
    aspect: 'Proprietà di Conservazione & Stabilità',
    deepseekMhc: 'Norma spettrale ||H||₂ ≤ 1 e chiusura algebrica (il prodotto di matrici doppiamente stocastiche resta in B_n): l’informazione è una media convessa conservativa!',
    spaceHighways: 'Conservazione dell’integrale di Jacobi (energia generalizzata nel problema dei 3 corpi ristretto): la sonda scivola lungo il "binario" gravitazionale a Δv ≈ 0.'
  }
];
