"use client";

import { motion } from "framer-motion";

import {
  CarrierDots,
  DiffusionAnimation,
  ElectricFieldArrows,
  ElectromagneticFieldBand,
  FixedIons,
  ProbeTargets,
  SemiconductorDensityShader,
  Terminal,
} from "./DiagramPieces";
import type { LayerView, ProbeTarget } from "./types";

const ACTIVE_MODE: Record<LayerView, string> = {
  basic: "Structure",
  doping: "Doping",
  junction: "Junction",
  formation: "Formation",
};

const READOUT_COPY: Record<
  LayerView,
  { title: string; lineA: string; lineB: string }
> = {
  basic: {
    title: "Material Structure",
    lineA: "Two doped semiconductor regions are placed side by side before junction interaction begins.",
    lineB: "Use the probe markers to verify anode, cathode, and material identity.",
  },
  doping: {
    title: "Carrier Density Map",
    lineA: "Holes dominate the P-side while electrons dominate the N-side with stronger concentration shading.",
    lineB: "This majority-carrier balance sets up the diode's later junction behavior.",
  },
  junction: {
    title: "Junction Barrier",
    lineA: "Mobile carriers near the boundary recombine and density drops around the center line.",
    lineB: "The depletion barrier starts resisting further uncontrolled diffusion across the PN boundary.",
  },
  formation: {
    title: "Formation Sequence",
    lineA: "Diffusion, recombination, fixed ions, and the electric field together complete the PN barrier.",
    lineB: "Carrier density fades near the depletion region because free carriers are removed from the center.",
  },
};

export function DiodeConstructionDiagram({
  animationSpeed,
  onProbeSelect,
  selectedProbe,
  showCarriers,
  showDebugDots,
  showLabels,
  view,
}: {
  animationSpeed: number;
  onProbeSelect: (probe: ProbeTarget) => void;
  selectedProbe: ProbeTarget;
  showCarriers: boolean;
  showDebugDots: boolean;
  showLabels: boolean;
  view: LayerView;
}) {
  const showDoping =
    showCarriers &&
    (view === "doping" || view === "junction" || view === "formation");
  const showJunction = view === "junction" || view === "formation";
  const showFormation = view === "formation";
  const readout = READOUT_COPY[view];
  const fieldOpacity =
    view === "basic" ? 0.04 : view === "doping" ? 0.12 : view === "junction" ? 0.2 : 0.28;

  return (
    <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:p-5">
      <svg
        viewBox="0 0 760 440"
        className="h-auto min-h-[430px] w-full"
        role="img"
        aria-label="Diode construction diagram"
      >
        <defs>
          <marker
            id="purpleArrow"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#7c3aed" />
          </marker>
        </defs>

        <rect
          x="18"
          y="18"
          width="724"
          height="404"
          rx="28"
          fill="white"
          stroke="#cbd5e1"
          strokeWidth="2"
        />

        <rect
          x="42"
          y="34"
          width="676"
          height="36"
          rx="18"
          fill="#f8fafc"
          stroke="#e2e8f0"
          strokeWidth="1.5"
        />
        <text
          x="64"
          y="57"
          fontSize="11"
          fontWeight="900"
          fill="#047857"
          letterSpacing="3"
        >
          PN JUNCTION VIEW
        </text>
        <text
          x="648"
          y="49"
          textAnchor="end"
          fontSize="10"
          fontWeight="900"
          fill="#047857"
          letterSpacing="2"
        >
          ACTIVE STAGE
        </text>
        <text
          x="648"
          y="61"
          textAnchor="end"
          fontSize="16"
          fontWeight="900"
          fill="#0f172a"
        >
          {ACTIVE_MODE[view]}
        </text>

        <text
          x="192"
          y="92"
          textAnchor="middle"
          fontSize="18"
          fontWeight="900"
          fill="#dc2626"
        >
          P-Type Region
        </text>
        <text
          x="566"
          y="92"
          textAnchor="middle"
          fontSize="18"
          fontWeight="900"
          fill="#2563eb"
        >
          N-Type Region
        </text>

        <rect
          x="95"
          y="110"
          width="285"
          height="150"
          rx="18"
          fill="#fef2f2"
          stroke="#dc2626"
          strokeWidth="3"
        />
        <rect
          x="380"
          y="110"
          width="285"
          height="150"
          rx="18"
          fill="#eff6ff"
          stroke="#2563eb"
          strokeWidth="3"
        />

        <line
          x1="380"
          y1="114"
          x2="380"
          y2="256"
          stroke="#f59e0b"
          strokeWidth="2.5"
          strokeDasharray={view === "basic" ? "2 5" : "5 6"}
          opacity={view === "basic" ? 0.55 : 0.85}
        />

        <SemiconductorDensityShader side="p" view={view} />
        <SemiconductorDensityShader side="n" view={view} />
        <ElectromagneticFieldBand opacity={fieldOpacity} />

        {showDoping && !showFormation ? (
          <>
            <CarrierDots type="holes" />
            <CarrierDots type="electrons" />
          </>
        ) : null}

        {showFormation && showCarriers ? (
          <>
            <CarrierDots type="holes" />
            <CarrierDots type="electrons" />
            <DiffusionAnimation speed={animationSpeed} />
          </>
        ) : null}

        {showJunction ? (
          <>
            <motion.rect
              x="366"
              y="104"
              width="48"
              height="162"
              rx="14"
              fill="#fef3c7"
              stroke="#f59e0b"
              strokeWidth="3.5"
              animate={{
                width: showFormation ? [42, 56, 48] : [44, 52, 44],
                x: showFormation ? [369, 362, 366] : [368, 364, 368],
              }}
              transition={{
                duration: showFormation ? 3 : 1.7,
                repeat: Infinity,
              }}
            />

            <text
              x="390"
              y="99"
              textAnchor="middle"
              fontSize="12"
              fontWeight="900"
              fill="#92400e"
            >
              PN JUNCTION
            </text>

            {showFormation ? (
              <>
                <FixedIons />
                <ElectricFieldArrows />
                <text
                  x="390"
                  y="208"
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="900"
                  fill="#7c2d12"
                >
                  Depletion Region
                </text>
                <text
                  x="390"
                  y="82"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="900"
                  fill="#6d28d9"
                >
                  Electric Field: N → P
                </text>
              </>
            ) : (
              <text
                x="390"
                y="208"
                textAnchor="middle"
                fontSize="11"
                fontWeight="900"
                fill="#7c2d12"
              >
                Depletion Layer
              </text>
            )}
          </>
        ) : null}

        {showLabels ? (
          <>
            <text
              x="238"
              y="286"
              textAnchor="middle"
              fontSize="15"
              fontWeight="800"
              fill="#991b1b"
            >
              Majority Carrier: Holes (+)
            </text>
            <text
              x="522"
              y="286"
              textAnchor="middle"
              fontSize="15"
              fontWeight="800"
              fill="#1d4ed8"
            >
              Majority Carrier: Electrons (−)
            </text>
          </>
        ) : null}

        <Terminal x={135} label={showLabels ? "Anode" : ""} color="#dc2626" />
        <Terminal x={625} label={showLabels ? "Cathode" : ""} color="#111827" />

        <line
          x1="135"
          y1="202"
          x2="95"
          y2="202"
          stroke="#dc2626"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <line
          x1="625"
          y1="202"
          x2="665"
          y2="202"
          stroke="#111827"
          strokeWidth="6"
          strokeLinecap="round"
        />

        <ProbeTargets
          selectedProbe={selectedProbe}
          onSelect={onProbeSelect}
          showTargets={showDebugDots}
        />

        <rect
          x="100"
          y="328"
          width="560"
          height="62"
          rx="18"
          fill="#f8fafc"
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />
        <line
          x1="146"
          y1="360"
          x2="614"
          y2="360"
          stroke="#e2e8f0"
          strokeWidth="1"
        />
        <text
          x="380"
          y="347"
          textAnchor="middle"
          fontSize="11"
          fontWeight="900"
          fill="#047857"
          letterSpacing="2"
        >
          INTERNAL READOUT
        </text>
        <text
          x="380"
          y="364"
          textAnchor="middle"
          fontSize="15"
          fontWeight="900"
          fill="#0f172a"
        >
          {readout.title}
        </text>
        <text
          x="380"
          y="380"
          textAnchor="middle"
          fontSize="11.5"
          fontWeight="700"
          fill="#475569"
        >
          {readout.lineA}
        </text>
        <text
          x="380"
          y="394"
          textAnchor="middle"
          fontSize="11.5"
          fontWeight="700"
          fill="#475569"
        >
          {readout.lineB}
        </text>
      </svg>
    </div>
  );
}
