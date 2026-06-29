import { COMPONENT, MOSFET_LOGIC } from "./enhancementMosfetConstants";
import type { RegionState } from "./enhancementMosfetTypes";

export function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function getVdsSat(vgs: number, vth: number) {
  return Math.max(0, vgs - vth);
}

export function getChannelStrength(vgs: number, vth: number, temperature: number) {
  const tempPenalty = 1 - (temperature - 25) * 0.002;
  if (vgs < vth) return 0;
  return clamp(((vgs - vth) / (MOSFET_LOGIC.maxGateVoltage - vth)) * tempPenalty, 0, 1);
}

export function getRegionState(
  vgs: number,
  vth: number,
  vds: number,
  strength: number
): RegionState {
  const vdsSat = getVdsSat(vgs, vth);

  if (vgs < vth) return "OFF";
  if (Math.abs(vgs - vth) < 0.25) return "THRESHOLD";
  if (strength < 0.25) return "CHANNEL FORMATION";
  if (vds < vdsSat) return "LINEAR REGION";
  return "SATURATION REGION";
}

export function calculateDrainCurrent({
  gateVoltage,
  thresholdVoltage,
  drainVoltage,
  loadResistance,
  temperature,
}: {
  gateVoltage: number;
  thresholdVoltage: number;
  drainVoltage: number;
  loadResistance: number;
  temperature: number;
}) {
  const strength = getChannelStrength(gateVoltage, thresholdVoltage, temperature);
  if (strength <= 0) return 0;

  const vov = Math.max(0, gateVoltage - thresholdVoltage);
  const vdsSat = getVdsSat(gateVoltage, thresholdVoltage);

  const linearCurrent =
    MOSFET_LOGIC.kFactor * ((vov * drainVoltage) - drainVoltage ** 2 / 2) * strength;

  const saturationCurrent = MOSFET_LOGIC.kFactor * (vov ** 2 / 2) * strength;

  const mosfetLimited =
    drainVoltage < vdsSat ? Math.max(0, linearCurrent) : Math.max(0, saturationCurrent);

  const loadLimited = drainVoltage / loadResistance;

  return clamp(Math.min(mosfetLimited, loadLimited), 0, 1.5);
}

export function getStateColor(state: RegionState) {
  if (state === "OFF") return COMPONENT.gray;
  if (state === "THRESHOLD") return COMPONENT.weakGreen;
  if (state === "CHANNEL FORMATION") return COMPONENT.blue;
  if (state === "LINEAR REGION") return COMPONENT.green;
  return COMPONENT.orange;
}

export function getThermalColor(junctionTemp: number) {
  if (junctionTemp < 45) return COMPONENT.blue;
  if (junctionTemp < 70) return COMPONENT.green;
  if (junctionTemp < 95) return COMPONENT.orange;
  return COMPONENT.red;
}

export function graphPath(
  values: number[],
  x: number,
  y: number,
  w: number,
  h: number,
  max: number
) {
  return values
    .map((v, i) => {
      const px = x + (i / Math.max(1, values.length - 1)) * w;
      const py = y + h - (clamp(v, 0, max) / max) * h;
      return `${i === 0 ? "M" : "L"}${px.toFixed(1)} ${py.toFixed(1)}`;
    })
    .join(" ");
}
