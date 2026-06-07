"use client";

function ScriptBlock({
  title,
  cue,
  children,
}: {
  title: string;
  cue?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        {cue ? (
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
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

function EmphasisLine({ children }: { children: React.ReactNode }) {
  return <p className="font-semibold text-slate-950">{children}</p>;
}

export default function UdemyScriptNoteBanglaTab() {
  return (
    <div className="space-y-4">
      <section className="rounded-[36px] border border-slate-200 bg-white p-10 shadow-[0_18px_44px_rgba(15,23,42,0.10)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-300 bg-blue-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-blue-700">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          Udemy Script Bangla
        </div>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          Short Circuit Basics
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          এই version-টা direct video recording-এর জন্য teleprompter-friendly
          style-এ লেখা হয়েছে।
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>এই lesson-এর goal সহজ কিন্তু খুবই গুরুত্বপূর্ণ।</p>
        <p>Student যেন short circuit কী, সেটা পরিষ্কারভাবে বুঝতে পারে।</p>
        <p>সে যেন বুঝতে পারে short circuit বিপজ্জনক কেন।</p>
        <p>আর সে যেন বুঝতে পারে খুব কম resistance current-কে কীভাবে হঠাৎ অনেক বাড়িয়ে দেয়।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>আসসালামু আলাইকুম, welcome.</p>
        <PauseCue />
        <p>এই lesson-এ আমরা short circuit-এর basic idea শিখব।</p>
        <p>এটি electrical safety-এর একটি খুব important topic.</p>
        <PauseCue label="Short Pause" />
        <EmphasisLine>
          Short circuit current-কে একটি unsafe easy path দেয়।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Core Idea" cue="Teach Slowly">
        <p>এখন idea-টা খুব সহজভাবে দেখি।</p>
        <PauseCue />
        <p>Normal circuit-এ current load-এর মধ্য দিয়ে যায়।</p>
        <p>এই load হতে পারে resistor, lamp, বা অন্য কোনো device।</p>
        <p>কিন্তু short circuit-এ current আরও easy এবং খুব low-resistance path খুঁজে পায়।</p>
        <p>ফলে current খুব দ্রুত অনেক বেশি হয়ে যায়।</p>
        <EmphasisLine>
          Short circuit মানে low resistance আর dangerously high current।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Explain Why It Matters" cue="Connect to Safety">
        <p>এই idea গুরুত্বপূর্ণ কারণ short circuit wire আর component damage করতে পারে।</p>
        <PauseCue />
        <p>এটি fuse বা breaker trip করাতে পারে।</p>
        <p>আর serious case-এ wire অতিরিক্ত গরম হয়ে fire risk তৈরি করতে পারে।</p>
        <EmphasisLine>
          এই কারণেই short-circuit protection electrical system-এর খুব important অংশ।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Point to the Simulation" cue="Point to Circuit">
        <p>এখন simulation-এর দিকে তাকান।</p>
        <PauseCue label="Normal Path দেখাও" />
        <p>Normal circuit-এ current controlled way-তে load-এর মধ্য দিয়ে যাচ্ছে।</p>
        <PauseCue label="Short Path দেখাও" />
        <p>Short-circuit case-এ current আরও easy return path খুঁজে নিচ্ছে।</p>
        <p>Path resistance খুব ছোট হয়ে যাওয়ায় current দ্রুত বেড়ে যাচ্ছে।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Use the Lesson Values" cue="Explain with Numbers">
        <p>এখন lesson-এর values ব্যবহার করি।</p>
        <PauseCue />
        <p>Voltage হলো 9 volts।</p>
        <p>Normal case-এ load resistance হলো 6 ohms।</p>
        <p>তাই current হয় প্রায় 1.50 amps।</p>
        <PauseCue label="Short Path দেখাও" />
        <p>Short-circuit case-এ resistance নেমে আসে 0.25 ohm-এ।</p>
        <p>তাই current বেড়ে হয় 36.00 amps।</p>
        <EmphasisLine>
          কারণটা সহজ: resistance কম হলে current অনেক বেশি flow করতে পারে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Simple Formula" cue="Formula">
        <p>এখন এই lesson-এর simple formula দেখি।</p>
        <PauseCue />
        <p>Current equals voltage divided by resistance.</p>
        <p>অর্থাৎ I equals V divided by R.</p>
        <p>এই short-circuit example-এ 9 divided by 0.25 gives 36 amps.</p>
        <EmphasisLine>
          Resistance খুব ছোট হয়ে গেলে current খুব বড় হয়ে যায়।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Real-World Example" cue="Connect to Real Life">
        <p>এখন একটি damaged wire কল্পনা করুন, যা machine বা control panel-এর মধ্যে আছে।</p>
        <PauseCue label="উদাহরণ দাও" />
        <p>যদি insulation নষ্ট হয়ে conductor ভুল জায়গায় touch করে, current একটি shortcut পেয়ে যেতে পারে।</p>
        <p>এই shortcut-ই short circuit তৈরি করতে পারে।</p>
        <p>এই কারণেই electrical system-এ fuse, breaker, আর proper insulation ব্যবহার করা হয়।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Common Beginner Reminder" cue="Clarify">
        <p>এখানে beginner-দের একটি common misunderstanding আছে।</p>
        <PauseCue />
        <p>অনেকে মনে করে shorter path মানেই better path।</p>
        <p>কিন্তু short circuit-এর ক্ষেত্রে সেটা ঠিক নয়।</p>
        <p>Easy path dangerous হয়ে যায়, যদি সেটি current-কে অনেক বেশি flow করতে দেয়।</p>
        <EmphasisLine>
          Easy path সব সময় safe path নয়।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Short Recap" cue="Recap">
        <p>শেষ করার আগে key points দ্রুত দেখে নেই।</p>
        <PauseCue />
        <p>Short circuit একটি unsafe low-resistance path তৈরি করে।</p>
        <p>Low resistance current-কে দ্রুত বাড়িয়ে দেয়।</p>
        <p>Very high current part damage করতে পারে এবং danger তৈরি করতে পারে।</p>
        <p>এই কারণেই protection device খুব গুরুত্বপূর্ণ।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Closing" cue="End">
        <p>So, big idea খুব clear.</p>
        <PauseCue label="শেষে জোর দাও" />
        <EmphasisLine>
          Short circuit বিপজ্জনক কারণ এটি current-কে unsafe easy path দেয় এবং খুব বেশি current flow করতে দেয়।
        </EmphasisLine>
        <p>এই একটি idea clear হলে, এই topic-এর foundation আপনি বুঝে গেছেন।</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          আসসালামু আলাইকুম, welcome. এই lesson-এ আমরা short circuit-এর basic idea শিখব। এটি electrical safety-এর একটি খুব important topic।
        </p>
        <PauseCue label="Short Pause" />
        <p>
          Short circuit current-কে একটি unsafe easy path দেয়।
        </p>
        <PauseCue />
        <p>
          Normal circuit-এ current load-এর মধ্য দিয়ে controlled way-তে যায়। কিন্তু short circuit-এ current আরও easy low-resistance path খুঁজে নেয়। তাই current খুব দ্রুত বেড়ে যায়।
        </p>
        <PauseCue label="Point to Circuit" />
        <p>
          এখন simulation-এর দিকে তাকান। Normal circuit-এ load resistance হলো 6 ohms, তাই current হয় প্রায় 1.50 amps। কিন্তু short-circuit case-এ resistance নেমে আসে 0.25 ohm-এ, তাই current বেড়ে হয় 36.00 amps।
        </p>
        <PauseCue label="Formula" />
        <p>
          এই lesson-এর simple formula হলো current equals voltage divided by resistance. অর্থাৎ 9 divided by 0.25 gives 36 amps।
        </p>
        <PauseCue label="উদাহরণ দাও" />
        <p>
          একটি damaged wire কল্পনা করুন, যা machine বা control panel-এর মধ্যে আছে। যদি insulation নষ্ট হয়ে conductor ভুল জায়গায় touch করে, current একটি dangerous shortcut পেয়ে যেতে পারে। এই কারণেই fuse, breaker, আর proper insulation খুব important।
        </p>
        <PauseCue label="Clarify" />
        <p>
          একটি important reminder হলো, shorter path সব সময় better path নয়। Short circuit-এর easy path আসলে dangerous path, কারণ এটি current-কে খুব বেশি flow করতে দেয়।
        </p>
        <PauseCue label="শেষে জোর দাও" />
        <p>
          তাই শেষ কথা হলো, short circuit বিপজ্জনক কারণ এটি একটি very low-resistance path তৈরি করে এবং current-কে অনেক বেশি বাড়িয়ে দেয়। ধন্যবাদ, আর next lesson-এ আমরা এই foundation-এর উপর আরও build করব।
        </p>
      </ScriptBlock>
    </div>
  );
}
