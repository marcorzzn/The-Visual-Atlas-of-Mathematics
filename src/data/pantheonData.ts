export type ChamberId =
  | 'pantheon_overview'
  | 'hardware_elevator'
  | 'matrices_tensors'
  | 'hydraulic_nn'
  | 'manifolds_metrics'
  | 'category_symmetries';

export type MetricType = 'euclidean_l2' | 'manhattan_l1' | 'chebyshev_linf' | 'riemann_complex';
export type CoordinateSystemType = 'cartesian' | 'cylindrical' | 'spherical';

export interface AbstractionLayerInfo {
  level: number;
  domain: 'Chimica' | 'Fisica' | 'Informatica' | 'Matematica Pura';
  title: string;
  subtitle: string;
  formula: string;
  description: string;
  visualElement: string;
}

export interface HardwarePedestalData {
  id: string;
  index: number;
  name: string;
  era: string;
  xPosition: number;
  tagline: string;
  summary: string;
  keyPrinciple: string;
  layers: [AbstractionLayerInfo, AbstractionLayerInfo, AbstractionLayerInfo, AbstractionLayerInfo];
}

export interface ChamberInfo {
  id: ChamberId;
  title: string;
  axisLabel: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
  interactiveHint: string;
}

export const CHAMBERS: ChamberInfo[] = [
  {
    id: 'pantheon_overview',
    title: 'Il Pantheon della Mente e della Macchina',
    shortTitle: 'Pantheon Globale',
    axisLabel: 'Origine (0, 0, 0)',
    subtitle: 'Architettura tridimensionale dove Fisica, Hardware e Matematica convergono',
    description:
      'Naviga liberamente nella cattedrale neoclassica virtuale. Lungo l’Asse X scorre l’evoluzione dell’hardware; lungo l’Asse Y si innalza l’Ascensore dell’Astrazione; lungo l’Asse Z si aprono le stanze della Matematica e delle Reti Neurali.',
    cameraPos: [0, 14, 28],
    cameraTarget: [0, 3.5, 0],
    interactiveHint: 'Clicca su qualsiasi piedistallo o usa la barra inferiore per cambiare stanza e deformare i parametri.',
  },
  {
    id: 'hardware_elevator',
    title: 'Asse X & Y: Evoluzione Hardware e Ascensore dell’Astrazione',
    shortTitle: 'Ascensore Hardware',
    axisLabel: 'Assi X · Y',
    subtitle: 'Dall’Abaco al Computer Quantistico attraverso 4 strati olografici',
    description:
      'Seleziona uno dei 7 calcolatori storici e solleva il cursore "Esploso Y (Astrazione)". Il dispositivo si scompone verticalmente in Chimica dei materiali, Fisica dei campi, Porte logiche informatiche e Matematica pura.',
    cameraPos: [0, 7.5, 13.5],
    cameraTarget: [0, 4.2, 0],
    interactiveHint: 'Usa il cursore "Ascensore Y" per separare i 4 strati olografici e seleziona un piedistallo.',
  },
  {
    id: 'matrices_tensors',
    title: 'Stanza delle Matrici, Autovettori e Tensori',
    shortTitle: 'Matrici & Tensori',
    axisLabel: 'Asse Z · Ovest',
    subtitle: 'Una matrice non è una tabella: è una gabbia laser che deforma lo spazio',
    description:
      'Modifica i coefficienti della matrice 2×2 in tempo reale per stirare, ruotare o comprimere lo spazio geometrico. Gli assi luminosi ciano/ambra indicano gli Autovettori (direzioni che non ruotano), mentre il Cubo Tensoriale a destra mostra le sezioni di covarianza.',
    cameraPos: [-16, 6.2, -12],
    cameraTarget: [-16, 3.2, -19],
    interactiveHint: 'Trascina i cursori a, b, c, d della matrice e cambia il piano di taglio del Tensore 3D.',
  },
  {
    id: 'hydraulic_nn',
    title: 'Rete Neurale Idraulica & Backpropagation',
    shortTitle: 'Rete Idraulica',
    axisLabel: 'Asse Z · Centro',
    subtitle: 'Flussi luminosi in canali di vetro, valvole sinaptiche e onde di gradiente',
    description:
      'Osserva i dati scorrere come fluido fotonico attraverso condotti di cristallo. I pesi sinaptici sono valvole meccaniche che strozzano o ampliano il flusso; il Bias è un pistone di pressione. Premi "Backpropagation" per inviare un’onda inversa che ricalibra le valvole.',
    cameraPos: [0, 6.5, -11.5],
    cameraTarget: [0, 3.5, -19],
    interactiveHint: 'Regola Pesi (Valvole), Bias (Pressione) o avvia un’onda di Backpropagation.',
  },
  {
    id: 'manifolds_metrics',
    title: 'Altare delle Varietà, Metriche & Analisi Complessa',
    shortTitle: 'Varietà & Metriche',
    axisLabel: 'Asse Z · Est',
    subtitle: 'Lo stesso oggetto matematico immerso in metriche e coordinate differenti',
    description:
      'Sull’Altare Universale una sfera muta forma al cambiare della definizione di distanza: liscia nella metrica Euclidea (L2), ottaedro cristallino nella metrica Manhattan (L1), cubo in Chebyshev (L∞), o Superficie di Riemann ramificata in Analisi Complessa.',
    cameraPos: [16, 6.2, -12],
    cameraTarget: [16, 3.2, -19],
    interactiveHint: 'Cambia la Metrica dello Spazio (L2, L1, L∞, Riemann) e la Griglia di Coordinate.',
  },
  {
    id: 'category_symmetries',
    title: 'Volta delle Categorie, Simmetrie & Meccanica Razionale',
    shortTitle: 'Categorie & Fisica',
    axisLabel: 'Volta & Spazio Fasi',
    subtitle: 'Funtori stellari, gruppi di simmetria cristallina e Teorema di Noether',
    description:
      'Nella volta superiore, la Teoria delle Categorie unisce costellazioni di oggetti tramite morfismi e iper-prismi Funtoriali. In basso, un cristallo di simmetria SO(3) sovrasta lo Spazio delle Fasi simplettico dove le traiettorie minimizzano l’Azione.',
    cameraPos: [0, 11.5, 16],
    cameraTarget: [0, 8.5, -4],
    interactiveHint: 'Attiva il Funtore di proiezione e modula l’energia nello Spazio delle Fasi.',
  },
];

export const HARDWARE_PEDESTALS: HardwarePedestalData[] = [
  {
    id: 'abacus',
    index: 0,
    name: '01. Abaco Babilonese / Cinese',
    era: '~2400 a.C.',
    xPosition: -18,
    tagline: 'La materia diventa memoria posizionale',
    summary:
      'Il primo registro hardware dell’umanità: lo stato discreto è memorizzato nella posizione fisica di sfere scanalate lungo aste di bronzo.',
    keyPrinciple: 'Sistema numerico posizionale bi-quinario e conservazione fisica dello stato.',
    layers: [
      {
        level: 1,
        domain: 'Chimica',
        title: 'Polimeri di Cellulosa & Lega Cu-Sn',
        subtitle: 'Reticolo solido macroscopico',
        formula: '(C₆H₁₀O₅)ₙ + Cu₈₈Sn₁₂',
        description: 'Legami covalenti rigidi nel legno stagionato e struttura cristallina metallica del bronzo garantiscono indeformabilità degli stati.',
        visualElement: 'Catene polimeriche e reticolo cubico a facce centrate',
      },
      {
        level: 2,
        domain: 'Fisica',
        title: 'Attrito Statico & Potenziale Gravitazionale',
        subtitle: 'Stabilità meccanica bistabile',
        formula: 'F_attrito ≥ μ_s · N , ΔU = m·g·Δh',
        description: 'L’attrito statico impedisce alle sfere di scivolare spontaneamente, rendendo il bit meccanico non volatile senza consumo energetico.',
        visualElement: 'Vettori di forza d’attrito e buche di potenziale meccanico',
      },
      {
        level: 3,
        domain: 'Informatica',
        title: 'Registro a Stato Discreto Bi-Quinario',
        subtitle: 'Memoria manuale ad accesso diretto',
        formula: 'D_i = 5 · b_sup + ∑ b_inf',
        description: 'Ogni asta codifica una cifra decimale dividendo il calcolo in una sfera superiore (valore 5) e quattro inferiori (valore 1).',
        visualElement: 'Codifica di registro con riporto (Carry) manuale',
      },
      {
        level: 4,
        domain: 'Matematica Pura',
        title: 'Aritmetica Modulare & Gruppi Ciclici',
        subtitle: 'Isomorfismo in base 10',
        formula: 'N = ∑ d_k · 10^k , ℤ / 10ℤ',
        description: 'Lo spostamento delle sfere realizza un omomorfismo concreto del gruppo additivo degli interi modulo potenze di 10.',
        visualElement: 'Anello algebrico ciclico e decomposizione polinomiale',
      },
    ],
  },
  {
    id: 'calculator',
    index: 1,
    name: '02. Calcolatrice Meccanica (Pascalina)',
    era: '1642 – 1673',
    xPosition: -12,
    tagline: 'L’automazione del riporto tramite cinematica',
    summary:
      'Ruote dentate di precisione e tamburi scalettati di Leibniz: il ragionamento aritmetico viene inciso nella geometria dei profili ad evolvente.',
    keyPrinciple: 'Trasmissione cinematica vincolata e scatto automatico del riporto (Sautoir).',
    layers: [
      {
        level: 1,
        domain: 'Chimica',
        title: 'Ottone Metallurgico Alfa (Cu-Zn)',
        subtitle: 'Basso coefficiente d’attrito superficiale',
        formula: 'Cu₆₅Zn₃₅ (Reticolo FCC)',
        description: 'La sostituzione di atomi di zinco nel reticolo del rame riduce l’usura adesiva tra i denti degli ingranaggi.',
        visualElement: 'Reticolo metallico sustizionale rame-zinco',
      },
      {
        level: 2,
        domain: 'Fisica',
        title: 'Cinematica dei Corpi Rigidi & Coppia',
        subtitle: 'Rapporto di trasmissione angolare',
        formula: 'ω₁ · r₁ = ω₂ · r₂ , τ = I · α',
        description: 'Il meccanismo "Sautoir" accumula energia potenziale gravitazionale sollevando un contrappeso e la rilascia di scatto al passaggio 9→0.',
        visualElement: 'Campi di velocità tangenziale e profili ad evolvente',
      },
      {
        level: 3,
        domain: 'Informatica',
        title: 'Macchina a Stati Finiti Meccanica',
        subtitle: 'Propagazione hardware del Carry',
        formula: 'S_{t+1} = δ(S_t, Input_rotazione)',
        description: 'Per la prima volta il riporto aritmetico non richiede l’intervento umano ma è una transizione di stato automatica.',
        visualElement: 'Grafo di transizione a 10 stati accoppiati',
      },
      {
        level: 4,
        domain: 'Matematica Pura',
        title: 'Curve Elicoidali & Cicli di Permutazione',
        subtitle: 'Gruppo Simmetrico S₁₀',
        formula: 'σ = (0 1 2 3 4 5 6 7 8 9) ∈ S₁₀',
        description: 'Ogni rotazione applica un generatore del gruppo ciclico C₁₀; la moltiplicazione diventa traslazione ripetuta di cilindri.',
        visualElement: 'Geometria differenziale dell’evolvente del cerchio',
      },
    ],
  },
  {
    id: 'vacuum_tube',
    index: 2,
    name: '03. Valvola Termoionica (Triodo)',
    era: '1906 – 1945 (ENIAC)',
    xPosition: -6,
    tagline: 'Il calcolo abbandona la materia solida e viaggia nel vuoto',
    summary:
      'Gli elettroni bollono da un filamento incandescente e volano nel vuoto, governati dal campo elettrico di una griglia metallica alla velocità della luce.',
    keyPrinciple: 'Emissione termoionica ed amplificazione/commutazione elettronica.',
    layers: [
      {
        level: 1,
        domain: 'Chimica',
        title: 'Tungsteno Toriato & Ossidi di Bario',
        subtitle: 'Abbassamento della funzione lavoro (φ)',
        formula: 'W + ThO₂ (φ ≈ 2.6 eV)',
        description: 'Il rivestimento di ossidi alcalino-terrosi sul catodo riduce l’energia necessaria agli elettroni per sfuggire dal metallo.',
        visualElement: 'Barriera di potenziale superficiale e nube elettronica',
      },
      {
        level: 2,
        domain: 'Fisica',
        title: 'Legge di Richardson-Dushman & Child-Langmuir',
        subtitle: 'Corrente di carica spaziale nel vuoto',
        formula: 'J = A·T²·e^(-φ/kT) , I_a ∝ V_g^(3/2)',
        description: 'Una piccola tensione negativa sulla griglia di controllo respinge il flusso di elettroni tra catodo e anodo, agendo da rubinetto senza inerzia.',
        visualElement: 'Linee di campo elettrostatico e flusso balistico di elettroni',
      },
      {
        level: 3,
        domain: 'Informatica',
        title: 'Inverter Logico & Flip-Flop Eccles-Jordan',
        subtitle: 'Commutazione binaria ad alta velocità',
        formula: 'OUT = ¬IN , Bistabile (0 / 1)',
        description: 'Accoppiando due triodi in controfase nasce il circuito bistabile (Flip-Flop), capace di ricordare 1 bit elettronico a kilohertz.',
        visualElement: 'Porta NOT/NAND elettronica e forma d’onda quadra',
      },
      {
        level: 4,
        domain: 'Matematica Pura',
        title: 'Algebra Booleana & Equazione di Poisson',
        subtitle: 'Dal potenziale continuo al reticolo {0,1}',
        formula: '∇²Φ = -ρ/ε₀  ⟹  x ∧ y, x ∨ y, ¬x',
        description: 'La soluzione continua dell’equazione di Poisson viene saturata agli estremi di interdizione e conduzione, materializzando la logica di Boole.',
        visualElement: 'ipercubo booleano e superficie di potenziale armonico',
      },
    ],
  },
  {
    id: 'transistor',
    index: 3,
    name: '04. Transistor al Silicio (MOSFET)',
    era: '1947 – 1959',
    xPosition: 0,
    tagline: 'L’atomo di silicio drogato diventa l’interruttore universale',
    summary:
      'Il mattone fondamentale dell’IA moderna: modulando un campo elettrico su un cristallo semiconduttore, si crea un canale conduttivo nanometrico.',
    keyPrinciple: 'Fisica dello stato solido, bande energetiche e giunzione P-N.',
    layers: [
      {
        level: 1,
        domain: 'Chimica',
        title: 'Reticolo Diamante di Silicio Drogato (B / P)',
        subtitle: 'Legami covalenti sp³ con impurezze',
        formula: 'Si (Gruppo IV) + B (Lacune p⁺) / P (Elettroni n⁻)',
        description: 'Inserendo atomi di Fosforo (5 elettroni di valenza) o Boro (3 elettroni) nel cristallo di Silicio puro, si controlla la densità dei portatori di carica.',
        visualElement: 'Cella elementare tetraedrica del Silicio con atomi droganti',
      },
      {
        level: 2,
        domain: 'Fisica',
        title: 'Bande di Energia & Inversione di Canale',
        subtitle: 'Piegamento delle bande e livello di Fermi',
        formula: 'I_D = μ_n C_ox (W/L) [(V_GS - V_th)V_DS - ½V_DS²]',
        description: 'La tensione sul Gate piega le bande energetiche sotto l’ossido isolante, attirando elettroni minoritari e aprendo un ponte quantistico tra Source e Drain.',
        visualElement: 'Campo vettoriale di deriva elettronica e zona di svuotamento',
      },
      {
        level: 3,
        domain: 'Informatica',
        title: 'Logica CMOS (Complementary MOS)',
        subtitle: 'Dissipazione statica quasi nulla',
        formula: 'f(A,B) = ¬(A · B) [ Pull-Up pMOS + Pull-Down nMOS ]',
        description: 'Combinando transistor pMOS e nMOS in coppie complementari, la corrente scorre solo durante l’istante di commutazione logica.',
        visualElement: 'Topologia di porte logiche universali NAND / XOR in tempo reale',
      },
      {
        level: 4,
        domain: 'Matematica Pura',
        title: 'Funzioni di Commutazione & Spazi Vettoriali su GF(2)',
        subtitle: 'Completezza funzionale di Post',
        formula: '𝔹ⁿ → 𝔹 , GF(2) = ({0,1}, ⊕, ∧)',
        description: 'L’operatore NAND genera l’intero spazio delle 2^(2^n) funzioni booleane; l’aritmetica binaria opera sul campo finito di Galois GF(2).',
        visualElement: 'Reticolo algebrico di Boole e polinomi di Zhegalkin',
      },
    ],
  },
  {
    id: 'cpu',
    index: 4,
    name: '05. Microprocessore Multicore / GPU',
    era: '1971 – Oggi',
    xPosition: 6,
    tagline: 'Miliardi di transistor orchestrati da un cristallo di quarzo',
    summary:
      'Un’intera città litografica su pochi millimetri quadrati di silicio, dove pipeline vettoriali eseguono miliardi di prodotti matriciali al secondo.',
    keyPrinciple: 'Architettura di Von Neumann / SIMD e litografia nell’ultravioletto estremo (EUV).',
    layers: [
      {
        level: 1,
        domain: 'Chimica',
        title: 'Fotolitografia EUV, Dielettrici High-κ (HfO₂) & Rame',
        subtitle: 'Ingegneria atomica a 2–3 nanometri',
        formula: 'SiO₂ / HfO₂ + Interconnessioni Cu Damascene',
        description: 'Strati di ossido di afnio spessi pochi atomi prevengono l’effetto tunnel parassita, sormontati da 15 piani di autostrade in rame.',
        visualElement: 'Sezione stratificata nanometrica FinFET / Gate-All-Around',
      },
      {
        level: 2,
        domain: 'Fisica',
        title: 'Oscillazione Piezoelettrica & Termodinamica di Landauer',
        subtitle: 'Sincronia d’onda e limite entropico del bit',
        formula: 'E_min ≥ k_B T ln(2) , P_din = C · V² · f',
        description: 'Cancellare un bit di informazione dissipa inevitabilmente calore (Principio di Landauer). Il clock propaga fronti d’onda elettromagnetici sincronizzati.',
        visualElement: 'Distribuzione termica e propagazione di fase del Clock',
      },
      {
        level: 3,
        domain: 'Informatica',
        title: 'Pipeline Superscalare, ALU & Systolic Tensor Array',
        subtitle: 'Parallelismo a livello di istruzione e dato',
        formula: 'D = A × B + C (Fused Multiply-Add in 1 ciclo)',
        description: 'Le unità sistoliche fanno scorrere vettori di dati attraverso griglie di moltiplicatori, calcolando interi blocchi matriciali in un battito di clock.',
        visualElement: 'Griglia sistolica con flussi di byte sincronizzati',
      },
      {
        level: 4,
        domain: 'Matematica Pura',
        title: 'Algebra Lineare Numerica & Spazi IEEE 754',
        subtitle: 'Approssimazione discreta del continuo reale',
        formula: 'C_{ij} = ∑_k A_{ik} B_{kj} , x = (-1)^s · m · 2^(e-b)',
        description: 'L’intero calcolo scientifico e neurale viene ridotto a contrazioni di tensori e decomposizioni matriciali (SVD, Autovalori) in virgola mobile.',
        visualElement: 'Trasformazioni lineari nello spazio vettoriale ℝⁿ',
      },
    ],
  },
  {
    id: 'server_rack',
    index: 5,
    name: '06. Data Center & Cluster IA Distribuito',
    era: 'Era Cloud & Foundation Models',
    xPosition: 12,
    tagline: 'Il super-organismo planetario connesso da impulsi di luce',
    summary:
      'Migliaia di nodi acceleratori interconnessi in topologie iper-dimensionali tramite fibre ottiche, dove risiedono i pesi dei grandi modelli neurali.',
    keyPrinciple: 'Comunicazione ottica coerente, calcolo parallelo distribuito e consenso.',
    layers: [
      {
        level: 1,
        domain: 'Chimica',
        title: 'Silice Ultrapura (SiO₂) & Laser InGaAsP',
        subtitle: 'Trasparenza fotonica e guida d’onda',
        formula: 'SiO₂ + GeO₂ (Nucleo ad alto indice n₁ > n₂)',
        description: 'Il drogaggio con Germanio nel cuore della fibra ottica innalza l’indice di rifrazione, intrappolando i fotoni laser per chilometri senza perdite.',
        visualElement: 'Struttura molecolare vetrosa e confinamento fotonico',
      },
      {
        level: 2,
        domain: 'Fisica',
        title: 'Riflessione Totale Interna & Equazioni di Maxwell',
        subtitle: 'Multiplexing a divisione di lunghezza d’onda',
        formula: 'θ_c = arcsin(n₂/n₁) , ∇ × E = -∂B/∂t',
        description: 'Impulsi laser a diverse frequenze infrarosse viaggiano simultaneamente nella stessa fibra senza interferire, trasportando terabit al secondo.',
        visualElement: 'Modi trasversi elettromagnetici guidati (TE/TM)',
      },
      {
        level: 3,
        domain: 'Informatica',
        title: 'Topologia Torus / All-Reduce & Parallelismo Tensoriale',
        subtitle: 'Sincronizzazione globale dei gradienti',
        formula: '∇L_globale = (1/N) ∑_{i=1}^N ∇L_nodo_i',
        description: 'I tensori di una singola rete neurale vengono frammentati su centinaia di server e ricomposti ad ogni passo tramite anelli ottici All-Reduce.',
        visualElement: 'Grafo ipercubico di routing e scambio pacchetti RDMA',
      },
      {
        level: 4,
        domain: 'Matematica Pura',
        title: 'Teoria dei Grafi Spettrali & Ottimizzazione Stocastica',
        subtitle: 'Discesa del gradiente su varietà a miliardi di dimensioni',
        formula: 'θ_{t+1} = θ_t - η · G⁻¹(θ) ∇_θ ℒ(θ)',
        description: 'L’apprendimento globale è una traiettoria dinamica su una varietà riemanniana ad altissima dimensione governata dalla matrice di informazione di Fisher.',
        visualElement: 'Geodetica di ottimizzazione sul paesaggio della Loss',
      },
    ],
  },
  {
    id: 'quantum',
    index: 6,
    name: '07. Computer Quantistico Criogenico',
    era: 'Orizzonte Quantistico',
    xPosition: 18,
    tagline: 'Il calcolo esplora simultaneamente le simmetrie dello spazio di Hilbert',
    summary:
      'Sospeso in un criostato a diluizione d’oro a 15 millikelvin, più freddo dello spazio profondo, i qubit superconduttori calcolano tramite interferenza.',
    keyPrinciple: 'Sovrapposizione coerente, Entanglement e giunzioni tunnel di Josephson.',
    layers: [
      {
        level: 1,
        domain: 'Chimica',
        title: 'Superconduttori di Niobio-Titanio & Giunzione Al-AlOₓ-Al',
        subtitle: 'Assenza totale di resistenza elettrica a 0.015 K',
        formula: 'NbTi / Al + Barriera tunnel Al₂O₃ (1.5 nm)',
        description: 'A temperature prossime allo zero assoluto, gli elettroni si legano in Coppie di Cooper comportandosi come un unico superfluido quantistico macroscopico.',
        visualElement: 'Condensato di Coppie di Cooper e barriera isolante nanometrica',
      },
      {
        level: 2,
        domain: 'Fisica',
        title: 'Effetto Josephson Non-Lineare & Sfera di Bloch',
        subtitle: 'Oscillatore armonico quantistico anarmonico',
        formula: 'I = I_c sin(Δφ) , |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩',
        description: 'Impulsi a microonde calibrati fanno ruotare il vettore di stato sulla Sfera di Bloch, ponendo il circuito in sovrapposizione coerente di |0⟩ e |1⟩.',
        visualElement: 'Sfera di Bloch 3D con precessione del vettore di stato',
      },
      {
        level: 3,
        domain: 'Informatica',
        title: 'Porte Quantistiche Unitarie (Hadamard, CNOT) & Interferenza',
        subtitle: 'Reversibilità logica e correlazione non-locale',
        formula: 'H|0⟩ = (|0⟩+|1⟩)/√2 , |Φ⁺⟩ = (|00⟩+|11⟩)/√2',
        description: 'Le porte quantistiche non distruggono informazione: amplificano l’ampiezza di probabilità delle soluzioni corrette cancellando quelle errate per interferenza distruttiva.',
        visualElement: 'Circuito di entanglement e interferenza d’onda complessa',
      },
      {
        level: 4,
        domain: 'Matematica Pura',
        title: 'Spazi di Hilbert Complessi ℂ^(2ⁿ) & Gruppo Unitario SU(2ⁿ)',
        subtitle: 'Prodotto tensoriale di stati ed evoluzione unitaria',
        formula: 'ℋ = ℋ₁ ⊗ ℋ₂ ⊗ ... ⊗ ℋₙ , U†U = I',
        description: 'Con n qubit lo spazio vettoriale cresce esponenzialmente come 2ⁿ dimensioni complesse; ogni calcolo è una rotazione unitaria che preserva la norma hermitiana.',
        visualElement: 'Prodotto tensoriale su varietà complessa proiettiva',
      },
    ],
  },
];

export const MEGA_PROMPT_TEXT = `[SYSTEM INSTRUCTION: META-LEARNING 3D ENVIRONMENT ARCHITECT]

OBJECTIVE: Design a highly structural, clean, and interactive 3D virtual environment for a meta-learning video game where an AI visualizes and teaches its own existence, mapping hardware evolution to abstract mathematics.

--- VISUAL INFRASTRUCTURE & LAYOUT ---
- THE PANTHEON AXIS: The environment is a minimalist, neoclassical virtual cathedral floating in a dark, clean void. It is structured along 3 visible coordinate axes made of subtle laser grids.
- AXIS X (HARDWARE EVOLUTION): A linear timeline of interactive, architectural pedestals containing: [Abacus -> Mechanical Calculator -> Vacuum Tube -> Silicon Transistor -> Desktop CPU -> Cloud Data Center Server Rack -> Cryogenic Quantum Computer].
- AXIS Y (THE ABSTRACTION ELEVATOR): Selecting any hardware component triggers a vertical "Exploded View". The component splits into 4 overhead floating holographic layers:
  1. BASE LAYER (Chemistry): Crystalline molecular structures, doping of semiconductors (P-N junctions), and quantum state materials.
  2. SECOND LAYER (Physics): Vector fields representing electron flows, electromagnetic waves, and quantum superposition states (Bloch Sphere).
  3. THIRD LAYER (Computer Science): Interactive logic gates (AND, OR, NOT, XOR) processing glowing byte-streams in real-time.
  4. TOP LAYER (Pure Mathematics): The abstract equations, Boolean algebra, and matrices governing the logic.
- AXIS Z (THE MATRIX OF THE MIND): A space where mathematical objects are projected into different coordinate systems (Cartesian, Spherical, Cylindrical), metrics (Euclidean vs. Manhattan/Taxicab), and theoretical frameworks (Linear Algebra vs. Complex Analysis).

--- CONCEPTUAL VISUALIZATIONS ---
- NEURAL NETWORK: Rendered as a 3D kinetic hydraulic system. Data flows as luminous fluid through glass channels. Synaptic weights are dynamic mechanical valves that constrict or dilate. Bias is a pressurizing chamber. Backpropagation is a reverse wave of colored neon light that recalibrates the valves dynamically based on error gradients.
- CATEGORY THEORY: Visualized as a stellar constellation in the upper vault of the pantheon. Objects are star clusters, Morphisms are directed light beams. Functors are massive hyper-prisms that project the structural transformations of one entire constellation onto another, preserving internal symmetries.
- TENSORS & ARRAYS: A matrix is a 3D laser cage that deforms any geometric object passing through it. Eigenvectors are the non-deforming directional axes. A Tensor is an N-dimensional hyper-rubik's-cube where slicing it along different planes yields distinct 2D matrices, showing multidimensional data covariances.
- MANIFOLDS & METRIC SPACES: Centered around a "Universal Object Altar". Place a standard sphere on it. Allow the user to toggle space metrics: in Euclidean, it's smooth; in Manhattan metric, the surrounding space warps into a rigid voxel grid, and the sphere becomes an octahedron. Toggle Complex Analysis to view the object morph into multi-layered Riemann Surfaces with branching points.
- SYMMETRY GROUPS & MECHANICS: Symmetries are glowing, rotating crystalline polyhedrons. Rational Mechanics and Physics are represented by phase-space trajectories winding around smooth differential manifolds. The principle of least action is a taut string minimizing its surface area across a field of potential energy.

--- USER INTERACTION & TONE ---
- STYLE: Hyper-clean, cinematic sci-fi minimalism (similar to Portal, Mirror's Edge, or Witness). No conversational clutter. Visual anchors must be high-contrast and geometrically precise.
- INTERACTIVE MODE: The AI acts as the game engine and omnipresent mentor. The user can fly, scale objects up to the atomic level, or scale down to a global network view. Every component must be clickable, revealing the deep mathematical "why" behind the physical "how".
- REAL-TIME CORRELATION: Moving a slider on a mathematical matrix at the top layer must instantly warp the physical electron paths in the physics layer below and change the hardware output in real-time.`;
