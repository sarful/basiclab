"use client";

export function FilterControl({
  filterEnabled,
  setFilterEnabled,
}: {
  filterEnabled: boolean;
  setFilterEnabled: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => setFilterEnabled(!filterEnabled)}
      className={`rounded-2xl p-4 text-left shadow-sm ring-1 transition ${
        filterEnabled
          ? "bg-emerald-600 text-white ring-emerald-600"
          : "bg-white text-slate-900 ring-slate-200 hover:bg-emerald-50"
      }`}
    >
      <p className="font-black">Filter Circuit</p>
      <p className="mt-1 text-xs font-bold opacity-80">
        {filterEnabled ? "Capacitor smoothing ON" : "Capacitor smoothing OFF"}
      </p>
    </button>
  );
}
