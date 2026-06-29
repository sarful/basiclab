"use client";

import {
  ACVoltageSourceSymbol as LibraryACVoltageSourceSymbol,
  DiodeSymbol as LibraryDiodeSymbol,
  LEDSymbol as LibraryLedSymbol,
} from "@/src/library";

import { ElectronFlow } from "./ElectronFlow";
import type { WavePoint } from "./types";

const VIEW_BOX = "0 0 760 430";
const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 430;

const CIRCUIT_CANVAS_SCALE = 1.04;

const CIRCUIT_COMPONENT_SCALE = {
  ac: 1,
  d1: 1.5,
  d2: 1.5,
  d3: 1.5,
  d4: 1.5,
  led: 1.5,
} as const;

const BASE_WIRE_WIDTH = 3;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  muted: "#64748b",
  wire: "#111827",
  active: "#22c55e",
  ledGlow: "#facc15",
  danger: "#ef4444",
  electron: "#0ea5e9",
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

function clampValue(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getWireStroke(active: boolean) {
  return active ? STYLE.active : STYLE.wire;
}

const BASE_COMPONENT = {
  ac: {
    x: 40,
    y: 165,
    width: 80,
    height: 95,
    rotate: 0,
  },

  d2: {
    x: 205,
    y: 105,
    width: 108,
    height: 54,
    rotate: -48,
  },

  d4: {
    x: 325,
    y: 113,
    width: 108,
    height: 54,
    rotate: 48,
  },

  d1: {
    x: 201,
    y: 246,
    width: 108,
    height: 54,
    rotate: 47,
  },

  d3: {
    x: 326,
    y: 241,
    width: 108,
    height: 54,
    rotate: -48,
  },

  led: {
    x: 487,
    y: 235,
    width: 120,
    height: 80,
    rotate: 90,
  },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  ac: scaleComponent(BASE_COMPONENT.ac, CIRCUIT_COMPONENT_SCALE.ac),
  d1: scaleComponent(BASE_COMPONENT.d1, CIRCUIT_COMPONENT_SCALE.d1),
  d2: scaleComponent(BASE_COMPONENT.d2, CIRCUIT_COMPONENT_SCALE.d2),
  d3: scaleComponent(BASE_COMPONENT.d3, CIRCUIT_COMPONENT_SCALE.d3),
  d4: scaleComponent(BASE_COMPONENT.d4, CIRCUIT_COMPONENT_SCALE.d4),
  led: scaleComponent(BASE_COMPONENT.led, CIRCUIT_COMPONENT_SCALE.led),
} as const;

const NODE = {
  acTop: pointOnComponent(COMPONENT.ac, 0.5, 0),
  acBottom: pointOnComponent(COMPONENT.ac, 0.5, 1),

  topBusLeft: { x: 80, y: 72 },
  topBusBridge: { x: 315, y: 72 },

  bottomBusLeft: { x: 80, y: 390 },
  bottomBusBridge: { x: 315, y: 390 },

  bridgeTop: { x: 315, y: 72 },
  bridgeLeft: { x: 190, y: 205 },
  bridgeRight: { x: 440, y: 205 },
  bridgeBottom: { x: 315, y: 335 },

  dcPositive: { x: 535, y: 205 },

  ledAnode: { x: 535, y: 252 },
  ledCathode: { x: 535, y: 308 },

  dcReturnRight: { x: 535, y: 365 },
  dcReturnLeft: { x: 190, y: 365 },

  d1Center: pointOnComponent(COMPONENT.d1, 0.5, 0.5),
  d2Center: pointOnComponent(COMPONENT.d2, 0.5, 0.5),
  d3Center: pointOnComponent(COMPONENT.d3, 0.5, 0.5),
  d4Center: pointOnComponent(COMPONENT.d4, 0.5, 0.5),
} as const;

const GAP = {
  d1Before: { x: 231, y: 247 },
  d1After: { x: 276, y: 295 },

  d2Before: { x: 237, y: 155 },
  d2After: { x: 278, y: 111 },

  d3Before: { x: 358, y: 291 },
  d3After: { x: 399, y: 248 },

  d4Before: { x: 358, y: 117 },
  d4After: { x: 398, y: 161 },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  acTopToTopBus: [NODE.acTop, NODE.topBusLeft, NODE.topBusBridge],
  acBottomToBottomBus: [
    NODE.acBottom,
    NODE.bottomBusLeft,
    NODE.bottomBusBridge,
    NODE.bridgeBottom,
  ],

  d4Path: [NODE.bridgeTop, GAP.d4Before, GAP.d4After, NODE.bridgeRight],
  d3Path: [NODE.bridgeBottom, GAP.d3Before, GAP.d3After, NODE.bridgeRight],

  d1Path: [NODE.bridgeLeft, GAP.d1Before, GAP.d1After, NODE.bridgeBottom],
  d2Path: [NODE.bridgeLeft, GAP.d2Before, GAP.d2After, NODE.bridgeTop],

  positiveBus: [NODE.bridgeRight, NODE.dcPositive, NODE.ledAnode],
  ledPath: [NODE.ledAnode, NODE.ledCathode],
  returnBus: [
    NODE.ledCathode,
    NODE.dcReturnRight,
    NODE.dcReturnLeft,
    NODE.bridgeLeft,
  ],

  d1d4ReturnToAc: [
    NODE.bridgeBottom,
    NODE.bottomBusBridge,
    NODE.bottomBusLeft,
    NODE.acBottom,
  ],

  d2d3ReturnToAc: [
    NODE.bridgeTop,
    NODE.topBusBridge,
    NODE.topBusLeft,
    NODE.acTop,
  ],
} as const;

const LABEL = {
  ac: { x: 25, y: 220 },
  positiveDc: { x: 510, y: 190 },
  zeroDc: { x: 110, y: 360 },
  plus: { x: 548, y: 238 },
  minus: { x: 548, y: 330 },
} as const;

const POSITIVE_CYCLE_PATH: Point[] = [
  NODE.acTop,
  NODE.topBusLeft,
  NODE.topBusBridge,
  GAP.d4Before,
  GAP.d4After,
  NODE.bridgeRight,
  NODE.dcPositive,
  NODE.ledAnode,
  NODE.ledCathode,
  NODE.dcReturnRight,
  NODE.dcReturnLeft,
  NODE.bridgeLeft,
  GAP.d1Before,
  GAP.d1After,
  NODE.bridgeBottom,
  NODE.bottomBusBridge,
  NODE.bottomBusLeft,
  NODE.acBottom,
];

const NEGATIVE_CYCLE_PATH: Point[] = [
  NODE.acBottom,
  NODE.bottomBusLeft,
  NODE.bottomBusBridge,
  NODE.bridgeBottom,
  GAP.d3Before,
  GAP.d3After,
  NODE.bridgeRight,
  NODE.dcPositive,
  NODE.ledAnode,
  NODE.ledCathode,
  NODE.dcReturnRight,
  NODE.dcReturnLeft,
  NODE.bridgeLeft,
  GAP.d2Before,
  GAP.d2After,
  NODE.bridgeTop,
  NODE.topBusBridge,
  NODE.topBusLeft,
  NODE.acTop,
];

function pathD(points: readonly Point[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

function WirePath({
  points,
  active = false,
}: {
  points: readonly Point[];
  active?: boolean;
}) {
  return (
    <path
      d={pathD(points)}
      fill="none"
      stroke={getWireStroke(active)}
      strokeWidth={active ? WIRE.width + 1.5 : WIRE.width}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={active ? 0.95 : 0.72}
    />
  );
}

function NodeDot({ x, y, active = false }: Point & { active?: boolean }) {
  return (
    <circle
      cx={x}
      cy={y}
      r="6"
      fill="#f8fafc"
      stroke={active ? STYLE.active : "#94a3b8"}
      strokeWidth="3"
    />
  );
}

function AcSource() {
  return (
    <g>
      <g
        transform={`translate(${COMPONENT.ac.x} ${COMPONENT.ac.y}) rotate(${COMPONENT.ac.rotate} ${COMPONENT.ac.width / 2} ${COMPONENT.ac.height / 2})`}
      >
        <LibraryACVoltageSourceSymbol
          width={COMPONENT.ac.width}
          height={COMPONENT.ac.height}
          label="AC Source"
        />
      </g>

      <text
        x={LABEL.ac.x}
        y={LABEL.ac.y}
        fontSize="18"
        fontWeight="900"
        fill={STYLE.text}
      >
        AC
      </text>
    </g>
  );
}

function BridgeDiode({
  component,
  label,
  active,
}: {
  component: ComponentBox;
  label: string;
  active: boolean;
}) {
  return (
    <g>
      {active && (
        <circle
          cx={component.x + component.width / 2}
          cy={component.y + component.height / 2}
          r="42"
          fill={STYLE.active}
          opacity="0.15"
        />
      )}

      <g
        transform={`translate(${component.x} ${component.y}) rotate(${component.rotate} ${component.width / 2} ${component.height / 2})`}
        opacity={active ? 1 : 0.55}
      >
        <LibraryDiodeSymbol
          width={component.width}
          height={component.height}
          label={`${label} Bridge Diode`}
        />
      </g>

      <text
        x={component.x + component.width / 2}
        y={component.y - 10}
        textAnchor="middle"
        fontSize="18"
        fontWeight="900"
        fill={active ? STYLE.active : STYLE.muted}
      >
        {label}
      </text>
    </g>
  );
}

function LedLoad({ on, blown }: { on: boolean; blown: boolean }) {
  return (
    <g>
      {on && !blown && (
        <circle
          cx={NODE.ledAnode.x}
          cy={(NODE.ledAnode.y + NODE.ledCathode.y) / 2}
          r="32"
          fill={STYLE.ledGlow}
          opacity="0.18"
        />
      )}

      {blown && (
        <circle
          cx={NODE.ledAnode.x}
          cy={(NODE.ledAnode.y + NODE.ledCathode.y) / 2}
          r="32"
          fill="none"
          stroke={STYLE.danger}
          strokeWidth="2"
          strokeDasharray="6 6"
        />
      )}

      <g
        transform={`translate(${COMPONENT.led.x} ${COMPONENT.led.y}) rotate(${COMPONENT.led.rotate} ${COMPONENT.led.width / 2} ${COMPONENT.led.height / 2})`}
      >
        <LibraryLedSymbol
          width={COMPONENT.led.width}
          height={COMPONENT.led.height}
          label="LED Load"
        />
      </g>
    </g>
  );
}

export function BridgeCircuit({
  point,
  showElectronFlow = false,
  electronFlowRate = 1,
}: {
  point: WavePoint;
  diodeDrop?: number;
  showElectronFlow?: boolean;
  electronFlowRate?: number;
}) {
  const d1d4Conducting = point.activeDiode === "D1D4";
  const d2d3Conducting = point.activeDiode === "D2D3";

  const loadActive = point.ledOn && !point.ledBlown && point.current > 0.0005;
  const flowEnabled = showElectronFlow && loadActive;

  const d1Active = flowEnabled && d1d4Conducting;
  const d4Active = flowEnabled && d1d4Conducting;

  const d2Active = flowEnabled && d2d3Conducting;
  const d3Active = flowEnabled && d2d3Conducting;

  const d1d4Active = d1Active && d4Active;
  const d2d3Active = d2Active && d3Active;

  const loadWireActive = d1d4Active || d2d3Active;
  const sourceWireActive = d1d4Active || d2d3Active;

  const currentScale = clampValue(point.current / 0.02, 0, 1.8);

  const flowRate = clampValue(
    electronFlowRate * Math.max(currentScale, 0.25),
    0.25,
    5,
  );

  const electronCount =
    point.current <= 0
      ? 0
      : Math.round(clampValue(4 + currentScale * 4, 4, 12));

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">
      <svg
        viewBox={VIEW_BOX}
        className="h-auto min-h-[430px] w-full"
        role="img"
        aria-label="Bridge Rectifier Circuit With LED Load"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect width="760" height="430" fill="#ffffff" />

        <g transform={canvasTransform}>
          <WirePath points={WIRE.acTopToTopBus} active={sourceWireActive} />
          <WirePath
            points={WIRE.acBottomToBottomBus}
            active={sourceWireActive}
          />

          <WirePath points={WIRE.d4Path} active={d4Active} />
          <WirePath points={WIRE.d3Path} active={d3Active} />
          <WirePath points={WIRE.d1Path} active={d1Active} />
          <WirePath points={WIRE.d2Path} active={d2Active} />

          <WirePath points={WIRE.positiveBus} active={loadWireActive} />
          <WirePath points={WIRE.ledPath} active={loadWireActive} />
          <WirePath points={WIRE.returnBus} active={loadWireActive} />

          <text
            x={LABEL.positiveDc.x}
            y={LABEL.positiveDc.y}
            fontSize="18"
            fontWeight="800"
            fill={STYLE.muted}
          >
            +V (DC)
          </text>

          <text
            x={LABEL.zeroDc.x}
            y={LABEL.zeroDc.y}
            fontSize="18"
            fontWeight="800"
            fill={STYLE.muted}
          >
            0V (DC)
          </text>

          <text
            x={LABEL.plus.x}
            y={LABEL.plus.y}
            fontSize="20"
            fontWeight="900"
            fill={STYLE.active}
          >
            +
          </text>

          <text
            x={LABEL.minus.x}
            y={LABEL.minus.y}
            fontSize="20"
            fontWeight="900"
            fill={STYLE.danger}
          >
            -
          </text>

          <NodeDot {...NODE.bridgeTop} active={d2Active || d4Active} />
          <NodeDot
            {...NODE.bridgeLeft}
            active={d1Active || d2Active || loadWireActive}
          />
          <NodeDot
            {...NODE.bridgeRight}
            active={d3Active || d4Active || loadWireActive}
          />
          <NodeDot {...NODE.bridgeBottom} active={d1Active || d3Active} />
          <NodeDot {...NODE.dcReturnLeft} active={loadWireActive} />

          <AcSource />

          <BridgeDiode component={COMPONENT.d2} label="D2" active={d2Active} />
          <BridgeDiode component={COMPONENT.d4} label="D4" active={d4Active} />
          <BridgeDiode component={COMPONENT.d1} label="D1" active={d1Active} />
          <BridgeDiode component={COMPONENT.d3} label="D3" active={d3Active} />

          <LedLoad on={point.ledOn} blown={point.ledBlown} />

          <ElectronFlow
            active={d1d4Active && electronCount > 0}
            path={POSITIVE_CYCLE_PATH}
            color={STYLE.electron}
            count={electronCount}
            flowRate={flowRate}
          />

          <ElectronFlow
            active={d2d3Active && electronCount > 0}
            path={NEGATIVE_CYCLE_PATH}
            color={STYLE.electron}
            count={electronCount}
            flowRate={flowRate}
          />
        </g>
      </svg>
    </div>
  );
}
