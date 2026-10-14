/**
 * JalSanjeevani - 3D Holographic Regional Telemetry Canvas (Three.js)
 * 
 * Features:
 * 1. Deccan Trap 3D Holographic Topographical Mesh with animated wave currents.
 * 2. 15-meter Translucent Geofenced Corridor 3D Tube (CVRP route).
 * 3. 3D Moving Water Tanker (Truck cab, cylindrical tank, headlights & floating telemetry HUD).
 * 4. Volumetric Drought Stress Domes (WDI 0.58 Amber Zone & WDI 0.84 Crimson Depletion Zone).
 * 5. Waypoints with Pulsing Ripple Rings (Sinnar Hydrant, NH-60, Wavi Relay, Khopadi Cistern).
 * 6. Interactive mouse/touch camera tilt & auto-cinematic pan.
 * 7. Seamless 3D / 2D Vector switcher with full WebGL fallback.
 */

(function () {
  "use strict";

  const container = document.getElementById("hero-telemetry-stage");
  if (!container) return;

  // Verify WebGL availability
  function isWebGLAvailable() {
    try {
      const canvas = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
    } catch (e) {
      return false;
    }
  }

  if (!window.THREE || !isWebGLAvailable()) {
    console.log("ℹ️ WebGL/Three.js not available, utilizing high-precision 2D SVG telemetry.");
    return;
  }

  const THREE = window.THREE;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x070b14, 0.035);

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 350;

  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
  camera.position.set(0, 14, 18);
  camera.lookAt(0, -0.5, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const canvas3D = renderer.domElement;
  canvas3D.id = "hero-3d-webgl-canvas";
  canvas3D.className = "absolute inset-0 w-full h-full block z-[2] cursor-grab active:cursor-grabbing transition-opacity duration-500";
  container.appendChild(canvas3D);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x0a192f, 2.5);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0x00e5ff, 2.0);
  dirLight.position.set(10, 20, 10);
  scene.add(dirLight);

  const amberPointLight = new THREE.PointLight(0xf59e0b, 2.0, 15);
  amberPointLight.position.set(-4, 3, 2);
  scene.add(amberPointLight);

  const crimsonPointLight = new THREE.PointLight(0xef4444, 2.8, 16);
  crimsonPointLight.position.set(6, 4, -3);
  scene.add(crimsonPointLight);

  // 1. TOPOGRAPHICAL HOLOGRAPHIC TERRAIN MESH
  const terrainGeo = new THREE.PlaneGeometry(36, 24, 44, 32);
  const pos = terrainGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const vx = pos.getX(i);
    const vy = pos.getY(i);
    // Sculpt Deccan Trap basalt elevation contours
    const elevation = Math.sin(vx * 0.28) * Math.cos(vy * 0.32) * 1.1 + Math.sin((vx + vy) * 0.2) * 0.5;
    pos.setZ(i, elevation);
  }
  terrainGeo.computeVertexNormals();

  const terrainMat = new THREE.MeshStandardMaterial({
    color: 0x0c172a,
    emissive: 0x051329,
    roughness: 0.85,
    metalness: 0.2,
    wireframe: true,
    transparent: true,
    opacity: 0.38
  });
  const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
  terrainMesh.rotation.x = -Math.PI / 2;
  terrainMesh.position.y = -1.2;
  scene.add(terrainMesh);

  // Holographic Base Grid
  const gridHelper = new THREE.GridHelper(36, 36, 0x00e5ff, 0x1e293b);
  gridHelper.position.y = -1.22;
  gridHelper.material.opacity = 0.28;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  // Floating Particle Dust
  const particleCount = 180;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePos[i] = (Math.random() - 0.5) * 32;
    particlePos[i + 1] = Math.random() * 8 - 1;
    particlePos[i + 2] = (Math.random() - 0.5) * 22;
  }
  particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x00e5ff,
    size: 0.12,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // 2. 3D ROUTE & 15-METER GEOFENCED CORRIDOR TUBE
  const routePoints = [
    new THREE.Vector3(-10, 0.4, 4),    // Sinnar Hydrant #04
    new THREE.Vector3(-4.5, 0.9, 0.5),  // NH-60 Telemetry Gate
    new THREE.Vector3(2.5, 1.4, 2.2),   // Wavi Ridge Relay
    new THREE.Vector3(9.5, 0.5, -2.5)   // Khopadi Cistern #02
  ];

  const routeCurve = new THREE.CatmullRomCurve3(routePoints, false, "centripetal", 0.3);

  // 15m Geofenced Corridor Tube (Translucent outer shell)
  const tubeGeo = new THREE.TubeGeometry(routeCurve, 72, 0.75, 12, false);
  const tubeMat = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    transparent: true,
    opacity: 0.18,
    wireframe: false,
    side: THREE.DoubleSide
  });
  const corridorTube = new THREE.Mesh(tubeGeo, tubeMat);
  scene.add(corridorTube);

  // Outer Dashed Wireframe Ring for Tube
  const tubeWireMat = new THREE.MeshBasicMaterial({
    color: 0x22d3ee,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });
  const corridorTubeWire = new THREE.Mesh(tubeGeo, tubeWireMat);
  scene.add(corridorTubeWire);

  // Center Glowing Route Line
  const linePoints = routeCurve.getPoints(120);
  const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
  const lineMat = new THREE.LineBasicMaterial({ color: 0x00e5ff, linewidth: 3 });
  const routeLine = new THREE.Line(lineGeo, lineMat);
  scene.add(routeLine);

  // 3. WAYPOINT BEACONS
  function createWaypoint(x, y, z, colorHex, labelText, isTarget = false) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    // Vertical marker stem
    const stemGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.6, 8);
    const stemMat = new THREE.MeshBasicMaterial({ color: colorHex });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = 0.8;
    group.add(stem);

    // Glowing orb head
    const orbGeo = new THREE.SphereGeometry(isTarget ? 0.38 : 0.24, 16, 16);
    const orbMat = new THREE.MeshBasicMaterial({ color: colorHex });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.position.y = 1.6;
    group.add(orb);

    // Pulsing ground ring
    const ringGeo = new THREE.RingGeometry(0.35, isTarget ? 1.4 : 0.75, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: colorHex, side: THREE.DoubleSide, transparent: true, opacity: 0.65 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.05;
    group.add(ring);

    // Target Cistern: add second concentric pulsing ripple ring
    if (isTarget) {
      const ring2Geo = new THREE.RingGeometry(1.4, 1.8, 24);
      const ring2Mat = new THREE.MeshBasicMaterial({ color: colorHex, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.x = -Math.PI / 2;
      ring2.position.y = 0.04;
      group.add(ring2);
    }

    scene.add(group);
    return { group, ring };
  }

  const wpDepot = createWaypoint(-10, 0.4, 4, 0x00e5ff, "Sinnar Hydrant #04");
  const wpGate = createWaypoint(-4.5, 0.9, 0.5, 0x22d3ee, "NH-60 Gate");
  const wpRelay = createWaypoint(2.5, 1.4, 2.2, 0x22d3ee, "Wavi Relay");
  const wpCistern = createWaypoint(9.5, 0.5, -2.5, 0x10b981, "Khopadi Cistern #02", true);

  // 4. VOLUMETRIC DROUGHT STRESS ZONES
  // Amber Zone: Sinnar West (WDI 0.58)
  const amberDomeGeo = new THREE.SphereGeometry(4.2, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.45);
  const amberDomeMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide
  });
  const amberDome = new THREE.Mesh(amberDomeGeo, amberDomeMat);
  amberDome.position.set(-3.5, -0.6, 1.5);
  scene.add(amberDome);

  const amberWireMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true, transparent: true, opacity: 0.28 });
  const amberWire = new THREE.Mesh(amberDomeGeo, amberWireMat);
  amberWire.position.copy(amberDome.position);
  scene.add(amberWire);

  // Red Critical Aquifer Depletion Zone (WDI 0.84)
  const redDomeGeo = new THREE.SphereGeometry(3.6, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.45);
  const redDomeMat = new THREE.MeshBasicMaterial({
    color: 0xef4444,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide
  });
  const redDome = new THREE.Mesh(redDomeGeo, redDomeMat);
  redDome.position.set(5.5, -0.8, -3.2);
  scene.add(redDome);

  const redWireMat = new THREE.MeshBasicMaterial({ color: 0xef4444, wireframe: true, transparent: true, opacity: 0.35 });
  const redWire = new THREE.Mesh(redDomeGeo, redWireMat);
  redWire.position.copy(redDome.position);
  scene.add(redWire);

  // Well #19 Alert Beacon in Red Zone
  const wellGroup = new THREE.Group();
  wellGroup.position.set(4.5, -0.2, -1.8);
  const wellBeamGeo = new THREE.CylinderGeometry(0.04, 0.08, 4.5, 8);
  const wellBeamMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.75 });
  const wellBeam = new THREE.Mesh(wellBeamGeo, wellBeamMat);
  wellBeam.position.y = 2.25;
  wellGroup.add(wellBeam);
  scene.add(wellGroup);

  // 5. 3D MOVING WATER TANKER VEHICLE
  const tankerGroup = new THREE.Group();

  // Truck Cab
  const cabGeo = new THREE.BoxGeometry(0.55, 0.45, 0.4);
  const cabMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.6, roughness: 0.3 });
  const cab = new THREE.Mesh(cabGeo, cabMat);
  cab.position.set(0.35, 0.32, 0);
  tankerGroup.add(cab);

  // Windshield
  const windshieldGeo = new THREE.BoxGeometry(0.12, 0.22, 0.36);
  const windshieldMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
  const windshield = new THREE.Mesh(windshieldGeo, windshieldMat);
  windshield.position.set(0.6, 0.38, 0);
  tankerGroup.add(windshield);

  // Water Tank Cylinder (10,000L Delivery Reservoir)
  const tankGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.9, 16);
  const tankMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.5, roughness: 0.2 });
  const tank = new THREE.Mesh(tankGeo, tankMat);
  tank.rotation.z = Math.PI / 2;
  tank.position.set(-0.35, 0.38, 0);
  tankerGroup.add(tank);

  // Tank end cap caps
  const endCapGeo = new THREE.SphereGeometry(0.28, 12, 12);
  const endCapFront = new THREE.Mesh(endCapGeo, tankMat);
  endCapFront.scale.set(0.5, 1, 1);
  endCapFront.position.set(0.1, 0.38, 0);
  tankerGroup.add(endCapFront);

  const endCapBack = new THREE.Mesh(endCapGeo, tankMat);
  endCapBack.scale.set(0.5, 1, 1);
  endCapBack.position.set(-0.8, 0.38, 0);
  tankerGroup.add(endCapBack);

  // Chassis base
  const chassisGeo = new THREE.BoxGeometry(1.4, 0.1, 0.45);
  const chassisMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
  const chassis = new THREE.Mesh(chassisGeo, chassisMat);
  chassis.position.set(-0.1, 0.12, 0);
  tankerGroup.add(chassis);

  // Wheels (4 dual pairs)
  const wheelGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.12, 12);
  const wheelMat = new THREE.MeshBasicMaterial({ color: 0x020617 });
  const wheelOffsets = [
    [-0.55, 0.14, 0.25], [-0.55, 0.14, -0.25],
    [-0.2, 0.14, 0.25], [-0.2, 0.14, -0.25],
    [0.35, 0.14, 0.25], [0.35, 0.14, -0.25]
  ];
  wheelOffsets.forEach(([wx, wy, wz]) => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(wx, wy, wz);
    tankerGroup.add(wheel);
  });

  // Glowing vehicle aura ring
  const auraGeo = new THREE.RingGeometry(0.4, 0.9, 16);
  const auraMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, side: THREE.DoubleSide, transparent: true, opacity: 0.45 });
  const aura = new THREE.Mesh(auraGeo, auraMat);
  aura.rotation.x = -Math.PI / 2;
  aura.position.y = 0.05;
  tankerGroup.add(aura);

  // Headlight beam cones
  const lightConeGeo = new THREE.ConeGeometry(0.35, 1.6, 12, 1, true);
  const lightConeMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.18, side: THREE.DoubleSide });
  const lightCone = new THREE.Mesh(lightConeGeo, lightConeMat);
  lightCone.rotation.z = -Math.PI / 2;
  lightCone.position.set(1.4, 0.25, 0);
  tankerGroup.add(lightCone);

  scene.add(tankerGroup);

  // 6. INTERACTIVE MOUSE / TOUCH PERSPECTIVE CONTROLS
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let isDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;

  function onPointerDown(e) {
    isDragging = true;
    prevMouseX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    prevMouseY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
  }

  function onPointerMove(e) {
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    if (isDragging) {
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      targetRotationY += deltaX * 0.005;
      targetRotationX += deltaY * 0.003;
      targetRotationX = Math.max(-0.25, Math.min(0.35, targetRotationX));
      prevMouseX = clientX;
      prevMouseY = clientY;
    } else {
      const rect = container.getBoundingClientRect();
      mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((clientY - rect.top) / rect.height) * 2 - 1);
    }
  }

  function onPointerUp() {
    isDragging = false;
  }

  container.addEventListener("mousedown", onPointerDown);
  window.addEventListener("mousemove", onPointerMove);
  window.addEventListener("mouseup", onPointerUp);

  container.addEventListener("touchstart", onPointerDown, { passive: true });
  window.addEventListener("touchmove", onPointerMove, { passive: true });
  window.addEventListener("touchend", onPointerUp, { passive: true });

  // 7. ANIMATION LOOP
  let clock = new THREE.Clock();
  let animFrameId = null;
  let is3DActive = true;

  function animate() {
    if (!is3DActive) return;
    animFrameId = requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Move Tanker Truck along 3D Curve (11s full transit loop)
    const loopDuration = 11.0;
    const t = (elapsedTime % loopDuration) / loopDuration;
    const point = routeCurve.getPointAt(t);
    const tangent = routeCurve.getTangentAt(t);

    tankerGroup.position.copy(point);

    // Orient truck towards tangent with smooth banking
    const lookTarget = point.clone().add(tangent);
    tankerGroup.lookAt(lookTarget);

    // Pulse Destination Cistern ripple rings
    const rippleScale = 1 + (Math.sin(elapsedTime * 2.8) * 0.15 + 0.15);
    if (wpCistern && wpCistern.ring) {
      wpCistern.ring.scale.set(rippleScale, rippleScale, 1);
    }

    // Pulse Alert Domes
    const amberPulse = 1 + Math.sin(elapsedTime * 1.5) * 0.02;
    amberDome.scale.set(amberPulse, amberPulse, amberPulse);
    amberWire.scale.copy(amberDome.scale);

    const redPulse = 1 + Math.sin(elapsedTime * 2.5) * 0.035;
    redDome.scale.set(redPulse, redPulse, redPulse);
    redWire.scale.copy(redDome.scale);

    // Subtle drift of particles
    const pArr = particleGeo.attributes.position.array;
    for (let i = 1; i < particleCount * 3; i += 3) {
      pArr[i] += 0.008;
      if (pArr[i] > 8) pArr[i] = -1;
    }
    particleGeo.attributes.position.needsUpdate = true;

    // Smooth Camera Orbit & Tilt Interpolation
    const baseCamX = Math.sin(elapsedTime * 0.12) * 1.8;
    const baseCamZ = 18 + Math.cos(elapsedTime * 0.12) * 1.2;

    camera.position.x += (baseCamX + mouseX * 2.5 + targetRotationY * 12 - camera.position.x) * 0.05;
    camera.position.y += (14 + mouseY * 1.5 - targetRotationX * 8 - camera.position.y) * 0.05;
    camera.position.z += (baseCamZ - camera.position.z) * 0.05;
    camera.lookAt(0, -0.4, 0);

    renderer.render(scene, camera);
  }

  animate();

  // Responsive Resize Observer
  const resizeObserver = new ResizeObserver(() => {
    const newW = container.clientWidth;
    const newH = container.clientHeight;
    if (newW > 0 && newH > 0) {
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    }
  });
  resizeObserver.observe(container);

  // 8. 3D / 2D VECTOR SWITCHER CONTROLLER
  const btnToggleViewMode = document.getElementById("btnToggle3DTelemetry");
  const svgFallback = document.getElementById("hero-2d-svg-canvas");

  function setViewMode(mode3D) {
    is3DActive = mode3D;
    if (canvas3D) {
      canvas3D.style.display = mode3D ? "block" : "none";
      canvas3D.style.opacity = mode3D ? "1" : "0";
    }
    if (svgFallback) {
      svgFallback.style.display = mode3D ? "none" : "block";
      svgFallback.style.opacity = mode3D ? "0" : "1";
    }
    if (btnToggleViewMode) {
      btnToggleViewMode.innerHTML = mode3D
        ? '<span class="material-symbols-outlined text-[14px]">view_in_ar</span><span>3D Hologram</span>'
        : '<span class="material-symbols-outlined text-[14px]">map</span><span>2D GIS</span>';
    }
    if (mode3D && !animFrameId) {
      clock.start();
      animate();
    }
  }

  btnToggleViewMode?.addEventListener("click", () => {
    setViewMode(!is3DActive);
  });

  // Expose global controller
  window.JalHero3D = {
    setViewMode,
    is3DActive: () => is3DActive
  };
})();
