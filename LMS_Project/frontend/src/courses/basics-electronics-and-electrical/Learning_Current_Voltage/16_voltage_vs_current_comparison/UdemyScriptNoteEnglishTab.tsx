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
          Voltage vs Current Comparison
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          This version is written in a teleprompter-friendly style for direct
          video recording.
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>The goal of this lesson is simple and practical.</p>
        <p>Students should clearly separate voltage from current.</p>
        <p>They should understand that voltage is the push, and current is the actual flow.</p>
        <p>They should also learn how resistance affects the relationship between those two ideas.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>Hello and welcome.</p>
        <PauseCue />
        <p>In this lesson, we are going to compare voltage and current directly.</p>
        <p>This lesson is important because beginners often mix these two ideas together.</p>
        <PauseCue label="Short Pause" />
        <EmphasisLine>
          Voltage is the push. Current is the flow.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Core Idea" cue="Teach Slowly">
        <p>Let us keep the idea very simple.</p>
        <PauseCue />
        <p>Voltage is the electrical push that tries to move charge.</p>
        <p>Current is the amount of charge that is actually moving through the circuit.</p>
        <p>These two ideas work together, but they are not the same thing.</p>
        <EmphasisLine>
          One tells us about force. The other tells us about movement.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Explain Why It Matters" cue="Connect to Use">
        <p>This topic matters because testing and troubleshooting become confusing when voltage and current are mixed up.</p>
        <PauseCue />
        <p>A circuit can have voltage available even when current is very small.</p>
        <p>A circuit can also show current only when there is a complete path and the resistance allows it.</p>
        <p>If you separate these ideas early, later electrical calculations become much easier.</p>
        <EmphasisLine>
          Before solving a circuit, ask yourself: am I talking about the push or the flow?
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Point to the Simulation" cue="Point to Screen">
        <p>Now look at the simulation.</p>
        <PauseCue label="Point to Voltage Card" />
        <p>The voltage side shows the electrical push.</p>
        <PauseCue label="Point to Current Card" />
        <p>The current side shows the actual flow created by that push.</p>
        <p>This side-by-side view makes the difference much easier to understand.</p>
        <EmphasisLine>
          Voltage starts the motion. Current shows the result.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Use the Lesson Values" cue="Explain with Numbers">
        <p>In this lesson, the voltage is 12 volts.</p>
        <PauseCue />
        <p>The resistance is 6 ohms.</p>
        <p>That gives a current of 2 amps.</p>
        <p>So this one circuit lets us compare push and flow using real numbers that match the simulation.</p>
        <EmphasisLine>
          When the push is 12 volts and the resistance is 6 ohms, the flow becomes 2 amps.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Explain the Formula View" cue="Formula">
        <p>Now let us connect that to the basic formula.</p>
        <PauseCue />
        <p>Ohm&apos;s Law says current equals voltage divided by resistance.</p>
        <p>In short form, that is I equals V divided by R.</p>
        <p>So in this lesson, I equals 12 divided by 6, which gives 2 amps.</p>
        <p>This is a very good beginner example because the numbers are easy to follow.</p>
        <EmphasisLine>
          The formula shows that current depends on both the push and the resistance.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Real-World Example" cue="Connect to Real Life">
        <p>Think about a water pump and water moving through a pipe.</p>
        <PauseCue label="Give Example" />
        <p>The water pressure is like voltage.</p>
        <p>The amount of water actually moving is like current.</p>
        <p>If the pipe is narrow, the flow changes even if the pressure is still there.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Common Beginner Reminder" cue="Clarify">
        <p>Here is a very common beginner mistake.</p>
        <PauseCue />
        <p>Some students say voltage and current are basically the same because both appear in one circuit.</p>
        <p>But that is not correct.</p>
        <p>Voltage is the cause, and current is the result we measure.</p>
        <EmphasisLine>
          Do not confuse the push with the flow.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Short Recap" cue="Recap">
        <p>Before we finish, let us review the key points.</p>
        <PauseCue />
        <p>Voltage is the electrical push.</p>
        <p>Current is the actual flow of charge.</p>
        <p>These two ideas are related, but they are not the same.</p>
        <p>Resistance affects how much current the voltage can produce.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Closing" cue="End">
        <p>So the big idea is very clear.</p>
        <PauseCue label="Final Emphasis" />
        <EmphasisLine>
          To understand a circuit well, always separate the push from the flow.
        </EmphasisLine>
        <p>That one habit will make the rest of electrical learning much easier.</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          Hello and welcome. In this lesson, we are going to compare voltage and
          current directly. This lesson is important because beginners often mix
          these two ideas together.
        </p>
        <PauseCue label="Short Pause" />
        <p>
          Voltage is the push. Current is the flow.
        </p>
        <PauseCue />
        <p>
          Voltage is the electrical push that tries to move charge. Current is
          the amount of charge that is actually moving through the circuit.
          These two ideas work together, but they are not the same thing.
        </p>
        <PauseCue label="Point to Screen" />
        <p>
          Now look at the simulation. The voltage side shows the electrical
          push. The current side shows the actual flow created by that push.
          This side-by-side view makes the difference much easier to
          understand.
        </p>
        <PauseCue label="Explain with Numbers" />
        <p>
          In this lesson, the voltage is 12 volts. The resistance is 6 ohms.
          That gives a current of 2 amps. So this one circuit lets us compare
          push and flow using real numbers that match the simulation.
        </p>
        <PauseCue label="Formula" />
        <p>
          Ohm&apos;s Law says current equals voltage divided by resistance. In
          short form, that is I equals V divided by R. So in this lesson, I
          equals 12 divided by 6, which gives 2 amps. This is a very good
          beginner example because the numbers are easy to follow.
        </p>
        <PauseCue label="Give Example" />
        <p>
          Think about a water pump and water moving through a pipe. The water
          pressure is like voltage. The amount of water actually moving is like
          current. If the pipe is narrow, the flow changes even if the pressure
          is still there.
        </p>
        <PauseCue label="Clarify" />
        <p>
          One important reminder is this: voltage and current are not the same.
          Voltage is the cause, and current is the result we measure. Do not
          confuse the push with the flow.
        </p>
        <PauseCue label="Final Emphasis" />
        <p>
          So let us finish with one clear idea. To understand a circuit well,
          always separate the push from the flow. That one habit will make the
          rest of electrical learning much easier.
        </p>
      </ScriptBlock>
    </div>
  );
}
