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
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
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

function PauseCue({ label = "Pause" }: { label?: string }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">
      [{label}]
    </p>
  );
}

export default function UdemyScriptNoteBanglaTab() {
  return (
    <div className="space-y-4">
      <section className="rounded-[36px] border border-slate-200 bg-white p-10 shadow-[0_18px_44px_rgba(15,23,42,0.10)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Udemy Script Bangla
        </div>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          রেজিস্ট্যান্স মাপা
        </h1>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>এই lesson-এর goal হলো সঠিক resistance-measurement habit তৈরি করা.</p>
        <p>Student যেন বুঝতে পারে resistance power off অবস্থায় measure হয়.</p>
        <p>তারা যেন তিনটি setup rule-ও মনে রাখতে পারে.</p>
        <p>Black lead COM-এ থাকে.</p>
        <p>Red lead V ohm milliamp jack-এ থাকে.</p>
        <p>Dial-কে ohms family-তে রাখতে হবে, আর probe-কে resistor-এর across বসাতে হবে.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Intro" cue="Opening">
        <p>সবাইকে স্বাগতম.</p>
        <PauseCue />
        <p>আগের lesson-গুলোতে আমরা voltage আর current measurement practice করেছি.</p>
        <p>এখন আমরা meter-এর আরেকটি গুরুত্বপূর্ণ job-এ যাচ্ছি.</p>
        <p>সেই কাজ হলো resistance measure করা.</p>
        <PauseCue label="Short Pause" />
        <p>
          Resistance measure করা মানে কোনো component current flow-কে কত strongly
          oppose করছে সেটা দেখা.
        </p>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Main Idea" cue="Teach Slowly">
        <p>এই lesson-এর সবচেয়ে important idea হলো একটাই.</p>
        <p>Resistance power off অবস্থায় measure হয়.</p>
        <p>Meter নিজের internal test method ব্যবহার করে.</p>
        <p>তাই ohms measurement-কে live powered circuit-এর সাথে একসাথে করা যায় না.</p>
        <PauseCue label="Emphasize" />
        <p>আগে power off করো, তারপর resistance measure করো.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Lead Placement" cue="Point to Meter">
        <p>Component touch করার আগে lead position check করতে হবে.</p>
        <p>Black lead COM-এ থাকে.</p>
        <p>Red lead V ohm milliamp jack-এ থাকে.</p>
        <p>Resistance check-এর জন্য red lead-কে 10A jack-এ নেওয়া যাবে না.</p>
        <p>ওই jack high current-এর জন্য, ohms measurement-এর জন্য না.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Dial Family and Range" cue="Dial Check">
        <p>এরপর dial-এ সঠিক family select করতে হবে.</p>
        <p>এই lesson-এ family হলো ohms family, যেটা omega symbol দিয়ে দেখানো হয়.</p>
        <p>220 ohm বা 680 ohm resistor lower ohms range-এ ভালো fit করে.</p>
        <p>2.2 kilo-ohm resistor-এর জন্য higher range লাগে, যেমন 20k.</p>
        <PauseCue label="Slow Down" />
        <p>Expected resistor value-ই best ohms range choose করতে সাহায্য করে.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Probe Placement" cue="Across the Resistor">
        <p>এখন resistor-এর দিকে focus করি.</p>
        <p>Resistance ঠিকভাবে measure করতে একটি probe এক terminal-এ আরেকটি probe অন্য terminal-এ বসাতে হয়.</p>
        <p>এর মানে meter component-এর across measure করছে.</p>
        <p>যদি দুই probe একই side-এ থাকে, তাহলে reading lesson-এর জন্য meaningful হবে না.</p>
        <p>সঠিক value দেখাতে meter-কে দুই resistor lead bridge করতে হবে.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Display Reading" cue="Point to LCD">
        <p>Setup ঠিক থাকলে display resistor value দেখায়.</p>
        <p>একটি low-value resistor প্রায় 220 ohm দেখাতে পারে.</p>
        <p>আরেকটি resistor প্রায় 680 ohm দেখাতে পারে.</p>
        <p>একটি বড় resistor প্রায় 2.20 kilo-ohm দেখাতে পারে.</p>
        <p>Reading নির্ভর করে resistor-এর real value আর selected ohms range-এর উপর.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Common Mistakes" cue="Safety">
        <p>এখন common beginner mistake-গুলো দেখি.</p>
        <PauseCue />
        <p>Live powered circuit-এ resistance measure করা যাবে না.</p>
        <p>Dial-কে voltage বা current mode-এ ফেলে রাখা যাবে না.</p>
        <p>Ohms test-এর জন্য 10A jack ব্যবহার করা যাবে না.</p>
        <p>আর দুই probe-কে resistor-এর একই side-এ রাখা যাবে না.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Practical Mindset" cue="Real Work">
        <p>Resistance measurement-কে একটি clear question হিসেবে ভাবো.</p>
        <p>এই component current flow-কে কত resist করছে?</p>
        <p>এই resistor কি expected value-এর কাছাকাছি?</p>
        <p>আমি কি সঠিক range নিয়েছি এবং probe ঠিকভাবে বসিয়েছি?</p>
        <p>ভালো troubleshooting এই simple, careful check দিয়েই শুরু হয়.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Recap" cue="Review">
        <p>একবার main lesson recap করি.</p>
        <p>Resistance বোঝায় কোনো component current flow-কে কত strongly oppose করে.</p>
        <p>Resistance power off অবস্থায় measure হয়.</p>
        <p>Meter-কে ohms family-তে রাখতে হয়.</p>
        <p>Black lead COM-এ আর red lead V ohm milliamp jack-এ থাকে.</p>
        <p>একটি probe resistor-এর এক terminal-এ, আরেকটি অন্য terminal-এ যায়.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Closing" cue="End">
        <p>এখন আপনি multimeter-এর আরেকটি practical skill শিখে ফেলেছেন.</p>
        <PauseCue label="Final Emphasis" />
        <p>
          Power off করো, ohms family choose করো, আর resistor-এর across এক পাশে
          এক probe আর অন্য পাশে আরেক probe বসিয়ে measure করো.
        </p>
        <p>
          পরের lesson-গুলোতে আমরা practical measurement confidence ধাপে ধাপে
          আরও বাড়াব.
        </p>
      </ScriptBlock>
    </div>
  );
}
