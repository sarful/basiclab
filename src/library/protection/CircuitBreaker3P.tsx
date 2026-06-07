type CircuitBreaker3PProps = {
  x?: number;
  y?: number;
  scale?: number;
  on?: boolean;
  label?: string;
  className?: string;
  standalone?: boolean;
  strokeColor?: string;
  orientation?: "stacked" | "columns" | "vertical";
};

export default function CircuitBreaker3P({
  x = 0,
  y = 0,
  scale = 1,
  on = false,
  label = "3P CB",
  className = "",
  standalone = true,
  strokeColor,
  orientation = "stacked",
}: CircuitBreaker3PProps) {
  const breakerStroke = strokeColor ?? "#111111";
  const contactLift = on ? 0 : -6;
  const cableStroke = 0.5;
  const transformParts = [`translate(${x + 0.5}, ${y + 0.5})`, `scale(${scale})`];

  if (orientation === "columns" || orientation === "vertical") {
    transformParts.push("rotate(-90 25 30)");
  }

  const symbol = (
    <g
      transform={transformParts.join(" ")}
      fill="#ffffff"
      fillRule="evenodd"
      stroke={breakerStroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      fontFamily="Roboto, system-ui, sans-serif"
    >
      {label ? (
        <text
          x="25"
          y="-4"
          textAnchor="middle"
          fontSize="0.5"
          fontWeight="700"
          fill={breakerStroke}
          stroke="none"
        >
          {label}
        </text>
      ) : null}

      <path d="M0 10h12.5" strokeWidth={cableStroke} fill="none" />
      <path d="M50 10H37.5" strokeWidth={cableStroke} fill="none" />
      <circle cx="15" cy="10" r="2.5" strokeWidth={cableStroke} />
      <circle cx="35" cy="10" r="2.5" strokeWidth={cableStroke} />

      <path d="M0 30h12.5" strokeWidth={cableStroke} fill="none" />
      <path d="M50 30H37.5" strokeWidth={cableStroke} fill="none" />
      <circle cx="15" cy="30" r="2.5" strokeWidth={cableStroke} />
      <circle cx="35" cy="30" r="2.5" strokeWidth={cableStroke} />

      <path d="M0 50h12.5" strokeWidth={cableStroke} fill="none" />
      <path d="M50 50H37.5" strokeWidth={cableStroke} fill="none" />
      <circle cx="15" cy="50" r="2.5" strokeWidth={cableStroke} />
      <circle cx="35" cy="50" r="2.5" strokeWidth={cableStroke} />

      <path d="M25 2.5v40" strokeDasharray="1.5 2" strokeWidth={cableStroke} fill="none" />

      <path
        d={`M35 ${5 + contactLift}q-5-2.5-10-2.5-5 0-10 2.5`}
        strokeWidth={cableStroke}
        fill="none"
      />
      <path
        d={`M35 ${25 + contactLift}q-5-2.5-10-2.5-5 0-10 2.5`}
        strokeWidth={cableStroke}
        fill="none"
      />
      <path
        d={`M35 ${45 + contactLift}q-5-2.5-10-2.5-5 0-10 2.5`}
        strokeWidth={cableStroke}
        fill="none"
      />

      <g fill="#000000" stroke="none" fontSize="0.5">
        <text x="2" y="6.808" textAnchor="start">1</text>
        <text x="48" y="6.808" textAnchor="end">2</text>
        <text x="2" y="26.812" textAnchor="start">3</text>
        <text x="48" y="26.812" textAnchor="end">4</text>
        <text x="2" y="46.81" textAnchor="start">5</text>
        <text x="48" y="46.81" textAnchor="end">6</text>
      </g>
    </g>
  );

  if (!standalone) {
    return symbol;
  }

  return (
    <svg
      viewBox={orientation === "columns" || orientation === "vertical" ? "-10 -10 81 71" : "-10 -10 71 81"}
      className={`h-40 w-40 rounded-xl bg-white p-2 shadow ${className}`}
    >
      {symbol}
    </svg>
  );
}
