"use client";

type PhaseOneLessonPlaceholderProps = {
  lessonNumber: number;
  title: string;
  folderName: string;
  summary: string;
};

export default function PhaseOneLessonPlaceholder({
  lessonNumber,
  title,
  folderName,
  summary,
}: PhaseOneLessonPlaceholderProps) {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fffdf8 0%, #f8fafc 100%)",
        padding: "24px 16px 32px",
      }}
    >
      <div
        style={{
          maxWidth: 1480,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <section
          style={{
            borderRadius: 36,
            border: "3px solid #1f1f1f",
            background: "#ffffff",
            padding: 22,
            boxShadow: "0 24px 60px rgba(15,23,42,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <span
                style={{
                  display: "inline-flex",
                  borderRadius: 9999,
                  background: "#e6f7eb",
                  padding: "8px 16px",
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "#22833f",
                }}
              >
                Lesson {String(lessonNumber).padStart(2, "0")}
              </span>
              <h1
                style={{
                  margin: "14px 0 0",
                  fontSize: 36,
                  lineHeight: 1.08,
                  fontWeight: 900,
                  color: "#020617",
                }}
              >
                {title}
              </h1>
              <p
                style={{
                  marginTop: 12,
                  maxWidth: 760,
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: "#475569",
                }}
              >
                {summary}
              </p>
            </div>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <button
                type="button"
                disabled
                style={{
                  minWidth: 170,
                  padding: "14px 22px",
                  borderRadius: 18,
                  border: "3px solid #1f1f1f",
                  background: "#ffffff",
                  color: "#1f1f1f",
                  fontSize: 16,
                  fontWeight: 700,
                  opacity: 0.45,
                  cursor: "not-allowed",
                }}
              >
                Logic &amp; Theory
              </button>
              <button
                type="button"
                style={{
                  minWidth: 170,
                  padding: "14px 22px",
                  borderRadius: 18,
                  border: "3px solid #d97706",
                  background: "#ffffff",
                  color: "#d97706",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "default",
                }}
              >
                Coming Soon
              </button>
            </div>
          </div>
        </section>

        <section
          style={{
            borderRadius: 32,
            border: "3px solid #d97706",
            background: "#ffffff",
            minHeight: 420,
            padding: 24,
            boxShadow: "0 14px 36px rgba(15,23,42,0.05)",
          }}
        >
          <div
            style={{
              borderRadius: 26,
              border: "1px solid #fed7aa",
              background: "#fff7ed",
              padding: 24,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.04em",
                color: "#c2410c",
                textTransform: "uppercase",
              }}
            >
              Planned Lesson Folder
            </p>
            <p
              style={{
                margin: "10px 0 0",
                fontSize: 20,
                fontWeight: 800,
                color: "#7c2d12",
              }}
            >
              {folderName}
            </p>
            <p
              style={{
                margin: "16px 0 0",
                fontSize: 15,
                lineHeight: 1.7,
                color: "#7c2d12",
                maxWidth: 820,
              }}
            >
              This URL is now reserved in the final Phase 1 roadmap so the lesson
              order stays consistent for the website and future Udemy video flow.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
