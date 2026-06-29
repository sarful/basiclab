import type { PolarityMode } from "./types";

type PolaritySelectorProps = {
  polarity: PolarityMode;
  setPolarity: (value: PolarityMode) => void;
};

export function PolaritySelector({
  polarity,
  setPolarity,
}: PolaritySelectorProps) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-2 ring-1 ring-slate-100">
      <button
        onClick={() => setPolarity("correct")}
        className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
          polarity === "correct" ? "bg-green-600 text-white shadow-sm" : "bg-white text-slate-700"
        }`}
      >
        Correct Polarity
      </button>
      <button
        onClick={() => setPolarity("reverse")}
        className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
          polarity === "reverse" ? "bg-red-600 text-white shadow-sm" : "bg-white text-slate-700"
        }`}
      >
        Reverse Polarity
      </button>
    </div>
  );
}
