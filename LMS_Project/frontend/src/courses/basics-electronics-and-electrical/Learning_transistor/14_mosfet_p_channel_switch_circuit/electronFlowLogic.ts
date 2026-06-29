"use client";

import type { PmosCurrentFlowMode } from "./simulationTypes";

export type PmosFlowPoint = {
  x: number;
  y: number;
};

export type PmosFlowTerminals = {
  sourcePositiveTerminal: PmosFlowPoint;
  sourceNegativeTerminal: PmosFlowPoint;
  gateResistorTop: PmosFlowPoint;
  gateResistorBottom: PmosFlowPoint;
  switchTop: PmosFlowPoint;
  switchBottom: PmosFlowPoint;
  ledResistorTop: PmosFlowPoint;
  ledResistorBottom: PmosFlowPoint;
  ledTop: PmosFlowPoint;
  ledBottom: PmosFlowPoint;
  mosfetGate: PmosFlowPoint;
  mosfetDrain: PmosFlowPoint;
  mosfetSource: PmosFlowPoint;
  gateNode: PmosFlowPoint;
};

export function reversePath(points: readonly PmosFlowPoint[]) {
  return [...points].reverse();
}

function samePoint(a: PmosFlowPoint, b: PmosFlowPoint) {
  return a.x === b.x && a.y === b.y;
}

export function joinWireSegments(
  ...segments: ReadonlyArray<readonly PmosFlowPoint[]>
) {
  const points: PmosFlowPoint[] = [];

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

export function buildPmosFlowPaths(
  paths: {
    gatePath: readonly PmosFlowPoint[];
    loadPath: readonly PmosFlowPoint[];
  },
  flowMode: PmosCurrentFlowMode,
) {
  return {
    gatePath:
      flowMode === "electron" ? reversePath(paths.gatePath) : [...paths.gatePath],
    loadPath:
      flowMode === "electron" ? reversePath(paths.loadPath) : [...paths.loadPath],
  };
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function buildPmosFlowVisualState({
  flowSpeed,
  loadCurrentMa,
  loadPathActive,
}: {
  flowSpeed: number;
  loadCurrentMa: number;
  loadPathActive: boolean;
}) {
  const speedFactor = clamp(flowSpeed, 0.5, 3);
  const loadStrength = clamp(loadCurrentMa / 6, 0, 1);
  const flowPercent = clamp((loadCurrentMa / 5) * 100, 0, 100);

  return {
    loadHighlightOpacity: loadPathActive
      ? clamp(0.12 + loadStrength * 0.12, 0.12, 0.24)
      : 0,
    loadPulseCount: loadPathActive
      ? 9
      : 0,
    loadDuration: `${clamp(3.2 / speedFactor - flowPercent / 40, 0.7, 4.8).toFixed(2)}s`,
    loadRadius: clamp(3.6 + loadStrength * 0.8, 3.6, 4.4),
    loadStagger: 0.22,
  };
}
