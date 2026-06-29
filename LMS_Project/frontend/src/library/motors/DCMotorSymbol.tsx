"use client";

type DCMotorSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function DCMotorSymbol({
  className = "",
  label = "DC Motor",
  width = 240,
  height = 280,
}: DCMotorSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 81 91"
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
        <circle cx="20.002" cy="30" r="16" strokeWidth="0.5" />

        <path d="M9.876 0v17.5" fill="none" strokeWidth="0.5" />
        <path d="M29.874 0v17.25" fill="none" strokeWidth="0.5" />

        <path
          d="M16.46 22h1.211l2.324 5.956L22.319 22h1.216v7.3h-.937v-2.843l.088-3.068-2.334 5.911h-.718l-2.329-5.896.093 3.053V29.3h-.937V22z"
          fill="#000"
          stroke="none"
        />

        <path d="M25 34H15" fill="none" strokeWidth="0.5" />
        <path d="M15 38h2" fill="none" strokeWidth="0.5" />
        <path d="M19 38h2" fill="none" strokeWidth="0.5" />
        <path d="M23 38h2" fill="none" strokeWidth="0.5" />

        <text fontSize="7" textAnchor="end" fill="#000" stroke="none">
          <tspan x="8.002" y="8.998">
            1
          </tspan>
          <tspan x="28" y="8.998">
            2
          </tspan>
        </text>
      </g>
    </svg>
  );
}
