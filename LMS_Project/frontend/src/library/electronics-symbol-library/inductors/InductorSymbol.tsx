"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function InductorSymbol({
  className = "",
  label = "Inductor",
  width = 220,
  height = 130,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 71 41"
      role="img"
      aria-label={label}
      fill="#fff"
      fillRule="evenodd"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      fontFamily="Roboto"
      fontSize="14"
      textAnchor="middle"
    >
      <g transform="translate(0.5 0.5)">
        <path
          d="M0 10h15c0-6.667 5-6.667 5 0 0-6.667 5-6.667 5 0 0-6.667 5-6.667 5 0 0-6.667 5-6.667 5 0h15"
          fill="none"
          strokeWidth="0.5"
        />

        <text textAnchor="start" fill="#000" fontSize="7" stroke="none">
          <tspan x="2" y="6.81">
            1
          </tspan>
        </text>

        <text textAnchor="end" fill="#000" fontSize="7" stroke="none">
          <tspan x="48" y="6.81">
            2
          </tspan>
        </text>
      </g>
    </svg>
  );
}
