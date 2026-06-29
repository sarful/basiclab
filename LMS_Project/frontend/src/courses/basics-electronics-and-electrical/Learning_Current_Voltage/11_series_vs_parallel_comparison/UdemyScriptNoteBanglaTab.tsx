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
          Series vs Parallel Comparison
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          এই version-টা direct video recording-এর জন্য teleprompter-friendly
          style-এ লেখা হয়েছে।
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>এই lesson-এর goal খুব clear আর practical।</p>
        <p>Student যেন series circuit আর parallel circuit-এর difference বুঝতে পারে।</p>
        <p>সে যেন বুঝতে পারে কোন circuit-এ কোন জিনিস same থাকে।</p>
        <p>আর সে যেন বুঝতে পারে current, voltage, আর resistance দুই ধরনের circuit-এ কীভাবে আলাদা behave করে।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>আসসালামু আলাইকুম, welcome.</p>
        <PauseCue />
        <p>এই lesson-এ আমরা series circuit আর parallel circuit compare করব।</p>
        <p>Basic electrical learning-এ এটি খুব useful comparison lesson.</p>
        <PauseCue label="Short Pause" />
        <EmphasisLine>
          Series মানে one path। Parallel মানে more than one path।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Core Difference" cue="Teach Slowly">
        <p>চলুন সবচেয়ে simple idea থেকে শুরু করি।</p>
        <PauseCue />
        <p>Series circuit-এ current-এর জন্য only one path থাকে।</p>
        <p>Parallel circuit-এ current-এর জন্য more than one path থাকে।</p>
        <p>এই একটিমাত্র difference পুরো circuit behavior বদলে দেয়।</p>
        <EmphasisLine>
          Path structure-ই series আর parallel circuit-এর সবচেয়ে বড় difference।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Explain Why It Matters" cue="Connect to Use">
        <p>এই comparison গুরুত্বপূর্ণ কারণ student-রা অনেক সময় rules mix করে ফেলে।</p>
        <PauseCue />
        <p>যদি parallel circuit-এ series rule ব্যবহার করেন, answer ভুল হবে।</p>
        <p>আর যদি series circuit-এ parallel rule ব্যবহার করেন, answer তখনও ভুল হবে।</p>
        <EmphasisLine>
          কোনো calculation-এর আগে circuit type চিনে নেওয়া খুব জরুরি।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Point to the Series Side" cue="Point to Series">
        <p>এখন simulation-এর series side-এর দিকে তাকান।</p>
        <PauseCue label="Point to Series Path" />
        <p>এখানে current-কে one full path দিয়ে যেতে হয়।</p>
        <p>একই current resistor one আর resistor two-এর মধ্য দিয়ে যায়।</p>
        <p>Resistor-গুলোর resistance যোগ হয়ে total resistance তৈরি করে।</p>
        <EmphasisLine>
          Series-এ current same থাকে, কিন্তু voltage parts-গুলোর মধ্যে share হয়।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Point to the Parallel Side" cue="Point to Parallel">
        <p>এখন parallel side-এর দিকে তাকান।</p>
        <PauseCue label="Point to Branches" />
        <p>এখানে current আলাদা branch-এ split হতে পারে।</p>
        <p>প্রতিটি branch একই source voltage পায়।</p>
        <p>কিন্তু branch current branch resistance অনুযায়ী আলাদা হতে পারে।</p>
        <EmphasisLine>
          Parallel-এ voltage same থাকে, কিন্তু current branch অনুযায়ী change হতে পারে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Use the Lesson Values" cue="Explain with Numbers">
        <p>এখন lesson-এর values ব্যবহার করি।</p>
        <PauseCue />
        <p>Source voltage হলো 12 volts।</p>
        <p>Resistor one হলো 4 ohms, আর resistor two হলো 8 ohms।</p>
        <p>Series case-এ total resistance হয় 12 ohms, তাই current হয় 1 amp।</p>
        <p>Parallel case-এ এক branch current হয় 3 amps, আর অন্য branch current হয় 1.5 amps।</p>
        <p>তাহলে parallel total current হয় 4.5 amps।</p>
        <EmphasisLine>
          একই resistor values series আর parallel circuit-এ একদম different total behavior দিতে পারে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Explain the Formula View" cue="Formula">
        <p>এখন formula logic-টা সহজ ভাষায় দেখি।</p>
        <PauseCue />
        <p>Series circuit-এ resistance সরাসরি যোগ হয়।</p>
        <p>তারপর current equals voltage divided by total resistance।</p>
        <p>Parallel circuit-এ প্রতিটি branch current আলাদা করে বের করা হয়।</p>
        <p>তারপর সব branch current যোগ করে total current বের করা হয়।</p>
        <EmphasisLine>
          Series resistance যোগ করে। Parallel branch current যোগ করে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Real-World Example" cue="Connect to Real Life">
        <p>একটি flashlight আর একটি house light circuit কল্পনা করুন।</p>
        <PauseCue label="উদাহরণ দাও" />
        <p>Simple flashlight series circuit-এর মতো behave করে, কারণ current one main path follow করে।</p>
        <p>House light-গুলো parallel circuit-এর মতো behave করে, কারণ প্রতিটি light একই source voltage পায় এবং independently কাজ করতে পারে।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Common Beginner Reminder" cue="Clarify">
        <p>এখানে beginner-দের একটি খুব common mistake আছে।</p>
        <PauseCue />
        <p>অনেকে মনে করে current আর voltage সব circuit-এ একই rule follow করে।</p>
        <p>কিন্তু সেটি ঠিক নয়।</p>
        <p>Series-এ current একইভাবে share হয়।</p>
        <p>Parallel-এ voltage একইভাবে share হয়।</p>
        <EmphasisLine>
          শুধু number মুখস্থ করবেন না। আগে জিজ্ঞেস করুন, এই circuit type-এ কোন জিনিস same থাকে?
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Short Recap" cue="Recap">
        <p>শেষ করার আগে key points দ্রুত দেখে নেই।</p>
        <PauseCue />
        <p>Series circuit মানে one path।</p>
        <p>Parallel circuit মানে more than one path।</p>
        <p>Series-এ same current সব component-এর মধ্যে flow করে।</p>
        <p>Parallel-এ same voltage প্রতিটি branch-এর across থাকে।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 11: Closing" cue="End">
        <p>So, big idea খুব clear.</p>
        <PauseCue label="শেষে জোর দাও" />
        <EmphasisLine>
          Series আর parallel circuit আলাদা, কারণ তাদের path structure আলাদা, আর সেই জন্য current, voltage, আর resistance-এর behavior-ও আলাদা হয়।
        </EmphasisLine>
        <p>এই comparison clear হলে পরের অনেক lesson অনেক সহজ হয়ে যায়।</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          আসসালামু আলাইকুম, welcome. এই lesson-এ আমরা series circuit আর parallel circuit compare করব। Basic electrical learning-এ এটি খুব useful comparison lesson।
        </p>
        <PauseCue label="Short Pause" />
        <p>
          Series মানে one path। Parallel মানে more than one path।
        </p>
        <PauseCue />
        <p>
          Series circuit-এ current-এর জন্য only one path থাকে। Parallel circuit-এ current-এর জন্য more than one path থাকে। এই একটিমাত্র difference পুরো circuit behavior বদলে দেয়।
        </p>
        <PauseCue label="Point to Series" />
        <p>
          এখন simulation-এর series side-এর দিকে তাকান। Current-কে one full path দিয়ে যেতে হয়। একই current resistor one আর resistor two-এর মধ্য দিয়ে যায়। Resistance-গুলো যোগ হয়ে total resistance তৈরি করে।
        </p>
        <PauseCue label="Point to Parallel" />
        <p>
          এখন parallel side-এর দিকে তাকান। Current আলাদা branch-এ split হতে পারে। প্রতিটি branch একই source voltage পায়। কিন্তু branch current branch resistance অনুযায়ী আলাদা হতে পারে।
        </p>
        <PauseCue label="Explain with Numbers" />
        <p>
          এই lesson-এ source voltage হলো 12 volts। Resistor one হলো 4 ohms, আর resistor two হলো 8 ohms। Series case-এ total resistance হয় 12 ohms, তাই current হয় 1 amp। Parallel case-এ এক branch current হয় 3 amps, অন্য branch current হয় 1.5 amps, আর total current হয় 4.5 amps।
        </p>
        <PauseCue label="Formula" />
        <p>
          Series circuit-এ resistance সরাসরি যোগ হয়, তারপর current equals voltage divided by total resistance। Parallel circuit-এ প্রতিটি branch current আলাদা করে বের করা হয়, তারপর সব branch current যোগ করে total current বের করা হয়।
        </p>
        <PauseCue label="উদাহরণ দাও" />
        <p>
          একটি flashlight আর একটি house light circuit কল্পনা করুন। Simple flashlight series circuit-এর মতো behave করে, আর house light-গুলো parallel circuit-এর মতো behave করে।
        </p>
        <PauseCue label="Clarify" />
        <p>
          একটি important reminder হলো, series-এ current same থাকে, আর parallel-এ voltage same থাকে। তাই আগে বুঝুন, এই circuit type-এ কোন জিনিস same থাকে।
        </p>
        <PauseCue label="শেষে জোর দাও" />
        <p>
          তাই শেষ কথা হলো, series আর parallel circuit আলাদা, কারণ তাদের path structure আলাদা, আর সেই জন্য current, voltage, আর resistance-এর behavior-ও আলাদা হয়। ধন্যবাদ, আর next lesson-এ আমরা এই foundation-এর ওপর আরও build করব।
        </p>
      </ScriptBlock>
    </div>
  );
}
