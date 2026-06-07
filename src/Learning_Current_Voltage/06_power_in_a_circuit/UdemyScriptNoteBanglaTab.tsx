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
          Power in a Circuit
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          এই version-টা direct video recording-এর জন্য teleprompter-friendly
          style-এ লেখা হয়েছে।
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>এই lesson-এর goal সহজ এবং practical.</p>
        <p>Student যেন সহজ ভাষায় electrical power কী সেটা বুঝতে পারে।</p>
        <p>সে যেন বুঝতে পারে power বলে circuit কত দ্রুত electrical energy ব্যবহার করছে।</p>
        <p>আর সে যেন basic formula P equals V times I বুঝতে পারে।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>আসসালামু আলাইকুম, welcome.</p>
        <PauseCue />
        <p>এই lesson-এ আমরা শিখবো circuit-এ power বলতে কী বোঝায়।</p>
        <p>Basic electronics-এ এটা খুব useful একটি idea.</p>
        <PauseCue label="Short Pause" />
        <p>আপনি যদি beginner হন, তাতেও কোনো সমস্যা নেই.</p>
        <p>আমরা lesson-টা সহজ, clear, আর practical রাখবো.</p>
        <EmphasisLine>
          এক লাইনে বললে, power আমাদের বলে electrical energy কত দ্রুত ব্যবহার হচ্ছে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Basic Idea" cue="Teach Slowly">
        <p>এখন idea-টা আরো সহজ করি.</p>
        <PauseCue />
        <p>Voltage হলো push.</p>
        <p>Current হলো flow.</p>
        <p>Power বলে circuit কত জোরে কাজ করছে.</p>
        <p>তাই power বেশি হলে circuit প্রতি second-এ বেশি electrical work করছে।</p>
        <EmphasisLine>
          Power circuit-এর বাইরে কিছু না। এটা voltage আর current একসাথে কাজ করার ফল।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Introduce the Formula" cue="Show Formula">
        <p>সবচেয়ে common power formula হলো এইটা.</p>
        <PauseCue />
        <p>P equals V times I.</p>
        <p>মানে power equals voltage multiplied by current.</p>
        <p>P হলো power.</p>
        <p>V হলো voltage.</p>
        <p>I হলো current.</p>
        <EmphasisLine>
          এই একটাই formula basic power idea বুঝতে যথেষ্ট।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Explain Why It Matters" cue="Connect to Use">
        <p>Power important কারণ এটা বলে একটি device কতটা কাজ করছে.</p>
        <PauseCue />
        <p>A brighter lamp often means more power.</p>
        <p>A stronger heater often means more power.</p>
        <p>আর power খুব বেশি হয়ে গেলে কোনো part unsafe বা overloaded হতে পারে.</p>
        <EmphasisLine>
          এই কারণেই design, testing, troubleshooting, আর real electrical work-এ power খুব important।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Use the Lesson Values" cue="Explain with Numbers">
        <p>এখন lesson-এর values ব্যবহার করি.</p>
        <PauseCue />
        <p>Voltage হলো 12 volts.</p>
        <p>Current হলো 1.5 amps.</p>
        <p>তাহলে power equals 12 times 1.5.</p>
        <p>Result আসে 18 watts.</p>
        <EmphasisLine>
          এটা voltage আর current থেকে power calculate করার একটি simple example।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Point to the Circuit" cue="Point to Circuit">
        <p>এখন simulation-এর circuit-এর দিকে তাকান.</p>
        <PauseCue label="Battery দেখাও" />
        <p>Battery voltage push দিচ্ছে.</p>
        <PauseCue label="Current দেখাও" />
        <p>Moving charge-টাই current.</p>
        <PauseCue label="Output দেখাও" />
        <p>Power আমাদের বলে পুরো circuit কত electrical work করছে.</p>
        <p>তাই voltage আর current একসাথে change হলে power-ও change হয়.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Show What Changes Power" cue="Use Controls">
        <p>Simulation-এর values change করলে কী হয় সেটা লক্ষ্য করুন.</p>
        <PauseCue />
        <p>যদি voltage বাড়ে আর current same থাকে, power বাড়ে.</p>
        <p>যদি current বাড়ে আর voltage same থাকে, power-ও বাড়ে.</p>
        <p>যদি এদের যেকোনো একটা কমে যায়, power-ও কমে যায়.</p>
        <EmphasisLine>
          Power দুইটার ওপরই depend করে, শুধু voltage বা শুধু current-এর ওপর না।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Real-World Example" cue="Connect to Real Life">
        <p>এখন একটি lamp বা heater কল্পনা করুন.</p>
        <PauseCue label="উদাহরণ দাও" />
        <p>একটি small night lamp low power ব্যবহার করে.</p>
        <p>কিন্তু একটি room heater অনেক বেশি power ব্যবহার করে.</p>
        <p>এই difference দেখে আমরা বুঝতে পারি কোন device কত জোরে কাজ করছে আর কত electrical energy দরকার।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Common Beginner Reminder" cue="Clarify">
        <p>এখানে beginner-দের একটি common mistake আছে.</p>
        <PauseCue />
        <p>অনেকে মনে করে current আর power একই জিনিস.</p>
        <p>আসলে তা না.</p>
        <p>Current হলো charge-এর flow. আর power হলো electrical work-এর rate.</p>
        <EmphasisLine>
          Current story-এর একটা অংশ। Power আমাদের বড় picture দেখায়।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Short Recap" cue="Recap">
        <p>শেষ করার আগে key points দ্রুত দেখে নেই.</p>
        <PauseCue />
        <p>Power বলে electrical energy কত দ্রুত ব্যবহার হচ্ছে.</p>
        <p>এটা watt-এ measured হয়.</p>
        <p>Main formula হলো P equals V times I.</p>
        <p>Higher voltage বা higher current usually higher power তৈরি করে.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 11: Closing" cue="End">
        <p>So, big idea খুব simple.</p>
        <PauseCue label="শেষে জোর দাও" />
        <EmphasisLine>
          Power in a circuit আমাদের বলে circuit কত জোরে কাজ করছে এবং electrical energy কত দ্রুত ব্যবহার হচ্ছে।
        </EmphasisLine>
        <p>এটা clear হলে real electrical device explain করা অনেক সহজ হয়.</p>
        <p>Next lessons-এ আমরা এই foundation-এর ওপর আরও build করবো.</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          আসসালামু আলাইকুম, welcome. এই lesson-এ আমরা শিখবো circuit-এ power
          বলতে কী বোঝায়।
        </p>
        <PauseCue label="Short Pause" />
        <p>
          আপনি যদি beginner হন, তাতেও কোনো সমস্যা নেই. আমরা lesson-টা সহজ,
          clear, আর practical রাখবো।
        </p>
        <PauseCue />
        <p>
          এক লাইনে বললে, power আমাদের বলে electrical energy কত দ্রুত ব্যবহার
          হচ্ছে।
        </p>
        <PauseCue label="Emphasize" />
        <p>
          Voltage হলো push. Current হলো flow. Power বলে circuit কত জোরে কাজ
          করছে।
        </p>
        <PauseCue label="Show Formula" />
        <p>
          সবচেয়ে common formula হলো P equals V times I. এর মানে power equals
          voltage multiplied by current।
        </p>
        <PauseCue label="Explain with Numbers" />
        <p>
          এই lesson-এ voltage হলো 12 volts আর current হলো 1.5 amps. তাই power
          equals 12 times 1.5, আর result আসে 18 watts।
        </p>
        <PauseCue label="Point to Circuit" />
        <p>
          এখন circuit-এর দিকে তাকান. Battery voltage push দিচ্ছে. Moving
          charge-টাই current. আর power আমাদের বলে পুরো circuit কত electrical
          work করছে।
        </p>
        <PauseCue label="Use Controls" />
        <p>
          Values change করলে আমরা দেখি, voltage বাড়লে power বাড়ে. Current
          বাড়লেও power বাড়ে।
        </p>
        <PauseCue label="উদাহরণ দাও" />
        <p>
          একটি small lamp low power ব্যবহার করতে পারে, কিন্তু একটি heater অনেক
          বেশি power ব্যবহার করে. এই difference থেকেই আমরা device-এর কাজের
          strength বুঝি।
        </p>
        <PauseCue label="Clarify" />
        <p>
          একটি important reminder হলো, current আর power একই জিনিস না. Current
          হলো flow, আর power হলো electrical work-এর rate।
        </p>
        <PauseCue label="শেষে জোর দাও" />
        <p>
          তাই শেষ কথা হলো, power in a circuit আমাদের বলে circuit কত জোরে কাজ
          করছে এবং electrical energy কত দ্রুত ব্যবহার হচ্ছে। ধন্যবাদ, আর next
          lesson-এ আমরা এই foundation-এর ওপর আরও build করবো।
        </p>
      </ScriptBlock>
    </div>
  );
}
