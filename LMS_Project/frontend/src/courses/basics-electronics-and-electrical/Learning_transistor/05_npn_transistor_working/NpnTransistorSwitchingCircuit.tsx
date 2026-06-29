"use client";

import LEDSymbol from "../../Project/library/electronics-symbol-library/diodes/LEDSymbol";
import ResistorSymbol from "../../Project/library/electronics-symbol-library/passive/ResistorSymbol";
import DCVoltageSourceV1Symbol from "../../Project/library/electronics-symbol-library/sources/DCVoltageSourceV1Symbol";
import SPSTSwitchSymbol from "../../Project/library/electronics-symbol-library/switch-topology/SPSTSwitchSymbol";
import NPNTransistorSymbol from "../../Project/library/electronics-symbol-library/transistors/NPNTransistorSymbol";
import type { CurrentFlowMode, NpnWorkingMode } from "./simulationTypes";

/* =========================================================
   SCALE CONSTANTS
========================================================= */

const CIRCUIT_COMPONENT_SCALE = 1;
const BASE_WIRE_WIDTH = 1.7;
const CIRCUIT_WIRE_SCALE = 1;
const CIRCUIT_CANVAS_SCALE = 1;

const SCALE = {
  component: CIRCUIT_COMPONENT_SCALE,
  wire: CIRCUIT_WIRE_SCALE,
  canvas: CIRCUIT_CANVAS_SCALE,
};

const BASE_LAYOUT = {
  width: 820,
  height: 720,
} as const;

/* =========================================================
   VIEW BOX
========================================================= */

const VIEW_BOX = {
  x: 0,
  y: 0,
  width: BASE_LAYOUT.width * SCALE.canvas,
  height: BASE_LAYOUT.height * SCALE.canvas,
};

const VIEW_BOX_VALUE = `${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`;

/* =========================================================
   STYLES
========================================================= */

const BASE_COMPONENT = {
  stroke: "#111827",
  strokeWidth: BASE_WIRE_WIDTH * SCALE.wire,
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const STYLE = {
  background: "#ffffff",
  boardBorder: "#dbe3ef",
  wire: "#111827",
  wireGlow: "#cbd5e1",
  text: "#111827",
  node: "#111827",
  vcc: "#dc2626",
  ground: "#0f172a",
  basePulse: "#2563eb",
  loadPulse: "#f97316",
  switchOn: "#16a34a",
  switchOff: "#dc2626",
} as const;

/* =========================================================
   TYPES
========================================================= */

type Point = { x: number; y: number };

type ComponentBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
};

type NpnTransistorSwitchingCircuitProps = {
  batteryVoltage?: number;
  rbOhms?: number;
  rpdOhms?: number;
  rLedOhms?: number;
  flowSpeed?: number;
  switchClosed?: boolean;
  baseVoltage?: number;
  collectorVoltage?: number;
  emitterVoltage?: number;
  baseCurrentMa?: number;
  collectorCurrentMa?: number;
  ledBrightness?: number;
  basePathActive?: boolean;
  loadPathActive?: boolean;
  mode?: NpnWorkingMode;
  flowMode?: CurrentFlowMode;
};

/* =========================================================
   HELPERS
========================================================= */

function formatNumber(value: number, digits = 2) {
  return Number.isFinite(value) ? value.toFixed(digits) : "0";
}

function formatOhmsCompact(value: number) {
  if (value >= 1000) return `${formatNumber(value / 1000, 1)}kOhm`;
  return `${formatNumber(value, 0)}Ohm`;
}

function clampValue(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function pathD(points: readonly Point[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

function reversePath(points: readonly Point[]) {
  return [...points].reverse();
}

function scaleComponentOffset(value: number) {
  return value * SCALE.component;
}

function scaleComponent(component: ComponentBox): ComponentBox {
  return {
    ...component,
    width: component.width * SCALE.component,
    height: component.height * SCALE.component,
  };
}

function pointOnComponent(
  component: ComponentBox,
  xOffset: number,
  yOffset: number,
): Point {
  return {
    x: component.x + scaleComponentOffset(xOffset),
    y: component.y + scaleComponentOffset(yOffset),
  };
}

function placeNearComponent(
  component: ComponentBox,
  xOffset = 0,
  yOffset = 0,
): Point {
  return {
    x: component.x + scaleComponentOffset(xOffset),
    y: component.y + scaleComponentOffset(yOffset),
  };
}

/* =========================================================
   COMPONENT
========================================================= */

const COMPONENT = {
  source: scaleComponent({ x: 66, y: 220, width: 116, height: 156, rotate: 0 }),

  button: scaleComponent({
    x: 304,
    y: 48,
    width: 190,
    height: 130,
    rotate: 90,
  }),

  baseResistor: scaleComponent({
    x: 304,
    y: 178,
    width: 150,
    height: 120,
    rotate: 90,
  }),

  pullDownResistor: scaleComponent({
    x: 410,
    y: 380,
    width: 150,
    height: 120,
    rotate: 90,
  }),

  ledResistor: scaleComponent({
    x: 620,
    y: 56,
    width: 170,
    height: 130,
    rotate: 90,
  }),

  led: scaleComponent({
    x: 650,
    y: 190,
    width: 130,
    height: 110,
    rotate: 90,
  }),

  transistor: scaleComponent({
    x: 512,
    y: 281,
    width: 190,
    height: 210,
    rotate: 0,
  }),
} as const;

/* =========================================================
   NODE
========================================================= */

const NODE = {
  positiveRailY: 112,
  negativeRailY: 570,

  sourcePositiveTerminal: pointOnComponent(COMPONENT.source, 44, 38),

  sourceNegativeTerminal: pointOnComponent(COMPONENT.source, 44, 106),

  vccRailStart: { x: pointOnComponent(COMPONENT.source, 44, 0).x, y: 112 },

  vccSwitchSplit: {
    x: COMPONENT.button.x,
    y: 112,
  },

  vccLoadSplit: {
    x: COMPONENT.ledResistor.x,
    y: 112,
  },

  buttonUpperTerminal: pointOnComponent(COMPONENT.button, 0, 104),

  buttonLowerTerminal: pointOnComponent(COMPONENT.button, 0, 154),

  buttonOutputStub: pointOnComponent(COMPONENT.button, 0, 198),

  baseResistorTerminal1: pointOnComponent(COMPONENT.baseResistor, 0, 102),

  baseResistorTerminal2: pointOnComponent(COMPONENT.baseResistor, 0, 162),

  baseNode: {
    x: COMPONENT.transistor.x + scaleComponentOffset(87),
    y: COMPONENT.transistor.y + scaleComponentOffset(105),
  },

  pullDownTop: pointOnComponent(COMPONENT.pullDownResistor, 0, 108),

  pullDownBottom: pointOnComponent(COMPONENT.pullDownResistor, 0, 160),

  ledResistorTerminal1: pointOnComponent(COMPONENT.ledResistor, 0, 110),

  ledResistorTerminal2: pointOnComponent(COMPONENT.ledResistor, 0, 100),

  ledAnode: {
    x: COMPONENT.ledResistor.x,
    y: COMPONENT.led.y + scaleComponentOffset(-30),
  },

  ledCathode: {
    x: COMPONENT.ledResistor.x,
    y: COMPONENT.led.y + scaleComponentOffset(82),
  },

  transistorCollector: pointOnComponent(COMPONENT.transistor, 107, 24),

  transistorBase: pointOnComponent(COMPONENT.transistor, 34, 104),

  transistorEmitter: pointOnComponent(COMPONENT.transistor, 108, 170),

  collectorChannelPoint: pointOnComponent(COMPONENT.transistor, 110, 78),

  baseJunctionPoint: pointOnComponent(COMPONENT.transistor, 82, 112),

  emitterChannelPoint: pointOnComponent(COMPONENT.transistor, 110, 150),

  groundFromSource: {
    x: pointOnComponent(COMPONENT.source, 44, 0).x,
    y: 570,
  },

  groundPullDownJoin: {
    x: COMPONENT.pullDownResistor.x,
    y: 570,
  },

  groundEmitterJoin: {
    x: pointOnComponent(COMPONENT.transistor, 108, 0).x,
    y: 570,
  },
} as const;

/* =========================================================
   WIRE
========================================================= */

const WIRE = {
  width: BASE_WIRE_WIDTH * SCALE.wire,

  sourcePositiveDrop: [NODE.sourcePositiveTerminal, NODE.vccRailStart],

  positiveRailMain: [NODE.vccRailStart, NODE.vccSwitchSplit, NODE.vccLoadSplit],

  switchFeed: [NODE.vccSwitchSplit, NODE.buttonUpperTerminal],

  switchToBaseResistor: [
    NODE.buttonLowerTerminal,
    NODE.buttonOutputStub,
    { x: NODE.baseResistorTerminal1.x, y: NODE.buttonOutputStub.y },
    NODE.baseResistorTerminal1,
  ],

  baseResistorToBaseNode: [
    NODE.baseResistorTerminal2,
    { x: NODE.baseResistorTerminal2.x, y: NODE.baseNode.y },
    NODE.baseNode,
  ],

  baseNodeToBase: [NODE.baseNode, NODE.transistorBase],

  pullDownBranch: [
    NODE.baseNode,
    { x: NODE.pullDownTop.x, y: NODE.baseNode.y },
    NODE.pullDownTop,
  ],

  pullDownReturn: [NODE.pullDownBottom, NODE.groundPullDownJoin],

  loadFeed: [NODE.vccLoadSplit, NODE.ledResistorTerminal1],

  ledResistorToLed: [NODE.ledResistorTerminal2, NODE.ledAnode],

  ledToCollector: [
    NODE.ledCathode,
    { x: NODE.ledCathode.x, y: NODE.transistorCollector.y },
    NODE.transistorCollector,
  ],

  sourceNegativeDrop: [NODE.sourceNegativeTerminal, NODE.groundFromSource],

  groundRail: [
    NODE.groundFromSource,
    NODE.groundPullDownJoin,
    NODE.groundEmitterJoin,
  ],

  emitterToGround: [NODE.transistorEmitter, NODE.groundEmitterJoin],
} as const;

/* =========================================================
   CURRENT PATH
========================================================= */

const PATH = {
  baseCurrent: [
    NODE.sourcePositiveTerminal,
    NODE.vccRailStart,
    NODE.vccSwitchSplit,
    ...WIRE.switchFeed.slice(1),
    ...WIRE.switchToBaseResistor.slice(1),
    ...WIRE.baseResistorToBaseNode.slice(1),
    ...WIRE.baseNodeToBase.slice(1),
    NODE.baseJunctionPoint,
    NODE.emitterChannelPoint,
    NODE.transistorEmitter,
    NODE.groundEmitterJoin,
    NODE.groundPullDownJoin,
    NODE.groundFromSource,
    NODE.sourceNegativeTerminal,
  ],

  loadCurrent: [
    NODE.sourcePositiveTerminal,
    NODE.vccRailStart,
    ...WIRE.positiveRailMain.slice(1),
    ...WIRE.loadFeed.slice(1),
    ...WIRE.ledResistorToLed,
    ...WIRE.ledToCollector.slice(1),
    NODE.collectorChannelPoint,
    NODE.emitterChannelPoint,
    NODE.transistorEmitter,
    NODE.groundEmitterJoin,
    NODE.groundPullDownJoin,
    NODE.groundFromSource,
    NODE.sourceNegativeTerminal,
  ],
} as const;

/* =========================================================
   LABEL
========================================================= */

const LABEL = {
  sourceVoltage: placeNearComponent(COMPONENT.source, 18, 16),

  rLedName: placeNearComponent(COMPONENT.ledResistor, 34, 68),

  rLedValue: placeNearComponent(COMPONENT.ledResistor, 34, 92),

  rbName: placeNearComponent(COMPONENT.baseResistor, 30, 64),

  rbValue: placeNearComponent(COMPONENT.baseResistor, 30, 88),

  rpdName: placeNearComponent(COMPONENT.pullDownResistor, 44, 54),

  rpdValue: placeNearComponent(COMPONENT.pullDownResistor, 44, 82),

  status: {
    x: 58,
    y: 54,
  },

  mode: {
    x: 214,
    y: 54,
  },

  values: {
    x: 506,
    y: 54,
  },

  current: {
    x: 58,
    y: 626,
  },

  vcc: {
    x: NODE.vccRailStart.x - 22,
    y: NODE.positiveRailY - 12,
  },

  gnd: {
    x: NODE.groundFromSource.x - 22,
    y: NODE.negativeRailY + 28,
  },
} as const;

/* =========================================================
   REUSABLE SVG BLOCKS
========================================================= */

function WirePath({ points }: { points: readonly Point[] }) {
  return (
    <path
      d={pathD(points)}
      stroke={STYLE.wire}
      strokeWidth={WIRE.width}
      fill="none"
      strokeLinecap={BASE_COMPONENT.strokeLinecap}
      strokeLinejoin={BASE_COMPONENT.strokeLinejoin}
    />
  );
}

function NodeDot({
  point,
  fill = STYLE.node,
  radius = 4.5 * SCALE.wire,
}: {
  point: Point;
  fill?: string;
  radius?: number;
}) {
  return (
    <circle
      cx={point.x}
      cy={point.y}
      r={radius}
      fill={fill}
      stroke="#ffffff"
      strokeWidth={1.5 * SCALE.wire}
    />
  );
}

function CurrentPulse({
  points,
  active,
  color,
  delay = "0s",
  duration = "2.2s",
  radius = 5.5 * SCALE.wire,
}: {
  points: readonly Point[];
  active: boolean;
  color: string;
  delay?: string;
  duration?: string;
  radius?: number;
}) {
  if (!active) return null;

  return (
    <circle r={radius} fill={color} opacity={0.98}>
      <animateMotion
        dur={duration}
        begin={delay}
        repeatCount="indefinite"
        path={pathD(points)}
      />
    </circle>
  );
}

function CurrentPathHighlight({
  points,
  active,
  color,
}: {
  points: readonly Point[];
  active: boolean;
  color: string;
}) {
  if (!active) return null;

  return (
    <g>
      <path
        d={pathD(points)}
        fill="none"
        stroke={color}
        strokeWidth={WIRE.width + 3.4 * SCALE.wire}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.12}
      />
      <path
        d={pathD(points)}
        fill="none"
        stroke={color}
        strokeWidth={WIRE.width + 1.2 * SCALE.wire}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={`${16 * SCALE.wire} ${16 * SCALE.wire}`}
        opacity={0.85}
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to={`${-32 * SCALE.wire}`}
          dur="1.2s"
          repeatCount="indefinite"
        />
      </path>
    </g>
  );
}

function WireLayer() {
  return (
    <g>
      <WirePath points={WIRE.sourcePositiveDrop} />
      <WirePath points={WIRE.positiveRailMain} />
      <WirePath points={WIRE.switchFeed} />
      <WirePath points={WIRE.switchToBaseResistor} />
      <WirePath points={WIRE.baseResistorToBaseNode} />
      <WirePath points={WIRE.baseNodeToBase} />
      <WirePath points={WIRE.pullDownBranch} />
      <WirePath points={WIRE.pullDownReturn} />
      <WirePath points={WIRE.loadFeed} />
      <WirePath points={WIRE.ledResistorToLed} />
      <WirePath points={WIRE.ledToCollector} />
      <WirePath points={WIRE.sourceNegativeDrop} />
      <WirePath points={WIRE.groundRail} />
      <WirePath points={WIRE.emitterToGround} />
    </g>
  );
}

function NodeLayer() {
  return (
    <g>
      <NodeDot point={NODE.vccSwitchSplit} fill={STYLE.vcc} />
      <NodeDot point={NODE.vccLoadSplit} fill={STYLE.vcc} />
      <NodeDot point={NODE.transistorCollector} fill={STYLE.loadPulse} />
      <NodeDot point={NODE.transistorEmitter} fill={STYLE.ground} />
      <NodeDot point={NODE.groundFromSource} fill={STYLE.ground} />
      <NodeDot point={NODE.groundPullDownJoin} fill={STYLE.ground} />
      <NodeDot point={NODE.groundEmitterJoin} fill={STYLE.ground} />
    </g>
  );
}

function CurrentFlowOverlay({
  basePathActive,
  loadPathActive,
  flowMode,
  batteryVoltage,
  baseCurrentMa,
  collectorCurrentMa,
  flowSpeed,
}: {
  basePathActive: boolean;
  loadPathActive: boolean;
  flowMode: CurrentFlowMode;
  batteryVoltage: number;
  baseCurrentMa: number;
  collectorCurrentMa: number;
  flowSpeed: number;
}) {
  const basePoints =
    flowMode === "electron" ? reversePath(PATH.baseCurrent) : PATH.baseCurrent;
  const loadPoints =
    flowMode === "electron" ? reversePath(PATH.loadCurrent) : PATH.loadCurrent;
  const voltageFactor = clampValue(batteryVoltage / 12, 0.2, 1);
  const baseStrength = clampValue(baseCurrentMa / 0.35, 0, 1);
  const loadStrength = clampValue(collectorCurrentMa / 3, 0, 1);
  const basePulseCount = basePathActive
    ? Math.max(1, Math.round(1 + baseStrength * 3 + voltageFactor))
    : 0;
  const loadPulseCount = loadPathActive
    ? Math.max(1, Math.round(2 + loadStrength * 4 + voltageFactor))
    : 0;
  const speedFactor = clampValue(flowSpeed, 0.5, 3);
  const baseDuration = `${clampValue(
    (2.8 - baseStrength * 1.2 - voltageFactor * 0.4) / speedFactor,
    0.45,
    5.6,
  ).toFixed(2)}s`;
  const loadDuration = `${clampValue(
    (2.5 - loadStrength * 1.1 - voltageFactor * 0.35) / speedFactor,
    0.4,
    5,
  ).toFixed(2)}s`;
  const baseRadius = clampValue(4 + baseStrength * 1.8, 4, 5.8) * SCALE.wire;
  const loadRadius =
    clampValue(4.6 + loadStrength * 1.8, 4.6, 6.4) * SCALE.wire;

  return (
    <g>
      <CurrentPathHighlight
        points={basePoints}
        active={basePathActive}
        color={STYLE.basePulse}
      />
      <CurrentPathHighlight
        points={loadPoints}
        active={loadPathActive}
        color={STYLE.loadPulse}
      />
      {Array.from({ length: basePulseCount }, (_, index) => (
        <CurrentPulse
          key={`base-${index}`}
          points={basePoints}
          active={basePathActive}
          color={STYLE.basePulse}
          delay={`${(index * 0.26).toFixed(2)}s`}
          duration={baseDuration}
          radius={baseRadius}
        />
      ))}
      {Array.from({ length: loadPulseCount }, (_, index) => (
        <CurrentPulse
          key={`load-${index}`}
          points={loadPoints}
          active={loadPathActive}
          color={STYLE.loadPulse}
          delay={`${(index * 0.22).toFixed(2)}s`}
          duration={loadDuration}
          radius={loadRadius}
        />
      ))}
    </g>
  );
}

function SourceBlock() {
  return (
    <svg
      x={COMPONENT.source.x}
      y={COMPONENT.source.y}
      width={COMPONENT.source.width}
      height={COMPONENT.source.height}
      viewBox={`0 0 ${COMPONENT.source.width} ${COMPONENT.source.height}`}
      overflow="visible"
    >
      <DCVoltageSourceV1Symbol
        width={COMPONENT.source.width}
        height={COMPONENT.source.height}
        label="Vcc DC source"
      />
    </svg>
  );
}

function RotatedResistorBlock({
  component,
  label,
}: {
  component: ComponentBox;
  label: string;
}) {
  return (
    <svg
      x={component.x}
      y={component.y}
      width={component.width}
      height={component.height}
      viewBox={`0 0 ${component.width} ${component.height}`}
      overflow="visible"
    >
      <g
        transform={`translate(${component.width / 2} ${
          component.height / 2
        }) rotate(${component.rotate})`}
      >
        <ResistorSymbol
          width={component.height}
          height={component.width}
          label={label}
        />
      </g>
    </svg>
  );
}

function ButtonBlock({ switchClosed }: { switchClosed: boolean }) {
  return (
    <svg
      x={COMPONENT.button.x}
      y={COMPONENT.button.y}
      width={COMPONENT.button.width}
      height={COMPONENT.button.height}
      viewBox={`0 0 ${COMPONENT.button.width} ${COMPONENT.button.height}`}
      overflow="visible"
    >
      <g
        transform={`translate(${COMPONENT.button.width / 2} ${
          COMPONENT.button.height / 2
        }) rotate(${COMPONENT.button.rotate})`}
      >
        <SPSTSwitchSymbol
          width={COMPONENT.button.height}
          height={COMPONENT.button.width}
          label={switchClosed ? "SW CLOSED" : "SW OPEN"}
          isClosed={switchClosed}
          closed={switchClosed}
          active={switchClosed}
        />
      </g>
    </svg>
  );
}

function LedGlow({ ledBrightness }: { ledBrightness: number }) {
  if (ledBrightness <= 0) return null;

  const opacity = Math.min(Math.max(ledBrightness / 100, 0), 1);
  const centerX = COMPONENT.led.x + COMPONENT.led.width / 2;
  const centerY = COMPONENT.led.y + COMPONENT.led.height / 2;

  return (
    <g>
      <circle
        cx={centerX - scaleComponentOffset(97)}
        cy={centerY + scaleComponentOffset(12)}
        r={scaleComponentOffset(30)}
        fill={`rgba(251, 191, 36, ${0.14 * opacity})`}
      />
      <circle
        cx={centerX - scaleComponentOffset(97)}
        cy={centerY + scaleComponentOffset(12)}
        r={scaleComponentOffset(15)}
        fill={`rgba(250, 204, 21, ${0.24 * opacity})`}
      />
    </g>
  );
}

function LedBlock() {
  return (
    <svg
      x={COMPONENT.led.x + scaleComponentOffset(-23)}
      y={COMPONENT.led.y + scaleComponentOffset(-40)}
      width={COMPONENT.led.width}
      height={COMPONENT.led.height}
      viewBox={`0 0 ${COMPONENT.led.width} ${COMPONENT.led.height}`}
      overflow="visible"
    >
      <g
        transform={`translate(${COMPONENT.led.width / 2} ${
          COMPONENT.led.height / 2
        }) rotate(${COMPONENT.led.rotate})`}
      >
        <LEDSymbol
          width={COMPONENT.led.height}
          height={COMPONENT.led.width}
          label="LED"
        />
      </g>
    </svg>
  );
}

function TransistorBlock() {
  return (
    <svg
      x={COMPONENT.transistor.x}
      y={COMPONENT.transistor.y}
      width={COMPONENT.transistor.width}
      height={COMPONENT.transistor.height}
      viewBox={`0 0 ${COMPONENT.transistor.width} ${COMPONENT.transistor.height}`}
      overflow="visible"
    >
      <NPNTransistorSymbol
        width={COMPONENT.transistor.width}
        height={COMPONENT.transistor.height}
        label="Q1 2N3904"
      />
    </svg>
  );
}

function RailLabels() {
  return (
    <g
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="800"
      textAnchor="start"
    >
      <text x={LABEL.vcc.x} y={LABEL.vcc.y} fontSize="13" fill={STYLE.vcc}>
        +Vcc
      </text>
      <text x={LABEL.gnd.x} y={LABEL.gnd.y} fontSize="13" fill={STYLE.ground}>
        0V / GND
      </text>
    </g>
  );
}

function DynamicTextLabels({
  batteryVoltage,
  rbOhms,
  rpdOhms,
  rLedOhms,
  switchClosed,
  baseVoltage,
  collectorVoltage,
  emitterVoltage,
  baseCurrentMa,
  collectorCurrentMa,
  mode,
  flowMode,
}: {
  batteryVoltage: number;
  rbOhms: number;
  rpdOhms: number;
  rLedOhms: number;
  switchClosed: boolean;
  baseVoltage: number;
  collectorVoltage: number;
  emitterVoltage: number;
  baseCurrentMa: number;
  collectorCurrentMa: number;
  mode: NpnWorkingMode;
  flowMode: CurrentFlowMode;
}) {
  return (
    <g
      fill={STYLE.text}
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="700"
      textAnchor="start"
    >
      <text x={LABEL.sourceVoltage.x} y={LABEL.sourceVoltage.y} fontSize="18">
        {formatNumber(batteryVoltage, 1)}V
      </text>

      <text x={LABEL.rLedName.x} y={LABEL.rLedName.y} fontSize="18">
        R_LED
      </text>
      <text x={LABEL.rLedValue.x} y={LABEL.rLedValue.y} fontSize="16">
        {formatOhmsCompact(rLedOhms)}
      </text>

      <text x={LABEL.rbName.x} y={LABEL.rbName.y} fontSize="18">
        RB
      </text>
      <text x={LABEL.rbValue.x} y={LABEL.rbValue.y} fontSize="16">
        {formatOhmsCompact(rbOhms)}
      </text>

      <text x={LABEL.rpdName.x} y={LABEL.rpdName.y} fontSize="18">
        RPD
      </text>
      <text x={LABEL.rpdValue.x} y={LABEL.rpdValue.y} fontSize="16">
        {formatOhmsCompact(rpdOhms)}
      </text>

      <text x={LABEL.status.x} y={LABEL.status.y} fontSize="16">
        SW {switchClosed ? "CLOSED" : "OPEN"}
      </text>

      <text x={LABEL.mode.x} y={LABEL.mode.y} fontSize="16">
        MODE {mode.toUpperCase()}
      </text>

      <text x={LABEL.status.x} y={LABEL.status.y + 24} fontSize="16">
        {flowMode === "electron" ? "ELECTRON FLOW" : "CONVENTIONAL FLOW"}
      </text>

      <text x={LABEL.values.x} y={LABEL.values.y} fontSize="16">
        VB {formatNumber(baseVoltage, 2)}V
      </text>

      <text x={LABEL.values.x} y={LABEL.values.y + 22} fontSize="16">
        VC {formatNumber(collectorVoltage, 2)}V
      </text>

      <text x={LABEL.values.x} y={LABEL.values.y + 44} fontSize="16">
        VE {formatNumber(emitterVoltage, 2)}V
      </text>

      <text x={LABEL.current.x} y={LABEL.current.y} fontSize="16">
        IB {formatNumber(baseCurrentMa, 3)}mA
      </text>

      <text x={LABEL.current.x} y={LABEL.current.y + 24} fontSize="16">
        IC {formatNumber(collectorCurrentMa, 3)}mA
      </text>

      <text
        x={NODE.transistorBase.x - scaleComponentOffset(72)}
        y={NODE.transistorBase.y - scaleComponentOffset(12)}
        fontSize="15"
        fill={STYLE.basePulse}
      >
        B {formatNumber(baseVoltage, 2)}V
      </text>
      <text
        x={NODE.transistorCollector.x - scaleComponentOffset(18)}
        y={NODE.transistorCollector.y - scaleComponentOffset(18)}
        fontSize="15"
        fill={STYLE.loadPulse}
      >
        C {formatNumber(collectorVoltage, 2)}V
      </text>
      <text
        x={NODE.transistorEmitter.x - scaleComponentOffset(8)}
        y={NODE.transistorEmitter.y + scaleComponentOffset(32)}
        fontSize="15"
        fill={STYLE.ground}
      >
        E {formatNumber(emitterVoltage, 2)}V
      </text>
    </g>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function NpnTransistorSwitchingCircuit({
  batteryVoltage = 5,
  rbOhms = 10000,
  rpdOhms = 100000,
  rLedOhms = 1000,
  flowSpeed = 1,
  switchClosed = false,
  baseVoltage = 0,
  collectorVoltage = batteryVoltage,
  emitterVoltage = 0,
  baseCurrentMa = 0,
  collectorCurrentMa = 0,
  ledBrightness = 0,
  basePathActive = false,
  loadPathActive = false,
  mode = "cutoff",
  flowMode = "conventional",
}: NpnTransistorSwitchingCircuitProps) {
  return (
    <div
      style={{
        background: STYLE.background,
        borderRadius: 24,
        border: `1px solid ${STYLE.boardBorder}`,
        padding: 16,
        minHeight: VIEW_BOX.height,
        width: "100%",
      }}
    >
      <svg
        width={VIEW_BOX.width}
        height={VIEW_BOX.height}
        viewBox={VIEW_BOX_VALUE}
        preserveAspectRatio="xMidYMin meet"
        role="img"
        aria-label="NPN transistor switching circuit with conventional current flow"
        style={{
          display: "block",
          width: "100%",
          maxWidth: `${VIEW_BOX.width}px`,
          height: "auto",
          margin: "0 auto",
          overflow: "visible",
        }}
      >
        <g transform={`scale(${SCALE.canvas})`}>
          <RailLabels />

          <WireLayer />

          <CurrentFlowOverlay
            basePathActive={basePathActive}
            loadPathActive={loadPathActive}
            flowMode={flowMode}
            batteryVoltage={batteryVoltage}
            baseCurrentMa={baseCurrentMa}
            collectorCurrentMa={collectorCurrentMa}
            flowSpeed={flowSpeed}
          />

          <NodeLayer />

          <SourceBlock />

          <ButtonBlock switchClosed={switchClosed} />

          <RotatedResistorBlock
            component={COMPONENT.baseResistor}
            label="Base resistor"
          />

          <RotatedResistorBlock
            component={COMPONENT.pullDownResistor}
            label="Pull-down resistor"
          />

          <RotatedResistorBlock
            component={COMPONENT.ledResistor}
            label="Resistor"
          />

          <LedGlow ledBrightness={ledBrightness} />

          <LedBlock />

          <TransistorBlock />

          <DynamicTextLabels
            batteryVoltage={batteryVoltage}
            rbOhms={rbOhms}
            rpdOhms={rpdOhms}
            rLedOhms={rLedOhms}
            switchClosed={switchClosed}
            baseVoltage={baseVoltage}
            collectorVoltage={collectorVoltage}
            emitterVoltage={emitterVoltage}
            baseCurrentMa={baseCurrentMa}
            collectorCurrentMa={collectorCurrentMa}
            mode={mode}
            flowMode={flowMode}
          />
        </g>
      </svg>
    </div>
  );
}
