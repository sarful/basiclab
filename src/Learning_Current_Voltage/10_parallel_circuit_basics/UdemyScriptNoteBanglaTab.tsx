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
          Parallel Circuit Basics
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          এই version-টা direct video recording-এর জন্য teleprompter-friendly
          style-এ লেখা হয়েছে।
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>এই lesson-এর goal সহজ কিন্তু খুব গুরুত্বপূর্ণ।</p>
        <p>Student যেন parallel circuit কী, সেটা পরিষ্কারভাবে বুঝতে পারে।</p>
        <p>সে যেন বুঝতে পারে parallel circuit-এ current-এর জন্য একের বেশি path থাকে।</p>
        <p>আর সে যেন বুঝতে পারে প্রতিটি branch একই voltage পায়, কিন্তু current branch অনুযায়ী ভাগ হতে পারে।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>আসসালামু আলাইকুম, welcome.</p>
        <PauseCue />
        <p>এই lesson-এ আমরা parallel circuit-এর basic idea শিখব।</p>
        <p>এটি খুব important topic, কারণ real electrical system-এ parallel connection খুব common।</p>
        <PauseCue label="Short Pause" />
        <EmphasisLine>
          Parallel circuit current-কে একের বেশি path দেয়।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Core Idea" cue="Teach Slowly">
        <p>এখন idea-টা খুব সহজভাবে দেখি।</p>
        <PauseCue />
        <p>Parallel circuit-এ কয়েকটি branch একই source-এর across connected থাকে।</p>
        <p>তাই প্রতিটি branch একই source voltage পায়।</p>
        <p>কিন্তু current প্রতিটি branch-এ এক নাও হতে পারে।</p>
        <EmphasisLine>
          Parallel circuit-এ voltage same থাকে, কিন্তু current branch-এ split হয়।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Explain Why It Matters" cue="Connect to Use">
        <p>এই idea গুরুত্বপূর্ণ কারণ home wiring, building load, আর machine panel-এ parallel circuit অনেক ব্যবহার হয়।</p>
        <PauseCue />
        <p>Parallel design-এর ফলে একই source থেকে অনেক load চালানো যায়।</p>
        <p>একটি branch বন্ধ হলেও অন্য branch অনেক সময় কাজ চালিয়ে যেতে পারে।</p>
        <EmphasisLine>
          এই কারণেই parallel circuit real life-এ এত useful।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Point to the Circuit" cue="Point to Circuit">
        <p>এখন simulation-এর দিকে তাকান।</p>
        <PauseCue label="Point to Source" />
        <p>Source একই voltage সব branch-এর across দিচ্ছে।</p>
        <PauseCue label="Point to Branch 1" />
        <p>Current branch one দিয়ে যেতে পারে।</p>
        <PauseCue label="Point to Branch 2" />
        <p>একই সময় current branch two দিয়েও যেতে পারে।</p>
        <PauseCue label="Point to Branch 3" />
        <p>এবং branch three দিয়েও current flow করতে পারে।</p>
        <EmphasisLine>
          এখানেই big picture: একই voltage, কিন্তু current-এর জন্য আলাদা আলাদা path।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Use the Lesson Values" cue="Explain with Numbers">
        <p>এখন lesson-এর values ব্যবহার করি।</p>
        <PauseCue />
        <p>Source voltage হলো 12 volts।</p>
        <p>Branch one resistance 6 ohms, branch two 12 ohms, আর branch three 18 ohms।</p>
        <p>তাই branch current তিনটি হয় 2 amps, 1 amp, এবং 0.67 amps।</p>
        <p>তারপর আমরা এই branch current-গুলো যোগ করি।</p>
        <p>তাহলে total current হয় প্রায় 3.67 amps।</p>
        <EmphasisLine>
          Parallel circuit-এ total current হলো সব branch current-এর যোগফল।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Explain the Formula" cue="Formula">
        <p>এখন এই lesson-এর simple formula দেখি।</p>
        <PauseCue />
        <p>প্রতিটি branch-এর জন্য current equals voltage divided by branch resistance।</p>
        <p>অর্থাৎ I1 equals V over R1, I2 equals V over R2, আর I3 equals V over R3।</p>
        <p>তারপর total current equals I1 plus I2 plus I3।</p>
        <EmphasisLine>
          সব branch একই voltage পায়, কিন্তু resistance আলাদা হলে current-ও আলাদা হয়।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Real-World Example" cue="Connect to Real Life">
        <p>এখন একটি house light circuit কল্পনা করুন।</p>
        <PauseCue label="উদাহরণ দাও" />
        <p>প্রতিটি light সাধারণত parallel-এ connected থাকে।</p>
        <p>তাই প্রতিটি light একই source voltage পায়।</p>
        <p>একটি light নষ্ট হলেও অন্য light-গুলো চলতে পারে।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Common Beginner Reminder" cue="Clarify">
        <p>এখানে beginner-দের একটি common misunderstanding আছে।</p>
        <PauseCue />
        <p>অনেকে মনে করে voltage আর current দুটোই সব branch-এ same থাকবে।</p>
        <p>কিন্তু সেটি ঠিক নয়।</p>
        <p>Parallel circuit-এ voltage same থাকে।</p>
        <p>Current branch resistance-এর ওপর নির্ভর করে।</p>
        <EmphasisLine>
          যে branch-এর resistance কম, সেই branch-এ current বেশি হবে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Short Recap" cue="Recap">
        <p>শেষ করার আগে key points দ্রুত দেখে নেই।</p>
        <PauseCue />
        <p>Parallel circuit-এ current-এর জন্য একের বেশি path থাকে।</p>
        <p>প্রতিটি branch একই voltage পায়।</p>
        <p>Branch current এক নাও হতে পারে।</p>
        <p>Total current হলো সব branch current-এর যোগফল।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Closing" cue="End">
        <p>So, big idea খুব clear.</p>
        <PauseCue label="শেষে জোর দাও" />
        <EmphasisLine>
          Parallel circuit current-কে কয়েকটি path দেয়, প্রতিটি branch-এ একই voltage রাখে, আর সব branch current যোগ করে total current দেয়।
        </EmphasisLine>
        <p>এই picture clear হলে parallel circuit বোঝা অনেক সহজ হয়ে যায়।</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          আসসালামু আলাইকুম, welcome. এই lesson-এ আমরা parallel circuit-এর basic idea শিখব। এটি খুব important topic, কারণ real electrical system-এ parallel connection খুব common।
        </p>
        <PauseCue label="Short Pause" />
        <p>
          Parallel circuit current-কে একের বেশি path দেয়।
        </p>
        <PauseCue />
        <p>
          Parallel circuit-এ কয়েকটি branch একই source-এর across connected থাকে। তাই প্রতিটি branch একই source voltage পায়। কিন্তু current প্রতিটি branch-এ এক নাও হতে পারে।
        </p>
        <PauseCue label="Point to Circuit" />
        <p>
          এখন simulation-এর দিকে তাকান। Source একই voltage সব branch-এর across দিচ্ছে। Current branch one, branch two, আর branch three দিয়ে flow করতে পারে।
        </p>
        <PauseCue label="Explain with Numbers" />
        <p>
          এই lesson-এ source voltage হলো 12 volts। Branch one resistance 6 ohms, branch two 12 ohms, আর branch three 18 ohms। তাই branch current তিনটি হয় 2 amps, 1 amp, এবং 0.67 amps। এগুলো যোগ করলে total current হয় প্রায় 3.67 amps।
        </p>
        <PauseCue label="Formula" />
        <p>
          প্রতিটি branch-এর জন্য current equals voltage divided by branch resistance। তারপর total current equals সব branch current-এর যোগফল। অর্থাৎ parallel circuit-এ voltage same থাকে, কিন্তু current branch অনুযায়ী change হয়।
        </p>
        <PauseCue label="উদাহরণ দাও" />
        <p>
          একটি house light circuit কল্পনা করুন। প্রতিটি light সাধারণত parallel-এ connected থাকে। তাই প্রতিটি light একই voltage পায়, আর একটি light নষ্ট হলেও অন্য light-গুলো চলতে পারে।
        </p>
        <PauseCue label="Clarify" />
        <p>
          একটি important reminder হলো, parallel circuit-এ voltage একই থাকে, কিন্তু current branch resistance-এর ওপর নির্ভর করে। যে branch-এর resistance কম, সেই branch-এ current বেশি হয়।
        </p>
        <PauseCue label="শেষে জোর দাও" />
        <p>
          তাই শেষ কথা হলো, parallel circuit current-কে কয়েকটি path দেয়, প্রতিটি branch-এ একই voltage রাখে, আর সব branch current যোগ করে total current দেয়। ধন্যবাদ, আর next lesson-এ আমরা এই foundation-এর ওপর আরও build করব।
        </p>
      </ScriptBlock>
    </div>
  );
}
