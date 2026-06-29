"use client";

import { motion } from "framer-motion";

import LEDSymbol from "@/src/library/electronics-symbol-library/diodes/LEDSymbol";
import ResistorSymbol from "@/src/library/electronics-symbol-library/passive/ResistorSymbol";
import ACVoltageSourceSymbol from "@/src/library/electronics-symbol-library/sources/ACVoltageSourceSymbol";

import { SVG_HEIGHT, SVG_WIDTH, createSinePath } from "./logic";
import { GraphBase } from "./ui";

type AcCurrentCircuitProps = {
  peakCurrent: number;
  frequency: number;
  isPlaying: boolean;
};

const VIEW_BOX = "0 28 760 320";
const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 320;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  source: 1,
  resistor: 1,
  led: 1,
  strengthBar: 1,
} as const;

const BASE_WIRE_WIDTH = 2.2;
const CIRCUIT_WIRE_SCALE = 1;

const ELECTRON_COUNT = 4;

const STYLE = {
  text: "#0f172a",
  muted: "#64748b",
  positiveWire: "#2563eb",
  returnWire: "#334155",
  flow: "#2563eb",
  nodeFill: "#f8fafc",
  nodeStroke: "#94a3b8",
  ledText: "#2563eb",
  ledGlow: "#bfdbfe",
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

function getAcParticleDuration(frequency: number) {
  return Math.max(0.55, 2.2 - frequency / 2);
}

const BASE_COMPONENT = {
  source: { x: 86, y: 172, width: 102, height: 108, rotate: 0 },
  resistor: { x: 392, y: 98, width: 172, height: 86, rotate: 0 },
  led: { x: 602, y: 190, width: 124, height: 92, rotate: 90 },
  strengthBar: { x: 82, y: 334, width: 420, height: 8, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  source: scaleComponent(BASE_COMPONENT.source, CIRCUIT_COMPONENT_SCALE.source),
  resistor: scaleComponent(
    BASE_COMPONENT.resistor,
    CIRCUIT_COMPONENT_SCALE.resistor,
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

  sourceTop: {
    x: COMPONENT.source.x + COMPONENT.source.width / 2,
    y: COMPONENT.source.y + 18,
  },

  sourceBottom: {
    x: COMPONENT.source.x + COMPONENT.source.width / 2,
    y: COMPONENT.source.y + COMPONENT.source.height - 18,
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
  sourceTop: NODE.sourceTop,

  leftTopBend: {
    x: NODE.leftWireX,
    y: NODE.sourceTop.y,
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
    x: NODE.sourceTop.x,
    y: NODE.bottomRailY,
  },

  sourceBottom: NODE.sourceBottom,
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  supplyToResistor: [
    CIRCUIT_NODE.sourceTop,
    CIRCUIT_NODE.leftTopBend,
    CIRCUIT_NODE.leftUpperRail,
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
  forwardFlow: pathD([
    CIRCUIT_NODE.sourceTop,
    CIRCUIT_NODE.leftTopBend,
    CIRCUIT_NODE.leftUpperRail,
    CIRCUIT_NODE.resistorInput,
    CIRCUIT_NODE.resistorOutput,
    CIRCUIT_NODE.ledInput,
    CIRCUIT_NODE.ledTop,
    CIRCUIT_NODE.ledBottom,
    CIRCUIT_NODE.bottomRailRight,
    CIRCUIT_NODE.bottomRailLeft,
    CIRCUIT_NODE.sourceBottom,
  ]),

  reverseFlow: pathD([
    CIRCUIT_NODE.sourceBottom,
    CIRCUIT_NODE.bottomRailLeft,
    CIRCUIT_NODE.bottomRailRight,
    CIRCUIT_NODE.ledBottom,
    CIRCUIT_NODE.ledTop,
    CIRCUIT_NODE.ledInput,
    CIRCUIT_NODE.resistorOutput,
    CIRCUIT_NODE.resistorInput,
    CIRCUIT_NODE.leftUpperRail,
    CIRCUIT_NODE.leftTopBend,
    CIRCUIT_NODE.sourceTop,
  ]),
} as const;

const NODE_POINTS: Point[] = [
  CIRCUIT_NODE.sourceTop,
  CIRCUIT_NODE.leftTopBend,
  CIRCUIT_NODE.leftUpperRail,
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
  title: { x: 70, y: 82 },
  subtitle: { x: 70, y: 110 },

  source: {
    x: NODE.sourceTop.x + 20,
    y: COMPONENT.source.y + 64,
  },

  resistor: {
    x: COMPONENT.resistor.x + COMPONENT.resistor.width / 2,
    y: COMPONENT.resistor.y + 70,
  },

  led: {
    x: NODE_LED.branchX - 20,
    y: COMPONENT.led.y + 20,
  },

  forward: { x: 224, y: 124 },
  reverse: { x: 426, y: 296 },
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
          key={`ac-node-dot-${index}`}
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

function SourceBlock() {
  return (
    <g>
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
        x={LABEL.source.x}
        y={LABEL.source.y}
        fontSize="14"
        fontWeight="700"
        fill={STYLE.flow}
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
        fontSize="16"
        fontWeight="700"
        fill="#334155"
      >
        RESISTOR
      </text>
    </g>
  );
}

function LedBlock({
  peakCurrent,
  frequency,
  isPlaying,
  glowOpacity,
}: {
  peakCurrent: number;
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
        style={{
          filter: peakCurrent > 0.25 ? "url(#electricityGlow)" : "none",
        }}
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
        r="14"
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
        fontSize="14"
        fontWeight="700"
        fill={STYLE.ledText}
      >
        LED
      </text>
    </g>
  );
}

function AcParticles({
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
        const useReverse = particle % 2 === 1;

        return (
          <circle
            key={`ac-current-particle-${particle}-${
              isPlaying ? "running" : "paused"
            }`}
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
                  path={useReverse ? PATH.reverseFlow : PATH.forwardFlow}
                />
              </>
            )}
          </circle>
        );
      })}
    </g>
  );
}

function StrengthBar({ peakCurrent }: { peakCurrent: number }) {
  const percent = Math.min(100, Math.max(0, peakCurrent * 30));

  return (
    <g>
      <rect
        x={COMPONENT.strengthBar.x}
        y={COMPONENT.strengthBar.y}
        width={Math.max(16, percent * 4.2)}
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
        Peak Current: {peakCurrent.toFixed(2)}A
      </text>
    </g>
  );
}

export function AcCurrentCircuit({
  peakCurrent,
  frequency,
  isPlaying,
}: AcCurrentCircuitProps) {
  const duration = getAcParticleDuration(frequency);

  const glowOpacity = peakCurrent < 0.8 ? 0.2 : peakCurrent < 2.5 ? 0.55 : 0.88;

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <svg
      viewBox={VIEW_BOX}
      className="h-[300px] w-full sm:h-[340px] md:h-[390px] lg:h-[430px]"
      role="img"
      aria-label="AC current circuit"
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
          AC Current = Direction Changes
        </text>

        <text
          x={LABEL.subtitle.x}
          y={LABEL.subtitle.y}
          fontSize="14"
          fill={STYLE.muted}
        >
          Current alternates forward and backward - Peak current ={" "}
          {peakCurrent.toFixed(2)}A - Frequency = {frequency.toFixed(1)}Hz
        </text>

        <SourceBlock />

        <WirePath points={WIRE.supplyToResistor} stroke={STYLE.positiveWire} />
        <WirePath points={WIRE.resistorToLed} stroke={STYLE.positiveWire} />
        <WirePath points={WIRE.returnPath} stroke={STYLE.returnWire} />

        <NodeDots />

        <ResistorBlock />

        <LedBlock
          peakCurrent={peakCurrent}
          frequency={frequency}
          isPlaying={isPlaying}
          glowOpacity={glowOpacity}
        />

        <text
          x={LABEL.forward.x}
          y={LABEL.forward.y}
          fontSize="14"
          fontWeight="700"
          fill={STYLE.flow}
        >
          Forward →
        </text>

        <text
          x={LABEL.reverse.x}
          y={LABEL.reverse.y}
          fontSize="14"
          fontWeight="700"
          fill={STYLE.flow}
        >
          ← Reverse
        </text>

        <AcParticles isPlaying={isPlaying} duration={duration} />

        <StrengthBar peakCurrent={peakCurrent} />
      </g>
    </svg>
  );
}

export function AcCurrentWaveform({
  peakCurrent,
  frequency,
}: {
  peakCurrent: number;
  frequency: number;
}) {
  const path = createSinePath(peakCurrent, frequency, 18);

  return (
    <svg
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      className="h-56 w-full"
      role="img"
      aria-label="AC current waveform"
    >
      <GraphBase title="AC Current Waveform" />

      <path
        d={path}
        stroke={STYLE.flow}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      <text x="74" y="48" fontSize="12" fontWeight="700" fill={STYLE.flow}>
        Current (I)
      </text>
    </svg>
  );
}
