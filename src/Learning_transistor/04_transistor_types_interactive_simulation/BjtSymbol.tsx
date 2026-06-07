import FlowDots from "./FlowDots";
import type { BjtType } from "./types";

type BjtSymbolProps = {
  type: BjtType;
  active: boolean;
};

export default function BjtSymbol({ type, active }: BjtSymbolProps) {
  const isNPN = type === "NPN";
  const arrowPoints = isNPN
    ? "214,282 250,316 218,326"
    : "206,318 172,286 214,282";
  const electronPath = isNPN
    ? "M246 410 V322 L150 270 L150 200 L246 150 V72"
    : "M246 72 V150 L150 200 L150 270 L246 322 V410";

  return (
    <svg viewBox="0 0 436 485" className="mx-auto h-auto w-full max-w-[360px]">
      <rect width="436" height="485" fill="#ffffff" />
      <line x1="28" y1="243" x2="126" y2="243" stroke="#7A0000" strokeWidth="6" />
      <rect x="126" y="153" width="24" height="180" fill="#7A0000" />
      <line x1="150" y1="200" x2="246" y2="150" stroke="#7A0000" strokeWidth="6" />
      <line x1="246" y1="150" x2="246" y2="72" stroke="#7A0000" strokeWidth="6" />
      <line x1="150" y1="270" x2="246" y2="322" stroke="#7A0000" strokeWidth="6" />
      <line x1="246" y1="322" x2="246" y2="410" stroke="#7A0000" strokeWidth="6" />
      <polygon points={arrowPoints} fill="#7A0000" />
      <text x="0" y="257" fontFamily="Arial" fontSize="52" fill="#000000">
        B
      </text>
      <text x="228" y="58" fontFamily="Arial" fontSize="72" fill="#000000">
        C
      </text>
      <text x="228" y="470" fontFamily="Arial" fontSize="72" fill="#000000">
        E
      </text>
      <text x="255" y="280" fontFamily="Arial" fontSize="84" fill="#A8A8A8">
        {type}
      </text>
      <FlowDots
        path={electronPath}
        active={active}
        color={isNPN ? "#2563eb" : "#dc2626"}
        count={12}
      />
    </svg>
  );
}
