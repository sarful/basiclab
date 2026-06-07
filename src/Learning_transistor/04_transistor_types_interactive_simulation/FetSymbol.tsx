import FlowDots from "./FlowDots";
import type { FetChannel, FetType } from "./types";

type FetSymbolProps = {
  type: FetType;
  channel: FetChannel;
  active: boolean;
};

export default function FetSymbol({
  type,
  channel,
  active,
}: FetSymbolProps) {
  const isMosfet = type === "MOSFET";
  const isNChannel = channel === "N-Channel";

  if (isMosfet) {
    const arrowPoints = isNChannel
      ? "366,208 412,238 366,268"
      : "402,208 356,238 402,268";
    const flowPath = isNChannel ? "M360 360 V120" : "M360 120 V360";

    return (
      <svg viewBox="0 0 760 560" className="mx-auto h-auto w-full max-w-[760px]">
        <rect width="760" height="560" fill="#ffffff" />
        <text
          x="380"
          y="70"
          textAnchor="middle"
          fill={isNChannel ? "#1d4ed8" : "#dc2626"}
          fontSize="44"
          fontWeight="900"
        >
          {channel} MOSFET
        </text>

        <circle cx="360" cy="120" r="16" stroke="#111" strokeWidth="5" fill="white" />
        <circle cx="360" cy="360" r="16" stroke="#111" strokeWidth="5" fill="white" />
        <circle cx="120" cy="240" r="16" stroke="#111" strokeWidth="5" fill="white" />

        <line x1="360" y1="95" x2="360" y2="180" stroke="#111" strokeWidth="5" />
        <line x1="360" y1="300" x2="360" y2="385" stroke="#111" strokeWidth="5" />
        <line x1="120" y1="240" x2="250" y2="240" stroke="#111" strokeWidth="5" />

        <line x1="300" y1="140" x2="300" y2="340" stroke="#111" strokeWidth="5" />
        <line x1="340" y1="140" x2="340" y2="340" stroke="#111" strokeWidth="5" />

        <line x1="340" y1="180" x2="360" y2="180" stroke="#111" strokeWidth="5" />
        <line x1="340" y1="300" x2="360" y2="300" stroke="#111" strokeWidth="5" />

        {isNChannel ? (
          <line x1="335" y1="238" x2="366" y2="238" stroke="#111" strokeWidth="5" />
        ) : (
          <line x1="402" y1="238" x2="452" y2="238" stroke="#111" strokeWidth="5" />
        )}
        <polygon points={arrowPoints} fill="#111" />

        <text x="342" y="86" fill="#111" fontSize="44" fontWeight="500">
          D
        </text>
        <text x="342" y="440" fill="#111" fontSize="44" fontWeight="500">
          S
        </text>
        <text x="44" y="255" fill="#111" fontSize="44" fontWeight="500">
          G
        </text>

        <FlowDots path={flowPath} active={active} color="#2563eb" count={14} />
      </svg>
    );
  }

  const flowPath = isNChannel ? "M360 360 V120" : "M360 120 V360";
  const arrowPoints = isNChannel
    ? "250,280 292,258 292,302"
    : "292,280 250,258 250,302";

  return (
    <svg viewBox="0 0 760 560" className="mx-auto h-auto w-full max-w-[760px]">
      <rect width="760" height="560" fill="#ffffff" />

      <text
        x="380"
        y="72"
        textAnchor="middle"
        fill="#1d4ed8"
        fontSize="72"
        fontWeight="900"
      >
        JFET
      </text>

      <text
        x="380"
        y="142"
        textAnchor="middle"
        fill="#1d4ed8"
        fontSize="38"
        fontWeight="900"
      >
        {channel} JFET
      </text>

      <circle cx="360" cy="280" r="118" fill="none" stroke="#111" strokeWidth="4" />

      <circle cx="360" cy="95" r="14" stroke="#111" strokeWidth="4" fill="white" />
      <circle cx="360" cy="455" r="14" stroke="#111" strokeWidth="4" fill="white" />
      <circle cx="120" cy="280" r="14" stroke="#111" strokeWidth="4" fill="white" />

      <line x1="360" y1="109" x2="360" y2="215" stroke="#111" strokeWidth="4" />
      <line x1="360" y1="335" x2="360" y2="441" stroke="#111" strokeWidth="4" />
      <line x1="120" y1="280" x2="250" y2="280" stroke="#111" strokeWidth="4" />

      <line
        x1="300"
        y1="200"
        x2="300"
        y2="360"
        stroke="#111"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="300"
        y1="225"
        x2="360"
        y2="225"
        stroke="#111"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="300"
        y1="335"
        x2="360"
        y2="335"
        stroke="#111"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <polygon points={arrowPoints} fill="#111" />

      <text x="345" y="118" fill="#111" fontSize="42" fontWeight="500">
        D
      </text>
      <text x="346" y="515" fill="#111" fontSize="42" fontWeight="500">
        S
      </text>
      <text x="52" y="296" fill="#111" fontSize="42" fontWeight="500">
        G
      </text>

      <FlowDots path={flowPath} active={active} color="#2563eb" count={12} />
    </svg>
  );
}
