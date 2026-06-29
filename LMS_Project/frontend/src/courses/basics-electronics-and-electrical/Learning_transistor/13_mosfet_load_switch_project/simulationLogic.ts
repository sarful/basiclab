import type {
  NmosLowSideControls,
  NmosLowSideState,
} from "./simulationTypes";

const NMOS_THRESHOLD_V = 2;
const LED_FORWARD_DROP_V = 2;
const NMOS_ON_DROP_V = 0.18;

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function round(value: number, digits = 3) {
  return Number(value.toFixed(digits));
}

export function calculateNmosLowSideState(
  controls: NmosLowSideControls,
): NmosLowSideState {
  const batteryVoltage = clamp(controls.batteryVoltage, 0, 12);
  const rpdOhms = clamp(controls.rpdOhms, 1000, 200000);
  const rLedOhms = clamp(controls.rLedOhms, 100, 5000);
  const flowSpeed = clamp(controls.flowSpeed, 0.5, 3);
  const switchClosed = controls.switchClosed;

  const sourceVoltage = 0;
  const gateVoltage = switchClosed ? batteryVoltage : 0;
  const vgs = gateVoltage - sourceVoltage;
  const isNmosOn = vgs >= NMOS_THRESHOLD_V;

  const loadCurrentA = isNmosOn
    ? Math.max(
        0,
        (batteryVoltage - LED_FORWARD_DROP_V - NMOS_ON_DROP_V) / rLedOhms,
      )
    : 0;
  const loadCurrentMa = loadCurrentA * 1000;
  const drainVoltage = isNmosOn ? NMOS_ON_DROP_V : batteryVoltage;
  const isLedOn = loadCurrentMa > 0.5;
  const gatePathActive = switchClosed;
  const loadPathActive = isNmosOn && loadCurrentMa > 0.001;

  const statusLabel = isNmosOn ? "NMOS ON" : "NMOS OFF";
  const statusDescription = isNmosOn
    ? "Gate rises high enough above the source, so the NMOS low-side path conducts and completes the LED load loop."
    : "Gate is held near source level by the pull-down path, so VGS is too small to turn the NMOS on.";

  return {
    batteryVoltage: round(batteryVoltage, 2),
    rpdOhms: round(rpdOhms, 0),
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
    isNmosOn,
    isLedOn,
    statusLabel,
    statusDescription,
  };
}
