"use client";

import { useState } from "react";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";
import LiveEquationsPanel from "./LiveEquationsPanel";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import PnpTransistorSwitchingCircuit from "./PnpTransistorSwitchingCircuit";
import PnpWorkingControlPanel from "./PnpWorkingControlPanel";
import { calculatePnpWorkingState } from "./simulationLogic";
import type { PnpWorkingControls } from "./simulationTypes";

const DEFAULT_CONTROLS: PnpWorkingControls = {
  batteryVoltage: 5,
  rbOhms: 10000,
  rpuOhms: 100000,
  rLedOhms: 1000,
  flowSpeed: 1,
  switchClosed: false,
  flowMode: "conventional",
};

function Lesson06PnpTransistorWorkingSimulation() {
  const [controls, setControls] = useState<PnpWorkingControls>(DEFAULT_CONTROLS);
  const state = calculatePnpWorkingState(controls);

  function updateControls(patch: Partial<PnpWorkingControls>) {
    setControls((current) => ({ ...current, ...patch }));
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-red-50 via-white to-emerald-50 p-5 shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-red-700">
            PNP Transistor Working
          </p>
          <h3 className="mt-2 text-2xl font-black text-slate-900 sm:text-4xl">
            PNP Transistor Working Simulation
          </h3>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-600 sm:text-base">
            This lesson now directly renders the PNP transistor switching
            circuit as the working simulation canvas.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          <PnpWorkingControlPanel
            controls={controls}
            onChange={updateControls}
            onReset={() => setControls(DEFAULT_CONTROLS)}
          />

          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Simulation CKT
                  </h2>
                  <p className="text-sm text-slate-600">
                    Change Vcc, RB, RPU, R_LED, and SW to watch logical current flow.
                  </p>
                </div>
                <div className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black text-emerald-700">
                  {state.isLedOn ? "LED ON" : "LED OFF"}
                </div>
              </div>

              <PnpTransistorSwitchingCircuit
                batteryVoltage={state.batteryVoltage}
                rbOhms={state.rbOhms}
                rpuOhms={state.rpuOhms}
                rLedOhms={state.rLedOhms}
                flowSpeed={controls.flowSpeed}
                switchClosed={state.switchClosed}
                flowMode={state.flowMode}
                emitterVoltage={state.emitterVoltage}
                baseVoltage={state.baseVoltage}
                collectorVoltage={state.collectorVoltage}
                baseCurrentMa={state.baseCurrentMa}
                collectorCurrentMa={state.collectorCurrentMa}
                ledBrightness={state.ledBrightness}
                basePathActive={state.basePathActive}
                loadPathActive={state.loadPathActive}
                mode={state.mode}
              />
            </div>

            <LiveEquationsPanel state={state} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Lesson06PnpTransistorWorkingEmbeddedPage() {
  const lessonPanel = <Lesson06PnpTransistorWorkingSimulation />;

  return (
    <UniversalSimulationLessonShell
      lessonLabel="Lesson 06"
      currentLessonId={6}
      track="transistor"
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
