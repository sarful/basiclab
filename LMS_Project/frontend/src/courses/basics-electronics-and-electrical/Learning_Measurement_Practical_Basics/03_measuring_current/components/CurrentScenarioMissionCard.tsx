"use client";

import type { MeasuringCurrentScenario } from "../measuringCurrentScenarios";

type ScenarioStyle = {
  badge: string;
  card: string;
  label: string;
};

export default function CurrentScenarioMissionCard({
  expectedJackLabel,
  onApplyRecommendedSetup,
  onSelectScenario,
  scenario,
  scenarioCount,
  scenarioIndex,
  scenarioStyles,
  scenarios,
}: {
  expectedJackLabel: string;
  onApplyRecommendedSetup: () => void;
  onSelectScenario: (scenarioId: MeasuringCurrentScenario["id"]) => void;
  scenario: MeasuringCurrentScenario;
  scenarioCount: number;
  scenarioIndex: number;
  scenarioStyles: ScenarioStyle;
  scenarios: MeasuringCurrentScenario[];
}) {
  return (
    <div className={`rounded-[24px] border p-5 ${scenarioStyles.card}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div
            className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${scenarioStyles.badge}`}
          >
            {scenarioStyles.label}
          </div>
          <h3 className="mt-3 text-[1.35rem] font-black tracking-tight text-slate-950">
            {scenario.title}
          </h3>
          <p className="mt-2 max-w-2xl text-[15px] leading-7 text-slate-700">
            {scenario.teachingGoal}
          </p>
        </div>

        <div className="grid min-w-[220px] grid-cols-3 gap-2">
          <div className="rounded-2xl border border-white/80 bg-white/85 px-3 py-3">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
              Step
            </p>
            <p className="mt-1 text-[1.2rem] font-black tracking-tight text-slate-950">
              {scenarioIndex + 1}/{scenarioCount}
            </p>
          </div>
          <div className="rounded-2xl border border-white/80 bg-white/85 px-3 py-3">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
              Jack
            </p>
            <p className="mt-1 text-[1.2rem] font-black tracking-tight text-slate-950">
              {expectedJackLabel}
            </p>
          </div>
          <div className="rounded-2xl border border-white/80 bg-white/85 px-3 py-3">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
              Reading
            </p>
            <p className="mt-1 text-[1.2rem] font-black tracking-tight text-slate-950">
              {scenario.expectedDisplayValue}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {scenarios.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectScenario(item.id)}
            className={`rounded-full border px-3 py-2 text-[12px] font-bold transition ${
              scenario.id === item.id
                ? "border-orange-300 bg-orange-50 text-orange-900"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Source Type
          </p>
          <p className="mt-2 text-[14px] font-bold capitalize text-slate-900">
            {scenario.sourceType.replaceAll("_", " ")}
          </p>
        </div>
        <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Expected Family
          </p>
          <p className="mt-2 text-[14px] font-bold text-slate-900">DCA</p>
        </div>
        <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Preferred Range
          </p>
          <p className="mt-2 text-[14px] font-bold text-slate-900">
            {scenario.preferredDialStopIds.join(", ")}
          </p>
        </div>
        <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Required Jacks
          </p>
          <p className="mt-2 text-[14px] font-bold text-slate-900">
            COM + {expectedJackLabel}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-white/80 bg-white/85 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Safety Hint
          </p>
          <p className="mt-2 text-[14px] leading-6 text-slate-700">
            {scenario.safetyHint}
          </p>
        </div>
        <div className="rounded-2xl border border-white/80 bg-white/85 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Current Path Hint
          </p>
          <p className="mt-2 text-[14px] leading-6 text-slate-700">
            {scenario.currentPathHint}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onApplyRecommendedSetup}
          className="rounded-xl border border-orange-300 bg-orange-500 px-4 py-2 text-[13px] font-semibold tracking-tight text-white hover:bg-orange-600"
        >
          Apply Recommended Setup
        </button>
      </div>
    </div>
  );
}
