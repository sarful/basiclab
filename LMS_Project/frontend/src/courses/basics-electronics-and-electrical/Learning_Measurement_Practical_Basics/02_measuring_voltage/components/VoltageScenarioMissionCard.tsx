"use client";

import type { MeasuringVoltageScenario } from "../measuringVoltageScenarios";

type ScenarioStyle = {
  badge: string;
  card: string;
  label: string;
};

export default function VoltageScenarioMissionCard({
  completedScenarioIds,
  completedScenarioCount,
  expectedDialFamilyLabel,
  expectedJacksLabel,
  nextBestAction,
  onApplyRecommendedSetup,
  onSelectScenario,
  scenarios,
  scenario,
  scenarioCount,
  scenarioIndex,
  scenarioStyles,
  scorePercent,
  successVisible,
}: {
  completedScenarioCount: number;
  completedScenarioIds: string[];
  expectedDialFamilyLabel: string;
  expectedJacksLabel: string;
  nextBestAction: string;
  onApplyRecommendedSetup: () => void;
  onSelectScenario: (scenarioId: MeasuringVoltageScenario["id"]) => void;
  scenarios: MeasuringVoltageScenario[];
  scenario: MeasuringVoltageScenario;
  scenarioCount: number;
  scenarioIndex: number;
  scenarioStyles: ScenarioStyle;
  scorePercent: number;
  successVisible: boolean;
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
              Done
            </p>
            <p className="mt-1 text-[1.2rem] font-black tracking-tight text-slate-950">
              {completedScenarioCount}
            </p>
          </div>
          <div className="rounded-2xl border border-white/80 bg-white/85 px-3 py-3">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
              Score
            </p>
            <p className="mt-1 text-[1.2rem] font-black tracking-tight text-slate-950">
              {scorePercent}%
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
                ? "border-sky-300 bg-sky-50 text-sky-900"
                : completedScenarioIds.includes(item.id)
                  ? "border-emerald-300 bg-emerald-50 text-emerald-900"
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
          <p className="mt-2 text-[14px] font-bold text-slate-900">
            {scenario.sourceType.replaceAll("_", " ")}
          </p>
        </div>
        <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Expected Family
          </p>
          <p className="mt-2 text-[14px] font-bold text-slate-900">
            {expectedDialFamilyLabel}
          </p>
        </div>
        <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Expected Reading
          </p>
          <p className="mt-2 text-[14px] font-bold text-slate-900">
            {scenario.expectedDisplayValue}
          </p>
        </div>
        <div className="rounded-2xl border border-white/80 bg-white/85 p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Required Jacks
          </p>
          <p className="mt-2 text-[14px] font-bold text-slate-900">
            {expectedJacksLabel}
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
            Next Best Action
          </p>
          <p className="mt-2 text-[14px] leading-6 text-slate-700">
            {nextBestAction}
          </p>
        </div>
      </div>

      {successVisible ? (
        <div className="mt-4 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 shadow-[0_10px_24px_rgba(16,185,129,0.12)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
                Success
              </p>
              <p className="mt-1 text-[15px] font-bold text-emerald-950">
                Scenario completed and score updated.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-2 text-[12px] font-black text-emerald-700">
              <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
              +1 Complete
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onApplyRecommendedSetup}
          className="rounded-xl border border-emerald-300 bg-emerald-500 px-4 py-2 text-[13px] font-semibold tracking-tight text-white hover:bg-emerald-600"
        >
          Apply Recommended Setup
        </button>
      </div>
    </div>
  );
}
