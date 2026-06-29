"use client";

import { useState } from "react";

import MosfetNChannelSwitchCircuitControlPanel from "./control_panel";
import MosfetNChannelSwitchCircuit from "./MosfetNChannelSwitchCircuit";
import { calculateNmosLowSideState } from "./simulationLogic";
import type { NmosLowSideControls } from "./simulationTypes";

const DEFAULT_CONTROLS: NmosLowSideControls = {
  batteryVoltage: 5,
  rpdOhms: 100000,
  rLedOhms: 1000,
  flowSpeed: 1,
  switchClosed: false,
  flowMode: "conventional",
};

function LiveStatusPanel({
  statusLabel,
  statusDescription,
  drainVoltage,
  gateVoltage,
  vgs,
  loadCurrentMa,
}: {
  statusLabel: string;
  statusDescription: string;
  drainVoltage: number;
  gateVoltage: number;
  vgs: number;
  loadCurrentMa: number;
}) {
  const items = [
    { title: "Drain", value: `${drainVoltage.toFixed(2)} V` },
    { title: "Gate", value: `${gateVoltage.toFixed(2)} V` },
    { title: "VGS", value: `${vgs.toFixed(2)} V` },
    { title: "Load Current", value: `${loadCurrentMa.toFixed(2)} mA` },
  ];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
            Live Status
          </p>
          <h3 className="mt-2 text-xl font-black text-slate-900">
            {statusLabel}
          </h3>
        </div>
        <div className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
          Real State
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        {statusDescription}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              {item.title}
            </p>
            <p className="mt-2 text-lg font-black text-slate-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function MosfetNChannelSwitchCircuitWorkspace() {
  const [controls, setControls] = useState<NmosLowSideControls>(DEFAULT_CONTROLS);
  const state = calculateNmosLowSideState(controls);

  function updateControls(patch: Partial<NmosLowSideControls>) {
    setControls((current) => ({ ...current, ...patch }));
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 p-5 shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-700">
            MOSFET N Channel Switch Circuit
          </p>
          <h3 className="mt-2 text-2xl font-black text-slate-900 sm:text-4xl">
            NMOS Low-Side Load Switch Simulation
          </h3>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Lesson 13 now follows the lesson 14 simulator architecture with one
            shared NMOS low-side switching model, clean control panel, and live
            current-flow feedback.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          <MosfetNChannelSwitchCircuitControlPanel
            controls={controls}
            onChange={updateControls}
            onReset={() => setControls(DEFAULT_CONTROLS)}
          />

          <div className="space-y-5">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Simulation CKT
                  </h2>
                  <p className="text-sm text-slate-600">
                    Switch, pull-down resistor, battery, and LED branch all
                    update one shared NMOS load-switch state.
                  </p>
                </div>
                <div
                  className={`rounded-full px-4 py-2 text-xs font-black ${
                    state.isLedOn
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {state.isLedOn ? "LED ON" : "LED OFF"}
                </div>
              </div>

              <MosfetNChannelSwitchCircuit
                batteryVoltage={state.batteryVoltage}
                rpdOhms={state.rpdOhms}
                rLedOhms={state.rLedOhms}
                flowSpeed={state.flowSpeed}
                switchClosed={state.switchClosed}
                flowMode={state.flowMode}
                gateVoltage={state.gateVoltage}
                sourceVoltage={state.sourceVoltage}
                drainVoltage={state.drainVoltage}
                vgs={state.vgs}
                loadCurrentMa={state.loadCurrentMa}
                gatePathActive={state.gatePathActive}
                loadPathActive={state.loadPathActive}
                isNmosOn={state.isNmosOn}
                isLedOn={state.isLedOn}
              />
            </section>

            <LiveStatusPanel
              statusLabel={state.statusLabel}
              statusDescription={state.statusDescription}
              drainVoltage={state.drainVoltage}
              gateVoltage={state.gateVoltage}
              vgs={state.vgs}
              loadCurrentMa={state.loadCurrentMa}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
