import { formatNumber } from "./logic";
import type { TransistorType } from "./types";

type TransistorMetricsProps = {
  transistorType: TransistorType;
  transistorGain: number;
  active: boolean;
  isBiased: boolean;
  collectorCurrent: number;
};

export default function TransistorMetrics({
  transistorType,
  transistorGain,
  active,
  isBiased,
  collectorCurrent,
}: TransistorMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Type</p>
        <p className="mt-3 text-3xl font-black text-green-700">
          {transistorType}
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Gain</p>
        <p className="mt-3 text-3xl font-black text-blue-700">
          Beta {formatNumber(transistorGain, 0)}
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Carrier Flow
        </p>
        <p className="mt-3 text-3xl font-black text-cyan-700">
          {active && isBiased ? "ON" : active ? "LOW" : "OFF"}
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Collector Current
        </p>
        <p className="mt-3 text-3xl font-black text-orange-600">
          {formatNumber(collectorCurrent * 1000, 1)}mA
        </p>
      </div>
    </div>
  );
}
