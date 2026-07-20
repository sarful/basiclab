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
          কন্টিনিউটি টেস্ট
        </h1>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>এই lesson-এর goal হলো সঠিক continuity-testing habit তৈরি করা.</p>
        <p>Student যেন বুঝতে পারে continuity test একটি path closed নাকি broken, সেই simple question-এর answer দেয়.</p>
        <p>তারা যেন তিনটি setup rule-ও মনে রাখতে পারে.</p>
        <p>Black lead COM-এ থাকে.</p>
        <p>Red lead V ohm milliamp jack-এ থাকে.</p>
        <p>Continuity check শুরু করার আগে circuit-এর power off থাকতে হবে.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Intro" cue="Opening">
        <p>সবাইকে স্বাগতম.</p>
        <PauseCue />
        <p>আগের lesson-গুলোতে আমরা voltage, current, আর resistance measurement practice করেছি.</p>
        <p>এখন আমরা multimeter-এর আরেকটি practical skill-এ যাচ্ছি.</p>
        <p>সেই skill হলো continuity test.</p>
        <PauseCue label="Short Pause" />
        <p>
          Continuity test মানে হলো দুইটি point-এর মধ্যে electrical path
          complete আছে কি না তা দেখা.
        </p>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Main Idea" cue="Teach Slowly">
        <p>এই lesson-এর সবচেয়ে important idea হলো একটাই.</p>
        <p>Continuity testing power-off অবস্থায় করা হয়.</p>
        <p>এটি live operating circuit check করার test নয়.</p>
        <p>আমরা আসলে দেখছি path closed আছে, নাকি broken হয়ে গেছে.</p>
        <PauseCue label="Emphasize" />
        <p>আগে power off করো, তারপর continuity test করো.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Lead Placement" cue="Point to Meter">
        <p>Test point touch করার আগে lead position check করতে হবে.</p>
        <p>Black lead COM-এ থাকে.</p>
        <p>Red lead V ohm milliamp jack-এ থাকে.</p>
        <p>এই lesson-এ red lead-কে 10A jack-এ নেওয়া যাবে না.</p>
        <p>Continuity high-current measurement নয়.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Dial Function" cue="Dial Check">
        <p>এরপর dial-এ সঠিক function select করতে হবে.</p>
        <p>এই lesson-এ meter diode বা continuity-style function ব্যবহার করে.</p>
        <p>এই mode path electrically complete কি না তা বুঝতে সাহায্য করে.</p>
        <PauseCue label="Slow Down" />
        <p>Probe touch করার আগে function অবশ্যই কাজের সাথে match করতে হবে.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Probe Placement" cue="Across the Path">
        <p>এখন probe কোথায় বসবে সেটার দিকে focus করি.</p>
        <p>একটি probe এক test point-এ বসবে.</p>
        <p>অন্য probe আরেক test point-এ বসবে.</p>
        <p>এর মানে meter path-এর across test করছে.</p>
        <p>যদি দুই probe একই point-এ থাকে, তাহলে আসল path test হয় না.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Reading the Result" cue="Point to LCD">
        <p>Path closed থাকলে meter continuity detect করবে.</p>
        <p>অনেক real meter-এ তখন beep শোনা যায়.</p>
        <p>Display-তে খুব low resistance value-ও দেখা যেতে পারে.</p>
        <p>আর যদি path open বা broken থাকে, meter beep দেবে না.</p>
        <p>এতে বোঝা যায় path এক প্রান্ত থেকে আরেক প্রান্ত পর্যন্ত continuous নয়.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Practical Examples" cue="Real Cases">
        <p>একটি ভালো wire path continuity দেখাবে.</p>
        <p>একটি closed switch contact-ও continuity দেখাবে.</p>
        <p>কিন্তু blown fuse continuity দেখাবে না.</p>
        <p>Broken wire-ও continuity দেখাবে না.</p>
        <p>Logic খুব simple: closed path মানে continuity, open path মানে no continuity.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Common Mistakes" cue="Safety">
        <p>এখন common beginner mistake-গুলো দেখি.</p>
        <PauseCue />
        <p>Powered circuit-এ continuity test করা যাবে না.</p>
        <p>Lesson যখন continuity চায়, তখন dial-কে voltage বা ohms mode-এ ফেলে রাখা যাবে না.</p>
        <p>Red lead-কে 10A jack-এ নেওয়া যাবে না.</p>
        <p>আর দুই probe একই test point-এ বসানো যাবে না.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Recap" cue="Review">
        <p>একবার main lesson recap করি.</p>
        <p>Continuity দেখায় path closed নাকি broken.</p>
        <p>Continuity test power off অবস্থায় করা হয়.</p>
        <p>Meter diode বা continuity-style function ব্যবহার করে.</p>
        <p>Black lead COM-এ আর red lead V ohm milliamp jack-এ থাকে.</p>
        <p>একটি probe path-এর এক প্রান্তে, আরেকটি probe অন্য প্রান্তে যায়.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Closing" cue="End">
        <p>এখন আপনি multimeter-এর আরেকটি practical skill শিখে ফেলেছেন.</p>
        <PauseCue label="Final Emphasis" />
        <p>
          Power off করো, continuity mode choose করো, আর path-এর দুই পাশে এক
          করে probe বসিয়ে test করো.
        </p>
        <p>
          পরের lesson-গুলোতে আমরা practical measurement confidence ধাপে ধাপে
          আরও বাড়াব.
        </p>
      </ScriptBlock>
    </div>
  );
}
