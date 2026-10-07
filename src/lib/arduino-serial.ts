/**
 * Web Serial driver for Arduino Uno R3 at 9600 baud.
 * Sends ASCII '1'–'5' matching the thesis pySerial protocol.
 */

export type SerialStatus = "unsupported" | "idle" | "picking" | "connected" | "error";

type Listener = () => void;
const listeners = new Set<Listener>();

function emit() {
  for (const fn of listeners) fn();
}

export function subscribeSerial(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

type SerialPortLike = {
  readable: ReadableStream<Uint8Array> | null;
  writable: WritableStream<Uint8Array> | null;
  open: (opts: { baudRate: number }) => Promise<void>;
  close: () => Promise<void>;
  getInfo?: () => { usbVendorId?: number; usbProductId?: number };
  addEventListener: (type: string, fn: () => void) => void;
};

let status: SerialStatus =
  typeof navigator !== "undefined" && "serial" in navigator ? "idle" : "unsupported";
let portName = "";
let lastError = "";
let port: SerialPortLike | null = null;
let writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
let readerLoop: Promise<void> | null = null;
let closing = false;

export function getSerialState() {
  return { status, portName, lastError };
}

function setStatus(next: SerialStatus, err = "") {
  status = next;
  lastError = err;
  emit();
}

function labelFor(p: SerialPortLike): string {
  const info = p.getInfo?.() ?? {};
  if (info.usbVendorId === 0x2341) return "Arduino Uno R3";
  if (info.usbVendorId === 0x1a86) return "CH340 · Uno clone";
  if (info.usbVendorId === 0x0403) return "FTDI adapter";
  if (info.usbVendorId) return `USB ${info.usbVendorId.toString(16)}`;
  return "COM port";
}

async function pumpReader(p: SerialPortLike) {
  if (!p.readable) return;
  const reader = p.readable.getReader();
  const decoder = new TextDecoder();
  try {
    while (!closing) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) decoder.decode(value);
    }
  } catch {
    /* port unplugged */
  } finally {
    try {
      reader.releaseLock();
    } catch {
      /* ignore */
    }
  }
}

export async function connectArduino(): Promise<boolean> {
  const nav = navigator as Navigator & {
    serial?: {
      requestPort: (opts?: unknown) => Promise<SerialPortLike>;
    };
  };
  if (!nav.serial) {
    setStatus("unsupported", "This browser cannot open USB serial. Use Chrome or Edge on a computer.");
    return false;
  }

  setStatus("picking");
  try {
    const next = await nav.serial.requestPort();
    await next.open({ baudRate: 9600 });
    port = next;
    writer = next.writable?.getWriter() ?? null;
    portName = labelFor(next);
    closing = false;
    next.addEventListener("disconnect", () => {
      void disconnectArduino();
      setStatus("idle", "USB unplugged.");
    });
    readerLoop = pumpReader(next);
    setStatus("connected");
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Serial request failed.";
    const blocked =
      /not allowed|permissions policy|securityerror|notsupported/i.test(msg) ||
      (err instanceof DOMException && (err.name === "SecurityError" || err.name === "NotSupportedError"));
    if (blocked) {
      setStatus(
        "error",
        "USB serial is blocked inside the preview frame. Open the published app in Chrome, plug in the Uno R3, then Connect.",
      );
    } else if (/cancel|notfound/i.test(msg) || (err instanceof DOMException && err.name === "NotFoundError")) {
      setStatus("idle", "Picker closed.");
    } else {
      setStatus("error", msg);
    }
    return false;
  }
}

export async function disconnectArduino() {
  closing = true;
  try {
    writer?.releaseLock();
  } catch {
    /* ignore */
  }
  writer = null;
  try {
    await port?.close();
  } catch {
    /* ignore */
  }
  port = null;
  portName = "";
  if (status !== "unsupported") setStatus("idle");
}

export async function writeCommand(ch: string): Promise<"ok" | "no-port" | "error"> {
  if (!writer || status !== "connected") return "no-port";
  try {
    await writer.write(new TextEncoder().encode(ch));
    return "ok";
  } catch {
    return "error";
  }
}
