"use client";

import { motion } from "framer-motion";

import { CarrierDots, DiffusionAnimation, ElectricFieldArrows, FixedIons, Terminal } from "./DiagramPieces";
import type { LayerView } from "./types";

export function DiodeConstructionDiagram({ view }: { view: LayerView }) {
  const showDoping = view === "doping" || view === "junction" || view === "formation";
  const showJunction = view === "junction" || view === "formation";
  const showFormation = view === "formation";

  return (
    <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
      <svg viewBox="0 0 760 390" className="h-[390px] w-full" role="img" aria-label="Diode construction diagram">
        <defs>
          <marker id="purpleArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#7c3aed" />
          </marker>
        </defs>

        <rect x="95" y="60" width="285" height="150" rx="18" fill="#fee2e2" stroke="#dc2626" strokeWidth="3" />
        <rect x="380" y="60" width="285" height="150" rx="18" fill="#dbeafe" stroke="#2563eb" strokeWidth="3" />

        <text x="238" y="42" textAnchor="middle" fontSize="22" fontWeight="900" fill="#dc2626">
          P-Type Region
        </text>
        <text x="522" y="42" textAnchor="middle" fontSize="22" fontWeight="900" fill="#2563eb">
          N-Type Region
        </text>

        <text x="238" y="235" textAnchor="middle" fontSize="17" fontWeight="800" fill="#991b1b">
          Majority Carrier: Holes (+)
        </text>
        <text x="522" y="235" textAnchor="middle" fontSize="17" fontWeight="800" fill="#1d4ed8">
          Majority Carrier: Electrons (−)
        </text>

        {showDoping && !showFormation && (
          <>
            <CarrierDots type="holes" />
            <CarrierDots type="electrons" />
          </>
        )}

        {showFormation && (
          <>
            <CarrierDots type="holes" />
            <CarrierDots type="electrons" />
            <DiffusionAnimation />
          </>
        )}

        {showJunction && (
          <>
            <motion.rect
              x="345"
              y="50"
              width="70"
              height="170"
              rx="14"
              fill="#fef3c7"
              stroke="#f59e0b"
              strokeWidth="4"
              animate={{
                width: showFormation ? [42, 86, 70] : [58, 78, 58],
                x: showFormation ? [359, 337, 345] : [351, 341, 351],
              }}
              transition={{ duration: showFormation ? 3 : 1.6, repeat: Infinity }}
            />
            <text x="380" y="130" textAnchor="middle" fontSize="16" fontWeight="900" fill="#92400e">
              PN
            </text>
            <text x="380" y="151" textAnchor="middle" fontSize="16" fontWeight="900" fill="#92400e">
              Junction
            </text>
            <text x="380" y="255" textAnchor="middle" fontSize="16" fontWeight="800" fill="#92400e">
              Depletion Layer forms here
            </text>
          </>
        )}

        {showFormation && (
          <>
            <FixedIons />
            <ElectricFieldArrows />
            <text x="380" y="338" textAnchor="middle" fontSize="17" fontWeight="900" fill="#334155">
              Formation: Diffusion → Recombination → Fixed Ions → Depletion Layer
            </text>
            <text x="380" y="364" textAnchor="middle" fontSize="15" fontWeight="700" fill="#475569">
              Electrons ও holes junction-এর কাছে মিলিত হলে মাঝখানে carrier-free region তৈরি হয়।
            </text>
          </>
        )}

        <Terminal x={135} label="Anode" color="#dc2626" />
        <Terminal x={625} label="Cathode" color="#111827" />

        <line x1="135" y1="170" x2="95" y2="170" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" />
        <line x1="625" y1="170" x2="665" y2="170" stroke="#111827" strokeWidth="6" strokeLinecap="round" />

        {!showFormation && (
          <text x="380" y="320" textAnchor="middle" fontSize="18" fontWeight="800" fill="#334155">
            Construction: P-Type + N-Type semiconductor joined together
          </text>
        )}
      </svg>
    </div>
  );
}
