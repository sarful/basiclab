"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function NPNTransistorSymbol({
  className = "",
  label = "Transistor - NPN",
  width = 220,
  height = 280,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 71 81"
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
        <circle cx="30" cy="30" r="11" strokeWidth="0.5" />

        <path d="M0 30h23" fill="none" strokeWidth="0.5" />
        <path d="M23 25v10" fill="none" strokeWidth="0.5" />
        <path d="M30 0v24l-7 3.5" fill="none" strokeWidth="0.5" />
        <path d="M30 60V37l-7-4.5" fill="none" strokeWidth="0.5" />

        <g transform="matrix(-.573576 .819152 -.819152 -.573576 29.164289 35.231269)">
          <path
            d="M2.064 3.185L1.032 0 0 3.185z"
            fill="#000"
            strokeWidth="0.5"
          />
        </g>

        <text fontSize="7" textAnchor="start" fill="#000" stroke="none">
          <tspan x="2" y="26.812">
            B
          </tspan>
        </text>

        <text fontSize="7" textAnchor="end" fill="#000" stroke="none">
          <tspan x="28" y="8.998">
            C
          </tspan>
          <tspan x="28" y="56.812">
            E
          </tspan>
        </text>
      </g>
    </svg>
  );
}
