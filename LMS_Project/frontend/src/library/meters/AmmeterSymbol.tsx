"use client";

type AmmeterSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function AmmeterSymbol({
  className = "",
  label = "Ammeter",
  width = 160,
  height = 260,
}: AmmeterSymbolProps) {
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
          d="M12.437 29l-.764-2.088H8.322L7.569 29H6.481l3.055-8h.923l3.061 8h-1.082zm-2.44-6.698L8.64 26.044h2.72l-1.363-3.742z"
          fill="#000"
          stroke="none"
        />
      </g>
    </svg>
  );
}
