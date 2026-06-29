"use client";

import { useMemo, useState } from "react";

import ControlPanelSection from "./ControlPanelSection";
import TerminalCard from "./TerminalCard";
import Transistor2N2222AComponent from "./Transistor2N2222A";
import TransistorSymbol from "./TransistorSymbol";
import type { SelectedTerminal, TransistorType } from "./types";

export default function WhatIsTransistorTerminalsInteractiveSimulation() {
  const [type, setType] = useState<TransistorType>("NPN");
  const [selected, setSelected] = useState<SelectedTerminal>("Emitter");
  const [signal, setSignal] = useState(70);

  const terminalText = useMemo(() => {
    if (selected === "Emitter") {
      return {
        title: "Emitter",
        subtitle: "E Terminal",
        role: "The emitter supplies charge carriers. In NPN it emits electrons; in PNP it emits holes.",
        key: "Usually the most heavily doped region.",
      };
    }
    if (selected === "Base") {
      return {
        title: "Base",
        subtitle: "B Terminal",
        role: "The base is the control input of the transistor. A small base current can control a much larger collector current.",
        key: "A very thin and lightly doped region.",
      };
    }
    return {
      title: "Collector",
      subtitle: "C Terminal",
      role: "The collector gathers charge carriers and carries the output or load current.",
      key: "Typically larger in area than the emitter and moderately doped.",
    };
  }, [selected]);

  return (
    <div className="min-h-screen bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-red-50 via-white to-blue-50 p-5 shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-red-700">
            Interactive Electronics Trainer
          </p>
          <h3 className="mt-2 text-2xl font-black text-slate-900 sm:text-4xl">
            Transistor Terminals - Emitter, Base, Collector
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Identify the B, C, and E terminals, compare NPN and PNP arrow
            direction, and understand the current-flow logic through realtime
            animation. NPN electron flow is E to C, while PNP electron flow is C
            to E.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <ControlPanelSection
            type={type}
            setType={setType}
            selected={selected}
            setSelected={setSelected}
            signal={signal}
            setSignal={setSignal}
            terminalTitle={terminalText.title}
            terminalRole={terminalText.role}
            terminalKey={terminalText.key}
          />

          <div className="grid gap-5 xl:col-span-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl">
              <div className="grid items-center gap-6 xl:grid-cols-[190px_minmax(0,1fr)]">
                <Transistor2N2222AComponent />
                <TransistorSymbol
                  type={type}
                  selected={selected}
                  signal={signal}
                  variant="showcase"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <TerminalCard
            title="Emitter"
            subtitle="E terminal"
            active={selected === "Emitter"}
          >
            Electron-flow logic: in NPN, electrons move from Emitter to
            Collector; in PNP, the electron direction is opposite, from
            Collector to Emitter. The arrow in the symbol is always on the
            emitter terminal.
          </TerminalCard>
          <TerminalCard
            title="Base"
            subtitle="B terminal"
            active={selected === "Base"}
          >
            The control terminal. Even a small base current can control the main
            transistor current.
          </TerminalCard>
          <TerminalCard
            title="Collector"
            subtitle="C terminal"
            active={selected === "Collector"}
          >
            The output or load terminal. The collector gathers the charge
            carriers and carries the collector current.
          </TerminalCard>
        </div>
      </div>
    </div>
  );
}
