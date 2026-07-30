/* Минималистичная wireframe-сфера (икосаэдр) — контраст к светлому фону */
(function () {
  var canvas = document.getElementById("minima-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 3.2;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  var geo = new THREE.IcosahedronGeometry(1.05, 1);
  var mesh = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({
      color: 0x111111,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    })
  );
  scene.add(mesh);

  var inner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.55, 0),
    new THREE.MeshBasicMaterial({ color: 0x111111, wireframe: true, opacity: 0.2, transparent: true })
  );
  scene.add(inner);

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
    mesh.rotation.x = t * 0.2;
    mesh.rotation.y = t * 0.28;
    inner.rotation.x = -t * 0.15;
    inner.rotation.z = t * 0.22;
    renderer.render(scene, camera);
  }
  requestAnimationFrame(tick);
})();
