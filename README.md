# SignHome

SignHome is a local ASL-based home automation interface.

## Core system
- MediaPipe hand tracking
- Gesture classification
- Virtual appliance controls
- Arduino relay/serial integration
- Local guide and calibration tools

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
