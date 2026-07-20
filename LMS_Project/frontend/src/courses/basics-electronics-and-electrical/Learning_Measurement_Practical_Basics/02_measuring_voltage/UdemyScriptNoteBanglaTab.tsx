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
          ভোল্টেজ মাপা
        </h1>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>এই lesson-এর goal খুব practical.</p>
        <p>Student যেন বুঝতে পারে voltage দুইটি point-এর across measure করা হয়.</p>
        <p>আর তিনটি setup rule মনে রাখতে পারে.</p>
        <p>Black lead COM-এ থাকবে.</p>
        <p>Red lead voltage jack-এ থাকবে.</p>
        <p>Source অনুযায়ী DCV বা ACV বেছে নিতে হবে.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Intro" cue="Opening">
        <p>সবাইকে স্বাগতম.</p>
        <PauseCue />
        <p>আগের lesson-এ আমরা multimeter কী সেটা শিখেছি.</p>
        <p>এখন আমরা প্রথম real measurement job শুরু করব.</p>
        <p>সেই কাজ হলো voltage measure করা.</p>
        <PauseCue label="Short Pause" />
        <p>
          Voltage measure করা মানে দুইটি point-এর মধ্যে electrical push কত
          আছে সেটা দেখা।
        </p>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Main Idea" cue="Teach Slowly">
        <p>এই lesson-এর সবচেয়ে important idea হলো একটাই.</p>
        <p>Voltage দুইটি point-এর across measure করা হয়.</p>
        <p>যেমন battery plus আর minus-এর across.</p>
        <p>অথবা DC supply-এর V plus আর ground-এর across.</p>
        <p>অথবা AC source demo-র live আর neutral-এর across.</p>
        <PauseCue label="Emphasize" />
        <p>Across two points. Series-এ না.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Lead Placement" cue="Point to Meter">
        <p>Circuit touch করার আগে lead position check করতে হবে.</p>
        <p>Black lead COM-এ থাকবে.</p>
        <p>Red lead normal voltage jack-এ থাকবে.</p>
        <p>এই trainer-এ সেটা V ohm milliamp jack.</p>
        <p>এই lesson-এ 10A jack ব্যবহার করা যাবে না.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Mode Selection" cue="Dial Check">
        <p>এরপর dial-এ সঠিক voltage family select করতে হবে.</p>
        <p>Battery হলো DC source, তাই DCV লাগবে.</p>
        <p>Twelve-volt supply-ও DC, তাই এটাও DCV.</p>
        <p>Mains-style outlet demo হলো AC, তাই ACV লাগবে.</p>
        <PauseCue label="Slow Down" />
        <p>Source type-ই dial family ঠিক করে.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Display Reading" cue="Point to LCD">
        <p>Setup ঠিক থাকলে display voltage reading দেখাবে.</p>
        <p>এই lesson-এ battery প্রায় 9 volt দেখায়.</p>
        <p>DC supply প্রায় 12 volt দেখায়.</p>
        <p>AC demo source প্রায় 220 volt দেখায়.</p>
        <p>DC probe উল্টো ধরলে negative reading দেখা যেতে পারে.</p>
        <p>এই negative sign polarity clue দেয়.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Common Mistakes" cue="Safety">
        <p>এখন common beginner mistake-গুলো দেখি.</p>
        <PauseCue />
        <p>Voltage check-এর সময় 10A jack use করা ভুল setup.</p>
        <p>Voltage mode-এর বদলে current mode নেওয়াও ভুল.</p>
        <p>Battery-র জন্য ACV নেওয়া ভুল.</p>
        <p>AC outlet demo-র জন্য DCV নেওয়াও ভুল.</p>
        <p>Dial, jack, আর probe placement না মিললে meter শেখাবে না, বিভ্রান্ত করবে.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Practical Mindset" cue="Real Work">
        <p>Voltage measurement-কে একটি clear question হিসেবে ভাবো.</p>
        <p>Source সত্যি present আছে?</p>
        <p>এই দুই point-এর মধ্যে কত push আছে?</p>
        <p>Polarity ঠিক আছে, নাকি probe উল্টো?</p>
        <p>ভালো troubleshooting এই disciplined question দিয়েই শুরু হয়.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Recap" cue="Review">
        <p>একবার main lesson recap করি.</p>
        <p>Voltage দুইটি point-এর across measure করা হয়.</p>
        <p>Black lead COM-এ থাকে.</p>
        <p>Red lead V ohm milliamp jack-এ থাকে.</p>
        <p>DC source-এর জন্য DCV, আর AC source-এর জন্য ACV লাগে.</p>
        <p>Negative DC reading অনেক সময় probe reverse বোঝায়.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Closing" cue="End">
        <p>এখন আপনি multimeter-এর প্রথম practical skill শিখে ফেলেছেন.</p>
        <PauseCue label="Final Emphasis" />
        <p>
          সঠিক jack, সঠিক voltage family, আর across two points rule মেনে
          voltage measure করতে হবে।
        </p>
        <p>পরের lesson-এ আমরা এই confidence আরও বাড়াব.</p>
      </ScriptBlock>
    </div>
  );
}
