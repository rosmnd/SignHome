/**
 * SignHome — vanilla JavaScript classifier.
 * ASL letters: L, A, F, V, W  →  serial bytes 1–5  →  pins D2 / D3 / D4
 */

export const GESTURES = {
  LIGHTS_ON: { asl: "L", serial: "1", pin: "D2", action: "on", label: "Lights On" },
  LIGHTS_OFF: { asl: "A", serial: "2", pin: "D2", action: "off", label: "Lights Off" },
  FAN_ON: { asl: "F", serial: "3", pin: "D3", action: "on", label: "Fan On" },
  FAN_OFF: { asl: "V", serial: "4", pin: "D3", action: "off", label: "Fan Off" },
  AUX: { asl: "W", serial: "5", pin: "D4", action: "toggle", label: "Speaker Toggle" },
};

function dist(a, b) {
  const dx = a.x - b.x, dy = a.y - b.y, dz = (a.z || 0) - (b.z || 0);
  return Math.hypot(dx, dy, dz);
}

function fingerOpen(lm, tip, pip, mcp) {
  const wrist = lm[0];
  const dTip = dist(lm[tip], wrist);
  const dPip = dist(lm[pip], wrist);
  const dMcp = dist(lm[mcp], wrist);
  const linear = dTip / (dPip + 1e-6);
  const radial = dTip / (dMcp + 1e-6);
  const image = (lm[pip].y - lm[tip].y) / (dist(lm[mcp], lm[pip]) + 1e-6);
  const score = 0.45 * (linear - 1) + 0.25 * (radial - 1.15) + 0.3 * image;
  return { open: score > 0.12, margin: score };
}

function thumbOpen(lm) {
  const palm = dist(lm[0], lm[9]) || 1;
  const spread = dist(lm[4], lm[5]) / palm;
  const reach = dist(lm[4], lm[17]) / palm;
  const score = 0.8 * (spread - 0.7) + 0.2 * (reach - 0.9);
  return { open: score > 0, margin: score };
}

/** Classify 21 landmarks. Returns gesture id or null. */
export function classify(lm) {
  if (!lm || lm.length < 21) return null;
  const thumb = thumbOpen(lm);
  const index = fingerOpen(lm, 8, 6, 5);
  const middle = fingerOpen(lm, 12, 10, 9);
  const ring = fingerOpen(lm, 16, 14, 13);
  const pinky = fingerOpen(lm, 20, 18, 17);
  const { open: t, margin: tm } = thumb;
  const { open: i, margin: im } = index;
  const { open: m, margin: mm } = middle;
  const { open: r, margin: rm } = ring;
  const { open: p, margin: pm } = pinky;

  const hits = [];
  if (t && i && !m && !r && !p) hits.push(["LIGHTS_ON", (tm + im - mm - rm - pm) / 5]);
  if (!i && !m && !r && !p && !t) hits.push(["LIGHTS_OFF", (-im - mm - rm - pm - tm) / 5]);
  if (!i && m && r && p) hits.push(["FAN_ON", (-im + mm + rm + pm) / 4]);
  if (i && m && !r && !p && !t) hits.push(["FAN_OFF", (im + mm - rm - pm - tm) / 5]);
  if (i && m && r && !p && !t) hits.push(["AUX", (im + mm + rm - pm - tm) / 5]); // W

  if (!hits.length) return null;
  hits.sort((a, b) => b[1] - a[1]);
  return hits[0][0];
}

export function serialByte(id) {
  return GESTURES[id]?.serial ?? null;
}
