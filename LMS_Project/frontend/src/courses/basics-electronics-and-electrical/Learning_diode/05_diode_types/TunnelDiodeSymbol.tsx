"use client";

import type { SVGProps } from "react";

type TunnelDiodeSymbolProps = SVGProps<SVGSVGElement> & {
  strokeWidth?: number;
};

export default function TunnelDiodeSymbol({
  className,
  strokeWidth = 7,
  ...props
}: TunnelDiodeSymbolProps) {
  return (
    <svg
      viewBox="0 0 440 180"
      className={className}
      role="img"
      aria-label="Tunnel diode symbol"
      fill="none"
      {...props}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="90" x2="128" y2="90" strokeWidth={strokeWidth} />
        <circle cx="18" cy="90" r="9" strokeWidth={strokeWidth * 0.5} />

        <polygon points="128,38 128,142 242,90" fill="currentColor" stroke="none" />

        <line x1="270" y1="40" x2="270" y2="140" strokeWidth={strokeWidth} />
        <path d="M270 40 H316 V54" strokeWidth={strokeWidth} />
        <path d="M270 140 H316 V126" strokeWidth={strokeWidth} />

        <line x1="270" y1="90" x2="412" y2="90" strokeWidth={strokeWidth} />
        <circle cx="412" cy="90" r="9" strokeWidth={strokeWidth * 0.5} />
      </g>
    </svg>
  );
}
