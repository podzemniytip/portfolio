/**
 * Lane Runner — canvas endless runner, neon aesthetic aligned with site tokens.
 */
(function () {
  const canvas = document.getElementById("game-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score-val");
  const gameOverEl = document.getElementById("game-over");
  const finalScoreEl = document.getElementById("final-score");
  const restartBtn = document.getElementById("restart-btn");

  const COLORS = {
    bg: "#08080c",
    grid: "rgba(46, 230, 214, 0.12)",
    gridBright: "rgba(46, 230, 214, 0.22)",
    player: "#2ee6d6",
    playerGlow: "rgba(46, 230, 214, 0.45)",
    obstacle: "#ff2d6a",
    obstacleGlow: "rgba(255, 45, 106, 0.4)",
    accent: "#a855f7",
    floor: "#0e0e14",
  };

  let W = 900;
  let H = 360;
  let scale = 1;

  let playing = false;
  let gameOver = false;
  let score = 0;
  let speed = 5;
  let frameId = null;
  let lastTs = 0;

  const groundY = () => H * 0.72;

  const player = {
    x: 120,
    y: 0,
    w: 36,
    h: 44,
    vy: 0,
    onGround: true,
    jumpPower: -13,
    gravity: 0.55,
  };

  let obstacles = [];
  let obstacleTimer = 0;
  let horizonOffset = 0;

  function resize() {
    const parent = canvas.parentElement;
    const maxW = parent ? parent.clientWidth : 900;
    W = Math.min(900, Math.floor(maxW));
    H = Math.floor(W * 0.4);
    scale = W / 900;
    canvas.width = W;
    canvas.height = H;
    player.x = 100 * scale;
    player.w = 36 * scale;
    player.h = 44 * scale;
    player.jumpPower = -13 * Math.sqrt(scale);
    player.gravity = 0.55 * scale;
  }

  function reset() {
    playing = true;
    gameOver = false;
    score = 0;
    speed = 5 * scale;
    obstacles = [];
    obstacleTimer = 0;
    horizonOffset = 0;
    player.y = groundY() - player.h;
    player.vy = 0;
    player.onGround = true;
    if (scoreEl) scoreEl.textContent = "0";
    if (gameOverEl) gameOverEl.hidden = true;
    lastTs = performance.now();
    if (frameId) cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(loop);
  }

  function spawnObstacle() {
    const h = (28 + Math.random() * 32) * scale;
    const w = (22 + Math.random() * 18) * scale;
    obstacles.push({
      x: W + 20,
      y: groundY() - h,
      w,
      h,
    });
  }

  function drawBackground(ts) {
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, W, H);

    const gy = groundY();
    horizonOffset = (horizonOffset + speed * 0.35) % 40;

    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    for (let x = -horizonOffset; x < W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, gy);
      ctx.lineTo(x + (H - gy) * 0.9, H);
      ctx.stroke();
    }

    ctx.fillStyle = COLORS.floor;
    ctx.fillRect(0, gy, W, H - gy);

    ctx.strokeStyle = COLORS.gridBright;
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(W, gy);
    ctx.stroke();

    const pulse = 0.5 + 0.5 * Math.sin(ts * 0.003);
    ctx.fillStyle = `rgba(168, 85, 247, ${0.03 + pulse * 0.04})`;
    ctx.fillRect(0, 0, W, gy);
  }

  function drawNeonRect(x, y, w, h, fill, glow) {
    ctx.shadowColor = glow;
    ctx.shadowBlur = 18 * scale;
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, w, h);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = fill;
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
  }

  function drawPlayer() {
    const { x, y, w, h } = player;
    drawNeonRect(x, y, w, h, COLORS.player, COLORS.playerGlow);
    ctx.fillStyle = COLORS.accent;
    ctx.fillRect(x + w * 0.2, y + h * 0.25, w * 0.35, 4 * scale);
  }

  function drawObstacles() {
    for (const o of obstacles) {
      drawNeonRect(o.x, o.y, o.w, o.h, COLORS.obstacle, COLORS.obstacleGlow);
    }
  }

  function aabb(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
  }

  function loop(ts) {
    const dt = Math.min(32, ts - lastTs);
    lastTs = ts;

    drawBackground(ts);

    if (playing && !gameOver) {
      score += dt * 0.02;
      speed += dt * 0.00001;
      if (scoreEl) scoreEl.textContent = Math.floor(score).toString();

      player.vy += player.gravity;
      player.y += player.vy;
      const g = groundY();
      if (player.y + player.h >= g) {
        player.y = g - player.h;
        player.vy = 0;
        player.onGround = true;
      } else {
        player.onGround = false;
      }

      obstacleTimer -= dt;
      if (obstacleTimer <= 0) {
        spawnObstacle();
        obstacleTimer = 1200 + Math.random() * 900 - speed * 8;
        obstacleTimer = Math.max(450, obstacleTimer);
      }

      for (const o of obstacles) {
        o.x -= speed * (dt / 16);
      }
      obstacles = obstacles.filter((o) => o.x + o.w > -20);

      for (const o of obstacles) {
        if (aabb(player.x, player.y, player.w, player.h, o.x, o.y, o.w, o.h)) {
          gameOver = true;
          playing = false;
          if (finalScoreEl) finalScoreEl.textContent = Math.floor(score).toString();
          if (gameOverEl) gameOverEl.hidden = false;
        }
      }
    }

    drawObstacles();
    drawPlayer();

    if (playing || !gameOver) {
      frameId = requestAnimationFrame(loop);
    }
  }

  function jump() {
    if (gameOver) return;
    if (!playing) {
      reset();
      return;
    }
    if (player.onGround) {
      player.vy = player.jumpPower;
      player.onGround = false;
    }
  }

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      jump();
    }
  });

  canvas.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    jump();
  });

  restartBtn && restartBtn.addEventListener("click", () => reset());

  window.addEventListener("resize", () => {
    resize();
  });

  resize();
  reset();
})();
