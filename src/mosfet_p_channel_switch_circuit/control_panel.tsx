"use client";

// Placeholder section card for the PMOS workspace until live control logic is wired in.
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

export default function MosfetPChannelSwitchCircuitControlPanel() {
  return (
    // Keeps the same polished stacked panel pattern as the MOSFET N workspace.
    <div className="control-panel-stack">
      <div className="control-panel-note-card">
        <p className="control-panel-note-copy">
          Workspace shell is polished first. Real gate-drive controls, live
          VDD state, and PMOS high-side switching feedback will be connected
          after the circuit drawing is finalized.
        </p>
      </div>
      <EmptyCard
        title="Training Mode"
        description="This section will switch between guided PMOS high-side switching lessons and free circuit exploration."
      />
      <EmptyCard
        title="System Status"
        description="VDD state, gate level, source connection, drain load path, and LED output state will appear here after signal wiring is connected."
      />
      <EmptyCard
        title="Gate Drive"
        description="Gate pull-up behavior through RG, push-button pull-down action, and PMOS ON and OFF trigger response will be displayed here later."
      />
      <EmptyCard
        title="Load & Output"
        description="LED branch response, load current condition, and PMOS high-side output behavior will be shown here in the full project."
      />
      <EmptyCard
        title="Logic State"
        description="Open-switch and pressed-switch state summaries will appear here so the gate-high and gate-low behavior is easy to compare."
      />
      <EmptyCard
        title="Event Timeline"
        description="The press and release sequence, gate transition, and output response timeline will be added here next."
      />
    </div>
  );
}
