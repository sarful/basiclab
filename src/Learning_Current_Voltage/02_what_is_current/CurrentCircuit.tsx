"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import LEDSymbol from "../../library/electronics-symbol-library/diodes/LEDSymbol";
import ResistorSymbol from "../../library/electronics-symbol-library/passive/ResistorSymbol";
import BatterySymbol from "../../library/electronics-symbol-library/sources/BatterySymbol";

import { ELECTRON_COUNT, getFlowDuration } from "./logic";
import type { CurrentLevel } from "./types";

type Point = {
  x: number;
  y: number;
};

type WireSegment = {
  d: string;
  stroke: string;
};

const POSITIVE_WIRE = "#dc2626";
const RETURN_WIRE = "#334155";
const FLOW_COLOR = "#2563eb";

const FLOW_RADIUS = 3.6;
const FLOW_STAGGER = 0.22;

const NODE_FILL = "#f8fafc";
const NODE_STROKE = "#94a3b8";

function createPath(points: Point[]) {
  return points
    .map((point, index) =>
      index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`,
    )
    .join(" ");
}

export function CurrentCircuit({
  voltage,
  resistance,
  current,
  currentPercent,
  currentLevel,
  isPlaying,
}: {
  voltage: number;
  resistance: number;
  current: number;
  currentPercent: number;
  currentLevel: CurrentLevel;
  isPlaying: boolean;
}) {
  const [localPlaying, setLocalPlaying] = useState(isPlaying);

  useEffect(() => {
    setLocalPlaying(isPlaying);
  }, [isPlaying]);

  const effectivePlaying = localPlaying;

  const particleDuration = getFlowDuration(currentPercent);

  const glowOpacity = current < 0.5 ? 0.2 : current < 2 ? 0.55 : 0.9;

  // -----------------------------------
  // Layout
  // -----------------------------------

  const bottomRailY = 318;
  const leftWireX = 138;

  // Battery
  const batteryX = 86;
  const batteryY = 212;
  const batteryWidth = 102;
  const batteryHeight = 108;

  const batteryTerminalX = batteryX + (81 / 160) * batteryWidth;

  const batteryTopTerminalY = batteryY + (21 / 160) * batteryHeight;

  const batteryBottomTerminalY = batteryY + (121 / 160) * batteryHeight;

  // Resistor
  const resistorX = 392;
  const resistorY = 98;

  const resistorWidth = 172;
  const resistorHeight = 86;

  const resistorTerminal1X = resistorX + (10 / 71) * resistorWidth;

  const resistorTerminal2X = resistorX + (60 / 71) * resistorWidth;

  const resistorTerminalY = resistorY + (20 / 41) * resistorHeight;

  // LED
  const ledX = 602;
  const ledY = 140;

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

  // -----------------------------------
  // Circuit Nodes
  // -----------------------------------

  const batteryPositive: Point = {
    x: batteryTerminalX,
    y: batteryTopTerminalY,
  };

  const leftTopBend: Point = {
    x: leftWireX,
    y: batteryTopTerminalY,
  };

  const leftUpperRail: Point = {
    x: leftWireX,
    y: resistorTerminalY,
  };

  const resistorInput: Point = {
    x: resistorTerminal1X,
    y: resistorTerminalY,
  };

  const resistorOutput: Point = {
    x: resistorTerminal2X,
    y: resistorTerminalY,
  };

  const ledInput: Point = {
    x: ledBranchX,
    y: resistorTerminalY,
  };

  const ledTop: Point = {
    x: ledBranchX,
    y: ledTopTerminalY,
  };

  const ledBottom: Point = {
    x: ledBranchX,
    y: ledBottomTerminalY,
  };

  const bottomRailRight: Point = {
    x: ledBranchX,
    y: bottomRailY,
  };

  const bottomRailLeft: Point = {
    x: batteryTerminalX,
    y: bottomRailY,
  };

  const batteryNegative: Point = {
    x: batteryTerminalX,
    y: batteryBottomTerminalY,
  };

  const flowNodes: Point[] = [
    batteryPositive,
    leftTopBend,
    leftUpperRail,
    resistorInput,
    resistorOutput,
    ledInput,
    ledTop,
    ledBottom,
    bottomRailRight,
    bottomRailLeft,
    batteryNegative,
  ];

  const flowPath = createPath(flowNodes);

  // -----------------------------------
  // Wires
  // -----------------------------------

  const visibleWireSegments: WireSegment[] = [
    {
      d: createPath([
        batteryPositive,
        leftTopBend,
        leftUpperRail,
        resistorInput,
      ]),
      stroke: POSITIVE_WIRE,
    },
    {
      d: createPath([resistorOutput, ledInput, ledTop]),
      stroke: POSITIVE_WIRE,
    },
    {
      d: createPath([
        ledBottom,
        bottomRailRight,
        bottomRailLeft,
        batteryNegative,
      ]),
      stroke: RETURN_WIRE,
    },
  ];

  const nodePoints: Point[] = [
    batteryPositive,
    leftTopBend,
    leftUpperRail,
    resistorInput,
    resistorOutput,
    ledInput,
    ledTop,
    ledBottom,
    bottomRailRight,
    bottomRailLeft,
    batteryNegative,
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            <span className="rounded-full bg-blue-50 px-3 py-2 text-blue-700">
              FLOW-01
            </span>

            <span>ACTIVE MODULE</span>
          </div>

          <h3 className="mt-2 text-2xl font-extrabold text-slate-900">
            Electricity Flow Simulation
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Play, pause, or reset the electron flow.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLocalPlaying(true)}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            ▶ Play
          </button>

          <button
            type="button"
            onClick={() => setLocalPlaying(false)}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            ❚❚ Pause
          </button>

          <button
            type="button"
            onClick={() => setLocalPlaying(false)}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            ↻ Reset
          </button>
        </div>
      </div>

      {/* SVG */}
      <div className="p-4">
        <svg
          viewBox="0 28 760 320"
          className="h-[400px] w-full"
          role="img"
          aria-label="Current flow simulation"
        >
          <defs>
            <filter id="ledGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Title */}
          <text x="70" y="82" fontSize="20" fontWeight="800" fill="#0f172a">
            Current = Charge Flow
          </text>

          <text x="70" y="112" fontSize="13" fill="#64748b">
            Voltage push and resistance set the current • I ={" "}
            {current.toFixed(2)}A • Level: {currentLevel}
          </text>

          {/* Battery */}
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

          {/* Wires */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {visibleWireSegments.map((segment, index) => (
              <path
                key={`wire-${index}`}
                d={segment.d}
                stroke={segment.stroke}
                strokeWidth="2.2"
              />
            ))}
          </g>

          {/* Nodes */}
          <g>
            {nodePoints.map((node, index) => (
              <circle
                key={`node-${index}`}
                cx={node.x}
                cy={node.y}
                r="2.3"
                fill={NODE_FILL}
                stroke={NODE_STROKE}
                strokeWidth="1.1"
              />
            ))}
          </g>

          {/* Resistor */}
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
            RESISTOR {resistance.toFixed(1)}Ω
          </text>

          {/* LED */}
          <svg
            x={ledX}
            y={ledY}
            width={ledWidth}
            height={ledHeight}
            viewBox={`0 0 ${ledWidth} ${ledHeight}`}
            overflow="visible"
            style={{
              filter: current > 0.25 ? "url(#ledGlow)" : "none",
            }}
          >
            <g
              transform={`translate(${ledWidth / 2} ${ledHeight / 2}) rotate(90) translate(${-ledWidth / 2} ${-ledHeight / 2})`}
            >
              <LEDSymbol width={ledWidth} height={ledHeight} label="LED" />
            </g>
          </svg>

          <motion.circle
            cx={ledCenterX}
            cy={ledCenterY}
            r="14"
            fill="#fde68a"
            animate={{
              opacity: effectivePlaying
                ? [glowOpacity * 0.35, glowOpacity, glowOpacity * 0.35]
                : glowOpacity * 0.55,
            }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
            }}
          />

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

          {/* Labels */}
          <text
            x="224"
            y="124"
            fontSize="13"
            fontWeight="700"
            fill={POSITIVE_WIRE}
          >
            Voltage Push
          </text>

          <text
            x="426"
            y="296"
            fontSize="13"
            fontWeight="700"
            fill={FLOW_COLOR}
          >
            Current Flow →
          </text>

          {/* Flow Particles */}
          {Array.from({ length: ELECTRON_COUNT }, (_, particle) => {
            const delay = particle * FLOW_STAGGER;

            return (
              <circle
                key={`particle-${particle}-${effectivePlaying ? "run" : "pause"}`}
                r={FLOW_RADIUS}
                fill={FLOW_COLOR}
                opacity={0}
              >
                {effectivePlaying && (
                  <>
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
                      path={flowPath}
                    />
                  </>
                )}
              </circle>
            );
          })}

          {/* Strength */}
          <rect
            x="82"
            y="334"
            width={Math.max(16, currentPercent * 4.2)}
            height="8"
            rx="4"
            fill={FLOW_COLOR}
          />

          <text x="82" y="322" fontSize="12" fontWeight="700" fill={FLOW_COLOR}>
            Current Flow Strength: {currentPercent}%
          </text>
        </svg>
      </div>
    </div>
  );
}
