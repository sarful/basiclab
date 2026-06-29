"use client";

export function VoltageSlider({
  voltage,
  onVoltageChange,
}: {
  voltage: number;
  onVoltageChange: (value: number) => void;
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">Supply Voltage: {voltage}V</label>
      <input
        type="range"
        min="1"
        max="30"
        step="1"
        value={voltage}
        onChange={(event) => onVoltageChange(Number(event.target.value))}
        className="w-full accent-orange-500"
      />
    </div>
  );
}
