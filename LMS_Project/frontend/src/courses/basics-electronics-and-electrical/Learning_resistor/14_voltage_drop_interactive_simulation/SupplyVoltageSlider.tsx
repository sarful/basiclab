"use client";

export function SupplyVoltageSlider({
  supplyVoltage,
  onSetSupplyVoltage,
}: {
  supplyVoltage: number;
  onSetSupplyVoltage: (value: number) => void;
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">
        Supply Voltage: {supplyVoltage}V
      </label>
      <input
        type="range"
        min="1"
        max="30"
        step="1"
        value={supplyVoltage}
        onChange={(event) => onSetSupplyVoltage(Number(event.target.value))}
        className="w-full accent-blue-500"
      />
    </div>
  );
}
