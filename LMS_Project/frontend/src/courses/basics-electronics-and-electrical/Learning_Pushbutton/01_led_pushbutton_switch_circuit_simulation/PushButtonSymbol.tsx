"use client";

import { motion } from "framer-motion";

import type { SwitchType } from "./types";

type PushButtonSymbolProps = {
  switchType: SwitchType;
  pressed: boolean;
};

export default function PushButtonSymbol({
  switchType,
  pressed,
}: PushButtonSymbolProps) {
  const closed = switchType === "NO" ? pressed : !pressed;
  const contactX2 = closed ? 520 : 535;
  const contactY2 = closed ? 180 : 132;

  return (
    <g>
      <text
        x="405"
        y="96"
        fontSize="30"
        fontWeight="900"
        fontFamily="Arial"
        fill="#0f172a"
      >
        {switchType === "NO" ? "NO Pushbutton" : "NC Pushbutton"}
      </text>
      <circle cx="400" cy="180" r="12" fill="#ffffff" stroke="#111827" strokeWidth="5" />
      <circle cx="520" cy="180" r="12" fill="#ffffff" stroke="#111827" strokeWidth="5" />
      <line
        x1="412"
        y1="180"
        x2={contactX2}
        y2={contactY2}
        stroke="#111827"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {!closed && (
        <text x="435" y="225" fontSize="22" fontWeight="900" fontFamily="Arial" fill="#dc2626">
          open
        </text>
      )}
      {closed && (
        <text x="430" y="225" fontSize="22" fontWeight="900" fontFamily="Arial" fill="#16a34a">
          closed
        </text>
      )}
      {pressed && (
        <motion.rect
          x="436"
          y="110"
          width="54"
          height="22"
          rx="8"
          fill="#2563eb"
          animate={{ y: [110, 124, 110] }}
          transition={{ duration: 0.7, repeat: Infinity }}
        />
      )}
    </g>
  );
}
