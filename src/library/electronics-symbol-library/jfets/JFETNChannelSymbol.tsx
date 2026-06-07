"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function JFETNChannelSymbol({
  className = "",
  label = "JFET - N Channel",
  width = 220,
  height = 280,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 61 81"
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
        <circle cx="25" cy="30" r="11" strokeWidth="0.5" />

        <path d="M24 26v8" fill="none" strokeWidth="0.5" />
        <path d="M25 24v12" fill="none" strokeWidth="0.5" />
        <path d="M25 26h5V0" fill="none" strokeWidth="0.5" />
        <path d="M25 34h5v60" fill="none" strokeWidth="0.5" />
        <path d="M24 30H0" fill="none" strokeWidth="0.5" />

        <g transform="matrix(0 1 -1 0 21 29.0001)">
          <path d="M2 3L1 0 0 3z" fill="#000" strokeWidth="0.5" />
        </g>

        <text fontSize="7" textAnchor="start" fill="#000" stroke="none">
          <tspan x="2" y="26.812">
            G
          </tspan>
        </text>

        <text fontSize="7" textAnchor="end" fill="#000" stroke="none">
          <tspan x="28" y="8.998">
            D
          </tspan>
          <tspan x="28" y="56.812">
            S
          </tspan>
        </text>
      </g>
    </svg>
  );
}
