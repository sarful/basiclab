import type { MultimeterJackId } from "./DigitalMultimeterProbeJacks";
import type { MultimeterDialStopId } from "./DigitalMultimeterRotaryDial";

const MICRO = "\u03bc";
const OMEGA = "\u03a9";

export type MultimeterMeasurementFamily =
  | "off"
  | "dc_voltage"
  | "ac_voltage"
  | "dc_current"
  | "resistance"
  | "diode";

export type MultimeterSeverity = "ok" | "warning" | "danger";

export type MultimeterModeDefinition = {
  description: string;
  displayUnit: string;
  family: MultimeterMeasurementFamily;
  id: MultimeterDialStopId;
  label: string;
  leadPlacementHint: string;
  rangeLabel: string;
  requiredBlackJack: MultimeterJackId;
  requiredRedJack: MultimeterJackId;
  safetyMessage: string;
  severity: MultimeterSeverity;
};

export type MultimeterModeValidation = {
  isBlackJackCorrect: boolean;
  isRedJackCorrect: boolean;
  isSetupCorrect: boolean;
  message: string;
  mode: MultimeterModeDefinition;
  severity: MultimeterSeverity;
};

export const multimeterModeDefinitions: Record<
  MultimeterDialStopId,
  MultimeterModeDefinition
> = {
  off: {
    id: "off",
    family: "off",
    label: "OFF",
    rangeLabel: "Meter power off",
    displayUnit: "",
    description:
      "The meter is not actively measuring. Use this as the safe resting position when the meter is not in use.",
    requiredBlackJack: "jack_com",
    requiredRedJack: "jack_voma",
    leadPlacementHint: `Leave the black lead in COM and keep the red lead in V${OMEGA}mA unless a current test is about to begin.`,
    safetyMessage: "Safe resting position before storing or changing setups.",
    severity: "ok",
  },
  dcv_1000: {
    id: "dcv_1000",
    family: "dc_voltage",
    label: "DCV 1000",
    rangeLabel: "1000V DC range",
    displayUnit: "V",
    description: "High-range DC voltage measurement.",
    requiredBlackJack: "jack_com",
    requiredRedJack: "jack_voma",
    leadPlacementHint: "Place the probes across the DC source or component.",
    safetyMessage: `Use the V${OMEGA}mA jack. Voltage is measured across two points, not in series.`,
    severity: "ok",
  },
  dcv_200: {
    id: "dcv_200",
    family: "dc_voltage",
    label: "DCV 200",
    rangeLabel: "200V DC range",
    displayUnit: "V",
    description: "General DC voltage range for many training examples.",
    requiredBlackJack: "jack_com",
    requiredRedJack: "jack_voma",
    leadPlacementHint: "Measure across the battery, supply, or component.",
    safetyMessage: `Use COM and V${OMEGA}mA for voltage checks.`,
    severity: "ok",
  },
  dcv_20: {
    id: "dcv_20",
    family: "dc_voltage",
    label: "DCV 20",
    rangeLabel: "20V DC range",
    displayUnit: "V",
    description:
      "Common range for low-voltage electronics, batteries, and breadboard circuits.",
    requiredBlackJack: "jack_com",
    requiredRedJack: "jack_voma",
    leadPlacementHint:
      "This is a practical beginner range for 3V, 5V, 9V, and 12V style checks.",
    safetyMessage:
      "Good beginner DC voltage range. Probes go across the test points.",
    severity: "ok",
  },
  dcv_2000m: {
    id: "dcv_2000m",
    family: "dc_voltage",
    label: "DCV 2000m",
    rangeLabel: "2000mV DC range",
    displayUnit: "mV",
    description: "Millivolt range for very small DC signals.",
    requiredBlackJack: "jack_com",
    requiredRedJack: "jack_voma",
    leadPlacementHint: "Use for low-level DC measurements.",
    safetyMessage: `Still a voltage mode, so use COM and V${OMEGA}mA and measure across the points.`,
    severity: "ok",
  },
  dcv_200m: {
    id: "dcv_200m",
    family: "dc_voltage",
    label: "DCV 200m",
    rangeLabel: "200mV DC range",
    displayUnit: "mV",
    description: "Very low DC millivolt measurement range.",
    requiredBlackJack: "jack_com",
    requiredRedJack: "jack_voma",
    leadPlacementHint: "Use only for tiny DC signal checks.",
    safetyMessage: `Very sensitive voltage range. Keep the red lead in V${OMEGA}mA.`,
    severity: "ok",
  },
  acv_750: {
    id: "acv_750",
    family: "ac_voltage",
    label: "ACV 750",
    rangeLabel: "750V AC range",
    displayUnit: "V",
    description: "High AC voltage range.",
    requiredBlackJack: "jack_com",
    requiredRedJack: "jack_voma",
    leadPlacementHint: "Measure across the AC source or AC terminals.",
    safetyMessage: `AC voltage also uses COM and V${OMEGA}mA. Never switch to the current jack for a voltage reading.`,
    severity: "warning",
  },
  acv_200: {
    id: "acv_200",
    family: "ac_voltage",
    label: "ACV 200",
    rangeLabel: "200V AC range",
    displayUnit: "V",
    description: "Lower AC voltage range for smaller AC training examples.",
    requiredBlackJack: "jack_com",
    requiredRedJack: "jack_voma",
    leadPlacementHint: "Measure across the AC points, not in series.",
    safetyMessage:
      "Use the voltage jack. Treat AC work carefully and verify range first.",
    severity: "warning",
  },
  dca_200u: {
    id: "dca_200u",
    family: "dc_current",
    label: "DCA 200u",
    rangeLabel: `200${MICRO}A DC current range`,
    displayUnit: `${MICRO}A`,
    description: "Very small DC current measurement range.",
    requiredBlackJack: "jack_com",
    requiredRedJack: "jack_voma",
    leadPlacementHint:
      "Current is measured in series through the path. Open the path and insert the meter.",
    safetyMessage:
      "This is a current mode. Do not place the probes directly across a battery or power supply.",
    severity: "danger",
  },
  dca_2000u: {
    id: "dca_2000u",
    family: "dc_current",
    label: "DCA 2000u",
    rangeLabel: `2000${MICRO}A DC current range`,
    displayUnit: `${MICRO}A`,
    description: "Low microamp current range.",
    requiredBlackJack: "jack_com",
    requiredRedJack: "jack_voma",
    leadPlacementHint: "Break the circuit and place the meter in series.",
    safetyMessage:
      "Current mode requires series placement. Never use it like a voltage check.",
    severity: "danger",
  },
  dca_20m: {
    id: "dca_20m",
    family: "dc_current",
    label: "DCA 20m",
    rangeLabel: "20mA DC current range",
    displayUnit: "mA",
    description: "Small milliamp current range.",
    requiredBlackJack: "jack_com",
    requiredRedJack: "jack_voma",
    leadPlacementHint: "Use for low-current circuit paths in series.",
    safetyMessage:
      "This is still current mode. Measure through the path, not across the source.",
    severity: "danger",
  },
  dca_200m: {
    id: "dca_200m",
    family: "dc_current",
    label: "DCA 200m",
    rangeLabel: "200mA DC current range",
    displayUnit: "mA",
    description: "Higher milliamp range for DC current.",
    requiredBlackJack: "jack_com",
    requiredRedJack: "jack_voma",
    leadPlacementHint: "Insert the meter into the circuit path in series.",
    safetyMessage: "A wrong connection in current mode can short the source.",
    severity: "danger",
  },
  dca_10a: {
    id: "dca_10a",
    family: "dc_current",
    label: "DCA 10A",
    rangeLabel: "10A DC current range",
    displayUnit: "A",
    description: "High DC current range that uses the separate 10A jack.",
    requiredBlackJack: "jack_com",
    requiredRedJack: "jack_10a",
    leadPlacementHint:
      "Move the red lead to the 10A jack and place the meter in series.",
    safetyMessage:
      "High-current mode. Only use the 10A jack when the task really requires it.",
    severity: "danger",
  },
  ohm_2000k: {
    id: "ohm_2000k",
    family: "resistance",
    label: `${OMEGA} 2000k`,
    rangeLabel: `2000k${OMEGA} resistance range`,
    displayUnit: OMEGA,
    description: "High resistance measurement range.",
    requiredBlackJack: "jack_com",
    requiredRedJack: "jack_voma",
    leadPlacementHint:
      "Touch the probes to both ends of the unpowered component.",
    safetyMessage: "Resistance must be measured with power off.",
    severity: "warning",
  },
  ohm_200k: {
    id: "ohm_200k",
    family: "resistance",
    label: `${OMEGA} 200k`,
    rangeLabel: `200k${OMEGA} resistance range`,
    displayUnit: OMEGA,
    description: "Mid-high resistance range.",
    requiredBlackJack: "jack_com",
    requiredRedJack: "jack_voma",
    leadPlacementHint:
      "Measure across the component only after removing power.",
    safetyMessage: "Do not check resistance on a live circuit.",
    severity: "warning",
  },
  ohm_20k: {
    id: "ohm_20k",
    family: "resistance",
    label: `${OMEGA} 20k`,
    rangeLabel: `20k${OMEGA} resistance range`,
    displayUnit: OMEGA,
    description: "General resistance range for many beginner resistor examples.",
    requiredBlackJack: "jack_com",
    requiredRedJack: "jack_voma",
    leadPlacementHint:
      "Probe the unpowered resistor from one end to the other.",
    safetyMessage: "Power must be off before using an ohms range.",
    severity: "warning",
  },
  ohm_2000: {
    id: "ohm_2000",
    family: "resistance",
    label: `${OMEGA} 2000`,
    rangeLabel: `2000${OMEGA} resistance range`,
    displayUnit: OMEGA,
    description: "Useful for common low-value resistors.",
    requiredBlackJack: "jack_com",
    requiredRedJack: "jack_voma",
    leadPlacementHint:
      "Use with the resistor disconnected from live power.",
    safetyMessage: "Resistance checks are power-off measurements.",
    severity: "warning",
  },
  ohm_200: {
    id: "ohm_200",
    family: "resistance",
    label: `${OMEGA} 200`,
    rangeLabel: `200${OMEGA} resistance range`,
    displayUnit: OMEGA,
    description: "Low resistance range.",
    requiredBlackJack: "jack_com",
    requiredRedJack: "jack_voma",
    leadPlacementHint:
      "Good for low-value resistors or continuity-like resistance checks.",
    safetyMessage: "Make sure the component is not powered.",
    severity: "warning",
  },
  diode: {
    id: "diode",
    family: "diode",
    label: "Diode test",
    rangeLabel: "Diode / continuity-style function",
    displayUnit: "V",
    description: "Diode forward-drop style check on an unpowered component.",
    requiredBlackJack: "jack_com",
    requiredRedJack: "jack_voma",
    leadPlacementHint:
      "Touch the probes to the component leads with power removed.",
    safetyMessage: "Use only on an unpowered component under test.",
    severity: "warning",
  },
};

export const multimeterModes = Object.values(multimeterModeDefinitions);

export function getMultimeterMode(
  dialStopId: MultimeterDialStopId,
): MultimeterModeDefinition {
  return multimeterModeDefinitions[dialStopId];
}

export function getModesByFamily(
  family: MultimeterMeasurementFamily,
): MultimeterModeDefinition[] {
  return multimeterModes.filter((mode) => mode.family === family);
}

export function isCurrentMode(dialStopId: MultimeterDialStopId) {
  return multimeterModeDefinitions[dialStopId].family === "dc_current";
}

export function requiresTenAmpJack(dialStopId: MultimeterDialStopId) {
  return multimeterModeDefinitions[dialStopId].requiredRedJack === "jack_10a";
}

export function validateMultimeterLeadSetup({
  blackLeadJack,
  dialStopId,
  redLeadJack,
}: {
  blackLeadJack: MultimeterJackId;
  dialStopId: MultimeterDialStopId;
  redLeadJack: MultimeterJackId;
}): MultimeterModeValidation {
  const mode = getMultimeterMode(dialStopId);
  const isBlackJackCorrect = blackLeadJack === mode.requiredBlackJack;
  const isRedJackCorrect = redLeadJack === mode.requiredRedJack;
  const isSetupCorrect = isBlackJackCorrect && isRedJackCorrect;

  if (isSetupCorrect) {
    return {
      mode,
      isBlackJackCorrect,
      isRedJackCorrect,
      isSetupCorrect,
      severity: mode.severity,
      message: `${mode.label} is configured correctly. ${mode.leadPlacementHint}`,
    };
  }

  if (
    isCurrentMode(dialStopId) &&
    redLeadJack === "jack_voma" &&
    mode.requiredRedJack === "jack_10a"
  ) {
    return {
      mode,
      isBlackJackCorrect,
      isRedJackCorrect,
      isSetupCorrect,
      severity: "danger",
      message: `This ${mode.label} setting expects the 10A jack. Move the red lead before measuring current.`,
    };
  }

  if (
    !isRedJackCorrect &&
    !isCurrentMode(dialStopId) &&
    redLeadJack === "jack_10a"
  ) {
    return {
      mode,
      isBlackJackCorrect,
      isRedJackCorrect,
      isSetupCorrect,
      severity: "danger",
      message: `The red lead is still in the 10A jack. Do not use that jack for ${mode.label}.`,
    };
  }

  if (!isBlackJackCorrect) {
    return {
      mode,
      isBlackJackCorrect,
      isRedJackCorrect,
      isSetupCorrect,
      severity: "warning",
      message: `Move the black lead to COM. ${mode.safetyMessage}`,
    };
  }

  return {
    mode,
    isBlackJackCorrect,
    isRedJackCorrect,
    isSetupCorrect,
    severity: mode.severity === "ok" ? "warning" : mode.severity,
    message: `Move the red lead to the correct jack for ${mode.label}. ${mode.safetyMessage}`,
  };
}

export function getSuggestedDisplayValue(
  dialStopId: MultimeterDialStopId,
): string {
  const family = getMultimeterMode(dialStopId).family;

  switch (family) {
    case "off":
      return "000";
    case "dc_voltage":
      return "12.0";
    case "ac_voltage":
      return "220";
    case "dc_current":
      return dialStopId === "dca_10a" ? "1.25" : "0.18";
    case "resistance":
      return "220";
    case "diode":
      return "0.68";
    default:
      return "";
  }
}
