import { useEffect, useState, type RefObject } from "react";
import { HandSkeleton } from "@/components/hand-skeleton";
import { Button } from "@/components/ui/button";
import { POSES, POSE_ORDER } from "@/lib/hand-poses";
import { GESTURES, type GestureId } from "@/lib/gestures";
import { LANDMARK_COUNT, easeInOut, lerpLandmarks, pickPrimary, type TrackedHand } from "@/lib/landmarks";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function CameraStage({
  videoRef,
  canvasRef,
  hands,
  onStart,
  onStop,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  hands: TrackedHand[];
  onStart: () => void;
  onStop: () => void;
}) {
  const cameraStatus = useAppStore((s) => s.cameraStatus);
  const cameraHint = useAppStore((s) => s.cameraHint);
  const detected = useAppStore((s) => s.detected);
  const holdMs = useAppStore((s) => s.holdMs);
  const fps = useAppStore((s) => s.fps);
  const calibrating = useAppStore((s) => s.calibrating);
  const useTrained = useAppStore((s) => s.useTrained);
  const live = cameraStatus === "live";
  const primary = pickPrimary(hands);

  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-surface shadow-panel">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-widest text-subtle">Vision</p>
          <h2 className="truncate text-sm font-medium text-fg">MediaPipe Hands · 21 landmarks / hand</h2>
        </div>
        {live ? (
          <Button variant="secondary" size="sm" onClick={onStop}>
            Stop camera
          </Button>
        ) : (
          <Button size="sm" onClick={onStart} disabled={cameraStatus === "loading"}>
            {cameraStatus === "loading" ? "Starting…" : "Start camera"}
          </Button>
        )}
      </header>

      <div className="relative aspect-video bg-bg sm:aspect-[16/11]">
        <video
          ref={videoRef}
          className={cn(
            "absolute inset-0 size-full object-cover",
            live ? "opacity-100 scale-x-[-1]" : "opacity-0",
          )}
          playsInline
          muted
          autoPlay
        />
        <canvas
          ref={canvasRef}
          className={cn("pointer-events-none absolute inset-0 size-full", live ? "opacity-100" : "opacity-0")}
        />
        {!live && <IdleHand />}
        <div className="pointer-events-none absolute inset-3 rounded-lg border border-border/70" />
        <div className="absolute left-3 top-3 h-3 w-3 border-l border-t border-accent/70" />
        <div className="absolute right-3 top-3 h-3 w-3 border-r border-t border-accent/70" />
        <div className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-accent/70" />
        <div className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-accent/70" />

        {(cameraHint || cameraStatus === "denied" || cameraStatus === "error") && !live && (
          <p className="absolute inset-x-6 bottom-16 text-center text-sm text-muted">{cameraHint}</p>
        )}

        {live && (
          <p className="absolute left-3 top-3 rounded-md border border-border bg-bg/80 px-2 py-1 font-mono text-[11px] text-fg backdrop-blur-sm tabular-nums">
            {hands.length === 0
              ? "no hand"
              : `${hands.length === 2 ? "L+R" : primary?.handedness ?? "hand"} · ${hands.length * LANDMARK_COUNT} pts · ${fps} fps`}
          </p>
        )}

        <GestureHud
          gesture={detected.gesture}
          confidence={detected.confidence}
          hold={detected.holdMs}
          need={holdMs}
          source={detected.source}
          calibrating={calibrating}
          trained={useTrained}
          hasHand={hands.length > 0}
          live={live}
          hands={hands.length}
        />
      </div>
    </section>
  );
}

function IdleHand() {
  const [lm, setLm] = useState(POSES.LIGHTS_ON);
  const [label, setLabel] = useState<GestureId>("LIGHTS_ON");

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dwell = 2200;
    const morph = 700;
    const cycle = dwell + morph;
    const tick = (now: number) => {
      const elapsed = Math.max(0, now - start);
      const i = Math.floor(elapsed / cycle) % POSE_ORDER.length;
      const local = elapsed % cycle;
      const a = POSE_ORDER[i]!;
      const b = POSE_ORDER[(i + 1) % POSE_ORDER.length]!;
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
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center scan-grid">
      <HandSkeleton landmarks={lm} numbered className="h-48 w-48 max-w-[70%] text-accent/80" />
      <p className="mt-3 text-xs uppercase tracking-[0.18em] text-subtle">21 landmarks · demo pose</p>
      <p className="text-sm text-fg">
        {def.pose}
      </p>
    </div>
  );
}

function GestureHud({
  gesture,
  confidence,
  hold,
  need,
  source,
  calibrating,
  trained,
  hasHand,
  live,
  hands,
}: {
  gesture: GestureId | null;
  confidence: number;
  hold: number;
  need: number;
  source: string;
  calibrating: GestureId | null;
  trained: boolean;
  hasHand: boolean;
  live: boolean;
  hands: number;
}) {
  const pct = Math.round(confidence * 100);
  const fill = Math.min(1, hold / Math.max(need, 1));
  const name = calibrating
    ? `Calibrating ${GESTURES[calibrating].pose}`
    : gesture
      ? GESTURES[gesture].label
      : live
        ? !trained
          ? "Train on live gestures to enable recognition"
          : hasHand
            ? `${hands} hand${hands === 1 ? "" : "s"} · 21 landmarks`
            : "Show a hand — 21 joints"
        : "Camera idle";

  return (
    <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
      <div className="min-w-0 rounded-md border border-border bg-bg/80 px-3 py-2 backdrop-blur-sm">
        <p className="truncate text-sm font-medium text-fg">{name}</p>
        <p className="font-mono text-[11px] text-muted tabular-nums">
          {live
            ? trained
              ? `${pct}% · ${source === "rf" ? "random forest" : source}`
              : "Collect samples in Train panel"
            : "Press Start camera, or use keys 1–5"}
        </p>
        <div className="mt-1.5 h-1 w-full max-w-40 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full bg-accent transition-[width] duration-150"
            style={{ width: `${Math.min(100, pct)}%` }}
          />
        </div>
      </div>
      {live && gesture && (
        <svg width="40" height="40" viewBox="0 0 36 36" className="shrink-0">
          <circle cx="18" cy="18" r="15" fill="none" stroke="var(--color-border)" strokeWidth="3" />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="var(--color-lamp)"
            strokeWidth="3"
            strokeDasharray={`${fill * 94} 94`}
            strokeLinecap="round"
            transform="rotate(-90 18 18)"
          />
        </svg>
      )}
    </div>
  );
}
