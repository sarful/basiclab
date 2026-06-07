"use client";

import type { ElectronicsSymbolProps } from "../shared";


export default function BridgeRectifierSymbol({
  className = "",
  label = "Bridge Rectifier",
  width = 220,
  height = 220,
}: ElectronicsSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 71 71"
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
        <text fill="#000" fontSize="7" textAnchor="end" stroke="none">
          <tspan x="23" y="-3.19">
            ~
          </tspan>
          <tspan x="23" y="59">
            ~
          </tspan>
        </text>

        <text fill="#000" fontSize="7" textAnchor="start" stroke="none">
          <tspan x="52" y="21.81">
            +
          </tspan>
        </text>

        <text fill="#000" fontSize="7" textAnchor="end" stroke="none">
          <tspan x="-2" y="21.81">
            -
          </tspan>
        </text>

        <g fill="none" strokeWidth="0.5">
          <path d="M25 0L0 25l25 25 25-25z" />
          <path d="M12.502 8.333l4.167 4.167" />
          <path d="M14.585 10.416l-6.25 2.083 4.167 4.167zM41.669 12.5l-4.167 4.167m2.083-2.084l-2.083-6.25-4.167 4.167zm-2.083 18.75l4.167 4.167" />
          <path d="M39.585 35.416l-6.25 2.083 4.167 4.167zM16.669 37.5l-4.167 4.167m2.083-2.084l-2.083-6.25L8.335 37.5z" />
        </g>
      </g>
    </svg>
  );
}
