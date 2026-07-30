/* Hero: силуэт одежды */
(function () {
  var canvas = document.getElementById("hero-3d");
  if (!canvas || typeof THREE === "undefined") return;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(48, 1, 0.1, 50);
  camera.position.set(0, 0.15, 4.2);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  var group = new THREE.Group();
  var mat = new THREE.MeshStandardMaterial({
    color: 0x222228,
    emissive: 0x6b21a8,
    emissiveIntensity: 0.35,
    metalness: 0.5,
    roughness: 0.4,
  });
  var torso = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.42, 1, 32, 4, true), mat);
  torso.position.y = -0.12;
  group.add(torso);
  var hood = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.11, 12, 40, Math.PI * 1.05), mat);
  hood.rotation.x = Math.PI / 2;
  hood.position.set(0, 0.52, 0.08);
  group.add(hood);
  scene.add(group);

  scene.add(new THREE.AmbientLight(0x404060, 0.4));
  var d = new THREE.DirectionalLight(0xffffff, 0.7);
  d.position.set(2, 4, 3);
  scene.add(d);
  var p = new THREE.PointLight(0x2ee6d6, 0.6, 12);
  p.position.set(-2, 1, 2);
  scene.add(p);

  function resize() {
    var wrap = canvas.parentElement;
    var w = Math.max(1, wrap.clientWidth);
    var h = Math.max(1, wrap.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", resize);
  requestAnimationFrame(function () {
    resize();
    resize();
  });

  var t = 0;
  function frame() {
    requestAnimationFrame(frame);
    t += 0.015;
    group.rotation.y = Math.sin(t) * 0.4;
    group.rotation.x = Math.sin(t * 0.7) * 0.06;
    renderer.render(scene, camera);
  }
  frame();
})();

/* Лукбук: второе «кольцо» — как аксессуар в 3D */
(function () {
  var canvas = document.getElementById("lookbook-3d");
  if (!canvas || typeof THREE === "undefined") return;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
  camera.position.z = 3.2;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  var geo = new THREE.TorusGeometry(0.85, 0.06, 12, 48);
  var mat = new THREE.MeshStandardMaterial({
    color: 0x1a1520,
    emissive: 0xa855f7,
    emissiveIntensity: 0.55,
    metalness: 0.85,
    roughness: 0.2,
  });
  var ring = new THREE.Mesh(geo, mat);
  scene.add(ring);

  var wire = new THREE.Mesh(
    geo.clone(),
    new THREE.MeshBasicMaterial({
      color: 0x2ee6d6,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    })
  );
  wire.scale.setScalar(1.04);
  scene.add(wire);

  scene.add(new THREE.AmbientLight(0x404050, 0.5));
  var p1 = new THREE.PointLight(0x2ee6d6, 0.5, 10);
  p1.position.set(2, 2, 2);
  scene.add(p1);
  var p2 = new THREE.PointLight(0xff2d6a, 0.35, 10);
  p2.position.set(-2, -1, 2);
  scene.add(p2);

  function resize() {
    var wrap = canvas.parentElement;
    if (!wrap) return;
    var w = Math.max(1, wrap.clientWidth);
    var h = Math.max(1, wrap.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", resize);
  requestAnimationFrame(function () {
    resize();
    resize();
  });

  var t0 = performance.now();
  function tick(now) {
    requestAnimationFrame(tick);
    var t = (now - t0) * 0.001;
    ring.rotation.x = t * 0.9;
    ring.rotation.y = t * 0.55;
    wire.rotation.copy(ring.rotation);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(tick);
})();
