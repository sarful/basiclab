"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function Transformer1PSymbol({
  className = "",
  label = "Transformer - 1P",
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
          d="M30 50V29.664c0-1.199-1.115-2.163-2.5-2.163s-2.5.965-2.5 2.163c0-1.199-1.115-2.163-2.5-2.163s-2.5.965-2.5 2.163c0-1.199-1.115-2.163-2.5-2.163s-2.5.965-2.5 2.163c0-1.199-1.115-2.163-2.5-2.163s-2.5.965-2.5 2.163V50"
          fill="none"
          strokeWidth="0.5"
        />

        <path
          d="M30 0v20.337c0 1.199-1.115 2.163-2.5 2.163s-2.5-.965-2.5-2.163c0 1.199-1.115 2.163-2.5 2.163s-2.5-.965-2.5-2.163c0 1.199-1.115 2.163-2.5 2.163s-2.5-.965-2.5-2.163c0 1.199-1.115 2.163-2.5 2.163s-2.5-.965-2.5-2.163V0"
          fill="none"
          strokeWidth="0.5"
        />

        <text textAnchor="end" fill="#000" stroke="none" fontSize="7">
          <tspan x="8" y="9">
            1L
          </tspan>
          <tspan x="28" y="9">
            1N
          </tspan>
          <tspan x="8" y="46.81">
            2L
          </tspan>
          <tspan x="28" y="46.81">
            2N
          </tspan>
        </text>
      </g>
    </svg>
  );
}
