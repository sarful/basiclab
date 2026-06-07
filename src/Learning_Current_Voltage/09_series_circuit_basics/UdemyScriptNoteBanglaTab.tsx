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
          Series Circuit Basics
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          এই version-টা direct video recording-এর জন্য teleprompter-friendly
          style-এ লেখা হয়েছে।
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>এই lesson-এর goal সহজ এবং practical।</p>
        <p>Student যেন series circuit কী, সেটা পরিষ্কারভাবে বুঝতে পারে।</p>
        <p>সে যেন বুঝতে পারে series circuit-এ current-এর জন্য only one path থাকে।</p>
        <p>আর সে যেন বুঝতে পারে সব series component-এর মধ্যে same current flow করে।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>আসসালামু আলাইকুম, welcome.</p>
        <PauseCue />
        <p>এই lesson-এ আমরা series circuit-এর basic idea শিখব।</p>
        <p>Electronics-এর foundation বোঝার জন্য এটি একটি খুব important topic।</p>
        <PauseCue label="Short Pause" />
        <EmphasisLine>
          Series circuit current-কে only one path দেয়।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Core Idea" cue="Teach Slowly">
        <p>এখন idea-টা খুব সহজভাবে দেখি।</p>
        <PauseCue />
        <p>Series circuit-এ component-গুলো একটার পর একটা connected থাকে।</p>
        <p>তার মানে current source থেকে বের হয়ে এক component-এর মধ্য দিয়ে যায়, তারপর next component-এর মধ্য দিয়ে যায়, এবং একই path ধরে সামনে এগোয়।</p>
        <p>এখানে current-এর জন্য অনেক path নেই।</p>
        <EmphasisLine>
          One path মানে সব series component-এর মধ্যে same current flow করে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Explain Why It Matters" cue="Connect to Use">
        <p>এই idea গুরুত্বপূর্ণ কারণ অনেক simple circuit series connection-এ built হয়।</p>
        <PauseCue />
        <p>এটি continuity, total resistance, আর voltage sharing বুঝতে সাহায্য করে।</p>
        <p>এছাড়া এটি explain করে কেন একটি broken part পুরো circuit বন্ধ করে দিতে পারে।</p>
        <EmphasisLine>
          যদি one path ভেঙে যায়, পুরো series circuit কাজ করা বন্ধ করে দেয়।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Point to the Circuit" cue="Point to Circuit">
        <p>এখন simulation-এর দিকে তাকান।</p>
        <PauseCue label="Battery দেখাও" />
        <p>Source current-কে circuit-এর মধ্যে push করছে।</p>
        <PauseCue label="R1 দেখাও" />
        <p>Current resistor one-এর মধ্য দিয়ে যাচ্ছে।</p>
        <PauseCue label="R2 দেখাও" />
        <p>তারপর এটি resistor two-এর মধ্য দিয়ে যাচ্ছে।</p>
        <PauseCue label="LED দেখাও" />
        <p>এরপর current LED-এর মধ্য দিয়ে গিয়ে আবার source-এ ফিরে আসছে।</p>
        <EmphasisLine>
          Path-টা একটি complete line, অনেক branch-এর network নয়।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Use the Lesson Values" cue="Explain with Numbers">
        <p>এখন lesson-এর values ব্যবহার করি।</p>
        <PauseCue />
        <p>Source voltage হলো 12 volts।</p>
        <p>Resistor one হলো 4 ohms, আর resistor two হলো 8 ohms।</p>
        <p>তাই total resistance হয় 12 ohms।</p>
        <p>LED প্রায় 2 volts ব্যবহার করে।</p>
        <p>তাই resistor-গুলোর জন্য 10 volts available থাকে।</p>
        <p>তাহলে current হয় 10 divided by 12, অর্থাৎ প্রায় 0.83 amps।</p>
        <EmphasisLine>
          এই 0.83 amps-ই দুই resistor-এর মধ্য দিয়ে flow করে, কারণ path series।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Explain the Formula" cue="Formula">
        <p>এখন এই lesson-এর simple relationship দেখি।</p>
        <PauseCue />
        <p>Series connection-এ total resistance হলো সব resistor value-এর sum।</p>
        <p>তাই আমরা লিখি R total equals R1 plus R2।</p>
        <p>এরপর current equals available voltage divided by total resistance।</p>
        <p>এই কারণেই আমরা 12 থেকে 2 subtract করি, তারপর 12 দিয়ে divide করি।</p>
        <EmphasisLine>
          Series circuit-এ resistance add হয়, কিন্তু current পুরো path-এ same থাকে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Real-World Example" cue="Connect to Real Life">
        <p>একটি simple flashlight circuit কল্পনা করুন।</p>
        <PauseCue label="উদাহরণ দাও" />
        <p>Battery, switch, আর lamp এক লাইনে বসানো আছে।</p>
        <p>Current-কে একই path ধরে সবগুলোর মধ্য দিয়ে যেতে হয়।</p>
        <p>যদি bulb filament break করে, path open হয়ে যায় এবং পুরো flashlight বন্ধ হয়ে যায়।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Common Beginner Reminder" cue="Clarify">
        <p>এখানে beginner-দের একটি common misunderstanding আছে।</p>
        <PauseCue />
        <p>অনেকে মনে করে series-এ প্রতিটি resistor-এর current আলাদা হয়।</p>
        <p>কিন্তু সেটা ঠিক নয়।</p>
        <p>Series path-এ current সব component-এর মধ্য দিয়ে same থাকে।</p>
        <EmphasisLine>
          Component-গুলোর মধ্যে যা বদলায়, তা হলো voltage drop; current value নয়।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Short Recap" cue="Recap">
        <p>শেষ করার আগে key points দ্রুত দেখে নেই।</p>
        <PauseCue />
        <p>Series circuit-এ current-এর জন্য only one path থাকে।</p>
        <p>সব series component-এর মধ্যে same current flow করে।</p>
        <p>Series connection-এ resistance-গুলো যোগ হয়।</p>
        <p>একটি part open হলে পুরো circuit বন্ধ হয়ে যায়।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Closing" cue="End">
        <p>So, big idea খুব clear.</p>
        <PauseCue label="শেষে জোর দাও" />
        <EmphasisLine>
          Series circuit-এর one path থাকে, shared current থাকে, আর total resistance add হয়ে বড় হয়।
        </EmphasisLine>
        <p>এই একটি picture clear হলে অনেক simple circuit explain করা অনেক সহজ হয়ে যায়।</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          আসসালামু আলাইকুম, welcome. এই lesson-এ আমরা series circuit-এর basic idea শিখব। Electronics-এর foundation বোঝার জন্য এটি একটি খুব important topic।
        </p>
        <PauseCue label="Short Pause" />
        <p>
          Series circuit current-কে only one path দেয়।
        </p>
        <PauseCue />
        <p>
          Series circuit-এ component-গুলো একটার পর একটা connected থাকে। তার মানে current source থেকে বের হয়ে এক component-এর মধ্য দিয়ে যায়, তারপর next component-এর মধ্য দিয়ে যায়, এবং একই path ধরে সামনে এগোয়।
        </p>
        <PauseCue label="Point to Circuit" />
        <p>
          এখন simulation-এর দিকে তাকান। Source current-কে circuit-এর মধ্যে push করছে। Current resistor one-এর মধ্য দিয়ে যাচ্ছে, তারপর resistor two-এর মধ্য দিয়ে যাচ্ছে, তারপর LED-এর মধ্য দিয়ে গিয়ে source-এ ফিরে আসছে।
        </p>
        <PauseCue label="Explain with Numbers" />
        <p>
          এই lesson-এ source voltage হলো 12 volts। Resistor one হলো 4 ohms, আর resistor two হলো 8 ohms। তাই total resistance হয় 12 ohms। LED 2 volts ব্যবহার করে, তাই resistor-গুলোর জন্য 10 volts available থাকে। এতে current হয় প্রায় 0.83 amps।
        </p>
        <PauseCue label="Formula" />
        <p>
          Series circuit-এ total resistance add হয়। তারপর current equals available voltage divided by total resistance। এই কারণেই আমরা LED drop বাদ দিয়ে total resistance দিয়ে divide করি।
        </p>
        <PauseCue label="উদাহরণ দাও" />
        <p>
          একটি flashlight circuit কল্পনা করুন। Battery, switch, আর lamp এক লাইনে আছে। যদি bulb filament break করে, path open হয়ে যায় এবং পুরো flashlight বন্ধ হয়ে যায়।
        </p>
        <PauseCue label="Clarify" />
        <p>
          একটি important reminder হলো, series circuit-এ সব component-এর current same থাকে। Component-গুলোর মধ্যে যা ভাগ হয়, তা হলো voltage drop।
        </p>
        <PauseCue label="শেষে জোর দাও" />
        <p>
          তাই শেষ কথা হলো, series circuit-এর one path থাকে, shared current থাকে, আর total resistance add হয়ে বড় হয়। ধন্যবাদ, আর next lesson-এ আমরা এই foundation-এর উপর আরও build করব।
        </p>
      </ScriptBlock>
    </div>
  );
}
