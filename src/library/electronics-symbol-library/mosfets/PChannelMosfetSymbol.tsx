"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function PChannelMosfetSymbol({
  className = "",
  label = "P-Channel MOSFET",
  width = 220,
  height = 260,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 61 71"
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
        <circle cx="25" cy="25" r="11" strokeWidth="0.5" />

        <path d="M20 19v11H0" fill="none" strokeWidth="0.5" />
        <path d="M23 19v2" fill="none" strokeWidth="0.5" />
        <path d="M23 24v2" fill="none" strokeWidth="0.5" />
        <path d="M23 29v2" fill="none" strokeWidth="0.5" />
        <path d="M23 30h7v20" fill="none" strokeWidth="0.5" />
        <path d="M23 20h7V0" fill="none" strokeWidth="0.5" />
        <path d="M23 25h7v5" fill="none" strokeWidth="0.5" />
        <path d="M27.5 23.75L30 25l-2.5 1.25" fill="none" strokeWidth="0.5" />

        <text fontSize="7" textAnchor="end" fill="#000" stroke="none">
          <tspan x="28" y="46.81">
            S
          </tspan>
        </text>

        <text fontSize="7" textAnchor="start" fill="#000" stroke="none">
          <tspan x="2" y="26.81">
            G
          </tspan>
        </text>

        <text fontSize="7" textAnchor="end" fill="#000" stroke="none">
          <tspan x="28" y="9">
            D
          </tspan>
        </text>
      </g>
    </svg>
  );
}
