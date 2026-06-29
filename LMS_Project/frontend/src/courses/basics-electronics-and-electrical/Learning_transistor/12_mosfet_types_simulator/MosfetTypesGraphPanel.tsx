"use client";

type MosfetType =
  | "N-Channel Enhancement"
  | "P-Channel Enhancement"
  | "N-Channel Depletion"
  | "P-Channel Depletion";

type LoadType = "Resistor" | "LED" | "DC Motor" | "Lamp";

const LOGIC = {
  threshold: 2.5,
  cutoff: -4,
  drainMax: 12,
  idMax: 0.28,
};

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function getMode(type: MosfetType) {
  return type.includes("Enhancement") ? "Enhancement" : "Depletion";
}

function getPolarity(type: MosfetType) {
  return type.startsWith("N") ? "N" : "P";
}

function getChannelStrength(type: MosfetType, vgs: number) {
  const mode = getMode(type);
  const polarity = getPolarity(type);

  if (mode === "Enhancement") {
    const overdrive = polarity === "N" ? vgs - LOGIC.threshold : -vgs - LOGIC.threshold;
    return clamp(overdrive / 4, 0, 1);
  }

  if (polarity === "N") {
    if (vgs <= LOGIC.cutoff) return 0;
    if (vgs < 0) return clamp(1 - vgs / LOGIC.cutoff, 0, 1);
    return clamp(1 + vgs / 6, 0, 1.5);
  }

  if (vgs >= Math.abs(LOGIC.cutoff)) return 0;
  if (vgs > 0) return clamp(1 - vgs / Math.abs(LOGIC.cutoff), 0, 1);
  return clamp(1 + Math.abs(vgs) / 6, 0, 1.5);
}

function getDrainCurrent(type: MosfetType, vgs: number, vds: number, load: LoadType) {
  const strength = getChannelStrength(type, vgs);
  const loadFactor = load === "LED" ? 0.75 : load === "DC Motor" ? 1.2 : load === "Lamp" ? 1.05 : 1;
  return clamp(LOGIC.idMax * strength * (vds / LOGIC.drainMax) * loadFactor, 0, LOGIC.idMax);
}

function graphPath(values: number[], x: number, y: number, w: number, h: number, max: number) {
  return values
    .map((value, index) => {
      const px = x + (index / Math.max(1, values.length - 1)) * w;
      const py = y + h - (clamp(value, 0, max) / max) * h;
      return `${index === 0 ? "M" : "L"}${px.toFixed(1)} ${py.toFixed(1)}`;
    })
    .join(" ");
}

type MosfetTypesGraphPanelProps = {
  typeA: MosfetType;
  typeB: MosfetType;
  vgs: number;
  vds: number;
  loadType: LoadType;
};

export default function MosfetTypesGraphPanel({
  typeA,
  typeB,
  vgs,
  vds,
  loadType,
}: MosfetTypesGraphPanelProps) {
  const transferA = Array.from({ length: 40 }, (_, index) => getDrainCurrent(typeA, -6 + (index / 39) * 12, vds, loadType) * 1000);
  const transferB = Array.from({ length: 40 }, (_, index) => getDrainCurrent(typeB, -6 + (index / 39) * 12, vds, loadType) * 1000);
  const opX = 16 + ((vgs + 6) / 12) * 288;
  const opY = 20 + 130 - (getDrainCurrent(typeA, vgs, vds, loadType) * 1000 / 300) * 130;

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-green-700">
        Transfer Characteristics
      </p>
      <h3 className="mt-2 text-lg font-black text-slate-900">Graph Comparison</h3>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3">
        <svg viewBox="0 0 320 170" className="h-auto w-full" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 6 }).map((_, index) => (
            <g key={index}>
              <line x1="12" y1={20 + index * 24} x2="308" y2={20 + index * 24} stroke="#e5e7eb" />
              <line x1={20 + index * 48} y1="12" x2={20 + index * 48} y2="158" stroke="#e5e7eb" />
            </g>
          ))}
          <path d={graphPath(transferA, 16, 20, 288, 130, 300)} fill="none" stroke="#2563eb" strokeWidth="3" />
          <path d={graphPath(transferB, 16, 20, 288, 130, 300)} fill="none" stroke="#ef4444" strokeWidth="3" />
          <circle cx={opX} cy={opY} r="6" fill="#f59e0b" stroke="#111111" />
        </svg>
      </div>

      <p className="mt-3 text-sm font-medium text-slate-600">ID vs VGS with a live operating point marker.</p>
    </section>
  );
}
