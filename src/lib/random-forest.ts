import { GESTURE_IDS, type GestureId } from "./gestures";
import { POSES } from "./hand-poses";
import { extractFeatures, type Landmark } from "./landmarks";

export interface Forest {
  trees: Node[];
  nTrees: number;
  nSamples: number;
  nFeatures: number;
}

type Node =
  | { leaf: true; label: GestureId; conf: number }
  | { leaf: false; feat: number; thr: number; left: Node; right: Node };

interface Row {
  x: number[];
  y: GestureId;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function jitterPose(lm: Landmark[], rng: () => number): Landmark[] {
  const s = 0.9 + rng() * 0.2;
  const ox = (rng() - 0.5) * 0.1;
  const oy = (rng() - 0.5) * 0.1;
  const ang = (rng() - 0.5) * 0.28;
  const c = Math.cos(ang);
  const sA = Math.sin(ang);
  const cx = lm[0]!.x;
  const cy = lm[0]!.y;
  const flip = rng() > 0.5 ? 1 : -1;
  return lm.map((p) => {
    const x0 = (p.x - cx) * flip;
    const y0 = p.y - cy;
    return {
      x: cx + ox + s * (x0 * c - y0 * sA) + (rng() - 0.5) * 0.014,
      y: cy + oy + s * (x0 * sA + y0 * c) + (rng() - 0.5) * 0.014,
      z: p.z + (rng() - 0.5) * 0.05,
    };
  });
}

export function syntheticSet(perClass = 90, seed = 2026): Row[] {
  const rng = mulberry32(seed);
  const rows: Row[] = [];
  for (const y of GESTURE_IDS) {
    const base = POSES[y];
    for (let i = 0; i < perClass; i++) {
      rows.push({ x: extractFeatures(jitterPose(base, rng)), y });
    }
  }
  return rows;
}

function counts(rows: Row[]): Record<GestureId, number> {
  const c = emptyCounts();
  for (const r of rows) c[r.y] += 1;
  return c;
}

function emptyCounts(): Record<GestureId, number> {
  return { LIGHTS_ON: 0, LIGHTS_OFF: 0, FAN_ON: 0, FAN_OFF: 0, AUX: 0 };
}

function gini(c: Record<GestureId, number>, n: number): number {
  if (n <= 0) return 0;
  let s = 1;
  for (const y of GESTURE_IDS) {
    const p = c[y] / n;
    s -= p * p;
  }
  return s;
}

function majority(rows: Row[]): { label: GestureId; conf: number } {
  const c = counts(rows);
  let best: GestureId = rows[0]?.y ?? "LIGHTS_ON";
  let n = 0;
  for (const y of GESTURE_IDS) {
    if (c[y] > n) {
      n = c[y];
      best = y;
    }
  }
  return { label: best, conf: rows.length ? n / rows.length : 0 };
}

function pickFeatures(nFeatures: number, k: number, rng: () => number): number[] {
  const idx = Array.from({ length: nFeatures }, (_, i) => i);
  for (let i = nFeatures - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const t = idx[i]!;
    idx[i] = idx[j]!;
    idx[j] = t;
  }
  return idx.slice(0, k);
}

function grow(rows: Row[], depth: number, rng: () => number, nFeatures: number): Node {
  const maj = majority(rows);
  if (depth <= 0 || rows.length < 8 || maj.conf > 0.97) {
    return { leaf: true, label: maj.label, conf: maj.conf };
  }

  const maxFeat = Math.max(4, Math.floor(Math.sqrt(nFeatures)));
  const feats = pickFeatures(nFeatures, maxFeat, rng);
  const parentG = gini(counts(rows), rows.length);
  let bestGain = 0;
  let bestFeat = 0;
  let bestThr = 0;
  let bestLeft: Row[] = [];
  let bestRight: Row[] = [];

  for (const f of feats) {
    const vals = rows.map((r) => r.x[f] ?? 0);
    const lo = Math.min(...vals);
    const hi = Math.max(...vals);
    if (hi - lo < 1e-6) continue;
    for (let t = 1; t <= 8; t++) {
      const thr = lo + ((hi - lo) * t) / 9;
      const left: Row[] = [];
      const right: Row[] = [];
      for (const r of rows) {
        if ((r.x[f] ?? 0) <= thr) left.push(r);
        else right.push(r);
      }
      if (left.length < 3 || right.length < 3) continue;
      const gain =
        parentG -
        (left.length / rows.length) * gini(counts(left), left.length) -
        (right.length / rows.length) * gini(counts(right), right.length);
      if (gain > bestGain) {
        bestGain = gain;
        bestFeat = f;
        bestThr = thr;
        bestLeft = left;
        bestRight = right;
      }
    }
  }

  if (bestGain < 1e-4 || bestLeft.length === 0) {
    return { leaf: true, label: maj.label, conf: maj.conf };
  }

  return {
    leaf: false,
    feat: bestFeat,
    thr: bestThr,
    left: grow(bestLeft, depth - 1, rng, nFeatures),
    right: grow(bestRight, depth - 1, rng, nFeatures),
  };
}

function walk(node: Node, x: number[]): GestureId {
  if (node.leaf) return node.label;
  return (x[node.feat] ?? 0) <= node.thr ? walk(node.left, x) : walk(node.right, x);
}

export function trainForest(
  extra: Array<{ x: number[]; y: GestureId }> = [],
  opts?: { trees?: number; seed?: number },
): Forest {
  const nTrees = opts?.trees ?? 40;
  const seed = opts?.seed ?? 2026;
  const rng = mulberry32(seed);
  const base = syntheticSet(90, seed);
  const data = extra.length ? base.concat(extra) : base;
  const nFeatures = data[0]?.x.length ?? 63;
  const trees: Node[] = [];
  for (let t = 0; t < nTrees; t++) {
    const bag: Row[] = [];
    for (let i = 0; i < data.length; i++) {
      bag.push(data[Math.floor(rng() * data.length)]!);
    }
    trees.push(grow(bag, 8, rng, nFeatures));
  }
  return { trees, nTrees, nSamples: data.length, nFeatures };
}

export function predictForest(
  forest: Forest,
  x: number[],
): { gesture: GestureId; confidence: number } {
  const c = emptyCounts();
  for (const tree of forest.trees) c[walk(tree, x)] += 1;
  let best: GestureId = "LIGHTS_ON";
  let n = -1;
  for (const y of GESTURE_IDS) {
    if (c[y] > n) {
      n = c[y];
      best = y;
    }
  }
  const vote = n / Math.max(1, forest.trees.length);
  const second = GESTURE_IDS.reduce((m, y) => (y === best ? m : Math.max(m, c[y])), 0);
  const margin = (n - second) / Math.max(1, forest.trees.length);
  return { gesture: best, confidence: Math.max(0, Math.min(1, 0.55 * vote + 0.45 * margin)) };
}

let active = trainForest();

export function getForest(): Forest {
  return active;
}

export function retrainForest(user: Record<GestureId, number[][]>): Forest {
  const extra: Row[] = [];
  for (const y of GESTURE_IDS) {
    for (const x of user[y] ?? []) extra.push({ x, y }, { x, y }, { x, y });
  }
  active = trainForest(extra, { seed: 2026 + extra.length, trees: 40 });
  return active;
}

export function resetForest(): Forest {
  active = trainForest();
  return active;
}
