"use client";

import { motion } from "framer-motion";

import LEDSymbol from "../../library/electronics-symbol-library/diodes/LEDSymbol";
import ResistorSymbol from "../../library/electronics-symbol-library/passive/ResistorSymbol";
import BatterySymbol from "../../library/electronics-symbol-library/sources/BatterySymbol";
import { ELECTRON_COUNT, getElectronSpeed } from "./logic";
import type { FlowLevel } from "./types";

type SeriesCircuitBasicsCircuitProps = {
  voltage: number;
  resistanceOne: number;
  resistanceTwo: number;
  current: number;
  dropOne: number;
  dropTwo: number;
  ledDrop: number;
  flowPercent: number;
  flowLevel: FlowLevel;
};

type Point = { x: number; y: number };

const POSITIVE_WIRE = "#dc2626";
const RETURN_WIRE = "#334155";
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

export function SeriesCircuitBasicsCircuit({
  voltage,
  resistanceOne,
  resistanceTwo,
  current,
  dropOne,
  dropTwo,
  ledDrop,
  flowPercent,
  flowLevel,
}: SeriesCircuitBasicsCircuitProps) {
  const glowOpacity =
    current >= 1.5 ? 0.8 : current >= 0.8 ? 0.45 : 0.18;

  const batteryX = 80;
  const batteryY = 204;
  const batteryWidth = 102;
  const batteryHeight = 108;
  const batteryTerminalX = batteryX + (81 / 160) * batteryWidth;
  const batteryTopTerminalY = batteryY + (21 / 160) * batteryHeight;
  const batteryBottomTerminalY = batteryY + (121 / 160) * batteryHeight;

  const resistorOneX = 246;
  const resistorOneY = 106;
  const resistorWidth = 152;
  const resistorHeight = 84;
  const resistorOneInputX = resistorOneX + (20 / 71) * resistorWidth;
  const resistorOneOutputX = resistorOneX + (60 / 71) * resistorWidth;
  const resistorTerminalY = resistorOneY + (20 / 41) * resistorHeight;

  const resistorTwoX = 432;
  const resistorTwoY = 106;
  const resistorTwoInputX = resistorTwoX + (20 / 71) * resistorWidth;
  const resistorTwoOutputX = resistorTwoX + (60 / 71) * resistorWidth;

  const topRailY = resistorTerminalY;
  const bottomRailY = 320;

  const ledX = 620;
  const ledY = 140;
  const ledWidth = 120;
  const ledHeight = 90;
  const ledViewBoxWidth = 71;
  const ledViewBoxHeight = 51;
  const ledViewBoxMinX = -10;
  const ledViewBoxMinY = -10;
  const ledRotationCenterX = ledWidth / 2;
  const ledRotationCenterY = ledHeight / 2;
  const ledLeftTerminalX = ((0 - ledViewBoxMinX) / ledViewBoxWidth) * ledWidth;
  const ledRightTerminalX = ((50 - ledViewBoxMinX) / ledViewBoxWidth) * ledWidth;
  const ledTerminalY = ((19.992 - ledViewBoxMinY) / ledViewBoxHeight) * ledHeight;
  const ledBranchX = ledX + (ledRotationCenterX - (ledTerminalY - ledRotationCenterY));
  const ledTopTerminalY = ledY + (ledRotationCenterY + (ledLeftTerminalX - ledRotationCenterX));
  const ledBottomTerminalY = ledY + (ledRotationCenterY + (ledRightTerminalX - ledRotationCenterX));
  const ledCenterX = ledBranchX;
  const ledCenterY = (ledTopTerminalY + ledBottomTerminalY) / 2;

  const batteryPositive: Point = { x: batteryTerminalX, y: batteryTopTerminalY };
  const leftTopBend: Point = { x: batteryTerminalX, y: topRailY };
  const r1In: Point = { x: resistorOneInputX, y: resistorTerminalY };
  const r1Out: Point = { x: resistorOneOutputX, y: resistorTerminalY };
  const r2In: Point = { x: resistorTwoInputX, y: resistorTerminalY };
  const r2Out: Point = { x: resistorTwoOutputX, y: resistorTerminalY };
  const ledInput: Point = { x: ledBranchX, y: resistorTerminalY };
  const ledTop: Point = { x: ledBranchX, y: ledTopTerminalY };
  const ledBottom: Point = { x: ledBranchX, y: ledBottomTerminalY };
  const bottomRight: Point = { x: ledBranchX, y: bottomRailY };
  const bottomLeft: Point = { x: batteryTerminalX, y: bottomRailY };
  const batteryNegative: Point = { x: batteryTerminalX, y: batteryBottomTerminalY };

  const flowPath = createPath([
    batteryPositive,
    leftTopBend,
    r1In,
    r1Out,
    r2In,
    r2Out,
    ledInput,
    ledTop,
    ledBottom,
    bottomRight,
    bottomLeft,
    batteryNegative,
  ]);

  const particleDuration = getElectronSpeed(current);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-300 bg-white shadow-xl">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          Circuit View
        </div>
        <h3 className="mt-3 text-xl font-semibold text-slate-950">Watch the series path respond</h3>
        <p className="mt-1 text-sm text-slate-600">
          One path, same current everywhere, and voltage shared across the loop.
        </p>
      </div>

      <svg viewBox="0 24 760 332" className="h-[420px] w-full bg-white">
        <defs>
          <filter id="seriesGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <text x="54" y="70" fontSize="21" fontWeight="800" fill="#0f172a">
          One Current Path
        </text>
        <text x="54" y="98" fontSize="13" fill="#64748b">
          The same current moves through resistor 1, resistor 2, and the LED.
        </text>

        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path
            d={createPath([batteryPositive, leftTopBend, r1In])}
            stroke={POSITIVE_WIRE}
            strokeWidth="2.2"
          />
          <path
            d={createPath([r1Out, r2In])}
            stroke={POSITIVE_WIRE}
            strokeWidth="2.2"
          />
          <path
            d={createPath([r2Out, ledInput, ledTop])}
            stroke={POSITIVE_WIRE}
            strokeWidth="2.2"
          />
          <path
            d={createPath([ledBottom, bottomRight, bottomLeft, batteryNegative])}
            stroke={RETURN_WIRE}
            strokeWidth="2.2"
          />
        </g>

        <svg x={batteryX} y={batteryY} width={batteryWidth} height={batteryHeight} viewBox={`0 0 ${batteryWidth} ${batteryHeight}`} overflow="visible">
          <BatterySymbol width={batteryWidth} height={batteryHeight} label="Battery source" />
        </svg>

        <text x={batteryTerminalX + 18} y={batteryY + 64} fontSize="13" fontWeight="700" fill={POSITIVE_WIRE}>
          {voltage.toFixed(1)}V
        </text>

        <svg x={resistorOneX} y={resistorOneY} width={resistorWidth} height={resistorHeight} viewBox={`0 0 ${resistorWidth} ${resistorHeight}`} overflow="visible">
          <ResistorSymbol width={resistorWidth} height={resistorHeight} label="Resistor one" />
        </svg>
        <text x={resistorOneX + resistorWidth / 2} y={resistorOneY - 14} textAnchor="middle" fontSize="13" fontWeight="700" fill="#334155">
          R1 = {resistanceOne.toFixed(1)} Ohm
        </text>
        <text x={resistorOneX + resistorWidth / 2} y={resistorOneY + resistorHeight + 20} textAnchor="middle" fontSize="12" fontWeight="700" fill="#2563eb">
          Drop = {dropOne.toFixed(1)}V
        </text>

        <svg x={resistorTwoX} y={resistorTwoY} width={resistorWidth} height={resistorHeight} viewBox={`0 0 ${resistorWidth} ${resistorHeight}`} overflow="visible">
          <ResistorSymbol width={resistorWidth} height={resistorHeight} label="Resistor two" />
        </svg>
        <text x={resistorTwoX + resistorWidth / 2} y={resistorTwoY - 14} textAnchor="middle" fontSize="13" fontWeight="700" fill="#334155">
          R2 = {resistanceTwo.toFixed(1)} Ohm
        </text>
        <text x={resistorTwoX + resistorWidth / 2} y={resistorTwoY + resistorHeight + 20} textAnchor="middle" fontSize="12" fontWeight="700" fill="#2563eb">
          Drop = {dropTwo.toFixed(1)}V
        </text>

        <motion.circle
          cx={ledCenterX}
          cy={ledCenterY}
          r="12"
          fill="#fde68a"
          filter="url(#seriesGlow)"
          animate={{ opacity: [glowOpacity * 0.35, glowOpacity, glowOpacity * 0.35] }}
          transition={{ duration: 1.1, repeat: Infinity }}
        />

        <svg x={ledX} y={ledY} width={ledWidth} height={ledHeight} viewBox={`0 0 ${ledWidth} ${ledHeight}`} overflow="visible">
          <g transform={`translate(${ledWidth / 2} ${ledHeight / 2}) rotate(90) translate(${-ledWidth / 2} ${-ledHeight / 2})`}>
            <LEDSymbol width={ledWidth} height={ledHeight} label="LED" />
          </g>
        </svg>
        <text x={ledCenterX} y={ledY - 8} textAnchor="middle" fontSize="13" fontWeight="700" fill="#16a34a">
          LED
        </text>
        <text x={ledCenterX} y={ledY + ledHeight + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#2563eb">
          Drop = {ledDrop.toFixed(1)}V
        </text>

        <text x="458" y="302" fontSize="14" fontWeight="700" fill={FLOW_COLOR}>
          Same Current = {current.toFixed(2)} A
        </text>
        <text x="54" y="336" fontSize="13" fontWeight="700" fill={FLOW_COLOR}>
          Flow Strength: {Math.round(flowPercent)}%
        </text>
        <text x="200" y="336" fontSize="13" fontWeight="700" fill="#0f766e">
          Level: {flowLevel}
        </text>

        {[batteryPositive, leftTopBend, r1In, r1Out, r2In, r2Out, ledInput, bottomLeft, bottomRight, batteryNegative].map((point, index) => (
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

        {Array.from({ length: ELECTRON_COUNT }).map((_, index) => (
          <circle key={index} r={3.7} fill={FLOW_COLOR}>
            <animateMotion
              dur={`${particleDuration}s`}
              repeatCount="indefinite"
              path={flowPath}
              begin={`${index * 0.18}s`}
            />
          </circle>
        ))}
      </svg>
    </section>
  );
}
