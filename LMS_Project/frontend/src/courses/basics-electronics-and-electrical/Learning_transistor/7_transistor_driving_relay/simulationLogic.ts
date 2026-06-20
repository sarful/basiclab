import type {
  RelayDriverControls,
  RelayDriverState,
} from "./simulationTypes";

const VBE_ON_V = 0.7;
const TRANSISTOR_CURRENT_GAIN = 80;
const RELAY_COIL_OHMS = 120;
const LAMP_RESISTANCE_OHMS = 100;

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function round(value: number, digits = 3) {
  return Number(value.toFixed(digits));
}

export function calculateRelayDriverState(
  controls: RelayDriverControls,
): RelayDriverState {
  const dcVoltage = clamp(controls.dcVoltage, 0, 12);
  const acVoltage = clamp(controls.acVoltage, 0, 12);
  const baseResistorOhms = clamp(controls.baseResistorOhms, 100, 100000);
  const flowSpeed = clamp(controls.flowSpeed, 0.5, 3);
  const switchClosed = controls.switchClosed;

  const baseCurrentA = switchClosed
    ? Math.max(0, (dcVoltage - VBE_ON_V) / baseResistorOhms)
    : 0;
  const baseCurrentMa = baseCurrentA * 1000;

  const maxCollectorCurrentA = baseCurrentA * TRANSISTOR_CURRENT_GAIN;
  const idealCoilCurrentA = dcVoltage / RELAY_COIL_OHMS;
  const transistorOn = baseCurrentA > 0.00002;
  const coilCurrentA = transistorOn
    ? Math.min(idealCoilCurrentA, maxCollectorCurrentA)
    : 0;
  const coilCurrentMa = coilCurrentA * 1000;
  const relayEnergized = coilCurrentMa >= 8;
  const contactClosedToNo = relayEnergized;

  const lampCurrentA = contactClosedToNo ? acVoltage / LAMP_RESISTANCE_OHMS : 0;
  const lampOn = lampCurrentA > 0.005;

  const statusLabel = relayEnergized ? "RELAY ON" : "RELAY OFF";
  const statusDescription = relayEnergized
    ? "Switch closes the base path, the transistor conducts, relay coil energizes, and the COM contact moves to the NO side."
    : "Switch is open, so base drive is missing, the transistor stays off, the relay coil is de-energized, and the COM contact returns to the NC side.";

  return {
    dcVoltage: round(dcVoltage, 2),
    acVoltage: round(acVoltage, 2),
    baseResistorOhms: round(baseResistorOhms, 0),
    flowSpeed: round(flowSpeed, 2),
    switchClosed,
    flowMode: controls.flowMode,
    baseCurrentMa: round(baseCurrentMa, 3),
    coilCurrentMa: round(coilCurrentMa, 3),
    transistorOn,
    relayEnergized,
    contactClosedToNo,
    lampOn,
    statusLabel,
    statusDescription,
    relayContactLabel: relayEnergized ? "COM -> NO" : "COM -> NC",
    coilPathActive: transistorOn && coilCurrentMa > 0.1,
    loadPathActive: contactClosedToNo && lampOn,
  };
}
