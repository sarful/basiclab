"use client";

import { motion } from "framer-motion";

import { clamp, formatNumber } from "../01_transformer_interactive_simulation/logic";

import type {
  CenterTapTransformerFlowMode,
  CenterTapTransformerSnapshot,
  CenterTapTransformerState,
} from "./centerTapTransformerTypes";

type Point = { x: number; y: number };
type Offset = { x: number; y: number };
type ComponentBox = { x: number; y: number; width: number; height: number; rotate: number };
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
  secondaryUpper: 1,
  secondaryLower: 1,
  fluxPath: 1,
} as const;

export const COMPONENT_OFFSET = {
  core: { x: 0, y: 0 },
  primaryWinding: { x: 0, y: 0 },
  secondaryUpper: { x: 0, y: 0 },
  secondaryLower: { x: 0, y: 0 },
  fluxPath: { x: 0, y: 0 },
} as const satisfies Record<string, Offset>;

export const TERMINAL_OFFSET = {
  primaryTopInput: { x: 0, y: 0 },
  primaryTopCoil: { x: 0, y: 0 },
  primaryBottomInput: { x: 0, y: 0 },
  primaryBottomCoil: { x: 0, y: 0 },
  secondaryUpperCoil: { x: 0, y: 0 },
  secondaryUpperOut: { x: 0, y: 0 },
  secondaryLowerCoil: { x: 0, y: 0 },
  secondaryLowerOut: { x: 0, y: 0 },
  secondaryCenterTap: { x: 0, y: 0 },
  centerTapOut: { x: 0, y: 0 },
  fluxTopLeft: { x: 0, y: 0 },
  fluxTopRight: { x: 0, y: 0 },
  fluxBottomRight: { x: 0, y: 0 },
  fluxBottomLeft: { x: 0, y: 0 },
  fieldCenter: { x: 0, y: 0 },
  fieldTop: { x: 0, y: 0 },
  fieldBottom: { x: 0, y: 0 },
} as const satisfies Record<string, Offset>;

export const DEBUG_TERMINAL_OFFSET = {
  primaryTopInput: { x: 0, y: 0 },
  primaryTopCoil: { x: 0, y: 0 },
  primaryBottomInput: { x: 0, y: 0 },
  primaryBottomCoil: { x: 0, y: 0 },
  secondaryUpperCoil: { x: 0, y: 0 },
  secondaryUpperOut: { x: 0, y: 0 },
  secondaryLowerCoil: { x: 0, y: 0 },
  secondaryLowerOut: { x: 0, y: 0 },
  secondaryCenterTap: { x: 0, y: 0 },
  centerTapOut: { x: 0, y: 0 },
  fluxTopLeft: { x: 0, y: 0 },
  fluxTopRight: { x: 0, y: 0 },
  fluxBottomRight: { x: 0, y: 0 },
  fluxBottomLeft: { x: 0, y: 0 },
  fieldCenter: { x: 0, y: 0 },
  fieldTop: { x: 0, y: 0 },
  fieldBottom: { x: 0, y: 0 },
} as const satisfies Record<string, Offset>;

export const WIRE_OFFSET = {
  primaryTop: [] as readonly RouteOffset[],
  primaryBottom: [] as readonly RouteOffset[],
  secondaryUpper: [] as readonly RouteOffset[],
  secondaryLower: [] as readonly RouteOffset[],
  centerTap: [] as readonly RouteOffset[],
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
  text: "#2f3640",
  textMuted: "#5f6b77",
  panelBorder: "#cfd8e3",
  panelBg: "#ffffff",
  debug: "#ef4444",
  active: "#059669",
  inactive: "#94a3b8",
} as const;

const BASE_COMPONENT = {
  coreFront: { x: 244, y: 112, width: 472, height: 462, rotate: 0 },
  coreWindow: { x: 362, y: 198, width: 286, height: 278, rotate: 0 },
  coreTopFace: { x: 280, y: 68, width: 472, height: 44, rotate: 0 },
  coreSideFace: { x: 716, y: 112, width: 34, height: 462, rotate: 0 },
  primaryWindingArea: { x: 224, y: 188, width: 162, height: 274, rotate: 0 },
  secondaryUpperArea: { x: 612, y: 190, width: 124, height: 132, rotate: 0 },
  secondaryLowerArea: { x: 612, y: 336, width: 124, height: 132, rotate: 0 },
  fluxPathArea: { x: 286, y: 150, width: 382, height: 330, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

const LABEL = {
  primaryTitle: { x: 112, y: 104 },
  secondaryTitle: { x: 866, y: 122 },
  centerTapTitle: { x: 900, y: 326 },
  ironCore: { x: 506, y: 38 },
  magneticFlux: { x: 490, y: 686 },
  n1: { x: 104, y: 556 },
  n2a: { x: 814, y: 216 },
  n2b: { x: 814, y: 460 },
  ct: { x: 814, y: 350 },
  step1: { x: 84, y: 82 },
  step2: { x: 508, y: 82 },
  step3: { x: 870, y: 86 },
  inputLabel: { x: 86, y: 520 },
  outputTop: { x: 912, y: 188 },
  outputBottom: { x: 912, y: 490 },
  electromagneticField: { x: 206, y: 112 },
  engineeringStrip: { x: 238, y: 606, width: 504, height: 48 },
  engineeringStripDivider1: { x: 394, y: 612 },
  engineeringStripDivider2: { x: 602, y: 612 },
  engineeringStripMode: { x: 316, y: 618 },
  engineeringStripModeValue: { x: 316, y: 636 },
  engineeringStripElectrical: { x: 498, y: 618 },
  engineeringStripElectricalValue: { x: 498, y: 636 },
  engineeringStripFlux: { x: 672, y: 618 },
  engineeringStripFluxValue: { x: 672, y: 636 },
  indicatorInput: { x: 92, y: 576 },
  indicatorFlux: { x: 318, y: 576 },
  indicatorTap: { x: 548, y: 576 },
  indicatorOutput: { x: 778, y: 576 },
  indicatorInputText: { x: 108, y: 580 },
  indicatorFluxText: { x: 334, y: 580 },
  indicatorTapText: { x: 564, y: 580 },
  indicatorOutputText: { x: 794, y: 580 },
} as const;

type ComponentMap = {
  coreFront: ComponentBox;
  coreWindow: ComponentBox;
  coreTopFace: ComponentBox;
  coreSideFace: ComponentBox;
  primaryWindingArea: ComponentBox;
  secondaryUpperArea: ComponentBox;
  secondaryLowerArea: ComponentBox;
  fluxPathArea: ComponentBox;
};

type TerminalId = keyof typeof TERMINAL_OFFSET;
type ConnectionId = keyof typeof WIRE_OFFSET;
type ConnectionSpec = { id: ConnectionId; terminals: readonly [TerminalId, TerminalId] };

export const CONNECTION_TABLE = [
  { id: "primaryTop", terminals: ["primaryTopInput", "primaryTopCoil"] },
  { id: "primaryBottom", terminals: ["primaryBottomInput", "primaryBottomCoil"] },
  { id: "secondaryUpper", terminals: ["secondaryUpperCoil", "secondaryUpperOut"] },
  { id: "secondaryLower", terminals: ["secondaryLowerCoil", "secondaryLowerOut"] },
  { id: "centerTap", terminals: ["secondaryCenterTap", "centerTapOut"] },
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
  return { ...component, x: component.x + offset.x, y: component.y + offset.y };
}

function offsetPoint(point: Point, offset: Offset): Point {
  return { x: point.x + offset.x, y: point.y + offset.y };
}

function pathD(points: readonly Point[]) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
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

function buildComponents(): ComponentMap {
  return {
    coreFront: offsetComponent(scaleComponent(BASE_COMPONENT.coreFront, CIRCUIT_COMPONENT_SCALE.core), COMPONENT_OFFSET.core),
    coreWindow: offsetComponent(scaleComponent(BASE_COMPONENT.coreWindow, CIRCUIT_COMPONENT_SCALE.core), COMPONENT_OFFSET.core),
    coreTopFace: offsetComponent(scaleComponent(BASE_COMPONENT.coreTopFace, CIRCUIT_COMPONENT_SCALE.core), COMPONENT_OFFSET.core),
    coreSideFace: offsetComponent(scaleComponent(BASE_COMPONENT.coreSideFace, CIRCUIT_COMPONENT_SCALE.core), COMPONENT_OFFSET.core),
    primaryWindingArea: offsetComponent(scaleComponent(BASE_COMPONENT.primaryWindingArea, CIRCUIT_COMPONENT_SCALE.primaryWinding), COMPONENT_OFFSET.primaryWinding),
    secondaryUpperArea: offsetComponent(scaleComponent(BASE_COMPONENT.secondaryUpperArea, CIRCUIT_COMPONENT_SCALE.secondaryUpper), COMPONENT_OFFSET.secondaryUpper),
    secondaryLowerArea: offsetComponent(scaleComponent(BASE_COMPONENT.secondaryLowerArea, CIRCUIT_COMPONENT_SCALE.secondaryLower), COMPONENT_OFFSET.secondaryLower),
    fluxPathArea: offsetComponent(scaleComponent(BASE_COMPONENT.fluxPathArea, CIRCUIT_COMPONENT_SCALE.fluxPath), COMPONENT_OFFSET.fluxPath),
  };
}

function buildBaseTerminals(component: ComponentMap) {
  const upperCenterY = component.secondaryUpperArea.y + component.secondaryUpperArea.height / 2;
  const lowerCenterY = component.secondaryLowerArea.y + component.secondaryLowerArea.height / 2;
  const centerTapY = (upperCenterY + lowerCenterY) / 2;

  return {
    primaryTopInput: { x: 62, y: 168 },
    primaryTopCoil: { x: component.primaryWindingArea.x + 20, y: 168 },
    primaryBottomInput: { x: 62, y: 468 },
    primaryBottomCoil: { x: component.primaryWindingArea.x + 20, y: 468 },
    secondaryUpperCoil: { x: component.secondaryUpperArea.x + component.secondaryUpperArea.width - 10, y: upperCenterY - 20 },
    secondaryUpperOut: { x: 942, y: upperCenterY - 20 },
    secondaryLowerCoil: { x: component.secondaryLowerArea.x + component.secondaryLowerArea.width - 10, y: lowerCenterY + 20 },
    secondaryLowerOut: { x: 942, y: lowerCenterY + 20 },
    secondaryCenterTap: { x: component.secondaryUpperArea.x + component.secondaryUpperArea.width - 8, y: centerTapY },
    centerTapOut: { x: 922, y: centerTapY },
    fluxTopLeft: { x: component.fluxPathArea.x, y: component.fluxPathArea.y },
    fluxTopRight: { x: component.fluxPathArea.x + component.fluxPathArea.width, y: component.fluxPathArea.y },
    fluxBottomRight: { x: component.fluxPathArea.x + component.fluxPathArea.width, y: component.fluxPathArea.y + component.fluxPathArea.height },
    fluxBottomLeft: { x: component.fluxPathArea.x, y: component.fluxPathArea.y + component.fluxPathArea.height },
    fieldCenter: {
      x: component.primaryWindingArea.x + component.primaryWindingArea.width / 2 - 8,
      y: component.primaryWindingArea.y + component.primaryWindingArea.height / 2,
    },
    fieldTop: {
      x: component.primaryWindingArea.x + component.primaryWindingArea.width / 2 - 8,
      y: component.primaryWindingArea.y + 16,
    },
    fieldBottom: {
      x: component.primaryWindingArea.x + component.primaryWindingArea.width / 2 - 8,
      y: component.primaryWindingArea.y + component.primaryWindingArea.height - 16,
    },
  } as const satisfies Record<TerminalId, Point>;
}

function buildNodes(component: ComponentMap) {
  const base = buildBaseTerminals(component);
  return Object.fromEntries(
    Object.entries(base).map(([key, point]) => [key, offsetPoint(point, TERMINAL_OFFSET[key as TerminalId])]),
  ) as Record<TerminalId, Point>;
}

function buildDebugNodes(node: Record<TerminalId, Point>) {
  return Object.fromEntries(
    Object.entries(node).map(([key, point]) => [key, offsetPoint(point, DEBUG_TERMINAL_OFFSET[key as TerminalId])]),
  ) as Record<TerminalId, Point>;
}

function buildConnectionPoints(connection: ConnectionSpec, node: Record<TerminalId, Point>) {
  const start = node[connection.terminals[0]];
  const end = node[connection.terminals[1]];
  const midpoint = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
  const waypoints = WIRE_OFFSET[connection.id].map((offset) => {
    if (offset.anchor === "start") return offsetPoint(start, offset);
    if (offset.anchor === "end") return offsetPoint(end, offset);
    return offsetPoint(midpoint, offset);
  });
  return [start, ...waypoints, end];
}

function buildWires(node: Record<TerminalId, Point>) {
  return Object.fromEntries(
    CONNECTION_TABLE.map((connection) => [connection.id, buildConnectionPoints(connection, node)]),
  ) as Record<ConnectionId, Point[]>;
}

function buildPaths(wire: Record<ConnectionId, Point[]>, node: Record<TerminalId, Point>) {
  return {
    primaryTop: pathD(wire.primaryTop),
    primaryTopReverse: reversePathD(wire.primaryTop),
    primaryBottom: pathD(wire.primaryBottom),
    primaryBottomReverse: reversePathD(wire.primaryBottom),
    secondaryUpper: pathD(wire.secondaryUpper),
    secondaryUpperReverse: reversePathD(wire.secondaryUpper),
    secondaryLower: pathD(wire.secondaryLower),
    secondaryLowerReverse: reversePathD(wire.secondaryLower),
    centerTap: pathD(wire.centerTap),
    centerTapReverse: reversePathD(wire.centerTap),
    fluxLoop: [
      `M ${node.fluxTopLeft.x} ${node.fluxTopLeft.y}`,
      `L ${node.fluxTopRight.x} ${node.fluxTopRight.y}`,
      `Q ${node.fluxTopRight.x + 22} ${node.fluxTopRight.y} ${node.fluxTopRight.x + 22} ${node.fluxTopRight.y + 22}`,
      `L ${node.fluxBottomRight.x + 22} ${node.fluxBottomRight.y - 22}`,
      `Q ${node.fluxBottomRight.x + 22} ${node.fluxBottomRight.y} ${node.fluxBottomRight.x} ${node.fluxBottomRight.y}`,
      `L ${node.fluxBottomLeft.x} ${node.fluxBottomLeft.y}`,
      `Q ${node.fluxBottomLeft.x - 22} ${node.fluxBottomLeft.y} ${node.fluxBottomLeft.x - 22} ${node.fluxBottomLeft.y - 22}`,
      `L ${node.fluxTopLeft.x - 22} ${node.fluxTopLeft.y + 22}`,
      `Q ${node.fluxTopLeft.x - 22} ${node.fluxTopLeft.y} ${node.fluxTopLeft.x} ${node.fluxTopLeft.y}`,
    ].join(" "),
  } as const;
}

function flowPalette(flowMode: CenterTapTransformerFlowMode) {
  if (flowMode === "electron") {
    return { color: STYLE.electronFlow, soft: "#93c5fd", badge: "Electron Flow" };
  }
  return { color: STYLE.conventionalFlow, soft: "#fdba74", badge: "Conventional Flow" };
}

function buildWindingGeometry(area: ComponentBox, turnCount: number, side: "primary" | "secondary") {
  const normalizedTurns = clamp(turnCount, 40, 2000);
  const loopCount = Math.round(
    side === "primary" ? 6 + ((normalizedTurns - 40) / 1960) * 12 : 3 + ((normalizedTurns - 40) / 1960) * 8,
  );
  const availableHeight = area.height - 16;
  const pitch = availableHeight / Math.max(loopCount, 1);
  return {
    loopCount,
    pitch,
    width: area.width * (side === "primary" ? 0.88 : 0.82),
    height: clamp(pitch * 0.46, 8, side === "primary" ? 14 : 12),
    centerX: area.x + area.width / 2,
    startY: area.y + 10,
  };
}

function WindingBlock({ geometry }: { geometry: ReturnType<typeof buildWindingGeometry> }) {
  return (
    <g>
      {Array.from({ length: geometry.loopCount }).map((_, index) => {
        const y = geometry.startY + index * geometry.pitch;
        return (
          <g key={`${geometry.centerX}-${y}-${index}`}>
            <ellipse cx={geometry.centerX} cy={y} rx={geometry.width / 2} ry={geometry.height} fill={STYLE.copperFill} stroke={STYLE.copperStroke} strokeWidth="1.6" />
            <ellipse cx={geometry.centerX} cy={y} rx={geometry.width / 2 - 12} ry={Math.max(geometry.height - 4, 3)} fill="none" stroke="#f59e42" strokeWidth="1.2" opacity="0.9" />
          </g>
        );
      })}
    </g>
  );
}

function SecondaryTapSpine({
  topY,
  bottomY,
  x,
}: {
  topY: number;
  bottomY: number;
  x: number;
}) {
  return (
    <g opacity="0.85">
      <line
        x1={x}
        y1={topY}
        x2={x}
        y2={bottomY}
        stroke="#e39a46"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <line
        x1={x}
        y1={topY}
        x2={x}
        y2={bottomY}
        stroke="#ffc06a"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  );
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
            <animateMotion dur={`${duration}s`} begin={`${index * 0.35}s`} repeatCount="indefinite" path={path} keyPoints={reverse ? "1;0" : "0;1"} keyTimes="0;1" calcMode="linear" />
          </circle>
          <circle r="2.2" fill={color}>
            <animateMotion dur={`${duration}s`} begin={`${index * 0.35}s`} repeatCount="indefinite" path={path} keyPoints={reverse ? "1;0" : "0;1"} keyTimes="0;1" calcMode="linear" />
          </circle>
        </g>
      ))}
    </g>
  );
}

function WireSegment({ points }: { points: readonly Point[] }) {
  return <path d={pathD(points)} stroke={STYLE.wire} strokeWidth={BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
}

function DebugTerminalDots({ points, visible }: { points: readonly Point[]; visible: boolean }) {
  if (!visible) return null;
  return (
    <g>
      {points.map((point, index) => (
        <circle key={`${point.x}-${point.y}-${index}`} cx={point.x} cy={point.y} r="4.5" fill={STYLE.debug} stroke="#ffffff" strokeWidth="1.5" />
      ))}
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
      <rect x={x - 14} y={y - 10} width="184" height="24" rx="12" fill={active ? "#ecfdf5" : "#f8fafc"} stroke={active ? "#a7f3d0" : "#cbd5e1"} strokeWidth="1.4" />
      <circle cx={x} cy={y} r="8" fill={active ? STYLE.active : STYLE.inactive} opacity="0.32" />
      <circle cx={x} cy={y} r="4" fill={active ? STYLE.active : STYLE.inactive} />
      <text x={labelX} y={labelY} fill={active ? "#0f172a" : STYLE.textMuted} fontSize="11.5" fontWeight="800">
        {label}
      </text>
    </g>
  );
}

function ElectromagneticField({ center, activeStrength }: { center: Point; activeStrength: number }) {
  const bandColor = "#7cc1eb";
  const opacity = 0.18 + activeStrength * 0.28;

  return (
    <g>
      {[0, 1, 2].map((index) => {
        const rx = 82 + index * 22;
        const ry = 108 + index * 26;
        return (
          <motion.ellipse
            key={index}
            cx={center.x}
            cy={center.y}
            rx={rx}
            ry={ry}
            fill="none"
            stroke={bandColor}
            strokeDasharray="8 10"
            strokeWidth="2"
            opacity={opacity - index * 0.05}
            animate={{ opacity: [opacity - index * 0.06, opacity + 0.1, opacity - index * 0.06] }}
            transition={{ repeat: Infinity, duration: 2.8, delay: index * 0.25 }}
          />
        );
      })}
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
    <motion.g animate={{ x: direction === 1 ? [0, 6, 0] : [0, -6, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}>
      <path d={`M ${x} ${y} L ${endX} ${y}`} stroke={color} strokeWidth="4" strokeLinecap="round" />
      <path d={`M ${headX} ${y - 9} L ${endX} ${y} L ${headX} ${y + 9}`} stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </motion.g>
  );
}

export default function CenterTapTransformerCanvas({
  state,
  snapshot,
}: {
  state: CenterTapTransformerState;
  snapshot: CenterTapTransformerSnapshot;
}) {
  const COMPONENT = buildComponents();
  const NODE = buildNodes(COMPONENT);
  const DEBUG_NODE = buildDebugNodes(NODE);
  const WIRE = buildWires(NODE);
  const PATH = buildPaths(WIRE, NODE);

  const primaryGeometry = buildWindingGeometry(COMPONENT.primaryWindingArea, state.primaryTurns, "primary");
  const upperGeometry = buildWindingGeometry(COMPONENT.secondaryUpperArea, state.upperSecondaryTurns, "secondary");
  const lowerGeometry = buildWindingGeometry(COMPONENT.secondaryLowerArea, state.lowerSecondaryTurns, "secondary");

  const palette = flowPalette(state.flowMode);
  const fluxOpacity = clamp(snapshot.fluxLevel, 0.25, 1);
  const showDebugDots = SHOW_DEBUG_TERMINAL_DOTS || state.showDebugDots;
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);
  const forward = state.flowMode === "conventional";
  const fluxDuration = clamp(2.8 - snapshot.fluxLevel * 1.2, 1.2, 2.8);
  const secondarySpineX = COMPONENT.secondaryUpperArea.x + COMPONENT.secondaryUpperArea.width / 2;
  const secondarySpineTop = COMPONENT.secondaryUpperArea.y + 8;
  const secondarySpineBottom =
    COMPONENT.secondaryLowerArea.y + COMPONENT.secondaryLowerArea.height - 8;

  return (
    <section className="rounded-[28px] border border-slate-300 bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-5 xl:p-6">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-cyan-700">Simulation Canvas</p>
          <h2 className="mt-2 text-2xl font-black text-slate-900">Center-Tap Transformer Sketch</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            One primary winding drives a split secondary so the midpoint becomes a center tap for balanced dual-ended output.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {snapshot.statusBadges.map((badge) => (
            <span key={badge} className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-700">
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
            <rect x="6" y="6" width="968" height="688" rx="22" fill={STYLE.panelBg} stroke={STYLE.panelBorder} strokeWidth="2" />

            <polygon points={`${COMPONENT.coreTopFace.x},${COMPONENT.coreTopFace.y + COMPONENT.coreTopFace.height} ${COMPONENT.coreTopFace.x + 36},${COMPONENT.coreTopFace.y} ${COMPONENT.coreTopFace.x + COMPONENT.coreTopFace.width + 36},${COMPONENT.coreTopFace.y} ${COMPONENT.coreTopFace.x + COMPONENT.coreTopFace.width},${COMPONENT.coreTopFace.y + COMPONENT.coreTopFace.height}`} fill={STYLE.coreTopFill} stroke={STYLE.coreStroke} strokeWidth="2" />
            <polygon points={`${COMPONENT.coreSideFace.x},${COMPONENT.coreSideFace.y} ${COMPONENT.coreSideFace.x + COMPONENT.coreSideFace.width},${COMPONENT.coreSideFace.y - 44} ${COMPONENT.coreSideFace.x + COMPONENT.coreSideFace.width},${COMPONENT.coreSideFace.y + COMPONENT.coreSideFace.height - 44} ${COMPONENT.coreSideFace.x},${COMPONENT.coreSideFace.y + COMPONENT.coreSideFace.height}`} fill={STYLE.coreSideFill} stroke={STYLE.coreStroke} strokeWidth="2" />
            <rect x={COMPONENT.coreFront.x} y={COMPONENT.coreFront.y} width={COMPONENT.coreFront.width} height={COMPONENT.coreFront.height} fill={STYLE.coreFrontFill} stroke={STYLE.coreStroke} strokeWidth="2" />
            <rect x={COMPONENT.coreWindow.x} y={COMPONENT.coreWindow.y} width={COMPONENT.coreWindow.width} height={COMPONENT.coreWindow.height} fill="#ffffff" stroke={STYLE.coreStroke} strokeWidth="2" />

            <ElectromagneticField center={NODE.fieldCenter} activeStrength={snapshot.fluxLevel} />

            <path d={PATH.fluxLoop} stroke={STYLE.fluxSoft} strokeWidth="18" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.22 + fluxOpacity * 0.1} />
            <path d={PATH.fluxLoop} stroke={STYLE.flux} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={fluxOpacity} />

            <FlowParticles path={PATH.fluxLoop} color={STYLE.flux} softColor={STYLE.fluxSoft} duration={fluxDuration} count={5} />

            <WireSegment points={WIRE.primaryTop} />
            <WireSegment points={WIRE.primaryBottom} />
            <WireSegment points={WIRE.secondaryUpper} />
            <WireSegment points={WIRE.secondaryLower} />
            <WireSegment points={WIRE.centerTap} />

            <FlowParticles path={forward ? PATH.primaryTop : PATH.primaryTopReverse} color={palette.color} softColor={palette.soft} duration={1.9} count={3} />
            <FlowParticles path={forward ? PATH.primaryBottomReverse : PATH.primaryBottom} color={palette.color} softColor={palette.soft} duration={1.9} count={2} />
            <FlowParticles path={forward ? PATH.secondaryUpper : PATH.secondaryUpperReverse} color={palette.color} softColor={palette.soft} duration={2.1} count={2} />
            <FlowParticles path={forward ? PATH.secondaryLowerReverse : PATH.secondaryLower} color={palette.color} softColor={palette.soft} duration={2.1} count={2} />
            <FlowParticles path={forward ? PATH.centerTap : PATH.centerTapReverse} color={palette.color} softColor={palette.soft} duration={2.2} count={1} />

            <WindingBlock geometry={primaryGeometry} />
            <SecondaryTapSpine
              x={secondarySpineX}
              topY={secondarySpineTop}
              bottomY={secondarySpineBottom}
            />
            <WindingBlock geometry={upperGeometry} />
            <WindingBlock geometry={lowerGeometry} />

            <CurrentArrow x={86} y={146} width={76} color={palette.color} direction={forward ? 1 : -1} />
            <CurrentArrow x={826} y={220} width={62} color={palette.color} direction={forward ? 1 : -1} />
            <CurrentArrow x={826} y={452} width={62} color={palette.color} direction={forward ? 1 : -1} />

            <text x={LABEL.primaryTitle.x} y={LABEL.primaryTitle.y} fill={STYLE.text} fontSize="18" fontWeight="600" textAnchor="middle">Primary Winding</text>
            <text x={LABEL.secondaryTitle.x} y={LABEL.secondaryTitle.y} fill={STYLE.text} fontSize="18" fontWeight="600" textAnchor="middle">Split Secondary</text>
            <text x={LABEL.centerTapTitle.x} y={LABEL.centerTapTitle.y} fill={STYLE.textMuted} fontSize="14" fontWeight="800" textAnchor="middle">Center Tap</text>
            <text x={LABEL.ironCore.x} y={LABEL.ironCore.y} fill={STYLE.text} fontSize="18" fontWeight="500" textAnchor="middle">Iron Core</text>
            <text x={LABEL.magneticFlux.x} y={LABEL.magneticFlux.y} fill={STYLE.text} fontSize="18" fontWeight="500" textAnchor="middle">Magnetic flux</text>
            <text x={LABEL.electromagneticField.x} y={LABEL.electromagneticField.y} fill={STYLE.textMuted} fontSize="12.5" fontWeight="700" textAnchor="middle">Active EM field</text>

            <text x={LABEL.step1.x} y={LABEL.step1.y} fill={STYLE.textMuted} fontSize="12" fontWeight="800" textAnchor="middle">STEP 1</text>
            <text x={LABEL.step2.x} y={LABEL.step2.y} fill={STYLE.textMuted} fontSize="12" fontWeight="800" textAnchor="middle">STEP 2</text>
            <text x={LABEL.step3.x} y={LABEL.step3.y} fill={STYLE.textMuted} fontSize="12" fontWeight="800" textAnchor="middle">STEP 3</text>

            <text x={LABEL.n1.x} y={LABEL.n1.y} fill="#111111" fontSize="32" fontWeight="500">N</text>
            <text x={LABEL.n1.x + 27} y={LABEL.n1.y + 10} fill="#111111" fontSize="19" fontWeight="500">1</text>
            <text x={LABEL.n2a.x} y={LABEL.n2a.y} fill="#111111" fontSize="22" fontWeight="700">N2a</text>
            <text x={LABEL.n2b.x} y={LABEL.n2b.y} fill="#111111" fontSize="22" fontWeight="700">N2b</text>
            <text x={LABEL.ct.x} y={LABEL.ct.y} fill="#111111" fontSize="20" fontWeight="800">CT</text>
            <text x={LABEL.inputLabel.x} y={LABEL.inputLabel.y} fill={STYLE.textMuted} fontSize="12.5" fontWeight="800" textAnchor="middle">Input AC</text>
            <text x={LABEL.outputTop.x} y={LABEL.outputTop.y} fill={STYLE.textMuted} fontSize="12.5" fontWeight="800" textAnchor="middle">Upper end</text>
            <text x={LABEL.outputBottom.x} y={LABEL.outputBottom.y} fill={STYLE.textMuted} fontSize="12.5" fontWeight="800" textAnchor="middle">Lower end</text>

            <rect x={LABEL.engineeringStrip.x} y={LABEL.engineeringStrip.y} width={LABEL.engineeringStrip.width} height={LABEL.engineeringStrip.height} rx="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.4" />
            <line x1={LABEL.engineeringStripDivider1.x} y1={LABEL.engineeringStripDivider1.y} x2={LABEL.engineeringStripDivider1.x} y2={LABEL.engineeringStripDivider1.y + 32} stroke="#cbd5e1" strokeWidth="1.2" />
            <line x1={LABEL.engineeringStripDivider2.x} y1={LABEL.engineeringStripDivider2.y} x2={LABEL.engineeringStripDivider2.x} y2={LABEL.engineeringStripDivider2.y + 32} stroke="#cbd5e1" strokeWidth="1.2" />
            <text x={LABEL.engineeringStripMode.x} y={LABEL.engineeringStripMode.y} fill="#64748b" fontSize="10.5" fontWeight="900" textAnchor="middle">FLOW MODE</text>
            <text x={LABEL.engineeringStripModeValue.x} y={LABEL.engineeringStripModeValue.y} fill={palette.color} fontSize="11.6" fontWeight="900" textAnchor="middle">{palette.badge}</text>
            <text x={LABEL.engineeringStripElectrical.x} y={LABEL.engineeringStripElectrical.y} fill="#64748b" fontSize="10.5" fontWeight="900" textAnchor="middle">ELECTRICAL</text>
            <text x={LABEL.engineeringStripElectricalValue.x} y={LABEL.engineeringStripElectricalValue.y} fill={STYLE.textMuted} fontSize="10.1" fontWeight="800" textAnchor="middle">
              Top {formatNumber(snapshot.upperVoltage, 1)}V | CT | Bottom {formatNumber(snapshot.lowerVoltage, 1)}V
            </text>
            <text x={LABEL.engineeringStripFlux.x} y={LABEL.engineeringStripFlux.y} fill="#64748b" fontSize="10.5" fontWeight="900" textAnchor="middle">MAGNETIC</text>
            <text x={LABEL.engineeringStripFluxValue.x} y={LABEL.engineeringStripFluxValue.y} fill="#0f172a" fontSize="11.2" fontWeight="900" textAnchor="middle">
              End-to-end {formatNumber(snapshot.endToEndVoltage, 1)}V | Flux {formatNumber(snapshot.fluxLevel * 100, 0)}%
            </text>

            <IndicatorDot x={LABEL.indicatorInput.x} y={LABEL.indicatorInput.y} active={snapshot.liveIndicators.inputActive} label="Input active" labelX={LABEL.indicatorInputText.x} labelY={LABEL.indicatorInputText.y} />
            <IndicatorDot x={LABEL.indicatorFlux.x} y={LABEL.indicatorFlux.y} active={snapshot.liveIndicators.fluxActive} label="Flux active" labelX={LABEL.indicatorFluxText.x} labelY={LABEL.indicatorFluxText.y} />
            <IndicatorDot x={LABEL.indicatorTap.x} y={LABEL.indicatorTap.y} active={snapshot.liveIndicators.centerTapReady} label="Center tap ready" labelX={LABEL.indicatorTapText.x} labelY={LABEL.indicatorTapText.y} />
            <IndicatorDot x={LABEL.indicatorOutput.x} y={LABEL.indicatorOutput.y} active={snapshot.liveIndicators.outputAvailable} label="Output available" labelX={LABEL.indicatorOutputText.x} labelY={LABEL.indicatorOutputText.y} />

            <DebugTerminalDots
              visible={showDebugDots}
              points={[
                DEBUG_NODE.primaryTopInput,
                DEBUG_NODE.primaryTopCoil,
                DEBUG_NODE.primaryBottomInput,
                DEBUG_NODE.primaryBottomCoil,
                DEBUG_NODE.secondaryUpperCoil,
                DEBUG_NODE.secondaryUpperOut,
                DEBUG_NODE.secondaryLowerCoil,
                DEBUG_NODE.secondaryLowerOut,
                DEBUG_NODE.secondaryCenterTap,
                DEBUG_NODE.centerTapOut,
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
