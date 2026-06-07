"use client";

type LeverLimitSwitchSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function LeverLimitSwitchSymbol({
  className = "",
  label = "Lever / Limit Switch",
  width = 220,
  height = 280,
}: LeverLimitSwitchSymbolProps) {
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
        <path d="M20 0v15" fill="none" strokeWidth="0.5" />
        <path d="M20 50V35l-5-20" fill="none" strokeWidth="0.5" />
        <path
          d="M17.5 25h-15"
          fill="none"
          strokeDasharray="2 1"
          strokeWidth="0.5"
        />
        <path d="M0 16l4 14.5" fill="none" strokeWidth="0.5" />
        <circle cx="5.5" cy="32.5" r="2.5" strokeWidth="0.5" />
      </g>
    </svg>
  );
}
