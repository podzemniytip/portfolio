/* Органический «кристалл» — спокойное вращение, зелёное свечение */
(function () {
  var canvas = document.getElementById("prana-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
  camera.position.set(0, 0.1, 3.6);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  var geo = new THREE.IcosahedronGeometry(1, 1);
  var mat = new THREE.MeshStandardMaterial({
    color: 0x1a3d2e,
    emissive: 0x4a7c59,
    emissiveIntensity: 0.35,
    metalness: 0.25,
    roughness: 0.65,
    flatShading: true,
  });
  var mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  scene.add(new THREE.AmbientLight(0xc8e6c9, 0.35));
  var d = new THREE.DirectionalLight(0xe8f5e9, 0.55);
  d.position.set(2, 4, 3);
  scene.add(d);
  var p = new THREE.PointLight(0xa5d6a7, 0.5, 12);
  p.position.set(-2, 0, 2);
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
    mesh.rotation.x = t * 0.12;
    mesh.rotation.y = t * 0.2;
    mesh.position.y = Math.sin(t * 0.7) * 0.06;
    renderer.render(scene, camera);
  }
  requestAnimationFrame(tick);
})();
