type PilotLightProps = {
  x?: number;
  y?: number;
  scale?: number;
  on?: boolean;
  label?: string;
  className?: string;
  standalone?: boolean;
  strokeColor?: string;
  fillColor?: string;
  wireStroke?: number;
  textSize?: number;
};

export default function PilotLight({
  x = 0,
  y = 0,
  scale = 1,
  on = false,
  label = "Indicator",
  className = "",
  standalone = true,
  strokeColor,
  fillColor,
  wireStroke = 0.5,
  textSize = 0.5,
}: PilotLightProps) {
  const lampStroke = strokeColor ?? "#111111";
  const lampFill = fillColor ?? (on ? "#fde047" : "#ffffff");
  const cableStroke = wireStroke;
  const glowId = `pilot-light-glow-${x}-${y}-${scale}`;

  const symbol = (
    <g>
      <defs>
        <filter
          id={glowId}
          x="-200%"
          y="-200%"
          width="500%"
          height="500%"
        >
          <feGaussianBlur stdDeviation="2.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g
        transform={`translate(${x}, ${y}) scale(${scale})`}
        stroke={lampStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {on ? (
          <circle
            cx="10"
            cy="25"
            r="14"
            fill="#fde047"
            opacity="0.3"
            stroke="none"
            filter={`url(#${glowId})`}
          />
        ) : null}
        <circle
          cx="10"
          cy="25"
          r="10"
          fill={lampFill}
          strokeWidth={cableStroke}
          filter={on ? `url(#${glowId})` : undefined}
        />
        {on ? (
          <circle
            cx="10"
            cy="25"
            r="5.2"
            fill="#fff7b3"
            opacity="0.9"
            stroke="none"
          />
        ) : null}
        <path d="M10 50V35" strokeWidth={cableStroke} />
        <path d="M10 0v15" strokeWidth={cableStroke} />
        <path d="M3 18l14 14" strokeWidth={cableStroke} />
        <path d="M17 18L3 32" strokeWidth={cableStroke} />

        {standalone ? (
          <text x="28" y="28" fontSize={textSize} fontWeight="700" fill="#111111" stroke="none">
            {label}
          </text>
        ) : null}
      </g>
    </g>
  );

  if (!standalone) {
    return symbol;
  }

  return (
    <svg
      viewBox="-10 -10 90 71"
      className={`h-16 w-36 rounded-xl bg-white p-2 shadow ${className}`}
    >
      {symbol}
    </svg>
  );
}
