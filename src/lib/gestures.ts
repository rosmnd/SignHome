export const GESTURE_IDS = [
  "LIGHTS_ON",
  "LIGHTS_OFF",
  "FAN_ON",
  "FAN_OFF",
  "AUX",
] as const;

export type GestureId = (typeof GESTURE_IDS)[number];

export type ApplianceId = "light" | "fan" | "aux";

export interface GestureDef {
  id: GestureId;
  label: string;
  asl: string;
  pose: string;
  serial: "1" | "2" | "3" | "4" | "5";
  pin: "D2" | "D3" | "D4";
  appliance: ApplianceId;
  action: "on" | "off" | "toggle";
  summary: string;
  keys: string;
  how: string;
}

export const GESTURES: Record<GestureId, GestureDef> = {
  LIGHTS_ON: {
    id: "LIGHTS_ON",
    label: "Lights On",
    asl: "L",
    pose: "ASL letter L",
    serial: "1",
    pin: "D2",
    appliance: "light",
    action: "on",
    summary: "Living room light ON",
    keys: "1",
    how: "ASL L (Lights): thumb and index finger form an L. Middle, ring and pinky curled. Palm faces the camera.",
  },
  LIGHTS_OFF: {
    id: "LIGHTS_OFF",
    label: "Lights Off",
    asl: "A",
    pose: "ASL letter A",
    serial: "2",
    pin: "D2",
    appliance: "light",
    action: "off",
    summary: "Living room light OFF",
    keys: "2",
    how: "ASL A: closed fist with the thumb resting up along the side of the index finger.",
  },
  FAN_ON: {
    id: "FAN_ON",
    label: "Fan On",
    asl: "F",
    pose: "ASL letter F",
    serial: "3",
    pin: "D3",
    appliance: "fan",
    action: "on",
    summary: "Bedroom fan ON",
    keys: "3",
    how: "ASL F (Fan): thumb and index fingertips touch in a circle. Middle, ring and pinky stay up.",
  },
  FAN_OFF: {
    id: "FAN_OFF",
    label: "Fan Off",
    asl: "V",
    pose: "ASL letter V",
    serial: "4",
    pin: "D3",
    appliance: "fan",
    action: "off",
    summary: "Bedroom fan OFF",
    keys: "4",
    how: "ASL V: index and middle fingers up and spread apart. Ring and pinky curled, thumb holds them down.",
  },
  AUX: {
    id: "AUX",
    label: "Speaker Toggle",
    asl: "W",
    pose: "ASL letter W",
    serial: "5",
    pin: "D4",
    appliance: "aux",
    action: "toggle",
    summary: "Toggle speaker",
    keys: "5",
    how: "ASL W: index, middle and ring fingers up and spread. Thumb holds the pinky down.",
  },
};

export const GESTURE_LIST = GESTURE_IDS.map((id) => GESTURES[id]);

export const APPLIANCES: Record<
  ApplianceId,
  { id: ApplianceId; name: string; room: string; pin: "D2" | "D3" | "D4"; relay: string }
> = {
  light: { id: "light", name: "Living Room Light", room: "Living room", pin: "D2", relay: "Relay 1" },
  fan: { id: "fan", name: "Bedroom Fan", room: "Bedroom", pin: "D3", relay: "Relay 2" },
  aux: { id: "aux", name: "Speaker", room: "Living room", pin: "D4", relay: "Relay 3" },
};

export const COOLDOWN_MS = 1400;
