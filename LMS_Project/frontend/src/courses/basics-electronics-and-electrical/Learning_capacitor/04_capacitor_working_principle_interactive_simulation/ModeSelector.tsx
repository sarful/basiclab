import type { WorkingMode } from "./types";

type ModeSelectorProps = {
  mode: WorkingMode;
  setMode: (value: WorkingMode) => void;
};

export function ModeSelector({ mode, setMode }: ModeSelectorProps) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-2 ring-1 ring-slate-100">
      <button
        onClick={() => setMode("charging")}
        className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
          mode === "charging" ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-700"
        }`}
      >
        Charging
      </button>

      <button
        onClick={() => setMode("discharging")}
        className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
          mode === "discharging"
            ? "bg-orange-500 text-white shadow-sm"
            : "bg-white text-slate-700"
        }`}
      >
        Discharging
      </button>
    </div>
  );
}
