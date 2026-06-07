"use client";

import { diodeProfiles } from "./logic";
import type { DiodeType } from "./types";

export function DiodeSelector({
  diodeType,
  setDiodeType,
}: {
  diodeType: DiodeType;
  setDiodeType: (value: DiodeType) => void;
}) {
  return (
    <section className="grid gap-3 sm:grid-cols-3">
      {(Object.keys(diodeProfiles) as DiodeType[]).map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => setDiodeType(type)}
          className={`rounded-2xl p-4 text-left shadow-sm ring-1 transition ${
            diodeType === type
              ? "bg-blue-700 text-white ring-blue-700"
              : "bg-white text-slate-900 ring-slate-200 hover:bg-blue-50"
          }`}
        >
          <p className="font-black">{diodeProfiles[type].label}</p>
          <p className="mt-1 text-xs font-bold opacity-80">
            Vf {diodeProfiles[type].drop}V | trr {diodeProfiles[type].recoveryDeg} deg
          </p>
        </button>
      ))}
    </section>
  );
}
