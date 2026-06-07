"use client";

import type { BiasMode } from "./types";

export function BiasDetailsSection({
  isForward,
  currentLevel,
}: {
  isForward: boolean;
  currentLevel: number;
}) {
  if (isForward) {
    return (
      <div className="rounded border border-green-200 bg-green-50 p-3">
        <h3 className="font-bold text-green-700">Forward Condition এ ভিতরে কী হয়?</h3>
        <ul className="ml-5 list-disc space-y-1 text-sm text-slate-700">
          <li>Battery-এর positive voltage Anode-এ apply হয়।</li>
          <li>Voltage 0.7V-এর বেশি হলে PN junction-এর barrier কমে যায়।</li>
          <li>Depletion region ছোট হয়, তাই carrier সহজে cross করতে পারে।</li>
          <li>Current level: {(currentLevel * 100).toFixed(0)}%</li>
          <li>LED-এর ভিতরে electron-hole recombination হয় → আলো বের হয়।</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="rounded border border-red-200 bg-red-50 p-3">
      <h3 className="font-bold text-red-700">Reverse Condition এ ভিতরে কী হয়?</h3>
      <ul className="ml-5 list-disc space-y-1 text-sm text-slate-700">
        <li>Battery polarity উল্টো হয়ে যায়।</li>
        <li>PN junction-এর barrier বেড়ে যায়।</li>
        <li>Depletion region বড় হয়, তাই carrier cross করতে পারে না।</li>
        <li>Current প্রায় flow করে না।</li>
        <li>LED-এ recombination হয় না → আলো জ্বলে না।</li>
      </ul>
    </div>
  );
}
