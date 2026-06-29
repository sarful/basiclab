type PolarityModeSelectorProps = {
  reverse: boolean;
  setReverse: (value: boolean) => void;
};

export function PolarityModeSelector({
  reverse,
  setReverse,
}: PolarityModeSelectorProps) {
  return (
    <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <p className="mb-2 text-sm font-semibold text-slate-800">Polarized Connection</p>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setReverse(false)}
          className={`rounded-xl px-3 py-2 text-sm font-bold ${
            !reverse ? "bg-green-600 text-white" : "bg-white text-slate-700"
          }`}
        >
          Correct
        </button>
        <button
          onClick={() => setReverse(true)}
          className={`rounded-xl px-3 py-2 text-sm font-bold ${
            reverse ? "bg-red-600 text-white" : "bg-white text-slate-700"
          }`}
        >
          Reverse
        </button>
      </div>
    </div>
  );
}
