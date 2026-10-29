import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  CHAMBERS,
  ChamberId,
  CoordinateSystemType,
  HARDWARE_PEDESTALS,
  MetricType,
} from '../data/pantheonData';
import { buildHardwareTimeline } from '../three/hardwareModels';
import {
  buildAllMathChambers,
  updateManifoldGeometry,
} from '../three/mathChambers';
import { createPantheonFloorTexture } from '../three/proceduralTextures';

export interface MatrixParams {
  a: number;
  b: number;
  c: number;
  d: number;
}

export interface PantheonSimulationState {
  activeChamber: ChamberId;
  selectedPedestalIndex: number;
  elevatorExplosion: number; // 0 to 1
  matrix: MatrixParams;
  tensorSliceAxis: 'X' | 'Y' | 'Z';
  tensorSliceIndex: 0 | 1 | 2;
  synapticWeight: number; // 0.2 to 2.0
  biasPressure: number; // -1.0 to 1.0
  backpropTriggerCount: number;
  metricType: MetricType;
  coordSystem: CoordinateSystemType;
  symmetrySpeed: number;
}

interface PantheonCanvasProps {
  simState: PantheonSimulationState;
  onSelectPedestal: (index: number) => void;
}

// Pre-allocated module-scope scratch objects (zero GC in render loop)
const _scratchVec = new THREE.Vector3();
const _scratchMat4 = new THREE.Matrix4();
const _scratchQuat = new THREE.Quaternion();
const _scratchScale = new THREE.Vector3(1, 1, 1);

export const PantheonCanvas: React.FC<PantheonCanvasProps> = ({
  simState,
  onSelectPedestal,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef<PantheonSimulationState>(simState);
  const onSelectPedestalRef = useRef(onSelectPedestal);

  // Camera transition targets
  const camTargetPosRef = useRef(new THREE.Vector3(0, 14, 28));
  const camLookAtTargetRef = useRef(new THREE.Vector3(0, 3.5, 0));
  const isCameraTransitioningRef = useRef(false);
  const backpropProgressRef = useRef(-1);
  const lastBackpropCountRef = useRef(simState.backpropTriggerCount);

  useEffect(() => {
    onSelectPedestalRef.current = onSelectPedestal;
  }, [onSelectPedestal]);

  // Update mutable ref and trigger smooth camera fly-to when chamber or pedestal changes
  useEffect(() => {
    const prev = stateRef.current;
    stateRef.current = simState;

    if (simState.backpropTriggerCount !== lastBackpropCountRef.current) {
      lastBackpropCountRef.current = simState.backpropTriggerCount;
      backpropProgressRef.current = 0;
    }

    if (
      prev.activeChamber !== simState.activeChamber ||
      (simState.activeChamber === 'hardware_elevator' &&
        prev.selectedPedestalIndex !== simState.selectedPedestalIndex)
    ) {
      const chamber =
        CHAMBERS.find((c) => c.id === simState.activeChamber) || CHAMBERS[0];
      if (simState.activeChamber === 'hardware_elevator') {
        const ped =
          HARDWARE_PEDESTALS[simState.selectedPedestalIndex] ||
          HARDWARE_PEDESTALS[3];
        const liftY = 3.2 + simState.elevatorExplosion * 3.2;
        camTargetPosRef.current.set(ped.xPosition, liftY + 2.6, 11.5);
        camLookAtTargetRef.current.set(ped.xPosition, liftY, 0);
      } else {
        camTargetPosRef.current.set(...chamber.cameraPos);
        camLookAtTargetRef.current.set(...chamber.cameraTarget);
      }
      isCameraTransitioningRef.current = true;
    }
  }, [simState]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software WebGL detection from GPU renderer string
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    const scene = new THREE.Scene();
    const bgHex = 0x07090e;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.014);

    // 2. Studio Environment Map via RoomEnvironment + PMREMGenerator
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;
    pmremGenerator.dispose();

    // 3. Camera & OrbitControls
    const camera = new THREE.PerspectiveCamera(
      48,
      container.clientWidth / container.clientHeight,
      0.1,
      200
    );
    camera.position.set(0, 14, 28);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.03;
    controls.minDistance = 4;
    controls.maxDistance = 65;
    controls.target.set(0, 3.5, 0);

    const onControlStart = () => {
      isCameraTransitioningRef.current = false;
    };
    controls.addEventListener('start', onControlStart);

    // 4. Balanced 3-Point Studio Lighting Rig (Warm Key + Cool Hemisphere Fill + Rim)
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.65);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffbeb, 1.85);
    keyLight.position.set(16, 28, 18);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 2;
    keyLight.shadow.camera.far = 70;
    const d = 26;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.9);
    rimLight.position.set(-18, 16, -24);
    scene.add(rimLight);

    // 5. Neoclassical Pantheon Cathedral Architecture & 3 Laser Coordinate Axes
    buildPantheonCathedralArchitecture(scene, maxAnisotropy);

    // 6. Axis X (Hardware Evolution) & Axis Y (Abstraction Elevator)
    const { pedestals, colliders, elevatorRig } = buildHardwareTimeline(
      scene,
      isSoftwareGl,
      maxAnisotropy
    );

    // 7. Axis Z (Mathematical & Neural Chambers)
    const chambersBundle = buildAllMathChambers(
      scene,
      isSoftwareGl,
      maxAnisotropy
    );

    // Initial manifold update
    updateManifoldGeometry(
      chambersBundle.manifoldRig,
      stateRef.current.metricType,
      stateRef.current.coordSystem,
      1.0
    );

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 8. Raycasting on Layer 1 for clicking Hardware Pedestals
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    const mouse = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(
        e.clientX - pointerDownPos.x,
        e.clientY - pointerDownPos.y
      );
      if (dist > 6) return; // Ignore drag-orbit gestures

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(colliders, false);
      if (hits.length > 0) {
        const hitObj = hits[0].object;
        if (typeof hitObj.userData.pedestalIndex === 'number') {
          onSelectPedestalRef.current(hitObj.userData.pedestalIndex);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    // Track last metric/coord to avoid unnecessary vertex rebuilds
    let currentMetric = stateRef.current.metricType;
    let currentCoord = stateRef.current.coordSystem;
    let currentExplosionDamped = stateRef.current.elevatorExplosion;
    let currentElevatorX =
      HARDWARE_PEDESTALS[stateRef.current.selectedPedestalIndex]?.xPosition ?? 0;

    // 9. Animation & Software-WebGL Paced Render Loop
    const clock = new THREE.Clock();
    let frameId = 0;
    let isDisposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || !gl.fenceSync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (isDisposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (isDisposed) return;
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const st = stateRef.current;

      // Smoothly damp camera when flying between Pantheon chambers or pedestals
      if (isCameraTransitioningRef.current) {
        const k = 1 - Math.exp(-4.5 * delta);
        camera.position.lerp(camTargetPosRef.current, k);
        controls.target.lerp(camLookAtTargetRef.current, k);
        if (
          camera.position.distanceToSquared(camTargetPosRef.current) < 0.04 &&
          controls.target.distanceToSquared(camLookAtTargetRef.current) < 0.04
        ) {
          isCameraTransitioningRef.current = false;
        }
      }
      controls.update();

      // Update Hardware Pedestals selection highlight and gentle rotation
      pedestals.forEach((ped, idx) => {
        const isSelected = idx === st.selectedPedestalIndex;
        ped.selectionRing.visible = isSelected;
        ped.artifactGroup.rotation.y = elapsed * (isSelected ? 0.55 : 0.2);
      });

      // Smoothly damp Abstraction Elevator X position & Y layer separation
      const targetPed =
        HARDWARE_PEDESTALS[st.selectedPedestalIndex] || HARDWARE_PEDESTALS[3];
      currentElevatorX = THREE.MathUtils.damp(
        currentElevatorX,
        targetPed.xPosition,
        6,
        delta
      );
      currentExplosionDamped = THREE.MathUtils.damp(
        currentExplosionDamped,
        st.elevatorExplosion,
        5,
        delta
      );

      elevatorRig.rootGroup.position.x = currentElevatorX;
      elevatorRig.rootGroup.visible = currentExplosionDamped > 0.01;

      const beamAttr = elevatorRig.beamLines.geometry.getAttribute(
        'position'
      ) as THREE.BufferAttribute;

      elevatorRig.layers.forEach((layerGrp, lIdx) => {
        const baseY = 3.8 + lIdx * 0.22;
        const expandedY = 4.2 + lIdx * 2.15;
        layerGrp.position.y = THREE.MathUtils.lerp(
          baseY,
          expandedY,
          currentExplosionDamped
        );
        // Make badges face the camera horizontally
        const badge = elevatorRig.layerLabels[lIdx];
        if (badge) {
          badge.lookAt(camera.position.x, badge.getWorldPosition(_scratchVec).y, camera.position.z);
        }
      });

      // Update laser beam connectors along Axis Y
      const topY = elevatorRig.layers[3].position.y;
      const corners = [
        [-1.0, -1.0],
        [1.0, -1.0],
        [-1.0, 1.0],
        [1.0, 1.0],
      ];
      corners.forEach(([cx, cz], cIdx) => {
        beamAttr.setXYZ(cIdx * 2, cx, 1.8, cz);
        beamAttr.setXYZ(cIdx * 2 + 1, cx, topY, cz);
      });
      beamAttr.needsUpdate = true;

      // Real-time correlation: Matrix parameters (a, b, c, d) warp the Elevator layers AND Matrix Chamber!
      const { a, b, c, d: matD } = st.matrix;
      const det = a * matD - b * c;

      // 1) Elevator Top Layer 4 (Math Cage) & Layer 2 (Bloch Sphere Vector) & Layer 1 (Chemistry Lattice)
      elevatorRig.mathCageMesh.scale.set(
        THREE.MathUtils.clamp(Math.hypot(a, c), 0.3, 2.2),
        THREE.MathUtils.clamp(Math.abs(det) * 0.5 + 0.5, 0.3, 2.2),
        THREE.MathUtils.clamp(Math.hypot(b, matD), 0.3, 2.2)
      );
      elevatorRig.mathCageMesh.rotation.y = elapsed * 0.6 + b * 0.5;
      elevatorRig.blochVectorArrow.rotation.z = Math.atan2(b - c, a + matD) + Math.sin(elapsed * 2) * 0.25;
      elevatorRig.blochVectorArrow.rotation.x = st.biasPressure * 0.8;
      elevatorRig.chemistryLattice.rotation.y = elapsed * 0.4 * (1 + Math.abs(det) * 0.3);
      elevatorRig.csGateGroup.rotation.y = -elapsed * 0.5;

      // 2) Matrix & Tensor Chamber: Deform Laser Cage & Inner Solid by 2x2 Matrix [a b; c d]
      const { matrixRig, hydraulicRig, manifoldRig, categoryRig } = chambersBundle;
      const cagePos = matrixRig.cageLines.geometry.getAttribute(
        'position'
      ) as THREE.BufferAttribute;
      const baseCage = matrixRig.baseCagePositions;
      for (let i = 0; i < cagePos.count; i++) {
        const bx = baseCage[i * 3];
        const by = baseCage[i * 3 + 1];
        const bz = baseCage[i * 3 + 2];
        cagePos.setXYZ(i, a * bx + b * by, c * bx + matD * by, bz);
      }
      cagePos.needsUpdate = true;

      const solidPos = matrixRig.innerSolid.geometry.getAttribute(
        'position'
      ) as THREE.BufferAttribute;
      const baseSolid = matrixRig.baseSolidPositions;
      for (let i = 0; i < solidPos.count; i++) {
        const bx = baseSolid[i * 3];
        const by = baseSolid[i * 3 + 1];
        const bz = baseSolid[i * 3 + 2];
        solidPos.setXYZ(i, a * bx + b * by, c * bx + matD * by, bz);
      }
      solidPos.needsUpdate = true;

      // Update Eigenvector axes directions in 2D plane
      const trace = a + matD;
      const disc = trace * trace - 4 * det;
      if (disc >= 0) {
        const sqrtDisc = Math.sqrt(disc);
        const l1 = (trace + sqrtDisc) / 2;
        const l2 = (trace - sqrtDisc) / 2;
        const angle1 = Math.abs(b) > 0.001 ? Math.atan2(l1 - a, b) : 0;
        const angle2 = Math.abs(b) > 0.001 ? Math.atan2(l2 - a, b) : Math.PI / 2;
        matrixRig.eigenAxis1.rotation.z = angle1;
        matrixRig.eigenAxis2.rotation.z = angle2;
        matrixRig.eigenAxis1.visible = true;
        matrixRig.eigenAxis2.visible = true;
      } else {
        // Complex eigenvalues: rotate axes continuously to show spiral rotation
        matrixRig.eigenAxis1.rotation.z = elapsed * 1.5;
        matrixRig.eigenAxis2.rotation.z = elapsed * 1.5 + Math.PI / 2;
      }

      // Highlight selected Tensor 2D Matrix Slice (X, Y, or Z plane)
      matrixRig.tensorCubes.forEach((cube) => {
        const { ix, iy, iz } = cube.userData;
        const isSliced =
          (st.tensorSliceAxis === 'X' && ix === st.tensorSliceIndex) ||
          (st.tensorSliceAxis === 'Y' && iy === st.tensorSliceIndex) ||
          (st.tensorSliceAxis === 'Z' && iz === st.tensorSliceIndex);
        const mat = cube.material as THREE.MeshStandardMaterial;
        mat.color.setHex(isSliced ? 0xf59e0b : 0x1e293b);
        mat.emissive.setHex(isSliced ? 0xd97706 : 0x000000);
        mat.emissiveIntensity = isSliced ? 0.65 : 0;
        mat.opacity = isSliced ? 0.98 : 0.28;
        const s = isSliced ? 1.06 : 0.86;
        cube.scale.set(s, s, s);
      });

      // 3) Hydraulic Neural Network Chamber
      hydraulicRig.valves.forEach((valve, vIdx) => {
        const wScale = 0.6 + st.synapticWeight * 0.45;
        valve.scale.set(wScale, wScale, 1);
        valve.rotation.z = elapsed * st.synapticWeight * (vIdx % 2 === 0 ? 1 : -1);
      });
      hydraulicRig.biasPiston.position.y = 0.9 + st.biasPressure * 0.32;

      // Backpropagation reverse neon wave
      const isBackpropActive = backpropProgressRef.current >= 0;
      if (isBackpropActive) {
        backpropProgressRef.current += delta * 0.85;
        const bp = backpropProgressRef.current;
        if (bp <= 1.0) {
          hydraulicRig.backpropWaveRing.position.x = THREE.MathUtils.lerp(3.4, -3.4, bp);
          (hydraulicRig.backpropWaveRing.material as THREE.MeshBasicMaterial).opacity =
            Math.sin(bp * Math.PI) * 0.85;
        } else {
          backpropProgressRef.current = -1;
          (hydraulicRig.backpropWaveRing.material as THREE.MeshBasicMaterial).opacity = 0;
        }
      }

      // Animate InstancedMesh fluid droplets along hydraulic glass tubes
      const flowSpeed = isBackpropActive ? -0.95 : 0.42 * st.synapticWeight;
      hydraulicRig.particlePaths.forEach((path, pIdx) => {
        let t = (elapsed * flowSpeed + path.phase) % 1;
        if (t < 0) t += 1;
        _scratchVec.lerpVectors(path.start, path.end, t);
        const dropletScale = 0.7 + st.synapticWeight * 0.35;
        _scratchScale.set(dropletScale, dropletScale, dropletScale);
        _scratchMat4.compose(_scratchVec, _scratchQuat, _scratchScale);
        hydraulicRig.fluidParticles.setMatrixAt(pIdx, _scratchMat4);
      });
      hydraulicRig.fluidParticles.instanceMatrix.needsUpdate = true;
      (hydraulicRig.fluidParticles.material as THREE.MeshBasicMaterial).color.setHex(
        isBackpropActive ? 0xf43f5e : 0x38bdf8
      );

      // 4) Manifold & Metric Altar Chamber
      if (currentMetric !== st.metricType || currentCoord !== st.coordSystem) {
        currentMetric = st.metricType;
        currentCoord = st.coordSystem;
        updateManifoldGeometry(manifoldRig, currentMetric, currentCoord, 1.0);
      }
      manifoldRig.manifoldMesh.rotation.y = elapsed * 0.32;
      manifoldRig.manifoldWire.rotation.y = elapsed * 0.32;

      // 5) Category Theory Vault & Symmetry Crystal
      categoryRig.functorPrism.rotation.y = elapsed * 0.45 * st.symmetrySpeed;
      categoryRig.functorPrism.rotation.x = Math.sin(elapsed * 0.7) * 0.25;
      categoryRig.symmetryCrystal.rotation.y = elapsed * 0.65 * st.symmetrySpeed;
      categoryRig.symmetryCrystal.rotation.z = elapsed * 0.35 * st.symmetrySpeed;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    frameId = requestAnimationFrame(tick);

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      controls.removeEventListener('start', onControlStart);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full relative select-none"
      aria-label="Ambiente 3D interattivo del Pantheon della Mente e della Macchina"
    />
  );
};

function buildPantheonCathedralArchitecture(
  scene: THREE.Scene,
  maxAnisotropy: number
) {
  const floorTex = createPantheonFloorTexture(maxAnisotropy);
  const floorMat = new THREE.MeshStandardMaterial({
    map: floorTex,
    roughness: 0.78,
    metalness: 0.15,
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Neoclassical Colonnade Perimeter (16 fluted architectural columns + entablature architrave ring)
  const colCount = 16;
  const colRadius = 31;
  const colGeo = new THREE.CylinderGeometry(0.68, 0.82, 14, 12);
  const colMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.6,
    metalness: 0.3,
  });
  const columnsInstanced = new THREE.InstancedMesh(colGeo, colMat, colCount);
  const dummy = new THREE.Object3D();

  for (let i = 0; i < colCount; i++) {
    const angle = (i / colCount) * Math.PI * 2;
    dummy.position.set(
      Math.cos(angle) * colRadius,
      7.0,
      Math.sin(angle) * colRadius - 6
    );
    dummy.updateMatrix();
    columnsInstanced.setMatrixAt(i, dummy.matrix);
  }
  columnsInstanced.instanceMatrix.needsUpdate = true;
  columnsInstanced.computeBoundingSphere();
  scene.add(columnsInstanced);

  // Upper Dome Architrave Ring & Laser Oculus
  const architrave = new THREE.Mesh(
    new THREE.TorusGeometry(colRadius, 0.55, 12, 64),
    new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      metalness: 0.7,
    })
  );
  architrave.rotation.x = Math.PI / 2;
  architrave.position.set(0, 14.2, -6);
  scene.add(architrave);

  const oculusRing = new THREE.Mesh(
    new THREE.TorusGeometry(9.5, 0.12, 12, 64),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
  );
  oculusRing.rotation.x = Math.PI / 2;
  oculusRing.position.set(0, 18.5, -6);
  scene.add(oculusRing);

  // 3 Visible Laser Coordinate Axes of the Pantheon (X = Hardware, Y = Abstraction, Z = Mind Matrix)
  const axisXGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-26, 0.04, 0),
    new THREE.Vector3(26, 0.04, 0),
  ]);
  scene.add(
    new THREE.Line(
      axisXGeo,
      new THREE.LineBasicMaterial({ color: 0xf59e0b })
    )
  );

  const axisYGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 18.5, 0),
  ]);
  scene.add(
    new THREE.Line(
      axisYGeo,
      new THREE.LineBasicMaterial({ color: 0x10b981 })
    )
  );

  const axisZGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0.04, -28),
    new THREE.Vector3(0, 0.04, 24),
  ]);
  scene.add(
    new THREE.Line(
      axisZGeo,
      new THREE.LineBasicMaterial({ color: 0x38bdf8 })
    )
  );
}
