"use client";

import CapacitorLessonOneSimulation from "./CapacitorLessonOneSimulation";

export default function CapacitorLessonOneEmbeddedPage() {
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
                Lesson 01
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
                Capacitor
              </h1>
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
                  border: "3px solid #2ea84a",
                  background: "#ffffff",
                  color: "#2ea84a",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "default",
                }}
              >
                Animation
              </button>
            </div>
          </div>
        </section>

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
              animation
            </div>
            <CapacitorLessonOneSimulation />
          </div>
        </section>
      </div>
    </main>
  );
}
