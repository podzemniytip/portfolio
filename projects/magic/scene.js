/* Three.js: кубик Рубика 3×3×3 — цвета только на внешних гранях */
(function () {
  var canvas = document.getElementById("magic-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(2.4, 2.1, 3.2);
  camera.lookAt(0, 0, 0);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  var darkMat = new THREE.MeshStandardMaterial({
    color: 0x1a1520,
    roughness: 0.85,
    metalness: 0.05,
  });
  var R = new THREE.MeshStandardMaterial({ color: 0xe53935, roughness: 0.45, metalness: 0.1 });
  var O = new THREE.MeshStandardMaterial({ color: 0xff9800, roughness: 0.45, metalness: 0.1 });
  var Y = new THREE.MeshStandardMaterial({ color: 0xffeb3b, roughness: 0.45, metalness: 0.1 });
  var G = new THREE.MeshStandardMaterial({ color: 0x43a047, roughness: 0.45, metalness: 0.1 });
  var B = new THREE.MeshStandardMaterial({ color: 0x1e88e5, roughness: 0.45, metalness: 0.1 });
  var W = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.35, metalness: 0.08 });

  function cubieMaterials(i, j, k) {
    var d = darkMat;
    return [
      i === 2 ? R : d,
      i === 0 ? O : d,
      j === 2 ? W : d,
      j === 0 ? Y : d,
      k === 2 ? G : d,
      k === 0 ? B : d,
    ];
  }

  var rubik = new THREE.Group();
  var s = 0.88;
  var step = 0.92;
  var geo = new THREE.BoxGeometry(s, s, s);

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      for (var k = 0; k < 3; k++) {
        var mesh = new THREE.Mesh(geo, cubieMaterials(i, j, k));
        mesh.position.set((i - 1) * step, (j - 1) * step, (k - 1) * step);
        rubik.add(mesh);
      }
    }
  }

  scene.add(rubik);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  var dLight = new THREE.DirectionalLight(0xfff5f5, 0.95);
  dLight.position.set(4, 6, 5);
  scene.add(dLight);
  var p = new THREE.PointLight(0xffbcd9, 0.35, 14);
  p.position.set(-3, 2, 2);
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
    rubik.rotation.x = t * 0.28 + Math.sin(t * 0.4) * 0.15;
    rubik.rotation.y = t * 0.42;
    rubik.position.y = Math.sin(t * 1.1) * 0.08;
    renderer.render(scene, camera);
  }
  requestAnimationFrame(tick);
})();
