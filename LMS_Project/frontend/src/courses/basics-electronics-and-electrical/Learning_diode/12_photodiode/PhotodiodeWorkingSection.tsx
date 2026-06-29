"use client";

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
  width: 1180,
  height: 760,
} as const;

const CIRCUIT_COMPONENT_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;
const CIRCUIT_WIRE_SCALE = 1;
const BASE_WIRE_WIDTH = 4;

const COMPONENT_OFFSET = {
  semiconductor: { x: 0, y: 0 },
  battery: { x: 0, y: 0 },
  legend: { x: 0, y: 0 },
  title: { x: 0, y: 0 },
} as const satisfies Record<string, Offset>;

const WIRE_OFFSET = {
  leftRail: { x: 0, y: 0 },
  rightRail: { x: 0, y: 0 },
  bottomRail: { x: 0, y: 0 },
  batteryBranch: { x: 0, y: 0 },
} as const satisfies Record<string, Offset>;

const DEBUG_TERMINAL_OFFSET = {
  anode: { x: 0, y: 0 },
  cathode: { x: 0, y: 0 },
  batteryLeft: { x: 0, y: 0 },
  batteryRight: { x: 0, y: 0 },
  depletionTop: { x: 0, y: 0 },
  depletionBottom: { x: 0, y: 0 },
} as const satisfies Record<string, Offset>;

const BASE_COMPONENT = {
  semiconductor: { x: 188, y: 156, width: 644, height: 168 },
  battery: { x: 548, y: 522, width: 84, height: 76 },
  legend: { x: 770, y: 398, width: 182, height: 92 },
  title: { x: 0, y: 0, width: 0, height: 0 },
} as const;

const COMPONENT = {
  semiconductor: {
    ...BASE_COMPONENT.semiconductor,
    x: BASE_COMPONENT.semiconductor.x + COMPONENT_OFFSET.semiconductor.x,
    y: BASE_COMPONENT.semiconductor.y + COMPONENT_OFFSET.semiconductor.y,
  },
  battery: {
    ...BASE_COMPONENT.battery,
    x: BASE_COMPONENT.battery.x + COMPONENT_OFFSET.battery.x,
    y: BASE_COMPONENT.battery.y + COMPONENT_OFFSET.battery.y,
  },
  legend: {
    ...BASE_COMPONENT.legend,
    x: BASE_COMPONENT.legend.x + COMPONENT_OFFSET.legend.x,
    y: BASE_COMPONENT.legend.y + COMPONENT_OFFSET.legend.y,
  },
  title: {
    ...BASE_COMPONENT.title,
    x: BASE_COMPONENT.title.x + COMPONENT_OFFSET.title.x,
    y: BASE_COMPONENT.title.y + COMPONENT_OFFSET.title.y,
  },
} as const;

const LABEL = {
  sectionTag: { x: 46, y: 44 },
  sectionTitle: { x: 46, y: 84 },
  sectionNote: { x: 46, y: 114 },
  pType: { x: 306, y: 144 },
  nType: { x: 714, y: 144 },
  anode: { x: 126, y: 194 },
  cathode: { x: 886, y: 194 },
  depletion: { x: 510, y: 362 },
  regionState: { x: 1028, y: 130 },
  regionDetail: { x: 1028, y: 164 },
  batteryMinus: { x: 520, y: 542 },
  batteryPlus: { x: 638, y: 542 },
  batteryCaption: { x: 592, y: 612 },
  title: { x: 590, y: 694 },
  legendTitle: { x: 792, y: 420 },
  legendElectron: { x: 832, y: 448 },
  legendHole: { x: 832, y: 482 },
} as const;

const WIRE = {
  stroke: "#111111",
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
} as const;

const FLOW = {
  electronColor: "#2563eb",
  conventionalColor: "#ea580c",
  dotStrokeWidth: 7,
  dashArray: "1 18",
  dashOffsetDistance: 38,
} as const;

function makePoint(x: number, y: number): Point {
  return { x, y };
}

function withOffset(base: Point, offset?: Partial<Offset>): Point {
  return makePoint(base.x + (offset?.x ?? 0), base.y + (offset?.y ?? 0));
}

function DebugDot({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="5" fill="#ef4444" />
      <text x={x + 8} y={y - 8} fontSize="12" fontWeight="700" fill="#ef4444">
        {label}
      </text>
    </g>
  );
}

function Carrier({
  x,
  y,
  color,
  label,
}: {
  x: number;
  y: number;
  color: string;
  label: string;
}) {
  return (
    <g>
      <circle cx={x} cy={y} r="12.5" fill={color} />
      <text
        x={x}
        y={y + 4.2}
        textAnchor="middle"
        fontSize="18"
        fontWeight="900"
        fill="#ffffff"
      >
        {label}
      </text>
    </g>
  );
}

function CarrierSet({
  points,
  color,
  label,
}: {
  points: Point[];
  color: string;
  label: string;
}) {
  return (
    <>
      {points.map((point, index) => (
        <Carrier
          key={`${label}-${point.x}-${point.y}-${index}`}
          x={point.x}
          y={point.y}
          color={color}
          label={label}
        />
      ))}
    </>
  );
}

function buildGrid({
  startX,
  endX,
  topY,
  bottomY,
  rows,
  columns,
  stagger = 0,
}: {
  startX: number;
  endX: number;
  topY: number;
  bottomY: number;
  rows: number;
  columns: number;
  stagger?: number;
}) {
  const points: Point[] = [];
  const xStep = (endX - startX) / Math.max(columns - 1, 1);
  const yStep = (bottomY - topY) / Math.max(rows - 1, 1);

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      points.push(
        makePoint(
          startX + column * xStep + (row % 2 === 0 ? 0 : stagger),
          topY + row * yStep,
        ),
      );
    }
  }

  return points;
}

function LightArrows({
  visible,
  intensity,
}: {
  visible: boolean;
  intensity: number;
}) {
  if (!visible) {
    return null;
  }

  const opacity = 0.35 + intensity * 0.65;

  return (
    <g
      stroke="#111111"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
    >
      <path d="M 505 26 L 470 92" />
      <path d="M 566 22 L 531 92" />
      <path d="M 627 26 L 592 92" />
      <path d="M 462 80 L 470 92 L 456 90" fill="none" />
      <path d="M 523 80 L 531 92 L 517 90" fill="none" />
      <path d="M 584 80 L 592 92 L 578 90" fill="none" />
    </g>
  );
}

function MeasurementLegend() {
  return (
    <g>
      <rect
        x={COMPONENT.legend.x}
        y={COMPONENT.legend.y}
        width={COMPONENT.legend.width}
        height={COMPONENT.legend.height}
        rx="18"
        fill="#ffffff"
        stroke="#d7e2ee"
        strokeWidth="2"
      />
      <text
        x={LABEL.legendTitle.x}
        y={LABEL.legendTitle.y}
        fontSize="13"
        fontWeight="900"
        letterSpacing="0.18em"
        fill="#0f172a"
      >
        CARRIER LEGEND
      </text>
      <circle cx={804} cy={444} r="12" fill="#1d4ed8" />
      <text
        x={804}
        y={448}
        textAnchor="middle"
        fontSize="18"
        fontWeight="900"
        fill="#ffffff"
      >
        -
      </text>
      <text x={LABEL.legendElectron.x} y={LABEL.legendElectron.y} fontSize="21" fontWeight="700" fill="#0f172a">
        Electrons
      </text>
      <circle cx={804} cy={478} r="12" fill="#f97316" />
      <text
        x={804}
        y={482}
        textAnchor="middle"
        fontSize="18"
        fontWeight="900"
        fill="#ffffff"
      >
        +
      </text>
      <text x={LABEL.legendHole.x} y={LABEL.legendHole.y} fontSize="21" fontWeight="700" fill="#0f172a">
        Holes
      </text>
    </g>
  );
}

function FlowParticles({
  active,
  isPlaying,
  path,
  color,
  duration,
  beginOffset = 0,
}: {
  active: boolean;
  isPlaying: boolean;
  path: string;
  color: string;
  duration: number;
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
      opacity={0.9}
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

function JunctionCarrierMotion({
  active,
  isPlaying,
  path,
  color,
  label,
  duration,
  beginOffset = 0,
  opacity = 1,
}: {
  active: boolean;
  isPlaying: boolean;
  path: string;
  color: string;
  label: string;
  duration: number;
  beginOffset?: number;
  opacity?: number;
}) {
  if (!active) {
    return null;
  }

  return (
    <g opacity={opacity}>
      <circle r="10.5" fill={color} stroke="#ffffff" strokeWidth="2.5">
        {isPlaying ? (
          <animateMotion
            dur={`${duration}s`}
            begin={`${beginOffset}s`}
            repeatCount="indefinite"
            path={path}
          />
        ) : (
          <animateMotion dur="0.001s" begin="0s" fill="freeze" path={path} />
        )}
      </circle>
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="15"
        fontWeight="900"
        fill="#ffffff"
      >
        {label}
        {isPlaying ? (
          <animateMotion
            dur={`${duration}s`}
            begin={`${beginOffset}s`}
            repeatCount="indefinite"
            path={path}
          />
        ) : (
          <animateMotion dur="0.001s" begin="0s" fill="freeze" path={path} />
        )}
      </text>
    </g>
  );
}

export function PhotodiodeWorkingSection({
  state,
  flowMode,
  isPlaying,
}: {
  state: PhotodiodeState;
  flowMode: FlowMode;
  isPlaying: boolean;
}) {
  const semiconductorCenterX =
    COMPONENT.semiconductor.x + COMPONENT.semiconductor.width / 2;
  const NODE = {
    anode: withOffset(
      makePoint(COMPONENT.semiconductor.x, COMPONENT.semiconductor.y + 66),
      DEBUG_TERMINAL_OFFSET.anode,
    ),
    cathode: withOffset(
      makePoint(
        COMPONENT.semiconductor.x + COMPONENT.semiconductor.width,
        COMPONENT.semiconductor.y + 66,
      ),
      DEBUG_TERMINAL_OFFSET.cathode,
    ),
    batteryLeft: withOffset(
      makePoint(COMPONENT.battery.x + 24, COMPONENT.battery.y + 38),
      DEBUG_TERMINAL_OFFSET.batteryLeft,
    ),
    batteryRight: withOffset(
      makePoint(
        COMPONENT.battery.x + COMPONENT.battery.width - 24,
        COMPONENT.battery.y + 38,
      ),
      DEBUG_TERMINAL_OFFSET.batteryRight,
    ),
    depletionTop: withOffset(
      makePoint(semiconductorCenterX, COMPONENT.semiconductor.y),
      DEBUG_TERMINAL_OFFSET.depletionTop,
    ),
    depletionBottom: withOffset(
      makePoint(
        semiconductorCenterX,
        COMPONENT.semiconductor.y + COMPONENT.semiconductor.height,
      ),
      DEBUG_TERMINAL_OFFSET.depletionBottom,
    ),
  } as const;
  const PATH = {
    anodeToBatteryMinus: `M ${NODE.anode.x} ${NODE.anode.y} L 116 ${NODE.anode.y} L 116 ${COMPONENT.battery.y + 40 + WIRE_OFFSET.leftRail.y} L ${NODE.batteryLeft.x} ${COMPONENT.battery.y + 40 + WIRE_OFFSET.bottomRail.y} L ${NODE.batteryLeft.x} ${NODE.batteryLeft.y}`,
    batteryMinusToAnode: `M ${NODE.batteryLeft.x} ${NODE.batteryLeft.y} L ${NODE.batteryLeft.x} ${COMPONENT.battery.y + 40 + WIRE_OFFSET.bottomRail.y} L 116 ${COMPONENT.battery.y + 40 + WIRE_OFFSET.leftRail.y} L 116 ${NODE.anode.y} L ${NODE.anode.x} ${NODE.anode.y}`,
    cathodeToBatteryPlus: `M ${NODE.cathode.x} ${NODE.cathode.y} L 1018 ${NODE.cathode.y} L 1018 ${COMPONENT.battery.y + 40 + WIRE_OFFSET.rightRail.y} L ${NODE.batteryRight.x} ${COMPONENT.battery.y + 40 + WIRE_OFFSET.bottomRail.y} L ${NODE.batteryRight.x} ${NODE.batteryRight.y}`,
    batteryPlusToCathode: `M ${NODE.batteryRight.x} ${NODE.batteryRight.y} L ${NODE.batteryRight.x} ${COMPONENT.battery.y + 40 + WIRE_OFFSET.bottomRail.y} L 1018 ${COMPONENT.battery.y + 40 + WIRE_OFFSET.rightRail.y} L 1018 ${NODE.cathode.y} L ${NODE.cathode.x} ${NODE.cathode.y}`,
    junctionCathodeToAnode: `M ${NODE.cathode.x} ${NODE.cathode.y} L ${NODE.anode.x} ${NODE.anode.y}`,
    junctionAnodeToCathode: `M ${NODE.anode.x} ${NODE.anode.y} L ${NODE.cathode.x} ${NODE.cathode.y}`,
    reverseConventionalLoop: `M ${NODE.batteryRight.x} ${NODE.batteryRight.y} L ${NODE.batteryRight.x} ${COMPONENT.battery.y + 40 + WIRE_OFFSET.bottomRail.y} L 1018 ${COMPONENT.battery.y + 40 + WIRE_OFFSET.rightRail.y} L 1018 ${NODE.cathode.y} L ${NODE.cathode.x} ${NODE.cathode.y} L ${NODE.anode.x} ${NODE.anode.y} L 116 ${NODE.anode.y} L 116 ${COMPONENT.battery.y + 40 + WIRE_OFFSET.leftRail.y} L ${NODE.batteryLeft.x} ${COMPONENT.battery.y + 40 + WIRE_OFFSET.bottomRail.y} L ${NODE.batteryLeft.x} ${NODE.batteryLeft.y}`,
    reverseElectronLoop: `M ${NODE.batteryLeft.x} ${NODE.batteryLeft.y} L ${NODE.batteryLeft.x} ${COMPONENT.battery.y + 40 + WIRE_OFFSET.bottomRail.y} L 116 ${COMPONENT.battery.y + 40 + WIRE_OFFSET.leftRail.y} L 116 ${NODE.anode.y} L ${NODE.anode.x} ${NODE.anode.y} L ${NODE.cathode.x} ${NODE.cathode.y} L 1018 ${NODE.cathode.y} L 1018 ${COMPONENT.battery.y + 40 + WIRE_OFFSET.rightRail.y} L ${NODE.batteryRight.x} ${COMPONENT.battery.y + 40 + WIRE_OFFSET.bottomRail.y} L ${NODE.batteryRight.x} ${NODE.batteryRight.y}`,
    forwardConventionalLoop: `M ${NODE.batteryLeft.x} ${NODE.batteryLeft.y} L ${NODE.batteryLeft.x} ${COMPONENT.battery.y + 40 + WIRE_OFFSET.bottomRail.y} L 116 ${COMPONENT.battery.y + 40 + WIRE_OFFSET.leftRail.y} L 116 ${NODE.anode.y} L ${NODE.anode.x} ${NODE.anode.y} L ${NODE.cathode.x} ${NODE.cathode.y} L 1018 ${NODE.cathode.y} L 1018 ${COMPONENT.battery.y + 40 + WIRE_OFFSET.rightRail.y} L ${NODE.batteryRight.x} ${COMPONENT.battery.y + 40 + WIRE_OFFSET.bottomRail.y} L ${NODE.batteryRight.x} ${NODE.batteryRight.y}`,
    forwardElectronLoop: `M ${NODE.batteryRight.x} ${NODE.batteryRight.y} L ${NODE.batteryRight.x} ${COMPONENT.battery.y + 40 + WIRE_OFFSET.bottomRail.y} L 1018 ${COMPONENT.battery.y + 40 + WIRE_OFFSET.rightRail.y} L 1018 ${NODE.cathode.y} L ${NODE.cathode.x} ${NODE.cathode.y} L ${NODE.anode.x} ${NODE.anode.y} L 116 ${NODE.anode.y} L 116 ${COMPONENT.battery.y + 40 + WIRE_OFFSET.leftRail.y} L ${NODE.batteryLeft.x} ${COMPONENT.battery.y + 40 + WIRE_OFFSET.bottomRail.y} L ${NODE.batteryLeft.x} ${NODE.batteryLeft.y}`,
  } as const;

  const normalizedBias = Math.min(1, Math.max(0, state.photodiodeVoltage / 30));
  const depletionHalfWidth = state.isReverseBias ? 56 + normalizedBias * 24 : 34;
  const depletionLeftX = semiconductorCenterX - depletionHalfWidth;
  const depletionRightX = semiconductorCenterX + depletionHalfWidth;
  const depletionWidth = depletionRightX - depletionLeftX;
  const fieldOpacity = state.hasLight
    ? 0.14 + state.normalizedLight * 0.2 + normalizedBias * 0.14
    : 0.08 + normalizedBias * 0.08;
  const stateLabel = state.isReverseBias
    ? "Reverse-biased sensing"
    : "Forward-biased conduction";
  const detailLabel = state.isReverseBias
    ? `${flowMode === "electron" ? "Electron" : "Conventional"} carrier view | Vpd ${state.photodiodeVoltage.toFixed(2)} V`
    : `${state.conductionLabel} | Vd ${state.forwardDropVoltage.toFixed(2)} V`;

  const pCarrierPoints = buildGrid({
    startX: COMPONENT.semiconductor.x + 28,
    endX: depletionLeftX - 44,
    topY: COMPONENT.semiconductor.y + 28,
    bottomY: COMPONENT.semiconductor.y + COMPONENT.semiconductor.height - 24,
    rows: 4,
    columns: 5,
    stagger: 10,
  });

  const nCarrierPoints = buildGrid({
    startX: depletionRightX + 44,
    endX: COMPONENT.semiconductor.x + COMPONENT.semiconductor.width - 42,
    topY: COMPONENT.semiconductor.y + 28,
    bottomY: COMPONENT.semiconductor.y + COMPONENT.semiconductor.height - 24,
    rows: 4,
    columns: 5,
    stagger: 10,
  });

  const ionRows = state.isReverseBias ? 4 : 3;
  const ionTopY = COMPONENT.semiconductor.y + 24;
  const ionStepY = 36;
  const fixedIonPointsP: Point[] = Array.from({ length: ionRows }, (_, index) =>
    makePoint(
      depletionLeftX + depletionWidth * 0.28,
      ionTopY + index * ionStepY,
    ),
  );
  const fixedIonPointsN: Point[] = Array.from({ length: ionRows }, (_, index) =>
    makePoint(
      depletionRightX - depletionWidth * 0.28,
      ionTopY + index * ionStepY,
    ),
  );

  const junctionElectronPaths = [
    `M ${semiconductorCenterX + 10} ${COMPONENT.semiconductor.y + 48} L ${depletionRightX + 56} ${COMPONENT.semiconductor.y + 36}`,
    `M ${semiconductorCenterX + 6} ${COMPONENT.semiconductor.y + 92} L ${depletionRightX + 52} ${COMPONENT.semiconductor.y + 102}`,
    `M ${semiconductorCenterX + 12} ${COMPONENT.semiconductor.y + 132} L ${depletionRightX + 60} ${COMPONENT.semiconductor.y + 146}`,
  ] as const;

  const junctionHolePaths = [
    `M ${semiconductorCenterX - 10} ${COMPONENT.semiconductor.y + 42} L ${depletionLeftX - 56} ${COMPONENT.semiconductor.y + 34}`,
    `M ${semiconductorCenterX - 8} ${COMPONENT.semiconductor.y + 88} L ${depletionLeftX - 52} ${COMPONENT.semiconductor.y + 98}`,
    `M ${semiconductorCenterX - 12} ${COMPONENT.semiconductor.y + 136} L ${depletionLeftX - 58} ${COMPONENT.semiconductor.y + 148}`,
  ] as const;

  const forwardComparisonElectronPaths = [
    `M ${depletionRightX + 22} ${COMPONENT.semiconductor.y + 74} L ${semiconductorCenterX + 6} ${COMPONENT.semiconductor.y + 74}`,
    `M ${depletionRightX + 26} ${COMPONENT.semiconductor.y + 126} L ${semiconductorCenterX + 10} ${COMPONENT.semiconductor.y + 118}`,
  ] as const;

  const forwardComparisonHolePaths = [
    `M ${depletionLeftX - 22} ${COMPONENT.semiconductor.y + 78} L ${semiconductorCenterX - 6} ${COMPONENT.semiconductor.y + 78}`,
    `M ${depletionLeftX - 26} ${COMPONENT.semiconductor.y + 126} L ${semiconductorCenterX - 10} ${COMPONENT.semiconductor.y + 118}`,
  ] as const;

  const biasColor = state.isReverseBias ? "#0f766e" : "#b45309";
  const fieldBandOpacity = 0.14 + normalizedBias * 0.22 + (state.hasLight ? 0.12 : 0);
  const bulkCarrierOpacity = state.isReverseBias ? 1 : 0.86;
  const fixedIonOpacity = state.isReverseBias ? 1 : 0.78;
  const flowColor =
    flowMode === "electron" ? FLOW.electronColor : FLOW.conventionalColor;
  const wireFlowDuration = state.isActive ? 2.4 : 3.2;
  const activeFlow = state.hasLight || !state.isReverseBias;
  const movingCarrierActive = state.isReverseBias ? state.hasLight : true;
  const movingCarrierOpacity = state.isReverseBias
    ? 0.42 + state.normalizedLight * 0.5
    : 0.34;
  const movingCarrierDuration = state.isReverseBias
    ? Math.max(1.35, 2.75 - state.normalizedLight * 1.05)
    : 2.7;
  const activeFlowSegments =
    state.isReverseBias
      ? flowMode === "electron"
        ? [
            { path: PATH.batteryMinusToAnode, beginOffset: 0 },
            { path: PATH.cathodeToBatteryPlus, beginOffset: 0.9 },
          ]
        : [
            { path: PATH.batteryPlusToCathode, beginOffset: 0 },
            { path: PATH.anodeToBatteryMinus, beginOffset: 0.9 },
          ]
      : flowMode === "electron"
        ? [
            { path: PATH.batteryPlusToCathode, beginOffset: 0 },
            { path: PATH.anodeToBatteryMinus, beginOffset: 0.9 },
          ]
        : [
            { path: PATH.batteryMinusToAnode, beginOffset: 0 },
            { path: PATH.cathodeToBatteryPlus, beginOffset: 0.9 },
          ];
  const carrierArrow =
    state.isReverseBias
      ? flowMode === "electron"
      ? {
          x1: depletionRightX + 26,
          y1: COMPONENT.semiconductor.y + COMPONENT.semiconductor.height / 2 - 12,
          x2: depletionLeftX - 26,
          y2: COMPONENT.semiconductor.y + COMPONENT.semiconductor.height / 2 - 12,
          label: "Electrons move toward the anode",
        }
      : {
          x1: depletionLeftX - 26,
          y1: COMPONENT.semiconductor.y + COMPONENT.semiconductor.height / 2 + 18,
          x2: depletionRightX + 26,
          y2: COMPONENT.semiconductor.y + COMPONENT.semiconductor.height / 2 + 18,
          label: "Conventional current points toward the cathode",
        }
      : flowMode === "electron"
        ? {
            x1: depletionLeftX - 26,
            y1: COMPONENT.semiconductor.y + COMPONENT.semiconductor.height / 2 - 12,
            x2: depletionRightX + 26,
            y2: COMPONENT.semiconductor.y + COMPONENT.semiconductor.height / 2 - 12,
            label: "Electrons move toward the cathode",
          }
        : {
            x1: depletionRightX + 26,
            y1: COMPONENT.semiconductor.y + COMPONENT.semiconductor.height / 2 + 18,
            x2: depletionLeftX - 26,
            y2: COMPONENT.semiconductor.y + COMPONENT.semiconductor.height / 2 + 18,
            label: "Conventional current points toward the anode",
          };

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
      <div className="border-b border-slate-200 px-4 py-4 sm:px-5 md:px-6 md:py-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
              <span className="rounded-full bg-emerald-50 px-3 py-2 text-emerald-700">
                Working View
              </span>
              <span>Carrier Model</span>
            </div>
            <h3 className="mt-3 text-[1.72rem] font-bold tracking-tight text-slate-950">
              Photodiode Working
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              See how reverse bias widens the depletion region and how incoming
              light frees carriers for sensing.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
            {stateLabel}
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 md:p-5">
        <div className="overflow-x-auto rounded-[24px] border border-slate-200 bg-slate-50/60 p-3">
          <svg
            viewBox={`0 0 ${VIEW_BOX.width} ${VIEW_BOX.height}`}
            className="h-[560px] min-w-[980px] w-full"
            role="img"
            aria-label="Photodiode working carrier view"
          >
            <defs>
              <linearGradient id="pZoneFill" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fff7ed" />
                <stop offset="100%" stopColor="#ffedd5" />
              </linearGradient>
              <linearGradient id="nZoneFill" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#eff6ff" />
                <stop offset="100%" stopColor="#dbeafe" />
              </linearGradient>
              <linearGradient id="depletionBand" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={`rgba(59,130,246,${fieldBandOpacity * 0.55})`} />
                <stop offset="50%" stopColor={`rgba(255,255,255,${0.88 - normalizedBias * 0.1})`} />
                <stop offset="100%" stopColor={`rgba(59,130,246,${fieldBandOpacity * 0.55})`} />
              </linearGradient>
              <radialGradient id="fieldHalo" cx="50%" cy="50%" r="58%">
                <stop offset="0%" stopColor={`rgba(96,165,250,${fieldOpacity})`} />
                <stop offset="100%" stopColor="rgba(96,165,250,0)" />
              </radialGradient>
            </defs>

            <rect
              x="10"
              y="10"
              width={VIEW_BOX.width - 20}
              height={VIEW_BOX.height - 20}
              rx="26"
              fill="#ffffff"
              stroke="#d7e2ee"
              strokeWidth="2"
            />

            <text
              x={LABEL.sectionTag.x}
              y={LABEL.sectionTag.y}
              fontSize="13"
              fontWeight="900"
              letterSpacing="0.22em"
              fill="#065f46"
            >
              PHOTODIODE WORKING MODEL
            </text>
            <text
              x={LABEL.sectionTitle.x}
              y={LABEL.sectionTitle.y}
              fontSize="22"
              fontWeight="800"
              fill="#0f172a"
            >
              Reverse-Biased Carrier Diagram
            </text>
            <text
              x={LABEL.sectionNote.x}
              y={LABEL.sectionNote.y}
              fontSize="15"
              fontWeight="600"
              fill="#475569"
            >
              Light creates photocurrent while the load and bias source turn it
              into a measurable signal.
            </text>

            <path
              d={PATH.anodeToBatteryMinus}
              fill="none"
              stroke={WIRE.stroke}
              strokeWidth={WIRE.width}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={PATH.cathodeToBatteryPlus}
              fill="none"
              stroke={WIRE.stroke}
              strokeWidth={WIRE.width}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {activeFlowSegments.map((segment, index) => (
              <FlowParticles
                key={`working-wire-${flowMode}-${state.isReverseBias ? "reverse" : "forward"}-${index}`}
                active={activeFlow}
                isPlaying={isPlaying}
                path={segment.path}
                color={flowColor}
                duration={wireFlowDuration}
                beginOffset={segment.beginOffset}
              />
            ))}

            <rect
              x={COMPONENT.semiconductor.x}
              y={COMPONENT.semiconductor.y}
              width={COMPONENT.semiconductor.width}
              height={COMPONENT.semiconductor.height}
              fill="#ffffff"
              stroke="#111111"
              strokeWidth="3"
            />

            <rect
              x={COMPONENT.semiconductor.x}
              y={COMPONENT.semiconductor.y}
              width={depletionLeftX - COMPONENT.semiconductor.x}
              height={COMPONENT.semiconductor.height}
              fill="url(#pZoneFill)"
            />
            <rect
              x={depletionRightX}
              y={COMPONENT.semiconductor.y}
              width={COMPONENT.semiconductor.x + COMPONENT.semiconductor.width - depletionRightX}
              height={COMPONENT.semiconductor.height}
              fill="url(#nZoneFill)"
            />
            <rect
              x={depletionLeftX}
              y={COMPONENT.semiconductor.y}
              width={depletionWidth}
              height={COMPONENT.semiconductor.height}
              fill="url(#depletionBand)"
            />

            <ellipse
              cx={semiconductorCenterX}
              cy={COMPONENT.semiconductor.y + COMPONENT.semiconductor.height / 2}
              rx={depletionHalfWidth + 34}
              ry={140}
              fill="url(#fieldHalo)"
            />

            <line
              x1={depletionLeftX}
              y1={COMPONENT.semiconductor.y}
              x2={depletionLeftX}
              y2={COMPONENT.semiconductor.y + COMPONENT.semiconductor.height}
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
            <line
              x1={depletionRightX}
              y1={COMPONENT.semiconductor.y}
              x2={depletionRightX}
              y2={COMPONENT.semiconductor.y + COMPONENT.semiconductor.height}
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="6 6"
            />

            <g opacity={bulkCarrierOpacity}>
              <CarrierSet points={pCarrierPoints} color="#f97316" label="+" />
              <CarrierSet points={nCarrierPoints} color="#1d4ed8" label="-" />
            </g>
            <g opacity={fixedIonOpacity}>
              <CarrierSet points={fixedIonPointsP} color="#1d4ed8" label="-" />
              <CarrierSet points={fixedIonPointsN} color="#f97316" label="+" />
            </g>

            {state.isReverseBias ? (
              <>
                {junctionElectronPaths.map((path, index) => (
                  <JunctionCarrierMotion
                    key={`junction-electron-${index}`}
                    active={movingCarrierActive}
                    isPlaying={isPlaying}
                    path={path}
                    color="#1d4ed8"
                    label="-"
                    duration={movingCarrierDuration}
                    beginOffset={index * 0.36}
                    opacity={movingCarrierOpacity}
                  />
                ))}
                {junctionHolePaths.map((path, index) => (
                  <JunctionCarrierMotion
                    key={`junction-hole-${index}`}
                    active={movingCarrierActive}
                    isPlaying={isPlaying}
                    path={path}
                    color="#f97316"
                    label="+"
                    duration={movingCarrierDuration}
                    beginOffset={0.18 + index * 0.36}
                    opacity={movingCarrierOpacity}
                  />
                ))}
              </>
            ) : (
              <>
                {forwardComparisonElectronPaths.map((path, index) => (
                  <JunctionCarrierMotion
                    key={`forward-electron-${index}`}
                    active={movingCarrierActive}
                    isPlaying={isPlaying}
                    path={path}
                    color="#1d4ed8"
                    label="-"
                    duration={movingCarrierDuration}
                    beginOffset={index * 0.45}
                    opacity={movingCarrierOpacity}
                  />
                ))}
                {forwardComparisonHolePaths.map((path, index) => (
                  <JunctionCarrierMotion
                    key={`forward-hole-${index}`}
                    active={movingCarrierActive}
                    isPlaying={isPlaying}
                    path={path}
                    color="#f97316"
                    label="+"
                    duration={movingCarrierDuration}
                    beginOffset={0.22 + index * 0.45}
                    opacity={movingCarrierOpacity}
                  />
                ))}
              </>
            )}

            <LightArrows visible={state.hasLight} intensity={state.normalizedLight} />

            <g opacity={activeFlow ? 0.95 : 0.45}>
              <line
                x1={carrierArrow.x1}
                y1={carrierArrow.y1}
                x2={carrierArrow.x2}
                y2={carrierArrow.y2}
                stroke={flowColor}
                strokeWidth="4"
                strokeLinecap="round"
              />
              <polygon
                points={
                  flowMode === "electron"
                    ? `${carrierArrow.x2},${carrierArrow.y2} ${carrierArrow.x2 + 18},${carrierArrow.y2 - 10} ${carrierArrow.x2 + 18},${carrierArrow.y2 + 10}`
                    : `${carrierArrow.x2},${carrierArrow.y2} ${carrierArrow.x2 - 18},${carrierArrow.y2 - 10} ${carrierArrow.x2 - 18},${carrierArrow.y2 + 10}`
                }
                fill={flowColor}
              />
              <text
                x={semiconductorCenterX}
                y={carrierArrow.y1 - 18}
                textAnchor="middle"
                fontSize="15"
                fontWeight="700"
                fill={flowColor}
              >
                {carrierArrow.label}
              </text>
            </g>

            <text
              x={LABEL.pType.x}
              y={LABEL.pType.y}
              fontSize="23"
              fontWeight="800"
              textAnchor="middle"
              fill="#111111"
            >
              P-Type
            </text>
            <text
              x={LABEL.nType.x}
              y={LABEL.nType.y}
              fontSize="23"
              fontWeight="800"
              textAnchor="middle"
              fill="#111111"
            >
              N-Type
            </text>

            <text
              x={LABEL.anode.x}
              y={LABEL.anode.y}
              fontSize="22"
              fontWeight="700"
              textAnchor="middle"
              fill="#111111"
            >
              Anode
            </text>
            <text
              x={LABEL.cathode.x}
              y={LABEL.cathode.y}
              fontSize="22"
              fontWeight="700"
              textAnchor="middle"
              fill="#111111"
            >
              Cathode
            </text>

            <text
              x={LABEL.depletion.x}
              y={LABEL.depletion.y}
              fontSize="22"
              fontWeight="800"
              textAnchor="middle"
              fill="#111111"
            >
              Depletion
            </text>
            <text
              x={LABEL.depletion.x}
              y={LABEL.depletion.y + 28}
              fontSize="22"
              fontWeight="800"
              textAnchor="middle"
              fill="#111111"
            >
              Region
            </text>

            <text
              x={LABEL.regionState.x}
              y={LABEL.regionState.y}
              fontSize="22"
              fontWeight="800"
              textAnchor="end"
              fill={biasColor}
            >
              {stateLabel}
            </text>
            <text
              x={LABEL.regionDetail.x}
              y={LABEL.regionDetail.y}
              fontSize="16"
              fontWeight="700"
              textAnchor="end"
              fill="#475569"
            >
              {detailLabel}
            </text>

            <text
              x={1028}
              y={196}
              fontSize="15"
              fontWeight="700"
              textAnchor="end"
              fill="#334155"
            >
              {state.isReverseBias
                ? `Photocurrent ${state.photocurrentUA.toFixed(2)} uA | Vout ${state.outputVoltage.toFixed(2)} V`
                : `Forward current ${state.totalCurrentUA.toFixed(2)} uA | Load ${state.outputVoltage.toFixed(2)} V`}
            </text>

            <line
              x1={COMPONENT.battery.x + 30}
              y1={COMPONENT.battery.y + 10}
              x2={COMPONENT.battery.x + 30}
              y2={COMPONENT.battery.y + 70}
              stroke="#111111"
              strokeWidth="6"
            />
            <line
              x1={COMPONENT.battery.x + 58}
              y1={COMPONENT.battery.y}
              x2={COMPONENT.battery.x + 58}
              y2={COMPONENT.battery.y + 80}
              stroke="#111111"
              strokeWidth="6"
            />
            <text
              x={LABEL.batteryMinus.x}
              y={LABEL.batteryMinus.y}
              fontSize="30"
              fontWeight="900"
              fill="#111111"
            >
              -
            </text>
            <text
              x={LABEL.batteryPlus.x}
              y={LABEL.batteryPlus.y}
              fontSize="30"
              fontWeight="900"
              fill="#111111"
            >
              +
            </text>
            <text
              x={LABEL.batteryCaption.x}
              y={LABEL.batteryCaption.y}
              fontSize="16"
              fontWeight="700"
              textAnchor="middle"
              fill="#475569"
            >
              {state.biasDescription}
            </text>

            <MeasurementLegend />

            <text
              x={LABEL.title.x}
              y={LABEL.title.y}
              fontSize="34"
              fontWeight="900"
              textAnchor="middle"
              fill="#111111"
              textDecoration="underline"
            >
              Photodiode Working
            </text>

            {SHOW_DEBUG_TERMINAL_DOTS ? (
              <>
                <DebugDot x={NODE.anode.x} y={NODE.anode.y} label="ANODE" />
                <DebugDot x={NODE.cathode.x} y={NODE.cathode.y} label="CATHODE" />
                <DebugDot x={NODE.batteryLeft.x} y={NODE.batteryLeft.y} label="BAT-L" />
                <DebugDot x={NODE.batteryRight.x} y={NODE.batteryRight.y} label="BAT-R" />
                <DebugDot x={NODE.depletionTop.x} y={NODE.depletionTop.y} label="DEP-T" />
                <DebugDot x={NODE.depletionBottom.x} y={NODE.depletionBottom.y} label="DEP-B" />
              </>
            ) : null}
          </svg>
        </div>
      </div>
    </section>
  );
}
