type PushButtonNCProps = {
  x?: number;
  y?: number;
  scale?: number;
  pressed?: boolean;
  label?: string;
  className?: string;
  standalone?: boolean;
  strokeColor?: string;
  orientation?: "horizontal" | "vertical";
  wireStroke?: number;
  textSize?: number;
  showTerminals?: boolean;
};

export default function PushButtonNC({
  x = 0,
  y = 0,
  scale = 1,
  pressed = false,
  label = "OFF",
  className = "",
  standalone = true,
  strokeColor,
  orientation = "horizontal",
  wireStroke = 0.5,
  textSize = 0.5,
  showTerminals = true,
}: PushButtonNCProps) {
  const contactStroke = strokeColor ?? "#111111";
  const textColor = "#111111";
  const cableStroke = wireStroke;
  const transformParts = [`translate(${x}, ${y})`, `scale(${scale})`];

  if (orientation === "vertical") {
    transformParts.push("rotate(-90 25 10)");
  }

  const symbol = (
    <g
      transform={transformParts.join(" ")}
      fill="none"
      stroke={contactStroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M0 10h12.5" strokeWidth={cableStroke} />
      <path d="M50 10H37.5" strokeWidth={cableStroke} />
      <circle cx="15" cy="10" r="2.5" fill="white" strokeWidth={cableStroke} />
      <circle cx="35" cy="10" r="2.5" fill="white" strokeWidth={cableStroke} />
      {pressed ? (
        <path d="M15 14h20" strokeWidth={cableStroke} />
      ) : (
        <path d="M15 13h20" strokeWidth={cableStroke} />
      )}
      <path d={pressed ? "M25 6v4" : "M25 8v5"} strokeWidth={cableStroke} />

      {showTerminals ? (
        <>
          <text x="2" y="6.81" textAnchor="start" fontSize={textSize} fill="#111111" stroke="none">
            11
          </text>
          <text x="48" y="6.81" textAnchor="end" fontSize={textSize} fill="#111111" stroke="none">
            12
          </text>
        </>
      ) : null}
    </g>
  );

  if (!standalone) {
    return symbol;
  }

  return (
    <svg
      viewBox={orientation === "vertical" ? "-12 -15 74 56" : "-10 -10 71 41"}
      className={`h-32 w-24 rounded-xl bg-white p-2 shadow ${className}`}
    >
      {symbol}
      {label ? (
        <text
          x={orientation === "vertical" ? 0 : -2}
          y={orientation === "vertical" ? 16 : 30}
          textAnchor={orientation === "vertical" ? "start" : "middle"}
          fontSize={textSize}
          fontWeight="700"
          fill={textColor}
        >
          {label}
        </text>
      ) : null}
    </svg>
  );
}
