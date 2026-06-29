"use client";

export const CIRCUIT_COMPONENT_SCALE = 2;
export const BASE_WIRE_WIDTH = 0.5;
export const CIRCUIT_WIRE_SCALE = 1;
export const CIRCUIT_CANVAS_SCALE = 0.5;

export const VIEW_BOX = {
  x: 50,
  y: 20,
  width: 61 * CIRCUIT_CANVAS_SCALE,
  height: 71 * CIRCUIT_CANVAS_SCALE,
} as const;

export const SCALE = {
  component: CIRCUIT_COMPONENT_SCALE,
  wire: CIRCUIT_WIRE_SCALE,
  canvas: CIRCUIT_CANVAS_SCALE,
} as const;

export const BASE_COMPONENT = {
  symbolCenter: { x: 25, y: 25 },
  symbolRadius: 11,
  gateJunctionX: 20,
  channelX: 23,
  railX: 30,
  arrowStartX: 27.5,
  arrowTipX: 30,
} as const;

export const COMPONENT = {
  defaultStroke: "#000000",
  defaultFill: "#ffffff",
  inactiveStroke: "#000000",
  labelColor: "#000000",
  transparent: "none",
  defaultHighlight: "#16a34a",
  fontFamily: "Roboto",
} as const;

export const NODE = {
  symbolCenter: BASE_COMPONENT.symbolCenter,
  sourceLabel: { x: 28, y: 46.81 },
  gateLabel: { x: 2, y: 26.81 },
  drainLabel: { x: 28, y: 9 },
} as const;

export const WIRE = {
  baseWidth: BASE_WIRE_WIDTH,
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  lineCap: "round",
  lineJoin: "round",
} as const;

export const PATH = {
  gateLead: "M20 19v11H0",
  channelTop: "M23 19v2",
  channelMiddle: "M23 24v2",
  channelBottom: "M23 29v2",
  sourceLead: "M23 30h7v20",
  drainLead: "M23 20h7V0",
  arrowBridge: "M23 25h7v5",
  arrowHead: "M27.5 23.75L30 25l-2.5 1.25",
} as const;

export const LABEL = {
  baseFontSize: 14,
  terminalFontSize: 7,
  textAnchor: "middle",
  gateAnchor: "start",
  sourceAnchor: "end",
  drainAnchor: "end",
} as const;
