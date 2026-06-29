"use client";

// Placeholder section card for the MOSFET workspace until live control logic is wired in.
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

export default function MosfetNChannelSwitchCircuitControlPanel() {
  return (
    // Keeps the same polished stacked panel pattern without touching the manual circuit layout.
    <div className="control-panel-stack">
      <div className="control-panel-note-card">
        <p className="control-panel-note-copy">
          Workspace shell is polished first. Real gate-drive controls, live
          VDD state, and MOSFET switching feedback will be connected after the
          circuit drawing is finalized.
        </p>
      </div>
      <EmptyCard
        title="Training Mode"
        description="This section will switch between guided MOSFET switching lessons and free circuit exploration."
      />
      <EmptyCard
        title="System Status"
        description="VDD state, gate input, drain path status, source return, and LED output state will appear here after signal wiring is connected."
      />
      <EmptyCard
        title="Gate Drive"
        description="Gate bias, pull-down or pull-up behavior, and switch trigger response will be displayed here later."
      />
      <EmptyCard
        title="Load & Output"
        description="LED path response, load current condition, and MOSFET ON and OFF output behavior will be shown here in the full project."
      />
      <EmptyCard
        title="Event Timeline"
        description="The press and release sequence, gate transition, and load response timeline will be added here next."
      />
    </div>
  );
}
