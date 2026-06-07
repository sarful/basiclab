"use client";

import { motion } from "framer-motion";

import { CarrierDots, DiffusionAnimation, FixedIons } from "./SharedPieces";

export function FormationView() {
  return (
    <div className="rounded-xl border border-slate-300 bg-white shadow-sm">
      <svg viewBox="0 0 760 390" className="h-[390px] w-full" role="img" aria-label="PN junction formation">
        <defs>
          <marker id="fieldArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#7c3aed" />
          </marker>
        </defs>
        <rect x="95" y="60" width="285" height="150" rx="18" fill="#fee2e2" stroke="#dc2626" strokeWidth="3" />
        <rect x="380" y="60" width="285" height="150" rx="18" fill="#dbeafe" stroke="#2563eb" strokeWidth="3" />
        <text x="238" y="42" textAnchor="middle" fontSize="22" fontWeight="900" fill="#dc2626">P-Type</text>
        <text x="522" y="42" textAnchor="middle" fontSize="22" fontWeight="900" fill="#2563eb">N-Type</text>
        <CarrierDots type="holes" />
        <CarrierDots type="electrons" />
        <DiffusionAnimation />
        <motion.rect
          x="345"
          y="50"
          width="70"
          height="170"
          rx="14"
          fill="#fef3c7"
          stroke="#f59e0b"
          strokeWidth="4"
          animate={{ width: [42, 86, 70], x: [359, 337, 345] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <FixedIons />
        {[92, 126, 160].map((y, index) => (
          <motion.line
            key={y}
            x1="420"
            y1={y}
            x2="340"
            y2={y}
            stroke="#7c3aed"
            strokeWidth="3"
            markerEnd="url(#fieldArrow)"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, delay: index * 0.2, repeat: Infinity }}
          />
        ))}
        <text x="380" y="45" textAnchor="middle" fontSize="14" fontWeight="800" fill="#6d28d9">Electric Field: N → P</text>
        <text x="380" y="338" textAnchor="middle" fontSize="17" fontWeight="900" fill="#334155">
          Diffusion → Recombination → Fixed Ions → Depletion Layer
        </text>
        <text x="380" y="364" textAnchor="middle" fontSize="15" fontWeight="700" fill="#475569">
          Electrons ও holes junction-এর কাছে মিলিত হলে carrier-free region তৈরি হয়।
        </text>
      </svg>
    </div>
  );
}
