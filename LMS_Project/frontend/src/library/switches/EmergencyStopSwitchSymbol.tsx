"use client";

type LEDSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function LEDSymbol({
  className = "",
  label = "Emergency Stop Switch",
  width = 180,
  height = 260,
}: LEDSymbolProps) {
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
          d="M17 25H5.125"
          fill="none"
          strokeDasharray="1.5 2"
          strokeWidth="0.5"
        />
        <path d="M5 30a4.99 4.99 0 1 1 0-10z" strokeWidth="0.5" />
      </g>
    </svg>
  );
}
