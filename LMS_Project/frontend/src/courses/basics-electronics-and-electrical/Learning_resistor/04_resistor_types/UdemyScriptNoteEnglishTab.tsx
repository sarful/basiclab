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
          Resistor Types
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          This script is written in a clear teaching style so you can explain
          the main resistor families, how they differ, and how to choose the
          right one for a real circuit.
        </p>
      </section>

      <ScriptBlock
        title="Lesson Goal"
        lines={[
          "In this lesson, we will understand that not all resistors are made for the same purpose.",
          "We will organize resistor types into fixed, variable, and sensor categories, and we will compare common examples such as carbon composition, metal film, wire-wound, potentiometer, thermistor, and LDR.",
          "By the end, students should understand how resistor type selection depends on the job the circuit needs to do.",
        ]}
      />

      <ScriptBlock
        title="Opening"
        lines={[
          "When beginners first hear the word resistor, they often imagine only one simple component.",
          "But in practical electronics, there are several resistor families, and each one is designed for a different role.",
          "That is why learning resistor types is important before building more advanced circuits.",
        ]}
      />

      <PauseCue>Show the lesson category filter first: fixed, variable, and sensor.</PauseCue>

      <ScriptBlock
        title="Main Idea"
        lines={[
          "The most useful starting point is classification.",
          "At a basic level, we can group resistors into fixed resistors, variable resistors, and sensor resistors.",
          "Once students understand those three groups, the individual resistor types become much easier to remember.",
        ]}
      />

      <ScriptBlock
        title="Fixed Resistors"
        lines={[
          "Fixed resistors are used when we need one stable resistance value in a circuit.",
          "Carbon composition resistors are low-cost but less precise and usually noisier.",
          "Metal film resistors are more accurate and more stable, so they are often better for measurement or signal-related applications.",
          "Wire-wound resistors are useful when higher power handling is needed.",
        ]}
      />

      <ScriptBlock
        title="Variable Resistors"
        lines={[
          "A variable resistor allows resistance to be adjusted instead of staying fixed.",
          "The most familiar example is a potentiometer.",
          "We use potentiometers when we want manual control, such as changing volume, adjusting brightness, or setting a calibration level.",
        ]}
      />

      <ScriptBlock
        title="Sensor Resistors"
        lines={[
          "Some resistors are designed to respond to the environment.",
          "A thermistor changes resistance with temperature, so it is useful for sensing and protection.",
          "An LDR changes resistance with light, so it is useful in automatic lighting and basic light detection circuits.",
          "These parts are not just for fixed current limiting. They help convert environmental change into an electrical signal.",
        ]}
      />

      <PauseCue>Point to the thermistor and LDR examples and show how the environment changes their resistance.</PauseCue>

      <ScriptBlock
        title="How to Compare Types"
        lines={[
          "Choosing a resistor type is not only about the value written on the component.",
          "We also compare accuracy, power handling, cost, response speed, stability, and best application.",
          "That is why the simulator lets students compare types based on practical design priorities instead of memorizing names only.",
        ]}
      />

      <ScriptBlock
        title="Choosing the Right Type"
        lines={[
          "If you need low-cost general use, a simple fixed resistor may be enough.",
          "If you need precision, a metal film resistor is often a stronger choice.",
          "If you need to handle more heat and power, wire-wound may be better.",
          "If you need manual adjustment, use a potentiometer.",
          "If you need sensing, think first about thermistors or LDRs.",
        ]}
      />

      <ScriptBlock
        title="Why One Type Is Not Best for Everything"
        lines={[
          "Every resistor type has strengths and limitations.",
          "A resistor that is very precise may not be ideal for heavy power dissipation.",
          "A resistor that handles power well may be physically larger or less suitable for sensitive signal work.",
          "Good circuit design means choosing the resistor type that best fits the real application.",
        ]}
      />

      <ScriptBlock
        title="Common Beginner Mistakes"
        lines={[
          "One common mistake is assuming every resistor works like a basic fixed resistor.",
          "Another mistake is choosing parts only by cost without considering accuracy, sensing behavior, or power needs.",
          "Students also often forget that sensor resistors are part of a different design mindset because they respond to the environment.",
        ]}
      />

      <ScriptBlock
        title="Recap"
        lines={[
          "So let us review the main idea.",
          "Resistors can be fixed, variable, or sensor-based.",
          "Carbon, metal film, and wire-wound are common fixed types.",
          "Potentiometers are adjustable, while thermistors and LDRs respond to temperature and light.",
          "The best resistor type depends on the job, not only on the resistance value.",
        ]}
      />

      <ScriptBlock
        title="Closing"
        lines={[
          "In the next lessons, we will go deeper into individual resistor families and practical resistor behavior.",
          "Once students clearly understand resistor types, later component selection decisions become much easier and more logical.",
        ]}
      />
    </div>
  );
}
