"use client";

import { useMemo, useState } from "react";

import BjtSymbol from "./BjtSymbol";
import ControlPanelSection from "./ControlPanelSection";
import FetSymbol from "./FetSymbol";
import { clamp, formatNumber } from "./logic";
import StatCard from "./StatCard";
import TypeInfo from "./TypeInfo";
import type { BjtType, Family, FetChannel, FetType } from "./types";

export default function WhatIsTransistorTypesInteractiveSimulation() {
  const [family, setFamily] = useState<Family>("BJT");
  const [bjtType, setBjtType] = useState<BjtType>("NPN");
  const [fetType, setFetType] = useState<FetType>("MOSFET");
  const [fetChannel, setFetChannel] = useState<FetChannel>("N-Channel");
  const [signal, setSignal] = useState(70);
  const [gain, setGain] = useState(100);

  const active = signal > 5;
  const current = useMemo(() => {
    const base = family === "BJT" ? signal * gain * 0.002 : signal * 0.08;
    return clamp(base, 0, 100);
  }, [family, signal, gain]);

  const selectedName = family === "BJT" ? bjtType : `${fetType} ${fetChannel}`;
  const controlType = family === "BJT" ? "Current Controlled" : "Voltage Controlled";
  const mainCarrier =
    family === "BJT"
      ? bjtType === "NPN"
        ? "Electron"
        : "Hole"
      : fetChannel === "N-Channel"
        ? "Electron flow: Source to Drain"
        : "Electron flow: Drain to Source";

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-green-50 p-5 shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-700">
            Interactive Electronics Trainer
          </p>
          <h3 className="mt-2 text-2xl font-black text-slate-900 sm:text-4xl">
            Transistor Types Interactive Simulation
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Transistors are mainly grouped into BJT and FET families. Here we can
            compare NPN and PNP BJTs, plus JFET and MOSFET structures, control
            behavior, and carrier flow.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Selected Type" value={selectedName} tone="text-blue-600" />
          <StatCard label="Family" value={family} tone="text-green-600" />
          <StatCard label="Control" value={controlType} tone="text-purple-600" />
          <StatCard
            label="Output"
            value={`${formatNumber(current, 0)}%`}
            tone="text-orange-600"
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <ControlPanelSection
            family={family}
            setFamily={setFamily}
            bjtType={bjtType}
            setBjtType={setBjtType}
            fetType={fetType}
            setFetType={setFetType}
            fetChannel={fetChannel}
            setFetChannel={setFetChannel}
            signal={signal}
            setSignal={setSignal}
            gain={gain}
            setGain={setGain}
            mainCarrier={mainCarrier}
          />

          <div className="xl:col-span-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {selectedName} Visualizer
                </h2>
                <p className="text-sm text-slate-600">
                  Symbol view and animated flow for the selected transistor type.
                </p>
              </div>
              <div
                className={`rounded-full px-4 py-2 text-xs font-black ${
                  active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                }`}
              >
                {active ? "ACTIVE" : "OFF"}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-inner">
              {family === "BJT" ? (
                <BjtSymbol type={bjtType} active={active} />
              ) : (
                <FetSymbol type={fetType} channel={fetChannel} active={active} />
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <TypeInfo title="NPN" active={family === "BJT" && bjtType === "NPN"}>
            NPN BJT uses electrons as the main carriers, and the emitter arrow points
            outward.
          </TypeInfo>
          <TypeInfo title="PNP" active={family === "BJT" && bjtType === "PNP"}>
            PNP BJT uses holes as the main carriers, and the emitter arrow points
            inward.
          </TypeInfo>
          <TypeInfo title="JFET N/P Channel" active={family === "FET" && fetType === "JFET"}>
            JFET controls current through a junction electric field. N-channel and
            P-channel versions differ in carrier type and flow direction.
          </TypeInfo>
          <TypeInfo
            title="MOSFET N/P Channel"
            active={family === "FET" && fetType === "MOSFET"}
          >
            MOSFET uses an insulated gate electric field to control drain-source
            current in N-channel and P-channel forms.
          </TypeInfo>
        </div>
      </div>
    </div>
  );
}
