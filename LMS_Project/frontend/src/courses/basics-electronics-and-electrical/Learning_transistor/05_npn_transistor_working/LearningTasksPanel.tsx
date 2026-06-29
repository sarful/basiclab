"use client";

import type { NpnWorkingState } from "./simulationTypes";

export default function LearningTasksPanel({ state }: { state: NpnWorkingState }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
            Learning Tasks
          </p>
          <h3 className="mt-2 text-xl font-black text-slate-900">
            Auto-Check Feedback
          </h3>
        </div>
        <div className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
          {state.learningTasks.filter((task) => task.passed).length}/{state.learningTasks.length} Passed
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {state.learningTasks.map((task) => (
          <div
            key={task.id}
            className={`rounded-2xl border p-4 ${
              task.passed
                ? "border-emerald-200 bg-emerald-50"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-slate-900">
                  {task.title}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {task.target}
                </p>
              </div>
              <div
                className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${
                  task.passed
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {task.passed ? "PASS" : "WAIT"}
              </div>
            </div>
            <p className="mt-3 text-xs font-semibold leading-relaxed text-slate-600">
              {task.feedback}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
