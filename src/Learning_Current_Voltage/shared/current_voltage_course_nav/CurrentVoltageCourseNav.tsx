"use client";

import { useMemo, useState } from "react";

import { currentVoltageLessons } from "./lessonData";

function NavLink({
  href,
  label,
  disabled = false,
}: {
  href?: string;
  label: string;
  disabled?: boolean;
}) {
  if (disabled || !href) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 120,
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          background: "transparent",
          padding: "10px 14px",
          color: "#94a3b8",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {label}
      </span>
    );
  }

  return (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 120,
        borderRadius: 12,
        border: "1px solid #d6dee8",
        background: "#ffffff",
        padding: "10px 14px",
        color: "#0f172a",
        fontSize: 13,
        fontWeight: 600,
        textDecoration: "none",
        boxShadow: "0 4px 10px rgba(15,23,42,0.04)",
      }}
    >
      {label}
    </a>
  );
}

export default function CurrentVoltageCourseNav({
  currentLessonId,
}: {
  currentLessonId: number;
}) {
  const [showLessons, setShowLessons] = useState(false);

  const { currentLesson, previousLesson, nextLesson, totalLessons } = useMemo(() => {
    const currentIndex = currentVoltageLessons.findIndex((lesson) => lesson.id === currentLessonId);

    return {
      currentLesson: currentVoltageLessons[currentIndex] ?? null,
      previousLesson: currentIndex > 0 ? currentVoltageLessons[currentIndex - 1] : null,
      nextLesson:
        currentIndex >= 0 && currentIndex < currentVoltageLessons.length - 1
          ? currentVoltageLessons[currentIndex + 1]
          : null,
      totalLessons: currentVoltageLessons.length,
    };
  }, [currentLessonId]);

  if (!currentLesson) {
    return null;
  }

  return (
    <section
      style={{
        borderRadius: 20,
        border: "1px solid #e7eef6",
        background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
        padding: 18,
        boxShadow: "0 8px 20px rgba(15,23,42,0.035)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 11.5,
              fontWeight: 800,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#6b7a90",
            }}
          >
            Current & Voltage Course
          </p>
          <h2
            style={{
              margin: "6px 0 0",
              fontSize: 20,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Lesson {currentLesson.id} of {totalLessons}: {currentLesson.title}
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 15,
              lineHeight: 1.6,
              color: "#64748b",
            }}
          >
            Move step by step through the course and keep track of where you are.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowLessons((value) => !value)}
          style={{
            borderRadius: 12,
            border: "1px solid #d6dee8",
            background: showLessons ? "#eef6ff" : "rgba(255,255,255,0.88)",
            padding: "10px 14px",
            color: "#1e293b",
            fontSize: 13.5,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: showLessons ? "0 4px 10px rgba(37,99,235,0.08)" : "none",
          }}
        >
          {showLessons ? "Hide Lesson List" : "View All Lessons"}
        </button>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          marginTop: 16,
          paddingTop: 14,
          borderTop: "1px solid #edf2f7",
        }}
      >
        <NavLink
          href={previousLesson?.href}
          label="Previous Lesson"
          disabled={!previousLesson}
        />
        <NavLink href={nextLesson?.href} label="Next Lesson" disabled={!nextLesson} />
      </div>

      {showLessons ? (
        <div
          style={{
            marginTop: 16,
            display: "grid",
            gap: 10,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {currentVoltageLessons.map((lesson) => {
            const isActive = lesson.id === currentLessonId;

            return (
              <a
                key={lesson.id}
                href={lesson.href}
                style={{
                  borderRadius: 14,
                  border: isActive ? "1px solid #86efac" : "1px solid #e2e8f0",
                  background: isActive ? "#f0fdf4" : "#ffffff",
                  padding: "13px 15px",
                  color: "#0f172a",
                  textDecoration: "none",
                  boxShadow: isActive ? "0 4px 10px rgba(34,197,94,0.08)" : "none",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: isActive ? "#15803d" : "#64748b",
                  }}
                >
                  Lesson {lesson.id}
                </p>
                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: 15,
                    fontWeight: 600,
                    lineHeight: 1.4,
                  }}
                >
                  {lesson.title}
                </p>
              </a>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
