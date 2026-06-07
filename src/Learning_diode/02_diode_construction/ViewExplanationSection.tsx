"use client";

import type { LayerView } from "./types";

export function ViewExplanationSection({ view }: { view: LayerView }) {
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      {view === "basic" && (
        <>
          <h2 className="text-xl font-bold">Basic Structure (শুরুর ধারণা)</h2>
          <ul className="ml-5 list-disc space-y-2 text-slate-700">
            <li>ডায়োড দুইটা অংশ দিয়ে তৈরি: P-type এবং N-type।</li>
            <li>P-type side-এ hole (+) বেশি থাকে।</li>
            <li>N-type side-এ electron (−) বেশি থাকে।</li>
            <li>এই দুই অংশ একসাথে যুক্ত হলেই diode তৈরি হয়।</li>
          </ul>
        </>
      )}

      {view === "doping" && (
        <>
          <h2 className="text-xl font-bold">Doping (Carrier কী আছে?)</h2>
          <ul className="ml-5 list-disc space-y-2 text-slate-700">
            <li>P-type-এ hole (+) গুলো move করতে পারে।</li>
            <li>N-type-এ electron (−) গুলো move করতে পারে।</li>
            <li>এই moving charge গুলোকে carrier বলা হয়।</li>
            <li>এগুলিই পরে current flow করবে।</li>
          </ul>
        </>
      )}

      {view === "junction" && (
        <>
          <h2 className="text-xl font-bold">PN Junction (মাঝখানে কী হয়?)</h2>
          <ul className="ml-5 list-disc space-y-2 text-slate-700">
            <li>P-type এবং N-type মিললে মাঝখানে junction তৈরি হয়।</li>
            <li>Electron ও hole একে অপরকে cancel করে দেয়।</li>
            <li>ফলে মাঝখানে carrier কমে যায়।</li>
            <li>এই অংশকে depletion layer বলা হয়।</li>
          </ul>
        </>
      )}

      {view === "formation" && (
        <>
          <h2 className="text-xl font-bold">Formation Animation (কিভাবে তৈরি হয়)</h2>
          <ul className="ml-5 list-disc space-y-2 text-slate-700">
            <li>Electron N থেকে P দিকে যেতে চায় (diffusion)।</li>
            <li>Hole P থেকে N দিকে যেতে চায়।</li>
            <li>দুজন মিললে recombination হয় (flash দেখানো হয়েছে)।</li>
            <li>এর ফলে fixed ion থেকে যায় (move করতে পারে না)।</li>
            <li>মাঝখানে depletion layer তৈরি হয়।</li>
            <li>এই layer একটা barrier হিসেবে কাজ করে।</li>
          </ul>
        </>
      )}
    </div>
  );
}
