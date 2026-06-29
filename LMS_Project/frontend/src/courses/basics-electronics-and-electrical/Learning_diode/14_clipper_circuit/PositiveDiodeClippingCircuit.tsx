"use client";

type Point = { x: number; y: number };
type Offset = { x: number; y: number };

const addPoint = (point: Point, offset: Offset): Point => ({
  x: point.x + offset.x,
  y: point.y + offset.y,
});

const addLabelOffset = <T extends Record<string, Point>>(
  base: T,
  offset: Offset,
): T =>
  Object.fromEntries(
    Object.entries(base).map(([key, point]) => [key, addPoint(point, offset)]),
  ) as T;

export const VIEW_BOX = {
  x: 28,
  y: 54,
  width: 1104,
  height: 220,
} as const;

export const SCALE = {
  CIRCUIT_COMPONENT_SCALE: 1,
  BASE_WIRE_WIDTH: 2,
  CIRCUIT_WIRE_SCALE: 1,
  CIRCUIT_CANVAS_SCALE: 1,
} as const;

export const COMPONENT_OFFSET = {
  source: { x: 30, y: 0 },
  resistor: { x: 0, y: 5 },
  diode: { x: 0, y: 0 },
  output: { x: 0, y: 0 },
} as const satisfies Record<string, Offset>;

export const WIRE_OFFSET = {
  sourceToResistor: {
    start: { x: 0, y: 0 },
    elbow: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  },
} as const;

export const DEBUG_TERMINAL_OFFSET = {
  sourceTop: { x: 0, y: 0 },
  sourceBottom: { x: 0, y: 0 },
  resistorLeft: { x: 40, y: 0 },
  resistorRight: { x: -40, y: 0 },
  diodeTop: { x: 0, y: 30 },
  diodeBottom: { x: 0, y: -30 },
} as const satisfies Record<string, Offset>;

export const BASE_COMPONENT = {
  source: { x: 182, y: 162 },
  resistor: { x: 454, y: 98 },
  diode: { x: 706, y: 158 },
  output: { x: 962, y: 158 },
} as const;

export const COMPONENT = {
  source: addPoint(BASE_COMPONENT.source, COMPONENT_OFFSET.source),
  resistor: addPoint(BASE_COMPONENT.resistor, COMPONENT_OFFSET.resistor),
  diode: addPoint(BASE_COMPONENT.diode, COMPONENT_OFFSET.diode),
  output: addPoint(BASE_COMPONENT.output, COMPONENT_OFFSET.output),
} as const;

export const NODE = {
  sourceTop: addPoint(
    { x: COMPONENT.source.x, y: COMPONENT.source.y - 58 },
    DEBUG_TERMINAL_OFFSET.sourceTop,
  ),
  sourceBottom: addPoint(
    { x: COMPONENT.source.x, y: COMPONENT.source.y + 58 },
    DEBUG_TERMINAL_OFFSET.sourceBottom,
  ),
  resistorLeft: addPoint(
    { x: COMPONENT.resistor.x - 72, y: COMPONENT.resistor.y },
    DEBUG_TERMINAL_OFFSET.resistorLeft,
  ),
  resistorRight: addPoint(
    { x: COMPONENT.resistor.x + 72, y: COMPONENT.resistor.y },
    DEBUG_TERMINAL_OFFSET.resistorRight,
  ),
  diodeTop: addPoint(
    { x: COMPONENT.diode.x, y: COMPONENT.diode.y - 54 },
    DEBUG_TERMINAL_OFFSET.diodeTop,
  ),
  diodeBottom: addPoint(
    { x: COMPONENT.diode.x, y: COMPONENT.diode.y + 54 },
    DEBUG_TERMINAL_OFFSET.diodeBottom,
  ),
} as const;

export const WIRE = {
  sourceToResistor: [
    addPoint(NODE.sourceTop, WIRE_OFFSET.sourceToResistor.start),
    addPoint(
      { x: NODE.resistorLeft.x - 28, y: NODE.sourceTop.y },
      WIRE_OFFSET.sourceToResistor.elbow,
    ),
    addPoint(NODE.resistorLeft, WIRE_OFFSET.sourceToResistor.end),
  ],
} as const;

const toPath = (points: readonly Point[]) =>
  points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

export const PATH = {
  sourceToResistor: toPath(WIRE.sourceToResistor),
} as const;

export const LABEL = addLabelOffset(
  {
    title: { x: 42, y: 52 },
    sourceTag: { x: COMPONENT.source.x, y: 228 },
    resistorTag: { x: COMPONENT.resistor.x, y: 58 },
    diodeTag: { x: COMPONENT.diode.x, y: 228 },
    outputTag: { x: COMPONENT.output.x, y: 228 },
    waveformTag: { x: 1036, y: 108 },
  },
  { x: 0, y: 0 },
);

const DEBUG_LABELS: Record<keyof typeof NODE, string> = {
  sourceTop: "VIN-T",
  sourceBottom: "VIN-B",
  resistorLeft: "R1-L",
  resistorRight: "R1-R",
  diodeTop: "D1-T",
  diodeBottom: "D1-B",
};

export function renderDebugDots(show: boolean) {
  if (!show) return null;

  return Object.entries(NODE).map(([key, point]) => (
    <g key={key}>
      <circle cx={point.x} cy={point.y} r="4.5" fill="#ef4444" />
      <text
        x={point.x + 8}
        y={point.y - 10}
        fontSize="11"
        fontWeight="800"
        fill="#ef4444"
      >
        {DEBUG_LABELS[key as keyof typeof NODE]}
      </text>
    </g>
  ));
}
