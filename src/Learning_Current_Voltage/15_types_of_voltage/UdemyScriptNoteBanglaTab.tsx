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
          Types of Voltage
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          এই version-টা direct video recording-এর জন্য teleprompter-friendly
          style-এ লেখা হয়েছে।
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>এই lesson-এর goal খুব simple আর practical।</p>
        <p>Student যেন বুঝতে পারে voltage different form-এ থাকতে পারে।</p>
        <p>সে যেন direct voltage আর alternating voltage-এর main difference বুঝতে পারে।</p>
        <p>আর সে যেন AC voltage-কে peak, RMS, আর frequency-এর মতো idea দিয়ে describe করতে শিখে।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>আসসালামু আলাইকুম, welcome.</p>
        <PauseCue />
        <p>এই lesson-এ আমরা voltage-এর main types নিয়ে শিখব।</p>
        <p>এই lesson খুব useful, কারণ voltage type circuit কীভাবে charge push করবে, সেটা বদলে দেয়।</p>
        <PauseCue label="Short Pause" />
        <EmphasisLine>
          এক ধরনের voltage steady থাকে, আরেক ধরনের voltage সময়ের সাথে বদলায়।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Core Idea" cue="Teach Slowly">
        <p>চলুন idea-টা খুব simple করে দেখি।</p>
        <PauseCue />
        <p>Direct voltage, বা DC voltage, steady থাকে এবং এক direction-এ push দেয়।</p>
        <p>Alternating voltage, বা AC voltage, repeat pattern-এ direction change করে।</p>
        <p>তাই charge-এর উপর push voltage type অনুযায়ী অনেক আলাদা দেখতে পারে।</p>
        <EmphasisLine>
          Voltage type আমাদের বলে electrical push সময়ের সাথে কীভাবে behave করছে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Explain Why It Matters" cue="Connect to Use">
        <p>এই topic important, কারণ সব real device একই ধরনের voltage use করে না।</p>
        <PauseCue />
        <p>কিছু system steady DC voltage use করে।</p>
        <p>আর কিছু system changing AC voltage use করে।</p>
        <p>Voltage type আগে বুঝতে পারলে circuit-এর বাকি behavior অনেক দ্রুত বোঝা যায়।</p>
        <EmphasisLine>
          কোনো system বুঝতে গেলে আগে জিজ্ঞেস করুন, এটি কোন ধরনের voltage use করছে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Point to the Simulation" cue="Point to Screen">
        <p>এখন simulation-এর দিকে তাকান।</p>
        <PauseCue label="Point to DC View" />
        <p>DC side একটি steady voltage level দেখাচ্ছে।</p>
        <PauseCue label="Point to AC View" />
        <p>AC side এমন voltage দেখাচ্ছে যা rise করে, fall করে, আর direction change করে।</p>
        <p>এই visual difference-টাই দুই ধরনের voltage সহজে বোঝায়।</p>
        <EmphasisLine>
          DC steady দেখায়। AC repeating wave-এর মতো দেখায়।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Use the Lesson Values" cue="Explain with Numbers">
        <p>এই lesson-এ DC voltage হলো 10 volts।</p>
        <PauseCue />
        <p>DC resistance হলো 5 ohms।</p>
        <p>তাই DC current হয় 2 amps।</p>
        <p>AC side-এ peak voltage হলো 10 volts, frequency হলো 1 hertz, আর resistance হলো 5 ohms।</p>
        <EmphasisLine>
          Size কাছাকাছি হলেও DC voltage আর AC voltage-এর behavior এক না।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Explain the Formula View" cue="Formula">
        <p>এখন একটি useful AC idea-এর সাথে এটি connect করি।</p>
        <PauseCue />
        <p>AC-এর জন্য peak voltage-ই সবকিছু না।</p>
        <p>আমরা RMS-ও use করি, যার মানে root mean square।</p>
        <p>Simple practice-এ RMS equals peak divided by square root of 2।</p>
        <p>তাই peak voltage যদি 10 volts হয়, RMS voltage হয় প্রায় 7.07 volts।</p>
        <p>আর সেই RMS voltage আর একই 5 ohm resistance দিয়ে RMS current হয় প্রায় 1.41 amps।</p>
        <EmphasisLine>
          RMS আমাদের AC voltage-এর useful working size বুঝতে সাহায্য করে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Real-World Example" cue="Connect to Real Life">
        <p>একটি battery charger আর একটি wall outlet কল্পনা করুন।</p>
        <PauseCue label="উদাহরণ দাও" />
        <p>Battery side সাধারণত steady DC voltage-এ কাজ করে।</p>
        <p>Wall outlet সাধারণত AC voltage দেয়।</p>
        <p>এই কারণেই অনেক device final circuit use করার আগে adapter বা power supply stage দরকার হয়।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Common Beginner Reminder" cue="Clarify">
        <p>এখানে beginner-দের একটি common mistake আছে।</p>
        <PauseCue />
        <p>অনেকে ভাবে voltage মানেই শুধু number value।</p>
        <p>কিন্তু voltage time-এর সাথে কীভাবে behave করছে, সেটাও equally important।</p>
        <p>Voltage type ignore করলে পুরো system-টাই ভুল বোঝা হতে পারে।</p>
        <EmphasisLine>
          Voltage শুধু size-এর বিষয় না। এটি behavior-এর বিষয়ও।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Short Recap" cue="Recap">
        <p>শেষ করার আগে key points দ্রুত দেখি।</p>
        <PauseCue />
        <p>Voltage different form-এ থাকতে পারে।</p>
        <p>DC voltage steady এবং one-directional।</p>
        <p>AC voltage সময়ের সাথে direction change করে।</p>
        <p>AC-কে peak, RMS, আর frequency দিয়ে describe করা হয়।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Closing" cue="End">
        <p>So, big idea খুব clear।</p>
        <PauseCue label="শেষে জোর দাও" />
        <EmphasisLine>
          কোনো circuit ভালোভাবে বুঝতে হলে আগে বুঝতে হবে এটি কোন ধরনের voltage use করছে।
        </EmphasisLine>
        <p>এই এক ধাপ বুঝে নিলে বাকি lesson অনেক সহজ হয়ে যায়।</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          আসসালামু আলাইকুম, welcome। এই lesson-এ আমরা voltage-এর main types
          নিয়ে শিখব। এই lesson খুব useful, কারণ voltage type circuit কীভাবে
          charge push করবে, সেটা বদলে দেয়।
        </p>
        <PauseCue label="Short Pause" />
        <p>
          এক ধরনের voltage steady থাকে, আরেক ধরনের voltage সময়ের সাথে বদলায়।
        </p>
        <PauseCue />
        <p>
          Direct voltage, বা DC voltage, steady থাকে এবং এক direction-এ push
          দেয়। Alternating voltage, বা AC voltage, repeat pattern-এ direction
          change করে। তাই charge-এর উপর push voltage type অনুযায়ী অনেক আলাদা
          দেখতে পারে।
        </p>
        <PauseCue label="Point to Screen" />
        <p>
          এখন simulation-এর দিকে তাকান। DC side একটি steady voltage level
          দেখাচ্ছে। AC side এমন voltage দেখাচ্ছে যা rise করে, fall করে, আর
          direction change করে। এই visual difference-টাই দুই ধরনের voltage
          সহজে বোঝায়।
        </p>
        <PauseCue label="Explain with Numbers" />
        <p>
          এই lesson-এ DC voltage হলো 10 volts। DC resistance হলো 5 ohms। তাই
          DC current হয় 2 amps। AC side-এ peak voltage হলো 10 volts,
          frequency হলো 1 hertz, আর resistance হলো 5 ohms।
        </p>
        <PauseCue label="Formula" />
        <p>
          AC-এর জন্য peak voltage-ই সবকিছু না। আমরা RMS-ও use করি, যার মানে
          root mean square। Simple practice-এ RMS equals peak divided by square
          root of 2। তাই peak voltage যদি 10 volts হয়, RMS voltage হয় প্রায়
          7.07 volts। আর সেই RMS voltage আর একই 5 ohm resistance দিয়ে RMS
          current হয় প্রায় 1.41 amps।
        </p>
        <PauseCue label="উদাহরণ দাও" />
        <p>
          একটি battery charger আর একটি wall outlet কল্পনা করুন। Battery side
          সাধারণত steady DC voltage-এ কাজ করে। Wall outlet সাধারণত AC voltage
          দেয়। এই কারণেই অনেক device final circuit use করার আগে adapter বা
          power supply stage দরকার হয়।
        </p>
        <PauseCue label="Clarify" />
        <p>
          একটি important reminder হলো, voltage শুধু size-এর বিষয় না। এটি
          behavior-এর বিষয়ও। Voltage type ignore করলে পুরো system ভুল বোঝা হতে
          পারে।
        </p>
        <PauseCue label="শেষে জোর দাও" />
        <p>
          তাই শেষ কথা হলো, কোনো circuit ভালোভাবে বুঝতে হলে আগে বুঝতে হবে এটি
          কোন ধরনের voltage use করছে। এই এক ধাপ বুঝে নিলে বাকি lesson অনেক
          সহজ হয়ে যায়।
        </p>
      </ScriptBlock>
    </div>
  );
}
