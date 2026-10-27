import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sliders, RotateCcw, Box, Sparkles } from 'lucide-react';

export const TensorEllipsoidLab: React.FC = () => {
  // Symmetric Rank-2 Tensor components
  const [xx, setXx] = useState<number>(1.5);
  const [yy, setYy] = useState<number>(1.0);
  const [zz, setZz] = useState<number>(0.8);
  const [xy, setXy] = useState<number>(0.5);
  const [xz, setXz] = useState<number>(0.2);
  const [yz, setYz] = useState<number>(0.0);

  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneObjectsRef = useRef<{
    ellipsoidGroup: THREE.Group;
    arrowX: THREE.ArrowHelper;
    arrowY: THREE.ArrowHelper;
    arrowZ: THREE.ArrowHelper;
  } | null>(null);

  // Compute Tensor Invariants (I1 = Trace, I2, I3 = Det) and Principal Eigenvalues (Cardano/Analytical)
  const invariants = useMemo(() => {
    const tr = xx + yy + zz;
    const i2 = xx * yy + yy * zz + zz * xx - xy * xy - yz * yz - xz * xz;
    const det =
      xx * (yy * zz - yz * yz) -
      xy * (xy * zz - yz * xz) +
      xz * (xy * yz - yy * xz);

    // Analytical eigenvalues of 3x3 real symmetric matrix
    const p1 = xy * xy + xz * xz + yz * yz;
    let eig1 = xx,
      eig2 = yy,
      eig3 = zz;
    if (p1 > 1e-7) {
      const q = tr / 3;
      const p2 =
        (xx - q) * (xx - q) +
        (yy - q) * (yy - q) +
        (zz - q) * (zz - q) +
        2 * p1;
      const p = Math.sqrt(p2 / 6);
      // B = (1/p) * (A - qI)
      const b11 = (xx - q) / p,
        b22 = (yy - q) / p,
        b33 = (zz - q) / p;
      const b12 = xy / p,
        b13 = xz / p,
        b23 = yz / p;
      const detB =
        b11 * (b22 * b33 - b23 * b23) -
        b12 * (b12 * b33 - b23 * b13) +
        b13 * (b12 * b23 - b22 * b13);
      const r = Math.max(-1, Math.min(1, detB / 2));
      const phi = Math.acos(r) / 3;
      eig1 = q + 2 * p * Math.cos(phi);
      eig3 = q + 2 * p * Math.cos(phi + (2 * Math.PI) / 3);
      eig2 = 3 * q - eig1 - eig3;
    } else {
      const sorted = [xx, yy, zz].sort((a, b) => b - a);
      [eig1, eig2, eig3] = sorted;
    }

    return { tr, i2, det, eig1, eig2, eig3 };
  }, [xx, yy, zz, xy, xz, yz]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 720;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090b10');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4.5, 3.6, 5.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);
    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.45);
    dirLight2.position.set(-5, -8, -5);
    scene.add(dirLight2);

    const gridHelper = new THREE.GridHelper(10, 10, 0x334155, 0x1e293b);
    gridHelper.position.y = -2.2;
    scene.add(gridHelper);

    // 1. Neutral Unit Ghost Sphere (Input space ||n|| = 1)
    const ghostGeo = new THREE.SphereGeometry(1, 32, 32);
    const ghostMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.16
    });
    scene.add(new THREE.Mesh(ghostGeo, ghostMat));

    // 2. Deformed Lamé Ellipsoid Group
    const ellipsoidGroup = new THREE.Group();
    const deformGeo = new THREE.SphereGeometry(1, 48, 48);
    const deformMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.22,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.78,
      wireframe: false
    });
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.38
    });
    ellipsoidGroup.add(new THREE.Mesh(deformGeo, deformMat));
    ellipsoidGroup.add(new THREE.Mesh(deformGeo, wireMat));
    ellipsoidGroup.matrixAutoUpdate = false;
    scene.add(ellipsoidGroup);

    // 3. Deformed Basis Vectors T(e_x), T(e_y), T(e_z)
    const origin = new THREE.Vector3(0, 0, 0);
    const arrowX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), origin, 1, 0xf87171, 0.22, 0.12);
    const arrowY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), origin, 1, 0x4ade80, 0.22, 0.12);
    const arrowZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), origin, 1, 0x60a5fa, 0.22, 0.12);
    scene.add(arrowX, arrowY, arrowZ);

    sceneObjectsRef.current = { ellipsoidGroup, arrowX, arrowY, arrowZ };

    let animId = 0;
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Update 4x4 transformation matrix and arrows whenever tensor sliders change
  useEffect(() => {
    const objs = sceneObjectsRef.current;
    if (!objs) return;

    const m = new THREE.Matrix4();
    m.set(
      xx, xy, xz, 0,
      xy, yy, yz, 0,
      xz, yz, zz, 0,
      0,  0,  0,  1
    );
    objs.ellipsoidGroup.matrix.copy(m);

    const updateArrow = (arrow: THREE.ArrowHelper, vec: THREE.Vector3) => {
      const len = vec.length();
      if (len > 0.001) {
        arrow.setDirection(vec.clone().normalize());
        arrow.setLength(len, Math.min(len * 0.22, 0.28), Math.min(len * 0.12, 0.15));
        arrow.visible = true;
      } else {
        arrow.visible = false;
      }
    };

    updateArrow(objs.arrowX, new THREE.Vector3(xx, xy, xz));
    updateArrow(objs.arrowY, new THREE.Vector3(xy, yy, yz));
    updateArrow(objs.arrowZ, new THREE.Vector3(xz, yz, zz));
  }, [xx, yy, zz, xy, xz, yz]);

  const handleReset = () => {
    setXx(1.0);
    setYy(1.0);
    setZz(1.0);
    setXy(0.0);
    setXz(0.0);
    setYz(0.0);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0f131c] border border-slate-800/90 rounded-lg p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono-tech text-sky-400 uppercase tracking-wider">
            Laboratorio Tensori 3D (Ellissoide di Tensione di Lamé & Teorema Spettrale)
          </div>
          <h2 className="text-2xl font-serif-editorial font-semibold text-slate-100 mt-1">
            Il Tensore come Macchina Geometrica Attiva (Oltre l’Analogia delle Ombre)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            La sfera bianca tratteggiata rappresenta le direzioni unitarie di input; l’ellissoide azzurro mostra la risposta direzionale T(n) = σ(n).
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-tech flex items-center gap-1.5 cursor-pointer self-start lg:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Ripristina Tensore Identità (Sfera)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Controls & Matrix Display (4 cols) */}
        <div className="lg:col-span-4 bg-[#0f131c] border border-slate-800/90 rounded-lg p-5 space-y-5">
          {/* Live 3x3 Symmetric Matrix Box */}
          <div>
            <div className="text-xs font-mono-tech text-slate-400 uppercase mb-2 flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-sky-400" />
              Matrice del Tensore Simmetrico T (Rango 2)
            </div>
            <div className="grid grid-cols-3 gap-1.5 bg-[#090b10] border border-slate-800 p-3 rounded font-mono-tech text-center text-xs">
              <div className="bg-sky-950/40 border border-sky-500/30 py-1.5 rounded text-sky-300 font-semibold">
                {xx.toFixed(2)}
              </div>
              <div className="bg-amber-950/30 border border-amber-500/30 py-1.5 rounded text-amber-300">
                {xy.toFixed(2)}
              </div>
              <div className="bg-amber-950/30 border border-amber-500/30 py-1.5 rounded text-amber-300">
                {xz.toFixed(2)}
              </div>

              <div className="bg-amber-950/30 border border-amber-500/30 py-1.5 rounded text-amber-300">
                {xy.toFixed(2)}
              </div>
              <div className="bg-sky-950/40 border border-sky-500/30 py-1.5 rounded text-sky-300 font-semibold">
                {yy.toFixed(2)}
              </div>
              <div className="bg-amber-950/30 border border-amber-500/30 py-1.5 rounded text-amber-300">
                {yz.toFixed(2)}
              </div>

              <div className="bg-amber-950/30 border border-amber-500/30 py-1.5 rounded text-amber-300">
                {xz.toFixed(2)}
              </div>
              <div className="bg-amber-950/30 border border-amber-500/30 py-1.5 rounded text-amber-300">
                {yz.toFixed(2)}
              </div>
              <div className="bg-sky-950/40 border border-sky-500/30 py-1.5 rounded text-sky-300 font-semibold">
                {zz.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Diagonal Stretch Sliders */}
          <div className="space-y-2.5 text-xs pt-2 border-t border-slate-800">
            <div className="text-[11px] font-mono-tech text-sky-400 uppercase flex items-center gap-1">
              <Sliders className="w-3 h-3" />
              Diagonale Principale (Stiramento / Compressione)
            </div>
            {[
              { label: 'XX (Asse Rosso)', val: xx, set: setXx },
              { label: 'YY (Asse Verde)', val: yy, set: setYy },
              { label: 'ZZ (Asse Blu)', val: zz, set: setZz }
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between font-mono-tech text-[11px] mb-0.5">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="text-sky-300">{item.val.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.05"
                  value={item.val}
                  onChange={(e) => item.set(parseFloat(e.target.value))}
                  className="w-full accent-sky-400"
                />
              </div>
            ))}
          </div>

          {/* Shear Sliders */}
          <div className="space-y-2.5 text-xs pt-2 border-t border-slate-800">
            <div className="text-[11px] font-mono-tech text-amber-400 uppercase">
              Fuori Diagonale (Sforzi di Taglio / Shear & Inclinazione)
            </div>
            {[
              { label: 'XY = YX (Taglio Piano XY)', val: xy, set: setXy },
              { label: 'XZ = ZX (Taglio Piano XZ)', val: xz, set: setXz },
              { label: 'YZ = ZY (Taglio Piano YZ)', val: yz, set: setYz }
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between font-mono-tech text-[11px] mb-0.5">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="text-amber-300">{item.val.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-1.4"
                  max="1.4"
                  step="0.05"
                  value={item.val}
                  onChange={(e) => item.set(parseFloat(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>
            ))}
          </div>

          {/* Principal Eigenvalues & Invariants */}
          <div className="bg-[#090b10] border border-slate-800 rounded p-3 space-y-2 font-mono-tech text-xs">
            <div className="text-[11px] text-emerald-400 uppercase">
              Autovalori Principali (Semiassi di Lamé) & Invarianti
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                <span className="block text-[10px] text-slate-400">σ₁</span>
                <span className="text-emerald-300">{invariants.eig1.toFixed(2)}</span>
              </div>
              <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                <span className="block text-[10px] text-slate-400">σ₂</span>
                <span className="text-emerald-300">{invariants.eig2.toFixed(2)}</span>
              </div>
              <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                <span className="block text-[10px] text-slate-400">σ₃</span>
                <span className="text-emerald-300">{invariants.eig3.toFixed(2)}</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 pt-1 flex justify-between">
              <span>I₁ = Tr(T) = {invariants.tr.toFixed(2)}</span>
              <span>I₃ = det(T) = {invariants.det.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right 3D Canvas + Critique of the Shadow Analogy (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div
            ref={mountRef}
            className="w-full h-[500px] bg-[#090b10] border border-slate-800/90 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
          />

          <div className="bg-[#0f131c] border border-slate-800/90 rounded-lg p-4 space-y-2 text-xs leading-relaxed">
            <div className="font-semibold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Perché l’analogia delle "tre ombre sul muro" è incompleta?
            </div>
            <p className="text-slate-300">
              Spesso i tensori vengono spiegati come un oggetto 3D che proietta tre ombre sui piani coordinati: cambiando stanza le ombre cambiano, ma l’oggetto resta lo stesso. Questo spiega l’<strong>invarianza per cambio di coordinate</strong>, ma fa sembrare il tensore un oggetto statico (che sarebbe semplicemente un vettore). Nella fisica reale (tensore degli sforzi di Cauchy, tensore d’inerzia, tensore metrico di Riemann <code className="text-sky-300">g_μν</code>), un tensore di rango 2 è un <strong>operatore lineare attivo</strong> che prende in input una direzione <code className="text-slate-100">n</code> sulla sfera unitaria e la stira/ruota in una nuova direzione <code className="text-sky-300">T(n)</code>. Per il <strong>Teorema Spettrale</strong>, anche quando i termini di taglio <code className="text-amber-300">XY, XZ, YZ</code> inclinano gli assi, esistono sempre 3 direzioni ortogonali principali (gli autovettori) lungo cui il tensore agisce come puro stiramento <code className="text-emerald-300">σ₁, σ₂, σ₃</code>!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
