import type { DiodeBiasMode, DiodeMode, DiodeVIState } from "./diodeVITypes";

export const VI_CHART = {
  x: 72,
  y: 45,
  width: 410,
  height: 220,
  zeroY: 265,
  minVoltage: -12,
  maxVoltage: 12,
  minCurrentMA: -25,
  maxCurrentMA: 25,
} as const;

const DIODE_PROFILES: Record<
  DiodeMode,
  { thresholdVoltage: number; resistanceOhms: number; leakageMA: number }
> = {
  silicon: { thresholdVoltage: 0.7, resistanceOhms: 470, leakageMA: 0.001 },
  germanium: { thresholdVoltage: 0.3, resistanceOhms: 390, leakageMA: 0.01 },
  schottky: { thresholdVoltage: 0.25, resistanceOhms: 330, leakageMA: 0.02 },
};

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function voltageToX(voltage: number) {
  const ratio = (clamp(voltage, VI_CHART.minVoltage, VI_CHART.maxVoltage) - VI_CHART.minVoltage) /
    (VI_CHART.maxVoltage - VI_CHART.minVoltage);
  return VI_CHART.x + ratio * VI_CHART.width;
}

export function currentToY(currentMA: number) {
  const ratio = (clamp(currentMA, VI_CHART.minCurrentMA, VI_CHART.maxCurrentMA) - VI_CHART.minCurrentMA) /
    (VI_CHART.maxCurrentMA - VI_CHART.minCurrentMA);
  return VI_CHART.zeroY - ratio * VI_CHART.height;
}

export function getDiodeVIState({
  biasMode,
  currentScale,
  diodeMode,
  voltage,
}: {
  biasMode: DiodeBiasMode;
  currentScale: number;
  diodeMode: DiodeMode;
  voltage: number;
}): DiodeVIState {
  const profile = DIODE_PROFILES[diodeMode];
  const signedVoltage = biasMode === "reverse" ? -Math.abs(voltage) : Math.abs(voltage);

  if (signedVoltage < 0) {
    const leakage = -clamp(profile.leakageMA * currentScale * (1 + Math.abs(signedVoltage) / 12), 0, 6);
    return {
      thresholdVoltage: profile.thresholdVoltage,
      voltage: signedVoltage,
      currentMA: leakage,
      region: "reverse-blocked",
      isConducting: false,
    };
  }

  if (signedVoltage <= profile.thresholdVoltage) {
    return {
      thresholdVoltage: profile.thresholdVoltage,
      voltage: signedVoltage,
      currentMA: 0,
      region: "below-threshold",
      isConducting: false,
    };
  }

  const currentMA = clamp(
    ((signedVoltage - profile.thresholdVoltage) / profile.resistanceOhms) * 1000 * currentScale,
    0,
    25,
  );

  return {
    thresholdVoltage: profile.thresholdVoltage,
    voltage: signedVoltage,
    currentMA,
    region: "forward",
    isConducting: true,
  };
}

export function buildDiodeVICurvePath({
  biasMode,
  currentScale,
  diodeMode,
}: {
  biasMode: DiodeBiasMode;
  currentScale: number;
  diodeMode: DiodeMode;
}) {
  const points = Array.from({ length: 180 }, (_, index) => {
    const pointVoltage =
      biasMode === "reverse"
        ? -(index / 179) * Math.abs(VI_CHART.minVoltage)
        : VI_CHART.minVoltage + (index / 179) * (VI_CHART.maxVoltage - VI_CHART.minVoltage);
    const state = getDiodeVIState({
      biasMode: pointVoltage < 0 ? "reverse" : "forward",
      currentScale,
      diodeMode,
      voltage: Math.abs(pointVoltage),
    });

    return {
      x: voltageToX(pointVoltage),
      y: currentToY(state.currentMA),
    };
  });

  return points
    .map((point, index) =>
      index === 0
        ? `M ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
        : `L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`,
    )
    .join(" ");
}
