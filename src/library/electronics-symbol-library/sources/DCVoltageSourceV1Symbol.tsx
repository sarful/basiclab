"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function DCVoltageSourceV1Symbol({
  className = "",
  label = "DC Voltage Source V1",
  width = 150,
  height = 160,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 150 160"
      role="img"
      aria-label={label}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="57"
        y1="24"
        x2="57"
        y2="50"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <circle
        cx="57"
        cy="75"
        r="25"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
      />

      <line
        x1="57"
        y1="100"
        x2="57"
        y2="125"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <line
        x1="49"
        y1="68"
        x2="65"
        y2="68"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <line
        x1="57"
        y1="60"
        x2="57"
        y2="76"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <line
        x1="49"
        y1="86"
        x2="65"
        y2="86"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}
