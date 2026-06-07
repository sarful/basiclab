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
          Udemy Script Note Bangla
        </div>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          Current কী
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          এই version-টা direct video recording-এর জন্য teleprompter-friendly style-এ লেখা।
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>এই lesson-এর goal খুব clear।</p>
        <p>Student-রা যেন simple language-এ বুঝতে পারে current কী।</p>
        <p>তারা যেন জানে current হলো electric charge-এর actual flow।</p>
        <p>এবং তারা যেন এটাও বুঝতে পারে যে voltage সাধারণত current বাড়ায়, আর resistance সাধারণত current কমায়।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>আসসালামু আলাইকুম, welcome.</p>
        <PauseCue />
        <p>এই lesson-এ আমরা একটি simple question-এর answer খুঁজব।</p>
        <p>Current কী?</p>
        <PauseCue label="Short Pause" />
        <p>তুমি যদি একদম beginner হও, তাহলেও কোনো সমস্যা নেই।</p>
        <p>আমরা এটি simple আর practical way-এ শিখব।</p>
        <EmphasisLine>
          একদম short sentence-এ বললে, current হলো circuit-এর মধ্যে দিয়ে electric charge flow করার পরিমাণ।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Basic Idea" cue="Teach Slowly">
        <p>এখন এই idea-টাকে আরও simple করি।</p>
        <PauseCue />
        <p>Electric charge তখনই move করতে পারে, যখন path complete থাকে।</p>
        <p>যদি প্রতি second-এ বেশি charge move করে, current বেশি হয়।</p>
        <p>যদি কম charge move করে, current কম হয়।</p>
        <EmphasisLine>
          তাই current আমাদের বলে circuit-এর ভেতর আসলে কত flow হচ্ছে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Connect Current to Voltage" cue="Point to Voltage">
        <p>এখন simulation-এর voltage value-টার দিকে তাকাও।</p>
        <PauseCue label="Point to Voltage" />
        <p>Voltage হলো electrical push।</p>
        <p>Push stronger হলে charge সাধারণত আরও সহজে move করতে পারে।</p>
        <p>ফলে বেশিরভাগ সময় current-ও বেড়ে যায়।</p>
        <EmphasisLine>
          Voltage আর current এক জিনিস নয়, কিন্তু voltage current-এর ওপর strong effect ফেলে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Connect Current to Resistance" cue="Point to Resistor">
        <p>এবার resistor-এর দিকে তাকাও।</p>
        <PauseCue label="Point to Resistor" />
        <p>Resistance হলো flow-এর বাধা।</p>
        <p>Resistance বড় হলে charge move করা harder হয়ে যায়।</p>
        <p>ফলে current সাধারণত কমে যায়।</p>
        <EmphasisLine>
          Resistance বেশি মানে সাধারণত current কম।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Show the Current Value" cue="Point to Current">
        <p>এখন current reading-টার দিকে focus করি।</p>
        <PauseCue label="Point to Current" />
        <p>এই number-টা আমাদের বলে আসলে কত charge move করছে।</p>
        <p>এই simulation-এ battery দেয় 12 volt।</p>
        <p>Resistor হলো 6 ohm।</p>
        <p>এই combination-এর কারণে current হয় 2 ampere।</p>
        <EmphasisLine>
          Current শুধু একটা number না। এটি বলে circuit আসলে কী করছে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Simple Formula" cue="Explain Formula">
        <p>Current-এর জন্য একটি very useful formula-ও আছে।</p>
        <PauseCue />
        <p>আমরা লিখি: I equals V divided by R.</p>
        <p>মানে current equals voltage divided by resistance।</p>
        <p>তাই এই lesson-এ 12 divided by 6 equals 2।</p>
        <EmphasisLine>
          I equals V over R beginner electronics-এর সবচেয়ে useful idea-গুলোর একটি।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Water Analogy" cue="Use Analogy">
        <p>এখন current imagine করার একটি simple way দেখি।</p>
        <PauseCue />
        <p>Pipe-এর মধ্যে পানি flow করার কথা ভাবো।</p>
        <p>Water flow হলো electric current-এর মতো।</p>
        <p>Pump pressure হলো voltage-এর মতো।</p>
        <p>Narrow pipe হলো resistance-এর মতো।</p>
        <EmphasisLine>
          Pressure বেশি হলে flow বাড়ে। Restriction বেশি হলে flow কমে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Real-World Example" cue="Connect to Real Life">
        <p>এখন একটি torch light-এর কথা ভাবো।</p>
        <PauseCue label="Give Example" />
        <p>Battery ভালো থাকলে আর path complete থাকলে current flow করে, আর lamp জ্বলে।</p>
        <p>Battery weak হলে current কমে যায়।</p>
        <p>Path ভেঙে গেলে current বন্ধ হয়ে যায়।</p>
        <p>এই same idea light, fan, charger, motor, আর control panel-এও কাজ করে।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Short Recap" cue="Recap">
        <p>শেষ করার আগে দ্রুত recap করি।</p>
        <PauseCue />
        <p>Current হলো electric charge-এর actual flow।</p>
        <p>Current চলার জন্য complete path দরকার।</p>
        <p>Voltage সাধারণত current বাড়ায়।</p>
        <p>Resistance সাধারণত current কমায়।</p>
        <p>I equals V over R দিয়ে current calculate করা যায়।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Closing" cue="End">
        <p>তাই main idea খুব simple।</p>
        <PauseCue label="Final Emphasis" />
        <EmphasisLine>
          Current আমাদের বলে circuit-এর মধ্যে আসলে কত electric charge move করছে।
        </EmphasisLine>
        <p>Current বুঝতে পারলে পরের অনেক circuit topic আরও সহজ লাগবে।</p>
        <p>Next lesson-এ আমরা এই foundation-এর ওপর আরও build করব।</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          আসসালামু আলাইকুম, welcome. এই lesson-এ আমরা একটি simple question-এর
          answer শিখব: current কী?
        </p>
        <PauseCue label="Short Pause" />
        <p>
          তুমি যদি একদম beginner হও, তাহলেও কোনো সমস্যা নেই। আমরা এটি simple,
          practical, আর easy way-এ শিখব।
        </p>
        <PauseCue />
        <p>
          একদম short sentence-এ বললে, current হলো circuit-এর মধ্যে দিয়ে electric
          charge flow করার পরিমাণ।
        </p>
        <PauseCue label="Emphasize" />
        <p>
          সহজ ভাষায়, current আমাদের বলে circuit-এর ভেতর আসলে কত flow হচ্ছে। যদি
          প্রতি second-এ বেশি charge move করে, current বেশি হয়। যদি কম charge
          move করে, current কম হয়।
        </p>
        <PauseCue label="Point to Voltage" />
        <p>
          এখন simulation-এর voltage-টার দিকে তাকাও। Voltage হলো electrical
          push। Push stronger হলে charge সাধারণত আরও সহজে move করতে পারে, তাই
          current-ও সাধারণত বেড়ে যায়।
        </p>
        <PauseCue label="Point to Resistor" />
        <p>
          এবার resistor-এর দিকে তাকাও। Resistance হলো flow-এর বাধা। Resistance
          বড় হলে charge move করা harder হয়ে যায়, তাই current সাধারণত কমে যায়।
        </p>
        <PauseCue label="Point to Current" />
        <p>
          তাই current depend করে push আর blockage-এর ওপর। এই lesson-এ battery
          দেয় 12 volt, resistor হলো 6 ohm, আর current হয় 2 ampere।
        </p>
        <PauseCue />
        <p>
          আমরা current একটি simple formula দিয়েও calculate করতে পারি। I equals V
          divided by R. অর্থাৎ current equals voltage divided by resistance। তাই
          12 divided by 6 gives us 2.
        </p>
        <PauseCue label="Use Analogy" />
        <p>
          Current imagine করার easiest way হলো water flow analogy। Water flow
          হলো current-এর মতো। Pump pressure হলো voltage-এর মতো। Narrow pipe
          হলো resistance-এর মতো। Pressure বেশি হলে flow বাড়ে। Restriction বেশি
          হলে flow কমে।
        </p>
        <PauseCue label="Give Example" />
        <p>
          এবার একটি torch light-এর কথা ভাবো। Battery ভালো থাকলে আর path
          complete থাকলে current flow করে এবং lamp জ্বলে। Battery weak হলে
          current কমে যায়। Path ভেঙে গেলে current বন্ধ হয়ে যায়।
        </p>
        <PauseCue label="Final Emphasis" />
        <p>
          তাই শেষ করার আগে একটাই clear idea মনে রাখো। Current আমাদের বলে
          circuit-এর মধ্যে আসলে কত electric charge move করছে। Thank you, and
          next lesson-এ আমরা এখান থেকে আরও এগোব।
        </p>
      </ScriptBlock>
    </div>
  );
}
