"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import ProjectWorkspaceTemplate from "../../Project/library/templates/ProjectWorkspaceTemplate";
import ReverseForwardPowerDiagram from "./ReverseForwardPowerDiagram";
import ReverseForwardControlPanel from "./control_panel";
import ReverseForwardControlCircuit from "./reverseForwardControlCircuit";

type DirectionState = "idle" | "forward" | "reverse";
type TrainingMode = "free" | "guided";
type FaultScenario =
  | "none"
  | "overload"
  | "mcb-off"
  | "forward-fail"
  | "reverse-fail";
type ReplayState = "idle" | "playing" | "paused";
type TimelineEvent = {
  id: number;
  time: string;
  title: string;
  detail: string;
};

const SUPPLY_VOLTAGE = 415;
const SQRT_3 = 1.732;
const BUTTON_PULSE_MS = 220;
const MAX_TIMELINE_EVENTS = 60;

function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

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
  const safeHp = clampNumber(horsepower, 0.5, 500);
  const safeLoad = clampNumber(loadPercent, 0, 150);
  const flc = resolveRatedCurrent(safeHp);
  const normalizedLoad = safeLoad / 100;
  const noLoadCurrent = flc * 0.36;
  const loadDrivenCurrent = flc * 0.9 * Math.pow(normalizedLoad, 1.14);
  return noLoadCurrent + loadDrivenCurrent;
}

function resolveMotorSpeed(
  ratedRpm: number,
  loadPercent: number,
  running: boolean,
  direction: DirectionState,
) {
  if (!running || direction === "idle") return 0;

  const safeRpm = clampNumber(ratedRpm, 300, 100000);
  const safeLoad = clampNumber(loadPercent, 0, 150);

  return safeRpm * Math.max(0.52, 1 - safeLoad / 260);
}

function getDirectionLabel(direction: DirectionState, motorRunning: boolean) {
  if (!motorRunning || direction === "idle") return "Idle";
  return direction === "forward" ? "Forward" : "Reverse";
}

const GUIDED_LESSONS = [
  {
    title: "Turn MCB ON",
    instruction:
      "Close the MCB first so control supply can reach both the forward and reverse rungs.",
    check: (state: {
      mcbOn: boolean;
      direction: DirectionState;
      motorRunning: boolean;
      stopObserved: boolean;
    }) => state.mcbOn,
  },
  {
    title: "Start Forward",
    instruction:
      "Press START FWD and observe the forward branch pick up through K2 NC interlock.",
    check: (state: {
      mcbOn: boolean;
      direction: DirectionState;
      motorRunning: boolean;
      stopObserved: boolean;
    }) => state.mcbOn && state.direction === "forward" && state.motorRunning,
  },
  {
    title: "Stop Safely",
    instruction:
      "Press STOP to drop the active contactor and return the motor to idle before changing direction.",
    check: (state: {
      mcbOn: boolean;
      direction: DirectionState;
      motorRunning: boolean;
      stopObserved: boolean;
    }) =>
      state.stopObserved && !state.motorRunning && state.direction === "idle",
  },
  {
    title: "Start Reverse",
    instruction:
      "Press START REV and verify the K1 NC interlock protects the reverse branch.",
    check: (state: {
      mcbOn: boolean;
      direction: DirectionState;
      motorRunning: boolean;
      stopObserved: boolean;
    }) => state.mcbOn && state.direction === "reverse" && state.motorRunning,
  },
  {
    title: "Observe Direction Control",
    instruction:
      "Compare forward and reverse status, current, and speed while the starter changes direction safely.",
    check: (state: {
      mcbOn: boolean;
      direction: DirectionState;
      motorRunning: boolean;
      stopObserved: boolean;
    }) => state.motorRunning && state.direction !== "idle",
  },
] as const;

const COMPONENT_HELP = {
  mcb: {
    label: "MCB",
    title: "MCB Control 2P",
    body: "Provides isolation and protection for the control supply feeding both forward and reverse branches.",
  },
  ol: {
    label: "O/L",
    title: "Overload NC 95-96",
    body: "This normally closed overload contact opens on fault and drops whichever direction contactor is energized.",
  },
  off: {
    label: "OFF",
    title: "STOP Push Button (NC)",
    body: "The STOP button interrupts both forward and reverse control paths.",
  },
  fwd: {
    label: "FWD",
    title: "Forward Start Button",
    body: "Momentarily closes the forward branch so K1 can energize through the K2 NC interlock.",
  },
  rev: {
    label: "REV",
    title: "Reverse Start Button",
    body: "Momentarily closes the reverse branch so K2 can energize through the K1 NC interlock.",
  },
  k1: {
    label: "K1",
    title: "Forward Contactor",
    body: "K1 drives forward rotation and its auxiliary NO contact seals the forward branch after START FWD is released.",
  },
  k2: {
    label: "K2",
    title: "Reverse Contactor",
    body: "K2 drives reverse rotation and its auxiliary NO contact seals the reverse branch after START REV is released.",
  },
} as const;

const POWER_COMPONENT_HELP = {
  mccb: {
    label: "MCCB",
    title: "3P MCCB",
    body: "Provides the incoming 3-phase isolation point for the reverse-forward starter power section.",
  },
  "k1-main": {
    label: "K1 Main",
    title: "K1 Main Power Contacts",
    body: "K1 passes the normal phase sequence to the motor so the shaft rotates in forward direction.",
  },
  "k2-main": {
    label: "K2 Main",
    title: "K2 Main Power Contacts",
    body: "K2 swaps two phases before the overload relay so the motor rotates in reverse direction.",
  },
  "ol-3p": {
    label: "O/L 3P",
    title: "3-Phase Overload Relay",
    body: "Monitors all three motor phases and opens the starter output path when overload protection operates.",
  },
  "motor-3p": {
    label: "Motor",
    title: "3-Phase Motor",
    body: "Receives either normal or reversed phase order from the starter to run the shaft in the selected direction.",
  },
} as const;

const FAULT_SCENARIO_OPTIONS: Array<{ key: FaultScenario; label: string }> = [
  { key: "none", label: "Normal" },
  { key: "overload", label: "Overload" },
  { key: "mcb-off", label: "MCB Off" },
  { key: "forward-fail", label: "Forward Fail" },
  { key: "reverse-fail", label: "Reverse Fail" },
];

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

export default function ReverseForwardProjectWorkspace() {
  const [mcbOn, setMcbOn] = useState(false);
  const [motorRunning, setMotorRunning] = useState(false);
  const [direction, setDirection] = useState<DirectionState>("idle");
  const [overloadTripped, setOverloadTripped] = useState(false);

  const [motorRpm, setMotorRpm] = useState(1440);
  const [motorHorsepower, setMotorHorsepower] = useState(5);
  const [currentLimit, setCurrentLimit] = useState(12);
  const [loadPercent, setLoadPercent] = useState(45);

  const [tripReason, setTripReason] = useState("No active trip.");
  const [forwardStartPressed, setForwardStartPressed] = useState(false);
  const [reverseStartPressed, setReverseStartPressed] = useState(false);
  const [stopPressed, setStopPressed] = useState(false);

  const [trainingMode, setTrainingMode] = useState<TrainingMode>("free");
  const [lessonStep, setLessonStep] = useState(0);
  const [faultScenario, setFaultScenario] = useState<FaultScenario>("none");

  const [componentFocusKey, setComponentFocusKey] =
    useState<keyof typeof COMPONENT_HELP>("mcb");
  const [powerComponentFocusKey, setPowerComponentFocusKey] =
    useState<keyof typeof POWER_COMPONENT_HELP>("mccb");

  const [eventTimeline, setEventTimeline] = useState<TimelineEvent[]>([]);
  const [replayState, setReplayState] = useState<ReplayState>("idle");
  const [replayIndex, setReplayIndex] = useState(0);
  const [stopObserved, setStopObserved] = useState(false);

  const [canvasViewMode, setCanvasViewMode] = useState<"fit" | "actual">("fit");
  const [showDiagramLabels, setShowDiagramLabels] = useState(true);
  const [showDiagramFlow, setShowDiagramFlow] = useState(true);

  const eventIdRef = useRef(0);
  const forwardPulseRef = useRef<number | null>(null);
  const reversePulseRef = useRef<number | null>(null);
  const stopPulseRef = useRef<number | null>(null);

  const clearForwardPulse = useCallback(() => {
    if (forwardPulseRef.current !== null) {
      window.clearTimeout(forwardPulseRef.current);
      forwardPulseRef.current = null;
    }
  }, []);

  const clearReversePulse = useCallback(() => {
    if (reversePulseRef.current !== null) {
      window.clearTimeout(reversePulseRef.current);
      reversePulseRef.current = null;
    }
  }, []);

  const clearStopPulse = useCallback(() => {
    if (stopPulseRef.current !== null) {
      window.clearTimeout(stopPulseRef.current);
      stopPulseRef.current = null;
    }
  }, []);

  const clearAllPulseTimers = useCallback(() => {
    clearForwardPulse();
    clearReversePulse();
    clearStopPulse();
  }, [clearForwardPulse, clearReversePulse, clearStopPulse]);

  const pulseForwardStart = useCallback(() => {
    setForwardStartPressed(true);
    clearForwardPulse();

    forwardPulseRef.current = window.setTimeout(() => {
      setForwardStartPressed(false);
      forwardPulseRef.current = null;
    }, BUTTON_PULSE_MS);
  }, [clearForwardPulse]);

  const pulseReverseStart = useCallback(() => {
    setReverseStartPressed(true);
    clearReversePulse();

    reversePulseRef.current = window.setTimeout(() => {
      setReverseStartPressed(false);
      reversePulseRef.current = null;
    }, BUTTON_PULSE_MS);
  }, [clearReversePulse]);

  const pulseStopButton = useCallback(() => {
    setStopPressed(true);
    clearStopPulse();

    stopPulseRef.current = window.setTimeout(() => {
      setStopPressed(false);
      stopPulseRef.current = null;
    }, BUTTON_PULSE_MS);
  }, [clearStopPulse]);

  const pushEvent = useCallback((title: string, detail: string) => {
    const nextId = eventIdRef.current + 1;
    eventIdRef.current = nextId;

    setEventTimeline((prev) =>
      [
        {
          id: nextId,
          time: new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          title,
          detail,
        },
        ...prev,
      ].slice(0, MAX_TIMELINE_EVENTS),
    );
  }, []);

  const handleRpmChange = useCallback((value: number) => {
    setMotorRpm(clampNumber(value, 300, 100000));
  }, []);

  const handleHorsepowerChange = useCallback((value: number) => {
    setMotorHorsepower(clampNumber(value, 0.5, 500));
  }, []);

  const handleCurrentLimitChange = useCallback((value: number) => {
    setCurrentLimit(clampNumber(value, 0.1, 10000));
  }, []);

  const handleLoadChange = useCallback((value: number) => {
    setLoadPercent(clampNumber(value, 0, 150));
  }, []);

  const handleMcbToggle = useCallback(() => {
    clearAllPulseTimers();
    setForwardStartPressed(false);
    setReverseStartPressed(false);
    setStopPressed(false);

    setMcbOn((prev) => {
      const next = !prev;

      if (!next) {
        setMotorRunning(false);
        setDirection("idle");
        setStopObserved(true);

        if (!overloadTripped) {
          setTripReason("Supply isolated by MCB.");
        }
      } else {
        if (faultScenario === "mcb-off") {
          setFaultScenario("none");
        }

        if (!overloadTripped) {
          setTripReason("No active trip.");
        }
      }

      pushEvent(
        next ? "MCB Closed" : "MCB Opened",
        next ? "Control supply restored." : "Control supply isolated.",
      );

      return next;
    });
  }, [clearAllPulseTimers, faultScenario, overloadTripped, pushEvent]);

  const startDirection = useCallback(
    (target: DirectionState) => {
      if (target === "forward") {
        pulseForwardStart();
      }

      if (target === "reverse") {
        pulseReverseStart();
      }

      if (target === "idle") return;

      if (!mcbOn) {
        setTripReason("MCB is open. Close it before starting.");
        pushEvent(
          "Start Blocked",
          "Attempted to start without control supply.",
        );
        return;
      }

      if (overloadTripped) {
        setTripReason("Overload is tripped. Reset before starting.");
        pushEvent("Start Blocked", "Overload trip prevented pickup.");
        return;
      }

      if (motorRunning || direction !== "idle") {
        setTripReason(
          "Stop the active direction before starting another direction.",
        );
        pushEvent(
          "Start Blocked",
          "Forward and reverse directions are interlocked. Stop first before changing direction.",
        );
        return;
      }

      if (faultScenario === "forward-fail" && target === "forward") {
        setTripReason("Forward start fault: K1 branch did not pick up.");
        pushEvent(
          "Forward Start Failed",
          "Simulated forward branch failure blocked K1 pickup.",
        );
        return;
      }

      if (faultScenario === "reverse-fail" && target === "reverse") {
        setTripReason("Reverse start fault: K2 branch did not pick up.");
        pushEvent(
          "Reverse Start Failed",
          "Simulated reverse branch failure blocked K2 pickup.",
        );
        return;
      }

      const predictedCurrent = resolveRunningCurrent(
        motorHorsepower,
        loadPercent,
      );

      if (predictedCurrent > currentLimit) {
        setOverloadTripped(true);
        setMotorRunning(false);
        setDirection("idle");
        setStopObserved(true);
        setTripReason(
          `Overload trip: ${predictedCurrent.toFixed(1)} A exceeded ${currentLimit.toFixed(1)} A.`,
        );
        pushEvent(
          "Overload Trip",
          `Start attempt drew ${predictedCurrent.toFixed(1)} A and opened O/L protection.`,
        );
        return;
      }

      setMotorRunning(true);
      setDirection(target);
      setStopObserved(false);
      setTripReason("No active trip.");

      pushEvent(
        target === "forward" ? "Forward Start" : "Reverse Start",
        target === "forward"
          ? "K1 picked up through the forward control path."
          : "K2 picked up through the reverse control path.",
      );
    },
    [
      currentLimit,
      direction,
      faultScenario,
      loadPercent,
      mcbOn,
      motorHorsepower,
      motorRunning,
      overloadTripped,
      pulseForwardStart,
      pulseReverseStart,
      pushEvent,
    ],
  );

  const handleStop = useCallback(() => {
    pulseStopButton();

    setMotorRunning(false);
    setDirection("idle");
    setStopObserved(true);

    if (!overloadTripped) {
      setTripReason("No active trip.");
    }

    pushEvent(
      "STOP Pressed",
      "The active contactor dropped out and the motor returned to idle.",
    );
  }, [overloadTripped, pulseStopButton, pushEvent]);

  const handleReset = useCallback(() => {
    clearAllPulseTimers();

    setForwardStartPressed(false);
    setReverseStartPressed(false);
    setStopPressed(false);
    setOverloadTripped(false);
    setMotorRunning(false);
    setDirection("idle");
    setFaultScenario("none");
    setTripReason(mcbOn ? "No active trip." : "Supply isolated by MCB.");
    setStopObserved(false);

    pushEvent("Reset", "Trip state and active direction were cleared.");
  }, [clearAllPulseTimers, mcbOn, pushEvent]);

  const handleFault = useCallback(() => {
    if (!mcbOn || overloadTripped) return;

    clearAllPulseTimers();

    setForwardStartPressed(false);
    setReverseStartPressed(false);
    setStopPressed(false);
    setOverloadTripped(true);
    setMotorRunning(false);
    setDirection("idle");
    setTripReason("Manual fault triggered the overload trip.");
    setStopObserved(true);

    pushEvent(
      "Manual Fault",
      "Overload contact opened and dropped the active branch.",
    );
  }, [clearAllPulseTimers, mcbOn, overloadTripped, pushEvent]);

  const handleFaultScenarioChange = useCallback(
    (scenario: FaultScenario) => {
      clearAllPulseTimers();

      setForwardStartPressed(false);
      setReverseStartPressed(false);
      setStopPressed(false);
      setFaultScenario(scenario);

      if (scenario === "mcb-off") {
        setMcbOn(false);
        setMotorRunning(false);
        setDirection("idle");
        setOverloadTripped(false);
        setStopObserved(true);
        setTripReason("Scenario forced MCB open.");
      } else if (scenario === "overload") {
        setOverloadTripped(true);
        setMotorRunning(false);
        setDirection("idle");
        setStopObserved(true);
        setTripReason("Scenario forced overload trip.");
      } else {
        setOverloadTripped(false);
        setTripReason(mcbOn ? "No active trip." : "Supply isolated by MCB.");
      }

      pushEvent("Scenario Selected", `Trainer scenario set to ${scenario}.`);
    },
    [clearAllPulseTimers, mcbOn, pushEvent],
  );

  const ratedCurrent = useMemo(
    () => resolveRatedCurrent(motorHorsepower),
    [motorHorsepower],
  );

  const baseCurrent = useMemo(
    () => resolveRunningCurrent(motorHorsepower, loadPercent),
    [loadPercent, motorHorsepower],
  );

  const motorCurrent = useMemo(() => {
    if (!mcbOn || overloadTripped || !motorRunning || direction === "idle") {
      return 0;
    }

    return baseCurrent;
  }, [baseCurrent, direction, mcbOn, motorRunning, overloadTripped]);

  const motorSpeed = useMemo(
    () => resolveMotorSpeed(motorRpm, loadPercent, motorRunning, direction),
    [direction, loadPercent, motorRpm, motorRunning],
  );

  const currentBand =
    motorCurrent > currentLimit
      ? "trip"
      : motorCurrent > ratedCurrent
        ? "warning"
        : "safe";

  const currentBandLabel =
    currentBand === "trip"
      ? "Trip Zone"
      : currentBand === "warning"
        ? "Warning"
        : "Safe";

  const currentMargin = currentLimit - motorCurrent;

  const currentLearningNote =
    currentBand === "trip"
      ? "Actual current is above the overload setting. The starter should trip or remain blocked."
      : currentBand === "warning"
        ? "Current is above rated value but still below the overload trip setting."
        : "Current is within the normal operating band.";

  const modeLabel = getDirectionLabel(direction, motorRunning);

  const lessonSnapshot = {
    mcbOn,
    direction,
    motorRunning,
    stopObserved,
  };

  const lesson = GUIDED_LESSONS[lessonStep] ?? GUIDED_LESSONS[0];
  const lessonComplete = lesson.check(lessonSnapshot);

  const canLessonPrev = lessonStep > 0;
  const canLessonNext = lessonStep < GUIDED_LESSONS.length - 1;

  const lessonResultText = lessonComplete
    ? "The required condition for this lesson step has been achieved."
    : "This lesson step is still waiting for the expected operator action.";

  const lessonWhyText =
    lessonStep === 0
      ? "Without the MCB, neither the forward nor reverse rung can receive control supply."
      : lessonStep === 1
        ? "K2 NC must stay closed so the forward rung can pick up K1 safely."
        : lessonStep === 2
          ? "Stopping first avoids commanding reverse while the forward branch is still active."
          : lessonStep === 3
            ? "K1 NC must stay closed so the reverse rung can pick up K2 safely."
            : "Forward and reverse branches must never seal in at the same time.";

  const explanationTitle = overloadTripped
    ? "Overload opened the control path."
    : !mcbOn
      ? "Control supply is isolated."
      : direction === "forward" && motorRunning
        ? "Forward path is active."
        : direction === "reverse" && motorRunning
          ? "Reverse path is active."
          : "Starter is waiting for a command.";

  const activeComponentName = overloadTripped
    ? "O/L 95-96"
    : !mcbOn
      ? "MCB"
      : direction === "forward"
        ? "K1"
        : direction === "reverse"
          ? "K2"
          : "START Push Buttons";

  const activeComponentFunction = overloadTripped
    ? "Drops the active contactor when overload protection operates."
    : !mcbOn
      ? "Feeds or isolates the control ladder."
      : direction === "forward"
        ? "Seals and drives the forward branch."
        : direction === "reverse"
          ? "Seals and drives the reverse branch."
          : "Wait for a forward or reverse start command.";

  const currentPathText = !mcbOn
    ? "No active path: MCB is open."
    : overloadTripped
      ? "Path interrupted at O/L 95-96."
      : direction === "forward" && motorRunning
        ? "L -> MCB -> O/L -> OFF -> ON1 / K1 NO -> K2 NC -> K1 coil -> N"
        : direction === "reverse" && motorRunning
          ? "L -> MCB -> O/L -> OFF -> ON2 / K2 NO -> K1 NC -> K2 coil -> N"
          : "Control supply is available, but neither forward nor reverse branch is picked up.";

  const componentStateBadges: Array<{
    key: string;
    label: string;
    state: string;
    tone: "neutral" | "active" | "fault";
  }> = [
    {
      key: "mcb",
      label: "MCB",
      state: mcbOn ? "Closed" : "Open",
      tone: mcbOn ? "active" : "neutral",
    },
    {
      key: "ol",
      label: "O/L",
      state: overloadTripped ? "Open" : "Closed",
      tone: overloadTripped ? "fault" : "active",
    },
    {
      key: "off",
      label: "OFF",
      state: stopPressed ? "Pressed" : "Closed",
      tone: stopPressed ? "fault" : "active",
    },
    {
      key: "fwd",
      label: "FWD",
      state: forwardStartPressed ? "Pressed" : "Open",
      tone: forwardStartPressed ? "active" : "neutral",
    },
    {
      key: "rev",
      label: "REV",
      state: reverseStartPressed ? "Pressed" : "Open",
      tone: reverseStartPressed ? "active" : "neutral",
    },
    {
      key: "k2-nc",
      label: "K2 NC",
      state: !(direction === "reverse" && motorRunning) ? "Closed" : "Open",
      tone: !(direction === "reverse" && motorRunning) ? "active" : "fault",
    },
    {
      key: "k1-nc",
      label: "K1 NC",
      state: !(direction === "forward" && motorRunning) ? "Closed" : "Open",
      tone: !(direction === "forward" && motorRunning) ? "active" : "fault",
    },
    {
      key: "k1",
      label: "K1 Coil",
      state: direction === "forward" && motorRunning ? "Energized" : "Idle",
      tone: direction === "forward" && motorRunning ? "active" : "neutral",
    },
    {
      key: "k2",
      label: "K2 Coil",
      state: direction === "reverse" && motorRunning ? "Energized" : "Idle",
      tone: direction === "reverse" && motorRunning ? "active" : "neutral",
    },
    {
      key: "k1-hold",
      label: "K1 Hold",
      state: direction === "forward" && motorRunning ? "Closed" : "Open",
      tone: direction === "forward" && motorRunning ? "active" : "neutral",
    },
    {
      key: "k2-hold",
      label: "K2 Hold",
      state: direction === "reverse" && motorRunning ? "Closed" : "Open",
      tone: direction === "reverse" && motorRunning ? "active" : "neutral",
    },
  ];

  const componentHelpOptions: Array<{ key: string; label: string }> = [
    { key: "mcb", label: "MCB" },
    { key: "ol", label: "O/L" },
    { key: "off", label: "OFF" },
    { key: "fwd", label: "FWD" },
    { key: "rev", label: "REV" },
    { key: "k1", label: "K1" },
    { key: "k2", label: "K2" },
  ];

  const componentFocus = COMPONENT_HELP[componentFocusKey];

  const powerComponentHelpOptions: Array<{ key: string; label: string }> = [
    { key: "mccb", label: "MCCB" },
    { key: "k1-main", label: "K1 Main" },
    { key: "k2-main", label: "K2 Main" },
    { key: "ol-3p", label: "O/L 3P" },
    { key: "motor-3p", label: "Motor" },
  ];

  const powerComponentFocus = POWER_COMPONENT_HELP[powerComponentFocusKey];

  const faultScenarioHint =
    faultScenario === "overload"
      ? "The overload scenario opens 95-96 and drops both direction branches."
      : faultScenario === "mcb-off"
        ? "The MCB-off scenario isolates the control ladder before any start command can succeed."
        : faultScenario === "forward-fail"
          ? "The forward fail scenario blocks K1 pickup even when START FWD is pressed."
          : faultScenario === "reverse-fail"
            ? "The reverse fail scenario blocks K2 pickup even when START REV is pressed."
            : "Normal mode lets you switch between forward and reverse under operator control.";

  const flowDescription = overloadTripped
    ? "Protection opened the rung and both direction branches are de-energized."
    : !mcbOn
      ? "Control supply is isolated at the MCB."
      : direction === "forward" && motorRunning
        ? "K1 is energized and the motor is running in forward direction."
        : direction === "reverse" && motorRunning
          ? "K2 is energized and the motor is running in reverse direction."
          : "Press START FWD or START REV to energize one direction branch.";

  const powerModeLabel = overloadTripped
    ? "Power Tripped"
    : !mcbOn
      ? "Power Isolated"
      : direction === "forward" && motorRunning
        ? "Forward Power"
        : direction === "reverse" && motorRunning
          ? "Reverse Power"
          : "Power Ready";

  const powerFlowDescription = overloadTripped
    ? "The overload relay has opened the 3-phase output path to protect the motor."
    : !mcbOn
      ? "The MCCB is open, so the 3-phase feeder is isolated from the starter."
      : direction === "forward" && motorRunning
        ? "K1 main contacts pass normal phase order to the motor for forward rotation."
        : direction === "reverse" && motorRunning
          ? "K2 main contacts swap two phases to reverse the motor direction."
          : "3-phase power is available up to the starter, but the power contacts are still open.";

  const powerExplanationTitle = overloadTripped
    ? "Power path opened by overload protection."
    : !mcbOn
      ? "Incoming 3-phase supply is isolated."
      : direction === "forward" && motorRunning
        ? "Forward power path is active."
        : direction === "reverse" && motorRunning
          ? "Reverse power path is active."
          : "Power section is waiting for a control command.";

  const powerActiveComponentName = overloadTripped
    ? "O/L 3P"
    : !mcbOn
      ? "MCCB"
      : direction === "forward"
        ? "K1 Main Contacts"
        : direction === "reverse"
          ? "K2 Main Contacts"
          : "Power Contactor Set";

  const powerActiveComponentFunction = overloadTripped
    ? "Disconnects the motor from the 3-phase feeder when overload protection operates."
    : !mcbOn
      ? "Feeds or isolates the incoming 3-phase power path."
      : direction === "forward"
        ? "Delivers normal phase sequence to the motor."
        : direction === "reverse"
          ? "Swaps the output phase sequence to reverse motor rotation."
          : "Waits for either the forward or reverse branch to close.";

  const powerCurrentPathText = !mcbOn
    ? "No power path: MCCB is open."
    : overloadTripped
      ? "Power path interrupted at the 3-phase overload relay."
      : direction === "forward" && motorRunning
        ? "L1/L2/L3 -> MCCB -> K1 -> O/L -> Motor"
        : direction === "reverse" && motorRunning
          ? "L1/L2/L3 -> MCCB -> K2 (phase swapped) -> O/L -> Motor"
          : "3-phase supply is present, but both power contactors remain open.";

  const powerComponentStateBadges: Array<{
    key: string;
    label: string;
    state: string;
    tone: "neutral" | "active" | "fault";
  }> = [
    {
      key: "mccb",
      label: "MCCB",
      state: mcbOn ? "Closed" : "Open",
      tone: mcbOn ? "active" : "neutral",
    },
    {
      key: "k1-main",
      label: "K1 Main",
      state: direction === "forward" && motorRunning ? "Closed" : "Open",
      tone: direction === "forward" && motorRunning ? "active" : "neutral",
    },
    {
      key: "k2-main",
      label: "K2 Main",
      state: direction === "reverse" && motorRunning ? "Closed" : "Open",
      tone: direction === "reverse" && motorRunning ? "active" : "neutral",
    },
    {
      key: "ol-3p",
      label: "O/L 3P",
      state: overloadTripped ? "Open" : "Closed",
      tone: overloadTripped ? "fault" : "active",
    },
    {
      key: "motor-3p",
      label: "Motor",
      state: motorRunning
        ? getDirectionLabel(direction, motorRunning)
        : "Stopped",
      tone: motorRunning ? "active" : "neutral",
    },
  ];

  useEffect(() => {
    return () => {
      clearAllPulseTimers();
    };
  }, [clearAllPulseTimers]);

  useEffect(() => {
    if (
      mcbOn &&
      motorRunning &&
      direction !== "idle" &&
      !overloadTripped &&
      motorCurrent > currentLimit
    ) {
      clearAllPulseTimers();

      setForwardStartPressed(false);
      setReverseStartPressed(false);
      setStopPressed(false);
      setOverloadTripped(true);
      setMotorRunning(false);
      setDirection("idle");
      setTripReason(
        `Overload trip: ${motorCurrent.toFixed(1)} A exceeded ${currentLimit.toFixed(1)} A.`,
      );
      setStopObserved(true);

      pushEvent(
        "Overload Trip",
        `Current rose to ${motorCurrent.toFixed(1)} A and opened O/L protection.`,
      );
    }
  }, [
    clearAllPulseTimers,
    currentLimit,
    direction,
    mcbOn,
    motorCurrent,
    motorRunning,
    overloadTripped,
    pushEvent,
  ]);

  useEffect(() => {
    if (
      trainingMode !== "guided" ||
      !lessonComplete ||
      lessonStep >= GUIDED_LESSONS.length - 1
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      setLessonStep((step) => Math.min(step + 1, GUIDED_LESSONS.length - 1));
    }, 900);

    return () => window.clearTimeout(timer);
  }, [lessonComplete, lessonStep, trainingMode]);

  useEffect(() => {
    if (trainingMode !== "guided") return;

    const focusByLesson: Array<keyof typeof COMPONENT_HELP> = [
      "mcb",
      "fwd",
      "off",
      "rev",
      "k1",
    ];

    setComponentFocusKey(focusByLesson[lessonStep] ?? "mcb");
  }, [lessonStep, trainingMode]);

  useEffect(() => {
    if (replayState !== "playing" || eventTimeline.length === 0) return;

    const timer = window.setTimeout(() => {
      setReplayIndex((index) => {
        if (index >= eventTimeline.length - 1) {
          setReplayState("paused");
          return eventTimeline.length - 1;
        }

        return index + 1;
      });
    }, 1100);

    return () => window.clearTimeout(timer);
  }, [eventTimeline.length, replayIndex, replayState]);

  useEffect(() => {
    if (eventTimeline.length === 0) {
      setReplayIndex(0);

      if (replayState !== "idle") {
        setReplayState("idle");
      }

      return;
    }

    setReplayIndex((index) => Math.min(index, eventTimeline.length - 1));
  }, [eventTimeline.length, replayState]);

  const replayEventId =
    eventTimeline.length > 0 &&
    replayIndex >= 0 &&
    replayIndex < eventTimeline.length
      ? eventTimeline[replayIndex]?.id
      : undefined;

  const replaySummary =
    eventTimeline.length > 0
      ? `Replay focus: ${
          eventTimeline[replayIndex]?.title ?? eventTimeline[0]?.title ?? "None"
        }`
      : "Operate the starter to build the replay timeline.";

  const canReplayPrev = eventTimeline.length > 0 && replayIndex > 0;
  const canReplayNext =
    eventTimeline.length > 0 && replayIndex < eventTimeline.length - 1;

  const canStartForward =
    mcbOn && !overloadTripped && !motorRunning && direction === "idle";

  const canStartReverse =
    mcbOn && !overloadTripped && !motorRunning && direction === "idle";

  const canStopStarter = motorRunning || direction !== "idle";
  const canTripStarter = mcbOn && !overloadTripped;

  const handleReplayToggle = useCallback(() => {
    setReplayState((state) => {
      if (eventTimeline.length === 0) return "idle";
      return state === "playing" ? "paused" : "playing";
    });
  }, [eventTimeline.length]);

  const handleReplayReset = useCallback(() => {
    setEventTimeline([]);
    setReplayIndex(0);
    setReplayState("idle");
    eventIdRef.current = 0;
  }, []);

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
            direction !== "idle" && motorRunning ? "is-live" : "is-idle"
          }`}
        >
          {modeLabel}
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
          disabled={!canStartForward}
          onClick={() => startDirection("forward")}
        >
          FWD
        </button>

        <button
          type="button"
          className="workspace-quickbar-button is-start"
          disabled={!canStartReverse}
          onClick={() => startDirection("reverse")}
        >
          REV
        </button>

        <button
          type="button"
          className="workspace-quickbar-button is-stop"
          disabled={!canStopStarter}
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
          disabled={!canTripStarter}
          onClick={handleFault}
        >
          Fault
        </button>
      </div>
    </div>
  );

  const sharedPanelProps = {
    onMcbToggle: handleMcbToggle,
    onForwardStart: () => startDirection("forward"),
    onReverseStart: () => startDirection("reverse"),
    onStop: handleStop,
    onReset: handleReset,
    onFault: handleFault,
    onRpmChange: handleRpmChange,
    onHorsepowerChange: handleHorsepowerChange,
    onCurrentLimitChange: handleCurrentLimitChange,
    onLoadChange: handleLoadChange,

    mcbOn,
    motorRunning,
    direction,
    overloadTripped,
    modeLabel,
    flowStateLabel: modeLabel,
    flowDescription,

    motorRpm,
    motorHorsepower,
    currentLimit,
    loadPercent,
    motorCurrent,
    motorSpeed,
    ratedCurrent,
    currentBand: currentBandLabel,
    currentMargin,
    currentLearningNote,
    tripReason,

    trainingMode,
    onTrainingModeChange: setTrainingMode,
    lessonStep: lessonStep + 1,
    lessonTotal: GUIDED_LESSONS.length,
    lessonTitle: lesson.title,
    lessonInstruction: lesson.instruction,
    lessonComplete,
    lessonResultText,
    lessonWhyText,
    onLessonNext: () =>
      setLessonStep((step) => Math.min(step + 1, GUIDED_LESSONS.length - 1)),
    onLessonPrev: () => setLessonStep((step) => Math.max(step - 1, 0)),
    canLessonNext,
    canLessonPrev,

    explanationTitle,
    activeComponentName,
    activeComponentFunction,
    currentPathText,

    componentStateBadges,
    componentFocusKey,
    componentFocusTitle: componentFocus.title,
    componentFocusBody: componentFocus.body,
    componentHelpOptions: [...componentHelpOptions],
    onComponentFocus: (key: string) => {
      if (key in COMPONENT_HELP) {
        setComponentFocusKey(key as keyof typeof COMPONENT_HELP);
      }
    },

    faultScenario,
    faultScenarioOptions: FAULT_SCENARIO_OPTIONS,
    onFaultScenarioChange: handleFaultScenarioChange,
    faultScenarioHint,

    eventTimeline,
    replayState,
    replaySummary,
    replayEventId,
    onReplayToggle: handleReplayToggle,
    onReplayReset: handleReplayReset,
    onReplayPrev: () => setReplayIndex((index) => Math.max(index - 1, 0)),
    onReplayNext: () =>
      setReplayIndex((index) =>
        Math.min(index + 1, Math.max(eventTimeline.length - 1, 0)),
      ),
    canReplayPrev,
    canReplayNext,
  };

  const sharedFullPanel = (
    <ReverseForwardControlPanel
      {...sharedPanelProps}
      showControlsSection={false}
    />
  );

  const sharedPowerPanel = (
    <ReverseForwardControlPanel
      {...sharedPanelProps}
      modeLabel={powerModeLabel}
      flowStateLabel={powerModeLabel}
      flowDescription={powerFlowDescription}
      explanationTitle={powerExplanationTitle}
      activeComponentName={powerActiveComponentName}
      activeComponentFunction={powerActiveComponentFunction}
      currentPathText={powerCurrentPathText}
      componentStateBadges={powerComponentStateBadges}
      componentFocusKey={powerComponentFocusKey}
      componentFocusTitle={powerComponentFocus.title}
      componentFocusBody={powerComponentFocus.body}
      componentHelpOptions={powerComponentHelpOptions}
      onComponentFocus={(key: string) => {
        if (key in POWER_COMPONENT_HELP) {
          setPowerComponentFocusKey(key as keyof typeof POWER_COMPONENT_HELP);
        }
      }}
      showControlsSection={false}
    />
  );

  const sharedCompactPanel = (
    <ReverseForwardControlPanel
      {...sharedPanelProps}
      compact
      showControlsSection={false}
    />
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

  const powerCanvas = (
    <ReverseForwardPowerDiagram
      className="project-workspace-power-embed"
      mccbOn={mcbOn}
      overloadTripped={overloadTripped}
      motorRunning={motorRunning}
      direction={direction}
      loadPercent={loadPercent}
      viewMode={canvasViewMode}
      showLabels={showDiagramLabels}
      showFlow={showDiagramFlow}
    />
  );

  const controlCanvas = (
    <ReverseForwardControlCircuit
      className="project-workspace-control-embed"
      mcbOn={mcbOn}
      overloadTripped={overloadTripped}
      motorRunning={motorRunning}
      direction={direction}
      forwardStartPressed={forwardStartPressed}
      reverseStartPressed={reverseStartPressed}
      stopPressed={stopPressed}
      componentStateBadges={componentStateBadges}
      viewMode={canvasViewMode}
      showLabels={showDiagramLabels}
      showFlow={showDiagramFlow}
    />
  );

  return (
    <ProjectWorkspaceTemplate
      badge="REV-FWD PROJECT"
      title="Reverse-Forward Motor Control Workspace"
      initialTabKey="control"
      headerActions={headerActions}
      tabs={[
        {
          key: "logic",
          label: "Logic & Theory",
          canvasTitle: "Logic & Theory",
          canvasContent: (
            <PlaceholderCanvas
              title="Reverse-forward starter learning area"
              copy="This tab can be used for direction-change theory, electrical interlocking, mechanical interlocking, and safe reversing sequence notes."
            />
          ),
          fullWidth: true,
        },
        {
          key: "power",
          label: "Power CKT",
          panelTitle: "Power Panel",
          canvasTitle: "Power CKT Canvas",
          layout: "stacked",
          canvasToolbar: diagramTools,
          panelContent: sharedPowerPanel,
          canvasContent: powerCanvas,
        },
        {
          key: "control",
          label: "Control CKT",
          panelTitle: "Control Panel",
          canvasTitle: "Control Circuit Canvas",
          layout: "stacked",
          canvasToolbar: diagramTools,
          panelContent: sharedFullPanel,
          canvasContent: controlCanvas,
        },
        {
          key: "power-control",
          label: "Power + Control CKT",
          canvasTitle: "Power CKT Canvas",
          secondaryCanvasTitle: "Control CKT Canvas",
          layout: "dual-stacked",
          panelTitle: "Control Panel",
          panelContent: sharedCompactPanel,
          canvasToolbar: diagramTools,
          secondaryCanvasToolbar: diagramTools,
          canvasContent: powerCanvas,
          secondaryCanvasContent: controlCanvas,
        },
      ]}
    />
  );
}
