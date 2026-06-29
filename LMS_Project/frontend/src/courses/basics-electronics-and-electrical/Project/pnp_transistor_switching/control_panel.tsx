"use client";

// Placeholder section card for the PNP workspace until live control logic is wired in.
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

export default function PnpTransistorSwitchingControlPanel() {
  return (
    // Keeps the same polished stacked panel pattern as the other circuit workspaces.
    <div className="control-panel-stack">
      <div className="control-panel-note-card">
        <p className="control-panel-note-copy">
          Workspace shell is polished first. Real switch actions, live base and
          emitter values, and output-state feedback will be connected after the
          final PNP circuit layout is locked.
        </p>
      </div>
      <EmptyCard
        title="Training Mode"
        description="This section will switch between guided high-side PNP lessons and free circuit exploration."
      />
      <EmptyCard
        title="System Status"
        description="Vcc state, base bias, emitter source state, collector conduction, and LED output status will appear here after signal wiring is connected."
      />
      <EmptyCard
        title="Base Drive"
        description="Base pull-up behavior, switch action, and the PNP ON and OFF trigger state will be displayed here later."
      />
      <EmptyCard
        title="Load & Output"
        description="LED path status, load current direction, and output branch response will be shown here in the full project."
      />
      <EmptyCard
        title="Event Timeline"
        description="The press and release sequence, high-side switching transition, and LED response timeline will be added here next."
      />
    </div>
  );
}
