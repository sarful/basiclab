"use client";

import { useEffect, useState, type ReactNode } from "react";

type TrainingMode = "free" | "guided";

type WaveformPreviewProps = {
  supplyOn: boolean;
  outputRunning: boolean;
  faultActive: boolean;
  secondaryVoltage: string;
  rectifiedVoltage: string;
  filteredVoltage: string;
  regulatedVoltage: string;
  rippleLevel: string;
};

type LinearPowerSupplyControlPanelProps = {
  trainingMode: TrainingMode;
  onTrainingModeChange: (mode: TrainingMode) => void;
  supplyOn: boolean;
  outputRunning: boolean;
  faultActive: boolean;
  primaryTurns: number;
  secondaryTurns: number;
  onPrimaryTurnsChange: (value: number) => void;
  onSecondaryTurnsChange: (value: number) => void;
  capacitorUf: number;
  onCapacitorUfChange: (value: number) => void;
  capacitorRatedVoltage: number;
  onCapacitorRatedVoltageChange: (value: number) => void;
  regulatorModel: "7805" | "7809" | "7812";
  onRegulatorModelChange: (value: "7805" | "7809" | "7812") => void;
  resistorOhms: number;
  onResistorOhmsChange: (value: number) => void;
  ledColor: "green" | "yellow";
  onLedColorChange: (value: "green" | "yellow") => void;
  secondaryVoltage: string;
  capacitorVoltage: string;
  capacitorRating: string;
  capacitorSafety: string;
  recommendedCapVoltage: string;
  recommendedCapacitance: string;
  recommendedResistorOhms: string;
  recommendedResistorWatt: string;
  designFormulaItems: Array<{
    label: string;
    formula: string;
    value: string;
  }>;
  inputSupply: string;
  transformer: string;
  rectifier: string;
  regulator: string;
  fault: string;
  outputVoltage: string;
  rippleLevel: string;
  ledLoad: string;
  loadCurrent: string;
  guidedStepLabel: string;
  guidedStepStatus: string;
  guidedStepTitle: string;
  guidedStepDescription: string;
  onGuidedPrev: () => void;
  onGuidedNext: () => void;
  canGuidedPrev: boolean;
  canGuidedNext: boolean;
  timelineHint: string;
  timelinePlaying: boolean;
  timelineEntries: Array<{
    title: string;
    state: string;
    description: string;
    time: string;
  }>;
  timelineActiveIndex: number;
  onTimelinePrev: () => void;
  onTimelinePlay: () => void;
  onTimelineNext: () => void;
  onTimelineReset: () => void;
  canTimelinePrev: boolean;
  canTimelineNext: boolean;
  currentStage: string;
  lessonGoal: string;
  nextStep: string;
  learningNote: string;
  componentLearningItems: Array<{
    key: string;
    label: string;
    title: string;
    body: string;
  }>;
  componentLearningActiveKey: string;
  componentFocusTitle: string;
  componentFocusBody: string;
  componentSummaryItems: Array<{ label: string; value: string }>;
  componentStateBadges: Array<{ label: string; value: string }>;
};

export function LinearPowerSupplyWaveformPreview({
  supplyOn,
  outputRunning,
  faultActive,
  secondaryVoltage,
  rectifiedVoltage,
  filteredVoltage,
  regulatedVoltage,
  rippleLevel,
}: WaveformPreviewProps) {
  return (
    <div className="control-panel-waveform-grid">
      <WaveformCard
        label="AC"
        stateLabel={supplyOn ? "Live Sine" : "Idle"}
        measurement={secondaryVoltage}
        tone="ac"
        path="M 0 34 C 12 12, 24 12, 36 34 S 60 56, 72 34 S 96 12, 108 34 S 132 56, 144 34"
        active={supplyOn}
      />
      <WaveformCard
        label="Rectified"
        stateLabel={supplyOn ? "Pulsating DC" : "Idle"}
        measurement={rectifiedVoltage}
        tone="rectified"
        path="M 0 44 C 10 18, 20 18, 30 44 L 36 44 C 46 18, 56 18, 66 44 L 72 44 C 82 18, 92 18, 102 44 L 108 44 C 118 18, 128 18, 138 44"
        active={supplyOn}
      />
      <WaveformCard
        label="Filtered"
        stateLabel={!supplyOn ? "Idle" : outputRunning ? "Smooth DC" : "Charging"}
        measurement={!supplyOn ? filteredVoltage : `${filteredVoltage} / Ripple ${rippleLevel}`}
        tone="filtered"
        path="M 0 24 C 16 16, 30 18, 42 26 S 70 30, 84 24 S 112 18, 144 22"
        active={supplyOn}
      />
      <WaveformCard
        label="Regulated"
        stateLabel={!supplyOn ? "Off" : faultActive ? "Trip Low" : outputRunning ? "Stable 5V" : "Standby"}
        measurement={regulatedVoltage}
        tone="regulated"
        path="M 0 24 L 144 24"
        active={supplyOn && !faultActive}
        highlight={outputRunning && !faultActive}
        danger={faultActive}
      />
    </div>
  );
}

function PanelSection({
  title,
  children,
  defaultExpanded = true,
}: {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <section className="control-panel-section">
      <button
        type="button"
        className="control-panel-section-header"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
      >
        <h3>{title}</h3>
        <span className="control-panel-section-toggle">
          {expanded ? "−" : "+"}
        </span>
      </button>
      {expanded ? (
        <div className="control-panel-section-body">{children}</div>
      ) : null}
    </section>
  );
}

function StatusItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="control-panel-status-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SetupField({
  label,
  children,
  helper,
}: {
  label: string;
  children: ReactNode;
  helper?: string;
}) {
  return (
    <label className="control-panel-setup-field">
      <span>{label}</span>
      {children}
      {helper ? <small>{helper}</small> : null}
    </label>
  );
}

function SetupSubsection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="control-panel-setup-block">
      <div className="control-panel-setup-block-head">
        <strong>{title}</strong>
      </div>
      {children}
    </div>
  );
}

function CompareRow({
  label,
  selected,
  recommended,
}: {
  label: string;
  selected: string;
  recommended: string;
}) {
  return (
    <div className="control-panel-compare-row">
      <strong>{label}</strong>
      <div className="control-panel-compare-values">
        <span>Selected: {selected}</span>
        <span>Recommended: {recommended}</span>
      </div>
    </div>
  );
}

export default function LinearPowerSupplyControlPanel({
  trainingMode,
  onTrainingModeChange,
  supplyOn,
  outputRunning,
  faultActive,
  primaryTurns,
  secondaryTurns,
  onPrimaryTurnsChange,
  onSecondaryTurnsChange,
  capacitorUf,
  onCapacitorUfChange,
  capacitorRatedVoltage,
  onCapacitorRatedVoltageChange,
  regulatorModel,
  onRegulatorModelChange,
  resistorOhms,
  onResistorOhmsChange,
  ledColor,
  onLedColorChange,
  secondaryVoltage,
  capacitorVoltage,
  capacitorRating,
  capacitorSafety,
  recommendedCapVoltage,
  recommendedCapacitance,
  recommendedResistorOhms,
  recommendedResistorWatt,
  designFormulaItems,
  inputSupply,
  transformer,
  rectifier,
  regulator,
  fault,
  outputVoltage,
  rippleLevel,
  ledLoad,
  loadCurrent,
  guidedStepLabel,
  guidedStepStatus,
  guidedStepTitle,
  guidedStepDescription,
  onGuidedPrev,
  onGuidedNext,
  canGuidedPrev,
  canGuidedNext,
  timelineHint,
  timelinePlaying,
  timelineEntries,
  timelineActiveIndex,
  onTimelinePrev,
  onTimelinePlay,
  onTimelineNext,
  onTimelineReset,
  canTimelinePrev,
  canTimelineNext,
  currentStage,
  lessonGoal,
  nextStep,
  learningNote,
  componentLearningItems,
  componentLearningActiveKey,
  componentFocusTitle,
  componentFocusBody,
  componentSummaryItems,
  componentStateBadges,
}: LinearPowerSupplyControlPanelProps) {
  const [selectedLearningKey, setSelectedLearningKey] = useState(
    componentLearningActiveKey,
  );

  useEffect(() => {
    setSelectedLearningKey(componentLearningActiveKey);
  }, [componentLearningActiveKey]);

  const selectedLearningItem =
    componentLearningItems.find((item) => item.key === selectedLearningKey) ?? {
      key: "fallback",
      label: "Focus",
      title: componentFocusTitle,
      body: componentFocusBody,
    };
  const guidedMode = trainingMode === "guided";

  return (
    <div className="control-panel-stack">
      {/* Section 1: lets the student understand which learning mode the workspace is in. */}
      <PanelSection title="Training Mode">
        <div className="control-panel-segment">
          <button
            type="button"
            className={`control-panel-mode-button${
              trainingMode === "free" ? " is-active" : ""
            }`}
            onClick={() => onTrainingModeChange("free")}
          >
            Free Simulation
          </button>
          <button
            type="button"
            className={`control-panel-mode-button${
              trainingMode === "guided" ? " is-active" : ""
            }`}
            onClick={() => onTrainingModeChange("guided")}
          >
            Guided Training
          </button>
        </div>
        <div className="control-panel-note-card">
          <p className="control-panel-note-copy">
            {guidedMode
              ? "Guided training keeps the lesson focused on the current circuit stage."
              : "Free simulation lets the student explore the circuit response without lesson restrictions."}
          </p>
        </div>
      </PanelSection>

      {guidedMode ? (
        <>
          {/* Section 2: gives the student a simple lesson objective before live guidance is wired in. */}
          <PanelSection title="Guided Lesson">
            <div className="control-panel-guided-card">
              <div className="control-panel-guided-meta">
                <span>{guidedStepLabel}</span>
                <strong>{guidedStepStatus}</strong>
              </div>
              <strong className="control-panel-guided-title">
                {guidedStepTitle}
              </strong>
              <p className="control-panel-note-copy">
                {guidedStepDescription}
              </p>
              <div className="control-panel-guided-actions">
                <button
                  type="button"
                  className="control-panel-guided-button is-secondary"
                  onClick={onGuidedPrev}
                  disabled={!canGuidedPrev}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="control-panel-guided-button is-primary"
                  onClick={onGuidedNext}
                  disabled={!canGuidedNext}
                >
                  Next
                </button>
              </div>
            </div>
          </PanelSection>

          {/* Section 3: lets the student tune the component values and immediately study how the supply changes. */}
          <PanelSection title="Component Setup">
            <SetupSubsection title="Adjust Components">
              <div className="control-panel-setup-grid">
                <SetupField
                  label="Transformer Primary Turns"
                  helper="Higher primary turns reduce the secondary ratio."
                >
                  <input
                    type="number"
                    min={60}
                    max={400}
                    step={10}
                    value={primaryTurns}
                    onChange={(event) =>
                      onPrimaryTurnsChange(Number(event.target.value) || 0)
                    }
                  />
                </SetupField>
                <SetupField
                  label="Transformer Secondary Turns"
                  helper="More secondary turns increase the secondary voltage."
                >
                  <input
                    type="number"
                    min={5}
                    max={120}
                    step={1}
                    value={secondaryTurns}
                    onChange={(event) =>
                      onSecondaryTurnsChange(Number(event.target.value) || 0)
                    }
                  />
                </SetupField>
                <SetupField
                  label="Filter Capacitor (uF)"
                  helper="Larger capacitance reduces ripple at the DC bus."
                >
                  <input
                    type="number"
                    min={47}
                    max={2200}
                    step={47}
                    value={capacitorUf}
                    onChange={(event) =>
                      onCapacitorUfChange(Number(event.target.value) || 0)
                    }
                  />
                </SetupField>
                <SetupField
                  label="Capacitor Voltage Rating"
                  helper="Choose a capacitor voltage rating above the DC bus level."
                >
                  <input
                    type="number"
                    min={6.3}
                    max={100}
                    step={0.1}
                    value={capacitorRatedVoltage}
                    onChange={(event) =>
                      onCapacitorRatedVoltageChange(
                        Number(event.target.value) || 0,
                      )
                    }
                  />
                </SetupField>
                <SetupField
                  label="Voltage Regulator"
                  helper="Choose the regulated output target for the load branch."
                >
                  <select
                    value={regulatorModel}
                    onChange={(event) =>
                      onRegulatorModelChange(
                        event.target.value as "7805" | "7809" | "7812",
                      )
                    }
                  >
                    <option value="7805">7805</option>
                    <option value="7809">7809</option>
                    <option value="7812">7812</option>
                  </select>
                </SetupField>
                <SetupField
                  label="Series Resistor (Ohms)"
                  helper="Lower resistance raises LED/load current."
                >
                  <input
                    type="number"
                    min={47}
                    max={1000}
                    step={1}
                    value={resistorOhms}
                    onChange={(event) =>
                      onResistorOhmsChange(Number(event.target.value) || 0)
                    }
                  />
                </SetupField>
                <SetupField
                  label="LED Color"
                  helper="LED forward drop changes with color."
                >
                  <select
                    value={ledColor}
                    onChange={(event) =>
                      onLedColorChange(event.target.value as "green" | "yellow")
                    }
                  >
                    <option value="green">Green LED</option>
                    <option value="yellow">Yellow LED</option>
                  </select>
                </SetupField>
              </div>
            </SetupSubsection>
            <SetupSubsection title="Live Operating Values">
              <div className="control-panel-status-list">
                <StatusItem label="Secondary Voltage" value={secondaryVoltage} />
                <StatusItem label="Capacitor Voltage" value={capacitorVoltage} />
                <StatusItem label="Capacitor Rating" value={capacitorRating} />
                <StatusItem label="Capacitor Safety" value={capacitorSafety} />
              </div>
            </SetupSubsection>
            <SetupSubsection title="Selected vs Recommended">
              <div className="control-panel-compare-stack">
                <CompareRow
                  label="Capacitor"
                  selected={`${capacitorUf} uF`}
                  recommended={recommendedCapacitance}
                />
                <CompareRow
                  label="Cap Voltage"
                  selected={capacitorRating}
                  recommended={recommendedCapVoltage}
                />
                <CompareRow
                  label="Resistor"
                  selected={`${resistorOhms} Ohm`}
                  recommended={recommendedResistorOhms}
                />
                <CompareRow
                  label="Resistor Watt"
                  selected="Current Build"
                  recommended={recommendedResistorWatt}
                />
              </div>
            </SetupSubsection>
            <div className="control-panel-formula-stack">
              {designFormulaItems.map((item) => (
                <div key={item.label} className="control-panel-formula-card">
                  <div className="control-panel-formula-head">
                    <strong>{item.label}</strong>
                    <span>{item.formula}</span>
                  </div>
                  <p className="control-panel-note-copy">{item.value}</p>
                </div>
              ))}
            </div>
          </PanelSection>
        </>
      ) : null}

      {/* Section 4: keeps the most important operating states easy for a beginner to read. */}
      <PanelSection title="System Status">
        <div className="control-panel-status-list">
          <StatusItem label="Input Supply" value={inputSupply} />
          <StatusItem label="Transformer" value={transformer} />
          <StatusItem label="Rectifier" value={rectifier} />
          <StatusItem label="Regulator" value={regulator} />
          <StatusItem label="Fault" value={fault} />
        </div>
        <div className="control-panel-status-list control-panel-status-list-compact">
          {componentStateBadges.map((item) => (
            <StatusItem key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </PanelSection>

      {/* Section 5: reserves the panel space needed for later live voltage, ripple, and load values. */}
      <PanelSection title="Load & Output">
        <div className="control-panel-status-list">
          <StatusItem label="Output Voltage" value={outputVoltage} />
          <StatusItem label="Ripple Level" value={rippleLevel} />
          <StatusItem label="LED Load" value={ledLoad} />
          <StatusItem label="Load Current" value={loadCurrent} />
        </div>
      </PanelSection>

      {/* Section 6: walks the student through the power-conversion sequence with replay controls. */}
      <PanelSection title="Event Timeline">
        <p className="control-panel-note-copy">{timelineHint}</p>
        <div className="control-panel-guided-actions control-panel-timeline-actions">
          <button
            type="button"
            className="control-panel-guided-button is-secondary"
            onClick={onTimelinePrev}
            disabled={!canTimelinePrev}
          >
            Prev
          </button>
          <button
            type="button"
            className="control-panel-guided-button is-primary"
            onClick={onTimelinePlay}
          >
            {timelinePlaying ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            className="control-panel-guided-button is-secondary"
            onClick={onTimelineNext}
            disabled={!canTimelineNext}
          >
            Next
          </button>
          <button
            type="button"
            className="control-panel-guided-button is-secondary"
            onClick={onTimelineReset}
          >
            Reset
          </button>
        </div>
        <div className="control-panel-timeline-list">
          {timelineEntries.map((entry, index) => (
            <div
              key={`${entry.title}-${index}`}
              className={`control-panel-timeline-card${
                index === timelineActiveIndex ? " is-active" : ""
              }`}
            >
              <span className="control-panel-timeline-dot" aria-hidden="true" />
              <div className="control-panel-timeline-content">
                <div className="control-panel-timeline-head">
                  <strong>{entry.title}</strong>
                  <span>{entry.time}</span>
                </div>
                <div className="control-panel-timeline-state">{entry.state}</div>
                <p className="control-panel-note-copy">{entry.description}</p>
              </div>
            </div>
          ))}
        </div>
      </PanelSection>

      {guidedMode ? (
        <PanelSection title="Component Learning">
          <div className="control-panel-learning-chip-grid">
            {componentLearningItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`control-panel-learning-chip${
                  item.key === selectedLearningKey ? " is-active" : ""
                }`}
                onClick={() => setSelectedLearningKey(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="control-panel-learning-card">
            <strong className="control-panel-learning-title">
              {selectedLearningItem.title}
            </strong>
            <p className="control-panel-note-copy">{selectedLearningItem.body}</p>
          </div>
          <div className="control-panel-status-list control-panel-status-list-compact">
            {componentSummaryItems.map((item) => (
              <StatusItem key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        </PanelSection>
      ) : null}
    </div>
  );
}

function WaveformCard({
  label,
  stateLabel,
  measurement,
  path,
  tone,
  active,
  highlight = false,
  danger = false,
}: {
  label: string;
  stateLabel: string;
  measurement: string;
  path: string;
  tone: "ac" | "rectified" | "filtered" | "regulated";
  active: boolean;
  highlight?: boolean;
  danger?: boolean;
}) {
  const toneClass = `control-panel-waveform-card is-${tone}${active ? " is-active" : ""}${highlight ? " is-highlight" : ""}${danger ? " is-danger" : ""}`;

  return (
    <div className={toneClass}>
      <div className="control-panel-waveform-head">
        <strong>{label}</strong>
        <span>{stateLabel}</span>
      </div>
      <div className="control-panel-waveform-measurement">{measurement}</div>
      <svg
        className="control-panel-waveform-svg"
        viewBox="0 0 144 64"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 0 32 L 144 32"
          fill="none"
          stroke="rgba(148, 163, 184, 0.42)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={active ? 1 : 0.42}
        />
      </svg>
    </div>
  );
}
