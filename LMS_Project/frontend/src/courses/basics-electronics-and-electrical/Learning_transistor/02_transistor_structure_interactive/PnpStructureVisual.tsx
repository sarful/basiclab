"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

type Mode = "CUT-OFF" | "ACTIVE REGION" | "SATURATION";
type Point = { x: number; y: number };
type ComponentBox = { x: number; y: number; width: number; height: number };

type PnpStructureVisualProps = {
  active: boolean;
  dopingLevel: number;
  collectorVoltage: number;
  baseVoltage: number;
  baseResistance: number;
  loadResistance: number;
  showPhysics: boolean;
  showCurrent: boolean;
  showElectronFlow: boolean;
};

const VIEW_BOX = "0 0 980 620";
const BASE_BIAS_SHIFT_X = -40;

const STYLE = {
  offWire: "#64748b",
  activeWire: "#15803d",
  saturationWire: "#f97316",
  voltage: "#ef4444",
  current: "#4c1d95",
  hole: "#ef2929",
  electron: "#1d70d8",
  recombination: "#f59e0b",
  text: "#0f172a",
  junction: "#6d28d9",
} as const;

const COMPONENT = {
  emitterLayer: { x: 210, y: 225, width: 168, height: 170 },
  baseLayer: { x: 378, y: 225, width: 56, height: 170 },
  collectorLayer: { x: 434, y: 225, width: 336, height: 170 },
} as const satisfies Record<string, ComponentBox>;

const NODE = {
  e: { x: 210, y: 310 },
  b: { x: 406, y: 395 },
  c: { x: 770, y: 310 },

  topLeft: { x: 60, y: 118 },
  vecPlus: { x: 385, y: 118 },
  vecMinus: { x: 440, y: 118 },
  topRight: { x: 865, y: 118 },
  rightDown: { x: 865, y: 310 },

  emitterDown: { x: 60, y: 535 },
  baseSupplyPlus: { x: 150, y: 535 },
  baseSupplyMinus: { x: 190, y: 535 },

  rbTop: { x: 447 + BASE_BIAS_SHIFT_X, y: 430 },
  rbBottom: { x: 447 + BASE_BIAS_SHIFT_X, y: 535 },
  rbBypassX: { x: 447 + BASE_BIAS_SHIFT_X - 34, y: 0 },

  switchA: { x: 335 + BASE_BIAS_SHIFT_X, y: 535 },
  switchB: { x: 390 + BASE_BIAS_SHIFT_X, y: 535 },
  switchOpen: { x: 372 + BASE_BIAS_SHIFT_X, y: 515 },
} as const;

const WIRE = {
  width: 3,

  collectorSupplyLeft: [NODE.topLeft, NODE.vecPlus],

  collectorSupplyRight: [
    NODE.vecMinus,
    { x: 720, y: 118 },
    { x: 720, y: 155 },
    { x: 865, y: 155 },
    NODE.rightDown,
    NODE.c,
  ],

  emitterReturn: [NODE.e, { x: 60, y: 310 }, NODE.topLeft],
  emitterGroundReturn: [
    { x: 60, y: 310 },
    NODE.emitterDown,
    NODE.baseSupplyPlus,
  ],

  baseBiasLeft: [NODE.baseSupplyMinus, NODE.switchA],

  baseBiasRight: [
    NODE.switchB,
    { x: NODE.rbBypassX.x, y: NODE.switchB.y },
    { x: NODE.rbBypassX.x, y: NODE.rbBottom.y },
    NODE.rbBottom,
  ],

  baseLead: [NODE.b, NODE.rbTop],
} as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function format(value: number, digits = 2) {
  return Number.isFinite(value) ? value.toFixed(digits) : "0.00";
}

function pathD(points: readonly Point[]) {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
}

function wireColor(mode: Mode, active: boolean) {
  if (!active) return STYLE.offWire;
  if (mode === "SATURATION") return STYLE.saturationWire;
  return STYLE.activeWire;
}

function WirePath({
  points,
  active,
  mode,
}: {
  points: readonly Point[];
  active: boolean;
  mode: Mode;
}) {
  return (
    <path
      d={pathD(points)}
      stroke={wireColor(mode, active)}
      strokeWidth={WIRE.width}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function ConnectionNode({ x, y, active }: Point & { active: boolean }) {
  return (
    <circle
      cx={x}
      cy={y}
      r="7"
      fill={active ? "#22c55e" : "#ffffff"}
      stroke={active ? "#166534" : "#334155"}
      strokeWidth="3"
    />
  );
}

function BatterySymbol({
  x,
  y,
  label,
  leftSign,
  rightSign,
}: {
  x: number;
  y: number;
  label: string;
  leftSign: string;
  rightSign: string;
}) {
  return (
    <g>
      <text
        x={x - 28}
        y={y - 30}
        fill={STYLE.text}
        fontSize="18"
        fontWeight="900"
      >
        {label}
      </text>
      <line
        x1={x}
        y1={y - 28}
        x2={x}
        y2={y + 28}
        stroke={STYLE.voltage}
        strokeWidth="6"
      />
      <line
        x1={x + 28}
        y1={y - 18}
        x2={x + 28}
        y2={y + 18}
        stroke={STYLE.voltage}
        strokeWidth="3"
      />
      <text
        x={x - 20}
        y={y - 22}
        fill={STYLE.voltage}
        fontSize="20"
        fontWeight="900"
      >
        {leftSign}
      </text>
      <text
        x={x + 42}
        y={y - 22}
        fill={STYLE.voltage}
        fontSize="20"
        fontWeight="900"
      >
        {rightSign}
      </text>
    </g>
  );
}

function LampSymbol({ glow, active }: { glow: number; active: boolean }) {
  return (
    <g>
      <circle
        cx="790"
        cy="125"
        r={active ? 34 + glow * 18 : 0}
        fill={`rgba(250,204,21,${active ? 0.15 + glow * 0.35 : 0})`}
      />
      <circle
        cx="790"
        cy="125"
        r="24"
        fill={active ? `rgba(250,204,21,${0.25 + glow * 0.6})` : "#f8fafc"}
        stroke="#ca8a04"
        strokeWidth="4"
      />
      <rect x="780" y="145" width="20" height="12" rx="3" fill="#334155" />
    </g>
  );
}

function ResistorSymbol({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x} ${y} l-14 12 l28 16 l-28 16 l28 16 l-28 16 l28 16 l-14 11`}
      stroke="#1f2937"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function OperatingModeBadge({ mode }: { mode: Mode }) {
  const cls =
    mode === "CUT-OFF"
      ? "bg-red-100 text-red-700"
      : mode === "SATURATION"
        ? "bg-orange-100 text-orange-700"
        : "bg-green-100 text-green-700";

  return (
    <div className={`rounded-full px-5 py-2 text-xs font-black ${cls}`}>
      {mode}
    </div>
  );
}

function TransistorLayers({
  doping,
  active,
  mode,
  showPhysics,
  collectorVoltage,
  baseVoltage,
}: {
  doping: number;
  active: boolean;
  mode: Mode;
  showPhysics: boolean;
  collectorVoltage: number;
  baseVoltage: number;
}) {
  const gain = clamp(doping / 100, 0, 1);
  const emitterCount = 38 + Math.round(gain * 45);
  const baseCount = 6 + Math.round(gain * 9);
  const collectorCount = 24 + Math.round(gain * 28);

  const ebBias = clamp(Math.abs(baseVoltage) / 1.2, 0, 1);
  const ebDepletionWidth = 18 - ebBias * 14;

  const cbBias = clamp(collectorVoltage / 15, 0, 1);
  const cbDepletionWidth = 6 + cbBias * 24;

  const bodyGlow =
    mode === "CUT-OFF"
      ? "rgba(148,163,184,0.08)"
      : mode === "SATURATION"
        ? "rgba(249,115,22,0.18)"
        : "rgba(34,197,94,0.13)";

  const carriers = (
    count: number,
    box: ComponentBox,
    cols: number,
    color: string,
    hollow: boolean,
    key: string,
  ) =>
    Array.from({ length: count }).map((_, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      return (
        <circle
          key={`${key}-${index}-${doping}`}
          cx={box.x + 16 + col * ((box.width - 32) / Math.max(cols - 1, 1))}
          cy={box.y + 24 + row * 15}
          r={hollow ? 4 : 3.2}
          fill={hollow ? "#ffffff" : color}
          stroke={color}
          strokeWidth={hollow ? 2 : 0}
          opacity={active ? 0.95 : 0.38}
        />
      );
    });

  return (
    <g>
      <rect x="200" y="215" width="585" height="190" rx="12" fill={bodyGlow} />

      <rect
        x="210"
        y="225"
        width="560"
        height="170"
        fill="#fff"
        stroke="#334155"
        strokeWidth="2"
      />
      <rect x="210" y="225" width="168" height="170" fill="url(#pEmitter)" />
      <rect x="378" y="225" width="56" height="170" fill="url(#nBase)" />
      <rect x="434" y="225" width="336" height="170" fill="url(#pCollector)" />

      <motion.rect
        animate={{ x: 378 - ebDepletionWidth / 2, width: ebDepletionWidth }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        y="225"
        height="170"
        fill={active ? "rgba(34,197,94,0.25)" : "rgba(148,163,184,0.18)"}
      />

      <motion.rect
        animate={{ x: 434 - cbDepletionWidth / 2, width: cbDepletionWidth }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        y="225"
        height="170"
        fill={active ? "rgba(109,40,217,0.25)" : "rgba(148,163,184,0.18)"}
      />

      <line
        x1="378"
        y1="217"
        x2="378"
        y2="405"
        stroke={active ? "#16a34a" : "#94a3b8"}
        strokeWidth="3"
        strokeDasharray="6 5"
      />
      <line
        x1="434"
        y1="217"
        x2="434"
        y2="405"
        stroke={active ? STYLE.junction : "#94a3b8"}
        strokeWidth="3"
        strokeDasharray="6 5"
      />

      <text x="290" y="205" fill="#dc2626" fontSize="24" fontWeight="900">
        P+
      </text>
      <text x="395" y="205" fill="#0b56c5" fontSize="24" fontWeight="900">
        N
      </text>
      <text x="590" y="205" fill="#dc2626" fontSize="24" fontWeight="900">
        P
      </text>

      {carriers(
        emitterCount,
        COMPONENT.emitterLayer,
        8,
        STYLE.hole,
        true,
        "emitter-hole",
      )}
      {carriers(
        baseCount,
        COMPONENT.baseLayer,
        2,
        STYLE.electron,
        false,
        "base-electron",
      )}
      {carriers(
        collectorCount,
        COMPONENT.collectorLayer,
        12,
        STYLE.hole,
        true,
        "collector-hole",
      )}

      <text x="260" y="418" fill="#dc2626" fontSize="16" fontWeight="900">
        Emitter (P+)
      </text>
      <text x="385" y="418" fill="#0b56c5" fontSize="16" fontWeight="900">
        Base (N)
      </text>
      <text x="560" y="418" fill="#dc2626" fontSize="16" fontWeight="900">
        Collector (P)
      </text>

      {showPhysics && (
        <>
          <text x="248" y="330" fill="#dc2626" fontSize="13" fontWeight="900">
            {/* Emitter injects holes */}
          </text>
          <text x="350" y="338" fill="#0b56c5" fontSize="12" fontWeight="900">
            {/* |VBE| ↑ → EB depletion ↓ */}
          </text>
          <text x="350" y="353" fill="#0b56c5" fontSize="12" fontWeight="900">
            {/* Thin base minimizes recombination */}
          </text>
          <text x="553" y="330" fill="#dc2626" fontSize="13" fontWeight="900">
            {/* VEC ↑ → CB depletion ↑ */}
          </text>
        </>
      )}
    </g>
  );
}

function HoleFlow({
  active,
  intensity,
  showCarrierFlow,
}: {
  active: boolean;
  intensity: number;
  showCarrierFlow: boolean;
}) {
  if (!showCarrierFlow) return null;

  if (!active) {
    return (
      <g>
        <text x="360" y="310" fill="#64748b" fontSize="13" fontWeight="900">
          No Hole Injection
        </text>
      </g>
    );
  }

  const speedFactor = clamp(intensity, 0.05, 1);
  const duration = 3.0 - speedFactor * 2.0;
  const mainHoleCount = Math.round(10 + speedFactor * 10);

  return (
    <g>
      <path
        d="M245 310 C305 310 350 310 390 310"
        stroke={STYLE.hole}
        strokeWidth="4"
        strokeDasharray="14 12"
        fill="none"
      />
      <path
        d="M390 310 C470 302 600 306 770 310"
        stroke={STYLE.hole}
        strokeWidth="4"
        strokeDasharray="14 12"
        fill="none"
        markerEnd="url(#redArrow)"
      />

      <path
        d="M392 310 C404 322 416 336 428 350"
        stroke={STYLE.recombination}
        strokeWidth="2.5"
        strokeDasharray="5 7"
        fill="none"
        opacity="0.45"
        markerEnd="url(#orangeArrow)"
      />

      <motion.circle
        cx="770"
        cy="310"
        r="18"
        fill="rgba(239,41,41,0.12)"
        stroke="rgba(239,41,41,0.55)"
        strokeWidth="2"
        animate={{
          r: [14, 22 + speedFactor * 8, 14],
          opacity: [0.25, 0.85, 0.25],
        }}
        transition={{
          duration: 1.6 - speedFactor * 0.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {Array.from({ length: mainHoleCount }).map((_, index) => (
        <motion.circle
          key={`main-hole-${index}`}
          r="6"
          fill="#ffffff"
          stroke={STYLE.hole}
          strokeWidth="3"
          initial={{ x: 245, y: 310, opacity: 0 }}
          animate={{
            x: [245, 320, 390, 470, 590, 710, 770],
            y: [310, 310, 310, 304, 306, 309, 310],
            opacity: [0, 1, 1, 1, 1, 1, 0],
          }}
          transition={{
            duration,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "linear",
          }}
        />
      ))}

      <motion.circle
        r="5"
        fill={STYLE.recombination}
        initial={{ x: 392, y: 310, opacity: 0 }}
        animate={{
          x: [392, 408, 428],
          y: [310, 330, 350],
          opacity: [0, 0.55, 0],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          delay: 0.8,
          ease: "linear",
        }}
      />
    </g>
  );
}

function BaseCurrentFlow({
  active,
  intensity,
}: {
  active: boolean;
  intensity: number;
}) {
  if (!active) return null;

  const speedFactor = clamp(intensity, 0.05, 1);
  const duration = 2.4 - speedFactor * 1.2;
  const particleCount = Math.round(3 + speedFactor * 5);

  const path = `M${NODE.b.x} ${NODE.b.y} C${NODE.rbTop.x - 17} 398 ${NODE.rbTop.x} 410 ${NODE.rbTop.x} ${NODE.rbTop.y} L${NODE.rbBypassX.x} ${NODE.rbTop.y} L${NODE.rbBypassX.x} ${NODE.rbBottom.y} L${NODE.rbBottom.x} ${NODE.rbBottom.y}`;

  return (
    <g>
      <path
        d={path}
        stroke={STYLE.electron}
        strokeWidth="3"
        strokeDasharray="6 7"
        fill="none"
        markerEnd="url(#blueArrowDown)"
      />

      {Array.from({ length: particleCount }).map((_, index) => (
        <motion.circle
          key={`base-current-pnp-${index}`}
          r="4"
          fill={STYLE.electron}
          initial={{ x: NODE.b.x, y: NODE.b.y, opacity: 0 }}
          animate={{
            x: [
              NODE.b.x,
              NODE.rbTop.x - 17,
              NODE.rbTop.x,
              NODE.rbBypassX.x,
              NODE.rbBypassX.x,
              NODE.rbBottom.x,
            ],
            y: [
              NODE.b.y,
              398,
              NODE.rbTop.y,
              NODE.rbTop.y,
              NODE.rbBottom.y,
              NODE.rbBottom.y,
            ],
            opacity: [0, 1, 1, 1, 1, 0],
          }}
          transition={{
            duration,
            repeat: Infinity,
            delay: index * 0.22,
            ease: "linear",
          }}
        />
      ))}

      <text
        x={NODE.rbBypassX.x - 20}
        y="455"
        fill={STYLE.electron}
        fontSize="12"
        fontWeight="900"
      >
        IB leaves base
      </text>
    </g>
  );
}

function CurrentArrows({ active, show }: { active: boolean; show: boolean }) {
  if (!show) return null;

  const ibPath = `M${NODE.b.x} ${NODE.b.y} C${NODE.rbTop.x - 17} 398 ${NODE.rbTop.x} 410 ${NODE.rbTop.x} ${NODE.rbTop.y} L${NODE.rbBypassX.x} ${NODE.rbTop.y} L${NODE.rbBypassX.x} ${NODE.rbBottom.y} L${NODE.rbBottom.x} ${NODE.rbBottom.y}`;

  return (
    <g opacity={active ? 1 : 0.25}>
      <path
        d="M210 310 C260 306 330 302 390 310"
        stroke={STYLE.current}
        strokeWidth="3"
        fill="none"
        strokeDasharray="8 7"
        markerEnd="url(#purpleArrowRight)"
      />
      <text x="235" y="345" fill={STYLE.current} fontSize="13" fontWeight="900">
        {/* IE: Emitter → Device */}
      </text>

      <path
        d="M434 310 C570 292 690 300 770 310"
        stroke={STYLE.current}
        strokeWidth="3"
        fill="none"
        strokeDasharray="8 7"
        markerEnd="url(#purpleArrowRight)"
      />
      <text x="595" y="285" fill={STYLE.current} fontSize="13" fontWeight="900">
        {/* IC: Device → Collector */}
      </text>

      <path
      // d={ibPath}
      // stroke={STYLE.current}
      // strokeWidth="3"
      // fill="none"
      // markerEnd="url(#purpleArrowDown)"
      />
      <text
        x={NODE.rbBypassX.x - 20}
        y="475"
        fill={STYLE.current}
        fontSize="13"
        fontWeight="900"
      >
        {/* IB leaves base */}
      </text>
    </g>
  );
}

export default function PnpStructureVisual({
  active,
  dopingLevel,
  collectorVoltage,
  baseVoltage,
  baseResistance,
  loadResistance,
  showPhysics,
  showCurrent,
  showElectronFlow,
}: PnpStructureVisualProps) {
  const calc = useMemo(() => {
    const betaLimit = clamp(dopingLevel * 2, 20, 200);
    const ibA = active
      ? Math.max((Math.abs(baseVoltage) - 0.7) / baseResistance, 0)
      : 0;
    const icIdeal = betaLimit * ibA;
    const icMax = loadResistance > 0 ? collectorVoltage / loadResistance : 0;
    const icA = Math.min(icIdeal, icMax);
    const ieA = icA + ibA;
    const lampGlow = icMax > 0 ? clamp(icA / icMax, 0, 1) : 0;
    const powerMW = icA * icA * loadResistance * 1000;
    const conducting = active && baseVoltage <= -0.7 && icA > 0;
    const mode: Mode = !conducting
      ? "CUT-OFF"
      : icIdeal >= icMax * 0.98
        ? "SATURATION"
        : "ACTIVE REGION";

    return {
      ibMA: ibA * 1000,
      icMA: icA * 1000,
      ieMA: ieA * 1000,
      powerMW,
      lampGlow,
      conducting,
      mode,
      intensity: clamp(lampGlow, 0.1, 1),
      rbLabel: `${Math.round(baseResistance / 1000)} kΩ`,
    };
  }, [
    active,
    baseResistance,
    baseVoltage,
    collectorVoltage,
    dopingLevel,
    loadResistance,
  ]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            PNP Transistor Structure Simulator
          </h2>
          <p className="text-sm text-slate-600">
            PNP logic based on final NpnStructureVisual architecture.
          </p>
        </div>
        <OperatingModeBadge mode={calc.mode} />
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-inner">
        <svg viewBox={VIEW_BOX} className="h-auto w-full">
          <defs>
            <marker
              id="redArrow"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="5"
              orient="auto"
            >
              <path d="M0 0 L10 5 L0 10 Z" fill={STYLE.hole} />
            </marker>
            <marker
              id="orangeArrow"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="5"
              orient="auto"
            >
              <path d="M0 0 L10 5 L0 10 Z" fill={STYLE.recombination} />
            </marker>
            <marker
              id="blueArrowDown"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="5"
              orient="auto"
            >
              <path d="M0 0 L10 5 L0 10 Z" fill={STYLE.electron} />
            </marker>
            <marker
              id="purpleArrowRight"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="5"
              orient="auto"
            >
              <path d="M0 0 L10 5 L0 10 Z" fill={STYLE.current} />
            </marker>
            <marker
            // id="purpleArrowDown"
            // markerWidth="10"
            // markerHeight="10"
            // refX="5"
            // refY="9"
            // orient="auto"
            >
              <path d="M0 0 L5 10 L10 0 Z" fill={STYLE.current} />
            </marker>

            <linearGradient id="pEmitter" x1="0" x2="1">
              <stop offset="0%" stopColor="#fee2e2" />
              <stop offset="100%" stopColor="#fff1f2" />
            </linearGradient>
            <linearGradient id="nBase" x1="0" x2="1">
              <stop offset="0%" stopColor="#dbeafe" />
              <stop offset="100%" stopColor="#eff6ff" />
            </linearGradient>
            <linearGradient id="pCollector" x1="0" x2="1">
              <stop offset="0%" stopColor="#fff1f2" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>

          <rect width="980" height="620" fill="#ffffff" />
          <text x="310" y="40" fill="#0f172a" fontSize="28" fontWeight="900">
            PNP TRANSISTOR STRUCTURE
          </text>

          <WirePath
            points={WIRE.collectorSupplyLeft}
            active={calc.conducting}
            mode={calc.mode}
          />
          <WirePath
            points={WIRE.collectorSupplyRight}
            active={calc.conducting}
            mode={calc.mode}
          />
          <WirePath
            points={WIRE.emitterReturn}
            active={calc.conducting}
            mode={calc.mode}
          />
          <WirePath
            points={WIRE.emitterGroundReturn}
            active={calc.conducting}
            mode={calc.mode}
          />
          <WirePath
            points={WIRE.baseBiasLeft}
            active={active}
            mode={calc.mode}
          />
          <WirePath
            points={WIRE.baseBiasRight}
            active={active}
            mode={calc.mode}
          />
          <WirePath points={WIRE.baseLead} active={active} mode={calc.mode} />

          <BatterySymbol
            x={400}
            y={118}
            label={`VEC = +${format(collectorVoltage, 1)}V`}
            leftSign="+"
            rightSign="-"
          />
          <BatterySymbol
            x={155}
            y={535}
            label={`VBE = ${format(baseVoltage, 2)}V`}
            leftSign="+"
            rightSign="-"
          />

          <LampSymbol glow={calc.lampGlow} active={calc.conducting} />

          <text x="825" y="94" fill="#dc2626" fontSize="16" fontWeight="900">
            IC = {format(calc.icMA, 2)} mA
          </text>
          <text
            x="825"
            y="118"
            fill={STYLE.text}
            fontSize="16"
            fontWeight="900"
          >
            PL = {format(calc.powerMW, 2)} mW
          </text>
          <text
            x="800"
            y="280"
            fill={STYLE.text}
            fontSize="16"
            fontWeight="900"
          >
            RL = {loadResistance} Ω
          </text>

          <TransistorLayers
            doping={dopingLevel}
            active={calc.conducting}
            mode={calc.mode}
            showPhysics={showPhysics}
            collectorVoltage={collectorVoltage}
            baseVoltage={baseVoltage}
          />

          <ConnectionNode {...NODE.e} active={active} />
          <ConnectionNode {...NODE.b} active={active} />
          <ConnectionNode {...NODE.c} active={active} />

          <text
            x="182"
            y="330"
            fill={STYLE.text}
            fontSize="18"
            fontWeight="900"
          >
            E
          </text>
          <text
            x="422"
            y="420"
            fill={STYLE.text}
            fontSize="18"
            fontWeight="900"
          >
            B
          </text>
          <text
            x="792"
            y="330"
            fill={STYLE.text}
            fontSize="18"
            fontWeight="900"
          >
            C
          </text>

          <ResistorSymbol x={NODE.rbTop.x} y={NODE.rbTop.y} />
          <text
            x={NODE.rbTop.x + 33}
            y="480"
            fill={STYLE.text}
            fontSize="15"
            fontWeight="900"
          >
            RB = {calc.rbLabel}
          </text>

          <line
            x1={NODE.switchA.x}
            y1={NODE.switchA.y}
            x2={active ? NODE.switchB.x : NODE.switchOpen.x}
            y2={active ? NODE.switchB.y : NODE.switchOpen.y}
            stroke="#1f2937"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle
            cx={NODE.switchA.x}
            cy={NODE.switchA.y}
            r="7"
            fill="#334155"
          />
          <circle
            cx={NODE.switchB.x}
            cy={NODE.switchB.y}
            r="7"
            fill="#334155"
          />

          <text
            x={300 + BASE_BIAS_SHIFT_X}
            y="580"
            fill={STYLE.text}
            fontSize="14"
            fontWeight="900"
          >
            Base Bias Control
          </text>

          <text
            x="85"
            y="165"
            fill={STYLE.current}
            fontSize="26"
            fontWeight="900"
          >
            IC
          </text>
          <text
            x="85"
            y="190"
            fill={STYLE.current}
            fontSize="15"
            fontWeight="900"
          >
            {format(calc.icMA, 2)}mA
          </text>
          <text
            x="85"
            y="245"
            fill={STYLE.current}
            fontSize="26"
            fontWeight="900"
          >
            IE
          </text>
          <text
            x="85"
            y="270"
            fill={STYLE.current}
            fontSize="15"
            fontWeight="900"
          >
            {format(calc.ieMA, 2)}mA
          </text>
          <text
            x="85"
            y="350"
            fill={STYLE.current}
            fontSize="26"
            fontWeight="900"
          >
            IB
          </text>
          <text
            x="85"
            y="375"
            fill={STYLE.current}
            fontSize="15"
            fontWeight="900"
          >
            {format(calc.ibMA, 3)}mA
          </text>

          <HoleFlow
            active={calc.conducting}
            intensity={calc.intensity}
            showCarrierFlow={showElectronFlow}
          />

          <CurrentArrows active={calc.conducting} show={showCurrent} />

          <text x="710" y="205" fill="#166534" fontSize="16" fontWeight="900">
            Doping {dopingLevel}%
          </text>
        </svg>
      </div>
    </div>
  );
}
