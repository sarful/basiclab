"use client";

import type { ResistorLessonMode } from "./types";

type SafetyState = "SAFE" | "WARM" | "HOT" | "OVERLOAD";

function getSafetyState(statusMessage: string): SafetyState {
  const text = statusMessage.toLowerCase();

  if (text.includes("exceeded") || text.includes("overload")) return "OVERLOAD";
  if (text.includes("hot") || text.includes("limit")) return "HOT";
  if (text.includes("warm")) return "WARM";

  return "SAFE";
}

function getSafetyStyle(state: SafetyState) {
  if (state === "OVERLOAD") {
    return {
      badge: "bg-red-100 text-red-700 ring-red-200",
      panel: "border-red-200 bg-red-50 text-red-800",
    };
  }

  if (state === "HOT") {
    return {
      badge: "bg-orange-100 text-orange-700 ring-orange-200",
      panel: "border-orange-200 bg-orange-50 text-orange-800",
    };
  }

  if (state === "WARM") {
    return {
      badge: "bg-amber-100 text-amber-700 ring-amber-200",
      panel: "border-amber-200 bg-amber-50 text-amber-800",
    };
  }

  return {
    badge: "bg-green-100 text-green-700 ring-green-200",
    panel: "border-green-200 bg-green-50 text-green-800",
  };
}

export function RecommendationCard({
  statusMessage,
  recommendedLabel,
}: {
  mode: ResistorLessonMode;
  statusMessage: string;
  recommendedLabel: string;
  voltageDrop: number;
  ledVoltageDrop: number;
  selectedLedLabel: string;
  current?: number;
  power?: number;
  rating?: number;
  resistance?: number;
}) {
  const safetyState = getSafetyState(statusMessage);
  const safety = getSafetyStyle(safetyState);
  const showRecommendation =
    safetyState === "HOT" || safetyState === "OVERLOAD";

  return (
    <section
      className="rounded-3xl border border-slate-200 bg-white p-4 text-sm shadow-lg"
      aria-label="Resistor status panel"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-black text-slate-950">
            Resistor Status
          </h3>
          <p className="mt-1 leading-relaxed text-slate-600">{statusMessage}</p>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ring-1 ${safety.badge}`}
        >
          {safetyState}
        </span>
      </div>

      {showRecommendation ? (
        <div className={`mt-4 rounded-2xl border p-3 ${safety.panel}`}>
          <p className="font-bold">Recommended Package</p>
          <p className="mt-1 text-xs leading-relaxed">
            Use <b>{recommendedLabel}</b> or higher to safely handle heat.
          </p>
        </div>
      ) : null}
    </section>
  );
}
