"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function TriacSymbol({
  className = "",
  label = "TRIAC",
  width = 240,
  height = 160,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 81 51"
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
        <circle cx="30" cy="20" r="10" strokeWidth="0.5" />

        <path d="M33 21.333L27.3 24l5.7 2.667" fill="none" strokeWidth="0.5" />

        <path d="M27 13.333L32.7 16 27 18.666" fill="none" strokeWidth="0.5" />

        <path d="M27 12v16" fill="none" strokeWidth="0.5" />
        <path d="M33 12v16" fill="none" strokeWidth="0.5" />

        <path d="M60 20H33" fill="none" strokeWidth="0.5" />
        <path d="M0 20h27" fill="none" strokeWidth="0.5" />

        <path d="M20 40V28" fill="none" strokeWidth="0.5" />
        <path d="M20 28h7" fill="none" strokeWidth="0.5" />

        <text fontSize="7" textAnchor="start" fill="#000" stroke="none">
          <tspan x="2" y="16.81">
            MT1
          </tspan>
        </text>

        <text fontSize="7" textAnchor="end" fill="#000" stroke="none">
          <tspan x="58" y="16.81">
            MT2
          </tspan>
        </text>

        <text fontSize="7" textAnchor="middle" fill="#000" stroke="none">
          <tspan x="20" y="46.81">
            G
          </tspan>
        </text>
      </g>
    </svg>
  );
}
