"use client";

// Simple placeholder card used until the real training and status controls are wired in.
function EmptyCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="control-panel-section">
      <button
        type="button"
        className="control-panel-section-header"
        aria-expanded="true"
      >
        <h3>{title}</h3>
        <span className="control-panel-section-toggle">-</span>
      </button>
      <div className="control-panel-section-body">
        <div className="control-panel-note-card">
          <p className="control-panel-note-copy">{description}</p>
        </div>
      </div>
    </section>
  );
}

export default function NpnTransistorSwitchingControlPanel() {
  return (
    // Keeps the same stacked control-panel structure as the reference project.
    <div className="control-panel-stack">
      <div className="control-panel-note-card">
        <p className="control-panel-note-copy">
          Workspace shell is polished first. Control actions, live values, and
          guided steps will be wired after the circuit drawing is finalized.
        </p>
      </div>
      <EmptyCard
        title="Training Mode"
        description="This section will switch between free exploration and guided transistor-switching lessons."
      />
      <EmptyCard
        title="System Status"
        description="Vcc, base state, collector conduction, and LED output status will appear here after signal mapping is connected."
      />
      <EmptyCard
        title="Load & Output"
        description="LED current, transistor state, and output-path feedback will be shown here later."
      />
      <EmptyCard
        title="Event Timeline"
        description="The button press sequence and ON/OFF transition timeline will be added here in the full project."
      />
    </div>
  );
}
