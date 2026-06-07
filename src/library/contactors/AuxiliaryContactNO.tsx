type AuxiliaryContactNOProps = {
  x?: number;
  y?: number;
  scale?: number;
  closed?: boolean;
  label?: string;
  className?: string;
  standalone?: boolean;
  strokeColor?: string;
  terminalA?: string;
  terminalB?: string;
  orientation?: "horizontal" | "vertical";
  wireStroke?: number;
  textSize?: number;
  showTerminals?: boolean;
};

export default function AuxiliaryContactNO({
  x = 0,
  y = 0,
  scale = 1,
  closed = false,
  label = "",
  className = "",
  standalone = true,
  strokeColor = "#111111",
  terminalA = "13",
  terminalB = "14",
  orientation = "horizontal",
  wireStroke = 0.5,
  textSize = 0.5,
  showTerminals = true,
}: AuxiliaryContactNOProps) {
  const cableStroke = wireStroke;
  const textColor = "#111111";
  const transformParts = [`translate(${x}, ${y})`, `scale(${scale})`];
  const rotationCenterX = 25;
  const rotationCenterY = 10;

  if (orientation === "vertical") {
    transformParts.push(`rotate(-90 ${rotationCenterX} ${rotationCenterY})`);
  }

  const symbol = (
    <g
      transform={transformParts.join(" ")}
      fill="#ffffff"
      fillRule="evenodd"
      stroke={strokeColor}
      strokeLinecap="round"
      strokeLinejoin="round"
      fontFamily="Roboto, system-ui, sans-serif"
    >
      {label ? (
        <text
          x={rotationCenterX}
          y="39"
          textAnchor="middle"
          fontSize={textSize}
          fill={textColor}
          stroke="none"
        >
          {label}
        </text>
      ) : null}
      <path d="M0 10h12.5" strokeWidth={cableStroke} fill="none" />
      <path d="M50 10H37.5" strokeWidth={cableStroke} fill="none" />
      <circle cx="15" cy="10" r="2.5" fill="white" strokeWidth={cableStroke} />
      <circle cx="35" cy="10" r="2.5" fill="white" strokeWidth={cableStroke} />
      {closed ? (
        <path d="M15 10h20" strokeWidth={cableStroke} fill="none" />
      ) : (
        <>
          <path d="M15 5h20" strokeWidth={cableStroke} fill="none" />
          <path d="M25 0v5" strokeWidth={cableStroke} fill="none" />
        </>
      )}

      {showTerminals ? (
        <g fill="#111111" stroke="none" fontSize={textSize}>
          <text x="2" y="6.81" textAnchor="start">
            {terminalA}
          </text>
          <text x="48" y="6.81" textAnchor="end">
            {terminalB}
          </text>
        </g>
      ) : null}
    </g>
  );

  if (!standalone) return symbol;

  return (
    <svg
      viewBox={orientation === "vertical" ? "-12 -15 74 56" : "-10 -10 71 55"}
      className={`h-28 w-44 rounded-xl bg-white p-2 shadow ${className}`}
    >
      {symbol}
    </svg>
  );
}
