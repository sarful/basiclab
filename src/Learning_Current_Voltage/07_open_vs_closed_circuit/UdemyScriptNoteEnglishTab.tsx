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

export default function UdemyScriptNoteEnglishTab() {
  return (
    <div className="space-y-4">
      <section className="rounded-[36px] border border-slate-200 bg-white p-10 shadow-[0_18px_44px_rgba(15,23,42,0.10)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-300 bg-blue-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-blue-700">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          Udemy English Script
        </div>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          Open Circuit vs Closed Circuit
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          This version is written in a teleprompter-friendly style for direct
          video recording.
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>The goal of this lesson is simple and practical.</p>
        <p>Students should understand the difference between an open circuit and a closed circuit.</p>
        <p>They should know that current needs a complete path.</p>
        <p>They should also understand why a small break can stop the whole circuit.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>Hello and welcome.</p>
        <PauseCue />
        <p>In this lesson, we are going to learn one of the most important basic ideas in electricity.</p>
        <p>The difference between an open circuit and a closed circuit.</p>
        <PauseCue label="Short Pause" />
        <p>If you understand this idea clearly, many circuit problems become much easier to explain.</p>
        <EmphasisLine>
          A circuit works only when the path is complete.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Basic Idea" cue="Teach Slowly">
        <p>Let us make that idea simple.</p>
        <PauseCue />
        <p>A closed circuit has a full path.</p>
        <p>An open circuit has a broken path.</p>
        <p>When the path is complete, current can flow.</p>
        <p>When the path is broken, current stops.</p>
        <EmphasisLine>
          Closed means current can move. Open means current cannot move.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Explain Why It Matters" cue="Connect to Use">
        <p>This idea matters because every working circuit depends on a complete loop.</p>
        <PauseCue />
        <p>If just one wire breaks, the whole circuit can stop.</p>
        <p>If a switch opens the path, the load turns off.</p>
        <p>If a switch closes the path, the load can turn on again.</p>
        <EmphasisLine>
          That is why path continuity is so important in real electrical work.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Point to the Circuit" cue="Point to Circuit">
        <p>Now look at the simulation.</p>
        <PauseCue label="Point to Battery" />
        <p>The battery is ready to push charge.</p>
        <PauseCue label="Point to Break" />
        <p>But if the path is open, the charge cannot complete the loop.</p>
        <PauseCue label="Point to LED" />
        <p>That is why the LED stays off in an open circuit.</p>
        <p>When the path closes, current can move and the LED turns on.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Use the Lesson Values" cue="Explain with Numbers">
        <p>In this lesson, the voltage is 9 volts and the resistance is 6 ohms.</p>
        <PauseCue />
        <p>When the circuit is closed, current can flow.</p>
        <p>That gives us about 1.50 amps of current.</p>
        <p>When the circuit is open, the current becomes 0 amps.</p>
        <EmphasisLine>
          The reason is simple. A broken path stops the movement completely.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Real-World Example" cue="Connect to Real Life">
        <p>Think about a wall switch and a room light.</p>
        <PauseCue label="Give Example" />
        <p>When you turn the switch on, the path closes and the light turns on.</p>
        <p>When you turn the switch off, the path opens and the light turns off.</p>
        <p>This same idea is used in door switches, fuse holders, push buttons, and control panels.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Common Beginner Reminder" cue="Clarify">
        <p>Here is a very common beginner mistake.</p>
        <PauseCue />
        <p>Some students think that if voltage is present, the device must work.</p>
        <p>That is not always true.</p>
        <p>Voltage may be there, but without a complete path, current still cannot flow.</p>
        <EmphasisLine>
          Voltage alone is not enough. The circuit path must also be complete.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Short Recap" cue="Recap">
        <p>Before we finish, let us review the key points.</p>
        <PauseCue />
        <p>A closed circuit has a complete path.</p>
        <p>An open circuit has a broken path.</p>
        <p>Current flows only in a closed circuit.</p>
        <p>A break anywhere in the path can stop the whole circuit.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Closing" cue="End">
        <p>So the big idea is very clear.</p>
        <PauseCue label="Final Emphasis" />
        <EmphasisLine>
          If the path is complete, current can flow. If the path is broken, current stops.
        </EmphasisLine>
        <p>This is one of the most important foundations in electronics.</p>
        <p>Once you understand it, switches, broken wires, and many circuit problems become easier to understand.</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          Hello and welcome. In this lesson, we are going to learn one of the
          most important basic ideas in electricity: the difference between an
          open circuit and a closed circuit.
        </p>
        <PauseCue label="Short Pause" />
        <p>
          If you understand this idea clearly, many circuit problems become
          much easier to explain.
        </p>
        <PauseCue />
        <p>
          A circuit works only when the path is complete.
        </p>
        <PauseCue label="Emphasize" />
        <p>
          A closed circuit has a full path. An open circuit has a broken path.
          When the path is complete, current can flow. When the path is broken,
          current stops.
        </p>
        <PauseCue label="Point to Circuit" />
        <p>
          Now look at the simulation. The battery is ready to push charge. But
          if the path is open, the charge cannot complete the loop, so the LED
          stays off. When the path closes, current can move and the LED turns on.
        </p>
        <PauseCue label="Explain with Numbers" />
        <p>
          In this lesson, the voltage is 9 volts and the resistance is 6 ohms.
          When the circuit is closed, current flows and becomes about 1.50
          amps. When the circuit is open, the current becomes 0 amps.
        </p>
        <PauseCue label="Give Example" />
        <p>
          Think about a wall switch and a room light. When you turn the switch
          on, the path closes and the light turns on. When you turn the switch
          off, the path opens and the light turns off.
        </p>
        <PauseCue label="Clarify" />
        <p>
          One important reminder is this: voltage alone is not enough. Even if
          voltage is present, current still cannot flow unless the path is complete.
        </p>
        <PauseCue label="Final Emphasis" />
        <p>
          So let us finish with one clear idea. If the path is complete,
          current can flow. If the path is broken, current stops. Thank you,
          and in the next lesson we will keep building on this foundation.
        </p>
      </ScriptBlock>
    </div>
  );
}
