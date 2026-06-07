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
          Udemy Script Note English
        </div>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          What is Electricity
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
          This version is written in a teleprompter-friendly style for direct
          video recording.
        </p>
      </section>

      <ScriptBlock title="Lesson Goal" cue="Before Recording">
        <p>
          The goal of this lesson is simple.
        </p>
        <p>
          Students should understand that electricity is the flow of electric
          charge through a complete path.
        </p>
        <p>
          They should also understand three basic ideas.
        </p>
        <p>
          Voltage gives the push.
        </p>
        <p>
          Resistance slows the movement.
        </p>
        <p>
          Current shows the actual flow.
        </p>
      </ScriptBlock>

      <ScriptBlock title="Scene 1: Opening" cue="Intro">
        <p>Hello and welcome.</p>
        <PauseCue />
        <p>In this lesson, we are going to answer a very basic question.</p>
        <p>What is electricity?</p>
        <PauseCue label="Short Pause" />
        <p>If you are a complete beginner, you are in the right place.</p>
        <p>We will keep it simple, and we will go step by step.</p>
        <EmphasisLine>
          In one short sentence, electricity is the flow of electric charge
          through a complete path.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 2: Explain the Basic Idea" cue="Teach Slowly">
        <p>Now let us make that idea even simpler.</p>
        <PauseCue />
        <p>Electric charge needs a path to move.</p>
        <p>If the path is broken, the charge cannot move.</p>
        <p>If the path is complete, the charge can flow through the circuit.</p>
        <p>So here is the first big idea to remember.</p>
        <PauseCue label="Emphasize" />
        <EmphasisLine>Electricity needs a complete path.</EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 3: Show the Battery" cue="Point to Battery">
        <p>Now look at the battery in the simulation.</p>
        <PauseCue label="Point to Battery" />
        <p>The battery is the source.</p>
        <p>The source gives voltage.</p>
        <p>Voltage means electrical push.</p>
        <EmphasisLine>This push tries to move charge through the circuit.</EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 4: Show the Resistor" cue="Point to Resistor">
        <p>Next, let us move to the resistor.</p>
        <PauseCue label="Point to Resistor" />
        <p>Resistance makes it harder for charge to move.</p>
        <p>So now we have two things working together.</p>
        <EmphasisLine>Voltage pushes. Resistance slows.</EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 5: Show the Current Value" cue="Point to Current">
        <p>The result of that movement is called current.</p>
        <PauseCue label="Point to Current" />
        <p>Current tells us how much charge is actually flowing.</p>
        <p>In this lesson, the battery gives 12 volts.</p>
        <p>The resistor is 6 ohms.</p>
        <p>Because of that combination, the current becomes 2 amps.</p>
        <EmphasisLine>
          Electricity is not random. It follows a clear path and a clear
          relationship.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 6: Water Analogy" cue="Use Analogy">
        <p>Here is a simple way to imagine it.</p>
        <PauseCue />
        <p>Think about water moving through a pipe.</p>
        <p>Voltage is like water pressure.</p>
        <p>Current is like the amount of water flowing.</p>
        <p>Resistance is like a narrow pipe that makes water harder to push through.</p>
        <EmphasisLine>
          This analogy helps beginners picture what is happening in the circuit.
        </EmphasisLine>
      </ScriptBlock>

      <ScriptBlock title="Scene 7: Real-World Example" cue="Connect to Real Life">
        <p>Think about a torch light.</p>
        <PauseCue label="Give Example" />
        <p>If the switch is open, the path is broken, so the lamp does not turn on.</p>
        <p>If the switch is closed, the path becomes complete, so charge can move and the lamp turns on.</p>
        <p>The same basic idea is used in home lighting, control panels, and many electronic devices.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 8: Short Recap" cue="Recap">
        <p>Before we finish, let us quickly review.</p>
        <PauseCue />
        <p>Electricity is the flow of electric charge.</p>
        <p>A complete path is required.</p>
        <p>Voltage gives the push.</p>
        <p>Resistance slows the movement.</p>
        <p>Current shows the actual flow.</p>
      </ScriptBlock>

      <ScriptBlock title="Scene 9: Closing" cue="End">
        <p>So the main idea is very simple.</p>
        <PauseCue label="Final Emphasis" />
        <EmphasisLine>
          Electricity is the movement of charge through a complete path.
        </EmphasisLine>
        <p>Once you understand this idea, the rest of basic electronics becomes easier.</p>
        <p>In the next lesson, we will build on this foundation.</p>
      </ScriptBlock>

      <ScriptBlock title="Full Teleprompter Version" cue="Read Directly">
        <p>
          Hello and welcome. In this lesson, we will answer a very basic but
          very important question: what is electricity?
        </p>
        <PauseCue label="Short Pause" />
        <p>
          If you are a complete beginner, that is perfectly okay. We will use
          simple language and go step by step.
        </p>
        <PauseCue />
        <p>
          In one short sentence, electricity is the flow of electric charge
          through a complete path.
        </p>
        <PauseCue label="Emphasize" />
        <p>
          Electric charge needs a path to move. If the path is broken, the
          charge cannot move. If the path is complete, the charge can flow
          through the circuit.
        </p>
        <PauseCue label="Point to Battery" />
        <p>
          Now look at the battery in the simulation. The battery is the
          source. The source gives voltage. Voltage means electrical push.
          This push tries to move charge through the circuit.
        </p>
        <PauseCue label="Point to Resistor" />
        <p>
          Next, look at the resistor. Resistance makes it harder for charge to
          move. So we now have two things happening together. Voltage pushes,
          and resistance slows.
        </p>
        <PauseCue label="Point to Current" />
        <p>
          The result is called current. Current tells us how much charge is
          actually flowing. In this lesson, the battery gives 12 volts, the
          resistor is 6 ohms, and the current becomes 2 amps.
        </p>
        <PauseCue label="Short Pause" />
        <p>
          A simple way to imagine this is water moving through a pipe. Voltage
          is like water pressure. Current is like the amount of water flowing.
          Resistance is like a narrow pipe that makes water harder to push
          through.
        </p>
        <PauseCue label="Give Example" />
        <p>
          Think about a torch light. If the switch is open, the path is
          broken, so the lamp does not turn on. If the switch is closed, the
          path becomes complete, so charge can move and the lamp turns on.
        </p>
        <PauseCue label="Final Emphasis" />
        <p>
          So let us finish with one simple idea. Electricity is the flow of
          electric charge through a complete path. Thank you, and in the next
          lesson we will continue building this foundation.
        </p>
      </ScriptBlock>
    </div>
  );
}
