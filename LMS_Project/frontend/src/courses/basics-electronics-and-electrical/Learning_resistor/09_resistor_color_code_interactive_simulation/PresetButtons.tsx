"use client";

export function PresetButtons({
  onPresetApply,
}: {
  onPresetApply: (preset: string) => void;
}) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-2">
      <button
        onClick={() => onPresetApply("220")}
        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700"
      >
        220 ohm
      </button>
      <button
        onClick={() => onPresetApply("1k")}
        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700"
      >
        1k ohm
      </button>
      <button
        onClick={() => onPresetApply("10k")}
        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700"
      >
        10k ohm
      </button>
      <button
        onClick={() => onPresetApply("precision")}
        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700"
      >
        1k ohm 1%
      </button>
    </div>
  );
}
