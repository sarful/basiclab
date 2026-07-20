"use client";

export type ControlPanelProps = {
  onMcbToggle?: () => void;
  onStart?: () => void;
  onStop?: () => void;
  onReset?: () => void;
  onFault?: () => void;
  onRpmChange?: (value: number) => void;
  onHorsepowerChange?: (value: number) => void;
  onCurrentLimitChange?: (value: number) => void;
  onLoadChange?: (value: number) => void;
  mcbOn?: boolean;
  motorRunning?: boolean;
  overloadTripped?: boolean;
  modeLabel?: string;
  flowStateLabel?: string;
  flowDescription?: string;
  motorRpm?: number;
  motorHorsepower?: number;
  currentLimit?: number;
  loadPercent?: number;
  motorCurrent?: number;
  motorSpeed?: number;
  tripReason?: string;
  ratedCurrent?: number;
  currentMargin?: number;
  currentBand?: "safe" | "warning" | "trip";
  currentLearningNote?: string;
  trainingMode?: "free" | "guided";
  onTrainingModeChange?: (mode: "free" | "guided") => void;
  lessonStep?: number;
  lessonTotal?: number;
  lessonTitle?: string;
  lessonInstruction?: string;
  lessonComplete?: boolean;
  onLessonNext?: () => void;
  onLessonPrev?: () => void;
  canLessonNext?: boolean;
  canLessonPrev?: boolean;
  explanationTitle?: string;
  activeComponentName?: string;
  activeComponentFunction?: string;
  currentPathText?: string;
  componentStateBadges?: Array<{
    key: string;
    label: string;
    state: string;
    tone: "neutral" | "active" | "fault";
  }>;
  componentFocusKey?: string;
  componentFocusTitle?: string;
  componentFocusBody?: string;
  componentHelpOptions?: Array<{ key: string; label: string }>;
  onComponentFocus?: (key: string) => void;
  faultScenario?:
    | "none"
    | "overload"
    | "mcb-off"
    | "holding-fail"
    | "start-fail";
  faultScenarioOptions?: Array<{
    key: "none" | "overload" | "mcb-off" | "holding-fail" | "start-fail";
    label: string;
  }>;
  onFaultScenarioChange?: (
    scenario: "none" | "overload" | "mcb-off" | "holding-fail" | "start-fail",
  ) => void;
  faultScenarioHint?: string;
  eventTimeline?: Array<{
    id: number;
    time: string;
    title: string;
    detail: string;
  }>;
  replayState?: "idle" | "playing" | "paused";
  replaySummary?: string;
  replayEventId?: number;
  onReplayToggle?: () => void;
  onReplayReset?: () => void;
  onReplayPrev?: () => void;
  onReplayNext?: () => void;
  canReplayPrev?: boolean;
  canReplayNext?: boolean;
  className?: string;
  compact?: boolean;
  showControlsSection?: boolean;
};

function safeNumber(value: number, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export default function ControlPanel({
  onMcbToggle,
  onStart,
  onStop,
  onReset,
  onFault,
  onRpmChange,
  onHorsepowerChange,
  onCurrentLimitChange,
  onLoadChange,
  mcbOn = true,
  motorRunning = false,
  overloadTripped = false,
  modeLabel = "Idle",
  flowStateLabel = "Idle",
  flowDescription = "Control circuit status is ready.",
  motorRpm = 1440,
  motorHorsepower = 5,
  currentLimit = 12,
  loadPercent = 45,
  motorCurrent = 0,
  motorSpeed = 0,
  tripReason = "No active trip.",
  ratedCurrent = 0,
  currentMargin = 0,
  currentBand = "safe",
  currentLearningNote = "Motor current is within the expected operating band.",
  trainingMode = "free",
  onTrainingModeChange,
  lessonStep = 1,
  lessonTotal = 1,
  lessonTitle = "Free Simulation",
  lessonInstruction = "Operate the circuit manually and observe the response.",
  lessonComplete = false,
  onLessonNext,
  onLessonPrev,
  canLessonNext = true,
  canLessonPrev = false,
  explanationTitle = "System is idle.",
  activeComponentName = "MCB",
  activeComponentFunction = "Provides control supply isolation and protection.",
  currentPathText = "No active control path.",
  componentStateBadges = [],
  componentFocusKey = "mcb",
  componentFocusTitle = "MCB",
  componentFocusBody = "Provides control supply isolation and protection.",
  componentHelpOptions = [],
  onComponentFocus,
  faultScenario = "none",
  faultScenarioOptions = [],
  onFaultScenarioChange,
  faultScenarioHint = "Select a preset fault to observe how the circuit responds.",
  eventTimeline = [],
  replayState = "idle",
  replaySummary = "No replay available yet.",
  replayEventId,
  onReplayToggle,
  onReplayReset,
  onReplayPrev,
  onReplayNext,
  canReplayPrev = false,
  canReplayNext = false,
  className = "",
  compact = false,
  showControlsSection = true,
}: ControlPanelProps) {
  const safeMotorRpm = clampNumber(safeNumber(motorRpm, 1440), 0, 100000);
  const safeMotorHorsepower = clampNumber(
    safeNumber(motorHorsepower, 5),
    0.5,
    500,
  );
  const safeCurrentLimit = clampNumber(
    safeNumber(currentLimit, 12),
    0.1,
    10000,
  );
  const safeLoadPercent = clampNumber(safeNumber(loadPercent, 45), 0, 150);
  const safeMotorCurrent = safeNumber(motorCurrent, 0);
  const safeMotorSpeed = safeNumber(motorSpeed, 0);
  const safeRatedCurrent = safeNumber(ratedCurrent, 0);
  const safeCurrentMargin = safeNumber(currentMargin, 0);

  const canStart =
    Boolean(onStart) && mcbOn && !overloadTripped && !motorRunning;
  const canStop = Boolean(onStop) && (motorRunning || mcbOn);
  const canFault = Boolean(onFault) && mcbOn && !overloadTripped;

  if (compact) {
    return (
      <aside className={`lab-panel is-compact ${className}`}>
        <div className="lab-panel-compact-strip">
          <div className="lab-panel-compact-tile">
            <span>Supply</span>
            <strong className={mcbOn ? "is-on" : "is-off"}>
              {mcbOn ? "ON" : "OFF"}
            </strong>
          </div>
          <div className="lab-panel-compact-tile">
            <span>Motor</span>
            <strong className={motorRunning ? "is-on" : "is-off"}>
              {motorRunning ? "RUN" : "STOP"}
            </strong>
          </div>
          <div className="lab-panel-compact-tile">
            <span>Fault</span>
            <strong className={overloadTripped ? "is-fault" : "is-healthy"}>
              {overloadTripped ? "TRIP" : "OK"}
            </strong>
          </div>
          <div className="lab-panel-compact-tile">
            <span>Mode</span>
            <strong>{modeLabel}</strong>
          </div>
          <div className="lab-panel-compact-tile">
            <span>Load</span>
            <strong>{safeLoadPercent}%</strong>
          </div>
          <div className="lab-panel-compact-tile">
            <span>Current</span>
            <strong>{safeMotorCurrent.toFixed(1)} A</strong>
          </div>
          <div className="lab-panel-compact-tile">
            <span>Speed</span>
            <strong>{Math.round(safeMotorSpeed)} RPM</strong>
          </div>
          <div className="lab-panel-compact-tile">
            <span>Limit</span>
            <strong>{safeCurrentLimit} A</strong>
          </div>
        </div>

        <div className="lab-panel-compact-footer">
          <div className="lab-panel-compact-footer-main">
            <div className="lab-panel-pills">
              <span
                className={`control-panel-pill ${mcbOn ? "is-running" : "is-muted"}`}
              >
                SUPPLY
              </span>
              <span
                className={`control-panel-pill ${motorRunning ? "is-running" : "is-muted"}`}
              >
                RUN
              </span>
              <span
                className={`control-panel-pill ${overloadTripped ? "is-tripped" : "is-muted"}`}
              >
                TRIP
              </span>
            </div>

            <label className="lab-panel-slider-wrap is-compact-strip">
              <span>Load {safeLoadPercent}%</span>
              <input
                type="range"
                min="0"
                max="150"
                step="1"
                value={safeLoadPercent}
                disabled={!onLoadChange}
                onChange={(event) =>
                  onLoadChange?.(
                    clampNumber(Number(event.target.value), 0, 150),
                  )
                }
              />
            </label>
          </div>

          <div className="lab-panel-compact-note">
            <span>Live Note</span>
            <strong>{flowDescription}</strong>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`lab-panel ${className}`}>
      <details className="lab-panel-section is-collapsible" open>
        <summary className="lab-panel-summary">
          <span className="lab-panel-label">Training Mode</span>
        </summary>
        <div className="lab-panel-mode-toggle">
          <button
            type="button"
            className={`lab-panel-mode-button ${trainingMode === "free" ? "is-active" : ""}`}
            disabled={!onTrainingModeChange}
            onClick={() => onTrainingModeChange?.("free")}
          >
            Free Simulation
          </button>
          <button
            type="button"
            className={`lab-panel-mode-button ${trainingMode === "guided" ? "is-active" : ""}`}
            disabled={!onTrainingModeChange}
            onClick={() => onTrainingModeChange?.("guided")}
          >
            Guided Training
          </button>
        </div>
      </details>

      {trainingMode === "guided" ? (
        <details className="lab-panel-section is-collapsible" open>
          <summary className="lab-panel-summary">
            <span className="lab-panel-label">Guided Lesson</span>
          </summary>
          <div className="lab-panel-lesson-header">
            <span className="lab-panel-lesson-step">
              Step {lessonStep} / {lessonTotal}
            </span>
            <strong className={lessonComplete ? "is-healthy" : "is-off"}>
              {lessonComplete ? "Complete" : "Pending"}
            </strong>
          </div>
          <h3 className="lab-panel-lesson-title">{lessonTitle}</h3>
          <p className="lab-panel-copy">{lessonInstruction}</p>
          <div className="lab-panel-lesson-actions">
            <button
              type="button"
              className="lab-panel-nav-button"
              onClick={onLessonPrev}
              disabled={!canLessonPrev || !onLessonPrev}
            >
              Previous
            </button>
            <button
              type="button"
              className="lab-panel-nav-button is-next"
              onClick={onLessonNext}
              disabled={!canLessonNext || !onLessonNext}
            >
              Next
            </button>
          </div>
        </details>
      ) : null}

      <details className="lab-panel-section is-collapsible" open>
        <summary className="lab-panel-summary">
          <span className="lab-panel-label">System Status</span>
        </summary>
        <div className="lab-panel-status-grid">
          <div className="lab-panel-status-box">
            <span className="lab-panel-status-name">Supply</span>
            <strong className={mcbOn ? "is-on" : "is-off"}>
              {mcbOn ? "ON" : "OFF"}
            </strong>
          </div>
          <div className="lab-panel-status-box">
            <span className="lab-panel-status-name">Motor</span>
            <strong className={motorRunning ? "is-on" : "is-off"}>
              {motorRunning ? "RUN" : "STOP"}
            </strong>
          </div>
          <div className="lab-panel-status-box">
            <span className="lab-panel-status-name">Fault</span>
            <strong className={overloadTripped ? "is-fault" : "is-healthy"}>
              {overloadTripped ? "TRIP" : "OK"}
            </strong>
          </div>
        </div>
        <div className="lab-panel-pills">
          <span
            className={`control-panel-pill ${mcbOn ? "is-running" : "is-muted"}`}
          >
            SUPPLY
          </span>
          <span
            className={`control-panel-pill ${motorRunning ? "is-running" : "is-muted"}`}
          >
            MOTOR
          </span>
          <span
            className={`control-panel-pill ${overloadTripped ? "is-tripped" : "is-muted"}`}
          >
            TRIP
          </span>
        </div>
        <p className="lab-panel-copy lab-panel-copy-muted">
          {mcbOn ? "Control supply is live." : "Supply is isolated."}
        </p>
      </details>

      {trainingMode === "guided" ? (
        <details className="lab-panel-section is-collapsible" open>
          <summary className="lab-panel-summary">
            <span className="lab-panel-label">Component State Badges</span>
          </summary>
          <div className="lab-panel-state-badges">
            {componentStateBadges.map((badge) => (
              <div
                key={badge.key}
                className={`lab-panel-state-badge is-${badge.tone}`}
              >
                <span>{badge.label}</span>
                <strong>{badge.state}</strong>
              </div>
            ))}
          </div>
        </details>
      ) : null}

      {showControlsSection ? (
        <details className="lab-panel-section is-collapsible" open>
          <summary className="lab-panel-summary">
            <span className="lab-panel-label">Controls</span>
          </summary>
          <div className="lab-panel-button-stack">
            <button
              type="button"
              className="lab-panel-button is-mcb"
              onClick={onMcbToggle}
              disabled={!onMcbToggle}
            >
              {mcbOn ? "MCB OFF" : "MCB ON"}
            </button>
            <button
              type="button"
              className="lab-panel-button is-start"
              onClick={onStart}
              disabled={!canStart}
            >
              START
            </button>
            <button
              type="button"
              className="lab-panel-button is-stop"
              onClick={onStop}
              disabled={!canStop}
            >
              STOP
            </button>
            <button
              type="button"
              className="lab-panel-button is-reset"
              onClick={onReset}
              disabled={!onReset}
            >
              RESET
            </button>
            <button
              type="button"
              className="lab-panel-button is-fault"
              onClick={onFault}
              disabled={!canFault}
            >
              FAULT
            </button>
          </div>
          <p className="lab-panel-copy lab-panel-copy-muted">
            {flowStateLabel}
          </p>
        </details>
      ) : null}

      <details className="lab-panel-section is-collapsible" open>
        <summary className="lab-panel-summary">
          <span className="lab-panel-label">Motor Setup</span>
        </summary>
        <div className="lab-panel-input-stack">
          <label className="lab-panel-field">
            <span>RPM</span>
            <input
              type="number"
              min="300"
              step="10"
              value={safeMotorRpm}
              disabled={!onRpmChange}
              onChange={(event) =>
                onRpmChange?.(
                  clampNumber(Number(event.target.value), 300, 100000),
                )
              }
            />
          </label>
          <label className="lab-panel-field">
            <span>Horsepower</span>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={safeMotorHorsepower}
              disabled={!onHorsepowerChange}
              onChange={(event) =>
                onHorsepowerChange?.(
                  clampNumber(Number(event.target.value), 0.5, 500),
                )
              }
            />
          </label>
          <label className="lab-panel-field">
            <span>Current Limit (A)</span>
            <input
              type="number"
              min="1"
              step="0.5"
              value={safeCurrentLimit}
              disabled={!onCurrentLimitChange}
              onChange={(event) =>
                onCurrentLimitChange?.(
                  clampNumber(Number(event.target.value), 0.1, 10000),
                )
              }
            />
          </label>
        </div>
      </details>

      <details className="lab-panel-section is-collapsible" open>
        <summary className="lab-panel-summary">
          <span className="lab-panel-label">Load & Output</span>
        </summary>
        <label className="lab-panel-slider-wrap">
          <span>Load {safeLoadPercent}%</span>
          <input
            type="range"
            min="0"
            max="150"
            step="1"
            value={safeLoadPercent}
            disabled={!onLoadChange}
            onChange={(event) =>
              onLoadChange?.(clampNumber(Number(event.target.value), 0, 150))
            }
          />
        </label>
        <div className="lab-panel-metrics">
          <div className="lab-panel-metric">
            <span>Current Draw</span>
            <strong>{safeMotorCurrent.toFixed(1)} A</strong>
          </div>
          <div className="lab-panel-metric">
            <span>Speed</span>
            <strong>{Math.round(safeMotorSpeed)} RPM</strong>
          </div>
          <div className="lab-panel-metric">
            <span>Trip Reason</span>
            <strong>{tripReason}</strong>
          </div>
        </div>
        <p className="lab-panel-copy">{modeLabel}</p>
        <p className="lab-panel-copy">{flowDescription}</p>
        <div className={`lab-panel-current-learning is-${currentBand}`}>
          <div className="lab-panel-current-learning-head">
            <strong>Rated vs Actual Current</strong>
            <span className={`lab-panel-current-band is-${currentBand}`}>
              {currentBand === "safe"
                ? "Safe"
                : currentBand === "warning"
                  ? "Warning"
                  : "Trip"}
            </span>
          </div>
          <div className="lab-panel-current-grid">
            <div className="lab-panel-current-cell">
              <span>Rated Current</span>
              <strong>{safeRatedCurrent.toFixed(1)} A</strong>
            </div>
            <div className="lab-panel-current-cell">
              <span>Actual Current</span>
              <strong>{safeMotorCurrent.toFixed(1)} A</strong>
            </div>
            <div className="lab-panel-current-cell">
              <span>Overload Limit</span>
              <strong>{safeCurrentLimit.toFixed(1)} A</strong>
            </div>
            <div className="lab-panel-current-cell">
              <span>Margin to Trip</span>
              <strong>{safeCurrentMargin.toFixed(1)} A</strong>
            </div>
          </div>
          <p className="lab-panel-copy">{currentLearningNote}</p>
        </div>
      </details>

      {trainingMode === "guided" ? (
        <>
          <details className="lab-panel-section is-collapsible" open>
            <summary className="lab-panel-summary">
              <span className="lab-panel-label">Fault Scenario Trainer</span>
            </summary>
            <div className="lab-panel-help-grid">
              {faultScenarioOptions.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`lab-panel-help-chip ${faultScenario === item.key ? "is-active" : ""}`}
                  disabled={!onFaultScenarioChange}
                  onClick={() => onFaultScenarioChange?.(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="lab-panel-explanation-card">
              <strong>
                {faultScenario === "none"
                  ? "Normal Operation"
                  : faultScenario === "overload"
                    ? "Overload Trip"
                    : faultScenario === "mcb-off"
                      ? "MCB Open Fault"
                      : faultScenario === "start-fail"
                        ? "START Button Failure"
                        : "Holding Contact Failure"}
              </strong>
              <p className="lab-panel-copy">{faultScenarioHint}</p>
            </div>
          </details>

          <details className="lab-panel-section is-collapsible" open>
            <summary className="lab-panel-summary">
              <span className="lab-panel-label">Why This Happened</span>
            </summary>
            <div className="lab-panel-explanation-card">
              <strong>{explanationTitle}</strong>
              <p className="lab-panel-copy">{flowDescription}</p>
            </div>
            <div className="lab-panel-metrics">
              <div className="lab-panel-metric">
                <span>Active Component</span>
                <strong>{activeComponentName}</strong>
              </div>
              <div className="lab-panel-metric">
                <span>Component Role</span>
                <strong>{activeComponentFunction}</strong>
              </div>
            </div>
            <p className="lab-panel-copy">{currentPathText}</p>
          </details>

          <details className="lab-panel-section is-collapsible" open>
            <summary className="lab-panel-summary">
              <span className="lab-panel-label">Component Learning</span>
            </summary>
            <div className="lab-panel-help-grid">
              {componentHelpOptions.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`lab-panel-help-chip ${componentFocusKey === item.key ? "is-active" : ""}`}
                  disabled={!onComponentFocus}
                  onClick={() => onComponentFocus?.(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="lab-panel-explanation-card">
              <strong>{componentFocusTitle}</strong>
              <p className="lab-panel-copy">{componentFocusBody}</p>
            </div>
          </details>

          <details className="lab-panel-section is-collapsible" open>
            <summary className="lab-panel-summary">
              <span className="lab-panel-label">Event Timeline</span>
            </summary>
            <div className="lab-panel-replay-bar">
              <p className="lab-panel-copy lab-panel-copy-muted">
                {replaySummary}
              </p>
              <div className="lab-panel-replay-actions">
                <button
                  type="button"
                  className="lab-panel-nav-button"
                  onClick={onReplayPrev}
                  disabled={!canReplayPrev || !onReplayPrev}
                >
                  Prev
                </button>
                <button
                  type="button"
                  className="lab-panel-nav-button is-next"
                  onClick={onReplayToggle}
                  disabled={!onReplayToggle}
                >
                  {replayState === "playing" ? "Pause" : "Play"}
                </button>
                <button
                  type="button"
                  className="lab-panel-nav-button"
                  onClick={onReplayNext}
                  disabled={!canReplayNext || !onReplayNext}
                >
                  Next
                </button>
                <button
                  type="button"
                  className="lab-panel-nav-button"
                  onClick={onReplayReset}
                  disabled={!onReplayReset}
                >
                  Reset
                </button>
              </div>
            </div>
            <div className="lab-panel-timeline">
              {eventTimeline.length === 0 ? (
                <div className="lab-panel-explanation-card">
                  <strong>No events yet</strong>
                  <p className="lab-panel-copy">
                    Operate the starter or run a training lesson to populate the
                    timeline.
                  </p>
                </div>
              ) : (
                eventTimeline.map((event) => (
                  <div
                    key={event.id}
                    className={`lab-panel-timeline-item ${replayEventId === event.id ? "is-active" : ""}`}
                  >
                    <div
                      className="lab-panel-timeline-dot"
                      aria-hidden="true"
                    />
                    <div className="lab-panel-timeline-copy">
                      <div className="lab-panel-timeline-row">
                        <strong>{event.title}</strong>
                        <span>{event.time}</span>
                      </div>
                      <p className="lab-panel-copy">{event.detail}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </details>
        </>
      ) : null}
    </aside>
  );
}
