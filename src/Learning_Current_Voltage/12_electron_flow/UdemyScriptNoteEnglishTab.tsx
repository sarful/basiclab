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
          Electron Flow
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          This version is written in a teleprompter-friendly style for direct
          video recording.
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>The goal of this lesson is simple and practical.</p>
        <p>Students should understand what electron flow means.</p>
        <p>They should know the direction electrons move in a basic DC circuit.</p>
        <p>They should also understand the difference between electron flow and conventional current direction.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>Hello and welcome.</p>
        <PauseCue />
        <p>In this lesson, we are going to learn about electron flow.</p>
        <p>This topic is very useful because many beginners hear about current direction and get confused.</p>
        <PauseCue label="Short Pause" />
        <EmphasisLine>
          Electron flow shows how real negative charges move inside the circuit.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Core Idea" cue="Teach Slowly">
        <p>Let us make the idea very simple.</p>
        <PauseCue />
        <p>Electrons are negatively charged particles.</p>
        <p>When the circuit path is complete, these electrons drift through the conductor.</p>
        <p>In a basic DC circuit, electrons move from the negative terminal toward the positive terminal.</p>
        <EmphasisLine>
          Electron flow means negative charges moving from negative to positive.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Explain Why It Matters" cue="Connect to Use">
        <p>This topic matters because students often hear two different directions.</p>
        <PauseCue />
        <p>One is electron flow, and the other is conventional current.</p>
        <p>If you do not understand the difference, diagrams and explanations can become confusing.</p>
        <EmphasisLine>
          Electron flow and conventional current are related, but they do not point the same way in a basic DC circuit.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Point to the Circuit" cue="Point to Circuit">
        <p>Now look at the simulation.</p>
        <PauseCue label="Point to Negative Terminal" />
        <p>The negative terminal is the side where electrons begin their drift.</p>
        <PauseCue label="Point to Positive Terminal" />
        <p>The electrons move through the wire and components toward the positive terminal.</p>
        <p>This is the actual movement of charge carriers inside the conductor.</p>
        <EmphasisLine>
          The path must still be complete, or electrons cannot keep moving through the circuit.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Explain the Lesson Values" cue="Explain with Numbers">
        <p>In this lesson, the battery voltage is 12 volts.</p>
        <PauseCue />
        <p>The circuit resistance is 6 ohms.</p>
        <p>So the current becomes 2 amps.</p>
        <p>That tells us the electric push is strong enough to create a clear medium flow in the simulation.</p>
        <EmphasisLine>
          The direction idea and the current value work together in the same circuit.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Explain the Formula" cue="Formula">
        <p>Here is the simple calculation in this lesson.</p>
        <PauseCue />
        <p>Current equals voltage divided by resistance.</p>
        <p>So we write I equals V over R.</p>
        <p>With 12 volts and 6 ohms, the current becomes 2 amps.</p>
        <EmphasisLine>
          The formula gives the current value, while electron flow explains the real charge direction.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Explain Conventional Current" cue="Clarify Direction">
        <p>Now let us clear up one very common confusion.</p>
        <PauseCue />
        <p>Most electrical diagrams show conventional current from positive to negative.</p>
        <p>But electron flow in a basic DC circuit goes from negative to positive.</p>
        <p>That means the arrows can point in opposite directions, depending on what the diagram is showing.</p>
        <EmphasisLine>
          Real electron motion and standard diagram current direction are opposite in a basic DC circuit.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Real-World Example" cue="Connect to Real Life">
        <p>Think about a battery, a wire, and a small lamp.</p>
        <PauseCue label="Give Example" />
        <p>If the path is complete, electrons drift through the wire and the lamp can light.</p>
        <p>In textbooks and training diagrams, you may still see current arrows pointing the other way because those diagrams use conventional current.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Common Beginner Reminder" cue="Clarify">
        <p>Here is a very common beginner mistake.</p>
        <PauseCue />
        <p>Some students think electron flow and conventional current must be the same direction.</p>
        <p>That is not correct.</p>
        <p>They describe the same circuit, but from two different direction conventions.</p>
        <EmphasisLine>
          Do not panic when the arrows are opposite. First ask which convention the lesson is using.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Short Recap" cue="Recap">
        <p>Before we finish, let us review the key points.</p>
        <PauseCue />
        <p>Electron flow describes real negative charges moving in the conductor.</p>
        <p>In a basic DC circuit, electrons move from negative to positive.</p>
        <p>Conventional current goes from positive to negative.</p>
        <p>These directions are opposite in a simple DC circuit.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 11: Closing" cue="End">
        <p>So the big idea is very clear.</p>
        <PauseCue label="Final Emphasis" />
        <EmphasisLine>
          Electron flow explains the real movement of electrons, while conventional current gives the standard direction used in diagrams.
        </EmphasisLine>
        <p>If you understand that one comparison, later electronics topics become much easier to follow.</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          Hello and welcome. In this lesson, we are going to learn about electron flow. This topic is very useful because many beginners hear about current direction and get confused.
        </p>
        <PauseCue label="Short Pause" />
        <p>
          Electron flow shows how real negative charges move inside the circuit.
        </p>
        <PauseCue />
        <p>
          Electrons are negatively charged particles. When the circuit path is complete, these electrons drift through the conductor. In a basic DC circuit, electrons move from the negative terminal toward the positive terminal.
        </p>
        <PauseCue label="Point to Circuit" />
        <p>
          Now look at the simulation. The negative terminal is the side where electrons begin their drift. They move through the wire and components toward the positive terminal. This is the actual movement of charge carriers inside the conductor.
        </p>
        <PauseCue label="Explain with Numbers" />
        <p>
          In this lesson, the battery voltage is 12 volts, and the circuit resistance is 6 ohms. So the current becomes 2 amps. That gives us a clear medium flow in the simulation.
        </p>
        <PauseCue label="Formula" />
        <p>
          The simple formula is current equals voltage divided by resistance. So with 12 volts and 6 ohms, the current becomes 2 amps. The formula gives the current value, while electron flow explains the real charge direction.
        </p>
        <PauseCue label="Clarify Direction" />
        <p>
          One important point is this: most electrical diagrams use conventional current, which goes from positive to negative. But electron flow in a basic DC circuit goes from negative to positive. So the two directions are opposite.
        </p>
        <PauseCue label="Give Example" />
        <p>
          Think about a battery, a wire, and a small lamp. If the path is complete, electrons drift through the wire and the lamp can light. In diagrams, the current arrow may still point the other way because it is showing conventional current.
        </p>
        <PauseCue label="Final Emphasis" />
        <p>
          So let us finish with one clear idea. Electron flow explains the real movement of electrons, while conventional current gives the standard direction used in diagrams. Thank you, and in the next lesson we will keep building on this foundation.
        </p>
      </ScriptBlock>
    </div>
  );
}
