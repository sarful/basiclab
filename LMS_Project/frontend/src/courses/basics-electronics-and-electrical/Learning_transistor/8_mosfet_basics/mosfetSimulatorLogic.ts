import { COMPONENT, MOSFET_LOGIC } from "./mosfetSimulatorConstants";
import type { LoadType, MosfetState } from "./mosfetSimulatorTypes";

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getChannelStrength(vgs: number, vth: number, temperature: number) {
  const tempPenalty = 1 - (temperature - 25) * 0.0025;

  if (vgs <= vth - 0.6) {
    return 0;
  }

  if (vgs < vth) {
    return clamp((vgs - (vth - 0.6)) / 3, 0.02, 0.18);
  }

  return clamp(
    ((vgs - vth) / (MOSFET_LOGIC.maxGateVoltage - vth)) * tempPenalty,
    0,
    1
  );
}

export function getState(
  vgs: number,
  vth: number,
  vds: number,
  strength: number
): MosfetState {
  if (vgs <= vth - 0.6) {
    return "OFF";
  }

  if (vgs < vth || strength < 0.2) {
    return "SUBTHRESHOLD";
  }

  if (vds < vgs - vth) {
    return "LINEAR";
  }

  return "SATURATION";
}

function getLoadMultiplier(loadType: LoadType) {
  if (loadType === "LED") {
    return 0.75;
  }

  if (loadType === "Motor") {
    return 1.25;
  }

  if (loadType === "Lamp") {
    return 1.1;
  }

  return 1;
}

type CalculateDrainCurrentInput = {
  gateVoltage: number;
  thresholdVoltage: number;
  drainVoltage: number;
  loadResistance: number;
  temperature: number;
  loadType: LoadType;
};

export function calculateDrainCurrent(input: CalculateDrainCurrentInput) {
  const strength = getChannelStrength(
    input.gateVoltage,
    input.thresholdVoltage,
    input.temperature
  );

  if (strength <= 0.01) {
    return 0;
  }

  const vov = Math.max(0, input.gateVoltage - input.thresholdVoltage);
  const mosfetLimited = MOSFET_LOGIC.kFactor * vov * vov * strength;
  const loadLimited =
    (input.drainVoltage / input.loadResistance) * getLoadMultiplier(input.loadType);

  return clamp(Math.min(mosfetLimited, loadLimited), 0, 1.5);
}

export function getStateColor(state: MosfetState) {
  if (state === "OFF") {
    return COMPONENT.gray;
  }

  if (state === "SUBTHRESHOLD") {
    return COMPONENT.weakGreen;
  }

  if (state === "LINEAR") {
    return COMPONENT.green;
  }

  return COMPONENT.orange;
}

export function getThermalColor(junctionTemp: number) {
  if (junctionTemp < 45) {
    return COMPONENT.blue;
  }

  if (junctionTemp < 70) {
    return COMPONENT.green;
  }

  if (junctionTemp < 95) {
    return COMPONENT.orange;
  }

  return COMPONENT.red;
}

export function getThermalStatus(junctionTemp: number) {
  if (junctionTemp < 45) {
    return "Cool";
  }

  if (junctionTemp < 70) {
    return "Warm";
  }

  if (junctionTemp < 95) {
    return "Hot";
  }

  return "Critical";
}

export function getVdsSat(vgs: number, vth: number) {
  return Math.max(0, vgs - vth);
}

export function graphPath(
  values: number[],
  x: number,
  y: number,
  width: number,
  height: number,
  max: number
) {
  return values
    .map((value, index) => {
      const px = x + (index / Math.max(1, values.length - 1)) * width;
      const py = y + height - (clamp(value, 0, max) / max) * height;
      return `${index === 0 ? "M" : "L"}${px.toFixed(1)} ${py.toFixed(1)}`;
    })
    .join(" ");
}
