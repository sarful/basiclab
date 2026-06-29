import {
  clamp,
  computeTransformerSnapshot,
  formatNumber,
} from "../01_transformer_interactive_simulation/logic";

import type {
  CenterTapTransformerPreset,
  CenterTapTransformerSnapshot,
  CenterTapTransformerState,
} from "./centerTapTransformerTypes";

export const DEFAULT_CENTER_TAP_TRANSFORMER_STATE =
  Object.freeze<CenterTapTransformerState>({
    inputVoltage: 230,
    primaryTurns: 460,
    upperSecondaryTurns: 115,
    lowerSecondaryTurns: 115,
    frequency: 50,
    flowMode: "conventional",
    showDebugDots: false,
  });

export const CENTER_TAP_TRANSFORMER_PRESETS: Record<
  CenterTapTransformerPreset,
  CenterTapTransformerState
> = {
  "balanced-step-down": {
    inputVoltage: 230,
    primaryTurns: 460,
    upperSecondaryTurns: 115,
    lowerSecondaryTurns: 115,
    frequency: 50,
    flowMode: "conventional",
    showDebugDots: false,
  },
  "balanced-isolation": {
    inputVoltage: 120,
    primaryTurns: 240,
    upperSecondaryTurns: 120,
    lowerSecondaryTurns: 120,
    frequency: 50,
    flowMode: "conventional",
    showDebugDots: false,
  },
  "step-up-center-tap": {
    inputVoltage: 110,
    primaryTurns: 220,
    upperSecondaryTurns: 220,
    lowerSecondaryTurns: 220,
    frequency: 50,
    flowMode: "conventional",
    showDebugDots: false,
  },
};

export function applyCenterTapTransformerPreset(
  preset: CenterTapTransformerPreset,
) {
  return CENTER_TAP_TRANSFORMER_PRESETS[preset];
}

export function deriveCenterTapTransformerSnapshot(
  state: CenterTapTransformerState,
): CenterTapTransformerSnapshot {
  const totalSecondaryTurns =
    state.upperSecondaryTurns + state.lowerSecondaryTurns;
  const baseSnapshot = computeTransformerSnapshot({
    inputVoltage: state.inputVoltage,
    primaryTurns: state.primaryTurns,
    secondaryTurns: totalSecondaryTurns,
    frequency: state.frequency,
  });

  const upperVoltage =
    state.inputVoltage *
    (state.upperSecondaryTurns / Math.max(state.primaryTurns, 1));
  const lowerVoltage =
    state.inputVoltage *
    (state.lowerSecondaryTurns / Math.max(state.primaryTurns, 1));
  const endToEndVoltage = upperVoltage + lowerVoltage;
  const turnsRatioFull = totalSecondaryTurns / Math.max(state.primaryTurns, 1);
  const turnsRatioHalf =
    ((state.upperSecondaryTurns + state.lowerSecondaryTurns) / 2) /
    Math.max(state.primaryTurns, 1);
  const turnsDifference = Math.abs(
    state.upperSecondaryTurns - state.lowerSecondaryTurns,
  );
  const centerTapBalanced = turnsDifference <= 10;
  const centerTapOffsetPercent = clamp(
    turnsDifference /
      Math.max(state.upperSecondaryTurns + state.lowerSecondaryTurns, 1),
    0,
    1,
  );
  const lowFlux = baseSnapshot.fluxLevel < 0.32 || state.frequency < 20;
  const fullDifference = endToEndVoltage - state.inputVoltage;
  const transformerMode =
    Math.abs(fullDifference) < 2
      ? "ISOLATION"
      : fullDifference > 0
        ? "STEP-UP"
        : "STEP-DOWN";

  const inputActive = state.inputVoltage > 0;
  const fluxActive = baseSnapshot.fluxLevel > 0.15;
  const centerTapReady = state.upperSecondaryTurns > 0 && state.lowerSecondaryTurns > 0;
  const outputAvailable = inputActive && centerTapReady;

  const liveCondition = !centerTapBalanced
    ? "UNBALANCED TAP"
    : lowFlux
      ? "LOW FLUX"
      : "ACTIVE";

  const efficiencyPenalty = centerTapBalanced ? 0 : centerTapOffsetPercent * 0.08;
  const efficiency = clamp(baseSnapshot.efficiency - efficiencyPenalty, 0.52, 0.98);

  const energyDirectionLabel = centerTapBalanced
    ? `Balanced center tap delivers +/-${formatNumber(
        upperVoltage,
        1,
      )}V from the midpoint`
    : "Tap is offset because upper and lower turns are not matched";

  return {
    inputVoltage: state.inputVoltage,
    frequency: state.frequency,
    upperVoltage,
    lowerVoltage,
    endToEndVoltage,
    turnsRatioHalf,
    turnsRatioFull,
    fluxLevel: baseSnapshot.fluxLevel,
    efficiency,
    transformerMode,
    liveCondition,
    centerTapBalanced,
    centerTapOffsetPercent,
    energyDirectionLabel,
    statusBadges: [
      liveCondition,
      transformerMode,
      centerTapBalanced ? "CENTER TAP READY" : "TAP OFFSET",
    ],
    liveIndicators: {
      inputActive,
      fluxActive,
      centerTapReady,
      outputAvailable,
    },
    stepStates: [
      {
        id: 1,
        title: "Primary AC energizes the core",
        detail: `${state.inputVoltage}V AC at ${state.frequency}Hz drives the primary winding.`,
        active: inputActive,
      },
      {
        id: 2,
        title: "Flux links both secondary halves",
        detail: centerTapBalanced
          ? "Upper and lower half windings share nearly equal magnetic coupling."
          : "Unequal turns shift the center tap away from a balanced midpoint.",
        active: fluxActive,
      },
      {
        id: 3,
        title: "Center tap creates split secondary output",
        detail: `Top half = ${formatNumber(
          upperVoltage,
          1,
        )}V, bottom half = ${formatNumber(
          lowerVoltage,
          1,
        )}V, end-to-end = ${formatNumber(endToEndVoltage, 1)}V.`,
        active: outputAvailable,
      },
    ],
  };
}
