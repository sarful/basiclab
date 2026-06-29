"use client";

import { motion } from "framer-motion";

import LEDSymbol from "@/src/library/electronics-symbol-library/diodes/LEDSymbol";
import ResistorSymbol from "@/src/library/electronics-symbol-library/passive/ResistorSymbol";
import BatterySymbol from "@/src/library/electronics-symbol-library/sources/BatterySymbol";

type Point = { x: number; y: number };

type ComponentBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
};

type CircuitSimulationProps = {
  voltage: number;
  current: number;
  resistance: number;
  voltagePercent: number;
  currentPercent: number;
  isPlaying: boolean;
};

const VIEW_BOX = "0 28 760 320";
const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 320;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  battery: 1,
  resistor: 1,
  led: 1,
  voltageBar: 1,
  currentBar: 1,
} as const;

const BASE_WIRE_WIDTH = 2.2;
const CIRCUIT_WIRE_SCALE = 1;

const ELECTRON_COUNT = 5;

const STYLE = {
  text: "#0f172a",
  muted: "#64748b",
  positiveWire: "#dc2626",
  returnWire: "#334155",
  flow: "#2563eb",
  nodeFill: "#f8fafc",
  nodeStroke: "#94a3b8",
  ledGlow: "#fde68a",
  ledText: "#16a34a",
} as const;

const FLOW = {
  radius: 3.6,
  stagger: 0.22,
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

function getParticleDuration(currentPercent: number) {
  return Math.max(0.6, 3 - currentPercent / 45);
}

function getSafePercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

const BASE_COMPONENT = {
  battery: { x: 86, y: 172, width: 102, height: 108, rotate: 0 },
  resistor: { x: 392, y: 98, width: 172, height: 86, rotate: 0 },
  led: { x: 602, y: 190, width: 124, height: 92, rotate: 90 },
  voltageBar: { x: 82, y: 334, width: 420, height: 8, rotate: 0 },
  currentBar: { x: 360, y: 334, width: 240, height: 8, rotate: 0 },
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
  led: scaleComponent(BASE_COMPONENT.led, CIRCUIT_COMPONENT_SCALE.led),
  voltageBar: scaleComponent(
    BASE_COMPONENT.voltageBar,
    CIRCUIT_COMPONENT_SCALE.voltageBar,
  ),
  currentBar: scaleComponent(
    BASE_COMPONENT.currentBar,
    CIRCUIT_COMPONENT_SCALE.currentBar,
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

  resistorInput: {
    x: COMPONENT.resistor.x + (15 / 71) * COMPONENT.resistor.width,
    y: COMPONENT.resistor.y + (20 / 41) * COMPONENT.resistor.height,
  },

  resistorOutput: {
    x: COMPONENT.resistor.x + (57 / 71) * COMPONENT.resistor.width,
    y: COMPONENT.resistor.y + (20 / 41) * COMPONENT.resistor.height,
  },

  ledCenter: pointOnComponent(COMPONENT.led, 0.5, 0.5),
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

  leftTopBend: {
    x: NODE.leftWireX,
    y: NODE.batteryPositive.y,
  },

  leftUpperRail: {
    x: NODE.leftWireX,
    y: NODE.resistorInput.y,
  },

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
    x: NODE.batteryPositive.x,
    y: NODE.bottomRailY,
  },

  batteryNegative: NODE.batteryNegative,
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  positiveInput: [
    CIRCUIT_NODE.batteryPositive,
    CIRCUIT_NODE.leftTopBend,
    CIRCUIT_NODE.leftUpperRail,
    CIRCUIT_NODE.resistorInput,
  ],

  positiveOutput: [
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
  title: { x: 70, y: 82 },
  subtitle: { x: 70, y: 110 },

  battery: {
    x: NODE.batteryPositive.x + 20,
    y: COMPONENT.battery.y + 64,
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
  currentFlow: { x: 426, y: 296 },

  voltageStrength: { x: 82, y: 360 },
  currentStrength: { x: 360, y: 360 },
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
          key={`voltage-current-node-${index}`}
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
        x={LABEL.battery.x}
        y={LABEL.battery.y}
        fontSize="14"
        fontWeight="700"
        fill={STYLE.positiveWire}
      >
        {voltage.toFixed(1)}V
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
  current,
  isPlaying,
  glowOpacity,
}: {
  current: number;
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
            label="Indicator LED"
          />
        </g>
      </svg>

      <motion.circle
        cx={NODE_LED.branchX}
        cy={(NODE_LED.topTerminalY + NODE_LED.bottomTerminalY) / 2}
        r="14"
        fill={STYLE.ledGlow}
        animate={{
          opacity: isPlaying
            ? [glowOpacity * 0.35, glowOpacity, glowOpacity * 0.35]
            : glowOpacity * 0.55,
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
    </g>
  );
}

function ChargeParticles({
  isPlaying,
  duration,
}: {
  isPlaying: boolean;
  duration: number;
}) {
  return (
    <g>
      {Array.from({ length: ELECTRON_COUNT }, (_, particle) => {
        const delay = particle * FLOW.stagger;

        return (
          <circle
            key={`charge-particle-${particle}-${isPlaying ? "running" : "paused"}`}
            r={FLOW.radius}
            fill={STYLE.flow}
            opacity={0}
          >
            {isPlaying && (
              <>
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
              </>
            )}
          </circle>
        );
      })}
    </g>
  );
}

function StrengthBars({
  voltagePercent,
  currentPercent,
}: {
  voltagePercent: number;
  currentPercent: number;
}) {
  const safeVoltagePercent = getSafePercent(voltagePercent);
  const safeCurrentPercent = getSafePercent(currentPercent);

  return (
    <g>
      <rect
        x={COMPONENT.voltageBar.x}
        y={COMPONENT.voltageBar.y}
        width={Math.max(16, safeVoltagePercent * 4.2)}
        height={COMPONENT.voltageBar.height}
        rx="4"
        fill={STYLE.positiveWire}
      />

      <text
        x={LABEL.voltageStrength.x}
        y={LABEL.voltageStrength.y}
        fontSize="13"
        fontWeight="700"
        fill={STYLE.positiveWire}
      >
        Voltage Strength: {Math.round(safeVoltagePercent)}%
      </text>

      <rect
        x={COMPONENT.currentBar.x}
        y={COMPONENT.currentBar.y}
        width={Math.max(16, safeCurrentPercent * 2.4)}
        height={COMPONENT.currentBar.height}
        rx="4"
        fill={STYLE.flow}
      />

      <text
        x={LABEL.currentStrength.x}
        y={LABEL.currentStrength.y}
        fontSize="13"
        fontWeight="700"
        fill={STYLE.flow}
      >
        Current Strength: {Math.round(safeCurrentPercent)}%
      </text>
    </g>
  );
}

export function CircuitSimulation({
  voltage,
  current,
  resistance,
  voltagePercent,
  currentPercent,
  isPlaying,
}: CircuitSimulationProps) {
  const particleDuration = getParticleDuration(currentPercent);
  const glowOpacity = current < 0.5 ? 0.25 : current < 2 ? 0.55 : 0.9;
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <svg
      viewBox={VIEW_BOX}
      className="h-[300px] w-full sm:h-[340px] md:h-[390px] lg:h-[430px]"
      role="img"
      aria-label="Voltage versus current circuit"
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
          Voltage Push vs Current Flow
        </text>

        <text
          x={LABEL.subtitle.x}
          y={LABEL.subtitle.y}
          fontSize="14"
          fill={STYLE.muted}
        >
          Voltage = {voltage.toFixed(1)}V - Current = {current.toFixed(2)}A -
          Resistance = {resistance.toFixed(1)} Ohm
        </text>

        <BatteryBlock voltage={voltage} />

        <WirePath points={WIRE.positiveInput} stroke={STYLE.positiveWire} />
        <WirePath points={WIRE.positiveOutput} stroke={STYLE.positiveWire} />
        <WirePath points={WIRE.returnPath} stroke={STYLE.returnWire} />

        <NodeDots />

        <ResistorBlock resistance={resistance} />

        <LedBlock
          current={current}
          isPlaying={isPlaying}
          glowOpacity={glowOpacity}
        />

        <text
          x={LABEL.voltagePush.x}
          y={LABEL.voltagePush.y}
          fontSize="14"
          fontWeight="700"
          fill={STYLE.positiveWire}
        >
          Voltage Push →
        </text>

        <text
          x={LABEL.currentFlow.x}
          y={LABEL.currentFlow.y}
          fontSize="14"
          fontWeight="700"
          fill={STYLE.flow}
        >
          Current Flow →
        </text>

        <ChargeParticles isPlaying={isPlaying} duration={particleDuration} />

        <StrengthBars
          voltagePercent={voltagePercent}
          currentPercent={currentPercent}
        />
      </g>
    </svg>
  );
}
