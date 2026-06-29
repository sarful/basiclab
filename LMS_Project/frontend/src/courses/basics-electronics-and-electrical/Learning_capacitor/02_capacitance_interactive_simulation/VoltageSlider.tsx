"use client";

export function VoltageSlider({
  voltage,
  setVoltage,
}: {
  voltage: number;
  setVoltage: (value: number) => void;
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">Voltage: {voltage}V</label>
      <input
        type="range"
        min="1"
        max="30"
        step="1"
        value={voltage}
        onChange={(event) => setVoltage(Number(event.target.value))}
        className="w-full accent-purple-500"
      />
      <p className="mt-1 text-xs text-slate-500">
        Raising voltage increases stored charge because Q = C x V.
      </p>
    </div>
  );
}
