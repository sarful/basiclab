import type { CircuitState } from "./types";

export const DEFAULT_VOLTAGE = 9;
export const DEFAULT_RESISTANCE = 6;

export function calculateCurrent(
  circuitState: CircuitState,
  voltage: number,
  resistance: number,
) {
  if (circuitState === "open") return 0;
  return resistance <= 0 ? 0 : voltage / resistance;
}

export function getCircuitExplanation(circuitState: CircuitState) {
  if (circuitState === "closed") {
    return "A closed circuit has a complete path, so current can flow from the battery through the components and back again.";
  }

  return "An open circuit has a broken path, so current cannot complete the loop and the components stay off.";
}

