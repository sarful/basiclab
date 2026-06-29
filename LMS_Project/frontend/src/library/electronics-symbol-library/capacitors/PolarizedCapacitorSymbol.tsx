"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function PolarizedCapacitorSymbol({
  className = "",
  label = "Polarized Capacitor",
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
        <path d="M0 10h23" fill="none" strokeWidth="0.5" />
        <path d="M50 10H27" fill="none" strokeWidth="0.5" />
        <path d="M23 5v10" fill="none" strokeWidth="0.5" />
        <path d="M29 5q-4 5 0 10" fill="none" strokeWidth="0.5" />

        <text textAnchor="start" fontSize="7" fill="#000" stroke="none">
          <tspan x="2" y="6.81">
            +
          </tspan>
        </text>

        <text textAnchor="end" fontSize="7" fill="#000" stroke="none">
          <tspan x="48" y="6.81">
            -
          </tspan>
        </text>
      </g>
    </svg>
  );
}
