/**
 * Preloader, custom cursor, mobile nav, scroll reveal, Hero Three.js, Future Archive mini-scene.
 */
(function () {
  const preloader = document.getElementById("preloader");
  const preloaderFill = document.querySelector(".preloader__fill");
  const preloaderPct = document.querySelector(".preloader__pct");
  const cursor = document.getElementById("cursor");
  const cursorDot = document.getElementById("cursor-dot");
  const yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* --- Preloader (2–3s) --- */
  const PRELOADER_MS = 2600;
  let preloaderStart = performance.now();

  function tickPreloader(now) {
    const t = Math.min(1, (now - preloaderStart) / PRELOADER_MS);
    if (preloaderPct) preloaderPct.textContent = `${Math.floor(t * 100)}%`;
    if (t < 1) requestAnimationFrame(tickPreloader);
    else {
      if (preloader) preloader.classList.add("is-done");
      document.body.classList.add("is-loaded");
    }
  }
  requestAnimationFrame(tickPreloader);

  window.addEventListener("load", () => {
    preloaderStart = performance.now() - PRELOADER_MS * 0.85;
  });

  /* --- Custom cursor --- */
  const hoverSelectors =
    ".project-card, .btn, .nav a, .contact__link, .logo, input, textarea, .nav-toggle";
  let mx = 0;
  let my = 0;
  let cx = 0;
  let cy = 0;

  if (cursor && cursorDot && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursorDot.style.left = `${mx}px`;
      cursorDot.style.top = `${my}px`;
    });

    document.querySelectorAll(hoverSelectors).forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
    });

    function animateCursor() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.left = `${cx}px`;
      cursor.style.top = `${cy}px`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  /* --- Mobile nav --- */
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  navToggle &&
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

  document.querySelectorAll('.nav a[href^="#"]').forEach((a) => {
    a.addEventListener("click", () => {
      nav && nav.classList.remove("is-open");
      navToggle && navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* --- Scroll reveal --- */
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      });
    },
    { root: null, threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));

  /* --- Hero Three.js --- */
  const heroCanvas = document.getElementById("hero-canvas");
  if (heroCanvas && typeof THREE !== "undefined") {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0.2, 5);

    const renderer = new THREE.WebGLRenderer({
      canvas: heroCanvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geo = new THREE.TorusKnotGeometry(1, 0.28, 120, 16);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x111118,
      emissive: 0x2ee6d6,
      emissiveIntensity: 0.35,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: false,
    });
    const knot = new THREE.Mesh(geo, mat);
    scene.add(knot);

    const wire = new THREE.Mesh(
      geo.clone(),
      new THREE.MeshBasicMaterial({
        color: 0xff2d6a,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      })
    );
    wire.scale.setScalar(1.02);
    scene.add(wire);

    const light1 = new THREE.PointLight(0x2ee6d6, 1.2, 20);
    light1.position.set(3, 2, 4);
    scene.add(light1);
    const light2 = new THREE.PointLight(0xff2d6a, 0.9, 20);
    light2.position.set(-4, -1, 3);
    scene.add(light2);
    const amb = new THREE.AmbientLight(0xa855f7, 0.15);
    scene.add(amb);

    function resizeHero() {
      const rect = heroCanvas.parentElement.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    window.addEventListener("resize", resizeHero);
    requestAnimationFrame(() => {
      resizeHero();
      requestAnimationFrame(resizeHero);
    });

    let t0 = performance.now();
    function heroFrame(now) {
      const t = (now - t0) * 0.001;
      knot.rotation.x = t * 0.35;
      knot.rotation.y = t * 0.55;
      wire.rotation.copy(knot.rotation);
      knot.position.y = Math.sin(t * 0.8) * 0.08;
      wire.position.copy(knot.position);
      renderer.render(scene, camera);
      requestAnimationFrame(heroFrame);
    }
    requestAnimationFrame(heroFrame);
  }

  /* --- Future Archive: abstract “garment” (hood + torso) --- */
  const faCanvas = document.getElementById("future-archive-canvas");
  if (faCanvas && typeof THREE !== "undefined") {
    function faSize() {
      const w = Math.max(1, faCanvas.clientWidth || 320);
      const h = Math.max(1, faCanvas.clientHeight || 200);
      return { w, h };
    }
    let { w, h } = faSize();

    const sceneFA = new THREE.Scene();
    const camFA = new THREE.PerspectiveCamera(42, w / h, 0.1, 50);
    camFA.position.set(0, 0.4, 4.2);

    const rFA = new THREE.WebGLRenderer({
      canvas: faCanvas,
      alpha: true,
      antialias: true,
    });
    rFA.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rFA.setSize(w, h, false);
    rFA.setClearColor(0x000000, 0);

    const group = new THREE.Group();
    const fabric = new THREE.MeshStandardMaterial({
      color: 0x2a2a32,
      emissive: 0x6b21a8,
      emissiveIntensity: 0.25,
      metalness: 0.4,
      roughness: 0.45,
    });
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.45, 1.1, 32, 6, true), fabric);
    torso.position.y = -0.15;
    group.add(torso);

    const hood = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.12, 16, 48, Math.PI * 1.1), fabric);
    hood.rotation.x = Math.PI / 2;
    hood.rotation.z = -0.25;
    hood.position.set(0, 0.55, 0.1);
    group.add(hood);

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(0.44, 0.02, 8, 48),
      new THREE.MeshBasicMaterial({ color: 0x2ee6d6, transparent: true, opacity: 0.9 })
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.copy(hood.position);
    group.add(rim);

    sceneFA.add(group);

    const l1 = new THREE.DirectionalLight(0xffffff, 0.6);
    l1.position.set(2, 3, 4);
    sceneFA.add(l1);
    const l2 = new THREE.PointLight(0x2ee6d6, 0.5, 10);
    l2.position.set(-2, 1, 2);
    sceneFA.add(l2);
    sceneFA.add(new THREE.AmbientLight(0x404060, 0.35));

    let tFA = 0;
    function faFrame(now) {
      tFA += 0.012;
      group.rotation.y = Math.sin(tFA) * 0.35;
      group.rotation.x = Math.sin(tFA * 0.7) * 0.08;
      rFA.render(sceneFA, camFA);
      requestAnimationFrame(faFrame);
    }
    requestAnimationFrame(faFrame);

    window.addEventListener("resize", () => {
      const { w: nw, h: nh } = faSize();
      camFA.aspect = nw / nh;
      camFA.updateProjectionMatrix();
      rFA.setSize(nw, nh, false);
    });

    requestAnimationFrame(() => {
      const s = faSize();
      w = s.w;
      h = s.h;
      camFA.aspect = w / h;
      camFA.updateProjectionMatrix();
      rFA.setSize(w, h, false);
    });
  }
})();
