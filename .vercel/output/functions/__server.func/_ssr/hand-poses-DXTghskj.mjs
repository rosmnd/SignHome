import { i as __toESM } from "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { o as require_jsx_runtime, r as Slot, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hand-poses-DXTghskj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,color,border-color] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			primary: "bg-fg text-bg hover:opacity-90",
			secondary: "bg-surface-2 text-fg border border-border hover:border-border-strong",
			ghost: "bg-transparent text-muted hover:text-fg hover:bg-surface-2",
			outline: "border border-border bg-transparent text-fg hover:bg-surface-2"
		},
		size: {
			sm: "h-9 px-3 text-sm rounded-sm",
			md: "h-11 px-4 text-sm rounded-md",
			lg: "h-12 px-5 text-base rounded-md",
			icon: "size-11 rounded-md"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		ref,
		...props
	});
});
Button.displayName = "Button";
var GESTURE_IDS = [
	"LIGHTS_ON",
	"LIGHTS_OFF",
	"FAN_ON",
	"FAN_OFF",
	"AUX"
];
var GESTURES = {
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
		how: "ASL L (Lights): thumb and index finger form an L. Middle, ring and pinky curled. Palm faces the camera."
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
		how: "ASL A: closed fist with the thumb resting up along the side of the index finger."
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
		how: "ASL F (Fan): thumb and index fingertips touch in a circle. Middle, ring and pinky stay up."
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
		how: "ASL V: index and middle fingers up and spread apart. Ring and pinky curled, thumb holds them down."
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
		how: "ASL W: index, middle and ring fingers up and spread. Thumb holds the pinky down."
	}
};
var GESTURE_LIST = GESTURE_IDS.map((id) => GESTURES[id]);
var APPLIANCES = {
	light: {
		id: "light",
		name: "Living Room Light",
		room: "Living room",
		pin: "D2",
		relay: "Relay 1"
	},
	fan: {
		id: "fan",
		name: "Bedroom Fan",
		room: "Bedroom",
		pin: "D3",
		relay: "Relay 2"
	},
	aux: {
		id: "aux",
		name: "Speaker",
		room: "Living room",
		pin: "D4",
		relay: "Relay 3"
	}
};
/** MediaPipe Hands landmark names — 21 per hand. */
var LANDMARK_NAMES = [
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
	"PINKY_TIP"
];
var HAND_CONNECTIONS = [
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
	[13, 17]
];
var FINGER_CHAINS = [
	{
		name: "thumb",
		token: "--color-lamp",
		links: [
			[0, 1],
			[1, 2],
			[2, 3],
			[3, 4]
		]
	},
	{
		name: "index",
		token: "--color-accent",
		links: [
			[0, 5],
			[5, 6],
			[6, 7],
			[7, 8]
		]
	},
	{
		name: "middle",
		token: "--color-sage",
		links: [
			[9, 10],
			[10, 11],
			[11, 12]
		]
	},
	{
		name: "ring",
		token: "--color-fg",
		links: [
			[13, 14],
			[14, 15],
			[15, 16]
		]
	},
	{
		name: "pinky",
		token: "--color-danger",
		links: [
			[0, 17],
			[17, 18],
			[18, 19],
			[19, 20]
		]
	},
	{
		name: "palm",
		token: "--color-muted",
		links: [
			[5, 9],
			[9, 13],
			[13, 17]
		]
	}
];
function dist(a, b) {
	const dx = a.x - b.x;
	const dy = a.y - b.y;
	const dz = a.z - b.z;
	return Math.hypot(dx, dy, dz);
}
function dist2(a, b) {
	return Math.hypot(a.x - b.x, a.y - b.y);
}
/** Wrist-relative, palm-scaled 63-d vector (MediaPipe × Random Forest pipeline). */
function extractFeatures(lm) {
	const wrist = lm[0];
	const scale = dist(wrist, lm[9]) || 1;
	const out = [];
	for (const p of lm) out.push((p.x - wrist.x) / scale, (p.y - wrist.y) / scale, (p.z - wrist.z) / scale);
	return out;
}
function lerpLandmarks(a, b, t) {
	const n = Math.min(a.length, b.length);
	const out = [];
	const u = Math.max(0, Math.min(1, t));
	for (let i = 0; i < n; i++) {
		const p = a[i];
		const q = b[i];
		out.push({
			x: p.x + (q.x - p.x) * u,
			y: p.y + (q.y - p.y) * u,
			z: p.z + (q.z - p.z) * u
		});
	}
	return out;
}
function easeInOut(t) {
	return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
function completeHand(points) {
	if (points.length < 21) return null;
	const out = [];
	for (let i = 0; i < 21; i++) {
		const p = points[i];
		if (!p) return null;
		out.push({
			x: p.x,
			y: p.y,
			z: p.z ?? 0
		});
	}
	return out;
}
/** Prefer the user's right hand for ASL; otherwise the larger palm. */
function pickPrimary(hands) {
	if (hands.length === 0) return null;
	const right = hands.find((h) => h.handedness === "Right");
	if (right) return right;
	return [...hands].sort((a, b) => palmSize(b.landmarks) - palmSize(a.landmarks))[0] ?? null;
}
function palmSize(lm) {
	return dist2(lm[0], lm[9]);
}
function L(x, y, z = 0) {
	return {
		x,
		y,
		z
	};
}
/** Canonical 21-point poses: ASL fingerspelling letters L, A, F, V, W (signer view, palm toward camera). */
var POSES = {
	LIGHTS_ON: [
		L(.52, .9),
		L(.4, .84),
		L(.28, .78),
		L(.18, .74),
		L(.08, .72),
		L(.44, .64),
		L(.42, .46),
		L(.41, .3),
		L(.4, .14),
		L(.54, .64),
		L(.55, .52),
		L(.56, .58),
		L(.56, .66),
		L(.62, .66),
		L(.63, .54),
		L(.63, .6),
		L(.63, .68),
		L(.7, .68),
		L(.71, .58),
		L(.71, .64),
		L(.7, .72)
	],
	LIGHTS_OFF: [
		L(.5, .88),
		L(.4, .82),
		L(.34, .72),
		L(.36, .62),
		L(.38, .52),
		L(.42, .64),
		L(.42, .52),
		L(.43, .58),
		L(.44, .66),
		L(.5, .64),
		L(.5, .5),
		L(.5, .57),
		L(.5, .66),
		L(.58, .64),
		L(.58, .52),
		L(.58, .58),
		L(.58, .66),
		L(.66, .66),
		L(.66, .56),
		L(.66, .62),
		L(.66, .7)
	],
	FAN_ON: [
		L(.5, .9),
		L(.42, .85),
		L(.38, .76),
		L(.4, .66),
		L(.43, .58),
		L(.42, .64),
		L(.39, .56),
		L(.4, .6),
		L(.43, .58),
		L(.52, .64),
		L(.53, .46),
		L(.54, .3),
		L(.55, .14),
		L(.62, .66),
		L(.64, .48),
		L(.65, .34),
		L(.66, .2),
		L(.7, .7),
		L(.74, .54),
		L(.77, .44),
		L(.79, .34)
	],
	FAN_OFF: [
		L(.5, .9),
		L(.38, .84),
		L(.3, .74),
		L(.34, .64),
		L(.44, .6),
		L(.4, .64),
		L(.36, .46),
		L(.33, .3),
		L(.3, .14),
		L(.5, .64),
		L(.52, .46),
		L(.54, .3),
		L(.56, .14),
		L(.6, .66),
		L(.61, .54),
		L(.61, .6),
		L(.61, .68),
		L(.68, .68),
		L(.69, .58),
		L(.69, .64),
		L(.68, .72)
	],
	AUX: [
		L(.5, .9),
		L(.4, .84),
		L(.42, .76),
		L(.46, .72),
		L(.52, .72),
		L(.4, .64),
		L(.36, .46),
		L(.33, .3),
		L(.3, .14),
		L(.5, .64),
		L(.5, .46),
		L(.5, .3),
		L(.5, .14),
		L(.6, .66),
		L(.64, .46),
		L(.67, .3),
		L(.7, .16),
		L(.68, .72),
		L(.66, .62),
		L(.64, .66),
		L(.62, .7)
	]
};
var POSE_ORDER = [
	"LIGHTS_ON",
	"LIGHTS_OFF",
	"FAN_ON",
	"FAN_OFF",
	"AUX"
];
//#endregion
export { pickPrimary as _, GESTURE_IDS as a, LANDMARK_NAMES as c, completeHand as d, dist as f, lerpLandmarks as g, extractFeatures as h, GESTURES as i, POSES as l, easeInOut as m, Button as n, GESTURE_LIST as o, dist2 as p, FINGER_CHAINS as r, HAND_CONNECTIONS as s, APPLIANCES as t, POSE_ORDER as u };
