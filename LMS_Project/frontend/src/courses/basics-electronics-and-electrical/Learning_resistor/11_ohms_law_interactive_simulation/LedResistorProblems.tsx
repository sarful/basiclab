"use client";

import { formatNumber, formatResistance, nearestStandardResistor } from "./logic";
import type { LedProblem } from "./types";

export function LedResistorProblems({ supplyVoltage }: { supplyVoltage: number }) {
  const problems: LedProblem[] = [
    {
      color: "green",
      label: "Green LED",
      emoji: "🟢",
      supplyVoltage,
      ledDrop: 2.2,
      currentMa: 20,
      safeCurrentMa: 20,
      className: "bg-green-50 text-green-700",
    },
    {
      color: "red",
      label: "Red LED",
      emoji: "🔴",
      supplyVoltage,
      ledDrop: 2,
      currentMa: 20,
      safeCurrentMa: 20,
      className: "bg-red-50 text-red-700",
    },
    {
      color: "yellow",
      label: "Yellow LED",
      emoji: "🟡",
      supplyVoltage,
      ledDrop: 2.1,
      currentMa: 20,
      safeCurrentMa: 20,
      className: "bg-yellow-50 text-yellow-700",
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <h2 className="mb-4 font-semibold text-slate-900">LED Resistor Calculation Practice</h2>
      <p className="mb-4 text-sm text-slate-600">Formula: R = (Vs - Vled) / I</p>

      <div className="grid gap-4 md:grid-cols-3">
        {problems.map((problem) => {
          const currentAmp = problem.currentMa / 1000;
          const resistorValue = Math.max(0, (problem.supplyVoltage - problem.ledDrop) / currentAmp);
          const roundedResistor = nearestStandardResistor(resistorValue);

          return (
            <div key={problem.color} className={`rounded-2xl p-4 ${problem.className}`}>
              <p className="font-semibold">
                {problem.emoji} {problem.label}
              </p>
              <p className="mt-2 text-sm text-slate-700">Supply: {problem.supplyVoltage}V</p>
              <p className="text-sm text-slate-700">LED drop: {problem.ledDrop}V</p>
              <p className="text-sm text-slate-700">Target current: {problem.currentMa}mA</p>
              <p className="text-sm font-semibold text-slate-900">Safe current: {problem.safeCurrentMa}mA</p>
              <p className="mt-3 text-sm font-medium text-slate-900">
                R = ({problem.supplyVoltage} - {problem.ledDrop}) / {currentAmp} = {formatNumber(resistorValue, 0)}Ω
              </p>
              {problem.supplyVoltage <= problem.ledDrop ? (
                <p className="mt-1 text-sm font-bold text-red-600">Supply is too low for this LED</p>
              ) : (
                <p className="mt-1 text-sm font-bold text-slate-900">Use nearest standard: {formatResistance(roundedResistor)}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
