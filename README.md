# SignHome

SignHome is a local ASL-based home automation interface.

## Core system
- MediaPipe hand tracking
- Gesture classification
- Virtual appliance controls
- Arduino relay/serial integration
- Local guide and calibration tools

## Live gesture training

Start the camera and capture examples for each supported gesture in the control center. Collect at
least 10 samples per gesture, varying hand position and angle between captures, then train the
Random Forest on those labeled MediaPipe landmark features. Training data is stored locally in the
browser; use the calibration panel to export it as CSV or import a compatible CSV
(`label,x0,...,x62`). Imported files replace the current sample set. Gesture recognition remains
paused until a live-trained model is available.

## Run locally

```bash
npm install
npm run dev
```

The development server runs on `http://localhost:8080`.

## Build

```bash
npm run typecheck
npm run build
```

This version is intentionally independent of external AI/authentication platforms. No external API key is required for the core gesture and appliance-control workflow.
