"use client";

import { useMemo, useState } from "react";

import { ControlPanelSection } from "./ControlPanelSection";
import { FixedResistorVisual } from "./FixedResistorVisual";
import { KnowledgeSection } from "./KnowledgeSection";
import { fixedTypes, formatCurrent, formatNumber, formatResistance } from "./logic";
import type { FixedTypeKey } from "./types";

export default function WhatIsFixedResistorInteractiveSimulation({ embedded = false }: { embedded?: boolean }) {
  const [typeKey, setTypeKey] = useState<FixedTypeKey>("metalFilm");
  const [resistance, setResistance] = useState(1000);
  const [voltage, setVoltage] = useState(5);
  const [tolerance, setTolerance] = useState(1);
  const [powerRating, setPowerRating] = useState(0.25);

  const selected = fixedTypes.find((item) => item.key === typeKey) || fixedTypes[1];
  const current = voltage / resistance;
  const power = current * current * resistance;
  const minValue = resistance * (1 - tolerance / 100);
  const maxValue = resistance * (1 + tolerance / 100);
  const isOverloaded = power > powerRating;

  const recommendedPower = useMemo(() => {
    if (power <= 0.125) return "1/4W recommended";
    if (power <= 0.25) return "1/2W recommended";
    if (power <= 0.5) return "1W recommended";
    if (power <= 1) return "2W recommended";
    return "High watt resistor needed";
  }, [power]);

  function applyType(key: FixedTypeKey) {
    const next = fixedTypes.find((item) => item.key === key) || fixedTypes[1];
    setTypeKey(key);
    setTolerance(next.toleranceOptions[0]);
    setPowerRating(next.powerOptions[0]);
  }

  return (
    <div className={embedded ? "text-slate-800" : "min-h-screen bg-white p-3 text-slate-800 sm:p-6"}>
      <div className={embedded ? "space-y-5" : "mx-auto max-w-7xl space-y-5"}>
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-5 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-blue-600">Interactive Electronics Trainer</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">ফিক্সড রেজিস্টর — Interactive Simulation</h1>
          <p className="mt-2 text-sm text-slate-600">Fixed resistor-এর value স্থির থাকে। Tolerance, power rating এবং type অনুযায়ী circuit behavior কেমন বদলায় দেখুন।</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Current</p>
            <p className="mt-2 text-3xl font-bold text-green-600">{formatCurrent(current)}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Power</p>
            <p className={`mt-2 text-3xl font-bold ${isOverloaded ? "text-red-600" : "text-orange-600"}`}>{formatNumber(power, 3)} W</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Tolerance Range</p>
            <p className="mt-2 text-sm font-bold text-blue-600">
              {formatResistance(minValue)} → {formatResistance(maxValue)}
            </p>
          </div>

          <div className={`rounded-2xl border p-4 shadow-sm ${isOverloaded ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</p>
            <p className={`mt-2 text-2xl font-bold ${isOverloaded ? "text-red-600" : "text-green-600"}`}>{isOverloaded ? "OVERLOAD" : "SAFE"}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <ControlPanelSection
            fixedTypes={fixedTypes}
            selected={selected}
            resistance={resistance}
            voltage={voltage}
            tolerance={tolerance}
            powerRating={powerRating}
            onTypeChange={applyType}
            onResistanceChange={setResistance}
            onVoltageChange={setVoltage}
            onToleranceChange={setTolerance}
            onPowerRatingChange={setPowerRating}
          />

          <div className="lg:col-span-2">
            <FixedResistorVisual type={selected} resistance={resistance} tolerance={tolerance} powerRating={powerRating} voltage={voltage} />
          </div>
        </div>

        <KnowledgeSection selected={selected} power={power} recommendedPower={recommendedPower} />
      </div>
    </div>
  );
}
