"use client";

import { useMemo, useState } from "react";

import ControlPanelSection from "./ControlPanelSection";
import { calculateBaseCurrent, clamp, formatNumber } from "./logic";
import LayerCard from "./LayerCard";
import StructureVisual from "./StructureVisual";
import type { TransistorType } from "./types";

export default function WhatIsTransistorStructureInteractiveSimulation() {
  const [transistorType, setTransistorType] = useState<TransistorType>("NPN");
  const [active, setActive] = useState(true);
  const [dopingLevel, setDopingLevel] = useState(70);
  const [collectorVoltage, setCollectorVoltage] = useState(9);
  const [baseVoltage, setBaseVoltage] = useState(1.2);
  const [baseResistance, setBaseResistance] = useState(10000);
  const [loadResistance, setLoadResistance] = useState(300);

  const transistorGain = useMemo(
    () => clamp(dopingLevel * 2, 20, 200),
    [dopingLevel],
  );
  const baseCurrent = useMemo(
    () => calculateBaseCurrent(active, baseVoltage, baseResistance),
    [active, baseVoltage, baseResistance],
  );
  const isBiased = baseCurrent >= 0.00002;
  const collectorCurrent = useMemo(
    () =>
      isBiased
        ? clamp(baseCurrent * transistorGain, 0, collectorVoltage / loadResistance)
        : 0,
    [isBiased, baseCurrent, transistorGain, collectorVoltage, loadResistance],
  );
  const lampGlow = useMemo(
    () => clamp(collectorCurrent / Math.max(collectorVoltage / loadResistance, 0.00001), 0, 1),
    [collectorCurrent, collectorVoltage, loadResistance],
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-green-50 via-white to-blue-50 p-5 shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-green-700">
            Semiconductor Learning Lab
          </p>
          <h3 className="mt-2 text-2xl font-black text-slate-900 sm:text-4xl">
            Transistor Structure - Interactive Simulation
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            This simulation shows how the three transistor regions - Emitter,
            Base, and Collector - work together using a realtime structure and
            carrier-flow view.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Type</p>
            <p className="mt-3 text-3xl font-black text-green-700">
              {transistorType}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Gain</p>
            <p className="mt-3 text-3xl font-black text-blue-700">
              Beta {formatNumber(transistorGain, 0)}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Carrier Flow
            </p>
            <p className="mt-3 text-3xl font-black text-cyan-700">
              {active && isBiased ? "ON" : active ? "LOW" : "OFF"}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Collector Current
            </p>
            <p className="mt-3 text-3xl font-black text-orange-600">
              {formatNumber(collectorCurrent * 1000, 1)}mA
            </p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <ControlPanelSection
            transistorType={transistorType}
            setTransistorType={setTransistorType}
            active={active}
            setActive={setActive}
            dopingLevel={dopingLevel}
            setDopingLevel={setDopingLevel}
            collectorVoltage={collectorVoltage}
            setCollectorVoltage={setCollectorVoltage}
            baseVoltage={baseVoltage}
            setBaseVoltage={setBaseVoltage}
            baseResistance={baseResistance}
            setBaseResistance={setBaseResistance}
            loadResistance={loadResistance}
            setLoadResistance={setLoadResistance}
          />

          <div className="xl:col-span-2">
            <StructureVisual
              transistorType={transistorType}
              active={active}
              dopingLevel={dopingLevel}
              collectorVoltage={collectorVoltage}
              baseVoltage={baseVoltage}
              baseResistance={baseResistance}
              loadResistance={loadResistance}
            />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <LayerCard
            title="Emitter Layer"
            color="#16a34a"
            doping="Heavily Doped"
            description="The emitter is heavily doped and supplies the charge carriers."
          />

          <LayerCard
            title="Base Layer"
            color="#facc15"
            doping="Lightly Doped"
            description="The base is very thin and lightly doped, so a small base current can control a much larger collector current."
          />

          <LayerCard
            title="Collector Layer"
            color="#2563eb"
            doping="Moderately Doped"
            description="The collector gathers the emitted carriers and carries the output current."
          />
        </div>
      </div>
    </div>
  );
}
