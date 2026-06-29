"use client";

import type { ReactNode } from "react";

function ScriptBlock({
  title,
  cue,
  children,
}: {
  title: string;
  cue?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        {cue ? (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-700">
            {cue}
          </span>
        ) : null}
      </div>

      <div className="mt-3 space-y-3 text-sm leading-7 text-slate-700">
        {children}
      </div>
    </section>
  );
}

function EmphasisLine({ children }: { children: ReactNode }) {
  return <p className="font-semibold text-slate-950">{children}</p>;
}

function PauseCue({ label = "Pause" }: { label?: string }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
      [{label}]
    </p>
  );
}

export default function UdemyScriptNoteBanglaTab() {
  return (
    <div className="space-y-4">
      <section className="rounded-[36px] border border-slate-200 bg-white p-10 shadow-[0_18px_44px_rgba(15,23,42,0.10)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-amber-700">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Udemy Script Note Bangla
        </div>

        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          বিদ্যুৎ কী?
        </h1>

        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          এই version-টি teleprompter-friendly style-এ লেখা, যাতে তুমি সরাসরি
          beginner-friendly video record করতে পারো।
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Recording-এর আগে">
        <p>এই lesson-এর goal খুব simple.</p>
        <p>
          Students যেন বুঝতে পারে, বিদ্যুৎ হলো electric charge-এর flow একটি
          complete closed path-এর মধ্যে।
        </p>
        <p>তারা যেন আরও চারটি basic idea ধরতে পারে।</p>
        <p>Metal wire-এর ভেতরে electron charge বহন করে।</p>
        <p>Voltage push দেয়.</p>
        <p>Resistance movement কমায়.</p>
        <p>Current actual flow দেখায়.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>আসসালামু আলাইকুম বা হ্যালো, সবাইকে স্বাগতম।</p>
        <PauseCue />
        <p>এই lesson-এ আমরা একটি basic কিন্তু খুব important question বুঝব।</p>
        <p>বিদ্যুৎ কী?</p>
        <PauseCue label="Short Pause" />
        <p>তুমি যদি একদম beginner হও, তবুও কোনো সমস্যা নেই।</p>
        <p>আমরা সহজ ভাষায়, clear way-তে, step by step বিষয়টি বুঝব।</p>
        <EmphasisLine>
          এক লাইনে বললে, বিদ্যুৎ হলো electric charge-এর flow একটি complete
          closed path-এর মধ্যে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Basic Idea" cue="ধীরে বোঝাও">
        <p>এখন idea-টা আরও সহজ করি।</p>
        <PauseCue />
        <p>Electric charge move করার জন্য একটি path দরকার।</p>
        <p>
          Metal wire-এর ভেতরে electron নামের ছোট particle electric charge বহন
          করে।
        </p>
        <p>যদি path broken হয়, charge move করতে পারে না।</p>
        <p>
          যদি path complete এবং closed হয়, charge circuit-এর মধ্যে flow করতে
          পারে।
        </p>
        <PauseCue label="গুরুত্ব দাও" />
        <EmphasisLine>
          বিদ্যুৎ কাজ করতে হলে complete closed circuit path দরকার।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Battery দেখাও" cue="Battery দেখাও">
        <p>এখন simulation-এ battery-এর দিকে তাকাও।</p>
        <PauseCue label="Battery দেখাও" />
        <p>Battery হলো source।</p>
        <p>Source voltage দেয়।</p>
        <p>Voltage মানে electrical push।</p>
        <EmphasisLine>
          এই push charge-কে circuit-এর মধ্যে চালাতে চায়।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Resistor দেখাও" cue="Resistor দেখাও">
        <p>এবার resistor-এর দিকে তাকাও।</p>
        <PauseCue label="Resistor দেখাও" />
        <p>Resistance charge-এর movement-কে harder করে তোলে।</p>
        <p>তাই এখন দুইটা জিনিস একসাথে কাজ করছে।</p>
        <EmphasisLine>
          Voltage push দিচ্ছে। Resistance flow কমাচ্ছে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Current value দেখাও" cue="Current দেখাও">
        <p>এই movement-এর final result-কে বলা হয় current।</p>
        <PauseCue label="Current দেখাও" />
        <p>Current আমাদের বলে circuit-এ আসলে কত electric charge flow করছে।</p>
        <p>এই lesson-এ battery দিচ্ছে 12 volts।</p>
        <p>Resistor হলো 6 ohms।</p>
        <p>এই combination-এর কারণে current হচ্ছে 2 amps।</p>
        <EmphasisLine>
          তাই students clearly দেখতে পারে, বিদ্যুৎ random না। এটি clear path এবং
          clear relationship follow করে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Water Analogy" cue="Analogy use করো">
        <p>এখন বিষয়টি আরও সহজে কল্পনা করি।</p>
        <PauseCue />
        <p>ভাবো, একটি pipe-এর মধ্যে পানি flow করছে।</p>
        <p>Voltage হলো water pressure-এর মতো।</p>
        <p>Current হলো কত পানি বাস্তবে flow করছে, তার মতো।</p>
        <p>
          Resistance হলো narrow pipe-এর মতো, যা পানি flow-কে harder করে তোলে।
        </p>
        <EmphasisLine>
          এই analogy beginner-দের circuit-এর ভেতরের idea কল্পনা করতে সাহায্য
          করে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Real-World Example" cue="বাস্তব উদাহরণ">
        <p>এখন একটি simple torch light-এর কথা ভাবো।</p>
        <PauseCue label="উদাহরণ দাও" />
        <p>যদি switch open থাকে, path broken থাকে।</p>
        <p>Path broken থাকলে charge properly flow করতে পারে না।</p>
        <p>তাই light জ্বলে না।</p>
        <p>যদি switch close হয়, path complete হয়ে যায়।</p>
        <p>তখন charge lamp-এর মধ্য দিয়ে move করতে পারে, এবং light জ্বলে।</p>
        <p>
          এই একই basic idea home lighting, control panel, sensor circuit এবং
          অনেক electronic device-এ ব্যবহৃত হয়।
        </p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Safety Note" cue="Important">
        <p>আগে একটি important safety point মনে রাখি।</p>
        <PauseCue label="Safety গুরুত্ব দাও" />
        <p>এই lesson শুধুমাত্র basic concept বোঝার জন্য।</p>
        <p>
          Real electrical system proper knowledge এবং safety rules ছাড়া handle
          করা dangerous হতে পারে।
        </p>
        <EmphasisLine>
          Practical electrical work করার সময় সবসময় proper electrical safety
          rules follow করতে হবে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Short Recap" cue="Recap">
        <p>শেষ করার আগে, খুব short করে review করি।</p>
        <PauseCue />
        <p>বিদ্যুৎ মানে electric charge-এর flow।</p>
        <p>Complete closed path দরকার।</p>
        <p>Metal wire-এর ভেতরে electron charge বহন করে।</p>
        <p>Voltage push দেয়।</p>
        <p>Resistance movement কমায়।</p>
        <p>Current actual flow দেখায়।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Closing" cue="End">
        <p>তাই main idea খুব simple।</p>
        <PauseCue label="শেষে জোর দাও" />
        <EmphasisLine>
          বিদ্যুৎ হলো charge-এর movement একটি complete closed path-এর মধ্যে।
        </EmphasisLine>
        <p>এই idea clear হয়ে গেলে basic electronics অনেক সহজ লাগে।</p>
        <p>Next lesson-এ আমরা এই foundation-এর উপর আরও build করব।</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Direct Read">
        <p>
          আসসালামু আলাইকুম বা হ্যালো, সবাইকে স্বাগতম। এই lesson-এ আমরা একটি
          basic কিন্তু খুব important question বুঝব। বিদ্যুৎ কী?
        </p>

        <PauseCue label="Short Pause" />

        <p>
          তুমি যদি একদম beginner হও, তবুও কোনো সমস্যা নেই। আমরা সহজ ভাষায়, clear
          way-তে, step by step বিষয়টি বুঝব।
        </p>

        <p>
          এক লাইনে বললে, বিদ্যুৎ হলো electric charge-এর flow একটি complete
          closed path-এর মধ্যে।
        </p>

        <p>
          Electric charge move করার জন্য একটি path দরকার। Metal wire-এর ভেতরে
          electron নামের ছোট particle electric charge বহন করে। যদি path broken
          হয়, charge move করতে পারে না। যদি path complete এবং closed হয়, charge
          circuit-এর মধ্যে flow করতে পারে।
        </p>

        <PauseCue />

        <p>
          এখন simulation-এ battery-এর দিকে তাকাও। Battery হলো source। Source
          voltage দেয়। Voltage মানে electrical push। এই push charge-কে
          circuit-এর মধ্যে চালাতে চায়।
        </p>

        <p>
          এবার resistor-এর দিকে তাকাও। Resistance charge-এর movement-কে harder
          করে তোলে। তাই voltage push দেয়, resistance flow কমায়।
        </p>

        <p>
          এই movement-এর final result-কে বলা হয় current। Current আমাদের বলে
          circuit-এ আসলে কত electric charge flow করছে। এই lesson-এ battery
          দিচ্ছে 12 volts। Resistor হলো 6 ohms। এই combination-এর কারণে current
          হচ্ছে 2 amps।
        </p>

        <p>
          এখন বিষয়টি আরও সহজে কল্পনা করি। ভাবো, একটি pipe-এর মধ্যে পানি flow
          করছে। Voltage হলো water pressure-এর মতো। Current হলো কত পানি বাস্তবে
          flow করছে, তার মতো। Resistance হলো narrow pipe-এর মতো, যা পানি flow
          কঠিন করে তোলে।
        </p>

        <p>
          এখন একটি simple torch light-এর কথা ভাবো। যদি switch open থাকে, path
          broken থাকে, তাই light জ্বলে না। যদি switch close হয়, path complete
          হয়ে যায়। তখন charge lamp-এর মধ্য দিয়ে move করতে পারে, এবং light জ্বলে।
        </p>

        <p>
          একটি important safety note: এই lesson শুধুমাত্র basic concept বোঝার
          জন্য। Real electrical system proper knowledge এবং safety rules ছাড়া
          handle করা dangerous হতে পারে।
        </p>

        <p>
          তাই short recap করি। বিদ্যুৎ মানে electric charge-এর flow। Complete
          closed path দরকার। Metal wire-এর ভেতরে electron charge বহন করে।
          Voltage push দেয়। Resistance movement কমায়। Current actual flow দেখায়।
        </p>

        <PauseCue label="Final Pause" />

        <p>
          তাই main idea খুব simple: বিদ্যুৎ হলো charge-এর movement একটি complete
          closed path-এর মধ্যে। এই idea clear হয়ে গেলে basic electronics অনেক
          সহজ লাগে। Next lesson-এ আমরা এই foundation-এর উপর আরও build করব।
        </p>
      </ScriptBlock>
    </div>
  );
}
