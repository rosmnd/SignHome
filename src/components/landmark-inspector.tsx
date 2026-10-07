import { useState } from "react";
import { LANDMARK_COUNT, LANDMARK_NAMES, pickPrimary, type TrackedHand } from "@/lib/landmarks";
import { cn } from "@/lib/utils";

export function LandmarkInspector({ hands, live }: { hands: TrackedHand[]; live: boolean }) {
  const [pick, setPick] = useState<number>(0);
  const primary = pickPrimary(hands);
  const active = hands[Math.min(pick, Math.max(0, hands.length - 1))] ?? primary;
  const pts = active?.landmarks ?? [];
  const world = active?.world ?? [];

  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-surface shadow-panel">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">MediaPipe Hands</p>
          <h2 className="text-sm font-medium text-fg">21 landmarks × 3 axes</h2>
        </div>
        <p className="font-mono text-[11px] text-muted tabular-nums">
          {live
            ? hands.length === 0
              ? "0 hands"
              : `${hands.length} hand${hands.length === 1 ? "" : "s"} · ${hands.length * LANDMARK_COUNT} pts`
            : "camera idle"}
        </p>
      </header>

      {hands.length > 1 && (
        <div className="flex gap-2 border-b border-border px-4 py-2">
          {hands.map((h, i) => (
            <button
              key={`${h.handedness}-${i}`}
              type="button"
              onClick={() => setPick(i)}
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs",
                i === pick
                  ? "border-border-strong bg-surface-2 text-fg"
                  : "border-border bg-bg text-muted",
              )}
            >
              {h.handedness} · 21
            </button>
          ))}
        </div>
      )}

      <div className="max-h-64 overflow-auto">
        <table className="w-full text-left font-mono text-[11px] tabular-nums">
          <thead className="sticky top-0 bg-surface">
            <tr className="text-subtle">
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-2 py-2 font-medium">Joint</th>
              <th className="px-2 py-2 font-medium">x</th>
              <th className="px-2 py-2 font-medium">y</th>
              <th className="px-2 py-2 font-medium">z</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: LANDMARK_COUNT }, (_, i) => {
              const p = pts[i];
              const w = world[i];
              return (
                <tr key={i} className="border-t border-border/80">
                  <td className="px-3 py-1 text-lamp">{i}</td>
                  <td className="px-2 py-1 text-muted">{LANDMARK_NAMES[i]}</td>
                  <td className="px-2 py-1 text-fg">{p ? p.x.toFixed(3) : "—"}</td>
                  <td className="px-2 py-1 text-fg">{p ? p.y.toFixed(3) : "—"}</td>
                  <td className="px-2 py-1 text-fg">{w ? w.z.toFixed(3) : p ? p.z.toFixed(3) : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="border-t border-border px-4 py-2 text-xs text-muted">
        Feature vector is 21 × (x, y, z) = 63 values, wrist-relative — same input the Random Forest used.
        {active ? ` Showing ${active.handedness} hand.` : " Hold a hand in view to fill the table."}
      </p>
    </section>
  );
}
