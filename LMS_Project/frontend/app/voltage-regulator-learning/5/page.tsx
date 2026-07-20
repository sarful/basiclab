"use client";

import { useState } from "react";

import UniversalSimulationLessonShell from "../../../src/courses/basics-electronics-and-electrical/shared/UniversalSimulationLessonShell";
import LogicTheoryBanglaTab from "../../../src/courses/basics-electronics-and-electrical/Learning_voltage_regulator/05_lm317_adjustable_regulator/LogicTheoryBanglaTab";
import LogicTheoryTab from "../../../src/courses/basics-electronics-and-electrical/Learning_voltage_regulator/05_lm317_adjustable_regulator/LogicTheoryTab";
import {
  AdjustableRegulatorControlPanel,
  AdjustableRegulatorRegulationPreview,
  ADJUSTABLE_REGULATOR_MODELS,
  FIXED_R1_OHMS,
  REGULATOR_DROPOUT_VOLTS,
  toAdjustableTimelineStep,
  type AdjustableRegulatorModel,
} from "../../../src/courses/basics-electronics-and-electrical/Learning_voltage_regulator/5.AdjustableRegulatorLM317Circuit/AdjustableRegulatorControlPanel";
import { AdjustableRegulatorLM317CircuitSvg } from "../../../src/courses/basics-electronics-and-electrical/Learning_voltage_regulator/5.AdjustableRegulatorLM317Circuit/AdjustableRegulatorLM317Circuit";

export default function VoltageRegulatorLearningLessonFivePage() {
  const [regulatorModel, setRegulatorModel] = useState<AdjustableRegulatorModel>(
    ADJUSTABLE_REGULATOR_MODELS[0],
  );
  const [inputVoltage, setInputVoltage] = useState(12);
  const [r2Ohms, setR2Ohms] = useState(1000);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const timelineStep = toAdjustableTimelineStep(timelineProgress);
  const circuitPowered = timelineStep > 0;
  const formulaOutputVoltage = 1.25 * (1 + r2Ohms / FIXED_R1_OHMS);
  const availableOutputVoltage = Math.max(0, inputVoltage - REGULATOR_DROPOUT_VOLTS);
  const regulatedOutputVoltage = Math.min(
    formulaOutputVoltage,
    availableOutputVoltage,
  );
  const outputVoltage = regulatedOutputVoltage;
  const inputVoltageLabel = `VIN ${inputVoltage.toFixed(1)}V`;
  const outputVoltageLabel = `VOUT ${outputVoltage.toFixed(2)}V`;

  const handleReset = () => {
    setRegulatorModel(ADJUSTABLE_REGULATOR_MODELS[0]);
    setInputVoltage(12);
    setR2Ohms(1000);
    setTimelineProgress(0);
  };

  const handleStart = () => {
    setTimelineProgress(0.75);
  };

  const handleStop = () => {
    setTimelineProgress(0);
  };

  const handleTimelineChange = (value: number) => {
    const nextProgress = Math.min(0.999, Math.max(0, value));

    setTimelineProgress(nextProgress);
  };

  const lessonPanel = (
    <div className="grid w-full gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
        <AdjustableRegulatorControlPanel
          formulaOutputVoltage={formulaOutputVoltage}
          inputVoltage={inputVoltage}
          isPowered={circuitPowered}
          outputVoltage={outputVoltage}
          r2Ohms={r2Ohms}
          regulatorModel={regulatorModel}
          onInputVoltageChange={setInputVoltage}
          onReset={handleReset}
          onRegulatorModelChange={setRegulatorModel}
          onR2Change={setR2Ohms}
          onStart={handleStart}
          onStop={handleStop}
        />
      </aside>

      <section className="min-w-0 rounded-[28px] border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
        <AdjustableRegulatorRegulationPreview
          timelineProgress={timelineProgress}
          timelineStep={timelineStep}
          onTimelineChange={handleTimelineChange}
        />

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-inner">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-teal-700">
            {regulatorModel.packageLabel} Adjustable Regulator Circuit
          </p>
          <AdjustableRegulatorLM317CircuitSvg
            className="mx-auto h-auto w-full max-w-[760px]"
            currentStage={timelineStep}
            inputVoltageLabel={inputVoltageLabel}
            outputVoltageLabel={outputVoltageLabel}
            r2Ohms={r2Ohms}
            regulatorLabel={regulatorModel.packageLabel}
          />
        </div>
      </section>
    </div>
  );

  return (
    <UniversalSimulationLessonShell
      lessonLabel="Lesson 5"
      currentLessonId={5}
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
