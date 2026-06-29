"use client";

import ResistorSymbol from "@/src/library/electronics-symbol-library/passive/ResistorSymbol";
import BatterySymbol from "@/src/library/electronics-symbol-library/sources/BatterySymbol";

import type { FlowLevel } from "./types";

type ComparisonCircuitProps = {
  voltage: number;
  resistanceOne: number;
  resistanceTwo: number;
  seriesCurrent: number;
  seriesDropOne: number;
  seriesDropTwo: number;
  parallelCurrentOne: number;
  parallelCurrentTwo: number;
  parallelTotalCurrent: number;
  seriesFlowPercent: number;
  parallelFlowPercent: number;
  seriesFlowLevel: FlowLevel;
  parallelFlowLevel: FlowLevel;
};

const VIEW_BOX = "0 0 560 250";
const VIEW_BOX_WIDTH = 560;
const VIEW_BOX_HEIGHT = 250;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  battery: 1,
  resistor: 1,
  flowBar: 1,
} as const;

const BASE_WIRE_WIDTH = 2.2;
const CIRCUIT_WIRE_SCALE = 1;

const ELECTRON_COUNT = 10;

const STYLE = {
  text: "#0f172a",
  muted: "#64748b",
  positiveWire: "#dc2626",
  returnWire: "#334155",
  flow: "#2563eb",
  nodeFill: "#f8fafc",
  nodeStroke: "#94a3b8",
} as const;

const FLOW = {
  radius: 3.6,
  stagger: 0.22,
} as const;

type Point = { x: number; y: number };

type ComponentBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
};

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

function buildCanvasScaleTransform(scale: number) {
  if (scale === 1) return undefined;

  const centerX = VIEW_BOX_WIDTH / 2;
  const centerY = VIEW_BOX_HEIGHT / 2;

  return `translate(${centerX} ${centerY}) scale(${scale}) translate(${-centerX} ${-centerY})`;
}

function pathD(points: readonly Point[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

function getElectronSpeed(flowPercent: number) {
  const safeFlow = Math.max(1, Math.min(100, flowPercent));
  return Math.max(0.9, 4.2 - safeFlow / 28);
}

function getParticleCount(branchCurrent: number, totalCurrent: number) {
  if (totalCurrent <= 0) return 2;
  return Math.max(
    2,
    Math.round((ELECTRON_COUNT * branchCurrent) / totalCurrent),
  );
}

const BASE_COMPONENT = {
  battery: { x: 46, y: 112, width: 88, height: 96, rotate: 0 },
  resistor: { x: 0, y: 0, width: 142, height: 84, rotate: 0 },
  flowBar: { x: 44, y: 232, width: 260, height: 7, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  battery: scaleComponent(
    BASE_COMPONENT.battery,
    CIRCUIT_COMPONENT_SCALE.battery,
  ),
  resistor: scaleComponent(
    BASE_COMPONENT.resistor,
    CIRCUIT_COMPONENT_SCALE.resistor,
  ),
  flowBar: scaleComponent(
    BASE_COMPONENT.flowBar,
    CIRCUIT_COMPONENT_SCALE.flowBar,
  ),
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
} as const;

const SERIES_COMPONENT = {
  r1: { ...COMPONENT.resistor, x: 180, y: 48 },
  r2: { ...COMPONENT.resistor, x: 330, y: 48 },
} as const;

const PARALLEL_NODE = {
  topRailY: 70,
  bottomRailY: 196,
  leftRailX: 90,
  rightRailX: 450,
  r1X: 220,
  r2X: 360,
  branchTopGap: 32,
  branchBottomGap: 48,
  resistorCenterY: 133,
} as const;

const SERIES_NODE = {
  bottomRailY: 188,
  leftWireX: 90,

  batteryPositive: {
    x: COMPONENT.battery.x + (81 / 160) * COMPONENT.battery.width,
    y: COMPONENT.battery.y + (21 / 160) * COMPONENT.battery.height,
  },

  batteryNegative: {
    x: COMPONENT.battery.x + (81 / 160) * COMPONENT.battery.width,
    y: COMPONENT.battery.y + (121 / 160) * COMPONENT.battery.height,
  },

  resistorTerminalY:
    SERIES_COMPONENT.r1.y + (20 / 41) * COMPONENT.resistor.height,
} as const;

const SERIES_CIRCUIT_NODE = {
  batteryPositive: SERIES_NODE.batteryPositive,
  leftTopBend: { x: SERIES_NODE.leftWireX, y: SERIES_NODE.batteryPositive.y },
  leftUpperRail: { x: SERIES_NODE.leftWireX, y: SERIES_NODE.resistorTerminalY },

  r1In: {
    x: SERIES_COMPONENT.r1.x + (15 / 71) * COMPONENT.resistor.width,
    y: SERIES_NODE.resistorTerminalY,
  },
  r1Out: {
    x: SERIES_COMPONENT.r1.x + (57 / 71) * COMPONENT.resistor.width,
    y: SERIES_NODE.resistorTerminalY,
  },

  r2In: {
    x: SERIES_COMPONENT.r2.x + (15 / 71) * COMPONENT.resistor.width,
    y: SERIES_NODE.resistorTerminalY,
  },
  r2Out: {
    x: SERIES_COMPONENT.r2.x + (57 / 71) * COMPONENT.resistor.width,
    y: SERIES_NODE.resistorTerminalY,
  },

  rightDrop: { x: 450, y: SERIES_NODE.resistorTerminalY },
  bottomRight: { x: 450, y: SERIES_NODE.bottomRailY },
  bottomLeft: { x: SERIES_NODE.batteryPositive.x, y: SERIES_NODE.bottomRailY },
  batteryNegative: SERIES_NODE.batteryNegative,
} as const;

const PARALLEL_CIRCUIT_NODE = {
  batteryPositive: SERIES_NODE.batteryPositive,
  batteryNegative: SERIES_NODE.batteryNegative,

  batteryTopBend: {
    x: SERIES_NODE.batteryPositive.x,
    y: PARALLEL_NODE.topRailY,
  },
  batteryBottomBend: {
    x: SERIES_NODE.batteryNegative.x,
    y: PARALLEL_NODE.bottomRailY,
  },

  topLeft: { x: PARALLEL_NODE.leftRailX, y: PARALLEL_NODE.topRailY },
  topRight: { x: PARALLEL_NODE.rightRailX, y: PARALLEL_NODE.topRailY },
  bottomLeft: { x: PARALLEL_NODE.leftRailX, y: PARALLEL_NODE.bottomRailY },
  bottomRight: { x: PARALLEL_NODE.rightRailX, y: PARALLEL_NODE.bottomRailY },

  r1Top: { x: PARALLEL_NODE.r1X, y: PARALLEL_NODE.topRailY },
  r1BodyTop: {
    x: PARALLEL_NODE.r1X,
    y: PARALLEL_NODE.topRailY + PARALLEL_NODE.branchTopGap,
  },
  r1BodyBottom: {
    x: PARALLEL_NODE.r1X,
    y: PARALLEL_NODE.bottomRailY - PARALLEL_NODE.branchBottomGap,
  },
  r1Bottom: { x: PARALLEL_NODE.r1X, y: PARALLEL_NODE.bottomRailY },

  r2Top: { x: PARALLEL_NODE.r2X, y: PARALLEL_NODE.topRailY },
  r2BodyTop: {
    x: PARALLEL_NODE.r2X,
    y: PARALLEL_NODE.topRailY + PARALLEL_NODE.branchTopGap,
  },
  r2BodyBottom: {
    x: PARALLEL_NODE.r2X,
    y: PARALLEL_NODE.bottomRailY - PARALLEL_NODE.branchBottomGap,
  },
  r2Bottom: { x: PARALLEL_NODE.r2X, y: PARALLEL_NODE.bottomRailY },
} as const;

const SERIES_WIRE = {
  batteryToR1: [
    SERIES_CIRCUIT_NODE.batteryPositive,
    SERIES_CIRCUIT_NODE.leftTopBend,
    SERIES_CIRCUIT_NODE.leftUpperRail,
    SERIES_CIRCUIT_NODE.r1In,
  ],
  r1ToR2: [SERIES_CIRCUIT_NODE.r1Out, SERIES_CIRCUIT_NODE.r2In],
  r2ToReturn: [SERIES_CIRCUIT_NODE.r2Out, SERIES_CIRCUIT_NODE.rightDrop],
  returnPath: [
    SERIES_CIRCUIT_NODE.rightDrop,
    SERIES_CIRCUIT_NODE.bottomRight,
    SERIES_CIRCUIT_NODE.bottomLeft,
    SERIES_CIRCUIT_NODE.batteryNegative,
  ],
} as const;

const PARALLEL_WIRE = {
  topRail: [
    PARALLEL_CIRCUIT_NODE.batteryPositive,
    PARALLEL_CIRCUIT_NODE.batteryTopBend,
    PARALLEL_CIRCUIT_NODE.topLeft,
    PARALLEL_CIRCUIT_NODE.topRight,
  ],
  bottomRail: [
    PARALLEL_CIRCUIT_NODE.batteryNegative,
    PARALLEL_CIRCUIT_NODE.batteryBottomBend,
    PARALLEL_CIRCUIT_NODE.bottomLeft,
    PARALLEL_CIRCUIT_NODE.bottomRight,
  ],
  r1TopLead: [PARALLEL_CIRCUIT_NODE.r1Top, PARALLEL_CIRCUIT_NODE.r1BodyTop],
  r1BottomLead: [
    PARALLEL_CIRCUIT_NODE.r1BodyBottom,
    PARALLEL_CIRCUIT_NODE.r1Bottom,
  ],
  r2TopLead: [PARALLEL_CIRCUIT_NODE.r2Top, PARALLEL_CIRCUIT_NODE.r2BodyTop],
  r2BottomLead: [
    PARALLEL_CIRCUIT_NODE.r2BodyBottom,
    PARALLEL_CIRCUIT_NODE.r2Bottom,
  ],
} as const;

const PATH = {
  seriesFlow: pathD([
    SERIES_CIRCUIT_NODE.batteryPositive,
    SERIES_CIRCUIT_NODE.leftTopBend,
    SERIES_CIRCUIT_NODE.leftUpperRail,
    SERIES_CIRCUIT_NODE.r1In,
    SERIES_CIRCUIT_NODE.r1Out,
    SERIES_CIRCUIT_NODE.r2In,
    SERIES_CIRCUIT_NODE.r2Out,
    SERIES_CIRCUIT_NODE.rightDrop,
    SERIES_CIRCUIT_NODE.bottomRight,
    SERIES_CIRCUIT_NODE.bottomLeft,
    SERIES_CIRCUIT_NODE.batteryNegative,
  ]),

  parallelBranchOne: pathD([
    PARALLEL_CIRCUIT_NODE.batteryPositive,
    PARALLEL_CIRCUIT_NODE.batteryTopBend,
    PARALLEL_CIRCUIT_NODE.topLeft,
    PARALLEL_CIRCUIT_NODE.r1Top,
    PARALLEL_CIRCUIT_NODE.r1BodyTop,
    PARALLEL_CIRCUIT_NODE.r1BodyBottom,
    PARALLEL_CIRCUIT_NODE.r1Bottom,
    PARALLEL_CIRCUIT_NODE.bottomLeft,
    PARALLEL_CIRCUIT_NODE.batteryBottomBend,
    PARALLEL_CIRCUIT_NODE.batteryNegative,
  ]),

  parallelBranchTwo: pathD([
    PARALLEL_CIRCUIT_NODE.batteryPositive,
    PARALLEL_CIRCUIT_NODE.batteryTopBend,
    PARALLEL_CIRCUIT_NODE.topLeft,
    PARALLEL_CIRCUIT_NODE.r2Top,
    PARALLEL_CIRCUIT_NODE.r2BodyTop,
    PARALLEL_CIRCUIT_NODE.r2BodyBottom,
    PARALLEL_CIRCUIT_NODE.r2Bottom,
    PARALLEL_CIRCUIT_NODE.bottomLeft,
    PARALLEL_CIRCUIT_NODE.batteryBottomBend,
    PARALLEL_CIRCUIT_NODE.batteryNegative,
  ]),
} as const;

const SERIES_NODE_POINTS: Point[] = [
  SERIES_CIRCUIT_NODE.batteryPositive,
  SERIES_CIRCUIT_NODE.leftTopBend,
  SERIES_CIRCUIT_NODE.leftUpperRail,
  SERIES_CIRCUIT_NODE.r1In,
  SERIES_CIRCUIT_NODE.r1Out,
  SERIES_CIRCUIT_NODE.r2In,
  SERIES_CIRCUIT_NODE.r2Out,
  SERIES_CIRCUIT_NODE.rightDrop,
  SERIES_CIRCUIT_NODE.bottomRight,
  SERIES_CIRCUIT_NODE.bottomLeft,
  SERIES_CIRCUIT_NODE.batteryNegative,
];

const PARALLEL_NODE_POINTS: Point[] = [
  PARALLEL_CIRCUIT_NODE.batteryPositive,
  PARALLEL_CIRCUIT_NODE.batteryNegative,
  PARALLEL_CIRCUIT_NODE.batteryTopBend,
  PARALLEL_CIRCUIT_NODE.batteryBottomBend,
  PARALLEL_CIRCUIT_NODE.topLeft,
  PARALLEL_CIRCUIT_NODE.topRight,
  PARALLEL_CIRCUIT_NODE.bottomLeft,
  PARALLEL_CIRCUIT_NODE.bottomRight,
  PARALLEL_CIRCUIT_NODE.r1Top,
  PARALLEL_CIRCUIT_NODE.r1Bottom,
  PARALLEL_CIRCUIT_NODE.r2Top,
  PARALLEL_CIRCUIT_NODE.r2Bottom,
];

const LABEL = {
  batteryVoltage: {
    x: SERIES_NODE.batteryPositive.x + 14,
    y: COMPONENT.battery.y + 56,
  },
} as const;

function WirePath({
  points,
  stroke,
}: {
  points: readonly Point[];
  stroke: string;
}) {
  return (
    <path
      d={pathD(points)}
      stroke={stroke}
      strokeWidth={WIRE.width}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function NodeDots({ nodes, prefix }: { nodes: Point[]; prefix: string }) {
  return (
    <g>
      {nodes.map((node, index) => (
        <circle
          key={`${prefix}-node-${index}`}
          cx={node.x}
          cy={node.y}
          r="2.35"
          fill={STYLE.nodeFill}
          stroke={STYLE.nodeStroke}
          strokeWidth="1.15"
        />
      ))}
    </g>
  );
}

function BatteryBlock({ voltage, label }: { voltage: number; label: string }) {
  return (
    <g>
      <svg
        x={COMPONENT.battery.x}
        y={COMPONENT.battery.y}
        width={COMPONENT.battery.width}
        height={COMPONENT.battery.height}
        viewBox={`0 0 ${COMPONENT.battery.width} ${COMPONENT.battery.height}`}
        overflow="visible"
      >
        <BatterySymbol
          width={COMPONENT.battery.width}
          height={COMPONENT.battery.height}
          label={label}
        />
      </svg>

      <text
        x={LABEL.batteryVoltage.x}
        y={LABEL.batteryVoltage.y}
        fontSize="13"
        fontWeight="700"
        fill={STYLE.positiveWire}
      >
        {voltage.toFixed(1)}V
      </text>
    </g>
  );
}

function HorizontalResistor({
  x,
  y,
  label,
  resistance,
  drop,
}: {
  x: number;
  y: number;
  label: string;
  resistance: number;
  drop: number;
}) {
  return (
    <g>
      <svg
        x={x}
        y={y}
        width={COMPONENT.resistor.width}
        height={COMPONENT.resistor.height}
        viewBox={`0 0 ${COMPONENT.resistor.width} ${COMPONENT.resistor.height}`}
        overflow="visible"
      >
        <ResistorSymbol
          width={COMPONENT.resistor.width}
          height={COMPONENT.resistor.height}
          label={label}
        />
      </svg>

      <text
        x={x + COMPONENT.resistor.width / 2}
        y={y + 64}
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill="#334155"
      >
        {label} {resistance.toFixed(1)} Ohm
      </text>

      <text
        x={x + COMPONENT.resistor.width / 2}
        y={y + 80}
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill={STYLE.flow}
      >
        Drop {drop.toFixed(1)}V
      </text>
    </g>
  );
}

function VerticalResistor({
  x,
  label,
  resistance,
  current,
}: {
  x: number;
  label: string;
  resistance: number;
  current: number;
}) {
  return (
    <g>
      <g
        transform={`translate(${x} ${PARALLEL_NODE.resistorCenterY}) rotate(90) translate(${-COMPONENT.resistor.width / 2} ${-COMPONENT.resistor.height / 2})`}
      >
        <ResistorSymbol
          width={COMPONENT.resistor.width}
          height={COMPONENT.resistor.height}
          label={label}
        />
      </g>

      <text
        x={x + 18}
        y={PARALLEL_NODE.resistorCenterY - 8}
        fontSize="12"
        fontWeight="700"
        fill="#334155"
      >
        {label}
      </text>

      <text
        x={x + 18}
        y={PARALLEL_NODE.resistorCenterY + 12}
        fontSize="11"
        fontWeight="700"
        fill="#334155"
      >
        {resistance.toFixed(1)} Ohm
      </text>

      <text
        x={x + 18}
        y={PARALLEL_NODE.resistorCenterY + 30}
        fontSize="11"
        fontWeight="700"
        fill={STYLE.flow}
      >
        I = {current.toFixed(2)}A
      </text>
    </g>
  );
}

function FlowParticles({
  count,
  path,
  duration,
  prefix,
}: {
  count: number;
  path: string;
  duration: number;
  prefix: string;
}) {
  return (
    <g>
      {Array.from({ length: count }, (_, particle) => {
        const delay = particle * FLOW.stagger;

        return (
          <circle
            key={`${prefix}-particle-${particle}`}
            r={FLOW.radius}
            fill={STYLE.flow}
            opacity={0}
          >
            <animate
              attributeName="opacity"
              values="0;0.88;0.88;0"
              keyTimes="0;0.08;0.9;1"
              dur={`${duration}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />

            <animateMotion
              dur={`${duration}s`}
              repeatCount="indefinite"
              begin={`${delay}s`}
              path={path}
            />
          </circle>
        );
      })}
    </g>
  );
}

function FlowBar({ percent }: { percent: number }) {
  return (
    <g>
      <rect
        x={COMPONENT.flowBar.x}
        y={COMPONENT.flowBar.y}
        width={Math.max(16, percent * 2.6)}
        height={COMPONENT.flowBar.height}
        rx="4"
        fill={STYLE.flow}
      />
    </g>
  );
}

export function ComparisonCircuit({
  voltage,
  resistanceOne,
  resistanceTwo,
  seriesCurrent,
  seriesDropOne,
  seriesDropTwo,
  parallelCurrentOne,
  parallelCurrentTwo,
  parallelTotalCurrent,
  seriesFlowPercent,
  parallelFlowPercent,
  seriesFlowLevel,
  parallelFlowLevel,
}: ComparisonCircuitProps) {
  const seriesParticleDuration = getElectronSpeed(seriesFlowPercent);
  const parallelParticleDuration = getElectronSpeed(parallelFlowPercent);
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  const parallelBranches = [
    {
      key: "parallel-branch-one",
      x: PARALLEL_NODE.r1X,
      label: "R1",
      resistance: resistanceOne,
      current: parallelCurrentOne,
      path: PATH.parallelBranchOne,
      count: getParticleCount(parallelCurrentOne, parallelTotalCurrent),
    },
    {
      key: "parallel-branch-two",
      x: PARALLEL_NODE.r2X,
      label: "R2",
      resistance: resistanceTwo,
      current: parallelCurrentTwo,
      path: PATH.parallelBranchTwo,
      count: getParticleCount(parallelCurrentTwo, parallelTotalCurrent),
    },
  ];

  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <article className="overflow-hidden rounded-3xl border border-slate-300 bg-white shadow-xl">
        <svg
          viewBox={VIEW_BOX}
          className="h-[300px] w-full bg-white"
          role="img"
          aria-label="Series circuit comparison"
        >
          <g transform={canvasTransform}>
            <text
              x="38"
              y="34"
              fontSize="20"
              fontWeight="800"
              fill={STYLE.text}
            >
              Series Circuit = One Current Path
            </text>

            <text x="38" y="58" fontSize="12" fill={STYLE.muted}>
              Same current flows through R1 and R2 - Current ={" "}
              {seriesCurrent.toFixed(2)}A - Level: {seriesFlowLevel}
            </text>

            <BatteryBlock voltage={voltage} label="Series battery" />

            <WirePath
              points={SERIES_WIRE.batteryToR1}
              stroke={STYLE.positiveWire}
            />
            <WirePath points={SERIES_WIRE.r1ToR2} stroke={STYLE.positiveWire} />
            <WirePath
              points={SERIES_WIRE.r2ToReturn}
              stroke={STYLE.positiveWire}
            />
            <WirePath
              points={SERIES_WIRE.returnPath}
              stroke={STYLE.returnWire}
            />

            <NodeDots nodes={SERIES_NODE_POINTS} prefix="series" />

            <HorizontalResistor
              x={SERIES_COMPONENT.r1.x}
              y={SERIES_COMPONENT.r1.y}
              label="R1"
              resistance={resistanceOne}
              drop={seriesDropOne}
            />

            <HorizontalResistor
              x={SERIES_COMPONENT.r2.x}
              y={SERIES_COMPONENT.r2.y}
              label="R2"
              resistance={resistanceTwo}
              drop={seriesDropTwo}
            />

            <text
              x="320"
              y="220"
              textAnchor="middle"
              fontSize="14"
              fontWeight="700"
              fill={STYLE.flow}
            >
              Charge Flow →
            </text>

            <FlowParticles
              count={ELECTRON_COUNT}
              path={PATH.seriesFlow}
              duration={seriesParticleDuration}
              prefix="series"
            />

            <text
              x="44"
              y="226"
              fontSize="12"
              fontWeight="700"
              fill={STYLE.flow}
            >
              Flow Strength: {Math.round(seriesFlowPercent)}%
            </text>

            <FlowBar percent={seriesFlowPercent} />
          </g>
        </svg>
      </article>

      <article className="overflow-hidden rounded-3xl border border-slate-300 bg-white shadow-xl">
        <svg
          viewBox={VIEW_BOX}
          className="h-[300px] w-full bg-white"
          role="img"
          aria-label="Parallel circuit comparison"
        >
          <g transform={canvasTransform}>
            <text
              x="38"
              y="34"
              fontSize="20"
              fontWeight="800"
              fill={STYLE.text}
            >
              Parallel Circuit = Multiple Paths
            </text>

            <text x="38" y="58" fontSize="12" fill={STYLE.muted}>
              Same voltage across each branch - Total current ={" "}
              {parallelTotalCurrent.toFixed(2)}A - Level: {parallelFlowLevel}
            </text>

            <BatteryBlock voltage={voltage} label="Parallel battery" />

            <WirePath
              points={PARALLEL_WIRE.topRail}
              stroke={STYLE.positiveWire}
            />
            <WirePath
              points={PARALLEL_WIRE.bottomRail}
              stroke={STYLE.returnWire}
            />
            <WirePath
              points={PARALLEL_WIRE.r1TopLead}
              stroke={STYLE.positiveWire}
            />
            <WirePath
              points={PARALLEL_WIRE.r1BottomLead}
              stroke={STYLE.returnWire}
            />
            <WirePath
              points={PARALLEL_WIRE.r2TopLead}
              stroke={STYLE.positiveWire}
            />
            <WirePath
              points={PARALLEL_WIRE.r2BottomLead}
              stroke={STYLE.returnWire}
            />

            <NodeDots nodes={PARALLEL_NODE_POINTS} prefix="parallel" />

            {parallelBranches.map((branch) => (
              <VerticalResistor
                key={branch.key}
                x={branch.x}
                label={branch.label}
                resistance={branch.resistance}
                current={branch.current}
              />
            ))}

            <text
              x="330"
              y="220"
              textAnchor="middle"
              fontSize="14"
              fontWeight="700"
              fill={STYLE.flow}
            >
              Split Charge Flow →
            </text>

            {parallelBranches.map((branch) => (
              <FlowParticles
                key={`${branch.key}-particles`}
                count={branch.count}
                path={branch.path}
                duration={parallelParticleDuration}
                prefix={branch.key}
              />
            ))}

            <text
              x="44"
              y="226"
              fontSize="12"
              fontWeight="700"
              fill={STYLE.flow}
            >
              Flow Strength: {Math.round(parallelFlowPercent)}%
            </text>

            <FlowBar percent={parallelFlowPercent} />
          </g>
        </svg>
      </article>
    </section>
  );
}
