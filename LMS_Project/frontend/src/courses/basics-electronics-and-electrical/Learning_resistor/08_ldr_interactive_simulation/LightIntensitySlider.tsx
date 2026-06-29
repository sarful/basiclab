"use client";

export function LightIntensitySlider({
  lightPercent,
  onLightPercentChange,
}: {
  lightPercent: number;
  onLightPercentChange: (value: number) => void;
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-slate-700">
        Light Intensity: {lightPercent}%
      </label>
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={lightPercent}
        onChange={(event) => onLightPercentChange(Number(event.target.value))}
        className="w-full accent-yellow-500"
      />
    </div>
  );
}
