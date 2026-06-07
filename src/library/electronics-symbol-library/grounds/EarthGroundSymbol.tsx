"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function EarthGroundSymbol({
  className = "",
  label = "Earth Ground",
  width = 160,
  height = 200,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 41 51"
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
        <path d="M10 0v15" fill="none" strokeWidth="0.5" />
        <path d="M5 15h10" fill="none" strokeWidth="0.5" />
        <path d="M7.5 17.5h5" fill="none" strokeWidth="0.5" />
        <path d="M8.75 20h2.5" fill="none" strokeWidth="0.5" />
      </g>
    </svg>
  );
}
