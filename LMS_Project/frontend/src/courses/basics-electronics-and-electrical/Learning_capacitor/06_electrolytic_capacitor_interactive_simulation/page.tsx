"use client";

import CapacitorLessonEmbeddedShell from "../shared/CapacitorLessonEmbeddedShell";
import CapacitorLessonSixSimulation from "./CapacitorLessonSixSimulation";
import LogicTheoryBanglaTab from "./LogicTheoryBanglaTab";
import LogicTheoryTab from "./LogicTheoryTab";

export default function CapacitorLessonSixEmbeddedPage() {
  const lessonPanel = (
    <section
      style={{
        borderRadius: 32,
        border: "3px solid #2ea84a",
        background: "#ffffff",
        minHeight: 680,
        padding: 18,
        boxShadow: "0 14px 36px rgba(15,23,42,0.05)",
      }}
    >
      <div
        style={{
          borderRadius: 26,
          border: "1px solid #dbe3ee",
          background: "#f8fafc",
          padding: 16,
          overflow: "hidden",
          minHeight: 640,
        }}
      >
        <div
          style={{
            marginBottom: 10,
            color: "#2ea84a",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.04em",
          }}
        >
          {/* animation */}
        </div>
        <CapacitorLessonSixSimulation embedded />
      </div>
    </section>
  );

  return (
    <CapacitorLessonEmbeddedShell
      lessonId={6}
      lessonTitle="Electrolytic Capacitor"
      lessonContent={{
        logic: <LogicTheoryTab />,
        logic_bn: <LogicTheoryBanglaTab />,
        lesson: lessonPanel,
      }}
    >
      {lessonPanel}
    </CapacitorLessonEmbeddedShell>
  );
}
