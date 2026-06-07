"use client";

type OnDelayTimerSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function OnDelayTimerSymbol({
  className = "",
  label = "On Delay Timer",
  width = 220,
  height = 260,
}: OnDelayTimerSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 51 71"
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
        <text fontSize="7" textAnchor="end" fill="#000" stroke="none">
          <tspan x="18.001" y="9">
            A1
          </tspan>
          <tspan x="18.001" y="46.81">
            A2
          </tspan>
        </text>

        <path d="M20 30v20" fill="none" strokeWidth="0.5" />
        <path d="M20 20V0" fill="none" strokeWidth="0.5" />
        <path d="M0 20h30v10H0z" strokeWidth="0.5" />
        <path d="M10 20v10" fill="none" strokeWidth="0.5" />
        <path d="M0 30l10-10" fill="none" strokeWidth="0.5" />
        <path d="M10 30L0 20" fill="none" strokeWidth="0.5" />
      </g>
    </svg>
  );
}
