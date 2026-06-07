type ControlPanalForSterDeltaWithTimerProps = {
  mcbOn: boolean;
  motorRunning: boolean;
  overloadTripped: boolean;
  mainOn: boolean;
  timerOn: boolean;
  starOn: boolean;
  deltaOn: boolean;
  modeLabel: string;
  flowStateLabel: string;
  flowDescription: string;
  tripReason: string;
  motorRpm: number;
  motorHorsepower: number;
  currentLimit: number;
  timerDelayMs: number;
  loadPercent: number;
  motorCurrent: number;
  motorSpeed: number;
  onRpmChange: (value: number) => void;
  onHorsepowerChange: (value: number) => void;
  onCurrentLimitChange: (value: number) => void;
  onTimerDelayChange: (value: number) => void;
  onLoadChange: (value: number) => void;
  onMcbToggle: () => void;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onFault: () => void;
  className?: string;
  compact?: boolean;
};

export default function ControlPanalForSterDeltaWithTimer({
  mcbOn,
  motorRunning,
  overloadTripped,
  mainOn,
  timerOn,
  starOn,
  deltaOn,
  modeLabel,
  flowStateLabel,
  flowDescription,
  tripReason,
  motorRpm,
  motorHorsepower,
  currentLimit,
  timerDelayMs,
  loadPercent,
  motorCurrent,
  motorSpeed,
  onRpmChange,
  onHorsepowerChange,
  onCurrentLimitChange,
  onTimerDelayChange,
  onLoadChange,
  className = "",
  compact = false,
}: ControlPanalForSterDeltaWithTimerProps) {
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
            <span>Timer</span>
            <strong>{(timerDelayMs / 1000).toFixed(1)} s</strong>
          </div>
        </div>

        <div className="lab-panel-compact-footer">
          <div className="lab-panel-pills">
            <span className={`control-panel-pill ${mainOn ? "is-running" : "is-muted"}`}>
              MAIN
            </span>
            <span className={`control-panel-pill ${timerOn ? "is-running" : "is-muted"}`}>
              TIMER
            </span>
            <span className={`control-panel-pill ${starOn ? "is-running" : "is-muted"}`}>
              STAR
            </span>
            <span className={`control-panel-pill ${deltaOn ? "is-running" : "is-muted"}`}>
              DELTA
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
              onChange={(event) => onLoadChange(Number(event.target.value))}
            />
          </label>

          <p className="lab-panel-copy lab-panel-copy-muted">{tripReason}</p>
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
          <span className={`control-panel-pill ${mainOn ? "is-running" : "is-muted"}`}>
            MAIN
          </span>
          <span className={`control-panel-pill ${timerOn ? "is-running" : "is-muted"}`}>
            TIMER
          </span>
          <span className={`control-panel-pill ${starOn ? "is-running" : "is-muted"}`}>
            STAR
          </span>
          <span className={`control-panel-pill ${deltaOn ? "is-running" : "is-muted"}`}>
            DELTA
          </span>
        </div>
        <p className="lab-panel-copy lab-panel-copy-muted">
          {mcbOn ? "Control supply is live." : "Starter supply is isolated."}
        </p>
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
              value={motorRpm}
              onChange={(event) => onRpmChange(Number(event.target.value) || 0)}
            />
          </label>
          <label className="lab-panel-field">
            <span>Horsepower</span>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={motorHorsepower}
              onChange={(event) => onHorsepowerChange(Number(event.target.value) || 0)}
            />
          </label>
          <label className="lab-panel-field">
            <span>Current Limit (A)</span>
            <input
              type="number"
              min="1"
              step="0.5"
              value={currentLimit}
              onChange={(event) => onCurrentLimitChange(Number(event.target.value) || 0)}
            />
          </label>
          <label className="lab-panel-slider-wrap">
            <span>Star to Delta Timer {timerDelayMs / 1000}s</span>
            <input
              type="range"
              min="500"
              max="8000"
              step="100"
              value={timerDelayMs}
              onChange={(event) => onTimerDelayChange(Number(event.target.value))}
            />
          </label>
        </div>
        <p className="lab-panel-copy lab-panel-copy-muted">{flowStateLabel}</p>
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
            onChange={(event) => onLoadChange(Number(event.target.value))}
          />
        </label>
        <div className="lab-panel-metrics">
          <div className="lab-panel-metric">
            <span>Current Draw</span>
            <strong>{motorCurrent.toFixed(1)} A</strong>
          </div>
          <div className="lab-panel-metric">
            <span>Speed</span>
            <strong>{Math.round(motorSpeed)} RPM</strong>
          </div>
        </div>
        <p className="lab-panel-copy">{modeLabel}</p>
        <p className="lab-panel-copy lab-panel-copy-muted">{flowDescription}</p>
        <div className="lab-panel-metric">
          <span>Trip Reason</span>
          <strong>{tripReason}</strong>
        </div>
      </details>
    </aside>
  );
}
