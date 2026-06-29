"use client";

import Link from "next/link";

import { getLessonTrackConfig } from "../../src/courses/basics-electronics-and-electrical/shared/lessonRegistry";

export default function OptocouplerLearningPage() {
  const track = getLessonTrackConfig("optocoupler");
  const firstLesson = track.lessons[0];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fffefb 0%, #f8fafc 100%)",
        padding: "24px 16px 40px",
        color: "#0f172a",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <section
          style={{
            borderRadius: 32,
            border: "1px solid #dbe3ee",
            background: "linear-gradient(135deg, #ffffff 0%, #ede9fe 100%)",
            padding: "28px 24px",
            boxShadow: "0 18px 40px rgba(15,23,42,0.06)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#7c3aed",
            }}
          >
            Basics Electronics and Electrical
          </p>
          <h1
            style={{
              margin: "10px 0 0",
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              lineHeight: 1.05,
            }}
          >
            {track.label}
          </h1>
          <p
            style={{
              margin: "14px 0 0",
              maxWidth: 760,
              fontSize: 16,
              lineHeight: 1.7,
              color: "#475569",
            }}
          >
            {track.summary} Open any lesson below to continue through the active
            isolation and optocoupler roadmap.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 22,
            }}
          >
            {firstLesson ? (
              <Link
                href={firstLesson.href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 14,
                  background: "#7c3aed",
                  padding: "12px 18px",
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 10px 24px rgba(124,58,237,0.24)",
                }}
              >
                Start from Lesson {firstLesson.id}
              </Link>
            ) : null}

            <a
              href="#optocoupler-lesson-list"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 14,
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                padding: "12px 18px",
                color: "#0f172a",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              View Available Lessons
            </a>
          </div>
        </section>

        <section
          id="optocoupler-lesson-list"
          style={{
            borderRadius: 28,
            border: "1px solid #e2e8f0",
            background: "#ffffff",
            padding: 22,
            boxShadow: "0 12px 30px rgba(15,23,42,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#64748b",
                }}
              >
                Available Lessons
              </p>
              <h2
                style={{
                  margin: "8px 0 0",
                  fontSize: 28,
                  lineHeight: 1.15,
                }}
              >
                Continue with the optocoupler roadmap
              </h2>
            </div>

            <div
              style={{
                borderRadius: 999,
                background: "#ede9fe",
                padding: "8px 14px",
                color: "#6d28d9",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {track.lessons.length} lessons active
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
            }}
          >
            {track.lessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={lesson.href}
                style={{
                  borderRadius: 20,
                  border: "1px solid #dbe3ee",
                  background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                  padding: "18px 16px",
                  textDecoration: "none",
                  color: "#0f172a",
                  boxShadow: "0 8px 20px rgba(15,23,42,0.04)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 11.5,
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#7c3aed",
                  }}
                >
                  Lesson {lesson.id}
                </p>
                <h3
                  style={{
                    margin: "10px 0 0",
                    fontSize: 18,
                    lineHeight: 1.35,
                  }}
                >
                  {lesson.title}
                </h3>
                <p
                  style={{
                    margin: "14px 0 0",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#334155",
                  }}
                >
                  Open lesson
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
