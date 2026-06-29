"use client";

import type { NmosCurrentFlowMode } from "./simulationTypes";

export type NmosFlowPoint = { x: number; y: number };

export function reversePath(points: readonly NmosFlowPoint[]) {
  return [...points].reverse();
}

function samePoint(a: NmosFlowPoint, b: NmosFlowPoint) {
  return a.x === b.x && a.y === b.y;
}

export function joinWireSegments(
  ...segments: ReadonlyArray<readonly NmosFlowPoint[]>
) {
  const points: NmosFlowPoint[] = [];

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

export function buildNmosFlowPaths(
  paths: {
    loadPath: readonly NmosFlowPoint[];
  },
  flowMode: NmosCurrentFlowMode,
) {
  return {
    loadPath:
      flowMode === "electron" ? reversePath(paths.loadPath) : [...paths.loadPath],
  };
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function buildNmosFlowVisualState({
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
    loadPulseCount: loadPathActive ? 9 : 0,
    loadDuration: `${clamp(3.2 / speedFactor - flowPercent / 40, 0.7, 4.8).toFixed(2)}s`,
    loadRadius: clamp(3.6 + loadStrength * 0.8, 3.6, 4.4),
    loadStagger: 0.22,
  };
}
