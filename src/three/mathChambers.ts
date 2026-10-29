import * as THREE from 'three';
import { CoordinateSystemType, MetricType } from '../data/pantheonData';
import { createContactShadowTexture, createHoloLabelTexture } from './proceduralTextures';

export interface MatrixTensorChamberRig {
  group: THREE.Group;
  cageLines: THREE.LineSegments;
  baseCagePositions: Float32Array;
  innerSolid: THREE.Mesh;
  baseSolidPositions: Float32Array;
  eigenAxis1: THREE.Line;
  eigenAxis2: THREE.Line;
  tensorCubes: THREE.Mesh[];
}

export interface HydraulicNNChamberRig {
  group: THREE.Group;
  valves: THREE.Mesh[];
  biasPiston: THREE.Mesh;
  fluidParticles: THREE.InstancedMesh;
  particlePaths: { start: THREE.Vector3; end: THREE.Vector3; phase: number }[];
  backpropWaveRing: THREE.Mesh;
}

export interface ManifoldAltarChamberRig {
  group: THREE.Group;
  manifoldMesh: THREE.Mesh;
  manifoldWire: THREE.LineSegments;
  baseDirections: Float32Array;
  cartesianGrid: THREE.Group;
  cylindricalGrid: THREE.Group;
  sphericalGrid: THREE.Group;
}

export interface CategorySymmetryRig {
  group: THREE.Group;
  functorPrism: THREE.Mesh;
  projectorBeams: THREE.LineSegments;
  symmetryCrystal: THREE.Group;
  leastActionCurveMesh: THREE.Mesh;
}

export interface PantheonChambersBundle {
  matrixRig: MatrixTensorChamberRig;
  hydraulicRig: HydraulicNNChamberRig;
  manifoldRig: ManifoldAltarChamberRig;
  categoryRig: CategorySymmetryRig;
}

export function buildAllMathChambers(
  scene: THREE.Scene,
  isSoftwareGl: boolean,
  maxAnisotropy: number
): PantheonChambersBundle {
  const shadowTex = createContactShadowTexture();

  const matrixRig = buildMatrixTensorChamber(scene, shadowTex, maxAnisotropy);
  const hydraulicRig = buildHydraulicNNChamber(scene, shadowTex, isSoftwareGl, maxAnisotropy);
  const manifoldRig = buildManifoldAltarChamber(scene, shadowTex, maxAnisotropy);
  const categoryRig = buildCategoryAndSymmetryChamber(scene, isSoftwareGl, maxAnisotropy);

  return {
    matrixRig,
    hydraulicRig,
    manifoldRig,
    categoryRig,
  };
}

function buildMatrixTensorChamber(
  scene: THREE.Scene,
  shadowTex: THREE.CanvasTexture,
  maxAnisotropy: number
): MatrixTensorChamberRig {
  const group = new THREE.Group();
  group.position.set(-16, 0, -19);

  // Architectural platform
  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.65,
    metalness: 0.25,
  });
  const baseDisc = new THREE.Mesh(new THREE.CylinderGeometry(5.6, 6.0, 0.36, 32), stoneMat);
  baseDisc.position.y = 0.18;
  baseDisc.receiveShadow = true;
  group.add(baseDisc);

  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 12),
    new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.55 })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  group.add(shadow);

  // Title plaque
  const titleTex = createHoloLabelTexture(
    'STANZA DELLE MATRICI & TENSORI',
    'Gabbia Laser M·v, Autovettori & Cubo Tensoriale',
    '#f59e0b',
    maxAnisotropy
  );
  const plaque = new THREE.Mesh(
    new THREE.PlaneGeometry(5.2, 1.5),
    new THREE.MeshBasicMaterial({ map: titleTex, transparent: true })
  );
  plaque.position.set(0, 6.6, 0);
  group.add(plaque);

  // Left sub-station: Deformable 3D Laser Matrix Cage
  const cageBox = new THREE.BoxGeometry(2.6, 2.6, 2.6, 3, 3, 3);
  const cageEdges = new THREE.EdgesGeometry(cageBox);
  const posAttr = cageEdges.getAttribute('position') as THREE.BufferAttribute;
  const baseCagePositions = new Float32Array(posAttr.array.length);
  baseCagePositions.set(posAttr.array);

  const cageLines = new THREE.LineSegments(
    cageEdges,
    new THREE.LineBasicMaterial({ color: 0x38bdf8 })
  );
  cageLines.position.set(-2.2, 2.8, 0);
  group.add(cageLines);

  // Inner deformable geodesic polyhedron
  const innerGeo = new THREE.IcosahedronGeometry(0.95, 1);
  const innerPos = innerGeo.getAttribute('position') as THREE.BufferAttribute;
  const baseSolidPositions = new Float32Array(innerPos.array.length);
  baseSolidPositions.set(innerPos.array);

  const innerSolid = new THREE.Mesh(
    innerGeo,
    new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.25,
      metalness: 0.78,
      flatShading: true,
    })
  );
  innerSolid.position.set(-2.2, 2.8, 0);
  group.add(innerSolid);

  // Eigenvector invariant lines passing through (-2.2, 2.8, 0)
  const eigGeo1 = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-2.5, 0, 0),
    new THREE.Vector3(2.5, 0, 0),
  ]);
  const eigenAxis1 = new THREE.Line(
    eigGeo1,
    new THREE.LineBasicMaterial({ color: 0x10b981 })
  );
  eigenAxis1.position.set(-2.2, 2.8, 0);
  group.add(eigenAxis1);

  const eigGeo2 = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, -2.5, 0),
    new THREE.Vector3(0, 2.5, 0),
  ]);
  const eigenAxis2 = new THREE.Line(
    eigGeo2,
    new THREE.LineBasicMaterial({ color: 0xf43f5e })
  );
  eigenAxis2.position.set(-2.2, 2.8, 0);
  group.add(eigenAxis2);

  // Right sub-station: 3x3x3 Hyper-Rubik Tensor Cube with sliceable planes
  const tensorCubes: THREE.Mesh[] = [];
  const subCubeGeo = new THREE.BoxGeometry(0.56, 0.56, 0.56);
  for (let ix = 0; ix < 3; ix++) {
    for (let iy = 0; iy < 3; iy++) {
      for (let iz = 0; iz < 3; iz++) {
        const mat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          roughness: 0.25,
          metalness: 0.7,
          transparent: true,
          opacity: 0.85,
        });
        const cube = new THREE.Mesh(subCubeGeo, mat);
        cube.position.set(
          2.3 + (ix - 1) * 0.72,
          2.8 + (iy - 1) * 0.72,
          (iz - 1) * 0.72
        );
        cube.userData = { ix, iy, iz };
        group.add(cube);
        tensorCubes.push(cube);
      }
    }
  }

  scene.add(group);
  return {
    group,
    cageLines,
    baseCagePositions,
    innerSolid,
    baseSolidPositions,
    eigenAxis1,
    eigenAxis2,
    tensorCubes,
  };
}

function buildHydraulicNNChamber(
  scene: THREE.Scene,
  shadowTex: THREE.CanvasTexture,
  isSoftwareGl: boolean,
  maxAnisotropy: number
): HydraulicNNChamberRig {
  const group = new THREE.Group();
  group.position.set(0, 0, -19);

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.65,
    metalness: 0.25,
  });
  const baseDisc = new THREE.Mesh(new THREE.CylinderGeometry(5.8, 6.2, 0.36, 32), stoneMat);
  baseDisc.position.y = 0.18;
  group.add(baseDisc);

  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(12.5, 12.5),
    new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.55 })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  group.add(shadow);

  const titleTex = createHoloLabelTexture(
    'RETE NEURALE IDRAULICA',
    'Canali Fotonici, Valvole dei Pesi & Backpropagation',
    '#38bdf8',
    maxAnisotropy
  );
  const plaque = new THREE.Mesh(
    new THREE.PlaneGeometry(5.2, 1.5),
    new THREE.MeshBasicMaterial({ map: titleTex, transparent: true })
  );
  plaque.position.set(0, 6.6, 0);
  group.add(plaque);

  const glassChannelMat = new THREE.MeshPhysicalMaterial({
    color: 0xbae6fd,
    transparent: true,
    opacity: isSoftwareGl ? 0.28 : 0.75,
    transmission: isSoftwareGl ? 0 : 0.85,
    roughness: 0.1,
    ior: 1.48,
    depthWrite: false,
  });

  const nodeMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    emissive: 0x0369a1,
    emissiveIntensity: 0.7,
    roughness: 0.2,
    metalness: 0.8,
  });

  const valveBrassMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.22,
    metalness: 0.9,
  });

  const layerX = [-3.4, 0, 3.4];
  const layerCounts = [3, 4, 2];
  const nodePositions: THREE.Vector3[][] = [];

  layerCounts.forEach((count, lIdx) => {
    const col: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const y = 1.6 + (i - (count - 1) / 2) * 1.15 + 1.6;
      const pos = new THREE.Vector3(layerX[lIdx], y, 0);
      col.push(pos);

      // Pressurized glass chamber node (3 parts: cylinder + top/bottom caps)
      const chamber = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.58, 16), nodeMat);
      chamber.position.copy(pos);
      const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.08, 16), valveBrassMat);
      capTop.position.set(pos.x, pos.y + 0.3, pos.z);
      const capBot = capTop.clone();
      capBot.position.set(pos.x, pos.y - 0.3, pos.z);
      group.add(chamber, capTop, capBot);
    }
    nodePositions.push(col);
  });

  const valves: THREE.Mesh[] = [];
  const particlePaths: { start: THREE.Vector3; end: THREE.Vector3; phase: number }[] = [];

  // Connect layers with hydraulic glass pipes and mechanical weight valves
  for (let l = 0; l < 2; l++) {
    const srcLayer = nodePositions[l];
    const dstLayer = nodePositions[l + 1];
    srcLayer.forEach((src, sIdx) => {
      dstLayer.forEach((dst, dIdx) => {
        const dir = new THREE.Vector3().subVectors(dst, src);
        const len = dir.length();
        const mid = new THREE.Vector3().addVectors(src, dst).multiplyScalar(0.5);

        const pipeGeo = new THREE.CylinderGeometry(0.055, 0.055, len, 8);
        pipeGeo.rotateZ(-Math.PI / 2);
        const pipe = new THREE.Mesh(pipeGeo, glassChannelMat);
        pipe.position.copy(mid);
        pipe.lookAt(dst);
        pipe.rotateY(Math.PI / 2);
        group.add(pipe);

        // Mechanical valve wheel at midpoint
        const valve = new THREE.Mesh(
          new THREE.TorusGeometry(0.14, 0.035, 8, 16),
          valveBrassMat
        );
        valve.position.copy(mid);
        group.add(valve);
        valves.push(valve);

        // 2 fluid particles per pipe
        particlePaths.push({
          start: src.clone(),
          end: dst.clone(),
          phase: ((sIdx * 3 + dIdx) % 10) / 10,
        });
        particlePaths.push({
          start: src.clone(),
          end: dst.clone(),
          phase: (((sIdx * 3 + dIdx) % 10) / 10 + 0.5) % 1.0,
        });
      });
    });
  }

  // Bias pressurizing chamber below hidden layer
  const biasHousing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.6, 1.1, 20),
    glassChannelMat
  );
  biasHousing.position.set(0, 0.9, 1.35);
  group.add(biasHousing);

  const biasPiston = new THREE.Mesh(
    new THREE.CylinderGeometry(0.46, 0.46, 0.35, 20),
    valveBrassMat
  );
  biasPiston.position.set(0, 0.9, 1.35);
  group.add(biasPiston);

  // InstancedMesh for luminous data fluid droplets
  const dropletGeo = new THREE.SphereGeometry(0.075, 10, 10);
  const dropletMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const fluidParticles = new THREE.InstancedMesh(
    dropletGeo,
    dropletMat,
    particlePaths.length
  );
  fluidParticles.frustumCulled = false;
  group.add(fluidParticles);

  // Backpropagation reverse wave ring
  const backpropWaveRing = new THREE.Mesh(
    new THREE.RingGeometry(0.4, 2.6, 32),
    new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0,
    })
  );
  backpropWaveRing.rotation.y = Math.PI / 2;
  backpropWaveRing.position.set(3.4, 3.2, 0);
  group.add(backpropWaveRing);

  scene.add(group);
  return {
    group,
    valves,
    biasPiston,
    fluidParticles,
    particlePaths,
    backpropWaveRing,
  };
}

function buildManifoldAltarChamber(
  scene: THREE.Scene,
  shadowTex: THREE.CanvasTexture,
  maxAnisotropy: number
): ManifoldAltarChamberRig {
  const group = new THREE.Group();
  group.position.set(16, 0, -19);

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.65,
    metalness: 0.25,
  });
  const baseDisc = new THREE.Mesh(new THREE.CylinderGeometry(5.6, 6.0, 0.36, 32), stoneMat);
  baseDisc.position.y = 0.18;
  group.add(baseDisc);

  // Stepped Altar pedestal in the center
  const altarPedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(1.1, 1.4, 1.1, 8),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.7 })
  );
  altarPedestal.position.y = 0.73;
  group.add(altarPedestal);

  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 12),
    new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.55 })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  group.add(shadow);

  const titleTex = createHoloLabelTexture(
    'ALTARE DELLE VARIETÀ & METRICHE',
    'Euclidea L2 · Manhattan L1 · Chebyshev L∞ · Riemann',
    '#10b981',
    maxAnisotropy
  );
  const plaque = new THREE.Mesh(
    new THREE.PlaneGeometry(5.2, 1.5),
    new THREE.MeshBasicMaterial({ map: titleTex, transparent: true })
  );
  plaque.position.set(0, 6.6, 0);
  group.add(plaque);

  // High-density sphere whose vertices morph between L2, L1, L_inf, and Riemann surface
  const sphereGeo = new THREE.SphereGeometry(1.65, 36, 28);
  const posAttr = sphereGeo.getAttribute('position') as THREE.BufferAttribute;
  const baseDirections = new Float32Array(posAttr.array.length);

  for (let i = 0; i < posAttr.count; i++) {
    const vx = posAttr.getX(i);
    const vy = posAttr.getY(i);
    const vz = posAttr.getZ(i);
    const len = Math.hypot(vx, vy, vz) || 1;
    baseDirections[i * 3] = vx / len;
    baseDirections[i * 3 + 1] = vy / len;
    baseDirections[i * 3 + 2] = vz / len;
  }

  const manifoldMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    roughness: 0.22,
    metalness: 0.65,
    side: THREE.DoubleSide,
  });
  const manifoldMesh = new THREE.Mesh(sphereGeo, manifoldMat);
  manifoldMesh.position.set(0, 3.2, 0);
  group.add(manifoldMesh);

  const manifoldWire = new THREE.LineSegments(
    new THREE.WireframeGeometry(sphereGeo),
    new THREE.LineBasicMaterial({ color: 0xa7f3d0, transparent: true, opacity: 0.25 })
  );
  manifoldWire.position.set(0, 3.2, 0);
  group.add(manifoldWire);

  // 3 Switchable Coordinate System Cages around the Altar
  const cartesianGrid = new THREE.Group();
  cartesianGrid.position.set(0, 3.2, 0);
  const cartEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(4.2, 4.2, 4.2));
  cartesianGrid.add(
    new THREE.LineSegments(cartEdges, new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 }))
  );
  group.add(cartesianGrid);

  const cylindricalGrid = new THREE.Group();
  cylindricalGrid.position.set(0, 3.2, 0);
  const cylEdges = new THREE.EdgesGeometry(new THREE.CylinderGeometry(2.3, 2.3, 4.2, 24, 4, true));
  cylindricalGrid.add(
    new THREE.LineSegments(cylEdges, new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.5 }))
  );
  cylindricalGrid.visible = false;
  group.add(cylindricalGrid);

  const sphericalGrid = new THREE.Group();
  sphericalGrid.position.set(0, 3.2, 0);
  const sphEdges = new THREE.EdgesGeometry(new THREE.SphereGeometry(2.45, 16, 12));
  sphericalGrid.add(
    new THREE.LineSegments(sphEdges, new THREE.LineBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.5 }))
  );
  sphericalGrid.visible = false;
  group.add(sphericalGrid);

  scene.add(group);
  return {
    group,
    manifoldMesh,
    manifoldWire,
    baseDirections,
    cartesianGrid,
    cylindricalGrid,
    sphericalGrid,
  };
}

function buildCategoryAndSymmetryChamber(
  scene: THREE.Scene,
  isSoftwareGl: boolean,
  maxAnisotropy: number
): CategorySymmetryRig {
  const group = new THREE.Group();

  // Overhead Vault: Category C (left) -> Hyper-Prism Functor F -> Category D (right)
  const vaultY = 10.5;
  const vaultZ = -6;

  const starMatC = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 1.2,
  });
  const starMatD = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 1.2,
  });

  const catCObjects = [
    new THREE.Vector3(-8.5, vaultY + 1.2, vaultZ),
    new THREE.Vector3(-5.5, vaultY + 2.4, vaultZ - 1.5),
    new THREE.Vector3(-4.8, vaultY - 0.4, vaultZ + 1.2),
  ];
  const catDObjects = [
    new THREE.Vector3(4.8, vaultY + 1.2, vaultZ),
    new THREE.Vector3(7.8, vaultY + 2.4, vaultZ - 1.5),
    new THREE.Vector3(8.5, vaultY - 0.4, vaultZ + 1.2),
  ];

  catCObjects.forEach((p) => {
    const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), starMatC);
    star.position.copy(p);
    group.add(star);
  });
  catDObjects.forEach((p) => {
    const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), starMatD);
    star.position.copy(p);
    group.add(star);
  });

  // Directed morphism beams inside C and D + Functor projection rays
  const beamPoints: THREE.Vector3[] = [
    catCObjects[0], catCObjects[1],
    catCObjects[1], catCObjects[2],
    catCObjects[0], catCObjects[2],
    catDObjects[0], catDObjects[1],
    catDObjects[1], catDObjects[2],
    catDObjects[0], catDObjects[2],
    // Functor rays passing through central prism at (0, vaultY + 1.0, vaultZ)
    catCObjects[0], new THREE.Vector3(0, vaultY + 1.0, vaultZ),
    new THREE.Vector3(0, vaultY + 1.0, vaultZ), catDObjects[0],
    catCObjects[1], new THREE.Vector3(0, vaultY + 1.0, vaultZ),
    new THREE.Vector3(0, vaultY + 1.0, vaultZ), catDObjects[1],
    catCObjects[2], new THREE.Vector3(0, vaultY + 1.0, vaultZ),
    new THREE.Vector3(0, vaultY + 1.0, vaultZ), catDObjects[2],
  ];

  const projectorBeams = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(beamPoints),
    new THREE.LineBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.65 })
  );
  group.add(projectorBeams);

  // Central Hyper-Prism Functor F: C -> D
  const functorPrism = new THREE.Mesh(
    new THREE.OctahedronGeometry(1.35, 0),
    new THREE.MeshPhysicalMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: isSoftwareGl ? 0.45 : 0.88,
      transmission: isSoftwareGl ? 0 : 0.9,
      roughness: 0.08,
      ior: 1.8,
      metalness: 0.1,
    })
  );
  functorPrism.position.set(0, vaultY + 1.0, vaultZ);
  group.add(functorPrism);

  const vaultLabel = createHoloLabelTexture(
    'VOLTA DELLE CATEGORIE & FUNTORI',
    'F : Categoria C ⟶ Categoria D (Simmetrie & Morfismi)',
    '#a855f7',
    maxAnisotropy
  );
  const plaque = new THREE.Mesh(
    new THREE.PlaneGeometry(5.6, 1.5),
    new THREE.MeshBasicMaterial({ map: vaultLabel, transparent: true })
  );
  plaque.position.set(0, vaultY + 3.4, vaultZ);
  group.add(plaque);

  // Symmetry Group Crystal + Phase-Space Trajectory at (0, 6.2, -6)
  const symmetryCrystal = new THREE.Group();
  symmetryCrystal.position.set(0, 6.2, -6);

  const innerCrystal = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.95, 0),
    new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.15,
      metalness: 0.88,
    })
  );
  const outerCage = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1.28, 0),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true })
  );
  symmetryCrystal.add(innerCrystal, outerCage);
  group.add(symmetryCrystal);

  // Symplectic Phase-Space Orbit & Least Action Curve (δS = 0)
  const curvePoints: THREE.Vector3[] = [];
  for (let i = 0; i <= 80; i++) {
    const t = (i / 80) * Math.PI * 2;
    const r = 4.2 + 0.8 * Math.sin(3 * t);
    curvePoints.push(
      new THREE.Vector3(
        Math.cos(t) * r,
        5.5 + Math.cos(2 * t) * 0.65,
        -6 + Math.sin(t) * r * 0.55
      )
    );
  }
  const curve = new THREE.CatmullRomCurve3(curvePoints, true);
  const leastActionCurveMesh = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 120, 0.045, 8, true),
    new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    })
  );
  group.add(leastActionCurveMesh);

  scene.add(group);
  return {
    group,
    functorPrism,
    projectorBeams,
    symmetryCrystal,
    leastActionCurveMesh,
  };
}

export function updateManifoldGeometry(
  rig: ManifoldAltarChamberRig,
  metric: MetricType,
  coordSystem: CoordinateSystemType,
  morphIntensity: number
) {
  rig.cartesianGrid.visible = coordSystem === 'cartesian';
  rig.cylindricalGrid.visible = coordSystem === 'cylindrical';
  rig.sphericalGrid.visible = coordSystem === 'spherical';

  const geo = rig.manifoldMesh.geometry as THREE.BufferGeometry;
  const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
  const base = rig.baseDirections;
  const R = 1.65;

  for (let i = 0; i < posAttr.count; i++) {
    const dx = base[i * 3];
    const dy = base[i * 3 + 1];
    const dz = base[i * 3 + 2];

    let tx = dx * R;
    let ty = dy * R;
    let tz = dz * R;

    if (metric === 'manhattan_l1') {
      // L1 unit ball: |x| + |y| + |z| = R
      const l1 = Math.abs(dx) + Math.abs(dy) + Math.abs(dz) || 1;
      tx = (dx / l1) * R * 1.25;
      ty = (dy / l1) * R * 1.25;
      tz = (dz / l1) * R * 1.25;
    } else if (metric === 'chebyshev_linf') {
      // L_infinity unit ball: max(|x|, |y|, |z|) = R
      const linf = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz)) || 1;
      tx = (dx / linf) * R * 0.82;
      ty = (dy / linf) * R * 0.82;
      tz = (dz / linf) * R * 0.82;
    } else if (metric === 'riemann_complex') {
      // Riemann surface helical sheet w = sqrt(z)
      const angle = Math.atan2(dz, dx);
      const rHoriz = Math.hypot(dx, dz);
      const sheetHeight = Math.sin(angle * 0.5 + dy * Math.PI) * 1.15;
      tx = dx * R * (0.75 + 0.35 * rHoriz);
      ty = sheetHeight * R * 0.85;
      tz = dz * R * (0.75 + 0.35 * rHoriz);
    }

    const fx = THREE.MathUtils.lerp(dx * R, tx, morphIntensity);
    const fy = THREE.MathUtils.lerp(dy * R, ty, morphIntensity);
    const fz = THREE.MathUtils.lerp(dz * R, tz, morphIntensity);

    posAttr.setXYZ(i, fx, fy, fz);
  }

  posAttr.needsUpdate = true;
  geo.computeVertexNormals();
}
