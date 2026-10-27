import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Layers, Eye, Sliders, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

type LabPhase = 'phase1_real' | 'phase2_grid' | 'phase3_domain' | 'phase4_riemann3d';

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h >= 0 && h < 60) [r, g, b] = [c, x, 0];
  else if (h >= 60 && h < 120) [r, g, b] = [x, c, 0];
  else if (h >= 120 && h < 180) [r, g, b] = [0, c, x];
  else if (h >= 180 && h < 240) [r, g, b] = [0, x, c];
  else if (h >= 240 && h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [r + m, g + m, b + m];
}

export const UnifiedDimensionalLab: React.FC = () => {
  const [phase, setPhase] = useState<LabPhase>('phase4_riemann3d');

  // Quadratic parameters P(z) = a z^2 + b z + c
  const [coefA, setCoefA] = useState<number>(1);
  const [coefB, setCoefB] = useState<number>(0);
  const [coefC, setCoefC] = useState<number>(1); // Default z^2 + 1 (Δ = -4 < 0, roots ±i)

  // Viktor's surgical parametric inequality parameter 'm' in m^2 - 4m - 4 < 0
  const [paramM, setParamM] = useState<number>(2.0);

  const riemannMountRef = useRef<HTMLDivElement | null>(null);
  const domainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Derived algebraic values
  const calc = useMemo(() => {
    const a = Math.abs(coefA) < 0.05 ? 0.05 : coefA;
    const b = coefB;
    const c = coefC;
    const delta = b * b - 4 * a * c;
    const vx = -b / (2 * a);
    const vy = -delta / (4 * a);
    const alwaysPositive = a > 0 && delta < 0;

    let roots: { re: number; im: number }[] = [];
    if (delta >= 0) {
      const sd = Math.sqrt(delta);
      roots = [
        { re: (-b - sd) / (2 * a), im: 0 },
        { re: (-b + sd) / (2 * a), im: 0 }
      ];
    } else {
      const sd = Math.sqrt(-delta);
      roots = [
        { re: -b / (2 * a), im: sd / (2 * a) },
        { re: -b / (2 * a), im: -sd / (2 * a) }
      ];
    }

    return { a, b, c, delta, vx, vy, alwaysPositive, roots };
  }, [coefA, coefB, coefC]);

  // Phase 2: 2D Complex Grid Deformation w = a z^2 + b z + c
  useEffect(() => {
    if (phase !== 'phase2_grid') return;
    const canvas = gridCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = '#090b10';
    ctx.fillRect(0, 0, w, h);

    const scale = 42;
    const cx = w / 2;
    const cy = h / 2;

    // Axes
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, h);
    ctx.stroke();

    const evalComplex = (x: number, y: number) => {
      // a(x+iy)^2 + b(x+iy) + c = a(x^2-y^2 + 2ixy) + bx + iby + c
      const re = calc.a * (x * x - y * y) + calc.b * x + calc.c;
      const im = 2 * calc.a * x * y + calc.b * y;
      return { re, im };
    };

    // Draw lines of constant x (vertical in input plane, parabolic in output plane)
    for (let x = -2.2; x <= 2.2; x += 0.25) {
      ctx.beginPath();
      ctx.strokeStyle = Math.abs(x) < 0.05 ? '#38bdf8' : 'rgba(56, 189, 248, 0.38)';
      ctx.lineWidth = Math.abs(x) < 0.05 ? 2 : 1;
      for (let y = -2.2; y <= 2.2; y += 0.05) {
        const out = evalComplex(x, y);
        const px = cx + out.re * scale;
        const py = cy - out.im * scale;
        if (y === -2.2) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Draw lines of constant y (horizontal in input plane)
    for (let y = -2.2; y <= 2.2; y += 0.25) {
      ctx.beginPath();
      ctx.strokeStyle = Math.abs(y) < 0.05 ? '#f59e0b' : 'rgba(245, 158, 11, 0.38)';
      ctx.lineWidth = Math.abs(y) < 0.05 ? 2 : 1;
      for (let x = -2.2; x <= 2.2; x += 0.05) {
        const out = evalComplex(x, y);
        const px = cx + out.re * scale;
        const py = cy - out.im * scale;
        if (x === -2.2) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Highlight origin w = 0
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();
  }, [phase, calc]);

  // Phase 3: 2D Domain Coloring in ℂ×ℂ (Hue = arg(f(z)), Lightness = |f(z)|)
  useEffect(() => {
    if (phase !== 'phase3_domain') return;
    const canvas = domainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;
    const range = 2.6;

    for (let py = 0; py < h; py++) {
      const y = ((h / 2 - py) / (h / 2)) * range;
      for (let px = 0; px < w; px++) {
        const x = ((px - w / 2) / (w / 2)) * range;
        const re = calc.a * (x * x - y * y) + calc.b * x + calc.c;
        const im = 2 * calc.a * x * y + calc.b * y;

        const mag = Math.hypot(re, im);
        let angle = (Math.atan2(im, re) * 180) / Math.PI;
        if (angle < 0) angle += 360;

        // Logarithmic modulus rings
        const ring = 0.5 + 0.5 * Math.sin(Math.log(mag + 1e-4) * 6);
        const lightness = Math.min(0.88, Math.max(0.08, (1 - 1 / (1 + mag * 0.7)) * 0.78 + ring * 0.12));

        const [r, g, b] = hslToRgb(angle, 0.85, lightness);
        const idx = (py * w + px) * 4;
        data[idx] = Math.round(r * 255);
        data[idx + 1] = Math.round(g * 255);
        data[idx + 2] = Math.round(b * 255);
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Overlay axes and exact roots
    const cx = w / 2;
    const cy = h / 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.28)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, h);
    ctx.stroke();

    calc.roots.forEach((rt, idx) => {
      const rx = cx + (rt.re / range) * (w / 2);
      const ry = cy - (rt.im / range) * (h / 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(rx, ry, 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#090b10';
      ctx.font = '12px JetBrains Mono';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`z_${idx + 1}`, rx + 10, ry - 6);
    });
  }, [phase, calc]);

  // Phase 4: 3D Riemann Modulus-Phase Surface in ℂ × ℝ (Three.js)
  useEffect(() => {
    if (phase !== 'phase4_riemann3d') return;
    const container = riemannMountRef.current;
    if (!container) return;

    const width = container.clientWidth || 720;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090b10');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
    camera.position.set(5.5, 4.8, 6.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 1.0, 0);

    const ambient = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(6, 12, 8);
    scene.add(dirLight);

    // Zero Reference Plane (|f(z)| = 0)
    const zeroPlaneGeo = new THREE.PlaneGeometry(5.2, 5.2);
    zeroPlaneGeo.rotateX(-Math.PI / 2);
    const zeroPlaneMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide
    });
    const zeroPlane = new THREE.Mesh(zeroPlaneGeo, zeroPlaneMat);
    scene.add(zeroPlane);

    const gridHelper = new THREE.GridHelper(5.2, 10, 0x475569, 0x1e293b);
    scene.add(gridHelper);

    // Build 3D Surface where X = Re(z), Z = Im(z), Y (height) = |f(z)|, Color = arg(f(z))
    const segs = 76;
    const span = 2.4;
    const surfGeo = new THREE.PlaneGeometry(span * 2, span * 2, segs, segs);
    surfGeo.rotateX(-Math.PI / 2);

    const posAttr = surfGeo.attributes.position;
    const colors: number[] = [];

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const yIm = posAttr.getZ(i); // Z in 3D space represents Im(z)
      const re = calc.a * (x * x - yIm * yIm) + calc.b * x + calc.c;
      const im = 2 * calc.a * x * yIm + calc.b * yIm;

      const mod = Math.min(4.8, Math.hypot(re, im));
      posAttr.setY(i, mod * 0.55);

      let angle = (Math.atan2(im, re) * 180) / Math.PI;
      if (angle < 0) angle += 360;
      const [r, g, b] = hslToRgb(angle, 0.85, 0.52);
      colors.push(r, g, b);
    }

    surfGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    surfGeo.computeVertexNormals();

    const surfMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      roughness: 0.35,
      metalness: 0.1,
      transparent: true,
      opacity: 0.88
    });
    const surfMesh = new THREE.Mesh(surfGeo, surfMat);
    scene.add(surfMesh);

    // Highlight the Real Slice (Im(z) = 0) as a glowing white curve
    const realCurvePts: THREE.Vector3[] = [];
    for (let x = -span; x <= span; x += 0.05) {
      const val = Math.abs(calc.a * x * x + calc.b * x + calc.c);
      realCurvePts.push(new THREE.Vector3(x, Math.min(4.8, val) * 0.55 + 0.02, 0));
    }
    const realLineGeo = new THREE.BufferGeometry().setFromPoints(realCurvePts);
    const realLineMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
    scene.add(new THREE.Line(realLineGeo, realLineMat));

    // Place Glowing Spheres at the Exact Complex Roots (where |f(z)| = 0 touches the yellow plane!)
    calc.roots.forEach((rt) => {
      if (Math.abs(rt.re) <= span && Math.abs(rt.im) <= span) {
        const rootSphere = new THREE.Mesh(
          new THREE.SphereGeometry(0.13, 20, 16),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        rootSphere.position.set(rt.re, 0.02, rt.im);
        scene.add(rootSphere);
      }
    });

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
  }, [phase, calc]);

  // Viktor's surgical inequality check for m^2 - 4m - 4 < 0
  const viktorValue = paramM * paramM - 4 * paramM - 4;
  const r1Viktor = 2 - 2 * Math.sqrt(2); // ~ -0.828
  const r2Viktor = 2 + 2 * Math.sqrt(2); // ~ +4.828

  return (
    <div className="space-y-6">
      {/* Phase Switcher Header */}
      <div className="bg-[#0f131c] border border-slate-800/90 rounded-lg p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono-tech text-amber-400 uppercase tracking-wider">
            Laboratorio Unificato delle Dimensioni (1D → 2D → 3D → 4D Complesso)
          </div>
          <h2 className="text-2xl font-serif-editorial font-semibold text-slate-100 mt-1">
            Polinomi Quadratici, Completamento del Quadrato & Superfici di Riemann
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Perché il grafico complesso non vive in ℝ×ℝ×ℂ ma in ℂ×ℂ ≅ ℝ⁴, e come le radici complesse ±i emergono toccando quota zero in ℂ×ℝ.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'phase1_real', label: '1. Analisi 1 (ℝ→ℝ & Metodo Chirurgico)' },
            { id: 'phase2_grid', label: '2. Griglia Complessa (ℂ→ℂ)' },
            { id: 'phase3_domain', label: '3. Domain Coloring 4D' },
            { id: 'phase4_riemann3d', label: '4. Superficie di Riemann 3D (|f(z)|)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPhase(tab.id as LabPhase)}
              className={`px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer border ${
                phase === tab.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-semibold'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Control & Algebraic Proof Panel (4 cols) */}
        <div className="lg:col-span-4 bg-[#0f131c] border border-slate-800/90 rounded-lg p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono-tech text-sky-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Parametri Polinomio P(z) = az² + bz + c
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => {
                  setCoefA(1);
                  setCoefB(0);
                  setCoefC(1);
                }}
                className="px-2 py-0.5 text-[11px] font-mono-tech rounded bg-slate-800 hover:bg-slate-700 text-amber-300 cursor-pointer"
              >
                z² + 1
              </button>
              <button
                onClick={() => {
                  setCoefA(1);
                  setCoefB(0);
                  setCoefC(-1);
                }}
                className="px-2 py-0.5 text-[11px] font-mono-tech rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 cursor-pointer"
              >
                z² - 1
              </button>
            </div>
          </div>

          {/* Sliders for a, b, c */}
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-mono-tech mb-1">
                <span className="text-slate-300">Concavità (a):</span>
                <span className="text-amber-400">{calc.a.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={coefA}
                onChange={(e) => setCoefA(parseFloat(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>

            <div>
              <div className="flex justify-between font-mono-tech mb-1">
                <span className="text-slate-300">Pendenza lineare (b):</span>
                <span className="text-sky-400">{calc.b.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={coefB}
                onChange={(e) => setCoefB(parseFloat(e.target.value))}
                className="w-full accent-sky-400"
              />
            </div>

            <div>
              <div className="flex justify-between font-mono-tech mb-1">
                <span className="text-slate-300">Termine noto (c):</span>
                <span className="text-emerald-400">{calc.c.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-2"
                max="2.5"
                step="0.1"
                value={coefC}
                onChange={(e) => setCoefC(parseFloat(e.target.value))}
                className="w-full accent-emerald-400"
              />
            </div>
          </div>

          {/* Completing the Square & Positivity Diagnostic */}
          <div className="bg-[#090b10] border border-slate-800 rounded p-3.5 space-y-2 text-xs">
            <div className="text-[11px] font-mono-tech text-slate-400 uppercase">
              Forma Canonica (Completamento del Quadrato)
            </div>
            <div className="font-mono-tech text-sky-300 text-xs">
              P(x) = {calc.a.toFixed(1)}(x {calc.vx >= 0 ? `- ${calc.vx.toFixed(2)}` : `+ ${Math.abs(calc.vx).toFixed(2)}`})²{' '}
              {calc.vy >= 0 ? `+ ${calc.vy.toFixed(2)}` : `- ${Math.abs(calc.vy).toFixed(2)}`}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 font-mono-tech text-[11px]">
              <div>
                Discriminante Δ:
                <span
                  className={`block text-xs font-semibold ${
                    calc.delta < 0 ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  Δ = b² - 4ac = {calc.delta.toFixed(2)}
                </span>
              </div>
              <div>
                Vertice Reale V:
                <span className="block text-xs text-slate-200">
                  ({calc.vx.toFixed(2)}, {calc.vy.toFixed(2)})
                </span>
              </div>
            </div>

            <div
              className={`mt-2 p-2.5 rounded border flex items-start gap-2 ${
                calc.alwaysPositive
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                  : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
              }`}
            >
              {calc.alwaysPositive ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="text-[11px] leading-snug">
                {calc.alwaysPositive
                  ? 'P(x) > 0 ∀x ∈ ℝ verificato! Poiché a > 0 e Δ < 0, il minimo assoluto -Δ/(4a) è strettamente positivo. Le radici si sono spostate nel piano complesso!'
                  : 'Non strettamente positivo su tutto ℝ: serve simultaneamente a > 0 (concavità verso l’alto) e Δ < 0 (nessuna intersezione reale).'}
              </div>
            </div>

            {/* Complex Roots Readout */}
            <div className="pt-2 border-t border-slate-800/80 font-mono-tech text-[11px] text-slate-300">
              <span className="text-slate-400 block mb-1">Radici in ℂ (Piano di Argand-Gauss):</span>
              {calc.roots.map((r, i) => (
                <div key={i} className="text-amber-300">
                  z_{i + 1} = {r.re.toFixed(2)} {r.im >= 0 ? `+ ${r.im.toFixed(2)}i` : `- ${Math.abs(r.im).toFixed(2)}i`}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Dynamic Visualization Viewport (8 cols) */}
        <div className="lg:col-span-8 bg-[#0f131c] border border-slate-800/90 rounded-lg p-5 space-y-4">
          {phase === 'phase1_real' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif-editorial font-semibold text-slate-100">
                  Fase 1: Analisi 1 (ℝ → ℝ) & Il Metodo Chirurgico per le Disequazioni Parametriche
                </h3>
                <span className="text-xs font-mono-tech text-emerald-400">
                  P(x) &gt; 0 ⟺ a &gt; 0 ∧ Δ &lt; 0
                </span>
              </div>

              {/* SVG Real Parabola & Argand-Gauss Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#090b10] border border-slate-800 rounded p-3">
                  <div className="text-xs font-mono-tech text-slate-400 mb-2">
                    Piano Cartesiano Reale ℝ × ℝ (y = P(x))
                  </div>
                  <svg viewBox="-4 -4 8 8" className="w-full h-56 bg-[#07090e] rounded">
                    <line x1="-4" y1="0" x2="4" y2="0" stroke="#334155" strokeWidth="0.06" />
                    <line x1="0" y1="-4" x2="0" y2="4" stroke="#334155" strokeWidth="0.06" />
                    {/* Parabola curve */}
                    <path
                      d={Array.from({ length: 81 }, (_, idx) => {
                        const x = -4 + idx * 0.1;
                        const y = -(calc.a * x * x + calc.b * x + calc.c); // SVG y inverted
                        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${Math.max(-4.5, Math.min(4.5, y)).toFixed(2)}`;
                      }).join(' ')}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="0.12"
                    />
                    {/* Vertex */}
                    <circle
                      cx={calc.vx}
                      cy={-calc.vy}
                      r="0.18"
                      fill="#f59e0b"
                    />
                  </svg>
                </div>

                <div className="bg-[#090b10] border border-slate-800 rounded p-3">
                  <div className="text-xs font-mono-tech text-slate-400 mb-2">
                    Piano Complesso di Argand-Gauss ℂ (Re(z), Im(z))
                  </div>
                  <svg viewBox="-3 -3 6 6" className="w-full h-56 bg-[#07090e] rounded">
                    <line x1="-3" y1="0" x2="3" y2="0" stroke="#334155" strokeWidth="0.05" />
                    <line x1="0" y1="-3" x2="0" y2="3" stroke="#334155" strokeWidth="0.05" />
                    <circle cx="0" cy="0" r="1" fill="none" stroke="#1e293b" strokeWidth="0.04" strokeDasharray="0.1,0.1" />
                    {calc.roots.map((rt, i) => (
                      <g key={i}>
                        <line x1="0" y1="0" x2={rt.re} y2={-rt.im} stroke="#f472b6" strokeWidth="0.05" strokeDasharray="0.1,0.1" />
                        <circle cx={rt.re} cy={-rt.im} r="0.18" fill="#f472b6" />
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              {/* Viktor's Surgical Method Interactive Box */}
              <div className="bg-[#0b0f18] border border-slate-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-tech text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Il "Metodo Chirurgico" per Disequazioni Parametriche: m² - 4m - 4 &lt; 0
                  </span>
                  <span className="text-xs font-mono-tech text-slate-400">
                    Soluzione: 2 - 2√2 &lt; m &lt; 2 + 2√2
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Per trovare quando una parabola parametrica ha Δ &lt; 0 (es. <code className="text-amber-300">m² - 4m - 4 &lt; 0</code>), non tentare di indovinare i numeri a mente: (1) Trova i "punti di confine" risolvendo l’equazione <code className="text-sky-300">m² - 4m - 4 = 0</code> → <code className="text-sky-300">m = 2 ± 2√2 ≈ -0.83 e +4.83</code>; (2) Poiché la parabola <code className="text-emerald-300">Y = m² - 4m - 4</code> sorride (concavità +1 &gt; 0), essa è negativa (&lt; 0) esattamente nella "pancia" sotto l’asse, cioè <strong>all’interno dell’intervallo delle radici</strong>!
                </p>
                <div className="flex items-center gap-4 pt-1">
                  <span className="text-xs font-mono-tech text-slate-300 shrink-0">
                    Testa m = {paramM.toFixed(2)}:
                  </span>
                  <input
                    type="range"
                    min="-2.5"
                    max="6.5"
                    step="0.05"
                    value={paramM}
                    onChange={(e) => setParamM(parseFloat(e.target.value))}
                    className="w-full accent-emerald-400"
                  />
                  <span
                    className={`text-xs font-mono-tech px-2.5 py-1 rounded shrink-0 ${
                      viktorValue < 0
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    m²-4m-4 = {viktorValue.toFixed(2)} ({viktorValue < 0 ? 'DENTRO: Δ < 0' : 'FUORI: Δ ≥ 0'})
                  </span>
                </div>
                <div className="text-[11px] font-mono-tech text-slate-400">
                  Confini chirurgici: m₁ = 2 - 2√2 ≈ {r1Viktor.toFixed(3)} · m₂ = 2 + 2√2 ≈ {r2Viktor.toFixed(3)}
                </div>
              </div>
            </div>
          )}

          {phase === 'phase2_grid' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif-editorial font-semibold text-slate-100">
                  Fase 2: Mappa Complessa 2D → 2D (Deformazione Conforme della Griglia w = P(z))
                </h3>
                <span className="text-xs font-mono-tech text-sky-400">
                  Rette x=cost (blu) e y=cost (ambra) ripiegate in parabole
                </span>
              </div>
              <canvas
                ref={gridCanvasRef}
                width={680}
                height={420}
                className="w-full h-[420px] bg-[#090b10] border border-slate-800 rounded"
              />
              <p className="text-xs text-slate-400 leading-relaxed">
                Poiché sia l’input <code className="text-slate-200">z = x + iy</code> che l’output <code className="text-slate-200">w = u + iv</code> sono bidimensionali, la mappa <code className="text-sky-300">w = az² + bz + c</code> ripiega il piano complesso su se stesso (raddoppiando gli angoli nell’origine) e trasla il punto critico. Il pallino verde indica <code className="text-emerald-300">w = 0</code>.
              </p>
            </div>
          )}

          {phase === 'phase3_domain' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif-editorial font-semibold text-slate-100">
                  Fase 3: Domain Coloring 2D (Rappresentazione 4D Completa in ℂ × ℂ)
                </h3>
                <span className="text-xs font-mono-tech text-pink-400">
                  Tinta = arg(P(z)) · Anelli = |P(z)| · Cerchi bianchi = Radici z₁, z₂
                </span>
              </div>
              <canvas
                ref={domainCanvasRef}
                width={520}
                height={380}
                className="w-full h-[420px] bg-[#090b10] border border-slate-800 rounded object-cover"
              />
              <p className="text-xs text-slate-400 leading-relaxed">
                Ogni punto <code className="text-slate-200">(x, y)</code> del piano di input è colorato in base alla fase <code className="text-amber-300">arg(P(z))</code> dell’output. I punti in cui <strong>convergono tutti i colori dell’arcobaleno</strong> (cerchiati in bianco) sono gli zeri esatti <code className="text-emerald-300">P(z) = 0</code>! Con <code className="text-sky-300">z² + 1</code> li vedi sull’asse verticale immaginario in <code className="text-sky-300">(0, +i)</code> e <code className="text-sky-300">(0, -i)</code>.
              </p>
            </div>
          )}

          {phase === 'phase4_riemann3d' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-serif-editorial font-semibold text-slate-100 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  Fase 4: Superficie Modulo-Fase 3D in ℂ × ℝ (Quota = |P(z)|, Colore = arg(P(z)))
                </h3>
                <span className="text-xs font-mono-tech text-amber-300">
                  Curva bianca = Parabola Reale · Sfere bianche sul piano giallo = Radici Complesse
                </span>
              </div>
              <div
                ref={riemannMountRef}
                className="w-full h-[430px] bg-[#090b10] border border-slate-800 rounded overflow-hidden cursor-grab active:cursor-grabbing"
              />
              <div className="bg-[#090b10] border border-slate-800 rounded p-3 text-xs text-slate-300 leading-relaxed">
                <strong className="text-amber-300">Risoluzione del paradosso geometrico:</strong> Con <code className="text-sky-300">P(z) = z² + 1</code>, la parabola reale bianca (fetta <code className="text-slate-200">Im(z)=0</code>) resta sospesa a quota <code className="text-slate-200">≥ 1</code> sopra il piano giallo <code className="text-amber-300">|P(z)| = 0</code>. Ma non appena ti sposti lungo la direzione immaginaria <code className="text-slate-200">Im(z)</code>, la superficie 3D forma due coni che scendono a toccare il piano giallo esattamente nelle due sfere bianche <code className="text-emerald-300">z = +i</code> e <code className="text-emerald-300">z = -i</code>!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
