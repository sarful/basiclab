import type {
  ZenerBiasMode,
  ZenerBreakdownState,
  ZenerLoadCondition,
} from "./zenerBreakdownTypes";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getLoadResistance(loadCondition: ZenerLoadCondition) {
  switch (loadCondition) {
    case "light":
      return 1200;
    case "medium":
      return 680;
    case "heavy":
      return 330;
  }
}

export function getZenerBreakdownState({
  biasMode,
  loadCondition,
  seriesResistance,
  supplyVoltage,
  zenerVoltage,
}: {
  biasMode: ZenerBiasMode;
  loadCondition: ZenerLoadCondition;
  seriesResistance: number;
  supplyVoltage: number;
  zenerVoltage: number;
}): ZenerBreakdownState {
  const loadResistance = getLoadResistance(loadCondition);
  const forwardClampVoltage = 0.72;
  const clampTargetVoltage =
    biasMode === "reverse" ? zenerVoltage : forwardClampVoltage;

  const dividerVoltage =
    supplyVoltage * (loadResistance / (seriesResistance + loadResistance));

  const canClamp = dividerVoltage >= clampTargetVoltage && supplyVoltage > 0;
  const outputVoltage = canClamp ? clampTargetVoltage : dividerVoltage;
  const seriesCurrentMA =
    ((supplyVoltage - outputVoltage) / seriesResistance) * 1000;
  const loadCurrentMA = (outputVoltage / loadResistance) * 1000;
  const diodeCurrentMA = Math.max(0, seriesCurrentMA - loadCurrentMA);
  const isBreakdown = biasMode === "reverse" && canClamp && diodeCurrentMA > 0;
  const isForwardConducting =
    biasMode === "forward" && canClamp && diodeCurrentMA > 0;

  return {
    inputVoltage: supplyVoltage,
    outputVoltage: clamp(outputVoltage, 0, supplyVoltage),
    zenerVoltageActual: clamp(outputVoltage, 0, Math.max(zenerVoltage, supplyVoltage)),
    diodeCurrentMA: clamp(diodeCurrentMA, 0, 250),
    loadCurrentMA: clamp(loadCurrentMA, 0, 250),
    seriesCurrentMA: clamp(seriesCurrentMA, 0, 250),
    loadResistance,
    regulationStatus: isBreakdown
      ? "Reverse Breakdown"
      : isForwardConducting
        ? "Forward Clamp"
        : biasMode === "reverse"
          ? "Reverse Leakage"
          : "Forward Leakage",
    isBreakdown,
    isForwardConducting,
    active: isBreakdown || isForwardConducting,
    reverseRegion: isBreakdown ? "breakdown" : "pre-breakdown",
    biasState: biasMode === "reverse" ? "Reverse Bias" : "Forward Bias",
    clampTargetVoltage,
    diodeDropVoltage:
      biasMode === "reverse" ? zenerVoltage : forwardClampVoltage,
  };
}
