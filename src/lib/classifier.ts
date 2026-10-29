import { GESTURE_IDS, type GestureId } from "./gestures";
import { extractFeatures, type Landmark } from "./landmarks";
import { getForest, predictForest, retrainForest, resetForest } from "./random-forest";

export interface Classification {
  gesture: GestureId | null;
  confidence: number;
  source: "rf" | "none";
}

export const MIN_SAMPLES_PER_GESTURE = 10;
export const MAX_SAMPLES_PER_GESTURE = 120;

export function canTrainSamples(samples: Record<GestureId, number[][]>): boolean {
  return GESTURE_IDS.every((gesture) => (samples[gesture]?.length ?? 0) >= MIN_SAMPLES_PER_GESTURE);
}

export function classifyHand(lm: Landmark[]): Classification {
  const forest = getForest();
  if (forest.nSamples === 0) {
    return { gesture: null, confidence: 0, source: "none" };
  }
  const rf = predictForest(forest, extractFeatures(lm));
  if (rf.confidence < 0.28) {
    return { gesture: null, confidence: rf.confidence, source: "none" };
  }
  return { gesture: rf.gesture, confidence: rf.confidence, source: "rf" };
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
