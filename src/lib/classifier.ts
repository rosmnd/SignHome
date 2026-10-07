import { GESTURE_IDS, type GestureId } from "./gestures";
import { dist, dist2, extractFeatures, type Landmark } from "./landmarks";
import { getForest, predictForest, retrainForest, resetForest } from "./random-forest";

export interface FingerState {
  thumb: boolean;
  index: boolean;
  middle: boolean;
  ring: boolean;
  pinky: boolean;
  margins: {
    thumb: number;
    index: number;
    middle: number;
    ring: number;
    pinky: number;
  };
}

export interface Classification {
  gesture: GestureId | null;
  confidence: number;
  fingers: FingerState;
  source: "rf" | "geometry" | "none";
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function fingerOpen(lm: Landmark[], tip: number, pip: number, mcp: number): { open: boolean; margin: number } {
  const wrist = lm[0]!;
  const dTip = dist(lm[tip]!, wrist);
  const dPip = dist(lm[pip]!, wrist);
  const dMcp = dist(lm[mcp]!, wrist);
  const linear = dTip / (dPip + 1e-6);
  const radial = dTip / (dMcp + 1e-6);
  const image = (lm[pip]!.y - lm[tip]!.y) / (dist2(lm[mcp]!, lm[pip]!) + 1e-6);
  const score = 0.45 * (linear - 1) + 0.25 * (radial - 1.15) + 0.3 * image;
  return { open: score > 0.12, margin: score };
}

function thumbOpen(lm: Landmark[]): { open: boolean; margin: number } {
  // Thumb counts as extended when its tip is held well away from the index knuckle
  // (palm-scaled). Folded/tucked thumbs (ASL 1, 2, 4) sit close to the palm.
  const palm = dist(lm[0]!, lm[9]!) || 1;
  const spread = dist(lm[4]!, lm[5]!) / palm;
  const reach = dist(lm[4]!, lm[17]!) / palm;
  const score = 0.8 * (spread - 0.7) + 0.2 * (reach - 0.9);
  return { open: score > 0, margin: score };
}

export function readFingers(lm: Landmark[]): FingerState {
  const thumb = thumbOpen(lm);
  const index = fingerOpen(lm, 8, 6, 5);
  const middle = fingerOpen(lm, 12, 10, 9);
  const ring = fingerOpen(lm, 16, 14, 13);
  const pinky = fingerOpen(lm, 20, 18, 17);
  return {
    thumb: thumb.open,
    index: index.open,
    middle: middle.open,
    ring: ring.open,
    pinky: pinky.open,
    margins: {
      thumb: thumb.margin,
      index: index.margin,
      middle: middle.margin,
      ring: ring.margin,
      pinky: pinky.margin,
    },
  };
}

function matchGeometry(f: FingerState): { gesture: GestureId; score: number } | null {
  const { thumb, index, middle, ring, pinky, margins } = f;

  // ASL fingerspelling: L, A, F, V, W.
  const candidates: Array<{ id: GestureId; ok: boolean; score: number }> = [
    {
      // L: thumb + index out, others curled
      id: "LIGHTS_ON",
      ok: thumb && index && !middle && !ring && !pinky,
      score: (margins.thumb + margins.index - margins.middle - margins.ring - margins.pinky) / 5,
    },
    {
      // A: fist, all four fingers curled (thumb rests along the side)
      id: "LIGHTS_OFF",
      ok: !index && !middle && !ring && !pinky && !thumb,
      score: (-margins.index - margins.middle - margins.ring - margins.pinky - margins.thumb) / 5,
    },
    {
      // F: index curled to touch thumb, middle/ring/pinky up
      id: "FAN_ON",
      ok: !index && middle && ring && pinky,
      score: (-margins.index + margins.middle + margins.ring + margins.pinky) / 4,
    },
    {
      // V: index + middle spread, ring/pinky curled, thumb folded
      id: "FAN_OFF",
      ok: index && middle && !ring && !pinky && !thumb,
      score: (margins.index + margins.middle - margins.ring - margins.pinky - margins.thumb) / 5,
    },
    {
      // W: index + middle + ring up and spread, pinky held down by thumb
      id: "AUX",
      ok: index && middle && ring && !pinky && !thumb,
      score: (margins.index + margins.middle + margins.ring - margins.pinky - margins.thumb) / 5,
    },
  ];

  const hits = candidates.filter((c) => c.ok);
  if (hits.length === 0) return null;
  hits.sort((a, b) => b.score - a.score);
  const best = hits[0]!;
  return { gesture: best.id, score: best.score };
}

export function classifyHand(
  lm: Landmark[],
  _samples: Record<GestureId, number[][]>,
  _preferTrained: boolean,
): Classification {
  const fingers = readFingers(lm);
  const features = extractFeatures(lm);
  const rf = predictForest(getForest(), features);

  if (rf.confidence >= 0.42) {
    return {
      gesture: rf.gesture,
      confidence: clamp01(rf.confidence),
      fingers,
      source: "rf",
    };
  }

  const geo = matchGeometry(fingers);
  if (geo && geo.score > 0.08) {
    return {
      gesture: geo.gesture,
      confidence: clamp01(0.5 + 0.7 * geo.score),
      fingers,
      source: "geometry",
    };
  }

  if (rf.confidence >= 0.28) {
    return {
      gesture: rf.gesture,
      confidence: clamp01(rf.confidence),
      fingers,
      source: "rf",
    };
  }

  return { gesture: null, confidence: rf.confidence, fingers, source: "none" };
}

export { retrainForest, resetForest };

export function sampleCount(samples: Record<GestureId, number[][]>): number {
  return GESTURE_IDS.reduce((n, g) => n + (samples[g]?.length ?? 0), 0);
}

export function emptySamples(): Record<GestureId, number[][]> {
  return {
    LIGHTS_ON: [],
    LIGHTS_OFF: [],
    FAN_ON: [],
    FAN_OFF: [],
    AUX: [],
  };
}
