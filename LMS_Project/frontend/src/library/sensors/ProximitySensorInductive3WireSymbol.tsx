"use client";

type ProximitySensorInductive3WireSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

export default function ProximitySensorInductive3WireSymbol({
  className = "",
  label = "Proximity Sensor - Inductive (3 Wire)",
  width = 260,
  height = 320,
}: ProximitySensorInductive3WireSymbolProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="-10 -10 102 121"
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
        <path d="M60 50h-5" fill="none" strokeWidth="0.5" />
        <path d="M5 25h50v50H5z" strokeWidth="0.5" />
        <path d="M30 20v5" fill="none" strokeWidth="0.5" />
        <path d="M30 80v-5" fill="none" strokeWidth="0.5" />
        <path d="M44 55v5" fill="none" strokeWidth="0.5" />
        <path d="M44 71v-5l-2-6" fill="none" strokeWidth="0.5" />
        <path d="M80 50H57.496" fill="none" strokeWidth="0.5" />
        <path d="M15 33v9" fill="none" strokeWidth="0.5" />
        <path d="M20 42v-9" fill="none" strokeWidth="0.5" />
        <path d="M17.5 30.5l7 7-7 7-7-7z" fill="none" strokeWidth="0.5" />
        <path d="M30 0v22.5" fill="none" strokeWidth="0.5" />
        <path d="M30 100V77.5" fill="none" strokeWidth="0.5" />
        <path d="M47.5 42.5L46 41l-.75 1.75 2.25-.25" fill="#000" strokeWidth="0.5" />
        <path d="M40 32.5v10" fill="none" strokeWidth="0.5" />
        <path d="M37.5 37.5H40" fill="none" strokeWidth="0.5" />
        <path d="M40 35l7.5-2.5" fill="none" strokeWidth="0.5" />
        <path d="M40 40l7.5 2.5" fill="none" strokeWidth="0.5" />
        <circle cx="30" cy="25" r="2.5" strokeWidth="0.5" />
        <circle cx="30" cy="75" r="2.5" strokeWidth="0.5" />
        <circle cx="55" cy="50" r="2.5" strokeWidth="0.5" />
        <path
          d="M16.796 63.111v.745h-2.898v3.049h-.911V60h4.278v.749h-3.367v2.362h2.898z"
          fill="#000"
          strokeWidth="0.5"
        />
        <path
          d="M20.249 67q-1.043 0-1.698-.685-.654-.685-.654-1.833v-.161q0-.764.292-1.363.292-.6.816-.939.524-.339 1.136-.339 1.001 0 1.556.659.555.659.555 1.888v.365h-3.476q.019.759.443 1.226.424.467 1.079.467.465 0 .787-.19.322-.19.564-.503l.536.417q-.645.991-1.935.991zm-.109-4.6q-.531 0-.892.387-.36.386-.446 1.084h2.571v-.066q-.038-.669-.361-1.036-.322-.368-.873-.368z"
          fill="#000"
          strokeWidth="0.5"
        />
        <text fontSize="7" textAnchor="end" fill="#000" stroke="none">
          <tspan x="27.996" y="9">
            BR
          </tspan>
          <tspan x="27.996" y="96.81">
            BL
          </tspan>
          <tspan x="77.996" y="46.81">
            BK
          </tspan>
        </text>
      </g>
    </svg>
  );
}
