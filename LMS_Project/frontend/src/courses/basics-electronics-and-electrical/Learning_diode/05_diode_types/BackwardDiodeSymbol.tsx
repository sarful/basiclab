"use client";

import type { SVGProps } from "react";

type BackwardDiodeSymbolProps = SVGProps<SVGSVGElement> & {
  strokeWidth?: number;
};

export default function BackwardDiodeSymbol({
  className,
  strokeWidth = 7,
  ...props
}: BackwardDiodeSymbolProps) {
  return (
    <svg
      viewBox="0 0 440 180"
      className={className}
      role="img"
      aria-label="Backward diode symbol"
      fill="none"
      {...props}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="90" x2="128" y2="90" strokeWidth={strokeWidth} />
        <circle cx="18" cy="90" r="9" strokeWidth={strokeWidth * 0.5} />

        <polygon points="128,36 128,144 238,90" fill="currentColor" stroke="none" />

        <line x1="268" y1="38" x2="268" y2="142" strokeWidth={strokeWidth} />
        <path d="M268 38 H314 V50" strokeWidth={strokeWidth} />
        <path d="M268 142 H314 V130" strokeWidth={strokeWidth} />

        <line x1="268" y1="90" x2="412" y2="90" strokeWidth={strokeWidth} />
        <circle cx="412" cy="90" r="9" strokeWidth={strokeWidth * 0.5} />
      </g>
    </svg>
  );
}
