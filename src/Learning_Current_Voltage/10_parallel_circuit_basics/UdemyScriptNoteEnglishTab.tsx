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
          Parallel Circuit Basics
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          This version is written in a teleprompter-friendly style for direct
          video recording.
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>The goal of this lesson is simple and practical.</p>
        <p>Students should understand what a parallel circuit is.</p>
        <p>They should know that a parallel circuit gives current more than one path.</p>
        <p>They should also understand that voltage stays the same across each branch, while current can split.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>Hello and welcome.</p>
        <PauseCue />
        <p>In this lesson, we are going to learn the basics of a parallel circuit.</p>
        <p>This is a very important idea because many real electrical systems use parallel connections.</p>
        <PauseCue label="Short Pause" />
        <EmphasisLine>
          A parallel circuit gives current more than one path to follow.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Core Idea" cue="Teach Slowly">
        <p>Let us make the idea very simple.</p>
        <PauseCue />
        <p>In a parallel circuit, several branches connect across the same source.</p>
        <p>That means each branch receives the same source voltage.</p>
        <p>But the current does not have to be the same in every branch.</p>
        <EmphasisLine>
          In parallel, voltage stays the same across the branches, and current splits between them.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Explain Why It Matters" cue="Connect to Use">
        <p>This idea matters because many homes, buildings, and machines use parallel circuits.</p>
        <PauseCue />
        <p>Parallel design allows several loads to work from one source.</p>
        <p>It also helps one branch continue working even if another branch stops.</p>
        <EmphasisLine>
          That is one reason parallel circuits are so useful in real life.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Point to the Circuit" cue="Point to Circuit">
        <p>Now look at the simulation.</p>
        <PauseCue label="Point to Source" />
        <p>The source applies the same voltage across all the branches.</p>
        <PauseCue label="Point to Branch 1" />
        <p>Current can move through branch one.</p>
        <PauseCue label="Point to Branch 2" />
        <p>At the same time, current can also move through branch two.</p>
        <PauseCue label="Point to Branch 3" />
        <p>And it can move through branch three as well.</p>
        <EmphasisLine>
          This is the big picture: same voltage across each branch, but separate current paths.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Use the Lesson Values" cue="Explain with Numbers">
        <p>In this lesson, the source voltage is 12 volts.</p>
        <PauseCue />
        <p>Branch one resistance is 6 ohms, branch two is 12 ohms, and branch three is 18 ohms.</p>
        <p>So the branch currents become 2 amps, 1 amp, and 0.67 amps.</p>
        <p>Then we add those branch currents together.</p>
        <p>That gives a total current of about 3.67 amps.</p>
        <EmphasisLine>
          In a parallel circuit, total current is the sum of all the branch currents.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Explain the Formula" cue="Formula">
        <p>Here is the simple relationship in this lesson.</p>
        <PauseCue />
        <p>For each branch, current equals voltage divided by that branch resistance.</p>
        <p>So we can write I1 equals V over R1, I2 equals V over R2, and I3 equals V over R3.</p>
        <p>Then total current equals I1 plus I2 plus I3.</p>
        <EmphasisLine>
          Same voltage across all branches. Different resistance can create different branch currents.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Real-World Example" cue="Connect to Real Life">
        <p>Think about the lights in a house.</p>
        <PauseCue label="Give Example" />
        <p>Each light is usually connected in parallel.</p>
        <p>That means each light gets the same source voltage.</p>
        <p>If one light burns out, the others can still keep working.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Common Beginner Reminder" cue="Clarify">
        <p>Here is a common beginner misunderstanding.</p>
        <PauseCue />
        <p>Some students think both voltage and current must stay the same in every branch.</p>
        <p>That is not correct.</p>
        <p>In a parallel circuit, the voltage stays the same across the branches.</p>
        <p>The current depends on each branch resistance.</p>
        <EmphasisLine>
          Lower resistance branch means higher current in that branch.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Short Recap" cue="Recap">
        <p>Before we finish, let us review the key points.</p>
        <PauseCue />
        <p>A parallel circuit has more than one current path.</p>
        <p>Each branch gets the same voltage.</p>
        <p>Branch currents can be different.</p>
        <p>Total current is the sum of all branch currents.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Closing" cue="End">
        <p>So the big idea is very clear.</p>
        <PauseCue label="Final Emphasis" />
        <EmphasisLine>
          A parallel circuit gives current several paths, keeps the same voltage across each branch, and adds branch currents to get the total current.
        </EmphasisLine>
        <p>If you understand that picture, parallel circuits become much easier to read and explain.</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          Hello and welcome. In this lesson, we are going to learn the basics of a parallel circuit. This is a very important idea because many real electrical systems use parallel connections.
        </p>
        <PauseCue label="Short Pause" />
        <p>
          A parallel circuit gives current more than one path to follow.
        </p>
        <PauseCue />
        <p>
          In a parallel circuit, several branches connect across the same source. That means each branch receives the same source voltage. But the current does not have to be the same in every branch.
        </p>
        <PauseCue label="Point to Circuit" />
        <p>
          Now look at the simulation. The source applies the same voltage across all the branches. Current can move through branch one, branch two, and branch three at the same time.
        </p>
        <PauseCue label="Explain with Numbers" />
        <p>
          In this lesson, the source voltage is 12 volts. Branch one resistance is 6 ohms, branch two is 12 ohms, and branch three is 18 ohms. So the branch currents become 2 amps, 1 amp, and 0.67 amps. When we add them together, the total current becomes about 3.67 amps.
        </p>
        <PauseCue label="Formula" />
        <p>
          For each branch, current equals voltage divided by branch resistance. Then total current equals the sum of all the branch currents. So in parallel, the voltage stays the same across each branch, but the current can change from branch to branch.
        </p>
        <PauseCue label="Give Example" />
        <p>
          Think about the lights in a house. Each light is usually connected in parallel. That way each light gets the same voltage, and one light can fail while the others still work.
        </p>
        <PauseCue label="Clarify" />
        <p>
          One important reminder is this: in a parallel circuit, voltage stays the same across the branches, but current depends on the branch resistance. Lower resistance branch means higher current in that branch.
        </p>
        <PauseCue label="Final Emphasis" />
        <p>
          So let us finish with one clear idea. A parallel circuit gives current several paths, keeps the same voltage across each branch, and adds branch currents to get the total current. Thank you, and in the next lesson we will keep building on this foundation.
        </p>
      </ScriptBlock>
    </div>
  );
}
