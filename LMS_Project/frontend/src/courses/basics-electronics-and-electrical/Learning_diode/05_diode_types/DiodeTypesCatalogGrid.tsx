"use client";

import type { DiodeType } from "./types";

type Props = {
  diodes: DiodeType[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function DiodeTypesCatalogGrid({ diodes, selectedId, onSelect }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {diodes.map((diode) => (
        <button
          key={diode.id}
          type="button"
          onClick={() => onSelect(diode.id)}
          className={`rounded-[22px] border p-4 text-left transition hover:-translate-y-1 hover:shadow-md ${
            selectedId === diode.id
              ? "border-blue-500 bg-blue-50 shadow-sm"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sm font-black text-slate-800">
              {diode.icon}
            </span>
            <div className="min-w-0">
              <h3 className="text-lg font-black text-slate-950">{diode.name}</h3>
              <p className="mt-1 text-sm font-semibold text-slate-600">{diode.id.replace(/-/g, " ")}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
