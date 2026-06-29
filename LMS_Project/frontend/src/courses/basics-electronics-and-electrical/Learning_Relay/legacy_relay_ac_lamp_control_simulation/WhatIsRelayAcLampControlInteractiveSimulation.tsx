"use client";

import { useMemo, useState } from "react";

import ControlPanelSection from "./ControlPanelSection";
import RelayACLampSvg from "./RelayACLampSvg";
import { calculateRelay, runRelayTests } from "./logic";
import StatCard from "./StatCard";
import TypeInfo from "./TypeInfo";

export default function WhatIsRelayAcLampControlInteractiveSimulation() {
  const [pressed, setPressed] = useState(false);
  const relay = useMemo(() => calculateRelay(pressed), [pressed]);
  const testsPassed = useMemo(() => runRelayTests(), []);

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-700">
            Interactive Electronics Trainer
          </p>
          <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-4xl">
            Relay AC Lamp Control Circuit
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-600 sm:text-base">
            A relay lets a low-voltage DC control circuit switch a higher-voltage
            AC load. Pressing the pushbutton energizes the coil, moves COM to NO,
            and turns the AC lamp on.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Button"
            value={pressed ? "PRESSED" : "RELEASED"}
            tone={pressed ? "text-purple-600" : "text-slate-600"}
          />
          <StatCard
            label="Coil"
            value={relay.coilEnergized ? "ENERGIZED" : "OFF"}
            tone={relay.coilEnergized ? "text-blue-600" : "text-slate-500"}
          />
          <StatCard
            label="Contact"
            value={relay.contactState}
            tone={
              relay.contactState === "NO" ? "text-green-600" : "text-orange-600"
            }
          />
          <StatCard
            label="Lamp"
            value={relay.lampOn ? "ON" : "OFF"}
            tone={relay.lampOn ? "text-yellow-600" : "text-slate-500"}
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <ControlPanelSection
            pressed={pressed}
            setPressed={setPressed}
            testsPassed={testsPassed}
            coilEnergized={relay.coilEnergized}
          />

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl xl:col-span-2">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Relay Circuit Visualizer
                </h2>
                <p className="text-sm text-slate-600">
                  DC control side to relay coil to isolated AC lamp switching
                  side.
                </p>
              </div>
              <div
                className={`rounded-full px-4 py-2 text-xs font-black ${
                  relay.lampOn
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {relay.lampOn ? "LAMP ON" : "LAMP OFF"}
              </div>
            </div>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-inner">
              <RelayACLampSvg pressed={pressed} relay={relay} />
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <TypeInfo title="Relay Coil" active={relay.coilEnergized}>
            When the coil is energized, it creates a magnetic field and moves
            the mechanical contact.
          </TypeInfo>
          <TypeInfo title="NO / NC Contact" active>
            NC is connected in the normal state. When the coil energizes, COM
            shifts to the NO terminal.
          </TypeInfo>
          <TypeInfo title="AC Lamp Control" active={relay.lampOn}>
            A low-voltage DC control path can safely switch an isolated higher
            voltage AC lamp.
          </TypeInfo>
        </div>
      </div>
    </div>
  );
}
