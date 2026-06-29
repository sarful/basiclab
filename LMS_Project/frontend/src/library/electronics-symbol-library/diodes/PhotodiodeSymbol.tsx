"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function PhotodiodeSymbol({
  className = "",
  label = "Diode - Photodiode",
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
        <path d="M20 15v10l10-5z" strokeWidth="0.5" />

        <path d="M0 20h20" fill="none" strokeWidth="0.5" />
        <path d="M50 20H30" fill="none" strokeWidth="0.5" />
        <path d="M30 15v10" fill="none" strokeWidth="0.5" />

        <g transform="matrix(-.965926 .258819 -.258819 -.965926 29.849648 13.342816)">
          <path
            d="M1.951 3.185L.975 0 0 3.185z"
            fill="#000"
            strokeWidth="0.5"
          />
        </g>

        <g transform="matrix(-.766044 -.642788 .642788 -.766044 28.041311 10.400546)">
          <path d="M0 0l2.96 1.944" fill="none" strokeWidth="0.5" />
        </g>

        <g transform="matrix(-.965926 .258819 -.258819 -.965926 25.708648 13.342816)">
          <path
            d="M1.951 3.185L.975 0 0 3.185z"
            fill="#000"
            strokeWidth="0.5"
          />
        </g>

        <g transform="matrix(-.766044 -.642788 .642788 -.766044 23.900156 10.400644)">
          <path d="M0 0l2.852 2.035" fill="none" strokeWidth="0.5" />
        </g>

        <text textAnchor="start" fontSize="7" fill="#000" stroke="none">
          <tspan x="2" y="16.81">
            a
          </tspan>
        </text>

        <text textAnchor="end" fontSize="7" fill="#000" stroke="none">
          <tspan x="48" y="16.81">
            k
          </tspan>
        </text>
      </g>
    </svg>
  );
}
