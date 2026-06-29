"use client";

export default function PlanningTopicPanel({
  sectionLabel,
  title,
  description,
}: {
  sectionLabel: string;
  title: string;
  description: string;
}) {
  return (
    <article
      style={{
        borderRadius: 24,
        border: "1px solid #dbe4ee",
        background: "#ffffff",
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minHeight: 180,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#0f766e",
        }}
      >
        {sectionLabel}
      </p>
      <h3
        style={{
          margin: 0,
          fontSize: 22,
          lineHeight: 1.2,
          fontWeight: 800,
          color: "#0f172a",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: 14,
          lineHeight: 1.7,
          color: "#475569",
        }}
      >
        {description}
      </p>
      <p
        style={{
          margin: "auto 0 0",
          fontSize: 12,
          fontWeight: 700,
          color: "#b45309",
        }}
      >
        Placeholder planning scaffold only.
      </p>
    </article>
  );
}
