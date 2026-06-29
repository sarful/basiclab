// RelayLogic.ts
// Formulas, types, colors, default settings, and helper functions
// for the AC/DC relay coil simulation.

export type CircuitType = "AC" | "DC";
export type CircuitMode = "AC" | "DC" | "Both";
export type CoilStatus = "OFF" | "Weak" | "Energized";
export type WirePolarity = "top" | "bottom";

export type Point = {
  x: number;
  y: number;
};

export type SimulationSettings = {
  powerOn: boolean;
  circuitMode: CircuitMode;
  acVoltage: number;
  dcVoltage: number;
  resistance: number;
  acFrequency: number;
  animationSpeed: number;
  showElectronFlow: boolean;
  showMagneticField: boolean;
  showLabels: boolean;
  showDirectionArrows: boolean;
};

export type CircuitValues = {
  type: CircuitType;
  voltage: number;
  resistance: number;
  current: number;
  power: number;
  magneticStrength: number;
  displayMagneticStrength: number;
  status: CoilStatus;
  isVisible: boolean;
  isPowered: boolean;
  highCurrentWarning: boolean;
  instantVoltage: number;
  instantDirection: 1 | -1;
};

export const COLORS = {
  black: "#000000",
  white: "#ffffff",

  inactiveWire: "#b8b8b8",

  acLive: "#8B4513",
  acNeutral: "#1f5fbf",

  dcPositive: "#cc0000",
  dcNegative: "#222222",

  coilBody: "#eeeeee",
  coilBodyOn: "#dddddd",
  coilCopper: "#b87333",

  dcField: "#1f5fbf",
  acField: "#6a4fbf",

  electronDC: "#003366",
  electronAC: "#4b0082",

  warning: "#cc6600",
};

export const VIEW_BOX = {
  x: 0,
  y: 0,
  width: 1000,
  height: 610,
};

export const TEXT_STYLE = {
  fill: COLORS.black,
  fontFamily: "Arial, Helvetica, sans-serif",
  textAnchor: "middle" as const,
};

export const TERMINAL_DOT_RADIUS = 4;
export const CURRENT_THRESHOLD = 0.05;
export const HIGH_CURRENT_WARNING = 1.5;

export const defaultSettings: SimulationSettings = {
  powerOn: true,
  circuitMode: "Both",
  acVoltage: 120,
  dcVoltage: 12,
  resistance: 120,
  acFrequency: 50,
  animationSpeed: 1,
  showElectronFlow: true,
  showMagneticField: true,
  showLabels: true,
  showDirectionArrows: true,
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value: number, decimals = 2) {
  if (!Number.isFinite(value)) return "0";
  return value.toFixed(decimals);
}

export function getInstantACVoltage(
  vrms: number,
  frequency: number,
  time: number
) {
  return vrms * 1.414 * Math.sin(2 * Math.PI * frequency * time);
}

export function getCircuitValues({
  type,
  settings,
  time,
}: {
  type: CircuitType;
  settings: SimulationSettings;
  time: number;
}): CircuitValues {
  const isVisible =
    settings.circuitMode === "Both" || settings.circuitMode === type;

  const voltage = type === "AC" ? settings.acVoltage : settings.dcVoltage;
  const resistance = Math.max(settings.resistance, 1);
  const isPowered = settings.powerOn && isVisible && voltage > 0;

  // Educational formula:
  // DC current: I = V / R
  // AC current: I = Vrms / R
  const current = isPowered ? voltage / resistance : 0;

  // Educational formula:
  // Power: P = V × I
  const power = isPowered ? voltage * current : 0;

  // Normalize current for drawing strength.
  const magneticStrength = isPowered ? clamp(current / 0.2, 0, 1) : 0;

  // AC instantaneous voltage is used only for animation.
  const instantVoltage =
    type === "AC"
      ? getInstantACVoltage(
          settings.acVoltage,
          settings.acFrequency,
          time * settings.animationSpeed
        )
      : settings.dcVoltage;

  const instantDirection: 1 | -1 = instantVoltage >= 0 ? 1 : -1;

  const acPulse =
    type === "AC" && isPowered
      ? clamp(
          Math.abs(instantVoltage) / Math.max(settings.acVoltage * 1.414, 1),
          0,
          1
        )
      : 1;

  const displayMagneticStrength = magneticStrength * acPulse;

  let status: CoilStatus = "OFF";

  if (isPowered && current >= CURRENT_THRESHOLD) {
    status = "Energized";
  } else if (isPowered && current > 0) {
    status = "Weak";
  }

  return {
    type,
    voltage,
    resistance,
    current,
    power,
    magneticStrength,
    displayMagneticStrength,
    status,
    isVisible,
    isPowered,
    highCurrentWarning: isPowered && current >= HIGH_CURRENT_WARNING,
    instantVoltage,
    instantDirection,
  };
}

export function getPathLength(points: Point[]) {
  let length = 0;

  for (let i = 0; i < points.length - 1; i += 1) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    length += Math.sqrt(dx * dx + dy * dy);
  }

  return length;
}

export function getPointOnPath(points: Point[], progress: number): Point {
  const safeProgress = ((progress % 1) + 1) % 1;
  const totalLength = getPathLength(points);
  let distance = safeProgress * totalLength;

  for (let i = 0; i < points.length - 1; i += 1) {
    const start = points[i];
    const end = points[i + 1];

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const segmentLength = Math.sqrt(dx * dx + dy * dy);

    if (distance <= segmentLength) {
      const ratio = segmentLength === 0 ? 0 : distance / segmentLength;

      return {
        x: start.x + dx * ratio,
        y: start.y + dy * ratio,
      };
    }

    distance -= segmentLength;
  }

  return points[points.length - 1];
}

export function getWireColor({
  type,
  polarity,
  active,
}: {
  type: CircuitType;
  polarity: WirePolarity;
  active: boolean;
}) {
  if (!active) return COLORS.inactiveWire;

  if (type === "AC") {
    return polarity === "top" ? COLORS.acLive : COLORS.acNeutral;
  }

  return polarity === "top" ? COLORS.dcPositive : COLORS.dcNegative;
}

export function getWireWidth(values: CircuitValues) {
  if (!values.isPowered) return 2.6;
  if (values.status === "Energized") return 4.2;
  if (values.status === "Weak") return 3.3;
  return 3;
}
