"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import PushButtonNO from "../../Project/library/buttons/PushButtonNO";
import AuxiliaryContactNO from "../../Project/library/contactors/AuxiliaryContactNO";
import ContactorCoil from "../../Project/library/contactors/ContactorCoil";
import ContactorPowerContacts3P from "../../Project/library/contactors/ContactorPowerContacts3P";
import PilotLight from "../../Project/library/indicators/PilotLight";
import ACMotor3P from "../../Project/library/motors/ACMotor3P";
import MCBControl2P from "../../Project/library/protection/MCBControl2P";
import ThermalOverloadNC from "../../Project/library/protection/ThermalOverloadNC";
import ThermalOverloadRelay3P from "../../Project/library/protection/ThermalOverloadRelay3P";
import ProjectWorkspaceTemplate from "../../Project/library/templates/ProjectWorkspaceTemplate";
import DOLStarterPowerDiagram from "./DOLStarterPowerDiagram";
import ControlPanel from "./control_panel";
import DOLStarterControlDiagram from "./dolControlCircuit";

const SUPPLY_VOLTAGE = 415;
const SQRT_3 = Math.sqrt(3);
const STARTUP_DURATION_MS = 1400;

function resolveEfficiency(horsepower: number) {
  if (horsepower <= 3) return 0.82;
  if (horsepower <= 10) return 0.86;
  return 0.89;
}

function resolvePowerFactor(horsepower: number) {
  if (horsepower <= 3) return 0.76;
  if (horsepower <= 10) return 0.82;
  return 0.85;
}

function resolveRatedCurrent(horsepower: number) {
  const safeHp = Math.max(0.5, horsepower);
  const watts = safeHp * 746;
  const efficiency = resolveEfficiency(safeHp);
  const powerFactor = resolvePowerFactor(safeHp);
  return watts / (SQRT_3 * SUPPLY_VOLTAGE * efficiency * powerFactor);
}

function resolveRunningCurrent(horsepower: number, loadPercent: number) {
  const flc = resolveRatedCurrent(horsepower);
  const normalizedLoad = Math.min(1.5, Math.max(0, loadPercent) / 100);
  const noLoadCurrent = flc * 0.34;
  const loadDrivenCurrent = flc * 0.84 * Math.pow(normalizedLoad, 1.18);
  return noLoadCurrent + loadDrivenCurrent;
}

function resolveStartingCurrent(
  horsepower: number,
  loadPercent: number,
  startupProgress: number,
) {
  const flc = resolveRatedCurrent(horsepower);
  const normalizedLoad = Math.min(1.25, Math.max(0, loadPercent) / 100);
  const startMultiplier = 5.1 + normalizedLoad * 1.1;
  const pickupCurrent = flc * (1.35 + normalizedLoad * 0.45);
  const easedProgress = Math.min(1, Math.max(0, startupProgress));
  const decayCurve = Math.pow(1 - easedProgress, 1.45);
  return pickupCurrent + (flc * startMultiplier - pickupCurrent) * decayCurve;
}

function resolveMotorSpeed(
  ratedRpm: number,
  loadPercent: number,
  running: boolean,
  starting: boolean,
) {
  if (!running) return 0;
  if (starting) return ratedRpm * 0.72;
  return ratedRpm * Math.max(0.52, 1 - loadPercent / 260);
}

function TheorySymbolCard({
  title,
  symbol,
}: {
  title: string;
  symbol: ReactNode;
}) {
  return (
    <div className="project-workspace-symbol-card">
      <div className="project-workspace-symbol-preview">{symbol}</div>
      <p className="project-workspace-symbol-title">{title}</p>
    </div>
  );
}

type DolTripState =
  | { kind: "none" }
  | { kind: "overload"; current: number; limit: number }
  | { kind: "manual" };

type DolTrainingMode = "free" | "guided";
type DolComponentKey =
  | "mcb"
  | "ol"
  | "off"
  | "on"
  | "hold"
  | "k1"
  | "indicator";
type DolFaultScenario =
  | "none"
  | "overload"
  | "mcb-off"
  | "holding-fail"
  | "start-fail";
type DolTimelineEvent = {
  id: number;
  time: string;
  title: string;
  detail: string;
};
type DolCanvasViewMode = "fit" | "actual";
type DolReplayState = "idle" | "playing" | "paused";
type DolComponentStateBadge = {
  key: DolComponentKey;
  label: string;
  state: string;
  tone: "neutral" | "active" | "fault";
};

type DolLessonSnapshot = {
  mcbOn: boolean;
  startupInProgress: boolean;
  motorRunning: boolean;
  stopPressed: boolean;
  overloadTripped: boolean;
  mcbClosedObserved: boolean;
  startObserved: boolean;
  pickupObserved: boolean;
  holdingObserved: boolean;
  stopObserved: boolean;
};

const GUIDED_LESSONS = [
  {
    title: "Turn MCB ON",
    instruction:
      "Close the MCB first so the L and N control supply can reach the starter ladder.",
    highlight: "mcb" as DolComponentKey,
    check: (snapshot: DolLessonSnapshot) =>
      snapshot.mcbOn && snapshot.mcbClosedObserved,
  },
  {
    title: "Press START",
    instruction:
      "Press the START push button to close the momentary NO path toward the K1 coil.",
    highlight: "on" as DolComponentKey,
    check: (snapshot: DolLessonSnapshot) =>
      snapshot.startObserved ||
      snapshot.startupInProgress ||
      snapshot.motorRunning,
  },
  {
    title: "Observe K1 Pickup",
    instruction:
      "Watch the K1 coil energize and the contactor pick up during the startup period.",
    highlight: "k1" as DolComponentKey,
    check: (snapshot: DolLessonSnapshot) =>
      snapshot.pickupObserved ||
      snapshot.startupInProgress ||
      snapshot.motorRunning,
  },
  {
    title: "Holding Contact Closes",
    instruction:
      "Verify that the K1 auxiliary NO contact closes to create the seal-in holding path.",
    highlight: "hold" as DolComponentKey,
    check: (snapshot: DolLessonSnapshot) =>
      snapshot.holdingObserved || snapshot.motorRunning,
  },
  {
    title: "Motor Running",
    instruction:
      "Confirm that the motor remains energized after START is released because the holding path is active.",
    highlight: "indicator" as DolComponentKey,
    check: (snapshot: DolLessonSnapshot) =>
      snapshot.motorRunning || snapshot.holdingObserved,
  },
  {
    title: "Press STOP",
    instruction:
      "Press the STOP push button to open the NC contact and break the control rung.",
    highlight: "off" as DolComponentKey,
    check: (snapshot: DolLessonSnapshot) =>
      snapshot.stopPressed || snapshot.stopObserved,
  },
  {
    title: "Motor Stops Safely",
    instruction:
      "Verify that the K1 coil drops out, the pilot lamp turns off, and the motor returns to idle.",
    highlight: "indicator" as DolComponentKey,
    check: (snapshot: DolLessonSnapshot) =>
      snapshot.stopObserved &&
      !snapshot.motorRunning &&
      !snapshot.startupInProgress &&
      !snapshot.overloadTripped,
  },
] as const;

const COMPONENT_HELP: Record<
  DolComponentKey,
  { label: string; title: string; body: string }
> = {
  mcb: {
    label: "MCB",
    title: "MCB Control 2P",
    body: "The MCB provides isolation and short-circuit protection for the control supply. If it is open, no control current can flow through the ladder.",
  },
  ol: {
    label: "O/L",
    title: "Overload NC 95-96",
    body: "This normally closed overload contact stays closed during healthy running. It opens when overload trips, dropping the K1 coil and stopping the motor.",
  },
  off: {
    label: "OFF",
    title: "OFF Push Button (NC)",
    body: "The STOP button is normally closed. Pressing it opens the control rung and removes current from the K1 coil.",
  },
  on: {
    label: "ON",
    title: "ON Push Button (NO)",
    body: "The START button is normally open. Pressing it temporarily completes the coil circuit so K1 can energize.",
  },
  hold: {
    label: "AUX NO",
    title: "Auxiliary Contact NO 13-14",
    body: "This auxiliary NO contact closes after K1 energizes. It creates the seal-in path so the motor keeps running after START is released.",
  },
  k1: {
    label: "K1",
    title: "K1 Contactor Coil",
    body: "The K1 coil is the main actuator of the DOL starter. When energized, it closes the power contacts and lights the running indicator branch.",
  },
  indicator: {
    label: "Lamp",
    title: "Pilot Indicator Lamp",
    body: "The lamp is wired in parallel with the coil branch. It glows when the control rung is energized and the motor starter is active.",
  },
};

const FAULT_SCENARIO_OPTIONS: Array<{
  key: DolFaultScenario;
  label: string;
}> = [
  { key: "none", label: "Normal" },
  { key: "overload", label: "Overload" },
  { key: "mcb-off", label: "MCB Off" },
  { key: "start-fail", label: "Start Fail" },
  { key: "holding-fail", label: "Hold Fail" },
];

function mapEventToComponent(title: string): DolComponentKey {
  if (title.includes("MCB")) return "mcb";
  if (title.includes("Overload")) return "ol";
  if (title.includes("STOP")) return "off";
  if (title.includes("START")) return "on";
  if (title.includes("Holding")) return "hold";
  if (title.includes("Indicator")) return "indicator";
  return "k1";
}

export default function DOLStarterProjectWorkspace() {
  const [mcbOn, setMcbOn] = useState(true);
  const [motorRunning, setMotorRunning] = useState(false);
  const [overloadTripped, setOverloadTripped] = useState(false);
  const [startPressed, setStartPressed] = useState(false);
  const [stopPressed, setStopPressed] = useState(false);
  const [startupInProgress, setStartupInProgress] = useState(false);
  const [startupProgress, setStartupProgress] = useState(0);
  const [motorRpm, setMotorRpm] = useState(1440);
  const [motorHorsepower, setMotorHorsepower] = useState(5);
  const [currentLimit, setCurrentLimit] = useState(12);
  const [loadPercent, setLoadPercent] = useState(45);
  const [tripState, setTripState] = useState<DolTripState>({ kind: "none" });
  const [trainingMode, setTrainingMode] = useState<DolTrainingMode>("free");
  const [lessonIndex, setLessonIndex] = useState(0);
  const [focusedComponent, setFocusedComponent] =
    useState<DolComponentKey>("mcb");
  const [faultScenario, setFaultScenario] = useState<DolFaultScenario>("none");
  const [eventTimeline, setEventTimeline] = useState<DolTimelineEvent[]>([]);
  const [canvasViewMode, setCanvasViewMode] =
    useState<DolCanvasViewMode>("fit");
  const [showDiagramLabels, setShowDiagramLabels] = useState(true);
  const [showDiagramFlow, setShowDiagramFlow] = useState(true);
  const [replayState, setReplayState] = useState<DolReplayState>("idle");
  const [replayIndex, setReplayIndex] = useState(0);
  const eventIdRef = useRef(0);

  const pushTimelineEvent = useCallback((title: string, detail: string) => {
    const entry: DolTimelineEvent = {
      id: ++eventIdRef.current,
      time: new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      title,
      detail,
    };

    setEventTimeline((current) => [entry, ...current].slice(0, 10));
  }, []);

  const tripMotor = useCallback((state: DolTripState) => {
    setTripState(state);
    setOverloadTripped(true);
    setMotorRunning(false);
    setStartPressed(false);
    setStopPressed(false);
    setStartupInProgress(false);
    setStartupProgress(0);
  }, []);

  const tripReason =
    tripState.kind === "none"
      ? "No active trip."
      : tripState.kind === "manual"
        ? "Manual fault trip has opened the overload contact."
        : `Overload relay trip: ${tripState.current.toFixed(1)}A exceeded ${tripState.limit.toFixed(1)}A.`;

  const startButtonFailed = faultScenario === "start-fail";
  const holdingContactFailed = faultScenario === "holding-fail";
  const controlSupplyLive = mcbOn && !overloadTripped;
  const holdingClosed =
    controlSupplyLive && motorRunning && !holdingContactFailed;
  const startCommandActive =
    controlSupplyLive && startPressed && !startButtonFailed;
  const coilEnergized =
    controlSupplyLive && (startCommandActive || holdingClosed);
  const runningCurrent = resolveRunningCurrent(motorHorsepower, loadPercent);
  const startingCurrent = resolveStartingCurrent(
    motorHorsepower,
    loadPercent,
    startupProgress,
  );
  const motorCurrent = !mcbOn
    ? 0
    : overloadTripped
      ? 0
      : coilEnergized
        ? startupInProgress
          ? startingCurrent
          : runningCurrent
        : 0;
  const motorSpeed = resolveMotorSpeed(
    motorRpm,
    loadPercent,
    motorRunning,
    startupInProgress,
  );
  const mcbClosedObserved = eventTimeline.some(
    (event) => event.title === "MCB Closed",
  );
  const startObserved = eventTimeline.some(
    (event) => event.title === "START Pressed",
  );
  const pickupObserved = eventTimeline.some(
    (event) => event.title === "K1 Pickup",
  );
  const holdingObserved = eventTimeline.some(
    (event) => event.title === "Holding Contact Closed",
  );
  const stopObserved = eventTimeline.some(
    (event) => event.title === "STOP Pressed",
  );
  const lessonSnapshot: DolLessonSnapshot = {
    mcbOn,
    startupInProgress,
    motorRunning,
    stopPressed,
    overloadTripped,
    mcbClosedObserved,
    startObserved,
    pickupObserved,
    holdingObserved,
    stopObserved,
  };
  const currentLesson = GUIDED_LESSONS[lessonIndex];
  const lessonComplete = currentLesson.check(lessonSnapshot);
  const chronologicalTimeline = [...eventTimeline].reverse();
  const safeReplayIndex = Math.min(
    replayIndex,
    Math.max(chronologicalTimeline.length - 1, 0),
  );
  const replayEvent =
    replayState === "idle" || chronologicalTimeline.length === 0
      ? undefined
      : chronologicalTimeline[safeReplayIndex];
  const replayHighlightKey = replayEvent
    ? mapEventToComponent(replayEvent.title)
    : undefined;
  const activeHighlightKey: DolComponentKey = !mcbOn
    ? "mcb"
    : overloadTripped
      ? "ol"
      : startButtonFailed
        ? "on"
        : holdingContactFailed
          ? "hold"
          : startupInProgress
            ? "on"
            : motorRunning
              ? "hold"
              : stopPressed
                ? "off"
                : "mcb";
  const effectiveFocusedComponent =
    replayHighlightKey ??
    (trainingMode === "guided" ? currentLesson.highlight : focusedComponent);
  const focusedComponentInfo = COMPONENT_HELP[effectiveFocusedComponent];
  const showStagedFlow =
    trainingMode === "guided" ||
    replayState !== "idle" ||
    startupInProgress ||
    startPressed;
  const flowAnimationStage = !mcbOn
    ? 0
    : overloadTripped
      ? 1
      : startButtonFailed && startPressed
        ? 2
        : stopPressed
          ? 1
          : holdingContactFailed && motorRunning
            ? 3
            : startPressed
              ? 2
              : startupInProgress
                ? 3
                : motorRunning
                  ? 4
                  : 1;
  const replaySummary =
    replayState === "playing"
      ? `Replaying event ${Math.min(safeReplayIndex + 1, Math.max(chronologicalTimeline.length, 1))} of ${Math.max(chronologicalTimeline.length, 1)}.`
      : replayState === "paused" && replayEvent
        ? `Paused on: ${replayEvent.title}.`
        : chronologicalTimeline.length > 0
          ? "Use replay controls to walk through the switching sequence again."
          : "Operate the starter once to build a replayable event history.";
  const ratedCurrent = resolveRatedCurrent(motorHorsepower);
  const currentMargin = currentLimit - motorCurrent;
  const currentBand: "safe" | "warning" | "trip" = overloadTripped
    ? "trip"
    : motorCurrent >= currentLimit
      ? "trip"
      : motorCurrent >= currentLimit * 0.85 ||
          motorCurrent >= ratedCurrent * 1.15
        ? "warning"
        : "safe";
  const currentLearningNote =
    currentBand === "trip"
      ? "Actual current has exceeded the overload setting, so the control circuit must trip to protect the motor."
      : currentBand === "warning"
        ? "Actual current is above the normal learning band and is getting close to the overload setting."
        : "Actual current is within the normal operating band and still below the overload setting.";
  const componentStateBadges: DolComponentStateBadge[] = [
    {
      key: "mcb",
      label: "MCB",
      state: mcbOn ? "Closed" : "Open",
      tone: mcbOn ? "active" : "neutral",
    },
    {
      key: "ol",
      label: "O/L 95-96",
      state: overloadTripped ? "Opened" : "Closed",
      tone: overloadTripped ? "fault" : "active",
    },
    {
      key: "off",
      label: "OFF NC",
      state: stopPressed ? "Pressed" : "Closed",
      tone: stopPressed ? "fault" : "active",
    },
    {
      key: "on",
      label: "ON NO",
      state: startPressed ? "Pressed" : "Open",
      tone: startPressed ? "active" : "neutral",
    },
    {
      key: "hold",
      label: "Aux NO",
      state: holdingClosed
        ? "Closed"
        : holdingContactFailed
          ? "Fault Open"
          : "Open",
      tone: holdingContactFailed
        ? "fault"
        : holdingClosed
          ? "active"
          : "neutral",
    },
    {
      key: "k1",
      label: "K1 Coil",
      state: coilEnergized ? "Energized" : "De-energized",
      tone: coilEnergized ? "active" : "neutral",
    },
    {
      key: "indicator",
      label: "Lamp",
      state: coilEnergized ? "Glowing" : "Off",
      tone: coilEnergized ? "active" : "neutral",
    },
  ];

  const explanationTitle = !mcbOn
    ? "Control supply is isolated."
    : overloadTripped
      ? "Overload protection opened the rung."
      : startButtonFailed && startPressed
        ? "START push button fault blocks the pickup path."
        : holdingContactFailed && motorRunning
          ? "Holding contact fault prevents seal-in."
          : startupInProgress
            ? "The START path is energizing K1."
            : motorRunning
              ? "K1 is sealed in through the holding contact."
              : stopPressed
                ? "The STOP contact opened the rung."
                : "Starter is ready for operation.";

  const activeComponentName = !mcbOn
    ? "MCB"
    : overloadTripped
      ? "O/L NC (95-96)"
      : startButtonFailed && startPressed
        ? "ON Push Button Fault"
        : holdingContactFailed && motorRunning
          ? "K1 Auxiliary NO Fault"
          : startupInProgress
            ? "ON Push Button + K1 Coil"
            : motorRunning
              ? "K1 Auxiliary NO"
              : stopPressed
                ? "OFF Push Button"
                : "MCB + OFF NC";

  const activeComponentFunction = !mcbOn
    ? "The breaker is open, so the ladder circuit cannot receive control voltage."
    : overloadTripped
      ? "The overload NC contact has opened to de-energize K1 and protect the motor."
      : startButtonFailed && startPressed
        ? "The START contact is faulty, so pressing it does not pass current to the K1 coil."
        : holdingContactFailed && motorRunning
          ? "The holding contact cannot seal the rung, so K1 drops out after START is released."
          : startupInProgress
            ? "The ON push button temporarily closes the rung so K1 can pick up."
            : motorRunning
              ? "The K1 auxiliary NO contact keeps the coil energized after START is released."
              : stopPressed
                ? "The OFF NC contact is opening and interrupting the control path."
                : "The starter is healthy and waiting for a start command.";

  const currentPathText = !mcbOn
    ? "No current path: MCB is open."
    : overloadTripped
      ? "L -> MCB -> O/L NC (opened) -> circuit interrupted."
      : startButtonFailed && startPressed
        ? "L -> MCB -> O/L NC -> OFF NC -> ON NO (faulty/open) -> circuit interrupted."
        : holdingContactFailed && motorRunning
          ? "L -> MCB -> O/L NC -> OFF NC -> K1 Aux NO (failed open) -> circuit interrupted."
          : startupInProgress
            ? "L -> MCB -> O/L NC -> OFF NC -> ON NO -> K1 coil -> N"
            : motorRunning
              ? "L -> MCB -> O/L NC -> OFF NC -> K1 Aux NO -> K1 coil -> N"
              : stopPressed
                ? "L -> MCB -> O/L NC -> OFF NC (opened) -> circuit interrupted."
                : "Control path armed: supply is present up to the start/stop chain.";

  useEffect(() => {
    if (!startupInProgress) return undefined;

    const startedAt = Date.now();
    const progressTimer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setStartupProgress(Math.min(1, elapsed / STARTUP_DURATION_MS));
    }, 80);

    const timer = window.setTimeout(() => {
      setStartupInProgress(false);
      setStartupProgress(1);
      if (faultScenario !== "holding-fail") {
        pushTimelineEvent(
          "Holding Contact Closed",
          "K1 auxiliary NO sealed the rung and the motor remains energized after START is released.",
        );
      }
    }, STARTUP_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(progressTimer);
    };
  }, [faultScenario, pushTimelineEvent, startupInProgress]);

  useEffect(() => {
    if (!holdingContactFailed) return undefined;
    if (!motorRunning) return undefined;
    if (startupInProgress || startPressed) return undefined;

    const timer = window.setTimeout(() => {
      setMotorRunning(false);
      pushTimelineEvent(
        "Holding Contact Failed",
        "START was released but the K1 auxiliary NO contact did not seal the rung, so the motor dropped out.",
      );
    }, 120);

    return () => window.clearTimeout(timer);
  }, [
    holdingContactFailed,
    motorRunning,
    pushTimelineEvent,
    startupInProgress,
    startPressed,
  ]);

  useEffect(() => {
    if (!mcbOn || overloadTripped || !coilEnergized) return undefined;

    if (motorCurrent <= currentLimit) return undefined;

    const ratio = motorCurrent / Math.max(0.5, currentLimit);
    const tripDelay = startupInProgress
      ? ratio >= 4
        ? 1200
        : ratio >= 3
          ? 1800
          : 2600
      : ratio >= 2
        ? 700
        : ratio >= 1.5
          ? 1400
          : 2600;

    const timer = window.setTimeout(() => {
      pushTimelineEvent(
        "Overload Trip",
        `Current rose to ${motorCurrent.toFixed(1)}A and exceeded the ${currentLimit.toFixed(1)}A setting.`,
      );
      tripMotor({
        kind: "overload",
        current: motorCurrent,
        limit: currentLimit,
      });
    }, tripDelay);

    return () => window.clearTimeout(timer);
  }, [
    mcbOn,
    overloadTripped,
    coilEnergized,
    motorCurrent,
    currentLimit,
    pushTimelineEvent,
    startupInProgress,
    tripMotor,
  ]);

  useEffect(() => {
    if (!startPressed) return undefined;
    const timer = window.setTimeout(() => {
      setStartPressed(false);
      pushTimelineEvent(
        "START Released",
        holdingContactFailed
          ? "The START button returned to normal, but the holding path remains faulty and cannot seal the rung."
          : "The START button returned to normal. The holding contact must now keep K1 energized.",
      );
    }, 450);
    return () => window.clearTimeout(timer);
  }, [holdingContactFailed, pushTimelineEvent, startPressed]);

  useEffect(() => {
    if (!stopPressed) return undefined;
    const timer = window.setTimeout(() => {
      setStopPressed(false);
      pushTimelineEvent(
        "STOP Released",
        "The STOP button returned to its NC state and the control rung is ready again.",
      );
    }, 450);
    return () => window.clearTimeout(timer);
  }, [pushTimelineEvent, stopPressed]);

  useEffect(() => {
    if (replayState !== "playing") return undefined;
    if (chronologicalTimeline.length <= 1) return undefined;

    const timer = window.setTimeout(() => {
      setReplayIndex((current) => {
        const next = current + 1;
        if (next >= chronologicalTimeline.length) {
          setReplayState("paused");
          return chronologicalTimeline.length - 1;
        }
        return next;
      });
    }, 1300);

    return () => window.clearTimeout(timer);
  }, [chronologicalTimeline.length, replayIndex, replayState]);

  const handleStart = () => {
    if (overloadTripped || !mcbOn || motorRunning || startupInProgress) return;

    setStartPressed(true);
    setStopPressed(false);

    pushTimelineEvent(
      "START Pressed",
      startButtonFailed
        ? "START command was issued, but the button failure blocks current from reaching the K1 coil."
        : "The ON push button is closing the pickup path to energize the K1 coil.",
    );

    if (startButtonFailed) {
      setStartupInProgress(false);
      setStartupProgress(0);
      setMotorRunning(false);
      return;
    }

    setStartupInProgress(true);
    setStartupProgress(0);
    setMotorRunning(true);

    pushTimelineEvent(
      "K1 Pickup",
      "The K1 coil has begun energizing and the DOL starter is entering pickup.",
    );
  };

  const handleStop = () => {
    setStopPressed(true);
    setStartPressed(false);
    setStartupInProgress(false);
    setStartupProgress(0);
    setMotorRunning(false);
    pushTimelineEvent(
      "STOP Pressed",
      "The OFF push button opened the control rung and de-energized the K1 coil.",
    );
  };

  const handleReset = () => {
    setMotorRunning(false);
    setOverloadTripped(false);
    setStartPressed(false);
    setStopPressed(false);
    setStartupInProgress(false);
    setStartupProgress(0);
    setTripState({ kind: "none" });
    setFaultScenario("none");
    pushTimelineEvent(
      "Reset Complete",
      "Trip memory, fault scenario, and starter states have been cleared.",
    );
  };

  const handleFault = () => {
    if (!mcbOn) return;
    setTripState({ kind: "manual" });
    setOverloadTripped(true);
    setMotorRunning(false);
    setStartPressed(false);
    setStopPressed(false);
    setStartupInProgress(false);
    setStartupProgress(0);
    pushTimelineEvent(
      "Manual Fault",
      "A manual trip was injected to open the overload path and stop the motor.",
    );
  };

  const handleMcbToggle = () => {
    setMcbOn((current) => {
      const next = !current;
      if (!next) {
        setMotorRunning(false);
        setStartPressed(false);
        setStopPressed(false);
        setStartupInProgress(false);
        setStartupProgress(0);
      }
      pushTimelineEvent(
        next ? "MCB Closed" : "MCB Opened",
        next
          ? "Control supply is now available to the DOL ladder circuit."
          : "Control supply has been isolated from the ladder circuit.",
      );
      return next;
    });
  };

  const handleFaultScenarioChange = (scenario: DolFaultScenario) => {
    setFaultScenario(scenario);

    if (trainingMode === "free") {
      if (scenario === "overload") setFocusedComponent("ol");
      if (scenario === "mcb-off") setFocusedComponent("mcb");
      if (scenario === "start-fail") setFocusedComponent("on");
      if (scenario === "holding-fail") setFocusedComponent("hold");
      if (scenario === "none") setFocusedComponent(activeHighlightKey);
    }

    if (scenario === "none") {
      setMcbOn(true);
      setMotorRunning(false);
      setOverloadTripped(false);
      setStartPressed(false);
      setStopPressed(false);
      setStartupInProgress(false);
      setStartupProgress(0);
      setTripState({ kind: "none" });
      pushTimelineEvent(
        "Scenario Cleared",
        "The trainer has returned the starter to normal operating conditions.",
      );
      return;
    }

    if (scenario === "mcb-off") {
      setMcbOn(false);
      setMotorRunning(false);
      setOverloadTripped(false);
      setStartPressed(false);
      setStopPressed(false);
      setStartupInProgress(false);
      setStartupProgress(0);
      setTripState({ kind: "none" });
      pushTimelineEvent(
        "Scenario: MCB Off",
        "The breaker is forced open so the learner can observe loss of control supply.",
      );
      return;
    }

    if (scenario === "overload") {
      setMcbOn(true);
      pushTimelineEvent(
        "Scenario: Overload",
        "An overload fault was injected to demonstrate the 95-96 NC trip action.",
      );
      tripMotor({
        kind: "overload",
        current: Math.max(
          resolveRunningCurrent(motorHorsepower, loadPercent),
          currentLimit + 1,
        ),
        limit: currentLimit,
      });
      return;
    }

    setMcbOn(true);
    setMotorRunning(false);
    setOverloadTripped(false);
    setStartPressed(false);
    setStopPressed(false);
    setStartupInProgress(false);
    setStartupProgress(0);
    setTripState({ kind: "none" });
    pushTimelineEvent(
      scenario === "start-fail"
        ? "Scenario: START Failure"
        : "Scenario: Holding Failure",
      scenario === "start-fail"
        ? "The START push button will fail to pass current to the pickup path."
        : "The K1 auxiliary NO holding contact will fail to seal the rung after startup.",
    );
  };

  const handleTrainingModeChange = (mode: DolTrainingMode) => {
    setTrainingMode(mode);
    setReplayState("idle");
    setReplayIndex(0);
    if (mode === "guided") {
      setEventTimeline([]);
      setLessonIndex(0);
      setFaultScenario("none");
      setMcbOn(false);
      setMotorRunning(false);
      setOverloadTripped(false);
      setStartPressed(false);
      setStopPressed(false);
      setStartupInProgress(false);
      setStartupProgress(0);
      setTripState({ kind: "none" });
      setFocusedComponent("mcb");
      return;
    }
    setFocusedComponent(activeHighlightKey);
  };

  const handleLessonNext = () => {
    if (!lessonComplete) return;
    setLessonIndex((current) =>
      Math.min(current + 1, GUIDED_LESSONS.length - 1),
    );
  };

  const handleLessonPrev = () => {
    setLessonIndex((current) => Math.max(current - 1, 0));
  };

  const handleReplayToggle = () => {
    if (chronologicalTimeline.length === 0) return;
    setReplayState((current) => (current === "playing" ? "paused" : "playing"));
  };

  const handleReplayReset = () => {
    setReplayState("idle");
    setReplayIndex(0);
  };

  const handleReplayPrev = () => {
    setReplayState("paused");
    setReplayIndex((current) => Math.max(current - 1, 0));
  };

  const handleReplayNext = () => {
    setReplayState("paused");
    setReplayIndex((current) =>
      Math.min(current + 1, Math.max(chronologicalTimeline.length - 1, 0)),
    );
  };

  const flowStateLabel = !mcbOn
    ? "MCB Open"
    : overloadTripped
      ? "O/L Trip"
      : startButtonFailed && startPressed
        ? "START Fault"
        : holdingContactFailed && motorRunning
          ? "Hold Fault"
          : startupInProgress
            ? "Start Pressed / Coil Pickup"
            : motorRunning
              ? "Seal-In Holding"
              : stopPressed
                ? "Stop Opening"
                : "Ready";

  const flowDescription = !mcbOn
    ? "MCB is open. Both L and N control feeds are isolated from the ladder circuit."
    : overloadTripped
      ? "Overload NC contact has opened. K1 coil dropped out and the motor is stopped."
      : startButtonFailed && startPressed
        ? "START button failure is blocking the pickup path, so K1 cannot energize."
        : holdingContactFailed && motorRunning
          ? "Holding contact failure prevents seal-in, so the motor drops out after START is released."
          : startupInProgress
            ? "Start button is closing the coil path through MCB, overload NC, and stop NC."
            : motorRunning
              ? "K1 auxiliary NO is holding the coil. Indicator and contactor remain energized."
              : stopPressed
                ? "Stop NC is opening the control path and de-energizing the K1 coil."
                : "Control supply is healthy. Press Start to energize K1 and latch the motor.";

  const modeLabel = !mcbOn
    ? "MCB Off"
    : overloadTripped
      ? "Overload Trip"
      : startButtonFailed
        ? "Start Fault"
        : holdingContactFailed
          ? "Holding Fault"
          : startupInProgress
            ? "Pickup"
            : motorRunning
              ? "Running"
              : stopPressed
                ? "Stopping"
                : "Idle";

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
          disabled={
            !mcbOn || overloadTripped || motorRunning || startupInProgress
          }
          onClick={handleStart}
        >
          Start
        </button>
        <button
          type="button"
          className="workspace-quickbar-button is-stop"
          disabled={
            !mcbOn || (!motorRunning && !startupInProgress && !startPressed)
          }
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
          disabled={!mcbOn || overloadTripped}
          onClick={handleFault}
        >
          Fault
        </button>
      </div>
    </div>
  );

  const diagramTools = (
    <div className="workspace-stage-tools">
      <button
        type="button"
        className={`workspace-stage-tool ${canvasViewMode === "fit" ? "is-active" : ""}`}
        onClick={() => setCanvasViewMode("fit")}
      >
        Fit
      </button>
      <button
        type="button"
        className={`workspace-stage-tool ${canvasViewMode === "actual" ? "is-active" : ""}`}
        onClick={() => setCanvasViewMode("actual")}
      >
        100%
      </button>
      <button
        type="button"
        className={`workspace-stage-tool ${showDiagramLabels ? "is-active" : ""}`}
        onClick={() => setShowDiagramLabels((current) => !current)}
      >
        Labels
      </button>
      <button
        type="button"
        className={`workspace-stage-tool ${showDiagramFlow ? "is-active" : ""}`}
        onClick={() => setShowDiagramFlow((current) => !current)}
      >
        Flow
      </button>
    </div>
  );

  const sharedFullPanel = (
    <ControlPanel
      mcbOn={mcbOn}
      motorRunning={motorRunning}
      overloadTripped={overloadTripped}
      modeLabel={modeLabel}
      flowStateLabel={flowStateLabel}
      flowDescription={overloadTripped ? tripReason : explanationTitle}
      motorRpm={motorRpm}
      motorHorsepower={motorHorsepower}
      currentLimit={currentLimit}
      loadPercent={loadPercent}
      motorCurrent={motorCurrent}
      motorSpeed={motorSpeed}
      tripReason={tripReason}
      ratedCurrent={ratedCurrent}
      currentMargin={currentMargin}
      currentBand={currentBand}
      currentLearningNote={currentLearningNote}
      trainingMode={trainingMode}
      onTrainingModeChange={handleTrainingModeChange}
      lessonStep={lessonIndex + 1}
      lessonTotal={GUIDED_LESSONS.length}
      lessonTitle={currentLesson.title}
      lessonInstruction={currentLesson.instruction}
      lessonComplete={lessonComplete}
      onLessonNext={handleLessonNext}
      onLessonPrev={handleLessonPrev}
      canLessonNext={lessonIndex < GUIDED_LESSONS.length - 1 && lessonComplete}
      canLessonPrev={lessonIndex > 0}
      explanationTitle={explanationTitle}
      activeComponentName={activeComponentName}
      activeComponentFunction={activeComponentFunction}
      currentPathText={currentPathText}
      componentStateBadges={componentStateBadges}
      componentFocusKey={effectiveFocusedComponent}
      componentFocusTitle={focusedComponentInfo.title}
      componentFocusBody={focusedComponentInfo.body}
      componentHelpOptions={Object.entries(COMPONENT_HELP).map(
        ([key, value]) => ({
          key,
          label: value.label,
        }),
      )}
      onComponentFocus={(key) => setFocusedComponent(key as DolComponentKey)}
      faultScenario={faultScenario}
      faultScenarioOptions={FAULT_SCENARIO_OPTIONS}
      onFaultScenarioChange={handleFaultScenarioChange}
      faultScenarioHint={
        faultScenario === "none"
          ? "Select a preset fault to compare normal and abnormal DOL starter behavior."
          : faultScenario === "overload"
            ? "The overload relay trips and opens 95-96, forcing K1 to drop out."
            : faultScenario === "mcb-off"
              ? "The breaker is forced open, so the ladder loses all control supply."
              : faultScenario === "start-fail"
                ? "START is faulty, so pressing it cannot energize the K1 pickup path."
                : "The holding contact fails open, so the motor cannot stay latched after START."
      }
      eventTimeline={eventTimeline}
      replayState={replayState}
      replaySummary={replaySummary}
      replayEventId={replayEvent?.id}
      onReplayToggle={handleReplayToggle}
      onReplayReset={handleReplayReset}
      onReplayPrev={handleReplayPrev}
      onReplayNext={handleReplayNext}
      canReplayPrev={safeReplayIndex > 0}
      canReplayNext={safeReplayIndex < chronologicalTimeline.length - 1}
      onRpmChange={setMotorRpm}
      onHorsepowerChange={(value) => {
        setMotorHorsepower(value);
      }}
      onCurrentLimitChange={(value) => {
        setCurrentLimit(value);
      }}
      onLoadChange={setLoadPercent}
      onMcbToggle={handleMcbToggle}
      onStart={handleStart}
      onStop={handleStop}
      onReset={handleReset}
      onFault={handleFault}
      showControlsSection={false}
    />
  );

  return (
    <ProjectWorkspaceTemplate
      badge="DOL Project"
      title="DOL Starter Project Workspace"
      initialTabKey="control"
      headerActions={headerActions}
      tabs={[
        {
          key: "logic",
          label: "Logic & Theory",
          canvasTitle: "Logic & Theory",
          canvasContent: (
            <div className="project-workspace-logic-copy">
              <p>
                <strong>What is this project?</strong> This project is a
                beginner-friendly DOL starter learning workspace. It shows both
                the
                <strong> control circuit</strong> and the
                <strong> power circuit</strong> of a 3-phase motor starter, so a
                learner can understand how the logic command and the actual
                motor power path work together.
              </p>
              <p>
                <strong>What is a DOL starter?</strong> DOL means
                <strong> Direct-On-Line starter</strong>. In this method, the
                motor is connected directly to the 3-phase line through a
                breaker, contactor, and overload relay. It is one of the
                simplest and most common motor starting methods in industrial
                electrical systems.
              </p>
              <p>
                <strong>Why do we need this project?</strong> Many beginners can
                memorize symbols, but still struggle to understand how a starter
                actually works in sequence. This project helps solve that by
                showing:
              </p>
              <ul className="project-workspace-logic-list">
                <li>how the control side makes a decision</li>
                <li>how the contactor closes the power side</li>
                <li>how overload protection stops the motor</li>
                <li>how motor load affects current and running state</li>
              </ul>
              <p>
                <strong>Simple idea:</strong> think of the contactor like an
                electrically controlled main switch. When you press
                <strong> Start</strong>, the coil energizes, the contactor
                closes, and power goes to the motor. When you press
                <strong> Stop</strong>, or if overload trips, the contactor
                opens and the motor stops.
              </p>
              <p>
                <strong>Analogy:</strong> imagine a water pump line with a
                master valve, a remote-controlled valve, and a safety cut-off.
                The breaker is the master valve, the contactor is the
                remote-controlled valve, and the overload relay is the safety
                cut-off that trips if the motor is under too much stress.
              </p>
              <p>
                <strong>
                  Required components and symbols from this project library:
                </strong>
              </p>
              <div className="project-workspace-symbol-grid">
                <TheorySymbolCard
                  title="MCB / MCCB"
                  symbol={
                    <MCBControl2P on label="" textSize={4} wireStroke={1.2} />
                  }
                />
                <TheorySymbolCard
                  title="Contactor Coil K1"
                  symbol={
                    <ContactorCoil
                      energized={false}
                      label="K1"
                      wireStroke={1.2}
                      textSize={4}
                    />
                  }
                />
                <TheorySymbolCard
                  title="Power Contacts 3P"
                  symbol={
                    <ContactorPowerContacts3P closed label="K1" standalone />
                  }
                />
                <TheorySymbolCard
                  title="Auxiliary Contact NO 13-14"
                  symbol={
                    <AuxiliaryContactNO
                      closed={false}
                      label=""
                      terminalA="13"
                      terminalB="14"
                      textSize={4}
                      wireStroke={1.2}
                    />
                  }
                />
                <TheorySymbolCard
                  title="Thermal Overload 3P"
                  symbol={<ThermalOverloadRelay3P tripped={false} label="" />}
                />
                <TheorySymbolCard
                  title="O/L NC 95-96"
                  symbol={
                    <ThermalOverloadNC
                      tripped={false}
                      label=""
                      orientation="horizontal"
                      textSize={4}
                      wireStroke={1.2}
                    />
                  }
                />
                <TheorySymbolCard
                  title="Start Push Button"
                  symbol={
                    <PushButtonNO
                      pressed={false}
                      label=""
                      textSize={4}
                      wireStroke={1.2}
                    />
                  }
                />
                <TheorySymbolCard
                  title="Pilot Light"
                  symbol={
                    <PilotLight
                      on={false}
                      label=""
                      textSize={4}
                      wireStroke={1.2}
                    />
                  }
                />
                <TheorySymbolCard
                  title="AC Motor 3P"
                  symbol={<ACMotor3P label="" />}
                />
              </div>
              <ul className="project-workspace-logic-list">
                <li>
                  <strong>MCB / MCCB:</strong> isolates the line supply before
                  the control or power circuit starts.
                </li>
                <li>
                  <strong>Contactor Coil K1:</strong> energizes the contactor
                  and closes the main power contacts.
                </li>
                <li>
                  <strong>Contactor Power Contacts 3P:</strong> connect 3-phase
                  power to the motor.
                </li>
                <li>
                  <strong>Auxiliary Contact NO 13-14:</strong> creates the
                  holding or seal-in path after the Start button is released.
                </li>
                <li>
                  <strong>Thermal Overload Relay 3P:</strong> protects the motor
                  on the power side.
                </li>
                <li>
                  <strong>Thermal Overload NC 95-96:</strong> opens the control
                  circuit when overload trips.
                </li>
                <li>
                  <strong>Push Button NO:</strong> works as the Start button.
                </li>
                <li>
                  <strong>Pilot Light:</strong> shows running or energized
                  status.
                </li>
                <li>
                  <strong>AC Motor 3P:</strong> the final load of the DOL
                  starter system.
                </li>
              </ul>
              <p>
                <strong>Basic operation sequence:</strong>
              </p>
              <ul className="project-workspace-logic-list">
                <li>Turn ON the MCB or breaker.</li>
                <li>Press the Start push button.</li>
                <li>The contactor coil K1 energizes.</li>
                <li>The main power contacts close and feed the motor.</li>
                <li>The auxiliary NO contact seals the circuit.</li>
                <li>
                  The motor keeps running until Stop is pressed or overload
                  trips.
                </li>
              </ul>
              <p>
                <strong>Why overload protection is important:</strong> a motor
                can draw too much current because of extra load, mechanical jam,
                low speed under stress, or incorrect settings. The overload
                relay helps protect the motor winding from overheating and
                damage.
              </p>
              <p>
                <strong>Limitations of a DOL starter:</strong> DOL is simple and
                low-cost, but it is not suitable for every motor application.
                Because the motor is connected directly to the full line
                voltage, the starting current can be very high.
              </p>
              <ul className="project-workspace-logic-list">
                <li>
                  high starting current can cause voltage drop in the supply
                  line
                </li>
                <li>large motors may create mechanical shock at startup</li>
                <li>there is no soft acceleration or speed control</li>
                <li>
                  not ideal for heavy-duty loads that need smooth starting
                </li>
                <li>
                  for bigger motors, methods like star-delta or soft starter may
                  be better
                </li>
              </ul>
              <p>
                <strong>Beginner study tip:</strong> first understand the
                control circuit because it tells the system <em>when to run</em>
                . Then study the power circuit because it shows{" "}
                <em>how the motor actually receives power</em>.
              </p>
            </div>
          ),
          fullWidth: true,
        },
        {
          key: "power",
          label: "Power CKT",
          panelTitle: "Control Panel",
          canvasTitle: "Power CKT Canvas",
          layout: "stacked",
          canvasToolbar: diagramTools,
          panelContent: sharedFullPanel,
          canvasContent: (
            <DOLStarterPowerDiagram
              showPanel={false}
              mcbOn={mcbOn}
              motorRunning={motorRunning}
              startupInProgress={startupInProgress}
              overloadTripped={overloadTripped}
              highlightComponentKey={effectiveFocusedComponent}
              motorCurrent={motorCurrent}
              motorRpm={motorRpm}
              loadPercent={loadPercent}
              flowStateLabel={flowStateLabel}
              tripReason={tripReason}
              viewMode={canvasViewMode}
              showLabels={showDiagramLabels}
              showFlow={showDiagramFlow}
              onMcbToggle={handleMcbToggle}
              onStart={handleStart}
              onStop={handleStop}
              onReset={handleReset}
              onFault={handleFault}
              className="project-workspace-power-embed"
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
          panelContent: sharedFullPanel,
          canvasContent: (
            <DOLStarterControlDiagram
              showPanel={false}
              mcbOn={mcbOn}
              motorRunning={motorRunning}
              overloadTripped={overloadTripped}
              startPressed={startPressed}
              stopPressed={stopPressed}
              startButtonFailed={startButtonFailed}
              holdingContactFailed={holdingContactFailed}
              flowStateLabel={flowStateLabel}
              highlightComponentKey={effectiveFocusedComponent}
              componentStateBadges={componentStateBadges}
              pathAnimationStage={flowAnimationStage}
              showStepAnimation={showStagedFlow}
              viewMode={canvasViewMode}
              showLabels={showDiagramLabels}
              showFlow={showDiagramFlow}
              onMcbToggle={handleMcbToggle}
              onStart={handleStart}
              onStop={handleStop}
              onReset={handleReset}
              onFault={handleFault}
              className="project-workspace-control-embed"
            />
          ),
        },
        {
          key: "power-control",
          label: "Power + Control CKT",
          canvasTitle: "Power CKT Canvas",
          secondaryCanvasTitle: "Control CKT Canvas",
          layout: "dual-stacked",
          canvasToolbar: diagramTools,
          secondaryCanvasToolbar: diagramTools,
          canvasContent: (
            <DOLStarterPowerDiagram
              showPanel={false}
              mcbOn={mcbOn}
              motorRunning={motorRunning}
              startupInProgress={startupInProgress}
              overloadTripped={overloadTripped}
              highlightComponentKey={effectiveFocusedComponent}
              motorCurrent={motorCurrent}
              motorRpm={motorRpm}
              loadPercent={loadPercent}
              flowStateLabel={flowStateLabel}
              tripReason={tripReason}
              viewMode={canvasViewMode}
              showLabels={showDiagramLabels}
              showFlow={showDiagramFlow}
              onMcbToggle={handleMcbToggle}
              onStart={handleStart}
              onStop={handleStop}
              onReset={handleReset}
              onFault={handleFault}
              className="project-workspace-power-embed"
            />
          ),
          secondaryCanvasContent: (
            <DOLStarterControlDiagram
              showPanel={false}
              mcbOn={mcbOn}
              motorRunning={motorRunning}
              overloadTripped={overloadTripped}
              startPressed={startPressed}
              stopPressed={stopPressed}
              startButtonFailed={startButtonFailed}
              holdingContactFailed={holdingContactFailed}
              flowStateLabel={flowStateLabel}
              highlightComponentKey={effectiveFocusedComponent}
              componentStateBadges={componentStateBadges}
              pathAnimationStage={flowAnimationStage}
              showStepAnimation={showStagedFlow}
              viewMode={canvasViewMode}
              showLabels={showDiagramLabels}
              showFlow={showDiagramFlow}
              onMcbToggle={handleMcbToggle}
              onStart={handleStart}
              onStop={handleStop}
              onReset={handleReset}
              onFault={handleFault}
              className="project-workspace-control-embed"
            />
          ),
        },
      ]}
    />
  );
}
