import type {
  PmosHighSideControls,
  PmosHighSideState,
} from "./simulationTypes";

const PMOS_THRESHOLD_V = 2;
const LED_FORWARD_DROP_V = 2;
const PMOS_ON_DROP_V = 0.2;

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function round(value: number, digits = 3) {
  return Number(value.toFixed(digits));
}

export function calculatePmosHighSideState(
  controls: PmosHighSideControls,
): PmosHighSideState {
  const batteryVoltage = clamp(controls.batteryVoltage, 0, 12);
  const rpuOhms = clamp(controls.rpuOhms, 100, 200000);
  const rLedOhms = clamp(controls.rLedOhms, 100, 5000);
  const flowSpeed = clamp(controls.flowSpeed, 0.5, 3);
  const switchClosed = controls.switchClosed;

  const sourceVoltage = batteryVoltage;
  const gateVoltage = switchClosed ? 0 : batteryVoltage;
  const vgs = gateVoltage - sourceVoltage;
  const isPmosOn = vgs <= -PMOS_THRESHOLD_V;

  const loadCurrentA = isPmosOn
    ? Math.max(0, (batteryVoltage - LED_FORWARD_DROP_V - PMOS_ON_DROP_V) / rLedOhms)
    : 0;
  const loadCurrentMa = loadCurrentA * 1000;
  const isLedOn = loadCurrentMa > 0.5;
  const drainVoltage = isPmosOn ? batteryVoltage - PMOS_ON_DROP_V : batteryVoltage;
  const gatePathActive = switchClosed;
  const loadPathActive = isPmosOn && loadCurrentMa > 0.001;

  const statusLabel = isPmosOn ? "PMOS ON" : "PMOS OFF";
  const statusDescription = isPmosOn
    ? "Gate is pulled low enough below the source, so the PMOS high-side path conducts and powers the LED branch."
    : "Gate is near the source voltage, so VGS is not negative enough to turn the PMOS on.";

  return {
    batteryVoltage: round(batteryVoltage, 2),
    rpuOhms: round(rpuOhms, 0),
    rLedOhms: round(rLedOhms, 0),
    flowSpeed: round(flowSpeed, 2),
    switchClosed,
    flowMode: controls.flowMode,
    sourceVoltage: round(sourceVoltage, 2),
    gateVoltage: round(gateVoltage, 2),
    drainVoltage: round(drainVoltage, 2),
    vgs: round(vgs, 2),
    loadCurrentMa: round(loadCurrentMa, 3),
    gatePathActive,
    loadPathActive,
    isPmosOn,
    isLedOn,
    statusLabel,
    statusDescription,
  };
}
