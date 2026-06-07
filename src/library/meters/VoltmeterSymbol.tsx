"use client";

type VoltmeterSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function VoltmeterSymbol({
  className = "",
  label = "Voltmeter",
  width = 160,
  height = 260,
}: VoltmeterSymbolProps) {
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
        <circle cx="10" cy="25" r="10" strokeWidth="0.5" />
        <path d="M10 0v15" fill="none" strokeWidth="0.5" />
        <path d="M10 50V35" fill="none" strokeWidth="0.5" />
        <path
          d="M7.774 20.81l2.224 6.451 2.234-6.451h1.128l-2.9 7.82h-.913l-2.895-7.82h1.123z"
          fill="#000"
          stroke="none"
        />
      </g>
    </svg>
  );
}
