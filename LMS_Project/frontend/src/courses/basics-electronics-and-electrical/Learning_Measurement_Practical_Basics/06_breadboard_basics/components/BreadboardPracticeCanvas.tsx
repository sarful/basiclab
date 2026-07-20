"use client";

import React from "react";

import type { BreadboardChallengeTask } from "../simulatorOneChallenges";
import {
  breadboardCanvasSize,
  simulatorOneColX,
  simulatorOneRowsBottom,
  simulatorOneRowsTop,
  type BreadboardGroupType,
  type BreadboardHole,
  type BreadboardWire,
} from "../simulatorOneData";
import {
  SimulatorOneFeatureLabel,
  SimulatorOnePowerLines,
  SimulatorOnePowerSigns,
  SimulatorOneRailBox,
} from "../simulatorOneSvgParts";

function getGroupHighlightColor(groupType: BreadboardGroupType) {
  switch (groupType) {
    case "power-top-positive":
    case "power-bottom-positive":
      return "#fecaca";
    case "power-top-negative":
    case "power-bottom-negative":
      return "#bfdbfe";
    case "terminal-bottom":
      return "#c7d2fe";
    case "terminal-top":
    default:
      return "#fde68a";
  }
}

function renderGroupOverlay(holes: BreadboardHole[], groupType: BreadboardGroupType) {
  if (holes.length === 0) return null;

  const fill = getGroupHighlightColor(groupType);

  if (groupType.startsWith("power")) {
    const xValues = holes.map((hole) => hole.x);
    const yValues = holes.map((hole) => hole.y);
    const minX = Math.min(...xValues) - 16;
    const maxX = Math.max(...xValues) + 16;
    const y = Math.min(...yValues) - 13;

    return <rect x={minX} y={y} width={maxX - minX} height={26} rx={13} fill={fill} opacity={0.6} />;
  }

  const x = holes[0]?.x ?? 0;
  const minY = Math.min(...holes.map((hole) => hole.y)) - 14;
  const maxY = Math.max(...holes.map((hole) => hole.y)) + 14;

  return <rect x={x - 15} y={minY} width={30} height={maxY - minY} rx={14} fill={fill} opacity={0.6} />;
}

function getWirePath(fromHole: BreadboardHole, toHole: BreadboardHole) {
  const horizontalDistance = Math.abs(fromHole.x - toHole.x);
  const verticalDistance = Math.abs(fromHole.y - toHole.y);
  const lift = Math.max(48, Math.min(120, horizontalDistance * 0.28 + verticalDistance * 0.45));
  const controlY = Math.min(fromHole.y, toHole.y) - lift;

  return `M ${fromHole.x} ${fromHole.y}
    C ${fromHole.x} ${controlY}, ${toHole.x} ${controlY}, ${toHole.x} ${toHole.y}`;
}

export default function BreadboardPracticeCanvas({
  activeGroupHoles,
  currentTask,
  hoveredHoleId,
  holeMap,
  holes,
  isCompactLayout,
  recentlyCompletedTaskId,
  selectedHoleId,
  showLabels,
  wireColor,
  wires,
  zoom,
  onHoleActivate,
  onHoleHover,
  onHoleLeave,
}: {
  activeGroupHoles: BreadboardHole[];
  currentTask: BreadboardChallengeTask;
  hoveredHoleId: string | null;
  holeMap: Map<string, BreadboardHole>;
  holes: BreadboardHole[];
  isCompactLayout: boolean;
  recentlyCompletedTaskId: string | null;
  selectedHoleId: string | null;
  showLabels: boolean;
  wireColor: string;
  wires: BreadboardWire[];
  zoom: number;
  onHoleActivate: (holeId: string) => void;
  onHoleHover: (holeId: string) => void;
  onHoleLeave: (holeId: string) => void;
}) {
  const selectedHole = selectedHoleId ? holeMap.get(selectedHoleId) ?? null : null;
  const hoveredHole = hoveredHoleId ? holeMap.get(hoveredHoleId) ?? null : null;
  const zoomWidth = Math.round(breadboardCanvasSize.width * zoom);

  return (
    <div
      className="overflow-auto rounded-[20px] border border-slate-200 bg-slate-50 p-2 sm:rounded-[24px] sm:p-3"
      style={{ touchAction: "pan-x pan-y pinch-zoom" }}
    >
      <div style={{ width: `${zoomWidth}px`, minWidth: "100%" }}>
        <svg
          viewBox={`0 0 ${breadboardCanvasSize.width} ${breadboardCanvasSize.height}`}
          className="h-auto w-full max-w-none"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Breadboard practice simulator"
        >
          <defs>
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.18" />
            </filter>

            <filter id="wireGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#22c55e" floodOpacity="0.7" />
            </filter>

            <linearGradient id="boardGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#f7f3e8" />
              <stop offset="100%" stopColor="#e8e1d3" />
            </linearGradient>
          </defs>

          <rect
            x="30"
            y="35"
            width="1140"
            height="545"
            rx="10"
            fill="url(#boardGrad)"
            stroke="#d3ccbd"
            filter="url(#softShadow)"
          />

          {currentTask.type === "bridge-gap" ? (
            <rect
              x="24"
              y="309"
              width="1152"
              height="32"
              rx="12"
              fill="#dbeafe"
              opacity="0.35"
              stroke="#2563eb"
              strokeDasharray="10 8"
            />
          ) : null}

          <SimulatorOneRailBox y={45} />
          <SimulatorOneRailBox y={495} />

          <rect x="30" y="155" width="1140" height="155" rx="6" fill="#f5efe2" />
          <rect x="30" y="340" width="1140" height="155" rx="6" fill="#f5efe2" />

          <rect x="30" y="315" width="1140" height="20" fill="#ded8c9" opacity="0.85" />
          <line x1="65" y1="325" x2="1135" y2="325" stroke="#c7bca8" strokeDasharray="8 8" />

          <SimulatorOnePowerLines y={65} top />
          <SimulatorOnePowerLines y={515} />

          {[1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((number) => {
            const x = simulatorOneColX(number);
            return (
              <g key={`num-${number}`}>
                <text x={x} y={150} textAnchor="middle" className="fill-black text-[18px] font-semibold">
                  {number}
                </text>
                <text x={x} y={490} textAnchor="middle" className="fill-black text-[18px] font-semibold">
                  {number}
                </text>
              </g>
            );
          })}

          {simulatorOneRowsTop.map((row, index) => (
            <React.Fragment key={row}>
              <text x="48" y={185 + index * 24} textAnchor="middle" className="fill-black text-[19px] font-bold">
                {row}
              </text>
              <text x="1152" y={185 + index * 24} textAnchor="middle" className="fill-black text-[19px] font-bold">
                {row}
              </text>
            </React.Fragment>
          ))}

          {simulatorOneRowsBottom.map((row, index) => (
            <React.Fragment key={row}>
              <text x="48" y={375 + index * 24} textAnchor="middle" className="fill-black text-[19px] font-bold">
                {row}
              </text>
              <text x="1152" y={375 + index * 24} textAnchor="middle" className="fill-black text-[19px] font-bold">
                {row}
              </text>
            </React.Fragment>
          ))}

          {activeGroupHoles.length > 0
            ? renderGroupOverlay(activeGroupHoles, activeGroupHoles[0]?.groupType ?? "terminal-top")
            : null}

          {wires.map((wire) => {
            const fromHole = holeMap.get(wire.from);
            const toHole = holeMap.get(wire.to);
            if (!fromHole || !toHole) return null;

            const path = getWirePath(fromHole, toHole);
            const isFreshSuccess = wire.taskId === recentlyCompletedTaskId;

            return (
              <g key={wire.id} filter={isFreshSuccess ? "url(#wireGlow)" : undefined}>
                <path d={path} fill="none" stroke={wire.color} strokeWidth="10" opacity={isFreshSuccess ? 0.28 : 0.18} />
                <path
                  d={path}
                  fill="none"
                  stroke={wire.color}
                  strokeWidth={isFreshSuccess ? "8" : "6"}
                  strokeLinecap="round"
                  opacity="0.95"
                />
              </g>
            );
          })}

          {selectedHole && hoveredHole && selectedHole.id !== hoveredHole.id ? (
            <path
              d={getWirePath(selectedHole, hoveredHole)}
              fill="none"
              stroke={wireColor}
              strokeDasharray="10 8"
              strokeLinecap="round"
              strokeWidth="5"
              opacity="0.45"
            />
          ) : null}

          {holes.map((hole) => {
            const isSelected = selectedHoleId === hole.id;
            const isHovered = hoveredHoleId === hole.id;
            const isTaskStart = currentTask.startHole === hole.id;
            const groupMatch = activeGroupHoles.some((groupHole) => groupHole.id === hole.id);
            const markerFill = isSelected
              ? "#facc15"
              : isTaskStart
                ? "#86efac"
                : hole.kind === "power"
                  ? "#111827"
                  : "#211f1a";

            return (
              <g
                key={hole.id}
                role="button"
                tabIndex={0}
                aria-label={`Breadboard hole ${hole.label}`}
                className="cursor-pointer"
                onFocus={() => onHoleHover(hole.id)}
                onBlur={() => onHoleLeave(hole.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onHoleActivate(hole.id);
                  }
                }}
                onMouseEnter={() => onHoleHover(hole.id)}
                onMouseLeave={() => onHoleLeave(hole.id)}
                onPointerEnter={() => onHoleHover(hole.id)}
                onPointerUp={() => onHoleActivate(hole.id)}
              >
                <circle
                  cx={hole.x}
                  cy={hole.y}
                  r={12}
                  fill={groupMatch ? getGroupHighlightColor(hole.groupType) : "transparent"}
                  opacity={groupMatch ? 0.5 : 0}
                />
                <rect
                  x={hole.x - 4.5}
                  y={hole.y - 4.5}
                  width="9"
                  height="9"
                  rx="1.2"
                  fill={markerFill}
                  stroke={isHovered || isSelected ? "#0f172a" : "#8a8170"}
                  strokeWidth={isHovered || isSelected ? 2.2 : 0.7}
                />
                {isTaskStart ? (
                  <circle cx={hole.x} cy={hole.y} r={10} fill="none" stroke="#22c55e" strokeWidth={2} />
                ) : null}
                <circle cx={hole.x} cy={hole.y} r={15} fill="transparent" />
                <title>{hole.label}</title>
              </g>
            );
          })}

          <SimulatorOnePowerSigns y={68} />
          <SimulatorOnePowerSigns y={538} reverse />

          {showLabels && !isCompactLayout ? (
            <>
              <SimulatorOneFeatureLabel
                x={860}
                y={180}
                title="Terminal strips"
                text="A-E and F-J are separate groups. Same numbered column shares one internal strip."
              />
              <SimulatorOneFeatureLabel
                x={790}
                y={68}
                title="Power rails"
                text="Rails distribute supply lines and stay separate from terminal strips until wired."
              />
              <SimulatorOneFeatureLabel
                x={440}
                y={327}
                title="Center gap"
                text="The gap separates the top and bottom halves. Crossing it needs a jumper."
              />
              <SimulatorOneFeatureLabel
                x={120}
                y={252}
                title="Coordinates"
                text="Use row letters plus column numbers, like A12 or F20, to target exact holes."
              />
            </>
          ) : null}
        </svg>
      </div>
    </div>
  );
}
