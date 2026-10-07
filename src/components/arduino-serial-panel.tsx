import { useEffect, useState } from "react";
import { Usb, Unplug } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  connectArduino,
  disconnectArduino,
  getSerialState,
  subscribeSerial,
} from "@/lib/arduino-serial";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ArduinoSerialPanel() {
  const addLog = useAppStore((s) => s.addLog);
  const [ser, setSer] = useState(getSerialState);

  useEffect(() => subscribeSerial(() => setSer(getSerialState())), []);

  async function onConnect() {
    addLog("system", "USB serial picker… select the Arduino Uno R3 (often COM3).");
    const ok = await connectArduino();
    const st = getSerialState();
    if (ok) addLog("system", `Arduino linked · ${st.portName} · 9600 baud. ASL now drives the relays.`);
    else if (st.lastError) addLog("error", st.lastError);
  }

  const connected = ser.status === "connected";

  return (
    <section className="flex h-full min-w-0 flex-col rounded-xl border border-border bg-surface p-4 shadow-panel">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">Hardware · USB serial</p>
      <h2 className="mb-1 text-sm font-medium text-fg">Arduino Uno R3</h2>
      <p className="mb-3 text-xs leading-relaxed text-muted">
        Plug the Uno in with a USB cable. Flash <span className="font-mono text-fg">arduino_relay.ino</span>, then
        Connect. Signs send ASCII 1–5 at 9600 baud into the 5V relay module.
      </p>

      <div
        className={cn(
          "mb-3 flex items-center gap-3 rounded-md border px-3 py-2",
          connected ? "border-sage/40 bg-sage/10" : "border-border bg-surface-2",
        )}
      >
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-md",
            connected ? "bg-sage/15 text-sage" : "bg-bg text-muted",
          )}
        >
          {connected ? <Usb className="size-4" strokeWidth={1.75} /> : <Unplug className="size-4" strokeWidth={1.75} />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-fg">
            {connected ? ser.portName || "Arduino Uno R3" : "Not connected"}
          </p>
          <p className="truncate font-mono text-[11px] text-muted">
            {ser.status === "unsupported"
              ? "Web Serial unavailable"
              : connected
                ? "9600 8N1 · D2 D3 D4"
                : "USB · Chrome / Edge"}
          </p>
        </div>
        {connected ? (
          <Button variant="ghost" size="sm" onClick={() => void disconnectArduino()}>
            Disconnect
          </Button>
        ) : (
          <Button size="sm" onClick={() => void onConnect()} disabled={ser.status === "picking" || ser.status === "unsupported"}>
            Connect
          </Button>
        )}
      </div>

      <ul className="mb-3 space-y-1 font-mono text-[11px] text-muted">
        <li>D2 → IN1 · light · jumper</li>
        <li>D3 → IN2 · fan · jumper</li>
        <li>D4 → IN3 · speaker · jumper</li>
        <li>5V / GND → relay VCC / GND</li>
        <li>AC live through COM → NO only</li>
      </ul>

      <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant="secondary" size="sm">
          <a href="/arduino_relay.ino" download>
            Download sketch
          </a>
        </Button>
        <p className="text-[11px] leading-relaxed text-subtle">Never put mains on Arduino pins.</p>
      </div>
    </section>
  );
}
