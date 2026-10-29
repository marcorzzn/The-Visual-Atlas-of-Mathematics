import * as THREE from 'three';
import { HARDWARE_PEDESTALS, HardwarePedestalData } from '../data/pantheonData';
import {
  createContactShadowTexture,
  createHoloLabelTexture,
  createSiliconWaferTexture,
} from './proceduralTextures';

export interface PedestalAssembly {
  data: HardwarePedestalData;
  rootGroup: THREE.Group;
  artifactGroup: THREE.Group;
  selectionRing: THREE.Mesh;
  proxyCollider: THREE.Mesh;
}

export interface AbstractionElevatorRig {
  rootGroup: THREE.Group;
  layers: THREE.Group[];
  beamLines: THREE.LineSegments;
  chemistryLattice: THREE.Group;
  physicsFieldGroup: THREE.Group;
  blochVectorArrow: THREE.Group;
  csGateGroup: THREE.Group;
  mathCageMesh: THREE.LineSegments;
  layerLabels: THREE.Mesh[];
}

export function buildHardwareTimeline(
  scene: THREE.Scene,
  isSoftwareGl: boolean,
  maxAnisotropy: number
): {
  pedestals: PedestalAssembly[];
  colliders: THREE.Mesh[];
  elevatorRig: AbstractionElevatorRig;
} {
  const shadowTex = createContactShadowTexture();
  const waferTex = createSiliconWaferTexture(maxAnisotropy);

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.72,
    metalness: 0.18,
  });
  const trimBrassMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.22,
    metalness: 0.88,
  });
  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.38,
    metalness: 0.82,
  });
  const copperMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.25,
    metalness: 0.9,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xe0f2fe,
    transparent: true,
    opacity: isSoftwareGl ? 0.35 : 0.92,
    transmission: isSoftwareGl ? 0 : 0.88,
    roughness: 0.08,
    ior: 1.52,
    thickness: 0.6,
    depthWrite: false,
  });

  const pedestals: PedestalAssembly[] = [];
  const colliders: THREE.Mesh[] = [];

  HARDWARE_PEDESTALS.forEach((data) => {
    const rootGroup = new THREE.Group();
    rootGroup.position.set(data.xPosition, 0, 0);

    // Contact shadow on floor (offset +0.02 on Y to prevent Z-fighting)
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(4.2, 4.2),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.6,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.02;
    rootGroup.add(shadowPlane);

    // Neoclassical stepped pedestal (4 distinct architectural parts)
    const plinthBase = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.3, 2.6), stoneMat);
    plinthBase.position.y = 0.15;
    plinthBase.castShadow = true;
    plinthBase.receiveShadow = true;
    rootGroup.add(plinthBase);

    const columnShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 1.08, 1.2, 8), stoneMat);
    columnShaft.position.y = 0.9;
    columnShaft.castShadow = true;
    columnShaft.receiveShadow = true;
    rootGroup.add(columnShaft);

    const capitalCrown = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.22, 2.2), darkMetalMat);
    capitalCrown.position.y = 1.61;
    capitalCrown.castShadow = true;
    rootGroup.add(capitalCrown);

    const selectionRing = new THREE.Mesh(
      new THREE.RingGeometry(1.32, 1.48, 32),
      new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      })
    );
    selectionRing.rotation.x = -Math.PI / 2;
    selectionRing.position.y = 0.03;
    rootGroup.add(selectionRing);

    // Floating holographic plaque in front of pedestal
    const labelTex = createHoloLabelTexture(
      data.name,
      data.era,
      '#38bdf8',
      maxAnisotropy
    );
    const plaque = new THREE.Mesh(
      new THREE.PlaneGeometry(2.5, 0.78),
      new THREE.MeshBasicMaterial({ map: labelTex, transparent: true })
    );
    plaque.position.set(0, 1.05, 1.42);
    rootGroup.add(plaque);

    // Composite 3-12 part artifact mounted at y = 1.75
    const artifactGroup = buildSpecificHardwareArtifact(
      data.id,
      trimBrassMat,
      darkMetalMat,
      copperMat,
      glassMat,
      waferTex
    );
    artifactGroup.position.y = 1.75;
    rootGroup.add(artifactGroup);

    // Invisible proxy collider on layer 1 for fast raycasting
    const proxyCollider = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 4.2, 2.8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    proxyCollider.position.y = 2.1;
    proxyCollider.layers.set(1);
    proxyCollider.userData = { type: 'pedestal', pedestalIndex: data.index };
    rootGroup.add(proxyCollider);
    colliders.push(proxyCollider);

    scene.add(rootGroup);
    pedestals.push({
      data,
      rootGroup,
      artifactGroup,
      selectionRing,
      proxyCollider,
    });
  });

  const elevatorRig = buildAbstractionElevatorRig(scene, maxAnisotropy);

  return { pedestals, colliders, elevatorRig };
}

function buildSpecificHardwareArtifact(
  id: string,
  brassMat: THREE.MeshStandardMaterial,
  darkMetalMat: THREE.MeshStandardMaterial,
  copperMat: THREE.MeshStandardMaterial,
  glassMat: THREE.MeshPhysicalMaterial,
  waferTex: THREE.CanvasTexture
): THREE.Group {
  const group = new THREE.Group();

  if (id === 'abacus') {
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.65,
      metalness: 0.08,
    });
    // Outer frame (4 sides + divider)
    const leftBar = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.5, 0.14), woodMat);
    leftBar.position.set(-0.85, 0.75, 0);
    const rightBar = leftBar.clone();
    rightBar.position.set(0.85, 0.75, 0);
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(1.84, 0.14, 0.16), woodMat);
    topBar.position.set(0, 1.45, 0);
    const bottomBar = topBar.clone();
    bottomBar.position.set(0, 0.07, 0);
    const deckBar = new THREE.Mesh(new THREE.BoxGeometry(1.76, 0.09, 0.15), brassMat);
    deckBar.position.set(0, 1.05, 0);
    group.add(leftBar, rightBar, topBar, bottomBar, deckBar);

    const beadGeo = new THREE.LatheGeometry(
      [
        new THREE.Vector2(0.02, -0.06),
        new THREE.Vector2(0.11, 0),
        new THREE.Vector2(0.02, 0.06),
      ],
      16
    );
    for (let r = -2; r <= 2; r++) {
      const x = r * 0.34;
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.35, 8), copperMat);
      rod.position.set(x, 0.75, 0);
      group.add(rod);

      // Heaven bead
      const hBead = new THREE.Mesh(beadGeo, brassMat);
      hBead.position.set(x, r % 2 === 0 ? 1.28 : 1.16, 0);
      group.add(hBead);

      // Earth beads
      for (let b = 0; b < 3; b++) {
        const eBead = new THREE.Mesh(beadGeo, brassMat);
        const offset = (r + b) % 2 === 0 ? 0.12 : 0;
        eBead.position.set(x, 0.25 + b * 0.22 + offset, 0);
        group.add(eBead);
      }
    }
  } else if (id === 'calculator') {
    // Pascaline brass casing + Leibniz stepped drums + spoked wheels
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.55, 1.1), brassMat);
    chassis.position.y = 0.28;
    const topPlate = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.08, 1.0), darkMetalMat);
    topPlate.position.y = 0.58;
    group.add(chassis, topPlate);

    for (let i = -1; i <= 1; i++) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.08, 16), copperMat);
      wheel.position.set(i * 0.52, 0.68, 0.15);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.16, 12), brassMat);
      hub.position.set(i * 0.52, 0.72, 0.15);
      const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.55, 12), brassMat);
      drum.rotation.z = Math.PI / 2;
      drum.position.set(i * 0.5, 0.98, -0.2);
      group.add(wheel, hub, drum);
    }
  } else if (id === 'vacuum_tube') {
    // Bakelite base + pins + internal glowing filament + grid + glass envelope
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.56, 0.42, 24), darkMetalMat);
    base.position.y = 0.21;
    group.add(base);

    const filamentMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      emissive: 0xf97316,
      emissiveIntensity: 2.4,
      roughness: 0.2,
    });
    const cathode = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.1, 12), filamentMat);
    cathode.position.y = 0.95;

    const controlGrid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.95, 12, 6, true),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, wireframe: true })
    );
    controlGrid.position.y = 0.95;

    const anodePlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.36, 0.85, 16, 1, true),
      darkMetalMat
    );
    anodePlate.position.y = 0.95;

    const bulb = new THREE.Mesh(new THREE.CapsuleGeometry(0.48, 0.9, 16, 24), glassMat);
    bulb.position.y = 1.05;
    bulb.renderOrder = 2;

    group.add(cathode, controlGrid, anodePlate, bulb);
  } else if (id === 'transistor') {
    // Silicon doped substrate + Source/Drain/Gate metallic stacks + gold bond arches
    const substrate = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 0.35, 1.5),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.6 })
    );
    substrate.position.y = 0.18;

    const nWellLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.24, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3, metalness: 0.5 })
    );
    nWellLeft.position.set(-0.48, 0.4, 0);
    const nWellRight = nWellLeft.clone();
    nWellRight.position.set(0.48, 0.4, 0);

    const oxideLayer = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.1, 1.24),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.4 })
    );
    oxideLayer.position.set(0, 0.42, 0);

    const gateElectrode = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.45, 1.15), brassMat);
    gateElectrode.position.set(0, 0.7, 0);

    const sourceContact = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.5, 16), copperMat);
    sourceContact.position.set(-0.52, 0.72, 0);
    const drainContact = sourceContact.clone();
    drainContact.position.set(0.52, 0.72, 0);

    group.add(substrate, nWellLeft, nWellRight, oxideLayer, gateElectrode, sourceContact, drainContact);
  } else if (id === 'cpu') {
    // PCB + Lithography Silicon Die + Copper Heat Pipes + Integrated Heat Spreader frame
    const pcb = new THREE.Mesh(
      new THREE.BoxGeometry(1.85, 0.14, 1.85),
      new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.5, metalness: 0.3 })
    );
    pcb.position.y = 0.07;

    const dieMat = new THREE.MeshStandardMaterial({
      map: waferTex,
      roughness: 0.15,
      metalness: 0.85,
    });
    const siliconDie = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.18, 1.15), dieMat);
    siliconDie.position.y = 0.23;

    // Gold pins grid
    for (let x = -0.7; x <= 0.71; x += 0.35) {
      for (let z = -0.7; z <= 0.71; z += 0.35) {
        const pin = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), brassMat);
        pin.position.set(x, 0.16, z);
        group.add(pin);
      }
    }

    // Floating holographic multi-core crown
    const coreRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.65, 0.04, 12, 32),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.8 })
    );
    coreRing.rotation.x = Math.PI / 2;
    coreRing.position.y = 0.65;

    group.add(pcb, siliconDie, coreRing);
  } else if (id === 'server_rack') {
    // Data Center Rack with 6 illuminated blade units & optical interconnect conduits
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.45, 2.0, 1.35), darkMetalMat);
    frame.position.y = 1.0;
    group.add(frame);

    const fiberMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 1.2,
    });

    for (let b = 0; b < 5; b++) {
      const y = 0.32 + b * 0.34;
      const blade = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.22, 1.42), brassMat);
      blade.position.y = y;
      const lightBar = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.05, 1.46), fiberMat);
      lightBar.position.y = y;
      group.add(blade, lightBar);
    }
  } else {
    // Cryogenic Quantum Computer "Golden Chandelier" (6 stages + coaxial waveguides + QPU)
    const stageRadii = [0.85, 0.72, 0.58, 0.44, 0.28];
    const stageHeights = [1.95, 1.52, 1.1, 0.7, 0.32];

    stageRadii.forEach((radius, idx) => {
      const disc = new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius, 0.07, 28),
        idx % 2 === 0 ? brassMat : copperMat
      );
      disc.position.y = stageHeights[idx];
      group.add(disc);
    });

    // Vertical support rods
    for (let a = 0; a < 4; a++) {
      const angle = (a * Math.PI) / 2;
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.7, 10), copperMat);
      rod.position.set(Math.cos(angle) * 0.38, 1.12, Math.sin(angle) * 0.38);
      group.add(rod);
    }

    // QPU superconducting core at bottom
    const qpuCore = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.2, 1),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 1.6,
        metalness: 0.9,
        roughness: 0.1,
      })
    );
    qpuCore.position.y = 0.16;
    group.add(qpuCore);
  }

  return group;
}

function buildAbstractionElevatorRig(
  scene: THREE.Scene,
  maxAnisotropy: number
): AbstractionElevatorRig {
  const rootGroup = new THREE.Group();
  const layers: THREE.Group[] = [];
  const layerLabels: THREE.Mesh[] = [];

  const layerSpecs = [
    { title: '1. CHIMICA', sub: 'Reticolo & Drogaggio P-N', color: '#10b981', hex: 0x10b981 },
    { title: '2. FISICA', sub: 'Campi & Sfera di Bloch', color: '#38bdf8', hex: 0x38bdf8 },
    { title: '3. INFORMATICA', sub: 'Porte Logiche & Bit-Stream', color: '#a855f7', hex: 0xa855f7 },
    { title: '4. MATEMATICA', sub: 'Operatori, Algebra & Matrici', color: '#f59e0b', hex: 0xf59e0b },
  ];

  const chemistryLattice = new THREE.Group();
  const physicsFieldGroup = new THREE.Group();
  const blochVectorArrow = new THREE.Group();
  const csGateGroup = new THREE.Group();
  let mathCageMesh!: THREE.LineSegments;

  layerSpecs.forEach((spec, idx) => {
    const layerGroup = new THREE.Group();
    layerGroup.position.y = 3.8 + idx * 0.15;

    // Holographic platform frame
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.45, 1.55, 32),
      new THREE.MeshBasicMaterial({
        color: spec.hex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      })
    );
    ring.rotation.x = -Math.PI / 2;
    layerGroup.add(ring);

    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(1.45, 32),
      new THREE.MeshBasicMaterial({
        color: spec.hex,
        transparent: true,
        opacity: 0.09,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    disc.rotation.x = -Math.PI / 2;
    layerGroup.add(disc);

    // Floating badge on right side of layer
    const badgeTex = createHoloLabelTexture(spec.title, spec.sub, spec.color, maxAnisotropy);
    const badge = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 0.68),
      new THREE.MeshBasicMaterial({ map: badgeTex, transparent: true })
    );
    badge.position.set(2.35, 0.35, 0);
    layerGroup.add(badge);
    layerLabels.push(badge);

    if (idx === 0) {
      // Layer 1: Chemistry — Crystalline Diamond/Silicon Lattice & Doping Atoms
      const atomGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const siMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        metalness: 0.6,
        roughness: 0.2,
      });
      const dopantMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.8,
      });
      const positions = [
        [0, 0.35, 0],
        [-0.45, 0.12, -0.45],
        [0.45, 0.12, -0.45],
        [-0.45, 0.12, 0.45],
        [0.45, 0.12, 0.45],
        [-0.35, 0.62, 0.35],
        [0.35, 0.62, -0.35],
      ];
      positions.forEach((p, i) => {
        const atom = new THREE.Mesh(atomGeo, i === 0 || i === 5 ? dopantMat : siMat);
        atom.position.set(p[0], p[1], p[2]);
        chemistryLattice.add(atom);
      });
      layerGroup.add(chemistryLattice);
    } else if (idx === 1) {
      // Layer 2: Physics — Bloch Sphere + Electron Vector Field
      const wireSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 16, 12),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.45 })
      );
      wireSphere.position.y = 0.58;
      physicsFieldGroup.add(wireSphere);

      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8),
        new THREE.MeshBasicMaterial({ color: 0xf59e0b })
      );
      shaft.position.y = 0.25;
      const tip = new THREE.Mesh(
        new THREE.ConeGeometry(0.08, 0.18, 12),
        new THREE.MeshBasicMaterial({ color: 0xf59e0b })
      );
      tip.position.y = 0.52;
      blochVectorArrow.add(shaft, tip);
      blochVectorArrow.position.y = 0.58;
      physicsFieldGroup.add(blochVectorArrow);
      layerGroup.add(physicsFieldGroup);
    } else if (idx === 2) {
      // Layer 3: Computer Science — Logic Gates & Byte Streams
      const gateMat = new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        emissive: 0x7e22ce,
        emissiveIntensity: 0.6,
        metalness: 0.5,
        roughness: 0.3,
      });
      const gateLeft = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.25, 0.42), gateMat);
      gateLeft.position.set(-0.5, 0.35, 0);
      const gateRight = gateLeft.clone();
      gateRight.position.set(0.5, 0.35, 0);
      const gateOut = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.3, 6), gateMat);
      gateOut.position.set(0, 0.55, 0);
      csGateGroup.add(gateLeft, gateRight, gateOut);
      layerGroup.add(csGateGroup);
    } else if (idx === 3) {
      // Layer 4: Pure Mathematics — Live Deformable Matrix Cage
      const boxGeo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
      const edges = new THREE.EdgesGeometry(boxGeo);
      mathCageMesh = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0xf59e0b })
      );
      mathCageMesh.position.y = 0.62;
      layerGroup.add(mathCageMesh);
    }

    rootGroup.add(layerGroup);
    layers.push(layerGroup);
  });

  // Vertical laser conduits linking the 4 layers
  const beamPositions = new Float32Array(4 * 2 * 3);
  const beamGeo = new THREE.BufferGeometry();
  beamGeo.setAttribute('position', new THREE.BufferAttribute(beamPositions, 3));
  const beamLines = new THREE.LineSegments(
    beamGeo,
    new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.55 })
  );
  rootGroup.add(beamLines);

  scene.add(rootGroup);

  return {
    rootGroup,
    layers,
    beamLines,
    chemistryLattice,
    physicsFieldGroup,
    blochVectorArrow,
    csGateGroup,
    mathCageMesh,
    layerLabels,
  };
}
