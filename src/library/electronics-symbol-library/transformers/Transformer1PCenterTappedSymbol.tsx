"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function Transformer1PCenterTappedSymbol({
  className = "",
  label = "Transformer - 1P with Center Tapping",
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
        <path
          d="M30 50V30c0-1.385-1.115-2.5-2.5-2.5S25 28.615 25 30c0-1.385-1.115-2.5-2.5-2.5S20 28.615 20 30v20"
          fill="none"
          strokeWidth="0.5"
        />
        <path
          d="M20 30c0-1.385-1.115-2.5-2.5-2.5S15 28.615 15 30c0-1.385-1.115-2.5-2.5-2.5S10 28.615 10 30v20"
          fill="none"
          strokeWidth="0.5"
        />
        <path
          d="M30 0v20.337c0 1.199-1.115 2.163-2.5 2.163s-2.5-.965-2.5-2.163c0 1.199-1.115 2.163-2.5 2.163s-2.5-.965-2.5-2.163c0 1.199-1.115 2.163-2.5 2.163s-2.5-.965-2.5-2.163c0 1.199-1.115 2.163-2.5 2.163s-2.5-.965-2.5-2.163V0"
          fill="none"
          strokeWidth="0.5"
        />

        <text
          textAnchor="end"
          transform="matrix(0 -1 1 0 0 15)"
          fill="#000"
          stroke="none"
          fontSize="7"
        >
          <tspan x="13" y="6.81">
            1L
          </tspan>
        </text>

        <text
          textAnchor="end"
          transform="matrix(0 -1 1 0 20 15)"
          fill="#000"
          stroke="none"
          fontSize="7"
        >
          <tspan x="13" y="6.81">
            1N
          </tspan>
        </text>

        <text
          textAnchor="start"
          transform="matrix(0 -1 1 0 0 50)"
          fill="#000"
          stroke="none"
          fontSize="7"
        >
          <tspan x="2" y="6.81">
            2.1L
          </tspan>
        </text>

        <text
          textAnchor="start"
          transform="matrix(0 -1 1 0 10 50)"
          fill="#000"
          stroke="none"
          fontSize="7"
        >
          <tspan x="2" y="6.81">
            2.2L
          </tspan>
        </text>

        <text
          textAnchor="start"
          transform="matrix(0 -1 1 0 20 50)"
          fill="#000"
          stroke="none"
          fontSize="7"
        >
          <tspan x="2" y="6.81">
            2N
          </tspan>
        </text>
      </g>
    </svg>
  );
}
