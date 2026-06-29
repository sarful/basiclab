"use client";

import { useMemo, useState } from "react";

import ControlPanelSection from "./ControlPanelSection";
import IntroSection from "./IntroSection";
import {
  getLoadCurrent,
  getRegulatorResults,
} from "./logic";
import PowerChain from "./PowerChain";
import RegulatorSelectorSection from "./RegulatorSelectorSection";
import type { LoadMode, RegulatorType } from "./types";

export default function WhatIsVoltageRegulatorInteractiveSimulation() {
  const [regulatorType, setRegulatorType] = useState<RegulatorType>("7805");
  const [inputVoltage, setInputVoltage] = useState(18);
  const [loadMode, setLoadMode] = useState<LoadMode>("Medium");
  const [ripple, setRipple] = useState(2.5);

  const loadCurrent = useMemo(() => getLoadCurrent(loadMode), [loadMode]);

  const results = useMemo(
    () => getRegulatorResults(regulatorType, inputVoltage, loadCurrent, ripple),
    [regulatorType, inputVoltage, loadCurrent, ripple],
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border bg-white p-6 shadow-xl">
          <h1 className="text-4xl font-black">
            Voltage Regulator Complete Educational Simulator
          </h1>
          <p className="mt-3 text-slate-600">
            A complete interactive simulation of transformer, rectifier, filter,
            regulator, and load.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <IntroSection />
          <RegulatorSelectorSection
            regulatorType={regulatorType}
            setRegulatorType={setRegulatorType}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <ControlPanelSection
            inputVoltage={inputVoltage}
            setInputVoltage={setInputVoltage}
            ripple={ripple}
            setRipple={setRipple}
            loadMode={loadMode}
            setLoadMode={setLoadMode}
            results={results}
          />

          <div className="rounded-3xl border p-4 shadow">
            <PowerChain
              regulatedVoltage={results.effective}
              inputVoltage={inputVoltage}
              regulatorType={regulatorType}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
