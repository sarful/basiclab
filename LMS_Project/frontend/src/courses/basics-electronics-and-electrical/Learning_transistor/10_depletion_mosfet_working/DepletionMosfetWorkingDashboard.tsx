"use client";

type RegionState =
  | "NORMALLY ON"
  | "DEPLETION"
  | "WEAK CHANNEL"
  | "CUTOFF"
  | "ENHANCEMENT"
  | "SATURATION";

type FlowMode = "Electron" | "Conventional" | "Both";
type LearningMode = "Beginner" | "Advanced";

function getStateColor(state: RegionState) {
  if (state === "CUTOFF") return "#999999";
  if (state === "WEAK CHANNEL") return "#65b96f";
  if (state === "DEPLETION") return "#f59e0b";
  if (state === "NORMALLY ON") return "#0f7a25";
  if (state === "ENHANCEMENT") return "#1d72e8";
  return "#ef4444";
}

function getThermalColor(junctionTemp: number) {
  if (junctionTemp < 45) return "#1d72e8";
  if (junctionTemp < 70) return "#0f7a25";
  if (junctionTemp < 95) return "#f59e0b";
  return "#ef4444";
}

function DashboardCard({
  title,
  value,
  unit,
  color,
  gaugeValue,
  gaugeMax,
}: {
  title: string;
  value: string;
  unit?: string;
  color: string;
  gaugeValue?: number;
  gaugeMax?: number;
}) {
  const percent =
    gaugeValue !== undefined && gaugeMax
      ? Math.max(0, Math.min(100, (gaugeValue / gaugeMax) * 100))
      : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{title}</p>
      </div>
      <p className="mt-3 text-xl font-black" style={{ color }}>
        {value}
        {unit ? <span className="ml-1 text-xs font-bold uppercase text-slate-500">{unit}</span> : null}
      </p>
      {gaugeValue !== undefined && gaugeMax !== undefined ? (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, backgroundColor: color }} />
        </div>
      ) : null}
    </div>
  );
}

export type DepletionMosfetWorkingDashboardProps = {
  gateVoltage: number;
  cutoffVoltage: number;
  drainVoltage: number;
  drainCurrent: number;
  power: number;
  junctionTemp: number;
  regionState: RegionState;
  flowMode: FlowMode;
  learningMode: LearningMode;
};

export default function DepletionMosfetWorkingDashboard({
  gateVoltage,
  cutoffVoltage,
  drainVoltage,
  drainCurrent,
  power,
  junctionTemp,
  regionState,
  flowMode,
  learningMode,
}: DepletionMosfetWorkingDashboardProps) {
  const stateColor = getStateColor(regionState);
  const thermalColor = getThermalColor(junctionTemp);

  const cards = [
    { title: "Gate Voltage", value: gateVoltage.toFixed(1), unit: "V", color: "#1d72e8", gaugeValue: gateVoltage + 6, gaugeMax: 12 },
    { title: "VGS(off)", value: cutoffVoltage.toFixed(1), unit: "V", color: "#ef4444", gaugeValue: Math.abs(cutoffVoltage), gaugeMax: 8 },
    { title: "Drain Voltage", value: drainVoltage.toFixed(1), unit: "V", color: "#1c63d6", gaugeValue: drainVoltage, gaugeMax: 15 },
    { title: "Drain Current", value: (drainCurrent * 1000).toFixed(1), unit: "mA", color: "#0f7a25", gaugeValue: drainCurrent * 1000, gaugeMax: 250 },
    { title: "Power Dissipation", value: power.toFixed(2), unit: "W", color: power > 0.6 ? "#ef4444" : "#f59e0b", gaugeValue: power, gaugeMax: 1.5 },
    { title: "Junction Temp", value: junctionTemp.toFixed(1), unit: "C", color: thermalColor, gaugeValue: junctionTemp, gaugeMax: 150 },
    { title: "Operating Region", value: regionState, color: stateColor },
    { title: "Flow Mode", value: flowMode, color: "#1d72e8" },
    { title: "Learning Mode", value: learningMode, color: "#111111" },
    { title: "Threshold", value: "0.0", unit: "V", color: "#999999", gaugeValue: 0, gaugeMax: 6 },
  ];

  return (
    <section className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:rounded-[28px] sm:p-5">
      <div className="rounded-2xl bg-slate-900 px-4 py-4 text-white sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-300">
              Depletion MOSFET Working Dashboard
            </p>
            <h2 className="mt-2 text-xl font-black sm:text-2xl">Live MOSFET Output Status</h2>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.08em]">
            <span className="rounded-full bg-white/10 px-3 py-1.5">SCADA {regionState === "CUTOFF" ? "Idle" : "Live"}</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">{regionState}</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">{learningMode}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <DashboardCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}
