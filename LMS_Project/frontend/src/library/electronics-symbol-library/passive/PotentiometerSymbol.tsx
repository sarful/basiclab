"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function PotentiometerSymbol({
  className = "",
  label = "Potentiometer",
  width = 220,
  height = 160,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 71 51"
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
        <text fontSize="7" textAnchor="start" fill="#000" stroke="none">
          <tspan x="2" y="16.81">
            1
          </tspan>
        </text>

        <text fontSize="7" textAnchor="end" fill="#000" stroke="none">
          <tspan x="48" y="16.81">
            2
          </tspan>
          <tspan x="48" y="6.811">
            3
          </tspan>
        </text>

        <path
          d="M19 20l1-2.5 2 5 2-5 2 5 2-5 2 5 1-2.5"
          fill="none"
          strokeWidth="0.5"
        />
        <path d="M50 10H25v4" fill="none" strokeWidth="0.5" />

        <g transform="matrix(-1 0 0 -1 26 17.1852)">
          <path d="M2 3.185L1 0 0 3.185z" fill="#000" strokeWidth="0.5" />
        </g>

        <path d="M31 20h19" fill="none" strokeWidth="0.5" />
        <path d="M19 20H0" fill="none" strokeWidth="0.5" />
      </g>
    </svg>
  );
}
