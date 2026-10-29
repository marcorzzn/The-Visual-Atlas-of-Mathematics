import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  CONCEPT_FAMILIES,
  VISUAL_CONCEPT_CATALOG,
  LOSSLESS_CORPUS_COVERAGE_REGISTRY,
  ConceptFamilyId,
  VisualConceptEntry
} from '../data/visualConceptCatalog';
import {
  Layers,
  Sliders,
  Compass,
  Cpu,
  Eye,
  GitBranch,
  Copy,
  Check,
  Search,
  Play,
  RotateCcw,
  ArrowRight
} from 'lucide-react';

export const VisualConceptAtlasLab: React.FC = () => {
  const [selectedFamily, setSelectedFamily] = useState<ConceptFamilyId | 'all'>('all');
  const [selectedConceptId, setSelectedConceptId] = useState<string>('triangolo_simplesso_piramide');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLens, setActiveLens] = useState<'all3' | 'linalg' | 'analytic' | 'intuitive'>('all3');
  const [copiedSpec, setCopiedSpec] = useState<boolean>(false);

  // ============================================================================
  // INTERACTIVE ENGINE STATES (Shared / Specialized per Concept Family)
  // ============================================================================
  // 1. Simplex & Pyramid 3D state
  const [simplexMode, setSimplexMode] = useState<'triangle2d' | 'tetra3d' | 'pyramid_sq' | 'frustum' | 'pentachoron4d'>('tetra3d');
  const [apexHeight, setApexHeight] = useState<number>(1.8);
  const [frustumCut, setFrustumCut] = useState<number>(0.55);
  const [baryL1, setBaryL1] = useState<number>(0.35);
  const [baryL2, setBaryL2] = useState<number>(0.35);

  // 2. Hypercube 4D state
  const [angleXW, setAngleXW] = useState<number>(35);
  const [angleZW, setAngleZW] = useState<number>(20);
  const [sliceW, setSliceW] = useState<number>(0.0);

  // 3. Conics 3D Cone-Plane state
  const [conePlaneAngle, setConePlaneAngle] = useState<number>(28); // <45 ellipse, =45 parabola, >45 hyperbola
  const [conePlaneOffset, setConePlaneOffset] = useState<number>(0.6);

  // 4. Spheres, Surfaces & Platonic 3D state
  const [surfaceKind, setSurfaceKind] = useState<'sphere' | 'torus' | 'mobius' | 'klein' | 'dodecahedron' | 'icosahedron'>('mobius');
  const [archimedesSides, setArchimedesSides] = useState<number>(12);

  // 5. Logic Circuits & Karnaugh 4x4 state
  const [bitA, setBitA] = useState<number>(1);
  const [bitB, setBitB] = useState<number>(0);
  const [gateType, setGateType] = useState<'AND' | 'OR' | 'XOR' | 'IMPLIES' | 'DEMORGAN'>('IMPLIES');
  const [kmapCells, setKmapCells] = useState<number[]>([
    1, 1, 0, 1,
    1, 1, 0, 1,
    0, 0, 0, 0,
    1, 0, 0, 1
  ]);
  const [proofFlowType, setProofFlowType] = useState<'assurdo' | 'induzione' | 'contronominale' | 'godel'>('assurdo');

  // 6. Automata, Turing Tape & Lambda state
  const [turingTape, setTuringTape] = useState<string[]>(['1', '0', '1', '1', '0', 'B', 'B']);
  const [turingHead, setTuringHead] = useState<number>(0);
  const [turingState, setTuringState] = useState<'q0_scan' | 'q1_invert' | 'q_halt'>('q0_scan');
  const [lambdaStep, setLambdaStep] = useState<number>(0);

  // 7. Linear Algebra (Gram-Schmidt & Bézier) state
  const [bezierT, setBezierT] = useState<number>(0.45);
  const [gramAngle, setGramAngle] = useState<number>(50);

  // 8. Calculus, Fourier, Riemann Surface √z state
  const [fourierHarmonics, setFourierHarmonics] = useState<number>(5);
  const [integMode, setIntegMode] = useState<'riemann' | 'lebesgue'>('riemann');
  const [epsValue, setEpsValue] = useState<number>(0.45);
  const [riemannBranchMode, setRiemannBranchMode] = useState<boolean>(false);

  // 9. Fractals state
  const [fractalType, setFractalType] = useState<'sierpinski' | 'koch' | 'cantor' | 'julia'>('sierpinski');
  const [fractalDepth, setFractalDepth] = useState<number>(4);
  const [juliaRe, setJuliaRe] = useState<number>(-0.4);
  const [juliaIm, setJuliaIm] = useState<number>(0.6);

  // 10. Category, HoTT & Knots state
  const [homotopyS, setHomotopyS] = useState<number>(0.5);

  // 11. Elliptic Curve, PCA & Transformer Attention state
  const [ecX1, setEcX1] = useState<number>(-1.1);
  const [ecX2, setEcX2] = useState<number>(0.2);
  const [pcaAngle, setPcaAngle] = useState<number>(32);

  const threeMountRef = useRef<HTMLDivElement | null>(null);

  const filteredConcepts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return VISUAL_CONCEPT_CATALOG.filter((c) => {
      const famOk = selectedFamily === 'all' || c.family === selectedFamily;
      if (!famOk) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.ProgressionChain.toLowerCase().includes(q) ||
        c.formalDefinition.toLowerCase().includes(q) ||
        c.connections.some((conn) => conn.toLowerCase().includes(q))
      );
    });
  }, [selectedFamily, searchQuery]);

  const activeConcept: VisualConceptEntry = useMemo(() => {
    return (
      VISUAL_CONCEPT_CATALOG.find((c) => c.id === selectedConceptId) ||
      filteredConcepts[0] ||
      VISUAL_CONCEPT_CATALOG[0]
    );
  }, [selectedConceptId, filteredConcepts]);

  // Determine whether the active concept uses the 3D WebGL stage
  const uses3DStage = useMemo(() => {
    if (activeConcept.engineType === 'calculus_fourier_ode' && riemannBranchMode) return true;
    return [
      'simplex_pyramid_3d',
      'hypercube_4d',
      'conics_projective_3d',
      'spheres_surfaces_3d',
      'riemann_branch_3d'
    ].includes(activeConcept.engineType);
  }, [activeConcept.engineType, riemannBranchMode]);

  // ============================================================================
  // THREE.JS 3D MULTI-CONCEPT ENGINE (Simplex/Pyramid/Frustum, 4D Tesseract, 3D Conics, Surfaces, √z Riemann)
  // ============================================================================
  useEffect(() => {
    if (!uses3DStage) return;
    const container = threeMountRef.current;
    if (!container) return;

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090b10');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
    camera.position.set(4.6, 3.6, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 0.4, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const keyLight = new THREE.DirectionalLight(0xfff4e0, 1.1);
    keyLight.position.set(6, 10, 7);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.45);
    fillLight.position.set(-6, -4, -5);
    scene.add(fillLight);

    const grid = new THREE.GridHelper(5.5, 11, 0x334155, 0x1e293b);
    grid.position.y = -0.8;
    scene.add(grid);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const engine =
      activeConcept.engineType === 'calculus_fourier_ode' && riemannBranchMode
        ? 'riemann_branch_3d'
        : activeConcept.engineType;

    // ------------------------------------------------------------------------
    // ENGINE A: SIMPLEX / TETRAHEDRON / PYRAMID / FRUSTUM / 4-SIMPLEX
    // ------------------------------------------------------------------------
    if (engine === 'simplex_pyramid_3d') {
      const h = simplexMode === 'triangle2d' ? 0.02 : apexHeight;
      const cut = simplexMode === 'frustum' ? frustumCut : 1.0;

      if (simplexMode === 'pentachoron4d') {
        // 5 vertices of regular 4-simplex in 4D projected to 3D
        const v4 = [
          [1, 1, 1, -0.5],
          [1, -1, -1, -0.5],
          [-1, 1, -1, -0.5],
          [-1, -1, 1, -0.5],
          [0, 0, 0, 1.4]
        ];
        const rad = (angleXW * Math.PI) / 180;
        const pts3: THREE.Vector3[] = v4.map(([x, y, z, w]) => {
          const rx = x * Math.cos(rad) - w * Math.sin(rad);
          const rw = x * Math.sin(rad) + w * Math.cos(rad);
          const s = 1.6 / (2.8 - rw * 0.5);
          return new THREE.Vector3(rx * s, y * s + 0.4, z * s);
        });

        // 10 edges of Pentachoron (complete graph K_5)
        for (let i = 0; i < 5; i++) {
          const sp = new THREE.Mesh(
            new THREE.SphereGeometry(0.11, 16, 16),
            new THREE.MeshStandardMaterial({ color: i === 4 ? 0xf59e0b : 0x38bdf8 })
          );
          sp.position.copy(pts3[i]);
          rootGroup.add(sp);
          for (let j = i + 1; j < 5; j++) {
            const lineGeo = new THREE.BufferGeometry().setFromPoints([pts3[i], pts3[j]]);
            rootGroup.add(
              new THREE.Line(
                lineGeo,
                new THREE.LineBasicMaterial({ color: i === 4 || j === 4 ? 0xf59e0b : 0x60a5fa })
              )
            );
          }
        }
      } else {
        // Base vertices (Triangle for tetra3d/triangle2d, Square for pyramid_sq/frustum)
        const isSquare = simplexMode === 'pyramid_sq' || simplexMode === 'frustum';
        const basePts = isSquare
          ? [
              new THREE.Vector3(-1.3, -0.6, -1.3),
              new THREE.Vector3(1.3, -0.6, -1.3),
              new THREE.Vector3(1.3, -0.6, 1.3),
              new THREE.Vector3(-1.3, -0.6, 1.3)
            ]
          : [
              new THREE.Vector3(-1.5, -0.6, 1.0),
              new THREE.Vector3(1.5, -0.6, 1.0),
              new THREE.Vector3(0, -0.6, -1.5)
            ];
        const apex = new THREE.Vector3(0, -0.6 + h, 0);

        const topPts = basePts.map((bp) => bp.clone().lerp(apex, cut));

        // Draw edges & translucent faces
        const edgePts: THREE.Vector3[] = [];
        for (let i = 0; i < basePts.length; i++) {
          const next = (i + 1) % basePts.length;
          edgePts.push(basePts[i], basePts[next]);
          edgePts.push(topPts[i], topPts[next]);
          edgePts.push(basePts[i], topPts[i]);
          // Ghost lines to full apex if frustum
          if (cut < 0.99) {
            const ghostGeo = new THREE.BufferGeometry().setFromPoints([topPts[i], apex]);
            rootGroup.add(
              new THREE.Line(
                ghostGeo,
                new THREE.LineBasicMaterial({ color: 0xf472b6, transparent: true, opacity: 0.45 })
              )
            );
          }
        }
        const edgeGeo = new THREE.BufferGeometry().setFromPoints(edgePts);
        rootGroup.add(new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: 0xf59e0b })));

        // Barycentric test point inside simplex
        const l0 = Math.max(0, 1 - baryL1 - baryL2);
        const baryPt = new THREE.Vector3()
          .addScaledVector(basePts[0], l0)
          .addScaledVector(basePts[1], baryL1)
          .addScaledVector(topPts[0], baryL2);
        const barySphere = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0x34d399 })
        );
        barySphere.position.copy(baryPt);
        rootGroup.add(barySphere);
      }
    }

    // ------------------------------------------------------------------------
    // ENGINE B: 4D HYPERCUBE (TESSERACT) ROTATION & 3D HYPERPLANE SLICER
    // ------------------------------------------------------------------------
    else if (engine === 'hypercube_4d') {
      const verts4D: number[][] = [];
      for (let i = 0; i < 16; i++) {
        verts4D.push([
          i & 1 ? 1 : -1,
          i & 2 ? 1 : -1,
          i & 4 ? 1 : -1,
          i & 8 ? 1 : -1
        ]);
      }

      const rXW = (angleXW * Math.PI) / 180;
      const rZW = (angleZW * Math.PI) / 180;

      const rotated4D = verts4D.map(([x, y, z, w]) => {
        // Rotate XW
        const x1 = x * Math.cos(rXW) - w * Math.sin(rXW);
        const w1 = x * Math.sin(rXW) + w * Math.cos(rXW);
        // Rotate ZW
        const z2 = z * Math.cos(rZW) - w1 * Math.sin(rZW);
        const w2 = z * Math.sin(rZW) + w1 * Math.cos(rZW);
        return [x1, y, z2, w2];
      });

      const proj3D = rotated4D.map(([x, y, z, w]) => {
        const d = 3.2;
        const s = 1.8 / (d - w * 0.65);
        return new THREE.Vector3(x * s, y * s + 0.3, z * s);
      });

      // 32 edges of the Tesseract (connect vertices differing by 1 bit)
      const edgePoints: THREE.Vector3[] = [];
      const slicePts: THREE.Vector3[] = [];

      for (let i = 0; i < 16; i++) {
        const sp = new THREE.Mesh(
          new THREE.SphereGeometry(0.075, 12, 12),
          new THREE.MeshBasicMaterial({ color: i < 8 ? 0x38bdf8 : 0xf59e0b })
        );
        sp.position.copy(proj3D[i]);
        rootGroup.add(sp);

        for (let b = 0; b < 4; b++) {
          const j = i ^ (1 << b);
          if (i < j) {
            edgePoints.push(proj3D[i], proj3D[j]);
            // Check if 4D edge crosses hyperplane w = sliceW
            const wA = rotated4D[i][3];
            const wB = rotated4D[j][3];
            if ((wA - sliceW) * (wB - sliceW) <= 0 && Math.abs(wA - wB) > 1e-4) {
              const t = (sliceW - wA) / (wB - wA);
              slicePts.push(proj3D[i].clone().lerp(proj3D[j], t));
            }
          }
        }
      }

      rootGroup.add(
        new THREE.LineSegments(
          new THREE.BufferGeometry().setFromPoints(edgePoints),
          new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.75 })
        )
      );

      // Highlight 3D cross-section vertices & edges
      slicePts.forEach((p) => {
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(0.11, 14, 14),
          new THREE.MeshBasicMaterial({ color: 0x34d399 })
        );
        m.position.copy(p);
        rootGroup.add(m);
      });
      if (slicePts.length >= 3) {
        const hullLines: THREE.Vector3[] = [];
        for (let a = 0; a < slicePts.length; a++) {
          for (let b = a + 1; b < slicePts.length; b++) {
            hullLines.push(slicePts[a], slicePts[b]);
          }
        }
        rootGroup.add(
          new THREE.LineSegments(
            new THREE.BufferGeometry().setFromPoints(hullLines),
            new THREE.LineBasicMaterial({ color: 0x34d399 })
          )
        );
      }
    }

    // ------------------------------------------------------------------------
    // ENGINE C: 3D CONIC SECTIONS (DOUBLE CONE + INTERSECTING PLANE)
    // ------------------------------------------------------------------------
    else if (engine === 'conics_projective_3d') {
      const coneMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.38,
        side: THREE.DoubleSide,
        roughness: 0.3
      });
      const upperCone = new THREE.Mesh(new THREE.ConeGeometry(1.8, 1.8, 48, 1, true), coneMat);
      upperCone.position.y = 1.1;
      upperCone.rotation.x = Math.PI;
      const lowerCone = new THREE.Mesh(new THREE.ConeGeometry(1.8, 1.8, 48, 1, true), coneMat);
      lowerCone.position.y = -0.7;
      rootGroup.add(upperCone, lowerCone);

      // Secant Plane
      const rad = (conePlaneAngle * Math.PI) / 180;
      const planeGeo = new THREE.PlaneGeometry(4.2, 4.2);
      const planeMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.42,
        side: THREE.DoubleSide
      });
      const planeMesh = new THREE.Mesh(planeGeo, planeMat);
      planeMesh.position.set(0, 0.2 + conePlaneOffset, 0);
      planeMesh.rotation.x = Math.PI / 2 - rad;
      rootGroup.add(planeMesh);

      // Compute exact intersection curve points on cone (r = |y - 0.2|)
      const curvePts: THREE.Vector3[] = [];
      const m = Math.tan(rad);
      for (let theta = 0; theta <= Math.PI * 2; theta += 0.04) {
        const denom = 1 - m * Math.sin(theta);
        if (Math.abs(denom) > 0.12) {
          const r = conePlaneOffset / denom;
          if (Math.abs(r) <= 1.85) {
            const x = r * Math.cos(theta);
            const z = r * Math.sin(theta);
            const y = 0.2 + r;
            curvePts.push(new THREE.Vector3(x, y, z));
          }
        }
      }
      if (curvePts.length > 2) {
        rootGroup.add(
          new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(curvePts),
            new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 })
          )
        );
      }
    }

    // ------------------------------------------------------------------------
    // ENGINE D: SPHERES, TORUS, MÖBIUS, KLEIN BOTTLE & PLATONIC SOLIDS
    // ------------------------------------------------------------------------
    else if (engine === 'spheres_surfaces_3d') {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.28,
        metalness: 0.15,
        side: THREE.DoubleSide,
        wireframe: false
      });
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        wireframe: true,
        transparent: true,
        opacity: 0.35
      });

      let geo: THREE.BufferGeometry;
      if (surfaceKind === 'sphere') {
        geo = new THREE.SphereGeometry(1.6, 36, 24);
      } else if (surfaceKind === 'torus') {
        geo = new THREE.TorusGeometry(1.3, 0.5, 28, 56);
      } else if (surfaceKind === 'dodecahedron') {
        geo = new THREE.DodecahedronGeometry(1.65);
      } else if (surfaceKind === 'icosahedron') {
        geo = new THREE.IcosahedronGeometry(1.65);
      } else if (surfaceKind === 'mobius') {
        // Parametric Möbius Strip
        const uSegs = 64;
        const vSegs = 16;
        const positions: number[] = [];
        const indices: number[] = [];
        for (let i = 0; i <= uSegs; i++) {
          const u = (i / uSegs) * Math.PI * 2;
          for (let j = 0; j <= vSegs; j++) {
            const v = (j / vSegs - 0.5) * 0.9;
            const R = 1.45;
            const x = (R + v * Math.cos(u / 2)) * Math.cos(u);
            const z = (R + v * Math.cos(u / 2)) * Math.sin(u);
            const y = v * Math.sin(u / 2) + 0.3;
            positions.push(x, y, z);
          }
        }
        for (let i = 0; i < uSegs; i++) {
          for (let j = 0; j < vSegs; j++) {
            const a = i * (vSegs + 1) + j;
            const b = (i + 1) * (vSegs + 1) + j;
            const c = (i + 1) * (vSegs + 1) + (j + 1);
            const d = i * (vSegs + 1) + (j + 1);
            indices.push(a, b, d, b, c, d);
          }
        }
        geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geo.setIndex(indices);
        geo.computeVertexNormals();
      } else {
        // Figure-8 immersion of Klein Bottle in 3D
        const uSegs = 64;
        const vSegs = 32;
        const positions: number[] = [];
        const indices: number[] = [];
        const r = 1.25;
        for (let i = 0; i <= uSegs; i++) {
          const u = (i / uSegs) * Math.PI * 2;
          for (let j = 0; j <= vSegs; j++) {
            const v = (j / vSegs) * Math.PI * 2;
            const term = r + Math.cos(u / 2) * Math.sin(v) - Math.sin(u / 2) * Math.sin(2 * v);
            const x = term * Math.cos(u) * 0.75;
            const z = term * Math.sin(u) * 0.75;
            const y = (Math.sin(u / 2) * Math.sin(v) + Math.cos(u / 2) * Math.sin(2 * v)) * 0.75 + 0.4;
            positions.push(x, y, z);
          }
        }
        for (let i = 0; i < uSegs; i++) {
          for (let j = 0; j < vSegs; j++) {
            const a = i * (vSegs + 1) + j;
            const b = (i + 1) * (vSegs + 1) + j;
            const c = (i + 1) * (vSegs + 1) + (j + 1);
            const d = i * (vSegs + 1) + (j + 1);
            indices.push(a, b, d, b, c, d);
          }
        }
        geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geo.setIndex(indices);
        geo.computeVertexNormals();
      }

      const mesh = new THREE.Mesh(geo, mat);
      const wire = new THREE.Mesh(geo, wireMat);
      if (surfaceKind !== 'mobius' && surfaceKind !== 'klein') {
        mesh.position.y = 0.4;
        wire.position.y = 0.4;
      }
      rootGroup.add(mesh, wire);
    }

    // ------------------------------------------------------------------------
    // ENGINE E: 2-SHEETED RIEMANN SURFACE FOR w = √z WITH BRANCH CUT
    // ------------------------------------------------------------------------
    else if (engine === 'riemann_branch_3d') {
      const rSegs = 28;
      const thetaSegs = 96; // theta in [0, 4π] for 2 sheets!
      const positions: number[] = [];
      const colors: number[] = [];
      const indices: number[] = [];

      for (let i = 0; i <= rSegs; i++) {
        const r = 0.08 + (i / rSegs) * 2.0;
        for (let j = 0; j <= thetaSegs; j++) {
          const theta = (j / thetaSegs) * Math.PI * 4;
          const x = r * Math.cos(theta);
          const z = r * Math.sin(theta);
          // Height Y = Re(√z) = √r cos(theta/2), Color = Im(√z) = √r sin(theta/2)
          const y = Math.sqrt(r) * Math.cos(theta / 2) * 0.95 + 0.4;
          positions.push(x, y, z);

          const hue = ((theta / 2) / (Math.PI * 2)) * 360;
          const c = new THREE.Color().setHSL((hue % 360) / 360, 0.85, 0.55);
          colors.push(c.r, c.g, c.b);
        }
      }
      for (let i = 0; i < rSegs; i++) {
        for (let j = 0; j < thetaSegs; j++) {
          const a = i * (thetaSegs + 1) + j;
          const b = (i + 1) * (thetaSegs + 1) + j;
          const c = (i + 1) * (thetaSegs + 1) + (j + 1);
          const d = i * (thetaSegs + 1) + (j + 1);
          indices.push(a, b, d, b, c, d);
        }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geo.setIndex(indices);
      geo.computeVertexNormals();

      const mat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        roughness: 0.3,
        transparent: true,
        opacity: 0.88
      });
      rootGroup.add(new THREE.Mesh(geo, mat));

      // Highlight Branch Point at origin z = 0
      const bp = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      bp.position.set(0, 0.4, 0);
      rootGroup.add(bp);
    }

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
  }, [
    uses3DStage,
    activeConcept.engineType,
    simplexMode,
    apexHeight,
    frustumCut,
    baryL1,
    baryL2,
    angleXW,
    angleZW,
    sliceW,
    conePlaneAngle,
    conePlaneOffset,
    surfaceKind,
    riemannBranchMode
  ]);

  // ============================================================================
  // HELPER COMPUTATIONS FOR 2D INTERACTIVE ENGINES
  // ============================================================================
  // Logic Gate output
  const gateOut = useMemo(() => {
    if (gateType === 'AND') return bitA & bitB;
    if (gateType === 'OR') return bitA | bitB;
    if (gateType === 'XOR') return bitA ^ bitB;
    if (gateType === 'IMPLIES') return !bitA || bitB ? 1 : 0;
    return !(bitA && bitB) ? 1 : 0; // De Morgan ¬(A ∧ B) ≡ ¬A ∨ ¬B
  }, [bitA, bitB, gateType]);

  // Turing Machine Step Function (Bit Inverter on binary string until Blank 'B')
  const stepTuring = () => {
    if (turingState === 'q_halt') return;
    const sym = turingTape[turingHead];
    const nextTape = [...turingTape];
    if (sym === '0') {
      nextTape[turingHead] = '1';
      setTuringTape(nextTape);
      setTuringHead(Math.min(nextTape.length - 1, turingHead + 1));
      setTuringState('q1_invert');
    } else if (sym === '1') {
      nextTape[turingHead] = '0';
      setTuringTape(nextTape);
      setTuringHead(Math.min(nextTape.length - 1, turingHead + 1));
      setTuringState('q1_invert');
    } else {
      setTuringState('q_halt');
    }
  };

  const resetTuring = () => {
    setTuringTape(['1', '0', '1', '1', '0', 'B', 'B']);
    setTuringHead(0);
    setTuringState('q0_scan');
  };

  // Full Markdown Spec Generator for the active concept or entire catalog
  const markdownOutput = useMemo(() => {
    return VISUAL_CONCEPT_CATALOG.map(
      (c) => `### CONCETTO: ${c.title}
- Catena di Progressione: ${c.ProgressionChain}
- Definizione formale: ${c.formalDefinition}
- Visualizzazioni:
  1. [Algebra Lineare] — ${c.linearAlgebraVis.summary} | Formula: \`${c.linearAlgebraVis.matrixOrVectorFormula}\`
  2. [Analitica/Proiettiva/Differenziale] — ${c.analyticProjectiveDiffVis.summary} | Equazioni: \`${c.analyticProjectiveDiffVis.equations}\`
  3. [Intuitiva/Circuito/Grafo] — ${c.intuitiveCircuitGraphVis.summary} | Struttura: \`${c.intuitiveCircuitGraphVis.diagramStructure}\`
- Collegamenti: da [${c.title}] a [${c.connections.join('], [')}]
- Apparato grafico: ${c.apparatus.join(' / ')}`
    ).join('\n\n---\n\n');
  }, []);

  const handleCopyMarkdown = () => {
    navigator.clipboard?.writeText(markdownOutput);
    setCopiedSpec(true);
    setTimeout(() => setCopiedSpec(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header & Family Filter Bar */}
      <div className="bg-[#0f131c] border border-slate-800/90 rounded-lg p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono-tech text-amber-400">
              Atlante Visuale Multi-Formalismo · Triangolo → Simplesso → Piramide · Cubo → Ipercubo · Logica come Circuiti
            </div>
            <h1 className="text-2xl font-serif-editorial font-semibold text-slate-100 mt-1">
              Prodotto Visuale per Ogni Concetto Matematico (3 Lenti Simultanei)
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Ogni concetto del corpus è analizzato e visualizzato interattivamente in (1) Algebra Lineare, (2) Geometria Analitica/Proiettiva/Differenziale, e (3) Costruzione Intuitiva / Circuito / Grafo.
            </p>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-2 bg-[#090b10] border border-slate-800 rounded-lg px-3.5 py-2 w-full lg:w-80">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca concetto (es. Simplesso, Tesseract, Karnaugh, Turing, HoTT)..."
              className="w-full bg-transparent text-xs text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        {/* Family Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setSelectedFamily('all')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              selectedFamily === 'all'
                ? 'bg-amber-400 text-slate-950 font-semibold'
                : 'bg-[#090b10] text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            Tutti i 12 Domini ({VISUAL_CONCEPT_CATALOG.length} Macro-Prodotti)
          </button>
          {CONCEPT_FAMILIES.map((fam) => (
            <button
              key={fam.id}
              onClick={() => {
                setSelectedFamily(fam.id);
                const first = VISUAL_CONCEPT_CATALOG.find((c) => c.family === fam.id);
                if (first) setSelectedConceptId(first.id);
              }}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedFamily === fam.id
                  ? 'bg-amber-400 text-slate-950 font-semibold'
                  : 'bg-[#090b10] text-slate-300 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {fam.shortLabel}
            </button>
          ))}
        </div>

        {/* Concept Selector Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 pt-1">
          {filteredConcepts.map((item) => {
            const isSelected = item.id === activeConcept.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedConceptId(item.id)}
                className={`text-left p-3 rounded-lg border transition-colors cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 text-slate-100'
                    : 'bg-[#090b10] border-slate-800/90 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-semibold leading-snug line-clamp-1">
                  {item.title}
                </div>
                <div className="text-[11px] font-mono-tech text-slate-400 mt-1.5 truncate">
                  {item.ProgressionChain}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TWO-ZONE SANDBOX WORKSPACE: Interactive Stage (Left 7 cols) + 3 Lenses Deck (Right 5 cols) */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT 7 COLS: Interactive Visual Stage (3D WebGL + 2D SVG/Canvas) */}
        <div className="lg:col-span-7 bg-[#0f131c] border border-slate-800/90 rounded-lg p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="text-[11px] font-mono-tech text-sky-400">
                {activeConcept.ProgressionChain}
              </div>
              <h2 className="text-xl font-serif-editorial font-semibold text-slate-100 mt-0.5">
                {activeConcept.title}
              </h2>
            </div>
            <div className="text-xs font-mono-tech text-slate-400">
              {activeConcept.apparatus.join(' · ')}
            </div>
          </div>

          {/* 3D WebGL Container when activeConcept uses 3D stage */}
          {uses3DStage && (
            <div className="space-y-3">
              <div
                ref={threeMountRef}
                className="w-full h-[380px] bg-[#090b10] border border-slate-800 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
              />

              {/* Controls for Simplex / Pyramid / Frustum / Pentachoron */}
              {activeConcept.engineType === 'simplex_pyramid_3d' && (
                <div className="bg-[#090b10] border border-slate-800 rounded-lg p-4 space-y-3 text-xs">
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'triangle2d', label: '1. Triangolo 2D (Δ²)' },
                      { id: 'tetra3d', label: '2. Tetraedro 3D (Δ³)' },
                      { id: 'pyramid_sq', label: '3. Piramide Base Quadrata' },
                      { id: 'frustum', label: '4. Tronco di Piramide' },
                      { id: 'pentachoron4d', label: '5. Simplesso 4D (Pentacoro Δ⁴)' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSimplexMode(m.id as any)}
                        className={`px-2.5 py-1.5 rounded font-mono-tech text-[11px] cursor-pointer whitespace-nowrap ${
                          simplexMode === m.id
                            ? 'bg-amber-400 text-slate-950 font-semibold'
                            : 'bg-slate-900 text-slate-300 border border-slate-800'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {simplexMode !== 'pentachoron4d' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 font-mono-tech tabular-nums">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-300">Altezza Apice h:</span>
                          <span className="text-amber-400">{apexHeight.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0.2"
                          max="2.8"
                          step="0.1"
                          value={apexHeight}
                          onChange={(e) => setApexHeight(parseFloat(e.target.value))}
                          className="w-full accent-amber-400"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-300">Taglio Tronco c:</span>
                          <span className="text-pink-400">{frustumCut.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0.2"
                          max="1.0"
                          step="0.05"
                          value={frustumCut}
                          onChange={(e) => {
                            setSimplexMode('frustum');
                            setFrustumCut(parseFloat(e.target.value));
                          }}
                          className="w-full accent-pink-400"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-300">Peso Baricentrico λ₁:</span>
                          <span className="text-emerald-400">{baryL1.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0.05"
                          max="0.6"
                          step="0.05"
                          value={baryL1}
                          onChange={(e) => setBaryL1(parseFloat(e.target.value))}
                          className="w-full accent-emerald-400"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 pt-1 font-mono-tech tabular-nums">
                      <span className="text-slate-300 shrink-0">Rotazione 4D Pentacoro (θ_XW = {angleXW}°):</span>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={angleXW}
                        onChange={(e) => setAngleXW(parseInt(e.target.value, 10))}
                        className="w-full accent-amber-400"
                      />
                    </div>
                  )}

                  {/* Companion 2D SVG: Euler Line & Projective Apex */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                    <div className="bg-[#07090e] p-2.5 rounded border border-slate-800/80">
                      <div className="text-[11px] font-mono-tech text-slate-400 mb-1">
                        Punti Notevoli & Retta di Eulero (H - O = 3(G - O))
                      </div>
                      <svg viewBox="0 0 220 110" className="w-full h-24">
                        <polygon points="25,95 195,95 75,18" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" strokeWidth="1.5" />
                        <line x1="40" y1="68" x2="170" y2="52" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3,2" />
                        <circle cx="110" cy="60" r="3.5" fill="#38bdf8" />
                        <text x="106" y="74" fill="#38bdf8" fontSize="9" fontFamily="monospace">O</text>
                        <circle cx="98" cy="69" r="3.5" fill="#34d399" />
                        <text x="92" y="83" fill="#34d399" fontSize="9" fontFamily="monospace">G</text>
                        <circle cx="75" cy="56" r="3.5" fill="#f472b6" />
                        <text x="65" y="50" fill="#f472b6" fontSize="9" fontFamily="monospace">H</text>
                      </svg>
                    </div>
                    <div className="bg-[#07090e] p-2.5 rounded border border-slate-800/80 font-mono-tech text-[11px] space-y-1 tabular-nums">
                      <div className="text-amber-300">Calcolo Volumi Lineare & Analitico:</div>
                      <div>Area Base A₁ = {(3.38).toFixed(2)} · Altezza h = {apexHeight.toFixed(2)}</div>
                      <div>Vol(Piramide) = ⅓ A₁ h = {((3.38 * apexHeight) / 3).toFixed(3)}</div>
                      <div>Vol(Tronco) = (h/3)(A₁+√(A₁A₂)+A₂) = {((3.38 * apexHeight * (1 - Math.pow(1 - frustumCut, 3))) / 3).toFixed(3)}</div>
                      <div className="text-slate-400 text-[10px]">Se V → ∞ in ℝP³, il tronco diventa un Prisma!</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Controls for 4D Hypercube (Tesseract) */}
              {activeConcept.engineType === 'hypercube_4d' && (
                <div className="bg-[#090b10] border border-slate-800 rounded-lg p-4 space-y-3 text-xs font-mono-tech tabular-nums">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">Rotazione 4D θ_XW:</span>
                        <span className="text-amber-400">{angleXW}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={angleXW}
                        onChange={(e) => setAngleXW(parseInt(e.target.value, 10))}
                        className="w-full accent-amber-400"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">Rotazione 4D θ_ZW:</span>
                        <span className="text-sky-400">{angleZW}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={angleZW}
                        onChange={(e) => setAngleZW(parseInt(e.target.value, 10))}
                        className="w-full accent-sky-400"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">Sezione Iperpiana w₀:</span>
                        <span className="text-emerald-400">{sliceW.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="-1.3"
                        max="1.3"
                        step="0.05"
                        value={sliceW}
                        onChange={(e) => setSliceW(parseFloat(e.target.value))}
                        className="w-full accent-emerald-400"
                      />
                    </div>
                  </div>

                  {/* 2D SVG Dalí Cross Net & Dimension Table */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                    <div className="bg-[#07090e] p-2.5 rounded border border-slate-800/80 flex items-center justify-between">
                      <div className="space-y-1 text-[11px]">
                        <div className="text-amber-300">Sviluppo 3D (Croce a 8 Cubi)</div>
                        <div className="text-slate-400">Q_n: V = 2^n · E = n·2^{'{n-1}'}</div>
                        <div className="text-emerald-300">Q₄: 16 V · 32 E · 24 F · 8 Celle</div>
                      </div>
                      <svg viewBox="0 0 100 100" className="w-20 h-20">
                        {[
                          [40, 10],
                          [40, 28],
                          [22, 28],
                          [58, 28],
                          [40, 46],
                          [40, 64],
                          [40, 82],
                          [76, 28]
                        ].map(([x, y], idx) => (
                          <rect
                            key={idx}
                            x={x}
                            y={y}
                            width="16"
                            height="16"
                            fill="rgba(56,189,248,0.18)"
                            stroke="#38bdf8"
                            strokeWidth="1.2"
                          />
                        ))}
                      </svg>
                    </div>
                    <div className="bg-[#07090e] p-2.5 rounded border border-slate-800/80 text-[11px] space-y-1">
                      <div className="text-sky-300">Dualità e Sezioni (Inverde in 3D):</div>
                      <div className="text-slate-300">
                        I punti verdi nel viewport 3D mostrano l’intersezione esatta dell’ipercubo 4D con lo spazio 3D <code className="text-emerald-300">w = {sliceW.toFixed(2)}</code>.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Controls for 3D Conic Sections */}
              {activeConcept.engineType === 'conics_projective_3d' && (
                <div className="bg-[#090b10] border border-slate-800 rounded-lg p-4 space-y-3 text-xs font-mono-tech tabular-nums">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">Inclinazione Piano β:</span>
                        <span className="text-amber-400">
                          {conePlaneAngle}° ({conePlaneAngle === 0 ? 'Cerchio' : conePlaneAngle < 45 ? 'Ellisse' : conePlaneAngle === 45 ? 'Parabola' : 'Iperbole'})
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="68"
                        step="1"
                        value={conePlaneAngle}
                        onChange={(e) => setConePlaneAngle(parseInt(e.target.value, 10))}
                        className="w-full accent-amber-400"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-300">Quota Piano d (d=0 degenere):</span>
                        <span className="text-sky-400">{conePlaneOffset.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="1.2"
                        step="0.05"
                        value={conePlaneOffset}
                        onChange={(e) => setConePlaneOffset(parseFloat(e.target.value))}
                        className="w-full accent-sky-400"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Cerchio (β=0°)', ang: 0 },
                      { label: 'Ellisse (β=25°)', ang: 25 },
                      { label: 'Parabola (β=45° // generatrice)', ang: 45 },
                      { label: 'Iperbole (β=60° 2 falde)', ang: 60 }
                    ].map((p) => (
                      <button
                        key={p.label}
                        onClick={() => setConePlaneAngle(p.ang)}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-[11px] cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Controls for Spheres, Torus, Möbius, Klein & Platonic */}
              {activeConcept.engineType === 'spheres_surfaces_3d' && (
                <div className="bg-[#090b10] border border-slate-800 rounded-lg p-4 space-y-3 text-xs font-mono-tech tabular-nums">
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'mobius', label: 'Nastro di Möbius (Non orientabile)' },
                      { id: 'klein', label: 'Bottiglia di Klein (χ=0)' },
                      { id: 'torus', label: 'Toro T² (g=1, χ=0)' },
                      { id: 'sphere', label: 'Sfera S² (g=0, χ=2)' },
                      { id: 'dodecahedron', label: 'Dodecaedro {5,3}' },
                      { id: 'icosahedron', label: 'Icosaedro {3,5}' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSurfaceKind(s.id as any)}
                        className={`px-2.5 py-1.5 rounded text-[11px] cursor-pointer ${
                          surfaceKind === s.id
                            ? 'bg-amber-400 text-slate-950 font-semibold'
                            : 'bg-slate-900 text-slate-300 border border-slate-800'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-800">
                    <span>
                      Esaustione di Archimede ({archimedesSides}-gono): π ≈{' '}
                      <strong className="text-emerald-400">
                        {(archimedesSides * Math.sin(Math.PI / archimedesSides)).toFixed(6)}
                      </strong>
                    </span>
                    <input
                      type="range"
                      min="3"
                      max="96"
                      value={archimedesSides}
                      onChange={(e) => setArchimedesSides(parseInt(e.target.value, 10))}
                      className="w-44 accent-emerald-400"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================ */}
          {/* 2D INTERACTIVE ENGINES WHEN NOT IN 3D STAGE */}
          {/* ================================================================ */}

          {/* ENGINE: LOGIC CIRCUITS, KARNAUGH TOROIDAL MAP & PROOF FLOWCHARTS */}
          {activeConcept.engineType === 'logic_karnaugh_circuit' && (
            <div className="space-y-4">
              {/* Interactive Logic Gate & Truth Table */}
              <div className="bg-[#090b10] border border-slate-800 rounded-lg p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono-tech text-amber-400">
                    1. Circuito Logico Interattivo & Operatore su 𝔽₂
                  </span>
                  <div className="flex gap-1.5">
                    {(['AND', 'OR', 'XOR', 'IMPLIES', 'DEMORGAN'] as const).map((gt) => (
                      <button
                        key={gt}
                        onClick={() => setGateType(gt)}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono-tech cursor-pointer ${
                          gateType === gt
                            ? 'bg-amber-400 text-slate-950 font-semibold'
                            : 'bg-slate-900 text-slate-300 border border-slate-800'
                        }`}
                      >
                        {gt === 'IMPLIES' ? 'P → Q (¬P ∨ Q)' : gt === 'DEMORGAN' ? 'De Morgan ¬(A∧B)' : gt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-7 bg-[#07090e] border border-slate-800 rounded p-3">
                    <svg viewBox="0 0 360 130" className="w-full h-32">
                      {/* Input A button */}
                      <g onClick={() => setBitA(bitA ? 0 : 1)} className="cursor-pointer">
                        <rect x="12" y="22" width="48" height="28" rx="4" fill={bitA ? '#059669' : '#1e293b'} stroke="#475569" />
                        <text x="23" y="40" fill="#ffffff" fontSize="12" fontFamily="monospace">A = {bitA}</text>
                      </g>
                      {/* Input B button */}
                      <g onClick={() => setBitB(bitB ? 0 : 1)} className="cursor-pointer">
                        <rect x="12" y="78" width="48" height="28" rx="4" fill={bitB ? '#059669' : '#1e293b'} stroke="#475569" />
                        <text x="23" y="96" fill="#ffffff" fontSize="12" fontFamily="monospace">B = {bitB}</text>
                      </g>

                      {/* Wires to Gate */}
                      <path d="M 60 36 L 140 36 L 140 52 L 165 52" fill="none" stroke={bitA ? '#34d399' : '#475569'} strokeWidth="2.5" />
                      <path d="M 60 92 L 140 92 L 140 76 L 165 76" fill="none" stroke={bitB ? '#34d399' : '#475569'} strokeWidth="2.5" />

                      {/* Gate Body */}
                      <rect x="165" y="38" width="76" height="52" rx="8" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                      <text x="176" y="68" fill="#f59e0b" fontSize="11" fontFamily="monospace">{gateType}</text>

                      {/* Output Wire & Lamp */}
                      <line x1="241" y1="64" x2="290" y2="64" stroke={gateOut ? '#34d399' : '#475569'} strokeWidth="3" />
                      <circle cx="312" cy="64" r="18" fill={gateOut ? '#10b981' : '#1e293b'} stroke="#cbd5e1" strokeWidth="1.5" />
                      <text x="307" y="69" fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold">{gateOut}</text>
                    </svg>
                  </div>

                  <div className="md:col-span-5 text-xs font-mono-tech space-y-1.5 tabular-nums">
                    <div className="text-slate-400">Clicca A e B nello schema per commutare 0/1:</div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 text-amber-300">
                      {gateType === 'AND' && `f(A,B) = A · B = ${bitA} · ${bitB} = ${gateOut} (mod 2)`}
                      {gateType === 'OR' && `f(A,B) = A ⊕ B ⊕ AB = ${gateOut}`}
                      {gateType === 'XOR' && `f(A,B) = A + B mod 2 = ${gateOut}`}
                      {gateType === 'IMPLIES' && `A → B ≡ 1 + A + AB = ${gateOut} (Vacuamente vera se A=0!)`}
                      {gateType === 'DEMORGAN' && `¬(A ∧ B) ≡ ¬A ∨ ¬B = ${gateOut}`}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Quantificatori su D: <strong className="text-sky-300">∀x P(x)</strong> = cascata AND in serie · <strong className="text-emerald-300">∃x P(x)</strong> = banco OR in parallelo.
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive 4x4 Karnaugh Map & Proof Flowcharts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#090b10] border border-slate-800 rounded-lg p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono-tech">
                    <span className="text-sky-400">2. Mappa di Karnaugh Toroidale (Codice Gray)</span>
                    <span className="text-slate-400">Clicca le celle (0/1)</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1 text-center font-mono-tech text-xs tabular-nums">
                    <div className="text-[10px] text-slate-500 py-1">AB \ CD</div>
                    {['00', '01', '11', '10'].map((cd) => (
                      <div key={cd} className="text-[11px] text-amber-300 py-1">{cd}</div>
                    ))}
                    {['00', '01', '11', '10'].map((ab, rIdx) => (
                      <React.Fragment key={ab}>
                        <div className="text-[11px] text-sky-300 py-2">{ab}</div>
                        {[0, 1, 2, 3].map((cIdx) => {
                          const cellIdx = rIdx * 4 + cIdx;
                          const val = kmapCells[cellIdx];
                          return (
                            <button
                              key={cIdx}
                              onClick={() => {
                                const next = [...kmapCells];
                                next[cellIdx] = val ? 0 : 1;
                                setKmapCells(next);
                              }}
                              className={`py-2 rounded border cursor-pointer font-bold transition-colors ${
                                val
                                  ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                                  : 'bg-slate-900 border-slate-800 text-slate-500'
                              }`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="text-[11px] font-mono-tech text-slate-400">
                    Topologia: la colonna <code className="text-amber-300">10</code> è adiacente a <code className="text-amber-300">00</code> (distanza di Hamming = 1 sul Toro T²!).
                  </div>
                </div>

                {/* Proof Flowcharts & Gödel Self-Reference */}
                <div className="bg-[#090b10] border border-slate-800 rounded-lg p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-tech text-pink-400">3. Flowchart Dimostrativi & Gödel</span>
                    <div className="flex gap-1">
                      {(['assurdo', 'induzione', 'contronominale', 'godel'] as const).map((pf) => (
                        <button
                          key={pf}
                          onClick={() => setProofFlowType(pf)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono-tech cursor-pointer ${
                            proofFlowType === pf
                              ? 'bg-pink-500 text-slate-950 font-semibold'
                              : 'bg-slate-900 text-slate-300 border border-slate-800'
                          }`}
                        >
                          {pf}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#07090e] border border-slate-800 rounded p-3 text-xs font-mono-tech space-y-2">
                    {proofFlowType === 'assurdo' && (
                      <>
                        <div className="text-amber-300">[Ipotesi P] + [Assunzione temporanea ¬Q]</div>
                        <div className="text-slate-400">↓ Catena deduttiva (Modus Ponens / Algebra)</div>
                        <div className="text-rose-400">[Contraddizione Esplicita: R ∧ ¬R (⊥)]</div>
                        <div className="text-emerald-300">⇒ Scarica [¬Q] e concludi Q (Reductio ad Absurdum)</div>
                      </>
                    )}
                    {proofFlowType === 'induzione' && (
                      <>
                        <div className="text-amber-300">1. Passo Base: Verifica P(n₀)</div>
                        <div className="text-sky-300">2. Passo Induttivo: Fissa k ≥ n₀, assumi [P(k)] ──► deduci P(k+1)</div>
                        <div className="text-emerald-300">⇒ Effetto Domino Ben Fondato: ∀n ≥ n₀, P(n)</div>
                      </>
                    )}
                    {proofFlowType === 'contronominale' && (
                      <>
                        <div className="text-amber-300">Obiettivo: P ⇒ Q  ≡  ¬Q ⇒ ¬P</div>
                        <div className="text-sky-300">1. Assumi temporaneamente [¬Q]</div>
                        <div className="text-emerald-300">2. Deduci direttamente ¬P ⇒ Scarica [¬Q] e concludi P ⇒ Q</div>
                      </>
                    )}
                    {proofFlowType === 'godel' && (
                      <>
                        <div className="text-amber-300">Aritmetizzazione di Gödel: Formula φ ──⌜φ⌝──► Numero ℕ</div>
                        <div className="text-sky-300">Lemma Diagonale: Costruisci G tale che PA ⊢ G ↔ ¬Prov(⌜G⌝)</div>
                        <div className="text-emerald-300">Se PA è coerente: PA ⊬ G e PA ⊬ ¬G (Verità &gt; Dimostrabilità!)</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ENGINE: CHOMSKY, AUTOMATA, TURING MACHINE TAPE & LAMBDA CALCULUS */}
          {activeConcept.engineType === 'automata_turing_chomsky' && (
            <div className="space-y-4">
              <div className="bg-[#090b10] border border-slate-800 rounded-lg p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono-tech text-amber-400">
                    Simulatore Macchina di Turing (Inversione Bit: δ(q,0)=(q,1,R), δ(q,1)=(q,0,R), δ(q,B)=(HALT))
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={stepTuring}
                      className="px-3 py-1 rounded bg-emerald-500 text-slate-950 font-mono-tech text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3" /> Step δ
                    </button>
                    <button
                      onClick={resetTuring}
                      className="px-3 py-1 rounded bg-slate-800 text-slate-200 font-mono-tech text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                  </div>
                </div>

                {/* Turing Tape Cells */}
                <div className="flex items-center justify-center gap-2 py-2 font-mono-tech tabular-nums">
                  {turingTape.map((cell, idx) => {
                    const isHead = idx === turingHead;
                    return (
                      <div
                        key={idx}
                        className={`w-12 h-14 rounded-lg border flex flex-col items-center justify-center transition-all ${
                          isHead
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200 scale-105'
                            : 'bg-[#07090e] border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="text-base font-bold">{cell}</span>
                        <span className="text-[10px] text-slate-500">{isHead ? `▲ ${turingState}` : `#${idx}`}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chomsky Pyramid & Lambda β-Reduction */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#090b10] border border-slate-800 rounded-lg p-4 space-y-2">
                  <div className="text-xs font-mono-tech text-sky-400">Gerarchia di Chomsky (Inclusioni Strette)</div>
                  <div className="space-y-1.5 font-mono-tech text-xs">
                    <div className="p-2 rounded bg-rose-950/30 border border-rose-500/40 text-rose-200">
                      Tipo 0: Ricorsivamente Enumerabili (RE) ↔ Macchina di Turing
                    </div>
                    <div className="p-2 rounded bg-amber-950/30 border border-amber-500/40 text-amber-200 ml-3">
                      Tipo 1: Context-Sensitive (αAβ→αγβ) ↔ LBA ({'{aⁿbⁿcⁿ}'})
                    </div>
                    <div className="p-2 rounded bg-sky-950/30 border border-sky-500/40 text-sky-200 ml-6">
                      Tipo 2: Context-Free (A→γ) ↔ Automa a Pila PDA ({'{aⁿbⁿ}'})
                    </div>
                    <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 ml-9">
                      Tipo 3: Regolari (A→aB) ↔ DFA / NFA / Espressioni Regolari
                    </div>
                  </div>
                </div>

                <div className="bg-[#090b10] border border-slate-800 rounded-lg p-4 space-y-2.5 font-mono-tech text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-pink-400">Lambda Calcolo: β-Riduzione Grafica</span>
                    <button
                      onClick={() => setLambdaStep((s) => (s + 1) % 3)}
                      className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 text-[11px] cursor-pointer"
                    >
                      Passo β ({lambdaStep}/2)
                    </button>
                  </div>
                  <div className="bg-[#07090e] border border-slate-800 rounded p-3 space-y-1.5">
                    <div className={lambdaStep === 0 ? 'text-amber-300 font-bold' : 'text-slate-500'}>
                      0. Redex: ((λf. λx. f (f x)) g) y   [Numerale di Church 2]
                    </div>
                    <div className={lambdaStep === 1 ? 'text-sky-300 font-bold' : 'text-slate-500'}>
                      1. Sostituisci f := g  ──►  (λx. g (g x)) y
                    </div>
                    <div className={lambdaStep === 2 ? 'text-emerald-300 font-bold' : 'text-slate-500'}>
                      2. Forma Normale (Church-Rosser):  g (g y)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ENGINE: LINEAR ALGEBRA, GRAM-SCHMIDT & DE CASTELJAU BÉZIER */}
          {activeConcept.engineType === 'linalg_gram_bezier' && (
            <div className="bg-[#090b10] border border-slate-800 rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Gram-Schmidt & Determinant Area SVG */}
                <div className="bg-[#07090e] border border-slate-800 rounded p-3 space-y-2">
                  <div className="flex justify-between text-xs font-mono-tech tabular-nums">
                    <span className="text-sky-400">Gram-Schmidt & Area |det[v₁,v₂]|</span>
                    <span className="text-amber-300">θ = {gramAngle}°</span>
                  </div>
                  <svg viewBox="-20 -130 220 150" className="w-full h-44">
                    <line x1="-10" y1="0" x2="190" y2="0" stroke="#334155" strokeWidth="1" />
                    <line x1="0" y1="10" x2="0" y2="-120" stroke="#334155" strokeWidth="1" />
                    {(() => {
                      const rad = (gramAngle * Math.PI) / 180;
                      const v1x = 120;
                      const v2x = 110 * Math.cos(rad);
                      const v2y = -110 * Math.sin(rad);
                      return (
                        <>
                          {/* Parallelogram area = det */}
                          <polygon
                            points={`0,0 ${v1x},0 ${v1x + v2x},${v2y} ${v2x},${v2y}`}
                            fill="rgba(56,189,248,0.14)"
                            stroke="#38bdf8"
                            strokeDasharray="3,2"
                          />
                          {/* u1 = v1 */}
                          <line x1="0" y1="0" x2={v1x} y2="0" stroke="#38bdf8" strokeWidth="2.5" />
                          <text x={v1x - 25} y="14" fill="#38bdf8" fontSize="10" fontFamily="monospace">u₁ = v₁</text>
                          {/* v2 */}
                          <line x1="0" y1="0" x2={v2x} y2={v2y} stroke="#f59e0b" strokeWidth="2.5" />
                          <text x={v2x + 5} y={v2y} fill="#f59e0b" fontSize="10" fontFamily="monospace">v₂</text>
                          {/* Orthogonal component u2 = v2 - proj(v2) */}
                          <line x1={v2x} y1="0" x2={v2x} y2={v2y} stroke="#34d399" strokeWidth="2.5" />
                          <text x={v2x + 5} y={v2y / 2} fill="#34d399" fontSize="10" fontFamily="monospace">u₂ ⊥ u₁</text>
                        </>
                      );
                    })()}
                  </svg>
                  <input
                    type="range"
                    min="15"
                    max="135"
                    value={gramAngle}
                    onChange={(e) => setGramAngle(parseInt(e.target.value, 10))}
                    className="w-full accent-amber-400"
                  />
                </div>

                {/* De Casteljau Bézier Convex Combination */}
                <div className="bg-[#07090e] border border-slate-800 rounded p-3 space-y-2">
                  <div className="flex justify-between text-xs font-mono-tech tabular-nums">
                    <span className="text-emerald-400">Curva di Bézier (De Casteljau)</span>
                    <span className="text-amber-300">t = {bezierT.toFixed(2)}</span>
                  </div>
                  <svg viewBox="0 0 220 140" className="w-full h-44">
                    {(() => {
                      const P0 = { x: 20, y: 120 };
                      const P1 = { x: 55, y: 20 };
                      const P2 = { x: 165, y: 20 };
                      const P3 = { x: 200, y: 120 };
                      const lerp = (a: typeof P0, b: typeof P0, t: number) => ({
                        x: (1 - t) * a.x + t * b.x,
                        y: (1 - t) * a.y + t * b.y
                      });
                      const A = lerp(P0, P1, bezierT);
                      const B = lerp(P1, P2, bezierT);
                      const C = lerp(P2, P3, bezierT);
                      const D = lerp(A, B, bezierT);
                      const E = lerp(B, C, bezierT);
                      const Pt = lerp(D, E, bezierT);

                      const curvePath = Array.from({ length: 41 }, (_, i) => {
                        const s = i / 40;
                        const u = 1 - s;
                        const x = u*u*u*P0.x + 3*u*u*s*P1.x + 3*u*s*s*P2.x + s*s*s*P3.x;
                        const y = u*u*u*P0.y + 3*u*u*s*P1.y + 3*u*s*s*P2.y + s*s*s*P3.y;
                        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                      }).join(' ');

                      return (
                        <>
                          <polyline points="20,120 55,20 165,20 200,120" fill="none" stroke="#475569" strokeWidth="1.2" strokeDasharray="3,3" />
                          <polyline points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="none" stroke="#38bdf8" strokeWidth="1.2" />
                          <line x1={D.x} y1={D.y} x2={E.x} y2={E.y} stroke="#f59e0b" strokeWidth="1.5" />
                          <path d={curvePath} fill="none" stroke="#34d399" strokeWidth="2.5" />
                          <circle cx={Pt.x} cy={Pt.y} r="4.5" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
                        </>
                      );
                    })()}
                  </svg>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.02"
                    value={bezierT}
                    onChange={(e) => setBezierT(parseFloat(e.target.value))}
                    className="w-full accent-emerald-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ENGINE: CALCULUS, RIEMANN vs LEBESGUE, FOURIER & RIEMANN SURFACE √z */}
          {activeConcept.engineType === 'calculus_fourier_ode' && (
            <div className="bg-[#090b10] border border-slate-800 rounded-lg p-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setRiemannBranchMode(false)}
                    className={`px-3 py-1 rounded text-xs font-mono-tech cursor-pointer ${
                      !riemannBranchMode
                        ? 'bg-amber-400 text-slate-950 font-semibold'
                        : 'bg-slate-900 text-slate-300 border border-slate-800'
                    }`}
                  >
                    Riemann vs Lebesgue & Serie di Fourier
                  </button>
                  <button
                    onClick={() => setRiemannBranchMode(true)}
                    className={`px-3 py-1 rounded text-xs font-mono-tech cursor-pointer ${
                      riemannBranchMode
                        ? 'bg-amber-400 text-slate-950 font-semibold'
                        : 'bg-slate-900 text-slate-300 border border-slate-800'
                    }`}
                  >
                    Superficie di Riemann 3D (w = √z & Branch Cut)
                  </button>
                </div>
              </div>

              {!riemannBranchMode && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Riemann (vertical) vs Lebesgue (horizontal) integration */}
                  <div className="bg-[#07090e] border border-slate-800 rounded p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono-tech">
                      <span className="text-sky-400">Integrale: Riemann vs Lebesgue</span>
                      <button
                        onClick={() => setIntegMode(integMode === 'riemann' ? 'lebesgue' : 'riemann')}
                        className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 text-[11px] cursor-pointer"
                      >
                        Modo: {integMode.toUpperCase()}
                      </button>
                    </div>
                    <svg viewBox="0 0 220 130" className="w-full h-40">
                      {integMode === 'riemann'
                        ? Array.from({ length: 10 }, (_, i) => {
                            const x = 15 + i * 19;
                            const h = 25 + 75 * Math.sin(((i + 0.5) / 10) * Math.PI);
                            return (
                              <rect
                                key={i}
                                x={x}
                                y={115 - h}
                                width="17"
                                height={h}
                                fill="rgba(56,189,248,0.25)"
                                stroke="#38bdf8"
                              />
                            );
                          })
                        : Array.from({ length: 6 }, (_, j) => {
                            const yLevel = 25 + j * 14;
                            const w = 170 * Math.cos((j / 6.5) * (Math.PI / 2));
                            return (
                              <rect
                                key={j}
                                x={110 - w / 2}
                                y={115 - yLevel - 12}
                                width={w}
                                height="12"
                                fill="rgba(245,158,11,0.25)"
                                stroke="#f59e0b"
                              />
                            );
                          })}
                      <path
                        d={Array.from({ length: 41 }, (_, i) => {
                          const t = i / 40;
                          const x = 15 + t * 190;
                          const y = 115 - (25 + 75 * Math.sin(t * Math.PI));
                          return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                        }).join(' ')}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                    </svg>
                    <div className="text-[11px] font-mono-tech text-slate-400">
                      {integMode === 'riemann'
                        ? 'Riemann: partiziona l’asse X (dominio) in colonne verticali dx.'
                        : 'Lebesgue: partiziona l’asse Y (codominio) misurando gli insiemi di livello {f > y_k}!'}
                    </div>
                  </div>

                  {/* Fourier Wave Sum */}
                  <div className="bg-[#07090e] border border-slate-800 rounded p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono-tech tabular-nums">
                      <span className="text-emerald-400">Serie di Fourier (Armoniche N={fourierHarmonics})</span>
                    </div>
                    <svg viewBox="0 0 220 130" className="w-full h-40">
                      <line x1="10" y1="65" x2="210" y2="65" stroke="#334155" />
                      <path
                        d={Array.from({ length: 120 }, (_, i) => {
                          const t = (i / 119) * Math.PI * 2;
                          let sum = 0;
                          for (let k = 1; k <= fourierHarmonics; k++) {
                            const n = 2 * k - 1;
                            sum += Math.sin(n * t) / n;
                          }
                          const x = 10 + (i / 119) * 200;
                          const y = 65 - sum * 42;
                          return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                        }).join(' ')}
                        fill="none"
                        stroke="#34d399"
                        strokeWidth="2"
                      />
                    </svg>
                    <input
                      type="range"
                      min="1"
                      max="15"
                      value={fourierHarmonics}
                      onChange={(e) => setFourierHarmonics(parseInt(e.target.value, 10))}
                      className="w-full accent-emerald-400"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ENGINE: FRACTALS (SIERPINSKI, KOCH, CANTOR, JULIA) */}
          {activeConcept.engineType === 'fractals_cantor_julia' && (
            <div className="bg-[#090b10] border border-slate-800 rounded-lg p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono-tech text-xs tabular-nums">
                <div className="flex gap-1.5">
                  {(['sierpinski', 'koch', 'cantor'] as const).map((ft) => (
                    <button
                      key={ft}
                      onClick={() => setFractalType(ft)}
                      className={`px-2.5 py-1 rounded cursor-pointer ${
                        fractalType === ft
                          ? 'bg-amber-400 text-slate-950 font-semibold'
                          : 'bg-slate-900 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {ft.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-300">Iterazione IFS k = {fractalDepth}:</span>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={fractalDepth}
                    onChange={(e) => setFractalDepth(parseInt(e.target.value, 10))}
                    className="w-28 accent-amber-400"
                  />
                </div>
              </div>

              <svg viewBox="0 0 320 190" className="w-full h-56 bg-[#07090e] rounded border border-slate-800">
                {fractalType === 'sierpinski' &&
                  (() => {
                    const tris: { x1: number; y1: number; x2: number; y2: number; x3: number; y3: number }[] = [];
                    const build = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, d: number) => {
                      if (d === 0) {
                        tris.push({ x1, y1, x2, y2, x3, y3 });
                        return;
                      }
                      const mx12 = (x1 + x2) / 2, my12 = (y1 + y2) / 2;
                      const mx23 = (x2 + x3) / 2, my23 = (y2 + y3) / 2;
                      const mx31 = (x3 + x1) / 2, my31 = (y3 + y1) / 2;
                      build(x1, y1, mx12, my12, mx31, my31, d - 1);
                      build(mx12, my12, x2, y2, mx23, my23, d - 1);
                      build(mx31, my31, mx23, my23, x3, y3, d - 1);
                    };
                    build(60, 175, 260, 175, 160, 15, fractalDepth);
                    return tris.map((t, i) => (
                      <polygon
                        key={i}
                        points={`${t.x1},${t.y1} ${t.x2},${t.y2} ${t.x3},${t.y3}`}
                        fill="rgba(56,189,248,0.25)"
                        stroke="#38bdf8"
                        strokeWidth="0.6"
                      />
                    ));
                  })()}

                {fractalType === 'koch' &&
                  (() => {
                    let pts = [{ x: 20, y: 145 }, { x: 300, y: 145 }];
                    for (let d = 0; d < fractalDepth; d++) {
                      const next: typeof pts = [];
                      for (let i = 0; i < pts.length - 1; i++) {
                        const a = pts[i], b = pts[i + 1];
                        const dx = (b.x - a.x) / 3, dy = (b.y - a.y) / 3;
                        const p1 = { x: a.x + dx, y: a.y + dy };
                        const p3 = { x: a.x + 2 * dx, y: a.y + 2 * dy };
                        const p2 = {
                          x: p1.x + dx * 0.5 + dy * 0.866,
                          y: p1.y + dy * 0.5 - dx * 0.866
                        };
                        next.push(a, p1, p2, p3);
                      }
                      next.push(pts[pts.length - 1]);
                      pts = next;
                    }
                    return (
                      <polyline
                        points={pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
                        fill="none"
                        stroke="#34d399"
                        strokeWidth="1.5"
                      />
                    );
                  })()}

                {fractalType === 'cantor' &&
                  (() => {
                    const bars: { x: number; y: number; w: number }[] = [];
                    const buildC = (x: number, w: number, level: number) => {
                      bars.push({ x, y: 20 + level * 26, w });
                      if (level < fractalDepth) {
                        buildC(x, w / 3, level + 1);
                        buildC(x + (2 * w) / 3, w / 3, level + 1);
                      }
                    };
                    buildC(20, 280, 0);
                    return bars.map((b, idx) => (
                      <rect key={idx} x={b.x} y={b.y} width={b.w} height="12" fill="#f59e0b" rx="2" />
                    ));
                  })()}
              </svg>
            </div>
          )}

          {/* ENGINE: CATEGORY THEORY, CURRY-HOWARD-LAMBEK, HoTT PATHS & KNOTS */}
          {activeConcept.engineType === 'category_hott_knots' && (
            <div className="bg-[#090b10] border border-slate-800 rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Commutative Diagram & Curry-Howard-Lambek */}
                <div className="bg-[#07090e] border border-slate-800 rounded p-3 space-y-2">
                  <div className="text-xs font-mono-tech text-amber-400">
                    Triangolo CHL & Diagramma Commutativo (g ∘ f = h)
                  </div>
                  <svg viewBox="0 0 240 130" className="w-full h-36">
                    <circle cx="45" cy="95" r="18" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                    <text x="40" y="99" fill="#38bdf8" fontSize="11" fontFamily="monospace">A</text>
                    <circle cx="120" cy="25" r="18" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                    <text x="115" y="29" fill="#f59e0b" fontSize="11" fontFamily="monospace">B</text>
                    <circle cx="195" cy="95" r="18" fill="#0f172a" stroke="#34d399" strokeWidth="2" />
                    <text x="190" y="99" fill="#34d399" fontSize="11" fontFamily="monospace">C</text>

                    <line x1="60" y1="80" x2="105" y2="38" stroke="#94a3b8" strokeWidth="2" />
                    <text x="68" y="52" fill="#e2e8f0" fontSize="10" fontFamily="monospace">f : A→B</text>
                    <line x1="135" y1="38" x2="180" y2="80" stroke="#94a3b8" strokeWidth="2" />
                    <text x="160" y="52" fill="#e2e8f0" fontSize="10" fontFamily="monospace">g : B→C</text>
                    <line x1="65" y1="95" x2="175" y2="95" stroke="#34d399" strokeWidth="2" strokeDasharray="4,2" />
                    <text x="95" y="112" fill="#34d399" fontSize="10" fontFamily="monospace">h = g ∘ f</text>
                  </svg>
                </div>

                {/* HoTT Homotopy Path Space x =_A y */}
                <div className="bg-[#07090e] border border-slate-800 rounded p-3 space-y-2">
                  <div className="flex justify-between text-xs font-mono-tech tabular-nums">
                    <span className="text-pink-400">HoTT: Uguaglianza come Cammino p : x =_A y</span>
                    <span className="text-slate-300">s = {homotopyS.toFixed(2)}</span>
                  </div>
                  <svg viewBox="0 0 240 130" className="w-full h-36">
                    <ellipse cx="120" cy="65" rx="105" ry="52" fill="rgba(244,114,182,0.08)" stroke="#f472b6" strokeDasharray="3,3" />
                    <path d="M 45 65 Q 120 15 195 65" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,2" />
                    <path d="M 45 65 Q 120 115 195 65" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,2" />
                    {/* Interpolated homotopy path */}
                    <path
                      d={`M 45 65 Q 120 ${(15 + homotopyS * 100).toFixed(1)} 195 65`}
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="2.5"
                    />
                    <circle cx="45" cy="65" r="5" fill="#ffffff" />
                    <text x="32" y="82" fill="#ffffff" fontSize="10" fontFamily="monospace">x:A</text>
                    <circle cx="195" cy="65" r="5" fill="#ffffff" />
                    <text x="185" y="82" fill="#ffffff" fontSize="10" fontFamily="monospace">y:A</text>
                  </svg>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={homotopyS}
                    onChange={(e) => setHomotopyS(parseFloat(e.target.value))}
                    className="w-full accent-pink-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ENGINE: PROBABILITY, PCA, ELLIPTIC CURVE GROUP LAW & TRANSFORMER ATTENTION */}
          {activeConcept.engineType === 'prob_pca_elliptic_ai' && (
            <div className="bg-[#090b10] border border-slate-800 rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Elliptic Curve Group Addition P + Q = -R */}
                <div className="bg-[#07090e] border border-slate-800 rounded p-3 space-y-2">
                  <div className="flex justify-between text-xs font-mono-tech tabular-nums">
                    <span className="text-amber-400">Curva Ellittica y² = x³ - x + 1 (P + Q)</span>
                    <span className="text-emerald-300">x_P = {ecX1.toFixed(2)}</span>
                  </div>
                  <svg viewBox="-2.5 -2.5 5 5" className="w-full h-40">
                    <line x1="-2.5" y1="0" x2="2.5" y2="0" stroke="#334155" strokeWidth="0.04" />
                    <line x1="0" y1="-2.5" x2="0" y2="2.5" stroke="#334155" strokeWidth="0.04" />
                    {/* Plot y = ±sqrt(x^3 - x + 1) */}
                    {[-1, 1].map((sign) => (
                      <path
                        key={sign}
                        d={Array.from({ length: 65 }, (_, i) => {
                          const x = -1.32 + (i / 64) * 3.2;
                          const val = Math.max(0, x * x * x - x + 1);
                          const y = -sign * Math.sqrt(val);
                          return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
                        }).join(' ')}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="0.08"
                      />
                    ))}
                    {(() => {
                      const y1 = Math.sqrt(Math.max(0, ecX1 * ecX1 * ecX1 - ecX1 + 1));
                      const y2 = Math.sqrt(Math.max(0, ecX2 * ecX2 * ecX2 - ecX2 + 1));
                      const m = (y2 - y1) / (ecX2 - ecX1 || 0.01);
                      const x3 = m * m - ecX1 - ecX2;
                      const y3 = y1 + m * (x3 - ecX1);
                      return (
                        <>
                          <line x1="-2.2" y1={-(y1 + m * (-2.2 - ecX1))} x2="2.2" y2={-(y1 + m * (2.2 - ecX1))} stroke="#f59e0b" strokeWidth="0.05" />
                          <line x1={x3} y1={-y3} x2={x3} y2={y3} stroke="#34d399" strokeWidth="0.05" strokeDasharray="0.1,0.1" />
                          <circle cx={ecX1} cy={-y1} r="0.12" fill="#f59e0b" />
                          <circle cx={ecX2} cy={-y2} r="0.12" fill="#f59e0b" />
                          <circle cx={x3} cy={y3} r="0.14" fill="#34d399" />
                        </>
                      );
                    })()}
                  </svg>
                  <input
                    type="range"
                    min="-1.25"
                    max="-0.2"
                    step="0.05"
                    value={ecX1}
                    onChange={(e) => setEcX1(parseFloat(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                {/* Transformer Bipartite Attention & PCA */}
                <div className="bg-[#07090e] border border-slate-800 rounded p-3 space-y-2">
                  <div className="text-xs font-mono-tech text-sky-400">
                    Transformer Self-Attention: Softmax(QKᵀ/√d_k)
                  </div>
                  <svg viewBox="0 0 240 140" className="w-full h-40">
                    {['Token₁ (Query)', 'Token₂ (Query)', 'Token₃ (Query)'].map((t, i) => (
                      <g key={t}>
                        <rect x="10" y={18 + i * 40} width="78" height="24" rx="4" fill="#0f172a" stroke="#38bdf8" />
                        <text x="16" y={34 + i * 40} fill="#e2e8f0" fontSize="8.5" fontFamily="monospace">{t}</text>
                      </g>
                    ))}
                    {['Key₁ / Val₁', 'Key₂ / Val₂', 'Key₃ / Val₃'].map((t, j) => (
                      <g key={t}>
                        <rect x="152" y={18 + j * 40} width="78" height="24" rx="4" fill="#0f172a" stroke="#f59e0b" />
                        <text x="160" y={34 + j * 40} fill="#e2e8f0" fontSize="8.5" fontFamily="monospace">{t}</text>
                      </g>
                    ))}
                    {/* Weighted bipartite edges */}
                    {[0, 1, 2].map((i) =>
                      [0, 1, 2].map((j) => {
                        const weight = i === j ? 2.5 : 0.7;
                        return (
                          <line
                            key={`${i}-${j}`}
                            x1="88"
                            y1={30 + i * 40}
                            x2="152"
                            y2={30 + j * 40}
                            stroke={i === j ? '#34d399' : '#64748b'}
                            strokeWidth={weight}
                            opacity={i === j ? 0.9 : 0.35}
                          />
                        );
                      })
                    )}
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT 5 COLS: THE 3 MANDATORY VISUAL LENSES DECK */}
        <div className="lg:col-span-5 bg-[#0f131c] border border-slate-800/90 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono-tech text-amber-400">
              Le 3 Visualizzazioni Obbligatorie del Concetto
            </span>
            <div className="flex gap-1">
              {[
                { id: 'all3', label: 'Tutte (3)' },
                { id: 'linalg', label: '1. Lineare' },
                { id: 'analytic', label: '2. Analitica/Proiet.' },
                { id: 'intuitive', label: '3. Circuito/Grafo' }
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => setActiveLens(l.id as any)}
                  className={`px-2 py-1 rounded text-[11px] font-mono-tech cursor-pointer ${
                    activeLens === l.id
                      ? 'bg-amber-400 text-slate-950 font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Formal 1-Line Definition */}
          <div className="bg-[#090b10] border border-slate-800 rounded p-3.5 space-y-1">
            <div className="text-[11px] font-mono-tech text-slate-400">
              Definizione Formale:
            </div>
            <p className="text-xs text-slate-100 leading-relaxed">
              {activeConcept.formalDefinition}
            </p>
          </div>

          {/* LENS 1: Formalismo Algebra Lineare */}
          {(activeLens === 'all3' || activeLens === 'linalg') && (
            <div className="bg-[#090b10] border border-sky-500/30 rounded-lg p-4 space-y-2.5">
              <div className="text-xs font-semibold text-sky-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-sky-400" />
                1. Formalismo Algebra Lineare (Vettori, Matrici, Trasformazioni)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeConcept.linearAlgebraVis.summary}
              </p>
              <div className="bg-[#07090e] border border-slate-800 rounded p-2.5 font-mono-tech text-[11px] text-amber-300 overflow-x-auto">
                {activeConcept.linearAlgebraVis.matrixOrVectorFormula}
              </div>
              <pre className="bg-[#07090e] border border-slate-800 rounded p-2.5 font-mono-tech text-[11px] text-sky-200 overflow-x-auto">
                {activeConcept.linearAlgebraVis.codeSnippet}
              </pre>
            </div>
          )}

          {/* LENS 2: Geometria Analitica / Proiettiva / Differenziale */}
          {(activeLens === 'all3' || activeLens === 'analytic') && (
            <div className="bg-[#090b10] border border-amber-500/30 rounded-lg p-4 space-y-2.5">
              <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                2. Geometria Analitica, Proiettiva & Differenziale
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeConcept.analyticProjectiveDiffVis.summary}
              </p>
              <div className="bg-[#07090e] border border-slate-800 rounded p-2.5 font-mono-tech text-[11px] text-emerald-300 overflow-x-auto">
                {activeConcept.analyticProjectiveDiffVis.equations}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                <strong className="text-amber-200">Intuizione Proiettiva/Differenziale:</strong>{' '}
                {activeConcept.analyticProjectiveDiffVis.geometricInsight}
              </p>
            </div>
          )}

          {/* LENS 3: Visualizzazione Intuitiva / Circuito / Grafo / Morphing */}
          {(activeLens === 'all3' || activeLens === 'intuitive') && (
            <div className="bg-[#090b10] border border-emerald-500/30 rounded-lg p-4 space-y-2.5">
              <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                3. Visualizzazione Intuitiva, Circuito, Grafo & Morphing
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeConcept.intuitiveCircuitGraphVis.summary}
              </p>
              <div className="bg-[#07090e] border border-slate-800 rounded p-2.5 font-mono-tech text-[11px] text-pink-300 overflow-x-auto">
                {activeConcept.intuitiveCircuitGraphVis.diagramStructure}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                <strong className="text-emerald-200">Sequenza Morphing:</strong>{' '}
                {activeConcept.intuitiveCircuitGraphVis.morphingStepByStep}
              </p>
            </div>
          )}

          {/* Accessory Graph Connections */}
          <div className="bg-[#090b10] border border-slate-800 rounded p-3 text-xs">
            <span className="text-slate-400 font-mono-tech">Collegamenti nel Grafo Accessorio: </span>
            <span className="text-slate-200">
              {activeConcept.connections.join(' · ')}
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* REGISTRO DI COPERTURA TOTALE LOSSLESS (ELENCO A + B + C) & EXPORT MARKDOWN */}
      {/* ==================================================================== */}
      <div className="bg-[#0f131c] border border-slate-800/90 rounded-lg p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs font-mono-tech text-emerald-400">
              Registro di Copertura Lossless (Elenco A + B + C del Corpus Tecnico)
            </div>
            <h3 className="text-lg font-serif-editorial font-semibold text-slate-100 mt-0.5">
              Mappatura Integrale di Tutti gli Argomenti e Gestione Voci Non Visualizzabili
            </h3>
          </div>
          <button
            onClick={handleCopyMarkdown}
            className="px-4 py-2 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs flex items-center gap-2 cursor-pointer shrink-0"
          >
            {copiedSpec ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedSpec ? 'Specifica Copiata!' : 'Copia Specifica Completa Markdown'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono-tech">
                <th className="py-2.5 px-3">Argomento / Concetto del Corpus</th>
                <th className="py-2.5 px-3">Sezione Sorgente</th>
                <th className="py-2.5 px-3">Stato e Apparato Visuale</th>
                <th className="py-2.5 px-3">Azione</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {LOSSLESS_CORPUS_COVERAGE_REGISTRY.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50">
                  <td className="py-2.5 px-3 font-medium text-slate-200">{row.term}</td>
                  <td className="py-2.5 px-3 font-mono-tech text-[11px] text-slate-400">{row.sectionOrigin}</td>
                  <td className="py-2.5 px-3 text-slate-300">{row.visualStatus}</td>
                  <td className="py-2.5 px-3">
                    {row.mappedConceptId !== 'NON_VISUALIZZABILE' ? (
                      <button
                        onClick={() => {
                          setSelectedFamily('all');
                          setSelectedConceptId(row.mappedConceptId);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-amber-400 hover:underline font-mono-tech text-[11px] flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      >
                        Apri Visualizzatore <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-rose-400 font-mono-tech text-[11px]">[NON VISUALIZZABILE]</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
