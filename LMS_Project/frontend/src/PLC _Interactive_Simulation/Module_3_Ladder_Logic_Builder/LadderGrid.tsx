"use client";

import React from "react";

export interface LadderGridProps {
  rows?: number;
  columns?: number;
  cellWidth?: number;
  cellHeight?: number;
  showCoordinates?: boolean;
  showRails?: boolean;
}

export default function LadderGrid({
  rows = 8,
  columns = 16,
  cellWidth = 60,
  cellHeight = 50,
  showCoordinates = false,
  showRails = true,
}: LadderGridProps) {
  const width = columns * cellWidth + 120;
  const height = rows * cellHeight + 80;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-800">
          Ladder Grid
        </h2>
        <p className="text-sm text-slate-500">
          Ladder Logic Design Grid System
        </p>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
      >
        {/* Background */}
        <rect
          width={width}
          height={height}
          fill="#ffffff"
        />

        {/* Vertical Grid Lines */}
        {Array.from({ length: columns + 1 }).map((_, index) => {
          const x = 60 + index * cellWidth;

          return (
            <line
              key={`v-${index}`}
              x1={x}
              y1="40"
              x2={x}
              y2={height - 40}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}

        {/* Horizontal Grid Lines */}
        {Array.from({ length: rows + 1 }).map((_, index) => {
          const y = 40 + index * cellHeight;

          return (
            <line
              key={`h-${index}`}
              x1="60"
              y1={y}
              x2={width - 60}
              y2={y}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}

        {/* Left Power Rail */}
        {showRails && (
          <>
            <line
              x1="60"
              y1="40"
              x2="60"
              y2={height - 40}
              stroke="#334155"
              strokeWidth="6"
            />

            <line
              x1={width - 60}
              y1="40"
              x2={width - 60}
              y2={height - 40}
              stroke="#334155"
              strokeWidth="6"
            />

            <text
              x="35"
              y="25"
              fill="#475569"
              fontSize="14"
              fontWeight="700"
            >
              L+
            </text>

            <text
              x={width - 78}
              y="25"
              fill="#475569"
              fontSize="14"
              fontWeight="700"
            >
              0V
            </text>
          </>
        )}

        {/* Rung Numbers */}
        {Array.from({ length: rows }).map((_, index) => {
          const y = 40 + index * cellHeight + cellHeight / 2;

          return (
            <text
              key={`rung-${index}`}
              x="15"
              y={y + 5}
              fill="#64748b"
              fontSize="12"
              fontWeight="600"
            >
              {String(index + 1).padStart(3, "0")}
            </text>
          );
        })}

        {/* Column Coordinates */}
        {showCoordinates &&
          Array.from({ length: columns }).map((_, index) => {
            const x =
              60 + index * cellWidth + cellWidth / 2;

            return (
              <text
                key={`col-${index}`}
                x={x}
                y={height - 10}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="11"
              >
                C{index + 1}
              </text>
            );
          })}

        {/* Drop Zone Hint */}
        <text
          x={width / 2}
          y={height / 2}
          textAnchor="middle"
          fill="#cbd5e1"
          fontSize="18"
          fontWeight="600"
        >
          Drag Contacts, Coils, Timers & Counters Here
        </text>
      </svg>
    </div>
  );
}