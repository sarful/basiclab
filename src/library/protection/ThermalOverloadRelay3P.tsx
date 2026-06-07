type ThermalOverloadRelay3PProps = {
  x?: number;
  y?: number;
  scale?: number;
  tripped?: boolean;
  label?: string;
  className?: string;
  standalone?: boolean;
};

export default function ThermalOverloadRelay3P({
  x = 0,
  y = 0,
  scale = 1,
  tripped = false,
  label = "O/L",
  className = "",
  standalone = true,
}: ThermalOverloadRelay3PProps) {
  void tripped;
  const strokeColor = "#111111";
  const moduleXs = [0, 20, 40];
  const cableStroke = 0.5;

  const symbol = (
    <g
      transform={`translate(${x + 0.5}, ${y + 0.5}) scale(${scale})`}
      fill="#ffffff"
      fillRule="evenodd"
      stroke={strokeColor}
      strokeLinecap="round"
      strokeLinejoin="round"
      fontFamily="Roboto, system-ui, sans-serif"
    >
      {moduleXs.map((moduleX) => (
        <g key={moduleX}>
          <path d={`M${moduleX + 10} 0v20`} fill="none" strokeWidth={cableStroke} />
          <path d={`M${moduleX + 10} 50V30`} fill="none" strokeWidth={cableStroke} />
          <path d={`M${moduleX} 20h20v10H${moduleX}z`} strokeWidth={cableStroke} />
          <path
            d={`M${moduleX + 9.5} 21v1H${moduleX + 14}v6H${moduleX + 9.5}v1`}
            fill="none"
            stroke={strokeColor}
            strokeWidth={cableStroke}
          />
        </g>
      ))}

      {label ? (
        <text
          x="-10"
          y="29"
          textAnchor="end"
          fontSize="0.5"
          fontWeight="700"
          fill="#111111"
          stroke="none"
        >
          {label}
        </text>
      ) : null}
    </g>
  );

  if (!standalone) {
    return symbol;
  }

  return (
    <svg
      viewBox="-22 -10 82 71"
      className={`h-32 w-56 rounded-xl bg-white p-2 shadow ${className}`}
    >
      {symbol}
    </svg>
  );
}
