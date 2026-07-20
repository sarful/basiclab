"use client";

import { useEffect, useRef, useState } from "react";
import {
  STAR_DELTA_IDLE_STATE,
  resolveCurrent,
  resolveDeltaPickupState,
  resolveElectricalMode,
  resolveFaultState,
  resolveFlowDescription,
  resolveFlowStateLabel,
  resolveMcbToggleState,
  resolveModeLabel,
  resolveMotorSpeed,
  resolveStartState,
  resolveStoppedState,
  resolveTransferState,
  resolveTripReasonText,
  resolveTrippedState,
} from "../../packages/core/src/star-delta";
import type {
  ElectricalMode,
  StarDeltaControlState,
} from "../../packages/types/src";

import ProjectWorkspaceTemplate from "../../Project/library/templates/ProjectWorkspaceTemplate";
import ControlPanalForSterDeltaWithTimer from "./controlpanalforsterdeltawithtimer";
import StarDeltaControlDiagramWithTimer from "./star_delta_control_diagram_withtimer";
import StarDeltaPowerDiagramWithTimer from "./star_delta_power_diagram_withtimer";

const TRANSFER_GAP_MS = 350;
const START_BUTTON_PULSE_MS = 220;
const STOP_BUTTON_PULSE_MS = 220;

function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function PlaceholderCanvas({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="project-workspace-logic-copy">
      <p>
        <strong>{title}</strong>
      </p>
      <p>{copy}</p>
    </div>
  );
}

export default function StarDeltaWithTimerWorkspace() {
  const [controlState, setControlState] = useState<StarDeltaControlState>(
    STAR_DELTA_IDLE_STATE,
  );

  const [motorRpm, setMotorRpm] = useState(1440);
  const [motorHorsepower, setMotorHorsepower] = useState(5);
  const [currentLimit, setCurrentLimit] = useState(12);
  const [loadPercent, setLoadPercent] = useState(45);
  const [timerDelayMs, setTimerDelayMs] = useState(2500);

  const [startPressed, setStartPressed] = useState(false);
  const [stopPressed, setStopPressed] = useState(false);

  const starDeltaTimerRef = useRef<number | null>(null);
  const changeoverTimerRef = useRef<number | null>(null);
  const startPressRef = useRef<number | null>(null);
  const stopPressRef = useRef<number | null>(null);

  const {
    mcbOn,
    motorRunning,
    overloadTripped,
    mainOn,
    timerOn,
    starOn,
    deltaOn,
    transferOpen,
  } = controlState;

  const clearTransferTimer = () => {
    if (starDeltaTimerRef.current !== null) {
      window.clearTimeout(starDeltaTimerRef.current);
      starDeltaTimerRef.current = null;
    }

    if (changeoverTimerRef.current !== null) {
      window.clearTimeout(changeoverTimerRef.current);
      changeoverTimerRef.current = null;
    }
  };

  const clearButtonPulseTimers = () => {
    if (startPressRef.current !== null) {
      window.clearTimeout(startPressRef.current);
      startPressRef.current = null;
    }

    if (stopPressRef.current !== null) {
      window.clearTimeout(stopPressRef.current);
      stopPressRef.current = null;
    }
  };

  const pulseStartButton = () => {
    setStartPressed(true);

    if (startPressRef.current !== null) {
      window.clearTimeout(startPressRef.current);
    }

    startPressRef.current = window.setTimeout(() => {
      setStartPressed(false);
      startPressRef.current = null;
    }, START_BUTTON_PULSE_MS);
  };

  const pulseStopButton = () => {
    setStopPressed(true);

    if (stopPressRef.current !== null) {
      window.clearTimeout(stopPressRef.current);
    }

    stopPressRef.current = window.setTimeout(() => {
      setStopPressed(false);
      stopPressRef.current = null;
    }, STOP_BUTTON_PULSE_MS);
  };

  const electricalMode: ElectricalMode = resolveElectricalMode({
    motorRunning,
    transferOpen,
    deltaOn,
    starOn,
  });

  const motorCurrent = resolveCurrent(
    motorHorsepower,
    loadPercent,
    motorRunning,
    electricalMode,
  );

  const motorSpeed = resolveMotorSpeed(
    motorRpm,
    loadPercent,
    motorRunning,
    electricalMode,
  );

  const tripSystem = () => {
    clearTransferTimer();
    setControlState((current) => resolveTrippedState(current));
  };

  const checkForOverload = (
    horsepower: number,
    load: number,
    limit: number,
    running: boolean,
    mode: ElectricalMode = electricalMode,
    supplyOn = mcbOn,
  ) => {
    if (!running || !supplyOn) return false;

    return resolveCurrent(horsepower, load, true, mode) > limit;
  };

  const canStart =
    mcbOn &&
    !overloadTripped &&
    !motorRunning &&
    !mainOn &&
    !timerOn &&
    !starOn &&
    !deltaOn &&
    !transferOpen;

  const canStop =
    mcbOn &&
    (motorRunning || mainOn || timerOn || starOn || deltaOn || transferOpen);

  const canFault = mcbOn && !overloadTripped;

  const handleStart = () => {
    pulseStartButton();

    if (!canStart) return;

    const starStartWouldTrip = checkForOverload(
      motorHorsepower,
      loadPercent,
      currentLimit,
      true,
      "star",
      mcbOn,
    );

    if (starStartWouldTrip) {
      tripSystem();
      return;
    }

    clearTransferTimer();

    setControlState((current) => resolveStartState(current));

    starDeltaTimerRef.current = window.setTimeout(() => {
      setControlState((current) => resolveTransferState(current));
      starDeltaTimerRef.current = null;

      changeoverTimerRef.current = window.setTimeout(() => {
        const deltaCurrent = resolveCurrent(
          motorHorsepower,
          loadPercent,
          true,
          "delta",
        );

        if (deltaCurrent > currentLimit) {
          setControlState((current) => resolveTrippedState(current));
          changeoverTimerRef.current = null;
          return;
        }

        setControlState((current) => resolveDeltaPickupState(current));
        changeoverTimerRef.current = null;
      }, TRANSFER_GAP_MS);
    }, timerDelayMs);
  };

  const handleStop = () => {
    pulseStopButton();
    clearTransferTimer();

    setControlState((current) => resolveStoppedState(current));
  };

  const handleReset = () => {
    clearTransferTimer();
    clearButtonPulseTimers();

    setStartPressed(false);
    setStopPressed(false);

    setControlState((current) => ({
      ...STAR_DELTA_IDLE_STATE,
      mcbOn: current.mcbOn,
    }));
  };

  const handleFault = () => {
    if (!canFault) return;

    clearTransferTimer();
    setControlState((current) => resolveFaultState(current));
  };

  const handleMcbToggle = () => {
    clearTransferTimer();
    clearButtonPulseTimers();

    setStartPressed(false);
    setStopPressed(false);

    setControlState((current) => resolveMcbToggleState(current));
  };

  const handleRpmChange = (value: number) => {
    const nextValue = clampNumber(value, 300, 100000);
    setMotorRpm(nextValue);

    if (
      checkForOverload(
        motorHorsepower,
        loadPercent,
        currentLimit,
        motorRunning,
        electricalMode,
      )
    ) {
      tripSystem();
    }
  };

  const handleHorsepowerChange = (value: number) => {
    const nextValue = clampNumber(value, 0.5, 500);
    setMotorHorsepower(nextValue);

    if (
      checkForOverload(
        nextValue,
        loadPercent,
        currentLimit,
        motorRunning,
        electricalMode,
      )
    ) {
      tripSystem();
    }
  };

  const handleCurrentLimitChange = (value: number) => {
    const nextValue = clampNumber(value, 0.1, 10000);
    setCurrentLimit(nextValue);

    if (
      checkForOverload(
        motorHorsepower,
        loadPercent,
        nextValue,
        motorRunning,
        electricalMode,
      )
    ) {
      tripSystem();
    }
  };

  const handleLoadChange = (value: number) => {
    const nextValue = clampNumber(value, 0, 150);
    setLoadPercent(nextValue);

    if (
      checkForOverload(
        motorHorsepower,
        nextValue,
        currentLimit,
        motorRunning,
        electricalMode,
      )
    ) {
      tripSystem();
    }
  };

  const handleTimerDelayChange = (value: number) => {
    const nextValue = clampNumber(value, 500, 30000);
    setTimerDelayMs(nextValue);

    if (motorRunning || mainOn || timerOn || starOn || transferOpen) {
      clearTransferTimer();
      setControlState((current) => resolveStoppedState(current));
    }
  };

  useEffect(() => {
    return () => {
      clearTransferTimer();
      clearButtonPulseTimers();
    };
  }, []);

  const modeLabel = resolveModeLabel({
    mcbOn,
    overloadTripped,
    transferOpen,
    deltaOn,
    starOn,
    mainOn,
  });

  const flowStateLabel = resolveFlowStateLabel({
    mcbOn,
    overloadTripped,
    transferOpen,
    deltaOn,
    starOn,
    timerOn,
    mainOn,
  });

  const flowDescription = resolveFlowDescription({
    mcbOn,
    overloadTripped,
    transferOpen,
    deltaOn,
    starOn,
    timerOn,
    mainOn,
  });

  const tripReason = resolveTripReasonText(
    overloadTripped,
    motorCurrent,
    currentLimit,
  );

  const sharedPanel = (
    <ControlPanalForSterDeltaWithTimer
      mcbOn={mcbOn}
      motorRunning={motorRunning}
      overloadTripped={overloadTripped}
      mainOn={mainOn}
      timerOn={timerOn}
      starOn={starOn}
      deltaOn={deltaOn}
      transferOpen={transferOpen}
      modeLabel={modeLabel}
      flowStateLabel={flowStateLabel}
      flowDescription={flowDescription}
      tripReason={tripReason}
      motorRpm={motorRpm}
      motorHorsepower={motorHorsepower}
      currentLimit={currentLimit}
      timerDelayMs={timerDelayMs}
      loadPercent={loadPercent}
      motorCurrent={motorCurrent}
      motorSpeed={motorSpeed}
      onRpmChange={handleRpmChange}
      onHorsepowerChange={handleHorsepowerChange}
      onCurrentLimitChange={handleCurrentLimitChange}
      onTimerDelayChange={handleTimerDelayChange}
      onLoadChange={handleLoadChange}
      onMcbToggle={handleMcbToggle}
      onStart={handleStart}
      onStop={handleStop}
      onReset={handleReset}
      onFault={handleFault}
    />
  );

  const compactDualPanel = (
    <ControlPanalForSterDeltaWithTimer
      compact
      mcbOn={mcbOn}
      motorRunning={motorRunning}
      overloadTripped={overloadTripped}
      mainOn={mainOn}
      timerOn={timerOn}
      starOn={starOn}
      deltaOn={deltaOn}
      transferOpen={transferOpen}
      modeLabel={modeLabel}
      flowStateLabel={flowStateLabel}
      flowDescription={flowDescription}
      tripReason={tripReason}
      motorRpm={motorRpm}
      motorHorsepower={motorHorsepower}
      currentLimit={currentLimit}
      timerDelayMs={timerDelayMs}
      loadPercent={loadPercent}
      motorCurrent={motorCurrent}
      motorSpeed={motorSpeed}
      onRpmChange={handleRpmChange}
      onHorsepowerChange={handleHorsepowerChange}
      onCurrentLimitChange={handleCurrentLimitChange}
      onTimerDelayChange={handleTimerDelayChange}
      onLoadChange={handleLoadChange}
      onMcbToggle={handleMcbToggle}
      onStart={handleStart}
      onStop={handleStop}
      onReset={handleReset}
      onFault={handleFault}
    />
  );

  const headerActions = (
    <div className="workspace-quickbar">
      <div className="workspace-quickbar-status">
        <span
          className={`workspace-status-pill ${mcbOn ? "is-live" : "is-idle"}`}
        >
          Supply {mcbOn ? "ON" : "OFF"}
        </span>

        <span
          className={`workspace-status-pill ${motorRunning ? "is-live" : "is-idle"}`}
        >
          Motor {motorRunning ? "RUN" : "STOP"}
        </span>

        <span
          className={`workspace-status-pill ${overloadTripped ? "is-trip" : "is-idle"}`}
        >
          Trip {overloadTripped ? "ACTIVE" : "OK"}
        </span>

        <span
          className={`workspace-status-pill ${
            deltaOn || starOn || transferOpen || mainOn ? "is-live" : "is-idle"
          }`}
        >
          {flowStateLabel}
        </span>
      </div>

      <div className="workspace-quickbar-actions">
        <button
          type="button"
          className="workspace-quickbar-button is-mcb"
          onClick={handleMcbToggle}
        >
          {mcbOn ? "MCB OFF" : "MCB ON"}
        </button>

        <button
          type="button"
          className="workspace-quickbar-button is-start"
          disabled={!canStart}
          onClick={handleStart}
        >
          Start
        </button>

        <button
          type="button"
          className="workspace-quickbar-button is-stop"
          disabled={!canStop}
          onClick={handleStop}
        >
          Stop
        </button>

        <button
          type="button"
          className="workspace-quickbar-button is-reset"
          onClick={handleReset}
        >
          Reset
        </button>

        <button
          type="button"
          className="workspace-quickbar-button is-fault"
          disabled={!canFault}
          onClick={handleFault}
        >
          Fault
        </button>
      </div>
    </div>
  );

  const diagramTools = (
    <div className="workspace-stage-tools">
      <button type="button" className="workspace-stage-tool is-active">
        Fit
      </button>
      <button type="button" className="workspace-stage-tool" disabled>
        100%
      </button>
      <button type="button" className="workspace-stage-tool is-active" disabled>
        Labels
      </button>
      <button type="button" className="workspace-stage-tool is-active" disabled>
        Flow
      </button>
    </div>
  );

  return (
    <ProjectWorkspaceTemplate
      badge="STAR DELTA"
      title="Star Delta With Timer Workspace"
      initialTabKey="control"
      headerActions={headerActions}
      tabs={[
        {
          key: "logic",
          label: "Logic & Theory",
          canvasTitle: "Logic & Theory",
          fullWidth: true,
          canvasContent: (
            <PlaceholderCanvas
              title="Star-delta starter learning area"
              copy="This tab can be used later for operation theory, sequence explanation, timer logic, and interlocking notes."
            />
          ),
        },
        {
          key: "power",
          label: "Power CKT",
          panelTitle: "Power CKT",
          canvasTitle: "Power CKT Canvas",
          layout: "stacked",
          canvasToolbar: diagramTools,
          panelContent: sharedPanel,
          canvasContent: (
            <StarDeltaPowerDiagramWithTimer
              className="project-workspace-power-embed"
              mcbOn={mcbOn}
              overloadTripped={overloadTripped}
              mainOn={mainOn}
              starOn={starOn}
              deltaOn={deltaOn}
              transferOpen={transferOpen}
              loadPercent={loadPercent}
            />
          ),
        },
        {
          key: "control",
          label: "Control CKT",
          panelTitle: "Control Panel",
          canvasTitle: "Control Circuit Canvas",
          layout: "stacked",
          canvasToolbar: diagramTools,
          panelContent: sharedPanel,
          canvasContent: (
            <StarDeltaControlDiagramWithTimer
              className="project-workspace-control-embed"
              mcbOn={mcbOn}
              overloadTripped={overloadTripped}
              mainOn={mainOn}
              timerOn={timerOn}
              starOn={starOn}
              deltaOn={deltaOn}
              transferOpen={transferOpen}
              flowStateLabel={flowStateLabel}
              startPressed={startPressed}
              stopPressed={stopPressed}
            />
          ),
        },
        {
          key: "power-control",
          label: "Power + Control CKT",
          panelTitle: "Control Panel",
          canvasTitle: "Power CKT Canvas",
          secondaryCanvasTitle: "Control CKT Canvas",
          layout: "dual-stacked",
          canvasToolbar: diagramTools,
          secondaryCanvasToolbar: diagramTools,
          panelContent: compactDualPanel,
          canvasContent: (
            <StarDeltaPowerDiagramWithTimer
              className="project-workspace-power-embed"
              mcbOn={mcbOn}
              overloadTripped={overloadTripped}
              mainOn={mainOn}
              starOn={starOn}
              deltaOn={deltaOn}
              transferOpen={transferOpen}
              loadPercent={loadPercent}
            />
          ),
          secondaryCanvasContent: (
            <StarDeltaControlDiagramWithTimer
              className="project-workspace-control-embed"
              mcbOn={mcbOn}
              overloadTripped={overloadTripped}
              mainOn={mainOn}
              timerOn={timerOn}
              starOn={starOn}
              deltaOn={deltaOn}
              transferOpen={transferOpen}
              flowStateLabel={flowStateLabel}
              startPressed={startPressed}
              stopPressed={stopPressed}
            />
          ),
        },
      ]}
    />
  );
}
