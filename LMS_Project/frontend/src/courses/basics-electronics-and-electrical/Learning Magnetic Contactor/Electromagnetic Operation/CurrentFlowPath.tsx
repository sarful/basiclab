"use client";

import React, { useMemo } from "react";

export type CurrentFlowDirection = "down" | "up" | "left" | "right" | "custom";

export interface CurrentFlowPathProps {
  active?: boolean;
  direction?: CurrentFlowDirection;
  path?: string;
  width?: number;
  height?: number;
  speed?: number;
  particleCount?: number;
  showArrow?: boolean;
  showLabel?: boolean;
  label?: string;
  strokeWidth?: number;
  className?: string;
}

export default function CurrentFlowPath({
  active = false,
  direction = "down",
  path,
  width = 220,
  height = 260,
  speed = 1.2,
  particleCount = 5,
  showArrow = true,
  showLabel = true,
  label = "Current Flow",
  strokeWidth = 8,
  className = "",
}: CurrentFlowPathProps) {
  const flowPath = useMemo(() => {
    if (path) return path;

    const pad = 28;
    const midX = width / 2;
    const midY = height / 2;

    switch (direction) {
      case "up":
        return `M ${midX} ${height - pad} L ${midX} ${pad}`;
      case "left":
        return `M ${width - pad} ${midY} L ${pad} ${midY}`;
      case "right":
        return `M ${pad} ${midY} L ${width - pad} ${midY}`;
      case "down":
      default:
        return `M ${midX} ${pad} L ${midX} ${height - pad}`;
    }
  }, [direction, height, path, width]);

  const arrowPoints = useMemo(() => {
    const pad = 28;
    const midX = width / 2;
    const midY = height / 2;

    switch (direction) {
      case "up":
        return `${midX - 10},${pad + 16} ${midX},${pad} ${midX + 10},${pad + 16}`;
      case "left":
        return `${pad + 16},${midY - 10} ${pad},${midY} ${pad + 16},${midY + 10}`;
      case "right":
        return `${width - pad - 16},${midY - 10} ${width - pad},${midY} ${width - pad - 16},${midY + 10}`;
      case "down":
      default:
        return `${midX - 10},${height - pad - 16} ${midX},${height - pad} ${midX + 10},${height - pad - 16}`;
    }
  }, [direction, height, width]);

  const safeSpeed = Math.max(0.4, speed);
  const dots = Array.from({ length: Math.max(1, particleCount) });

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={label}
        className="overflow-visible"
      >
        <defs>
          <filter id="currentFlowGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="currentFlowGradient" x1="0" x2="1">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
        </defs>

        {/* Inactive cable/path */}
        <path
          d={flowPath}
          fill="none"
          stroke="#94a3b8"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity="0.45"
        />

        {/* Active energized path */}
        <path
          d={flowPath}
          fill="none"
          stroke={active ? "url(#currentFlowGradient)" : "#64748b"}
          strokeWidth={active ? strokeWidth : Math.max(3, strokeWidth - 3)}
          strokeLinecap="round"
          opacity={active ? 0.85 : 0.35}
          filter={active ? "url(#currentFlowGlow)" : undefined}
        />

        {/* Direction arrow */}
        {showArrow && (
          <polygon
            points={arrowPoints}
            fill={active ? "#22c55e" : "#64748b"}
            opacity={active ? 1 : 0.5}
          />
        )}

        {/* Moving current particles */}
        {active &&
          dots.map((_, index) => (
            <circle key={index} r="7" fill="#dcfce7" stroke="#22c55e" strokeWidth="3" filter="url(#currentFlowGlow)">
              <animateMotion
                dur={`${safeSpeed}s`}
                repeatCount="indefinite"
                begin={`${(index * safeSpeed) / dots.length}s`}
                path={flowPath}
              />
            </circle>
          ))}

        {/* Terminal dots */}
        {direction !== "custom" && (
          <>
            <circle
              cx={direction === "left" ? width - 28 : direction === "right" ? 28 : width / 2}
              cy={direction === "up" ? height - 28 : direction === "down" ? 28 : height / 2}
              r="10"
              fill={active ? "#22c55e" : "#64748b"}
            />
            <circle
              cx={direction === "left" ? 28 : direction === "right" ? width - 28 : width / 2}
              cy={direction === "up" ? 28 : direction === "down" ? height - 28 : height / 2}
              r="10"
              fill={active ? "#22c55e" : "#64748b"}
            />
          </>
        )}
      </svg>

      {showLabel && (
        <div className="text-center">
          <div className="text-sm font-semibold text-slate-800">{label}</div>
          <div className={`text-xs ${active ? "text-green-600" : "text-slate-400"}`}>
            {active ? "Flow Active" : "No Current"}
          </div>
        </div>
      )}
    </div>
  );
}
