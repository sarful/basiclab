import { SlidersHorizontal } from "lucide-react";

type ControlPanelSectionProps = {
  dcLevel: number;
  acPeak: number;
  frequency: number;
  onDcLevelChange: (value: number) => void;
  onAcPeakChange: (value: number) => void;
  onFrequencyChange: (value: number) => void;
};

export function ControlPanelSection({
  dcLevel,
  acPeak,
  frequency,
  onDcLevelChange,
  onAcPeakChange,
  onFrequencyChange,
}: ControlPanelSectionProps) {
  return (
    <section className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur md:p-5">
      <div className="flex items-start gap-3 border-b border-slate-200 pb-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2">
          <SlidersHorizontal className="h-5 w-5 text-cyan-700" />
        </div>
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Controls
          </div>
          <h2 className="mt-3 text-[1.75rem] font-semibold leading-tight text-slate-950">
            Try the signal values
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Compare a steady DC signal with an AC signal that changes direction
            over time.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            DC Level: {dcLevel.toFixed(1)} A
          </label>
          <input
            type="range"
            min="1"
            max="12"
            step="0.1"
            value={dcLevel}
            onChange={(e) => onDcLevelChange(Number(e.target.value))}
            className="w-full accent-green-600"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            AC Peak: {acPeak.toFixed(1)} A
          </label>
          <input
            type="range"
            min="1"
            max="12"
            step="0.1"
            value={acPeak}
            onChange={(e) => onAcPeakChange(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            AC Frequency: {frequency.toFixed(1)} Hz
          </label>
          <input
            type="range"
            min="0.5"
            max="6"
            step="0.1"
            value={frequency}
            onChange={(e) => onFrequencyChange(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
      </div>
    </section>
  );
}
