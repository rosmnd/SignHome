import { FINGER_CHAINS, LANDMARK_COUNT, type TrackedHand } from "@/lib/landmarks";

function token(name: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function coverMap(
  videoW: number,
  videoH: number,
  canvasW: number,
  canvasH: number,
  nx: number,
  ny: number,
  mirror: boolean,
): { x: number; y: number } {
  const scale = Math.max(canvasW / videoW, canvasH / videoH);
  const dw = videoW * scale;
  const dh = videoH * scale;
  const ox = (canvasW - dw) / 2;
  const oy = (canvasH - dh) / 2;
  const u = mirror ? 1 - nx : nx;
  return { x: u * dw + ox, y: ny * dh + oy };
}

export function paintHands(
  canvas: HTMLCanvasElement,
  hands: TrackedHand[],
  videoW: number,
  videoH: number,
  mirror = true,
): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cssW = canvas.clientWidth || 640;
  const cssH = canvas.clientHeight || 360;
  if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, cssH);
  if (hands.length === 0 || videoW < 2 || videoH < 2) return;

  const map = (nx: number, ny: number) => coverMap(videoW, videoH, cssW, cssH, nx, ny, mirror);
  const vw = Math.min(cssW, cssH);
  const ink = token("--color-fg", "#ecece8");
  const paper = token("--color-bg", "#09090b");
  const lamp = token("--color-lamp", "#c4b49a");

  hands.forEach((hand, hi) => {
    if (hand.landmarks.length < LANDMARK_COUNT) return;
    const primary = hi === 0;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = primary ? Math.max(2.2, vw * 0.006) : Math.max(1.6, vw * 0.0045);

    for (const chain of FINGER_CHAINS) {
      ctx.strokeStyle = token(chain.token, "#9aa8b5");
      ctx.beginPath();
      chain.links.forEach(([a, b], i) => {
        const p = map(hand.landmarks[a]!.x, hand.landmarks[a]!.y);
        const q = map(hand.landmarks[b]!.x, hand.landmarks[b]!.y);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
      });
      ctx.stroke();
    }

    for (let i = 0; i < LANDMARK_COUNT; i++) {
      const p = map(hand.landmarks[i]!.x, hand.landmarks[i]!.y);
      const tip = i === 4 || i === 8 || i === 12 || i === 16 || i === 20;
      const r = i === 0 ? 5.4 : tip ? 4.4 : 3.2;
      ctx.beginPath();
      ctx.fillStyle = i === 0 ? ink : lamp;
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = paper;
      ctx.stroke();

      ctx.font = `600 9px ${token("--font-mono", "ui-monospace")}, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.lineWidth = 3;
      ctx.strokeStyle = paper;
      ctx.fillStyle = ink;
      const label = String(i);
      ctx.strokeText(label, p.x, p.y - r - 1);
      ctx.fillText(label, p.x, p.y - r - 1);
    }

    const wrist = map(hand.landmarks[0]!.x, hand.landmarks[0]!.y);
    ctx.font = `600 11px ${token("--font-sans", "system-ui")}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    const tag = `${hand.handedness} · 21 pts`;
    ctx.lineWidth = 4;
    ctx.strokeStyle = paper;
    ctx.strokeText(tag, wrist.x + 8, wrist.y + 8);
    ctx.fillStyle = lamp;
    ctx.fillText(tag, wrist.x + 8, wrist.y + 8);
  });
}
