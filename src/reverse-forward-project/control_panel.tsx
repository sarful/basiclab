"use client";

type DirectionState = "idle" | "forward" | "reverse";
type TrainingMode = "free" | "guided";
type FaultScenario = "none" | "overload" | "mcb-off" | "forward-fail" | "reverse-fail";

type ReverseForwardControlPanelProps = {
  onMcbToggle?: () => void;
  onForwardStart?: () => void;
  onReverseStart?: () => void;
  onStop?: () => void;
  onReset?: () => void;
  onFault?: () => void;
  onRpmChange?: (value: number) => void;
  onHorsepowerChange?: (value: number) => void;
  onCurrentLimitChange?: (value: number) => void;
  onLoadChange?: (value: number) => void;
  mcbOn?: boolean;
  motorRunning?: boolean;
  direction?: DirectionState;
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
  ratedCurrent?: number;
  currentBand?: string;
  currentMargin?: number;
  currentLearningNote?: string;
  tripReason?: string;
  trainingMode?: TrainingMode;
  onTrainingModeChange?: (mode: TrainingMode) => void;
  lessonStep?: number;
  lessonTotal?: number;
  lessonTitle?: string;
  lessonInstruction?: string;
  lessonComplete?: boolean;
  lessonResultText?: string;
  lessonWhyText?: string;
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
  faultScenario?: FaultScenario;
  faultScenarioOptions?: Array<{
    key: FaultScenario;
    label: string;
  }>;
  onFaultScenarioChange?: (scenario: FaultScenario) => void;
  faultScenarioHint?: string;
  eventTimeline?: Array<{ id: number; time: string; title: string; detail: string }>;
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

function getDirectionLabel(direction: DirectionState, motorRunning: boolean) {
  if (!motorRunning || direction === "idle") return "Idle";
  return direction === "forward" ? "Forward" : "Reverse";
}

function getScenarioTitle(faultScenario: FaultScenario) {
  if (faultScenario === "overload") return "Overload Trip";
  if (faultScenario === "mcb-off") return "MCB Open Fault";
  if (faultScenario === "forward-fail") return "Forward Start Failure";
  if (faultScenario === "reverse-fail") return "Reverse Start Failure";
  return "Normal Operation";
}

export default function ReverseForwardControlPanel({
  onMcbToggle,
  onForwardStart,
  onReverseStart,
  onStop,
  onReset,
  onFault,
  onRpmChange,
  onHorsepowerChange,
  onCurrentLimitChange,
  onLoadChange,
  mcbOn = false,
  motorRunning = false,
  direction = "idle",
  overloadTripped = false,
  modeLabel = "Idle",
  flowStateLabel = "Ready",
  flowDescription = "Reverse-forward starter panel scaffold is ready for interactive logic.",
  motorRpm = 1440,
  motorHorsepower = 5,
  currentLimit = 12,
  loadPercent = 45,
  motorCurrent = 0,
  motorSpeed = 0,
  ratedCurrent = 0,
  currentBand = "Safe",
  currentMargin = 0,
  currentLearningNote = "Current learning note is not available yet.",
  tripReason = "No active trip.",
  trainingMode = "free",
  onTrainingModeChange,
  lessonStep = 1,
  lessonTotal = 1,
  lessonTitle = "Free Simulation",
  lessonInstruction = "Operate the forward and reverse controls manually and observe the response.",
  lessonComplete = false,
  lessonResultText = "Awaiting lesson completion.",
  lessonWhyText = "This step builds the next control action in sequence.",
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
  faultScenarioHint = "Select a preset fault to observe how the forward/reverse circuit responds.",
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
}: ReverseForwardControlPanelProps) {
  const directionLabel = getDirectionLabel(direction, motorRunning);

  if (compact) {
    return (
      <aside className={`lab-panel is-compact ${className}`}>
        <div className="lab-panel-compact-strip">
          <div className="lab-panel-compact-tile">
            <span>Supply</span>
            <strong className={mcbOn ? "is-on" : "is-off"}>{mcbOn ? "ON" : "OFF"}</strong>
          </div>
          <div className="lab-panel-compact-tile">
            <span>Motor</span>
            <strong className={motorRunning ? "is-on" : "is-off"}>
              {motorRunning ? "RUN" : "STOP"}
            </strong>
          </div>
          <div className="lab-panel-compact-tile">
            <span>Direction</span>
            <strong>{directionLabel}</strong>
          </div>
          <div className="lab-panel-compact-tile">
            <span>Fault</span>
            <strong className={overloadTripped ? "is-fault" : "is-healthy"}>
              {overloadTripped ? "TRIP" : "OK"}
            </strong>
          </div>
          <div className="lab-panel-compact-tile">
            <span>Load</span>
            <strong>{loadPercent}%</strong>
          </div>
          <div className="lab-panel-compact-tile">
            <span>Current</span>
            <strong>{motorCurrent.toFixed(1)} A</strong>
          </div>
          <div className="lab-panel-compact-tile">
            <span>Speed</span>
            <strong>{Math.round(motorSpeed)} RPM</strong>
          </div>
          <div className="lab-panel-compact-tile">
            <span>Limit</span>
            <strong>{currentLimit} A</strong>
          </div>
        </div>

        <div className="lab-panel-compact-footer">
          <div className="lab-panel-compact-footer-main">
            <div className="lab-panel-pills">
              <span className={`control-panel-pill ${mcbOn ? "is-running" : "is-muted"}`}>
                SUPPLY
              </span>
              <span
                className={`control-panel-pill ${direction === "forward" ? "is-running" : "is-muted"}`}
              >
                FWD
              </span>
              <span
                className={`control-panel-pill ${direction === "reverse" ? "is-running" : "is-muted"}`}
              >
                REV
              </span>
            </div>

            <label className="lab-panel-slider-wrap is-compact-strip">
              <span>Load {loadPercent}%</span>
              <input
                type="range"
                min="0"
                max="150"
                step="1"
                value={loadPercent}
                onChange={(event) => onLoadChange?.(Number(event.target.value))}
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
            onClick={() => onTrainingModeChange?.("free")}
          >
            Free Simulation
          </button>
          <button
            type="button"
            className={`lab-panel-mode-button ${trainingMode === "guided" ? "is-active" : ""}`}
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
          <div className="lab-panel-explanation-card">
            <strong>Result</strong>
            <p className="lab-panel-copy">{lessonResultText}</p>
          </div>
          <div className="lab-panel-explanation-card">
            <strong>Why</strong>
            <p className="lab-panel-copy">{lessonWhyText}</p>
          </div>
          <div className="lab-panel-lesson-actions">
            <button
              type="button"
              className="lab-panel-nav-button"
              onClick={onLessonPrev}
              disabled={!canLessonPrev}
            >
              Previous
            </button>
            <button
              type="button"
              className="lab-panel-nav-button is-next"
              onClick={onLessonNext}
              disabled={!canLessonNext}
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
            <strong className={mcbOn ? "is-on" : "is-off"}>{mcbOn ? "ON" : "OFF"}</strong>
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
          <span className={`control-panel-pill ${mcbOn ? "is-running" : "is-muted"}`}>
            SUPPLY
          </span>
          <span
            className={`control-panel-pill ${direction === "forward" ? "is-running" : "is-muted"}`}
          >
            FORWARD
          </span>
          <span
            className={`control-panel-pill ${direction === "reverse" ? "is-running" : "is-muted"}`}
          >
            REVERSE
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
              <div key={badge.key} className={`lab-panel-state-badge is-${badge.tone}`}>
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
            <button type="button" className="lab-panel-button is-mcb" onClick={onMcbToggle}>
              {mcbOn ? "MCB OFF" : "MCB ON"}
            </button>
            <button type="button" className="lab-panel-button is-start" onClick={onForwardStart}>
              START FWD
            </button>
            <button type="button" className="lab-panel-button is-start" onClick={onReverseStart}>
              START REV
            </button>
            <button type="button" className="lab-panel-button is-stop" onClick={onStop}>
              STOP
            </button>
            <button type="button" className="lab-panel-button is-reset" onClick={onReset}>
              RESET
            </button>
            <button type="button" className="lab-panel-button is-fault" onClick={onFault}>
              FAULT
            </button>
          </div>
          <p className="lab-panel-copy lab-panel-copy-muted">{flowStateLabel}</p>
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
              value={motorRpm}
              onChange={(event) => onRpmChange?.(Number(event.target.value) || 0)}
            />
          </label>
          <label className="lab-panel-field">
            <span>Horsepower</span>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={motorHorsepower}
              onChange={(event) => onHorsepowerChange?.(Number(event.target.value) || 0)}
            />
          </label>
          <label className="lab-panel-field">
            <span>Current Limit (A)</span>
            <input
              type="number"
              min="1"
              step="0.5"
              value={currentLimit}
              onChange={(event) => onCurrentLimitChange?.(Number(event.target.value) || 0)}
            />
          </label>
        </div>
      </details>

      <details className="lab-panel-section is-collapsible" open>
        <summary className="lab-panel-summary">
          <span className="lab-panel-label">Load & Output</span>
        </summary>
        <label className="lab-panel-slider-wrap">
          <span>Load {loadPercent}%</span>
          <input
            type="range"
            min="0"
            max="150"
            step="1"
            value={loadPercent}
            onChange={(event) => onLoadChange?.(Number(event.target.value))}
          />
        </label>
        <div className="lab-panel-metrics">
          <div className="lab-panel-metric">
            <span>Direction</span>
            <strong>{directionLabel}</strong>
          </div>
          <div className="lab-panel-metric">
            <span>Rated Current</span>
            <strong>{ratedCurrent.toFixed(1)} A</strong>
          </div>
          <div className="lab-panel-metric">
            <span>Current Draw</span>
            <strong>{motorCurrent.toFixed(1)} A</strong>
          </div>
          <div className="lab-panel-metric">
            <span>Speed</span>
            <strong>{Math.round(motorSpeed)} RPM</strong>
          </div>
          <div className="lab-panel-metric">
            <span>Current Band</span>
            <strong>{currentBand}</strong>
          </div>
          <div className="lab-panel-metric">
            <span>Margin to Trip</span>
            <strong>{currentMargin.toFixed(1)} A</strong>
          </div>
          <div className="lab-panel-metric">
            <span>Trip Reason</span>
            <strong>{tripReason}</strong>
          </div>
        </div>
        <p className="lab-panel-copy">{modeLabel}</p>
        <p className="lab-panel-copy">{flowDescription}</p>
        <p className="lab-panel-copy lab-panel-copy-muted">{currentLearningNote}</p>
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
                  onClick={() => onFaultScenarioChange?.(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="lab-panel-explanation-card">
              <strong>{getScenarioTitle(faultScenario)}</strong>
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
              <p className="lab-panel-copy lab-panel-copy-muted">{replaySummary}</p>
              <div className="lab-panel-replay-actions">
                <button
                  type="button"
                  className="lab-panel-nav-button"
                  onClick={onReplayPrev}
                  disabled={!canReplayPrev}
                >
                  Prev
                </button>
                <button type="button" className="lab-panel-nav-button is-next" onClick={onReplayToggle}>
                  {replayState === "playing" ? "Pause" : "Play"}
                </button>
                <button
                  type="button"
                  className="lab-panel-nav-button"
                  onClick={onReplayNext}
                  disabled={!canReplayNext}
                >
                  Next
                </button>
                <button type="button" className="lab-panel-nav-button" onClick={onReplayReset}>
                  Reset
                </button>
              </div>
            </div>
            <div className="lab-panel-timeline">
              {eventTimeline.length === 0 ? (
                <div className="lab-panel-explanation-card">
                  <strong>No events yet</strong>
                  <p className="lab-panel-copy">
                    Operate the starter or run a training lesson to populate the timeline.
                  </p>
                </div>
              ) : (
                eventTimeline.map((event) => (
                  <div
                    key={event.id}
                    className={`lab-panel-timeline-item ${replayEventId === event.id ? "is-active" : ""}`}
                  >
                    <div className="lab-panel-timeline-dot" aria-hidden="true" />
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
