"use client";

type ElectronicClockRelayCoilSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function ElectronicClockRelayCoilSymbol({
  className = "",
  label = "Electronic Clock Relay Coil",
  width = 180,
  height = 260,
}: ElectronicClockRelayCoilSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 41 71"
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
        <path d="M10 30v20" fill="none" strokeWidth="0.5" />
        <path d="M10 20V0" fill="none" strokeWidth="0.5" />
        <path d="M0 20h20v10H0z" strokeWidth="0.5" />
        <circle cx="10" cy="25" r="3.75" strokeWidth="0.5" />
        <path d="M10 23v2H8" fill="none" strokeWidth="0.5" />

        <text fontSize="7" textAnchor="end" fill="#000" stroke="none">
          <tspan x="8" y="9">
            A1
          </tspan>
          <tspan x="8" y="46.81">
            A2
          </tspan>
        </text>
      </g>
    </svg>
  );
}
