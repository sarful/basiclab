"use client";

import { motion } from "framer-motion";

import LEDSymbol from "@/src/library/electronics-symbol-library/diodes/LEDSymbol";
import ResistorSymbol from "@/src/library/electronics-symbol-library/passive/ResistorSymbol";
import ACVoltageSourceSymbol from "@/src/library/electronics-symbol-library/sources/ACVoltageSourceSymbol";

import {
  SVG_HEIGHT,
  SVG_WIDTH,
  calculateCurrent,
  createSinePath,
} from "./logic";
import { GraphBase, GraphLabels } from "./ui";

type AcCircuitProps = {
  peakVoltage: number;
  frequency: number;
  current: number;
  isPlaying: boolean;
};

type Point = { x: number; y: number };

type ComponentBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
};

const VIEW_BOX = "0 0 520 220";
const VIEW_BOX_WIDTH = 520;
const VIEW_BOX_HEIGHT = 220;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  source: 1,
  resistor: 1,
  led: 1,
} as const;

const BASE_WIRE_WIDTH = 2.4;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#111827",
  muted: "#64748b",
  positiveWire: "#dc2626",
  returnWire: "#111827",
  flow: "#dc2626",
  blue: "#2563eb",
  nodeFill: "#f8fafc",
  nodeStroke: "#94a3b8",
  ledGlow: "#fde68a",
  ledText: "#92400e",
} as const;

const FLOW = {
  radius: 5,
  count: 3,
  stagger: 0.35,
} as const;

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

function getAcDuration(frequency: number) {
  return Math.max(0.7, 2.6 - frequency / 2);
}

const BASE_COMPONENT = {
  source: { x: 84, y: 76, width: 52, height: 92, rotate: 0 },
  resistor: { x: 238, y: 56, width: 132, height: 72, rotate: 0 },
  led: { x: 398, y: 88, width: 92, height: 74, rotate: 90 },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  source: scaleComponent(BASE_COMPONENT.source, CIRCUIT_COMPONENT_SCALE.source),
  resistor: scaleComponent(
    BASE_COMPONENT.resistor,
    CIRCUIT_COMPONENT_SCALE.resistor,
  ),
  led: scaleComponent(BASE_COMPONENT.led, CIRCUIT_COMPONENT_SCALE.led),
} as const;

const NODE = {
  bottomRailY: 176,

  sourceTop: {
    x: COMPONENT.source.x + COMPONENT.source.width / 2,
    y: COMPONENT.source.y + (11 / 560) * COMPONENT.source.height,
  },

  sourceBottom: {
    x: COMPONENT.source.x + COMPONENT.source.width / 2,
    y: COMPONENT.source.y + (549 / 560) * COMPONENT.source.height,
  },

  resistorInput: {
    x: COMPONENT.resistor.x + (10 / 71) * COMPONENT.resistor.width,
    y: COMPONENT.resistor.y + (20 / 41) * COMPONENT.resistor.height,
  },

  resistorOutput: {
    x: COMPONENT.resistor.x + (60 / 71) * COMPONENT.resistor.width,
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
  sourceTop: NODE.sourceTop,
  sourceToRail: { x: NODE.sourceTop.x, y: NODE.resistorInput.y },

  resistorInput: NODE.resistorInput,
  resistorOutput: NODE.resistorOutput,

  ledInput: {
    x: NODE_LED.branchX,
    y: NODE.resistorInput.y,
  },

  ledTop: {
    x: NODE_LED.branchX,
    y: NODE_LED.topTerminalY,
  },

  ledBottom: {
    x: NODE_LED.branchX,
    y: NODE_LED.bottomTerminalY,
  },

  bottomRailRight: {
    x: NODE_LED.branchX,
    y: NODE.bottomRailY,
  },

  bottomRailLeft: {
    x: NODE.sourceTop.x,
    y: NODE.bottomRailY,
  },

  sourceBottom: NODE.sourceBottom,
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  sourceToResistor: [
    CIRCUIT_NODE.sourceTop,
    CIRCUIT_NODE.sourceToRail,
    CIRCUIT_NODE.resistorInput,
  ],

  resistorToLed: [
    CIRCUIT_NODE.resistorOutput,
    CIRCUIT_NODE.ledInput,
    CIRCUIT_NODE.ledTop,
  ],

  returnPath: [
    CIRCUIT_NODE.ledBottom,
    CIRCUIT_NODE.bottomRailRight,
    CIRCUIT_NODE.bottomRailLeft,
    CIRCUIT_NODE.sourceBottom,
  ],
} as const;

const PATH = {
  flow: pathD([
    CIRCUIT_NODE.sourceTop,
    CIRCUIT_NODE.sourceToRail,
    CIRCUIT_NODE.resistorInput,
    CIRCUIT_NODE.resistorOutput,
    CIRCUIT_NODE.ledInput,
    CIRCUIT_NODE.ledTop,
    CIRCUIT_NODE.ledBottom,
    CIRCUIT_NODE.bottomRailRight,
    CIRCUIT_NODE.bottomRailLeft,
    CIRCUIT_NODE.sourceBottom,
  ]),
} as const;

const NODE_POINTS: Point[] = [
  CIRCUIT_NODE.sourceTop,
  CIRCUIT_NODE.sourceToRail,
  CIRCUIT_NODE.resistorInput,
  CIRCUIT_NODE.resistorOutput,
  CIRCUIT_NODE.ledInput,
  CIRCUIT_NODE.ledTop,
  CIRCUIT_NODE.ledBottom,
  CIRCUIT_NODE.bottomRailRight,
  CIRCUIT_NODE.bottomRailLeft,
  CIRCUIT_NODE.sourceBottom,
];

const LABEL = {
  sourceLeftOne: { x: 42, y: 112 },
  sourceLeftTwo: { x: 42, y: 132 },

  sourceTop: {
    x: NODE.sourceTop.x,
    y: COMPONENT.source.y - 8,
  },

  resistor: {
    x: COMPONENT.resistor.x + COMPONENT.resistor.width / 2,
    y: COMPONENT.resistor.y - 10,
  },

  led: {
    x: NODE_LED.branchX,
    y: COMPONENT.led.y - 6,
  },

  peakVoltage: { x: 210, y: 62 },
  rmsCurrent: { x: 332, y: 194 },
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
      fill="none"
      stroke={stroke}
      strokeWidth={WIRE.width}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function NodeDots() {
  return (
    <g>
      {NODE_POINTS.map((point, index) => (
        <circle
          key={`acv-node-${index}`}
          cx={point.x}
          cy={point.y}
          r="2.4"
          fill={STYLE.nodeFill}
          stroke={STYLE.nodeStroke}
          strokeWidth="1.1"
        />
      ))}
    </g>
  );
}

function SourceBlock() {
  return (
    <g>
      <text
        x={LABEL.sourceLeftOne.x}
        y={LABEL.sourceLeftOne.y}
        fontSize="16"
        fontWeight="700"
        fill={STYLE.blue}
      >
        AC
      </text>

      <text
        x={LABEL.sourceLeftTwo.x}
        y={LABEL.sourceLeftTwo.y}
        fontSize="16"
        fontWeight="700"
        fill={STYLE.blue}
      >
        Source
      </text>

      <svg
        x={COMPONENT.source.x}
        y={COMPONENT.source.y}
        width={COMPONENT.source.width}
        height={COMPONENT.source.height}
        viewBox={`0 0 ${COMPONENT.source.width} ${COMPONENT.source.height}`}
        overflow="visible"
      >
        <ACVoltageSourceSymbol
          width={COMPONENT.source.width}
          height={COMPONENT.source.height}
          label="AC source"
        />
      </svg>

      <text
        x={LABEL.sourceTop.x}
        y={LABEL.sourceTop.y}
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill={STYLE.blue}
      >
        AC Source
      </text>
    </g>
  );
}

function ResistorBlock() {
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
        fontSize="15"
        fontWeight="700"
        fill={STYLE.text}
      >
        RESISTOR
      </text>
    </g>
  );
}

function LedBlock({
  current,
  frequency,
  isPlaying,
  glowOpacity,
}: {
  current: number;
  frequency: number;
  isPlaying: boolean;
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
        style={{ filter: current > 0.25 ? "url(#acVoltageLedGlow)" : "none" }}
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
            label="AC indicator LED"
          />
        </g>
      </svg>

      <motion.circle
        cx={NODE_LED.branchX}
        cy={(NODE_LED.topTerminalY + NODE_LED.bottomTerminalY) / 2}
        r="13"
        fill={STYLE.ledGlow}
        animate={{
          opacity: isPlaying
            ? [glowOpacity * 0.25, glowOpacity, glowOpacity * 0.25]
            : glowOpacity * 0.45,
        }}
        transition={{
          duration: Math.max(0.4, 1 / Math.max(frequency, 0.1)),
          repeat: Infinity,
        }}
      />

      <text
        x={LABEL.led.x}
        y={LABEL.led.y}
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill={STYLE.ledText}
      >
        LED
      </text>
    </g>
  );
}

function FlowParticles({
  isPlaying,
  duration,
}: {
  isPlaying: boolean;
  duration: number;
}) {
  return (
    <g>
      {Array.from({ length: FLOW.count }, (_, dot) => (
        <motion.circle
          key={`ac-voltage-flow-${dot}`}
          r={FLOW.radius}
          fill={STYLE.flow}
          animate={isPlaying ? { opacity: [0, 1, 1, 0] } : { opacity: 0.4 }}
          transition={{
            duration,
            repeat: Infinity,
            delay: dot * FLOW.stagger,
            ease: "linear",
          }}
        >
          {isPlaying && (
            <animateMotion
              dur={`${duration}s`}
              repeatCount="indefinite"
              begin={`${dot * FLOW.stagger}s`}
              path={PATH.flow}
            />
          )}
        </motion.circle>
      ))}
    </g>
  );
}

export function AcCircuit({
  peakVoltage,
  frequency,
  current,
  isPlaying,
}: AcCircuitProps) {
  const duration = getAcDuration(frequency);
  const glowOpacity = current < 0.5 ? 0.2 : current < 2 ? 0.55 : 0.9;
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <svg
      viewBox={VIEW_BOX}
      className="h-56 w-full"
      role="img"
      aria-label="AC voltage circuit"
    >
      <defs>
        <filter
          id="acVoltageLedGlow"
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
        <SourceBlock />

        <WirePath points={WIRE.sourceToResistor} stroke={STYLE.positiveWire} />
        <WirePath points={WIRE.resistorToLed} stroke={STYLE.positiveWire} />
        <WirePath points={WIRE.returnPath} stroke={STYLE.returnWire} />

        <NodeDots />

        <ResistorBlock />

        <LedBlock
          current={current}
          frequency={frequency}
          isPlaying={isPlaying}
          glowOpacity={glowOpacity}
        />

        <FlowParticles isPlaying={isPlaying} duration={duration} />

        <text
          x={LABEL.peakVoltage.x}
          y={LABEL.peakVoltage.y}
          fontSize="12"
          fontWeight="700"
          fill={STYLE.positiveWire}
        >
          Peak: {peakVoltage.toFixed(1)}V
        </text>

        <text
          x={LABEL.rmsCurrent.x}
          y={LABEL.rmsCurrent.y}
          fontSize="12"
          fontWeight="700"
          fill={STYLE.blue}
        >
          RMS Current: {current.toFixed(2)}A
        </text>
      </g>
    </svg>
  );
}

export function AcWaveform({
  peakVoltage,
  frequency,
  resistance,
}: {
  peakVoltage: number;
  frequency: number;
  resistance: number;
}) {
  const voltagePath = createSinePath(peakVoltage, frequency, 8);
  const currentPath = createSinePath(
    calculateCurrent(peakVoltage, resistance),
    frequency,
    38,
  );

  return (
    <svg
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      className="h-56 w-full"
      role="img"
      aria-label="AC waveform graph"
    >
      <GraphBase title="AC Waveform" />

      <path
        d={voltagePath}
        stroke={STYLE.positiveWire}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      <path
        d={currentPath}
        stroke={STYLE.blue}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      <GraphLabels />
    </svg>
  );
}
