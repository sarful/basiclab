"use client";

import ResistorSymbol from "../../library/electronics-symbol-library/passive/ResistorSymbol";
import BatterySymbol from "../../library/electronics-symbol-library/sources/BatterySymbol";
import { ELECTRON_COUNT, getElectronSpeed } from "./logic";
import type { FlowLevel } from "./types";

type ParallelCircuitBasicsCircuitProps = {
  voltage: number;
  branchOneResistance: number;
  branchTwoResistance: number;
  branchThreeResistance?: number;
  currentOne: number;
  currentTwo: number;
  currentThree?: number;
  totalCurrent: number;
  flowPercent: number;
  flowLevel: FlowLevel;
};

type Point = {
  x: number;
  y: number;
};

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

function safeNumber(value: number | undefined, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function getParticleCount(branchCurrent: number, totalCurrent: number) {
  if (totalCurrent <= 0) return 2;
  return Math.max(
    2,
    Math.round((ELECTRON_COUNT * branchCurrent) / totalCurrent),
  );
}

export function ParallelCircuitBasicsCircuit({
  voltage,
  branchOneResistance,
  branchTwoResistance,
  branchThreeResistance,
  currentOne,
  currentTwo,
  currentThree,
  totalCurrent,
  flowPercent,
  flowLevel,
}: ParallelCircuitBasicsCircuitProps) {
  const safeVoltage = safeNumber(voltage, 12);
  const r1 = safeNumber(branchOneResistance, 10);
  const r2 = safeNumber(branchTwoResistance, 2);
  const r3 = safeNumber(branchThreeResistance, 1);

  const i1 = safeNumber(currentOne);
  const i2 = safeNumber(currentTwo);
  const i3 = safeNumber(currentThree);
  const total = safeNumber(totalCurrent, i1 + i2 + i3);

  const topRailY = 112;
  const bottomRailY = 298;
  const leftRailX = 170;
  const rightRailX = 620;

  const batteryX = 84;
  const batteryY = 158;
  const batteryWidth = 92;
  const batteryHeight = 118;
  const batteryTerminalX = batteryX + (81 / 160) * batteryWidth;
  const batteryTopTerminalY = batteryY + (21 / 160) * batteryHeight;
  const batteryBottomTerminalY = batteryY + (121 / 160) * batteryHeight;

  const r1X = 320;
  const r2X = 470;
  const r3X = 600;

  const resistorWidth = 150;
  const resistorHeight = 84;
  const resistorCenterY = (topRailY + bottomRailY) / 2;
  const resistorTopGap = 50;
  const resistorBottomGap = 50;

  const batteryPositive: Point = {
    x: batteryTerminalX,
    y: batteryTopTerminalY,
  };
  const batteryNegative: Point = {
    x: batteryTerminalX,
    y: batteryBottomTerminalY,
  };

  const topLeft: Point = { x: leftRailX, y: topRailY };
  const topRight: Point = { x: rightRailX, y: topRailY };
  const bottomLeft: Point = { x: leftRailX, y: bottomRailY };
  const bottomRight: Point = { x: rightRailX, y: bottomRailY };

  const batteryTopBend: Point = { x: batteryTerminalX, y: topRailY };
  const batteryBottomBend: Point = { x: batteryTerminalX, y: bottomRailY };

  const r1Top: Point = { x: r1X, y: topRailY };
  const r1BodyTop: Point = { x: r1X, y: topRailY + resistorTopGap };
  const r1BodyBottom: Point = { x: r1X, y: bottomRailY - resistorBottomGap };
  const r1Bottom: Point = { x: r1X, y: bottomRailY };

  const r2Top: Point = { x: r2X, y: topRailY };
  const r2BodyTop: Point = { x: r2X, y: topRailY + resistorTopGap };
  const r2BodyBottom: Point = { x: r2X, y: bottomRailY - resistorBottomGap };
  const r2Bottom: Point = { x: r2X, y: bottomRailY };

  const r3Top: Point = { x: r3X, y: topRailY };
  const r3BodyTop: Point = { x: r3X, y: topRailY + resistorTopGap };
  const r3BodyBottom: Point = { x: r3X, y: bottomRailY - resistorBottomGap };
  const r3Bottom: Point = { x: r3X, y: bottomRailY };

  const branchOnePath = createPath([
    batteryPositive,
    batteryTopBend,
    topLeft,
    r1Top,
    r1BodyTop,
    r1BodyBottom,
    r1Bottom,
    bottomLeft,
    batteryBottomBend,
    batteryNegative,
  ]);

  const branchTwoPath = createPath([
    batteryPositive,
    batteryTopBend,
    topLeft,
    r2Top,
    r2BodyTop,
    r2BodyBottom,
    r2Bottom,
    bottomLeft,
    batteryBottomBend,
    batteryNegative,
  ]);

  const branchThreePath = createPath([
    batteryPositive,
    batteryTopBend,
    topLeft,
    r3Top,
    r3BodyTop,
    r3BodyBottom,
    r3Bottom,
    bottomLeft,
    batteryBottomBend,
    batteryNegative,
  ]);

  const totalDuration = getElectronSpeed(total);
  const branchOneDuration = getElectronSpeed(Math.max(i1, 0.2));
  const branchTwoDuration = getElectronSpeed(Math.max(i2, 0.2));
  const branchThreeDuration = getElectronSpeed(Math.max(i3, 0.2));

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-300 bg-white shadow-xl">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-xl font-semibold text-slate-950">
          Parallel circuit
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Each branch connects across the same top and bottom rails, so the source
          voltage appears across every branch.
        </p>
      </div>

      <svg viewBox="0 0 760 360" className="h-[420px] w-full bg-white">
        <text x="40" y="42" fontSize="21" fontWeight="800" fill="#0f172a">
          Three-branch parallel circuit
        </text>
        <text x="40" y="72" fontSize="13" fill="#64748b">
          The same voltage appears across R1, R2, and R3, while the total current
          splits between the branches.
        </text>

        <path
          d={createPath([batteryPositive, batteryTopBend])}
          stroke={POSITIVE_WIRE}
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={createPath([batteryTopBend, topLeft, topRight])}
          stroke={POSITIVE_WIRE}
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={createPath([batteryNegative, batteryBottomBend])}
          stroke={RETURN_WIRE}
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={createPath([batteryBottomBend, bottomLeft, bottomRight])}
          stroke={RETURN_WIRE}
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {[r1X, r2X, r3X].map((x) => (
          <g key={x}>
            <path
              d={`M ${x} ${topRailY} L ${x} ${topRailY + resistorTopGap}`}
              stroke={POSITIVE_WIRE}
              strokeWidth="2.4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={`M ${x} ${bottomRailY - resistorBottomGap} L ${x} ${bottomRailY}`}
              stroke={RETURN_WIRE}
              strokeWidth="2.4"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        ))}

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
          x={batteryTerminalX - 28}
          y={batteryY + 64}
          fontSize="15"
          fontWeight="800"
          fill="#0f172a"
          textAnchor="end"
        >
          {safeVoltage.toFixed(0)} V
        </text>

        {[
          { x: r1X, label: "R1", value: r1 },
          { x: r2X, label: "R2", value: r2 },
          { x: r3X, label: "R3", value: r3 },
        ].map((item) => (
          <g key={item.label}>
            <g
              transform={`translate(${item.x} ${resistorCenterY}) rotate(90) translate(${-resistorWidth / 2} ${-resistorHeight / 2})`}
            >
              <ResistorSymbol
                width={resistorWidth}
                height={resistorHeight}
                label={item.label}
              />
            </g>
            <text
              x={item.x + 20}
              y={resistorCenterY - 8}
              fontSize="13"
              fontWeight="700"
              fill="#0f172a"
            >
              {item.label}
            </text>
            <text
              x={item.x + 20}
              y={resistorCenterY + 12}
              fontSize="12"
              fill="#334155"
            >
              {item.value.toFixed(1)} Ohm
            </text>
          </g>
        ))}

        <text x="48" y="338" fontSize="13" fontWeight="700" fill={FLOW_COLOR}>
          Total Current = {total.toFixed(2)} A
        </text>
        <text x="270" y="338" fontSize="13" fontWeight="700" fill={FLOW_COLOR}>
          Flow Strength: {Math.round(safeNumber(flowPercent))}%
        </text>
        <text x="478" y="338" fontSize="13" fontWeight="700" fill="#0f766e">
          Level: {flowLevel}
        </text>

        {[
          batteryPositive,
          batteryNegative,
          batteryTopBend,
          batteryBottomBend,
          topLeft,
          topRight,
          bottomLeft,
          bottomRight,
          r1Top,
          r1Bottom,
          r2Top,
          r2Bottom,
          r3Top,
          r3Bottom,
        ].map((point, index) => (
          <circle
            key={`${point.x}-${point.y}-${index}`}
            cx={point.x}
            cy={point.y}
            r="3.7"
            fill={NODE_FILL}
            stroke={NODE_STROKE}
            strokeWidth="1.4"
          />
        ))}

        {[
          {
            key: "branch-one",
            count: getParticleCount(i1, total),
            duration: branchOneDuration,
            path: branchOnePath,
            delay: 0.24,
          },
          {
            key: "branch-two",
            count: getParticleCount(i2, total),
            duration: branchTwoDuration,
            path: branchTwoPath,
            delay: 0.26,
          },
          {
            key: "branch-three",
            count: getParticleCount(i3, total),
            duration: branchThreeDuration,
            path: branchThreePath,
            delay: 0.28,
          },
        ].map((branch) =>
          Array.from({ length: branch.count }).map((_, index) => (
            <circle key={`${branch.key}-${index}`} r="3.2" fill={FLOW_COLOR}>
              <animateMotion
                dur={`${branch.duration}s`}
                repeatCount="indefinite"
                path={branch.path}
                begin={`${index * branch.delay}s`}
              />
            </circle>
          )),
        )}

        {Array.from({ length: 3 }).map((_, index) => (
          <circle key={`main-flow-${index}`} r="3.4" fill={FLOW_COLOR}>
            <animateMotion
              dur={`${totalDuration}s`}
              repeatCount="indefinite"
              path={createPath([
                batteryPositive,
                batteryTopBend,
                topLeft,
                topRight,
              ])}
              begin={`${index * 0.24}s`}
            />
          </circle>
        ))}
      </svg>
    </section>
  );
}
