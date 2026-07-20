"use client";

export type ControlPanalForSterDeltaWithTimerProps = {
  mcbOn?: boolean;
  motorRunning?: boolean;
  overloadTripped?: boolean;
  mainOn?: boolean;
  timerOn?: boolean;
  starOn?: boolean;
  deltaOn?: boolean;
  transferOpen?: boolean;

  modeLabel?: string;
  flowStateLabel?: string;
  flowDescription?: string;
  tripReason?: string;

  motorRpm?: number;
  motorHorsepower?: number;
  currentLimit?: number;
  timerDelayMs?: number;
  loadPercent?: number;
  motorCurrent?: number;
  motorSpeed?: number;

  onRpmChange?: (value: number) => void;
  onHorsepowerChange?: (value: number) => void;
  onCurrentLimitChange?: (value: number) => void;
  onTimerDelayChange?: (value: number) => void;
  onLoadChange?: (value: number) => void;

  onMcbToggle?: () => void;
  onStart?: () => void;
  onStop?: () => void;
  onReset?: () => void;
  onFault?: () => void;

  className?: string;
  compact?: boolean;
  showControlsSection?: boolean;
};

function safeNumber(value: number | undefined, fallback = 0) {
  return Number.isFinite(value) ? Number(value) : fallback;
}

function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function formatSeconds(ms: number) {
  return `${(ms / 1000).toFixed(1)} s`;
}

export default function ControlPanalForSterDeltaWithTimer({
  mcbOn = true,
  motorRunning = false,
  overloadTripped = false,
  mainOn = false,
  timerOn = false,
  starOn = false,
  deltaOn = false,
  transferOpen = false,

  modeLabel = "Idle",
  flowStateLabel = "Idle",
  flowDescription = "Starter is ready.",
  tripReason = "No active trip.",

  motorRpm = 1440,
  motorHorsepower = 5,
  currentLimit = 12,
  timerDelayMs = 3000,
  loadPercent = 45,
  motorCurrent = 0,
  motorSpeed = 0,

  onRpmChange,
  onHorsepowerChange,
  onCurrentLimitChange,
  onTimerDelayChange,
  onLoadChange,

  onMcbToggle,
  onStart,
  onStop,
  onReset,
  onFault,

  className = "",
  compact = false,
  showControlsSection = true,
}: ControlPanalForSterDeltaWithTimerProps) {
  const safeMotorRpm = clampNumber(safeNumber(motorRpm, 1440), 300, 100000);
  const safeHorsepower = clampNumber(safeNumber(motorHorsepower, 5), 0.5, 500);
  const safeCurrentLimit = clampNumber(
    safeNumber(currentLimit, 12),
    0.1,
    10000,
  );
  const safeTimerDelayMs = clampNumber(
    safeNumber(timerDelayMs, 3000),
    500,
    30000,
  );
  const safeLoadPercent = clampNumber(safeNumber(loadPercent, 45), 0, 150);
  const safeMotorCurrent = safeNumber(motorCurrent, 0);
  const safeMotorSpeed = safeNumber(motorSpeed, 0);

  const sequenceLabel = overloadTripped
    ? "TRIP"
    : transferOpen
      ? "TRANSFER"
      : deltaOn
        ? "DELTA"
        : starOn
          ? "STAR"
          : mainOn
            ? "MAIN"
            : "IDLE";

  const sequenceClass = overloadTripped
    ? "is-tripped"
    : deltaOn || starOn || mainOn
      ? "is-running"
      : "is-muted";

  const canStart =
    Boolean(onStart) &&
    mcbOn &&
    !overloadTripped &&
    !motorRunning &&
    !mainOn &&
    !starOn &&
    !deltaOn &&
    !transferOpen;

  const canStop =
    Boolean(onStop) &&
    mcbOn &&
    (motorRunning || mainOn || timerOn || starOn || deltaOn || transferOpen);

  const canFault = Boolean(onFault) && mcbOn && !overloadTripped;

  const isTransitioning =
    transferOpen || (mainOn && !starOn && !deltaOn && motorRunning);

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
            <span>Sequence</span>
            <strong className={sequenceClass}>{sequenceLabel}</strong>
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
            <span>Timer</span>
            <strong>{formatSeconds(safeTimerDelayMs)}</strong>
          </div>
        </div>

        <div className="lab-panel-compact-footer">
          <div className="lab-panel-compact-footer-main">
            <div className="lab-panel-pills">
              <span
                className={`control-panel-pill ${mainOn ? "is-running" : "is-muted"}`}
              >
                MAIN
              </span>
              <span
                className={`control-panel-pill ${timerOn ? "is-running" : "is-muted"}`}
              >
                TIMER
              </span>
              <span
                className={`control-panel-pill ${starOn ? "is-running" : "is-muted"}`}
              >
                STAR
              </span>
              <span
                className={`control-panel-pill ${deltaOn ? "is-running" : "is-muted"}`}
              >
                DELTA
              </span>
              <span
                className={`control-panel-pill ${transferOpen ? "is-running" : "is-muted"}`}
              >
                TRANSFER
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
            <strong>{overloadTripped ? tripReason : flowDescription}</strong>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`lab-panel ${className}`}>
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
            className={`control-panel-pill ${mainOn ? "is-running" : "is-muted"}`}
          >
            MAIN
          </span>
          <span
            className={`control-panel-pill ${timerOn ? "is-running" : "is-muted"}`}
          >
            TIMER
          </span>
          <span
            className={`control-panel-pill ${starOn ? "is-running" : "is-muted"}`}
          >
            STAR
          </span>
          <span
            className={`control-panel-pill ${deltaOn ? "is-running" : "is-muted"}`}
          >
            DELTA
          </span>
          <span
            className={`control-panel-pill ${transferOpen ? "is-running" : "is-muted"}`}
          >
            TRANSFER
          </span>
        </div>

        <div className="lab-panel-explanation-card">
          <strong>{modeLabel}</strong>
          <p className="lab-panel-copy lab-panel-copy-muted">
            {mcbOn ? "Control supply is live." : "Starter supply is isolated."}
          </p>
          <p className="lab-panel-copy">{flowDescription}</p>
        </div>
      </details>

      {showControlsSection ? (
        <details className="lab-panel-section is-collapsible" open>
          <summary className="lab-panel-summary">
            <span className="lab-panel-label">Controls</span>
          </summary>

          <div className="lab-panel-button-stack">
            <button
              type="button"
              className="lab-panel-button is-mcb"
              disabled={!onMcbToggle}
              onClick={onMcbToggle}
            >
              {mcbOn ? "MCB OFF" : "MCB ON"}
            </button>

            <button
              type="button"
              className="lab-panel-button is-start"
              disabled={!canStart}
              onClick={onStart}
            >
              START
            </button>

            <button
              type="button"
              className="lab-panel-button is-stop"
              disabled={!canStop}
              onClick={onStop}
            >
              STOP
            </button>

            <button
              type="button"
              className="lab-panel-button is-reset"
              disabled={!onReset}
              onClick={onReset}
            >
              RESET
            </button>

            <button
              type="button"
              className="lab-panel-button is-fault"
              disabled={!canFault}
              onClick={onFault}
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
          <span className="lab-panel-label">Star-Delta Sequence</span>
        </summary>

        <div className="lab-panel-status-grid">
          <div className="lab-panel-status-box">
            <span className="lab-panel-status-name">Main K1</span>
            <strong className={mainOn ? "is-on" : "is-off"}>
              {mainOn ? "ON" : "OFF"}
            </strong>
          </div>

          <div className="lab-panel-status-box">
            <span className="lab-panel-status-name">Timer T1</span>
            <strong className={timerOn ? "is-on" : "is-off"}>
              {timerOn ? "ON" : "OFF"}
            </strong>
          </div>

          <div className="lab-panel-status-box">
            <span className="lab-panel-status-name">Stage</span>
            <strong className={sequenceClass}>{sequenceLabel}</strong>
          </div>
        </div>

        <div className="lab-panel-metrics">
          <div className="lab-panel-metric">
            <span>Star K3</span>
            <strong className={starOn ? "is-on" : "is-off"}>
              {starOn ? "Closed" : "Open"}
            </strong>
          </div>

          <div className="lab-panel-metric">
            <span>Delta K2</span>
            <strong className={deltaOn ? "is-on" : "is-off"}>
              {deltaOn ? "Closed" : "Open"}
            </strong>
          </div>

          <div className="lab-panel-metric">
            <span>Transfer Gap</span>
            <strong className={isTransitioning ? "is-on" : "is-off"}>
              {isTransitioning ? "Active" : "Idle"}
            </strong>
          </div>
        </div>

        <div className="lab-panel-explanation-card">
          <strong>Sequence logic</strong>
          <p className="lab-panel-copy">
            START energizes K1 and T1. K3 runs the motor in Star first. After
            the timer, K3 opens, the transfer gap clears, and K2 closes for
            Delta running.
          </p>
        </div>
      </details>

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
              value={safeHorsepower}
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

        <label className="lab-panel-slider-wrap">
          <span>Star to Delta Timer {formatSeconds(safeTimerDelayMs)}</span>
          <input
            type="range"
            min="500"
            max="30000"
            step="100"
            value={safeTimerDelayMs}
            disabled={!onTimerDelayChange}
            onChange={(event) =>
              onTimerDelayChange?.(
                clampNumber(Number(event.target.value), 500, 30000),
              )
            }
          />
        </label>

        <p className="lab-panel-copy lab-panel-copy-muted">{flowStateLabel}</p>
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
            <span>Timer Setting</span>
            <strong>{formatSeconds(safeTimerDelayMs)}</strong>
          </div>
        </div>

        <p className="lab-panel-copy">{modeLabel}</p>
        <p className="lab-panel-copy lab-panel-copy-muted">{flowDescription}</p>

        <div
          className={`lab-panel-current-learning ${overloadTripped ? "is-trip" : "is-safe"}`}
        >
          <div className="lab-panel-current-learning-head">
            <strong>Protection Status</strong>
            <span
              className={`lab-panel-current-band ${overloadTripped ? "is-trip" : "is-safe"}`}
            >
              {overloadTripped ? "Trip" : "Healthy"}
            </span>
          </div>

          <p className="lab-panel-copy">{tripReason}</p>
        </div>
      </details>
    </aside>
  );
}
