"use client";

import { motion } from "framer-motion";

import { CarrierDots, Terminal } from "./SharedPieces";

export function ConstructionView() {
  return (
    <div className="rounded-[24px] border border-slate-300 bg-white shadow-sm">
      <svg viewBox="0 0 760 390" className="h-[390px] w-full" role="img" aria-label="Diode construction">
        <rect x="22" y="20" width="716" height="350" rx="28" fill="white" stroke="#cbd5e1" strokeWidth="2" />
        <rect x="46" y="36" width="668" height="34" rx="17" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
        <text x="66" y="58" fontSize="11" fontWeight="900" fill="#047857" letterSpacing="3">
          MATERIAL VIEW
        </text>
        <text x="648" y="58" textAnchor="end" fontSize="11" fontWeight="900" fill="#047857" letterSpacing="2">
          STAGE 1
        </text>

        <defs>
          <pattern id="pMaterialPattern" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M4 20 L20 4" stroke="#dc2626" strokeOpacity="0.08" strokeWidth="1" />
            <circle cx="16" cy="17" r="1.1" fill="#dc2626" opacity="0.12" />
          </pattern>
          <pattern id="nMaterialPattern" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M4 20 L20 4" stroke="#2563eb" strokeOpacity="0.08" strokeWidth="1" />
            <circle cx="16" cy="17" r="1.1" fill="#2563eb" opacity="0.12" />
          </pattern>
        </defs>

        <text x="238" y="96" textAnchor="middle" fontSize="20" fontWeight="900" fill="#dc2626">
          P-Type Region
        </text>
        <text x="522" y="96" textAnchor="middle" fontSize="20" fontWeight="900" fill="#2563eb">
          N-Type Region
        </text>

        <rect x="95" y="114" width="285" height="150" rx="18" fill="#fee2e2" stroke="#dc2626" strokeWidth="3" />
        <rect x="95" y="114" width="285" height="150" rx="18" fill="url(#pMaterialPattern)" opacity="0.9" />
        <rect x="380" y="114" width="285" height="150" rx="18" fill="#dbeafe" stroke="#2563eb" strokeWidth="3" />
        <rect x="380" y="114" width="285" height="150" rx="18" fill="url(#nMaterialPattern)" opacity="0.9" />

        <CarrierDots type="holes" />
        <CarrierDots type="electrons" />

        <motion.rect
          x="359"
          y="108"
          width="42"
          height="162"
          rx="14"
          fill="#fef3c7"
          stroke="#f59e0b"
          strokeWidth="3"
          animate={{ width: [38, 48, 38], x: [361, 356, 361] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <text x="380" y="104" textAnchor="middle" fontSize="12" fontWeight="900" fill="#92400e">
          PN BOUNDARY
        </text>

        <Terminal x={135} label="Anode" color="#dc2626" />
        <Terminal x={625} label="Cathode" color="#111827" />

        <rect x="120" y="316" width="520" height="34" rx="17" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <text x="380" y="336" textAnchor="middle" fontSize="11" fontWeight="900" fill="#047857" letterSpacing="2">
          INTERNAL READOUT
        </text>
        <text x="380" y="350" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#334155">
          Two doped semiconductor regions are placed together before junction interaction begins.
        </text>
      </svg>
    </div>
  );
}
