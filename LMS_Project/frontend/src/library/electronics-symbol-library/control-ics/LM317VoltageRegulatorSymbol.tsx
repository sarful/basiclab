"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function VoltageRegulatorSymbol({
  className = "",
  label = "LM317 Voltage Regulator",
  width = 220,
  height = 160,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 220 160"
      role="img"
      aria-label={label}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="110"
        y="24"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fontFamily="Arial, Helvetica, sans-serif"
        fill="#111827"
      >
        LM317
      </text>

      <rect
        x="72"
        y="41"
        width="78"
        height="62"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="58"
        y1="65"
        x2="72"
        y2="65"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <line
        x1="150"
        y1="65"
        x2="164"
        y2="65"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <line
        x1="111"
        y1="103"
        x2="111"
        y2="116"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <text
        x="84"
        y="70"
        textAnchor="middle"
        fontSize="14"
        fontStyle="italic"
        fontFamily="Arial, Helvetica, sans-serif"
        fill="#1f2937"
      >
        IN
      </text>

      <text
        x="134"
        y="70"
        textAnchor="middle"
        fontSize="14"
        fontStyle="italic"
        fontFamily="Arial, Helvetica, sans-serif"
        fill="#1f2937"
      >
        OUT
      </text>

      <text
        x="111"
        y="99"
        textAnchor="middle"
        fontSize="14"
        fontStyle="italic"
        fontFamily="Arial, Helvetica, sans-serif"
        fill="#1f2937"
      >
        ADJ
      </text>
    </svg>
  );
}
