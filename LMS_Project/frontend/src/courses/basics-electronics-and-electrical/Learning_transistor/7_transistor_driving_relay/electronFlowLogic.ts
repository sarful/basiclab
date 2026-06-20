"use client";

import type { RelayCurrentFlowMode } from "./simulationTypes";

export type RelayFlowPoint = { x: number; y: number };

function samePoint(a: RelayFlowPoint, b: RelayFlowPoint) {
  return a.x === b.x && a.y === b.y;
}

export function reversePath(points: readonly RelayFlowPoint[]) {
  return [...points].reverse();
}

export function joinWireSegments(
  ...segments: ReadonlyArray<readonly RelayFlowPoint[]>
) {
  const points: RelayFlowPoint[] = [];

  for (const segment of segments) {
    for (const point of segment) {
      const previousPoint = points[points.length - 1];
      if (!previousPoint || !samePoint(previousPoint, point)) {
        points.push(point);
      }
    }
  }

  return points;
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function buildRelayFlowPaths(
  paths: {
    coilPath: readonly RelayFlowPoint[];
    loadPath: readonly RelayFlowPoint[];
  },
  flowMode: RelayCurrentFlowMode,
) {
  return {
    coilPath:
      flowMode === "electron" ? reversePath(paths.coilPath) : [...paths.coilPath],
    loadPath:
      flowMode === "electron" ? reversePath(paths.loadPath) : [...paths.loadPath],
  };
}

export function buildRelayFlowVisualState({
  flowSpeed,
  coilCurrentMa,
  lampOn,
  coilPathActive,
  loadPathActive,
}: {
  flowSpeed: number;
  coilCurrentMa: number;
  lampOn: boolean;
  coilPathActive: boolean;
  loadPathActive: boolean;
}) {
  const speedFactor = clamp(flowSpeed, 0.5, 3);
  const coilStrength = clamp(coilCurrentMa / 50, 0, 1);

  return {
    coilPulseCount: coilPathActive ? 8 : 0,
    coilDuration: `${clamp(2.6 / speedFactor, 0.7, 4).toFixed(2)}s`,
    coilRadius: clamp(3.5 + coilStrength, 3.5, 4.8),
    loadPulseCount: loadPathActive ? 7 : 0,
    loadDuration: `${clamp(2.8 / speedFactor, 0.7, 4.2).toFixed(2)}s`,
    loadRadius: lampOn ? 4.2 : 0,
    pulseGap: 0.22,
  };
}
