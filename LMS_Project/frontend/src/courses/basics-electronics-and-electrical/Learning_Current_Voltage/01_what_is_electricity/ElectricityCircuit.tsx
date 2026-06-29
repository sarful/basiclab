"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

import LEDSymbol from "@/src/library/electronics-symbol-library/diodes/LEDSymbol";
import ResistorSymbol from "@/src/library/electronics-symbol-library/passive/ResistorSymbol";
import BatterySymbol from "@/src/library/electronics-symbol-library/sources/BatterySymbol";

import { ELECTRON_COUNT, getElectronSpeed } from "./logic";
import type { FlowLevel } from "./types";

type ElectricityCircuitProps = {
  voltage: number;
  resistance: number;
  current: number;
  flowPercent: number;
  flowLevel: FlowLevel;
  isPlaying: boolean;
};

const VIEW_BOX = "0 28 760 320";
const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 348;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  battery: 1,
  resistor: 1,
  led: 1,
  flowBar: 1,
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
  ledGlow: "#fde68a",
} as const;

const FLOW_STYLE = {
  radius: 3.6,
  stagger: 0.22,
} as const;

type Point = {
  x: number;
  y: number;
};

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
    .map((point, index) =>
      index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`,
    )
    .join(" ");
}

const BASE_COMPONENT = {
  battery: {
    x: 86,
    y: 172,
    width: 102,
    height: 108,
    rotate: 0,
  },

  resistor: {
    x: 392,
    y: 98,
    width: 172,
    height: 86,
    rotate: 0,
  },

  led: {
    x: 602,
    y: 190,
    width: 124,
    height: 92,
    rotate: 90,
  },

  flowBar: {
    x: 82,
    y: 334,
    width: 420,
    height: 8,
    rotate: 0,
  },
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
  flowBar: scaleComponent(
    BASE_COMPONENT.flowBar,
    CIRCUIT_COMPONENT_SCALE.flowBar,
  ),
} as const;

const NODE = {
  bottomRailY: 318,
  leftWireX: 138,

  batteryTerminalX: COMPONENT.battery.x + (81 / 160) * COMPONENT.battery.width,
  batteryTopTerminalY:
    COMPONENT.battery.y + (21 / 160) * COMPONENT.battery.height,
  batteryBottomTerminalY:
    COMPONENT.battery.y + (121 / 160) * COMPONENT.battery.height,

  resistorTerminal1X:
    COMPONENT.resistor.x + (15 / 71) * COMPONENT.resistor.width,
  resistorTerminal2X:
    COMPONENT.resistor.x + (57 / 71) * COMPONENT.resistor.width,
  resistorTerminalY:
    COMPONENT.resistor.y + (20 / 41) * COMPONENT.resistor.height,

  ledBranchX: 0,
  ledTopTerminalY: 0,
  ledBottomTerminalY: 0,
} as const;

const LED_LAYOUT = (() => {
  const ledViewBoxWidth = 71;
  const ledViewBoxHeight = 51;
  const ledViewBoxMinX = -10;
  const ledViewBoxMinY = -10;

  const rotationCenterX = COMPONENT.led.width / 2;
  const rotationCenterY = COMPONENT.led.height / 2;

  const leftTerminalX =
    ((0 - ledViewBoxMinX) / ledViewBoxWidth) * COMPONENT.led.width;
  const rightTerminalX =
    ((50 - ledViewBoxMinX) / ledViewBoxWidth) * COMPONENT.led.width;
  const terminalY =
    ((19.992 - ledViewBoxMinY) / ledViewBoxHeight) * COMPONENT.led.height;

  const branchX =
    COMPONENT.led.x + (rotationCenterX - (terminalY - rotationCenterY));
  const topTerminalY =
    COMPONENT.led.y + (rotationCenterY + (leftTerminalX - rotationCenterX));
  const bottomTerminalY =
    COMPONENT.led.y + (rotationCenterY + (rightTerminalX - rotationCenterX));

  return {
    branchX,
    topTerminalY,
    bottomTerminalY,
    centerX: branchX,
    centerY: (topTerminalY + bottomTerminalY) / 2,
    rotationCenterX,
    rotationCenterY,
  };
})();

const POINT = {
  batteryPositive: {
    x: NODE.batteryTerminalX,
    y: NODE.batteryTopTerminalY,
  },

  leftTopBend: {
    x: NODE.leftWireX,
    y: NODE.batteryTopTerminalY,
  },

  leftUpperRail: {
    x: NODE.leftWireX,
    y: NODE.resistorTerminalY,
  },

  resistorInput: {
    x: NODE.resistorTerminal1X,
    y: NODE.resistorTerminalY,
  },

  resistorOutput: {
    x: NODE.resistorTerminal2X,
    y: NODE.resistorTerminalY,
  },

  ledInput: {
    x: LED_LAYOUT.branchX,
    y: NODE.resistorTerminalY,
  },

  ledTop: {
    x: LED_LAYOUT.branchX,
    y: LED_LAYOUT.topTerminalY,
  },

  ledBottom: {
    x: LED_LAYOUT.branchX,
    y: LED_LAYOUT.bottomTerminalY,
  },

  bottomRailRight: {
    x: LED_LAYOUT.branchX,
    y: NODE.bottomRailY,
  },

  bottomRailLeft: {
    x: NODE.batteryTerminalX,
    y: NODE.bottomRailY,
  },

  batteryNegative: {
    x: NODE.batteryTerminalX,
    y: NODE.batteryBottomTerminalY,
  },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  positiveInput: [
    POINT.batteryPositive,
    POINT.leftTopBend,
    POINT.leftUpperRail,
    POINT.resistorInput,
  ],

  positiveOutput: [POINT.resistorOutput, POINT.ledInput, POINT.ledTop],

  returnPath: [
    POINT.ledBottom,
    POINT.bottomRailRight,
    POINT.bottomRailLeft,
    POINT.batteryNegative,
  ],
} as const;

const PATH = {
  chargeFlow: pathD([
    POINT.batteryPositive,
    POINT.leftTopBend,
    POINT.leftUpperRail,
    POINT.resistorInput,
    POINT.resistorOutput,
    POINT.ledInput,
    POINT.ledTop,
    POINT.ledBottom,
    POINT.bottomRailRight,
    POINT.bottomRailLeft,
    POINT.batteryNegative,
  ]),
} as const;

const LABEL = {
  title: { x: 70, y: 82 },
  subtitle: { x: 70, y: 110 },
  voltage: {
    x: NODE.batteryTerminalX + 20,
    y: COMPONENT.battery.y + 64,
  },
  resistor: {
    x: pointOnComponent(COMPONENT.resistor, 0.5, 0).x,
    y: COMPONENT.resistor.y + 70,
  },
  led: { x: LED_LAYOUT.centerX - 20, y: COMPONENT.led.y + 20 },
  voltagePush: { x: 224, y: 124 },
  chargeFlow: { x: 426, y: 296 },
  flowStrength: { x: COMPONENT.flowBar.x, y: 360 },
} as const;

const NODE_POINTS: Point[] = [
  POINT.batteryPositive,
  POINT.leftTopBend,
  POINT.leftUpperRail,
  POINT.resistorInput,
  POINT.resistorOutput,
  POINT.ledInput,
  POINT.ledTop,
  POINT.ledBottom,
  POINT.bottomRailRight,
  POINT.bottomRailLeft,
  POINT.batteryNegative,
];

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
        x={LABEL.voltage.x}
        y={LABEL.voltage.y}
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
  glowOpacity,
  effectivePlaying,
}: {
  current: number;
  glowOpacity: number;
  effectivePlaying: boolean;
}) {
  return (
    <g>
      <motion.circle
        cx={LED_LAYOUT.centerX}
        cy={LED_LAYOUT.centerY}
        r="14"
        fill={STYLE.ledGlow}
        animate={{
          opacity: effectivePlaying
            ? [glowOpacity * 0.25, glowOpacity * 0.75, glowOpacity * 0.25]
            : glowOpacity * 0.35,
        }}
        transition={{ duration: 1.1, repeat: Infinity }}
      />

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
          }) rotate(90) translate(${-COMPONENT.led.width / 2} ${
            -COMPONENT.led.height / 2
          })`}
        >
          <LEDSymbol
            width={COMPONENT.led.width}
            height={COMPONENT.led.height}
            label="LED"
          />
        </g>
      </svg>

      <text
        x={LABEL.led.x}
        y={LABEL.led.y}
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="#16a34a"
      >
        LED
      </text>
    </g>
  );
}

function ChargeParticles({
  effectivePlaying,
  particleDuration,
}: {
  effectivePlaying: boolean;
  particleDuration: number;
}) {
  return (
    <g>
      {Array.from({ length: ELECTRON_COUNT }, (_, particle) => {
        const delay = particle * FLOW_STYLE.stagger;

        return (
          <circle
            key={`charge-particle-${particle}-${effectivePlaying ? "running" : "paused"}`}
            r={FLOW_STYLE.radius}
            fill={STYLE.flow}
            opacity={0}
          >
            {effectivePlaying ? (
              <>
                <animate
                  attributeName="opacity"
                  values="0;0.88;0.88;0"
                  keyTimes="0;0.08;0.9;1"
                  dur={`${particleDuration}s`}
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
                <animateMotion
                  dur={`${particleDuration}s`}
                  repeatCount="indefinite"
                  begin={`${delay}s`}
                  path={PATH.chargeFlow}
                />
              </>
            ) : null}
          </circle>
        );
      })}
    </g>
  );
}

function FlowStrengthBar({ flowPercent }: { flowPercent: number }) {
  return (
    <g>
      <rect
        x={COMPONENT.flowBar.x}
        y={COMPONENT.flowBar.y}
        width={Math.max(16, flowPercent * 4.2)}
        height={COMPONENT.flowBar.height}
        rx="4"
        fill={STYLE.flow}
      />

      <text
        x={LABEL.flowStrength.x}
        y={LABEL.flowStrength.y}
        fontSize="13"
        fontWeight="700"
        fill={STYLE.flow}
      >
        Charge Flow Strength: {flowPercent}%
      </text>
    </g>
  );
}

export function ElectricityCircuit({
  voltage,
  resistance,
  current,
  flowPercent,
  flowLevel,
  isPlaying,
}: ElectricityCircuitProps) {
  const effectivePlaying = isPlaying;
  const particleDuration = getElectronSpeed(flowPercent);
  const glowOpacity = current < 0.5 ? 0.2 : current < 2 ? 0.55 : 0.9;

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  const wireSegments = useMemo(
    () => [
      { points: WIRE.positiveInput, stroke: STYLE.positiveWire },
      { points: WIRE.positiveOutput, stroke: STYLE.positiveWire },
      { points: WIRE.returnPath, stroke: STYLE.returnWire },
    ],
    [],
  );

  return (
    <svg
      viewBox={VIEW_BOX}
      className="h-[300px] w-full sm:h-[340px] md:h-[390px] lg:h-[430px]"
      role="img"
      aria-label="What is electricity circuit"
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
          Electricity = Moving Charge
        </text>

        <text
          x={LABEL.subtitle.x}
          y={LABEL.subtitle.y}
          fontSize="14"
          fill={STYLE.muted}
        >
          Voltage pushes charge - Resistance controls flow - Current ={" "}
          {current.toFixed(2)}A - Flow level: {flowLevel}
        </text>

        <BatteryBlock voltage={voltage} />

        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {wireSegments.map((segment, index) => (
            <WirePath
              key={`wire-segment-${index}`}
              points={segment.points}
              stroke={segment.stroke}
            />
          ))}
        </g>

        <NodeDots />

        <ResistorBlock resistance={resistance} />

        <LedBlock
          current={current}
          glowOpacity={glowOpacity}
          effectivePlaying={effectivePlaying}
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

        <ChargeParticles
          effectivePlaying={effectivePlaying}
          particleDuration={particleDuration}
        />

        <FlowStrengthBar flowPercent={flowPercent} />
      </g>
    </svg>
  );
}
