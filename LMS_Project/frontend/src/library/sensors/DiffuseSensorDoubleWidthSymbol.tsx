"use client";

type SymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function DiffuseSensorDoubleWidthSymbol({
  className = "",
  label = "Photoelectric Sensor - Diffuse (Double Width)",
  width = 260,
  height = 360,
}: SymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 101 141"
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
        <path d="M5 25h50v70H5z" strokeWidth="0.5" />
        <path d="M30 60h5l8-3" fill="none" strokeWidth="0.5" />
        <path d="M43 60h5" fill="none" strokeWidth="0.5" />

        <g transform="matrix(0 1 -1 0 48 39.996)">
          <path d="M0 0v5h3" fill="none" strokeWidth="0.5" />
        </g>

        <g transform="matrix(0 1 -1 0 45 39.996)">
          <path d="M0 15v-5L2 0" fill="none" strokeWidth="0.5" />
        </g>

        <path d="M30 80.004h18" fill="none" strokeWidth="0.5" />

        <g transform="matrix(-1 0 0 -1 30 80)">
          <path d="M0 0v40" fill="none" strokeWidth="0.5" />
        </g>

        <g transform="matrix(-1 0 0 -1 30.504 60.5)">
          <circle cx=".5" cy=".5" r=".5" fill="#000" strokeWidth="0.5" />
        </g>

        <path d="M10 71h2v6h-2z" fill="#000" strokeWidth="0.5" />
        <path d="M10 79h2v6h-2z" fill="#000" strokeWidth="0.5" />
        <path d="M23 71h4v14h-4z" fill="none" strokeWidth="0.5" />
        <path d="M13 74h7l-4-1v2l4-1" fill="#000" strokeWidth="0.5" />
        <path d="M20 82h-7l4-1v2l-4-1" fill="#000" strokeWidth="0.5" />

        <path d="M25 71l-2 2.154" fill="none" strokeWidth="0.5" />
        <path d="M27 71l-4 4.308" fill="none" strokeWidth="0.5" />
        <path d="M27 73.154l-4 4.308" fill="none" strokeWidth="0.5" />
        <path d="M27 75.308l-4 4.308" fill="none" strokeWidth="0.5" />
        <path d="M27 77.462l-4 4.308" fill="none" strokeWidth="0.5" />
        <path d="M27 79.615l-4 4.308" fill="none" strokeWidth="0.5" />
        <path d="M27 81.769L24 85" fill="none" strokeWidth="0.5" />
        <path d="M27 83.923L26 85" fill="none" strokeWidth="0.5" />

        <path d="M60 40h-5" fill="none" strokeWidth="0.5" />
        <path d="M60 80h-5" fill="none" strokeWidth="0.5" />
        <path d="M60 60h-5" fill="none" strokeWidth="0.5" />
        <path d="M30 20v5" fill="none" strokeWidth="0.5" />
        <path d="M30 100v-5" fill="none" strokeWidth="0.5" />
        <path d="M80 40H57.504" fill="none" strokeWidth="0.5" />
        <path d="M80 60H57.504" fill="none" strokeWidth="0.5" />
        <path d="M80 80H57.504" fill="none" strokeWidth="0.5" />
        <path d="M30 120V97.5" fill="none" strokeWidth="0.5" />
        <path d="M30 0v22.5" fill="none" strokeWidth="0.5" />

        <path d="M17 49l-7-7 7-7 7 7z" fill="none" strokeWidth="0.5" />
        <path d="M15 37v10" fill="none" strokeWidth="0.5" />
        <path d="M19 47V37" fill="none" strokeWidth="0.5" />

        <circle cx="55" cy="40" r="2.5" strokeWidth="0.5" />
        <circle cx="55" cy="80" r="2.5" strokeWidth="0.5" />
        <circle cx="55" cy="60" r="2.5" strokeWidth="0.5" />
        <circle cx="30" cy="25" r="2.5" strokeWidth="0.5" />
        <circle cx="30" cy="95" r="2.5" strokeWidth="0.5" />

        <text fill="#000" textAnchor="end" stroke="none" fontSize="7">
          <tspan x="28.004" y="9.004">
            BR
          </tspan>
          <tspan x="28.004" y="116.806">
            BL
          </tspan>
          <tspan x="78" y="76.81">
            WH
          </tspan>
          <tspan x="78.004" y="56.806">
            BK
          </tspan>
          <tspan x="78.004" y="36.814">
            GY
          </tspan>
        </text>
      </g>
    </svg>
  );
}
