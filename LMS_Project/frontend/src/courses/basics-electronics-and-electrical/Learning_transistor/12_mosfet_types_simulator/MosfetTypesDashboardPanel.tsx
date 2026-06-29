"use client";

type MosfetType =
  | "N-Channel Enhancement"
  | "P-Channel Enhancement"
  | "N-Channel Depletion"
  | "P-Channel Depletion";

type FlowMode = "Carrier" | "Conventional" | "Both";
type LoadType = "Resistor" | "LED" | "DC Motor" | "Lamp";
type EduMode = "Beginner" | "Advanced" | "Expert";

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

function getCarrier(type: MosfetType) {
  return getPolarity(type) === "N" ? "Electrons" : "Holes";
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

function getRegion(type: MosfetType, vgs: number, vds: number, strength: number) {
  const mode = getMode(type);
  if (strength <= 0.03) return mode === "Enhancement" ? "OFF" : "CUTOFF";
  if (mode === "Enhancement") {
    if (strength < 0.22) return "THRESHOLD";
    return vds > 5 ? "SATURATION" : "LINEAR";
  }
  if (strength < 0.35) return "WEAK CHANNEL";
  if (strength > 1) return vds > 5 ? "SATURATION" : "ENHANCED CONDUCTION";
  return "NORMALLY ON / DEPLETION";
}

function getDrainCurrent(type: MosfetType, vgs: number, vds: number, load: LoadType) {
  const strength = getChannelStrength(type, vgs);
  const loadFactor = load === "LED" ? 0.75 : load === "DC Motor" ? 1.2 : load === "Lamp" ? 1.05 : 1;
  return clamp(LOGIC.idMax * strength * (vds / LOGIC.drainMax) * loadFactor, 0, LOGIC.idMax);
}

function getStateColor(region: string) {
  if (region === "OFF" || region === "CUTOFF") return "#64748b";
  if (region.includes("THRESHOLD") || region.includes("WEAK")) return "#f59e0b";
  if (region.includes("SATURATION")) return "#ef4444";
  if (region.includes("ENHANCED")) return "#2563eb";
  return "#16a34a";
}

function DashboardCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{title}</p>
      </div>
      <p className="mt-3 text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}

type MosfetTypesDashboardPanelProps = {
  typeA: MosfetType;
  typeB: MosfetType;
  vgs: number;
  vds: number;
  loadType: LoadType;
  flowMode: FlowMode;
  eduMode: EduMode;
};

export default function MosfetTypesDashboardPanel({
  typeA,
  typeB,
  vgs,
  vds,
  loadType,
  flowMode,
  eduMode,
}: MosfetTypesDashboardPanelProps) {
  const data = [typeA, typeB].map((type) => {
    const id = getDrainCurrent(type, vgs, vds, loadType);
    const region = getRegion(type, vgs, vds, getChannelStrength(type, vgs));
    return { type, id, region, power: id * vds };
  });

  return (
    <section className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:rounded-[28px] sm:p-5">
      <div className="rounded-2xl bg-slate-900 px-4 py-4 text-white sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-300">
              SCADA Industrial Dashboard
            </p>
            <h2 className="mt-2 text-xl font-black sm:text-2xl">Dual MOSFET Status</h2>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.08em]">
            <span className="rounded-full bg-white/10 px-3 py-1.5">ONLINE</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">{loadType}</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">{eduMode}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {data.map((item, index) => {
          const cards = [
            ["Type", item.type, getStateColor(item.region)],
            ["Region", item.region, getStateColor(item.region)],
            ["VGS", `${vgs.toFixed(1)}V`, "#2563eb"],
            ["VDS", `${vds.toFixed(1)}V`, "#2563eb"],
            ["Current", `${(item.id * 1000).toFixed(1)}mA`, "#16a34a"],
            ["Power", `${item.power.toFixed(2)}W`, item.power > 0.8 ? "#ef4444" : "#f59e0b"],
            ["Carrier", getCarrier(item.type), "#111827"],
            ["Flow", flowMode, "#2563eb"],
          ] as const;

          return (
            <div key={item.type + index} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-lg font-black text-slate-900">MOSFET {index === 0 ? "A" : "B"}</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {cards.map(([title, value, color]) => (
                  <DashboardCard key={title} title={title} value={value} color={color} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
