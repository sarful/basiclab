"use client";

import type { SVGProps } from "react";

type SchottkyDiodeSymbolProps = SVGProps<SVGSVGElement> & {
  strokeWidth?: number;
};

export default function SchottkyDiodeSymbol({
  className,
  strokeWidth = 8,
  ...props
}: SchottkyDiodeSymbolProps) {
  return (
    <svg
      viewBox="0 0 400 180"
      className={className}
      role="img"
      aria-label="Schottky diode symbol"
      fill="none"
      {...props}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <line x1="24" y1="90" x2="130" y2="90" strokeWidth={strokeWidth} />
        <circle cx="24" cy="90" r="10" strokeWidth={strokeWidth * 0.45} />

        <path d="M130 36 L130 144 L218 90 Z" fill="currentColor" stroke="none" />

        <line x1="252" y1="36" x2="252" y2="144" strokeWidth={strokeWidth} />
        <path d="M252 36 H302 V58" strokeWidth={strokeWidth} />
        <path d="M252 144 H218 V122" strokeWidth={strokeWidth} />

        <line x1="252" y1="90" x2="370" y2="90" strokeWidth={strokeWidth} />
        <circle cx="370" cy="90" r="10" strokeWidth={strokeWidth * 0.45} />
      </g>
    </svg>
  );
}
