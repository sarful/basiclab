import { COLORS } from "./constants";
import type { Mode, Status } from "./types";

export function getStatus(signal: number, mode: Mode): Status {
  if (mode === "OFF" || signal === 0) {
    return {
      label: "OFF - Valve Closed",
      transistor: "Transistor OFF",
      color: COLORS.muted,
    };
  }

  if (signal <= 30) {
    return {
      label: "SMALL FLOW - Slightly Open",
      transistor: "Partially ON",
      color: COLORS.waterDark,
    };
  }

  if (signal <= 70) {
    return {
      label: "MEDIUM FLOW - Active Control",
      transistor: "Active Region",
      color: COLORS.green,
    };
  }

  return {
    label: "HIGH FLOW - Fully Open",
    transistor: "Fully ON",
    color: "#15803d",
  };
}
