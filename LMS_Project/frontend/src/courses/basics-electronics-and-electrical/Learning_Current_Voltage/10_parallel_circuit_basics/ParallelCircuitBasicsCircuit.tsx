"use client";

import ResistorSymbol from "@/src/library/electronics-symbol-library/passive/ResistorSymbol";
import BatterySymbol from "@/src/library/electronics-symbol-library/sources/BatterySymbol";

import { ELECTRON_COUNT, getElectronSpeed } from "./logic";
import type { FlowLevel } from "./types";

type ParallelCircuitBasicsCircuitProps = {
  voltage: number;
  branchOneResistance: number;
  branchTwoResistance: number;
  branchThreeResistance?: number;
  currentOne: number;
  currentTwo: number;
  currentThree?: number;
  totalCurrent: number;
  flowPercent: number;
  flowLevel: FlowLevel;
};

const VIEW_BOX = "0 28 760 320";
const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 320;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  battery: 1,
  resistor: 1,
  strengthBar: 1,
} as const;

const BASE_WIRE_WIDTH = 2.2;
const CIRCUIT_WIRE_SCALE = 1;

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

function safeNumber(value: number | undefined, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function getParticleCount(branchCurrent: number, totalCurrent: number) {
  if (totalCurrent <= 0) return 2;
  return Math.max(
    2,
    Math.round((ELECTRON_COUNT * branchCurrent) / totalCurrent),
  );
}

const BASE_COMPONENT = {
  battery: { x: 86, y: 172, width: 102, height: 108, rotate: 0 },
  resistor: { x: 0, y: 0, width: 150, height: 84, rotate: 90 },
  strengthBar: { x: 82, y: 334, width: 420, height: 8, rotate: 0 },
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
  strengthBar: scaleComponent(
    BASE_COMPONENT.strengthBar,
    CIRCUIT_COMPONENT_SCALE.strengthBar,
  ),
} as const;

const NODE = {
  topRailY: 132,
  bottomRailY: 318,
  leftRailX: 180,
  rightRailX: 650,

  batteryPositive: {
    x: COMPONENT.battery.x + (81 / 160) * COMPONENT.battery.width,
    y: COMPONENT.battery.y + (21 / 160) * COMPONENT.battery.height,
  },

  batteryNegative: {
    x: COMPONENT.battery.x + (81 / 160) * COMPONENT.battery.width,
    y: COMPONENT.battery.y + (121 / 160) * COMPONENT.battery.height,
  },

  branchOneX: 300,
  branchTwoX: 455,
  branchThreeX: 610,
} as const;

const BRANCH = {
  topGap: 50,
  bottomGap: 50,
  resistorCenterY: (NODE.topRailY + NODE.bottomRailY) / 2,
} as const;

const CIRCUIT_NODE = {
  batteryPositive: NODE.batteryPositive,
  batteryNegative: NODE.batteryNegative,

  batteryTopBend: { x: NODE.batteryPositive.x, y: NODE.topRailY },
  batteryBottomBend: { x: NODE.batteryNegative.x, y: NODE.bottomRailY },

  topLeft: { x: NODE.leftRailX, y: NODE.topRailY },
  topRight: { x: NODE.rightRailX, y: NODE.topRailY },

  bottomLeft: { x: NODE.leftRailX, y: NODE.bottomRailY },
  bottomRight: { x: NODE.rightRailX, y: NODE.bottomRailY },

  r1Top: { x: NODE.branchOneX, y: NODE.topRailY },
  r1BodyTop: { x: NODE.branchOneX, y: NODE.topRailY + BRANCH.topGap },
  r1BodyBottom: { x: NODE.branchOneX, y: NODE.bottomRailY - BRANCH.bottomGap },
  r1Bottom: { x: NODE.branchOneX, y: NODE.bottomRailY },

  r2Top: { x: NODE.branchTwoX, y: NODE.topRailY },
  r2BodyTop: { x: NODE.branchTwoX, y: NODE.topRailY + BRANCH.topGap },
  r2BodyBottom: { x: NODE.branchTwoX, y: NODE.bottomRailY - BRANCH.bottomGap },
  r2Bottom: { x: NODE.branchTwoX, y: NODE.bottomRailY },

  r3Top: { x: NODE.branchThreeX, y: NODE.topRailY },
  r3BodyTop: { x: NODE.branchThreeX, y: NODE.topRailY + BRANCH.topGap },
  r3BodyBottom: {
    x: NODE.branchThreeX,
    y: NODE.bottomRailY - BRANCH.bottomGap,
  },
  r3Bottom: { x: NODE.branchThreeX, y: NODE.bottomRailY },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  topRail: [
    CIRCUIT_NODE.batteryPositive,
    CIRCUIT_NODE.batteryTopBend,
    CIRCUIT_NODE.topLeft,
    CIRCUIT_NODE.topRight,
  ],

  bottomRail: [
    CIRCUIT_NODE.batteryNegative,
    CIRCUIT_NODE.batteryBottomBend,
    CIRCUIT_NODE.bottomLeft,
    CIRCUIT_NODE.bottomRight,
  ],

  r1TopLead: [CIRCUIT_NODE.r1Top, CIRCUIT_NODE.r1BodyTop],
  r1BottomLead: [CIRCUIT_NODE.r1BodyBottom, CIRCUIT_NODE.r1Bottom],

  r2TopLead: [CIRCUIT_NODE.r2Top, CIRCUIT_NODE.r2BodyTop],
  r2BottomLead: [CIRCUIT_NODE.r2BodyBottom, CIRCUIT_NODE.r2Bottom],

  r3TopLead: [CIRCUIT_NODE.r3Top, CIRCUIT_NODE.r3BodyTop],
  r3BottomLead: [CIRCUIT_NODE.r3BodyBottom, CIRCUIT_NODE.r3Bottom],
} as const;

const PATH = {
  branchOne: pathD([
    CIRCUIT_NODE.batteryPositive,
    CIRCUIT_NODE.batteryTopBend,
    CIRCUIT_NODE.topLeft,
    CIRCUIT_NODE.r1Top,
    CIRCUIT_NODE.r1BodyTop,
    CIRCUIT_NODE.r1BodyBottom,
    CIRCUIT_NODE.r1Bottom,
    CIRCUIT_NODE.bottomLeft,
    CIRCUIT_NODE.batteryBottomBend,
    CIRCUIT_NODE.batteryNegative,
  ]),

  branchTwo: pathD([
    CIRCUIT_NODE.batteryPositive,
    CIRCUIT_NODE.batteryTopBend,
    CIRCUIT_NODE.topLeft,
    CIRCUIT_NODE.r2Top,
    CIRCUIT_NODE.r2BodyTop,
    CIRCUIT_NODE.r2BodyBottom,
    CIRCUIT_NODE.r2Bottom,
    CIRCUIT_NODE.bottomLeft,
    CIRCUIT_NODE.batteryBottomBend,
    CIRCUIT_NODE.batteryNegative,
  ]),

  branchThree: pathD([
    CIRCUIT_NODE.batteryPositive,
    CIRCUIT_NODE.batteryTopBend,
    CIRCUIT_NODE.topLeft,
    CIRCUIT_NODE.r3Top,
    CIRCUIT_NODE.r3BodyTop,
    CIRCUIT_NODE.r3BodyBottom,
    CIRCUIT_NODE.r3Bottom,
    CIRCUIT_NODE.bottomLeft,
    CIRCUIT_NODE.batteryBottomBend,
    CIRCUIT_NODE.batteryNegative,
  ]),
} as const;

const NODE_POINTS: Point[] = [
  CIRCUIT_NODE.batteryPositive,
  CIRCUIT_NODE.batteryNegative,
  CIRCUIT_NODE.batteryTopBend,
  CIRCUIT_NODE.batteryBottomBend,
  CIRCUIT_NODE.topLeft,
  CIRCUIT_NODE.topRight,
  CIRCUIT_NODE.bottomLeft,
  CIRCUIT_NODE.bottomRight,
  CIRCUIT_NODE.r1Top,
  CIRCUIT_NODE.r1Bottom,
  CIRCUIT_NODE.r2Top,
  CIRCUIT_NODE.r2Bottom,
  CIRCUIT_NODE.r3Top,
  CIRCUIT_NODE.r3Bottom,
];

const LABEL = {
  title: { x: 70, y: 82 },
  subtitle: { x: 70, y: 110 },

  batteryVoltage: {
    x: NODE.batteryPositive.x + 20,
    y: COMPONENT.battery.y + 64,
  },

  voltagePush: { x: 224, y: 124 },
  splitFlow: { x: 426, y: 296 },
  strengthText: { x: 82, y: 360 },
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

function NodeDots() {
  return (
    <g>
      {NODE_POINTS.map((node, index) => (
        <circle
          key={`node-dot-${index}`}
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

function BatteryBlock({ voltage }: { voltage: number }) {
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
          label="Battery source"
        />
      </svg>

      <text
        x={LABEL.batteryVoltage.x}
        y={LABEL.batteryVoltage.y}
        fontSize="14"
        fontWeight="700"
        fill={STYLE.positiveWire}
      >
        {voltage.toFixed(1)}V
      </text>
    </g>
  );
}

function BranchResistor({
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
        transform={`translate(${x} ${BRANCH.resistorCenterY}) rotate(90) translate(${-COMPONENT.resistor.width / 2} ${-COMPONENT.resistor.height / 2})`}
      >
        <ResistorSymbol
          width={COMPONENT.resistor.width}
          height={COMPONENT.resistor.height}
          label={label}
        />
      </g>

      <text
        x={x + 20}
        y={BRANCH.resistorCenterY - 8}
        fontSize="13"
        fontWeight="700"
        fill="#334155"
      >
        {label}
      </text>

      <text
        x={x + 20}
        y={BRANCH.resistorCenterY + 12}
        fontSize="12"
        fontWeight="700"
        fill="#334155"
      >
        {resistance.toFixed(1)} Ohm
      </text>

      <text
        x={x + 20}
        y={BRANCH.resistorCenterY + 30}
        fontSize="11"
        fontWeight="700"
        fill={STYLE.flow}
      >
        I = {current.toFixed(2)}A
      </text>
    </g>
  );
}

function BranchParticles({
  path,
  count,
  duration,
  branchKey,
}: {
  path: string;
  count: number;
  duration: number;
  branchKey: string;
}) {
  return (
    <g>
      {Array.from({ length: count }, (_, particle) => {
        const delay = particle * FLOW.stagger;

        return (
          <circle
            key={`${branchKey}-particle-${particle}`}
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

function StrengthBar({ flowPercent }: { flowPercent: number }) {
  return (
    <g>
      <rect
        x={COMPONENT.strengthBar.x}
        y={COMPONENT.strengthBar.y}
        width={Math.max(16, flowPercent * 4.2)}
        height={COMPONENT.strengthBar.height}
        rx="4"
        fill={STYLE.flow}
      />

      <text
        x={LABEL.strengthText.x}
        y={LABEL.strengthText.y}
        fontSize="13"
        fontWeight="700"
        fill={STYLE.flow}
      >
        Charge Flow Strength: {Math.round(flowPercent)}%
      </text>
    </g>
  );
}

export function ParallelCircuitBasicsCircuit({
  voltage,
  branchOneResistance,
  branchTwoResistance,
  branchThreeResistance,
  currentOne,
  currentTwo,
  currentThree,
  totalCurrent,
  flowPercent,
  flowLevel,
}: ParallelCircuitBasicsCircuitProps) {
  const safeVoltage = safeNumber(voltage, 12);
  const r1 = safeNumber(branchOneResistance, 10);
  const r2 = safeNumber(branchTwoResistance, 2);
  const r3 = safeNumber(branchThreeResistance, 1);

  const i1 = safeNumber(currentOne);
  const i2 = safeNumber(currentTwo);
  const i3 = safeNumber(currentThree);
  const total = safeNumber(totalCurrent, i1 + i2 + i3);

  const particleDuration = getElectronSpeed(flowPercent);
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  const branches = [
    {
      key: "branch-one",
      x: NODE.branchOneX,
      label: "R1",
      resistance: r1,
      current: i1,
      path: PATH.branchOne,
      count: getParticleCount(i1, total),
    },
    {
      key: "branch-two",
      x: NODE.branchTwoX,
      label: "R2",
      resistance: r2,
      current: i2,
      path: PATH.branchTwo,
      count: getParticleCount(i2, total),
    },
    {
      key: "branch-three",
      x: NODE.branchThreeX,
      label: "R3",
      resistance: r3,
      current: i3,
      path: PATH.branchThree,
      count: getParticleCount(i3, total),
    },
  ];

  return (
    <svg
      viewBox={VIEW_BOX}
      className="h-[300px] w-full sm:h-[340px] md:h-[390px] lg:h-[430px]"
      role="img"
      aria-label="Parallel circuit basics"
    >
      <g transform={canvasTransform}>
        <text
          x={LABEL.title.x}
          y={LABEL.title.y}
          fontSize="22"
          fontWeight="800"
          fill={STYLE.text}
        >
          Parallel Circuit = Multiple Current Paths
        </text>

        <text
          x={LABEL.subtitle.x}
          y={LABEL.subtitle.y}
          fontSize="14"
          fill={STYLE.muted}
        >
          Same voltage across each branch - Total current = {total.toFixed(2)}A
          - Flow level: {flowLevel}
        </text>

        <BatteryBlock voltage={safeVoltage} />

        <WirePath points={WIRE.topRail} stroke={STYLE.positiveWire} />
        <WirePath points={WIRE.bottomRail} stroke={STYLE.returnWire} />

        <WirePath points={WIRE.r1TopLead} stroke={STYLE.positiveWire} />
        <WirePath points={WIRE.r1BottomLead} stroke={STYLE.returnWire} />

        <WirePath points={WIRE.r2TopLead} stroke={STYLE.positiveWire} />
        <WirePath points={WIRE.r2BottomLead} stroke={STYLE.returnWire} />

        <WirePath points={WIRE.r3TopLead} stroke={STYLE.positiveWire} />
        <WirePath points={WIRE.r3BottomLead} stroke={STYLE.returnWire} />

        <NodeDots />

        {branches.map((branch) => (
          <BranchResistor
            key={branch.key}
            x={branch.x}
            label={branch.label}
            resistance={branch.resistance}
            current={branch.current}
          />
        ))}

        <text
          x={LABEL.voltagePush.x}
          y={LABEL.voltagePush.y}
          fontSize="14"
          fontWeight="700"
          fill={STYLE.positiveWire}
        >
          Voltage Push
        </text>

        <text
          x={LABEL.splitFlow.x}
          y={LABEL.splitFlow.y}
          fontSize="14"
          fontWeight="700"
          fill={STYLE.flow}
        >
          Split Charge Flow →
        </text>

        {branches.map((branch) => (
          <BranchParticles
            key={`${branch.key}-particles`}
            branchKey={branch.key}
            path={branch.path}
            count={branch.count}
            duration={particleDuration}
          />
        ))}

        <StrengthBar flowPercent={flowPercent} />
      </g>
    </svg>
  );
}
