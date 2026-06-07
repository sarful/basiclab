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
          AC vs DC Basics
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          এই version-টা direct video recording-এর জন্য teleprompter-friendly
          style-এ লেখা হয়েছে।
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>এই lesson-এর goal খুব simple আর practical।</p>
        <p>Student যেন AC আর DC-এর basic difference বুঝতে পারে।</p>
        <p>সে যেন বুঝতে পারে DC এক steady direction-এ চলে।</p>
        <p>আর সে যেন বুঝতে পারে AC বারবার direction change করে।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>আসসালামু আলাইকুম, welcome.</p>
        <PauseCue />
        <p>এই lesson-এ আমরা AC আর DC-এর basics শিখব।</p>
        <p>Electricity learning-এর জন্য এটি খুব useful beginner topic।</p>
        <PauseCue label="Short Pause" />
        <EmphasisLine>
          DC একদিকে চলে। AC বারবার direction change করে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Core Idea" cue="Teach Slowly">
        <p>চলুন main idea-টা খুব easy করে দেখি।</p>
        <PauseCue />
        <p>DC মানে direct current।</p>
        <p>এর মানে current এক steady direction-এ move করে।</p>
        <p>AC মানে alternating current।</p>
        <p>এর মানে current সময়ের সাথে direction বদলায়।</p>
        <EmphasisLine>
          সবচেয়ে বড় difference হলো direction behavior।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Explain Why It Matters" cue="Connect to Use">
        <p>এই topic important, কারণ real electrical system-এ AC আর DC দুটোই ব্যবহৃত হয়।</p>
        <PauseCue />
        <p>Batteries, small electronics, আর portable devices DC ব্যবহার করে।</p>
        <p>Wall outlet আর large power distribution system সাধারণত AC ব্যবহার করে।</p>
        <p>এই difference বুঝলে later lessons অনেক easier হয়ে যায়।</p>
        <EmphasisLine>
          আজ সবকিছু মুখস্থ করার দরকার নেই। শুধু বুঝুন কোনটি কীভাবে behave করে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Point to the Simulation" cue="Point to Screen">
        <p>এখন simulation-এর দিকে তাকান।</p>
        <PauseCue label="Point to DC Side" />
        <p>DC side steady one-direction push দেখাচ্ছে।</p>
        <PauseCue label="Point to AC Side" />
        <p>AC side back-and-forth changing push দেখাচ্ছে।</p>
        <p>এই changing behavior-টাই AC-কে DC থেকে আলাদা করে।</p>
        <EmphasisLine>
          একই electricity topic, কিন্তু current behavior দুই রকম।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Use the Lesson Values" cue="Explain with Numbers">
        <p>এই lesson-এ DC level হলো 6 volts।</p>
        <PauseCue />
        <p>AC peak value-ও 6 volts।</p>
        <p>AC frequency হলো 2 hertz।</p>
        <p>
          এর মানে lesson view-তে AC waveform-এর direction change behavior frequency-এর ওপর নির্ভর করছে।
        </p>
        <EmphasisLine>
          DC steady থাকে, আর AC frequency অনুযায়ী direction change করে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Explain the Formula View" cue="Formula">
        <p>এখানে একটি simple AC value idea আছে।</p>
        <PauseCue />
        <p>AC-এর ক্ষেত্রে আমরা peak value আর RMS value compare করি।</p>
        <p>RMS মানে root mean square।</p>
        <p>Simple practice-এ RMS হয় peak divided by square root of 2।</p>
        <p>তাই peak যদি 6 volts হয়, RMS হয় প্রায় 4.24 volts।</p>
        <EmphasisLine>
          Peak highest AC push দেখায়, আর RMS practical working value বুঝতে সাহায্য করে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Real-World Example" cue="Connect to Real Life">
        <p>একটি phone battery আর একটি wall outlet কল্পনা করুন।</p>
        <PauseCue label="উদাহরণ দাও" />
        <p>Phone battery DC দেয়, কারণ current এক main direction-এ move করে।</p>
        <p>Wall outlet AC দেয়, কারণ current alternating behaviour দেখায়।</p>
        <p>এই কারণেই charger আর adapter এত দরকারি।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Common Beginner Reminder" cue="Clarify">
        <p>এখানে beginner-দের একটি common mistake আছে।</p>
        <PauseCue />
        <p>অনেকে ভাবে AC মানেই strong power আর DC মানেই weak power।</p>
        <p>কিন্তু সেটাই আসল idea না।</p>
        <p>আসল difference হলো current কীভাবে behave করে আর direction কীভাবে change হয়।</p>
        <EmphasisLine>
          AC আর DC-কে strong versus weak হিসেবে ভাববেন না। Steady versus alternating হিসেবে ভাবুন।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Short Recap" cue="Recap">
        <p>শেষ করার আগে key points দ্রুত দেখি।</p>
        <PauseCue />
        <p>DC মানে direct current।</p>
        <p>DC এক steady direction-এ চলে।</p>
        <p>AC মানে alternating current।</p>
        <p>AC বারবার direction change করে।</p>
        <p>Frequency বলে AC কত দ্রুত direction change করছে।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Closing" cue="End">
        <p>So, big idea খুব clear।</p>
        <PauseCue label="শেষে জোর দাও" />
        <EmphasisLine>
          DC steady one-way current দেয়, আর AC এমন current দেয় যা বারবার direction change করে।
        </EmphasisLine>
        <p>এই picture clear হলে later lesson-এ AC আর DC অনেক বেশি সহজ লাগবে।</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          আসসালামু আলাইকুম, welcome. এই lesson-এ আমরা AC আর DC-এর basics শিখব।
          Electricity learning-এর জন্য এটি খুব useful beginner topic।
        </p>
        <PauseCue label="Short Pause" />
        <p>
          DC একদিকে চলে। AC বারবার direction change করে।
        </p>
        <PauseCue />
        <p>
          DC মানে direct current, আর এর মানে current এক steady direction-এ move
          করে। AC মানে alternating current, আর এর মানে current সময়ের সাথে
          direction বদলায়।
        </p>
        <PauseCue label="Point to Screen" />
        <p>
          এখন simulation-এর দিকে তাকান। DC side steady one-direction push
          দেখাচ্ছে। AC side back-and-forth changing push দেখাচ্ছে। এই changing
          behavior-টাই AC-কে DC থেকে আলাদা করে।
        </p>
        <PauseCue label="Explain with Numbers" />
        <p>
          এই lesson-এ DC level হলো 6 volts। AC peak value-ও 6 volts, আর AC
          frequency হলো 2 hertz। এর মানে AC behavior frequency pattern অনুযায়ী
          direction change করছে।
        </p>
        <PauseCue label="Formula" />
        <p>
          একটি useful AC idea হলো RMS। RMS মানে root mean square। Simple
          practice-এ RMS equals peak divided by square root of 2। তাই peak যদি
          6 volts হয়, RMS হয় প্রায় 4.24 volts।
        </p>
        <PauseCue label="উদাহরণ দাও" />
        <p>
          একটি phone battery আর একটি wall outlet কল্পনা করুন। Phone battery DC
          দেয়, কারণ current এক main way-এ move করে। Wall outlet AC দেয়, কারণ
          current alternating behaviour দেখায়। এই কারণেই charger আর adapter এত
          দরকারি।
        </p>
        <PauseCue label="Clarify" />
        <p>
          একটি important reminder হলো, AC মানেই strong power আর DC মানেই weak
          power নয়। আসল difference হলো steady direction versus alternating
          direction।
        </p>
        <PauseCue label="শেষে জোর দাও" />
        <p>
          তাই শেষ কথা হলো, DC steady one-way current দেয়, আর AC এমন current দেয়
          যা বারবার direction change করে। এই picture clear হলে later lesson-এ
          AC আর DC অনেক বেশি সহজ লাগবে। ধন্যবাদ।
        </p>
      </ScriptBlock>
    </div>
  );
}
