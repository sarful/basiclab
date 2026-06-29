export const VIEW_BOX = { x: 0, y: 0, width: 1200, height: 1000 };

export const COMPONENT = {
  background: "#ffffff",
  panel: "#ffffff",
  panelStroke: "#dddddd",
  dashboard: "#f8fafc",
  dashboardDark: "#111827",
  black: "#111111",
  dark: "#2c2c2c",
  metal: "#333333",
  semiconductor: "#ffe7b8",
  nRegion: "#b6e79a",
  nRegionStroke: "#2d7a31",
  oxide: "#d7b4ee",
  oxideStroke: "#7f55a0",
  channel: "#e8f7ff",
  channelStroke: "#1584d8",
  blue: "#1d72e8",
  blueStroke: "#1c63d6",
  green: "#0f7a25",
  weakGreen: "#65b96f",
  orange: "#f59e0b",
  red: "#ef4444",
  gray: "#999999",
  lightGray: "#d5d5d5",
} as const;

export const NODE = {
  terminal: 12,
  small: 7,
} as const;

export const WIRE = {
  color: "#111111",
  width: 4,
  thick: 8,
  active: 6,
} as const;

export const PATH = {
  mainPanel: { x: 80, y: 165, width: 1040, height: 470, rx: 18 },
  controlPanel: { x: 80, y: 755, width: 420, height: 220, rx: 20 },
  scopePanel: { x: 520, y: 755, width: 600, height: 220, rx: 20 },
  dashboardPanel: { x: 80, y: 995, width: 1040, height: 210, rx: 22 },
  body: { x: 130, y: 325, width: 940, height: 295, rx: 10 },
  sourceRegion:
    "M160 325 H345 V390 Q335 425 285 425 H215 Q160 420 160 355 Z",
  drainRegion:
    "M840 325 H1030 V390 Q1020 425 970 425 H900 Q845 420 840 355 Z",
  channel:
    "M345 360 C465 330 665 330 840 360 L840 405 C665 372 485 372 345 405 Z",
  pinchOff:
    "M790 352 C820 360 840 375 850 398 C835 390 810 386 780 388 C792 378 800 365 790 352 Z",
} as const;

export const LABEL = {
  fontFamily: "Arial, sans-serif",
  meterSize: 33,
  regionSize: 34,
  small: 13,
} as const;

export const MOSFET_LOGIC = {
  maxGateVoltage: 10,
  thresholdVoltage: 3,
  kFactor: 0.018,
  thermalResistance: 38,
} as const;

export const MAIN = {
  topNode: { cx: 215, cy: 180 },
  mainAmmeter: { cx: 865, cy: 180 },
  drainWireEnd: { x: 1015, y: 320 },
  gateWire: { x: 565, y1: 105, y2: 305 },
  sourceTerminal: { x: 185, y: 310, width: 36, height: 16 },
  drainTerminal: { x: 1005, y: 310, width: 36, height: 16 },
  oxide: { x: 310, y: 325, width: 525, height: 27 },
  gate: { x: 355, y: 295, width: 420, height: 35 },
  gatePin: { x: 555, y: 285, width: 22, height: 18 },
  ground: { x: 565, y: 620 },
} as const;

export const SLIDER = {
  panel: { x: 355, y: 38, width: 430, height: 105, rx: 18 },
  minus: { cx: 410, cy: 90, r: 22 },
  plus: { cx: 730, cy: 90, r: 22 },
  rail: { x1: 455, y1: 90, x2: 685, y2: 90 },
  knob: { cy: 90, r: 16 },
  vgs: { x: 488, y: 132 },
} as const;

export const ELECTRONS = [
  [380, 370],
  [430, 390],
  [480, 368],
  [530, 392],
  [580, 370],
  [630, 390],
  [680, 368],
  [730, 392],
  [780, 370],
] as const;

export const BODY_PARTICLES = [
  [165, 455],
  [215, 505],
  [300, 455],
  [415, 515],
  [495, 470],
  [635, 505],
  [785, 515],
  [955, 460],
  [250, 570],
  [345, 520],
  [480, 570],
  [725, 570],
  [885, 520],
  [1035, 545],
  [580, 570],
] as const;

export const TRAINING_STEPS = [
  "Gate OFF",
  "Threshold reached",
  "Channel formation",
  "Current starts",
  "Linear region",
  "Saturation region",
] as const;
