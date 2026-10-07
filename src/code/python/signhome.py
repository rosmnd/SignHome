"""SignHome — ASL letter classifier (L, A, F, V, W) and serial map.

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
