"use client";

import LEDSymbol from "../../../../library/electronics-symbol-library/diodes/LEDSymbol";
import ResistorSymbol from "../../../../library/electronics-symbol-library/passive/ResistorSymbol";
import DCVoltageSourceV1Symbol from "../../../../library/electronics-symbol-library/sources/DCVoltageSourceV1Symbol";
import SPSTSwitchSymbol from "../../../../library/electronics-symbol-library/switch-topology/SPSTSwitchSymbol";
import PNPTransistorSymbol from "../../../../library/electronics-symbol-library/transistors/PNPTransistorSymbol";
import {
  BASE_COMPONENT,
  LABEL,
  NODE,
  PATH,
  PNP_CIRCUIT_MODEL,
  SCALE,
  STYLE,
  WIRE,
  clampValue,
  pathD,
  reversePath,
  scaleComponentOffset,
  type ComponentBox,
  type Point,
} from "./PnpCircuitLayout";
import type { CurrentFlowMode, PnpWorkingMode } from "./simulationTypes";

/* =========================================================
   FORMAT HELPERS
========================================================= */

function formatNumber(value: number, digits = 2) {
  return Number.isFinite(value) ? value.toFixed(digits) : "0";
}

function formatOhmsCompact(value: number) {
  if (value >= 1000) return `${formatNumber(value / 1000, 1)}kOhm`;
  return `${formatNumber(value, 0)}Ohm`;
}

/* =========================================================
   BASIC WIRE + NODE BLOCKS
========================================================= */

export function WirePath({ points }: { points: readonly Point[] }) {
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

export function NodeDot({
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

/* =========================================================
   CURRENT FLOW ANIMATION
========================================================= */

function CurrentPulse({
  points,
  active,
  color,
  delay = "0s",
  duration = "2s",
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

export function CurrentFlowOverlay({
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
  const speedFactor = clampValue(flowSpeed, 0.5, 3);

  const basePulseCount = basePathActive
    ? Math.max(1, Math.round(1 + baseStrength * 3 + voltageFactor))
    : 0;

  const loadPulseCount = loadPathActive
    ? Math.max(1, Math.round(2 + loadStrength * 4 + voltageFactor))
    : 0;

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

/* =========================================================
   WIRE LAYER
========================================================= */

export function WireLayer() {
  return (
    <g>
      <WirePath points={WIRE.sourcePositiveDrop} />
      <WirePath points={WIRE.positiveRailMain} />
      <WirePath points={WIRE.emitterToRail} />
      <WirePath points={WIRE.pullUpFeed} />
      <WirePath points={WIRE.pullUpToBaseNode} />
      <WirePath points={WIRE.baseNodeToBase} />
      <WirePath points={WIRE.baseNodeToBaseResistor} />
      <WirePath points={WIRE.baseResistorToSwitch} />

      {/* Button terminal 2 to GND wire */}
      <WirePath points={WIRE.switchToGround} />

      <WirePath points={WIRE.collectorToLed} />
      {/* <WirePath points={WIRE.ledToResistor} /> */}
      {/* <WirePath points={WIRE.resistorToGround} /> */}
      <WirePath points={WIRE.sourceNegativeDrop} />
      <WirePath points={WIRE.groundRail} />
    </g>
  );
}

/* =========================================================
   NODE LAYER
========================================================= */

export function NodeLayer() {
  return (
    <g>
      <NodeDot point={NODE.transistorEmitter} fill={STYLE.vcc} />
      <NodeDot point={NODE.transistorCollector} fill={STYLE.loadPulse} />
      <NodeDot point={NODE.groundFromSource} fill={STYLE.ground} />

      {/* Black dot added again for switch-to-ground junction */}
      <NodeDot point={NODE.groundSwitchJoin} fill={STYLE.ground} />

      <NodeDot point={NODE.groundLoadJoin} fill={STYLE.ground} />
    </g>
  );
}

/* =========================================================
   SOURCE BLOCK
========================================================= */

export function SourceBlock() {
  const { source } = PNP_CIRCUIT_MODEL.COMPONENT;

  return (
    <svg
      x={source.x}
      y={source.y}
      width={source.width}
      height={source.height}
      viewBox={`0 0 ${source.width} ${source.height}`}
      overflow="visible"
    >
      <DCVoltageSourceV1Symbol
        width={source.width}
        height={source.height}
        label="Vcc DC source"
      />
    </svg>
  );
}

/* =========================================================
   RESISTOR BLOCK
========================================================= */

export function RotatedResistorBlock({
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
        transform={`translate(${component.width / 2} ${component.height / 2}) rotate(${component.rotate})`}
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

/* =========================================================
   SWITCH BLOCK
========================================================= */

export function ButtonBlock({ switchClosed }: { switchClosed: boolean }) {
  const { button } = PNP_CIRCUIT_MODEL.COMPONENT;

  return (
    <svg
      x={button.x - 20}
      y={button.y - 40}
      width={button.width}
      height={button.height}
      viewBox={`0 0 ${button.width} ${button.height}`}
      overflow="visible"
    >
      <g
        transform={`translate(${button.width / 2} ${button.height / 2}) rotate(${button.rotate})`}
      >
        <SPSTSwitchSymbol
          width={button.height}
          height={button.width}
          label={switchClosed ? "SW CLOSED" : "SW OPEN"}
          isClosed={switchClosed}
          closed={switchClosed}
          active={switchClosed}
        />
      </g>
    </svg>
  );
}

/* =========================================================
   LED GLOW
========================================================= */

export function LedGlow({ ledBrightness }: { ledBrightness: number }) {
  if (ledBrightness <= 0) return null;

  const { led } = PNP_CIRCUIT_MODEL.COMPONENT;
  const opacity = Math.min(Math.max(ledBrightness / 100, 0), 1);
  const centerX = led.x + led.width / 3;
  const centerY = led.y + led.height + 65;

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

/* =========================================================
   LED BLOCK
========================================================= */

export function LedBlock() {
  const { led } = PNP_CIRCUIT_MODEL.COMPONENT;

  return (
    <svg
      x={led.x + scaleComponentOffset(-50)}
      y={led.y + scaleComponentOffset(+80)}
      width={led.width}
      height={led.height}
      viewBox={`0 0 ${led.width} ${led.height}`}
      overflow="visible"
    >
      <g
        transform={`translate(${led.width / 2} ${led.height / 2}) rotate(${led.rotate})`}
      >
        <LEDSymbol width={led.height} height={led.width} label="LED" />
      </g>
    </svg>
  );
}

/* =========================================================
   TRANSISTOR BLOCK
========================================================= */

export function TransistorBlock() {
  const { transistor } = PNP_CIRCUIT_MODEL.COMPONENT;

  return (
    <svg
      x={transistor.x}
      y={transistor.y - 1}
      width={transistor.width}
      height={transistor.height}
      viewBox={`0 0 ${transistor.width} ${transistor.height}`}
      overflow="visible"
    >
      <PNPTransistorSymbol
        width={transistor.width}
        height={transistor.height}
        label="Q1 PNP transistor"
      />
    </svg>
  );
}

/* =========================================================
   RAIL LABELS
========================================================= */

export function RailLabels() {
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

/* =========================================================
   DYNAMIC TEXT LABELS
========================================================= */

export function DynamicTextLabels({
  batteryVoltage,
  rbOhms,
  rpuOhms,
  rLedOhms,
  switchClosed,
  emitterVoltage,
  baseVoltage,
  collectorVoltage,
  baseCurrentMa,
  collectorCurrentMa,
  mode,
  flowMode,
}: {
  batteryVoltage: number;
  rbOhms: number;
  rpuOhms: number;
  rLedOhms: number;
  switchClosed: boolean;
  emitterVoltage: number;
  baseVoltage: number;
  collectorVoltage: number;
  baseCurrentMa: number;
  collectorCurrentMa: number;
  mode: PnpWorkingMode;
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

      <text x={LABEL.rpuName.x} y={LABEL.rpuName.y} fontSize="18">
        RPU
      </text>
      <text x={LABEL.rpuValue.x} y={LABEL.rpuValue.y} fontSize="16">
        {formatOhmsCompact(rpuOhms)}
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
        VE {formatNumber(emitterVoltage, 2)}V
      </text>
      <text x={LABEL.values.x} y={LABEL.values.y + 22} fontSize="16">
        VB {formatNumber(baseVoltage, 2)}V
      </text>
      <text x={LABEL.values.x} y={LABEL.values.y + 44} fontSize="16">
        VC {formatNumber(collectorVoltage, 2)}V
      </text>

      <text x={LABEL.current.x} y={LABEL.current.y} fontSize="16">
        IB {formatNumber(baseCurrentMa, 3)}mA
      </text>
      <text x={LABEL.current.x} y={LABEL.current.y + 24} fontSize="16">
        IC {formatNumber(collectorCurrentMa, 3)}mA
      </text>

      <text
        x={LABEL.baseVoltage.x}
        y={LABEL.baseVoltage.y}
        fontSize="15"
        fill={STYLE.basePulse}
      >
        B {formatNumber(baseVoltage, 2)}V
      </text>
      <text
        x={LABEL.collectorVoltage.x}
        y={LABEL.collectorVoltage.y}
        fontSize="15"
        fill={STYLE.loadPulse}
      >
        C {formatNumber(collectorVoltage, 2)}V
      </text>
      <text
        x={LABEL.emitterVoltage.x}
        y={LABEL.emitterVoltage.y}
        fontSize="15"
        fill={STYLE.vcc}
      >
        E {formatNumber(emitterVoltage, 2)}V
      </text>
    </g>
  );
}
