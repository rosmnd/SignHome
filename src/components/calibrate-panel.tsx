import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  canTrainSamples,
  MAX_SAMPLES_PER_GESTURE,
  MIN_SAMPLES_PER_GESTURE,
  sampleCount,
} from "@/lib/classifier";
import { GESTURE_LIST, type GestureId } from "@/lib/gestures";
import { parseTrainingCsv, serializeSamples } from "@/lib/training-data";
import { useAppStore } from "@/lib/store";

const BURST_MS = 1600;

export function CalibratePanel() {
  const cameraStatus = useAppStore((s) => s.cameraStatus);
  const samples = useAppStore((s) => s.samples);
  const addLog = useAppStore((s) => s.addLog);
  const replaceSamples = useAppStore((s) => s.replaceSamples);
  const clearSamples = useAppStore((s) => s.clearSamples);
  const setCalibrating = useAppStore((s) => s.setCalibrating);
  const setUseTrained = useAppStore((s) => s.setUseTrained);
  const useTrained = useAppStore((s) => s.useTrained);
  const calibrating = useAppStore((s) => s.calibrating);
  const [busy, setBusy] = useState<GestureId | null>(null);
  const [status, setStatus] = useState("");
  const timer = useRef<number>(0);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function capture(id: GestureId) {
    if (cameraStatus !== "live") {
      addLog("error", "Start the camera before calibrating.");
      return;
    }
    if (useTrained) setUseTrained(false);
    setBusy(id);
    setCalibrating(id);
    setStatus(`Collecting ${GESTURE_LIST.find((gesture) => gesture.id === id)?.pose ?? id}…`);
    addLog("system", `Collecting ${id} samples… hold the pose.`);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setCalibrating(null);
      setBusy(null);
      const state = useAppStore.getState();
      const n = state.samples[id].length;
      addLog("system", `Saved live samples for ${id} (${n} total).`);
      if (canTrainSamples(state.samples)) {
        setUseTrained(true);
        setStatus("All five gestures have enough samples. Random Forest trained on your live data.");
      } else {
        setStatus(`Saved ${n} ${id} samples. Collect at least ${MIN_SAMPLES_PER_GESTURE} for every gesture to train.`);
      }
    }, BURST_MS);
  }

  async function importCsv(file: File | undefined) {
    if (!file) return;
    try {
      const imported = parseTrainingCsv(await file.text());
      replaceSamples(imported);
      const total = sampleCount(imported);
      if (canTrainSamples(imported)) {
        setUseTrained(true);
        setStatus(`Imported ${total} samples and trained the Random Forest.`);
      } else {
        setStatus(
          `Imported ${total} samples. Collect at least ${MIN_SAMPLES_PER_GESTURE} samples for each gesture before training.`,
        );
      }
      addLog("system", `Imported ${total} labeled samples from ${file.name}.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not read the training CSV.";
      setStatus(message);
      addLog("error", `CSV import failed: ${message}`);
    } finally {
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  function exportCsv() {
    try {
      const csv = serializeSamples(samples);
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `signhome-training-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus(`Exported ${sampleCount(samples)} labeled samples as CSV.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not export the training CSV.";
      setStatus(message);
      addLog("error", `CSV export failed: ${message}`);
    }
  }

  function train() {
    setUseTrained(true);
    if (canTrainSamples(useAppStore.getState().samples)) {
      setStatus("Random Forest trained on your labeled live samples.");
    }
  }

  const total = sampleCount(samples);
  const ready = canTrainSamples(samples);

  return (
    <section className="rounded-xl border border-border bg-surface p-4 shadow-panel">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">Train</p>
      <h2 className="mb-1 text-sm font-medium text-fg">Train with live gestures</h2>
      <p className="mb-3 text-xs text-muted">
        Capture each pose several times, varying hand position and angle. Each burst adds labeled
        63-feature samples; the Random Forest trains on this data only. Export or import it as CSV.
      </p>
      <ul className="space-y-2">
        {GESTURE_LIST.map((g) => {
          const n = samples[g.id]?.length ?? 0;
          const enough = n >= MIN_SAMPLES_PER_GESTURE;
          const active = calibrating === g.id || busy === g.id;
          return (
            <li key={g.id} className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm text-fg">{g.pose}</p>
                <p className="font-mono text-[11px] text-muted tabular-nums">
                  {n}/{MAX_SAMPLES_PER_GESTURE} samples · {enough ? "ready" : `${MIN_SAMPLES_PER_GESTURE} needed`}
                </p>
              </div>
              <Button variant={active ? "primary" : "secondary"} size="sm" onClick={() => capture(g.id)} disabled={active}>
                {active ? "Holding…" : "Capture"}
              </Button>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-muted">
        {total} total samples · {useTrained ? "live-trained model active" : "recognition paused until training"}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" onClick={train} disabled={!ready}>
          Train Random Forest
        </Button>
        <Button variant="secondary" size="sm" onClick={() => fileInput.current?.click()}>
          Import CSV
        </Button>
        <Button variant="secondary" size="sm" onClick={exportCsv} disabled={total === 0}>
          Export CSV
        </Button>
        <Button variant="ghost" size="sm" onClick={clearSamples} disabled={total === 0}>
          Clear data
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(event) => void importCsv(event.currentTarget.files?.[0])}
        />
      </div>
      {status && <p className="mt-3 text-xs text-muted" role="status" aria-live="polite">{status}</p>}
    </section>
  );
}
