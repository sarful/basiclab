type ThermalOverloadNCProps = {
  x?: number;
  y?: number;
  scale?: number;
  tripped?: boolean;
  label?: string;
  className?: string;
  standalone?: boolean;
  strokeColor?: string;
  orientation?: "horizontal" | "vertical";
  wireStroke?: number;
  textSize?: number;
  showTerminals?: boolean;
};

export default function ThermalOverloadNC({
  x = 0,
  y = 0,
  scale = 1,
  tripped = false,
  label = "O/L",
  className = "",
  standalone = true,
  strokeColor,
  orientation = "horizontal",
  wireStroke = 0.5,
  textSize = 5,
  showTerminals = true,
}: ThermalOverloadNCProps) {
  const overloadStroke = strokeColor ?? "#111111";
  const textColor = "#111111";
  const cableStroke = wireStroke;
  const transformParts = [`translate(${x}, ${y})`, `scale(${scale})`];
  const standaloneViewBox =
    orientation === "vertical" ? "-12 -15 74 56" : "-10 -10 71 55";

  if (orientation === "vertical") {
    transformParts.push("rotate(-90 25 10)");
  }

  const symbol = (
    <g
      transform={transformParts.join(" ")}
      fill="none"
      stroke={overloadStroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M0 10h12.5" strokeWidth={cableStroke} />
      <path d="M50 10H37.5" strokeWidth={cableStroke} />
      <circle cx="15" cy="10" r="2.5" fill="white" strokeWidth={cableStroke} />
      <circle cx="35" cy="10" r="2.5" fill="white" strokeWidth={cableStroke} />
      {tripped ? (
        <>
          <path d="M15 15h20" strokeWidth={cableStroke} />
          <path d="M25 0v15" strokeWidth={cableStroke} />
        </>
      ) : (
        <>
          <path d="M15 5h20" strokeWidth={cableStroke} />
          <path d="M25 0v5" strokeWidth={cableStroke} />
        </>
      )}

      {showTerminals ? (
        <>
          <text
            x="2"
            y="6.81"
            textAnchor="start"
            fontSize={textSize}
            fill="#111111"
            stroke="none"
          >
            95
          </text>
          <text
            x="48"
            y="6.81"
            textAnchor="end"
            fontSize={textSize}
            fill="#111111"
            stroke="none"
          >
            96
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
      viewBox={standaloneViewBox}
      className={`h-32 w-24 rounded-xl bg-white p-2 shadow ${className}`}
    >
      {symbol}
      {label ? (
        <text
          x={orientation === "vertical" ? 0 : 25}
          y={orientation === "vertical" ? 16 : 39}
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
