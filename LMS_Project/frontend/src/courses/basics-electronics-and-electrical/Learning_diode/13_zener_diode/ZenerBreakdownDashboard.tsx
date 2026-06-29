"use client";

import type {
  FlowMode,
  ZenerBiasMode,
  ZenerBreakdownState,
} from "./zenerBreakdownTypes";

export default function ZenerBreakdownDashboard({
  biasMode,
  flowMode,
  state,
}: {
  biasMode: ZenerBiasMode;
  flowMode: FlowMode;
  state: ZenerBreakdownState;
}) {
  const badgeClass =
    state.regulationStatus === "Reverse Breakdown" ||
    state.regulationStatus === "Forward Clamp"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-amber-50 text-amber-700";

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
            Industrial Dashboard
          </p>
          <h3 className="mt-1 text-xl font-black text-slate-950">
            Live Regulation Readings
          </h3>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.18em] ${badgeClass}`}
        >
          {state.regulationStatus}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Input Voltage", `${state.inputVoltage.toFixed(2)}V`],
          ["Output Voltage", `${state.outputVoltage.toFixed(2)}V`],
          ["Diode Voltage", `${state.zenerVoltageActual.toFixed(2)}V`],
          ["Series Current", `${state.seriesCurrentMA.toFixed(2)}mA`],
          ["Diode Current", `${state.diodeCurrentMA.toFixed(2)}mA`],
          ["Load Current", `${state.loadCurrentMA.toFixed(2)}mA`],
          ["Load Resistance", `${state.loadResistance} Ohm`],
          ["Flow Mode", flowMode === "electron" ? "Electron" : "Conventional"],
          ["Bias State", state.biasState],
          [
            "Active Region",
            biasMode === "reverse"
              ? state.reverseRegion === "breakdown"
                ? "Zener Breakdown"
                : "Reverse Leakage"
              : state.isForwardConducting
                ? "Forward Conduction"
                : "Forward Leakage",
          ],
          ["Clamp Target", `${state.clampTargetVoltage.toFixed(2)}V`],
          ["Diode Mode", biasMode === "reverse" ? "Zener Clamp" : "Forward Clamp"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-black uppercase text-slate-500">{label}</p>
            <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        In reverse bias, the zener branch stays nearly off until the output node
        reaches the selected zener voltage, then it clamps the node and sinks the
        excess current. In forward bias, the same diode behaves like a normal
        diode and clamps near 0.72V instead of the zener breakdown value.
      </p>
    </section>
  );
}
