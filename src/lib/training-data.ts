import { emptySamples, MAX_SAMPLES_PER_GESTURE } from "./classifier";
import { GESTURE_IDS, type GestureId } from "./gestures";

const FEATURE_COUNT = 63;
const CSV_HEADER = ["label", ...Array.from({ length: FEATURE_COUNT }, (_, i) => `x${i}`)].join(",");

export function serializeSamples(samples: Record<GestureId, number[][]>): string {
  const rows = [CSV_HEADER];
  for (const gesture of GESTURE_IDS) {
    for (const vector of samples[gesture] ?? []) {
      if (vector.length !== FEATURE_COUNT || vector.some((value) => !Number.isFinite(value))) {
        throw new Error(`Cannot export an invalid ${gesture} feature vector.`);
      }
      rows.push(`${gesture},${vector.join(",")}`);
    }
  }
  return `${rows.join("\r\n")}\r\n`;
}

export function parseTrainingCsv(csv: string): Record<GestureId, number[][]> {
  const lines = csv.replace(/^\uFEFF/, "").split(/\r?\n/);
  while (lines.length > 0 && lines[lines.length - 1]?.trim() === "") lines.pop();
  if (lines.shift()?.trim() !== CSV_HEADER) {
    throw new Error("CSV header must be label,x0…x62 (63 landmark features).");
  }

  const samples = emptySamples();
  for (const [index, line] of lines.entries()) {
    if (!line.trim()) continue;
    const fields = line.split(",");
    if (fields.length !== FEATURE_COUNT + 1) {
      throw new Error(`CSV row ${index + 2} must contain a gesture label and 63 features.`);
    }

    const label = fields[0]?.trim();
    if (!GESTURE_IDS.some((gesture) => gesture === label)) {
      throw new Error(`CSV row ${index + 2} has an unsupported gesture label.`);
    }
    const gesture = label as GestureId;
    if (samples[gesture].length >= MAX_SAMPLES_PER_GESTURE) {
      throw new Error(`CSV exceeds the ${MAX_SAMPLES_PER_GESTURE}-sample limit for ${gesture}.`);
    }

    const featureFields = fields.slice(1);
    if (featureFields.some((field) => field.trim() === "")) {
      throw new Error(`CSV row ${index + 2} contains an invalid numeric feature.`);
    }
    const vector = featureFields.map(Number);
    if (vector.some((value) => !Number.isFinite(value))) {
      throw new Error(`CSV row ${index + 2} contains an invalid numeric feature.`);
    }
    samples[gesture].push(vector);
  }

  if (GESTURE_IDS.every((gesture) => samples[gesture].length === 0)) {
    throw new Error("CSV contains no training samples.");
  }
  return samples;
}
