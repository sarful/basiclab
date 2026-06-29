"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function PhotoResistorSymbol({
  className = "",
  label = "Resistor - Light Dependent Photo Resistor",
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
        </text>

        <path
          d="M19 20l1-2.5 2 5 2-5 2 5 2-5 2 5 1-2.5"
          fill="none"
          strokeWidth="0.5"
        />

        <g transform="matrix(-.965926 -.258819 .258819 -.965926 23.057858 14.839671)">
          <path d="M0 3.185L.975 0l.975 3.185z" fill="#000" strokeWidth="0.5" />
        </g>

        <g transform="matrix(-.766044 .642788 -.642788 -.766044 25.249838 9.48955)">
          <path d="M2.961 0L0 1.945" fill="none" strokeWidth="0.5" />
        </g>

        <g transform="matrix(-.965926 -.258819 .258819 -.965926 27.198858 14.839671)">
          <path d="M0 3.185L.975 0l.975 3.185z" fill="#000" strokeWidth="0.5" />
        </g>

        <g transform="matrix(-.766044 .642788 -.642788 -.766044 29.308133 9.559083)">
          <path d="M2.852 0L0 2.035" fill="none" strokeWidth="0.5" />
        </g>

        <path d="M31 20h19" fill="none" strokeWidth="0.5" />
        <path d="M19 20H0" fill="none" strokeWidth="0.5" />
      </g>
    </svg>
  );
}
