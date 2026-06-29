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
          Ohm&apos;s Law Basics
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          This version is written in a teleprompter-friendly style for direct
          video recording.
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>The goal of this lesson is clear and practical.</p>
        <p>Students should understand what Ohm&apos;s Law means in simple English.</p>
        <p>They should know that it connects voltage, current, and resistance.</p>
        <p>They should also understand that if two values are known, the third one can be calculated.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>Hello and welcome.</p>
        <PauseCue />
        <p>In this lesson, we are going to learn one of the most useful ideas in basic electronics.</p>
        <p>Ohm&apos;s Law.</p>
        <PauseCue label="Short Pause" />
        <p>If you are new to electronics, that is completely fine.</p>
        <p>We will keep this lesson simple, practical, and easy to follow.</p>
        <EmphasisLine>
          In one short sentence, Ohm&apos;s Law shows the relationship between voltage, current, and resistance.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Basic Idea" cue="Teach Slowly">
        <p>Now let us make that idea easier.</p>
        <PauseCue />
        <p>Voltage is the push.</p>
        <p>Current is the flow.</p>
        <p>Resistance is the opposition to that flow.</p>
        <p>Ohm&apos;s Law tells us how these three work together.</p>
        <EmphasisLine>
          So when one value changes, at least one of the other values changes too.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Introduce the Formula" cue="Show Formula">
        <p>The most common form of Ohm&apos;s Law is this.</p>
        <PauseCue />
        <p>I equals V divided by R.</p>
        <p>That means current equals voltage divided by resistance.</p>
        <p>But this same idea can also be written in two other forms.</p>
        <p>V equals I times R.</p>
        <p>And R equals V divided by I.</p>
        <EmphasisLine>
          These are not different laws. They are the same relationship written in different ways.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Explain Why It Matters" cue="Connect to Use">
        <p>Ohm&apos;s Law is useful because it helps us calculate a missing value.</p>
        <PauseCue />
        <p>If we know voltage and resistance, we can calculate current.</p>
        <p>If we know current and resistance, we can calculate voltage.</p>
        <p>If we know voltage and current, we can calculate resistance.</p>
        <EmphasisLine>
          This is why Ohm&apos;s Law is used so often in learning, testing, and real circuit work.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Use the Lesson Values" cue="Explain with Numbers">
        <p>Now let us use the values from this lesson.</p>
        <PauseCue />
        <p>The voltage is 12 volts.</p>
        <p>The resistance is 6 ohms.</p>
        <p>So current equals 12 divided by 6.</p>
        <p>That gives us 2 amps.</p>
        <EmphasisLine>
          This is a perfect example of using Ohm&apos;s Law to solve for the missing value.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Point to the Circuit" cue="Point to Circuit">
        <p>Now look at the circuit in the simulation.</p>
        <PauseCue label="Point to Battery" />
        <p>The battery gives the push, which is voltage.</p>
        <PauseCue label="Point to Resistor" />
        <p>The resistor gives the opposition, which is resistance.</p>
        <PauseCue label="Point to Current" />
        <p>And the moving charge is current.</p>
        <p>Ohm&apos;s Law helps us connect those three values in one clear calculation.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Show How Changing One Value Changes the Others" cue="Use Controls">
        <p>As you change the values in the simulation, notice what happens.</p>
        <PauseCue />
        <p>If voltage goes up and resistance stays the same, current goes up.</p>
        <p>If resistance goes up and voltage stays the same, current goes down.</p>
        <p>This is exactly what Ohm&apos;s Law predicts.</p>
        <EmphasisLine>
          Ohm&apos;s Law is not just a formula to memorize. It is a way to understand circuit behavior.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Real-World Example" cue="Connect to Real Life">
        <p>Now think about an LED circuit.</p>
        <PauseCue label="Give Example" />
        <p>A technician may know the battery voltage and the safe current for the LED.</p>
        <p>Using Ohm&apos;s Law, the technician can calculate the resistor value needed to keep the LED safe.</p>
        <p>This is why Ohm&apos;s Law is used in training labs, control panels, repair work, and electronics design.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Common Beginner Reminder" cue="Clarify">
        <p>There is one common beginner mistake here.</p>
        <PauseCue />
        <p>Some students think Ohm&apos;s Law creates the values.</p>
        <p>It does not.</p>
        <p>Ohm&apos;s Law describes how the values already relate to one another in the circuit.</p>
        <EmphasisLine>
          The law helps us understand and calculate. It does not generate the circuit by itself.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 10: Short Recap" cue="Recap">
        <p>Before we finish, let us review the key points.</p>
        <PauseCue />
        <p>Ohm&apos;s Law connects voltage, current, and resistance.</p>
        <p>If two values are known, the third one can be calculated.</p>
        <p>I equals V divided by R.</p>
        <p>V equals I times R.</p>
        <p>R equals V divided by I.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 11: Closing" cue="End">
        <p>So the big idea is simple.</p>
        <PauseCue label="Final Emphasis" />
        <EmphasisLine>
          Ohm&apos;s Law is the basic rule that helps us understand and calculate voltage, current, and resistance.
        </EmphasisLine>
        <p>Once you understand this rule, many circuit problems become easier to explain and solve.</p>
        <p>In the next lessons, we will keep using this foundation again and again.</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          Hello and welcome. In this lesson, we are going to learn one of the
          most useful ideas in basic electronics: Ohm&apos;s Law.
        </p>
        <PauseCue label="Short Pause" />
        <p>
          If you are new to electronics, that is completely fine. We will keep
          this lesson simple, practical, and easy to follow.
        </p>
        <PauseCue />
        <p>
          In one short sentence, Ohm&apos;s Law shows the relationship between
          voltage, current, and resistance.
        </p>
        <PauseCue label="Emphasize" />
        <p>
          Voltage is the push. Current is the flow. Resistance is the
          opposition. Ohm&apos;s Law tells us how those three work together.
        </p>
        <PauseCue label="Show Formula" />
        <p>
          The most common form is I equals V divided by R. That means current
          equals voltage divided by resistance. The same relationship can also
          be written as V equals I times R, and R equals V divided by I.
        </p>
        <PauseCue label="Explain with Numbers" />
        <p>
          In this lesson, the voltage is 12 volts and the resistance is 6 ohms.
          So current equals 12 divided by 6, which gives us 2 amps.
        </p>
        <PauseCue label="Point to Circuit" />
        <p>
          Now look at the circuit. The battery gives the push, which is
          voltage. The resistor gives the opposition, which is resistance. And
          the moving charge is current.
        </p>
        <PauseCue label="Use Controls" />
        <p>
          As we change the values in the simulation, we can see that if voltage
          goes up and resistance stays the same, current goes up. If resistance
          goes up and voltage stays the same, current goes down.
        </p>
        <PauseCue label="Give Example" />
        <p>
          Think about an LED circuit. A technician may know the battery voltage
          and the safe current for the LED. Using Ohm&apos;s Law, the technician
          can calculate the resistor value needed to keep the LED safe.
        </p>
        <PauseCue label="Clarify" />
        <p>
          One important reminder is this: Ohm&apos;s Law does not create the
          values. It describes how the values already relate to each other in a
          real circuit.
        </p>
        <PauseCue label="Final Emphasis" />
        <p>
          So let us finish with one clear idea. Ohm&apos;s Law is the basic rule
          that helps us understand and calculate voltage, current, and
          resistance. Thank you, and in the next lesson we will keep building
          on this foundation.
        </p>
      </ScriptBlock>
    </div>
  );
}
