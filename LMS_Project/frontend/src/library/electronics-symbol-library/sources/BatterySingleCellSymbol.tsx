"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function BatterySingleCellSymbol({
  className = "",
  label = "Battery - Single Cell",
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
        <path d="M24 5v10" fill="none" strokeWidth="0.5" />
        <path d="M25.75 7.5h0.5v5h-0.5z" fill="#000" strokeWidth="0.5" />

        <path d="M50 10H26" fill="none" strokeWidth="0.5" />
        <path d="M0 10h24" fill="none" strokeWidth="0.5" />

        <text fill="#000" fontSize="7" textAnchor="start" stroke="none">
          <tspan x="2" y="6.81">
            +
          </tspan>
        </text>

        <text fill="#000" fontSize="7" textAnchor="end" stroke="none">
          <tspan x="48" y="6.81">
            -
          </tspan>
        </text>
      </g>
    </svg>
  );
}
