import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  ATLAS_NODES,
  ATLAS_EDGES,
  DISCIPLINE_META,
  PATTERN_META,
  AtlasNode,
  DisciplineId,
  EdgeRelationType,
  PatternId
} from '../data/ontologyData';
import {
  Compass,
  Route,
  Sparkles,
  Layers,
  Code2,
  ArrowRight,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Network
} from 'lucide-react';

interface AtlasGraph3DProps {
  onOpenLab: (lab: 'dimensional' | 'tensor' | 'operator' | 'rotations' | 'cnl') => void;
}

const RELATION_COLORS: Record<EdgeRelationType, { label: string; color: string }> = {
  prerequisito_di: { label: 'Prerequisito di', color: '#94a3b8' },
  generalizza: { label: 'Generalizza', color: '#60a5fa' },
  specializza: { label: 'Specializza', color: '#38bdf8' },
  isomorfo_a: { label: 'Isomorfo a (≅)', color: '#34d399' },
  duale_di: { label: 'Duale di (↔)', color: '#f472b6' },
  analogo_a: { label: 'Analogo strutturale', color: '#f59e0b' },
  utilizzato_in: { label: 'Utilizzato in', color: '#a78bfa' },
  dimostrato_da: { label: 'Dimostrato da', color: '#fb7185' }
};

export const AtlasGraph3D: React.FC<AtlasGraph3DProps> = ({ onOpenLab }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('triangolo');
  const [activeDiscipline, setActiveDiscipline] = useState<DisciplineId | 'all'>('all');
  const [activeLevel, setActiveLevel] = useState<number | 'all'>('all');
  const [activeRelation, setActiveRelation] = useState<EdgeRelationType | 'all'>('all');
  const [activePattern, setActivePattern] = useState<PatternId | null>(null);

  // Learning Path calculator state
  const [pathMode, setPathMode] = useState<boolean>(false);
  const [pathStartId, setPathStartId] = useState<string>('punto_vettore');
  const [pathTargetId, setPathTargetId] = useState<string>('tensore_riemann');
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [projectedLabels, setProjectedLabels] = useState<
    { id: string; x: number; y: number; visible: boolean }[]
  >([]);

  const resetCameraRef = useRef<(() => void) | null>(null);

  // Compute shortest undirected/directed pedagogical path between pathStartId and pathTargetId
  const learningPath = useMemo(() => {
    if (!pathMode) return { nodeIds: new Set<string>(), edgeIds: new Set<string>(), orderedNodes: [] as AtlasNode[] };
    const queue: { id: string; nodes: string[]; edges: string[] }[] = [
      { id: pathStartId, nodes: [pathStartId], edges: [] }
    ];
    const visited = new Set<string>([pathStartId]);

    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (curr.id === pathTargetId) {
        const ordered = curr.nodes
          .map((nid) => ATLAS_NODES.find((n) => n.id === nid))
          .filter(Boolean) as AtlasNode[];
        return {
          nodeIds: new Set(curr.nodes),
          edgeIds: new Set(curr.edges),
          orderedNodes: ordered
        };
      }
      for (const edge of ATLAS_EDGES) {
        let nextId: string | null = null;
        if (edge.source === curr.id) nextId = edge.target;
        else if (edge.target === curr.id) nextId = edge.source;
        if (nextId && !visited.has(nextId)) {
          visited.add(nextId);
          queue.push({
            id: nextId,
            nodes: [...curr.nodes, nextId],
            edges: [...curr.edges, edge.id]
          });
        }
      }
    }
    return { nodeIds: new Set<string>(), edgeIds: new Set<string>(), orderedNodes: [] as AtlasNode[] };
  }, [pathMode, pathStartId, pathTargetId]);

  const selectedNode = useMemo(
    () => ATLAS_NODES.find((n) => n.id === selectedNodeId) || ATLAS_NODES[0],
    [selectedNodeId]
  );

  // Neighbors of selected node ("Estendere la rete")
  const neighborConnections = useMemo(() => {
    return ATLAS_EDGES.filter(
      (e) => e.source === selectedNodeId || e.target === selectedNodeId
    ).map((edge) => {
      const isOutgoing = edge.source === selectedNodeId;
      const otherId = isOutgoing ? edge.target : edge.source;
      const otherNode = ATLAS_NODES.find((n) => n.id === otherId)!;
      return {
        edge,
        isOutgoing,
        otherNode
      };
    });
  }, [selectedNodeId]);

  // Determine which nodes and edges are highlighted
  const highlightedState = useMemo(() => {
    const activeNodes = new Set<string>();
    const activeEdges = new Set<string>();

    if (pathMode && learningPath.nodeIds.size > 0) {
      return { nodeIds: learningPath.nodeIds, edgeIds: learningPath.edgeIds, isFiltered: true };
    }

    if (activePattern) {
      ATLAS_NODES.forEach((n) => {
        if (n.patterns.includes(activePattern)) activeNodes.add(n.id);
      });
      ATLAS_EDGES.forEach((e) => {
        if (activeNodes.has(e.source) && activeNodes.has(e.target)) {
          activeEdges.add(e.id);
        }
      });
      return { nodeIds: activeNodes, edgeIds: activeEdges, isFiltered: true };
    }

    const hasFilter =
      activeDiscipline !== 'all' || activeLevel !== 'all' || activeRelation !== 'all';

    if (!hasFilter) {
      // Highlight selected node and its direct topological neighborhood
      activeNodes.add(selectedNodeId);
      ATLAS_EDGES.forEach((e) => {
        if (e.source === selectedNodeId || e.target === selectedNodeId) {
          activeEdges.add(e.id);
          activeNodes.add(e.source);
          activeNodes.add(e.target);
        }
      });
      return { nodeIds: activeNodes, edgeIds: activeEdges, isFiltered: false };
    }

    ATLAS_NODES.forEach((n) => {
      const discOk = activeDiscipline === 'all' || n.discipline === activeDiscipline;
      const lvlOk = activeLevel === 'all' || n.abstractionLevel === activeLevel;
      if (discOk && lvlOk) activeNodes.add(n.id);
    });

    ATLAS_EDGES.forEach((e) => {
      const relOk = activeRelation === 'all' || e.relation === activeRelation;
      if (relOk && (activeNodes.has(e.source) || activeNodes.has(e.target))) {
        activeEdges.add(e.id);
        if (activeRelation !== 'all') {
          activeNodes.add(e.source);
          activeNodes.add(e.target);
        }
      }
    });

    return { nodeIds: activeNodes, edgeIds: activeEdges, isFiltered: true };
  }, [
    selectedNodeId,
    activeDiscipline,
    activeLevel,
    activeRelation,
    activePattern,
    pathMode,
    learningPath
  ]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090b10');
    scene.fog = new THREE.FogExp2('#090b10', 0.011);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 300);
    camera.position.set(0, 6, 42);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const gl = renderer.getContext();
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererStr = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
    const isSoftwareGl = /SwiftShader|llvmpipe|Software|Microsoft Basic Render/i.test(rendererStr);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxDistance = 95;
    controls.minDistance = 10;

    resetCameraRef.current = () => {
      camera.position.set(0, 6, 42);
      controls.target.set(0, 2, 2);
      controls.update();
    };

    // Build 4 Abstraction Layer reference planes (Levels 1..4)
    const layerHeights = [-14, -4, 6, 15];
    const layerGroup = new THREE.Group();
    layerHeights.forEach((yVal, idx) => {
      const ringGeo = new THREE.RingGeometry(18, 18.18, 64);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx === 3 ? '#f472b6' : idx === 2 ? '#38bdf8' : idx === 1 ? '#34d399' : '#f59e0b',
        transparent: true,
        opacity: 0.14,
        side: THREE.DoubleSide
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(0, yVal, 2);
      layerGroup.add(ringMesh);
    });
    scene.add(layerGroup);

    // Create Node Meshes
    const nodeMeshMap = new Map<string, THREE.Mesh>();
    const haloMeshMap = new Map<string, THREE.Mesh>();
    const pickableMeshes: THREE.Mesh[] = [];

    ATLAS_NODES.forEach((node) => {
      const discColor = DISCIPLINE_META[node.discipline].color;
      const radius = 0.85 + node.abstractionLevel * 0.16;
      const geo =
        node.abstractionLevel === 4
          ? new THREE.OctahedronGeometry(radius * 1.15, 1)
          : new THREE.SphereGeometry(radius, isSoftwareGl ? 16 : 28, isSoftwareGl ? 12 : 20);

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(discColor),
        emissive: new THREE.Color(discColor),
        emissiveIntensity: 0.35,
        roughness: 0.25,
        metalness: 0.3
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...node.pos3D);
      mesh.userData = { nodeId: node.id };
      scene.add(mesh);
      nodeMeshMap.set(node.id, mesh);
      pickableMeshes.push(mesh);

      // Outer selection/highlight halo
      const haloGeo = new THREE.SphereGeometry(radius * 1.55, 16, 12);
      const haloMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(discColor),
        transparent: true,
        opacity: 0.15,
        wireframe: true
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.set(...node.pos3D);
      scene.add(halo);
      haloMeshMap.set(node.id, halo);
    });

    // Create Directed Edge Curves & Arrow Cones
    const edgeObjectsMap = new Map<
      string,
      { line: THREE.Line; cone: THREE.Mesh; baseColor: THREE.Color }
    >();

    ATLAS_EDGES.forEach((edge) => {
      const srcNode = ATLAS_NODES.find((n) => n.id === edge.source);
      const tgtNode = ATLAS_NODES.find((n) => n.id === edge.target);
      if (!srcNode || !tgtNode) return;

      const start = new THREE.Vector3(...srcNode.pos3D);
      const end = new THREE.Vector3(...tgtNode.pos3D);
      const mid = start.clone().add(end).multiplyScalar(0.5);
      // Slight arc curve for visual clarity
      mid.y += 1.6;
      mid.z += 1.2;

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(24);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const relColor = new THREE.Color(RELATION_COLORS[edge.relation].color);
      const lineMat = new THREE.LineBasicMaterial({
        color: relColor,
        transparent: true,
        opacity: 0.45
      });
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);

      // Arrow cone near target (t = 0.85)
      const arrowPos = curve.getPoint(0.84);
      const tangent = curve.getTangent(0.84).normalize();
      const coneGeo = new THREE.ConeGeometry(0.28, 0.78, 8);
      coneGeo.rotateX(Math.PI / 2);
      const coneMat = new THREE.MeshBasicMaterial({
        color: relColor,
        transparent: true,
        opacity: 0.65
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.copy(arrowPos);
      cone.lookAt(arrowPos.clone().add(tangent));
      scene.add(cone);

      edgeObjectsMap.set(edge.id, { line, cone, baseColor: relColor });
    });

    // Raycasting on pointer tap
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downX = 0;
    let downY = 0;

    const handlePointerDown = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(pickableMeshes, false);
      if (hits.length > 0) {
        const hitNodeId = hits[0].object.userData?.nodeId;
        if (hitNodeId) {
          setSelectedNodeId(hitNodeId);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);

    // ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // Store refs for dynamic highlight updates
    (container as any).__graphRefs = {
      nodeMeshMap,
      haloMeshMap,
      edgeObjectsMap
    };

    let animId = 0;
    let frameCounter = 0;
    const tempV = new THREE.Vector3();

    const animate = () => {
      controls.update();
      haloMeshMap.forEach((halo) => {
        halo.rotation.y += 0.006;
      });
      renderer.render(scene, camera);

      frameCounter++;
      if (frameCounter % 3 === 0) {
        const w = renderer.domElement.clientWidth;
        const h = renderer.domElement.clientHeight;
        const nextLabels = ATLAS_NODES.map((node) => {
          tempV.set(...node.pos3D);
          tempV.y += 1.45;
          tempV.project(camera);
          const x = (tempV.x * 0.5 + 0.5) * w;
          const y = (-(tempV.y * 0.5) + 0.5) * h;
          const visible = tempV.z < 1 && x >= 10 && x <= w - 10 && y >= 10 && y <= h - 10;
          return { id: node.id, x, y, visible };
        });
        setProjectedLabels(nextLabels);
      }

      if (isSoftwareGl) {
        setTimeout(() => {
          animId = requestAnimationFrame(animate);
        }, 16);
      } else {
        animId = requestAnimationFrame(animate);
      }
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      controls.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
    };
  }, []);

  // Synchronize visual highlights when filters, pattern, path or selected node change
  useEffect(() => {
    const container = mountRef.current;
    if (!container || !(container as any).__graphRefs) return;
    const { nodeMeshMap, haloMeshMap, edgeObjectsMap } = (container as any).__graphRefs as {
      nodeMeshMap: Map<string, THREE.Mesh>;
      haloMeshMap: Map<string, THREE.Mesh>;
      edgeObjectsMap: Map<string, { line: THREE.Line; cone: THREE.Mesh; baseColor: THREE.Color }>;
    };

    const { nodeIds, edgeIds } = highlightedState;

    ATLAS_NODES.forEach((node) => {
      const mesh = nodeMeshMap.get(node.id);
      const halo = haloMeshMap.get(node.id);
      if (!mesh || !halo) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const haloMat = halo.material as THREE.MeshBasicMaterial;
      const isSelected = node.id === selectedNodeId;
      const isHighlighted = nodeIds.has(node.id);

      if (isSelected) {
        mesh.scale.setScalar(1.32);
        mat.emissiveIntensity = 0.95;
        mat.opacity = 1;
        mat.transparent = false;
        halo.scale.setScalar(1.38);
        haloMat.opacity = 0.55;
      } else if (isHighlighted) {
        mesh.scale.setScalar(1.1);
        mat.emissiveIntensity = 0.55;
        mat.opacity = 1;
        mat.transparent = false;
        halo.scale.setScalar(1.12);
        haloMat.opacity = 0.28;
      } else {
        mesh.scale.setScalar(0.82);
        mat.emissiveIntensity = 0.08;
        mat.transparent = true;
        mat.opacity = 0.25;
        haloMat.opacity = 0.03;
      }
    });

    edgeObjectsMap.forEach((obj, edgeId) => {
      const lineMat = obj.line.material as THREE.LineBasicMaterial;
      const coneMat = obj.cone.material as THREE.MeshBasicMaterial;
      const isActive = edgeIds.has(edgeId);
      if (isActive) {
        lineMat.opacity = 0.92;
        coneMat.opacity = 0.95;
      } else {
        lineMat.opacity = 0.1;
        coneMat.opacity = 0.12;
      }
    });
  }, [highlightedState, selectedNodeId]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      {/* Left / Main 3D Viewport Column (8 cols on XL) */}
      <div className="xl:col-span-8 flex flex-col gap-4">
        {/* Top Filter & Pattern Bar */}
        <div className="bg-[#0f131c] border border-slate-800/80 rounded-lg p-4 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono-tech uppercase tracking-wider text-slate-300">
                Grafo Orientato Aciclico 3D (TGView3D / Lean Atlas / Axiom Math)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setPathMode(!pathMode);
                  setActivePattern(null);
                }}
                className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  pathMode
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                    : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                }`}
              >
                <Route className="w-3.5 h-3.5" />
                Percorso di Apprendimento
              </button>
              <button
                onClick={() => {
                  setActiveDiscipline('all');
                  setActiveLevel('all');
                  setActiveRelation('all');
                  setActivePattern(null);
                  setPathMode(false);
                  resetCameraRef.current?.();
                }}
                className="px-2.5 py-1.5 rounded text-xs bg-slate-800/70 text-slate-300 hover:bg-slate-800 border border-slate-700/60 flex items-center gap-1 cursor-pointer"
                title="Ripristina vista e filtri"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>

          {/* Pattern Highlighter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/60">
            <span className="text-[11px] font-mono-tech text-slate-400 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Pattern Ricorrenti:
            </span>
            {(Object.keys(PATTERN_META) as PatternId[]).map((pid) => {
              const meta = PATTERN_META[pid];
              const isSelected = activePattern === pid;
              return (
                <button
                  key={pid}
                  onClick={() => {
                    setPathMode(false);
                    setActivePattern(isSelected ? null : pid);
                  }}
                  className={`px-2.5 py-1 rounded text-xs transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-200 border-amber-400/60 font-medium'
                      : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {meta.title.split('&')[0].trim()}
                </button>
              );
            })}
          </div>

          {/* Active Pattern Explanation Banner */}
          {activePattern && (
            <div className="bg-amber-950/25 border border-amber-500/30 rounded p-3 text-xs text-amber-100/90 space-y-1">
              <div className="font-semibold text-amber-300">
                Pattern Illuminato: {PATTERN_META[activePattern].title}
              </div>
              <p className="text-slate-300 leading-relaxed">
                {PATTERN_META[activePattern].universalMechanism}
              </p>
            </div>
          )}

          {/* Learning Path Calculator Controls */}
          {pathMode && (
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded p-3 space-y-2.5">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-300 font-mono-tech">Nodo Partenza:</span>
                  <select
                    value={pathStartId}
                    onChange={(e) => setPathStartId(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
                  >
                    {ATLAS_NODES.map((n) => (
                      <option key={n.id} value={n.id}>
                        [Liv.{n.abstractionLevel}] {n.label}
                      </option>
                    ))}
                  </select>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <span className="text-emerald-300 font-mono-tech">Nodo Obiettivo:</span>
                  <select
                    value={pathTargetId}
                    onChange={(e) => setPathTargetId(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
                  >
                    {ATLAS_NODES.map((n) => (
                      <option key={n.id} value={n.id}>
                        [Liv.{n.abstractionLevel}] {n.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {learningPath.orderedNodes.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
                  <span className="text-slate-400 font-mono-tech">Sentiero Minimo:</span>
                  {learningPath.orderedNodes.map((n, idx) => (
                    <React.Fragment key={n.id}>
                      <button
                        onClick={() => setSelectedNodeId(n.id)}
                        className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 hover:bg-emerald-500/30 cursor-pointer"
                      >
                        {idx + 1}. {n.label.split('&')[0].trim()}
                      </button>
                      {idx < learningPath.orderedNodes.length - 1 && (
                        <span className="text-emerald-400">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3D Canvas Container with 2D Projected Node Labels & Collapsible Bottom Dock */}
        <div className="relative w-full h-[560px] bg-[#090b10] border border-slate-800/90 rounded-lg overflow-hidden">
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Projected 2D Labels Overlay */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {projectedLabels.map((lbl) => {
              if (!lbl.visible) return null;
              const node = ATLAS_NODES.find((n) => n.id === lbl.id);
              if (!node) return null;
              const isSelected = node.id === selectedNodeId;
              const isHighlighted = highlightedState.nodeIds.has(node.id);
              if (!isHighlighted && !isSelected) return null;

              return (
                <div
                  key={lbl.id}
                  style={{
                    transform: `translate3d(${Math.round(lbl.x)}px, ${Math.round(lbl.y)}px, 0) translate(-50%, -100%)`
                  }}
                  className={`absolute top-0 left-0 px-2 py-0.5 rounded text-[11px] font-mono-tech whitespace-nowrap transition-opacity ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-semibold shadow-md'
                      : 'bg-[#0d111a]/90 text-slate-200 border border-slate-700/80'
                  }`}
                >
                  L{node.abstractionLevel} · {node.label.split('&')[0].trim()}
                </div>
              );
            })}
          </div>

          {/* Layer Legend Top-Left Overlay */}
          <div className="absolute top-3 left-3 bg-[#0c0f17]/95 border border-slate-800/90 rounded p-2.5 text-[11px] font-mono-tech space-y-1 pointer-events-none">
            <div className="text-slate-400 uppercase tracking-wider mb-1">
              Stratificazione Verticale (Astrazione)
            </div>
            <div className="text-pink-400">Liv. 4 (Y=+15) · Meta-Teoria, Topos, KAM & mHC</div>
            <div className="text-sky-400">Liv. 3 (Y=+6) · Tensori, Forme Diff., Lie & Curvatura</div>
            <div className="text-emerald-400">Liv. 2 (Y=-4) · Spazi Vettoriali, Spettro & Operatori</div>
            <div className="text-amber-400">Liv. 1 (Y=-14) · Triangolo, Proiettiva & Radici</div>
          </div>

          {/* Collapsible Bottom Control Dock */}
          <div className="absolute bottom-3 left-3 right-3 bg-[#0d1119]/95 border border-slate-800 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono-tech text-slate-300">
                <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
                <span>Filtri Multi-Livello (Disciplina · Astrazione · Tipo di Arco)</span>
              </div>
              <button
                onClick={() => setDockCollapsed(!dockCollapsed)}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                {dockCollapsed ? (
                  <>
                    Espandi <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    Riduci <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {!dockCollapsed && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 pt-2.5 border-t border-slate-800/80 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-mono-tech">
                    Disciplina
                  </label>
                  <select
                    value={activeDiscipline}
                    onChange={(e) => setActiveDiscipline(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-slate-200"
                  >
                    <option value="all">Tutte le 6 Macro-Discipline</option>
                    {(Object.keys(DISCIPLINE_META) as DisciplineId[]).map((d) => (
                      <option key={d} value={d}>
                        {DISCIPLINE_META[d].name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-mono-tech">
                    Livello di Astrazione
                  </label>
                  <select
                    value={activeLevel}
                    onChange={(e) =>
                      setActiveLevel(e.target.value === 'all' ? 'all' : Number(e.target.value))
                    }
                    className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-slate-200"
                  >
                    <option value="all">Tutti i Livelli (1 → 4)</option>
                    <option value={1}>Livello 1 — Oggetto Geometrico / Concreto</option>
                    <option value={2}>Livello 2 — Struttura Algebrica / Analitica</option>
                    <option value={3}>Livello 3 — Astrazione Tensoriale / Differenziale</option>
                    <option value={4}>Livello 4 — Meta-Teoria / Categorie / IA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-mono-tech">
                    Relazione Strutturale (Archi)
                  </label>
                  <select
                    value={activeRelation}
                    onChange={(e) => setActiveRelation(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-slate-200"
                  >
                    <option value="all">Tutte le Relazioni Semantiche</option>
                    {(Object.keys(RELATION_COLORS) as EdgeRelationType[]).map((rel) => (
                      <option key={rel} value={rel}>
                        {RELATION_COLORS[rel].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Contextual Deep-Dive Panel ("Il Pannello di Approfondimento: Estendere la Rete") */}
      <div className="xl:col-span-4 bg-[#0f131c] border border-slate-800/90 rounded-lg p-5 space-y-5 max-h-[740px] overflow-y-auto">
        <div className="border-b border-slate-800 pb-4">
          <div className="text-xs font-mono-tech text-amber-400/90">
            {DISCIPLINE_META[selectedNode.discipline].shortName} · {selectedNode.nodeType} · Livello{' '}
            {selectedNode.abstractionLevel}
            {selectedNode.categoryNumber ? ` · Cat. #${selectedNode.categoryNumber}` : ''}
          </div>
          <h2 className="text-2xl font-serif-editorial font-semibold text-slate-100 mt-1">
            {selectedNode.label}
          </h2>
          <p className="text-xs text-slate-400 mt-1">{selectedNode.subtitle}</p>
        </div>

        {/* Formal Identity / Formula Box */}
        <div className="bg-[#090b10] border border-slate-800 rounded p-3">
          <div className="text-[10px] font-mono-tech uppercase tracking-wider text-slate-400 mb-1">
            Identità Formale & Struttura
          </div>
          <code className="text-xs text-sky-300 font-mono-tech break-all leading-relaxed block">
            {selectedNode.formula}
          </code>
        </div>

        {/* Definition & Deep Insight */}
        <div className="space-y-3 text-xs leading-relaxed">
          <div>
            <h3 className="text-sm font-serif-editorial font-semibold text-slate-200 mb-1">
              Definizione Rigorosa
            </h3>
            <p className="text-slate-300">{selectedNode.definition}</p>
          </div>
          <div className="bg-sky-950/20 border-l-2 border-sky-400 pl-3 py-2">
            <h3 className="text-sm font-serif-editorial font-semibold text-sky-300 mb-1">
              Visione Unificata ("Il Ponte Sotterraneo")
            </h3>
            <p className="text-slate-300">{selectedNode.deepInsight}</p>
          </div>
        </div>

        {/* Associated Interactive Lab Button */}
        {selectedNode.linkedLab && (
          <button
            onClick={() => onOpenLab(selectedNode.linkedLab!)}
            className="w-full py-2.5 px-4 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            Apri Laboratorio Computazionale Associato
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {/* Topological Neighborhood ("Vicini Topologici: Estendere la Rete") */}
        <div className="space-y-2.5 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif-editorial font-semibold text-slate-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              Vicini Topologici ({neighborConnections.length} Connessioni)
            </h3>
            <span className="text-[11px] font-mono-tech text-slate-400">Clicca per navigare</span>
          </div>

          <div className="space-y-2">
            {neighborConnections.map(({ edge, isOutgoing, otherNode }) => {
              const relMeta = RELATION_COLORS[edge.relation];
              return (
                <div
                  key={edge.id}
                  onClick={() => setSelectedNodeId(otherNode.id)}
                  className="bg-[#0b0e15] hover:bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 rounded p-2.5 transition-colors cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono-tech">
                    <span style={{ color: relMeta.color }}>
                      {isOutgoing ? `→ ${relMeta.label}` : `← (${relMeta.label})`}
                    </span>
                    <span className="text-slate-400">Liv. {otherNode.abstractionLevel}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200">{otherNode.label}</div>
                  <p className="text-[11px] text-slate-400 leading-snug">{edge.explanation}</p>
                  {edge.formulaBridge && (
                    <code className="block text-[10px] text-amber-300/90 font-mono-tech pt-0.5">
                      {edge.formulaBridge}
                    </code>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Lean 4 / Mathlib Formalization Verification */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-mono-tech text-pink-400">
            <Code2 className="w-3.5 h-3.5" />
            <span>Verifica Formale Lean 4 / Mathlib</span>
          </div>
          <pre className="bg-[#07090d] border border-slate-800/90 rounded p-2.5 text-[11px] font-mono-tech text-emerald-300 overflow-x-auto">
            {selectedNode.lean4Snippet}
          </pre>
        </div>
      </div>
    </div>
  );
};
