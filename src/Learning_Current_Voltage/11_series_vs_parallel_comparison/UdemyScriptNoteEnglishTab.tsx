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
          Series vs Parallel Comparison
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          This version is written in a teleprompter-friendly style for direct
          video recording.
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>The goal of this lesson is clear and practical.</p>
        <p>Students should understand the difference between series circuits and parallel circuits.</p>
        <p>They should know what stays the same in each circuit type.</p>
        <p>They should also know how current, voltage, and resistance behave differently in both cases.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>Hello and welcome.</p>
        <PauseCue />
        <p>In this lesson, we are going to compare series circuits and parallel circuits.</p>
        <p>This is one of the most useful comparison lessons in basic electrical learning.</p>
        <PauseCue label="Short Pause" />
        <EmphasisLine>
          Series means one path. Parallel means more than one path.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Core Difference" cue="Teach Slowly">
        <p>Let us start with the simplest idea.</p>
        <PauseCue />
        <p>In a series circuit, current has only one path to follow.</p>
        <p>In a parallel circuit, current has more than one path.</p>
        <p>That one difference changes the whole behavior of the circuit.</p>
        <EmphasisLine>
          Path structure is the key difference between series and parallel circuits.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Explain Why It Matters" cue="Connect to Use">
        <p>This comparison matters because students often mix up the rules.</p>
        <PauseCue />
        <p>If you use the series rule inside a parallel circuit, your answer will be wrong.</p>
        <p>If you use the parallel rule inside a series circuit, your answer will also be wrong.</p>
        <EmphasisLine>
          Before any calculation, first identify the circuit type.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Point to the Series Side" cue="Point to Series">
        <p>Now look at the series side of the simulation.</p>
        <PauseCue label="Point to Series Path" />
        <p>Here, current must move through one full path.</p>
        <p>The same current passes through resistor one and resistor two.</p>
        <p>The resistances add together to make the total resistance.</p>
        <EmphasisLine>
          In series, current stays the same, but the voltage is shared across the parts.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Point to the Parallel Side" cue="Point to Parallel">
        <p>Now look at the parallel side.</p>
        <PauseCue label="Point to Branches" />
        <p>Here, current can split into separate branches.</p>
        <p>Each branch receives the same source voltage.</p>
        <p>But the branch currents can be different, depending on the branch resistance.</p>
        <EmphasisLine>
          In parallel, voltage stays the same across each branch, but current can change from branch to branch.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Use the Lesson Values" cue="Explain with Numbers">
        <p>In this lesson, the source voltage is 12 volts.</p>
        <PauseCue />
        <p>Resistor one is 4 ohms, and resistor two is 8 ohms.</p>
        <p>In the series case, total resistance becomes 12 ohms, so current becomes 1 amp.</p>
        <p>In the parallel case, one branch current becomes 3 amps, and the other branch current becomes 1.5 amps.</p>
        <p>Then the parallel total current becomes 4.5 amps.</p>
        <EmphasisLine>
          The same resistor values can produce very different total behavior in series and parallel circuits.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Explain the Formula View" cue="Formula">
        <p>Here is the formula logic in simple words.</p>
        <PauseCue />
        <p>In a series circuit, resistances add directly.</p>
        <p>Then current equals voltage divided by total resistance.</p>
        <p>In a parallel circuit, each branch current is found separately.</p>
        <p>Then all branch currents are added to get the total current.</p>
        <EmphasisLine>
          Series adds resistance. Parallel adds branch current.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Real-World Example" cue="Connect to Real Life">
        <p>Think about a flashlight and the lights in a house.</p>
        <PauseCue label="Give Example" />
        <p>A simple flashlight behaves more like a series circuit because current follows one main path.</p>
        <p>House lights behave more like a parallel circuit because each light should get the same source voltage and keep working independently.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Common Beginner Reminder" cue="Clarify">
        <p>Here is a very common beginner mistake.</p>
        <PauseCue />
        <p>Some students think current and voltage behave the same way in every circuit.</p>
        <p>That is not correct.</p>
        <p>In series, current is shared the same way.</p>
        <p>In parallel, voltage is shared the same way.</p>
        <EmphasisLine>
          Do not memorize numbers only. Always ask what stays the same in this circuit type.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Short Recap" cue="Recap">
        <p>Before we finish, let us review the key points.</p>
        <PauseCue />
        <p>Series circuit means one path.</p>
        <p>Parallel circuit means more than one path.</p>
        <p>In series, the same current flows through each component.</p>
        <p>In parallel, the same voltage appears across each branch.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 11: Closing" cue="End">
        <p>So the big idea is very clear.</p>
        <PauseCue label="Final Emphasis" />
        <EmphasisLine>
          Series and parallel circuits are different because their path structure is different, and that changes how current, voltage, and resistance behave.
        </EmphasisLine>
        <p>If you understand this comparison clearly, many later lessons become much easier.</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          Hello and welcome. In this lesson, we are going to compare series circuits and parallel circuits. This is one of the most useful comparison lessons in basic electrical learning.
        </p>
        <PauseCue label="Short Pause" />
        <p>
          Series means one path. Parallel means more than one path.
        </p>
        <PauseCue />
        <p>
          In a series circuit, current has only one path to follow. In a parallel circuit, current has more than one path. That one difference changes the whole behavior of the circuit.
        </p>
        <PauseCue label="Point to Series" />
        <p>
          Now look at the series side of the simulation. Current must move through one full path. The same current passes through resistor one and resistor two. The resistances add together to make the total resistance.
        </p>
        <PauseCue label="Point to Parallel" />
        <p>
          Now look at the parallel side. Current can split into separate branches. Each branch receives the same source voltage. But the branch currents can be different, depending on the branch resistance.
        </p>
        <PauseCue label="Explain with Numbers" />
        <p>
          In this lesson, the source voltage is 12 volts. Resistor one is 4 ohms, and resistor two is 8 ohms. In the series case, total resistance becomes 12 ohms, so current becomes 1 amp. In the parallel case, one branch current becomes 3 amps, the other branch current becomes 1.5 amps, and the total current becomes 4.5 amps.
        </p>
        <PauseCue label="Formula" />
        <p>
          In a series circuit, resistances add directly, and current equals voltage divided by total resistance. In a parallel circuit, each branch current is found separately, and then all branch currents are added to get the total current.
        </p>
        <PauseCue label="Give Example" />
        <p>
          Think about a flashlight and the lights in a house. A simple flashlight behaves more like a series circuit, while house lights behave more like a parallel circuit.
        </p>
        <PauseCue label="Clarify" />
        <p>
          One important reminder is this: in series, current is the same through each part. In parallel, voltage is the same across each branch. Always ask what stays the same in this circuit type.
        </p>
        <PauseCue label="Final Emphasis" />
        <p>
          So let us finish with one clear idea. Series and parallel circuits are different because their path structure is different, and that changes how current, voltage, and resistance behave. Thank you, and in the next lesson we will keep building on this foundation.
        </p>
      </ScriptBlock>
    </div>
  );
}
