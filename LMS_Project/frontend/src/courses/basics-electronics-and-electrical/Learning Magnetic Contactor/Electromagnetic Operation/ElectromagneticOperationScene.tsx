"use client";

import React, { useMemo, useState } from "react";
import ArmatureAnimator from "./ArmatureAnimator";
import CoilEnergizer from "./CoilEnergizer";
import ContactStateIndicator from "./ContactStateIndicator";
import CurrentFlowPath from "./CurrentFlowPath";
import MagneticFieldVisualizer from "./MagneticFieldVisualizer";
import SpringCompressionAnimator from "./SpringCompressionAnimator";
import VoltageInputControl, { type CoilVoltageMode } from "./VoltageInputControl";

const MODE_TO_VOLTAGE: Record<CoilVoltageMode, number> = {
  off: 0,
  "24v-dc": 24,
  "110v-ac": 110,
  "220v-ac": 220,
  overvoltage: 380,
};

export default function ElectromagneticOperationScene() {
  const [mode, setMode] = useState<CoilVoltageMode>("off");
  const [enabled, setEnabled] = useState(false);

  const voltage = enabled ? MODE_TO_VOLTAGE[mode] : 0;
  const ratedVoltage = 220;

  const operation = useMemo(() => {
    const validVoltage = enabled && mode !== "off";
    const energized = validVoltage && voltage >= ratedVoltage * 0.85 && mode !== "overvoltage";
    const fault = enabled && mode === "overvoltage";

    return {
      voltage,
      energized,
      fault,
      armaturePulled: energized,
      mainContactsClosed: energized,
      auxNOClosed: energized,
      auxNCClosed: !energized,
      springCompressed: energized,
      loadRunning: energized && !fault,
      magneticIntensity: fault ? 1.6 : energized ? 1.15 : 0.45,
    };
  }, [enabled, mode, ratedVoltage, voltage]);

  return (
    <div className="w-full bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-5 md:p-6">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5">
        <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="flex flex-col gap-5">
            <VoltageInputControl
              mode={mode}
              enabled={enabled}
              onModeChange={setMode}
              onEnabledChange={setEnabled}
            />

            <CoilEnergizer
              voltage={operation.voltage}
              ratedVoltage={ratedVoltage}
              energized={operation.energized}
              onToggle={() => setEnabled((value) => !value)}
              onVoltageChange={(nextVoltage) => {
                if (nextVoltage <= 0) {
                  setMode("off");
                  setEnabled(false);
                  return;
                }

                setEnabled(true);

                if (nextVoltage < 60) {
                  setMode("24v-dc");
                } else if (nextVoltage < 165) {
                  setMode("110v-ac");
                } else if (nextVoltage <= 260) {
                  setMode("220v-ac");
                } else {
                  setMode("overvoltage");
                }
              }}
            />

            <div
              className={`rounded-3xl border p-4 shadow-sm ${
                operation.fault ? "border-red-200 bg-red-50" : "border-slate-200 bg-white"
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                Operation Summary
              </div>
              <div
                className={`mt-2 text-lg font-bold ${
                  operation.fault
                    ? "text-red-700"
                    : operation.energized
                    ? "text-emerald-700"
                    : "text-slate-800"
                }`}
              >
                {operation.fault
                  ? "Fault: Incorrect coil voltage"
                  : operation.energized
                  ? "Electromagnet is pulling the armature"
                  : "No electromagnetic pull"}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {operation.fault
                  ? "Overvoltage is applied. The training scene marks this as unsafe and prevents normal pull-in behavior."
                  : operation.energized
                  ? "The coil is energized, flux builds in the iron core, the armature moves in, and the main contacts close."
                  : "Without enough voltage across A1 and A2, the return spring keeps the armature released and the main contacts open."}
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-slate-900">Magnetic Field Build-Up</h2>
                  <p className="text-sm text-slate-500">
                    Coil current produces a magnetic field that acts through the iron core.
                  </p>
                </div>
                <MagneticFieldVisualizer
                  energized={operation.energized || operation.fault}
                  intensity={operation.magneticIntensity}
                  width={460}
                  height={260}
                />
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-slate-900">Motion and Return Force</h2>
                  <p className="text-sm text-slate-500">
                    The armature moves when magnetic pull overcomes spring force.
                  </p>
                </div>

                <div className="grid gap-4">
                  <ArmatureAnimator
                    pulled={operation.armaturePulled}
                    energized={operation.energized}
                    width={360}
                    height={190}
                  />
                  <SpringCompressionAnimator
                    compressed={operation.springCompressed}
                    width={320}
                    height={130}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Electromagnetic Operation Flow</h2>
                  <p className="text-sm text-slate-500">
                    Follow the sequence from control voltage input to contact movement and load state.
                  </p>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  {operation.loadRunning ? "Load Path Active" : "Load Path Open"}
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <CurrentFlowPath
                      active={enabled && mode !== "off"}
                      direction="right"
                      width={250}
                      height={120}
                      particleCount={4}
                      label="Voltage At A1-A2"
                      strokeWidth={7}
                    />
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <CurrentFlowPath
                      active={operation.energized}
                      direction="down"
                      width={180}
                      height={150}
                      particleCount={5}
                      label="Magnetic Pull"
                      strokeWidth={7}
                    />
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <CurrentFlowPath
                      active={operation.mainContactsClosed}
                      direction="right"
                      width={250}
                      height={120}
                      particleCount={5}
                      label="Load Current Path"
                      strokeWidth={7}
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="mb-3 text-sm font-bold text-slate-800">Operation Sequence</div>
                  <div className="space-y-3 text-sm leading-6 text-slate-600">
                    <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                      1. Apply control voltage to <span className="font-semibold text-slate-900">A1 and A2</span>.
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                      2. The coil winding generates magnetic flux in the iron core.
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                      3. The armature is pulled in and the spring compresses.
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                      4. Main NO contacts close, auxiliary NO closes, auxiliary NC opens.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ContactStateIndicator
              energized={operation.energized}
              mainContactsClosed={operation.mainContactsClosed}
              auxNOClosed={operation.auxNOClosed}
              auxNCClosed={operation.auxNCClosed}
              loadRunning={operation.loadRunning}
              title="Contact Response During Electromagnetic Operation"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
