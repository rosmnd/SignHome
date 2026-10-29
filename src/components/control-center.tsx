import { useCallback, useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { ApplianceRail } from "@/components/appliance-rail";
import { ArduinoPins } from "@/components/arduino-pins";
import { ArduinoSerialPanel } from "@/components/arduino-serial-panel";
import { CalibratePanel } from "@/components/calibrate-panel";
import { CameraStage } from "@/components/camera-stage";
import { LandmarkInspector } from "@/components/landmark-inspector";
import { PoseKeys } from "@/components/pose-keys";
import { SerialConsole } from "@/components/serial-console";
import { SettingsPanel } from "@/components/settings-panel";
import { VirtualHome } from "@/components/virtual-home";
import { useHandTracker } from "@/hooks/use-hand-tracker";
import { useKeys } from "@/hooks/use-keys";
import { useAppStore } from "@/lib/store";

export function ControlCenter() {
  useKeys();
  const tracker = useHandTracker();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const addLog = useAppStore((s) => s.addLog);
  const live = useAppStore((s) => s.cameraStatus === "live");
  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    menuButton.current?.focus();
  }, []);

  useEffect(() => {
    void Promise.resolve(useAppStore.persist.rehydrate()).then(() => {
      const state = useAppStore.getState();
      if (state.useTrained) state.setUseTrained(true);
      if (useAppStore.getState().logs.length === 0) {
        addLog("system", "SignHome control center ready. Local processing only.", "offline");
      }
    });
  }, [addLog]);

  return (
    <>
      <button
        ref={menuButton}
        type="button"
        aria-label="Toggle training drawer"
        aria-expanded={drawerOpen}
        aria-controls="training-drawer"
        onClick={() => setDrawerOpen((open) => !open)}
        className="fixed left-3 top-1/2 z-30 -translate-y-1/2 rounded-md border border-border bg-surface/90 p-2 text-fg shadow-panel transition-colors hover:bg-surface-2 sm:left-5"
      >
        <Menu aria-hidden="true" size={22} />
      </button>
      <CalibratePanel open={drawerOpen} onClose={closeDrawer} />
      <div className="mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-4 px-4 py-5 sm:px-6 sm:py-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-fg sm:text-3xl">
            Control center
          </h1>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
            MediaPipe Hands extracts 21 landmarks (63 features). Five static ASL letters — L, A, F,
            V, W — map onto a 5V relay on Arduino Uno R3. Local, offline, no GPU.
          </p>
        </div>

        <div className="grid w-full min-w-0 items-stretch gap-4 lg:grid-cols-2">
          <CameraStage
            videoRef={tracker.videoRef}
            canvasRef={tracker.canvasRef}
            hands={tracker.hands}
            onStart={tracker.start}
            onStop={tracker.stop}
          />
          <VirtualHome />
        </div>

        <div className="grid w-full min-w-0 items-start gap-4 lg:grid-cols-2">
          <ApplianceRail />
          <PoseKeys />
        </div>

        <LandmarkInspector hands={tracker.hands} live={live} />

        <div className="grid w-full min-w-0 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
          <SerialConsole />
          <div className="flex flex-col gap-4">
            <ArduinoSerialPanel />
            <ArduinoPins />
            <SettingsPanel />
          </div>
        </div>
      </div>
    </>
  );
}
