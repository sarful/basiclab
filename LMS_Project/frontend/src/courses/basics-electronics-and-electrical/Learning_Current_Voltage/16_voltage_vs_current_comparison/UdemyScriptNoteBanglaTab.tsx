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
          Voltage vs Current Comparison
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          এই version-টা direct video recording-এর জন্য teleprompter-friendly
          style-এ লেখা হয়েছে।
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>এই lesson-এর goal খুব simple আর practical।</p>
        <p>Student যেন voltage আর current-কে clearly আলাদা করে বুঝতে পারে।</p>
        <p>সে যেন বুঝতে পারে voltage হলো push, আর current হলো actual flow।</p>
        <p>
          আর সে যেন বুঝতে পারে resistance এই দুইটির relation-এ কীভাবে effect
          ফেলে।
        </p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>আসসালামু আলাইকুম, welcome.</p>
        <PauseCue />
        <p>এই lesson-এ আমরা voltage আর current-কে directly compare করব।</p>
        <p>
          এই lesson খুব important, কারণ beginner-রা অনেক সময় এই দুইটি idea mix
          করে ফেলে।
        </p>
        <PauseCue label="Short Pause" />
        <EmphasisLine>Voltage is the push. Current is the flow.</EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Core Idea" cue="Teach Slowly">
        <p>চলুন idea-টা খুব simple করে দেখি।</p>
        <PauseCue />
        <p>Voltage হলো electrical push, যা charge-কে move করাতে চায়।</p>
        <p>Current হলো circuit-এর মধ্যে actually কত charge move করছে।</p>
        <p>এই দুইটি idea একসাথে কাজ করে, কিন্তু তারা একই জিনিস না।</p>
        <EmphasisLine>
          একটি force-এর কথা বলে। অন্যটি movement-এর কথা বলে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Explain Why It Matters" cue="Connect to Use">
        <p>
          এই topic important, কারণ voltage আর current mix করে ফেললে testing আর
          troubleshooting confusing হয়ে যায়।
        </p>
        <PauseCue />
        <p>Current খুব ছোট হলেও circuit-এ voltage available থাকতে পারে।</p>
        <p>
          আবার complete path আর proper resistance ছাড়া current clearly দেখা নাও
          যেতে পারে।
        </p>
        <p>
          এই দুইটি idea আগে আলাদা করে বুঝলে পরে electrical calculation অনেক
          সহজ হয়।
        </p>
        <EmphasisLine>
          Circuit solve করার আগে নিজেকে জিজ্ঞেস করুন: আমি push-এর কথা বলছি,
          নাকি flow-এর কথা?
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Point to the Simulation" cue="Point to Screen">
        <p>এখন simulation-এর দিকে তাকান।</p>
        <PauseCue label="Point to Voltage Card" />
        <p>Voltage side electrical push দেখাচ্ছে।</p>
        <PauseCue label="Point to Current Card" />
        <p>Current side সেই push-এর কারণে তৈরি actual flow দেখাচ্ছে।</p>
        <p>এই side-by-side view difference-টা অনেক সহজে বোঝায়।</p>
        <EmphasisLine>
          Voltage motion শুরু করে। Current result দেখায়।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Use the Lesson Values" cue="Explain with Numbers">
        <p>এই lesson-এ voltage হলো 12 volts।</p>
        <PauseCue />
        <p>Resistance হলো 6 ohms।</p>
        <p>তাই current হয় 2 amps।</p>
        <p>
          এই এক circuit-এই আমরা real number দিয়ে push আর flow compare করতে পারি।
        </p>
        <EmphasisLine>
          যখন push 12 volts আর resistance 6 ohms, তখন flow হয় 2 amps।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Explain the Formula View" cue="Formula">
        <p>এখন এই idea-টাকে basic formula-এর সাথে connect করি।</p>
        <PauseCue />
        <p>Ohm&apos;s Law বলে current equals voltage divided by resistance।</p>
        <p>Short form-এ এটি I equals V divided by R।</p>
        <p>তাই এই lesson-এ I equals 12 divided by 6, অর্থাৎ 2 amps।</p>
        <p>
          এটি beginner-দের জন্য খুব ভালো example, কারণ number-গুলো follow করা
          সহজ।
        </p>
        <EmphasisLine>
          Formula দেখায় current push আর resistance দুটির উপরেই depend করে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Real-World Example" cue="Connect to Real Life">
        <p>একটি water pump আর pipe-এর মধ্যে moving water কল্পনা করুন।</p>
        <PauseCue label="উদাহরণ দাও" />
        <p>Water pressure হলো voltage-এর মতো।</p>
        <p>Actually যে amount water move করছে, সেটি current-এর মতো।</p>
        <p>Pipe narrow হলে pressure থাকলেও flow বদলে যায়।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Common Beginner Reminder" cue="Clarify">
        <p>এখানে beginner-দের একটি common mistake আছে।</p>
        <PauseCue />
        <p>
          অনেকে বলে voltage আর current basically একই, কারণ দুটোই একই circuit-এ
          থাকে।
        </p>
        <p>কিন্তু এটি ঠিক না।</p>
        <p>Voltage হলো cause, আর current হলো measured result।</p>
        <EmphasisLine>Push আর flow-কে confuse করবেন না।</EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Short Recap" cue="Recap">
        <p>শেষ করার আগে key points দ্রুত দেখি।</p>
        <PauseCue />
        <p>Voltage হলো electrical push।</p>
        <p>Current হলো charge-এর actual flow।</p>
        <p>এই দুইটি idea related, কিন্তু same না।</p>
        <p>Resistance affect করে voltage কত current produce করতে পারবে।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Closing" cue="End">
        <p>So, big idea খুব clear।</p>
        <PauseCue label="শেষে জোর দাও" />
        <EmphasisLine>
          কোনো circuit ভালোভাবে বুঝতে হলে push আর flow-কে সবসময় আলাদা করে
          ভাবুন।
        </EmphasisLine>
        <p>এই এক habit বাকি electrical learning অনেক সহজ করে দেবে।</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          আসসালামু আলাইকুম, welcome। এই lesson-এ আমরা voltage আর current-কে
          directly compare করব। এই lesson খুব important, কারণ beginner-রা অনেক
          সময় এই দুইটি idea mix করে ফেলে।
        </p>
        <PauseCue label="Short Pause" />
        <p>Voltage is the push. Current is the flow.</p>
        <PauseCue />
        <p>
          Voltage হলো electrical push, যা charge-কে move করাতে চায়। Current
          হলো circuit-এর মধ্যে actually কত charge move করছে। এই দুইটি idea
          একসাথে কাজ করে, কিন্তু তারা একই জিনিস না।
        </p>
        <PauseCue label="Point to Screen" />
        <p>
          এখন simulation-এর দিকে তাকান। Voltage side electrical push
          দেখাচ্ছে। Current side সেই push-এর কারণে তৈরি actual flow দেখাচ্ছে।
          এই side-by-side view difference-টা অনেক সহজে বোঝায়।
        </p>
        <PauseCue label="Explain with Numbers" />
        <p>
          এই lesson-এ voltage হলো 12 volts। Resistance হলো 6 ohms। তাই current
          হয় 2 amps। এই এক circuit-এই আমরা real number দিয়ে push আর flow
          compare করতে পারি।
        </p>
        <PauseCue label="Formula" />
        <p>
          Ohm&apos;s Law বলে current equals voltage divided by resistance। Short
          form-এ এটি I equals V divided by R। তাই এই lesson-এ I equals 12
          divided by 6, অর্থাৎ 2 amps। এটি beginner-দের জন্য খুব ভালো example,
          কারণ number-গুলো follow করা সহজ।
        </p>
        <PauseCue label="উদাহরণ দাও" />
        <p>
          একটি water pump আর pipe-এর মধ্যে moving water কল্পনা করুন। Water
          pressure হলো voltage-এর মতো। Actually যে amount water move করছে,
          সেটি current-এর মতো। Pipe narrow হলে pressure থাকলেও flow বদলে যায়।
        </p>
        <PauseCue label="Clarify" />
        <p>
          একটি important reminder হলো, voltage আর current একই জিনিস না।
          Voltage হলো cause, আর current হলো measured result। Push আর flow-কে
          confuse করবেন না।
        </p>
        <PauseCue label="শেষে জোর দাও" />
        <p>
          তাই শেষ কথা হলো, কোনো circuit ভালোভাবে বুঝতে হলে push আর flow-কে
          সবসময় আলাদা করে ভাবুন। এই এক habit বাকি electrical learning অনেক
          সহজ করে দেবে।
        </p>
      </ScriptBlock>
    </div>
  );
}
