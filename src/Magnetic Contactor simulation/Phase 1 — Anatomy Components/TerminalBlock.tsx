"use client";

import React from "react";

export type TerminalItem = {
  id: string;
  topLabel: string;
  bottomLabel: string;
};

export interface TerminalBlockProps {
  terminals?: TerminalItem[];
  width?: number;
  height?: number;
  title?: string;
  orientation?: "top" | "bottom";
  activeTerminalId?: string;
  showLabels?: boolean;
}

const defaultTerminals: TerminalItem[] = [
  { id: "L1", topLabel: "1", bottomLabel: "L1" },
  { id: "L2", topLabel: "3", bottomLabel: "L2" },
  { id: "L3", topLabel: "5", bottomLabel: "L3" },
];

export default function TerminalBlock({
  terminals = defaultTerminals,
  width = 360,
  height = 140,
  title = "Terminal Block",
  orientation = "top",
  activeTerminalId,
  showLabels = true,
}: TerminalBlockProps) {
  const blockPadding = 18;
  const usableWidth = width - blockPadding * 2;
  const spacing = usableWidth / terminals.length;
  const screwY = orientation === "top" ? height * 0.58 : height * 0.44;
  const labelY = orientation === "top" ? height * 0.25 : height * 0.82;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
        role="img"
        aria-label={title}
      >
        <defs>
          <linearGradient id="terminalCream" x1="0" x2="1">
            <stop offset="0%" stopColor="#d7d8cf" />
            <stop offset="45%" stopColor="#f2f3ea" />
            <stop offset="100%" stopColor="#c4c6ba" />
          </linearGradient>

          <radialGradient id="terminalScrew" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#f9fafb" />
            <stop offset="45%" stopColor="#717a75" />
            <stop offset="100%" stopColor="#111827" />
          </radialGradient>

          <filter id="terminalGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main plastic terminal body */}
        <rect
          x="8"
          y="8"
          width={width - 16}
          height={height - 16}
          rx="10"
          fill="url(#terminalCream)"
          stroke="#b7b9ae"
          strokeWidth="2"
        />

        {/* Small shadow line for molded plastic depth */}
        <path
          d={`M18 ${orientation === "top" ? height - 28 : 30} H${width - 18}`}
          stroke="#a9aba1"
          strokeWidth="2"
          opacity="0.55"
        />

        {terminals.map((terminal, index) => {
          const cx = blockPadding + spacing * index + spacing / 2;
          const isActive = terminal.id === activeTerminalId;

          return (
            <g key={terminal.id}>
              {/* Terminal separator */}
              {index > 0 && (
                <line
                  x1={blockPadding + spacing * index}
                  y1="18"
                  x2={blockPadding + spacing * index}
                  y2={height - 18}
                  stroke="#bfc1b6"
                  strokeWidth="1.5"
                  opacity="0.7"
                />
              )}

              {/* Active highlight */}
              {isActive && (
                <circle
                  cx={cx}
                  cy={screwY}
                  r="38"
                  fill="#fde68a"
                  opacity="0.45"
                  filter="url(#terminalGlow)"
                />
              )}

              {/* Screw plate */}
              <circle cx={cx} cy={screwY} r="32" fill="#cfd1c6" />
              <circle cx={cx} cy={screwY} r="22" fill="url(#terminalScrew)" />

              {/* Screw slot */}
              <path
                d={`M${cx - 16} ${screwY + 4} Q${cx} ${screwY - 10} ${cx + 16} ${screwY + 4}`}
                stroke="#111827"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />

              {/* Labels */}
              <text
                x={cx - 26}
                y={labelY}
                fontSize="18"
                fill="#7b7d75"
                fontWeight="700"
              >
                {terminal.topLabel}
              </text>
              <text
                x={cx + 2}
                y={labelY}
                fontSize="18"
                fill="#7b7d75"
                fontWeight="700"
              >
                {terminal.bottomLabel}
              </text>

              {/* Wire entry opening */}
              <rect
                x={cx - 16}
                y={orientation === "top" ? 2 : height - 10}
                width="32"
                height="18"
                rx="4"
                fill="#202422"
              />
            </g>
          );
        })}
      </svg>

      {showLabels && (
        <div className="text-center">
          <div className="font-semibold text-gray-800">{title}</div>
          <div className="text-xs text-gray-500">
            {orientation === "top" ? "Line/Input Terminals" : "Load/Output Terminals"}
          </div>
        </div>
      )}
    </div>
  );
}
