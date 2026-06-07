"use client";

import { getWorkingState } from "./logic";
import type { BiasMode, Section } from "./types";

export function ExplanationSection({
  section,
  bias,
  voltage,
}: {
  section: Section;
  bias: BiasMode;
  voltage: number;
}) {
  const workingState = getWorkingState(bias, voltage);

  if (section === "construction") {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-xl font-bold">Construction: Beginner Explanation</h2>
        <ul className="ml-5 mt-2 list-disc space-y-2 text-slate-700">
          <li>ডায়োড দুটি semiconductor অংশ দিয়ে তৈরি: P-type এবং N-type।</li>
          <li>P-type side-এ holes (+) বেশি থাকে, N-type side-এ electrons (−) বেশি থাকে।</li>
          <li>P-side terminal হলো Anode, N-side terminal হলো Cathode।</li>
          <li>এই দুই অংশ যুক্ত হলেই মাঝখানে PN Junction তৈরি হয়।</li>
        </ul>
      </div>
    );
  }

  if (section === "formation") {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-xl font-bold">Formation: Beginner Explanation</h2>
        <ul className="ml-5 mt-2 list-disc space-y-2 text-slate-700">
          <li>Electron N side থেকে P side-এ যেতে চায়। Hole P side থেকে N side-এ যেতে চায়।</li>
          <li>Junction-এর কাছে electron এবং hole মিললে recombination হয়।</li>
          <li>Recombination-এর পর fixed ions থেকে যায়। এগুলো move করতে পারে না।</li>
          <li>এই fixed ions মিলেই depletion layer ও electric field তৈরি করে।</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      {bias === "forward" ? (
        <>
          <h2 className="text-xl font-bold">Working: Forward Bias</h2>
          <ul className="ml-5 mt-2 list-disc space-y-2 text-slate-700">
            <li>Battery-এর + diode-এর Anode side-এ যুক্ত হয়।</li>
            <li>Voltage 0.7V-এর বেশি হলে barrier কমে যায়, তাই current flow করে।</li>
            <li>বর্তমান voltage: {voltage.toFixed(1)}V</li>
            <li>LED brightness/current level: {(workingState.intensity * 100).toFixed(0)}%</li>
          </ul>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold">Working: Reverse Bias</h2>
          <ul className="ml-5 mt-2 list-disc space-y-2 text-slate-700">
            <li>Battery polarity উল্টোভাবে diode-এর সাথে যুক্ত হয়।</li>
            <li>Barrier বেড়ে যায়, তাই current block হয়।</li>
            <li>Voltage {voltage.toFixed(1)}V হলেও reverse bias-এ LED OFF থাকে।</li>
          </ul>
        </>
      )}
    </div>
  );
}
