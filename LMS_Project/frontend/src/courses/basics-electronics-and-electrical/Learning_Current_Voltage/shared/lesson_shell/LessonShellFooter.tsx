"use client";

export default function LessonShellFooter({
  lessonTitle,
  activeViewLabel,
}: {
  lessonTitle: string;
  activeViewLabel: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
        padding: "18px 22px",
        borderTop: "1px solid #e5edf5",
        background: "#ffffff",
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#64748b",
          }}
        >
          Lesson Wrapper
        </p>
        <p
          style={{
            margin: "6px 0 0",
            fontSize: 15,
            fontWeight: 600,
            color: "#0f172a",
          }}
        >
          {lessonTitle}
        </p>
      </div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          borderRadius: 9999,
          border: "1px solid #d8e1ea",
          background: "#f8fafc",
          padding: "10px 16px",
          color: "#334155",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 9999,
            background: "#2563eb",
          }}
        />
        Active View: {activeViewLabel}
      </div>
    </div>
  );
}
