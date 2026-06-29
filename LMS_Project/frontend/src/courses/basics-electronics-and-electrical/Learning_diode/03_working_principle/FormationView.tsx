"use client";

import { motion } from "framer-motion";

import { CarrierDots, DiffusionAnimation, FixedIons } from "./SharedPieces";

export function FormationView() {
  return (
    <div className="rounded-[24px] border border-slate-300 bg-white shadow-sm">
      <svg viewBox="0 0 760 410" className="h-[410px] w-full" role="img" aria-label="PN junction formation">
        <defs>
          <marker id="fieldArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#7c3aed" />
          </marker>
        </defs>

        <rect x="22" y="20" width="716" height="370" rx="28" fill="white" stroke="#cbd5e1" strokeWidth="2" />
        <rect x="46" y="36" width="668" height="34" rx="17" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
        <text x="66" y="58" fontSize="11" fontWeight="900" fill="#047857" letterSpacing="3">
          JUNCTION FORMATION
        </text>
        <text x="648" y="58" textAnchor="end" fontSize="11" fontWeight="900" fill="#047857" letterSpacing="2">
          STAGE 2
        </text>

        <rect x="95" y="92" width="285" height="150" rx="18" fill="#fee2e2" stroke="#dc2626" strokeWidth="3" />
        <rect x="380" y="92" width="285" height="150" rx="18" fill="#dbeafe" stroke="#2563eb" strokeWidth="3" />
        <text x="238" y="80" textAnchor="middle" fontSize="20" fontWeight="900" fill="#dc2626">P-Type Region</text>
        <text x="522" y="80" textAnchor="middle" fontSize="20" fontWeight="900" fill="#2563eb">N-Type Region</text>

        <CarrierDots type="holes" />
        <CarrierDots type="electrons" />
        <DiffusionAnimation />

        <motion.rect
          x="345"
          y="82"
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

        {[114, 148, 182].map((y, index) => (
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

        <text x="380" y="80" textAnchor="middle" fontSize="12" fontWeight="900" fill="#6d28d9">
          Electric Field: N -&gt; P
        </text>
        <text x="380" y="224" textAnchor="middle" fontSize="12" fontWeight="900" fill="#7c2d12">
          Depletion Region
        </text>

        <rect x="92" y="312" width="576" height="54" rx="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <text x="380" y="331" textAnchor="middle" fontSize="11" fontWeight="900" fill="#047857" letterSpacing="2">
          FORMATION SEQUENCE
        </text>
        <text x="380" y="347" textAnchor="middle" fontSize="14" fontWeight="900" fill="#334155">
          Diffusion -&gt; Recombination -&gt; Fixed Ions -&gt; Depletion Layer
        </text>
        <text x="380" y="361" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#475569">
          Electrons and holes recombine near the junction, leaving a carrier-free barrier region.
        </text>
      </svg>
    </div>
  );
}
