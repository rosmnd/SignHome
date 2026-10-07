import { useCallback, useEffect, useRef, useState } from "react";
import { classifyHand } from "@/lib/classifier";
import { paintHands } from "@/lib/draw-hands";
import {
  completeHand,
  extractFeatures,
  pickPrimary,
  type Landmark,
  type TrackedHand,
} from "@/lib/landmarks";
import { useAppStore } from "@/lib/store";
import type { GestureId } from "@/lib/gestures";

const WASM_URL = "/mediapipe/wasm";
const MODEL_URL = "/mediapipe/hand_landmarker.task";
const MAX_HANDS = 2;

type Landmarker = {
  detectForVideo: (
    video: HTMLVideoElement,
    ts: number,
  ) => {
    landmarks?: Array<Array<{ x: number; y: number; z: number }>>;
    worldLandmarks?: Array<Array<{ x: number; y: number; z: number }>>;
    handedness?: Array<Array<{ categoryName?: string; displayName?: string; score?: number }>>;
  };
  close: () => void;
};

function parseHands(res: ReturnType<Landmarker["detectForVideo"]>): TrackedHand[] {
  const groups = res.landmarks ?? [];
  const worlds = res.worldLandmarks ?? [];
  const handed = res.handedness ?? [];
  const out: TrackedHand[] = [];
  for (let i = 0; i < groups.length; i++) {
    const lm = completeHand(groups[i] ?? []);
    if (!lm) continue;
    const cat = handed[i]?.[0];
    const name = (cat?.categoryName || cat?.displayName || "Right").toLowerCase();
    const worldPts = worlds[i] ?? [];
    const world: Landmark[] = lm.map((p, idx) => ({
      x: worldPts[idx]?.x ?? p.x,
      y: worldPts[idx]?.y ?? p.y,
      z: worldPts[idx]?.z ?? p.z,
    }));
    out.push({
      landmarks: lm,
      world,
      handedness: name.includes("left") ? "Left" : "Right",
      score: cat?.score ?? 1,
    });
  }
  return out;
}

export function useHandTracker() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<Landmarker | null>(null);
  const rafRef = useRef<number>(0);
  const holdRef = useRef<{ id: GestureId | null; since: number }>({ id: null, since: 0 });
  const lastTs = useRef(0);
  const lastUi = useRef(0);
  const frames = useRef(0);
  const fpsTick = useRef(performance.now());
  const running = useRef(false);

  const [hands, setHands] = useState<TrackedHand[]>([]);
  const [size, setSize] = useState({ w: 640, h: 480 });

  const setCameraStatus = useAppStore((s) => s.setCameraStatus);
  const setDetected = useAppStore((s) => s.setDetected);
  const setFps = useAppStore((s) => s.setFps);
  const applyGesture = useAppStore((s) => s.applyGesture);
  const addLog = useAppStore((s) => s.addLog);
  const addSamples = useAppStore((s) => s.addSamples);
  const calibrating = useAppStore((s) => s.calibrating);

  const stop = useCallback(() => {
    running.current = false;
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setHands([]);
    holdRef.current = { id: null, since: 0 };
    setDetected({ gesture: null, confidence: 0, source: "none", holdMs: 0 });
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setCameraStatus("idle");
  }, [setCameraStatus, setDetected]);

  const loop = useCallback(() => {
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
      if (now - fpsTick.current >= 1000) {
        setFps(frames.current);
        frames.current = 0;
        fpsTick.current = now;
      }

      let tracked: TrackedHand[] = [];
      if (lmkr) {
        try {
          tracked = parseHands(lmkr.detectForVideo(video, now));
        } catch {
          tracked = [];
        }
      }

      const vw = video.videoWidth || 640;
      const vh = video.videoHeight || 480;
      if (canvas) paintHands(canvas, tracked, vw, vh, true);

      const primary = pickPrimary(tracked);
      const pts = primary?.landmarks ?? null;

      const st = useAppStore.getState();
      if (st.calibrating && pts) {
        addSamples(st.calibrating, [extractFeatures(pts)]);
        setDetected({ gesture: st.calibrating, confidence: 1, source: "geometry", holdMs: 0 });
      } else if (pts) {
        const hit = classifyHand(pts, st.samples, st.useTrained);
        const pass = hit.gesture && hit.confidence >= st.confidenceMin;
        if (pass && hit.gesture) {
          if (holdRef.current.id !== hit.gesture) {
            holdRef.current = { id: hit.gesture, since: now };
          }
          const held = now - holdRef.current.since;
          setDetected({
            gesture: hit.gesture,
            confidence: hit.confidence,
            source: hit.source,
            holdMs: held,
          });
          if (held >= st.holdMs) {
            applyGesture(hit.gesture, "camera");
            holdRef.current = { id: hit.gesture, since: now + 800 };
          }
        } else {
          holdRef.current = { id: null, since: 0 };
          setDetected({
            gesture: hit.gesture,
            confidence: hit.confidence,
            source: hit.source,
            holdMs: 0,
          });
        }
      } else {
        holdRef.current = { id: null, since: 0 };
        setDetected({ gesture: null, confidence: 0, source: "none", holdMs: 0 });
      }

      if (now - lastUi.current > 80) {
        lastUi.current = now;
        setHands(tracked);
        setSize({ w: vw, h: vh });
      }
    }

    rafRef.current = requestAnimationFrame(loop);
  }, [addSamples, applyGesture, setDetected, setFps]);

  const start = useCallback(async () => {
    stop();
    setCameraStatus("loading", "Requesting camera…");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) throw new Error("Video element missing");
      video.srcObject = stream;
      await video.play();
      setCameraStatus("loading", "Loading MediaPipe Hands (21 landmarks × 2 hands)…");

      try {
        if (!landmarkerRef.current) {
          const vision = await import("@mediapipe/tasks-vision");
          const fileset = await vision.FilesetResolver.forVisionTasks(WASM_URL);
          const options = {
            runningMode: "VIDEO" as const,
            numHands: MAX_HANDS,
            minHandDetectionConfidence: 0.5,
            minHandPresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
          };
          try {
            landmarkerRef.current = await vision.HandLandmarker.createFromOptions(fileset, {
              ...options,
              baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
            });
          } catch {
            landmarkerRef.current = await vision.HandLandmarker.createFromOptions(fileset, {
              ...options,
              baseOptions: { modelAssetPath: MODEL_URL, delegate: "CPU" },
            });
          }
        }
        addLog("system", "MediaPipe Hands + Random Forest online. 21 landmarks → 63 features → 5 ASL labels.");
      } catch (err) {
        addLog(
          "error",
          "MediaPipe model could not load. Camera is live — use pose keys 1–5 or retry.",
        );
        console.warn(err);
      }

      running.current = true;
      setCameraStatus("live");
      rafRef.current = requestAnimationFrame(loop);
    } catch (err) {
      const denied =
        err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "SecurityError");
      setCameraStatus(
        denied ? "denied" : "error",
        denied
          ? "Camera permission blocked. Use the pose keys or allow the camera and retry."
          : "Could not open a camera on this device.",
      );
      addLog("error", denied ? "Camera permission denied." : "Camera failed to start.");
    }
  }, [addLog, loop, setCameraStatus, stop]);

  useEffect(() => {
    return () => {
      stop();
      try {
        landmarkerRef.current?.close();
      } catch {
        /* ignore */
      }
      landmarkerRef.current = null;
    };
  }, [stop]);

  useEffect(() => {
    if (calibrating) holdRef.current = { id: null, since: 0 };
  }, [calibrating]);

  return { videoRef, canvasRef, hands, size, start, stop };
}
