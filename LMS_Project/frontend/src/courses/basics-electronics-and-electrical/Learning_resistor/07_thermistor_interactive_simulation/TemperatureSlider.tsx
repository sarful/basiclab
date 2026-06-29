"use client";

export function TemperatureSlider({
  temperature,
  onTemperatureChange,
}: {
  temperature: number;
  onTemperatureChange: (value: number) => void;
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">Temperature: {temperature}C</label>
      <input
        type="range"
        min="0"
        max="120"
        step="1"
        value={temperature}
        onChange={(event) => onTemperatureChange(Number(event.target.value))}
        className="w-full accent-red-500"
      />
    </div>
  );
}
