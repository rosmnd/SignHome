import { GESTURE_IDS, type GestureId } from "./gestures";

export interface Forest {
  trees: Node[];
  nTrees: number;
  nSamples: number;
  nFeatures: number;
}

export interface TrainingMetrics {
  accuracy: number | null;
  trees: number;
  lastTrainedAt: number | null;
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
  samples: Array<{ x: number[]; y: GestureId }>,
  opts?: { trees?: number; seed?: number },
): Forest {
  if (samples.length === 0) {
    throw new Error("Cannot train the Random Forest without labeled samples.");
  }
  const nFeatures = samples[0]!.x.length;
  if (
    nFeatures !== 63 ||
    samples.some(
      (sample) =>
        sample.x.length !== nFeatures || sample.x.some((value) => !Number.isFinite(value)),
    )
  ) {
    throw new Error("Random Forest samples must contain exactly 63 finite landmark features.");
  }
  const samplesByGesture = new Map(
    GESTURE_IDS.map((gesture) => [gesture, samples.filter((sample) => sample.y === gesture)]),
  );
  if (GESTURE_IDS.some((gesture) => samplesByGesture.get(gesture)!.length === 0)) {
    throw new Error("Random Forest training requires labeled samples for all five gestures.");
  }

  const nTrees = opts?.trees ?? 40;
  const seed = opts?.seed ?? 2026;
  const rng = mulberry32(seed);
  const trees: Node[] = [];
  for (let t = 0; t < nTrees; t++) {
    const bag: Row[] = [];
    for (let i = 0; i < samples.length; i++) {
      const gesture = GESTURE_IDS[Math.floor(rng() * GESTURE_IDS.length)]!;
      const classSamples = samplesByGesture.get(gesture)!;
      bag.push(classSamples[Math.floor(rng() * classSamples.length)]!);
    }
    trees.push(grow(bag, 8, rng, nFeatures));
  }
  return { trees, nTrees, nSamples: samples.length, nFeatures };
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

let active: Forest = { trees: [], nTrees: 0, nSamples: 0, nFeatures: 63 };
let trainingMetrics: TrainingMetrics = { accuracy: null, trees: 0, lastTrainedAt: null };

export function getForest(): Forest {
  return active;
}

export function retrainForest(user: Record<GestureId, number[][]>): Forest {
  const samples: Row[] = [];
  const trainingSamples: Row[] = [];
  const validationSamples: Row[] = [];
  for (const y of GESTURE_IDS) {
    const vectors = user[y] ?? [];
    for (const [index, x] of vectors.entries()) {
      const row = { x, y };
      samples.push(row);
      if (vectors.length >= 5 && index % 5 === 0) validationSamples.push(row);
      else trainingSamples.push(row);
    }
  }
  if (samples.length === 0) {
    throw new Error("Cannot train the Random Forest without labeled samples.");
  }
  const validationForest =
    validationSamples.length > 0
      ? trainForest(trainingSamples, { seed: 2026 + samples.length, trees: 40 })
      : null;
  active = trainForest(samples, { seed: 2026 + samples.length, trees: 40 });
  const correct = validationForest
    ? validationSamples.reduce(
        (total, sample) =>
          total + Number(predictForest(validationForest, sample.x).gesture === sample.y),
        0,
      )
    : 0;
  trainingMetrics = {
    accuracy: validationForest ? correct / validationSamples.length : null,
    trees: active.nTrees,
    lastTrainedAt: Date.now(),
  };
  return active;
}

export function resetForest(): Forest {
  active = { trees: [], nTrees: 0, nSamples: 0, nFeatures: 63 };
  trainingMetrics = { accuracy: null, trees: 0, lastTrainedAt: null };
  return active;
}

export function getTrainingMetrics(): TrainingMetrics {
  return trainingMetrics;
}
