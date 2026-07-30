/* Металлический тор — «деталь в узле» */
(function () {
  var canvas = document.getElementById("mechanic-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
  camera.position.set(0.3, 0.4, 3.8);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  var geo = new THREE.TorusGeometry(0.9, 0.28, 20, 48);
  var mat = new THREE.MeshStandardMaterial({
    color: 0x6a7078,
    metalness: 0.92,
    roughness: 0.28,
    emissive: 0x1a2a30,
    emissiveIntensity: 0.15,
  });
  var torus = new THREE.Mesh(geo, mat);
  scene.add(torus);

  scene.add(new THREE.AmbientLight(0x8899aa, 0.25));
  var d = new THREE.DirectionalLight(0xffffff, 0.85);
  d.position.set(4, 6, 3);
  scene.add(d);
  var p = new THREE.PointLight(0x2ee6d6, 0.45, 14);
  p.position.set(-2, 1, 2);
  scene.add(p);

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
    torus.rotation.x = t * 0.4;
    torus.rotation.y = t * 0.25;
    renderer.render(scene, camera);
  }
  requestAnimationFrame(tick);
})();
