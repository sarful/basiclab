import FlowDots from "./FlowDots";
import { formatNumber } from "./logic";
import type { RegulatorType } from "./types";

type PowerChainProps = {
  regulatedVoltage: number;
  inputVoltage: number;
  regulatorType: RegulatorType;
};

const VIEW_BOX = "0 0 921 492";
const VIEW_BOX_WIDTH = 921;
const VIEW_BOX_HEIGHT = 492;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  source: 1,
  regulator: 1,
  load: 1,
} as const;

const BASE_WIRE_WIDTH = 3;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  wire: "#3f4850",
  text: "#333333",
  darkText: "#1f2937",
  regulatorStroke: "#4b5563",
  inputFlow: "#2563eb",
  outputFlow: "#16a34a",
  loadFill: "#efefef",
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

function pointOnComponent(
  component: ComponentBox,
  xRatio: number,
  yRatio: number,
): Point {
  return {
    x: component.x + component.width * xRatio,
    y: component.y + component.height * yRatio,
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
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

const BASE_COMPONENT = {
  source: { x: 55, y: 225, width: 78, height: 78, rotate: 0 },
  regulator: { x: 448, y: 81, width: 112, height: 93, rotate: 0 },
  load: { x: 750, y: 162, width: 96, height: 141, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  source: scaleComponent(BASE_COMPONENT.source, CIRCUIT_COMPONENT_SCALE.source),
  regulator: scaleComponent(
    BASE_COMPONENT.regulator,
    CIRCUIT_COMPONENT_SCALE.regulator,
  ),
  load: scaleComponent(BASE_COMPONENT.load, CIRCUIT_COMPONENT_SCALE.load),
} as const;

const NODE = {
  leftTop: { x: 95, y: 117 },
  leftBottom: { x: 95, y: 411 },
  regulatorIn: { x: 448, y: 117 },
  regulatorOut: { x: 560, y: 117 },
  regulatorGnd: { x: 504, y: 174 },
  gndNode: { x: 504, y: 411 },
  loadTop: { x: 799, y: 117 },
  loadBottom: { x: 799, y: 411 },
  sourceCenter: pointOnComponent(COMPONENT.source, 0.5, 0.5),
  loadCenter: pointOnComponent(COMPONENT.load, 0.5, 0.64),
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  inputTop: [NODE.leftTop, NODE.regulatorIn],
  outputTop: [NODE.regulatorOut, NODE.loadTop],
  loadDrop: [NODE.loadTop, NODE.loadBottom],
  bottomReturn: [NODE.leftBottom, NODE.loadBottom],
  leftReturn: [NODE.leftTop, NODE.leftBottom],
  regulatorGround: [NODE.regulatorGnd, NODE.gndNode],
} as const;

const PATH = {
  inputFlow: pathD(WIRE.inputTop),
  outputFlow: "M560 117 H799 V411 H504",
} as const;

const LABEL = {
  title: { x: 501, y: 52 },
  sourceName: { x: 142, y: 262 },
  sourceVoltage: { x: 142, y: 290 },
  in: { x: 480, y: 121 },
  out: { x: 513, y: 121 },
  gnd: { x: 482, y: 164 },
} as const;

function WirePath({ points }: { points: readonly Point[] }) {
  return (
    <path
      d={pathD(points)}
      stroke={STYLE.wire}
      strokeWidth={WIRE.width}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function VoltageSource({ inputVoltage }: { inputVoltage: number }) {
  return (
    <g>
      <circle
        cx={NODE.sourceCenter.x}
        cy={NODE.sourceCenter.y}
        r="39"
        fill="none"
        stroke={STYLE.wire}
        strokeWidth="3"
      />

      <line
        x1="94"
        y1="239"
        x2="94"
        y2="265"
        stroke={STYLE.wire}
        strokeWidth="3"
      />
      <line
        x1="82"
        y1="252"
        x2="106"
        y2="252"
        stroke={STYLE.wire}
        strokeWidth="3"
      />
      <line
        x1="82"
        y1="282"
        x2="106"
        y2="282"
        stroke={STYLE.wire}
        strokeWidth="3"
      />

      <text
        x={LABEL.sourceName.x}
        y={LABEL.sourceName.y}
        fontSize="20"
        fontWeight="700"
        fill={STYLE.darkText}
      >
        V1
      </text>

      <text
        x={LABEL.sourceVoltage.x}
        y={LABEL.sourceVoltage.y}
        fontSize="20"
        fontWeight="700"
        fill={STYLE.darkText}
      >
        {inputVoltage} V
      </text>
    </g>
  );
}

function RegulatorBlock() {
  return (
    <g>
      <rect
        x={COMPONENT.regulator.x}
        y={COMPONENT.regulator.y}
        width={COMPONENT.regulator.width}
        height={COMPONENT.regulator.height}
        fill="#ffffff"
        stroke={STYLE.regulatorStroke}
        strokeWidth="3"
      />

      <text
        x={LABEL.in.x}
        y={LABEL.in.y}
        fontSize="16"
        fontStyle="italic"
        fontWeight="700"
        fill={STYLE.regulatorStroke}
      >
        IN
      </text>

      <text
        x={LABEL.out.x}
        y={LABEL.out.y}
        fontSize="16"
        fontStyle="italic"
        fontWeight="700"
        fill={STYLE.regulatorStroke}
      >
        OUT
      </text>

      <text
        x={LABEL.gnd.x}
        y={LABEL.gnd.y}
        fontSize="16"
        fontStyle="italic"
        fontWeight="700"
        fill={STYLE.regulatorStroke}
      >
        GND
      </text>
    </g>
  );
}

function OutputLoad({ regulatedVoltage }: { regulatedVoltage: number }) {
  return (
    <g>
      <rect
        x={COMPONENT.load.x}
        y={COMPONENT.load.y}
        width={COMPONENT.load.width}
        height={COMPONENT.load.height}
        rx="16"
        fill={STYLE.loadFill}
        stroke={STYLE.wire}
        strokeWidth="1.5"
      />

      <text
        x={NODE.loadCenter.x}
        y={NODE.loadCenter.y}
        textAnchor="middle"
        fontSize="22"
        fill="#000000"
      >
        {formatNumber(regulatedVoltage, 0)}V
      </text>
    </g>
  );
}

function JunctionDots() {
  return (
    <g>
      <circle cx={NODE.gndNode.x} cy={NODE.gndNode.y} r="6" fill={STYLE.wire} />
      <circle
        cx={NODE.loadBottom.x}
        cy={NODE.loadBottom.y}
        r="8"
        fill="none"
        stroke={STYLE.wire}
        strokeWidth="3"
      />
    </g>
  );
}

function FlowLayer({ active }: { active: boolean }) {
  return (
    <g>
      <FlowDots
        path={PATH.inputFlow}
        active={active}
        color={STYLE.inputFlow}
        count={8}
      />

      <FlowDots
        path={PATH.outputFlow}
        active={active}
        color={STYLE.outputFlow}
        count={10}
      />
    </g>
  );
}

export default function PowerChain({
  regulatedVoltage,
  inputVoltage,
  regulatorType,
}: PowerChainProps) {
  const active = Math.abs(regulatedVoltage) > 0.1;
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <svg viewBox={VIEW_BOX} className="h-auto w-full bg-white">
      <rect width="921" height="492" fill="#ffffff" />

      <g transform={canvasTransform}>
        <text
          x={LABEL.title.x}
          y={LABEL.title.y}
          textAnchor="middle"
          fontSize="20"
          fontWeight="700"
          fill={STYLE.text}
        >
          {regulatorType}
        </text>

        <WirePath points={WIRE.inputTop} />
        <WirePath points={WIRE.outputTop} />
        <WirePath points={WIRE.loadDrop} />
        <WirePath points={WIRE.bottomReturn} />
        <WirePath points={WIRE.leftReturn} />
        <WirePath points={WIRE.regulatorGround} />

        <VoltageSource inputVoltage={inputVoltage} />

        <RegulatorBlock />

        <OutputLoad regulatedVoltage={regulatedVoltage} />

        <JunctionDots />

        <FlowLayer active={active} />
      </g>
    </svg>
  );
}
