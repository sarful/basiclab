"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function PWMSymbol({
  className = "",
  label = "PWM",
  width = 220,
  height = 145,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 220 145"
      role="img"
      aria-label={label}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="124"
        y="36"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fontFamily="Arial, Helvetica, sans-serif"
        fill="#111827"
      >
        PWM1
      </text>

      <rect
        x="86"
        y="44"
        width="75"
        height="62"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="79"
        y1="69"
        x2="86"
        y2="69"
        stroke="#374151"
        strokeWidth="2"
      />

      <circle
        cx="74"
        cy="69"
        r="5"
        fill="#9ca3af"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="161"
        y1="69"
        x2="168"
        y2="69"
        stroke="#374151"
        strokeWidth="2"
      />

      <circle
        cx="173"
        cy="69"
        r="5"
        fill="#9ca3af"
        stroke="#374151"
        strokeWidth="2"
      />

      <path
        d="M93 71C96 62 101 62 104 71C107 80 112 80 115 71"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M126 77V64H135V77"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      <path
        d="M142 77V64H151V77"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      <text
        x="101"
        y="91"
        textAnchor="middle"
        fontSize="14"
        fontStyle="italic"
        fontFamily="Arial, Helvetica, sans-serif"
        fill="#1f2937"
      >
        IN
      </text>

      <text
        x="141"
        y="91"
        textAnchor="middle"
        fontSize="14"
        fontStyle="italic"
        fontFamily="Arial, Helvetica, sans-serif"
        fill="#1f2937"
      >
        OUT
      </text>
    </svg>
  );
}
