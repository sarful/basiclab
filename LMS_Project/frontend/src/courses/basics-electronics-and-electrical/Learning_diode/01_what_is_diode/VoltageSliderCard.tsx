"use client";

export function VoltageSliderCard({
  voltage,
  onVoltageChange,
}: {
  voltage: number;
  onVoltageChange: (voltage: number) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <label htmlFor="voltage" className="font-bold">
          Voltage Slider
        </label>
        <span className="rounded bg-white px-3 py-1 font-mono font-bold text-slate-800 shadow-sm">
          {voltage.toFixed(1)}V
        </span>
      </div>
      <input
        id="voltage"
        type="range"
        min="0"
        max="12"
        step="0.1"
        value={voltage}
        onChange={(event) => onVoltageChange(Number(event.target.value))}
        className="w-full accent-blue-600"
      />
      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>0V</span>
        <span>0.7V threshold</span>
        <span>12V</span>
      </div>
    </div>
  );
}
