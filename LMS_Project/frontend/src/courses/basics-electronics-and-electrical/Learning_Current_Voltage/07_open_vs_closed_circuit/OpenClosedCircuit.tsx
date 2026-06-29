"use client";

import { motion } from "framer-motion";

import PushButtonNO from "@/src/library/buttons/PushButtonNO";
import LEDSymbol from "@/src/library/electronics-symbol-library/diodes/LEDSymbol";
import ResistorSymbol from "@/src/library/electronics-symbol-library/passive/ResistorSymbol";
import BatterySymbol from "@/src/library/electronics-symbol-library/sources/BatterySymbol";

import type { CircuitState } from "./types";

type OpenClosedCircuitProps = {
  circuitState: CircuitState;
  voltage: number;
  resistance: number;
  current: number;
};

const VIEW_BOX = "0 28 760 320";
const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 320;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  battery: 1,
  switch: 1,
  resistor: 1,
  led: 1,
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
  openWire: "#f59e0b",
  inactiveWire: "#94a3b8",
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
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

function getElectronDuration(current: number) {
  return Math.max(0.9, 4.2 - current);
}

const BASE_COMPONENT = {
  battery: { x: 86, y: 172, width: 102, height: 108, rotate: 0 },
  switch: { x: 210, y: 128, width: 67.5, height: 34, rotate: 0 },
  resistor: { x: 392, y: 98, width: 172, height: 86, rotate: 0 },
  led: { x: 602, y: 190, width: 124, height: 92, rotate: 90 },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  battery: scaleComponent(
    BASE_COMPONENT.battery,
    CIRCUIT_COMPONENT_SCALE.battery,
  ),
  switch: scaleComponent(BASE_COMPONENT.switch, CIRCUIT_COMPONENT_SCALE.switch),
  resistor: scaleComponent(
    BASE_COMPONENT.resistor,
    CIRCUIT_COMPONENT_SCALE.resistor,
  ),
  led: scaleComponent(BASE_COMPONENT.led, CIRCUIT_COMPONENT_SCALE.led),
} as const;

const SWITCH_STYLE = {
  scale: COMPONENT.switch.width / 50,
  wireStroke: 1.4,
  strokeColor: "#374151",
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

  switchInput: {
    x: COMPONENT.switch.x,
    y: COMPONENT.switch.y + 10 * SWITCH_STYLE.scale,
  },

  switchOutput: {
    x: COMPONENT.switch.x + 50 * SWITCH_STYLE.scale,
    y: COMPONENT.switch.y + 10 * SWITCH_STYLE.scale,
  },

  resistorInput: {
    x: COMPONENT.resistor.x + (15 / 71) * COMPONENT.resistor.width,
    y: COMPONENT.resistor.y + (20 / 41) * COMPONENT.resistor.height,
  },

  resistorOutput: {
    x: COMPONENT.resistor.x + (57 / 71) * COMPONENT.resistor.width,
    y: COMPONENT.resistor.y + (20 / 41) * COMPONENT.resistor.height,
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
  leftUpperRail: { x: NODE.leftWireX, y: NODE.switchInput.y },
  switchInput: NODE.switchInput,
  switchOutput: NODE.switchOutput,
  resistorInput: NODE.resistorInput,
  resistorOutput: NODE.resistorOutput,
  ledInput: { x: NODE_LED.branchX, y: NODE.resistorInput.y },
  ledTop: { x: NODE_LED.branchX, y: NODE_LED.topTerminalY },
  ledBottom: { x: NODE_LED.branchX, y: NODE_LED.bottomTerminalY },
  bottomRailRight: { x: NODE_LED.branchX, y: NODE.bottomRailY },
  bottomRailLeft: { x: NODE.batteryPositive.x, y: NODE.bottomRailY },
  batteryNegative: NODE.batteryNegative,
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  batteryToSwitch: [
    CIRCUIT_NODE.batteryPositive,
    CIRCUIT_NODE.leftTopBend,
    CIRCUIT_NODE.leftUpperRail,
    CIRCUIT_NODE.switchInput,
  ],

  switchToResistor: [CIRCUIT_NODE.switchOutput, CIRCUIT_NODE.resistorInput],

  resistorToLed: [
    CIRCUIT_NODE.resistorOutput,
    CIRCUIT_NODE.ledInput,
    CIRCUIT_NODE.ledTop,
  ],

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
    CIRCUIT_NODE.switchInput,
    CIRCUIT_NODE.switchOutput,
    CIRCUIT_NODE.resistorInput,
    CIRCUIT_NODE.resistorOutput,
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
  CIRCUIT_NODE.switchInput,
  CIRCUIT_NODE.switchOutput,
  CIRCUIT_NODE.resistorInput,
  CIRCUIT_NODE.resistorOutput,
  CIRCUIT_NODE.ledInput,
  CIRCUIT_NODE.ledTop,
  CIRCUIT_NODE.ledBottom,
  CIRCUIT_NODE.bottomRailRight,
  CIRCUIT_NODE.bottomRailLeft,
  CIRCUIT_NODE.batteryNegative,
];

const LABEL = {
  title: { x: 60, y: 70 },
  subtitle: { x: 70, y: 90 },

  batteryVoltage: {
    x: NODE.batteryPositive.x + 20,
    y: COMPONENT.battery.y + 64,
  },

  switch: {
    x: COMPONENT.switch.x + 25 * SWITCH_STYLE.scale,
    y: COMPONENT.switch.y + 35,
  },

  resistor: {
    x: COMPONENT.resistor.x + COMPONENT.resistor.width / 2,
    y: COMPONENT.resistor.y + 70,
  },

  led: {
    x: NODE_LED.branchX - 20,
    y: COMPONENT.led.y + 20,
  },

  voltagePush: { x: 224, y: 124 },
  chargeFlow: { x: 426, y: 296 },
} as const;

function WirePath({
  points,
  stroke,
  dashed = false,
}: {
  points: readonly Point[];
  stroke: string;
  dashed?: boolean;
}) {
  return (
    <path
      d={pathD(points)}
      stroke={stroke}
      strokeWidth={WIRE.width}
      strokeDasharray={dashed ? "7 7" : undefined}
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

function SwitchBlock({ isClosed }: { isClosed: boolean }) {
  return (
    <g>
      <PushButtonNO
        x={COMPONENT.switch.x}
        y={COMPONENT.switch.y}
        scale={SWITCH_STYLE.scale}
        pressed={isClosed}
        standalone={false}
        showTerminals={false}
        wireStroke={SWITCH_STYLE.wireStroke}
        strokeColor={SWITCH_STYLE.strokeColor}
      />

      <text
        x={LABEL.switch.x}
        y={LABEL.switch.y}
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill={isClosed ? "#16a34a" : "#d97706"}
      >
        {isClosed ? "Switch Closed" : "Switch Open"}
      </text>
    </g>
  );
}

function ResistorBlock({ resistance }: { resistance: number }) {
  return (
    <g>
      <svg
        x={COMPONENT.resistor.x}
        y={COMPONENT.resistor.y}
        width={COMPONENT.resistor.width}
        height={COMPONENT.resistor.height}
        viewBox={`0 0 ${COMPONENT.resistor.width} ${COMPONENT.resistor.height}`}
        overflow="visible"
      >
        <ResistorSymbol
          width={COMPONENT.resistor.width}
          height={COMPONENT.resistor.height}
          label="Series resistor"
        />
      </svg>

      <text
        x={LABEL.resistor.x}
        y={LABEL.resistor.y}
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fill="#334155"
      >
        RESISTOR {resistance.toFixed(1)} Ohm
      </text>
    </g>
  );
}

function LedBlock({
  isClosed,
  glowOpacity,
}: {
  isClosed: boolean;
  glowOpacity: number;
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
        style={{ filter: isClosed ? "url(#electricityGlow)" : "none" }}
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
          opacity: isClosed
            ? [glowOpacity * 0.35, glowOpacity, glowOpacity * 0.35]
            : glowOpacity,
        }}
        transition={{
          duration: 1.1,
          repeat: isClosed ? Infinity : 0,
        }}
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
    </g>
  );
}

function ChargeParticles({
  isClosed,
  duration,
}: {
  isClosed: boolean;
  duration: number;
}) {
  if (!isClosed) return null;

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

export function OpenClosedCircuit({
  circuitState,
  voltage,
  resistance,
  current,
}: OpenClosedCircuitProps) {
  const isClosed = circuitState === "closed";
  const shownCurrent = isClosed ? current : 0;
  const particleDuration = getElectronDuration(shownCurrent);

  const glowOpacity = !isClosed
    ? 0.08
    : current < 0.5
      ? 0.2
      : current < 1.5
        ? 0.45
        : 0.85;

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <svg
      viewBox={VIEW_BOX}
      className="h-[300px] w-full sm:h-[340px] md:h-[390px] lg:h-[430px]"
      role="img"
      aria-label="Open and closed circuit"
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
          {isClosed
            ? "Closed Circuit = Complete Path"
            : "Open Circuit = Broken Path"}
        </text>

        <text
          x={LABEL.subtitle.x}
          y={LABEL.subtitle.y}
          fontSize="14"
          fill={STYLE.muted}
        >
          Voltage pushes charge - Switch controls path - Current ={" "}
          {shownCurrent.toFixed(2)}A - State: {isClosed ? "Closed" : "Open"}
        </text>

        <BatteryBlock voltage={voltage} />

        <WirePath points={WIRE.batteryToSwitch} stroke={STYLE.positiveWire} />
        <WirePath
          points={WIRE.switchToResistor}
          stroke={isClosed ? STYLE.positiveWire : STYLE.openWire}
          dashed={!isClosed}
        />
        <WirePath
          points={WIRE.resistorToLed}
          stroke={isClosed ? STYLE.positiveWire : STYLE.inactiveWire}
        />
        <WirePath points={WIRE.returnPath} stroke={STYLE.returnWire} />

        <SwitchBlock isClosed={isClosed} />

        <NodeDots />

        <ResistorBlock resistance={resistance} />

        <LedBlock isClosed={isClosed} glowOpacity={glowOpacity} />

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

        <ChargeParticles isClosed={isClosed} duration={particleDuration} />
      </g>
    </svg>
  );
}
