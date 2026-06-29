"use client";

export function SupplyVoltageSlider({
  voltage,
  onVoltageChange,
}: {
  voltage: number;
  onVoltageChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-700">
        Supply Voltage: {voltage}V
      </label>
      <input
        type="range"
        min="1"
        max="24"
        step="1"
        value={voltage}
        onChange={(event) => onVoltageChange(Number(event.target.value))}
        className="w-full accent-blue-500"
      />
    </div>
  );
}
