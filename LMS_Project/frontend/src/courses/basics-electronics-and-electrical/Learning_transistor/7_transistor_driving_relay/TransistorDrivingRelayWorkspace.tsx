"use client";

import { useState } from "react";

import TransistorDrivingRelayControlPanel from "./control_panel";
import TransistorDrivingRelay from "./TransistorDrivingRelay";
import { calculateRelayDriverState } from "./simulationLogic";
import type { RelayDriverControls } from "./simulationTypes";

const DEFAULT_CONTROLS: RelayDriverControls = {
  dcVoltage: 5,
  acVoltage: 6,
  baseResistorOhms: 100,
  flowSpeed: 1,
  switchClosed: false,
  flowMode: "conventional",
};

function LiveStatusPanel({
  statusLabel,
  statusDescription,
  baseCurrentMa,
  coilCurrentMa,
  relayContactLabel,
}: {
  statusLabel: string;
  statusDescription: string;
  baseCurrentMa: number;
  coilCurrentMa: number;
  relayContactLabel: string;
}) {
  const items = [
    { title: "Base Current", value: `${baseCurrentMa.toFixed(2)} mA` },
    { title: "Coil Current", value: `${coilCurrentMa.toFixed(2)} mA` },
    { title: "Contact", value: relayContactLabel },
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
          Relay Logic
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        {statusDescription}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
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

export default function TransistorDrivingRelayWorkspace() {
  const [controls, setControls] = useState<RelayDriverControls>(DEFAULT_CONTROLS);
  const state = calculateRelayDriverState(controls);

  function updateControls(patch: Partial<RelayDriverControls>) {
    setControls((current) => ({ ...current, ...patch }));
  }

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 p-5 shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-700">
            Transistor Driving Relay
          </p>
          <h3 className="mt-2 text-2xl font-black text-slate-900 sm:text-4xl">
            Relay Driver Current Flow Simulation
          </h3>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Lesson 7 now follows the lesson 13 simulator format with one shared
            relay-driver state, switch-controlled coil current, and logical
            relay contact movement from COM to NO.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          <TransistorDrivingRelayControlPanel
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
                    Switch, base resistor, transistor, relay coil, relay contact,
                    AC source, and lamp all update from one shared lesson 7
                    relay-driver model.
                  </p>
                </div>
                <div
                  className={`rounded-full px-4 py-2 text-xs font-black ${
                    state.lampOn
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {state.lampOn ? "LAMP ON" : "LAMP OFF"}
                </div>
              </div>

              <TransistorDrivingRelay
                dcVoltage={state.dcVoltage}
                acVoltage={state.acVoltage}
                baseResistorOhms={state.baseResistorOhms}
                flowSpeed={state.flowSpeed}
                switchClosed={state.switchClosed}
                flowMode={state.flowMode}
                baseCurrentMa={state.baseCurrentMa}
                coilCurrentMa={state.coilCurrentMa}
                transistorOn={state.transistorOn}
                relayEnergized={state.relayEnergized}
                contactClosedToNo={state.contactClosedToNo}
                lampOn={state.lampOn}
                coilPathActive={state.coilPathActive}
                loadPathActive={state.loadPathActive}
                relayContactLabel={state.relayContactLabel}
                onToggleSwitch={() =>
                  updateControls({ switchClosed: !controls.switchClosed })
                }
              />
            </section>

            <LiveStatusPanel
              statusLabel={state.statusLabel}
              statusDescription={state.statusDescription}
              baseCurrentMa={state.baseCurrentMa}
              coilCurrentMa={state.coilCurrentMa}
              relayContactLabel={state.relayContactLabel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
