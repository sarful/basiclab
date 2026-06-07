type ACMotor3PProps = {
  x?: number;
  y?: number;
  scale?: number;
  label?: string;
  className?: string;
  standalone?: boolean;
};

export default function ACMotor3P({
  x = 0,
  y = 0,
  scale = 1,
  label = "3-Phase Motor",
  className = "",
  standalone = true,
}: ACMotor3PProps) {
  const captionColor = "#111111";
  const cableStroke = 0.5;

  const symbol = (
    <g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      fill="none"
      stroke="#111111"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="30" cy="35" r="16" fill="white" strokeWidth={cableStroke} />
      <path d="M30 0v18.875" strokeWidth={cableStroke} />
      <path d="M10 0v15l8.375 8.875" strokeWidth={cableStroke} />
      <path d="M50 0v15l-8.375 8.875" strokeWidth={cableStroke} />
      <path d="M15 46h30" strokeWidth={cableStroke} />

      <path
        d="M26.462 26.308h1.211l2.324 5.801 2.324-5.801h1.216v7.109H32.6v-2.769l.088-2.988-2.334 5.757h-.718l-2.329-5.742.093 2.974v2.769h-.937v-7.109z"
        fill="#111111"
        stroke="none"
      />
      <path d="M38 40.356c-5 7.5-5-7.5-10 0" strokeWidth={cableStroke} />
      <path
        d="M23.301 40.672v-.664h.611q.576-.009.905-.303.33-.294.33-.795 0-1.125-1.121-1.125-.527 0-.842.301-.314.301-.314.798h-.813q0-.76.556-1.263.556-.503 1.413-.503.905 0 1.419.479.514.479.514 1.331 0 .418-.27.809-.27.391-.736.584.527.167.815.554.288.387.288.945 0 .861-.562 1.367-.562.505-1.463.505-.901 0-1.466-.488Q22 42.716 22 41.916h.817q0 .505.33.809.33.303.883.303.589 0 .901-.308.312-.308.312-.883 0-.558-.343-.857-.343-.299-.989-.308h-.611z"
        fill="#111111"
        stroke="none"
      />

      <text x="8.002" y="8.998" textAnchor="end" fontSize="0.5" fill="#111111" stroke="none">
        U
      </text>
      <text x="28" y="8.998" textAnchor="end" fontSize="0.5" fill="#111111" stroke="none">
        V
      </text>
      <text x="47.998" y="8.998" textAnchor="end" fontSize="0.5" fill="#111111" stroke="none">
        W
      </text>

      {standalone && label ? (
        <text x="30" y="62" textAnchor="middle" fontSize="0.5" fill={captionColor} stroke="none">
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
      viewBox="-10 -10 81 81"
      className={`h-48 w-44 rounded-xl bg-white p-2 shadow ${className}`}
    >
      {symbol}
    </svg>
  );
}
