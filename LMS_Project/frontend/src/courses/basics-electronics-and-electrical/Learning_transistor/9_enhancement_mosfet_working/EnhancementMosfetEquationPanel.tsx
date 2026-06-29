"use client";

import { getVdsSat } from "./enhancementMosfetLogic";

type EnhancementMosfetEquationPanelProps = {
  visible: boolean;
  gateVoltage: number;
  thresholdVoltage: number;
  drainCurrent: number;
};

export default function EnhancementMosfetEquationPanel({
  visible,
  gateVoltage,
  thresholdVoltage,
  drainCurrent,
}: EnhancementMosfetEquationPanelProps) {
  if (!visible) return null;

  const vov = getVdsSat(gateVoltage, thresholdVoltage);
  const items = [
    `VOV = VGS - VTH = ${vov.toFixed(1)}V`,
    `VDS(sat) = VGS - VTH = ${vov.toFixed(1)}V`,
    "ID(linear) approx k[(VOV x VDS) - VDS^2/2]",
    "ID(sat) approx k(VOV^2/2)",
    `Live ID = ${(drainCurrent * 1000).toFixed(1)}mA`,
  ];

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-green-700">
        Equation Panel
      </p>
      <h3 className="mt-2 text-lg font-black text-slate-900">Enhancement MOSFET Formula View</h3>
      <div className="mt-4 space-y-2 text-sm font-medium text-slate-700">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </section>
  );
}
