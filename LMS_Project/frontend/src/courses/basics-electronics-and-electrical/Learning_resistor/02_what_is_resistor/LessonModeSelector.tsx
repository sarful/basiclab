"use client";

import type { ResistorLessonMode } from "./types";

const modes: { id: ResistorLessonMode; label: string }[] = [
  { id: "basic", label: "Basic resistor concept" },
  { id: "led", label: "Resistor protects LED" },
];

export function LessonModeSelector({
  mode,
  onModeChange,
}: {
  mode: ResistorLessonMode;
  onModeChange: (value: ResistorLessonMode) => void;
}) {
  return (
    <div className="mb-5">
      <p className="mb-2 text-sm font-semibold text-slate-900">Lesson Mode</p>
      <div className="grid gap-2">
        {modes.map((item) => {
          const active = item.id === mode;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onModeChange(item.id)}
              className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                active
                  ? "border-green-400 bg-green-50 text-green-800"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
