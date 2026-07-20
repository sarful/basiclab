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
          কারেন্ট মাপা
        </h1>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>এই lesson-এর goal হলো সঠিক current-measurement habit তৈরি করা.</p>
        <p>Student যেন বুঝতে পারে current series-এ measure হয়, source-এর across না.</p>
        <p>তারা যেন তিনটি setup rule-ও মনে রাখতে পারে.</p>
        <p>Black lead COM-এ থাকে.</p>
        <p>Small current-এর জন্য V ohm milliamp jack ব্যবহার হয়.</p>
        <p>Higher current-এর জন্য dedicated 10A jack আর 10A range লাগতে পারে.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Intro" cue="Opening">
        <p>সবাইকে স্বাগতম.</p>
        <PauseCue />
        <p>আগের lesson-এ আমরা voltage measure করা শিখেছি.</p>
        <p>এখন আমরা পরের practical job-এ যাচ্ছি.</p>
        <p>সেই কাজ হলো current measure করা.</p>
        <PauseCue label="Short Pause" />
        <p>
          Current measure করা মানে circuit path-এর ভিতর দিয়ে কত electrical
          flow যাচ্ছে সেটা দেখা.
        </p>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Main Idea" cue="Teach Slowly">
        <p>এই lesson-এর সবচেয়ে important idea হলো একটাই.</p>
        <p>Current-কে meter-এর ভিতর দিয়ে flow করতে হবে.</p>
        <p>তার মানে meter-কে voltage test-এর মতো ব্যবহার করা যাবে না.</p>
        <p>এটাকে source-এর across বসানো যাবে না.</p>
        <p>Path open করে meter-কে series-এ insert করতে হবে.</p>
        <PauseCue label="Emphasize" />
        <p>Current series-এ measure হয়, source-এর across না.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Lead Placement" cue="Point to Meter">
        <p>Circuit touch করার আগে lead position check করতে হবে.</p>
        <p>Black lead COM-এ থাকে.</p>
        <p>Small current test-এর জন্য red lead V ohm milliamp jack-এ থাকে.</p>
        <p>Higher current test-এর জন্য red lead-কে 10A jack-এ নিতে হতে পারে.</p>
        <p>এটা expected current range-এর উপর নির্ভর করে.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Dial Family and Range" cue="Dial Check">
        <p>এরপর dial-এ সঠিক family select করতে হবে.</p>
        <p>এই lesson-এ family হলো DCA, কারণ scenario-গুলো DC current test.</p>
        <p>একটি small sensor loop-এর জন্য 20 milliamp বা 200 milliamp range লাগতে পারে.</p>
        <p>একটি বড় load-এর জন্য 10A range লাগতে পারে.</p>
        <PauseCue label="Slow Down" />
        <p>Expected current-ই dial range আর red jack choice ঠিক করে.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Series Placement" cue="Open the Circuit">
        <p>এখন path-এর দিকে focus করি.</p>
        <p>Current measure করতে circuit path-এ একটি open gap তৈরি করতে হয়.</p>
        <p>তারপর meter lead দিয়ে সেই gap bridge করতে হয়.</p>
        <p>Red probe সাধারণত source side-এ যায়.</p>
        <p>Black probe সাধারণত load side-এ যায়.</p>
        <p>এভাবে current load-এ যাওয়ার আগে meter-এর ভিতর দিয়ে যায়.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Display Reading" cue="Point to LCD">
        <p>Setup ঠিক থাকলে display current reading দেখায়.</p>
        <p>একটি small sensor loop প্রায় 18.5 milliamp দেখাতে পারে.</p>
        <p>একটি moderate DC load প্রায় 160 milliamp দেখাতে পারে.</p>
        <p>একটি high-current test প্রায় 8.40 amp দেখাতে পারে.</p>
        <p>Probe reverse হলে reading negative হতে পারে.</p>
        <p>এই negative sign current direction reference reverse হয়েছে সেটা বোঝায়.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Common Mistakes" cue="Safety">
        <p>এখন common beginner mistake-গুলো দেখি.</p>
        <PauseCue />
        <p>Current-কে voltage-এর মতো measure করা যাবে না.</p>
        <p>যে test-এ 10A লাগে সেখানে red lead-কে small-current jack-এ ফেলে রাখা যাবে না.</p>
        <p>Test শেষ হওয়ার পর red lead-কে 10A jack-এ ফেলে রাখাও যাবে না.</p>
        <p>আর path open করতে ভুললে চলবে না, কারণ current-কে meter-এর ভিতর দিয়ে যেতে হবে.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Practical Mindset" cue="Real Work">
        <p>Current measurement-কে একটি clear question হিসেবে ভাবো.</p>
        <p>এই path-এর ভিতর দিয়ে আসলে কত flow যাচ্ছে?</p>
        <p>Load কি expected amount-এর current নিচ্ছে?</p>
        <p>আমি কি এই job-এর জন্য সঠিক jack আর range ব্যবহার করছি?</p>
        <p>ভালো troubleshooting এই careful question-গুলো দিয়েই শুরু হয়.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Recap" cue="Review">
        <p>একবার main lesson recap করি.</p>
        <p>Current electrical flow-এর amount বোঝায়.</p>
        <p>Current series-এ measure হয়.</p>
        <p>Black lead COM-এ থাকে.</p>
        <p>Small current-এর জন্য V ohm milliamp jack ব্যবহার হয়.</p>
        <p>Higher current-এর জন্য 10A jack আর 10A range লাগতে পারে.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Closing" cue="End">
        <p>এখন আপনি multimeter-এর আরেকটি practical skill শিখে ফেলেছেন.</p>
        <PauseCue label="Final Emphasis" />
        <p>
          Path open করো, meter-কে series-এ insert করো, আর expected current-এর
          সাথে jack ও range match করো.
        </p>
        <p>
          পরের lesson-গুলোতে আমরা measurement confidence ধাপে ধাপে আরও বাড়াব.
        </p>
      </ScriptBlock>
    </div>
  );
}
