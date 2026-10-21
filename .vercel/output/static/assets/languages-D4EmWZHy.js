import{E as e,M as t,j as n,k as r}from"./index-FPL2X63e.js";var i=t(n()),a=`"""SignHome — ASL letter classifier (L, A, F, V, W) and serial map.

Python twin of the browser geometry classifier. Landmarks are 21 MediaPipe
Hands points, signer view, palm toward camera.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

GestureId = Literal["LIGHTS_ON", "LIGHTS_OFF", "FAN_ON", "FAN_OFF", "AUX"]
SerialByte = Literal["1", "2", "3", "4", "5"]

GESTURES: dict[GestureId, dict] = {
    "LIGHTS_ON": {"asl": "L", "serial": "1", "pin": "D2", "action": "on", "label": "Lights On"},
    "LIGHTS_OFF": {"asl": "A", "serial": "2", "pin": "D2", "action": "off", "label": "Lights Off"},
    "FAN_ON": {"asl": "F", "serial": "3", "pin": "D3", "action": "on", "label": "Fan On"},
    "FAN_OFF": {"asl": "V", "serial": "4", "pin": "D3", "action": "off", "label": "Fan Off"},
    "AUX": {"asl": "W", "serial": "5", "pin": "D4", "action": "toggle", "label": "Speaker Toggle"},
}


@dataclass
class Landmark:
    x: float
    y: float
    z: float = 0.0


def dist(a: Landmark, b: Landmark) -> float:
    return ((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2) ** 0.5


def _finger_open(lm: list[Landmark], tip: int, pip: int, mcp: int) -> tuple[bool, float]:
    wrist = lm[0]
    d_tip = dist(lm[tip], wrist)
    d_pip = dist(lm[pip], wrist)
    d_mcp = dist(lm[mcp], wrist)
    linear = d_tip / (d_pip + 1e-6)
    radial = d_tip / (d_mcp + 1e-6)
    image = (lm[pip].y - lm[tip].y) / (dist(lm[mcp], lm[pip]) + 1e-6)
    score = 0.45 * (linear - 1) + 0.25 * (radial - 1.15) + 0.3 * image
    return score > 0.12, score


def _thumb_open(lm: list[Landmark]) -> tuple[bool, float]:
    palm = dist(lm[0], lm[9]) or 1.0
    spread = dist(lm[4], lm[5]) / palm
    reach = dist(lm[4], lm[17]) / palm
    score = 0.8 * (spread - 0.7) + 0.2 * (reach - 0.9)
    return score > 0, score


def classify(lm: list[Landmark]) -> GestureId | None:
    """Return the matching ASL letter pose, or None."""
    if len(lm) < 21:
        return None
    thumb, t = _thumb_open(lm)
    index, i = _finger_open(lm, 8, 6, 5)
    middle, m = _finger_open(lm, 12, 10, 9)
    ring, r = _finger_open(lm, 16, 14, 13)
    pinky, p = _finger_open(lm, 20, 18, 17)

    # L, A, F, V, W
    hits: list[tuple[GestureId, float]] = []
    if thumb and index and not middle and not ring and not pinky:
        hits.append(("LIGHTS_ON", (t + i - m - r - p) / 5))
    if not index and not middle and not ring and not pinky and not thumb:
        hits.append(("LIGHTS_OFF", (-i - m - r - p - t) / 5))
    if not index and middle and ring and pinky:
        hits.append(("FAN_ON", (-i + m + r + p) / 4))
    if index and middle and not ring and not pinky and not thumb:
        hits.append(("FAN_OFF", (i + m - r - p - t) / 5))
    if index and middle and ring and not pinky and not thumb:
        hits.append(("AUX", (i + m + r - p - t) / 5))  # W

    if not hits:
        return None
    hits.sort(key=lambda h: h[1], reverse=True)
    return hits[0][0]


def serial_byte(gesture: GestureId) -> SerialByte:
    """Byte sent over USB serial at 9600 baud to the Uno R3."""
    return GESTURES[gesture]["serial"]


if __name__ == "__main__":
    print("SignHome letters:", [g["asl"] for g in GESTURES.values()])
    print("Serial map:", {g["asl"]: g["serial"] for g in GESTURES.values()})
`,o=`/**
 * SignHome — ASL letters L, A, F, V, W mapped to Arduino Uno R3 pins.
 *
 * Geometry classifier twin of the browser pipeline. 21 MediaPipe Hands
 * landmarks, signer view, palm toward the camera.
 */
public final class SignHome {

  public enum Gesture {
    LIGHTS_ON("L", '1', "D2", "on"),
    LIGHTS_OFF("A", '2', "D2", "off"),
    FAN_ON("F", '3', "D3", "on"),
    FAN_OFF("V", '4', "D3", "off"),
    AUX("W", '5', "D4", "toggle");

    public final String asl;
    public final char serial;
    public final String pin;
    public final String action;

    Gesture(String asl, char serial, String pin, String action) {
      this.asl = asl;
      this.serial = serial;
      this.pin = pin;
      this.action = action;
    }
  }

  public static final class Landmark {
    public final double x, y, z;

    public Landmark(double x, double y, double z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
  }

  private static double dist(Landmark a, Landmark b) {
    double dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  private static double[] finger(Landmark[] lm, int tip, int pip, int mcp) {
    Landmark wrist = lm[0];
    double dTip = dist(lm[tip], wrist);
    double dPip = dist(lm[pip], wrist);
    double dMcp = dist(lm[mcp], wrist);
    double linear = dTip / (dPip + 1e-6);
    double radial = dTip / (dMcp + 1e-6);
    double image = (lm[pip].y - lm[tip].y) / (dist(lm[mcp], lm[pip]) + 1e-6);
    double score = 0.45 * (linear - 1) + 0.25 * (radial - 1.15) + 0.3 * image;
    return new double[] {score > 0.12 ? 1 : 0, score};
  }

  private static double[] thumb(Landmark[] lm) {
    double palm = dist(lm[0], lm[9]);
    if (palm == 0) palm = 1;
    double spread = dist(lm[4], lm[5]) / palm;
    double reach = dist(lm[4], lm[17]) / palm;
    double score = 0.8 * (spread - 0.7) + 0.2 * (reach - 0.9);
    return new double[] {score > 0 ? 1 : 0, score};
  }

  /** Classify 21 landmarks into L / A / F / V / W, or null. */
  public static Gesture classify(Landmark[] lm) {
    if (lm == null || lm.length < 21) return null;
    double[] th = thumb(lm);
    double[] ix = finger(lm, 8, 6, 5);
    double[] md = finger(lm, 12, 10, 9);
    double[] rg = finger(lm, 16, 14, 13);
    double[] pk = finger(lm, 20, 18, 17);
    boolean t = th[0] == 1, i = ix[0] == 1, m = md[0] == 1, r = rg[0] == 1, p = pk[0] == 1;

    Gesture best = null;
    double bestScore = Double.NEGATIVE_INFINITY;

    if (t && i && !m && !r && !p) {
      double s = (th[1] + ix[1] - md[1] - rg[1] - pk[1]) / 5;
      if (s > bestScore) { bestScore = s; best = Gesture.LIGHTS_ON; }
    }
    if (!i && !m && !r && !p && !t) {
      double s = (-ix[1] - md[1] - rg[1] - pk[1] - th[1]) / 5;
      if (s > bestScore) { bestScore = s; best = Gesture.LIGHTS_OFF; }
    }
    if (!i && m && r && p) {
      double s = (-ix[1] + md[1] + rg[1] + pk[1]) / 4;
      if (s > bestScore) { bestScore = s; best = Gesture.FAN_ON; }
    }
    if (i && m && !r && !p && !t) {
      double s = (ix[1] + md[1] - rg[1] - pk[1] - th[1]) / 5;
      if (s > bestScore) { bestScore = s; best = Gesture.FAN_OFF; }
    }
    if (i && m && r && !p && !t) { // W
      double s = (ix[1] + md[1] + rg[1] - pk[1] - th[1]) / 5;
      if (s > bestScore) { bestScore = s; best = Gesture.AUX; }
    }
    return best;
  }

  public static void main(String[] args) {
    System.out.println("SignHome letters: L A F V W");
    for (Gesture g : Gesture.values()) {
      System.out.printf("%s  serial=%c  pin=%s  %s%n", g.asl, g.serial, g.pin, g.action);
    }
  }
}
`,s=`/**
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
`,c=`/* SignHome — standalone theme (HTML/CSS twin of the control center). */
:root {
  --bg: #09090b;
  --surface: #111113;
  --fg: #ececef;
  --muted: #9a9aa3;
  --border: #26262c;
  --accent: #7c8cff;
  --sage: #7dba8a;
  --lamp: #e8c36a;
  --font: "IBM Plex Sans", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font);
}

.letters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  padding: 24px;
  max-width: 920px;
  margin: 0 auto;
}

.card {
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: 12px;
  padding: 16px;
}

.card h2 {
  margin: 0 0 4px;
  font-size: 1.5rem;
  font-weight: 500;
}

.card p {
  margin: 0;
  color: var(--muted);
  font-size: 0.85rem;
}

.card .pin {
  font-family: var(--mono);
  color: var(--accent);
  font-size: 0.75rem;
  margin-top: 8px;
}

.card[data-asl="L"] .pin { color: var(--lamp); }
.card[data-asl="W"] { outline: 1px solid color-mix(in srgb, var(--accent) 40%, transparent); }
`,l=`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SignHome — L A F V W</title>
    <link rel="stylesheet" href="../css/signhome.css" />
  </head>
  <body>
    <header style="padding: 24px 24px 0; max-width: 920px; margin: 0 auto">
      <p style="letter-spacing: 0.18em; text-transform: uppercase; font-size: 11px; color: var(--muted); margin: 0">
        ASL control
      </p>
      <h1 style="margin: 8px 0 0; font-weight: 500">Five static letters</h1>
      <p style="color: var(--muted); max-width: 36rem">
        L, A, F, V, W map onto virtual relays D2 / D3 / D4. Same serial bytes the
        Arduino Uno R3 firmware expects at 9600 baud.
      </p>
    </header>
    <section class="letters">
      <article class="card" data-asl="L">
        <h2>L</h2>
        <p>Lights On</p>
        <p class="pin">serial 1 · D2</p>
      </article>
      <article class="card" data-asl="A">
        <h2>A</h2>
        <p>Lights Off</p>
        <p class="pin">serial 2 · D2</p>
      </article>
      <article class="card" data-asl="F">
        <h2>F</h2>
        <p>Fan On</p>
        <p class="pin">serial 3 · D3</p>
      </article>
      <article class="card" data-asl="V">
        <h2>V</h2>
        <p>Fan Off</p>
        <p class="pin">serial 4 · D3</p>
      </article>
      <article class="card" data-asl="W">
        <h2>W</h2>
        <p>Speaker Toggle</p>
        <p class="pin">serial 5 · D4</p>
      </article>
    </section>
  </body>
</html>
`,u=r(),d=[{id:`python`,label:`Python`,ext:`signhome.py`,source:a},{id:`javascript`,label:`JavaScript`,ext:`classifier.js`,source:s},{id:`java`,label:`Java`,ext:`SignHome.java`,source:o},{id:`css`,label:`CSS`,ext:`signhome.css`,source:c},{id:`html`,label:`HTML`,ext:`index.html`,source:l}];function f(){let[t,n]=(0,i.useState)(`python`),r=d.find(e=>e.id===t)??d[0];return(0,u.jsxs)(`main`,{className:`mx-auto w-full min-w-0 max-w-5xl px-4 py-8 sm:px-6`,children:[(0,u.jsx)(`p`,{className:`text-[11px] font-medium uppercase tracking-[0.18em] text-subtle`,children:`Thesis sources`}),(0,u.jsx)(`h1`,{className:`mt-2 text-3xl font-medium tracking-tight text-fg`,children:`Five languages, one pipeline`}),(0,u.jsx)(`p`,{className:`mt-3 max-w-2xl text-base leading-relaxed text-muted`,children:`The live control center stays in the browser. These files are the same L, A, F, V, W classifier and serial map in Python, JavaScript, Java, CSS, and HTML.`}),(0,u.jsx)(`div`,{className:`mt-6 flex min-w-0 flex-wrap gap-1 rounded-md border border-border bg-surface p-1`,children:d.map(r=>(0,u.jsx)(`button`,{type:`button`,onClick:()=>n(r.id),className:e(`rounded-sm px-3 py-1.5 text-sm transition-colors duration-150`,t===r.id?`bg-surface-2 text-fg`:`text-muted hover:text-fg`),children:r.label},r.id))}),(0,u.jsxs)(`section`,{className:`mt-4 overflow-hidden rounded-xl border border-border bg-surface shadow-panel`,children:[(0,u.jsxs)(`header`,{className:`flex items-center justify-between border-b border-border px-4 py-2`,children:[(0,u.jsx)(`p`,{className:`font-mono text-xs text-muted`,children:r.ext}),(0,u.jsx)(`p`,{className:`text-[11px] uppercase tracking-widest text-subtle`,children:r.label})]}),(0,u.jsx)(`pre`,{className:`max-h-[70vh] overflow-auto p-4 font-mono text-[12px] leading-relaxed text-fg`,children:(0,u.jsx)(`code`,{children:r.source})})]})]})}export{f as component};