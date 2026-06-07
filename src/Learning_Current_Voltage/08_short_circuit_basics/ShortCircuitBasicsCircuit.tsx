"use client";

import { motion } from "framer-motion";

import LEDSymbol from "../../library/electronics-symbol-library/diodes/LEDSymbol";
import ResistorSymbol from "../../library/electronics-symbol-library/passive/ResistorSymbol";
import BatterySymbol from "../../library/electronics-symbol-library/sources/BatterySymbol";
import { ELECTRON_COUNT, getElectronSpeed } from "./logic";
import type { CircuitMode, FlowLevel } from "./types";

type ShortCircuitBasicsCircuitProps = {
  mode: CircuitMode;
  voltage: number;
  loadResistance: number;
  current: number;
  flowPercent: number;
  flowLevel: FlowLevel;
};

type Point = {
  x: number;
  y: number;
};

const POSITIVE_WIRE = "#dc2626";
const RETURN_WIRE = "#334155";
const SHORT_WIRE = "#f59e0b";
const FLOW_COLOR = "#2563eb";
const NODE_FILL = "#f8fafc";
const NODE_STROKE = "#94a3b8";

function createPath(points: Point[]) {
  return points
    .map((point, index) =>
      index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`,
    )
    .join(" ");
}

export function ShortCircuitBasicsCircuit({
  mode,
  voltage,
  loadResistance,
  current,
  flowPercent,
  flowLevel,
}: ShortCircuitBasicsCircuitProps) {
  const isShort = mode === "short";
  const glowOpacity = isShort
    ? 0.08
    : current >= 2
      ? 0.75
      : current >= 1
        ? 0.45
        : 0.2;

  const batteryX = 88;
  const batteryY = 208;
  const batteryWidth = 102;
  const batteryHeight = 108;
  const batteryTerminalX = batteryX + (81 / 160) * batteryWidth;
  const batteryTopTerminalY = batteryY + (21 / 160) * batteryHeight;
  const batteryBottomTerminalY = batteryY + (121 / 160) * batteryHeight;

  const shortBranchX = 250;

  const resistorX = 394;
  const resistorY = 100;
  const resistorWidth = 172;
  const resistorHeight = 86;
  const resistorTerminal1X = resistorX + (10 / 71) * resistorWidth;
  const resistorTerminal2X = resistorX + (60 / 71) * resistorWidth;
  const resistorTerminalY = resistorY + (20 / 41) * resistorHeight;
  const topRailY = resistorTerminalY;
  const bottomRailY = 322;

  const ledX = 608;
  const ledY = 136;
  const ledWidth = 124;
  const ledHeight = 92;
  const ledViewBoxWidth = 71;
  const ledViewBoxHeight = 51;
  const ledViewBoxMinX = -10;
  const ledViewBoxMinY = -10;
  const ledRotationCenterX = ledWidth / 2;
  const ledRotationCenterY = ledHeight / 2;
  const ledLeftTerminalX = ((0 - ledViewBoxMinX) / ledViewBoxWidth) * ledWidth;
  const ledRightTerminalX =
    ((50 - ledViewBoxMinX) / ledViewBoxWidth) * ledWidth;
  const ledTerminalY =
    ((19.992 - ledViewBoxMinY) / ledViewBoxHeight) * ledHeight;
  const ledBranchX =
    ledX + (ledRotationCenterX - (ledTerminalY - ledRotationCenterY));
  const ledTopTerminalY =
    ledY + (ledRotationCenterY + (ledLeftTerminalX - ledRotationCenterX));
  const ledBottomTerminalY =
    ledY + (ledRotationCenterY + (ledRightTerminalX - ledRotationCenterX));
  const ledCenterX = ledBranchX;
  const ledCenterY = (ledTopTerminalY + ledBottomTerminalY) / 2;

  const batteryPositive: Point = {
    x: batteryTerminalX,
    y: batteryTopTerminalY,
  };
  const leftTopBend: Point = { x: batteryTerminalX, y: topRailY };
  const shortTop: Point = { x: shortBranchX, y: topRailY };
  const shortBottom: Point = { x: shortBranchX, y: bottomRailY };
  const resistorInput: Point = { x: resistorTerminal1X, y: resistorTerminalY };
  const resistorOutput: Point = { x: resistorTerminal2X, y: resistorTerminalY };
  const ledInput: Point = { x: ledBranchX, y: resistorTerminalY };
  const ledTop: Point = { x: ledBranchX, y: ledTopTerminalY };
  const ledBottom: Point = { x: ledBranchX, y: ledBottomTerminalY };
  const bottomRailRight: Point = { x: ledBranchX, y: bottomRailY };
  const bottomRailLeft: Point = { x: batteryTerminalX, y: bottomRailY };
  const batteryNegative: Point = {
    x: batteryTerminalX,
    y: batteryBottomTerminalY,
  };

  const normalFlowPath = createPath([
    batteryPositive,
    leftTopBend,
    shortTop,
    resistorInput,
    resistorOutput,
    ledInput,
    ledTop,
    ledBottom,
    bottomRailRight,
    bottomRailLeft,
    batteryNegative,
  ]);

  const shortFlowPath = createPath([
    batteryPositive,
    leftTopBend,
    shortTop,
    shortBottom,
    bottomRailLeft,
    batteryNegative,
  ]);

  const particleDuration = getElectronSpeed(current);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-300 bg-white shadow-xl">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          <span className={`h-2 w-2 rounded-full ${isShort ? "bg-red-500" : "bg-blue-500"}`} />
          Circuit View
        </div>
        <h3 className="mt-3 text-xl font-semibold text-slate-950">
          Watch the current path respond
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Compare the normal load path with the unsafe low-resistance short path.
        </p>
      </div>

      <svg viewBox="0 24 760 332" className="h-[420px] w-full bg-white">
        <defs>
          <filter id="shortGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <text x="64" y="72" fontSize="21" fontWeight="800" fill="#0f172a">
          {isShort ? "Short Path Active" : "Normal Path Active"}
        </text>
        <text x="64" y="100" fontSize="13" fill="#64748b">
          {isShort
            ? "Current takes the easier bypass path and avoids the load."
            : "Current moves through the resistor and LED in a controlled loop."}
        </text>

        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path
            d={createPath([batteryPositive, leftTopBend, shortTop, resistorInput])}
            stroke={isShort ? "#94a3b8" : POSITIVE_WIRE}
            strokeWidth="2.2"
          />
          <path
            d={createPath([resistorOutput, ledInput, ledTop])}
            stroke={isShort ? "#94a3b8" : POSITIVE_WIRE}
            strokeWidth="2.2"
          />
          <path
            d={createPath([
              ledBottom,
              bottomRailRight,
              bottomRailLeft,
              batteryNegative,
            ])}
            stroke={RETURN_WIRE}
            strokeWidth="2.2"
          />
          <path
            d={createPath([shortTop, shortBottom])}
            stroke={isShort ? SHORT_WIRE : "#cbd5e1"}
            strokeWidth={isShort ? "4.5" : "2.2"}
            strokeDasharray={isShort ? undefined : "5 7"}
          />
        </g>

        <svg
          x={batteryX}
          y={batteryY}
          width={batteryWidth}
          height={batteryHeight}
          viewBox={`0 0 ${batteryWidth} ${batteryHeight}`}
          overflow="visible"
        >
          <BatterySymbol
            width={batteryWidth}
            height={batteryHeight}
            label="Battery source"
          />
        </svg>

        <text
          x={batteryTerminalX + 18}
          y={batteryY + 64}
          fontSize="13"
          fontWeight="700"
          fill={POSITIVE_WIRE}
        >
          {voltage.toFixed(1)}V
        </text>

        <text
          x={shortBranchX}
          y={topRailY - 18}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill={isShort ? "#d97706" : "#64748b"}
        >
          {isShort ? "Short Path" : "Bypass Branch"}
        </text>

        <svg
          x={resistorX}
          y={resistorY}
          width={resistorWidth}
          height={resistorHeight}
          viewBox={`0 0 ${resistorWidth} ${resistorHeight}`}
          overflow="visible"
          opacity={isShort ? 0.45 : 1}
        >
          <ResistorSymbol
            width={resistorWidth}
            height={resistorHeight}
            label="Series resistor"
          />
        </svg>

        <text
          x={resistorX + resistorWidth / 2}
          y={resistorY - 14}
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fill="#334155"
        >
          Load R = {loadResistance.toFixed(1)} Ohm
        </text>

        <motion.circle
          cx={ledCenterX}
          cy={ledCenterY}
          r="12"
          fill="#fde68a"
          filter={!isShort ? "url(#shortGlow)" : "none"}
          animate={{
            opacity: !isShort
              ? [glowOpacity * 0.35, glowOpacity, glowOpacity * 0.35]
              : glowOpacity,
          }}
          transition={{ duration: 1.1, repeat: !isShort ? Infinity : 0 }}
        />

        <svg
          x={ledX}
          y={ledY}
          width={ledWidth}
          height={ledHeight}
          viewBox={`0 0 ${ledWidth} ${ledHeight}`}
          overflow="visible"
          opacity={isShort ? 0.45 : 1}
        >
          <g
            transform={`translate(${ledWidth / 2} ${ledHeight / 2}) rotate(90) translate(${-ledWidth / 2} ${-ledHeight / 2})`}
          >
            <LEDSymbol width={ledWidth} height={ledHeight} label="LED" />
          </g>
        </svg>

        <text
          x={ledCenterX}
          y={ledY - 8}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill="#16a34a"
        >
          LED
        </text>

        <text x="470" y="300" fontSize="14" fontWeight="700" fill={FLOW_COLOR}>
          Current = {current.toFixed(2)} A
        </text>

        <text
          x="64"
          y="336"
          fontSize="13"
          fontWeight="700"
          fill={isShort ? "#d97706" : FLOW_COLOR}
        >
          Flow Strength: {Math.round(flowPercent)}%
        </text>

        <text
          x="202"
          y="336"
          fontSize="13"
          fontWeight="700"
          fill={isShort ? "#b91c1c" : "#0f766e"}
        >
          Level: {flowLevel}
        </text>

        {(isShort
          ? [shortTop, shortBottom]
          : [resistorInput, resistorOutput, ledInput]
        ).map((point, index) => (
          <circle
            key={`${point.x}-${point.y}-${index}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill={NODE_FILL}
            stroke={NODE_STROKE}
            strokeWidth="1.5"
          />
        ))}

        {[
          batteryPositive,
          leftTopBend,
          batteryNegative,
          bottomRailLeft,
          bottomRailRight,
        ].map((point, index) => (
          <circle
            key={`${point.x}-${point.y}-base-${index}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill={NODE_FILL}
            stroke={NODE_STROKE}
            strokeWidth="1.5"
          />
        ))}

        {Array.from({ length: ELECTRON_COUNT }).map((_, index) => (
          <circle key={index} r={3.7} fill={FLOW_COLOR}>
            <animateMotion
              dur={`${particleDuration}s`}
              repeatCount="indefinite"
              path={isShort ? shortFlowPath : normalFlowPath}
              begin={`${index * 0.18}s`}
            />
          </circle>
        ))}
      </svg>
    </section>
  );
}
