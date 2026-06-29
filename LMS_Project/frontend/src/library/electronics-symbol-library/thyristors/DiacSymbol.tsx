"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function DiacSymbol({
  className = "",
  label = "DIAC",
  width = 220,
  height = 130,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 72 41"
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
        <circle cx="25" cy="10" r="10" strokeWidth="0.5" />

        <path d="M28 11.333L22.3 14l5.7 2.667" fill="none" strokeWidth="0.5" />
        <path d="M22 3.333L27.7 6 22 8.666" fill="none" strokeWidth="0.5" />
        <path d="M22 2v16" fill="none" strokeWidth="0.5" />
        <path d="M28 2v16" fill="none" strokeWidth="0.5" />

        <path d="M50 10H28" fill="none" strokeWidth="0.5" />
        <path d="M0 10h22" fill="none" strokeWidth="0.5" />

        <text fontSize="7" textAnchor="start" fill="#000" stroke="none">
          <tspan x="2" y="6.81">
            1
          </tspan>
        </text>

        <text fontSize="7" textAnchor="end" fill="#000" stroke="none">
          <tspan x="48" y="6.81">
            2
          </tspan>
        </text>
      </g>
    </svg>
  );
}
