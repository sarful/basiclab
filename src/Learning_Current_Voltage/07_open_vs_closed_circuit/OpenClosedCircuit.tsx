"use client";

import { motion } from "framer-motion";

import LEDSymbol from "../../library/electronics-symbol-library/diodes/LEDSymbol";
import ResistorSymbol from "../../library/electronics-symbol-library/passive/ResistorSymbol";
import BatterySymbol from "../../library/electronics-symbol-library/sources/BatterySymbol";
import PushButtonNO from "../../library/buttons/PushButtonNO";
import type { CircuitState } from "./types";

type OpenClosedCircuitProps = {
  circuitState: CircuitState;
  voltage: number;
  resistance: number;
  current: number;
};

type Point = {
  x: number;
  y: number;
};

const POSITIVE_WIRE = "#dc2626";
const RETURN_WIRE = "#334155";
const FLOW_COLOR = "#2563eb";
const OPEN_WIRE = "#f59e0b";
const NODE_FILL = "#f8fafc";
const NODE_STROKE = "#94a3b8";
const ELECTRON_COUNT = 10;
const FLOW_STAGGER = 0.22;
const FLOW_RADIUS = 3.6;

function createPath(points: Point[]) {
  return points
    .map((point, index) =>
      index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`,
    )
    .join(" ");
}

function getElectronDuration(current: number) {
  return Math.max(0.9, 4.2 - current);
}

export function OpenClosedCircuit({
  circuitState,
  voltage,
  resistance,
  current,
}: OpenClosedCircuitProps) {
  const isClosed = circuitState === "closed";
  const shownCurrent = isClosed ? current : 0;
  const glowOpacity = !isClosed
    ? 0.08
    : current < 0.5
      ? 0.2
      : current < 1.5
        ? 0.45
        : 0.85;

  const topRailY = 140;
  const bottomRailY = 314;

  const batteryX = 84;
  const batteryY = 206;
  const batteryWidth = 102;
  const batteryHeight = 108;
  const batteryTerminalX = batteryX + (81 / 160) * batteryWidth;
  const batteryTopTerminalY = batteryY + (21 / 160) * batteryHeight;
  const batteryBottomTerminalY = batteryY + (121 / 160) * batteryHeight;

  const switchX = 210;
  const switchY = 124;
  const switchScale = 1.5;
  const switchInputX = switchX;
  const switchOutputX = switchX + 50 * switchScale;
  const switchTerminalY = switchY + 10 * switchScale;

  const resistorX = 390;
  const resistorY = 96;
  const resistorWidth = 172;
  const resistorHeight = 86;
  const resistorTerminal1X = resistorX + (10 / 71) * resistorWidth;
  const resistorTerminal2X = resistorX + (60 / 71) * resistorWidth;
  const resistorTerminalY = resistorY + (20 / 41) * resistorHeight;

  const ledX = 604;
  const ledY = 132;
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
  const switchInput: Point = { x: switchInputX, y: switchTerminalY };
  const switchOutput: Point = { x: switchOutputX, y: switchTerminalY };
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

  const chargeFlowPath = createPath([
    batteryPositive,
    leftTopBend,
    switchInput,
    switchOutput,
    resistorInput,
    resistorOutput,
    ledInput,
    ledTop,
    ledBottom,
    bottomRailRight,
    bottomRailLeft,
    batteryNegative,
  ]);

  const particleDuration = getElectronDuration(shownCurrent);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-300 bg-white shadow-xl">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          Circuit View
        </div>
        <h3 className="mt-3 text-xl font-semibold text-slate-950">
          Watch the circuit path respond
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Closed circuit completes the loop. Open circuit breaks the path and stops current.
        </p>
      </div>

      <svg viewBox="0 28 760 320" className="h-[410px] w-full bg-white">
        <defs>
          <filter
            id="openClosedGlow"
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

        <text x="70" y="78" fontSize="21" fontWeight="800" fill="#0f172a">
          Circuit Path State
        </text>
        <text x="70" y="106" fontSize="13" fill="#64748b">
          {isClosed
            ? "The path is complete, so current can flow."
            : "The path is broken, so current cannot flow."}
        </text>

        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path
            d={createPath([batteryPositive, leftTopBend, switchInput])}
            stroke={POSITIVE_WIRE}
            strokeWidth="2.2"
          />

          <path
            d={createPath([switchOutput, resistorInput])}
            stroke={isClosed ? POSITIVE_WIRE : OPEN_WIRE}
            strokeWidth="2.2"
            strokeDasharray={isClosed ? undefined : "7 7"}
          />

          <path
            d={createPath([resistorOutput, ledInput, ledTop])}
            stroke={isClosed ? POSITIVE_WIRE : "#94a3b8"}
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
          x={batteryTerminalX + 20}
          y={batteryY + 64}
          fontSize="13"
          fontWeight="700"
          fill={POSITIVE_WIRE}
        >
          {voltage.toFixed(1)}V
        </text>

        <PushButtonNO
          x={switchX}
          y={switchY}
          scale={switchScale}
          pressed={isClosed}
          standalone={false}
          showTerminals={false}
          wireStroke={1.4}
          strokeColor="#374151"
        />

        <text
          x={switchX + 25 * switchScale}
          y={switchY - 18}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill={isClosed ? "#16a34a" : "#d97706"}
        >
          {isClosed ? "Switch Closed" : "Switch Open"}
        </text>

        <svg
          x={resistorX}
          y={resistorY}
          width={resistorWidth}
          height={resistorHeight}
          viewBox={`0 0 ${resistorWidth} ${resistorHeight}`}
          overflow="visible"
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
          R = {resistance.toFixed(1)} Ohm
        </text>

        <motion.circle
          cx={ledCenterX}
          cy={ledCenterY}
          r="12"
          fill="#fde68a"
          filter={isClosed ? "url(#openClosedGlow)" : "none"}
          animate={{
            opacity: isClosed
              ? [glowOpacity * 0.35, glowOpacity, glowOpacity * 0.35]
              : glowOpacity,
          }}
          transition={{ duration: 1.1, repeat: isClosed ? Infinity : 0 }}
        />

        <svg
          x={ledX}
          y={ledY}
          width={ledWidth}
          height={ledHeight}
          viewBox={`0 0 ${ledWidth} ${ledHeight}`}
          overflow="visible"
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

        <g>
          {[
            batteryPositive,
            leftTopBend,
            switchInput,
            switchOutput,
            resistorInput,
            resistorOutput,
            ledInput,
            ledTop,
            ledBottom,
            bottomRailRight,
            bottomRailLeft,
            batteryNegative,
          ].map((node, index) => (
            <circle
              key={`node-${index}`}
              cx={node.x}
              cy={node.y}
              r="2.35"
              fill={NODE_FILL}
              stroke={NODE_STROKE}
              strokeWidth="1.15"
            />
          ))}
        </g>

        <text
          x="170"
          y="124"
          fontSize="13"
          fontWeight="700"
          fill={POSITIVE_WIRE}
        >
          Voltage Push
        </text>

        <text x="420" y="296" fontSize="13" fontWeight="700" fill={FLOW_COLOR}>
          Current = {shownCurrent.toFixed(2)} A
        </text>

        {isClosed &&
          Array.from({ length: ELECTRON_COUNT }, (_, particle) => {
            const delay = particle * FLOW_STAGGER;

            return (
              <circle
                key={`charge-particle-${particle}`}
                r={FLOW_RADIUS}
                fill={FLOW_COLOR}
                opacity={0}
              >
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
                  path={chargeFlowPath}
                />
              </circle>
            );
          })}
      </svg>
    </section>
  );
}
