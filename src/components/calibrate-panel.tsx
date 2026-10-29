import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  canTrainSamples,
  MAX_SAMPLES_PER_GESTURE,
  MIN_SAMPLES_PER_GESTURE,
  sampleCount,
} from "@/lib/classifier";
import { GESTURE_LIST, type GestureId } from "@/lib/gestures";
import { getTrainingMetrics } from "@/lib/random-forest";
import { parseTrainingCsv, serializeSamples } from "@/lib/training-data";
import { useAppStore } from "@/lib/store";

const BURST_MS = 1600;

export function CalibratePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
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
  const [status, setStatus] = useState("Idle");
  const [training, setTraining] = useState(false);
  const [metrics, setMetrics] = useState(getTrainingMetrics);
  const timer = useRef<number>(0);
  const trainingTimer = useRef<number>(0);
  const fileInput = useRef<HTMLInputElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    setMetrics(getTrainingMetrics());
    closeButton.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      window.clearTimeout(trainingTimer.current);
      setCalibrating(null);
    },
    [setCalibrating],
  );

  function capture(id: GestureId) {
    if (cameraStatus !== "live") {
      setStatus("Start the camera before capturing samples.");
      addLog("error", "Start the camera before calibrating.");
      return;
    }
    if (useTrained) {
      setUseTrained(false);
      setMetrics(getTrainingMetrics());
    }
    setBusy(id);
    setCalibrating(id);
    setStatus(`Capturing ${GESTURE_LIST.find((gesture) => gesture.id === id)?.pose ?? id}...`);
    addLog("system", `Collecting ${id} samples… hold the pose.`);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setCalibrating(null);
      setBusy(null);
      const state = useAppStore.getState();
      const n = state.samples[id].length;
      addLog("system", `Saved live samples for ${id} (${n} total).`);
      if (canTrainSamples(state.samples)) {
        setStatus(
          "All five gestures are ready. Select Train / Refit Model to update the classifier.",
        );
      } else {
        setStatus(
          `Saved ${n} ${id} samples. Collect at least ${MIN_SAMPLES_PER_GESTURE} for every gesture to train.`,
        );
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
        setStatus(
          `Imported ${total} samples. Select Train / Refit Model to update the classifier.`,
        );
      } else {
        setStatus(
          `Imported ${total} samples. Collect at least ${MIN_SAMPLES_PER_GESTURE} samples for each gesture before training.`,
        );
      }
      setMetrics(getTrainingMetrics());
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
    if (!canTrainSamples(useAppStore.getState().samples)) {
      setStatus(
        `Collect at least ${MIN_SAMPLES_PER_GESTURE} samples for each gesture before training.`,
      );
      return;
    }
    setTraining(true);
    setStatus("Training...");
    window.clearTimeout(trainingTimer.current);
    trainingTimer.current = window.setTimeout(() => {
      try {
        setUseTrained(true);
        if (!useAppStore.getState().useTrained) {
          throw new Error(
            "The model could not be activated. Check that all gestures have enough samples.",
          );
        }
        setMetrics(getTrainingMetrics());
        setStatus("Model Updated Successfully");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown training error.";
        setStatus(`Training failed: ${message}`);
        addLog("error", `Random Forest training failed: ${message}`);
      } finally {
        setTraining(false);
      }
    }, 50);
  }

  const total = sampleCount(samples);
  const ready = canTrainSamples(samples);

  return (
    <>
      <button
        type="button"
        aria-label="Close training drawer"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/65 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        id="training-drawer"
        role="dialog"
        aria-modal={open}
        aria-labelledby="training-drawer-title"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(100vw,32rem)] flex-col border-r border-border bg-surface shadow-2xl transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">Train</p>
            <h2 id="training-drawer-title" className="mt-1 text-lg font-medium text-fg">
              Random Forest Model Settings &amp; Training
            </h2>
          </div>
          <button
            ref={closeButton}
            type="button"
            aria-label="Close training drawer"
            onClick={onClose}
            className="rounded-md p-2 text-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <span aria-hidden="true" className="text-xl leading-none">
              ×
            </span>
          </button>
        </header>
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <p className="text-sm leading-relaxed text-muted">
            Collect 63-d landmark vectors from MediaPipe Hands to retrain or fine-tune the Random
            Forest classifier locally.
          </p>
          <section
            aria-label="Sample collection"
            className="rounded-xl border border-border bg-surface p-4 shadow-panel"
          >
            <h3 className="mb-1 text-sm font-medium text-fg">Collect landmarks</h3>
            <p className="mb-3 text-xs text-muted">
              Capture each pose with the camera live. Vary hand position and angle for better
              coverage.
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
                        {n}/{MAX_SAMPLES_PER_GESTURE} samples ·{" "}
                        {enough ? "ready" : `${MIN_SAMPLES_PER_GESTURE} needed`}
                      </p>
                    </div>
                    <Button
                      variant={active ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => capture(g.id)}
                      disabled={active || training}
                    >
                      {active ? "Capturing..." : "Capture Sample"}
                    </Button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-xs text-muted">
              {total} total samples ·{" "}
              {useTrained ? "live-trained model active" : "recognition paused until training"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" onClick={train} disabled={!ready || training}>
                {training ? "Training..." : "Train / Refit Model"}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => fileInput.current?.click()}>
                Import CSV
              </Button>
              <Button variant="secondary" size="sm" onClick={exportCsv} disabled={total === 0}>
                Export CSV
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearSamples();
                  setMetrics(getTrainingMetrics());
                  setStatus("Samples discarded. Collect new live samples to train.");
                }}
                disabled={total === 0 || training}
              >
                Discard All Samples
              </Button>
              <input
                ref={fileInput}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(event) => void importCsv(event.currentTarget.files?.[0])}
              />
            </div>
          </section>

          <section
            aria-label="Model training metrics"
            className="rounded-xl border border-border bg-surface p-4 shadow-panel"
          >
            <h3 className="text-sm font-medium text-fg">Model status &amp; metrics</h3>
            <p className="mt-1 text-xs text-muted" role="status" aria-live="polite">
              {status}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs">
              <div>
                <dt className="text-muted">Validation accuracy</dt>
                <dd className="mt-1 font-mono text-fg tabular-nums">
                  {metrics.accuracy === null
                    ? "Not available"
                    : `${(metrics.accuracy * 100).toFixed(1)}%`}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Trees</dt>
                <dd className="mt-1 font-mono text-fg tabular-nums">{metrics.trees}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted">Last trained</dt>
                <dd className="mt-1 font-mono text-fg tabular-nums">
                  {metrics.lastTrainedAt
                    ? new Date(metrics.lastTrainedAt).toLocaleString()
                    : "Not trained this session"}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-[11px] leading-relaxed text-subtle">
              Accuracy is measured on a held-out portion of your captured samples.
            </p>
          </section>
        </div>
      </aside>
    </>
  );
}
