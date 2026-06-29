"use client";

import { motion } from "framer-motion";

import FlowDots from "./FlowDots";
import { clamp, formatNumber } from "./logic";
import PushButtonSymbol from "./PushButtonSymbol";
import type { SimulationResult, SwitchType } from "./types";

type LedSwitchSvgProps = {
  switchType: SwitchType;
  pressed: boolean;
  supplyVoltage: number;
  resistorOhm: number;
  electronFlowRate: number;
  result: SimulationResult;
};

const VIEW_BOX = "0 0 1100 560";
const VIEW_BOX_WIDTH = 1100;
const VIEW_BOX_HEIGHT = 560;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  battery: 1,
  switch: 1,
  resistor: 1,
  led: 1,
  statusPanel: 1,
} as const;

const BASE_WIRE_WIDTH = 6;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  wire: "#111827",
  active: "#2563eb",
  ledGlow: "#facc15",
  ledFill: "#fde68a",
  muted: "#64748b",
  safeBg: "#dcfce7",
  safeStroke: "#16a34a",
  safeText: "#166534",
  dangerBg: "#fee2e2",
  dangerStroke: "#dc2626",
  dangerText: "#991b1b",
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
  battery: {
    x: 78,
    y: 175,
    width: 64,
    height: 270,
    rotate: 0,
  },

  switch: {
    x: 400,
    y: 140,
    width: 132,
    height: 80,
    rotate: 0,
  },

  resistor: {
    x: 640,
    y: 145,
    width: 190,
    height: 70,
    rotate: 0,
  },

  led: {
    x: 885,
    y: 135,
    width: 125,
    height: 93,
    rotate: 0,
  },

  statusPanel: {
    x: 365,
    y: 445,
    width: 370,
    height: 72,
    rotate: 0,
  },
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
  statusPanel: scaleComponent(
    BASE_COMPONENT.statusPanel,
    CIRCUIT_COMPONENT_SCALE.statusPanel,
  ),
} as const;

const NODE = {
  batteryTop: { x: 110, y: 180 },
  batteryBottom: { x: 110, y: 445 },
  batteryPositive: { x: 110, y: 245 },
  batteryNegative: { x: 110, y: 290 },

  switchInput: { x: 400, y: 180 },
  switchOutput: { x: 532, y: 180 },

  resistorInput: { x: 640, y: 180 },
  resistorOutput: { x: 830, y: 180 },

  ledAnode: { x: 885, y: 180 },
  ledCathode: { x: 972, y: 180 },
  ledOutput: { x: 1010, y: 180 },
  ledReturnBottom: { x: 1010, y: 445 },

  statusCenter: pointOnComponent(COMPONENT.statusPanel, 0.5, 0.62),
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  batteryVertical: [NODE.batteryTop, NODE.batteryBottom],
  batteryToSwitch: [NODE.batteryTop, NODE.switchInput],
  switchToResistor: [NODE.switchOutput, NODE.resistorInput],
  resistorToLed: [NODE.resistorOutput, NODE.ledAnode],
  ledToRightReturn: [NODE.ledCathode, NODE.ledOutput, NODE.ledReturnBottom],
  bottomReturn: [NODE.ledReturnBottom, NODE.batteryBottom],
} as const;

const PATH = {
  flow: "M110 290 V445 H1010 V180 H972 L885 180 H830 M640 180 H532 M400 180 H110 V245",
} as const;

const LABEL = {
  title: { x: 550, y: 50 },
  voltage: { x: 64, y: 156 },
  plus: { x: 42, y: 236 },
  minus: { x: 48, y: 314 },
  resistor: { x: 690, y: 130 },
  ledStatus: { x: 894, y: 295 },
} as const;

function WirePath({ points }: { points: readonly Point[] }) {
  return (
    <path
      d={pathD(points)}
      fill="none"
      stroke={STYLE.wire}
      strokeWidth={WIRE.width}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function BatteryBlock({ supplyVoltage }: { supplyVoltage: number }) {
  return (
    <g>
      <WirePath points={WIRE.batteryVertical} />

      <line
        x1="78"
        y1="245"
        x2="142"
        y2="245"
        stroke={STYLE.wire}
        strokeWidth="9"
      />

      <line
        x1="88"
        y1="290"
        x2="132"
        y2="290"
        stroke={STYLE.wire}
        strokeWidth="6"
      />

      <text
        x={LABEL.plus.x}
        y={LABEL.plus.y}
        fontSize="44"
        fontWeight="900"
        fontFamily="Arial"
        fill={STYLE.wire}
      >
        +
      </text>

      <text
        x={LABEL.minus.x}
        y={LABEL.minus.y}
        fontSize="44"
        fontWeight="900"
        fontFamily="Arial"
        fill={STYLE.wire}
      >
        -
      </text>

      <text
        x={LABEL.voltage.x}
        y={LABEL.voltage.y}
        fontSize="30"
        fontWeight="900"
        fontFamily="Arial"
        fill={STYLE.active}
      >
        {formatNumber(supplyVoltage, 1)}V
      </text>
    </g>
  );
}

function LoadResistor({ resistorOhm }: { resistorOhm: number }) {
  return (
    <g>
      <polyline
        points="640,180 660,145 690,215 720,145 750,215 780,145 810,215 830,180"
        fill="none"
        stroke={STYLE.wire}
        strokeWidth={WIRE.width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <text
        x={LABEL.resistor.x}
        y={LABEL.resistor.y}
        fontSize="26"
        fontWeight="900"
        fontFamily="Arial"
        fill={STYLE.text}
      >
        {resistorOhm} Ohm
      </text>
    </g>
  );
}

function LedSymbolBlock({ ledOn }: { ledOn: boolean }) {
  return (
    <g>
      <motion.circle
        cx="925"
        cy="180"
        r="72"
        fill={STYLE.ledGlow}
        initial={{ opacity: 0 }}
        animate={{ opacity: ledOn ? [0.1, 0.34, 0.1] : 0 }}
        transition={{ duration: 1.1, repeat: Infinity }}
      />

      <polygon
        points="885,135 965,180 885,225"
        fill={ledOn ? STYLE.ledFill : "none"}
        stroke={STYLE.wire}
        strokeWidth="6"
        strokeLinejoin="round"
      />

      <line
        x1="972"
        y1="150"
        x2="972"
        y2="228"
        stroke={STYLE.wire}
        strokeWidth="6"
      />

      <text
        x={LABEL.ledStatus.x}
        y={LABEL.ledStatus.y}
        fontSize="30"
        fontWeight="900"
        fontFamily="Arial"
        fill={ledOn ? "#f59e0b" : STYLE.muted}
      >
        LED {ledOn ? "ON" : "OFF"}
      </text>
    </g>
  );
}

function StatusPanel({ circuitClosed }: { circuitClosed: boolean }) {
  return (
    <g>
      <rect
        x={COMPONENT.statusPanel.x}
        y={COMPONENT.statusPanel.y}
        width={COMPONENT.statusPanel.width}
        height={COMPONENT.statusPanel.height}
        rx="22"
        fill={circuitClosed ? STYLE.safeBg : STYLE.dangerBg}
        stroke={circuitClosed ? STYLE.safeStroke : STYLE.dangerStroke}
        strokeWidth="3"
      />

      <text
        x={NODE.statusCenter.x}
        y={NODE.statusCenter.y}
        textAnchor="middle"
        fontSize="28"
        fontWeight="900"
        fontFamily="Arial"
        fill={circuitClosed ? STYLE.safeText : STYLE.dangerText}
      >
        Circuit {circuitClosed ? "CLOSED" : "OPEN"}
      </text>
    </g>
  );
}

export default function LedSwitchSvg({
  switchType,
  pressed,
  supplyVoltage,
  resistorOhm,
  electronFlowRate,
  result,
}: LedSwitchSvgProps) {
  const flowDuration = clamp(3.4 - electronFlowRate * 0.028, 0.55, 3.4);
  const flowCount = Math.round(clamp(6 + electronFlowRate * 0.28, 8, 34));
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <svg
      viewBox={VIEW_BOX}
      className="h-auto w-full bg-white"
      shapeRendering="geometricPrecision"
      role="img"
      aria-label="LED pushbutton switch circuit"
    >
      <rect width="1100" height="560" fill="#ffffff" />

      <g transform={canvasTransform}>
        <text
          x={LABEL.title.x}
          y={LABEL.title.y}
          textAnchor="middle"
          fontSize="34"
          fontWeight="900"
          fontFamily="Arial"
          fill={STYLE.text}
        >
          LED Switch Circuit - NO / NC Pushbutton
        </text>

        <BatteryBlock supplyVoltage={supplyVoltage} />

        <WirePath points={WIRE.batteryToSwitch} />

        <PushButtonSymbol switchType={switchType} pressed={pressed} />

        <WirePath points={WIRE.switchToResistor} />

        <LoadResistor resistorOhm={resistorOhm} />

        <WirePath points={WIRE.resistorToLed} />

        <LedSymbolBlock ledOn={result.ledOn} />

        <WirePath points={WIRE.ledToRightReturn} />
        <WirePath points={WIRE.bottomReturn} />

        <FlowDots
          path={PATH.flow}
          active={result.circuitClosed}
          color={STYLE.active}
          count={flowCount}
          duration={flowDuration}
          reverse={false}
        />

        <StatusPanel circuitClosed={result.circuitClosed} />
      </g>
    </svg>
  );
}
