"use client";

import type {
  ElectronicsSymbolProps,
  ElectronicsSymbolTerminalMap,
  ElectronicsSymbolViewBox,
} from "../shared";

export const LED_SYMBOL_VIEW_BOX: ElectronicsSymbolViewBox = {
  minX: -10,
  minY: -10,
  width: 71,
  height: 51,
};

export const LED_TERMINAL_OFFSET: ElectronicsSymbolTerminalMap = {
  anode: { x: 0, y: 19.992 },
  cathode: { x: 50, y: 19.992 },
};

export default function LEDSymbol({
  className = "",
  label = "Diode - Light Emmitting (LED)",
  width = 220,
  height = 160,
  showTerminalLabels = true,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 71 51"
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
        <path d="M20 14.992v10l10-5z" strokeWidth="0.5" />

        <path d="M0 19.992h20" fill="none" strokeWidth="0.5" />
        <path d="M50 19.992H30" fill="none" strokeWidth="0.5" />
        <path d="M30 14.992v10" fill="none" strokeWidth="0.5" />

        <g transform="matrix(.965926 .258819 -.258819 .965926 27.965416 6.747574)">
          <path d="M0 3.185L.975 0l.975 3.185z" fill="#000" strokeWidth="0.5" />
        </g>

        <g transform="matrix(.766044 -.642788 .642788 .766044 25.773436 12.097694)">
          <path d="M2.961 0L0 1.945" fill="none" strokeWidth="0.5" />
        </g>

        <g transform="matrix(.965926 .258819 -.258819 .965926 23.824416 6.747574)">
          <path d="M0 3.185L.975 0l.975 3.185z" fill="#000" strokeWidth="0.5" />
        </g>

        <g transform="matrix(.766044 -.642788 .642788 .766044 21.715091 12.028112)">
          <path d="M2.852 0L0 2.035" fill="none" strokeWidth="0.5" />
        </g>

        {showTerminalLabels ? (
          <>
            <text textAnchor="start" fontSize="7" fill="#000" stroke="none">
              <tspan x="2" y="16.81">
                a
              </tspan>
            </text>

            <text textAnchor="end" fontSize="7" fill="#000" stroke="none">
              <tspan x="48" y="16.81">
                k
              </tspan>
            </text>
          </>
        ) : null}
      </g>
    </svg>
  );
}
