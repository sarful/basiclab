"use client";

import { motion } from "framer-motion";

import { clamp, formatCurrent, formatResistance } from "./logic";
import type { MaterialSpec, StructureMode } from "./types";

const VIEW_BOX = "0 0 820 520";
const VIEW_BOX_WIDTH = 820;
const VIEW_BOX_HEIGHT = 520;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  resistor: 1,
  inputLead: 1,
  outputLead: 1,
  diagnosticPanel: 1,
  manufacturingPanel: 1,
} as const;

const BASE_WIRE_WIDTH = 8;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  muted: "#475569",
  wire: "#64748b",
  current: "#0284c7",
  electron: "#0ea5e9",
  heat: "#f97316",
  danger: "#ef4444",
} as const;

type Point = { x: number; y: number };

type ComponentBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
};

function scaleComponent(component: ComponentBox, scale: number): ComponentBox {
  const width = component.width * scale;
  const height = component.height * scale;

  return {
    ...component,
    x: component.x - (width - component.width) / 2,
    y: component.y - (height - component.height) / 2,
    width,
    height,
  };
}

function pointOnComponent(
  component: ComponentBox,
  xRatio: number,
  yRatio: number,
): Point {
  return {
    x: component.x + component.width * xRatio,
    y: component.y + component.height * yRatio,
  };
}

function buildCanvasScaleTransform(scale: number) {
  if (scale === 1) return undefined;

  const centerX = VIEW_BOX_WIDTH / 2;
  const centerY = VIEW_BOX_HEIGHT / 2;

  return `translate(${centerX} ${centerY}) scale(${scale}) translate(${-centerX} ${-centerY})`;
}

function pathD(points: readonly Point[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

const BASE_COMPONENT = {
  inputLead: {
    x: 82,
    y: 216,
    width: 138,
    height: 8,
    rotate: 0,
  },

  outputLead: {
    x: 600,
    y: 216,
    width: 138,
    height: 8,
    rotate: 0,
  },

  resistor: {
    x: 220,
    y: 166,
    width: 380,
    height: 108,
    rotate: 0,
  },

  diagnosticPanel: {
    x: 58,
    y: 382,
    width: 704,
    height: 52,
    rotate: 0,
  },

  manufacturingPanel: {
    x: 58,
    y: 444,
    width: 704,
    height: 50,
    rotate: 0,
  },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  inputLead: scaleComponent(
    BASE_COMPONENT.inputLead,
    CIRCUIT_COMPONENT_SCALE.inputLead,
  ),
  outputLead: scaleComponent(
    BASE_COMPONENT.outputLead,
    CIRCUIT_COMPONENT_SCALE.outputLead,
  ),
  resistor: scaleComponent(
    BASE_COMPONENT.resistor,
    CIRCUIT_COMPONENT_SCALE.resistor,
  ),
  diagnosticPanel: scaleComponent(
    BASE_COMPONENT.diagnosticPanel,
    CIRCUIT_COMPONENT_SCALE.diagnosticPanel,
  ),
  manufacturingPanel: scaleComponent(
    BASE_COMPONENT.manufacturingPanel,
    CIRCUIT_COMPONENT_SCALE.manufacturingPanel,
  ),
} as const;

const NODE = {
  resistorCenter: pointOnComponent(COMPONENT.resistor, 0.5, 0.5),
  resistorLeft: pointOnComponent(COMPONENT.resistor, 0, 0.5),
  resistorRight: pointOnComponent(COMPONENT.resistor, 1, 0.5),

  shellLeftCap: { x: 220, y: 198 },
  shellRightCap: { x: 576, y: 198 },

  cutawayInner: {
    x: 246,
    y: 184,
    width: 328,
    height: 72,
  },

  materialCore: {
    x: 270,
    y: 194,
    width: 280,
    height: 52,
  },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,

  inputLead: [
    { x: COMPONENT.inputLead.x, y: 220 },
    { x: COMPONENT.inputLead.x + COMPONENT.inputLead.width, y: 220 },
  ],

  outputLead: [
    { x: COMPONENT.outputLead.x, y: 220 },
    { x: COMPONENT.outputLead.x + COMPONENT.outputLead.width, y: 220 },
  ],
} as const;

const LABEL = {
  title: { x: 410, y: 32 },
  summary: { x: 410, y: 54 },
  explanation: { x: 410, y: 334 },

  inputLead: { x: 118, y: 188 },
  outputLead: { x: 702, y: 188 },

  internalPath: { x: 410, y: 303 },
} as const;

function WirePath({ points }: { points: readonly Point[] }) {
  return (
    <path
      d={pathD(points)}
      stroke="url(#leadGradient)"
      strokeWidth={WIRE.width}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function DiagnosticBar({
  x,
  y,
  label,
  value,
  fill,
}: {
  x: number;
  y: number;
  label: string;
  value: number;
  fill: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <text x="0" y="0" fill="#334155" fontSize="11" fontWeight="800">
        {label}
      </text>

      <rect x="0" y="12" width="132" height="10" rx="5" fill="#e2e8f0" />

      <motion.rect
        x="0"
        y="12"
        height="10"
        rx="5"
        fill={fill}
        initial={false}
        animate={{ width: 132 * clamp(value, 0, 1) }}
        transition={{ type: "spring", stiffness: 90, damping: 18 }}
      />
    </g>
  );
}

function CurrentArrows() {
  return (
    <g>
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.g
          key={`current-arrow-${index}`}
          animate={{ x: [0, 28, 0], opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 1.15,
            delay: index * 0.18,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <path
            d={`M${118 + index * 124} 220 l18 0 l-6 -6 m6 6 l-6 6`}
            stroke={STYLE.current}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.88"
          />
        </motion.g>
      ))}
    </g>
  );
}

function ElectronFlow({
  particleCount,
  internalDuration,
}: {
  particleCount: number;
  internalDuration: number;
}) {
  return (
    <g>
      {Array.from({ length: particleCount }).map((_, index) => (
        <motion.circle
          key={`electron-flow-${index}`}
          cx={92 + (index % 5) * 14}
          cy={220 + ((index % 3) - 1) * 8}
          r="3.2"
          fill={STYLE.electron}
          animate={{
            x: [0, 142, 172, 198, 215, 236, 258, 318, 420, 526, 610],
            opacity: [0, 1, 1, 0.88, 0.62, 0.9, 0.72, 0.75, 0.9, 1, 0],
            scale: [0.75, 1, 1.08, 0.7, 0.52, 0.68, 0.6, 0.7, 0.82, 1, 0.75],
          }}
          transition={{
            duration:
              index % 2 === 0 ? internalDuration : internalDuration + 0.35,
            times: [0, 0.2, 0.3, 0.39, 0.47, 0.54, 0.62, 0.7, 0.82, 0.92, 1],
            delay: index * 0.075,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </g>
  );
}

function CongestionDots({
  congestionCount,
  collisionLevel,
}: {
  congestionCount: number;
  collisionLevel: number;
}) {
  return (
    <g>
      {Array.from({ length: congestionCount }).map((_, index) => (
        <motion.circle
          key={`congestion-electron-${index}`}
          cx={176 + (index % 6) * 8}
          cy={199 + ((index % 7) - 3) * 7}
          r="2.6"
          fill="#38bdf8"
          animate={{
            x: [0, 12, 0],
            opacity: [0.3, 1, 0.3],
            scale: [0.75, 1.2, 0.75],
          }}
          transition={{
            duration: 1.05 + index * 0.035,
            repeat: Infinity,
            delay: index * 0.06,
          }}
        />
      ))}
    </g>
  );
}

function HeatWaves({ heatLevel }: { heatLevel: number }) {
  return (
    <motion.g
      animate={{ opacity: [0.22, 1, 0.22], y: [7, -4, 7] }}
      transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
    >
      {[315, 410, 505].map((x, index) => (
        <path
          key={`heat-wave-${index}`}
          d={`M${x} 122 C${x - 18} 95 ${x + 18} 83 ${x} 56`}
          stroke={index === 1 ? STYLE.danger : STYLE.heat}
          strokeWidth={2.4 + heatLevel}
          fill="none"
          strokeLinecap="round"
          opacity={0.35 + heatLevel * 0.65}
        />
      ))}
    </motion.g>
  );
}

function InternalHeatMap({
  heatLevel,
  isAssembled,
}: {
  heatLevel: number;
  isAssembled: boolean;
}) {
  if (isAssembled) {
    return (
      <motion.g
        animate={{ opacity: [0.12, 0.28, 0.12] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <ellipse
          cx="410"
          cy="220"
          rx={45 + heatLevel * 34}
          ry={16 + heatLevel * 8}
          fill="url(#internalHotspot)"
        />
      </motion.g>
    );
  }

  return (
    <motion.g
      animate={{ opacity: [0.55, 0.9, 0.55], scale: [0.98, 1.04, 0.98] }}
      transition={{ repeat: Infinity, duration: 1.35 }}
      style={{ transformOrigin: "410px 220px" }}
    >
      <ellipse
        cx="410"
        cy="220"
        rx={58 + heatLevel * 48}
        ry={20 + heatLevel * 12}
        fill="url(#internalHotspot)"
        opacity={0.45 + heatLevel * 0.5}
      />

      <ellipse
        cx="472"
        cy="220"
        rx={28 + heatLevel * 22}
        ry={11 + heatLevel * 8}
        fill={STYLE.danger}
        opacity={heatLevel * 0.28}
      />
    </motion.g>
  );
}

function CarbonGranules() {
  return (
    <g>
      {Array.from({ length: 90 }).map((_, index) => {
        const x = 282 + ((index * 23) % 258);
        const y = 194 + ((index * 17) % 52);
        const size = 1.6 + (index % 5) * 0.55;

        return (
          <circle
            key={`carbon-granule-${index}`}
            cx={x}
            cy={y}
            r={size}
            fill={
              index % 3 === 0
                ? "#111827"
                : index % 3 === 1
                  ? "#334155"
                  : "#64748b"
            }
            opacity="0.82"
          />
        );
      })}
    </g>
  );
}

function MetalFilmTrack({ y = 220 }: { y?: number }) {
  return (
    <path
      d={`M296 ${y} H318 L332 ${y - 20} L350 ${y + 20} L368 ${
        y - 20
      } L386 ${y + 20} L404 ${y - 20} L422 ${y + 20} L440 ${
        y - 20
      } L458 ${y + 20} L476 ${y - 20} L494 ${y + 20} L520 ${y}`}
      fill="none"
      stroke="#0f172a"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function WireWoundTrack({
  material,
  y = 220,
}: {
  material: MaterialSpec;
  y?: number;
}) {
  return (
    <g>
      {Array.from({ length: 20 }).map((_, index) => {
        const x = 282 + index * 13.5;

        return (
          <ellipse
            key={`wire-turn-${index}`}
            cx={x}
            cy={y}
            rx="7.5"
            ry="34"
            fill="none"
            stroke={material.shellColor}
            strokeWidth="3"
            opacity={index % 2 === 0 ? 0.95 : 0.52}
          />
        );
      })}

      <line
        x1="276"
        y1={y}
        x2="544"
        y2={y}
        stroke={material.shellColor}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  );
}

function MaterialStructure({ material }: { material: MaterialSpec }) {
  if (material.key === "carbon") return <CarbonGranules />;
  if (material.key === "wire-wound")
    return <WireWoundTrack material={material} />;
  return <MetalFilmTrack />;
}

function AssembledMaterialHint({
  material,
  isAssembled,
}: {
  material: MaterialSpec;
  isAssembled: boolean;
}) {
  if (!isAssembled) return null;

  if (material.key === "carbon") {
    return (
      <g opacity="0.18">
        {Array.from({ length: 48 }).map((_, index) => (
          <circle
            key={`assembled-carbon-${index}`}
            cx={255 + ((index * 29) % 300)}
            cy={186 + ((index * 17) % 68)}
            r={1.5 + (index % 4)}
            fill="#111827"
          />
        ))}
      </g>
    );
  }

  if (material.key === "wire-wound") {
    return (
      <g opacity="0.26">
        {Array.from({ length: 14 }).map((_, index) => (
          <ellipse
            key={`assembled-wire-${index}`}
            cx={296 + index * 17}
            cy="220"
            rx="8"
            ry="42"
            fill="none"
            stroke={material.shellColor}
            strokeWidth="2.2"
          />
        ))}
      </g>
    );
  }

  return (
    <path
      d="M292 220 H322 L338 198 L358 242 L378 198 L398 242 L418 198 L438 242 L458 198 L478 242 L502 220"
      fill="none"
      stroke="#0f172a"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.18"
    />
  );
}

function CutawayLabels({ visible }: { visible: boolean }) {
  if (!visible) return null;

  const labelStyle = {
    fill: "#0f172a",
    fontSize: 11,
    fontWeight: 900,
  };

  return (
    <g>
      <path d="M264 172 L200 108" stroke="#334155" strokeWidth="1.5" />
      <text x="92" y="101" {...labelStyle}>
        Protective coating
      </text>

      <path d="M285 230 L178 305" stroke="#334155" strokeWidth="1.5" />
      <text x="82" y="313" {...labelStyle}>
        Ceramic core
      </text>

      <path d="M410 220 L410 128" stroke="#334155" strokeWidth="1.5" />
      <text x="356" y="121" {...labelStyle}>
        Resistive layer
      </text>

      <path d="M232 220 L158 238" stroke="#334155" strokeWidth="1.5" />
      <text x="92" y="244" {...labelStyle}>
        End cap
      </text>

      <path d="M122 220 L122 164" stroke="#334155" strokeWidth="1.5" />
      <text x="76" y="158" {...labelStyle}>
        Lead wire
      </text>

      <path d="M548 168 L636 104" stroke="#334155" strokeWidth="1.5" />
      <text x="642" y="105" {...labelStyle}>
        Color bands
      </text>
    </g>
  );
}

function MainResistor({
  rotation,
  heatLevel,
  material,
  isAssembled,
}: {
  rotation: number;
  heatLevel: number;
  material: MaterialSpec;
  isAssembled: boolean;
}) {
  return (
    <motion.g
      animate={{ rotate: rotation }}
      transition={{ type: "spring", stiffness: 80, damping: 18 }}
      style={{ transformOrigin: "410px 220px" }}
    >
      <motion.ellipse
        cx="410"
        cy="220"
        rx="235"
        ry="72"
        fill="#fb923c"
        opacity={heatLevel * 0.16}
        filter="url(#softGlow)"
        animate={{ scale: [1, 1 + heatLevel * 0.045, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      />

      <rect
        x={COMPONENT.resistor.x}
        y={COMPONENT.resistor.y}
        width={COMPONENT.resistor.width}
        height={COMPONENT.resistor.height}
        rx="54"
        fill="url(#shellGradient)"
        stroke="#0f172a"
        strokeWidth="3.5"
        opacity={isAssembled ? 1 : 0.34}
      />

      <InternalHeatMap heatLevel={heatLevel} isAssembled={isAssembled} />

      <AssembledMaterialHint material={material} isAssembled={isAssembled} />

      <rect
        x="220"
        y="198"
        width="24"
        height="44"
        rx="10"
        fill="url(#capGradient)"
        stroke="#475569"
        strokeWidth="2.5"
      />
      <rect
        x="576"
        y="198"
        width="24"
        height="44"
        rx="10"
        fill="url(#capGradient)"
        stroke="#475569"
        strokeWidth="2.5"
      />

      <rect x="268" y="166" width="16" height="108" fill="#ef4444" />
      <rect x="336" y="166" width="16" height="108" fill="#111827" />
      <rect x="452" y="166" width="16" height="108" fill="#f59e0b" />
      <rect x="536" y="166" width="16" height="108" fill="#d4af37" />

      {!isAssembled ? (
        <>
          <rect
            x={NODE.cutawayInner.x}
            y={NODE.cutawayInner.y}
            width={NODE.cutawayInner.width}
            height={NODE.cutawayInner.height}
            rx="36"
            fill="#f8fafc"
            stroke="#475569"
            strokeWidth="3"
          />

          <rect
            x={NODE.materialCore.x}
            y={NODE.materialCore.y}
            width={NODE.materialCore.width}
            height={NODE.materialCore.height}
            rx="26"
            fill={material.coreColor}
            opacity="0.35"
          />

          <InternalHeatMap heatLevel={heatLevel} isAssembled={false} />

          <MaterialStructure material={material} />

          <text
            x={LABEL.internalPath.x}
            y={LABEL.internalPath.y}
            textAnchor="middle"
            fill={STYLE.text}
            fontSize="12"
            fontWeight="900"
          >
            Current-limiting path inside {material.label}
          </text>
        </>
      ) : null}
    </motion.g>
  );
}

function ExplodedView({ material }: { material: MaterialSpec }) {
  const subLabelStyle = {
    fill: STYLE.muted,
    fontSize: 10,
    fontWeight: 800,
  };

  return (
    <g>
      <text
        x="410"
        y="82"
        textAnchor="middle"
        fill={STYLE.text}
        fontSize="11"
        fontWeight="900"
      >
        Engineering exploded structure: each physical part is separated
      </text>

      <line
        x1="46"
        y1="220"
        x2="116"
        y2="220"
        stroke={STYLE.wire}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <text x="44" y="252" {...subLabelStyle}>
        Input lead
      </text>

      <rect
        x="130"
        y="184"
        width="34"
        height="72"
        rx="10"
        fill="url(#capGradient)"
        stroke="#475569"
        strokeWidth="2"
      />
      <text x="124" y="276" {...subLabelStyle}>
        End cap
      </text>

      <rect
        x="190"
        y="188"
        width="140"
        height="64"
        rx="32"
        fill="#f8fafc"
        stroke="#475569"
        strokeWidth="3"
      />
      <text x="228" y="276" {...subLabelStyle}>
        Ceramic core
      </text>

      <rect
        x="360"
        y="198"
        width="118"
        height="44"
        rx="22"
        fill={material.coreColor}
        stroke={material.shellColor}
        strokeWidth="3"
      />

      {material.key === "carbon" ? (
        Array.from({ length: 34 }).map((_, index) => (
          <circle
            key={`exploded-carbon-${index}`}
            cx={370 + ((index * 13) % 98)}
            cy={207 + ((index * 11) % 27)}
            r={2.2 + (index % 3) * 0.4}
            fill="#334155"
            opacity="0.82"
          />
        ))
      ) : material.key === "wire-wound" ? (
        Array.from({ length: 12 }).map((_, index) => (
          <ellipse
            key={`exploded-wire-${index}`}
            cx={374 + index * 8.5}
            cy="220"
            rx="5.8"
            ry="23"
            fill="none"
            stroke={material.shellColor}
            strokeWidth="2.5"
            opacity={index % 2 === 0 ? 0.95 : 0.55}
          />
        ))
      ) : (
        <path
          d="M372 220 H388 L398 204 L412 236 L426 204 L440 236 L454 204 L468 220"
          fill="none"
          stroke="#0f172a"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}

      <text x="362" y="276" {...subLabelStyle}>
        Resistive layer
      </text>

      <rect
        x="504"
        y="184"
        width="108"
        height="72"
        rx="36"
        fill="url(#shellGradient)"
        stroke="#0f172a"
        strokeWidth="2.5"
        opacity="0.72"
      />
      <text x="502" y="276" {...subLabelStyle}>
        Protective coating
      </text>

      <rect
        x="642"
        y="178"
        width="88"
        height="84"
        rx="42"
        fill="#f9e7bc"
        stroke="#0f172a"
        strokeWidth="2.5"
        opacity="0.9"
      />
      <rect x="660" y="178" width="8" height="84" fill="#ef4444" />
      <rect x="680" y="178" width="8" height="84" fill="#111827" />
      <rect x="702" y="178" width="8" height="84" fill="#f59e0b" />
      <text x="656" y="276" {...subLabelStyle}>
        Color bands
      </text>

      <line
        x1="746"
        y1="220"
        x2="790"
        y2="220"
        stroke={STYLE.wire}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <text x="728" y="252" {...subLabelStyle}>
        Output lead
      </text>
    </g>
  );
}

export function StructureCanvas({
  mode,
  material,
  voltage,
  baseResistance,
  temperature,
  rotation,
}: {
  mode: StructureMode;
  material: MaterialSpec;
  voltage: number;
  baseResistance: number;
  temperature: number;
  rotation: number;
}) {
  const thermalFactor = 1 + (temperature - 25) * 0.004;
  const resistance = baseResistance * material.resistanceFactor * thermalFactor;
  const current = voltage / Math.max(resistance, 1);
  const power = current * voltage;

  const heatLevel = clamp(
    power * material.heatFactor * 0.14 + temperature / 180,
    0.08,
    1,
  );

  const currentLevel = clamp(current / 0.08, 0.08, 1);
  const collisionLevel = clamp(resistance / 5000, 0.08, 1);
  const powerLevel = clamp(power / 1.2, 0.04, 1);

  const isAssembled = mode === "assembled";
  const isCutaway = mode === "cutaway";
  const isExploded = mode === "exploded";

  const riskLabel =
    heatLevel > 0.85
      ? "FAILURE RISK"
      : heatLevel > 0.68
        ? "HOT"
        : heatLevel > 0.42
          ? "WARM"
          : "SAFE";

  const riskClass =
    heatLevel > 0.85
      ? "bg-red-100 text-red-700"
      : heatLevel > 0.68
        ? "bg-orange-100 text-orange-700"
        : heatLevel > 0.42
          ? "bg-yellow-100 text-yellow-700"
          : "bg-green-100 text-green-700";

  const shellHotColor =
    heatLevel > 0.82 ? "#ef4444" : heatLevel > 0.58 ? "#fb923c" : "#e9c77f";

  const particleCount = Math.round(12 + currentLevel * 24);
  const congestionCount = Math.round(12 + collisionLevel * 18);
  const collisionCount = Math.round(8 + collisionLevel * 18);
  const particleDuration = clamp(2.9 - currentLevel * 1.45, 0.95, 2.9);
  const internalDuration = particleDuration + collisionLevel * 1.6;

  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            Resistor Internal Structure Visualizer
          </h2>
          <p className="text-xs text-slate-600">
            Study lead wires, end caps, ceramic core, resistive material, color
            bands, current flow, collisions, and heat generation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
            Construction: {material.label}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${riskClass}`}
          >
            {riskLabel} · {mode.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox={VIEW_BOX} className="h-auto w-[820px] sm:w-full">
          <defs>
            <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="12" />
            </filter>

            <linearGradient id="shellGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f9e7bc" />
              <stop offset="52%" stopColor={shellHotColor} />
              <stop
                offset="100%"
                stopColor={heatLevel > 0.82 ? "#dc2626" : "#c98e47"}
              />
            </linearGradient>

            <linearGradient id="leadGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#475569" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>

            <linearGradient id="capGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="55%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            <radialGradient id="internalHotspot" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.95" />
              <stop offset="42%" stopColor="#fb923c" stopOpacity="0.72" />
              <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
            </radialGradient>
          </defs>

          <g transform={canvasTransform}>
            <text
              x={LABEL.title.x}
              y={LABEL.title.y}
              textAnchor="middle"
              fill="#334155"
              fontSize="14"
              fontWeight="900"
            >
              R = ρL / A · Longer path increases resistance · P = VI = I²R ·
              Heat rises with power
            </text>

            <text
              x={LABEL.summary.x}
              y={LABEL.summary.y}
              textAnchor="middle"
              fill="#64748b"
              fontSize="11"
              fontWeight="700"
            >
              Resistance: {formatResistance(resistance)} · Current:{" "}
              {formatCurrent(current)} · Power: {power.toFixed(3)} W ·
              Temperature: {temperature}°C
            </text>

            {!isExploded ? (
              <>
                <WirePath points={WIRE.inputLead} />
                <WirePath points={WIRE.outputLead} />

                <CurrentArrows />
                <ElectronFlow
                  particleCount={particleCount}
                  internalDuration={internalDuration}
                />
                <CongestionDots
                  congestionCount={congestionCount}
                  collisionLevel={collisionLevel}
                />

                <MainResistor
                  rotation={rotation}
                  heatLevel={heatLevel}
                  material={material}
                  isAssembled={isAssembled}
                />

                <CutawayLabels visible={isCutaway} />

                {Array.from({ length: collisionCount }).map((_, index) => {
                  const x = 292 + ((index * 29) % 238);
                  const y = 196 + ((index * 23) % 50);

                  return (
                    <motion.g
                      key={`collision-${index}`}
                      animate={{
                        opacity: [0.08, 0.95, 0.08],
                        scale: [0.6, 1.15, 0.6],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.9 + (index % 5) * 0.18,
                        delay: index * 0.06,
                      }}
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r={4 + heatLevel * 4}
                        fill="#fb923c"
                        opacity="0.42"
                      />
                      <line
                        x1={x - 6}
                        y1={y - 6}
                        x2={x + 6}
                        y2={y + 6}
                        stroke="#ea580c"
                        strokeWidth="1.6"
                      />
                      <line
                        x1={x + 6}
                        y1={y - 6}
                        x2={x - 6}
                        y2={y + 6}
                        stroke="#ea580c"
                        strokeWidth="1.6"
                      />
                    </motion.g>
                  );
                })}

                <HeatWaves heatLevel={heatLevel} />

                <text
                  x={LABEL.inputLead.x}
                  y={LABEL.inputLead.y}
                  textAnchor="middle"
                  fill="#2563eb"
                  fontSize="11"
                  fontWeight="900"
                >
                  Input lead
                </text>

                <text
                  x={LABEL.outputLead.x}
                  y={LABEL.outputLead.y}
                  textAnchor="middle"
                  fill="#16a34a"
                  fontSize="11"
                  fontWeight="900"
                >
                  Output lead
                </text>
              </>
            ) : (
              <ExplodedView material={material} />
            )}

            <text
              x={LABEL.explanation.x}
              y={LABEL.explanation.y}
              textAnchor="middle"
              fill={STYLE.text}
              fontSize="12"
              fontWeight="900"
            >
              Current slows through the resistive element, creates collisions,
              and converts electrical energy into heat.
            </text>

            <DiagnosticBar
              x={58}
              y={382}
              label="Current Density"
              value={currentLevel}
              fill={STYLE.electron}
            />

            <DiagnosticBar
              x={244}
              y={382}
              label="Collision / Resistance"
              value={collisionLevel}
              fill="#f59e0b"
            />

            <DiagnosticBar
              x={440}
              y={382}
              label="Thermal Stress"
              value={heatLevel}
              fill={heatLevel > 0.82 ? "#dc2626" : "#ef4444"}
            />

            <DiagnosticBar
              x={626}
              y={382}
              label="Power Dissipation"
              value={powerLevel}
              fill="#a855f7"
            />

            <g
              transform={`translate(${COMPONENT.manufacturingPanel.x} ${COMPONENT.manufacturingPanel.y})`}
            >
              <rect
                width={COMPONENT.manufacturingPanel.width}
                height={COMPONENT.manufacturingPanel.height}
                rx="18"
                fill="#f8fafc"
                stroke="#e2e8f0"
              />

              <text
                x="18"
                y="22"
                fill={STYLE.text}
                fontSize="11"
                fontWeight="900"
              >
                Manufacturing flow:
              </text>

              <text
                x="152"
                y="22"
                fill={STYLE.muted}
                fontSize="11"
                fontWeight="800"
              >
                Ceramic core → Resistive material applied → Spiral/calibration
                path → Protective coating → Color bands
              </text>

              <text x="18" y="39" fill="#64748b" fontSize="10" fontWeight="700">
                This is how the internal structure creates a controlled
                resistance value.
              </text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
