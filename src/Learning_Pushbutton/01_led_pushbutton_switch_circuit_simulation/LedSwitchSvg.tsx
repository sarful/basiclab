"use client";

import { motion } from "framer-motion";

import FlowDots from "./FlowDots";
import { clamp, formatNumber } from "./logic";
import PushButtonSymbol from "./PushButtonSymbol";
import type { SimulationResult, SwitchType } from "./types";

type LedSwitchSvgProps = {
  switchType: SwitchType;
  pressed: boolean;
  supplyVoltage: number;
  resistorOhm: number;
  electronFlowRate: number;
  result: SimulationResult;
};

export default function LedSwitchSvg({
  switchType,
  pressed,
  supplyVoltage,
  resistorOhm,
  electronFlowRate,
  result,
}: LedSwitchSvgProps) {
  const flowDuration = clamp(3.4 - electronFlowRate * 0.028, 0.55, 3.4);
  const flowCount = Math.round(clamp(6 + electronFlowRate * 0.28, 8, 34));

  return (
    <svg
      viewBox="0 0 1100 560"
      className="h-auto w-full bg-white"
      shapeRendering="geometricPrecision"
      role="img"
      aria-label="LED pushbutton switch circuit"
    >
      <rect width="1100" height="560" fill="#ffffff" />

      <text
        x="550"
        y="50"
        textAnchor="middle"
        fontSize="34"
        fontWeight="900"
        fontFamily="Arial"
        fill="#0f172a"
      >
        LED Switch Circuit - NO / NC Pushbutton
      </text>

      <line x1="110" y1="175" x2="110" y2="445" stroke="#111827" strokeWidth="6" />
      <line x1="78" y1="245" x2="142" y2="245" stroke="#111827" strokeWidth="9" />
      <line x1="88" y1="290" x2="132" y2="290" stroke="#111827" strokeWidth="6" />
      <text x="42" y="236" fontSize="44" fontWeight="900" fontFamily="Arial" fill="#111827">
        +
      </text>
      <text x="48" y="314" fontSize="44" fontWeight="900" fontFamily="Arial" fill="#111827">
        -
      </text>
      <text x="64" y="156" fontSize="30" fontWeight="900" fontFamily="Arial" fill="#2563eb">
        {formatNumber(supplyVoltage, 1)}V
      </text>

      <line x1="110" y1="180" x2="400" y2="180" stroke="#111827" strokeWidth="6" />
      <PushButtonSymbol switchType={switchType} pressed={pressed} />

      <line x1="532" y1="180" x2="640" y2="180" stroke="#111827" strokeWidth="6" />
      <polyline
        points="640,180 660,145 690,215 720,145 750,215 780,145 810,215 830,180"
        fill="none"
        stroke="#111827"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="690" y="130" fontSize="26" fontWeight="900" fontFamily="Arial" fill="#0f172a">
        {resistorOhm} Ohm
      </text>

      <line x1="830" y1="180" x2="885" y2="180" stroke="#111827" strokeWidth="6" />
      <motion.circle
        cx="925"
        cy="180"
        r="72"
        fill="#facc15"
        initial={{ opacity: 0 }}
        animate={{ opacity: result.ledOn ? [0.1, 0.34, 0.1] : 0 }}
        transition={{ duration: 1.1, repeat: Infinity }}
      />
      <polygon
        points="885,135 965,180 885,225"
        fill={result.ledOn ? "#fde68a" : "none"}
        stroke="#111827"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <line x1="972" y1="150" x2="972" y2="228" stroke="#111827" strokeWidth="6" />
      <line x1="972" y1="180" x2="1010" y2="180" stroke="#111827" strokeWidth="6" />
      <line x1="1010" y1="180" x2="1010" y2="445" stroke="#111827" strokeWidth="6" />
      <text
        x="894"
        y="295"
        fontSize="30"
        fontWeight="900"
        fontFamily="Arial"
        fill={result.ledOn ? "#f59e0b" : "#64748b"}
      >
        LED {result.ledOn ? "ON" : "OFF"}
      </text>

      <line x1="1010" y1="445" x2="110" y2="445" stroke="#111827" strokeWidth="6" />

      <FlowDots
        path="M110 290 V445 H1010 V180 H972 L885 180 H830 M640 180 H532 M400 180 H110 V245"
        active={result.circuitClosed}
        color="#2563eb"
        count={flowCount}
        duration={flowDuration}
        reverse={false}
      />

      <rect
        x="365"
        y="445"
        width="370"
        height="72"
        rx="22"
        fill={result.circuitClosed ? "#dcfce7" : "#fee2e2"}
        stroke={result.circuitClosed ? "#16a34a" : "#dc2626"}
        strokeWidth="3"
      />
      <text
        x="550"
        y="490"
        textAnchor="middle"
        fontSize="28"
        fontWeight="900"
        fontFamily="Arial"
        fill={result.circuitClosed ? "#166534" : "#991b1b"}
      >
        Circuit {result.circuitClosed ? "CLOSED" : "OPEN"}
      </text>
    </svg>
  );
}
