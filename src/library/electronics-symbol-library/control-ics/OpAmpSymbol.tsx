"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function OpAmpSymbol({
  className = "",
  label = "Operational Amplifier",
  width = 260,
  height = 190,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 260 190"
      role="img"
      aria-label={label}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M91 49L91 173L215 111L91 49Z"
        fill="#ffffff"
        stroke="#374151"
        strokeWidth="2"
        strokeLinejoin="miter"
      />

      <line
        x1="78"
        y1="87"
        x2="91"
        y2="87"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <line
        x1="78"
        y1="136"
        x2="91"
        y2="136"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <line
        x1="215"
        y1="111"
        x2="228"
        y2="111"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <line
        x1="99"
        y1="87"
        x2="115"
        y2="87"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <line
        x1="99"
        y1="136"
        x2="115"
        y2="136"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />

      <line
        x1="107"
        y1="128"
        x2="107"
        y2="144"
        stroke="#374151"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}
