import { t as cn } from "./utils-C_uf36nf.mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { s as HAND_CONNECTIONS } from "./hand-poses-DXTghskj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hand-skeleton-DxggHv07.js
var import_jsx_runtime = require_jsx_runtime();
function HandSkeleton({ landmarks, className, stroke = "currentColor", joint = "var(--color-lamp)", numbered = false }) {
	if (!landmarks || landmarks.length < 21) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 1 1",
		className: cn("overflow-visible", className),
		"aria-hidden": true,
		children: [HAND_CONNECTIONS.map(([a, b]) => {
			const p = landmarks[a];
			const q = landmarks[b];
			if (!p || !q) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: p.x,
				y1: p.y,
				x2: q.x,
				y2: q.y,
				stroke,
				strokeWidth: .018,
				strokeLinecap: "round"
			}, `${a}-${b}`);
		}), landmarks.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: p.x,
			cy: p.y,
			r: i === 0 ? .028 : i === 4 || i === 8 || i === 12 || i === 16 || i === 20 ? .022 : .016,
			fill: i === 0 ? "var(--color-fg)" : joint
		}), numbered && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: p.x,
			y: p.y - .03,
			textAnchor: "middle",
			fill: "var(--color-fg)",
			fontSize: "0.045",
			fontFamily: "var(--font-mono)",
			children: i
		})] }, i))]
	});
}
//#endregion
export { HandSkeleton as t };
