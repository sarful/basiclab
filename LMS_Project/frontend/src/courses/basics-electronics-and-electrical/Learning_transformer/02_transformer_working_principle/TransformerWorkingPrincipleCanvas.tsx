"use client";

import { motion } from "framer-motion";

import { clamp, formatNumber } from "../01_transformer_interactive_simulation/logic";

import type {
  TransformerWorkingPrincipleFlowMode,
  TransformerWorkingPrincipleSnapshot,
  TransformerWorkingPrincipleState,
} from "./transformerWorkingPrincipleTypes";

type Point = { x: number; y: number };
type Offset = { x: number; y: number };
type ComponentBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
};
type RouteAnchor = "start" | "mid" | "end";
type RouteOffset = { anchor: RouteAnchor; x: number; y: number };

export const VIEW_BOX = "0 0 980 700";
const VIEW_BOX_WIDTH = 980;
const VIEW_BOX_HEIGHT = 700;

export const CIRCUIT_CANVAS_SCALE = 1;
export const BASE_WIRE_WIDTH = 4;
export const CIRCUIT_WIRE_SCALE = 1;

export const CIRCUIT_COMPONENT_SCALE = {
  core: 1,
  primaryWinding: 1,
  secondaryWinding: 1,
  fluxPath: 1,
} as const;

export const COMPONENT_OFFSET = {
  core: { x: 0, y: 0 },
  primaryWinding: { x: 0, y: 0 },
  secondaryWinding: { x: 0, y: 0 },
  fluxPath: { x: 0, y: 0 },
} as const satisfies Record<string, Offset>;

export const TERMINAL_OFFSET = {
  primaryTopInput: { x: 0, y: 0 },
  primaryTopCoil: { x: 0, y: 0 },
  primaryBottomInput: { x: 0, y: 0 },
  primaryBottomCoil: { x: 0, y: 0 },
  secondaryTopCoil: { x: 0, y: 0 },
  secondaryTopOutput: { x: 0, y: 0 },
  secondaryBottomCoil: { x: 0, y: 0 },
  secondaryBottomOutput: { x: 0, y: 0 },
  fluxTopLeft: { x: 0, y: 0 },
  fluxTopRight: { x: 0, y: 0 },
  fluxBottomRight: { x: 0, y: 0 },
  fluxBottomLeft: { x: 0, y: 0 },
  fieldCenter: { x: 0, y: 0 },
  fieldTop: { x: 0, y: 0 },
  fieldBottom: { x: 0, y: 0 },
  guideStep1: { x: 0, y: 0 },
  guideStep2: { x: 0, y: 0 },
  guideStep3: { x: 0, y: 0 },
} as const satisfies Record<string, Offset>;

export const DEBUG_TERMINAL_OFFSET = {
  primaryTopInput: { x: 0, y: 0 },
  primaryTopCoil: { x: 0, y: 0 },
  primaryBottomInput: { x: 0, y: 0 },
  primaryBottomCoil: { x: 0, y: 0 },
  secondaryTopCoil: { x: 0, y: 0 },
  secondaryTopOutput: { x: 0, y: 0 },
  secondaryBottomCoil: { x: 0, y: 0 },
  secondaryBottomOutput: { x: 0, y: 0 },
  fluxTopLeft: { x: 0, y: 0 },
  fluxTopRight: { x: 0, y: 0 },
  fluxBottomRight: { x: 0, y: 0 },
  fluxBottomLeft: { x: 0, y: 0 },
  fieldCenter: { x: 0, y: 0 },
  fieldTop: { x: 0, y: 0 },
  fieldBottom: { x: 0, y: 0 },
  guideStep1: { x: 0, y: 0 },
  guideStep2: { x: 0, y: 0 },
  guideStep3: { x: 0, y: 0 },
} as const satisfies Record<string, Offset>;

export const WIRE_OFFSET = {
  primaryTop: [] as readonly RouteOffset[],
  primaryBottom: [] as readonly RouteOffset[],
  secondaryTop: [] as readonly RouteOffset[],
  secondaryBottom: [] as readonly RouteOffset[],
} as const;

export const SHOW_DEBUG_TERMINAL_DOTS = false;

const STYLE = {
  coreFrontFill: "#aab3c0",
  coreTopFill: "#d6dee8",
  coreSideFill: "#828a97",
  coreStroke: "#5d6470",
  copperFill: "#ffb25b",
  copperStroke: "#d8842d",
  conventionalFlow: "#c2410c",
  electronFlow: "#2563eb",
  flux: "#0f6faf",
  fluxSoft: "#8dc7ea",
  wire: "#ef9d41",
  wireStroke: "#d68124",
  text: "#2f3640",
  textMuted: "#5f6b77",
  panelBorder: "#cfd8e3",
  panelBg: "#ffffff",
  debug: "#ef4444",
  active: "#059669",
  inactive: "#94a3b8",
} as const;

const BASE_COMPONENT = {
  coreFront: { x: 238, y: 112, width: 480, height: 462, rotate: 0 },
  coreWindow: { x: 360, y: 196, width: 294, height: 286, rotate: 0 },
  coreTopFace: { x: 274, y: 68, width: 480, height: 44, rotate: 0 },
  coreSideFace: { x: 718, y: 112, width: 36, height: 462, rotate: 0 },
  primaryWindingArea: { x: 218, y: 182, width: 174, height: 286, rotate: 0 },
  secondaryWindingArea: { x: 608, y: 248, width: 140, height: 164, rotate: 0 },
  fluxPathArea: { x: 282, y: 148, width: 390, height: 336, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

const BASE_LABEL = {
  primaryTitle: { x: 110, y: 92 },
  secondaryTitle: { x: 856, y: 182 },
  ironCore: { x: 512, y: 40 },
  magneticFlux: { x: 490, y: 672 },
  n1: { x: 114, y: 586 },
  n2: { x: 824, y: 466 },
  u1: { x: 80, y: 328 },
  u2: { x: 930, y: 328 },
  i1: { x: 124, y: 144 },
  i2: { x: 844, y: 282 },
  step1: { x: 80, y: 78 },
  step2: { x: 512, y: 82 },
  step3: { x: 878, y: 136 },
  primaryGuideStart: { x: 168, y: 496 },
  primaryGuideEnd: { x: 130, y: 536 },
  secondaryGuideStart: { x: 754, y: 404 },
  secondaryGuideEnd: { x: 808, y: 454 },
  primaryTurnsValue: { x: 118, y: 614 },
  secondaryTurnsValue: { x: 842, y: 494 },
  coreGuideStart: { x: 512, y: 50 },
  coreGuideEnd: { x: 512, y: 84 },
  fluxGuideStart: { x: 490, y: 612 },
  fluxGuideEnd: { x: 490, y: 652 },
  u1GuideTop: { x: 102, y: 182 },
  u1GuideBottom: { x: 102, y: 462 },
  u2GuideTop: { x: 890, y: 318 },
  u2GuideBottom: { x: 890, y: 388 },
  inputLabel: { x: 80, y: 552 },
  outputLabel: { x: 894, y: 432 },
  currentModeLabel: { x: 490, y: 608 },
  ratioLabel: { x: 490, y: 626 },
  electromagneticField: { x: 232, y: 114 },
  electromagneticGuideStart: { x: 248, y: 120 },
  electromagneticGuideEnd: { x: 332, y: 202 },
  indicatorInput: { x: 84, y: 582 },
  indicatorFlux: { x: 306, y: 582 },
  indicatorSecondary: { x: 548, y: 582 },
  indicatorIsolation: { x: 784, y: 582 },
  indicatorInputText: { x: 100, y: 586 },
  indicatorFluxText: { x: 322, y: 586 },
  indicatorSecondaryText: { x: 564, y: 586 },
  indicatorIsolationText: { x: 800, y: 586 },
  engineeringStrip: { x: 236, y: 594, width: 510, height: 56 },
  engineeringStripDivider1: { x: 378, y: 603 },
  engineeringStripDivider2: { x: 606, y: 603 },
  engineeringStripMode: { x: 307, y: 610 },
  engineeringStripModeValue: { x: 307, y: 629 },
  engineeringStripElectrical: { x: 492, y: 610 },
  engineeringStripElectricalValue: { x: 492, y: 629 },
  engineeringStripFlux: { x: 676, y: 610 },
  engineeringStripFluxValue: { x: 676, y: 629 },
} as const;

type ComponentMap = {
  coreFront: ComponentBox;
  coreWindow: ComponentBox;
  coreTopFace: ComponentBox;
  coreSideFace: ComponentBox;
  primaryWindingArea: ComponentBox;
  secondaryWindingArea: ComponentBox;
  fluxPathArea: ComponentBox;
};

type TerminalId = keyof typeof TERMINAL_OFFSET;
type ConnectionId = keyof typeof WIRE_OFFSET;

type ConnectionSpec = {
  id: ConnectionId;
  terminals: readonly [TerminalId, TerminalId];
  route: "straight";
};

export const CONNECTION_TABLE = [
  {
    id: "primaryTop",
    terminals: ["primaryTopInput", "primaryTopCoil"],
    route: "straight",
  },
  {
    id: "primaryBottom",
    terminals: ["primaryBottomInput", "primaryBottomCoil"],
    route: "straight",
  },
  {
    id: "secondaryTop",
    terminals: ["secondaryTopCoil", "secondaryTopOutput"],
    route: "straight",
  },
  {
    id: "secondaryBottom",
    terminals: ["secondaryBottomCoil", "secondaryBottomOutput"],
    route: "straight",
  },
] as const satisfies readonly ConnectionSpec[];

function scaleComponent(component: ComponentBox, scale: number): ComponentBox {
  const width = component.width * scale;
  const height = component.height * scale;

  return {
    ...component,
    x: component.x - (width - component.width) / 2,
    y: component.y - (height - component.height) / 2,
    width,
    height,
  };
}

function offsetComponent(component: ComponentBox, offset: Offset): ComponentBox {
  return {
    ...component,
    x: component.x + offset.x,
    y: component.y + offset.y,
  };
}

function offsetPoint(point: Point, offset: Offset): Point {
  return { x: point.x + offset.x, y: point.y + offset.y };
}

function pathD(points: readonly Point[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

function reversePathD(points: readonly Point[]) {
  return pathD([...points].reverse());
}

function buildCanvasScaleTransform(scale: number) {
  if (scale === 1) return undefined;

  const centerX = VIEW_BOX_WIDTH / 2;
  const centerY = VIEW_BOX_HEIGHT / 2;

  return `translate(${centerX} ${centerY}) scale(${scale}) translate(${-centerX} ${-centerY})`;
}

function windingLoopPath({
  x,
  y,
  width,
  height,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  const left = x - width / 2;
  const right = x + width / 2;
  const top = y - height / 2;
  const bottom = y + height / 2;

  return [
    `M ${left} ${top}`,
    `C ${left} ${top - 8}, ${right} ${top - 8}, ${right} ${top}`,
    `C ${right} ${bottom + 8}, ${left} ${bottom + 8}, ${left} ${bottom}`,
    `C ${left} ${bottom + 2}, ${left} ${top + 2}, ${left} ${top}`,
  ].join(" ");
}

function buildComponents(): ComponentMap {
  return {
    coreFront: offsetComponent(
      scaleComponent(BASE_COMPONENT.coreFront, CIRCUIT_COMPONENT_SCALE.core),
      COMPONENT_OFFSET.core,
    ),
    coreWindow: offsetComponent(
      scaleComponent(BASE_COMPONENT.coreWindow, CIRCUIT_COMPONENT_SCALE.core),
      COMPONENT_OFFSET.core,
    ),
    coreTopFace: offsetComponent(
      scaleComponent(BASE_COMPONENT.coreTopFace, CIRCUIT_COMPONENT_SCALE.core),
      COMPONENT_OFFSET.core,
    ),
    coreSideFace: offsetComponent(
      scaleComponent(BASE_COMPONENT.coreSideFace, CIRCUIT_COMPONENT_SCALE.core),
      COMPONENT_OFFSET.core,
    ),
    primaryWindingArea: offsetComponent(
      scaleComponent(
        BASE_COMPONENT.primaryWindingArea,
        CIRCUIT_COMPONENT_SCALE.primaryWinding,
      ),
      COMPONENT_OFFSET.primaryWinding,
    ),
    secondaryWindingArea: offsetComponent(
      scaleComponent(
        BASE_COMPONENT.secondaryWindingArea,
        CIRCUIT_COMPONENT_SCALE.secondaryWinding,
      ),
      COMPONENT_OFFSET.secondaryWinding,
    ),
    fluxPathArea: offsetComponent(
      scaleComponent(BASE_COMPONENT.fluxPathArea, CIRCUIT_COMPONENT_SCALE.fluxPath),
      COMPONENT_OFFSET.fluxPath,
    ),
  };
}

function buildBaseTerminals(component: ComponentMap) {
  return {
    primaryTopInput: { x: 58, y: 171 },
    primaryTopCoil: {
      x: component.primaryWindingArea.x + 18,
      y: 171,
    },
    primaryBottomInput: { x: 58, y: 472 },
    primaryBottomCoil: {
      x: component.primaryWindingArea.x + 18,
      y: 472,
    },
    secondaryTopCoil: {
      x: component.secondaryWindingArea.x + component.secondaryWindingArea.width - 8,
      y: 308,
    },
    secondaryTopOutput: { x: 938, y: 308 },
    secondaryBottomCoil: {
      x: component.secondaryWindingArea.x + component.secondaryWindingArea.width - 8,
      y: 388,
    },
    secondaryBottomOutput: { x: 938, y: 388 },
    fluxTopLeft: {
      x: component.fluxPathArea.x,
      y: component.fluxPathArea.y,
    },
    fluxTopRight: {
      x: component.fluxPathArea.x + component.fluxPathArea.width,
      y: component.fluxPathArea.y,
    },
    fluxBottomRight: {
      x: component.fluxPathArea.x + component.fluxPathArea.width,
      y: component.fluxPathArea.y + component.fluxPathArea.height,
    },
    fluxBottomLeft: {
      x: component.fluxPathArea.x,
      y: component.fluxPathArea.y + component.fluxPathArea.height,
    },
    fieldCenter: {
      x: component.primaryWindingArea.x + component.primaryWindingArea.width / 2 - 16,
      y: component.primaryWindingArea.y + component.primaryWindingArea.height / 2,
    },
    fieldTop: {
      x: component.primaryWindingArea.x + component.primaryWindingArea.width / 2 - 16,
      y: component.primaryWindingArea.y + 18,
    },
    fieldBottom: {
      x: component.primaryWindingArea.x + component.primaryWindingArea.width / 2 - 16,
      y: component.primaryWindingArea.y + component.primaryWindingArea.height - 18,
    },
    guideStep1: { x: 84, y: 82 },
    guideStep2: { x: 512, y: 82 },
    guideStep3: { x: 876, y: 142 },
  } as const satisfies Record<TerminalId, Point>;
}

function buildNodes(component: ComponentMap) {
  const base = buildBaseTerminals(component);

  return Object.fromEntries(
    Object.entries(base).map(([key, point]) => [
      key,
      offsetPoint(point, TERMINAL_OFFSET[key as TerminalId]),
    ]),
  ) as Record<TerminalId, Point>;
}

function buildDebugNodes(node: Record<TerminalId, Point>) {
  return Object.fromEntries(
    Object.entries(node).map(([key, point]) => [
      key,
      offsetPoint(point, DEBUG_TERMINAL_OFFSET[key as TerminalId]),
    ]),
  ) as Record<TerminalId, Point>;
}

function buildConnectionPoints(
  connection: ConnectionSpec,
  node: Record<TerminalId, Point>,
) {
  const start = node[connection.terminals[0]];
  const end = node[connection.terminals[1]];
  const midpoint = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
  const waypoints = WIRE_OFFSET[connection.id].map((offset) => {
    if (offset.anchor === "start") {
      return offsetPoint(start, offset);
    }

    if (offset.anchor === "end") {
      return offsetPoint(end, offset);
    }

    return offsetPoint(midpoint, offset);
  });

  return [start, ...waypoints, end];
}

function buildWires(node: Record<TerminalId, Point>) {
  return Object.fromEntries(
    CONNECTION_TABLE.map((connection) => [
      connection.id,
      buildConnectionPoints(connection, node),
    ]),
  ) as Record<ConnectionId, Point[]>;
}

function buildPaths(
  wire: Record<ConnectionId, Point[]>,
  node: Record<TerminalId, Point>,
) {
  return {
    primaryTop: pathD(wire.primaryTop),
    primaryTopReverse: reversePathD(wire.primaryTop),
    primaryBottom: pathD(wire.primaryBottom),
    primaryBottomReverse: reversePathD(wire.primaryBottom),
    secondaryTop: pathD(wire.secondaryTop),
    secondaryTopReverse: reversePathD(wire.secondaryTop),
    secondaryBottom: pathD(wire.secondaryBottom),
    secondaryBottomReverse: reversePathD(wire.secondaryBottom),
    fluxLoop: [
      `M ${node.fluxTopLeft.x} ${node.fluxTopLeft.y}`,
      `L ${node.fluxTopRight.x} ${node.fluxTopRight.y}`,
      `Q ${node.fluxTopRight.x + 24} ${node.fluxTopRight.y} ${node.fluxTopRight.x + 24} ${node.fluxTopRight.y + 24}`,
      `L ${node.fluxBottomRight.x + 24} ${node.fluxBottomRight.y - 24}`,
      `Q ${node.fluxBottomRight.x + 24} ${node.fluxBottomRight.y} ${node.fluxBottomRight.x} ${node.fluxBottomRight.y}`,
      `L ${node.fluxBottomLeft.x} ${node.fluxBottomLeft.y}`,
      `Q ${node.fluxBottomLeft.x - 24} ${node.fluxBottomLeft.y} ${node.fluxBottomLeft.x - 24} ${node.fluxBottomLeft.y - 24}`,
      `L ${node.fluxTopLeft.x - 24} ${node.fluxTopLeft.y + 24}`,
      `Q ${node.fluxTopLeft.x - 24} ${node.fluxTopLeft.y} ${node.fluxTopLeft.x} ${node.fluxTopLeft.y}`,
    ].join(" "),
  } as const;
}

function buildLabels() {
  return BASE_LABEL;
}

function buildWindingGeometry(
  area: ComponentBox,
  turnCount: number,
  side: "primary" | "secondary",
) {
  const normalizedTurns = clamp(turnCount, 50, 2000);
  const loopCount = Math.round(
    side === "primary"
      ? 6 + ((normalizedTurns - 50) / 1950) * 14
      : 4 + ((normalizedTurns - 50) / 1950) * 14,
  );
  const availableHeight = area.height - (side === "primary" ? 18 : 14);
  const pitch = availableHeight / Math.max(loopCount, 1);
  const strokeWidth = clamp(
    pitch * (side === "primary" ? 0.8 : 0.84),
    side === "primary" ? 10 : 9,
    side === "primary" ? 16 : 14,
  );
  const turnRadiusY = clamp(
    strokeWidth * (side === "primary" ? 0.34 : 0.36),
    3.6,
    6.2,
  );
  const turnRadiusX = clamp(
    area.width * (side === "primary" ? 0.28 : 0.26),
    side === "primary" ? 36 : 28,
    side === "primary" ? 50 : 38,
  );
  const cylinderRadiusX = turnRadiusX + strokeWidth * 0.55;
  const bodyWidth = cylinderRadiusX * 2;
  const bodyHeight = availableHeight + strokeWidth * 0.35;
  const centerX =
    area.x +
    area.width / 2 +
    (side === "primary" ? -area.width * 0.04 : area.width * 0.01);
  const topY = area.y + (area.height - availableHeight) / 2 + pitch / 2;
  const centerY = topY + availableHeight / 2;

  return {
    side,
    loopCount,
    pitch,
    strokeWidth,
    turnRadiusX,
    turnRadiusY,
    cylinderRadiusX,
    bodyWidth,
    bodyHeight,
    centerX,
    centerY,
    topY,
    frontOverlap: strokeWidth * 0.22,
    shadowOffsetX: side === "primary" ? 5 : 4,
    highlightOffsetX: side === "primary" ? -12 : -8,
  };
}

function flowPalette(flowMode: TransformerWorkingPrincipleFlowMode) {
  if (flowMode === "electron") {
    return {
      color: STYLE.electronFlow,
      soft: "#93c5fd",
      badge: "Electron Flow",
    };
  }

  return {
    color: STYLE.conventionalFlow,
    soft: "#fdba74",
    badge: "Conventional Flow",
  };
}

function FlowParticles({
  path,
  color,
  softColor,
  duration,
  reverse = false,
  count = 3,
}: {
  path: string;
  color: string;
  softColor: string;
  duration: number;
  reverse?: boolean;
  count?: number;
}) {
  return (
    <g>
      {Array.from({ length: count }).map((_, index) => (
        <g key={`${path}-${index}`}>
          <circle r="4" fill={softColor} opacity="0.65">
            <animateMotion
              dur={`${duration}s`}
              begin={`${index * 0.35}s`}
              repeatCount="indefinite"
              path={path}
              keyPoints={reverse ? "1;0" : "0;1"}
              keyTimes="0;1"
              calcMode="linear"
            />
          </circle>
          <circle r="2.2" fill={color}>
            <animateMotion
              dur={`${duration}s`}
              begin={`${index * 0.35}s`}
              repeatCount="indefinite"
              path={path}
              keyPoints={reverse ? "1;0" : "0;1"}
              keyTimes="0;1"
              calcMode="linear"
            />
          </circle>
        </g>
      ))}
    </g>
  );
}

function WireSegment({ points }: { points: readonly Point[] }) {
  return (
    <path
      d={pathD(points)}
      stroke={STYLE.wire}
      strokeWidth={BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function DebugTerminalDots({
  points,
  visible,
}: {
  points: readonly Point[];
  visible: boolean;
}) {
  if (!visible) return null;

  return (
    <g>
      {points.map((point, index) => (
        <circle
          key={`${point.x}-${point.y}-${index}`}
          cx={point.x}
          cy={point.y}
          r="4.5"
          fill={STYLE.debug}
          stroke="#ffffff"
          strokeWidth="1.5"
        />
      ))}
    </g>
  );
}

function CurrentArrow({
  x,
  y,
  color,
  width,
  direction = 1,
}: {
  x: number;
  y: number;
  color: string;
  width: number;
  direction?: 1 | -1;
}) {
  const endX = x + width * direction;
  const headX = endX - 18 * direction;

  return (
    <motion.g
      animate={{ x: direction === 1 ? [0, 6, 0] : [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
    >
      <path
        d={`M ${x} ${y} L ${endX} ${y}`}
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d={`M ${headX} ${y - 9} L ${endX} ${y} L ${headX} ${y + 9}`}
        stroke={color}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.g>
  );
}

function VoltageArrow({
  x,
  top,
  bottom,
  color,
}: {
  x: number;
  top: number;
  bottom: number;
  color: string;
}) {
  return (
    <g>
      <line x1={x} y1={top} x2={x} y2={bottom} stroke={color} strokeWidth="2.5" />
      <path
        d={`M ${x - 8} ${top + 14} L ${x} ${top} L ${x + 8} ${top + 14}`}
        stroke={color}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M ${x - 8} ${bottom - 14} L ${x} ${bottom} L ${x + 8} ${bottom - 14}`}
        stroke={color}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function WindingBlock({
  geometry,
}: {
  geometry: ReturnType<typeof buildWindingGeometry>;
}) {
  const sideGuideOffset = geometry.turnRadiusX * 0.78;
  const bottomY =
    geometry.topY + (geometry.loopCount - 1) * geometry.pitch + geometry.pitch * 0.35;
  const topGuideY = geometry.topY - geometry.pitch * 0.35;

  return (
    <g>
      <line
        x1={geometry.centerX - sideGuideOffset}
        y1={topGuideY}
        x2={geometry.centerX - sideGuideOffset}
        y2={bottomY}
        stroke="#d28a36"
        strokeWidth="1.4"
        opacity="0.18"
      />
      <line
        x1={geometry.centerX + sideGuideOffset}
        y1={topGuideY}
        x2={geometry.centerX + sideGuideOffset}
        y2={bottomY}
        stroke="#fff2dc"
        strokeWidth="1.1"
        opacity="0.12"
      />
      <ellipse
        cx={geometry.centerX + geometry.shadowOffsetX}
        cy={geometry.centerY}
        rx={geometry.turnRadiusX * 0.88}
        ry={geometry.bodyHeight / 2}
        fill="#7c4a16"
        opacity="0.08"
      />
      {Array.from({ length: geometry.loopCount }).map((_, index) => {
        const cy = geometry.topY + index * geometry.pitch;
        const opacity = 0.96 - index / (geometry.loopCount * 28);
        const rearRx = geometry.turnRadiusX * 0.92;
        const rearRy = geometry.turnRadiusY * 0.92;
        const frontRy = geometry.turnRadiusY + geometry.frontOverlap;

        return (
          <g key={`loop-${index}`}>
            <ellipse
              cx={geometry.centerX}
              cy={cy}
              rx={rearRx}
              ry={rearRy}
              fill="none"
              stroke="#b5671f"
              strokeWidth={Math.max(1, geometry.strokeWidth * 0.16)}
              opacity="0.24"
            />
            <ellipse
              cx={geometry.centerX}
              cy={cy}
              rx={geometry.turnRadiusX}
              ry={frontRy}
              fill="none"
              stroke={STYLE.copperFill}
              strokeWidth={geometry.strokeWidth}
              opacity={opacity}
            />
            <ellipse
              cx={geometry.centerX - geometry.highlightOffsetX * 0.14}
              cy={cy - geometry.frontOverlap * 0.12}
              rx={geometry.turnRadiusX * 0.94}
              ry={geometry.turnRadiusY * 0.82}
              fill="none"
              stroke="#ffd8a8"
              strokeWidth={Math.max(0.9, geometry.strokeWidth * 0.08)}
              opacity="0.65"
            />
            <ellipse
              cx={geometry.centerX}
              cy={cy + geometry.frontOverlap * 0.1}
              rx={geometry.turnRadiusX}
              ry={frontRy}
              fill="none"
              stroke={STYLE.copperStroke}
              strokeWidth={Math.max(1, geometry.strokeWidth * 0.09)}
              opacity="0.88"
            />
          </g>
        );
      })}
    </g>
  );
}

function ElectromagneticField({
  center,
  top,
  bottom,
  activeStrength,
}: {
  center: Point;
  top: Point;
  bottom: Point;
  activeStrength: number;
}) {
  const centerX = center.x;
  const centerY = center.y;
  const regionHeight = bottom.y - top.y;
  const opacity = 0.24 + activeStrength * 0.34;
  const fieldBandColor = activeStrength > 0.55 ? "#0f6faf" : "#60a5fa";
  const fieldGlowColor = activeStrength > 0.55 ? "#bae6fd" : "#dbeafe";

  return (
    <g opacity={opacity}>
      <ellipse
        cx={centerX}
        cy={centerY}
        rx="132"
        ry={regionHeight * 0.49}
        fill={fieldGlowColor}
        opacity={0.14 + activeStrength * 0.08}
      />
      {Array.from({ length: 3 }).map((_, index) => {
        const rx = 92 + index * 20;
        const ry = regionHeight * (0.31 + index * 0.08);
        const delay = index * 0.2;

        return (
          <motion.ellipse
            key={`field-${index}`}
            cx={centerX}
            cy={centerY}
            rx={rx}
            ry={ry}
            fill="none"
            stroke={fieldBandColor}
            strokeWidth={index === 0 ? 3.2 : index === 1 ? 2.3 : 1.8}
            strokeDasharray={index === 0 ? "16 7" : index === 1 ? "11 8" : "8 9"}
            animate={{
              opacity: [
                0.26 + activeStrength * 0.12,
                0.62 + activeStrength * 0.14,
                0.26 + activeStrength * 0.12,
              ],
              scaleX: [0.992, 1.018, 0.992],
              scaleY: [0.995, 1.01, 0.995],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.8,
              delay,
              ease: "easeInOut",
            }}
          />
        );
      })}

      <motion.path
        d={`M ${centerX + 66} ${centerY - regionHeight * 0.27} Q ${centerX + 102} ${centerY} ${centerX + 66} ${centerY + regionHeight * 0.27}`}
        fill="none"
        stroke={fieldBandColor}
        strokeWidth="2"
        strokeLinecap="round"
        opacity={0.48}
        animate={{ opacity: [0.24, 0.68, 0.24] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
      />
    </g>
  );
}

function IndicatorDot({
  x,
  y,
  active,
  label,
  labelX,
  labelY,
}: {
  x: number;
  y: number;
  active: boolean;
  label: string;
  labelX: number;
  labelY: number;
}) {
  return (
    <g>
      <rect
        x={x - 14}
        y={y - 10}
        width="180"
        height="24"
        rx="12"
        fill={active ? "#ecfdf5" : "#f8fafc"}
        stroke={active ? "#a7f3d0" : "#cbd5e1"}
        strokeWidth="1.4"
      />
      <circle
        cx={x}
        cy={y}
        r="8"
        fill={active ? STYLE.active : STYLE.inactive}
        opacity={active ? 0.32 : 0.22}
      />
      <circle
        cx={x}
        cy={y}
        r="4"
        fill={active ? STYLE.active : STYLE.inactive}
      />
      {active ? (
        <circle
          cx={x}
          cy={y}
          r="11"
          fill="none"
          stroke="#6ee7b7"
          strokeWidth="1.5"
          opacity="0.6"
        />
      ) : null}
      <text
        x={labelX}
        y={labelY}
        fill={active ? "#0f172a" : STYLE.textMuted}
        fontSize="11.5"
        fontWeight="800"
      >
        {label}
      </text>
    </g>
  );
}

export default function TransformerWorkingPrincipleCanvas({
  state,
  snapshot,
}: {
  state: TransformerWorkingPrincipleState;
  snapshot: TransformerWorkingPrincipleSnapshot;
}) {
  const COMPONENT = buildComponents();
  const NODE = buildNodes(COMPONENT);
  const DEBUG_NODE = buildDebugNodes(NODE);
  const WIRE = buildWires(NODE);
  const PATH = buildPaths(WIRE, NODE);
  const LABEL = buildLabels();

  const primaryGeometry = buildWindingGeometry(
    COMPONENT.primaryWindingArea,
    state.primaryTurns,
    "primary",
  );
  const secondaryGeometry = buildWindingGeometry(
    COMPONENT.secondaryWindingArea,
    state.secondaryTurns,
    "secondary",
  );

  const palette = flowPalette(state.flowMode);
  const fluxOpacity = clamp(snapshot.fluxLevel, 0.25, 1);
  const showDebugDots = SHOW_DEBUG_TERMINAL_DOTS || state.showDebugDots;
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);
  const primaryForward = state.flowMode === "conventional";
  const secondaryForward = state.flowMode === "conventional";
  const fluxDuration = clamp(2.8 - snapshot.fluxLevel * 1.2, 1.2, 2.8);

  return (
    <section className="rounded-[28px] border border-slate-300 bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-5 xl:p-6">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-cyan-700">
            Simulation Canvas
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-900">
            Transformer Working Principle Sketch
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            White-background engineering schematic with terminal-based wire
            geometry, proportional windings, isolated magnetic coupling, and
            live flow teaching modes.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {snapshot.statusBadges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-700"
            >
              {badge}
            </span>
          ))}
          <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-cyan-700">
            {palette.badge}
          </span>
        </div>
      </div>

      <div className="mt-5 rounded-[26px] border border-slate-200 bg-white p-2 sm:p-4">
        <svg viewBox={VIEW_BOX} className="h-auto w-full">
          <g transform={canvasTransform}>
            <rect
              x="6"
              y="6"
              width="968"
              height="688"
              rx="22"
              fill={STYLE.panelBg}
              stroke={STYLE.panelBorder}
              strokeWidth="2"
            />

            <polygon
              points={`${COMPONENT.coreTopFace.x},${COMPONENT.coreTopFace.y + COMPONENT.coreTopFace.height} ${COMPONENT.coreTopFace.x + 36},${COMPONENT.coreTopFace.y} ${COMPONENT.coreTopFace.x + COMPONENT.coreTopFace.width + 36},${COMPONENT.coreTopFace.y} ${COMPONENT.coreTopFace.x + COMPONENT.coreTopFace.width},${COMPONENT.coreTopFace.y + COMPONENT.coreTopFace.height}`}
              fill={STYLE.coreTopFill}
              stroke={STYLE.coreStroke}
              strokeWidth="2"
            />
            <polygon
              points={`${COMPONENT.coreSideFace.x},${COMPONENT.coreSideFace.y} ${COMPONENT.coreSideFace.x + COMPONENT.coreSideFace.width},${COMPONENT.coreSideFace.y - 44} ${COMPONENT.coreSideFace.x + COMPONENT.coreSideFace.width},${COMPONENT.coreSideFace.y + COMPONENT.coreSideFace.height - 44} ${COMPONENT.coreSideFace.x},${COMPONENT.coreSideFace.y + COMPONENT.coreSideFace.height}`}
              fill={STYLE.coreSideFill}
              stroke={STYLE.coreStroke}
              strokeWidth="2"
            />
            <rect
              x={COMPONENT.coreFront.x}
              y={COMPONENT.coreFront.y}
              width={COMPONENT.coreFront.width}
              height={COMPONENT.coreFront.height}
              fill={STYLE.coreFrontFill}
              stroke={STYLE.coreStroke}
              strokeWidth="2"
            />
            <rect
              x={COMPONENT.coreWindow.x}
              y={COMPONENT.coreWindow.y}
              width={COMPONENT.coreWindow.width}
              height={COMPONENT.coreWindow.height}
              fill="#ffffff"
              stroke={STYLE.coreStroke}
              strokeWidth="2"
            />

            <ElectromagneticField
              center={NODE.fieldCenter}
              top={NODE.fieldTop}
              bottom={NODE.fieldBottom}
              activeStrength={snapshot.fluxLevel}
            />

            <path
              d={PATH.fluxLoop}
              stroke={STYLE.fluxSoft}
              strokeWidth="18"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.22 + fluxOpacity * 0.1}
            />
            <path
              d={PATH.fluxLoop}
              stroke={STYLE.flux}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={fluxOpacity}
            />

            <FlowParticles
              path={PATH.fluxLoop}
              color={STYLE.flux}
              softColor={STYLE.fluxSoft}
              duration={fluxDuration}
              count={5}
            />
            <FlowParticles
              path={PATH.fluxLoop}
              color={STYLE.flux}
              softColor={STYLE.fluxSoft}
              duration={fluxDuration + 0.35}
              count={3}
            />

            <WireSegment points={WIRE.primaryTop} />
            <WireSegment points={WIRE.primaryBottom} />
            <WireSegment points={WIRE.secondaryTop} />
            <WireSegment points={WIRE.secondaryBottom} />

            <FlowParticles
              path={primaryForward ? PATH.primaryTop : PATH.primaryTopReverse}
              color={palette.color}
              softColor={palette.soft}
              duration={1.9}
              count={3}
            />
            <FlowParticles
              path={primaryForward ? PATH.primaryBottomReverse : PATH.primaryBottom}
              color={palette.color}
              softColor={palette.soft}
              duration={1.9}
              count={2}
            />
            <FlowParticles
              path={secondaryForward ? PATH.secondaryTop : PATH.secondaryTopReverse}
              color={palette.color}
              softColor={palette.soft}
              duration={2.1}
              count={2}
            />
            <FlowParticles
              path={secondaryForward ? PATH.secondaryBottomReverse : PATH.secondaryBottom}
              color={palette.color}
              softColor={palette.soft}
              duration={2.1}
              count={2}
            />

            <WindingBlock geometry={primaryGeometry} />
            <WindingBlock geometry={secondaryGeometry} />

            <CurrentArrow
              x={86}
              y={149}
              width={78}
              color={palette.color}
              direction={primaryForward ? 1 : -1}
            />
            <CurrentArrow
              x={822}
              y={289}
              width={74}
              color={palette.color}
              direction={secondaryForward ? 1 : -1}
            />

            <VoltageArrow
              x={LABEL.u1GuideTop.x}
              top={LABEL.u1GuideTop.y}
              bottom={LABEL.u1GuideBottom.y}
              color="#111111"
            />
            <VoltageArrow
              x={LABEL.u2GuideTop.x}
              top={LABEL.u2GuideTop.y}
              bottom={LABEL.u2GuideBottom.y}
              color="#111111"
            />

            <line
              x1={LABEL.coreGuideStart.x}
              y1={LABEL.coreGuideStart.y}
              x2={LABEL.coreGuideEnd.x}
              y2={LABEL.coreGuideEnd.y}
              stroke={STYLE.textMuted}
              strokeWidth="2"
            />
            <line
              x1={LABEL.fluxGuideStart.x}
              y1={LABEL.fluxGuideStart.y}
              x2={LABEL.fluxGuideEnd.x}
              y2={LABEL.fluxGuideEnd.y}
              stroke={STYLE.textMuted}
              strokeWidth="2"
            />
            <line
              x1={LABEL.electromagneticGuideStart.x}
              y1={LABEL.electromagneticGuideStart.y}
              x2={LABEL.electromagneticGuideEnd.x}
              y2={LABEL.electromagneticGuideEnd.y}
              stroke={STYLE.textMuted}
              strokeWidth="2"
            />
            <line
              x1={LABEL.primaryGuideStart.x}
              y1={LABEL.primaryGuideStart.y}
              x2={LABEL.primaryGuideEnd.x}
              y2={LABEL.primaryGuideEnd.y}
              stroke={STYLE.textMuted}
              strokeWidth="2"
            />
            <line
              x1={LABEL.secondaryGuideStart.x}
              y1={LABEL.secondaryGuideStart.y}
              x2={LABEL.secondaryGuideEnd.x}
              y2={LABEL.secondaryGuideEnd.y}
              stroke={STYLE.textMuted}
              strokeWidth="2"
            />

            <text x={LABEL.primaryTitle.x} y={LABEL.primaryTitle.y} fill={STYLE.text} fontSize="18" fontWeight="600" textAnchor="middle">
              Primary Winding
            </text>
            <text x={LABEL.secondaryTitle.x} y={LABEL.secondaryTitle.y} fill={STYLE.text} fontSize="18" fontWeight="600" textAnchor="middle">
              Secondary Winding
            </text>
            <text x={LABEL.ironCore.x} y={LABEL.ironCore.y} fill={STYLE.text} fontSize="18" fontWeight="500" textAnchor="middle">
              Iron Core
            </text>
            <text x={LABEL.magneticFlux.x} y={LABEL.magneticFlux.y} fill={STYLE.text} fontSize="18" fontWeight="500" textAnchor="middle">
              Magnetic flux
            </text>
            <text x={LABEL.electromagneticField.x} y={LABEL.electromagneticField.y} fill={STYLE.textMuted} fontSize="12.5" fontWeight="700" textAnchor="middle">
              Active EM field
            </text>

            <text x={LABEL.i1.x} y={LABEL.i1.y} fill="#111111" fontSize="28" fontWeight="500" textAnchor="middle">
              I
            </text>
            <text x={LABEL.i1.x + 12} y={LABEL.i1.y + 8} fill="#111111" fontSize="17" fontWeight="500">
              1
            </text>
            <text x={LABEL.i2.x} y={LABEL.i2.y} fill="#111111" fontSize="28" fontWeight="500" textAnchor="middle">
              I
            </text>
            <text x={LABEL.i2.x + 12} y={LABEL.i2.y + 8} fill="#111111" fontSize="17" fontWeight="500">
              2
            </text>
            <text x={LABEL.u1.x} y={LABEL.u1.y} fill="#111111" fontSize="28" fontWeight="500" textAnchor="middle">
              U
            </text>
            <text x={LABEL.u1.x + 14} y={LABEL.u1.y + 8} fill="#111111" fontSize="17" fontWeight="500">
              1
            </text>
            <text x={LABEL.u2.x} y={LABEL.u2.y} fill="#111111" fontSize="28" fontWeight="500" textAnchor="middle">
              U
            </text>
            <text x={LABEL.u2.x + 14} y={LABEL.u2.y + 8} fill="#111111" fontSize="17" fontWeight="500">
              2
            </text>
            <text x={LABEL.n1.x} y={LABEL.n1.y} fill="#111111" fontSize="32" fontWeight="500">
              N
            </text>
            <text x={LABEL.n1.x + 27} y={LABEL.n1.y + 10} fill="#111111" fontSize="19" fontWeight="500">
              1
            </text>
            <text x={LABEL.primaryTurnsValue.x} y={LABEL.primaryTurnsValue.y} fill={STYLE.textMuted} fontSize="12" fontWeight="700" textAnchor="middle">
              {state.primaryTurns} turns
            </text>
            <text x={LABEL.n2.x} y={LABEL.n2.y} fill="#111111" fontSize="32" fontWeight="500">
              N
            </text>
            <text x={LABEL.n2.x + 27} y={LABEL.n2.y + 10} fill="#111111" fontSize="19" fontWeight="500">
              2
            </text>
            <text x={LABEL.secondaryTurnsValue.x} y={LABEL.secondaryTurnsValue.y} fill={STYLE.textMuted} fontSize="12" fontWeight="700" textAnchor="middle">
              {state.secondaryTurns} turns
            </text>

            <text x={LABEL.inputLabel.x} y={LABEL.inputLabel.y} fill={STYLE.textMuted} fontSize="12.5" fontWeight="800" textAnchor="middle">
              Input AC
            </text>
            <text x={LABEL.outputLabel.x} y={LABEL.outputLabel.y} fill={STYLE.textMuted} fontSize="13" fontWeight="800" textAnchor="middle">
              Induced Output
            </text>

            <text x={LABEL.step1.x} y={LABEL.step1.y} fill={STYLE.textMuted} fontSize="12" fontWeight="800" textAnchor="middle">
              STEP 1
            </text>
            <text x={LABEL.step2.x} y={LABEL.step2.y} fill={STYLE.textMuted} fontSize="12" fontWeight="800" textAnchor="middle">
              STEP 2
            </text>
            <text x={LABEL.step3.x} y={LABEL.step3.y} fill={STYLE.textMuted} fontSize="12" fontWeight="800" textAnchor="middle">
              STEP 3
            </text>

            <rect
              x={LABEL.engineeringStrip.x}
              y={LABEL.engineeringStrip.y}
              width={LABEL.engineeringStrip.width}
              height={LABEL.engineeringStrip.height}
              rx="14"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="1.4"
            />
            <line
              x1={LABEL.engineeringStripDivider1.x}
              y1={LABEL.engineeringStripDivider1.y}
              x2={LABEL.engineeringStripDivider1.x}
              y2={LABEL.engineeringStripDivider1.y + 38}
              stroke="#cbd5e1"
              strokeWidth="1.2"
            />
            <line
              x1={LABEL.engineeringStripDivider2.x}
              y1={LABEL.engineeringStripDivider2.y}
              x2={LABEL.engineeringStripDivider2.x}
              y2={LABEL.engineeringStripDivider2.y + 38}
              stroke="#cbd5e1"
              strokeWidth="1.2"
            />
            <text x={LABEL.engineeringStripMode.x} y={LABEL.engineeringStripMode.y} fill="#64748b" fontSize="10.5" fontWeight="900" textAnchor="middle">
              FLOW MODE
            </text>
            <text x={LABEL.engineeringStripModeValue.x} y={LABEL.engineeringStripModeValue.y} fill={palette.color} fontSize="11.6" fontWeight="900" textAnchor="middle">
              {palette.badge}
            </text>
            <text x={LABEL.engineeringStripElectrical.x} y={LABEL.engineeringStripElectrical.y} fill="#64748b" fontSize="10.5" fontWeight="900" textAnchor="middle">
              ELECTRICAL
            </text>
            <text x={LABEL.engineeringStripElectricalValue.x} y={LABEL.engineeringStripElectricalValue.y} fill={STYLE.textMuted} fontSize="10.2" fontWeight="800" textAnchor="middle">
              Input {formatNumber(snapshot.inputVoltage, 0)}V | Output {formatNumber(snapshot.outputVoltage, 1)}V | Ratio {formatNumber(snapshot.turnsRatio, 2)}
            </text>
            <text x={LABEL.engineeringStripFlux.x} y={LABEL.engineeringStripFlux.y} fill="#64748b" fontSize="10.5" fontWeight="900" textAnchor="middle">
              MAGNETIC
            </text>
            <text x={LABEL.engineeringStripFluxValue.x} y={LABEL.engineeringStripFluxValue.y} fill="#0f172a" fontSize="11.2" fontWeight="900" textAnchor="middle">
              Flux {formatNumber(snapshot.fluxLevel * 100, 0)}%
            </text>

            <IndicatorDot
              x={LABEL.indicatorInput.x}
              y={LABEL.indicatorInput.y}
              active={snapshot.liveIndicators.inputActive}
              label="Input active"
              labelX={LABEL.indicatorInputText.x}
              labelY={LABEL.indicatorInputText.y}
            />
            <IndicatorDot
              x={LABEL.indicatorFlux.x}
              y={LABEL.indicatorFlux.y}
              active={snapshot.liveIndicators.fluxActive}
              label="Flux active"
              labelX={LABEL.indicatorFluxText.x}
              labelY={LABEL.indicatorFluxText.y}
            />
            <IndicatorDot
              x={LABEL.indicatorSecondary.x}
              y={LABEL.indicatorSecondary.y}
              active={snapshot.liveIndicators.secondaryInduced}
              label="Secondary induced"
              labelX={LABEL.indicatorSecondaryText.x}
              labelY={LABEL.indicatorSecondaryText.y}
            />
            <IndicatorDot
              x={LABEL.indicatorIsolation.x}
              y={LABEL.indicatorIsolation.y}
              active={snapshot.liveIndicators.isolationConfirmed}
              label="Isolation confirmed"
              labelX={LABEL.indicatorIsolationText.x}
              labelY={LABEL.indicatorIsolationText.y}
            />

            <DebugTerminalDots
              visible={showDebugDots}
              points={[
                DEBUG_NODE.primaryTopInput,
                DEBUG_NODE.primaryTopCoil,
                DEBUG_NODE.primaryBottomInput,
                DEBUG_NODE.primaryBottomCoil,
                DEBUG_NODE.secondaryTopCoil,
                DEBUG_NODE.secondaryTopOutput,
                DEBUG_NODE.secondaryBottomCoil,
                DEBUG_NODE.secondaryBottomOutput,
                DEBUG_NODE.fluxTopLeft,
                DEBUG_NODE.fluxTopRight,
                DEBUG_NODE.fluxBottomRight,
                DEBUG_NODE.fluxBottomLeft,
                DEBUG_NODE.fieldCenter,
                DEBUG_NODE.fieldTop,
                DEBUG_NODE.fieldBottom,
              ]}
            />
          </g>
        </svg>
      </div>
    </section>
  );
}
