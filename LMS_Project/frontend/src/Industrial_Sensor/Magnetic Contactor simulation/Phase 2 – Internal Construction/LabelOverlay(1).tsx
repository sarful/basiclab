"use client";

import React from "react";

export type LabelPosition = "left" | "right" | "top" | "bottom";

export interface OverlayLabel {
  id: string;
  title: string;
  description?: string;
  targetX: number;
  targetY: number;
  labelX: number;
  labelY: number;
  position?: LabelPosition;
  color?: string;
}

export interface LabelOverlayProps {
  labels?: OverlayLabel[];
  activeLabelId?: string | null;
  showLabels?: boolean;
  width?: number;
  height?: number;
  onLabelClick?: (label: OverlayLabel) => void;
}

const defaultLabels: OverlayLabel[] = [
  {
    id: "coil",
    title: "Coil",
    description: "Creates magnetic field when A1-A2 is energized.",
    targetX: 210,
    targetY: 300,
    labelX: 48,
    labelY: 250,
    position: "left",
    color: "#f59e0b",
  },
  {
    id: "core",
    title: "Iron Core",
    description: "Concentrates magnetic flux inside the contactor.",
    targetX: 310,
    targetY: 270,
    labelX: 55,
    labelY: 335,
    position: "left",
    color: "#64748b",
  },
  {
    id: "armature",
    title: "Armature",
    description: "Moves when the coil pulls it magnetically.",
    targetX: 350,
    targetY: 210,
    labelX: 460,
    labelY: 185,
    position: "right",
    color: "#0f172a",
  },
  {
    id: "spring",
    title: "Return Spring",
    description: "Returns the armature when coil power is removed.",
    targetX: 410,
    targetY: 300,
    labelX: 465,
    labelY: 285,
    position: "right",
    color: "#16a34a",
  },
  {
    id: "contacts",
    title: "Main Contacts",
    description: "Switches L1/L2/L3 power to T1/T2/T3 output.",
    targetX: 315,
    targetY: 410,
    labelX: 455,
    labelY: 430,
    position: "right",
    color: "#dc2626",
  },
  {
    id: "terminals",
    title: "Terminals",
    description: "External wire connection points.",
    targetX: 300,
    targetY: 95,
    labelX: 245,
    labelY: 40,
    position: "top",
    color: "#2563eb",
  },
];

function getLeaderPath(label: OverlayLabel) {
  const midX = (label.targetX + label.labelX) / 2;

  if (label.position === "top" || label.position === "bottom") {
    const midY = (label.targetY + label.labelY) / 2;
    return `M ${label.labelX} ${label.labelY} Q ${label.labelX} ${midY}, ${label.targetX} ${label.targetY}`;
  }

  return `M ${label.labelX} ${label.labelY} C ${midX} ${label.labelY}, ${midX} ${label.targetY}, ${label.targetX} ${label.targetY}`;
}

export default function LabelOverlay({
  labels = defaultLabels,
  activeLabelId = null,
  showLabels = true,
  width = 620,
  height = 520,
  onLabelClick,
}: LabelOverlayProps) {
  if (!showLabels) return null;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-label="Magnetic contactor label overlay"
    >
      {labels.map((label) => {
        const isActive = activeLabelId === label.id;
        const color = label.color ?? "#2563eb";
        const boxWidth = label.description ? 170 : 112;
        const boxHeight = label.description ? 58 : 34;
        const boxX = label.labelX - boxWidth / 2;
        const boxY = label.labelY - boxHeight / 2;

        return (
          <g
            key={label.id}
            className="pointer-events-auto cursor-pointer"
            onClick={() => onLabelClick?.(label)}
          >
            <path
              d={getLeaderPath(label)}
              fill="none"
              stroke={color}
              strokeWidth={isActive ? 3 : 2}
              strokeDasharray={isActive ? "0" : "6 5"}
              opacity={isActive ? 1 : 0.75}
            />

            <circle
              cx={label.targetX}
              cy={label.targetY}
              r={isActive ? 7 : 5}
              fill={color}
              stroke="#ffffff"
              strokeWidth="2"
            />

            <rect
              x={boxX}
              y={boxY}
              width={boxWidth}
              height={boxHeight}
              rx="10"
              fill="#ffffff"
              stroke={color}
              strokeWidth={isActive ? 2.5 : 1.5}
              opacity="0.96"
            />

            <text
              x={label.labelX}
              y={label.description ? label.labelY - 10 : label.labelY + 5}
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fill="#111827"
            >
              {label.title}
            </text>

            {label.description && (
              <text
                x={label.labelX}
                y={label.labelY + 11}
                textAnchor="middle"
                fontSize="9.5"
                fill="#4b5563"
              >
                {label.description.length > 36
                  ? `${label.description.slice(0, 36)}...`
                  : label.description}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
