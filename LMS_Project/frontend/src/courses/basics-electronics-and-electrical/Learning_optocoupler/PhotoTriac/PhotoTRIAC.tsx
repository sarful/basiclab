"use client";

import type { CSSProperties, Dispatch, SetStateAction } from "react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

/* ---------------------------------------------
   Types
--------------------------------------------- */

type IsolationMode = "Low" | "Medium" | "High";

type SimulationResult = {
  ledCurrent: number;
  triggerCurrent: number;
  transferPercent: number;
  isolationVoltage: number;
  status: "ON" | "OFF";
};

type Point = {
  x: number;
  y: number;
};

type Offset = {
  x: number;
  y: number;
};

type PhotoTriacCircuitControlPanelProps = {
  initialEnabled?: boolean;
  initialInputVoltage?: number;
  initialIsolation?: IsolationMode;
  showControls?: boolean;
  showCurrentDots?: boolean;
  showDebugTerminals?: boolean;
  showFlowDebugPaths?: boolean;
  className?: string;
};

type PilotLightProps = {
  x?: number;
  y?: number;
  scale?: number;
  rotate?: number;
  on?: boolean;
  label?: string;
  className?: string;
  standalone?: boolean;
  strokeColor?: string;
  fillColor?: string;
  wireStroke?: number;
  textSize?: number;
};

/* ---------------------------------------------
   Utility helpers
--------------------------------------------- */

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value: number, digits = 2) {
  return Number(value.toFixed(digits)).toString();
}

function addPoint(point: Point, offset: Offset): Point {
  return {
    x: point.x + offset.x,
    y: point.y + offset.y,
  };
}

function offsetPoints(points: readonly Point[], offset: Offset): Point[] {
  return points.map((point) => addPoint(point, offset));
}

function pathD(points: readonly Point[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

/* ---------------------------------------------
   Simulation logic
--------------------------------------------- */

function calculatePhotoTriacSimulation({
  enabled,
  inputVoltage,
  isolation,
}: {
  enabled: boolean;
  inputVoltage: number;
  isolation: IsolationMode;
}): SimulationResult {
  const ledForwardVoltage = 1.2;
  const inputResistanceOhm = 330;
  const transferPercentReference = 80;
  const photoTriacFactor = 0.72;

  const ledCurrent = enabled
    ? clamp(
        ((inputVoltage - ledForwardVoltage) / inputResistanceOhm) * 1000,
        0,
        30,
      )
    : 0;

  const triggerCurrent =
    ledCurrent > 0
      ? clamp(
          (ledCurrent * transferPercentReference * photoTriacFactor) / 100,
          0,
          35,
        )
      : 0;

  const transferPercent =
    ledCurrent > 0 ? clamp((triggerCurrent / ledCurrent) * 100, 0, 150) : 0;

  const isolationVoltage =
    isolation === "High" ? 5000 : isolation === "Medium" ? 2500 : 1000;

  const status = enabled && ledCurrent > 1 ? "ON" : "OFF";

  return {
    ledCurrent,
    triggerCurrent,
    transferPercent,
    isolationVoltage,
    status,
  };
}

function runSelfTests() {
  const disabled = calculatePhotoTriacSimulation({
    enabled: false,
    inputVoltage: 5,
    isolation: "Medium",
  });

  const active = calculatePhotoTriacSimulation({
    enabled: true,
    inputVoltage: 5,
    isolation: "Medium",
  });

  const highIsolation = calculatePhotoTriacSimulation({
    enabled: true,
    inputVoltage: 5,
    isolation: "High",
  });

  const lowInput = calculatePhotoTriacSimulation({
    enabled: true,
    inputVoltage: 1,
    isolation: "Low",
  });

  return (
    disabled.ledCurrent === 0 &&
    disabled.triggerCurrent === 0 &&
    disabled.status === "OFF" &&
    active.status === "ON" &&
    highIsolation.isolationVoltage === 5000 &&
    lowInput.status === "OFF"
  );
}

/* ---------------------------------------------
   SVG constants and manual tuning architecture
--------------------------------------------- */

const VIEW_BOX = {
  x: 0,
  y: 0,
  width: 1688,
  height: 603,
} as const;

const SVG_VIEW_BOX = `${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`;

const SCALE = {
  CIRCUIT_CANVAS_SCALE: 1,
  CIRCUIT_WIRE_SCALE: 1,
} as const;

const BASE_WIRE_WIDTH = 5;

/*
   Manual TRIAC placement control.
   Change x/y to move the whole PhotoTRIAC symbol and its leads.
*/
const TRIAC_PLACEMENT = {
  x: 0,
  y: 0,
} as const satisfies Offset;

/*
   Manual TRIAC body control.
*/
const TRIAC_SYMBOL_TUNE = {
  halfWidth: 54,
  halfHeight: 56,
  centerGap: 8,
  triggerDotOffset: { x: -78, y: 0 },
  lightArrowTargetX: -86,
  lightArrowTopY: -28,
  lightArrowBottomY: 28,
} as const;

/*
   AC pilot light load placement.
   PilotLight local symbol terminals before rotation:
   top terminal    = (10, 0)
   bottom terminal = (10, 50)

   With rotate -90 around (10,25), it becomes a horizontal load:
   input terminal  = x - 15 * scale, y + 25 * scale
   output terminal = x + 35 * scale, y + 25 * scale
*/
const LOAD_PILOT_LIGHT_TUNE = {
  x: 1275,
  y: 416,
  scale: 2.25,
  rotate: -90,
  wireStroke: 2.6,
  labelOffset: { x: -42, y: 58 },
} as const;

const COMPONENT_OFFSET = {
  inputBattery: { x: 0, y: 0 },
  inputSwitch: { x: 0, y: 0 },
  optocouplerBox: { x: 0, y: 0 },
  inputLed: { x: 0, y: 0 },
  photoTriac: TRIAC_PLACEMENT,
  acSource: { x: 0, y: 0 },
  acLoad: { x: 0, y: 0 },
} as const satisfies Record<string, Offset>;

const WIRE_OFFSET = {
  inputBattery: { x: 0, y: 0 },
  inputTopToSwitch: { x: 0, y: 0 },
  switchToPin1: { x: 0, y: 0 },
  ledTopDrop: { x: 0, y: 0 },
  ledBottomDrop: { x: 0, y: 0 },
  inputReturn: { x: 0, y: 0 },
  acTop: { x: 0, y: 0 },
  triacLeads: { x: 0, y: 0 },
  acReturn: { x: 0, y: 0 },
  loadLoop: { x: 0, y: 0 },
} as const satisfies Record<string, Offset>;

const DOT_PATH_OFFSET = {
  inputPositiveToLed: { x: 0, y: 0 },
  inputLedToNegative: { x: 0, y: 0 },
  acOutputPath: { x: 0, y: 0 },
} as const satisfies Record<string, Offset>;

const DEBUG_TERMINAL_OFFSET = {
  marker: { x: 0, y: 0 },
  label: { x: 9, y: -9 },
} as const satisfies Record<string, Offset>;

const LABEL_OFFSET = {
  input: { x: 0, y: 0 },
  ac: { x: 0, y: 0 },
  pin1: { x: 0, y: 0 },
  pin2: { x: 0, y: 0 },
  pin3: { x: 0, y: 0 },
  pin4: { x: 0, y: 0 },
  packageTitle: { x: 0, y: 0 },
} as const satisfies Record<string, Offset>;

const STYLE = {
  wire: "#020617",
  packageBlue: "#0d47a1",
  inputCurrent: "#2563eb",
  acCurrent: "#a855f7",
  light: "#f59e0b",
  ledFill: "#fbbf24",
  triacFill: "#f3e8ff",
  loadFill: "#fde047",
  debugInput: "#2563eb",
  debugOutput: "#a855f7",
  debugPower: "#ef4444",
  debugDevice: "#7c3aed",
} as const;

function buildCanvasScaleTransform(scale: number) {
  if (scale === 1) return undefined;

  const centerX = VIEW_BOX.width / 2;
  const centerY = VIEW_BOX.height / 2;

  return `translate(${centerX} ${centerY}) scale(${scale}) translate(${-centerX} ${-centerY})`;
}

/* ---------------------------------------------
   Reusable Pilot Light load component
--------------------------------------------- */

function PilotLight({
  x = 0,
  y = 0,
  scale = 1,
  rotate = 0,
  on = false,
  label = "Indicator",
  className = "",
  standalone = true,
  strokeColor,
  fillColor,
  wireStroke = 0.5,
  textSize = 0.5,
}: PilotLightProps) {
  const lampStroke = strokeColor ?? "#111111";
  const lampFill = fillColor ?? (on ? "#fde047" : "#ffffff");
  const cableStroke = wireStroke;
  const glowId = `pilot-light-glow-${String(x).replaceAll(".", "-")}-${String(
    y,
  ).replaceAll(".", "-")}-${String(scale).replaceAll(".", "-")}-${String(
    rotate,
  ).replaceAll(".", "-")}`;

  const symbol = (
    <g>
      <defs>
        <filter id={glowId} x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="2.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g
        transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotate}, 10, 25)`}
        stroke={lampStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {on ? (
          <circle
            cx="10"
            cy="25"
            r="14"
            fill="#fde047"
            opacity="0.3"
            stroke="none"
            filter={`url(#${glowId})`}
          />
        ) : null}

        <circle
          cx="10"
          cy="25"
          r="10"
          fill={lampFill}
          strokeWidth={cableStroke}
          filter={on ? `url(#${glowId})` : undefined}
        />

        {on ? (
          <circle
            cx="10"
            cy="25"
            r="5.2"
            fill="#fff7b3"
            opacity="0.9"
            stroke="none"
          />
        ) : null}

        <path d="M10 50V35" strokeWidth={cableStroke} />
        <path d="M10 0v15" strokeWidth={cableStroke} />
        <path d="M3 18l14 14" strokeWidth={cableStroke} />
        <path d="M17 18L3 32" strokeWidth={cableStroke} />

        {standalone ? (
          <text
            x="28"
            y="28"
            fontSize={textSize}
            fontWeight="700"
            fill="#111111"
            stroke="none"
          >
            {label}
          </text>
        ) : null}
      </g>
    </g>
  );

  if (!standalone) {
    return symbol;
  }

  return (
    <svg
      viewBox="-10 -10 90 71"
      className={`h-16 w-36 rounded-xl bg-white p-2 shadow ${className}`}
    >
      {symbol}
    </svg>
  );
}

/* ---------------------------------------------
   Nodes
--------------------------------------------- */

const BASE_NODE = {
  batteryTop: { x: 80, y: 112 },
  batteryPositivePlateCenter: { x: 80, y: 352 },
  batteryNegativePlateCenter: { x: 80, y: 378 },
  batteryBottom: { x: 80, y: 472 },

  batteryPlusPlateLeft: { x: 38, y: 352 },
  batteryPlusPlateRight: { x: 98, y: 352 },
  batteryMinusPlateLeft: { x: 50, y: 378 },
  batteryMinusPlateRight: { x: 92, y: 378 },

  switchLeftContact: { x: 238, y: 112 },
  switchRightContact: { x: 342, y: 112 },
  switchOpenEnd: { x: 371, y: 44 },
  switchArmStart: { x: 248, y: 106 },

  pin1: { x: 582, y: 112 },
  pin2: { x: 582, y: 472 },
  pin3: { x: 1039, y: 112 },
  pin4: { x: 1039, y: 472 },

  ledTop: { x: 742, y: 235 },
  ledBottom: { x: 742, y: 324 },
  ledReturn: { x: 742, y: 472 },

  isolationTop: { x: 810, y: 22 },
  isolationBottom: { x: 810, y: 520 },

  triacTop: { x: 956, y: 194 },
  triacBottom: { x: 956, y: 332 },
  triacCenter: { x: 956, y: 263 },

  outputTop: { x: 956, y: 112 },
  outputBottom: { x: 956, y: 472 },

  acSourceTop: { x: 1465, y: 112 },
  acSourceTopIn: { x: 1465, y: 214 },
  acSourceCenter: { x: 1465, y: 292 },
  acSourceBottomIn: { x: 1465, y: 370 },
  acSourceBottom: { x: 1465, y: 472 },

  loadInput: {
    x: LOAD_PILOT_LIGHT_TUNE.x - 15 * LOAD_PILOT_LIGHT_TUNE.scale,
    y: LOAD_PILOT_LIGHT_TUNE.y + 25 * LOAD_PILOT_LIGHT_TUNE.scale,
  },
  loadOutput: {
    x: LOAD_PILOT_LIGHT_TUNE.x + 35 * LOAD_PILOT_LIGHT_TUNE.scale,
    y: LOAD_PILOT_LIGHT_TUNE.y + 25 * LOAD_PILOT_LIGHT_TUNE.scale,
  },
  loadCenter: {
    x: LOAD_PILOT_LIGHT_TUNE.x + 10 * LOAD_PILOT_LIGHT_TUNE.scale,
    y: LOAD_PILOT_LIGHT_TUNE.y + 25 * LOAD_PILOT_LIGHT_TUNE.scale,
  },
} as const satisfies Record<string, Point>;

const NODE = {
  batteryTop: addPoint(BASE_NODE.batteryTop, COMPONENT_OFFSET.inputBattery),
  batteryPositivePlateCenter: addPoint(
    BASE_NODE.batteryPositivePlateCenter,
    COMPONENT_OFFSET.inputBattery,
  ),
  batteryNegativePlateCenter: addPoint(
    BASE_NODE.batteryNegativePlateCenter,
    COMPONENT_OFFSET.inputBattery,
  ),
  batteryBottom: addPoint(BASE_NODE.batteryBottom, COMPONENT_OFFSET.inputBattery),

  batteryPlusPlateLeft: addPoint(
    BASE_NODE.batteryPlusPlateLeft,
    COMPONENT_OFFSET.inputBattery,
  ),
  batteryPlusPlateRight: addPoint(
    BASE_NODE.batteryPlusPlateRight,
    COMPONENT_OFFSET.inputBattery,
  ),
  batteryMinusPlateLeft: addPoint(
    BASE_NODE.batteryMinusPlateLeft,
    COMPONENT_OFFSET.inputBattery,
  ),
  batteryMinusPlateRight: addPoint(
    BASE_NODE.batteryMinusPlateRight,
    COMPONENT_OFFSET.inputBattery,
  ),

  switchLeftContact: addPoint(
    BASE_NODE.switchLeftContact,
    COMPONENT_OFFSET.inputSwitch,
  ),
  switchRightContact: addPoint(
    BASE_NODE.switchRightContact,
    COMPONENT_OFFSET.inputSwitch,
  ),
  switchOpenEnd: addPoint(BASE_NODE.switchOpenEnd, COMPONENT_OFFSET.inputSwitch),
  switchArmStart: addPoint(BASE_NODE.switchArmStart, COMPONENT_OFFSET.inputSwitch),

  pin1: addPoint(BASE_NODE.pin1, COMPONENT_OFFSET.optocouplerBox),
  pin2: addPoint(BASE_NODE.pin2, COMPONENT_OFFSET.optocouplerBox),
  pin3: addPoint(BASE_NODE.pin3, COMPONENT_OFFSET.optocouplerBox),
  pin4: addPoint(BASE_NODE.pin4, COMPONENT_OFFSET.optocouplerBox),

  ledTop: addPoint(BASE_NODE.ledTop, COMPONENT_OFFSET.inputLed),
  ledBottom: addPoint(BASE_NODE.ledBottom, COMPONENT_OFFSET.inputLed),
  ledReturn: addPoint(BASE_NODE.ledReturn, COMPONENT_OFFSET.inputLed),

  isolationTop: addPoint(BASE_NODE.isolationTop, COMPONENT_OFFSET.optocouplerBox),
  isolationBottom: addPoint(
    BASE_NODE.isolationBottom,
    COMPONENT_OFFSET.optocouplerBox,
  ),

  triacTop: addPoint(BASE_NODE.triacTop, COMPONENT_OFFSET.photoTriac),
  triacBottom: addPoint(BASE_NODE.triacBottom, COMPONENT_OFFSET.photoTriac),
  triacCenter: addPoint(BASE_NODE.triacCenter, COMPONENT_OFFSET.photoTriac),

  outputTop: addPoint(BASE_NODE.outputTop, COMPONENT_OFFSET.photoTriac),
  outputBottom: addPoint(BASE_NODE.outputBottom, COMPONENT_OFFSET.photoTriac),

  acSourceTop: addPoint(BASE_NODE.acSourceTop, COMPONENT_OFFSET.acSource),
  acSourceTopIn: addPoint(BASE_NODE.acSourceTopIn, COMPONENT_OFFSET.acSource),
  acSourceCenter: addPoint(BASE_NODE.acSourceCenter, COMPONENT_OFFSET.acSource),
  acSourceBottomIn: addPoint(BASE_NODE.acSourceBottomIn, COMPONENT_OFFSET.acSource),
  acSourceBottom: addPoint(BASE_NODE.acSourceBottom, COMPONENT_OFFSET.acSource),

  loadInput: addPoint(BASE_NODE.loadInput, COMPONENT_OFFSET.acLoad),
  loadOutput: addPoint(BASE_NODE.loadOutput, COMPONENT_OFFSET.acLoad),
  loadCenter: addPoint(BASE_NODE.loadCenter, COMPONENT_OFFSET.acLoad),
} as const satisfies Record<string, Point>;

/* ---------------------------------------------
   Wire segments
--------------------------------------------- */

const WIRE = {
  width: BASE_WIRE_WIDTH * SCALE.CIRCUIT_WIRE_SCALE,

  batteryTopLead: offsetPoints(
    [NODE.batteryTop, NODE.batteryPositivePlateCenter],
    WIRE_OFFSET.inputBattery,
  ),

  batteryBottomLead: offsetPoints(
    [NODE.batteryNegativePlateCenter, NODE.batteryBottom],
    WIRE_OFFSET.inputBattery,
  ),

  inputTopToSwitch: offsetPoints(
    [NODE.batteryTop, NODE.switchLeftContact],
    WIRE_OFFSET.inputTopToSwitch,
  ),

  switchToPin1AndLed: offsetPoints(
    [
      NODE.switchRightContact,
      { x: 430, y: NODE.switchRightContact.y },
      NODE.pin1,
      { x: NODE.ledTop.x, y: NODE.pin1.y },
    ],
    WIRE_OFFSET.switchToPin1,
  ),

  ledTopDrop: offsetPoints(
    [{ x: NODE.ledTop.x, y: NODE.pin1.y }, NODE.ledTop],
    WIRE_OFFSET.ledTopDrop,
  ),

  ledBottomDrop: offsetPoints(
    [NODE.ledBottom, NODE.ledReturn],
    WIRE_OFFSET.ledBottomDrop,
  ),

  inputReturn: offsetPoints(
    [NODE.ledReturn, NODE.pin2, NODE.batteryBottom],
    WIRE_OFFSET.inputReturn,
  ),

  acTopRail: offsetPoints(
    [NODE.outputTop, NODE.pin3, NODE.acSourceTop],
    WIRE_OFFSET.acTop,
  ),

  triacTopLead: offsetPoints(
    [NODE.outputTop, NODE.triacTop],
    WIRE_OFFSET.triacLeads,
  ),

  triacBottomLead: offsetPoints(
    [NODE.triacBottom, NODE.outputBottom],
    WIRE_OFFSET.triacLeads,
  ),

  acSourceUpperLead: offsetPoints(
    [NODE.acSourceTop, NODE.acSourceTopIn],
    WIRE_OFFSET.acTop,
  ),

  acSourceLowerLead: offsetPoints(
    [NODE.acSourceBottomIn, NODE.acSourceBottom],
    WIRE_OFFSET.loadLoop,
  ),

  outputReturnToLoad: offsetPoints(
    [NODE.outputBottom, NODE.pin4, NODE.loadInput],
    WIRE_OFFSET.acReturn,
  ),

  loadToAcSource: offsetPoints(
    [NODE.loadOutput, { x: NODE.acSourceBottom.x, y: NODE.loadOutput.y }, NODE.acSourceBottom],
    WIRE_OFFSET.loadLoop,
  ),
} as const;

/* ---------------------------------------------
   Logical current paths
--------------------------------------------- */

const CURRENT_PATH_POINTS = {
  inputPositiveToLed: offsetPoints(
    [
      NODE.batteryPositivePlateCenter,
      NODE.batteryTop,
      NODE.switchLeftContact,
      NODE.switchArmStart,
      NODE.switchRightContact,
      { x: 430, y: NODE.switchRightContact.y },
      NODE.pin1,
      { x: NODE.ledTop.x, y: NODE.pin1.y },
      NODE.ledTop,
    ],
    DOT_PATH_OFFSET.inputPositiveToLed,
  ),

  inputLedToNegative: offsetPoints(
    [
      NODE.ledTop,
      NODE.ledBottom,
      NODE.ledReturn,
      NODE.pin2,
      NODE.batteryBottom,
      NODE.batteryNegativePlateCenter,
    ],
    DOT_PATH_OFFSET.inputLedToNegative,
  ),

  acOutputPath: offsetPoints(
    [
      NODE.acSourceTopIn,
      NODE.acSourceTop,
      NODE.pin3,
      NODE.outputTop,
      NODE.triacTop,
      NODE.triacCenter,
      NODE.triacBottom,
      NODE.outputBottom,
      NODE.pin4,
      NODE.loadInput,
      NODE.loadCenter,
      NODE.loadOutput,
      { x: NODE.acSourceBottom.x, y: NODE.loadOutput.y },
      NODE.acSourceBottom,
      NODE.acSourceBottomIn,
    ],
    DOT_PATH_OFFSET.acOutputPath,
  ),
} as const;

const CURRENT_PATH = {
  inputPositiveToLed: pathD(CURRENT_PATH_POINTS.inputPositiveToLed),
  inputLedToNegative: pathD(CURRENT_PATH_POINTS.inputLedToNegative),
  acOutputPath: pathD(CURRENT_PATH_POINTS.acOutputPath),
} as const;

/* ---------------------------------------------
   Labels
--------------------------------------------- */

const LABEL = {
  input: addPoint({ x: 215, y: 397 }, LABEL_OFFSET.input),
  ac: addPoint({ x: 1388, y: 178 }, LABEL_OFFSET.ac),

  pin1: addPoint({ x: 532, y: 170 }, LABEL_OFFSET.pin1),
  pin2: addPoint({ x: 532, y: 432 }, LABEL_OFFSET.pin2),
  pin3: addPoint({ x: 1055, y: 170 }, LABEL_OFFSET.pin3),
  pin4: addPoint({ x: 1055, y: 432 }, LABEL_OFFSET.pin4),

  packageTitle: addPoint({ x: 660, y: 52 }, LABEL_OFFSET.packageTitle),

  inputPlus: { x: 26, y: 326 },
  inputMinus: { x: 28, y: 437 },
} as const;

/* ---------------------------------------------
   Debug terminal dots
--------------------------------------------- */

const DEBUG_TERMINALS = {
  batteryPositive: {
    label: "Battery +",
    point: NODE.batteryPositivePlateCenter,
    color: STYLE.debugPower,
    labelOffset: { x: -70, y: -20 },
  },
  batteryNegative: {
    label: "Battery -",
    point: NODE.batteryNegativePlateCenter,
    color: STYLE.debugPower,
    labelOffset: { x: -70, y: 28 },
  },
  switchLeft: {
    label: "Switch L",
    point: NODE.switchLeftContact,
    color: STYLE.debugInput,
    labelOffset: { x: -30, y: -24 },
  },
  switchRight: {
    label: "Switch R",
    point: NODE.switchRightContact,
    color: STYLE.debugInput,
    labelOffset: { x: -10, y: -28 },
  },
  pin1: {
    label: "Pin 1",
    point: NODE.pin1,
    color: STYLE.debugInput,
    labelOffset: { x: -40, y: -20 },
  },
  pin2: {
    label: "Pin 2",
    point: NODE.pin2,
    color: STYLE.debugInput,
    labelOffset: { x: -40, y: 30 },
  },
  pin3: {
    label: "Pin 3",
    point: NODE.pin3,
    color: STYLE.debugOutput,
    labelOffset: { x: 8, y: -20 },
  },
  pin4: {
    label: "Pin 4",
    point: NODE.pin4,
    color: STYLE.debugOutput,
    labelOffset: { x: 8, y: 30 },
  },
  triacTop: {
    label: "TRIAC MT2",
    point: NODE.triacTop,
    color: STYLE.debugDevice,
    labelOffset: { x: 12, y: -20 },
  },
  triacBottom: {
    label: "TRIAC MT1",
    point: NODE.triacBottom,
    color: STYLE.debugDevice,
    labelOffset: { x: 12, y: 30 },
  },
  acTop: {
    label: "AC top",
    point: NODE.acSourceTopIn,
    color: STYLE.debugPower,
    labelOffset: { x: 20, y: -20 },
  },
  acBottom: {
    label: "AC bottom",
    point: NODE.acSourceBottomIn,
    color: STYLE.debugPower,
    labelOffset: { x: 20, y: 32 },
  },
  loadInput: {
    label: "Load input",
    point: NODE.loadInput,
    color: STYLE.debugOutput,
    labelOffset: { x: -80, y: -20 },
  },
  loadOutput: {
    label: "Load output",
    point: NODE.loadOutput,
    color: STYLE.debugOutput,
    labelOffset: { x: 16, y: -20 },
  },
} as const;

/* ---------------------------------------------
   Reusable SVG helpers
--------------------------------------------- */

function WirePath({
  points,
  width = WIRE.width,
}: {
  points: readonly Point[];
  width?: number;
}) {
  return (
    <path
      d={pathD(points)}
      stroke={STYLE.wire}
      strokeWidth={width}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function FlowDots({
  path,
  active,
  color,
  count = 10,
  duration = 2.1,
  radius = 4,
  reverse = false,
}: {
  path: string;
  active: boolean;
  color: string;
  count?: number;
  duration?: number;
  radius?: number;
  reverse?: boolean;
}) {
  const route = reverse ? ["100%", "0%"] : ["0%", "100%"];

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.circle
          key={`${path}-${index}-${reverse ? "reverse" : "forward"}`}
          r={radius}
          fill={color}
          stroke="white"
          strokeWidth="1"
          initial={false}
          animate={{
            offsetDistance: active ? route : route[0],
            opacity: active ? [0, 1, 1, 0] : 0,
          }}
          transition={{
            duration: active ? duration : 0.15,
            repeat: active ? Infinity : 0,
            ease: "linear",
            delay: active ? index * (duration / count) : 0,
          }}
          style={
            {
              offsetPath: `path('${path}')`,
            } as CSSProperties
          }
        />
      ))}
    </>
  );
}

function AcFlowDots({
  path,
  active,
  color,
  count = 8,
}: {
  path: string;
  active: boolean;
  color: string;
  count?: number;
}) {
  return (
    <>
      <FlowDots
        path={path}
        active={active}
        color={color}
        count={count}
        duration={1.35}
        radius={3.8}
      />
      <FlowDots
        path={path}
        active={active}
        color={color}
        count={count}
        duration={1.35}
        radius={3.8}
        reverse
      />
    </>
  );
}

function FlowDebugPaths() {
  return (
    <g opacity="0.45">
      <path
        d={CURRENT_PATH.inputPositiveToLed}
        stroke={STYLE.inputCurrent}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="12 12"
      />

      <path
        d={CURRENT_PATH.inputLedToNegative}
        stroke={STYLE.inputCurrent}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="12 12"
      />

      <path
        d={CURRENT_PATH.acOutputPath}
        stroke={STYLE.acCurrent}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="12 12"
      />
    </g>
  );
}

function DebugTerminals() {
  return (
    <g>
      {Object.entries(DEBUG_TERMINALS).map(([key, terminal]) => {
        const markerPoint = addPoint(
          terminal.point,
          DEBUG_TERMINAL_OFFSET.marker,
        );
        const labelBase = addPoint(markerPoint, DEBUG_TERMINAL_OFFSET.label);
        const labelPoint = addPoint(labelBase, terminal.labelOffset);

        return (
          <g key={key}>
            <circle
              cx={markerPoint.x}
              cy={markerPoint.y}
              r="7"
              fill={terminal.color}
              stroke="white"
              strokeWidth="2"
            />
            <text
              x={labelPoint.x}
              y={labelPoint.y}
              fontSize="22"
              fontFamily="Arial"
              fontWeight="700"
              fill={terminal.color}
            >
              {terminal.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/* ---------------------------------------------
   Circuit block: input battery
--------------------------------------------- */

function InputBattery() {
  return (
    <g>
      <WirePath points={WIRE.batteryTopLead} />
      <WirePath points={WIRE.batteryBottomLead} />

      <line
        x1={NODE.batteryPlusPlateLeft.x}
        y1={NODE.batteryPlusPlateLeft.y}
        x2={NODE.batteryPlusPlateRight.x}
        y2={NODE.batteryPlusPlateRight.y}
        stroke={STYLE.wire}
        strokeWidth="9"
        strokeLinecap="round"
      />

      <line
        x1={NODE.batteryMinusPlateLeft.x}
        y1={NODE.batteryMinusPlateLeft.y}
        x2={NODE.batteryMinusPlateRight.x}
        y2={NODE.batteryMinusPlateRight.y}
        stroke={STYLE.wire}
        strokeWidth="6"
        strokeLinecap="round"
      />

      <text
        x={LABEL.inputPlus.x}
        y={LABEL.inputPlus.y}
        fontSize="46"
        fontFamily="Arial"
        fontWeight="700"
      >
        +
      </text>

      <text
        x={LABEL.inputMinus.x}
        y={LABEL.inputMinus.y}
        fontSize="46"
        fontFamily="Arial"
        fontWeight="700"
      >
        -
      </text>
    </g>
  );
}

/* ---------------------------------------------
   Circuit block: input switch
--------------------------------------------- */

function InputSwitch({ active }: { active: boolean }) {
  return (
    <g>
      <WirePath points={WIRE.inputTopToSwitch} />

      <circle
        cx={NODE.switchLeftContact.x}
        cy={NODE.switchLeftContact.y}
        r="11"
        fill="#ffffff"
        stroke={STYLE.wire}
        strokeWidth="5"
      />

      <circle
        cx={NODE.switchRightContact.x}
        cy={NODE.switchRightContact.y}
        r="11"
        fill="#ffffff"
        stroke={STYLE.wire}
        strokeWidth="5"
      />

      <motion.line
        x1={NODE.switchArmStart.x}
        y1={NODE.switchArmStart.y}
        x2={active ? NODE.switchRightContact.x : NODE.switchOpenEnd.x}
        y2={active ? NODE.switchRightContact.y : NODE.switchOpenEnd.y}
        stroke={STYLE.wire}
        strokeWidth="6"
        strokeLinecap="round"
        initial={false}
        transition={{
          type: "spring",
          stiffness: 90,
          damping: 14,
        }}
      />

      <WirePath points={WIRE.switchToPin1AndLed} />
    </g>
  );
}

/* ---------------------------------------------
   Circuit block: optocoupler package
--------------------------------------------- */

function OptocouplerFrame() {
  return (
    <g>
      <rect
        x="582"
        y="20"
        width="457"
        height="504"
        fill="none"
        stroke={STYLE.packageBlue}
        strokeWidth="5"
      />

      <line
        x1={NODE.isolationTop.x}
        y1={NODE.isolationTop.y}
        x2={NODE.isolationBottom.x}
        y2={NODE.isolationBottom.y}
        stroke={STYLE.wire}
        strokeWidth="4"
        strokeDasharray="32 14"
      />

      <text
        x={LABEL.packageTitle.x}
        y={LABEL.packageTitle.y}
        fontSize="22"
        fontFamily="Arial"
        fontWeight="700"
        fill={STYLE.packageBlue}
      >
        Optical Isolation
      </text>
    </g>
  );
}

/* ---------------------------------------------
   Circuit block: input LED and optical arrows
--------------------------------------------- */

function InputLed({ active }: { active: boolean }) {
  const trianglePoints = [
    `${NODE.ledTop.x - 34},${NODE.ledTop.y}`,
    `${NODE.ledTop.x + 34},${NODE.ledTop.y}`,
    `${NODE.ledTop.x},${NODE.ledBottom.y - 14}`,
  ].join(" ");

  return (
    <g>
      <WirePath points={WIRE.ledTopDrop} />

      <motion.polygon
        points={trianglePoints}
        fill={active ? STYLE.ledFill : "white"}
        stroke={STYLE.wire}
        strokeWidth="6"
        strokeLinejoin="round"
        initial={false}
        animate={{
          opacity: active ? [0.75, 1, 0.75] : 1,
        }}
        transition={{
          duration: active ? 1 : 0.15,
          repeat: active ? Infinity : 0,
        }}
      />

      <line
        x1={NODE.ledTop.x - 34}
        y1={NODE.ledBottom.y}
        x2={NODE.ledTop.x + 34}
        y2={NODE.ledBottom.y}
        stroke={STYLE.wire}
        strokeWidth="6"
        strokeLinecap="round"
      />

      <WirePath points={WIRE.ledBottomDrop} />

      <motion.g
        initial={false}
        animate={{
          opacity: active ? [0.35, 1, 0.35] : 0,
        }}
        transition={{
          duration: active ? 1.15 : 0.15,
          repeat: active ? Infinity : 0,
        }}
      >
        <line
          x1={NODE.ledTop.x + 38}
          y1={NODE.ledTop.y + 25}
          x2={NODE.triacCenter.x + TRIAC_SYMBOL_TUNE.lightArrowTargetX}
          y2={NODE.triacCenter.y + TRIAC_SYMBOL_TUNE.lightArrowTopY}
          stroke={STYLE.light}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <polygon
          points={`${NODE.triacCenter.x - 96},${NODE.triacCenter.y - 36} ${
            NODE.triacCenter.x - 74
          },${NODE.triacCenter.y - 29} ${NODE.triacCenter.x - 92},${
            NODE.triacCenter.y - 16
          }`}
          fill={STYLE.light}
        />

        <line
          x1={NODE.ledTop.x + 42}
          y1={NODE.ledBottom.y - 10}
          x2={NODE.triacCenter.x + TRIAC_SYMBOL_TUNE.lightArrowTargetX}
          y2={NODE.triacCenter.y + TRIAC_SYMBOL_TUNE.lightArrowBottomY}
          stroke={STYLE.light}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <polygon
          points={`${NODE.triacCenter.x - 96},${NODE.triacCenter.y + 20} ${
            NODE.triacCenter.x - 74
          },${NODE.triacCenter.y + 30} ${NODE.triacCenter.x - 94},${
            NODE.triacCenter.y + 41
          }`}
          fill={STYLE.light}
        />
      </motion.g>
    </g>
  );
}

function InputReturnWire() {
  return <WirePath points={WIRE.inputReturn} />;
}

/* ---------------------------------------------
   Circuit block: PhotoTRIAC output symbol
--------------------------------------------- */

function PhotoTriacOutput({ active }: { active: boolean }) {
  const activeFill = active ? STYLE.triacFill : "white";

  const centerX = NODE.triacCenter.x;
  const centerY = NODE.triacCenter.y;

  const topBaseY = centerY - TRIAC_SYMBOL_TUNE.halfHeight;
  const bottomBaseY = centerY + TRIAC_SYMBOL_TUNE.halfHeight;

  const upperTriangle = `
    ${centerX - TRIAC_SYMBOL_TUNE.halfWidth},${topBaseY}
    ${centerX + TRIAC_SYMBOL_TUNE.halfWidth},${topBaseY}
    ${centerX},${centerY - TRIAC_SYMBOL_TUNE.centerGap}
  `;

  const lowerTriangle = `
    ${centerX - TRIAC_SYMBOL_TUNE.halfWidth},${bottomBaseY}
    ${centerX + TRIAC_SYMBOL_TUNE.halfWidth},${bottomBaseY}
    ${centerX},${centerY + TRIAC_SYMBOL_TUNE.centerGap}
  `;

  return (
    <g>
      <WirePath points={WIRE.triacTopLead} />
      <WirePath points={WIRE.triacBottomLead} />

      <motion.g
        initial={false}
        animate={{
          opacity: active ? [0.88, 1, 0.88] : 1,
        }}
        transition={{
          duration: active ? 1.1 : 0.15,
          repeat: active ? Infinity : 0,
        }}
      >
        <line
          x1={centerX}
          y1={NODE.triacTop.y}
          x2={centerX}
          y2={topBaseY}
          stroke={STYLE.wire}
          strokeWidth="7"
          strokeLinecap="round"
        />

        <line
          x1={centerX}
          y1={bottomBaseY}
          x2={centerX}
          y2={NODE.triacBottom.y}
          stroke={STYLE.wire}
          strokeWidth="7"
          strokeLinecap="round"
        />

        <polygon
          points={upperTriangle}
          fill={activeFill}
          stroke={STYLE.wire}
          strokeWidth="7"
          strokeLinejoin="round"
        />

        <polygon
          points={lowerTriangle}
          fill={activeFill}
          stroke={STYLE.wire}
          strokeWidth="7"
          strokeLinejoin="round"
        />

        <motion.circle
          cx={centerX + TRIAC_SYMBOL_TUNE.triggerDotOffset.x}
          cy={centerY + TRIAC_SYMBOL_TUNE.triggerDotOffset.y}
          r="8"
          fill={STYLE.light}
          initial={false}
          animate={{
            opacity: active ? [0.35, 1, 0.35] : 0,
          }}
          transition={{
            duration: active ? 1 : 0.15,
            repeat: active ? Infinity : 0,
          }}
        />
      </motion.g>
    </g>
  );
}

/* ---------------------------------------------
   Circuit block: AC source
--------------------------------------------- */

function AcOutputSource() {
  return (
    <g>
      <WirePath points={WIRE.acTopRail} />
      <WirePath points={WIRE.acSourceUpperLead} />

      <circle
        cx={NODE.acSourceCenter.x}
        cy={NODE.acSourceCenter.y}
        r="78"
        fill="#ffffff"
        stroke={STYLE.wire}
        strokeWidth="5"
      />

      <path
        d={`M${NODE.acSourceCenter.x - 57} ${NODE.acSourceCenter.y}
        C${NODE.acSourceCenter.x - 42} ${NODE.acSourceCenter.y - 32},
        ${NODE.acSourceCenter.x - 22} ${NODE.acSourceCenter.y - 32},
        ${NODE.acSourceCenter.x - 8} ${NODE.acSourceCenter.y}
        C${NODE.acSourceCenter.x + 8} ${NODE.acSourceCenter.y + 32},
        ${NODE.acSourceCenter.x + 30} ${NODE.acSourceCenter.y + 32},
        ${NODE.acSourceCenter.x + 48} ${NODE.acSourceCenter.y}`}
        fill="none"
        stroke={STYLE.wire}
        strokeWidth="6"
        strokeLinecap="round"
      />

      <WirePath points={WIRE.acSourceLowerLead} />

      <text
        x={LABEL.ac.x}
        y={LABEL.ac.y}
        fontSize="44"
        fontFamily="Arial"
        fontWeight="700"
      >
        AC
      </text>
    </g>
  );
}

/* ---------------------------------------------
   AC load block using horizontal PilotLight
--------------------------------------------- */

function AcLoadNetwork({ active }: { active: boolean }) {
  return (
    <g>
      <WirePath points={WIRE.outputReturnToLoad} />

      <PilotLight
        x={LOAD_PILOT_LIGHT_TUNE.x}
        y={LOAD_PILOT_LIGHT_TUNE.y}
        scale={LOAD_PILOT_LIGHT_TUNE.scale}
        rotate={LOAD_PILOT_LIGHT_TUNE.rotate}
        on={active}
        standalone={false}
        strokeColor={STYLE.wire}
        fillColor={active ? STYLE.loadFill : "#ffffff"}
        wireStroke={LOAD_PILOT_LIGHT_TUNE.wireStroke}
      />

      <text
        x={NODE.loadCenter.x + LOAD_PILOT_LIGHT_TUNE.labelOffset.x}
        y={NODE.loadCenter.y + LOAD_PILOT_LIGHT_TUNE.labelOffset.y}
        fontSize="28"
        fontFamily="Arial"
        fontWeight="700"
        fill={STYLE.wire}
      >
        AC LOAD
      </text>

      <WirePath points={WIRE.loadToAcSource} />
    </g>
  );
}

/* ---------------------------------------------
   Circuit labels
--------------------------------------------- */

function PinLabels() {
  return (
    <g>
      <circle cx={NODE.pin1.x} cy={NODE.pin1.y} r="10" fill={STYLE.wire} />
      <circle cx={NODE.pin2.x} cy={NODE.pin2.y} r="10" fill={STYLE.wire} />
      <circle cx={NODE.pin3.x} cy={NODE.pin3.y} r="10" fill={STYLE.wire} />
      <circle cx={NODE.pin4.x} cy={NODE.pin4.y} r="10" fill={STYLE.wire} />

      <text
        x={LABEL.input.x}
        y={LABEL.input.y}
        fontSize="56"
        fontFamily="Arial"
      >
        INPUT
      </text>

      <text
        x={LABEL.pin1.x}
        y={LABEL.pin1.y}
        fontSize="58"
        fontFamily="Arial"
        fontWeight="700"
      >
        1
      </text>

      <text
        x={LABEL.pin2.x}
        y={LABEL.pin2.y}
        fontSize="58"
        fontFamily="Arial"
        fontWeight="700"
      >
        2
      </text>

      <text
        x={LABEL.pin3.x}
        y={LABEL.pin3.y}
        fontSize="58"
        fontFamily="Arial"
        fontWeight="700"
      >
        3
      </text>

      <text
        x={LABEL.pin4.x}
        y={LABEL.pin4.y}
        fontSize="58"
        fontFamily="Arial"
        fontWeight="700"
      >
        4
      </text>
    </g>
  );
}

/* ---------------------------------------------
   Current flow layer
--------------------------------------------- */

function CurrentFlowLayer({
  active,
  showCurrentDots,
  showFlowDebugPaths,
}: {
  active: boolean;
  showCurrentDots: boolean;
  showFlowDebugPaths: boolean;
}) {
  return (
    <>
      {showFlowDebugPaths && <FlowDebugPaths />}

      {showCurrentDots && (
        <>
          <FlowDots
            path={CURRENT_PATH.inputPositiveToLed}
            active={active}
            color={STYLE.inputCurrent}
            count={12}
            duration={2.2}
            radius={3.8}
          />

          <FlowDots
            path={CURRENT_PATH.inputLedToNegative}
            active={active}
            color={STYLE.inputCurrent}
            count={10}
            duration={2.2}
            radius={3.8}
          />

          <AcFlowDots
            path={CURRENT_PATH.acOutputPath}
            active={active}
            color={STYLE.acCurrent}
            count={8}
          />
        </>
      )}
    </>
  );
}

/* ---------------------------------------------
   Main circuit SVG
--------------------------------------------- */

function PhotoTriacCircuitSvg({
  active,
  showCurrentDots,
  showDebugTerminals,
  showFlowDebugPaths,
}: {
  active: boolean;
  showCurrentDots: boolean;
  showDebugTerminals: boolean;
  showFlowDebugPaths: boolean;
}) {
  const canvasTransform = buildCanvasScaleTransform(SCALE.CIRCUIT_CANVAS_SCALE);

  return (
    <svg
      viewBox={SVG_VIEW_BOX}
      className="h-auto w-full"
      shapeRendering="geometricPrecision"
      role="img"
      aria-label="PhotoTRIAC optocoupler AC switching circuit schematic"
    >
      <rect width={VIEW_BOX.width} height={VIEW_BOX.height} fill="#ffffff" />

      <g transform={canvasTransform}>
        <InputBattery />
        <InputSwitch active={active} />

        <OptocouplerFrame />
        <InputLed active={active} />
        <InputReturnWire />

        <PhotoTriacOutput active={active} />

        <AcOutputSource />
        <AcLoadNetwork active={active} />

        <CurrentFlowLayer
          active={active}
          showCurrentDots={showCurrentDots}
          showFlowDebugPaths={showFlowDebugPaths}
        />

        <PinLabels />

        {showDebugTerminals && <DebugTerminals />}
      </g>
    </svg>
  );
}

/* ---------------------------------------------
   Control panel
--------------------------------------------- */

function ControlPanel({
  inputVoltage,
  setInputVoltage,
  isolation,
  setIsolation,
  enabled,
  setEnabled,
  results,
  selfTestsPassed,
}: {
  inputVoltage: number;
  setInputVoltage: Dispatch<SetStateAction<number>>;
  isolation: IsolationMode;
  setIsolation: Dispatch<SetStateAction<IsolationMode>>;
  enabled: boolean;
  setEnabled: Dispatch<SetStateAction<boolean>>;
  results: SimulationResult;
  selfTestsPassed: boolean;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-purple-700">
            Output Device
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-900">
            PhotoTRIAC Control
          </h2>
        </div>

        <div
          className={cn(
            "rounded-full px-4 py-2 text-xs font-black",
            results.status === "ON"
              ? "bg-purple-100 text-purple-700"
              : "bg-slate-100 text-slate-600",
          )}
        >
          {results.status}
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-purple-50 p-4 ring-1 ring-purple-100">
        <p className="text-sm font-black text-purple-800">Selected Type</p>
        <p className="mt-1 text-2xl font-black text-purple-700">PhotoTRIAC</p>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
        <span className="font-black text-slate-700">Input Signal</span>

        <button
          type="button"
          onClick={() => setEnabled((current) => !current)}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-black transition",
            enabled
              ? "bg-purple-600 text-white"
              : "bg-slate-300 text-slate-700",
          )}
        >
          {enabled ? "ON" : "OFF"}
        </button>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Input Voltage: {inputVoltage} V
        </label>

        <input
          type="range"
          min="0"
          max="24"
          step="0.5"
          value={inputVoltage}
          onChange={(event) => setInputVoltage(Number(event.target.value))}
          className="w-full accent-purple-600"
        />
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-bold text-slate-700">
          Isolation Level
        </p>

        <div className="grid grid-cols-3 gap-2">
          {(["Low", "Medium", "High"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setIsolation(mode)}
              className={cn(
                "rounded-2xl px-3 py-3 text-sm font-black transition",
                isolation === mode
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-700",
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            LED Current
          </p>

          <p className="mt-2 text-2xl font-black text-red-600">
            {formatNumber(results.ledCurrent, 1)}mA
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Trigger Current
          </p>

          <p className="mt-2 text-2xl font-black text-purple-600">
            {formatNumber(results.triggerCurrent, 2)}mA
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Isolation Rating
          </p>

          <p className="mt-2 text-2xl font-black text-slate-900">
            {results.isolationVoltage}V
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Transfer
          </p>

          <p className="mt-2 text-2xl font-black text-purple-600">
            {formatNumber(results.transferPercent, 0)}%
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-white p-4 ring-1 ring-slate-200">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
          Realtime Logic
        </p>

        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          When the input LED is ON, light crosses the isolation barrier and
          triggers the PhotoTRIAC. The isolated output side powers the AC pilot
          light load while remaining electrically separated from the input side.
        </p>

        <p className="mt-3 text-sm font-black text-slate-900">
          Status: {results.status}
        </p>

        <p className="mt-1 text-xs font-bold text-slate-500">
          Self tests: {selfTestsPassed ? "passed" : "failed"}
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   Main exported component
--------------------------------------------- */

export default function PhotoTriacCircuitControlPanel({
  initialEnabled = true,
  initialInputVoltage = 5,
  initialIsolation = "Medium",
  showControls = true,
  showCurrentDots = true,
  showDebugTerminals = false,
  showFlowDebugPaths = false,
  className,
}: PhotoTriacCircuitControlPanelProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [inputVoltage, setInputVoltage] = useState(() =>
    clamp(initialInputVoltage, 0, 24),
  );
  const [isolation, setIsolation] = useState<IsolationMode>(initialIsolation);

  const selfTestsPassed = useMemo(() => runSelfTests(), []);

  const results = useMemo(
    () =>
      calculatePhotoTriacSimulation({
        enabled,
        inputVoltage,
        isolation,
      }),
    [enabled, inputVoltage, isolation],
  );

  const active = results.status === "ON";

  return (
    <div
      className={cn(
        "min-h-screen bg-white p-3 text-slate-800 sm:p-6",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto grid max-w-7xl gap-5",
          showControls ? "xl:grid-cols-3" : "grid-cols-1",
        )}
      >
        {showControls && (
          <ControlPanel
            inputVoltage={inputVoltage}
            setInputVoltage={setInputVoltage}
            isolation={isolation}
            setIsolation={setIsolation}
            enabled={enabled}
            setEnabled={setEnabled}
            results={results}
            selfTestsPassed={selfTestsPassed}
          />
        )}

        <div
          className={cn(
            "rounded-3xl border border-slate-200 bg-white p-5 shadow-xl",
            showControls && "xl:col-span-2",
          )}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-purple-700">
                PhotoTRIAC Circuit
              </p>

              <h1 className="mt-1 text-2xl font-black text-slate-900">
                LED to Optical Isolation to AC Pilot Light Load
              </h1>
            </div>

            <div
              className={cn(
                "rounded-full px-4 py-2 text-xs font-black",
                active
                  ? "bg-purple-100 text-purple-700"
                  : "bg-slate-100 text-slate-600",
              )}
            >
              {active ? "ACTIVE" : "OFF"}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-inner">
            <PhotoTriacCircuitSvg
              active={active}
              showCurrentDots={showCurrentDots}
              showDebugTerminals={showDebugTerminals}
              showFlowDebugPaths={showFlowDebugPaths}
            />
          </div>
        </div>
      </div>
    </div>
  );
}