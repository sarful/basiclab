"use client";

import type { LessonShellTab } from "./types";

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "14px 24px",
        borderRadius: 18,
        border: active ? "2px solid #d6dee8" : "2px solid transparent",
        background: active ? "#ffffff" : "transparent",
        color: "#111827",
        fontSize: 17,
        fontWeight: 700,
        cursor: "pointer",
        transition: "all 160ms ease",
        boxShadow: active ? "0 6px 14px rgba(15,23,42,0.06)" : "none",
      }}
    >
      {label}
    </button>
  );
}

export default function LessonShellHeader<T extends string>({
  lessonLabel,
  tabs,
  activeTab,
  onTabChange,
}: {
  lessonLabel: string;
  tabs: LessonShellTab<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 20,
        flexWrap: "wrap",
        padding: "28px 28px 28px",
        borderBottom: "1px solid #edf2f7",
        background: "#ffffff",
      }}
    >
      <button
        type="button"
        onClick={() => onTabChange(tabs[0].id)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          borderRadius: 9999,
          border: "1px solid #9ef3c4",
          background: "#ecfdf5",
        padding: "18px 28px",
        fontSize: 12.5,
        fontWeight: 800,
        letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "#047857",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 9999,
            background: "#10b981",
          }}
        />
        {lessonLabel}
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            label={tab.label}
            active={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          />
        ))}
      </div>
    </div>
  );
}
