import { useEffect } from "react";
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
  const addLog = useAppStore((s) => s.addLog);
  const live = useAppStore((s) => s.cameraStatus === "live");

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
    <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 sm:py-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-fg sm:text-3xl">Control center</h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
          Train a Random Forest from your live MediaPipe landmarks to recognize five static ASL gestures.
          Training and predictions stay on this device; export labeled samples as CSV.
        </p>
      </div>

      <div className="grid w-full min-w-0 items-start gap-4 lg:grid-cols-2 lg:grid-rows-2">
        <div className="flex min-w-0 flex-col gap-4 lg:row-span-2">
          <CalibratePanel />
          <div className="flex min-w-0 flex-col gap-4">
            <ApplianceRail />
            <PoseKeys />
          </div>
        </div>
        <CameraStage
          videoRef={tracker.videoRef}
          canvasRef={tracker.canvasRef}
          hands={tracker.hands}
          onStart={tracker.start}
          onStop={tracker.stop}
        />
        <VirtualHome />
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
  );
}
