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
          Series Circuit Basics
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          This version is written in a teleprompter-friendly style for direct
          video recording.
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>The goal of this lesson is simple and practical.</p>
        <p>Students should understand what a series circuit is.</p>
        <p>They should know that a series circuit has only one current path.</p>
        <p>They should also understand that the same current passes through all the series components.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>Hello and welcome.</p>
        <PauseCue />
        <p>In this lesson, we are going to learn the basics of a series circuit.</p>
        <p>This is one of the most important foundation topics in electronics.</p>
        <PauseCue label="Short Pause" />
        <EmphasisLine>
          A series circuit gives current only one path to follow.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Core Idea" cue="Teach Slowly">
        <p>Let us make that idea very simple.</p>
        <PauseCue />
        <p>In a series circuit, components are connected one after another.</p>
        <p>That means current leaves the source, passes through one component, then the next, and keeps going through the same path.</p>
        <p>There are not many paths for current here.</p>
        <EmphasisLine>
          One path means the same current flows through every series component.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Explain Why It Matters" cue="Connect to Use">
        <p>This idea matters because many simple circuits are built in series.</p>
        <PauseCue />
        <p>It helps us understand continuity, total resistance, and voltage sharing.</p>
        <p>It also explains why one broken part can stop the whole circuit.</p>
        <EmphasisLine>
          If the one path breaks, the whole series circuit stops working.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Point to the Circuit" cue="Point to Circuit">
        <p>Now look at the simulation.</p>
        <PauseCue label="Point to Battery" />
        <p>The source pushes current into the circuit.</p>
        <PauseCue label="Point to R1" />
        <p>Current passes through resistor one.</p>
        <PauseCue label="Point to R2" />
        <p>Then it passes through resistor two.</p>
        <PauseCue label="Point to LED" />
        <p>Then it continues through the LED and returns to the source.</p>
        <EmphasisLine>
          The path is one complete line, not many different branches.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Use the Lesson Values" cue="Explain with Numbers">
        <p>In this lesson, the source voltage is 12 volts.</p>
        <PauseCue />
        <p>Resistor one is 4 ohms, and resistor two is 8 ohms.</p>
        <p>So the total resistance becomes 12 ohms.</p>
        <p>The LED also uses about 2 volts.</p>
        <p>That leaves 10 volts for the resistors.</p>
        <p>So the current becomes about 10 divided by 12, which is 0.83 amps.</p>
        <EmphasisLine>
          The same 0.83 amps flows through both resistors because the path is series.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Explain the Formula" cue="Formula">
        <p>Here is the simple relationship in this lesson.</p>
        <PauseCue />
        <p>Total resistance in series is the sum of all the resistor values.</p>
        <p>So we write it as R total equals R1 plus R2.</p>
        <p>Then current equals available voltage divided by total resistance.</p>
        <p>That is why we use 12 minus 2, then divide by 12.</p>
        <EmphasisLine>
          In series circuits, resistances add, but current stays the same through the path.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Real-World Example" cue="Connect to Real Life">
        <p>Think about a simple flashlight circuit.</p>
        <PauseCue label="Give Example" />
        <p>The battery, switch, and lamp sit in one line.</p>
        <p>Current has to pass through all of them in the same path.</p>
        <p>If the bulb filament breaks, the path opens and the flashlight stops working.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Common Beginner Reminder" cue="Clarify">
        <p>Here is a common beginner misunderstanding.</p>
        <PauseCue />
        <p>Some students think each resistor gets a different current in series.</p>
        <p>That is not correct.</p>
        <p>In a series path, current stays the same through every component.</p>
        <EmphasisLine>
          What changes across the components is the voltage drop, not the current value.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Short Recap" cue="Recap">
        <p>Before we finish, let us review the key points.</p>
        <PauseCue />
        <p>A series circuit has only one current path.</p>
        <p>The same current flows through every series component.</p>
        <p>Resistances add together in series.</p>
        <p>If one part opens, the whole circuit stops.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Closing" cue="End">
        <p>So the big idea is very clear.</p>
        <PauseCue label="Final Emphasis" />
        <EmphasisLine>
          A series circuit has one path, shared current, and total resistance that adds together.
        </EmphasisLine>
        <p>If you understand that one picture, many simple circuits become much easier to explain.</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          Hello and welcome. In this lesson, we are going to learn the basics of a series circuit. This is one of the most important foundation topics in electronics.
        </p>
        <PauseCue label="Short Pause" />
        <p>
          A series circuit gives current only one path to follow.
        </p>
        <PauseCue />
        <p>
          In a series circuit, components are connected one after another. That means current leaves the source, passes through one component, then the next, and keeps going through the same path.
        </p>
        <PauseCue label="Point to Circuit" />
        <p>
          Now look at the simulation. The source pushes current into the circuit. It passes through resistor one, then resistor two, then the LED, and finally returns to the source.
        </p>
        <PauseCue label="Explain with Numbers" />
        <p>
          In this lesson, the source voltage is 12 volts. Resistor one is 4 ohms, and resistor two is 8 ohms. So the total resistance becomes 12 ohms. The LED uses about 2 volts, which leaves 10 volts for the resistors. That makes the current about 0.83 amps.
        </p>
        <PauseCue label="Formula" />
        <p>
          In series circuits, resistances add together. Then current equals available voltage divided by total resistance. That is why we subtract the LED drop and then divide by the total resistor value.
        </p>
        <PauseCue label="Give Example" />
        <p>
          Think about a flashlight circuit. The battery, switch, and lamp sit in one line. If the bulb filament breaks, the path opens and the whole flashlight stops working.
        </p>
        <PauseCue label="Clarify" />
        <p>
          One important reminder is this: in a series circuit, the current stays the same through every component. What changes is the voltage drop across each part.
        </p>
        <PauseCue label="Final Emphasis" />
        <p>
          So let us finish with one clear idea. A series circuit has one path, shared current, and total resistance that adds together. Thank you, and in the next lesson we will keep building on this foundation.
        </p>
      </ScriptBlock>
    </div>
  );
}
