/* Three.js: чашка с кофе + блюдце (не тор как на главной) */
(function () {
  var canvas = document.getElementById("neon-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
  camera.position.set(0.35, 0.35, 3.8);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  var cupGroup = new THREE.Group();

  var ceramic = new THREE.MeshStandardMaterial({
    color: 0x15151c,
    metalness: 0.45,
    roughness: 0.35,
    side: THREE.DoubleSide,
    emissive: 0x0d2522,
    emissiveIntensity: 0.2,
  });

  var body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.22, 0.44, 40, 1, true),
    ceramic
  );
  cupGroup.add(body);

  var bottom = new THREE.Mesh(new THREE.CircleGeometry(0.22, 40), ceramic);
  bottom.rotation.x = Math.PI / 2;
  bottom.position.y = -0.22;
  cupGroup.add(bottom);

  var coffeeMat = new THREE.MeshStandardMaterial({
    color: 0x1e0f0a,
    roughness: 0.92,
    emissive: 0x2a1510,
    emissiveIntensity: 0.08,
  });
  var coffee = new THREE.Mesh(new THREE.CircleGeometry(0.3, 40), coffeeMat);
  coffee.rotation.x = -Math.PI / 2;
  coffee.position.y = 0.2;
  cupGroup.add(coffee);

  var rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.33, 0.018, 8, 48),
    new THREE.MeshStandardMaterial({
      color: 0x1a1a24,
      emissive: 0x2ee6d6,
      emissiveIntensity: 0.35,
      metalness: 0.7,
      roughness: 0.25,
    })
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.2;
  cupGroup.add(rim);

  var handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.15, 0.032, 8, 24, Math.PI * 1.2),
    ceramic
  );
  handle.rotation.z = Math.PI / 2;
  handle.rotation.y = Math.PI / 2;
  handle.position.set(0.38, -0.02, 0);
  cupGroup.add(handle);

  var saucer = new THREE.Mesh(
    new THREE.CylinderGeometry(0.52, 0.44, 0.04, 40),
    new THREE.MeshStandardMaterial({
      color: 0x1e1e28,
      metalness: 0.55,
      roughness: 0.32,
      emissive: 0x1a0a14,
      emissiveIntensity: 0.05,
    })
  );
  saucer.position.y = -0.26;
  cupGroup.add(saucer);

  cupGroup.position.y = -0.05;
  scene.add(cupGroup);

  var p1 = new THREE.PointLight(0x2ee6d6, 1, 16, 2);
  p1.position.set(2.5, 2, 3);
  scene.add(p1);
  var p2 = new THREE.PointLight(0xff2d6a, 0.65, 14, 2);
  p2.position.set(-2.5, 0.5, 2.5);
  scene.add(p2);
  scene.add(new THREE.AmbientLight(0x6040a0, 0.18));

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
    cupGroup.rotation.y = t * 0.35;
    cupGroup.rotation.x = Math.sin(t * 0.5) * 0.08;
    cupGroup.position.y = -0.05 + Math.sin(t * 0.9) * 0.04;
    renderer.render(scene, camera);
  }
  requestAnimationFrame(tick);
})();
