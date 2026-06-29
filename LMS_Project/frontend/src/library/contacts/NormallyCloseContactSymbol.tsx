"use client";

type LEDSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function LEDSymbol({
  className = "",
  label = "Normally Close Contact",
  width = 160,
  height = 260,
}: LEDSymbolProps) {
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
        <path d="M17.5 15L10 35v15" fill="none" strokeWidth="0.5" />
        <path d="M10 0v18h10" fill="none" strokeWidth="0.5" />
      </g>
    </svg>
  );
}
