import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as pickPrimary, c as LANDMARK_NAMES, d as completeHand, g as lerpLandmarks, h as extractFeatures, i as GESTURES, l as POSES, m as easeInOut, n as Button, o as GESTURE_LIST, r as FINGER_CHAINS, t as APPLIANCES, u as POSE_ORDER } from "./hand-poses-DXTghskj.mjs";
import { t as HandSkeleton } from "./hand-skeleton-DxggHv07.mjs";
import { a as Speaker, c as Fan, l as Download, n as Unplug, s as Lightbulb, t as Usb } from "../_libs/lucide-react.mjs";
import { a as retrainForest, c as getSerialState, i as sampleCount, l as subscribeSerial, n as useAppStore, o as connectArduino, r as classifyHand, s as disconnectArduino } from "./router-vh-nNUrO.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CCiqQZh7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-border bg-surface-2 transition-colors data-[state=checked]:bg-sage data-[state=checked]:border-sage", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-5 translate-x-0.5 rounded-full bg-fg transition-transform data-[state=checked]:translate-x-[1.35rem] data-[state=checked]:bg-sage-fg" })
	});
}
var ICONS = {
	light: Lightbulb,
	fan: Fan,
	aux: Speaker
};
function ApplianceRail() {
	const light = useAppStore((s) => s.light);
	const fan = useAppStore((s) => s.fan);
	const aux = useAppStore((s) => s.aux);
	const setAppliance = useAppStore((s) => s.setAppliance);
	const states = {
		light,
		fan,
		aux
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex h-full min-w-0 flex-col rounded-xl border border-border bg-surface p-4 shadow-panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.16em] text-subtle",
				children: "Relays"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-sm font-medium text-fg",
				children: "Living · bedroom · speaker"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid min-h-0 flex-1 grid-cols-3 gap-2",
				children: Object.keys(APPLIANCES).map((id) => {
					const a = APPLIANCES[id];
					const on = states[id];
					const Icon = ICONS[id];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "min-w-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: cn("flex h-full min-w-0 flex-col items-center justify-center gap-2 rounded-md border px-2 py-2 text-center transition-colors duration-200", on ? "border-sage/40 bg-sage/10" : "border-border bg-surface-2"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("flex size-10 items-center justify-center rounded-md", on ? "bg-sage/15 text-sage" : "bg-bg text-muted"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										className: "size-4",
										strokeWidth: 1.75
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-xs font-medium text-fg",
										children: a.name.replace(" Appliance", "")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-mono text-[11px] text-muted tabular-nums",
										children: [
											a.pin,
											" · ",
											on ? "ON" : "OFF"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: on,
									onCheckedChange: (v) => setAppliance(id, v, "manual"),
									"aria-label": a.name
								})
							]
						})
					}, id);
				})
			})
		]
	});
}
var PINS = [
	{
		pin: "D2",
		label: "Light",
		key: "light"
	},
	{
		pin: "D3",
		label: "Fan",
		key: "fan"
	},
	{
		pin: "D4",
		label: "Speaker",
		key: "aux"
	}
];
function ArduinoPins() {
	const on = {
		light: useAppStore((s) => s.light),
		fan: useAppStore((s) => s.fan),
		aux: useAppStore((s) => s.aux)
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-4 shadow-panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.16em] text-subtle",
				children: "Firmware map"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-4 text-sm font-medium text-fg",
				children: "arduino_relay.ino"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-stretch gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-16 flex-col items-center justify-between rounded-md bg-[#0c0d11] py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] text-subtle",
							children: "UNO"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 w-8 rounded-sm bg-accent/20" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] text-subtle",
							children: "R3"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex-1 space-y-2",
					children: PINS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs text-muted",
								children: p.pin
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-fg",
								children: p.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("size-2.5 rounded-full", on[p.key] ? "bg-sage" : "bg-subtle/40"),
								"aria-hidden": true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-8 font-mono text-[11px] text-muted tabular-nums",
								children: on[p.key] ? "1" : "0"
							})
						]
					}, p.pin))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-[11px] leading-relaxed text-muted",
				children: "Jumpers: D2/D3/D4 → IN1/IN2/IN3. AC live only on relay COM → NO."
			})
		]
	});
}
function ArduinoSerialPanel() {
	const addLog = useAppStore((s) => s.addLog);
	const [ser, setSer] = (0, import_react.useState)(getSerialState);
	(0, import_react.useEffect)(() => subscribeSerial(() => setSer(getSerialState())), []);
	async function onConnect() {
		addLog("system", "USB serial picker… select the Arduino Uno R3 (often COM3).");
		const ok = await connectArduino();
		const st = getSerialState();
		if (ok) addLog("system", `Arduino linked · ${st.portName} · 9600 baud. ASL now drives the relays.`);
		else if (st.lastError) addLog("error", st.lastError);
	}
	const connected = ser.status === "connected";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex h-full min-w-0 flex-col rounded-xl border border-border bg-surface p-4 shadow-panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.16em] text-subtle",
				children: "Hardware · USB serial"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-1 text-sm font-medium text-fg",
				children: "Arduino Uno R3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-3 text-xs leading-relaxed text-muted",
				children: [
					"Plug the Uno in with a USB cable. Flash ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-fg",
						children: "arduino_relay.ino"
					}),
					", then Connect. Signs send ASCII 1–5 at 9600 baud into the 5V relay module."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("mb-3 flex items-center gap-3 rounded-md border px-3 py-2", connected ? "border-sage/40 bg-sage/10" : "border-border bg-surface-2"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("flex size-9 items-center justify-center rounded-md", connected ? "bg-sage/15 text-sage" : "bg-bg text-muted"),
						children: connected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Usb, {
							className: "size-4",
							strokeWidth: 1.75
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unplug, {
							className: "size-4",
							strokeWidth: 1.75
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs font-medium text-fg",
							children: connected ? ser.portName || "Arduino Uno R3" : "Not connected"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-mono text-[11px] text-muted",
							children: ser.status === "unsupported" ? "Web Serial unavailable" : connected ? "9600 8N1 · D2 D3 D4" : "USB · Chrome / Edge"
						})]
					}),
					connected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => void disconnectArduino(),
						children: "Disconnect"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => void onConnect(),
						disabled: ser.status === "picking" || ser.status === "unsupported",
						children: "Connect"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mb-3 space-y-1 font-mono text-[11px] text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "D2 → IN1 · light · jumper" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "D3 → IN2 · fan · jumper" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "D4 → IN3 · speaker · jumper" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "5V / GND → relay VCC / GND" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "AC live through COM → NO only" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "secondary",
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/arduino_relay.ino",
						download: true,
						children: "Download sketch"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] leading-relaxed text-subtle",
					children: "Never put mains on Arduino pins."
				})]
			})
		]
	});
}
var BURST_MS = 1600;
function CalibratePanel() {
	const cameraStatus = useAppStore((s) => s.cameraStatus);
	const samples = useAppStore((s) => s.samples);
	const addLog = useAppStore((s) => s.addLog);
	const clearSamples = useAppStore((s) => s.clearSamples);
	const setCalibrating = useAppStore((s) => s.setCalibrating);
	const setUseTrained = useAppStore((s) => s.setUseTrained);
	const calibrating = useAppStore((s) => s.calibrating);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const timer = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => () => window.clearTimeout(timer.current), []);
	function capture(id) {
		if (cameraStatus !== "live") {
			addLog("error", "Start the camera before calibrating.");
			return;
		}
		setBusy(id);
		setCalibrating(id);
		addLog("system", `Collecting ${id} samples… hold the pose.`);
		window.clearTimeout(timer.current);
		timer.current = window.setTimeout(() => {
			setCalibrating(null);
			setBusy(null);
			const n = useAppStore.getState().samples[id].length;
			addLog("system", `Saved buffer for ${id} (${n} total).`);
			const st = useAppStore.getState();
			if (sampleCount(st.samples) >= 40) {
				retrainForest(st.samples);
				setUseTrained(true);
			}
		}, BURST_MS);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-4 shadow-panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.16em] text-subtle",
				children: "Train"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-1 text-sm font-medium text-fg",
				children: "Collect landmarks"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-xs text-muted",
				children: "Same flow as train_model.py — capture 63-d landmark vectors, then refit the Random Forest."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: GESTURE_LIST.map((g) => {
					const n = samples[g.id]?.length ?? 0;
					const active = calibrating === g.id || busy === g.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-fg",
							children: g.pose
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-[11px] text-muted tabular-nums",
							children: [n, " samples"]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: active ? "primary" : "secondary",
							size: "sm",
							onClick: () => capture(g.id),
							disabled: active,
							children: active ? "Holding…" : "Capture"
						})]
					}, g.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: clearSamples,
					children: "Discard samples"
				})
			})
		]
	});
}
function CameraStage({ videoRef, canvasRef, hands, onStart, onStop }) {
	const cameraStatus = useAppStore((s) => s.cameraStatus);
	const cameraHint = useAppStore((s) => s.cameraHint);
	const detected = useAppStore((s) => s.detected);
	const holdMs = useAppStore((s) => s.holdMs);
	const fps = useAppStore((s) => s.fps);
	const calibrating = useAppStore((s) => s.calibrating);
	const live = cameraStatus === "live";
	const primary = pickPrimary(hands);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "min-w-0 overflow-hidden rounded-xl border border-border bg-surface shadow-panel",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between gap-3 border-b border-border px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-widest text-subtle",
					children: "Vision"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "truncate text-sm font-medium text-fg",
					children: "MediaPipe Hands · 21 landmarks / hand"
				})]
			}), live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				size: "sm",
				onClick: onStop,
				children: "Stop camera"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				onClick: onStart,
				disabled: cameraStatus === "loading",
				children: cameraStatus === "loading" ? "Starting…" : "Start camera"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-video bg-bg sm:aspect-[16/11]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					ref: videoRef,
					className: cn("absolute inset-0 size-full object-cover", live ? "opacity-100 scale-x-[-1]" : "opacity-0"),
					playsInline: true,
					muted: true,
					autoPlay: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: canvasRef,
					className: cn("pointer-events-none absolute inset-0 size-full", live ? "opacity-100" : "opacity-0")
				}),
				!live && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdleHand, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-3 rounded-lg border border-border/70" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-3 top-3 h-3 w-3 border-l border-t border-accent/70" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-3 top-3 h-3 w-3 border-r border-t border-accent/70" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-3 left-3 h-3 w-3 border-b border-l border-accent/70" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-3 right-3 h-3 w-3 border-b border-r border-accent/70" }),
				(cameraHint || cameraStatus === "denied" || cameraStatus === "error") && !live && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "absolute inset-x-6 bottom-16 text-center text-sm text-muted",
					children: cameraHint
				}),
				live && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "absolute left-3 top-3 rounded-md border border-border bg-bg/80 px-2 py-1 font-mono text-[11px] text-fg backdrop-blur-sm tabular-nums",
					children: hands.length === 0 ? "no hand" : `${hands.length === 2 ? "L+R" : primary?.handedness ?? "hand"} · ${hands.length * 21} pts · ${fps} fps`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GestureHud, {
					gesture: detected.gesture,
					confidence: detected.confidence,
					hold: detected.holdMs,
					need: holdMs,
					source: detected.source,
					calibrating,
					hasHand: hands.length > 0,
					live,
					hands: hands.length
				})
			]
		})]
	});
}
function IdleHand() {
	const [lm, setLm] = (0, import_react.useState)(POSES.LIGHTS_ON);
	const [label, setLabel] = (0, import_react.useState)("LIGHTS_ON");
	(0, import_react.useEffect)(() => {
		let raf = 0;
		const start = performance.now();
		const dwell = 2200;
		const morph = 700;
		const cycle = 2900;
		const tick = (now) => {
			const elapsed = Math.max(0, now - start);
			const i = Math.floor(elapsed / cycle) % POSE_ORDER.length;
			const local = elapsed % cycle;
			const a = POSE_ORDER[i];
			const b = POSE_ORDER[(i + 1) % POSE_ORDER.length];
			if (local < dwell) {
				setLm(POSES[a]);
				setLabel(a);
			} else {
				const u = easeInOut((local - dwell) / morph);
				setLm(lerpLandmarks(POSES[a], POSES[b], u));
				setLabel(a);
			}
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, []);
	const def = GESTURES[label];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 flex flex-col items-center justify-center scan-grid",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HandSkeleton, {
				landmarks: lm,
				numbered: true,
				className: "h-48 w-48 max-w-[70%] text-accent/80"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs uppercase tracking-[0.18em] text-subtle",
				children: "21 landmarks · demo pose"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-fg",
				children: def.pose
			})
		]
	});
}
function GestureHud({ gesture, confidence, hold, need, source, calibrating, hasHand, live, hands }) {
	const pct = Math.round(confidence * 100);
	const fill = Math.min(1, hold / Math.max(need, 1));
	const name = calibrating ? `Calibrating ${GESTURES[calibrating].pose}` : gesture ? GESTURES[gesture].label : live ? hasHand ? `${hands} hand${hands === 1 ? "" : "s"} · 21 landmarks` : "Show a hand — 21 joints" : "Camera idle";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-x-3 bottom-3 flex items-end justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 rounded-md border border-border bg-bg/80 px-3 py-2 backdrop-blur-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm font-medium text-fg",
					children: name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] text-muted tabular-nums",
					children: live ? `${pct}% · ${source === "rf" ? "random forest" : source}` : "Press Start camera, or use keys 1–5"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1.5 h-1 w-full max-w-40 overflow-hidden rounded-full bg-surface-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-accent transition-[width] duration-150",
						style: { width: `${Math.min(100, pct)}%` }
					})
				})
			]
		}), live && gesture && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			width: "40",
			height: "40",
			viewBox: "0 0 36 36",
			className: "shrink-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "18",
				cy: "18",
				r: "15",
				fill: "none",
				stroke: "var(--color-border)",
				strokeWidth: "3"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "18",
				cy: "18",
				r: "15",
				fill: "none",
				stroke: "var(--color-lamp)",
				strokeWidth: "3",
				strokeDasharray: `${fill * 94} 94`,
				strokeLinecap: "round",
				transform: "rotate(-90 18 18)"
			})]
		})]
	});
}
function LandmarkInspector({ hands, live }) {
	const [pick, setPick] = (0, import_react.useState)(0);
	const primary = pickPrimary(hands);
	const active = hands[Math.min(pick, Math.max(0, hands.length - 1))] ?? primary;
	const pts = active?.landmarks ?? [];
	const world = active?.world ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "min-w-0 overflow-hidden rounded-xl border border-border bg-surface shadow-panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.16em] text-subtle",
					children: "MediaPipe Hands"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium text-fg",
					children: "21 landmarks × 3 axes"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] text-muted tabular-nums",
					children: live ? hands.length === 0 ? "0 hands" : `${hands.length} hand${hands.length === 1 ? "" : "s"} · ${hands.length * 21} pts` : "camera idle"
				})]
			}),
			hands.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 border-b border-border px-4 py-2",
				children: hands.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setPick(i),
					className: cn("rounded-md border px-2.5 py-1 text-xs", i === pick ? "border-border-strong bg-surface-2 text-fg" : "border-border bg-bg text-muted"),
					children: [h.handedness, " · 21"]
				}, `${h.handedness}-${i}`))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-64 overflow-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left font-mono text-[11px] tabular-nums",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "sticky top-0 bg-surface",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "text-subtle",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 font-medium",
									children: "#"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 font-medium",
									children: "Joint"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 font-medium",
									children: "x"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 font-medium",
									children: "y"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 font-medium",
									children: "z"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: Array.from({ length: 21 }, (_, i) => {
						const p = pts[i];
						const w = world[i];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border/80",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-1 text-lamp",
									children: i
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-1 text-muted",
									children: LANDMARK_NAMES[i]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-1 text-fg",
									children: p ? p.x.toFixed(3) : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-1 text-fg",
									children: p ? p.y.toFixed(3) : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-1 text-fg",
									children: w ? w.z.toFixed(3) : p ? p.z.toFixed(3) : "—"
								})
							]
						}, i);
					}) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "border-t border-border px-4 py-2 text-xs text-muted",
				children: ["Feature vector is 21 × (x, y, z) = 63 values, wrist-relative — same input the Random Forest used.", active ? ` Showing ${active.handedness} hand.` : " Hold a hand in view to fill the table."]
			})
		]
	});
}
function PoseKeys() {
	const applyGesture = useAppStore((s) => s.applyGesture);
	const lastFired = useAppStore((s) => s.lastFired);
	const lastFiredAt = useAppStore((s) => s.lastFiredAt);
	const recent = Date.now() - lastFiredAt < 900;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex h-full min-w-0 flex-col rounded-xl border border-border bg-surface p-4 shadow-panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.16em] text-subtle",
				children: "Commands"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-sm font-medium text-fg",
				children: "Five static ASL letters (L, A, F, V, W)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid min-h-0 flex-1 grid-cols-3 gap-2 sm:grid-cols-5",
				children: GESTURE_LIST.map((g) => {
					const active = recent && lastFired === g.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "min-w-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => applyGesture(g.id, "manual"),
							className: cn("flex h-full w-full min-w-0 flex-col items-center justify-center gap-1 rounded-md border px-1 py-2 text-center transition-colors duration-150", active ? "border-lamp bg-lamp/10" : "border-border bg-surface-2 hover:border-border-strong"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HandSkeleton, {
									landmarks: POSES[g.id],
									className: "h-14 w-14 text-accent",
									joint: "var(--color-lamp)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-full truncate text-xs font-medium text-fg",
									children: g.pose
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-xs text-muted",
									children: [
										g.keys,
										" · '",
										g.serial,
										"'"
									]
								})
							]
						})
					}, g.id);
				})
			})
		]
	});
}
function stamp(ts) {
	return new Date(ts).toLocaleTimeString([], {
		hour12: false,
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	});
}
function csvCell(value) {
	return `"${value.replaceAll("\"", "\"\"")}"`;
}
function SerialConsole() {
	const logs = useAppStore((s) => s.logs);
	const clearLogs = useAppStore((s) => s.clearLogs);
	const [live, setLive] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setLive(true), []);
	function downloadHistory() {
		const csv = [[
			"Timestamp",
			"Kind",
			"Message",
			"Details"
		], ...[...logs].reverse().map((row) => [
			new Date(row.ts).toISOString(),
			row.kind,
			row.message,
			row.meta ?? ""
		])].map((row) => row.map(csvCell).join(",")).join("\r\n");
		const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
		const link = document.createElement("a");
		link.href = url;
		link.download = `signhome-log-${(/* @__PURE__ */ new Date()).toISOString().replaceAll(":", "-")}.csv`;
		link.click();
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex min-h-[220px] flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-panel",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between border-b border-border px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-widest text-subtle",
				children: "Serial · 9600"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium text-fg",
				children: "Arduino Uno R3 log"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: downloadHistory,
					disabled: logs.length === 0,
					"aria-label": "Download log history",
					title: "Download log history as CSV",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { "aria-hidden": "true" }), "Download"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: clearLogs,
					children: "Clear"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "flex-1 space-y-1 overflow-auto px-3 py-2 font-mono text-xs leading-relaxed",
			children: logs.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "log-row flex min-w-0 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
						className: "w-[4.6rem] shrink-0 text-subtle tabular-nums",
						dateTime: new Date(row.ts).toISOString(),
						children: live ? stamp(row.ts) : "--:--:--"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("w-14 shrink-0 uppercase", row.kind === "serial" && "text-lamp", row.kind === "gesture" && "text-accent", row.kind === "system" && "text-muted", row.kind === "error" && "text-danger"),
						children: row.kind
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "min-w-0 break-words text-fg",
						children: row.message
					})
				]
			}, row.id))
		})]
	});
}
function Slider({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative flex w-full touch-none select-none items-center", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-surface-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-accent" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-4 rounded-full border border-border-strong bg-fg shadow-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" })]
	});
}
function SettingsPanel() {
	const confidenceMin = useAppStore((s) => s.confidenceMin);
	const holdMs = useAppStore((s) => s.holdMs);
	const setConfidenceMin = useAppStore((s) => s.setConfidenceMin);
	const setHoldMs = useAppStore((s) => s.setHoldMs);
	const useTrained = useAppStore((s) => s.useTrained);
	const setUseTrained = useAppStore((s) => s.setUseTrained);
	const samples = useAppStore((s) => s.samples);
	const n = sampleCount(samples);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-surface p-4 shadow-panel",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.16em] text-subtle",
				children: "Reliability"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-4 text-sm font-medium text-fg",
				children: "Debounce and cutoff"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mb-4 block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: "Minimum confidence"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-fg tabular-nums",
						children: [Math.round(confidenceMin * 100), "%"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					min: .4,
					max: .95,
					step: .01,
					value: [confidenceMin],
					onValueChange: (v) => setConfidenceMin(v[0] ?? .68)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mb-4 block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: "Hold before fire"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-fg tabular-nums",
						children: [holdMs, " ms"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					min: 200,
					max: 1200,
					step: 20,
					value: [holdMs],
					onValueChange: (v) => setHoldMs(v[0] ?? 520)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 border-t border-border pt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-fg",
					children: "Fit Random Forest to my samples"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [n, " landmark samples · 63-d vectors"]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: useTrained && n > 0,
					onCheckedChange: setUseTrained,
					disabled: n === 0
				})]
			})
		]
	});
}
function VirtualHome() {
	const light = useAppStore((s) => s.light);
	const fan = useAppStore((s) => s.fan);
	const aux = useAppStore((s) => s.aux);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": "Virtual home",
		className: "relative min-w-0 overflow-hidden rounded-xl border border-border bg-surface shadow-panel",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between border-b border-border px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.16em] text-subtle",
				children: "Virtual home"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium text-fg",
				children: "Apartment 4B · simulated relays"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[11px] text-muted tabular-nums",
				children: "D2 D3 D4"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-video min-h-56 bg-bg sm:aspect-[16/11] sm:min-h-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 640 400",
				className: "absolute inset-0 size-full",
				role: "img",
				"aria-label": "Two-room apartment",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						width: "640",
						height: "400",
						fill: "#0c0d11"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M40 340 L320 300 L600 340 L600 380 L40 380 Z",
						fill: "#161820"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M40 340 L320 300 L600 340",
						fill: "none",
						stroke: "#262a33",
						strokeWidth: "1.2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M40 80 L320 50 L320 300 L40 340 Z",
						fill: light ? "#2a2418" : "#12141a"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M320 50 L600 80 L600 340 L320 300 Z",
						fill: fan ? "#161820" : "#12141a"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "320",
						y1: "50",
						x2: "320",
						y2: "300",
						stroke: "#262a33",
						strokeWidth: "2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M40 80 L320 50 L600 80 L600 110 L320 78 L40 110 Z",
						fill: "#0e1016"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "78",
						y: "118",
						width: "96",
						height: "88",
						rx: "2",
						fill: "#0a0c12",
						stroke: "#3a3f4a",
						strokeWidth: "3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "126",
						y1: "118",
						x2: "126",
						y2: "206",
						stroke: "#3a3f4a",
						strokeWidth: "2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "78",
						y1: "162",
						x2: "174",
						y2: "162",
						stroke: "#3a3f4a",
						strokeWidth: "2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "86",
						y: "126",
						width: "32",
						height: "28",
						fill: light ? "#e8d5b5" : "#1a2230",
						opacity: light ? .7 : .5
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "134",
						y: "126",
						width: "32",
						height: "28",
						fill: light ? "#e8d5b5" : "#1a2230",
						opacity: light ? .55 : .4
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M70 292 L190 276 L214 300 L90 318 Z",
						fill: "#1c2028",
						stroke: "#2a303a",
						strokeWidth: "1"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M70 268 L190 252 L190 276 L70 292 Z",
						fill: "#222833"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "236",
						y1: "318",
						x2: "236",
						y2: "168",
						stroke: "#8b8e96",
						strokeWidth: "3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "236",
						cy: "324",
						r: "10",
						fill: "#2a303a"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M214 168 L258 168 L248 198 L224 198 Z",
						fill: light ? "#f3e6cc" : "#3a3f4a"
					}),
					light && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
						className: "lamp-glow",
						cx: "236",
						cy: "248",
						rx: "110",
						ry: "88",
						fill: "#c4b49a",
						opacity: "0.38"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "236",
						cy: "186",
						r: "16",
						fill: "#f7edd8",
						opacity: "0.85"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M390 292 L560 272 L572 300 L404 322 Z",
						fill: "#1a1d24",
						stroke: "#2a303a",
						strokeWidth: "1"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M520 276 L560 272 L568 256 L528 260 Z",
						fill: "#2a303a"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						transform: "translate(460 92)",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "0",
								cy: "0",
								r: "6",
								fill: "#8b8e96"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
								className: cn(fan && "fan-spin"),
								style: {
									transformBox: "fill-box",
									transformOrigin: "center"
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
										cx: "0",
										cy: "-32",
										rx: "9",
										ry: "30",
										fill: "#d8cbb6",
										opacity: fan ? 1 : .4
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
										cx: "0",
										cy: "32",
										rx: "9",
										ry: "30",
										fill: "#d8cbb6",
										opacity: fan ? 1 : .4
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
										cx: "-32",
										cy: "0",
										rx: "30",
										ry: "9",
										fill: "#b7c2cc",
										opacity: fan ? 1 : .35
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
										cx: "32",
										cy: "0",
										rx: "30",
										ry: "9",
										fill: "#b7c2cc",
										opacity: fan ? 1 : .35
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "-18",
								stroke: "#5c5f68",
								strokeWidth: "2",
								transform: "translate(0 -6)"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						transform: "translate(300 248)",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: "-16",
								y: "8",
								width: "32",
								height: "76",
								rx: "3",
								fill: aux ? "#2a303a" : "#1a1d24",
								stroke: "#8b8e96",
								strokeWidth: "1.5"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "0",
								cy: "24",
								r: "6",
								fill: aux ? "#d8cbb6" : "#3a3f4a",
								stroke: "#8b8e96",
								strokeWidth: "1"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "0",
								cy: "24",
								r: "2",
								fill: "#12141a"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "0",
								cy: "54",
								r: "12",
								fill: aux ? "#c4b49a" : "#3a3f4a",
								stroke: "#8b8e96",
								strokeWidth: "1"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "0",
								cy: "54",
								r: "4.5",
								fill: "#12141a"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: "-18",
								y: "82",
								width: "36",
								height: "6",
								rx: "1.5",
								fill: "#2a303a"
							}),
							aux && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
								transform: "translate(-9 -8)",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
										className: "eq-bar",
										x: "0",
										y: "0",
										width: "3",
										height: "12",
										fill: "#7d9a7a"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
										className: "eq-bar",
										x: "6",
										y: "-4",
										width: "3",
										height: "16",
										fill: "#7d9a7a"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
										className: "eq-bar",
										x: "12",
										y: "2",
										width: "3",
										height: "10",
										fill: "#7d9a7a"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
										className: "eq-bar",
										x: "18",
										y: "-2",
										width: "3",
										height: "14",
										fill: "#7d9a7a"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: "120",
						y: "70",
						fill: "#5c5f68",
						fontSize: "11",
						fontFamily: "IBM Plex Sans, sans-serif",
						letterSpacing: "2",
						children: "LIVING"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: "470",
						y: "70",
						fill: "#5c5f68",
						fontSize: "11",
						fontFamily: "IBM Plex Sans, sans-serif",
						letterSpacing: "2",
						children: "BEDROOM"
					})
				]
			}), light && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0",
				style: { background: "radial-gradient(ellipse 55% 70% at 30% 58%, color-mix(in oklab, var(--color-lamp) 48%, transparent), transparent 72%)" }
			})]
		})]
	});
}
function token(name, fallback) {
	if (typeof document === "undefined") return fallback;
	return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}
function coverMap(videoW, videoH, canvasW, canvasH, nx, ny, mirror) {
	const scale = Math.max(canvasW / videoW, canvasH / videoH);
	const dw = videoW * scale;
	const dh = videoH * scale;
	const ox = (canvasW - dw) / 2;
	const oy = (canvasH - dh) / 2;
	return {
		x: (mirror ? 1 - nx : nx) * dw + ox,
		y: ny * dh + oy
	};
}
function paintHands(canvas, hands, videoW, videoH, mirror = true) {
	const dpr = Math.min(window.devicePixelRatio || 1, 2);
	const cssW = canvas.clientWidth || 640;
	const cssH = canvas.clientHeight || 360;
	if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
		canvas.width = Math.round(cssW * dpr);
		canvas.height = Math.round(cssH * dpr);
	}
	const ctx = canvas.getContext("2d");
	if (!ctx) return;
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	ctx.clearRect(0, 0, cssW, cssH);
	if (hands.length === 0 || videoW < 2 || videoH < 2) return;
	const map = (nx, ny) => coverMap(videoW, videoH, cssW, cssH, nx, ny, mirror);
	const vw = Math.min(cssW, cssH);
	const ink = token("--color-fg", "#ecece8");
	const paper = token("--color-bg", "#09090b");
	const lamp = token("--color-lamp", "#c4b49a");
	hands.forEach((hand, hi) => {
		if (hand.landmarks.length < 21) return;
		const primary = hi === 0;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.lineWidth = primary ? Math.max(2.2, vw * .006) : Math.max(1.6, vw * .0045);
		for (const chain of FINGER_CHAINS) {
			ctx.strokeStyle = token(chain.token, "#9aa8b5");
			ctx.beginPath();
			chain.links.forEach(([a, b], i) => {
				const p = map(hand.landmarks[a].x, hand.landmarks[a].y);
				const q = map(hand.landmarks[b].x, hand.landmarks[b].y);
				if (i === 0) ctx.moveTo(p.x, p.y);
				else ctx.lineTo(p.x, p.y);
				ctx.lineTo(q.x, q.y);
			});
			ctx.stroke();
		}
		for (let i = 0; i < 21; i++) {
			const p = map(hand.landmarks[i].x, hand.landmarks[i].y);
			const r = i === 0 ? 5.4 : i === 4 || i === 8 || i === 12 || i === 16 || i === 20 ? 4.4 : 3.2;
			ctx.beginPath();
			ctx.fillStyle = i === 0 ? ink : lamp;
			ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
			ctx.fill();
			ctx.lineWidth = 1;
			ctx.strokeStyle = paper;
			ctx.stroke();
			ctx.font = `600 9px ${token("--font-mono", "ui-monospace")}, monospace`;
			ctx.textAlign = "center";
			ctx.textBaseline = "bottom";
			ctx.lineWidth = 3;
			ctx.strokeStyle = paper;
			ctx.fillStyle = ink;
			const label = String(i);
			ctx.strokeText(label, p.x, p.y - r - 1);
			ctx.fillText(label, p.x, p.y - r - 1);
		}
		const wrist = map(hand.landmarks[0].x, hand.landmarks[0].y);
		ctx.font = `600 11px ${token("--font-sans", "system-ui")}`;
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		const tag = `${hand.handedness} · 21 pts`;
		ctx.lineWidth = 4;
		ctx.strokeStyle = paper;
		ctx.strokeText(tag, wrist.x + 8, wrist.y + 8);
		ctx.fillStyle = lamp;
		ctx.fillText(tag, wrist.x + 8, wrist.y + 8);
	});
}
var WASM_URL = "/mediapipe/wasm";
var MODEL_URL = "/mediapipe/hand_landmarker.task";
var MAX_HANDS = 2;
function parseHands(res) {
	const groups = res.landmarks ?? [];
	const worlds = res.worldLandmarks ?? [];
	const handed = res.handedness ?? [];
	const out = [];
	for (let i = 0; i < groups.length; i++) {
		const lm = completeHand(groups[i] ?? []);
		if (!lm) continue;
		const cat = handed[i]?.[0];
		const name = (cat?.categoryName || cat?.displayName || "Right").toLowerCase();
		const worldPts = worlds[i] ?? [];
		const world = lm.map((p, idx) => ({
			x: worldPts[idx]?.x ?? p.x,
			y: worldPts[idx]?.y ?? p.y,
			z: worldPts[idx]?.z ?? p.z
		}));
		out.push({
			landmarks: lm,
			world,
			handedness: name.includes("left") ? "Left" : "Right",
			score: cat?.score ?? 1
		});
	}
	return out;
}
function useHandTracker() {
	const videoRef = (0, import_react.useRef)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const landmarkerRef = (0, import_react.useRef)(null);
	const rafRef = (0, import_react.useRef)(0);
	const holdRef = (0, import_react.useRef)({
		id: null,
		since: 0
	});
	const lastTs = (0, import_react.useRef)(0);
	const lastUi = (0, import_react.useRef)(0);
	const frames = (0, import_react.useRef)(0);
	const fpsTick = (0, import_react.useRef)(performance.now());
	const running = (0, import_react.useRef)(false);
	const [hands, setHands] = (0, import_react.useState)([]);
	const [size, setSize] = (0, import_react.useState)({
		w: 640,
		h: 480
	});
	const setCameraStatus = useAppStore((s) => s.setCameraStatus);
	const setDetected = useAppStore((s) => s.setDetected);
	const setFps = useAppStore((s) => s.setFps);
	const applyGesture = useAppStore((s) => s.applyGesture);
	const addLog = useAppStore((s) => s.addLog);
	const addSamples = useAppStore((s) => s.addSamples);
	const calibrating = useAppStore((s) => s.calibrating);
	const stop = (0, import_react.useCallback)(() => {
		running.current = false;
		cancelAnimationFrame(rafRef.current);
		streamRef.current?.getTracks().forEach((t) => t.stop());
		streamRef.current = null;
		setHands([]);
		holdRef.current = {
			id: null,
			since: 0
		};
		setDetected({
			gesture: null,
			confidence: 0,
			source: "none",
			holdMs: 0
		});
		const canvas = canvasRef.current;
		if (canvas) canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
		setCameraStatus("idle");
	}, [setCameraStatus, setDetected]);
	const loop = (0, import_react.useCallback)(() => {
		if (!running.current) return;
		const video = videoRef.current;
		const canvas = canvasRef.current;
		const lmkr = landmarkerRef.current;
		if (!video || video.readyState < 2) {
			rafRef.current = requestAnimationFrame(loop);
			return;
		}
		const now = performance.now();
		if (now - lastTs.current > 22) {
			lastTs.current = now;
			frames.current += 1;
			if (now - fpsTick.current >= 1e3) {
				setFps(frames.current);
				frames.current = 0;
				fpsTick.current = now;
			}
			let tracked = [];
			if (lmkr) try {
				tracked = parseHands(lmkr.detectForVideo(video, now));
			} catch {
				tracked = [];
			}
			const vw = video.videoWidth || 640;
			const vh = video.videoHeight || 480;
			if (canvas) paintHands(canvas, tracked, vw, vh, true);
			const pts = pickPrimary(tracked)?.landmarks ?? null;
			const st = useAppStore.getState();
			if (st.calibrating && pts) {
				addSamples(st.calibrating, [extractFeatures(pts)]);
				setDetected({
					gesture: st.calibrating,
					confidence: 1,
					source: "geometry",
					holdMs: 0
				});
			} else if (pts) {
				const hit = classifyHand(pts, st.samples, st.useTrained);
				if (hit.gesture && hit.confidence >= st.confidenceMin && hit.gesture) {
					if (holdRef.current.id !== hit.gesture) holdRef.current = {
						id: hit.gesture,
						since: now
					};
					const held = now - holdRef.current.since;
					setDetected({
						gesture: hit.gesture,
						confidence: hit.confidence,
						source: hit.source,
						holdMs: held
					});
					if (held >= st.holdMs) {
						applyGesture(hit.gesture, "camera");
						holdRef.current = {
							id: hit.gesture,
							since: now + 800
						};
					}
				} else {
					holdRef.current = {
						id: null,
						since: 0
					};
					setDetected({
						gesture: hit.gesture,
						confidence: hit.confidence,
						source: hit.source,
						holdMs: 0
					});
				}
			} else {
				holdRef.current = {
					id: null,
					since: 0
				};
				setDetected({
					gesture: null,
					confidence: 0,
					source: "none",
					holdMs: 0
				});
			}
			if (now - lastUi.current > 80) {
				lastUi.current = now;
				setHands(tracked);
				setSize({
					w: vw,
					h: vh
				});
			}
		}
		rafRef.current = requestAnimationFrame(loop);
	}, [
		addSamples,
		applyGesture,
		setDetected,
		setFps
	]);
	const start = (0, import_react.useCallback)(async () => {
		stop();
		setCameraStatus("loading", "Requesting camera…");
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "user",
					width: { ideal: 1280 },
					height: { ideal: 720 }
				},
				audio: false
			});
			streamRef.current = stream;
			const video = videoRef.current;
			if (!video) throw new Error("Video element missing");
			video.srcObject = stream;
			await video.play();
			setCameraStatus("loading", "Loading MediaPipe Hands (21 landmarks × 2 hands)…");
			try {
				if (!landmarkerRef.current) {
					const vision = await import("../_libs/mediapipe__tasks-vision.mjs").then((n) => n.t);
					const fileset = await vision.FilesetResolver.forVisionTasks(WASM_URL);
					const options = {
						runningMode: "VIDEO",
						numHands: MAX_HANDS,
						minHandDetectionConfidence: .5,
						minHandPresenceConfidence: .5,
						minTrackingConfidence: .5
					};
					try {
						landmarkerRef.current = await vision.HandLandmarker.createFromOptions(fileset, {
							...options,
							baseOptions: {
								modelAssetPath: MODEL_URL,
								delegate: "GPU"
							}
						});
					} catch {
						landmarkerRef.current = await vision.HandLandmarker.createFromOptions(fileset, {
							...options,
							baseOptions: {
								modelAssetPath: MODEL_URL,
								delegate: "CPU"
							}
						});
					}
				}
				addLog("system", "MediaPipe Hands + Random Forest online. 21 landmarks → 63 features → 5 ASL labels.");
			} catch (err) {
				addLog("error", "MediaPipe model could not load. Camera is live — use pose keys 1–5 or retry.");
				console.warn(err);
			}
			running.current = true;
			setCameraStatus("live");
			rafRef.current = requestAnimationFrame(loop);
		} catch (err) {
			const denied = err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "SecurityError");
			setCameraStatus(denied ? "denied" : "error", denied ? "Camera permission blocked. Use the pose keys or allow the camera and retry." : "Could not open a camera on this device.");
			addLog("error", denied ? "Camera permission denied." : "Camera failed to start.");
		}
	}, [
		addLog,
		loop,
		setCameraStatus,
		stop
	]);
	(0, import_react.useEffect)(() => {
		return () => {
			stop();
			try {
				landmarkerRef.current?.close();
			} catch {}
			landmarkerRef.current = null;
		};
	}, [stop]);
	(0, import_react.useEffect)(() => {
		if (calibrating) holdRef.current = {
			id: null,
			since: 0
		};
	}, [calibrating]);
	return {
		videoRef,
		canvasRef,
		hands,
		size,
		start,
		stop
	};
}
function useKeys() {
	const applyGesture = useAppStore((s) => s.applyGesture);
	(0, import_react.useEffect)(() => {
		function onKey(e) {
			const t = e.target;
			if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
			const hit = GESTURE_LIST.find((g) => g.keys === e.key);
			if (!hit) return;
			e.preventDefault();
			applyGesture(hit.id, "manual");
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [applyGesture]);
}
function ControlCenter() {
	useKeys();
	const tracker = useHandTracker();
	const addLog = useAppStore((s) => s.addLog);
	const live = useAppStore((s) => s.cameraStatus === "live");
	(0, import_react.useEffect)(() => {
		useAppStore.persist.rehydrate();
		if (useAppStore.getState().logs.length === 0) addLog("system", "SignHome control center ready. Local processing only.", "offline");
	}, [addLog]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 sm:py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-medium tracking-tight text-fg sm:text-3xl",
				children: "Control center"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-sm leading-relaxed text-muted",
				children: "MediaPipe Hands extracts 21 landmarks (63 features). Five static ASL letters — L, A, F, V, W — map onto a 5V relay on Arduino Uno R3. Local, offline, no GPU."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid w-full min-w-0 items-stretch gap-4 lg:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraStage, {
						videoRef: tracker.videoRef,
						canvasRef: tracker.canvasRef,
						hands: tracker.hands,
						onStart: tracker.start,
						onStop: tracker.stop
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VirtualHome, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoseKeys, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApplianceRail, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandmarkInspector, {
				hands: tracker.hands,
				live
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid w-full min-w-0 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SerialConsole, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArduinoSerialPanel, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArduinoPins, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPanel, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalibratePanel, {})
					]
				})]
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlCenter, {}) });
}
//#endregion
export { Home as component };
