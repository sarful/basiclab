"use client";

import type {
  ElectronicsSymbolProps,
  ElectronicsSymbolTerminalMap,
  ElectronicsSymbolViewBox,
} from "../shared";

export const RESISTOR_SYMBOL_VIEW_BOX: ElectronicsSymbolViewBox = {
  minX: -10,
  minY: -10,
  width: 71,
  height: 41,
};

export const RESISTOR_TERMINAL_OFFSET: ElectronicsSymbolTerminalMap = {
  terminal1: { x: 0, y: 10 },
  terminal2: { x: 50, y: 10 },
};

export default function ResistorSymbol({
  className = "",
  label = "Resistor",
  width = 220,
  height = 130,
  showTerminalLabels = true,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 71 41"
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
        <path
          d="M19 10l1-2.5 2 5 2-5 2 5 2-5 2 5 1-2.5"
          fill="none"
          strokeWidth="0.5"
        />
        <path d="M0 10h19" fill="none" strokeWidth="0.5" />
        <path d="M31 10h19" fill="none" strokeWidth="0.5" />

        {showTerminalLabels ? (
          <>
            <text textAnchor="start" fill="#000" fontSize="7" stroke="none">
              <tspan x="2" y="6.81">
                1
              </tspan>
            </text>

            <text textAnchor="end" fill="#000" fontSize="7" stroke="none">
              <tspan x="48" y="6.81">
                2
              </tspan>
            </text>
          </>
        ) : null}
      </g>
    </svg>
  );
}
