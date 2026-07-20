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
          Fixed Resistor
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          This script is written in a clear teaching style so you can explain
          what a fixed resistor is, why stable resistance matters, and how to
          choose the correct value, tolerance, and power rating.
        </p>
      </section>

      <ScriptBlock
        title="Lesson Goal"
        lines={[
          "In this lesson, we will understand that a fixed resistor is a component designed to provide one stable resistance value in a circuit.",
          "We will connect resistance value, tolerance, and power rating to real circuit behavior, and we will compare common fixed resistor types such as carbon composition, metal film, and wire-wound.",
          "By the end, students should understand how to select a fixed resistor based on the actual job the circuit must perform.",
        ]}
      />

      <ScriptBlock
        title="Opening"
        lines={[
          "A fixed resistor may look simple, but it plays a critical role in practical electronics.",
          "It helps control current, create voltage drops, set operating conditions, and protect other parts of a circuit.",
          "That is why understanding fixed resistors is one of the most important foundations in electronics training.",
        ]}
      />

      <PauseCue>Start by showing one resistor and explain that its value is meant to stay stable during normal operation.</PauseCue>

      <ScriptBlock
        title="Main Idea"
        lines={[
          "The main idea is stability.",
          "A fixed resistor is chosen when we want one intended resistance value instead of an adjustable one.",
          "That stable value allows the circuit to behave in a predictable and repeatable way.",
        ]}
      />

      <ScriptBlock
        title="What a Fixed Resistor Does"
        lines={[
          "A fixed resistor opposes current flow in a controlled way.",
          "Depending on the circuit, it may be used for current limiting, voltage division, bias control, or protection.",
          "Even though it is a basic component, many larger circuit behaviors depend on it working correctly.",
        ]}
      />

      <ScriptBlock
        title="Resistance Value"
        lines={[
          "The first thing students notice is the resistance value.",
          "A higher resistance usually reduces current more strongly, while a lower resistance allows more current to pass.",
          "This is why the resistor value must match the exact job, whether that job is LED protection, signal shaping, or voltage control.",
        ]}
      />

      <PauseCue>Use the resistance selector to show how changing ohm value changes current behavior.</PauseCue>

      <ScriptBlock
        title="Tolerance"
        lines={[
          "The printed resistance value is the target value, but real components are never perfectly exact.",
          "Tolerance tells us how much the actual resistor may vary from the labeled value.",
          "In basic circuits, a wider tolerance may be acceptable, but in measurement or sensing circuits, tighter tolerance becomes much more important.",
        ]}
      />

      <ScriptBlock
        title="Power Rating"
        lines={[
          "A resistor does not only control current. It also converts electrical energy into heat.",
          "That is why power rating is critical.",
          "If a resistor is forced to dissipate more power than it was designed for, it can overheat, drift, or fail.",
          "Good resistor selection always checks whether the resistor can survive the expected load safely.",
        ]}
      />

      <ScriptBlock
        title="Common Fixed Resistor Types"
        lines={[
          "Not all fixed resistors are built the same way.",
          "Carbon composition resistors are simple and low-cost, but they usually have lower precision and higher noise.",
          "Metal film resistors are more accurate, more stable, and quieter, so they are excellent for precise circuits.",
          "Wire-wound resistors are especially useful when higher power handling and better heat dissipation are needed.",
        ]}
      />

      <PauseCue>Switch between carbon, metal film, and wire-wound to compare their strengths directly.</PauseCue>

      <ScriptBlock
        title="How to Choose the Right One"
        lines={[
          "If the circuit is simple and cost matters most, a basic low-cost resistor may be enough.",
          "If accuracy and low noise matter more, metal film is often a better choice.",
          "If heat and power handling matter most, wire-wound is often the stronger option.",
          "So the correct resistor is not chosen by value alone. It is chosen by value, tolerance, power rating, and application fit together.",
        ]}
      />

      <ScriptBlock
        title="Common Beginner Mistakes"
        lines={[
          "One common mistake is selecting a resistor only by its ohm value.",
          "Another mistake is ignoring tolerance and power rating, even though both strongly affect circuit reliability.",
          "Students also often assume that all fixed resistors behave the same if the label value is the same, which is not true in practice.",
        ]}
      />

      <ScriptBlock
        title="Recap"
        lines={[
          "So let us review the key idea.",
          "A fixed resistor provides one stable resistance value in a circuit.",
          "Its selection depends on resistance value, tolerance, and power rating.",
          "Carbon composition, metal film, and wire-wound resistors each serve different practical needs.",
          "The best fixed resistor is the one that safely matches the real circuit job.",
        ]}
      />

      <ScriptBlock
        title="Closing"
        lines={[
          "In the next lessons, students will continue connecting resistor behavior to more advanced circuit design decisions.",
          "Once fixed resistor fundamentals are clear, later topics such as color code, power rating, and resistor circuits become much easier to understand.",
        ]}
      />
    </div>
  );
}
