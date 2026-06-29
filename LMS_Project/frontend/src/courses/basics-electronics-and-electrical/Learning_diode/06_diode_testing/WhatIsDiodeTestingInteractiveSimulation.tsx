"use client";

import { useEffect, useMemo, useState } from "react";

import { DiodeUnderTestSection } from "./DiodeUnderTestSection";
import { GuideSection } from "./GuideSection";
import { calculateNeedleRotation, calculateReading, runReadingTests } from "./logic";
import { MeterSection } from "./MeterSection";
import type { DiodeType, DisplayMode, MeterMode, Terminal } from "./types";

export default function WhatIsDiodeTestingInteractiveSimulation() {
  const [redTerminal, setRedTerminal] = useState<Terminal>("free");
  const [blackTerminal, setBlackTerminal] = useState<Terminal>("free");
  const [mode, setMode] = useState<DisplayMode>("digital");
  const [meterMode, setMeterMode] = useState<MeterMode>("diode");
  const [diodeType, setDiodeType] = useState<DiodeType>("good");

  useEffect(() => {
    runReadingTests();
  }, []);

  const isConnected =
    redTerminal !== "free" && blackTerminal !== "free" && redTerminal !== blackTerminal;
  const isForward = redTerminal === "anode" && blackTerminal === "cathode";

  const reading = useMemo(
    () =>
      calculateReading({
        connected: isConnected,
        meterMode,
        diodeType,
        forward: isForward,
      }),
    [isConnected, meterMode, diodeType, isForward],
  );

  const analogRotation = useMemo(
    () =>
      calculateNeedleRotation({
        connected: isConnected,
        meterMode,
        diodeType,
        forward: isForward,
      }),
    [isConnected, meterMode, diodeType, isForward],
  );

  const analogStatus = useMemo(() => {
    if (meterMode === "off") return "Meter selector is OFF";
    if (!isConnected) return "Snap both probes to opposite diode terminals";
    if (diodeType === "short") return "Short circuit: needle moves fully right";
    if (diodeType === "open") return "Open diode: needle stays at OL";
    if (meterMode === "diode" && isForward) return "Forward junction: normal silicon voltage drop";
    if (meterMode === "resistance" && isForward) return "Forward resistance region";
    return "Reverse blocking: OL";
  }, [isConnected, diodeType, isForward, meterMode]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_center,#f8fafc,#d1d5db,#9ca3af)] p-3 text-gray-950 sm:p-4 md:p-8">
      <section className="mx-auto w-full max-w-6xl rounded-2xl border border-gray-500 bg-gradient-to-b from-gray-200 to-gray-400 p-3 shadow-2xl sm:rounded-3xl sm:p-4 md:p-8">
        <header className="mb-4 text-center sm:mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-700 sm:text-xs sm:tracking-[0.35em]">
            Industrial Training Bench
          </p>
          <h1 className="mt-2 text-2xl font-black leading-tight sm:text-3xl md:text-5xl">
            Pro Electronics Lab Simulator
          </h1>
          <p className="mt-2 text-xs text-gray-700 sm:text-sm">
            Probe snap terminals + rotary multimeter selector
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)] lg:gap-6">
          <div className="min-w-0 space-y-4 lg:space-y-6">
            <DiodeUnderTestSection
              redTerminal={redTerminal}
              blackTerminal={blackTerminal}
              isConnected={isConnected}
              isForward={isForward}
              onSetRedTerminal={setRedTerminal}
              onSetBlackTerminal={setBlackTerminal}
            />
          </div>

          <aside className="min-w-0 space-y-4 lg:space-y-6">
            <MeterSection
              mode={mode}
              meterMode={meterMode}
              diodeType={diodeType}
              isConnected={isConnected}
              reading={reading}
              analogRotation={analogRotation}
              analogStatus={analogStatus}
              onToggleMode={() => setMode((value) => (value === "digital" ? "analog" : "digital"))}
              onResetProbes={() => {
                setRedTerminal("free");
                setBlackTerminal("free");
              }}
              onSetDiodeType={setDiodeType}
              onSetMeterMode={setMeterMode}
            />
            <GuideSection />
          </aside>
        </div>

        {isConnected && meterMode === "continuity" && diodeType === "short" && (
          <audio autoPlay>
            <source src="/beep.mp3" type="audio/mpeg" />
          </audio>
        )}
      </section>
    </main>
  );
}
