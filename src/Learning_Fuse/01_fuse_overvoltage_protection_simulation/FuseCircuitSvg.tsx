"use client";

import { clamp, formatNumber } from "./logic";
import { FlowDots } from "./FlowDots";
import { FuseSymbol } from "./FuseSymbol";
import type { FuseRating, FuseState, SimulationResult } from "./types";

type FuseCircuitSvgProps = {
  supplyVoltage: number;
  loadResistance: number;
  fuseRating: FuseRating;
  fuseState: FuseState;
  result: SimulationResult;
};

export function FuseCircuitSvg({
  supplyVoltage,
  loadResistance,
  fuseRating,
  fuseState,
  result,
}: FuseCircuitSvgProps) {
  const active = fuseState === "GOOD" && result.currentA > 0.02;
  const danger = fuseState === "GOOD" && result.shouldBlow;
  const flowDuration = clamp(3.2 - result.currentA * 0.32, 0.6, 3.2);
  const flowCount = Math.round(clamp(8 + result.currentA * 3, 8, 34));

  return (
    <svg viewBox="0 0 1100 560" className="h-auto w-full bg-white" shapeRendering="geometricPrecision" role="img" aria-label="Fuse overvoltage and overcurrent protection circuit">
      <rect width="1100" height="560" fill="#ffffff" />

      <text x="550" y="48" textAnchor="middle" fontSize="34" fontWeight="900" fontFamily="Arial" fill="#0f172a">
        Fuse Protection Circuit - Overvoltage / Overcurrent
      </text>

      <line x1="110" y1="185" x2="110" y2="470" stroke="#111827" strokeWidth="6" />
      <line x1="78" y1="260" x2="142" y2="260" stroke="#111827" strokeWidth="9" />
      <line x1="88" y1="310" x2="132" y2="310" stroke="#111827" strokeWidth="6" />
      <text x="42" y="252" fontSize="44" fontWeight="900" fontFamily="Arial">+</text>
      <text x="48" y="340" fontSize="44" fontWeight="900" fontFamily="Arial">-</text>
      <text x="62" y="165" fontSize="30" fontWeight="900" fontFamily="Arial" fill="#2563eb">
        {formatNumber(supplyVoltage, 1)}V
      </text>

      <line x1="110" y1="190" x2="430" y2="190" stroke="#111827" strokeWidth="6" />
      <FuseSymbol fuseState={fuseState} danger={danger} />
      <line x1="650" y1="190" x2="760" y2="190" stroke="#111827" strokeWidth="6" />

      <polyline points="760,190 790,145 820,235 850,145 880,235 910,145 940,235 970,190" fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <text x="825" y="125" fontSize="28" fontWeight="900" fontFamily="Arial" fill="#0f172a">
        LOAD {loadResistance}Ohm
      </text>
      <line x1="970" y1="190" x2="1010" y2="190" stroke="#111827" strokeWidth="6" />
      <line x1="1010" y1="190" x2="1010" y2="470" stroke="#111827" strokeWidth="6" />
      <line x1="1010" y1="470" x2="110" y2="470" stroke="#111827" strokeWidth="6" />

      {danger && (
        <motion.g animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.7, repeat: Infinity }}>
          <circle cx="540" cy="190" r="70" fill="#fee2e2" />
          <text x="540" y="292" textAnchor="middle" fontSize="24" fontWeight="900" fontFamily="Arial" fill="#dc2626">
            OVERCURRENT
          </text>
        </motion.g>
      )}

      {fuseState === "BLOWN" && (
        <text x="540" y="292" textAnchor="middle" fontSize="28" fontWeight="900" fontFamily="Arial" fill="#dc2626">
          FUSE BLOWN
        </text>
      )}

      <FlowDots
        path="M110 260 V190 H430 M650 190 H760 M970 190 H1010 V470 H110 V310"
        active={active}
        color="#2563eb"
        count={flowCount}
        duration={flowDuration}
      />

      <rect
        x="330"
        y="460"
        width="440"
        height="72"
        rx="22"
        fill={fuseState === "BLOWN" ? "#fee2e2" : danger ? "#fef3c7" : "#dcfce7"}
        stroke={fuseState === "BLOWN" ? "#dc2626" : danger ? "#f59e0b" : "#16a34a"}
        strokeWidth="3"
      />
      <text
        x="550"
        y="505"
        textAnchor="middle"
        fontSize="28"
        fontWeight="900"
        fontFamily="Arial"
        fill={fuseState === "BLOWN" ? "#991b1b" : danger ? "#92400e" : "#166534"}
      >
        {fuseState === "BLOWN" ? "CIRCUIT OPEN" : danger ? "UNSAFE CURRENT" : "SAFE CURRENT"}
      </text>

      <text x="430" y="360" fontSize="24" fontWeight="900" fontFamily="Arial" fill="#0f172a">
        Fuse Rating: {fuseRating}
      </text>
      <text x="430" y="395" fontSize="24" fontWeight="900" fontFamily="Arial" fill="#0f172a">
        Current: {formatNumber(result.currentA, 2)} A
      </text>
    </svg>
  );
}
