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
          Ohm&apos;s Law Basics
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          এই version-টা direct video recording-এর জন্য teleprompter-friendly
          style-এ লেখা হয়েছে।
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>এই lesson-এর goal খুব clear এবং practical.</p>
        <p>Student যেন সহজ ভাষায় Ohm&apos;s Law কী সেটা বুঝতে পারে।</p>
        <p>সে যেন বুঝতে পারে voltage, current, আর resistance একে অপরের সাথে connected.</p>
        <p>আর যদি দুইটা value জানা থাকে, তাহলে তৃতীয় value calculate করা যায়।</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>আসসালামু আলাইকুম, welcome.</p>
        <PauseCue />
        <p>এই lesson-এ আমরা basic electronics-এর সবচেয়ে useful idea-গুলোর একটা শিখবো.</p>
        <p>সেটা হলো Ohm&apos;s Law.</p>
        <PauseCue label="Short Pause" />
        <p>আপনি যদি electronics-এ একেবারে beginner হন, তাতেও কোনো সমস্যা নেই.</p>
        <p>আমরা lesson-টা সহজ, practical, আর step by step রাখবো.</p>
        <EmphasisLine>
          এক লাইনে বললে, Ohm&apos;s Law voltage, current, আর resistance-এর relationship দেখায়।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Basic Idea" cue="Teach Slowly">
        <p>এখন idea-টা আরো সহজ করে দেখি.</p>
        <PauseCue />
        <p>Voltage হলো push.</p>
        <p>Current হলো flow.</p>
        <p>Resistance হলো সেই flow-এর opposition বা বাধা.</p>
        <p>Ohm&apos;s Law আমাদের বলে এই তিনটা কীভাবে একসাথে কাজ করে.</p>
        <EmphasisLine>
          তাই একটা value change হলে, অন্য value-গুলোর ওপরও তার effect পড়ে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Introduce the Formula" cue="Show Formula">
        <p>Ohm&apos;s Law-এর সবচেয়ে common form হলো এইটা.</p>
        <PauseCue />
        <p>I equals V divided by R.</p>
        <p>মানে current equals voltage divided by resistance.</p>
        <p>কিন্তু same idea আমরা আরো দুইভাবে লিখতে পারি.</p>
        <p>V equals I times R.</p>
        <p>আর R equals V divided by I.</p>
        <EmphasisLine>
          এগুলো তিনটা আলাদা law না। একই relationship-এর তিনটা useful form।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Explain Why It Matters" cue="Connect to Use">
        <p>Ohm&apos;s Law useful কারণ এটা আমাদের missing value বের করতে সাহায্য করে.</p>
        <PauseCue />
        <p>যদি voltage আর resistance জানা থাকে, তাহলে current calculate করা যায়.</p>
        <p>যদি current আর resistance জানা থাকে, তাহলে voltage calculate করা যায়.</p>
        <p>যদি voltage আর current জানা থাকে, তাহলে resistance calculate করা যায়.</p>
        <EmphasisLine>
          এই কারণেই learning, testing, repair, আর real circuit work-এ Ohm&apos;s Law এত important.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Use the Lesson Values" cue="Explain with Numbers">
        <p>এখন lesson-এর নিজের values ব্যবহার করি.</p>
        <PauseCue />
        <p>Voltage হলো 12 volts.</p>
        <p>Resistance হলো 6 ohms.</p>
        <p>তাহলে current equals 12 divided by 6.</p>
        <p>Result আসে 2 amps.</p>
        <EmphasisLine>
          এটা খুব clear example, যেখানে Ohm&apos;s Law ব্যবহার করে missing value solve করা হচ্ছে।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Point to the Circuit" cue="Point to Circuit">
        <p>এখন simulation-এর circuit-এর দিকে তাকান.</p>
        <PauseCue label="Battery দেখাও" />
        <p>Battery push দিচ্ছে, আর এই push-টাই হলো voltage.</p>
        <PauseCue label="Resistor দেখাও" />
        <p>Resistor flow-এর বিরুদ্ধে বাধা দিচ্ছে, আর এই বাধাটাই resistance.</p>
        <PauseCue label="Current দেখাও" />
        <p>আর moving charge-টাই current.</p>
        <p>Ohm&apos;s Law আমাদের এই তিনটা value-কে এক calculation-এ connect করতে সাহায্য করে.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Show How Changing One Value Changes the Others" cue="Use Controls">
        <p>এখন simulation-এর values change করলে কী হয় সেটা লক্ষ্য করুন.</p>
        <PauseCue />
        <p>যদি voltage বাড়ে, আর resistance same থাকে, তাহলে current বাড়ে.</p>
        <p>যদি resistance বাড়ে, আর voltage same থাকে, তাহলে current কমে.</p>
        <p>এই behavior-টাই Ohm&apos;s Law আগেই predict করে.</p>
        <EmphasisLine>
          তাই Ohm&apos;s Law শুধু মুখস্থ করার formula না। এটা circuit behavior বোঝার practical tool।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Real-World Example" cue="Connect to Real Life">
        <p>এখন একটি LED circuit কল্পনা করুন.</p>
        <PauseCue label="উদাহরণ দাও" />
        <p>একজন technician battery voltage জানে, আর LED-এর safe current-ও জানে.</p>
        <p>Ohm&apos;s Law ব্যবহার করে সে required resistor value বের করতে পারে, যাতে LED safe থাকে.</p>
        <p>এই কারণেই training lab, control panel, repair work, আর electronics design-এ Ohm&apos;s Law বারবার ব্যবহার হয়.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Common Beginner Reminder" cue="Clarify">
        <p>এখানে beginner-দের একটা common confusion থাকে.</p>
        <PauseCue />
        <p>অনেকে মনে করে Ohm&apos;s Law নাকি values তৈরি করে.</p>
        <p>আসলে তা না.</p>
        <p>Ohm&apos;s Law শুধু দেখায় values-গুলোর মধ্যে relationship কী.</p>
        <EmphasisLine>
          Law আমাদের বুঝতে আর calculate করতে সাহায্য করে। Circuit নিজে তৈরি করে না।
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Short Recap" cue="Recap">
        <p>শেষ করার আগে key points দ্রুত একবার দেখে নেই.</p>
        <PauseCue />
        <p>Ohm&apos;s Law voltage, current, আর resistance-কে connect করে.</p>
        <p>দুইটা value জানা থাকলে তৃতীয় value calculate করা যায়.</p>
        <p>I equals V divided by R.</p>
        <p>V equals I times R.</p>
        <p>R equals V divided by I.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 11: Closing" cue="End">
        <p>So, big idea খুব simple.</p>
        <PauseCue label="শেষে জোর দাও" />
        <EmphasisLine>
          Ohm&apos;s Law হলো basic rule, যা দিয়ে আমরা voltage, current, আর resistance বুঝতে এবং calculate করতে পারি।
        </EmphasisLine>
        <p>একবার এই rule clear হয়ে গেলে, অনেক circuit problem অনেক সহজ মনে হবে.</p>
        <p>Next lessons-এ আমরা এই foundation বারবার ব্যবহার করবো.</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          আসসালামু আলাইকুম, welcome. এই lesson-এ আমরা basic electronics-এর
          সবচেয়ে useful idea-গুলোর একটা শিখবো, আর সেটা হলো Ohm&apos;s Law.
        </p>
        <PauseCue label="Short Pause" />
        <p>
          আপনি যদি beginner হন, তাতেও কোনো সমস্যা নেই. আমরা lesson-টা সহজ,
          practical, আর step by step রাখবো.
        </p>
        <PauseCue />
        <p>
          এক লাইনে বললে, Ohm&apos;s Law voltage, current, আর resistance-এর
          relationship দেখায়.
        </p>
        <PauseCue label="Emphasize" />
        <p>
          Voltage হলো push. Current হলো flow. Resistance হলো opposition.
          Ohm&apos;s Law আমাদের বলে এই তিনটা কীভাবে একসাথে কাজ করে.
        </p>
        <PauseCue label="Show Formula" />
        <p>
          সবচেয়ে common form হলো I equals V divided by R. এর মানে current
          equals voltage divided by resistance. একই relationship আমরা V equals
          I times R আর R equals V divided by I হিসেবেও লিখতে পারি.
        </p>
        <PauseCue label="Explain with Numbers" />
        <p>
          এই lesson-এ voltage হলো 12 volts আর resistance হলো 6 ohms. তাই
          current equals 12 divided by 6, আর result আসে 2 amps.
        </p>
        <PauseCue label="Point to Circuit" />
        <p>
          এখন circuit-এর দিকে তাকান. Battery push দিচ্ছে, সেটাই voltage.
          Resistor বাধা দিচ্ছে, সেটাই resistance. আর moving charge-টাই current.
        </p>
        <PauseCue label="Use Controls" />
        <p>
          আমরা values change করলে দেখি, voltage বাড়লে current বাড়ে, যদি
          resistance same থাকে. আবার resistance বাড়লে current কমে, যদি voltage
          same থাকে.
        </p>
        <PauseCue label="উদাহরণ দাও" />
        <p>
          একটি LED circuit ভাবুন. যদি battery voltage আর safe current জানা
          থাকে, তাহলে Ohm&apos;s Law ব্যবহার করে resistor value calculate করা যায়,
          যাতে LED safe থাকে.
        </p>
        <PauseCue label="Clarify" />
        <p>
          একটা important reminder হলো, Ohm&apos;s Law values তৈরি করে না. এটা
          শুধু দেখায় values-গুলোর মধ্যে relationship কী.
        </p>
        <PauseCue label="শেষে জোর দাও" />
        <p>
          তাই শেষ কথা হলো, Ohm&apos;s Law হলো সেই basic rule, যা দিয়ে আমরা
          voltage, current, আর resistance বুঝতে এবং calculate করতে পারি.
          ধন্যবাদ, আর next lesson-এ আমরা এই foundation-এর ওপর আরও build করবো.
        </p>
      </ScriptBlock>
    </div>
  );
}
