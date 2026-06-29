import {
  clamp,
  computeTransformerSnapshot,
  formatNumber,
} from "../01_transformer_interactive_simulation/logic";

import type {
  TransformerWorkingPrinciplePreset,
  TransformerWorkingPrincipleSnapshot,
  TransformerWorkingPrincipleState,
} from "./transformerWorkingPrincipleTypes";

export const DEFAULT_TRANSFORMER_WORKING_PRINCIPLE_STATE =
  Object.freeze<TransformerWorkingPrincipleState>({
    inputVoltage: 220,
    primaryTurns: 440,
    secondaryTurns: 220,
    frequency: 50,
    flowMode: "conventional",
    showDebugDots: false,
  });

export const TRANSFORMER_WORKING_PRINCIPLE_PRESETS: Record<
  TransformerWorkingPrinciplePreset,
  TransformerWorkingPrincipleState
> = {
  "step-down": {
    inputVoltage: 220,
    primaryTurns: 440,
    secondaryTurns: 220,
    frequency: 50,
    flowMode: "conventional",
    showDebugDots: false,
  },
  "step-up": {
    inputVoltage: 110,
    primaryTurns: 220,
    secondaryTurns: 440,
    frequency: 50,
    flowMode: "conventional",
    showDebugDots: false,
  },
  isolation: {
    inputVoltage: 220,
    primaryTurns: 440,
    secondaryTurns: 440,
    frequency: 50,
    flowMode: "conventional",
    showDebugDots: false,
  },
};

export function applyTransformerWorkingPrinciplePreset(
  preset: TransformerWorkingPrinciplePreset,
) {
  return TRANSFORMER_WORKING_PRINCIPLE_PRESETS[preset];
}

export function deriveTransformerWorkingPrincipleSnapshot(
  state: TransformerWorkingPrincipleState,
): TransformerWorkingPrincipleSnapshot {
  const baseSnapshot = computeTransformerSnapshot(state);
  const ratioDelta = Math.abs(state.secondaryTurns - state.primaryTurns);
  const outputDifference = baseSnapshot.outputVoltage - state.inputVoltage;
  const isIsolation = ratioDelta === 0;
  const lowFlux = baseSnapshot.fluxLevel < 0.32 || state.frequency < 20;
  const inputActive = state.inputVoltage > 0;
  const fluxActive = baseSnapshot.fluxLevel > 0.15;
  const secondaryInduced = inputActive && state.secondaryTurns > 0;
  const isolationConfirmed = state.primaryTurns > 0 && state.secondaryTurns > 0;

  const transformerMode = isIsolation
    ? "ISOLATION"
    : outputDifference > 0
      ? "STEP-UP"
      : "STEP-DOWN";

  const isolationStatus = isIsolation
    ? "Balanced Isolation Transfer"
    : "Isolated Magnetic Coupling";

  const energyDirectionLabel = lowFlux
    ? "Weak magnetic coupling"
    : `Primary AC drives ${transformerMode.toLowerCase()} transfer`;

  const fluxIndicatorLabel = `${formatNumber(baseSnapshot.fluxLevel * 100, 0)}% core excitation`;

  return {
    inputVoltage: state.inputVoltage,
    frequency: state.frequency,
    ...baseSnapshot,
    efficiency: clamp(baseSnapshot.efficiency, 0.55, 0.98),
    transformerMode,
    liveCondition: lowFlux ? "LOW FLUX" : "ACTIVE",
    isolationStatus,
    energyDirectionLabel,
    fluxIndicatorLabel,
    statusBadges: [
      lowFlux ? "LOW FLUX" : "ACTIVE",
      transformerMode,
      "ISOLATED",
    ],
    liveIndicators: {
      inputActive,
      fluxActive,
      secondaryInduced,
      isolationConfirmed,
    },
    stepStates: [
      {
        id: 1,
        title: "AC enters primary winding",
        detail: `${state.inputVoltage}V AC at ${state.frequency}Hz energizes the primary winding.`,
        active: inputActive,
      },
      {
        id: 2,
        title: "Magnetic flux forms in iron core",
        detail: lowFlux
          ? "Flux is present but weak because the drive level is reduced."
          : `Core flux tracks the alternating input and reaches ${formatNumber(
              baseSnapshot.fluxLevel * 100,
              0,
            )}% strength.`,
        active: fluxActive,
      },
      {
        id: 3,
        title: "Secondary voltage is induced",
        detail: `${formatNumber(baseSnapshot.outputVoltage, 1)}V appears across the secondary from turns ratio ${formatNumber(
          baseSnapshot.turnsRatio,
          2,
        )}.`,
        active: secondaryInduced,
      },
    ],
  };
}
