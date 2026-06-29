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
          Open Circuit vs Closed Circuit
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          এই version-টা direct video recording-এর জন্য teleprompter-friendly
          style-এ লেখা হয়েছে।
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>এই lesson-এর goal খুব clear এবং practical.</p>
        <p>Student যেন open circuit আর closed circuit-এর difference বুঝতে পারে।</p>
        <p>সে যেন বুঝতে পারে current flow করার জন্য complete path দরকার।</p>
        <p>আর path-এর ছোট break-ও কেন পুরো circuit stop করে দেয়, সেটাও যেন clear হয়।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>আসসালামু আলাইকুম, welcome.</p>
        <PauseCue />
        <p>এই lesson-এ আমরা electricity-এর সবচেয়ে important basic idea-গুলোর একটি শিখবো.</p>
        <p>Open circuit আর closed circuit-এর difference.</p>
        <PauseCue label="Short Pause" />
        <p>এই idea clear হলে অনেক circuit problem explain করা অনেক সহজ হয়ে যায়.</p>
        <EmphasisLine>
          একটি circuit তখনই কাজ করে, যখন path complete থাকে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Basic Idea" cue="Teach Slowly">
        <p>এখন idea-টা সহজ করে দেখি.</p>
        <PauseCue />
        <p>Closed circuit-এ full path থাকে.</p>
        <p>Open circuit-এ broken path থাকে.</p>
        <p>Path complete হলে current flow করতে পারে.</p>
        <p>Path broken হলে current থেমে যায়.</p>
        <EmphasisLine>
          Closed মানে current move করতে পারে। Open মানে current move করতে পারে না।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Explain Why It Matters" cue="Connect to Use">
        <p>এই idea important কারণ every working circuit-এর জন্য complete loop দরকার.</p>
        <PauseCue />
        <p>একটি wire break হলেও পুরো circuit stop হয়ে যেতে পারে.</p>
        <p>একটি switch path open করলে load off হয়ে যায়.</p>
        <p>আবার switch path close করলে load আবার on হতে পারে.</p>
        <EmphasisLine>
          এই কারণেই path continuity real electrical work-এ খুব important।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Point to the Circuit" cue="Point to Circuit">
        <p>এখন simulation-এর দিকে তাকান.</p>
        <PauseCue label="Battery দেখাও" />
        <p>Battery charge push করার জন্য ready আছে.</p>
        <PauseCue label="Break দেখাও" />
        <p>কিন্তু path open হলে charge loop complete করতে পারে না.</p>
        <PauseCue label="LED দেখাও" />
        <p>এই কারণেই open circuit-এ LED off থাকে.</p>
        <p>Path close হলে current move করে আর LED on হয়ে যায়.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Use the Lesson Values" cue="Explain with Numbers">
        <p>এই lesson-এ voltage হলো 9 volts আর resistance হলো 6 ohms.</p>
        <PauseCue />
        <p>Circuit closed হলে current flow করতে পারে.</p>
        <p>তখন current হয় প্রায় 1.50 amps.</p>
        <p>কিন্তু circuit open হলে current হয়ে যায় 0 amps.</p>
        <EmphasisLine>
          কারণ খুব simple. Broken path movement পুরোপুরি বন্ধ করে দেয়।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Real-World Example" cue="Connect to Real Life">
        <p>এখন একটি wall switch আর room light কল্পনা করুন.</p>
        <PauseCue label="উদাহরণ দাও" />
        <p>Switch on করলে path close হয়, আর light on হয়.</p>
        <p>Switch off করলে path open হয়, আর light off হয়ে যায়.</p>
        <p>একই idea door switch, fuse holder, push button, আর control panel-এ use হয়.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Common Beginner Reminder" cue="Clarify">
        <p>এখানে beginner-দের একটি common mistake আছে.</p>
        <PauseCue />
        <p>অনেকে ভাবে voltage থাকলেই device কাজ করবে.</p>
        <p>আসলে সবসময় তা না.</p>
        <p>Voltage থাকতে পারে, কিন্তু complete path ছাড়া current flow করবে না.</p>
        <EmphasisLine>
          শুধু voltage enough না। Circuit path-ও complete হতে হবে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Short Recap" cue="Recap">
        <p>শেষ করার আগে key points দ্রুত দেখে নেই.</p>
        <PauseCue />
        <p>Closed circuit-এ complete path থাকে.</p>
        <p>Open circuit-এ broken path থাকে.</p>
        <p>Current শুধু closed circuit-এ flow করে.</p>
        <p>Path-এর যেকোনো break পুরো circuit stop করে দিতে পারে.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Closing" cue="End">
        <p>So, big idea খুব clear.</p>
        <PauseCue label="শেষে জোর দাও" />
        <EmphasisLine>
          Path complete হলে current flow করে। Path broken হলে current stop করে।
        </EmphasisLine>
        <p>এটা electronics-এর সবচেয়ে important foundation-গুলোর একটি.</p>
        <p>একবার এটা clear হলে switch, broken wire, আর অনেক circuit problem অনেক সহজ লাগে.</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          আসসালামু আলাইকুম, welcome. এই lesson-এ আমরা electricity-এর সবচেয়ে
          important basic idea-গুলোর একটি শিখবো: open circuit আর closed circuit-এর difference।
        </p>
        <PauseCue label="Short Pause" />
        <p>
          এই idea clear হলে অনেক circuit problem explain করা অনেক সহজ হয়ে যায়।
        </p>
        <PauseCue />
        <p>
          একটি circuit তখনই কাজ করে, যখন path complete থাকে।
        </p>
        <PauseCue label="Emphasize" />
        <p>
          Closed circuit-এ full path থাকে। Open circuit-এ broken path থাকে।
          Path complete হলে current flow করে। Path broken হলে current থেমে যায়।
        </p>
        <PauseCue label="Point to Circuit" />
        <p>
          এখন simulation-এর দিকে তাকান। Battery charge push করার জন্য ready
          আছে। কিন্তু path open হলে charge loop complete করতে পারে না, তাই LED off থাকে।
          Path close হলে current move করে আর LED on হয়।
        </p>
        <PauseCue label="Explain with Numbers" />
        <p>
          এই lesson-এ voltage হলো 9 volts আর resistance হলো 6 ohms। Circuit
          closed হলে current হয় প্রায় 1.50 amps। Circuit open হলে current হয়ে
          যায় 0 amps।
        </p>
        <PauseCue label="উদাহরণ দাও" />
        <p>
          একটি wall switch আর room light ভাবুন। Switch on করলে path close হয়,
          আর light on হয়। Switch off করলে path open হয়, আর light off হয়ে যায়।
        </p>
        <PauseCue label="Clarify" />
        <p>
          একটি important reminder হলো, শুধু voltage থাকলেই device কাজ করবে না।
          Current flow করার জন্য complete path লাগবে।
        </p>
        <PauseCue label="শেষে জোর দাও" />
        <p>
          তাই শেষ কথা হলো, path complete হলে current flow করে, আর path broken
          হলে current stop করে। ধন্যবাদ, আর next lesson-এ আমরা এই foundation-এর
          ওপর আরও build করবো।
        </p>
      </ScriptBlock>
    </div>
  );
}
