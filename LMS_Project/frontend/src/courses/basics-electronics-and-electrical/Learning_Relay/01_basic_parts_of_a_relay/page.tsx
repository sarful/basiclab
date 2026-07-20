"use client";

import { useMemo, useState } from "react";

import UniversalSimulationLessonShell from "../../shared/UniversalSimulationLessonShell";
import ACPowerRelaySketch from "./ACPowerRelaySketch";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import Relay3D from "./Relay3D";
import SongleRelaySketchSvg from "./SongleRelaySketchSvg";

type RelaySketchTab = "songle" | "terminal" | "acPower";

const sketchTabs = [
  { id: "songle", label: "Songle Relay Package Sketch" },
  { id: "terminal", label: "Relay 3D Terminal Map" },
  { id: "acPower", label: "ACPowerRelaySketch" },
] satisfies { id: RelaySketchTab; label: string }[];

export default function RelayLessonOneEmbeddedPage() {
  const [activeTab, setActiveTab] = useState<RelaySketchTab>("songle");
  const [isPowered, setIsPowered] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showCurrentDots, setShowCurrentDots] = useState(true);
  const [showDebugTerminals, setShowDebugTerminals] = useState(false);

  const activeTitle = useMemo(
    () => sketchTabs.find((tab) => tab.id === activeTab)?.label ?? sketchTabs[0].label,
    [activeTab],
  );

  const status = isPowered
    ? {
        label: "POWER ON",
        title: "Coil Energized",
        coil: "A1/A2 coil active",
        contact: "COM changes to NO",
      }
    : {
        label: "POWER OFF",
        title: "Rest Position",
        coil: "A1/A2 coil inactive",
        contact: "COM returns to NC",
      };

  function resetSimulation() {
    setIsPowered(false);
    setIsRunning(false);
    setSpeed(1);
    setShowCurrentDots(true);
    setShowDebugTerminals(false);
  }

  const sharedVisualProps = {
    initialPowered: isPowered,
    autoStart: isRunning,
    simulationSpeed: speed,
    showControls: false,
    showTimeline: false,
    showCurrentDots,
    showDebugTerminals,
  };

  const lessonPanel = (
      <section className="w-full text-slate-900">
        <header className="rounded-3xl border border-slate-300 bg-white/95 p-4 shadow-xl md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
                Relay Learning
              </p>
              <h1 className="mt-2 text-[1.45rem] font-black tracking-tight text-slate-950 md:text-[1.85rem]">
                Basic Parts of a Relay
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Study the Songle relay package, terminal map, and AC relay power sketch
                with one shared control panel.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[520px]">
              <StatusCard label="Condition" value={status.label} tone={isPowered ? "green" : "slate"} />
              <StatusCard label="Coil" value={isPowered ? "Energized" : "Off"} tone="blue" />
              <StatusCard label="Speed" value={`${speed.toFixed(1)}x`} tone="amber" />
            </div>
          </div>
        </header>

        <main className="mt-4 grid gap-4 xl:grid-cols-[350px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)] md:p-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Shared Control Panel
              </p>
              <h2 className="mt-2 text-xl font-black text-slate-950">
                {status.title}
              </h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                {status.coil} - {status.contact}
              </p>
            </div>

            <div className="mt-4 grid gap-3">
              <button
                type="button"
                onClick={() => setIsPowered(false)}
                className={[
                  "rounded-2xl border p-4 text-left text-sm font-bold transition",
                  !isPowered
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-100"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                ].join(" ")}
              >
                Power OFF Condition
                <span className="mt-1 block text-xs font-semibold text-slate-500">
                  Coil off, COM rests on NC.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsPowered(true)}
                className={[
                  "rounded-2xl border p-4 text-left text-sm font-bold transition",
                  isPowered
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-100"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                ].join(" ")}
              >
                Power ON Condition
                <span className="mt-1 block text-xs font-semibold text-slate-500">
                  Coil energized, COM moves to NO.
                </span>
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                data-testid="relay-lesson-one-power-toggle"
                onClick={() => setIsPowered((value) => !value)}
                className={[
                  "rounded-2xl px-4 py-3 text-sm font-black text-white transition",
                  isPowered ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700",
                ].join(" ")}
              >
                {isPowered ? "Power Off" : "Power On"}
              </button>
              <button
                type="button"
                onClick={() => setIsRunning((value) => !value)}
                className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800"
              >
                {isRunning ? "Stop" : "Start"}
              </button>
              <button
                type="button"
                onClick={() => setShowCurrentDots((value) => !value)}
                className={[
                  "rounded-2xl border px-4 py-3 text-sm font-black transition",
                  showCurrentDots
                    ? "border-blue-300 bg-blue-50 text-blue-700"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
                ].join(" ")}
              >
                Dots
              </button>
              <button
                type="button"
                onClick={() => setShowDebugTerminals((value) => !value)}
                className={[
                  "rounded-2xl border px-4 py-3 text-sm font-black transition",
                  showDebugTerminals
                    ? "border-amber-300 bg-amber-50 text-amber-800"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
                ].join(" ")}
              >
                Debug
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="relay-lesson-one-speed" className="text-sm font-black text-slate-800">
                  Speed
                </label>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-black text-amber-700">
                  {speed.toFixed(1)}x
                </span>
              </div>
              <input
                id="relay-lesson-one-speed"
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={speed}
                onChange={(event) => setSpeed(Number(event.target.value))}
                className="mt-4 w-full accent-amber-500"
              />
            </div>

            <button
              type="button"
              onClick={resetSimulation}
              className="mt-4 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Reset Simulation
            </button>
          </aside>

          <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
            <div className="border-b border-slate-200 px-4 py-4 md:px-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                    Interactive Canvas
                  </p>
                  <h2 className="mt-2 text-[1.45rem] font-black text-slate-950">
                    {activeTitle}
                  </h2>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  {sketchTabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      data-testid={`relay-lesson-one-tab-${tab.id}`}
                      onClick={() => setActiveTab(tab.id)}
                      className={[
                        "rounded-2xl border px-4 py-3 text-sm font-black transition",
                        activeTab === tab.id
                          ? "border-blue-300 bg-blue-50 text-blue-700 shadow-sm"
                          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="min-h-[520px] bg-white px-3 py-4 sm:px-5 md:px-6">
              {activeTab === "songle" ? (
                <div className="mx-auto max-w-[980px] overflow-x-auto">
                  <SongleRelaySketchSvg {...sharedVisualProps} />
                </div>
              ) : null}

              {activeTab === "terminal" ? (
                <div className="flex min-h-[520px] items-center justify-center">
                  <Relay3D {...sharedVisualProps} className="max-w-[620px]" />
                </div>
              ) : null}

              {activeTab === "acPower" ? (
                <div className="mx-auto max-w-[760px] overflow-x-auto">
                  <ACPowerRelaySketch {...sharedVisualProps} />
                </div>
              ) : null}
            </div>
          </section>
        </main>
      </section>
  );

  return (
    <UniversalSimulationLessonShell
      lessonLabel="Lesson 01"
      currentLessonId={1}
      track="relay"
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

function StatusCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "amber" | "blue" | "green" | "slate";
}) {
  const toneClass = {
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    blue: "border-blue-200 bg-blue-50 text-blue-800",
    green: "border-emerald-200 bg-emerald-50 text-emerald-800",
    slate: "border-slate-200 bg-slate-50 text-slate-800",
  }[tone];

  return (
    <div className={`rounded-2xl border px-4 py-3 shadow-sm ${toneClass}`}>
      <p className="text-[11px] font-black uppercase tracking-[0.18em] opacity-75">
        {label}
      </p>
      <p className="mt-1 text-base font-black">{value}</p>
    </div>
  );
}
