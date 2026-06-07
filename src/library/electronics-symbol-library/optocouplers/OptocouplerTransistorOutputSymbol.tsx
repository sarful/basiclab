"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function OptocouplerTransistorOutputSymbol({
  className = "",
  label = "Optocoupler - Transistor Output",
  width = 240,
  height = 200,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 72 61"
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
        <path d="M0 0h50v40H0z" strokeWidth="0.5" />

        <path d="M0 10h10v6.875" fill="none" strokeWidth="0.5" />
        <path d="M10 23l-3.75-6h7.5z" fill="none" strokeWidth="0.5" />
        <path d="M12.5 23h-5" fill="none" strokeWidth="0.5" />
        <path d="M0 30h10v-6.75" fill="none" strokeWidth="0.5" />

        <g transform="matrix(0 1 -1 0 26.500092 17)">
          <path d="M2 3L1 0 0 3z" fill="#000" strokeWidth="0.5" />
        </g>

        <g transform="matrix(-.819152 .573576 -.573576 -.819152 23.500184 18.000226)">
          <path d="M0 0l2.697 1.918" fill="none" strokeWidth="0.5" />
        </g>

        <g transform="matrix(0 1 -1 0 26.500192 21)">
          <path d="M2 3L1 0 0 3z" fill="#000" strokeWidth="0.5" />
        </g>

        <g transform="matrix(-.819152 .573576 -.573576 -.819152 23.499977 22.000004)">
          <path d="M0 0l2.686 1.909" fill="none" strokeWidth="0.5" />
        </g>

        <path d="M33 15v10" fill="none" strokeWidth="0.5" />
        <path d="M50 10H40v4l-7 3" fill="none" strokeWidth="0.5" />
        <path d="M50 30H40v-4l-7-3" fill="none" strokeWidth="0.5" />

        <g transform="matrix(-.374607 .927184 -.927184 -.374607 38.176081 24.201507)">
          <path
            d="M2.024 3.185L1.012 0 0 3.185z"
            fill="#000"
            strokeWidth="0.5"
          />
        </g>

        <text fontSize="7" textAnchor="start" fill="#000" stroke="none">
          <tspan x="2" y="6.81">
            a
          </tspan>
          <tspan x="2" y="26.81">
            k
          </tspan>
        </text>

        <text fontSize="7" textAnchor="end" fill="#000" stroke="none">
          <tspan x="48" y="6.81">
            C
          </tspan>
          <tspan x="48" y="26.81">
            E
          </tspan>
        </text>
      </g>
    </svg>
  );
}
