"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function OptocouplerTriacOutputSymbol({
  className = "",
  label = "Optocoupler - Triac Output",
  width = 240,
  height = 200,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 71 61"
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
        <path d="M50 10H40v8" fill="none" strokeWidth="0.5" />
        <path d="M50 30H40v-8" fill="none" strokeWidth="0.5" />
        <path d="M47 18H33" fill="none" strokeWidth="0.5" />
        <path d="M47 22H33" fill="none" strokeWidth="0.5" />
        <path d="M41 18l2 4 2-4" fill="none" strokeWidth="0.5" />
        <path d="M35 22l2-4 2 4" fill="none" strokeWidth="0.5" />
        <path d="M0 10h10v6.875" fill="none" strokeWidth="0.5" />
        <path d="M10 23l-3.75-6h7.5z" fill="none" strokeWidth="0.5" />
        <path d="M12.5 23h-5" fill="none" strokeWidth="0.5" />
        <path d="M0 30h10v-6.75" fill="none" strokeWidth="0.5" />

        <g transform="matrix(0 1 -1 0 26.375338 17)">
          <path d="M2 3.185L1 0 0 3.185z" fill="#000" strokeWidth="0.5" />
        </g>
        <g transform="matrix(-.819152 .573576 -.573576 -.819152 23.375148 17.999766)">
          <path d="M0 0l2.63 1.839" fill="none" strokeWidth="0.5" />
        </g>
        <g transform="matrix(0 1 -1 0 26.375138 20.9999)">
          <path d="M2 3.185L1 0 0 3.185z" fill="#000" strokeWidth="0.5" />
        </g>
        <g transform="matrix(-.819152 .573576 -.573576 -.819152 23.334176 22.005142)">
          <path d="M0 0l2.588 1.827" fill="none" strokeWidth="0.5" />
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
            1
          </tspan>
          <tspan x="48" y="26.81">
            2
          </tspan>
        </text>
      </g>
    </svg>
  );
}
