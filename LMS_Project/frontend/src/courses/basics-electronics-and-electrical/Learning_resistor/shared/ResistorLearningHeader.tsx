"use client";

import Link from "next/link";

const resistorHeaderTabs = [
  "Logic & Theory",
  "Logic & Theory (Bangla)",
  "Udemy English Script",
  "Udemy Script Bangla",
  "Simulation",
] as const;

export default function ResistorLearningHeader() {
  return (
    <section
      style={{
        borderRadius: 32,
        border: "1px solid #dbe4ee",
        background: "#ffffff",
        boxShadow: "0 16px 36px rgba(15,23,42,0.05)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 20,
          padding: "24px 22px",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 9999,
              border: "1px solid #bbf7d0",
              background: "#f0fdf4",
              padding: "8px 14px",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#15803d",
            }}
          >
            <span
              style={{
              width: 8,
              height: 8,
              borderRadius: 9999,
              background: "#22c55e",
            }}
            />
            Lesson 01
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          {[
            { href: "/", label: "Home" },
            { href: "/courses/basics-electronics-and-electrical", label: "My Course" },
            { href: "/dashboard", label: "Dashboard" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 46,
                padding: "12px 18px",
                borderRadius: 16,
                border: "1px solid #d6dee8",
                background: "#ffffff",
                color: "#142033",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 6px 14px rgba(15,23,42,0.05)",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          flexWrap: "wrap",
          padding: "0 22px 24px",
          borderTop: "1px solid #edf2f7",
          paddingTop: 18,
        }}
      >
        {resistorHeaderTabs.map((label) => {
          const isActive = label === "Simulation";

          return (
            <button
              key={label}
              type="button"
              style={{
                minHeight: 56,
                padding: "14px 26px",
                borderRadius: 18,
                border: isActive ? "2px solid #d6dee8" : "2px solid transparent",
                background: isActive ? "#ffffff" : "transparent",
                color: "#111827",
                fontSize: 17,
                fontWeight: 700,
                cursor: "default",
                boxShadow: isActive ? "0 6px 14px rgba(15,23,42,0.06)" : "none",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
