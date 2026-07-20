"use client";

import { useState } from "react";

import UniversalSimulationLessonShell from "../../../src/courses/basics-electronics-and-electrical/shared/UniversalSimulationLessonShell";
import LogicTheoryBanglaTab from "../../../src/courses/basics-electronics-and-electrical/Learning_voltage_regulator/03_78xx_series/LogicTheoryBanglaTab";
import LogicTheoryTab from "../../../src/courses/basics-electronics-and-electrical/Learning_voltage_regulator/03_78xx_series/LogicTheoryTab";
import {
  PhysicalRegulatorControlPanel,
  PhysicalRegulatorPreview,
  PHYSICAL_REGULATOR_MODELS,
  toPhysicalTimelineStep,
  type PhysicalRegulatorModel,
} from "../../../src/courses/basics-electronics-and-electrical/Learning_voltage_regulator/3.VOLTAGEREGULATORCIRCUIT PhysicalSVG/PhysicalRegulatorControlPanel";
import { Regulator7805CircuitSvg } from "../../../src/courses/basics-electronics-and-electrical/Learning_voltage_regulator/3.VOLTAGEREGULATORCIRCUIT PhysicalSVG/VOLTAGEREGULATORCIRCUIT PhysicalSVG";

export default function VoltageRegulatorLearningLessonThreePage() {
  const [regulatorModel, setRegulatorModel] = useState<PhysicalRegulatorModel>(
    PHYSICAL_REGULATOR_MODELS[0],
  );
  const [inputVoltage, setInputVoltage] = useState(12);
  const [loadCurrent, setLoadCurrent] = useState(0.25);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const timelineStep = toPhysicalTimelineStep(timelineProgress);
  const outputVoltage = Math.max(
    0,
    Math.min(
      regulatorModel.outputVoltage,
      inputVoltage - regulatorModel.dropoutVoltage,
    ),
  );
  const circuitPowered = timelineStep > 0;
  const inputVoltageLabel = `VIN ${inputVoltage.toFixed(1)}V`;
  const outputVoltageLabel = `VOUT ${outputVoltage.toFixed(2)}V`;

  const handleReset = () => {
    setRegulatorModel(PHYSICAL_REGULATOR_MODELS[0]);
    setInputVoltage(12);
    setLoadCurrent(0.25);
    setTimelineProgress(0);
  };

  const handleStart = () => {
    setTimelineProgress(0.75);
  };

  const handleStop = () => {
    setTimelineProgress(0);
  };

  const handleTimelineChange = (value: number) => {
    setTimelineProgress(Math.min(0.999, Math.max(0, value)));
  };

  const lessonPanel = (
    <div className="grid w-full gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
        <PhysicalRegulatorControlPanel
          inputVoltage={inputVoltage}
          isPowered={circuitPowered}
          loadCurrent={loadCurrent}
          outputVoltage={outputVoltage}
          regulatorModel={regulatorModel}
          onInputVoltageChange={setInputVoltage}
          onLoadCurrentChange={setLoadCurrent}
          onRegulatorModelChange={setRegulatorModel}
          onReset={handleReset}
          onStart={handleStart}
          onStop={handleStop}
        />
      </aside>

      <section className="min-w-0 rounded-[28px] border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
        <PhysicalRegulatorPreview
          timelineProgress={timelineProgress}
          timelineStep={timelineStep}
          onTimelineChange={handleTimelineChange}
        />

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-inner">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-teal-700">
            {regulatorModel.packageLabel} Physical Regulator Circuit
          </p>
          <Regulator7805CircuitSvg
            className="mx-auto h-auto w-full max-w-[760px]"
            currentStage={timelineStep}
            inputVoltageLabel={inputVoltageLabel}
            outputVoltageLabel={outputVoltageLabel}
            regulatorLabel={regulatorModel.packageLabel}
          />
        </div>
      </section>
    </div>
  );

  return (
    <UniversalSimulationLessonShell
      lessonLabel="Lesson 3"
      currentLessonId={3}
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
