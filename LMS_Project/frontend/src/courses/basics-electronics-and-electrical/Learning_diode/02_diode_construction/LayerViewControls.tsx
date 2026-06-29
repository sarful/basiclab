"use client";

import type { LayerView } from "./types";

export function LayerViewControls({
  view,
  onViewChange,
}: {
  view: LayerView;
  onViewChange: (view: LayerView) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => onViewChange("basic")}
        className={`rounded px-5 py-2 font-semibold ${view === "basic" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900"}`}
      >
        Basic Structure
      </button>
      <button
        type="button"
        onClick={() => onViewChange("doping")}
        className={`rounded px-5 py-2 font-semibold ${view === "doping" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-900"}`}
      >
        Show Doping
      </button>
      <button
        type="button"
        onClick={() => onViewChange("junction")}
        className={`rounded px-5 py-2 font-semibold ${view === "junction" ? "bg-amber-500 text-white" : "bg-amber-100 text-amber-900"}`}
      >
        Show PN Junction
      </button>
      <button
        type="button"
        onClick={() => onViewChange("formation")}
        className={`rounded px-5 py-2 font-semibold ${view === "formation" ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-900"}`}
      >
        Formation Animation
      </button>
    </div>
  );
}
