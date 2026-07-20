"use client";

import BlackMaleToFemaleJumperWire from "./BlackMaleToFemaleJumperWire";
import BlackMaleToMaleJumperWire from "./BlackMaleToMaleJumperWire";
import GreenJumperWire from "./GreenFtoFJumperWire";
import MeasurementPracticalLessonScaffold from "../shared/MeasurementPracticalLessonScaffold";

function WireJumperTerminalLesson() {
  return (
    <section
      style={{
        display: "grid",
        gap: 24,
      }}
    >
      <div
        style={{
          borderRadius: 24,
          border: "1px solid #dbe4ee",
          background: "#ffffff",
          padding: "24px 20px",
          boxShadow: "0 12px 30px rgba(15,23,42,0.05)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 700,
            color: "#0f172a",
          }}
        >
          Wire, Jumper, and Terminal Basics
        </h2>
        <p
          style={{
            margin: "12px 0 0",
            maxWidth: 760,
            fontSize: 16,
            lineHeight: 1.7,
            color: "#475569",
          }}
        >
          Compare common jumper wire end types so students can recognize where
          each style fits on a breadboard, header pin, or terminal connection.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        {[
          {
            title: "Male to Male Jumper Wire",
            description: "Useful for linking breadboard rows or male header points.",
            preview: <BlackMaleToMaleJumperWire />,
          },
          {
            title: "Male to Female Jumper Wire",
            description: "Useful when one side must connect to a pin header and the other to a male lead.",
            preview: <BlackMaleToFemaleJumperWire />,
          },
          {
            title: "Female to Female Jumper Wire",
            description: "Useful for joining two male header pins or module pins together.",
            preview: <GreenJumperWire />,
          },
        ].map((item) => (
          <article
            key={item.title}
            style={{
              borderRadius: 24,
              border: "1px solid #dbe4ee",
              background: "#ffffff",
              padding: 20,
              boxShadow: "0 12px 30px rgba(15,23,42,0.05)",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                margin: "10px 0 18px",
                fontSize: 15,
                lineHeight: 1.6,
                color: "#64748b",
              }}
            >
              {item.description}
            </p>
            <div
              style={{
                borderRadius: 18,
                background: "#f8fafc",
                padding: 12,
              }}
            >
              {item.preview}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function MeasurementPracticalLessonNinePage() {
  return (
    <MeasurementPracticalLessonScaffold
      lessonId={7}
      lessonLabel="Lesson 07"
      lessonTitle="Wire, Jumper, and Terminal Basics"
      lessonContent={{
        lesson: <WireJumperTerminalLesson />,
      }}
    />
  );
}
