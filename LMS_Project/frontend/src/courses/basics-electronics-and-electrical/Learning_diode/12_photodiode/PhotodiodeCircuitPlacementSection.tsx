"use client";

import BackgroundPixelGred from "@/src/library/background_pixel_gred";
import PhotodiodeSymbol from "@/src/library/electronics-symbol-library/diodes/PhotodiodeSymbol";
import ResistorSymbol from "@/src/library/electronics-symbol-library/passive/ResistorSymbol";
import BatterySymbol, {
  BATTERY_TERMINAL_OFFSET,
} from "@/src/library/electronics-symbol-library/sources/BatterySymbol";
import VoltmeterSymbol from "@/src/library/meters/VoltmeterSymbol";

import type { FlowMode, PhotodiodeState } from "./types";

type Offset = {
  x: number;
  y: number;
};

type Point = {
  x: number;
  y: number;
};

const SHOW_DEBUG_TERMINAL_DOTS = false;

const VIEW_BOX = {
  width: 1200,
  height: 760,
} as const;

const CIRCUIT_COMPONENT_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;
const CIRCUIT_WIRE_SCALE = 1;
const BASE_WIRE_WIDTH = 4;

const COMPONENT_OFFSET = {
  battery: { x: 0, y: 0 },
  photodiode: { x: 0, y: -10 },
  resistor: { x: 0, y: 20 },
  voltmeter: { x: 0, y: 0 },
} as const satisfies Record<string, Offset>;

const WIRE_OFFSET = {
  topRailY: { x: 0, y: 0 },
  bottomRailY: { x: 0, y: 0 },
  resistorBranch: { x: 0, y: 0 },
  meterSenseTop: { x: 0, y: -55 },
  meterSenseBottom: { x: 0, y: 0 },
} as const satisfies Record<string, Offset>;

const DEBUG_TERMINAL_OFFSET = {
  batteryPositive: { x: -14, y: 0 },
  batteryNegative: { x: -14, y: -25 },
  photodiodeCathode: { x: 0, y: 10 },
  photodiodeAnode: { x: 0, y: 10 },
  resistorTop: { x: 0, y: -30 },
  resistorBottom: { x: 0, y: -40 },
  voltmeterPositive: { x: 0, y: 20 },
  voltmeterNegative: { x: 0, y: 0 },
} as const satisfies Record<string, Offset>;

const BASE_COMPONENT = {
  battery: { x: 90, y: 318, width: 130, height: 130 },
  photodiode: { x: 330, y: 100, width: 220, height: 160 },
  resistor: { x: 690, y: 222, width: 240, height: 130 },
  voltmeter: { x: 936, y: 214, width: 170, height: 280 },
} as const;

const TERMINAL_OFFSET = {
  photodiodeCathode: { x: 34, y: 84 },
  photodiodeAnode: { x: 190, y: 84 },
  resistorTop: { x: 120, y: 28 },
  resistorBottom: { x: 120, y: 176 },
  voltmeterPositive: { x: 84, y: 18 },
  voltmeterNegative: { x: 84, y: 246 },
} as const satisfies Record<string, Offset>;

const LABEL = {
  batteryText: { x: 206, y: 370 },
  batteryVoltage: { x: 206, y: 418 },
  circuitMode: { x: 206, y: 462 },
  photodiodeTitle: { x: 448, y: 298 },
  resistorTitle: { x: 710, y: 262 },
  resistorValue: { x: 710, y: 302 },
  outputNode: { x: 620, y: 158 },
  voltmeterTitle: { x: 1080, y: 150 },
  voltmeterReadout: { x: 1018, y: 524 },
  statusTop: { x: 1082, y: 86 },
  currentTop: { x: 1082, y: 118 },
  teachingStrip: { x: 600, y: 710 },
} as const;

const BASE_COMPONENT_GROUP = {
  battery: {
    ...BASE_COMPONENT.battery,
    x: BASE_COMPONENT.battery.x + COMPONENT_OFFSET.battery.x,
    y: BASE_COMPONENT.battery.y + COMPONENT_OFFSET.battery.y,
  },
  photodiode: {
    ...BASE_COMPONENT.photodiode,
    x: BASE_COMPONENT.photodiode.x + COMPONENT_OFFSET.photodiode.x,
    y: BASE_COMPONENT.photodiode.y + COMPONENT_OFFSET.photodiode.y,
  },
  resistor: {
    ...BASE_COMPONENT.resistor,
    x: BASE_COMPONENT.resistor.x + COMPONENT_OFFSET.resistor.x,
    y: BASE_COMPONENT.resistor.y + COMPONENT_OFFSET.resistor.y,
  },
  voltmeter: {
    ...BASE_COMPONENT.voltmeter,
    x: BASE_COMPONENT.voltmeter.x + COMPONENT_OFFSET.voltmeter.x,
    y: BASE_COMPONENT.voltmeter.y + COMPONENT_OFFSET.voltmeter.y,
  },
} as const;

const COMPONENT = BASE_COMPONENT_GROUP;

function makePoint(x: number, y: number): Point {
  return { x, y };
}

function withOffset(base: Point, offset?: Partial<Offset>): Point {
  return makePoint(base.x + (offset?.x ?? 0), base.y + (offset?.y ?? 0));
}

const WIRE = {
  stroke: "#111111",
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  senseStroke: "#111111",
} as const;

const FLOW = {
  electronColor: "#2563eb",
  conventionalColor: "#ea580c",
  dotStrokeWidth: 7,
  dashArray: "1 18",
  dashOffsetDistance: 38,
} as const;

function DebugDot({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={5} fill="#ef4444" />
      <text x={x + 8} y={y - 8} fontSize="12" fontWeight="700" fill="#ef4444">
        {label}
      </text>
    </g>
  );
}

function FlowParticles({
  active,
  isPlaying,
  path,
  duration,
  opacity,
  color,
  beginOffset = 0,
}: {
  active: boolean;
  isPlaying: boolean;
  path: string;
  duration: number;
  opacity: number;
  color: string;
  beginOffset?: number;
}) {
  if (!active) {
    return null;
  }

  return (
    <path
      d={path}
      fill="none"
      stroke={color}
      strokeWidth={FLOW.dotStrokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={FLOW.dashArray}
      strokeDashoffset={0}
      opacity={opacity}
      filter="url(#sensorFlowGlow)"
      pathLength={100}
    >
      {isPlaying ? (
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to={String(-FLOW.dashOffsetDistance)}
          dur={`${duration}s`}
          begin={`${beginOffset}s`}
          repeatCount="indefinite"
        />
      ) : null}
    </path>
  );
}

function LightSource({
  active,
  intensity,
}: {
  active: boolean;
  intensity: number;
}) {
  if (!active) {
    return null;
  }

  const opacity = Math.max(0.28, Math.min(0.92, intensity));

  return (
    <g opacity={opacity}>
      <circle
        cx="178"
        cy="88"
        r="28"
        fill="#fde68a"
        stroke="#f59e0b"
        strokeWidth="4"
      />
      <circle cx="178" cy="88" r="14" fill="#facc15" />
      {[
        ["M 178 42 L 178 18"],
        ["M 178 158 L 178 134"],
        ["M 132 88 L 108 88"],
        ["M 248 88 L 224 88"],
        ["M 144 54 L 126 36"],
        ["M 212 122 L 230 140"],
        ["M 144 122 L 126 140"],
        ["M 212 54 L 230 36"],
      ].map(([d], index) => (
        <path
          key={`sun-ray-${index}`}
          d={d}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}
      {["M 218 76 L 320 124", "M 230 56 L 356 102", "M 240 36 L 396 84"].map(
        (d, index) => (
          <path
            key={`beam-${index}`}
            d={d}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="5"
            strokeLinecap="round"
            opacity={0.92}
          />
        ),
      )}
    </g>
  );
}

function getParticleDuration(flowPercent: number) {
  const safeFlow = Math.max(1, Math.min(100, flowPercent));
  return Math.max(0.9, 3.2 - safeFlow / 34);
}

export function PhotodiodeCircuitPlacementSection({
  state,
  flowMode,
  isPlaying,
}: {
  state: PhotodiodeState;
  flowMode: FlowMode;
  isPlaying: boolean;
}) {
  const BATTERY_POSITIVE_TERMINAL = BATTERY_TERMINAL_OFFSET?.positive ?? {
    x: 81,
    y: 21,
  };
  const BATTERY_NEGATIVE_TERMINAL = BATTERY_TERMINAL_OFFSET?.negative ?? {
    x: 81,
    y: 121,
  };
  const NODE = {
    batteryPositive: withOffset(
      makePoint(
        COMPONENT.battery.x + BATTERY_POSITIVE_TERMINAL.x,
        COMPONENT.battery.y + BATTERY_POSITIVE_TERMINAL.y,
      ),
      DEBUG_TERMINAL_OFFSET.batteryPositive,
    ),
    batteryNegative: withOffset(
      makePoint(
        COMPONENT.battery.x + BATTERY_NEGATIVE_TERMINAL.x,
        COMPONENT.battery.y + BATTERY_NEGATIVE_TERMINAL.y,
      ),
      DEBUG_TERMINAL_OFFSET.batteryNegative,
    ),
    photodiodeCathode: withOffset(
      makePoint(
        COMPONENT.photodiode.x + TERMINAL_OFFSET.photodiodeCathode.x,
        COMPONENT.photodiode.y + TERMINAL_OFFSET.photodiodeCathode.y,
      ),
      DEBUG_TERMINAL_OFFSET.photodiodeCathode,
    ),
    photodiodeAnode: withOffset(
      makePoint(
        COMPONENT.photodiode.x + TERMINAL_OFFSET.photodiodeAnode.x,
        COMPONENT.photodiode.y + TERMINAL_OFFSET.photodiodeAnode.y,
      ),
      DEBUG_TERMINAL_OFFSET.photodiodeAnode,
    ),
    resistorTop: withOffset(
      makePoint(
        COMPONENT.resistor.x + TERMINAL_OFFSET.resistorTop.x,
        COMPONENT.resistor.y + TERMINAL_OFFSET.resistorTop.y,
      ),
      DEBUG_TERMINAL_OFFSET.resistorTop,
    ),
    resistorBottom: withOffset(
      makePoint(
        COMPONENT.resistor.x + TERMINAL_OFFSET.resistorBottom.x,
        COMPONENT.resistor.y + TERMINAL_OFFSET.resistorBottom.y,
      ),
      DEBUG_TERMINAL_OFFSET.resistorBottom,
    ),
    voltmeterPositive: withOffset(
      makePoint(
        COMPONENT.voltmeter.x + TERMINAL_OFFSET.voltmeterPositive.x,
        COMPONENT.voltmeter.y + TERMINAL_OFFSET.voltmeterPositive.y,
      ),
      DEBUG_TERMINAL_OFFSET.voltmeterPositive,
    ),
    voltmeterNegative: withOffset(
      makePoint(
        COMPONENT.voltmeter.x + TERMINAL_OFFSET.voltmeterNegative.x,
        COMPONENT.voltmeter.y + TERMINAL_OFFSET.voltmeterNegative.y,
      ),
      DEBUG_TERMINAL_OFFSET.voltmeterNegative,
    ),
  } as const;
  const RAIL = {
    topY: NODE.photodiodeCathode.y + WIRE_OFFSET.topRailY.y,
    bottomY: NODE.batteryNegative.y + 74 + WIRE_OFFSET.bottomRailY.y,
    leftX: NODE.batteryPositive.x,
    branchX: NODE.resistorTop.x + WIRE_OFFSET.resistorBranch.x,
    senseTopY: NODE.resistorTop.y + WIRE_OFFSET.meterSenseTop.y,
    senseBottomY: NODE.batteryNegative.y + 20 + WIRE_OFFSET.meterSenseBottom.y,
  } as const;
  const PATH = {
    supplyRail: `M ${NODE.batteryPositive.x} ${NODE.batteryPositive.y} L ${NODE.batteryPositive.x} ${RAIL.topY} L ${NODE.photodiodeCathode.x} ${RAIL.topY}`,
    supplyRailReverse: `M ${NODE.photodiodeCathode.x} ${RAIL.topY} L ${NODE.batteryPositive.x} ${RAIL.topY} L ${NODE.batteryPositive.x} ${NODE.batteryPositive.y}`,
    throughPhotodiode: `M ${NODE.photodiodeCathode.x} ${NODE.photodiodeCathode.y} L ${NODE.photodiodeAnode.x} ${NODE.photodiodeAnode.y}`,
    throughPhotodiodeReverse: `M ${NODE.photodiodeAnode.x} ${NODE.photodiodeAnode.y} L ${NODE.photodiodeCathode.x} ${NODE.photodiodeCathode.y}`,
    nodeLink: `M ${NODE.photodiodeAnode.x} ${NODE.photodiodeAnode.y} L ${NODE.resistorTop.x} ${NODE.photodiodeAnode.y} L ${NODE.resistorTop.x} ${NODE.resistorTop.y}`,
    nodeLinkReverse: `M ${NODE.resistorTop.x} ${NODE.resistorTop.y} L ${NODE.resistorTop.x} ${NODE.photodiodeAnode.y} L ${NODE.photodiodeAnode.x} ${NODE.photodiodeAnode.y}`,
    throughResistor: `M ${NODE.resistorTop.x} ${NODE.resistorTop.y} L ${NODE.resistorBottom.x} ${NODE.resistorBottom.y}`,
    throughResistorReverse: `M ${NODE.resistorBottom.x} ${NODE.resistorBottom.y} L ${NODE.resistorTop.x} ${NODE.resistorTop.y}`,
    returnRail: `M ${NODE.resistorBottom.x} ${NODE.resistorBottom.y} L ${NODE.resistorBottom.x} ${RAIL.bottomY} L ${NODE.batteryNegative.x} ${RAIL.bottomY} L ${NODE.batteryNegative.x} ${NODE.batteryNegative.y}`,
    returnRailReverse: `M ${NODE.batteryNegative.x} ${NODE.batteryNegative.y} L ${NODE.batteryNegative.x} ${RAIL.bottomY} L ${NODE.resistorBottom.x} ${RAIL.bottomY} L ${NODE.resistorBottom.x} ${NODE.resistorBottom.y}`,
    senseTop: `M ${NODE.resistorTop.x} ${NODE.resistorTop.y} L ${NODE.resistorTop.x} ${RAIL.senseTopY} L ${NODE.voltmeterPositive.x} ${RAIL.senseTopY} L ${NODE.voltmeterPositive.x} ${NODE.voltmeterPositive.y}`,
    senseBottom: `M ${NODE.batteryNegative.x} ${RAIL.bottomY} L ${NODE.voltmeterNegative.x} ${RAIL.bottomY} L ${NODE.voltmeterNegative.x} ${NODE.voltmeterNegative.y}`,
    reverseConventionalLoop: `M ${NODE.batteryPositive.x} ${NODE.batteryPositive.y} L ${NODE.batteryPositive.x} ${RAIL.topY} L ${NODE.photodiodeCathode.x} ${RAIL.topY} L ${NODE.photodiodeAnode.x} ${NODE.photodiodeAnode.y} L ${NODE.resistorTop.x} ${NODE.photodiodeAnode.y} L ${NODE.resistorTop.x} ${NODE.resistorBottom.y} L ${NODE.resistorBottom.x} ${RAIL.bottomY} L ${NODE.batteryNegative.x} ${RAIL.bottomY} L ${NODE.batteryNegative.x} ${NODE.batteryNegative.y}`,
    reverseElectronLoop: `M ${NODE.batteryNegative.x} ${NODE.batteryNegative.y} L ${NODE.batteryNegative.x} ${RAIL.bottomY} L ${NODE.resistorBottom.x} ${RAIL.bottomY} L ${NODE.resistorTop.x} ${NODE.resistorTop.y} L ${NODE.resistorTop.x} ${NODE.photodiodeAnode.y} L ${NODE.photodiodeAnode.x} ${NODE.photodiodeAnode.y} L ${NODE.photodiodeCathode.x} ${RAIL.topY} L ${NODE.batteryPositive.x} ${RAIL.topY} L ${NODE.batteryPositive.x} ${NODE.batteryPositive.y}`,
    forwardConventionalLoop: `M ${NODE.batteryNegative.x} ${NODE.batteryNegative.y} L ${NODE.batteryNegative.x} ${RAIL.bottomY} L ${NODE.resistorBottom.x} ${RAIL.bottomY} L ${NODE.resistorTop.x} ${NODE.resistorTop.y} L ${NODE.resistorTop.x} ${NODE.photodiodeAnode.y} L ${NODE.photodiodeAnode.x} ${NODE.photodiodeAnode.y} L ${NODE.photodiodeCathode.x} ${RAIL.topY} L ${NODE.batteryPositive.x} ${RAIL.topY} L ${NODE.batteryPositive.x} ${NODE.batteryPositive.y}`,
    forwardElectronLoop: `M ${NODE.batteryPositive.x} ${NODE.batteryPositive.y} L ${NODE.batteryPositive.x} ${RAIL.topY} L ${NODE.photodiodeCathode.x} ${RAIL.topY} L ${NODE.photodiodeAnode.x} ${NODE.photodiodeAnode.y} L ${NODE.resistorTop.x} ${NODE.photodiodeAnode.y} L ${NODE.resistorTop.x} ${NODE.resistorBottom.y} L ${NODE.resistorBottom.x} ${RAIL.bottomY} L ${NODE.batteryNegative.x} ${RAIL.bottomY} L ${NODE.batteryNegative.x} ${NODE.batteryNegative.y}`,
  } as const;

  const statusBadgeClass = !state.isReverseBias
    ? "bg-amber-100 text-amber-800"
    : state.isActive
      ? "bg-emerald-100 text-emerald-800"
      : "bg-slate-100 text-slate-700";

  const flowPercent = Math.min(
    100,
    Math.max(
      state.totalCurrentUA > 0.02 ? 14 : 0,
      (state.totalCurrentUA / Math.max(state.saturationCurrentUA, 0.01)) * 100,
    ),
  );
  const conductiveFlowActive = state.totalCurrentUA > 0.02;
  const flowColor =
    flowMode === "electron" ? FLOW.electronColor : FLOW.conventionalColor;
  const particleDuration = getParticleDuration(flowPercent);
  const particleOpacity = state.isActive ? 0.72 : 0.32;
  const activeFlowSegments = state.isReverseBias
    ? flowMode === "electron"
      ? [
          { path: PATH.returnRailReverse, beginOffset: 0 },
          { path: PATH.nodeLinkReverse, beginOffset: 0.55 },
          { path: PATH.supplyRailReverse, beginOffset: 1.1 },
        ]
      : [
          { path: PATH.supplyRail, beginOffset: 0 },
          { path: PATH.nodeLink, beginOffset: 0.55 },
          { path: PATH.returnRail, beginOffset: 1.1 },
        ]
    : flowMode === "electron"
      ? [
          { path: PATH.supplyRail, beginOffset: 0 },
          { path: PATH.nodeLink, beginOffset: 0.55 },
          { path: PATH.returnRail, beginOffset: 1.1 },
        ]
      : [
          { path: PATH.returnRailReverse, beginOffset: 0 },
          { path: PATH.nodeLinkReverse, beginOffset: 0.55 },
          { path: PATH.supplyRailReverse, beginOffset: 1.1 },
        ];

  return (
    <section className="overflow-hidden rounded-3xl border bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-black">Photodiode Circuit Placement</h2>
          <p className="text-sm font-semibold text-slate-600">
            Reverse-biased photodiode current flows through the load resistor,
            and the voltmeter reads the resulting output voltage.
          </p>
        </div>
        <span
          className={`rounded-full px-4 py-2 text-sm font-black ${statusBadgeClass}`}
        >
          {state.status}
        </span>
      </div>

      <div className="overflow-x-auto rounded-[28px] border border-slate-200 bg-slate-50/70 p-3">
        <svg
          viewBox={`0 0 ${VIEW_BOX.width} ${VIEW_BOX.height}`}
          className="h-[560px] min-w-[980px] w-full"
          role="img"
          aria-label="Photodiode sensor circuit canvas"
        >
          <defs>
            <filter
              id="sensorFlowGlow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <BackgroundPixelGred
            width={VIEW_BOX.width}
            height={VIEW_BOX.height}
            minor={20}
            major={100}
            backgroundColor="#ffffff"
            minorStroke="#e7edf5"
            majorStroke="#c8d6e5"
            labelColor="#94a3b8"
            borderColor="#d7e2ee"
            borderStrokeWidth={1}
            showLabels
            showBorder={false}
          />

          <rect
            x="10"
            y="10"
            width={VIEW_BOX.width - 20}
            height={VIEW_BOX.height - 20}
            rx="28"
            fill="none"
            stroke="#d7e2ee"
            strokeWidth="2"
          />

          <LightSource
            active={state.hasLight}
            intensity={state.normalizedLight}
          />

          <path
            d={PATH.supplyRail}
            fill="none"
            stroke={WIRE.stroke}
            strokeWidth={WIRE.width}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={PATH.nodeLink}
            fill="none"
            stroke={WIRE.stroke}
            strokeWidth={WIRE.width}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={PATH.returnRail}
            fill="none"
            stroke={WIRE.stroke}
            strokeWidth={WIRE.width}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={PATH.senseTop}
            fill="none"
            stroke={WIRE.senseStroke}
            strokeWidth={WIRE.width}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={PATH.senseBottom}
            fill="none"
            stroke={WIRE.senseStroke}
            strokeWidth={WIRE.width}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <foreignObject
            x={COMPONENT.battery.x}
            y={COMPONENT.battery.y}
            width={COMPONENT.battery.width}
            height={COMPONENT.battery.height}
          >
            <div className="flex h-full w-full items-center justify-center">
              <BatterySymbol
                width={COMPONENT.battery.width * CIRCUIT_COMPONENT_SCALE}
                height={COMPONENT.battery.height * CIRCUIT_COMPONENT_SCALE}
              />
            </div>
          </foreignObject>

          <foreignObject
            x={COMPONENT.photodiode.x}
            y={COMPONENT.photodiode.y}
            width={COMPONENT.photodiode.width}
            height={COMPONENT.photodiode.height}
          >
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ transform: "scaleX(-1)" }}
            >
              <PhotodiodeSymbol
                width={COMPONENT.photodiode.width * CIRCUIT_COMPONENT_SCALE}
                height={COMPONENT.photodiode.height * CIRCUIT_COMPONENT_SCALE}
              />
            </div>
          </foreignObject>

          <foreignObject
            x={COMPONENT.resistor.x}
            y={COMPONENT.resistor.y}
            width={COMPONENT.resistor.width}
            height={COMPONENT.resistor.height}
          >
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ transform: "rotate(90deg)" }}
            >
              <ResistorSymbol
                width={COMPONENT.resistor.width * CIRCUIT_COMPONENT_SCALE}
                height={COMPONENT.resistor.height * CIRCUIT_COMPONENT_SCALE}
                showTerminalLabels={false}
              />
            </div>
          </foreignObject>

          <foreignObject
            x={COMPONENT.voltmeter.x}
            y={COMPONENT.voltmeter.y}
            width={COMPONENT.voltmeter.width}
            height={COMPONENT.voltmeter.height}
          >
            <div className="flex h-full w-full items-center justify-center">
              <VoltmeterSymbol
                width={COMPONENT.voltmeter.width * CIRCUIT_COMPONENT_SCALE}
                height={COMPONENT.voltmeter.height * CIRCUIT_COMPONENT_SCALE}
                label="Output voltmeter"
              />
            </div>
          </foreignObject>

          {activeFlowSegments.map((segment, index) => (
            <FlowParticles
              key={`circuit-segment-${flowMode}-${state.isReverseBias ? "reverse" : "forward"}-${index}`}
              active={conductiveFlowActive}
              isPlaying={isPlaying}
              path={segment.path}
              duration={particleDuration}
              opacity={particleOpacity}
              color={flowColor}
              beginOffset={segment.beginOffset}
            />
          ))}

          <text
            x={LABEL.batteryText.x}
            y={LABEL.batteryText.y}
            fontSize="34"
            fontWeight="700"
            fill="#111111"
          >
            Bias supply
          </text>
          <text
            x={LABEL.batteryVoltage.x}
            y={LABEL.batteryVoltage.y}
            fontSize="34"
            fontWeight="700"
            fill="#111111"
          >
            {state.reverseVoltage.toFixed(0)}V
          </text>
          <text
            x={LABEL.circuitMode.x}
            y={LABEL.circuitMode.y}
            fontSize="22"
            fontWeight="700"
            fill={state.isReverseBias ? "#0f766e" : "#b45309"}
          >
            {state.biasDescription}
          </text>

          <text
            x={LABEL.photodiodeTitle.x}
            y={LABEL.photodiodeTitle.y}
            fontSize="28"
            fontWeight="700"
            textAnchor="middle"
            fill="#111111"
          >
            Photodiode
          </text>
          <text
            x={LABEL.resistorTitle.x}
            y={LABEL.resistorTitle.y}
            fontSize="34"
            fontWeight="700"
            textAnchor="middle"
            fill="#111111"
          >
            R
            <tspan dy="10" fontSize="24">
              L
            </tspan>
          </text>
          <text
            x={LABEL.resistorValue.x}
            y={LABEL.resistorValue.y}
            fontSize="30"
            fontWeight="700"
            textAnchor="middle"
            fill="#111111"
          >
            {state.loadKOhm.toFixed(1)} kOhm
          </text>

          <text
            x={LABEL.outputNode.x}
            y={LABEL.outputNode.y}
            fontSize="18"
            fontWeight="800"
            textAnchor="middle"
            fill="#0f172a"
          >
            Vout node
          </text>

          <text
            x={LABEL.voltmeterTitle.x}
            y={LABEL.voltmeterTitle.y}
            fontSize="18"
            fontWeight="800"
            textAnchor="middle"
            fill="#0f172a"
          >
            Output Measurement
          </text>
          <text
            x={LABEL.voltmeterReadout.x}
            y={LABEL.voltmeterReadout.y}
            fontSize="28"
            fontWeight="900"
            textAnchor="middle"
            fill={state.isReverseBias ? "#0f766e" : "#b45309"}
          >
            {`${state.outputVoltage.toFixed(2)} V`}
          </text>

          <g
            transform={`translate(${LABEL.statusTop.x - 252} ${LABEL.statusTop.y - 38})`}
          >
            <rect
              x="0"
              y="0"
              width="272"
              height="76"
              rx="18"
              fill="rgba(255,255,255,0.94)"
              stroke="#d7e2ee"
              strokeWidth="2"
            />
          </g>
          <text
            x={LABEL.statusTop.x}
            y={LABEL.statusTop.y}
            fontSize="22"
            fontWeight="800"
            textAnchor="end"
            fill={
              state.isActive
                ? "#15803d"
                : state.isReverseBias
                  ? "#475569"
                  : "#b45309"
            }
          >
            {state.lightLabel}
          </text>
          <text
            x={LABEL.currentTop.x}
            y={LABEL.currentTop.y}
            fontSize="17"
            fontWeight="700"
            textAnchor="end"
            fill="#111111"
          >
            {state.isReverseBias
              ? `Photocurrent ${state.photocurrentUA.toFixed(2)} uA | Vpd ${state.photodiodeVoltage.toFixed(2)} V`
              : `Forward current ${state.totalCurrentUA.toFixed(2)} uA | Vd ${state.forwardDropVoltage.toFixed(2)} V`}
          </text>

          <g
            transform={`translate(${LABEL.teachingStrip.x - 255} ${LABEL.teachingStrip.y - 40})`}
          >
            <rect
              x="0"
              y="0"
              width="510"
              height="72"
              rx="20"
              fill="#ffffff"
              stroke="#d7e2ee"
              strokeWidth="2"
            />
            <text
              x="255"
              y="26"
              fontSize="18"
              fontWeight="900"
              textAnchor="middle"
              fill={flowMode === "electron" ? "#2563eb" : "#ea580c"}
            >
              {flowMode === "electron" ? "Electron Flow" : "Conventional Flow"}
            </text>
            <text
              x="255"
              y="50"
              fontSize="16"
              fontWeight="700"
              textAnchor="middle"
              fill="#334155"
            >
              {state.isReverseBias
                ? "Light creates photocurrent, and RL converts that sensor current into measurable Vout."
                : "Forward bias drives junction conduction, so the resistor sees normal diode current instead of sensor-only current."}
            </text>
          </g>

          {SHOW_DEBUG_TERMINAL_DOTS ? (
            <>
              <DebugDot
                x={NODE.batteryPositive.x}
                y={NODE.batteryPositive.y}
                label="VCC+"
              />
              <DebugDot
                x={NODE.batteryNegative.x}
                y={NODE.batteryNegative.y}
                label="VCC-"
              />
              <DebugDot
                x={NODE.photodiodeCathode.x}
                y={NODE.photodiodeCathode.y}
                label="PD-K"
              />
              <DebugDot
                x={NODE.photodiodeAnode.x}
                y={NODE.photodiodeAnode.y}
                label="PD-A"
              />
              <DebugDot
                x={NODE.resistorTop.x}
                y={NODE.resistorTop.y}
                label="RL-T"
              />
              <DebugDot
                x={NODE.resistorBottom.x}
                y={NODE.resistorBottom.y}
                label="RL-B"
              />
              <DebugDot
                x={NODE.voltmeterPositive.x}
                y={NODE.voltmeterPositive.y}
                label="VM+"
              />
              <DebugDot
                x={NODE.voltmeterNegative.x}
                y={NODE.voltmeterNegative.y}
                label="VM-"
              />
            </>
          ) : null}
        </svg>
      </div>
    </section>
  );
}
