/* Хаотичные коробки — пост-интернет, резкие углы */
(function () {
  var canvas = document.getElementById("meme-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(1.2, 1, 4);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  var group = new THREE.Group();
  var matA = new THREE.MeshStandardMaterial({ color: 0xf5f500, metalness: 0.2, roughness: 0.4 });
  var matB = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.5, roughness: 0.35 });
  var matC = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.5 });

  var b1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 0.6), matA);
  b1.position.set(0, 0, 0);
  var b2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.1, 0.5), matB);
  b2.position.set(-0.5, 0.4, 0.3);
  var b3 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.15), matC);
  b3.position.set(0.45, -0.15, 0.35);
  group.add(b1, b2, b3);
  scene.add(group);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  var d = new THREE.DirectionalLight(0xffffff, 0.95);
  d.position.set(3, 5, 2);
  scene.add(d);
  var p = new THREE.PointLight(0xff00aa, 0.6, 12);
  p.position.set(-2, 2, 3);
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
    group.rotation.x = t * 0.35;
    group.rotation.y = t * 0.55;
    group.rotation.z = Math.sin(t * 0.8) * 0.15;
    renderer.render(scene, camera);
  }
  requestAnimationFrame(tick);
})();
