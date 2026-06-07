"use client";

import { motion } from "framer-motion";

import { CarrierDots, Terminal } from "./SharedPieces";

export function ConstructionView() {
  return (
    <div className="rounded-xl border border-slate-300 bg-white shadow-sm">
      <svg viewBox="0 0 760 360" className="h-[360px] w-full" role="img" aria-label="Diode construction">
        <rect x="95" y="60" width="285" height="150" rx="18" fill="#fee2e2" stroke="#dc2626" strokeWidth="3" />
        <rect x="380" y="60" width="285" height="150" rx="18" fill="#dbeafe" stroke="#2563eb" strokeWidth="3" />
        <text x="238" y="42" textAnchor="middle" fontSize="22" fontWeight="900" fill="#dc2626">P-Type Region</text>
        <text x="522" y="42" textAnchor="middle" fontSize="22" fontWeight="900" fill="#2563eb">N-Type Region</text>
        <CarrierDots type="holes" />
        <CarrierDots type="electrons" />
        <motion.rect
          x="345"
          y="50"
          width="70"
          height="170"
          rx="14"
          fill="#fef3c7"
          stroke="#f59e0b"
          strokeWidth="4"
          animate={{ width: [58, 78, 58], x: [351, 341, 351] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        <text x="380" y="130" textAnchor="middle" fontSize="16" fontWeight="900" fill="#92400e">PN</text>
        <text x="380" y="151" textAnchor="middle" fontSize="16" fontWeight="900" fill="#92400e">Junction</text>
        <Terminal x={135} label="Anode" color="#dc2626" />
        <Terminal x={625} label="Cathode" color="#111827" />
        <text x="380" y="325" textAnchor="middle" fontSize="18" fontWeight="800" fill="#334155">
          P-Type + N-Type semiconductor joined together
        </text>
      </svg>
    </div>
  );
}
