"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ------------------------------------------------------------------ */
/*  Backend-themed hero: a floating 3D code editor that types real     */
/*  Express / JWT / Mongo code, a server terminal streaming API logs,  */
/*  and a database stack with request packets flying between them.     */
/* ------------------------------------------------------------------ */

const ACID = "#C8F560";
const IRIS = "#7B61FF";

const SNIPPETS = [
  {
    file: "routes/auth.js",
    lines: [
      'const express = require("express");',
      'const jwt = require("jsonwebtoken");',
      "",
      "// secure by default",
      "app.use(helmet());",
      "app.use(rateLimit({ max: 100 }));",
      "",
      'app.post("/api/login", async (req, res) => {',
      "  const user = await User.findOne({ email });",
      "  const ok = await bcrypt.compare(pw, user.hash);",
      "  if (!ok) return res.status(401).end();",
      "",
      "  const token = jwt.sign({ id: user._id }, KEY);",
      "  res.json({ token });",
      "});",
    ],
  },
  {
    file: "models/complaint.js",
    lines: [
      "const complaintSchema = new Schema({",
      "  title: { type: String, required: true },",
      '  status: { type: String, default: "open" },',
      '  resident: { type: ObjectId, ref: "User" },',
      "});",
      "",
      'router.get("/complaints", auth, async (req, res) => {',
      "  const list = await Complaint.find({",
      "    resident: req.user.id,",
      "  });",
      "  res.json(list);",
      "});",
    ],
  },
];

const LOGS: [string, string, string, string][] = [
  ["POST", "/api/auth/login", "200", "14ms"],
  ["GET", "/api/complaints", "200", "9ms"],
  ["POST", "/api/visitors", "201", "18ms"],
  ["GET", "/api/bills", "200", "11ms"],
  ["POST", "/api/auth/login", "401", "5ms"],
  ["POST", "/api/expenses", "201", "16ms"],
  ["GET", "/api/settle", "200", "7ms"],
];

/* ---- tiny syntax highlighter ---- */
const TOKEN =
  /(\/\/.*$|"[^"]*"|'[^']*'|`[^`]*`|\b(?:const|let|await|async|return|if|else|new|throw)\b|\b[A-Za-z_]\w*(?=\()|\b\d+\b|\s+|.)/g;
const KEYWORD = /^(const|let|await|async|return|if|else|new|throw)$/;

function tokenColor(t: string, next: string) {
  if (t.startsWith("//")) return "#5d5d70";
  if (/^["'`]/.test(t)) return ACID;
  if (KEYWORD.test(t)) return "#A594FF";
  if (/^\d+$/.test(t)) return "#FFA66B";
  if (/^[A-Za-z_]\w*$/.test(t) && next === "(") return "#6EE7F9";
  return "#E6E5DE";
}

const FONT = '24px ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';

function drawEditor(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  snip: (typeof SNIPPETS)[number],
  typed: number,
  cursorOn: boolean
) {
  ctx.fillStyle = "#0c0c11";
  ctx.fillRect(0, 0, W, H);

  // title bar
  ctx.fillStyle = "#14141b";
  ctx.fillRect(0, 0, W, 58);
  ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(34 + i * 30, 29, 8, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = "#1c1c26";
  ctx.fillRect(150, 14, 250, 44);
  ctx.fillStyle = ACID;
  ctx.fillRect(150, 55, 250, 3);
  ctx.font = '20px ui-monospace, Menlo, Consolas, monospace';
  ctx.fillStyle = "#cfcfd8";
  ctx.textBaseline = "middle";
  ctx.fillText(snip.file, 168, 36);
  ctx.fillStyle = "#4a4a5a";
  ctx.fillText("● node 20", W - 160, 30);

  // code
  ctx.font = FONT;
  ctx.textBaseline = "alphabetic";
  const lineH = 36;
  const top = 58 + 40;
  const left = 78;
  const charW = ctx.measureText("M").width;

  let remaining = typed;
  let cx = left;
  let cy = top;
  for (let li = 0; li < snip.lines.length; li++) {
    const y = top + li * lineH;
    ctx.fillStyle = "#3a3a48";
    ctx.textAlign = "right";
    ctx.fillText(String(li + 1), 56, y);
    ctx.textAlign = "left";

    const line = snip.lines[li];
    if (remaining <= 0) {
      cx = left;
      cy = y;
      break;
    }
    const toks = line.match(TOKEN) ?? [];
    let x = left;
    let used = 0;
    for (let k = 0; k < toks.length; k++) {
      if (used >= remaining) break;
      const part = toks[k].slice(0, remaining - used);
      ctx.fillStyle = tokenColor(toks[k], toks[k + 1] ?? "");
      ctx.fillText(part, x, y);
      x += part.length * charW;
      used += part.length;
    }
    cx = x;
    cy = y;
    remaining -= line.length + 1; // +1 for the newline
    if (remaining < 0) break;
  }

  if (cursorOn) {
    ctx.fillStyle = ACID;
    ctx.fillRect(cx + 2, cy - 22, 12, 28);
  }

  // status bar
  ctx.fillStyle = "#14141b";
  ctx.fillRect(0, H - 34, W, 34);
  ctx.font = '16px ui-monospace, Menlo, Consolas, monospace';
  ctx.fillStyle = ACID;
  ctx.fillText("● main", 20, H - 12);
  ctx.fillStyle = "#6b6b7c";
  ctx.fillText("JavaScript · UTF-8 · Ln " + Math.max(1, Math.min(snip.lines.length, 1 + Math.floor(typed / 30))), W - 300, H - 12);
}

function drawTerminal(ctx: CanvasRenderingContext2D, W: number, H: number, logs: string[][], blink: boolean) {
  ctx.fillStyle = "#08080c";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#14141b";
  ctx.fillRect(0, 0, W, 44);
  ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(26 + i * 24, 22, 6, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.font = '16px ui-monospace, Menlo, Consolas, monospace';
  ctx.fillStyle = "#6b6b7c";
  ctx.fillText("api-server — node", 120, 28);

  ctx.font = '19px ui-monospace, "SF Mono", Menlo, Consolas, monospace';
  let y = 78;
  const line = (parts: [string, string][]) => {
    let x = 22;
    for (const [txt, col] of parts) {
      ctx.fillStyle = col;
      ctx.fillText(txt, x, y);
      x += ctx.measureText(txt).width;
    }
    y += 27;
  };
  line([["$ ", ACID], ["node server.js", "#E6E5DE"]]);
  line([["✓ ", ACID], ["MongoDB connected", "#9a9aac"]]);
  line([["✓ ", ACID], ["Listening on :5000", "#9a9aac"]]);
  for (const [m, p, s, ms] of logs) {
    line([
      [m.padEnd(5), m === "GET" ? "#6EE7F9" : "#A594FF"],
      [p.padEnd(17), "#E6E5DE"],
      [s + " ", s === "401" ? "#FFA66B" : ACID],
      [ms, "#6b6b7c"],
    ]);
  }
  if (blink) {
    ctx.fillStyle = ACID;
    ctx.fillRect(22, y - 17, 10, 20);
  }
}

function makePanel(
  w: number,
  h: number,
  px: number,
  py: number,
  anisotropy: number
) {
  const canvas = document.createElement("canvas");
  canvas.width = px;
  canvas.height = py;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = anisotropy;
  tex.minFilter = THREE.LinearFilter;

  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.08, h + 0.08, 0.06),
    new THREE.MeshBasicMaterial({ color: 0x0c0c11 })
  );
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })
  );
  screen.position.z = 0.032;
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(body.geometry),
    new THREE.LineBasicMaterial({ color: ACID, transparent: true, opacity: 0.55 })
  );
  group.add(body, screen, edges);
  return { group, canvas, ctx: canvas.getContext("2d")!, tex, body, screen, edges };
}

// layout constants: desktop (right side) / mobile (small, tucked at the top)
const D_X = 2.3, D_S = 0.74, M_Y = 2.2, M_S = 0.4;

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    gsap.registerPlugin(ScrollTrigger);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // WebGL unavailable — hero still works without the 3D layer
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmall = () => mount.clientWidth < 900;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.z = 7;

    const group = new THREE.Group();
    scene.add(group);
    const aniso = renderer.capabilities.getMaxAnisotropy();
    const disposables: { dispose: () => void }[] = [];

    /* ---- code editor ---- */
    const editor = makePanel(4.0, 2.5, 1024, 640, aniso);
    editor.group.position.set(0, 0.55, 0);
    group.add(editor.group);

    /* ---- terminal ---- */
    const term = makePanel(2.5, 1.45, 640, 372, aniso);
    term.group.position.set(-0.75, -1.65, 0.85);
    term.group.rotation.y = 0.12;
    group.add(term.group);

    /* ---- database stack ---- */
    const db = new THREE.Group();
    const discMat = new THREE.MeshBasicMaterial({ color: 0x14141b, transparent: true, opacity: 0.92 });
    for (let i = 0; i < 3; i++) {
      const g = new THREE.CylinderGeometry(0.52, 0.52, 0.2, 40);
      const m = new THREE.Mesh(g, discMat);
      m.position.y = i * 0.27;
      const e = new THREE.LineSegments(
        new THREE.EdgesGeometry(g, 20),
        new THREE.LineBasicMaterial({ color: ACID, transparent: true, opacity: 0.8 })
      );
      e.position.copy(m.position);
      // little status lights
      const led = new THREE.Mesh(
        new THREE.SphereGeometry(0.028, 12, 12),
        new THREE.MeshBasicMaterial({ color: i === 1 ? IRIS : ACID })
      );
      led.position.set(0.36, i * 0.27, 0.36);
      db.add(m, e, led);
      disposables.push(g, e.geometry, led.geometry, led.material as THREE.Material, e.material as THREE.Material);
    }
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.7, 0.009, 8, 80),
      new THREE.MeshBasicMaterial({ color: IRIS, transparent: true, opacity: 0.75 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.95;
    db.add(ring);
    disposables.push(discMat, ring.geometry, ring.material as THREE.Material);
    db.position.set(1.55, -1.95, 0.8);
    group.add(db);

    /* ---- request flows: terminal → editor/API → db → terminal ---- */
    const curves = [
      new THREE.QuadraticBezierCurve3(new THREE.Vector3(-0.2, -1.2, 0.85), new THREE.Vector3(-1.6, -0.3, 0.7), new THREE.Vector3(-1.0, 0.45, 0.1)),
      new THREE.QuadraticBezierCurve3(new THREE.Vector3(2.0, 0.3, 0.05), new THREE.Vector3(2.45, -0.5, 0.6), new THREE.Vector3(1.6, -1.35, 0.8)),
      new THREE.QuadraticBezierCurve3(new THREE.Vector3(1.2, -1.95, 0.8), new THREE.Vector3(0.4, -2.45, 1.1), new THREE.Vector3(0.45, -1.85, 0.9)),
    ];
    const packetMat = new THREE.MeshBasicMaterial({ color: ACID });
    const packetGeo = new THREE.SphereGeometry(0.03, 12, 12);
    disposables.push(packetMat, packetGeo);
    const packets: { mesh: THREE.Mesh; curve: number; off: number }[] = [];
    curves.forEach((c, ci) => {
      const lineGeo = new THREE.BufferGeometry().setFromPoints(c.getPoints(40));
      const lineMat = new THREE.LineBasicMaterial({ color: IRIS, transparent: true, opacity: 0.4 });
      group.add(new THREE.Line(lineGeo, lineMat));
      disposables.push(lineGeo, lineMat);
      for (let k = 0; k < 4; k++) {
        const mesh = new THREE.Mesh(packetGeo, packetMat);
        group.add(mesh);
        packets.push({ mesh, curve: ci, off: k / 4 });
      }
    });

    /* ---- distant dust ---- */
    const count = isSmall() ? 500 : 1100;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 4;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      pos[i * 3 + 2] = r * Math.cos(ph) - 2;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xb9b8c8,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    const dust = new THREE.Points(pGeo, pMat);
    scene.add(dust);

    /* ---- layout ---- */
    const layout = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(mount);

    /* ---- pointer + scroll ---- */
    const target = new THREE.Vector2();
    const smooth = new THREE.Vector2();
    const onMove = (e: PointerEvent) => {
      target.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    window.addEventListener("pointermove", onMove);

    const prog = { v: 0 };
    const st = ScrollTrigger.create({
      trigger: mount,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => (prog.v = self.progress),
    });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(mount);

    /* ---- typing + log state ---- */
    let snipIdx = 0;
    let typedStart = 0;
    let lastTyped = -1;
    let lastCursor = false;
    const logs: string[][] = [];
    let logIdx = 0;
    let lastLog = -10;
    let termDirty = true;
    let lastTermBlink = false;

    const totalChars = (i: number) => SNIPPETS[i].lines.reduce((a, l) => a + l.length + 1, 0);

    const clock = new THREE.Clock();
    gsap.ticker.add(tick);
    function tick() {
      if (!visible) return;
      const t = clock.getElapsedTime();

      /* typing animation (≈55 chars/s, pause when finished, then next file) */
      const total = totalChars(snipIdx);
      const elapsed = t - typedStart;
      const typedRaw = reduce ? total : Math.floor(elapsed * 55);
      const hold = 3.2;
      if (!reduce && typedRaw > total + hold * 55) {
        snipIdx = (snipIdx + 1) % SNIPPETS.length;
        typedStart = t;
      }
      const typed = Math.min(typedRaw, total);
      const cursorOn = Math.floor(t * 2.2) % 2 === 0;
      if (typed !== lastTyped || cursorOn !== lastCursor) {
        drawEditor(editor.ctx, 1024, 640, SNIPPETS[snipIdx], typed, cursorOn);
        editor.tex.needsUpdate = true;
        lastTyped = typed;
        lastCursor = cursorOn;
      }

      /* terminal: a new request every ~1.3s */
      if (t - lastLog > 1.3) {
        lastLog = t;
        logs.push([...LOGS[logIdx % LOGS.length]]);
        logIdx++;
        if (logs.length > 6) logs.shift();
        termDirty = true;
      }
      const blink = Math.floor(t * 1.8) % 2 === 0;
      if (blink !== lastTermBlink) {
        lastTermBlink = blink;
        termDirty = true;
      }
      if (termDirty) {
        drawTerminal(term.ctx, 640, 372, logs, blink);
        term.tex.needsUpdate = true;
        termDirty = false;
      }

      /* request packets */
      if (!reduce) {
        for (const p of packets) {
          const u = (t * 0.28 + p.off) % 1;
          curves[p.curve].getPoint(u, p.mesh.position);
          p.mesh.scale.setScalar(0.5 + Math.sin(u * Math.PI) * 0.6);
        }
        db.rotation.y = t * 0.5;
        ring.rotation.z = t * 0.9;
      }

      /* parallax + float */
      smooth.lerp(target, 0.05);
      const small = isSmall();
      const s = (small ? M_S : D_S) * (1 - prog.v * 0.3);
      group.scale.setScalar(s);
      group.rotation.y = -0.32 + (reduce ? 0 : Math.sin(t * 0.35) * 0.06) + smooth.x * 0.28;
      group.rotation.x = 0.05 - smooth.y * 0.16 + prog.v * 0.7;
      group.position.x = small ? 0 : D_X - prog.v * 1.4;
      group.position.y = (small ? M_Y : 0.15) + (reduce ? 0 : Math.sin(t * 0.8) * 0.05) + prog.v * 1.4;
      editor.group.position.y = 0.55 + (reduce ? 0 : Math.sin(t * 0.9) * 0.04);
      term.group.position.y = -1.65 + (reduce ? 0 : Math.sin(t * 1.1 + 1) * 0.04);

      dust.rotation.y = t * 0.015 + smooth.x * 0.05;
      pMat.opacity = 0.5 * (1 - prog.v);
      renderer.domElement.style.opacity = String(1 - prog.v * 0.9);

      renderer.render(scene, camera);
    }

    return () => {
      gsap.ticker.remove(tick);
      st.kill();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      [editor, term].forEach((p) => {
        p.tex.dispose();
        p.body.geometry.dispose();
        (p.body.material as THREE.Material).dispose();
        p.screen.geometry.dispose();
        (p.screen.material as THREE.Material).dispose();
        p.edges.geometry.dispose();
        (p.edges.material as THREE.Material).dispose();
      });
      disposables.forEach((d) => d.dispose());
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden />;
}
