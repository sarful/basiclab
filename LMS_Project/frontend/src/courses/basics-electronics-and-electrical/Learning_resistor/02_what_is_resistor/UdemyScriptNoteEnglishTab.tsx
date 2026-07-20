"use client";

type ScriptBlockProps = {
  title: string;
  lines: string[];
};

function ScriptBlock({ title, lines }: ScriptBlockProps) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
      <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
        {title}
      </div>
      <div className="mt-4 space-y-3 text-[15px] leading-8 text-slate-700 md:text-[16px]">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </section>
  );
}

function PauseCue({ children }: { children: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
      Pause cue: {children}
    </div>
  );
}

export default function UdemyScriptNoteEnglishTab() {
  return (
    <div className="space-y-4">
      <section className="rounded-[32px] border border-slate-300 bg-white/95 p-5 shadow-xl backdrop-blur md:p-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-300 bg-sky-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
          <span className="h-2 w-2 rounded-full bg-sky-500" />
          Udemy Script Note English
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          What is Resistor
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          This script is written in a clean, instructor-friendly style so you
          can teach the core resistor idea clearly, slowly, and with practical
          examples that beginners can follow.
        </p>
      </section>

      <ScriptBlock
        title="Lesson Goal"
        lines={[
          "In this lesson, we will understand what a resistor is and why it is one of the most important components in electronics.",
          "We will see that a resistor opposes current flow, creates voltage drop, protects components like LEDs, and converts part of electrical energy into heat.",
          "We will also connect that idea to resistor value and power rating, so students understand both function and safety.",
        ]}
      />

      <ScriptBlock
        title="Opening"
        lines={[
          "When beginners first see a resistor, it may look like a very simple component.",
          "But in real circuits, the resistor does an extremely important job.",
          "It helps us control electrical current instead of letting current flow without limit.",
        ]}
      />

      <PauseCue>Show the resistor symbol, a real resistor, and the circuit path.</PauseCue>

      <ScriptBlock
        title="Main Idea"
        lines={[
          "A resistor is a component that opposes the flow of electric current.",
          "In simple words, it makes current flow harder.",
          "Because of that, the resistor gives us control inside a circuit.",
        ]}
      />

      <ScriptBlock
        title="Current Limiting"
        lines={[
          "If the supply voltage stays the same, a smaller resistance usually allows more current to flow.",
          "A larger resistance usually reduces current.",
          "So we often use a resistor when we want to limit current to a safer or more useful level.",
        ]}
      />

      <ScriptBlock
        title="Voltage Drop"
        lines={[
          "A resistor does not only affect current. It also creates a voltage drop across itself.",
          "That means part of the source voltage appears across the resistor.",
          "As a result, the voltage after the resistor can become smaller than the input voltage.",
        ]}
      />

      <PauseCue>Point to the simulator reading for input voltage, resistor voltage drop, and output voltage.</PauseCue>

      <ScriptBlock
        title="Protecting an LED"
        lines={[
          "One of the most common examples is an LED circuit.",
          "An LED should not be connected directly to a voltage source without proper current control.",
          "A series resistor helps limit current, so the LED operates more safely.",
        ]}
      />

      <ScriptBlock
        title="Heat and Power"
        lines={[
          "When current flows through a resistor, some electrical energy is converted into heat.",
          "That is why resistors have power ratings such as one quarter watt or half watt.",
          "If the resistor has to handle more power than its rating allows, it can overheat or fail.",
        ]}
      />

      <ScriptBlock
        title="Common Beginner Mistakes"
        lines={[
          "A common mistake is thinking that resistance only changes current and does nothing else.",
          "In reality, a resistor can limit current, create voltage drop, and release heat at the same time.",
          "Another mistake is choosing a resistor only by ohm value and ignoring the power rating.",
        ]}
      />

      <ScriptBlock
        title="Recap"
        lines={[
          "So let us review the core idea.",
          "A resistor opposes current flow.",
          "It helps control current, causes voltage drop, protects sensitive components, and converts energy into heat.",
          "That is why the resistor is one of the most basic and most useful components in electronics.",
        ]}
      />

      <ScriptBlock
        title="Closing"
        lines={[
          "In the next lessons, we will use this resistor idea in more practical situations and learn how resistor value affects circuit behavior.",
          "Once students understand this lesson well, many other electronics concepts become easier to learn.",
        ]}
      />
    </div>
  );
}
