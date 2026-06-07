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
          Types of Voltage
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          This version is written in a teleprompter-friendly style for direct
          video recording.
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>The goal of this lesson is simple and practical.</p>
        <p>Students should understand that voltage can appear in different forms.</p>
        <p>They should know the main difference between direct voltage and alternating voltage.</p>
        <p>They should also learn how to describe AC voltage with ideas like peak, RMS, and frequency.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>Hello and welcome.</p>
        <PauseCue />
        <p>In this lesson, we are going to learn about the main types of voltage.</p>
        <p>This lesson is very useful, because voltage type changes how a circuit pushes charge.</p>
        <PauseCue label="Short Pause" />
        <EmphasisLine>
          One voltage type stays steady, and another voltage type changes over time.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Core Idea" cue="Teach Slowly">
        <p>Let us keep the idea very simple.</p>
        <PauseCue />
        <p>Direct voltage, or DC voltage, stays steady in one direction.</p>
        <p>Alternating voltage, or AC voltage, changes direction in a repeating pattern.</p>
        <p>That means the push on charge can look very different depending on the voltage type.</p>
        <EmphasisLine>
          Voltage type tells us how the electrical push behaves with time.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Explain Why It Matters" cue="Connect to Use">
        <p>This topic matters because real devices do not all use the same kind of voltage.</p>
        <PauseCue />
        <p>Some systems use steady DC voltage.</p>
        <p>Other systems use changing AC voltage.</p>
        <p>If you identify the voltage type first, you can understand the rest of the circuit much faster.</p>
        <EmphasisLine>
          Before solving a system, first ask what kind of voltage it uses.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Point to the Simulation" cue="Point to Screen">
        <p>Now look at the simulation.</p>
        <PauseCue label="Point to DC View" />
        <p>The DC side shows a steady voltage level.</p>
        <PauseCue label="Point to AC View" />
        <p>The AC side shows a voltage that rises, falls, and changes direction.</p>
        <p>That is the easiest visual difference between the two voltage types.</p>
        <EmphasisLine>
          DC looks steady. AC looks like a repeating wave.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Use the Lesson Values" cue="Explain with Numbers">
        <p>In this lesson, the DC voltage is 10 volts.</p>
        <PauseCue />
        <p>The DC resistance is 5 ohms.</p>
        <p>That gives a DC current of 2 amps.</p>
        <p>On the AC side, the peak voltage is 10 volts, the frequency is 1 hertz, and the resistance is 5 ohms.</p>
        <EmphasisLine>
          Even when the size looks similar, the behavior of DC voltage and AC voltage is not the same.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Explain the Formula View" cue="Formula">
        <p>Now let us connect that to one useful AC idea.</p>
        <PauseCue />
        <p>For AC, peak voltage is not the only value we care about.</p>
        <p>We also use RMS, which means root mean square.</p>
        <p>In simple practice, RMS equals peak divided by square root of 2.</p>
        <p>So when the peak voltage is 10 volts, the RMS voltage is about 7.07 volts.</p>
        <p>With that RMS voltage and the same 5 ohm resistance, the RMS current is about 1.41 amps.</p>
        <EmphasisLine>
          RMS helps us describe the useful working size of an AC voltage.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Real-World Example" cue="Connect to Real Life">
        <p>Think about a battery charger and a wall outlet.</p>
        <PauseCue label="Give Example" />
        <p>A battery side usually works with steady DC voltage.</p>
        <p>A wall outlet usually gives AC voltage.</p>
        <p>That is why many devices need adapters or power supply stages before the final circuit uses the voltage.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Common Beginner Reminder" cue="Clarify">
        <p>Here is a very common beginner mistake.</p>
        <PauseCue />
        <p>Some students think voltage is only about the number value.</p>
        <p>But voltage is also about behavior over time.</p>
        <p>If you ignore the voltage type, you can misunderstand the whole system.</p>
        <EmphasisLine>
          Voltage is not only about size. It is also about behavior.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Short Recap" cue="Recap">
        <p>Before we finish, let us review the key points.</p>
        <PauseCue />
        <p>Voltage can appear in different forms.</p>
        <p>DC voltage is steady and one-directional.</p>
        <p>AC voltage changes direction over time.</p>
        <p>AC is often described with peak, RMS, and frequency.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Closing" cue="End">
        <p>So the big idea is very clear.</p>
        <PauseCue label="Final Emphasis" />
        <EmphasisLine>
          To understand a circuit well, first understand what type of voltage it uses.
        </EmphasisLine>
        <p>That one step makes the rest of the lesson much easier to follow.</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          Hello and welcome. In this lesson, we are going to learn about the
          main types of voltage. This lesson is very useful, because voltage
          type changes how a circuit pushes charge.
        </p>
        <PauseCue label="Short Pause" />
        <p>
          One voltage type stays steady, and another voltage type changes over
          time.
        </p>
        <PauseCue />
        <p>
          Direct voltage, or DC voltage, stays steady in one direction.
          Alternating voltage, or AC voltage, changes direction in a repeating
          pattern. That means the push on charge can look very different
          depending on the voltage type.
        </p>
        <PauseCue label="Point to Screen" />
        <p>
          Now look at the simulation. The DC side shows a steady voltage level.
          The AC side shows a voltage that rises, falls, and changes direction.
          That is the easiest visual difference between the two voltage types.
        </p>
        <PauseCue label="Explain with Numbers" />
        <p>
          In this lesson, the DC voltage is 10 volts. The DC resistance is 5
          ohms. That gives a DC current of 2 amps. On the AC side, the peak
          voltage is 10 volts, the frequency is 1 hertz, and the resistance is
          5 ohms.
        </p>
        <PauseCue label="Formula" />
        <p>
          For AC, peak voltage is not the only value we care about. We also use
          RMS, which means root mean square. In simple practice, RMS equals peak
          divided by square root of 2. So when the peak voltage is 10 volts,
          the RMS voltage is about 7.07 volts. With that RMS voltage and the
          same 5 ohm resistance, the RMS current is about 1.41 amps.
        </p>
        <PauseCue label="Give Example" />
        <p>
          Think about a battery charger and a wall outlet. A battery side
          usually works with steady DC voltage. A wall outlet usually gives AC
          voltage. That is why many devices need adapters or power supply
          stages before the final circuit uses the voltage.
        </p>
        <PauseCue label="Clarify" />
        <p>
          One important reminder is this: voltage is not only about size. It is
          also about behavior. If you ignore the voltage type, you can
          misunderstand the whole system.
        </p>
        <PauseCue label="Final Emphasis" />
        <p>
          So let us finish with one clear idea. To understand a circuit well,
          first understand what type of voltage it uses. That one step makes the
          rest of the lesson much easier to follow.
        </p>
      </ScriptBlock>
    </div>
  );
}
