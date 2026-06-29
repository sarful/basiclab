export const CIRCUIT_COMPONENT_SCALE = 1;
export const BASE_WIRE_WIDTH = 5;
export const CIRCUIT_WIRE_SCALE = 1;
export const CIRCUIT_CANVAS_SCALE = 1;

export const VIEW_BOX = {
  width: 1500,
  height: 720,
};

export const SCALE = {
  component: CIRCUIT_COMPONENT_SCALE,
  wire: CIRCUIT_WIRE_SCALE,
  canvas: CIRCUIT_CANVAS_SCALE,
};

export const STROKE = {
  outline: 5 * SCALE.wire,
  thick: 6 * SCALE.wire,
  wire: BASE_WIRE_WIDTH * SCALE.wire,
  pipeOuter: 70 * SCALE.wire,
  pipeInner: 56 * SCALE.wire,
  flow: 22 * SCALE.wire,
};

export const COLORS = {
  green: "#16a34a",
  outline: "#111827",
  cyan: "#22d3ee",
  water: "#60a5fa",
  waterDark: "#2563eb",
  pipeLight: "#ffffff",
  pipeMid: "#e5e7eb",
  pipeDark: "#cbd5e1",
  tankBody: "#f8fafc",
  panel: "#ffffff",
  muted: "#64748b",
};

export const BASE_COMPONENT = {
  tank: {
    x: 70,
    y: 130,
    width: 285,
    height: 380,
    rx: 28,
  },
  valve: {
    x: 678,
    y: 255,
    width: 260,
    height: 145,
    rx: 35,
  },
  controlBox: {
    width: 540,
  },
};

export const COMPONENT = {
  tank: {
    lidCx: 212,
    lidCy: 130,
    lidRx: 142,
    lidRy: 38,
    waterX: 95,
    waterY: 250,
    waterWidth: 235,
    waterHeight: 225,
    capX: 175,
    capY: 45,
  },
  leftPipe: {
    connectorX: 355,
    connectorY: 285,
    connectorWidth: 35,
    connectorHeight: 95,
    x: 390,
    y: 305,
    width: 250,
    height: 60,
  },
  valve: {
    connectorX: 640,
    connectorY: 285,
    connectorWidth: 38,
    connectorHeight: 95,
    innerX: 705,
    innerY: 282,
    innerWidth: 206,
    innerHeight: 92,
    centerX: 808,
    centerY: 327,
  },
  handle: {
    centerX: 808,
    topY: 138,
    stemTopY: 140,
    stemBottomY: 255,
    baseX: 760,
    baseY: 215,
    baseWidth: 95,
    baseHeight: 45,
    barX: 695,
    barY: 115,
    barWidth: 225,
    barHeight: 45,
  },
  rightPipe: {
    x: 938,
    y: 305,
    width: 320,
    height: 60,
    bendPath: "M1258 335 H1360 Q1415 335 1415 390 V495",
    innerBendPath: "M1258 335 H1360 Q1390 335 1390 390 V495",
    highlightPath: "M960 322 H1355 Q1375 322 1375 390 V465",
    outletX: 1362,
    outletY: 480,
    outletWidth: 78,
    outletHeight: 34,
  },
  flowMeter: {
    x: 1065,
    y: 430,
    width: 180,
    height: 105,
    cx: 1155,
    cy: 502,
  },
  transistorPanel: {
    x: 60,
    y: 585,
    width: 340,
    height: 100,
  },
};

export const WIRE = {
  leftPipeFlow: "M405 335 H635",
  rightPipeFlow: "M950 335 H1360 Q1390 335 1390 390 V490",
  mainFlowPath: "M400 335 H650 H808 H1265 H1360 Q1390 335 1390 390 V525",
};

export const PATH = {
  tankWaterWave: "M95 250 Q125 230 155 250 T215 250 T275 250 T330 250",
  handleArrow: "M1050 85 Q985 65 915 130",
};

export const LABEL = {
  tank: {
    titleX: 212,
    titleY: 335,
    subY: 380,
  },
  pipe: {
    arrowX: 520,
    arrowY1: 485,
    arrowY2: 365,
    titleY: 550,
    subY: 590,
  },
  valve: {
    titleX: 808,
    titleY: 325,
    subY: 365,
    statusY: 250,
  },
  handle: {
    x: 1115,
    titleY: 115,
    subY: 155,
  },
  waterFlow: {
    arrowX1: 1285,
    arrowY1: 605,
    arrowX2: 1370,
    arrowY2: 560,
    titleX: 1135,
    titleY: 620,
    subY: 660,
  },
};
