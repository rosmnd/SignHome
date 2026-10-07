export interface Landmark {
  x: number;
  y: number;
  z: number;
}

export const LANDMARK_COUNT = 21;

/** MediaPipe Hands landmark names — 21 per hand. */
export const LANDMARK_NAMES = [
  "WRIST",
  "THUMB_CMC",
  "THUMB_MCP",
  "THUMB_IP",
  "THUMB_TIP",
  "INDEX_FINGER_MCP",
  "INDEX_FINGER_PIP",
  "INDEX_FINGER_DIP",
  "INDEX_FINGER_TIP",
  "MIDDLE_FINGER_MCP",
  "MIDDLE_FINGER_PIP",
  "MIDDLE_FINGER_DIP",
  "MIDDLE_FINGER_TIP",
  "RING_FINGER_MCP",
  "RING_FINGER_PIP",
  "RING_FINGER_DIP",
  "RING_FINGER_TIP",
  "PINKY_MCP",
  "PINKY_PIP",
  "PINKY_DIP",
  "PINKY_TIP",
] as const;

export type LandmarkName = (typeof LANDMARK_NAMES)[number];

export type Handedness = "Left" | "Right";

export interface TrackedHand {
  landmarks: Landmark[];
  world: Landmark[];
  handedness: Handedness;
  score: number;
}

export const HAND_CONNECTIONS: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [0, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [0, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [0, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  [5, 9],
  [9, 13],
  [13, 17],
];

export const FINGER_CHAINS: Array<{ name: string; token: string; links: Array<[number, number]> }> = [
  { name: "thumb", token: "--color-lamp", links: [[0, 1], [1, 2], [2, 3], [3, 4]] },
  { name: "index", token: "--color-accent", links: [[0, 5], [5, 6], [6, 7], [7, 8]] },
  { name: "middle", token: "--color-sage", links: [[9, 10], [10, 11], [11, 12]] },
  { name: "ring", token: "--color-fg", links: [[13, 14], [14, 15], [15, 16]] },
  { name: "pinky", token: "--color-danger", links: [[0, 17], [17, 18], [18, 19], [19, 20]] },
  { name: "palm", token: "--color-muted", links: [[5, 9], [9, 13], [13, 17]] },
];

export function dist(a: Landmark, b: Landmark): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.hypot(dx, dy, dz);
}

export function dist2(a: Landmark, b: Landmark): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Wrist-relative, palm-scaled 63-d vector (MediaPipe × Random Forest pipeline). */
export function extractFeatures(lm: Landmark[]): number[] {
  const wrist = lm[0];
  const scale = dist(wrist, lm[9]) || 1;
  const out: number[] = [];
  for (const p of lm) {
    out.push((p.x - wrist.x) / scale, (p.y - wrist.y) / scale, (p.z - wrist.z) / scale);
  }
  return out;
}

export function euclid(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  let s = 0;
  for (let i = 0; i < n; i++) {
    const d = (a[i] ?? 0) - (b[i] ?? 0);
    s += d * d;
  }
  return Math.sqrt(s);
}

export function lerpLandmarks(a: Landmark[], b: Landmark[], t: number): Landmark[] {
  const n = Math.min(a.length, b.length);
  const out: Landmark[] = [];
  const u = Math.max(0, Math.min(1, t));
  for (let i = 0; i < n; i++) {
    const p = a[i]!;
    const q = b[i]!;
    out.push({
      x: p.x + (q.x - p.x) * u,
      y: p.y + (q.y - p.y) * u,
      z: p.z + (q.z - p.z) * u,
    });
  }
  return out;
}

export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function completeHand(points: Array<{ x: number; y: number; z?: number }>): Landmark[] | null {
  if (points.length < LANDMARK_COUNT) return null;
  const out: Landmark[] = [];
  for (let i = 0; i < LANDMARK_COUNT; i++) {
    const p = points[i];
    if (!p) return null;
    out.push({ x: p.x, y: p.y, z: p.z ?? 0 });
  }
  return out;
}

/** Prefer the user's right hand for ASL; otherwise the larger palm. */
export function pickPrimary(hands: TrackedHand[]): TrackedHand | null {
  if (hands.length === 0) return null;
  const right = hands.find((h) => h.handedness === "Right");
  if (right) return right;
  return [...hands].sort((a, b) => palmSize(b.landmarks) - palmSize(a.landmarks))[0] ?? null;
}

function palmSize(lm: Landmark[]): number {
  return dist2(lm[0]!, lm[9]!);
}
