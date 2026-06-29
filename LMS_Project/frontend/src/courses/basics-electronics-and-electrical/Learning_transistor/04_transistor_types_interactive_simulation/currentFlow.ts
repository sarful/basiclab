import { formatNumber } from "./logic";
import type { BjtType, Family, FetChannel, FetType } from "./types";

type CurrentFlowLogicInput = {
  family: Family;
  bjtType: BjtType;
  fetType: FetType;
  fetChannel: FetChannel;
  signal: number;
  gain: number;
  current: number;
  active: boolean;
};

export type CurrentFlowModel = {
  badge: string;
  title: string;
  direction: string;
  path: string;
  carrier: string;
  equation: string;
  explanation: string;
  intensityLabel: string;
  intensityWidth: string;
};

export function buildCurrentFlowModel({
  family,
  bjtType,
  fetType,
  fetChannel,
  signal,
  gain,
  current,
  active,
}: CurrentFlowLogicInput): CurrentFlowModel {
  const intensity = active ? Math.max(8, Math.round(current)) : 0;
  const intensityWidth = `${intensity}%`;

  if (family === "BJT") {
    const path =
      bjtType === "NPN"
        ? "Collector -> Emitter"
        : "Emitter -> Collector";
    const direction =
      bjtType === "NPN"
        ? "Conventional current enters Collector and leaves Emitter."
        : "Conventional current enters Emitter and leaves Collector.";
    const carrier =
      bjtType === "NPN"
        ? "Majority carriers: electrons"
        : "Majority carriers: holes";
    const equation = `IC ~= base drive x gain = ${formatNumber(signal * gain * 0.002, 1)} units`;
    const explanation = active
      ? `Base bias is high enough, so the junction opens a stronger ${path.toLowerCase()} path.`
      : "Base bias is too low, so the collector-emitter path remains nearly off.";

    return {
      badge: active ? "Conventional Current Active" : "Conventional Current Idle",
      title: `${bjtType} Conventional Current Flow`,
      direction,
      path,
      carrier,
      equation,
      explanation,
      intensityLabel: active ? `${intensity}% current level` : "0% current level",
      intensityWidth,
    };
  }

  const isNChannel = fetChannel === "N-Channel";
  const path = isNChannel ? "Drain -> Source" : "Source -> Drain";
  const direction = isNChannel
    ? "Conventional current enters Drain and leaves Source."
    : "Conventional current enters Source and leaves Drain.";
  const carrier = isNChannel
    ? "Majority carriers: electrons"
    : "Majority carriers: holes";
  const equation =
    fetType === "JFET"
      ? `${fetType} conduction ~= gate junction control x channel response = ${formatNumber(current, 1)} units`
      : `${fetType} conduction ~= (gate drive - threshold) x enhancement = ${formatNumber(current, 1)} units`;
  const explanation = active
    ? fetType === "JFET"
      ? "The gate junction is shaping the channel, so drain-source conduction is now visible."
      : "The insulated gate field has crossed threshold and enhanced the channel, so drain-source conduction rises quickly."
    : fetType === "JFET"
      ? "The gate junction is not shaping the channel enough yet, so drain-source current stays low."
      : "The insulated gate field is still below strong enhancement, so the drain-source path stays nearly blocked.";

  return {
    badge: active ? "Conventional Current Active" : "Conventional Current Idle",
    title: `${fetType} ${fetChannel} Current Flow`,
    direction,
    path,
    carrier,
    equation,
    explanation,
    intensityLabel: active ? `${intensity}% current level` : "0% current level",
    intensityWidth,
  };
}
