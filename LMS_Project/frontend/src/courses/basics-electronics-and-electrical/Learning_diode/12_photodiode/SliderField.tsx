"use client";

export function SliderField({
  id,
  label,
  value,
  suffix,
  min,
  max,
  step,
  onChange,
  left,
  middle,
  right,
}: {
  id: string;
  label: string;
  value: number;
  suffix: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  left: string;
  middle: string;
  right: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <div className="mb-3 flex items-start justify-between gap-3">
        <label htmlFor={id} className="pr-2 text-sm font-black leading-5 text-slate-900">{label}</label>
        <input
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          type="number"
          min={min}
          max={max}
          step={step}
          className="w-24 rounded-xl bg-white px-3 py-2 text-right text-sm font-mono font-black shadow-sm ring-1 ring-slate-200"
          aria-label={`${label} numeric value`}
        />
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-green-600"
      />
      <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] font-semibold leading-4 text-slate-500">
        <span className="text-left">{left}</span>
        <span className="text-center">{middle}</span>
        <span className="text-right">{right}</span>
      </div>
      <p className="mt-3 text-[11px] font-bold leading-4 text-slate-500">
        Current: {value.toLocaleString()} {suffix}
      </p>
    </div>
  );
}
