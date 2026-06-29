"use client";

import type { BiasMode } from "./types";

type DiodeJunctionStateProps = {
  bias: BiasMode;
  active: boolean;
  currentLevel: number;
  offsetX?: number;
  offsetY?: number;
};

export function DiodeJunctionState({
  bias,
  active,
  currentLevel,
  offsetX = 0,
  offsetY = 0,
}: DiodeJunctionStateProps) {
  const depletionWidth = active
    ? Math.max(10, 28 - currentLevel * 16)
    : bias === "reverse"
      ? 48
      : 30;

  return (
    <g transform={`translate(${offsetX} ${offsetY})`}>
      <rect
        x="408"
        y="286"
        width="205"
        height="82"
        rx="16"
        fill="#f8fafc"
        stroke="#cbd5e1"
      />
      <rect
        x="433"
        y="308"
        width="55"
        height="36"
        rx="8"
        fill="#fecaca"
        stroke="#ef4444"
      />
      <rect
        x="533"
        y="308"
        width="55"
        height="36"
        rx="8"
        fill="#bfdbfe"
        stroke="#3b82f6"
      />

      <rect
        x={510 - depletionWidth / 2}
        y="303"
        width={depletionWidth}
        height="46"
        rx="8"
        fill={active ? "#bbf7d0" : "#fde68a"}
        stroke={active ? "#22c55e" : "#f59e0b"}
      />

      <text
        x="460"
        y="332"
        textAnchor="middle"
        fontSize="15"
        fontWeight="900"
        fill="#991b1b"
      >
        P
      </text>
      <text
        x="561"
        y="332"
        textAnchor="middle"
        fontSize="15"
        fontWeight="900"
        fill="#1d4ed8"
      >
        N
      </text>

      <text
        x="510"
        y="361"
        textAnchor="middle"
        fontSize="12"
        fontWeight="800"
        fill={active ? "#15803d" : "#92400e"}
      >
        {active
          ? "Forward biased: current flows"
          : bias === "reverse"
            ? "Reverse biased: current blocked"
            : "Barrier not crossed"}
      </text>
    </g>
  );
}
