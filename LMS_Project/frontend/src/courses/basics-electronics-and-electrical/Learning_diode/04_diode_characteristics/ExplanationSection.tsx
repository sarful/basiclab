"use client";

import { getCharacteristicPoint, getWorkingState } from "./logic";
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
  const working = getWorkingState(bias, voltage);
  const chart = getCharacteristicPoint(voltage);

  if (section === "characteristics") {
    // return (
    //   <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
    //     <h2 className="text-xl font-bold">Characteristics: সহজ ব্যাখ্যা</h2>
    //     <ul className="ml-5 mt-2 list-disc space-y-2 text-slate-700">
    //       <li>0.7V-এর নিচে diode প্রায় current flow করতে দেয় না।</li>
    //       <li>0.7V পার হলে current দ্রুত বাড়তে শুরু করে।</li>
    //       <li>লাল dot এখনকার voltage/current point দেখায়।</li>
    //       <li>
    //         এখন voltage {voltage.toFixed(1)}V এবং approximate current{" "}
    //         {chart.currentMA.toFixed(1)}mA।
    //       </li>
    //     </ul>
    //   </div>
    // );
  }

  // return (
  //   <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
  //     {bias === "forward" ? (
  //       <>
  //         <h2 className="text-xl font-bold">Working: Forward Bias</h2>
  //         <ul className="ml-5 mt-2 list-disc space-y-2 text-slate-700">
  //           <li>Battery-এর + diode-এর Anode side-এ যুক্ত হয়।</li>
  //           <li>Voltage 0.7V-এর বেশি হলে barrier কমে যায়, তাই current flow করে।</li>
  //           <li>বর্তমান voltage: {voltage.toFixed(1)}V</li>
  //           <li>Current level: {(working.intensity * 100).toFixed(0)}%</li>
  //           <li>Current থাকলে LED জ্বলে।</li>
  //         </ul>
  //       </>
  //     ) : (
  //       <>
  //         <h2 className="text-xl font-bold">Working: Reverse Bias</h2>
  //         <ul className="ml-5 mt-2 list-disc space-y-2 text-slate-700">
  //           <li>Battery polarity উল্টোভাবে diode-এর সাথে যুক্ত হয়।</li>
  //           <li>Barrier বেড়ে যায়, তাই current block হয়।</li>
  //           <li>Voltage {voltage.toFixed(1)}V হলেও reverse bias-এ LED OFF থাকে।</li>
  //         </ul>
  //       </>
  //     )}
  //   </div>
  // );
}
