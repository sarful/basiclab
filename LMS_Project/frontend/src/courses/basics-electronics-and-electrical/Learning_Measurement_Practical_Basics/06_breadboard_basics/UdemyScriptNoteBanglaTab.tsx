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
          ব্রেডবোর্ড বেসিকস
        </h1>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>এই lesson-এর goal হলো সঠিক breadboard-thinking habit তৈরি করা.</p>
        <p>Student যেন বুঝতে পারে breadboard কোনো random hole grid নয়.</p>
        <p>তারা যেন তিনটি structural rule মনে রাখতে পারে.</p>
        <p>একই numbered column-এর A-E top half-এ connected থাকে.</p>
        <p>একই numbered column-এর F-J bottom half-এ connected থাকে.</p>
        <p>Center gap আর power rail আলাদা থাকে, যতক্ষণ না আমরা সঠিক jumper wire দিই.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Intro" cue="Opening">
        <p>সবাইকে স্বাগতম.</p>
        <PauseCue />
        <p>আগের lesson-গুলোতে আমরা practical multimeter skill নিয়ে কাজ করেছি.</p>
        <p>এখন আমরা electronics practice-এর আরেকটি important area-তে যাচ্ছি.</p>
        <p>সেই area হলো breadboard basics.</p>
        <PauseCue label="Short Pause" />
        <p>
          Breadboard আমাদের soldering ছাড়া circuit build আর test করতে সাহায্য
          করে, কিন্তু তা ঠিকভাবে করতে হলে hole-এর ভেতরের connection বুঝতে হবে.
        </p>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Main Idea" cue="Teach Slowly">
        <p>এই lesson-এর সবচেয়ে important idea হলো একটাই.</p>
        <p>Breadboard-এর internal connection rule আছে.</p>
        <p>সব কাছাকাছি hole connected নয়.</p>
        <p>কিছু hole already one internal strip share করে, আর কিছু hole পুরোপুরি আলাদা থাকে.</p>
        <PauseCue label="Emphasize" />
        <p>ভালো breadboard কাজ শুরু হয় কোথায় connection আছে আর কোথায় নেই, সেটা বুঝে.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Terminal Strips" cue="Point to Board">
        <p>চলো প্রথমে terminal strip দেখি.</p>
        <p>Top half-এ একই numbered column-এর A থেকে E internally connected.</p>
        <p>Bottom half-এ একই numbered column-এর F থেকে J internally connected.</p>
        <p>অর্থাৎ A8, B8, C8, D8, আর E8 already one internal path share করে.</p>
        <p>কিন্তু ওই top group F8, G8, H8, I8, আর J8-এর সাথে connected নয়, কারণ ওগুলো gap-এর নিচে.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: The Center Gap" cue="Board Structure">
        <p>এখন breadboard-এর মাঝের center gap লক্ষ্য করো.</p>
        <p>এই gap top half আর bottom half-কে আলাদা করে.</p>
        <p>তাই E20-এর মতো hole automaticভাবে F20-এর সাথে connected নয়.</p>
        <p>Circuit যদি gap cross করে যেতে চায়, তাহলে jumper wire লাগবে.</p>
        <PauseCue label="Slow Down" />
        <p>একই column number থাকলেই connection হবে, এমন নয় যদি center gap মাঝখানে থাকে.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Power Rails" cue="Supply Lines">
        <p>এখন power rail নিয়ে কথা বলি.</p>
        <p>Power rail board জুড়ে supply voltage আর ground distribute করতে সাহায্য করে.</p>
        <p>কিন্তু rail পাশের terminal strip-এর সাথে নিজে থেকেই connected নয়.</p>
        <p>এই কারণেই Top positive rail 8 থেকে column 8 terminal row-এ jumper দরকার হয়.</p>
        <p>Rail নিজে থেকে ওই row-টাকে feed করে না.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Coordinates and Targeting" cue="Read Carefully">
        <p>Breadboard work-এ coordinate খুব গুরুত্বপূর্ণ.</p>
        <p>A8, A14, E20, F20, বা C30-এর মতো label exact hole position বোঝায়.</p>
        <p>এগুলো শুধু decoration নয়.</p>
        <p>এগুলো বলে দেয় দুইটি hole একই internal group-এ আছে, নাকি different group-এ.</p>
        <p>Coordinate carefulভাবে পড়লে guess না করে purpose নিয়ে wire বসানো যায়.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: When a Jumper Is Needed" cue="Real Cases">
        <p>এখন theory-কে real action-এর সাথে মিলিয়ে দেখি.</p>
        <p>A8 থেকে A14-এ jumper দরকার, কারণ ওগুলো different column-এ.</p>
        <p>Top positive rail 8 থেকে column 8 terminal row-তেও jumper দরকার.</p>
        <p>E20 থেকে F20-তেও jumper দরকার, কারণ center gap path break করে.</p>
        <p>কিন্তু যদি hole already same internal group-এ থাকে, তাহলে সেখানে jumper দেওয়া unnecessary.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Common Mistakes" cue="Safety">
        <p>এখন common beginner mistake-গুলো দেখি.</p>
        <PauseCue />
        <p>একই row letter দেখেই different column-এর hole connected, এটা ভাবা যাবে না.</p>
        <p>Power rail automatically terminal strip-এ power দেয়, এটাও assume করা যাবে না.</p>
        <p>Column number match করলেই center gap ignore করা যাবে না.</p>
        <p>আর breadboard already internally connect করে রেখেছে, এমন hole-এর মাঝে অযথা jumper বসানো যাবে না.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Practical Mindset" cue="Real Work">
        <p>Breadboard কাজকে একবারে একটি practical question হিসেবে ভাবো.</p>
        <p>এই দুইটি hole কি already board-এর ভিতরে connected?</p>
        <p>এই row-এর সাথে rail কি আলাদা?</p>
        <p>Center gap কি এই path block করছে?</p>
        <p>Wire বসানোর আগে এই প্রশ্নগুলোর উত্তর দিলে breadboard building অনেক সহজ হয়ে যায়.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Recap and Closing" cue="End">
        <p>চলো main lesson দিয়ে শেষ করি.</p>
        <p>A-E এক top-half group share করে.</p>
        <p>F-J এক bottom-half group share করে.</p>
        <p>Center gap এই দুই half-কে আলাদা করে.</p>
        <p>Power rail terminal strip-এর সাথে wire না দিলে আলাদা থাকে.</p>
        <PauseCue label="Final Emphasis" />
        <p>
          Coordinate carefulভাবে পড়ো, internal group বোঝো, আর jumper wire
          শুধু তখনই ব্যবহার করো যখন breadboard নিজে থেকে connection করে দেয়নি.
        </p>
      </ScriptBlock>
    </div>
  );
}
