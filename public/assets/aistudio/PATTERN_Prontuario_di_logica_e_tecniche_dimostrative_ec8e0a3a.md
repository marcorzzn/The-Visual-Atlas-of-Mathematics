# PRONTUARIO DI LOGICA E TECNICHE DIMOSTRATIVE

## PREAMBOLO: SINTASSI, SEMANTICA E LA GARANZIA DELLE REGOLE

Prima di addentrarci nelle regole, è cruciale distinguere due livelli fondamentali:

- **Sintassi** ($\vdash$): è la manipolazione **meccanica** di simboli secondo regole prestabilite. Una dimostrazione è una sequenza di formule in cui ogni passaggio è giustificato da una regola di inferenza.
- **Semantica** ($\models$): riguarda la **verità** delle formule in un modello (cioè in una struttura matematica concreta).

La magia della logica del primo ordine risiede in due teoremi fondamentali:
- **Teorema di Correttezza** (*Soundness*): Se $\Gamma \vdash \varphi$ (cioè $\varphi$ è dimostrabile sintatticamente dalle ipotesi $\Gamma$), allora $\Gamma \models \varphi$ (in ogni modello in cui $\Gamma$ è vera, anche $\varphi$ è vera). In altre parole, **le regole preservano la verità**.
- **Teorema di Completezza** (*Completeness*): Se $\Gamma \models \varphi$, allora $\Gamma \vdash \varphi$. Ogni affermazione semanticamente vera può essere dimostrata usando solo queste regole sintattiche.

**Conseguenza pratica:** Se applichi correttamente le regole di inferenza qui elencate, è **impossibile** produrre una conclusione falsa a partire da premesse vere. L'errore umano risiede solo nell'applicazione scorretta delle regole o nell'errata interpretazione delle ipotesi.

---

## SEZIONE A – REGOLE DI INFERENZA DELLA LOGICA PROPOSIZIONALE

Le regole seguenti operano su formule costruite con connettivi logici ($\neg, \land, \lor, \implies, \iff$). Ogni regola è presentata con:
- **Nome**
- **Notazione a sequenti** $\frac{\text{Premesse}}{\text{Conclusione}}$
- **Spiegazione dello "scaricamento" delle assunzioni** (quando pertinente)
- **Esempio concreto dettagliato**

| Regola | Notazione Formale | Spiegazione e Gestione delle Assunzioni | Esempio Dettagliato |
| :--- | :--- | :--- | :--- |
| **Modus Ponens**<br>(Eliminazione dell'implicazione) | $\frac{P,\; P \implies Q}{Q}$ | Regola semplice, nessuna assunzione temporanea. Le premesse $P$ e $P \implies Q$ devono essere disponibili nel contesto corrente. | **Premessa 1:** "Se un numero è multiplo di 4, allora è pari." ($P \implies Q$)<br>**Premessa 2:** "12 è multiplo di 4." ($P$)<br>**Conclusione:** "12 è pari." ($Q$) |
| **Modus Tollens**<br>(Negazione dell'antecedente) | $\frac{\neg Q,\; P \implies Q}{\neg P}$ | Analogo al precedente, nessuna assunzione temporanea. | **Premessa 1:** "Se un triangolo è equilatero, allora ha tre lati uguali." ($P \implies Q$)<br>**Premessa 2:** "Il triangolo T non ha tre lati uguali." ($\neg Q$)<br>**Conclusione:** "Il triangolo T non è equilatero." ($\neg P$) |
| **Sillogismo Ipotetico** | $\frac{P \implies Q,\; Q \implies R}{P \implies R}$ | Nessuna assunzione temporanea. | **Premessa 1:** "Se piove, allora la strada è bagnata." ($P \implies Q$)<br>**Premessa 2:** "Se la strada è bagnata, allora è scivolosa." ($Q \implies R$)<br>**Conclusione:** "Se piove, allora la strada è scivolosa." ($P \implies R$) |
| **Sillogismo Disgiuntivo** | $\frac{P \lor Q,\; \neg P}{Q}$ | Nessuna assunzione temporanea. | **Premessa 1:** "O x è positivo, o x è negativo." ($P \lor Q$)<br>**Premessa 2:** "x non è positivo." ($\neg P$)<br>**Conclusione:** "x è negativo." ($Q$) |
| **Introduzione della Congiunzione** | $\frac{P,\; Q}{P \land Q}$ | Nessuna assunzione temporanea. | **Premessa 1:** "3 è un numero primo." ($P$)<br>**Premessa 2:** "3 è dispari." ($Q$)<br>**Conclusione:** "3 è un numero primo e dispari." ($P \land Q$) |
| **Eliminazione della Congiunzione** | $\frac{P \land Q}{P}$ oppure $\frac{P \land Q}{Q}$ | Nessuna assunzione temporanea. | **Premessa:** "Oggi è lunedì e piove." ($P \land Q$)<br>**Conclusione:** "Oggi è lunedì." ($P$) |
| **Introduzione della Disgiunzione** | $\frac{P}{P \lor Q}$ | Nessuna assunzione temporanea. La disgiunzione introdotta è "debole": da un fatto certo $P$, possiamo sempre indebolirlo affermando "$P$ o qualsiasi altra cosa". | **Premessa:** "2 è un numero pari." ($P$)<br>**Conclusione:** "2 è pari oppure 2 è negativo." ($P \lor Q$) |
| **Eliminazione della Disgiunzione**<br>(Dimostrazione per casi) | $\frac{P \lor Q \quad [P] \cdots R \quad [Q] \cdots R}{R}$ | **Assunzioni temporanee**: all'interno di ogni ramo, assumiamo $P$ (primo ramo) e $Q$ (secondo ramo). Queste assunzioni **devono essere scaricate** prima di concludere $R$. La conclusione $R$ **non deve dipendere** da $P$ o $Q$, ma solo da $P \lor Q$ e dalle altre ipotesi del contesto. | **Premessa:** "x è un numero reale positivo oppure negativo." ($P \lor Q$)<br>**Ramo 1:** Assumo $x > 0$. Allora $|x| = x \ge 0$. Quindi $|x| \ge 0$.<br>**Ramo 2:** Assumo $x < 0$. Allora $|x| = -x > 0$. Quindi $|x| \ge 0$.<br>**Conclusione (scaricate le assunzioni):** In entrambi i casi, $|x| \ge 0$. Poiché $x$ è positivo o negativo (e il caso $x=0$ è banalmente $|0|=0\ge0$), concludiamo che per ogni $x \in \mathbb{R}$, $|x| \ge 0$. |
| **Introduzione della Doppia Implicazione** | $\frac{[P] \cdots Q \quad [Q] \cdots P}{P \iff Q}$ | **Assunzioni temporanee**: nel primo ramo assumiamo $P$ e deduciamo $Q$; nel secondo assumiamo $Q$ e deduciamo $P$. Entrambe le assunzioni vengono scaricate al termine. | Per dimostrare $n$ è pari $\iff n^2$ è pari:<br>**Ramo 1:** Assumo $n$ pari. Allora $n=2k \implies n^2 = 4k^2 = 2(2k^2)$ pari.<br>**Ramo 2:** Assumo $n^2$ pari. Supponiamo per assurdo $n$ dispari $\implies n^2$ dispari, contraddizione. Quindi $n$ pari.<br>**Conclusione:** $n$ è pari se e solo se $n^2$ è pari. |
| **Eliminazione della Doppia Implicazione** | $\frac{P \iff Q}{P \implies Q}$ oppure $\frac{P \iff Q}{Q \implies P}$ | Nessuna assunzione temporanea. | **Premessa:** "Un numero è pari se e solo se è divisibile per 2."<br>**Conclusione:** "Se un numero è pari, allora è divisibile per 2." |
| **Introduzione della Negazione**<br>(Reductio ad Absurdum) | $\frac{[P] \cdots \bot}{\neg P}$ | **Assunzione temporanea**: Assumiamo $P$. Se da $P$ deriviamo una contraddizione $\bot$, allora possiamo concludere $\neg P$, **scaricando** l'assunzione $P$. | **Dimostrazione che $\sqrt{2}$ non è razionale:**<br>1. Assumiamo $P$: "$\sqrt{2} \in \mathbb{Q}$".<br>2. Allora esistono $a,b \in \mathbb{Z}$ coprimi con $\sqrt{2} = a/b$.<br>3. Quadrando: $2 = a^2/b^2 \implies a^2 = 2b^2$.<br>4. Quindi $a^2$ è pari $\implies a$ è pari. Sia $a=2k$.<br>5. Sostituendo: $4k^2 = 2b^2 \implies b^2 = 2k^2 \implies b^2$ pari $\implies b$ pari.<br>6. Ma $a$ e $b$ entrambi pari contraddice l'ipotesi che fossero coprimi.<br>7. Abbiamo ottenuto $\bot$. **Scarichiamo** l'assunzione $P$ e concludiamo $\neg P$: $\sqrt{2} \notin \mathbb{Q}$. |
| **Eliminazione della Doppia Negazione** | $\frac{\neg \neg P}{P}$ | In logica classica, la doppia negazione equivale all'affermazione. | **Premessa:** "Non è vero che 2 non è un numero primo." ($\neg\neg P$)<br>**Conclusione:** "2 è un numero primo." ($P$) |
| **Principio di Esplosione**<br>(Ex falso quodlibet) | $\frac{\bot}{Q}$ | Da una contraddizione, ogni enunciato è derivabile. Nelle dimostrazioni pratiche, questo principio viene usato solo per segnalare che un'assunzione è insostenibile. | Se in una dimostrazione si giunge a "$0=1$ e $0\neq 1$", allora qualsiasi enunciato $Q$ potrebbe essere "dimostrato", ma ciò indica semplicemente che le premesse sono inconsistenti. |

---

## SEZIONE B – NEGAZIONE DI ENUNCIATI COMPLESSI: LEGGI DI DE MORGAN E NEGAZIONE DELL'IMPLICAZIONE

**Errore comune:** Negare un enunciato quantificato o un'implicazione senza trasformarlo correttamente. Le seguenti equivalenze logiche sono **necessarie** per applicare correttamente la dimostrazione per assurdo o per trovare un controesempio.

| Enunciato Originale | Negazione Corretta | Spiegazione |
| :--- | :--- | :--- |
| $\forall x \in X, P(x)$ | $\exists x \in X, \neg P(x)$ | "Non è vero che tutti hanno la proprietà $P$" significa che "esiste almeno un elemento che **non** ha la proprietà $P$". |
| $\exists x \in X, P(x)$ | $\forall x \in X, \neg P(x)$ | "Non esiste alcun elemento con proprietà $P$" equivale a "tutti gli elementi **non** hanno la proprietà $P$". |
| $P \implies Q$ | $P \land \neg Q$ | **Fondamentale**: la negazione di un'implicazione **non è** un'altra implicazione. Dire che "$P$ implica $Q$" è falso significa che esiste un caso in cui $P$ è vero **ma** $Q$ è falso. |
| $P \lor Q$ | $\neg P \land \neg Q$ | Legge di De Morgan classica. |
| $P \land Q$ | $\neg P \lor \neg Q$ | Legge di De Morgan classica. |
| $\forall x \in X, \exists y \in Y, P(x,y)$ | $\exists x \in X, \forall y \in Y, \neg P(x,y)$ | La negazione si propaga scambiando i quantificatori. |

**Esempio dettagliato di negazione errata e corretta:**

- **Enunciato:** "Ogni numero primo è dispari."
- **Formalizzazione:** $\forall p \in \mathbb{P}, p \text{ è dispari}$.
- **Negazione errata (comune tra i principianti):** "Ogni numero primo non è dispari" (cioè "Tutti i primi sono pari"), che è palesemente falsa e non smentisce l'originale.
- **Negazione corretta (applicando la regola):** $\exists p \in \mathbb{P}, \neg(p \text{ è dispari})$, cioè "Esiste un numero primo che **non** è dispari", ovvero "Esiste un numero primo pari".
- **Controesempio:** $p=2$. Poiché 2 è primo e pari, l'enunciato originale è falso.

---

## SEZIONE C – VERITÀ A VUOTO (VACUOUS TRUTH)

Uno dei concetti più controintuitivi ma indispensabili della logica formale è la **verità a vuoto**: un enunciato della forma $\forall x \in \emptyset, P(x)$ o $P \implies Q$ con premessa falsa è considerato **automaticamente vero**.

### Definizione formale

- **Implicazione:** $P \implies Q$ è vero se $P$ è falso, **indipendentemente** dal valore di verità di $Q$.
- **Quantificatore universale su insieme vuoto:** $\forall x \in \emptyset, P(x)$ è sempre vero, perché non esiste alcun elemento nell'insieme vuoto che possa falsificare $P(x)$.

### Perché è utile

La verità a vuoto è essenziale per dimostrare affermazioni come:
- **L'insieme vuoto è sottoinsieme di ogni insieme $A$:** $\emptyset \subseteq A$. Infatti, l'enunciato da dimostrare è $\forall x (x \in \emptyset \implies x \in A)$. Poiché la premessa $x \in \emptyset$ è sempre falsa, l'implicazione è vacuamente vera per ogni $x$.
- **Proprietà di base dell'induzione:** Il passo base per $n=0$ spesso coinvolge un insieme vuoto di elementi.

### Esempi concreti

**Esempio 1: Insieme vuoto**
- **Enunciato:** "Tutti i numeri reali $x$ tali che $x^2 < 0$ sono maggiori di 100."
- **Formalizzazione:** Sia $S = \{x \in \mathbb{R} \mid x^2 < 0\}$. Poiché $S = \emptyset$, l'enunciato $\forall x \in S, x > 100$ è **vacuamente vero**. Non esiste alcun controesempio in $S$ che possa renderlo falso.

**Esempio 2: Implicazione con premessa impossibile**
- **Enunciato:** "Se 0 = 1, allora io sono il Papa."
- **Analisi:** La premessa "$0=1$" è falsa (in aritmetica standard). L'implicazione è quindi **vacuamente vera**, sebbene la conclusione sia palesemente falsa nel mondo reale. La verità dell'implicazione non ci dice nulla sulla verità della conclusione; ci dice solo che **non esiste una situazione in cui la premessa è vera e la conclusione è falsa**.

**Esempio 3: Applicazione in una dimostrazione**
- **Tesi:** Per ogni funzione $f: \emptyset \to B$, $f$ è iniettiva.
- **Dimostrazione:** Ricordiamo la definizione di iniettività: $\forall x_1, x_2 \in \emptyset, (f(x_1)=f(x_2) \implies x_1 = x_2)$.
- Poiché il dominio è vuoto, non esistono $x_1, x_2 \in \emptyset$. Qualsiasi affermazione che inizia con "$\forall x_1, x_2 \in \emptyset$" è vacuamente vera. Quindi $f$ è iniettiva per definizione (e anche suriettiva, se il codominio è anch'esso vuoto).

---

## SEZIONE D – REGOLE DI INFERENZA PER I QUANTIFICATORI (LOGICA DEL PRIMO ORDINE)

Queste regole governano l'introduzione e l'eliminazione dei quantificatori $\forall$ ed $\exists$. La notazione a sequenti evidenzia il meccanismo di **scaricamento** delle assunzioni temporanee.

| Regola | Notazione Formale | Spiegazione e Gestione delle Assunzioni | Esempio Dettagliato |
| :--- | :--- | :--- | :--- |
| **Introduzione del Quantificatore Universale**<br>($\forall$-Intro / Universal Generalization) | $\frac{\Gamma \vdash P(x_0) \quad (x_0 \text{ non libero in } \Gamma)}{\Gamma \vdash \forall x P(x)}$ | **Condizione critica:** La variabile $x_0$ **non deve apparire libera** in nessuna delle ipotesi in $\Gamma$. Questo garantisce che $x_0$ sia veramente "arbitrario" e non un elemento con proprietà speciali. | **Ipotesi ($\Gamma$)**: nessuna ipotesi su $n$.<br>**Dimostrazione:** Sia $n$ un numero pari generico. Allora $n = 2k$ per qualche $k \in \mathbb{Z}$. Quindi $n^2 = 4k^2 = 2(2k^2)$, che è pari. Poiché $n$ era arbitrario e non abbiamo usato alcuna proprietà particolare se non la definizione di "pari", possiamo concludere $\forall n (\text{pari}(n) \implies \text{pari}(n^2))$. |
| **Eliminazione del Quantificatore Universale**<br>($\forall$-Elim / Universal Instantiation) | $\frac{\forall x P(x)}{P(t)}$ (per qualsiasi termine $t$) | Nessuna assunzione temporanea. Possiamo sostituire $x$ con qualsiasi termine (costante, variabile, espressione) purché non si creino conflitti di variabili. | **Premessa:** $\forall x \in \mathbb{R}, x^2 \ge 0$.<br>**Istanziazione:** Scegliamo $t = -5$. Otteniamo $(-5)^2 \ge 0$, cioè $25 \ge 0$.<br>Possiamo anche istanziare con $t = y+1$ ottenendo $(y+1)^2 \ge 0$. |
| **Introduzione del Quantificatore Esistenziale**<br>($\exists$-Intro) | $\frac{P(t)}{\exists x P(x)}$ | Nessuna assunzione temporanea. Se abbiamo un esempio concreto $t$ che soddisfa $P$, possiamo concludere l'esistenza. | **Premessa:** Sappiamo che $f(3) = 9$.<br>**Conclusione:** $\exists x \in \mathbb{R}, f(x) = 9$. |
| **Eliminazione del Quantificatore Esistenziale**<br>($\exists$-Elim) | $\frac{\exists x P(x) \quad \Gamma, [P(x_0)] \cdots Q}{\Gamma \vdash Q}$<br>**Condizione:** $x_0$ è una **variabile fresca** (non appare libera in $\Gamma$, in $Q$, né in altre assunzioni aperte). | **Assunzione temporanea:** Introduciamo un "testimone" $x_0$ che soddisfa $P(x_0)$. Questa assunzione è **locale** al ramo della dimostrazione. Alla fine, la conclusione $Q$ **non deve dipendere da $x_0$**. Se riusciamo a derivare $Q$ usando solo l'esistenza di un tale $x_0$ senza sfruttare la sua identità specifica, allora $Q$ segue da $\exists x P(x)$. | **Premessa:** "Esiste un numero primo pari." ($\exists p (\text{Primo}(p) \land \text{Pari}(p))$)<br>**Dimostrazione:**<br>1. Sia $p_0$ un tale numero primo pari (nuova variabile, assunzione temporanea).<br>2. Per definizione di "primo", $p_0$ ha solo 1 e se stesso come divisori.<br>3. Poiché $p_0$ è pari, $2$ è un divisore di $p_0$. Quindi $p_0 = 2$.<br>4. Abbiamo dedotto che $p_0 = 2$, e questa affermazione non contiene più $p_0$ come variabile libera? Attenzione: in realtà abbiamo dedotto $p_0 = 2$, che dipende da $p_0$. Per scaricare l'assunzione, dobbiamo avere una conclusione $Q$ che **non menzioni $p_0$**. In questo caso, da $p_0 = 2$ possiamo dedurre "2 è un numero primo pari" ($Q$), che non contiene $p_0$.<br>5. **Scarichiamo** l'assunzione $P(p_0)$ e concludiamo $Q$ basandoci solo su $\exists x P(x)$ e sulle altre ipotesi. |

---

## SEZIONE E – MAPPA RAGIONATA DEGLI SCHEMI DIMOSTRATIVI

Questa sezione associa la forma logica della tesi allo schema dimostrativo, utilizzando le regole di inferenza delle sezioni precedenti.

| Forma della Tesi | Nome dello Schema | Schema Operativo (in notazione logica) | Esempio Concreto Dettagliato |
| :--- | :--- | :--- | :--- |
| $\forall x \in X,\; P(x)$ | **Generalizzazione Universale** | 1. Scegli un $x_0 \in X$ **arbitrario** (nuova variabile non libera nelle ipotesi).<br>2. Dimostra $P(x_0)$ **usando solo il fatto che $x_0 \in X$**.<br>3. Concludi $\forall x \in X, P(x)$ per $\forall$-Intro. | **Tesi:** Per ogni numero reale $x$, se $x > 0$ allora $x^2 > 0$.<br>**Dim:** Sia $x_0 \in \mathbb{R}$ un numero reale positivo generico. Poiché $x_0 > 0$, moltiplicando entrambi i membri per $x_0$ (che è positivo e quindi mantiene il verso della disuguaglianza) otteniamo $x_0 \cdot x_0 > 0 \cdot x_0 \implies x_0^2 > 0$. Poiché $x_0$ era arbitrario, la proprietà vale per ogni $x > 0$. |
| $\exists x \in X,\; P(x)$ | **Costruzione Diretta** | **Approccio 1 (Costruttivo):** Esibire esplicitamente un $x_0 \in X$ e verificare $P(x_0)$. Applicare $\exists$-Intro.<br>**Approccio 2 (Non costruttivo):** Supporre $\forall x \in X, \neg P(x)$ e derivare una contraddizione con le ipotesi. | **Tesi:** L'equazione $x^3 - x - 1 = 0$ ha almeno una soluzione reale.<br>**Dim. non costruttiva:** Sia $f(x) = x^3 - x - 1$. Osserviamo che $f(1) = 1 - 1 - 1 = -1 < 0$ e $f(2) = 8 - 2 - 1 = 5 > 0$. Poiché $f$ è continua, per il Teorema dei Valori Intermedi esiste $c \in (1,2)$ tale che $f(c)=0$. Non sappiamo esattamente quanto vale $c$, ma sappiamo che esiste. |
| $P \implies Q$ | **Dimostrazione Diretta** | 1. Assumi $P$ vero.<br>2. Deriva $Q$ usando deduzioni valide.<br>3. Concludi $P \implies Q$. | **Tesi:** Se $n$ è un intero dispari, allora $n^2$ è dispari.<br>**Dim:** Assumiamo $n$ dispari. Allora $n = 2k + 1$ per qualche $k \in \mathbb{Z}$. Quindi $n^2 = (2k+1)^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1$. Poiché $2k^2 + 2k$ è un intero, $n^2$ è della forma $2m+1$, cioè dispari. |
| $P \implies Q$ | **Contronominale** | 1. Assumi $\neg Q$ vero.<br>2. Deriva $\neg P$.<br>3. Concludi $\neg Q \implies \neg P \equiv P \implies Q$. | **Tesi:** Se $n^2$ è pari, allora $n$ è pari (con $n \in \mathbb{Z}$).<br>**Dim:** Assumiamo che $n$ **non** sia pari, cioè $n$ è dispari. Allora, come mostrato sopra, $n^2$ è dispari. Quindi $\neg Q$ ($n$ non pari) implica $\neg P$ ($n^2$ non pari). Per contronominale, $P \implies Q$. |
| $P \implies \text{Falso}$ (o "Non esiste $x$ t.c. $P(x)$") | **Dimostrazione per Assurdo** | 1. Supponi la **negazione della tesi** (usando correttamente le leggi di De Morgan!).<br>2. Deriva una contraddizione (es. $R \land \neg R$).<br>3. Applica $\neg$-Intro per concludere la negazione dell'assunzione, quindi la tesi. | **Tesi:** Non esiste un numero razionale $r$ tale che $r^2 = 2$.<br>**Dim:** Supponiamo per assurdo che esista $r \in \mathbb{Q}$ con $r^2 = 2$. Allora $r = a/b$ con $a,b \in \mathbb{Z}$ coprimi. Da $a^2 = 2b^2$ deduciamo $a$ pari, quindi $a=2k$. Sostituendo, $4k^2 = 2b^2 \implies b^2 = 2k^2$, quindi $b$ pari. Ma allora $a$ e $b$ sono entrambi pari, contraddicendo l'ipotesi che siano coprimi. Assurdo. Quindi tale $r$ non esiste. |
| $\forall n \in \mathbb{N},\; P(n)$ | **Induzione Matematica** | 1. **Base:** Verifica $P(0)$ (o $P(1)$).<br>2. **Passo Induttivo:** Assumi $P(k)$ vero per un $k$ arbitrario. Dimostra $P(k+1)$.<br>3. Concludi $\forall n, P(n)$ per il principio di induzione. | **Tesi:** Per ogni $n \in \mathbb{N}$, $\sum_{i=1}^n i = \frac{n(n+1)}{2}$.<br>**Base ($n=1$):** $1 = 1(2)/2$, vero.<br>**Passo:** Supponiamo $\sum_{i=1}^k i = \frac{k(k+1)}{2}$ (Ipotesi Induttiva). Allora $\sum_{i=1}^{k+1} i = \frac{k(k+1)}{2} + (k+1) = \frac{k(k+1) + 2(k+1)}{2} = \frac{(k+1)(k+2)}{2}$. La formula vale per $k+1$.<br>Per induzione, la formula vale per ogni $n$. |
| $P(x)$ con $x$ in un dominio diviso in casi | **Dimostrazione per Casi**<br>($\lor$-Eliminazione) | 1. Partiziona il dominio in $C_1 \cup C_2 \cup \dots \cup C_k$ esaustivi.<br>2. Per ogni caso $C_i$, assumi $x \in C_i$ e dimostra $P(x)$.<br>3. Applica $\lor$-Elim ripetutamente per concludere $P(x)$ in tutti i casi. | **Tesi:** Per ogni $x \in \mathbb{R}$, $|x| \ge x$.<br>**Caso 1:** $x \ge 0$. Allora $|x| = x$, quindi $|x| \ge x$ è vera (in realtà $|x| = x$, quindi $\ge$).<br>**Caso 2:** $x < 0$. Allora $|x| = -x$. Poiché $x < 0$, abbiamo $-x > 0 > x$, quindi $|x| = -x > x$, e quindi $|x| \ge x$.<br>In entrambi i casi, $|x| \ge x$. |
| $\neg (\forall x, P(x))$ (ovvero "La tesi universale è falsa") | **Controesempio**<br>($\exists$-Intro su negazione) | 1. Negare l'enunciato universale usando De Morgan: $\exists x \in X, \neg P(x)$.<br>2. Fornire **un singolo** $x_0 \in X$ tale che $P(x_0)$ è falso.<br>3. Concludere che l'enunciato originale è falso. | **Affermazione:** "Tutti i numeri primi sono dispari."<br>**Negazione:** $\exists p \in \mathbb{P}, \neg(p \text{ è dispari})$, cioè "Esiste un numero primo pari".<br>**Controesempio:** $p=2$. 2 è primo e pari, quindi non è dispari. L'affermazione originale è falsa. |
| $A = B$ (Uguaglianza insiemistica) | **Doppia Inclusione** | 1. Dimostra $A \subseteq B$: $\forall x (x \in A \implies x \in B)$.<br>2. Dimostra $B \subseteq A$: $\forall x (x \in B \implies x \in A)$.<br>3. Concludi $A=B$ per estensionalità. | **Tesi:** $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$.<br>**Inclusione $\subseteq$:** Sia $x \in A \cap (B \cup C)$. Allora $x \in A$ e $x \in B \cup C$. Se $x \in B$, allora $x \in A \cap B$. Se $x \in C$, allora $x \in A \cap C$. In entrambi i casi $x \in (A \cap B) \cup (A \cap C)$.<br>**Inclusione $\supseteq$:** Esercizio analogo. |
| $A \subset B$ (Inclusione stretta) | **Inclusione Stretta** | 1. Dimostra $A \subseteq B$.<br>2. Esibisci **esplicitamente** un elemento $y \in B$ con $y \notin A$. | **Tesi:** $\mathbb{N} \subset \mathbb{Z}$.<br>1. Ovviamente ogni naturale è un intero, quindi $\mathbb{N} \subseteq \mathbb{Z}$.<br>2. Scegliamo $y = -1$. $-1 \in \mathbb{Z}$ ma $-1 \notin \mathbb{N}$. Quindi l'inclusione è stretta. |
| $\exists! x \in X,\; P(x)$ (Esistenza e Unicità) | **Dimostrazione di Unicità** | 1. **Esistenza:** Dimostra $\exists x \in X: P(x)$.<br>2. **Unicità:** Assumi $\exists x_1, x_2$ t.c. $P(x_1)$ e $P(x_2)$. Deriva $x_1 = x_2$. | **Tesi:** Esiste un unico elemento neutro per l'addizione in $\mathbb{R}$.<br>**Esistenza:** 0 è elemento neutro perché $x+0=x$ per ogni $x$.<br>**Unicità:** Supponiamo esistano due elementi neutri $e_1$ e $e_2$. Allora $e_1 = e_1 + e_2$ (poiché $e_2$ è neutro) $= e_2$ (poiché $e_1$ è neutro). Quindi $e_1 = e_2$. |
| $A = \emptyset$ (Insieme vuoto) | **Assurdo di Esistenza** | 1. Supponi $\exists x \in A$.<br>2. Deriva una contraddizione usando le proprietà di $A$.<br>3. Concludi $\neg \exists x \in A \equiv A=\emptyset$. | **Tesi:** L'insieme $S = \{x \in \mathbb{R} \mid x^2 < 0\} = \emptyset$.<br>**Dim:** Supponiamo esista $x \in S$. Allora $x^2 < 0$. Ma per ogni $x \in \mathbb{R}$, $x^2 \ge 0$. Contraddizione. Quindi $S$ non ha elementi. |

---

## SEZIONE F – STRUMENTI PER OGGETTI SPECIFICI (Funzioni e Relazioni)

| Proprietà da Dimostrare | Schema Formale | Esempio Dettagliato |
| :--- | :--- | :--- |
| **Iniettività** di $f: X \to Y$ | $\forall x_1, x_2 \in X, \; (f(x_1)=f(x_2) \implies x_1 = x_2)$<br>**Operativamente:**<br>1. "Siano $x_1, x_2 \in X$ arbitrari."<br>2. "Supponiamo $f(x_1)=f(x_2)$."<br>3. "Deriviamo $x_1 = x_2$ usando le proprietà di $f$." | **Tesi:** $f: \mathbb{R} \to \mathbb{R}$ definita da $f(x) = 2x + 1$ è iniettiva.<br>**Dim:** Siano $x_1, x_2 \in \mathbb{R}$ tali che $f(x_1) = f(x_2)$. Allora $2x_1 + 1 = 2x_2 + 1$. Sottraendo 1 da entrambi i membri: $2x_1 = 2x_2$. Dividendo per 2 (che è diverso da 0): $x_1 = x_2$. Quindi $f$ è iniettiva. |
| **Suriettività** di $f: X \to Y$ | $\forall y \in Y, \; \exists x \in X \text{ t.c. } f(x)=y$<br>**Operativamente:**<br>1. "Sia $y \in Y$ un elemento **arbitrario**."<br>2. "Costruisco (o provo l'esistenza di) un $x \in X$ tale che $f(x)=y$." | **Tesi:** $f: \mathbb{R} \to \mathbb{R}$ definita da $f(x) = x^3$ è suriettiva.<br>**Dim:** Sia $y \in \mathbb{R}$ un numero reale qualsiasi. Cerchiamo $x \in \mathbb{R}$ tale che $x^3 = y$. La funzione radice cubica è definita per ogni reale: scegliamo $x = \sqrt[3]{y}$. Allora $f(x) = (\sqrt[3]{y})^3 = y$. Poiché $y$ era arbitrario, $f$ è suriettiva. |

---

## SEZIONE G – EURISTICHE AVANZATE E PRINCIPI DI ESISTENZA

| Tattica | Descrizione Formale/Concettuale | Esempio di Applicazione |
| :--- | :--- | :--- |
| **Lavorare all'Indietro** (*Backward Reasoning*) | Partire dalla conclusione $Q$. Chiedersi: "Quale regola di inferenza potrebbe produrre $Q$? Cosa serve come premessa per quella regola?" Iterare fino a raggiungere le ipotesi note $P$. | **Problema:** Dimostrare che se $g \circ f$ è suriettiva, allora $g$ è suriettiva.<br>**Obiettivo:** Dato $c \in C$, trovare $b \in B$ con $g(b)=c$.<br>**Ragionamento all'indietro:**<br>- Per ottenere $g(b)=c$, potremmo usare la suriettività di $g \circ f$: essa ci dice che per ogni $c' \in C$, esiste $a \in A$ con $g(f(a)) = c'$.<br>- Se volessimo $g(f(a)) = c$, dovremmo avere $c' = c$. Ma $g \circ f$ ci dà $g(f(a))$ per qualche $a$.<br>- In realtà, vogliamo $g(b)=c$. Possiamo porre $b = f(a)$ per l'$a$ fornito da $g \circ f$. Ma quale $c'$ usare? Scegliamo $c' = c$ stesso. Allora esiste $a \in A$ con $g(f(a)) = c$. Definiamo $b = f(a)$. Allora $g(b) = c$. Fatto. |
| **Il Principio dei Cassetti** (*Pigeonhole Principle*) | Se $\lvert A \rvert = n$, $\lvert B \rvert = m$ e $n > m$, allora non esiste una funzione iniettiva $f: A \to B$. Formalmente: $\forall f: A \to B$, $\exists a_1 \neq a_2 \in A$ con $f(a_1)=f(a_2)$. | **Tesi:** In un gruppo di 13 persone, almeno due compiono gli anni nello stesso mese.<br>**Dim:** Consideriamo la funzione $f: \text{Persone} \to \text{Mesi}$ che associa a ogni persona il suo mese di nascita. Il dominio ha 13 elementi, il codominio 12. Poiché $13 > 12$, $f$ non può essere iniettiva. Quindi esistono due persone distinte con lo stesso mese di nascita. |
| **Il Principio del Buon Ordinamento** | Ogni sottoinsieme non vuoto $S \subseteq \mathbb{N}$ ha un elemento minimo. Usato per **dimostrazioni per assurdo** con "minimo controesempio". | **Tesi:** Ogni numero naturale $n > 1$ è prodotto di numeri primi.<br>**Dim:** Supponiamo per assurdo che l'insieme $S$ dei numeri naturali $>1$ che **non** sono prodotto di primi sia non vuoto. Per il principio del buon ordinamento, $S$ ha un minimo $m$. Poiché $m \in S$, $m$ non è primo (altrimenti sarebbe prodotto di un solo primo). Quindi $m = a \cdot b$ con $1 < a, b < m$. Poiché $a,b < m$, essi non appartengono a $S$ (per minimalità di $m$). Quindi $a$ e $b$ sono prodotto di primi. Ma allora anche $m = a \cdot b$ è prodotto di primi, contraddicendo $m \in S$. Quindi $S$ deve essere vuoto. |
| **Analisi dei Casi Limite** | Testare la validità di un enunciato su esempi **estremi o degeneri** (insiemi con 1 elemento, funzioni costanti, $n=0$, ecc.) per rivelare la struttura logica nascosta. | **Enunciato:** Se $g \circ f$ è suriettiva, allora $g$ è suriettiva.<br>**Test limite:** Sia $A = \{1\}$, $B = \{1, 2\}$, $C = \{1\}$. Definiamo $f(1) = 1$, $g(1) = 1$, $g(2) = 1$. Allora $g \circ f(1) = g(1) = 1$, quindi $g \circ f$ è suriettiva su $C$. $g$ è suriettiva su $C$? Sì, perché $g(1)=1$ e $g(2)=1$, quindi ogni elemento di $C$ ha una preimmagine. Ma $f$ non è suriettiva perché 2 non ha preimmagine. Questo caso limite mostra che la suriettività di $g \circ f$ implica la suriettività di $g$, ma **non** implica la suriettività di $f$. |

---

## SEZIONE H – ALGORITMO DECISIONALE PER LA COSTRUZIONE DI DIMOSTRAZIONI

Questa sezione presenta una procedura strutturata per affrontare un problema dimostrativo. Il formato è descrittivo ma può essere facilmente trasformato in un diagramma di flusso (flowchart).

### Schema a Blocchi Testuale (Flowchart Logico)

```
                        +---------------------------+
                        | 1. FORMALIZZAZIONE        |
                        | Scrivi Ipotesi e Tesi     |
                        | usando SOLO simboli       |
                        | logici (∀, ∃, ⇒, ∧, ∨)   |
                        +------------+--------------+
                                     |
                                     v
                        +---------------------------+
                        | 2. SROTOLAMENTO DEFINIZIONI|
                        | Espandi ogni termine      |
                        | tecnico nella sua         |
                        | definizione primitiva.    |
                        +------------+--------------+
                                     |
                                     v
                        +---------------------------+
                        | 3. ANALISI FORMA DELLA TESI|
                        | Identifica la struttura   |
                        | logica principale.        |
                        +------------+--------------+
                                     |
         +-------------+-------------+-------------+-------------+
         |             |             |             |             |
         v             v             v             v             v
   +-----------+ +-----------+ +-----------+ +-----------+ +-----------+
   |Tesi: ∀xP(x)| |Tesi: ∃xP(x)| |Tesi: P⇒Q  | |Tesi: ¬P   | |Tesi: P∧Q  |
   +-----+-----+ +-----+-----+ +-----+-----+ +-----+-----+ +-----+-----+
         |             |             |             |             |
         v             v             v             v             v
   +-----------+ +-----------+ +-----------+ +-----------+ +-----------+
   |Gen. Univ. | |Costruzione| |Diretta o  | |Assurdo:   | |Dimostra P |
   |Scegli x0  | |Esibisci t | |Contronom. | |assumi P e | |e Q separ. |
   |arbitrario | |oppure     | |Scegli in  | |deriva ⊥   | |poi ∧-Intro|
   +-----------+ |Assurdo su | |base a     | +-----------+ +-----------+
                 |∀x¬P(x)    | |difficoltà | 
                 +-----------+ +-----------+
                                     |
                                     v
                        +---------------------------+
                        | 4. APPLICAZIONE SCHEMA    |
                        | Scrivi la prima frase     |
                        | standard dello schema     |
                        | scelto.                   |
                        +------------+--------------+
                                     |
                                     v
                        +---------------------------+
                        | 5. SVILUPPO DEDUTTIVO     |
                        | Applica regole di         |
                        | inferenza (Sez. A e D)    |
                        | per connettere ipotesi    |
                        | a conclusione.            |
                        +------------+--------------+
                                     |
                                     v
                        +---------------------------+
                        | 6. BLOCCO?                |
                        | Poni le domande:          |
                        | - Quale ipotesi non ho    |
                        |   ancora usato?           |
                        | - Quale definizione non   |
                        |   ho srotolato?           |
                        +------------+--------------+
                                     |
                      +--------------+--------------+
                      |                             |
                      v                             v
           +---------------------+      +-------------------------+
           | 6a. Prova Diretta   |      | 6b. Cambio Strategia    |
           | Continua con le     |      | Prova Assurdo: nega     |
           | deduzioni.          |      | la tesi (usando De      |
           |                     |      | Morgan!) e cerca        |
           |                     |      | contraddizione.         |
           +---------------------+      +-------------------------+
                      |                             |
                      +--------------+--------------+
                                     |
                                     v
                        +---------------------------+
                        | 7. CONCLUSIONE           |
                        | Scrivi "Quindi..." e      |
                        | verifica che tutti gli    |
                        | assunti temporanei siano  |
                        | stati scaricati.          |
                        +---------------------------+
```

### Descrizione Dettagliata dei Blocchi

**Blocco 1 – Formalizzazione:** Trasforma il problema in linguaggio simbolico puro. Esempio: "Sia $f: A \to B$ suriettiva" diventa $\forall b \in B, \exists a \in A, f(a)=b$.

**Blocco 2 – Srotolamento Definizioni:** Sostituisci ogni termine definito con la sua definizione formale completa. Questo passaggio è cruciale: molti blocchi derivano dal trattare una definizione come una scatola nera.

**Blocco 3 – Analisi Forma della Tesi:** Determina il quantificatore o connettivo principale della tesi. La mappa della Sezione E fornisce la corrispondenza con lo schema.

**Blocco 4 – Applicazione Schema:** Inizia la dimostrazione con la frase rituale dello schema. Ad esempio, per $\forall x P(x)$: "Sia $x_0$ un elemento arbitrario di $X$".

**Blocco 5 – Sviluppo Deduttivo:** È la fase centrale. Si concatenano le regole di inferenza. Se si usa un'assunzione temporanea (es. per $\exists$-Elim o $\lor$-Elim), bisogna ricordarsi di scaricarla prima della conclusione.

**Blocco 6 – Gestione del Blocco:** Se non si riesce a procedere, verificare:
- Ipotesi non utilizzate: spesso la soluzione richiede di usare **tutte** le ipotesi.
- Definizioni non srotolate: a volte la definizione nasconde una struttura $\forall \exists$ che suggerisce un'istanziazione.
- Se tutto fallisce, considerare la **dimostrazione per assurdo**: negare la tesi (usando correttamente De Morgan!) e cercare una contraddizione con le ipotesi. L'assurdo è spesso la via d'uscita quando la costruzione diretta sembra impossibile.

**Blocco 7 – Conclusione:** Formalizzare il risultato e assicurarsi che nessuna variabile temporanea o assunzione non scaricata rimanga nel contesto finale.

---

## SEZIONE I – ESEMPIO DI APPLICAZIONE COMPLETA

**Teorema:** Siano $f: A \to B$ e $g: B \to C$ funzioni. Se $g \circ f$ è suriettiva, allora $g$ è suriettiva.

**Applicazione dell'algoritmo passo per passo:**

1. **Formalizzazione:**
   - Ipotesi: $\forall c \in C, \exists a \in A \text{ t.c. } (g \circ f)(a) = c$.
   - Tesi: $\forall c \in C, \exists b \in B \text{ t.c. } g(b) = c$.

2. **Srotolamento definizioni:**
   - $(g \circ f)(a) = g(f(a))$ per definizione di composizione.
   - Suriettività di $g$: $\forall c \in C, \exists b \in B, g(b)=c$.

3. **Analisi forma della tesi:**
   - La tesi è della forma $\forall c \in C, \exists b \in B \dots$ → **Generalizzazione Universale** seguita da **Costruzione**.

4. **Applicazione schema:**
   - "Sia $c \in C$ un elemento arbitrario."

5. **Sviluppo deduttivo:**
   - Dall'ipotesi di suriettività di $g \circ f$, applicando $\forall$-Elim su $c$: $\exists a \in A \text{ t.c. } g(f(a)) = c$.
   - Applichiamo $\exists$-Elim: scegliamo un $a_0 \in A$ (nuova variabile) tale che $g(f(a_0)) = c$. **Attenzione:** $a_0$ è un'assunzione temporanea.
   - Definiamo $b := f(a_0)$. Chiaramente $b \in B$.
   - Verifichiamo: $g(b) = g(f(a_0)) = c$.
   - Abbiamo dimostrato $\exists b \in B, g(b)=c$. Questa affermazione non contiene $a_0$ (la variabile temporanea è stata "scaricata" perché la conclusione non dipende dallo specifico $a_0$, ma solo dalla sua esistenza).

6. **Conclusione:**
   - Poiché $c$ era arbitrario, per $\forall$-Intro concludiamo $\forall c \in C, \exists b \in B, g(b)=c$. Quindi $g$ è suriettiva.

**Osservazione:** La dimostrazione è puramente meccanica dopo il riconoscimento degli schemi. La difficoltà risiede solo nell'identificare correttamente la struttura logica e nell'applicare le regole di inferenza con rigore.

---

## SEZIONE J – RIEPILOGO VISIVO DELLE REGOLE DI NEGAZIONE (De Morgan per Quantificatori)

| Enunciato | Negazione |
| :--- | :--- |
| Tutti i $P$ sono $Q$ | Esiste un $P$ che non è $Q$ |
| Esiste un $P$ che è $Q$ | Tutti i $P$ non sono $Q$ |
| $P \implies Q$ | $P$ e non $Q$ |
| $P \land Q$ | Non $P$ o non $Q$ |
| $P \lor Q$ | Non $P$ e non $Q$ |

**Esempio di errore comune e correzione:**
- **Enunciato:** "Se una funzione è derivabile, allora è continua."
- **Negazione errata:** "Se una funzione non è derivabile, allora non è continua." (Falso!)
- **Negazione corretta:** "Esiste una funzione derivabile che **non** è continua." (Falso, perché in realtà è vero che derivabile implica continua, quindi la negazione è falsa).

---

## SEZIONE K – VERITÀ A VUOTO: ESEMPI AGGIUNTIVI

**Esempio 4: Proprietà di sottoinsiemi**
- **Enunciato:** $\emptyset \subseteq A$ per ogni insieme $A$.
- **Dimostrazione formale:** Dobbiamo mostrare $\forall x (x \in \emptyset \implies x \in A)$. Sia $x$ un elemento arbitrario. L'antecedente $x \in \emptyset$ è falso. Per la tavola di verità dell'implicazione, l'enunciato $x \in \emptyset \implies x \in A$ è vero. Quindi l'enunciato universale è vero.

**Esempio 5: Funzione con dominio vuoto**
- **Enunciato:** Ogni funzione $f: \emptyset \to B$ è sia iniettiva che suriettiva (se $B = \emptyset$).
- **Iniettività:** $\forall x_1, x_2 \in \emptyset, f(x_1)=f(x_2) \implies x_1 = x_2$. Vacuamente vero perché non esistono $x_1, x_2 \in \emptyset$.
- **Suriettività:** $\forall b \in B, \exists a \in \emptyset, f(a)=b$. Se $B \neq \emptyset$, la suriettività è falsa (perché esiste $b \in B$ senza preimmagine). Se $B = \emptyset$, allora l'enunciato è vacuamente vero per il quantificatore universale su $B$ vuoto.

---

**Nota finale:** Questo prontuario è uno strumento di consultazione. La padronanza si acquisisce solo con l'esercizio costante, applicando consapevolmente ogni schema e regola a problemi sempre nuovi. Con il tempo, l'identificazione dello schema e l'applicazione delle regole diventeranno automatiche.