"use client";

type FlowSwitchSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function FlowSwitchSymbol({
  className = "",
  label = "Flow Switch",
  width = 180,
  height = 260,
}: FlowSwitchSymbolProps) {
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
        <path d="M15 15l5 20v15" fill="none" strokeWidth="0.5" />
        <path
          d="M17.5 25H10"
          fill="none"
          strokeDasharray="1.5 2"
          strokeWidth="0.5"
        />
        <path d="M0 20h10v10H0z" strokeWidth="0.5" />
        <path d="M10 20h2.5" fill="none" strokeWidth="0.5" />
      </g>
    </svg>
  );
}
