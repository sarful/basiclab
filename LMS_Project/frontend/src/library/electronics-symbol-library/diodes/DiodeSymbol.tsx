"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function DiodeSymbol({
  className = "",
  label = "Diode",
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
        <path d="M20 5v10l10-5z" strokeWidth="0.5" />

        <path d="M0 10h20" fill="none" strokeWidth="0.5" />
        <path d="M30 10h20" fill="none" strokeWidth="0.5" />
        <path d="M30 5v10" fill="none" strokeWidth="0.5" />

        <text fill="#000" fontSize="7" textAnchor="start" stroke="none">
          <tspan x="2" y="7.31">
            a
          </tspan>
        </text>

        <text fill="#000" fontSize="7" textAnchor="end" stroke="none">
          <tspan x="48" y="7.31">
            k
          </tspan>
        </text>
      </g>
    </svg>
  );
}
