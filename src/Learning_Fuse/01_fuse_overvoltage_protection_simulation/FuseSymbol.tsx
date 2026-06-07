"use client";

import { motion } from "framer-motion";

import type { FuseState } from "./types";

type FuseSymbolProps = {
  fuseState: FuseState;
  danger: boolean;
};

export function FuseSymbol({ fuseState, danger }: FuseSymbolProps) {
  const blown = fuseState === "BLOWN";

  return (
    <g>
      <rect x="430" y="150" width="220" height="80" rx="28" fill="#ffffff" stroke="#111827" strokeWidth="6" />
      <text x="540" y="137" textAnchor="middle" fontSize="28" fontWeight="900" fontFamily="Arial" fill="#0f172a">
        FUSE
      </text>

      {!blown ? (
        <motion.line
          x1="462"
          y1="190"
          x2="618"
          y2="190"
          stroke={danger ? "#dc2626" : "#111827"}
          strokeWidth="8"
          strokeLinecap="round"
          animate={{ opacity: danger ? [0.35, 1, 0.35] : 1 }}
          transition={{ duration: 0.6, repeat: danger ? Infinity : 0 }}
        />
      ) : (
        <g>
          <line x1="462" y1="190" x2="522" y2="162" stroke="#dc2626" strokeWidth="8" strokeLinecap="round" />
          <line x1="558" y1="218" x2="618" y2="190" stroke="#dc2626" strokeWidth="8" strokeLinecap="round" />
          <motion.path
            d="M535 175 C520 140,560 138,545 105 C590 138,590 168,560 188"
            fill="#f97316"
            animate={{ opacity: [0.35, 0.9, 0.35], scale: [0.95, 1.08, 0.95] }}
            transition={{ duration: 0.9, repeat: Infinity }}
          />
        </g>
      )}
    </g>
  );
}
