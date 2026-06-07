type ContactorCoilProps = {
  x?: number;
  y?: number;
  scale?: number;
  energized?: boolean;
  label?: string;
  className?: string;
  standalone?: boolean;
  strokeColor?: string;
  wireStroke?: number;
  textSize?: number;
};

export default function ContactorCoil({
  x = 0,
  y = 0,
  scale = 1,
  energized = false,
  label = "K1",
  className = "",
  standalone = true,
  strokeColor,
  wireStroke = 0.5,
  textSize = 0.5,
}: ContactorCoilProps) {
  void energized;
  const coilStroke = strokeColor ?? "#111111";
  const labelFill = "#111111";
  const cableStroke = wireStroke;

  const symbol = (
    <g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      fill="none"
      stroke={coilStroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 30v20" strokeWidth={cableStroke} />
      <path d="M10 20V0" strokeWidth={cableStroke} />
      <path d="M0 20h20v10H0z" fill="white" strokeWidth={cableStroke} />

      <text
        x="10"
        y="27"
        textAnchor="middle"
        fontSize={textSize}
        fontWeight="700"
        fill={labelFill}
        stroke="none"
      >
        {label}
      </text>

      <text x="8" y="9" textAnchor="end" fontSize={textSize} fill="#111111" stroke="none">
        A1
      </text>
      <text x="8" y="46.81" textAnchor="end" fontSize={textSize} fill="#111111" stroke="none">
        A2
      </text>
    </g>
  );

  if (!standalone) {
    return symbol;
  }

  return (
    <svg
      viewBox="-10 -10 41 71"
      className={`h-28 w-32 rounded-xl bg-white p-2 shadow ${className}`}
    >
      {symbol}
    </svg>
  );
}
