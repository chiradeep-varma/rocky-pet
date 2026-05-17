(function () {
  'use strict';

  // ── Spritesheet config (injected by host) ────────────────────────────────
  const SHEET_URL = window.ROCKY_SHEET;
  const FRAME_W   = window.FRAME_W;
  const FRAME_H   = window.FRAME_H;
  const ANIM_ROWS = window.ANIM_ROWS;
  const COLS      = window.SHEET_COLS;
  const LINES     = Array.isArray(window.ROCKY_LINES) ? window.ROCKY_LINES : [];

  // ── Adaptive display scale ───────────────────────────────────────────────
  function computeScale() {
    const stageEl = document.getElementById('stage') || document.body;
    const panelH = stageEl.offsetHeight || 200;
    const target = Math.min(140, Math.max(72, panelH * 0.65));
    return target / FRAME_H;
  }
  let DISPLAY_SCALE = computeScale();
  let DSP = Math.round(FRAME_H * DISPLAY_SCALE); // square sprite (W == H)

  // ── Animation definitions ────────────────────────────────────────────────
  const ANIMS = {
    idle:  { row: ANIM_ROWS.idle,  frames: COLS, fps: 8  },
    run:   { row: ANIM_ROWS.run,   frames: COLS, fps: 16 },
    sleep: { row: ANIM_ROWS.sleep, frames: COLS, fps: 4  },
    react: { row: ANIM_ROWS.react, frames: COLS, fps: 14 },
  };

  // ── Motion constants ─────────────────────────────────────────────────────
  const WALK_SPEED = 110;
  const RUN_SPEED  = 220;
  const ACCEL      = 9; // velocity ease factor (per second)
  const MARGIN     = 4; // gap from edge

  // ── State ────────────────────────────────────────────────────────────────
  // Rocky lives on the perimeter. Surfaces, in clockwise order:
  //   'floor' → 'rightWall' → 'ceiling' → 'leftWall' → 'floor' …
  // `along` advances clockwise; transitions wrap automatically at corners.
  let surface       = 'floor';
  let along         = 80;      // position along the current surface
  let alongVel      = 0;
  let targetVel     = 0;
  let facingForward = true;    // true = moving in +along (clockwise)

  let currentAnim   = 'idle';
  let frame         = 0;
  let frameTimerMs  = 0;
  let lastTimeMs    = 0;

  // Mood
  let mood           = 'idle'; // 'idle' | 'roam' | 'sleep' | 'excited'
  let moodUntilMs    = 0;
  let nextDecisionMs = 0;

  // Dialogue
  let dialogueTimer = null;
  let typingTimer   = null;
  let nextSpeakMs   = 0;
  let speaking      = false;

  // ── DOM ──────────────────────────────────────────────────────────────────
  const stage      = document.getElementById('stage');
  const canvas     = document.getElementById('rocky-canvas');
  const ctx        = canvas.getContext('2d');
  const dialogueEl = document.getElementById('dialogue');
  const dText      = document.getElementById('d-text');

  const sheet = new Image();
  sheet.src = SHEET_URL;

  // ── Surface geometry ─────────────────────────────────────────────────────
  // For each surface returns:
  //   length: how far Rocky can travel along it
  //   pos(along): top-left (x, y) where the (rotated) sprite draws
  //   rot: rotation in radians applied around sprite center
  function surfaceLength(s) {
    if (s === 'floor' || s === 'ceiling') { return Math.max(0, canvas.width  - DSP); }
    return Math.max(0, canvas.height - DSP);
  }

  function surfaceRotation(s) {
    switch (s) {
      case 'floor':     return 0;
      case 'rightWall': return -Math.PI / 2;  // walking up the right wall
      case 'ceiling':   return Math.PI;       // upside down
      case 'leftWall':  return Math.PI / 2;   // walking down the left wall
    }
    return 0;
  }

  // Top-left (x, y) of the sprite for a given surface + along value.
  // Sprite footprint is DSP × DSP (square), rotated around center.
  function surfacePos(s, a) {
    const W = canvas.width, H = canvas.height;
    switch (s) {
      case 'floor':     return { x: a,                     y: H - DSP - MARGIN };
      case 'rightWall': return { x: W - DSP - MARGIN,      y: (H - DSP) - a    };
      case 'ceiling':   return { x: (W - DSP) - a,         y: MARGIN           };
      case 'leftWall':  return { x: MARGIN,                y: a                };
    }
    return { x: 0, y: 0 };
  }

  function nextSurfaceClockwise(s) {
    return s === 'floor' ? 'rightWall'
         : s === 'rightWall' ? 'ceiling'
         : s === 'ceiling' ? 'leftWall'
         : 'floor';
  }
  function prevSurfaceClockwise(s) {
    return s === 'floor' ? 'leftWall'
         : s === 'leftWall' ? 'ceiling'
         : s === 'ceiling' ? 'rightWall'
         : 'floor';
  }

  // ── Sizing ───────────────────────────────────────────────────────────────
  function recomputeSize() {
    DISPLAY_SCALE = computeScale();
    DSP = Math.round(FRAME_H * DISPLAY_SCALE);
  }

  function resizeCanvas() {
    canvas.width  = stage.offsetWidth;
    canvas.height = stage.offsetHeight;
    ctx.imageSmoothingEnabled = false;
    recomputeSize();
    // Clamp `along` after resize
    along = Math.max(0, Math.min(along, surfaceLength(surface)));
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function setAnim(name) {
    if (!(name in ANIMS)) { name = 'idle'; }
    if (currentAnim === name) { return; }
    currentAnim = name;
    frame = 0;
    frameTimerMs = 0;
  }

  // ── Autonomous behavior ──────────────────────────────────────────────────
  function pickAction(now) {
    if (mood === 'sleep' || mood === 'excited') {
      if (now < moodUntilMs) { return; }
      mood = 'idle';
    }

    const r = Math.random();

    if (r < 0.40) {
      // Stroll along surface (either direction)
      targetVel = (Math.random() < 0.5 ? -1 : 1) * WALK_SPEED;
      mood = 'roam';
      nextDecisionMs = now + 2500 + Math.random() * 3500;
    } else if (r < 0.65) {
      // Sprint along surface
      targetVel = (Math.random() < 0.5 ? -1 : 1) * RUN_SPEED;
      mood = 'roam';
      nextDecisionMs = now + 1500 + Math.random() * 2500;
    } else if (r < 0.82) {
      // Stand still
      targetVel = 0;
      mood = 'idle';
      nextDecisionMs = now + 1500 + Math.random() * 3000;
    } else if (r < 0.93) {
      // Excited
      targetVel = 0;
      mood = 'excited';
      moodUntilMs = now + 1800 + Math.random() * 1200;
      nextDecisionMs = moodUntilMs + 400;
      setAnim('react');
    } else {
      // Nap
      targetVel = 0;
      mood = 'sleep';
      moodUntilMs = now + 8000 + Math.random() * 6000;
      nextDecisionMs = moodUntilMs + 400;
      setAnim('sleep');
    }
  }

  // ── Physics step ─────────────────────────────────────────────────────────
  function step(dtSec, nowMs) {
    if (nowMs >= nextDecisionMs) { pickAction(nowMs); }

    const k = 1 - Math.exp(-ACCEL * dtSec);
    alongVel += (targetVel - alongVel) * k;
    along    += alongVel * dtSec;

    // Wrap around the perimeter at corners
    let len = surfaceLength(surface);
    while (along > len) {
      along -= len;
      surface = nextSurfaceClockwise(surface);
      len = surfaceLength(surface);
    }
    while (along < 0) {
      surface = prevSurfaceClockwise(surface);
      len = surfaceLength(surface);
      along += len;
    }

    // Facing direction
    if (Math.abs(alongVel) > 2) { facingForward = alongVel > 0; }

    // Animation selection — locked moods own the anim
    if (mood === 'sleep')        { setAnim('sleep'); }
    else if (mood === 'excited') { setAnim('react'); }
    else if (Math.abs(alongVel) > 8) { setAnim('run'); }
    else                         { setAnim('idle'); }
  }

  function updateFrame(dtMs) {
    const anim = ANIMS[currentAnim];
    frameTimerMs += dtMs;
    const frameDurationMs = 1000 / anim.fps;
    if (frameTimerMs >= frameDurationMs) {
      frameTimerMs -= frameDurationMs;
      frame = (frame + 1) % anim.frames;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!sheet.complete || sheet.naturalWidth === 0) { return; }

    const anim = ANIMS[currentAnim];
    const srcX = frame * FRAME_W;
    const srcY = anim.row * FRAME_H;

    const { x, y } = surfacePos(surface, along);
    const rot = surfaceRotation(surface);
    const cx = x + DSP / 2;
    const cy = y + DSP / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    // Flip horizontally when moving "backwards" along the surface
    if (!facingForward) { ctx.scale(-1, 1); }
    ctx.drawImage(sheet, srcX, srcY, FRAME_W, FRAME_H, -DSP / 2, -DSP / 2, DSP, DSP);
    ctx.restore();
  }

  // ── Dialogue ─────────────────────────────────────────────────────────────
  function showDialogue(text, particleEffect) {
    if (dialogueTimer) { clearTimeout(dialogueTimer); dialogueTimer = null; }
    if (typingTimer)   { clearTimeout(typingTimer);   typingTimer   = null; }

    speaking = true;

    // Anchor bubble above/below/beside Rocky depending on which surface he's on,
    // then clamp so it never escapes the viewport.
    const { x, y } = surfacePos(surface, along);
    const cx = x + DSP / 2; // Rocky's center x
    const cy = y + DSP / 2; // Rocky's center y

    const BUBBLE_W   = 188; // max-width + borders
    const GAP        = 10;  // gap between Rocky and bubble edge
    const EDGE_PAD   = 4;   // min distance from viewport edge

    // Reset tail classes
    dialogueEl.classList.remove('tail-down', 'tail-up', 'tail-right', 'tail-left');

    let left, top;
    if (surface === 'floor') {
      // Above Rocky, tail points down
      dialogueEl.classList.add('tail-down');
      left = cx - BUBBLE_W / 2;
      top  = y - GAP; // will be nudged after height measurement
      dialogueEl.style.display = 'block';
      dialogueEl.style.left = `${Math.max(EDGE_PAD, Math.min(canvas.width - BUBBLE_W - EDGE_PAD, left))}px`;
      dialogueEl.style.top  = '';
      dialogueEl.style.bottom = `${Math.max(EDGE_PAD, canvas.height - y + GAP)}px`;
    } else if (surface === 'ceiling') {
      // Below Rocky (he's upside-down), tail points up
      dialogueEl.classList.add('tail-up');
      left = cx - BUBBLE_W / 2;
      dialogueEl.style.display = 'block';
      dialogueEl.style.left   = `${Math.max(EDGE_PAD, Math.min(canvas.width - BUBBLE_W - EDGE_PAD, left))}px`;
      dialogueEl.style.bottom = '';
      dialogueEl.style.top    = `${Math.max(EDGE_PAD, y + DSP + GAP)}px`;
    } else if (surface === 'leftWall') {
      // To the right of Rocky, tail points left
      dialogueEl.classList.add('tail-left');
      dialogueEl.style.display = 'block';
      dialogueEl.style.left   = `${Math.max(EDGE_PAD, x + DSP + GAP)}px`;
      dialogueEl.style.bottom = '';
      dialogueEl.style.top    = `${Math.max(EDGE_PAD, Math.min(canvas.height - 80, cy - 30))}px`;
    } else {
      // rightWall — to the left of Rocky, tail points right
      dialogueEl.classList.add('tail-right');
      dialogueEl.style.display = 'block';
      dialogueEl.style.left   = `${Math.max(EDGE_PAD, x - BUBBLE_W - GAP)}px`;
      dialogueEl.style.bottom = '';
      dialogueEl.style.top    = `${Math.max(EDGE_PAD, Math.min(canvas.height - 80, cy - 30))}px`;
    }
    requestAnimationFrame(() => { dialogueEl.classList.add('visible'); });

    dText.textContent = '';
    typeText(text, dText, 28, () => {
      dialogueTimer = setTimeout(hideDialogue, 4000);
    });

    if (particleEffect === 'sparkles') { spawnSparkles(); }
    if (particleEffect === 'zzz')      { spawnZzz(); }
  }

  function hideDialogue() {
    dialogueEl.classList.remove('visible');
    setTimeout(() => {
      dialogueEl.style.display = 'none';
      dText.textContent = '';
    }, 200);
    dialogueTimer = null;
    speaking = false;
  }

  function typeText(text, el, msPerChar, onDone) {
    let i = 0;
    function tick() {
      if (i < text.length) {
        el.textContent += text[i++];
        typingTimer = setTimeout(tick, msPerChar);
      } else if (onDone) {
        typingTimer = null;
        onDone();
      }
    }
    tick();
  }

  function pickLine() {
    if (!LINES.length) { return null; }
    return LINES[Math.floor(Math.random() * LINES.length)];
  }

  // Random interval: 1 second – 3 minutes
  function scheduleNextSpeak(now) {
    nextSpeakMs = now + 1000 + Math.random() * 179000;
  }

  function maybeSpeak(now) {
    if (now < nextSpeakMs) { return; }
    if (speaking) { return; }

    const line = pickLine();
    if (!line) { scheduleNextSpeak(now); return; }

    const map = { celebrate: 'react', panic: 'react', inspect: 'idle', walk: 'run' };
    const mapped = map[line.animation] || line.animation || 'idle';

    if (mapped === 'sleep') {
      mood = 'sleep';
      moodUntilMs = now + 5500;
      targetVel = 0;
      nextDecisionMs = moodUntilMs + 400;
    } else if (mapped === 'react') {
      mood = 'excited';
      moodUntilMs = now + 3000;
      targetVel = 0;
      nextDecisionMs = moodUntilMs + 400;
    }

    showDialogue(line.text || '', line.particleEffect || null);
    scheduleNextSpeak(now);
  }

  // ── Particles (anchored to Rocky's current world pos) ────────────────────
  function spawnSparkles() {
    const { x, y } = surfacePos(surface, along);
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const p = document.createElement('div');
        p.className = 'sparkle';
        const angle = Math.random() * Math.PI * 2;
        const dist  = 20 + Math.random() * 40;
        p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
        p.style.setProperty('--dy', `${Math.sin(angle) * dist - 20}px`);
        p.style.left = `${x + DSP * 0.3 + Math.random() * DSP * 0.4}px`;
        p.style.top  = `${y + Math.random() * DSP * 0.5}px`;
        p.style.animationDelay = `${i * 0.1}s`;
        stage.appendChild(p);
        setTimeout(() => p.remove(), 1200);
      }, i * 80);
    }
  }

  function spawnZzz() {
    const { x, y } = surfacePos(surface, along);
    ['z', 'zz', 'zzz'].forEach((txt, i) => {
      setTimeout(() => {
        const p = document.createElement('div');
        p.className = 'zzz';
        p.textContent = txt;
        p.style.fontSize = `${9 + i * 3}px`;
        p.style.left = `${x + DSP * 0.5 + i * 8}px`;
        p.style.top  = `${y - 5 - i * 10}px`;
        p.style.animationDelay = `${i * 0.4}s`;
        stage.appendChild(p);
        setTimeout(() => p.remove(), 2500);
      }, i * 300);
    });
  }

  // ── Main loop ────────────────────────────────────────────────────────────
  function loop(timestamp) {
    const dtMs = Math.min(timestamp - lastTimeMs, 64);
    const dtSec = dtMs / 1000;
    lastTimeMs = timestamp;

    step(dtSec, timestamp);
    updateFrame(dtMs);
    draw();
    maybeSpeak(timestamp);

    requestAnimationFrame(loop);
  }

  // ── Init ─────────────────────────────────────────────────────────────────
  sheet.onload = function () {
    nextDecisionMs = performance.now() + 600;
    scheduleNextSpeak(performance.now());
    requestAnimationFrame(function (ts) {
      lastTimeMs = ts;
      requestAnimationFrame(loop);
    });
  };

  sheet.onerror = function () {
    console.error('Rocky: failed to load spritesheet', SHEET_URL);
  };

})();
