"use client";

import { useMemo, useState } from "react";

import UniversalSimulationLessonShell from "../../../src/courses/basics-electronics-and-electrical/shared/UniversalSimulationLessonShell";
import LogicTheoryBanglaTab from "../../../src/courses/basics-electronics-and-electrical/Learning_voltage_regulator/1.What is voltage regulator/LogicTheoryBanglaTab";
import LogicTheoryTab from "../../../src/courses/basics-electronics-and-electrical/Learning_voltage_regulator/1.What is voltage regulator/LogicTheoryTab";
import { LM7805VoltageRegulatorSvg } from "../../../src/courses/basics-electronics-and-electrical/Learning_voltage_regulator/1.What is voltage regulator/LM7805VoltageRegulator";
import { VoltageRegulator78L05SymbolSvg } from "../../../src/courses/basics-electronics-and-electrical/Learning_voltage_regulator/1.What is voltage regulator/Pinout";
import {
  VoltageRegulatorControlPanel,
  VoltageRegulatorSwitchingPreview,
  REGULATOR_MODELS,
  toTimelineStep,
  type ControlMode,
  type RegulatorModel,
} from "../../../src/courses/basics-electronics-and-electrical/Learning_voltage_regulator/1.What is voltage regulator/VoltageRegulatorControlPanel";

export default function VoltageRegulatorLearningLessonOnePage() {
  const [controlMode, setControlMode] = useState<ControlMode>("onOff");
  const [enabled, setEnabled] = useState(false);
  const [regulatorModel, setRegulatorModel] = useState<RegulatorModel>(REGULATOR_MODELS[0]);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const timelineStep = toTimelineStep(timelineProgress);

  const activeTerminals = useMemo(() => {
    if (!enabled) return [];

    if (controlMode === "onOff") {
      return ["in", "gnd", "out"] as const;
    }

    if (timelineStep === 1) return ["in"] as const;
    if (timelineStep === 2) return ["in", "gnd"] as const;
    if (timelineStep === 3) return ["in", "gnd", "out"] as const;

    return [];
  }, [controlMode, enabled, timelineStep]);

  const pinoutActiveTerminals = useMemo(
    () =>
      activeTerminals.map((terminal) => {
        if (terminal === "in") return "input";
        if (terminal === "gnd") return "ground";
        return "output";
      }),
    [activeTerminals],
  );

  const handleControlModeChange = (mode: ControlMode) => {
    setControlMode(mode);

    if (mode === "timeline") {
      setEnabled(true);
    }
  };

  const handleToggleEnabled = () => {
    setControlMode("onOff");
    setEnabled((current) => !current);
  };

  const handleReset = () => {
    setControlMode("onOff");
    setEnabled(false);
    setTimelineProgress(0);
  };

  const handleTimelineChange = (value: number) => {
    setControlMode("timeline");
    setEnabled(true);
    setTimelineProgress(Math.min(0.999, Math.max(0, value)));
  };

  const lessonPanel = (
    <div className="grid w-full gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
        <VoltageRegulatorControlPanel
          controlMode={controlMode}
          enabled={enabled}
          regulatorModel={regulatorModel}
          timelineStep={timelineStep}
          onControlModeChange={handleControlModeChange}
          onRegulatorModelChange={setRegulatorModel}
          onReset={handleReset}
          onToggleEnabled={handleToggleEnabled}
        />
      </aside>

      <div className="min-w-0 rounded-[28px] border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
        <VoltageRegulatorSwitchingPreview
          timelineProgress={timelineProgress}
          timelineStep={timelineStep}
          onTimelineChange={handleTimelineChange}
        />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-inner">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-teal-700">
              {regulatorModel.packageLabel} Package
            </p>
            <LM7805VoltageRegulatorSvg
              activeTerminals={activeTerminals}
              className="mx-auto h-auto w-full max-w-[420px]"
              outputLabel={regulatorModel.outputLabel}
              packageLabel={regulatorModel.packageLabel}
            />
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-inner">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-teal-700">
              {regulatorModel.pinoutLabel} Pinout Symbol
            </p>
            <VoltageRegulator78L05SymbolSvg
              activeTerminals={pinoutActiveTerminals}
              className="mx-auto h-auto w-full max-w-[620px]"
              pinoutLabel={regulatorModel.pinoutLabel}
            />
          </section>
        </div>
      </div>
    </div>
  );

  return (
    <UniversalSimulationLessonShell
      lessonLabel="Lesson 1"
      currentLessonId={1}
      track="voltage-regulator"
      lessonContent={{
        logic: <LogicTheoryTab />,
        logic_bn: <LogicTheoryBanglaTab />,
        lesson: lessonPanel,
      }}
      tabs={[
        { id: "logic", label: "Logic & Theory" },
        { id: "logic_bn", label: "Logic & Theory (Bangla)" },
        { id: "lesson", label: "Simulation" },
      ]}
    >
      {lessonPanel}
    </UniversalSimulationLessonShell>
  );
}
