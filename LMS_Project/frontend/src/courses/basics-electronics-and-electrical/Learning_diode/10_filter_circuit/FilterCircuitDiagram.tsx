"use client";

import {
  DiodeSymbol as LibraryDiodeSymbol,
  LEDSymbol as LibraryLedSymbol,
  PolarizedCapacitorSymbol as LibraryPolarizedCapacitorSymbol,
  Transformer1PCenterTappedSymbol as LibraryTransformer1PCenterTappedSymbol,
} from "@/src/library";

import { ElectronFlow } from "./ElectronFlow";
import type { WavePoint } from "./types";

const VIEW_BOX = "0 0 760 430";
const VIEW_BOX_WIDTH = 760;
const VIEW_BOX_HEIGHT = 430;
const CIRCUIT_CANVAS_SCALE = 1.2;

const STYLE = {
  text: "#0f172a",
  muted: "#64748b",
  active: "#22c55e",
  ledGlow: "#f59e0b",
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

function getWireStroke(active: boolean) {
  return active ? STYLE.active : "#111827";
}

function buildCanvasScaleTransform(scale: number) {
  if (scale === 1) return undefined;

  const centerX = VIEW_BOX_WIDTH / 2;
  const centerY = VIEW_BOX_HEIGHT / 2;

  return `translate(${centerX} ${centerY}) scale(${scale}) translate(${-centerX} ${-centerY})`;
}

const COMPONENT = {
  transformer: scaleComponent(
    { x: 85, y: 72, width: 220, height: 220, rotate: -90 },
    1,
  ),
  d1: scaleComponent(
    { x: 330, y: 72, width: 110, height: 54, rotate: -1 },
    1.5,
  ),
  d2: scaleComponent(
    { x: 330, y: 232, width: 110, height: 54, rotate: 0 },
    1.5,
  ),
  capacitor: scaleComponent(
    { x: 502, y: 210, width: 86, height: 96, rotate: 90 },
    1.5,
  ),
  led: scaleComponent(
    { x: 635, y: 204, width: 90, height: 112, rotate: 90 },
    1.5,
  ),
} as const;

const NODE = {
  secondaryTop: pointOnComponent(COMPONENT.transformer, 0.8591, 0.3545),
  secondaryCenterTap: pointOnComponent(COMPONENT.transformer, 0.8182, 0.4909),
  secondaryBottom: pointOnComponent(COMPONENT.transformer, 0.8591, 0.65),

  d1Anode: pointOnComponent(COMPONENT.d1, 0.2364, 0.4815),
  d1Cathode: pointOnComponent(COMPONENT.d1, 0.8182, 0.4815),

  d2Anode: pointOnComponent(COMPONENT.d2, 0.2364, 0.4815),
  d2Cathode: pointOnComponent(COMPONENT.d2, 0.8182, 0.4815),

  voutJunction: { x: 460, y: 182 },

  capPositive: pointOnComponent(COMPONENT.capacitor, 0.5, 0.3125),
  capNegative: pointOnComponent(COMPONENT.capacitor, 0.5, 0.6667),

  ledTop: pointOnComponent(COMPONENT.led, 0.5889, -0.3571),
  ledAnode: pointOnComponent(COMPONENT.led, 0.4222, 0.2232),
  ledCathode: pointOnComponent(COMPONENT.led, 0.4222, 0.6161),

  returnJunction: { x: 300, y: 180 },
  returnBottomLeft: { x: 300, y: 330 },
  returnBottomRight: { x: 670, y: 330 },
} as const;

const WIRE = {
  width: 3,

  secondaryToD1Anode: {
    start: NODE.secondaryTop,
    elbow: { x: 270, y: 100 },
    end: NODE.d1Anode,
  },

  secondaryToD2Anode: {
    start: NODE.secondaryBottom,
    elbow: { x: 270, y: 258 },
    end: NODE.d2Anode,
  },

  d1CathodeToVout: {
    start: NODE.d1Cathode,
    vertical: { x: 460, y1: 98, y2: 185 },
  },

  d2CathodeToVout: {
    start: NODE.d2Cathode,
    vertical: { x: 460, y1: 185, y2: 258 },
  },

  voutBusToCapPositive: {
    start: { x: 460, y: 182 },
    branch: { x: 545, y: 182 },
    end: NODE.capPositive,
  },

  voutBusToLedAnode: {
    start: { x: 548, y: 182 },
    end: NODE.ledAnode,
  },

  voutBusDropToLedAnode: {
    x: NODE.ledAnode.x,
    y1: 182,
    y2: NODE.ledAnode.y,
  },

  secondaryCenterTapToReturnLink: {
    start: NODE.secondaryCenterTap,
    end: { x: 300, y: 180 },
  },

  centerTapToReturnBus: {
    start: { x: 300, y: 180 },
    dropY: 330,
    endX: 670,
  },

  returnBusToCapNegative: {
    x: NODE.capNegative.x,
    y1: 330,
    y2: NODE.capNegative.y,
  },

  returnBusToLedCathode: {
    x: NODE.ledCathode.x,
    y1: 332,
    y2: NODE.ledCathode.y,
  },
} as const;

const LABEL = {
  inputVoltage: { x: 112, y: 188 },
  vac: { x: 122, y: 136 },
  transformerCaption: { x: 92, y: 338 },
  vout: { x: 390, y: 190 },
  capacitorName: { x: 568, y: 276 },
  capacitorValue: { x: 568, y: 300 },
  led: { x: 704, y: 254 },
  meter1: { x: 375, y: 372 },
  meter2: { x: 375, y: 390 },
} as const;

function TransformerSymbol() {
  return (
    <g
      transform={`translate(${COMPONENT.transformer.x} ${COMPONENT.transformer.y}) rotate(${COMPONENT.transformer.rotate} ${COMPONENT.transformer.width / 2} ${COMPONENT.transformer.height / 2})`}
    >
      <LibraryTransformer1PCenterTappedSymbol
        width={COMPONENT.transformer.width}
        height={COMPONENT.transformer.height}
        label="TX1"
        showTerminalLabels={false}
      />
    </g>
  );
}

function DiodeSymbol({
  component,
  label,
  active,
}: {
  component: typeof COMPONENT.d1;
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
          opacity="0.14"
        />
      )}

      <g
        transform={`translate(${component.x} ${component.y}) rotate(${component.rotate} ${component.width / 2} ${component.height / 2})`}
        opacity={active ? 1 : 0.62}
      >
        <LibraryDiodeSymbol
          width={component.width}
          height={component.height}
          label={`${label} Rectifier Diode`}
        />
      </g>

      <text
        x={component.x + component.width / 2}
        y={component.y - 10}
        textAnchor="middle"
        fontSize="18"
        fontWeight="900"
        fill={active ? STYLE.active : STYLE.text}
      >
        {label}
      </text>
    </g>
  );
}

function CapacitorSymbol({
  filterEnabled,
  capacitorUf,
  charging,
  discharging,
}: {
  filterEnabled: boolean;
  capacitorUf: number;
  charging: boolean;
  discharging: boolean;
}) {
  return (
    <g opacity={filterEnabled ? 1 : 0.55}>
      {(charging || discharging) && (
        <circle
          cx={NODE.capPositive.x}
          cy={(NODE.capPositive.y + NODE.capNegative.y) / 2}
          r="38"
          fill={STYLE.active}
          opacity="0.11"
        />
      )}

      <g
        transform={`translate(${COMPONENT.capacitor.x} ${COMPONENT.capacitor.y}) rotate(${COMPONENT.capacitor.rotate} ${COMPONENT.capacitor.width / 2} ${COMPONENT.capacitor.height / 2})`}
      >
        <LibraryPolarizedCapacitorSymbol
          width={COMPONENT.capacitor.width}
          height={COMPONENT.capacitor.height}
          label="Filter Capacitor"
        />
      </g>

      <text
        x={LABEL.capacitorName.x}
        y={LABEL.capacitorName.y}
        fill={STYLE.muted}
        fontSize="10"
        fontWeight="700"
      >
        CL
      </text>

      <text
        x={LABEL.capacitorValue.x}
        y={LABEL.capacitorValue.y}
        fill={STYLE.muted}
        fontSize="10"
        fontWeight="900"
      >
        {capacitorUf}uF
      </text>

      <text
        x={LABEL.capacitorValue.x}
        y={LABEL.capacitorValue.y + 16}
        fill={charging ? STYLE.active : discharging ? "#f97316" : STYLE.muted}
        fontSize="10"
        fontWeight="900"
      >
        {charging ? "Charging" : discharging ? "Discharging" : "Standby"}
      </text>
    </g>
  );
}

function LedLoad({ on, blown }: { on: boolean; blown: boolean }) {
  return (
    <g>
      {on && !blown && (
        <circle
          cx={NODE.ledTop.x - 20}
          cy="265"
          r="22"
          fill={STYLE.ledGlow}
          opacity="0.16"
        />
      )}

      {blown && (
        <circle
          cx={NODE.ledTop.x}
          cy="235"
          r="22"
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

      <text
        x={LABEL.led.x}
        y={LABEL.led.y}
        fill={STYLE.muted}
        fontSize="18"
        fontWeight="900"
      >
        LED
      </text>
    </g>
  );
}

export function FilterCircuitDiagram({
  point,
  filterEnabled,
  capacitorUf,
  electronFlowRate,
}: {
  point: WavePoint;
  filterEnabled: boolean;
  capacitorUf: number;
  electronFlowRate: number;
}) {
  const diodeCurrentActive = point.diodeCurrent > 0.0005;
  const loadCurrentActive = point.filteredCurrent > 0.0005;

  const d1Active = point.activeDiode === "D1" && diodeCurrentActive;
  const d2Active = point.activeDiode === "D2" && diodeCurrentActive;

  const rectifierConducting = d1Active || d2Active;

  const capacitorChargingActive =
    filterEnabled && rectifierConducting && point.capacitorCharging;

  const capacitorDischargeActive =
    filterEnabled &&
    !rectifierConducting &&
    loadCurrentActive &&
    point.filteredVout > 0.2;

  const loadWireActive =
    loadCurrentActive || capacitorChargingActive || capacitorDischargeActive;

  const returnWireActive =
    loadCurrentActive || capacitorChargingActive || capacitorDischargeActive;

  const capacitorWireActive =
    capacitorChargingActive || capacitorDischargeActive;

  const d1LoadPath = [
    NODE.secondaryTop,
    { x: WIRE.secondaryToD1Anode.start.x, y: WIRE.secondaryToD1Anode.elbow.y },
    WIRE.secondaryToD1Anode.end,
    NODE.d1Anode,
    NODE.d1Cathode,
    { x: WIRE.d1CathodeToVout.vertical.x, y: WIRE.d1CathodeToVout.start.y },
    { x: WIRE.d1CathodeToVout.vertical.x, y: WIRE.d1CathodeToVout.vertical.y2 },
    NODE.voutJunction,
    WIRE.voutBusToLedAnode.start,
    { x: NODE.ledAnode.x, y: WIRE.voutBusDropToLedAnode.y1 },
    NODE.ledAnode,
    NODE.ledCathode,
    { x: WIRE.returnBusToLedCathode.x, y: WIRE.returnBusToLedCathode.y1 },
    NODE.returnBottomRight,
    NODE.returnBottomLeft,
    NODE.returnJunction,
    NODE.secondaryCenterTap,
  ];

  const d2LoadPath = [
    NODE.secondaryBottom,
    { x: WIRE.secondaryToD2Anode.start.x, y: WIRE.secondaryToD2Anode.elbow.y },
    WIRE.secondaryToD2Anode.end,
    NODE.d2Anode,
    NODE.d2Cathode,
    { x: WIRE.d2CathodeToVout.vertical.x, y: WIRE.d2CathodeToVout.start.y },
    { x: WIRE.d2CathodeToVout.vertical.x, y: WIRE.d2CathodeToVout.vertical.y1 },
    NODE.voutJunction,
    WIRE.voutBusToLedAnode.start,
    { x: NODE.ledAnode.x, y: WIRE.voutBusDropToLedAnode.y1 },
    NODE.ledAnode,
    NODE.ledCathode,
    { x: WIRE.returnBusToLedCathode.x, y: WIRE.returnBusToLedCathode.y1 },
    NODE.returnBottomRight,
    NODE.returnBottomLeft,
    NODE.returnJunction,
    NODE.secondaryCenterTap,
  ];

  const capacitorChargingPath = [
    NODE.voutJunction,
    WIRE.voutBusToCapPositive.branch,
    NODE.capPositive,
    NODE.capNegative,
    { x: NODE.capNegative.x, y: NODE.returnBottomRight.y },
    NODE.returnBottomLeft,
    NODE.returnJunction,
    NODE.secondaryCenterTap,
  ];

  const capacitorDischargePath = [
    NODE.capPositive,
    { x: NODE.capPositive.x, y: NODE.voutJunction.y },
    WIRE.voutBusToLedAnode.start,
    { x: NODE.ledAnode.x, y: WIRE.voutBusDropToLedAnode.y1 },
    NODE.ledAnode,
    NODE.ledCathode,
    { x: WIRE.returnBusToLedCathode.x, y: WIRE.returnBusToLedCathode.y1 },
    NODE.returnBottomRight,
    { x: NODE.capNegative.x, y: NODE.returnBottomRight.y },
    NODE.capNegative,
  ];

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <svg
      viewBox={VIEW_BOX}
      className="h-full min-h-[360px] w-full rounded-2xl bg-white"
      role="img"
      aria-label="Filtered center tapped full wave rectifier circuit"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect width="760" height="430" rx="22" fill="#ffffff" />

      <g transform={canvasTransform}>
        <TransformerSymbol />

        <path
          d={`M${WIRE.secondaryToD1Anode.start.x} ${WIRE.secondaryToD1Anode.start.y} V${WIRE.secondaryToD1Anode.elbow.y} H${WIRE.secondaryToD1Anode.end.x}`}
          fill="none"
          stroke={getWireStroke(d1Active)}
          strokeWidth={WIRE.width}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d={`M${WIRE.secondaryToD2Anode.start.x} ${WIRE.secondaryToD2Anode.start.y} V${WIRE.secondaryToD2Anode.elbow.y} H${WIRE.secondaryToD2Anode.end.x}`}
          fill="none"
          stroke={getWireStroke(d2Active)}
          strokeWidth={WIRE.width}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d={`M${WIRE.d1CathodeToVout.start.x - 10} ${WIRE.d1CathodeToVout.start.y + 1} H${WIRE.d1CathodeToVout.vertical.x} V${WIRE.d1CathodeToVout.vertical.y2}`}
          fill="none"
          stroke={getWireStroke(d1Active)}
          strokeWidth={WIRE.width}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d={`M${WIRE.d2CathodeToVout.start.x - 10} ${WIRE.d2CathodeToVout.start.y + 1} H${WIRE.d2CathodeToVout.vertical.x} V${WIRE.d2CathodeToVout.vertical.y1}`}
          fill="none"
          stroke={getWireStroke(d2Active)}
          strokeWidth={WIRE.width}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d={`M${WIRE.voutBusToCapPositive.start.x} ${WIRE.voutBusToCapPositive.start.y} H${WIRE.voutBusToCapPositive.branch.x} V${WIRE.voutBusToCapPositive.end.y}`}
          fill="none"
          stroke={getWireStroke(capacitorWireActive)}
          strokeWidth={WIRE.width}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d={`M${WIRE.voutBusToLedAnode.start.x} ${WIRE.voutBusToLedAnode.start.y} H${WIRE.voutBusToLedAnode.end.x}`}
          fill="none"
          stroke={getWireStroke(loadWireActive)}
          strokeWidth={WIRE.width}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d={`M${WIRE.voutBusDropToLedAnode.x} ${WIRE.voutBusDropToLedAnode.y1} V${WIRE.voutBusDropToLedAnode.y2}`}
          fill="none"
          stroke={getWireStroke(loadWireActive)}
          strokeWidth={WIRE.width}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d={`M${WIRE.secondaryCenterTapToReturnLink.start.x} ${WIRE.secondaryCenterTapToReturnLink.start.y + 2} H${WIRE.secondaryCenterTapToReturnLink.end.x}`}
          fill="none"
          stroke={getWireStroke(returnWireActive)}
          strokeWidth={WIRE.width}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d={`M${WIRE.centerTapToReturnBus.start.x} ${WIRE.centerTapToReturnBus.start.y} V${WIRE.centerTapToReturnBus.dropY} H${WIRE.centerTapToReturnBus.endX}`}
          fill="none"
          stroke={getWireStroke(returnWireActive)}
          strokeWidth={WIRE.width}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d={`M${WIRE.returnBusToCapNegative.x} ${WIRE.returnBusToCapNegative.y1} V${WIRE.returnBusToCapNegative.y2}`}
          fill="none"
          stroke={getWireStroke(capacitorWireActive)}
          strokeWidth={WIRE.width}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d={`M${WIRE.returnBusToLedCathode.x} ${WIRE.returnBusToLedCathode.y1} V${WIRE.returnBusToLedCathode.y2}`}
          fill="none"
          stroke={getWireStroke(loadWireActive)}
          strokeWidth={WIRE.width}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <ElectronFlow
          active={d1Active}
          path={d1LoadPath}
          color={STYLE.electron}
          count={4}
          flowRate={electronFlowRate}
        />

        <ElectronFlow
          active={d2Active}
          path={d2LoadPath}
          color={STYLE.electron}
          count={4}
          flowRate={electronFlowRate}
        />

        <ElectronFlow
          active={capacitorChargingActive}
          path={capacitorChargingPath}
          color={STYLE.electron}
          count={2}
          flowRate={Math.max(0.45, electronFlowRate * 0.65)}
        />

        <ElectronFlow
          active={capacitorDischargeActive}
          path={capacitorDischargePath}
          color={STYLE.electron}
          count={3}
          flowRate={Math.max(0.55, electronFlowRate * 0.8)}
        />

        <text
          x={LABEL.inputVoltage.x}
          y={LABEL.inputVoltage.y}
          fill={STYLE.muted}
          fontSize="14"
          fontWeight="900"
        >
          230V
        </text>

        <text
          x={LABEL.vac.x}
          y={LABEL.vac.y}
          fill={STYLE.muted}
          fontSize="13"
          fontWeight="900"
        >
          Vac
        </text>

        <text
          x={LABEL.transformerCaption.x}
          y={LABEL.transformerCaption.y}
          fill={STYLE.muted}
          fontSize="16"
          fontWeight="900"
        >
          12-0-12 Center tapped
        </text>

        <DiodeSymbol component={COMPONENT.d1} label="D1" active={d1Active} />
        <DiodeSymbol component={COMPONENT.d2} label="D2" active={d2Active} />

        <CapacitorSymbol
          filterEnabled={filterEnabled}
          capacitorUf={capacitorUf}
          charging={capacitorChargingActive}
          discharging={capacitorDischargeActive}
        />

        <LedLoad on={point.ledOn} blown={point.ledBlown} />

        <text
          x={LABEL.vout.x}
          y={LABEL.vout.y}
          fill={STYLE.text}
          fontSize="13"
          fontWeight="900"
        >
          +Vout
        </text>

        <text
          x={LABEL.meter1.x}
          y={LABEL.meter1.y}
          fill={STYLE.text}
          fontSize="12"
          fontWeight="900"
        >
          {point.filteredVout.toFixed(2)}V |{" "}
          {(point.filteredCurrent * 1000).toFixed(2)}mA
        </text>

        <text
          x={LABEL.meter2.x}
          y={LABEL.meter2.y}
          fill={STYLE.text}
          fontSize="12"
          fontWeight="900"
        >
          D1: {d1Active ? "ACTIVE" : "OFF"} | D2: {d2Active ? "ACTIVE" : "OFF"}
        </text>
      </g>
    </svg>
  );
}
