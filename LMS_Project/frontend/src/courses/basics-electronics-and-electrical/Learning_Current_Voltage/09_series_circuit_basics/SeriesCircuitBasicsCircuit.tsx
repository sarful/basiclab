"use client";

import { motion } from "framer-motion";

import LEDSymbol from "@/src/library/electronics-symbol-library/diodes/LEDSymbol";
import ResistorSymbol from "@/src/library/electronics-symbol-library/passive/ResistorSymbol";
import BatterySymbol from "@/src/library/electronics-symbol-library/sources/BatterySymbol";

import { ELECTRON_COUNT, getElectronSpeed } from "./logic";
import type { FlowLevel } from "./types";

type SeriesCircuitBasicsCircuitProps = {
  voltage: number;
  resistanceOne: number;
  resistanceTwo: number;
  current: number;
  dropOne: number;
  dropTwo: number;
  ledDrop: number;
  flowPercent: number;
  flowLevel: FlowLevel;
};

const VIEW_BOX = "0 28 760 320";
const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 320;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  battery: 1,
  resistorOne: 1,
  resistorTwo: 1,
  led: 1,
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
  ledText: "#16a34a",
  ledGlow: "#fde68a",
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

const BASE_COMPONENT = {
  battery: { x: 86, y: 172, width: 102, height: 108, rotate: 0 },
  resistorOne: { x: 230, y: 98, width: 142, height: 84, rotate: 0 },
  resistorTwo: { x: 406, y: 98, width: 142, height: 84, rotate: 0 },
  led: { x: 602, y: 190, width: 124, height: 92, rotate: 90 },
  strengthBar: { x: 82, y: 334, width: 420, height: 8, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  battery: scaleComponent(
    BASE_COMPONENT.battery,
    CIRCUIT_COMPONENT_SCALE.battery,
  ),
  resistorOne: scaleComponent(
    BASE_COMPONENT.resistorOne,
    CIRCUIT_COMPONENT_SCALE.resistorOne,
  ),
  resistorTwo: scaleComponent(
    BASE_COMPONENT.resistorTwo,
    CIRCUIT_COMPONENT_SCALE.resistorTwo,
  ),
  led: scaleComponent(BASE_COMPONENT.led, CIRCUIT_COMPONENT_SCALE.led),
  strengthBar: scaleComponent(
    BASE_COMPONENT.strengthBar,
    CIRCUIT_COMPONENT_SCALE.strengthBar,
  ),
} as const;

const NODE = {
  bottomRailY: 318,
  leftWireX: 138,

  batteryPositive: {
    x: COMPONENT.battery.x + (81 / 160) * COMPONENT.battery.width,
    y: COMPONENT.battery.y + (21 / 160) * COMPONENT.battery.height,
  },

  batteryNegative: {
    x: COMPONENT.battery.x + (81 / 160) * COMPONENT.battery.width,
    y: COMPONENT.battery.y + (121 / 160) * COMPONENT.battery.height,
  },

  resistorTerminalY:
    COMPONENT.resistorOne.y + (20 / 41) * COMPONENT.resistorOne.height,

  r1In: {
    x: COMPONENT.resistorOne.x + (15 / 71) * COMPONENT.resistorOne.width,
    y: COMPONENT.resistorOne.y + (20 / 41) * COMPONENT.resistorOne.height,
  },

  r1Out: {
    x: COMPONENT.resistorOne.x + (57 / 71) * COMPONENT.resistorOne.width,
    y: COMPONENT.resistorOne.y + (20 / 41) * COMPONENT.resistorOne.height,
  },

  r2In: {
    x: COMPONENT.resistorTwo.x + (15 / 71) * COMPONENT.resistorTwo.width,
    y: COMPONENT.resistorTwo.y + (20 / 41) * COMPONENT.resistorTwo.height,
  },

  r2Out: {
    x: COMPONENT.resistorTwo.x + (57 / 71) * COMPONENT.resistorTwo.width,
    y: COMPONENT.resistorTwo.y + (20 / 41) * COMPONENT.resistorTwo.height,
  },
} as const;

const LED_SYMBOL = {
  viewBoxWidth: 71,
  viewBoxHeight: 51,
  viewBoxMinX: -10,
  viewBoxMinY: -10,
} as const;

const LED_NODE = {
  rotationCenterX: COMPONENT.led.width / 2,
  rotationCenterY: COMPONENT.led.height / 2,

  leftTerminalX:
    ((0 - LED_SYMBOL.viewBoxMinX) / LED_SYMBOL.viewBoxWidth) *
    COMPONENT.led.width,

  rightTerminalX:
    ((50 - LED_SYMBOL.viewBoxMinX) / LED_SYMBOL.viewBoxWidth) *
    COMPONENT.led.width,

  terminalY:
    ((19.992 - LED_SYMBOL.viewBoxMinY) / LED_SYMBOL.viewBoxHeight) *
    COMPONENT.led.height,
} as const;

const NODE_LED = {
  branchX:
    COMPONENT.led.x +
    (LED_NODE.rotationCenterX -
      (LED_NODE.terminalY - LED_NODE.rotationCenterY)),

  topTerminalY:
    COMPONENT.led.y +
    (LED_NODE.rotationCenterY +
      (LED_NODE.leftTerminalX - LED_NODE.rotationCenterX)),

  bottomTerminalY:
    COMPONENT.led.y +
    (LED_NODE.rotationCenterY +
      (LED_NODE.rightTerminalX - LED_NODE.rotationCenterX)),
} as const;

const CIRCUIT_NODE = {
  batteryPositive: NODE.batteryPositive,
  leftTopBend: { x: NODE.leftWireX, y: NODE.batteryPositive.y },
  leftUpperRail: { x: NODE.leftWireX, y: NODE.resistorTerminalY },

  r1In: NODE.r1In,
  r1Out: NODE.r1Out,
  r2In: NODE.r2In,
  r2Out: NODE.r2Out,

  ledInput: { x: NODE_LED.branchX, y: NODE.resistorTerminalY },
  ledTop: { x: NODE_LED.branchX, y: NODE_LED.topTerminalY },
  ledBottom: { x: NODE_LED.branchX, y: NODE_LED.bottomTerminalY },

  bottomRailRight: { x: NODE_LED.branchX, y: NODE.bottomRailY },
  bottomRailLeft: { x: NODE.batteryPositive.x, y: NODE.bottomRailY },
  batteryNegative: NODE.batteryNegative,
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  batteryToR1: [
    CIRCUIT_NODE.batteryPositive,
    CIRCUIT_NODE.leftTopBend,
    CIRCUIT_NODE.leftUpperRail,
    CIRCUIT_NODE.r1In,
  ],

  r1ToR2: [CIRCUIT_NODE.r1Out, CIRCUIT_NODE.r2In],

  r2ToLed: [CIRCUIT_NODE.r2Out, CIRCUIT_NODE.ledInput, CIRCUIT_NODE.ledTop],

  returnPath: [
    CIRCUIT_NODE.ledBottom,
    CIRCUIT_NODE.bottomRailRight,
    CIRCUIT_NODE.bottomRailLeft,
    CIRCUIT_NODE.batteryNegative,
  ],
} as const;

const PATH = {
  chargeFlow: pathD([
    CIRCUIT_NODE.batteryPositive,
    CIRCUIT_NODE.leftTopBend,
    CIRCUIT_NODE.leftUpperRail,
    CIRCUIT_NODE.r1In,
    CIRCUIT_NODE.r1Out,
    CIRCUIT_NODE.r2In,
    CIRCUIT_NODE.r2Out,
    CIRCUIT_NODE.ledInput,
    CIRCUIT_NODE.ledTop,
    CIRCUIT_NODE.ledBottom,
    CIRCUIT_NODE.bottomRailRight,
    CIRCUIT_NODE.bottomRailLeft,
    CIRCUIT_NODE.batteryNegative,
  ]),
} as const;

const NODE_POINTS: Point[] = [
  CIRCUIT_NODE.batteryPositive,
  CIRCUIT_NODE.leftTopBend,
  CIRCUIT_NODE.leftUpperRail,
  CIRCUIT_NODE.r1In,
  CIRCUIT_NODE.r1Out,
  CIRCUIT_NODE.r2In,
  CIRCUIT_NODE.r2Out,
  CIRCUIT_NODE.ledInput,
  CIRCUIT_NODE.ledTop,
  CIRCUIT_NODE.ledBottom,
  CIRCUIT_NODE.bottomRailRight,
  CIRCUIT_NODE.bottomRailLeft,
  CIRCUIT_NODE.batteryNegative,
];

const LABEL = {
  title: { x: 70, y: 82 },
  subtitle: { x: 70, y: 110 },

  batteryVoltage: {
    x: NODE.batteryPositive.x + 20,
    y: COMPONENT.battery.y + 64,
  },

  r1: {
    x: COMPONENT.resistorOne.x + COMPONENT.resistorOne.width / 2,
    y: COMPONENT.resistorOne.y + 68,
  },

  r1Drop: {
    x: COMPONENT.resistorOne.x + COMPONENT.resistorOne.width / 2,
    y: COMPONENT.resistorOne.y + 84,
  },

  r2: {
    x: COMPONENT.resistorTwo.x + COMPONENT.resistorTwo.width / 2,
    y: COMPONENT.resistorTwo.y + 68,
  },

  r2Drop: {
    x: COMPONENT.resistorTwo.x + COMPONENT.resistorTwo.width / 2,
    y: COMPONENT.resistorTwo.y + 84,
  },

  led: { x: NODE_LED.branchX - 20, y: COMPONENT.led.y + 20 },
  ledDrop: { x: NODE_LED.branchX - 20, y: COMPONENT.led.y + 106 },

  voltagePush: { x: 224, y: 124 },
  chargeFlow: { x: 426, y: 296 },
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

function ResistorBlock({
  x,
  y,
  width,
  height,
  label,
  resistance,
  drop,
  labelPoint,
  dropPoint,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  resistance: number;
  drop: number;
  labelPoint: Point;
  dropPoint: Point;
}) {
  return (
    <g>
      <svg
        x={x}
        y={y}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        overflow="visible"
      >
        <ResistorSymbol width={width} height={height} label={label} />
      </svg>

      <text
        x={labelPoint.x}
        y={labelPoint.y}
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="#334155"
      >
        {label} {resistance.toFixed(1)} Ohm
      </text>

      <text
        x={dropPoint.x}
        y={dropPoint.y}
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

function LedBlock({
  current,
  glowOpacity,
  ledDrop,
}: {
  current: number;
  glowOpacity: number;
  ledDrop: number;
}) {
  return (
    <g>
      <svg
        x={COMPONENT.led.x}
        y={COMPONENT.led.y}
        width={COMPONENT.led.width}
        height={COMPONENT.led.height}
        viewBox={`0 0 ${COMPONENT.led.width} ${COMPONENT.led.height}`}
        overflow="visible"
        style={{ filter: current > 0.25 ? "url(#electricityGlow)" : "none" }}
      >
        <g
          transform={`translate(${COMPONENT.led.width / 2} ${
            COMPONENT.led.height / 2
          }) rotate(${COMPONENT.led.rotate}) translate(${
            -COMPONENT.led.width / 2
          } ${-COMPONENT.led.height / 2})`}
        >
          <LEDSymbol
            width={COMPONENT.led.width}
            height={COMPONENT.led.height}
            label="LED"
          />
        </g>
      </svg>

      <motion.circle
        cx={NODE_LED.branchX}
        cy={(NODE_LED.topTerminalY + NODE_LED.bottomTerminalY) / 2}
        r="14"
        fill={STYLE.ledGlow}
        animate={{
          opacity: [glowOpacity * 0.35, glowOpacity, glowOpacity * 0.35],
        }}
        transition={{ duration: 1.1, repeat: Infinity }}
      />

      <text
        x={LABEL.led.x}
        y={LABEL.led.y}
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill={STYLE.ledText}
      >
        LED
      </text>

      <text
        x={LABEL.ledDrop.x}
        y={LABEL.ledDrop.y}
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill={STYLE.flow}
      >
        Drop {ledDrop.toFixed(1)}V
      </text>
    </g>
  );
}

function ChargeParticles({ duration }: { duration: number }) {
  return (
    <g>
      {Array.from({ length: ELECTRON_COUNT }, (_, particle) => {
        const delay = particle * FLOW.stagger;

        return (
          <circle
            key={`charge-particle-${particle}-running`}
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
              path={PATH.chargeFlow}
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

export function SeriesCircuitBasicsCircuit({
  voltage,
  resistanceOne,
  resistanceTwo,
  current,
  dropOne,
  dropTwo,
  ledDrop,
  flowPercent,
  flowLevel,
}: SeriesCircuitBasicsCircuitProps) {
  const particleDuration = getElectronSpeed(flowPercent);
  const glowOpacity = current >= 1.5 ? 0.8 : current >= 0.8 ? 0.45 : 0.18;
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <svg
      viewBox={VIEW_BOX}
      className="h-[300px] w-full sm:h-[340px] md:h-[390px] lg:h-[430px]"
      role="img"
      aria-label="Series circuit basics"
    >
      <defs>
        <filter
          id="electricityGlow"
          x="-80%"
          y="-80%"
          width="260%"
          height="260%"
        >
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform={canvasTransform}>
        <text
          x={LABEL.title.x}
          y={LABEL.title.y}
          fontSize="22"
          fontWeight="800"
          fill={STYLE.text}
        >
          Series Circuit = One Current Path
        </text>

        <text
          x={LABEL.subtitle.x}
          y={LABEL.subtitle.y}
          fontSize="14"
          fill={STYLE.muted}
        >
          Same current flows through every load - Current = {current.toFixed(2)}
          A - Flow level: {flowLevel}
        </text>

        <BatteryBlock voltage={voltage} />

        <WirePath points={WIRE.batteryToR1} stroke={STYLE.positiveWire} />
        <WirePath points={WIRE.r1ToR2} stroke={STYLE.positiveWire} />
        <WirePath points={WIRE.r2ToLed} stroke={STYLE.positiveWire} />
        <WirePath points={WIRE.returnPath} stroke={STYLE.returnWire} />

        <NodeDots />

        <ResistorBlock
          x={COMPONENT.resistorOne.x}
          y={COMPONENT.resistorOne.y}
          width={COMPONENT.resistorOne.width}
          height={COMPONENT.resistorOne.height}
          label="R1"
          resistance={resistanceOne}
          drop={dropOne}
          labelPoint={LABEL.r1}
          dropPoint={LABEL.r1Drop}
        />

        <ResistorBlock
          x={COMPONENT.resistorTwo.x}
          y={COMPONENT.resistorTwo.y}
          width={COMPONENT.resistorTwo.width}
          height={COMPONENT.resistorTwo.height}
          label="R2"
          resistance={resistanceTwo}
          drop={dropTwo}
          labelPoint={LABEL.r2}
          dropPoint={LABEL.r2Drop}
        />

        <LedBlock
          current={current}
          glowOpacity={glowOpacity}
          ledDrop={ledDrop}
        />

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
          x={LABEL.chargeFlow.x}
          y={LABEL.chargeFlow.y}
          fontSize="14"
          fontWeight="700"
          fill={STYLE.flow}
        >
          Charge Flow →
        </text>

        <ChargeParticles duration={particleDuration} />

        <StrengthBar flowPercent={flowPercent} />
      </g>
    </svg>
  );
}
