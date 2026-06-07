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
          Short Circuit Basics
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          This version is written in a teleprompter-friendly style for direct
          video recording.
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>The goal of this lesson is simple and very important.</p>
        <p>Students should understand what a short circuit is.</p>
        <p>They should know why it is dangerous.</p>
        <p>They should also understand that a short circuit creates a very low-resistance path and makes current rise sharply.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>Hello and welcome.</p>
        <PauseCue />
        <p>In this lesson, we are going to learn the basics of a short circuit.</p>
        <p>This is a very important safety topic in electricity and electronics.</p>
        <PauseCue label="Short Pause" />
        <EmphasisLine>
          A short circuit gives current an unsafe easy path.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Core Idea" cue="Teach Slowly">
        <p>Let us make the idea very simple.</p>
        <PauseCue />
        <p>In a normal circuit, current should go through the load.</p>
        <p>The load may be a resistor, a lamp, or another device.</p>
        <p>In a short circuit, current finds a much easier path with very low resistance.</p>
        <p>That means the current can become very high very quickly.</p>
        <EmphasisLine>
          Short circuit means low resistance and dangerously high current.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Explain Why It Matters" cue="Connect to Safety">
        <p>This idea matters because short circuits can damage wires and components.</p>
        <PauseCue />
        <p>They can also trip protection devices like fuses and breakers.</p>
        <p>In serious cases, they can overheat wires and create fire risk.</p>
        <EmphasisLine>
          That is why short-circuit protection is such an important part of electrical systems.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Point to the Simulation" cue="Point to Circuit">
        <p>Now look at the simulation.</p>
        <PauseCue label="Point to Normal Path" />
        <p>In the normal circuit, current moves through the load in a controlled way.</p>
        <PauseCue label="Point to Short Path" />
        <p>In the short-circuit case, current finds a much easier return path.</p>
        <p>Because the path resistance becomes very small, the current rises sharply.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Use the Lesson Values" cue="Explain with Numbers">
        <p>In this lesson, the voltage is 9 volts.</p>
        <PauseCue />
        <p>In the normal case, the load resistance is 6 ohms.</p>
        <p>That gives about 1.50 amps of current.</p>
        <PauseCue label="Point to Short Path" />
        <p>In the short-circuit case, the resistance drops to 0.25 ohm.</p>
        <p>That makes the current rise to 36.00 amps.</p>
        <EmphasisLine>
          The reason is simple: less resistance allows much more current.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Simple Formula" cue="Formula">
        <p>Here is the simple relationship behind this lesson.</p>
        <PauseCue />
        <p>Current equals voltage divided by resistance.</p>
        <p>So we can write it as I equals V divided by R.</p>
        <p>For the short circuit, that becomes 9 divided by 0.25, which gives 36 amps.</p>
        <EmphasisLine>
          When resistance becomes very small, current becomes very large.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Real-World Example" cue="Connect to Real Life">
        <p>Think about a damaged wire in a machine or control panel.</p>
        <PauseCue label="Give Example" />
        <p>If the insulation breaks and the conductor touches the wrong point, current may find a shortcut.</p>
        <p>That shortcut can create a short circuit.</p>
        <p>This is why electrical systems use fuses, breakers, and proper insulation.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Common Beginner Reminder" cue="Clarify">
        <p>Here is a common beginner misunderstanding.</p>
        <PauseCue />
        <p>Some students think a shorter path is always better.</p>
        <p>That is not true in a short circuit.</p>
        <p>An easier path can actually be dangerous if it lets too much current flow.</p>
        <EmphasisLine>
          Easy path does not always mean safe path.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Short Recap" cue="Recap">
        <p>Before we finish, let us review the key points.</p>
        <PauseCue />
        <p>A short circuit creates an unsafe low-resistance path.</p>
        <p>Low resistance makes current rise sharply.</p>
        <p>Very high current can damage parts and create danger.</p>
        <p>That is why protection devices are so important.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Closing" cue="End">
        <p>So the big idea is very clear.</p>
        <PauseCue label="Final Emphasis" />
        <EmphasisLine>
          A short circuit is dangerous because it gives current an unsafe easy path and allows too much current to flow.
        </EmphasisLine>
        <p>If you understand that one idea, you already understand the foundation of this topic.</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          Hello and welcome. In this lesson, we are going to learn the basics of a short circuit. This is a very important safety topic in electricity and electronics.
        </p>
        <PauseCue label="Short Pause" />
        <p>
          A short circuit gives current an unsafe easy path.
        </p>
        <PauseCue />
        <p>
          In a normal circuit, current should go through the load in a controlled way. But in a short circuit, current finds a much easier path with very low resistance. That makes the current rise very quickly.
        </p>
        <PauseCue label="Point to Circuit" />
        <p>
          Now look at the simulation. In the normal circuit, the load resistance is 6 ohms, so the current is about 1.50 amps. In the short-circuit case, the resistance drops to 0.25 ohm, so the current rises to 36.00 amps.
        </p>
        <PauseCue label="Formula" />
        <p>
          The main formula here is simple. Current equals voltage divided by resistance. So for the short circuit, 9 divided by 0.25 gives 36 amps.
        </p>
        <PauseCue label="Give Example" />
        <p>
          Think about a damaged wire in a machine or control panel. If the insulation breaks and the conductor touches the wrong point, current may find a dangerous shortcut. That is why electrical systems use fuses, breakers, and proper insulation.
        </p>
        <PauseCue label="Clarify" />
        <p>
          One important reminder is this: an easier path is not always a safer path. In a short circuit, the easy path is actually the dangerous one because it allows too much current to flow.
        </p>
        <PauseCue label="Final Emphasis" />
        <p>
          So let us finish with one clear idea. A short circuit is dangerous because it creates a very low-resistance path and lets current rise too much. Thank you, and in the next lesson we will keep building on this foundation.
        </p>
      </ScriptBlock>
    </div>
  );
}
