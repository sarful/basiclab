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
          Electron Flow
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          এই version-টা direct video recording-এর জন্য teleprompter-friendly
          style-এ লেখা হয়েছে।
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>এই lesson-এর goal খুব clear আর practical।</p>
        <p>Student যেন বুঝতে পারে electron flow বলতে কী বোঝায়।</p>
        <p>সে যেন বুঝতে পারে basic DC circuit-এ electron কোন দিকে move করে।</p>
        <p>
          আর সে যেন electron flow আর conventional current direction-এর difference
          পরিষ্কারভাবে ধরতে পারে।
        </p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>আসসালামু আলাইকুম, welcome.</p>
        <PauseCue />
        <p>এই lesson-এ আমরা electron flow নিয়ে শিখব।</p>
        <p>
          এই topic খুব useful, কারণ current direction নিয়ে beginner-রা অনেক সময়
          confused হয়ে যায়।
        </p>
        <PauseCue label="Short Pause" />
        <EmphasisLine>
          Electron flow আমাদের দেখায় circuit-এর ভিতরে real negative charge কোন
          দিকে move করছে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Core Idea" cue="Teach Slowly">
        <p>চলুন idea-টা খুব simple করে বুঝি।</p>
        <PauseCue />
        <p>Electron হলো negatively charged particle।</p>
        <p>যখন circuit path complete হয়, তখন এই electron conductor-এর মধ্যে drift করে।</p>
        <p>
          Basic DC circuit-এ electron negative terminal থেকে positive terminal-এর
          দিকে move করে।
        </p>
        <EmphasisLine>
          Electron flow মানে negative charge negative terminal থেকে positive
          terminal-এর দিকে যাচ্ছে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Explain Why It Matters" cue="Connect to Use">
        <p>এই topic important, কারণ student-রা দুই ধরনের direction দেখে।</p>
        <PauseCue />
        <p>একটা হলো electron flow, আরেকটা হলো conventional current।</p>
        <p>
          এই difference না বুঝলে diagram, explanation, আর later topics confusing
          হয়ে যায়।
        </p>
        <EmphasisLine>
          Electron flow আর conventional current একই circuit বোঝায়, কিন্তু direction
          এক না।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Point to the Circuit" cue="Point to Circuit">
        <p>এখন simulation-এর circuit-এর দিকে তাকান।</p>
        <PauseCue label="Point to Negative Terminal" />
        <p>Negative terminal হলো সেই side যেখান থেকে electron drift শুরু করে।</p>
        <PauseCue label="Point to Positive Terminal" />
        <p>তারপর electron wire আর component-এর ভিতর দিয়ে positive terminal-এর দিকে যায়।</p>
        <p>এটাই conductor-এর ভিতরে charge carrier-এর real movement।</p>
        <EmphasisLine>
          Path complete না হলে electron continuous ভাবে move করতে পারবে না।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Explain the Lesson Values" cue="Explain with Numbers">
        <p>এখন lesson-এর values ব্যবহার করে বুঝি।</p>
        <PauseCue />
        <p>Battery voltage হলো 12 volts।</p>
        <p>Resistance হলো 6 ohms।</p>
        <p>তাই current হয়ে যায় 2 amps।</p>
        <p>
          এর মানে push যথেষ্ট strong, তাই simulation-এ আমরা clear medium flow
          দেখতে পাই।
        </p>
        <EmphasisLine>
          Direction-এর idea আর current value একই circuit-এর ভিতরে একসাথে কাজ
          করে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Explain the Formula" cue="Formula">
        <p>এখন simple formula-টা দেখি।</p>
        <PauseCue />
        <p>Current equals voltage divided by resistance।</p>
        <p>অর্থাৎ আমরা লিখি I equals V over R।</p>
        <p>এখানে 12 volts আর 6 ohms হলে current হয় 2 amps।</p>
        <EmphasisLine>
          Formula current-এর value দেয়, আর electron flow charge-এর real direction
          বোঝায়।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Explain Conventional Current" cue="Clarify Direction">
        <p>এখন খুব common একটা confusion clear করি।</p>
        <PauseCue />
        <p>বেশিরভাগ electrical diagram conventional current ব্যবহার করে।</p>
        <p>সেখানে current positive থেকে negative direction-এ দেখানো হয়।</p>
        <p>কিন্তু electron flow basic DC circuit-এ negative থেকে positive যায়।</p>
        <p>তাই দুটো arrow opposite direction-এ দেখা যেতে পারে।</p>
        <EmphasisLine>
          Real electron motion আর standard diagram current direction basic DC
          circuit-এ opposite হয়।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Real-World Example" cue="Connect to Real Life">
        <p>একটি battery, wire, আর small lamp কল্পনা করুন।</p>
        <PauseCue label="উদাহরণ দাও" />
        <p>যদি path complete হয়, electron wire-এর মধ্যে drift করবে এবং lamp জ্বলতে পারবে।</p>
        <p>
          কিন্তু textbook বা training diagram-এ current arrow উল্টো দিকে দেখাতে
          পারে, কারণ ওগুলো conventional current ব্যবহার করে।
        </p>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Common Beginner Reminder" cue="Clarify">
        <p>এখানে beginner-দের একটা common mistake আছে।</p>
        <PauseCue />
        <p>অনেকে ভাবে electron flow আর conventional current একই direction হবে।</p>
        <p>কিন্তু সেটা ঠিক না।</p>
        <p>এরা একই circuit বোঝায়, কিন্তু দুইটা আলাদা direction convention ব্যবহার করে।</p>
        <EmphasisLine>
          Arrow opposite দেখলে ভয় পাবেন না। আগে দেখুন lesson কোন convention ব্যবহার করছে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Short Recap" cue="Recap">
        <p>শেষ করার আগে key points দ্রুত দেখি।</p>
        <PauseCue />
        <p>Electron flow real negative charge movement বোঝায়।</p>
        <p>Basic DC circuit-এ electron negative থেকে positive যায়।</p>
        <p>Conventional current positive থেকে negative যায়।</p>
        <p>Simple DC circuit-এ এই দুই direction opposite হয়।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 11: Closing" cue="End">
        <p>So, big idea খুব clear।</p>
        <PauseCue label="শেষে জোর দাও" />
        <EmphasisLine>
          Electron flow real electron movement বোঝায়, আর conventional current
          diagram-এ used standard direction বোঝায়।
        </EmphasisLine>
        <p>
          এই comparison clear হলে later electronics topics অনেক easier হয়ে যায়।
        </p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          আসসালামু আলাইকুম, welcome. এই lesson-এ আমরা electron flow নিয়ে শিখব।
          এই topic খুব useful, কারণ current direction নিয়ে beginner-রা অনেক সময়
          confused হয়ে যায়।
        </p>
        <PauseCue label="Short Pause" />
        <p>
          Electron flow আমাদের দেখায় circuit-এর ভিতরে real negative charge কোন
          দিকে move করছে।
        </p>
        <PauseCue />
        <p>
          Electron হলো negatively charged particle। যখন circuit path complete
          হয়, তখন electron conductor-এর মধ্যে drift করে। Basic DC circuit-এ
          electron negative terminal থেকে positive terminal-এর দিকে move করে।
        </p>
        <PauseCue label="Point to Circuit" />
        <p>
          এখন simulation-এর circuit-এর দিকে তাকান। Negative terminal হলো সেই
          side যেখান থেকে electron drift শুরু করে। তারপর electron wire আর
          component-এর ভিতর দিয়ে positive terminal-এর দিকে যায়। এটাই real charge
          carrier movement।
        </p>
        <PauseCue label="Explain with Numbers" />
        <p>
          এই lesson-এ battery voltage হলো 12 volts, আর resistance হলো 6 ohms।
          তাই current হয়ে যায় 2 amps। এই value আমাদের simulation-এ clear medium
          flow দেখায়।
        </p>
        <PauseCue label="Formula" />
        <p>
          Simple formula হলো current equals voltage divided by resistance। অর্থাৎ
          I equals V over R। এখানে 12 volts আর 6 ohms হলে current হয় 2 amps।
          Formula current value দেয়, আর electron flow charge-এর real direction
          বোঝায়।
        </p>
        <PauseCue label="Clarify Direction" />
        <p>
          একটা important point হলো, বেশিরভাগ electrical diagram conventional
          current ব্যবহার করে। সেখানে direction positive থেকে negative হয়। কিন্তু
          electron flow basic DC circuit-এ negative থেকে positive যায়। তাই দুই
          direction opposite দেখা যায়।
        </p>
        <PauseCue label="উদাহরণ দাও" />
        <p>
          একটি battery, wire, আর small lamp কল্পনা করুন। যদি path complete হয়,
          electron drift করবে এবং lamp জ্বলবে। কিন্তু diagram-এ current arrow
          উল্টো দিকে থাকতে পারে, কারণ সেটা conventional current দেখাচ্ছে।
        </p>
        <PauseCue label="শেষে জোর দাও" />
        <p>
          তাই শেষ কথা হলো, electron flow real electron movement বোঝায়, আর
          conventional current diagram-এর standard direction বোঝায়। এই difference
          clear হলে later electronics topics follow করা অনেক easier হয়ে যায়।
          ধন্যবাদ।
        </p>
      </ScriptBlock>
    </div>
  );
}
