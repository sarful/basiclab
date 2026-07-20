"use client";

import ResistorLessonEmbeddedShell from "../shared/ResistorLessonEmbeddedShell";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";
import ResistorLessonTwoSimulation from "./ResistorLessonTwoSimulation";
import UdemyScriptNoteEnglishTab from "./UdemyScriptNoteEnglishTab";
import UdemyScriptNoteBanglaTab from "./UdemyScriptNoteBanglaTab";
import { useWhatIsResistorSimulation } from "./useWhatIsResistorSimulation";

export default function ResistorLessonTwoEmbeddedPage() {
  const simulation = useWhatIsResistorSimulation();
  const lessonPanel = (
    <section className="grid items-start gap-[18px] lg:grid-cols-[320px_minmax(0,1fr)]">
      <section className="rounded-[32px] border-[3px] border-[#2ea84a] bg-white p-[18px] shadow-[0_14px_36px_rgba(15,23,42,0.05)] lg:sticky lg:top-4 lg:min-h-[680px]">
        <div className="mb-2.5 text-[13px] font-extrabold uppercase tracking-[0.04em] text-[#2ea84a]">
          Control Panel
        </div>

        <ResistorLessonTwoSimulation panelOnly simulation={simulation} />
      </section>

      <section className="rounded-[32px] border-[3px] border-[#2ea84a] bg-white p-[18px] shadow-[0_14px_36px_rgba(15,23,42,0.05)] lg:min-h-[680px]">
        <div className="min-h-[640px] overflow-hidden rounded-[26px] border border-[#dbe3ee] bg-slate-50 p-4">
          <div className="mb-2.5 text-[13px] font-extrabold tracking-[0.04em] text-[#2ea84a]">
            {/* animation */}
          </div>

          <ResistorLessonTwoSimulation visualOnly simulation={simulation} />
        </div>
      </section>
    </section>
  );

  return (
    <ResistorLessonEmbeddedShell
      lessonId={2}
      lessonTitle="What is Resistor"
      lessonContent={{
        logic: <LogicTheoryTab />,
        logic_bn: <LogicTheoryBanglaTab />,
        english: <UdemyScriptNoteEnglishTab />,
        bangla: <UdemyScriptNoteBanglaTab />,
        lesson: lessonPanel,
      }}
    >
      {lessonPanel}
    </ResistorLessonEmbeddedShell>
  );
}
