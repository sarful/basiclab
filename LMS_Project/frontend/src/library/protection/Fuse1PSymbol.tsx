"use client";

type Fuse1PSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function Fuse1PSymbol({
  className = "",
  label = "Fuse 1P",
  width = 180,
  height = 260,
}: Fuse1PSymbolProps) {
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
        <g strokeWidth="0.5">
          <path d="M7 18h6v14H7z" />
          <path d="M10 0v50" fill="none" />
        </g>

        <text fill="#000" fontSize="7" textAnchor="end" stroke="none">
          <tspan x="8" y="9">
            1
          </tspan>
          <tspan x="8" y="46.81">
            2
          </tspan>
        </text>
      </g>
    </svg>
  );
}
