"use client";

import { useEffect, useMemo, useState } from "react";

import ProjectWorkspaceTemplate from "../library/templates/ProjectWorkspaceTemplate";
import LinearPowerSupplyCircuit from "./LinearPowerSupplyCircuit";
import LinearPowerSupplyControlPanel, {
  LinearPowerSupplyWaveformPreview,
} from "./control_panel";
import LinearPowerSupplyTheory from "./LinearPowerSupplyTheory";

function pickStandardWattRating(requiredWatts: number) {
  const standardWatts = [0.125, 0.25, 0.5, 1, 2, 3, 5, 10];
  return (
    standardWatts.find((rating) => rating >= requiredWatts) ??
    standardWatts[standardWatts.length - 1]
  );
}

function pickStandardCapVoltage(requiredVoltage: number) {
  const standardVoltages = [6.3, 10, 16, 25, 35, 50, 63, 100];
  return (
    standardVoltages.find((rating) => rating >= requiredVoltage) ??
    standardVoltages[standardVoltages.length - 1]
  );
}

// Reuses the same stage-tool pattern as the motor starter workspaces.
function SimulationToolbar({
  scaleMode,
  showLabels,
  showFlow,
  onScaleModeChange,
  onToggleLabels,
  onToggleFlow,
}: {
  scaleMode: "fit" | "actual";
  showLabels: boolean;
  showFlow: boolean;
  onScaleModeChange: (mode: "fit" | "actual") => void;
  onToggleLabels: () => void;
  onToggleFlow: () => void;
}) {
  return (
    <div className="workspace-stage-tools">
      <button
        type="button"
        className={`workspace-stage-tool${scaleMode === "fit" ? " is-active" : ""}`}
        onClick={() => onScaleModeChange("fit")}
      >
        Fit
      </button>
      <button
        type="button"
        className={`workspace-stage-tool${scaleMode === "actual" ? " is-active" : ""}`}
        onClick={() => onScaleModeChange("actual")}
      >
        100%
      </button>
      <button
        type="button"
        className={`workspace-stage-tool${showLabels ? " is-active" : ""}`}
        onClick={onToggleLabels}
      >
        Labels
      </button>
      <button
        type="button"
        className={`workspace-stage-tool${showFlow ? " is-active" : ""}`}
        onClick={onToggleFlow}
      >
        Flow
      </button>
    </div>
  );
}

// Keeps the top operating strip visually consistent with the rest of the project family.
function HeaderActions({
  supplyOn,
  outputRunning,
  faultActive,
  onSupplyToggle,
  onStart,
  onStop,
  onReset,
  onFault,
}: {
  supplyOn: boolean;
  outputRunning: boolean;
  faultActive: boolean;
  onSupplyToggle: () => void;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onFault: () => void;
}) {
  return (
    <div className="workspace-quickbar">
      <div className="workspace-quickbar-status">
        <span
          className={`workspace-status-pill${supplyOn ? " is-live" : ""}`}
        >
          Supply {supplyOn ? "ON" : "OFF"}
        </span>
        <span
          className={`workspace-status-pill${
            outputRunning ? " is-live" : ""
          }`}
        >
          Output {outputRunning ? "RUN" : "STOP"}
        </span>
        <span
          className={`workspace-status-pill${faultActive ? "" : " is-live"}`}
        >
          Fault {faultActive ? "TRIP" : "OK"}
        </span>
      </div>
      <div className="workspace-quickbar-actions">
        <button
          type="button"
          className="workspace-quickbar-button is-mcb"
          onClick={onSupplyToggle}
        >
          Power {supplyOn ? "ON" : "OFF"}
        </button>
        <button
          type="button"
          className="workspace-quickbar-button is-start"
          onClick={onStart}
        >
          Start
        </button>
        <button
          type="button"
          className="workspace-quickbar-button is-stop"
          onClick={onStop}
        >
          Stop
        </button>
        <button
          type="button"
          className="workspace-quickbar-button is-reset"
          onClick={onReset}
        >
          Reset
        </button>
        <button
          type="button"
          className="workspace-quickbar-button is-fault"
          onClick={onFault}
        >
          Fault
        </button>
      </div>
    </div>
  );
}

export default function LinearPowerSupplyProjectWorkspace() {
  const [trainingMode, setTrainingMode] = useState<"free" | "guided">("free");
  const [supplyOn, setSupplyOn] = useState(false);
  const [outputRunning, setOutputRunning] = useState(false);
  const [faultActive, setFaultActive] = useState(false);
  const [primaryTurns, setPrimaryTurns] = useState(180);
  const [secondaryTurns, setSecondaryTurns] = useState(12);
  const [capacitorUf, setCapacitorUf] = useState(450);
  const [capacitorRatedVoltage, setCapacitorRatedVoltage] = useState(25);
  const [regulatorModel, setRegulatorModel] = useState<"7805" | "7809" | "7812">("7805");
  const [resistorOhms, setResistorOhms] = useState(100);
  const [ledColor, setLedColor] = useState<"green" | "yellow">("green");
  const [scaleMode, setScaleMode] = useState<"fit" | "actual">("fit");
  const [showLabels, setShowLabels] = useState(true);
  const [showFlow, setShowFlow] = useState(true);
  const [guidedLessonViewIndex, setGuidedLessonViewIndex] = useState(0);
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [timelinePlaying, setTimelinePlaying] = useState(false);

  const regulatorTargetVoltage =
    regulatorModel === "7805" ? 5 : regulatorModel === "7809" ? 9 : 12;
  const inputAcVoltage = 230;
  const secondaryVoltageValue =
    inputAcVoltage * (secondaryTurns / Math.max(primaryTurns, 1));
  const ledForwardDrop = ledColor === "green" ? 2.1 : 2.0;
  const recommendedIndicatorCurrent = 0.015;
  const assumedLoadCurrent =
    regulatorTargetVoltage > ledForwardDrop
      ? (regulatorTargetVoltage - ledForwardDrop) / Math.max(resistorOhms, 1)
      : 0;
  const rippleEstimateValue =
    supplyOn && capacitorUf > 0
      ? assumedLoadCurrent / (100 * (capacitorUf / 1_000_000))
      : 0;
  const rawRectifiedPeak = Math.max(secondaryVoltageValue * 1.414 - 0.7, 0);
  const capacitorBusVoltageValue = supplyOn
    ? Math.max(rawRectifiedPeak - rippleEstimateValue / 2, 0)
    : 0;
  const regulatorHeadroomOkay =
    capacitorBusVoltageValue >= regulatorTargetVoltage + 2;
  const regulatedOutputValue =
    !supplyOn || faultActive || !outputRunning
      ? 0
      : regulatorHeadroomOkay
        ? regulatorTargetVoltage
        : Math.max(capacitorBusVoltageValue - 2, 0);
  const actualLoadCurrent =
    regulatedOutputValue > ledForwardDrop
      ? (regulatedOutputValue - ledForwardDrop) / Math.max(resistorOhms, 1)
      : 0;
  const roundedRipple = Math.max(
    supplyOn ? Math.min(rippleEstimateValue, rawRectifiedPeak) : 0,
    0,
  );

  const handleSupplyToggle = () => {
    setSupplyOn((current) => {
      const next = !current;
      if (!next) {
        setOutputRunning(false);
      }
      return next;
    });
  };

  const handleStart = () => {
    if (!supplyOn || faultActive) {
      return;
    }
    setOutputRunning(true);
  };

  const handleStop = () => {
    setOutputRunning(false);
  };

  const handleReset = () => {
    setFaultActive(false);
    if (!supplyOn) {
      setOutputRunning(false);
    }
  };

  const handleFault = () => {
    setFaultActive(true);
    setOutputRunning(false);
  };

  const inputSupply = supplyOn ? "ON" : "OFF";
  const transformer = supplyOn
    ? `${secondaryVoltageValue.toFixed(1)} Vac Secondary`
    : "Idle";
  const rectifier = supplyOn
    ? `${rawRectifiedPeak.toFixed(1)} Vpk Raw DC`
    : "Waiting";
  const regulator = !supplyOn
    ? "Idle"
      : faultActive
      ? "Trip Hold"
      : !regulatorHeadroomOkay
        ? "Dropout Risk"
        : outputRunning
          ? `${regulatorModel} Regulating`
          : "Standby";
  const fault = faultActive ? "TRIP" : "OK";
  const outputVoltage = `${regulatedOutputValue.toFixed(1)} V`;
  const rippleLevel = !supplyOn
    ? "0.0 V"
    : `${roundedRipple.toFixed(2)} V`;
  const ledLoad = supplyOn && !faultActive && outputRunning ? "ON" : "OFF";
  const loadCurrent = `${Math.max(actualLoadCurrent * 1000, 0).toFixed(0)} mA`;
  const secondaryVoltage = `${secondaryVoltageValue.toFixed(1)} Vac`;
  const capacitorVoltage = `${capacitorBusVoltageValue.toFixed(1)} Vdc`;
  const capacitorRating = `${capacitorRatedVoltage.toFixed(
    capacitorRatedVoltage % 1 === 0 ? 0 : 1,
  )} V`;
  const capacitorUsageRatio =
    capacitorRatedVoltage > 0
      ? capacitorBusVoltageValue / capacitorRatedVoltage
      : 0;
  const capacitorSafety = !supplyOn
    ? "Idle"
    : capacitorUsageRatio >= 1
      ? "Over Voltage Risk"
      : capacitorUsageRatio >= 0.85
        ? "Near Limit"
        : "Safe";
  const targetRippleVoltage = Math.max(regulatorTargetVoltage * 0.1, 0.5);
  const recommendedCapVoltageValue = pickStandardCapVoltage(
    Math.max(rawRectifiedPeak * 1.25, 6.3),
  );
  const recommendedCapUfValue = Math.max(
    Math.ceil(
      ((recommendedIndicatorCurrent /
        (100 * Math.max(targetRippleVoltage, 0.1))) *
        1_000_000) /
        10,
    ) * 10,
    100,
  );
  const recommendedResistorOhmsValue =
    regulatorTargetVoltage > ledForwardDrop
      ? Math.max(
          Math.round(
            (regulatorTargetVoltage - ledForwardDrop) /
              recommendedIndicatorCurrent,
          ),
          1,
        )
      : resistorOhms;
  const resistorDissipationValue =
    recommendedIndicatorCurrent *
    recommendedIndicatorCurrent *
    recommendedResistorOhmsValue;
  const recommendedResistorWattValue = pickStandardWattRating(
    resistorDissipationValue * 2,
  );
  const recommendedCapVoltage = `${recommendedCapVoltageValue.toFixed(
    recommendedCapVoltageValue % 1 === 0 ? 0 : 1,
  )} V`;
  const recommendedCapacitance = `${recommendedCapUfValue} uF`;
  const recommendedResistorOhms = `${recommendedResistorOhmsValue} Ohm`;
  const recommendedResistorWatt = `${recommendedResistorWattValue} W`;
  const designFormulaItems = [
    {
      label: "Cap Voltage",
      formula: "Vrated ≈ Vpk x 1.25",
      value: `${rawRectifiedPeak.toFixed(1)} x 1.25 = ${recommendedCapVoltage}`,
    },
    {
      label: "Capacitance",
      formula: "C ≈ I / (f x Vripple)",
      value: `${Math.round(recommendedIndicatorCurrent * 1000)} mA / (100 x ${targetRippleVoltage.toFixed(1)} V) = ${recommendedCapacitance}`,
    },
    {
      label: "Resistor",
      formula: "R ≈ (Vout - Vled) / I",
      value: `(${regulatorTargetVoltage.toFixed(1)} - ${ledForwardDrop.toFixed(1)}) / ${Math.round(recommendedIndicatorCurrent * 1000)} mA = ${recommendedResistorOhms}`,
    },
    {
      label: "Resistor Watt",
      formula: "P ≈ I²R, then x2 margin",
      value: `${resistorDissipationValue.toFixed(3)} W x 2 = ${recommendedResistorWatt}`,
    },
  ];
  const normalizedDesignFormulaItems = designFormulaItems.map((item) => ({
    ...item,
    formula: item.formula
      .replaceAll("â‰ˆ", "~")
      .replaceAll("IÂ²", "I^2"),
  }));
  const guidedLessonSteps = [
    {
      title: "Turn Power ON",
      description:
        "Close the power first so the transformer primary can energize and the secondary side can begin supplying the rectifier stage.",
    },
    {
      title: "Check Transformer Output",
      description:
        "Confirm that the transformer is stepping the input down to a usable secondary AC voltage before any diode conduction begins.",
    },
    {
      title: "Observe D1 and D2 Rectification",
      description:
        "Watch the center-tap rectifier convert AC into pulsating DC by alternating conduction through D1 and D2.",
    },
    {
      title: "Charge the Filter Capacitor",
      description:
        "C2 stores energy on each peak and smooths the rectified waveform so the DC bus becomes steadier.",
    },
    {
      title: `Verify ${regulatorModel} Input`,
      description:
        `Check that the filtered DC bus stays high enough for the ${regulatorModel} to regulate correctly without dropout.`,
    },
    {
      title: "Start the Output Branch",
      description:
        `Enable the regulated branch and verify that R1 limits current while the ${ledColor} LED turns on from the regulated output.`,
    },
    {
      title: "Review Fault and Reset",
      description:
        "Study what happens during a fault condition, then reset the circuit and compare the normal and faulted behaviors.",
    },
  ];
  const currentGuidedStepIndex = faultActive
    ? 6
    : !supplyOn
      ? 0
      : !outputRunning
        ? 4
        : 5;

  useEffect(() => {
    setGuidedLessonViewIndex(currentGuidedStepIndex);
  }, [currentGuidedStepIndex, trainingMode]);

  const guidedLessonCard = guidedLessonSteps[guidedLessonViewIndex];
  const guidedLessonStatus = guidedLessonViewIndex < currentGuidedStepIndex
    ? "Done"
    : guidedLessonViewIndex === currentGuidedStepIndex
      ? !supplyOn && guidedLessonViewIndex === 0
        ? "Pending"
        : faultActive && guidedLessonViewIndex === 6
          ? "Review"
          : "Active"
      : "Pending";
  const guidedLesson = trainingMode === "guided"
    ? !supplyOn
    ? {
        currentStage: "Stage 1 - AC Input",
        lessonGoal: "Energize Transformer",
        nextStep: "Turn Supply On",
        learningNote:
          "The lesson begins at the AC source. With supply off, the transformer primary is idle, so no secondary voltage reaches D1 and D2. The student should first identify that every later stage depends on this input being energized.",
      }
    : faultActive
      ? {
          currentStage: "Stage 5 - Fault Hold",
          lessonGoal: "Understand Trip Response",
          nextStep: "Press Reset",
          learningNote:
            "A fault has interrupted the regulated output stage. This means the 7805 is no longer delivering a usable output to R1 and D4. Reset the circuit, then recheck the sequence: transformer -> rectifier -> capacitor -> regulator -> load.",
        }
      : outputRunning
        ? {
            currentStage: "Stage 4 - Regulated Output",
            lessonGoal: "Observe Stable 5V",
            nextStep: "Check Load Current",
            learningNote:
              "The transformer secondary is now rectified by D1 and D2, C2 has reduced ripple on the DC bus, and the 7805 is holding the output near 5V. At this stage the student should compare raw rectified DC versus regulated DC and observe why the LED branch receives a stable supply.",
          }
        : {
            currentStage: "Stage 3 - Filtered DC Ready",
            lessonGoal: "Start Regulator Output",
            nextStep: "Press Start",
            learningNote:
              "The transformer and rectifier are active, and C2 is smoothing the pulsating DC into a steadier input for the regulator. The next learning point is to start the output stage and observe how the 7805 converts this filtered input into a usable regulated output.",
          }
    : !supplyOn
      ? {
          currentStage: "Free Mode - Standby",
          lessonGoal: "Explore Supply Response",
          nextStep: "Toggle MCB",
          learningNote:
            "Free simulation is open-ended. Turn the supply on and watch the circuit transition from an idle source to an energized transformer and rectifier path without guided restrictions.",
        }
      : faultActive
        ? {
            currentStage: "Free Mode - Fault Active",
            lessonGoal: "Observe Protection Result",
            nextStep: "Reset or Re-run",
            learningNote:
              "A fault is active. In free mode you can reset, re-energize, and compare how the circuit behaves before and after the trip, especially at the regulator and load branch.",
          }
        : outputRunning
          ? {
              currentStage: "Free Mode - Output Running",
              lessonGoal: "Observe Stable Output",
              nextStep: "Compare Ripple",
              learningNote:
                "The output stage is running. Compare the regulated 5V result with the earlier stages: transformer AC, diode rectification, and capacitor smoothing. This is the best point to study why regulation improves output stability.",
            }
          : {
              currentStage: "Free Mode - Supply On",
              lessonGoal: "Start Output When Ready",
              nextStep: "Press Start",
              learningNote:
                "The rectifier and filter stages are energized. This is the point where the student can inspect the DC preparation stage before enabling the regulator and LED load branch.",
            };
  const componentLearning = !supplyOn
    ? {
        activeKey: "transformer",
        componentFocusTitle: "Transformer Primary",
        componentFocusBody:
          "The AC source energizes the transformer primary. This stage provides isolation and prepares a safer secondary voltage for rectification.",
        componentSummaryItems: [
          { label: "Transformer", value: "AC Step-Down" },
          { label: "D1 / D2", value: "Idle" },
          { label: "C2", value: "Uncharged" },
        ],
      }
    : faultActive
      ? {
          activeKey: "regulator",
          componentFocusTitle: "7805 Regulator",
          componentFocusBody:
            "The 7805 is the key regulated output stage. During a fault study, the student should observe that the load branch no longer receives a stable usable voltage.",
          componentSummaryItems: [
            { label: "7805", value: "Trip Hold" },
            { label: "R1", value: "Current Limit" },
            { label: "D4", value: "Load Off" },
          ],
        }
      : outputRunning
        ? {
            activeKey: "led",
            componentFocusTitle: "7805 and LED Output Branch",
            componentFocusBody:
              `The ${regulatorModel} stabilizes the filtered DC, R1 limits current, and the ${ledColor} LED provides a visible load indicator. This stage helps the student connect regulation with a practical output result.`,
            componentSummaryItems: [
              { label: regulatorModel, value: "Regulating" },
              { label: "R1", value: `${resistorOhms} Ohm Limit` },
              { label: "D4", value: `${ledColor} Load On` },
            ],
          }
        : {
            activeKey: "rectifier",
            componentFocusTitle: "D1 / D2 and C2 Filter",
            componentFocusBody:
              `D1 and D2 convert the transformer secondary into pulsating DC. C2 stores charge and smooths the waveform before it enters the ${regulatorModel}.`,
            componentSummaryItems: [
              { label: "D1 / D2", value: "Rectifying" },
              { label: "C2", value: `${capacitorUf} uF Smoothing` },
              { label: regulatorModel, value: "Standby" },
            ],
          };
  const componentLearningItems = [
    {
      key: "power",
      label: "Power",
      title: "Power Source",
      body: "The power input energizes the transformer primary. If the source is off, no downstream stage can produce secondary AC, rectified DC, or regulated output.",
    },
    {
      key: "transformer",
      label: "XFMR",
      title: "Transformer Center Tap",
      body: "The center-tapped transformer steps the mains voltage down and provides the two secondary halves needed for full-wave rectification with D1 and D2.",
    },
    {
      key: "rectifier",
      label: "D1 / D2",
      title: "Rectifier Diodes",
      body: "D1 and D2 alternate conduction on each half cycle. Together they convert the center-tapped AC into pulsating DC at the rectifier output node.",
    },
    {
      key: "capacitor",
      label: "C2",
      title: "Filter Capacitor",
      body: `C2 stores charge on the rectified peaks and reduces ripple on the DC bus. Larger capacitance generally improves smoothing but also changes charging current behavior.`,
    },
    {
      key: "regulator",
      label: regulatorModel,
      title: `${regulatorModel} Regulator`,
      body: `The ${regulatorModel} holds the output near its target voltage when the filtered DC bus stays above dropout headroom. If the input bus falls too low, the regulator can no longer maintain full output.`,
    },
    {
      key: "resistor",
      label: "R1",
      title: "Series Resistor",
      body: "R1 limits LED branch current. Its value directly affects load current, brightness, and resistor power dissipation.",
    },
    {
      key: "led",
      label: "D4",
      title: "LED Load",
      body: `D4 is the visible output indicator. The ${ledColor} LED only turns on when regulated output is present and the resistor allows safe current through the branch.`,
    },
  ];
  const componentStateBadges = [
    {
      label: "Transformer",
      value: supplyOn ? `${secondaryVoltageValue.toFixed(1)} Vac` : "Idle",
    },
    {
      label: "D1 / D2",
      value: supplyOn ? "Active" : "Idle",
    },
    {
      label: "C2",
      value: !supplyOn
        ? "Idle"
        : outputRunning
          ? `${capacitorUf} uF Smooth`
          : "Charging",
    },
    {
      label: regulatorModel,
      value: !supplyOn
        ? "Idle"
        : faultActive
          ? "Trip"
          : outputRunning
            ? `${regulatedOutputValue.toFixed(1)} V`
            : "Standby",
    },
    {
      label: "D4",
      value: faultActive
        ? "Trip"
        : outputRunning
          ? `${ledColor} On`
          : `${ledColor} Off`,
    },
  ];
  const circuitComponentStateBadges: Array<{
    key: string;
    label: string;
    state: string;
    tone: "neutral" | "active" | "fault";
  }> = [
    {
      key: "transformer",
      label: "XFMR",
      state: supplyOn ? `${secondaryVoltageValue.toFixed(1)} Vac` : "Idle",
      tone: supplyOn ? "active" : "neutral",
    },
    {
      key: "rectifier",
      label: "D1 / D2",
      state: supplyOn ? `${rawRectifiedPeak.toFixed(1)} Vpk` : "Open",
      tone: supplyOn ? "active" : "neutral",
    },
    {
      key: "capacitor",
      label: "C2",
      state: supplyOn ? `${capacitorBusVoltageValue.toFixed(1)} Vdc` : "0.0 V",
      tone: supplyOn ? "active" : "neutral",
    },
    {
      key: "regulator",
      label: regulatorModel,
      state: faultActive
        ? "Trip"
        : outputRunning
          ? `${regulatedOutputValue.toFixed(1)} V`
          : regulatorHeadroomOkay
            ? "Standby"
            : "Dropout",
      tone: faultActive
        ? "fault"
        : supplyOn && regulatorHeadroomOkay
          ? "active"
          : supplyOn
            ? "fault"
            : "neutral",
    },
    {
      key: "led",
      label: ledColor === "yellow" ? "LED YEL" : "LED GRN",
      state: outputRunning && !faultActive ? "On" : "Off",
      tone: faultActive
        ? "fault"
        : outputRunning
          ? "active"
          : "neutral",
    },
  ];
  const eventTimeline = useMemo(
    () => [
      {
        title: "Power Source",
        state: supplyOn ? "Closed" : "Open",
        description: supplyOn
          ? "AC input is feeding the transformer primary and the rectifier stage can begin operating."
          : "The power source is open, so the transformer and downstream stages remain de-energized.",
      },
      {
        title: "Transformer Secondary",
        state: supplyOn ? `${secondaryVoltageValue.toFixed(1)} Vac` : "Idle",
        description: supplyOn
          ? "The transformer steps the mains input down to a safer secondary voltage for rectification."
          : "No secondary voltage is available until the power input is turned on.",
      },
      {
        title: "Rectifier Stage",
        state: supplyOn ? "Pulsating DC" : "Waiting",
        description: supplyOn
          ? "D1 and D2 alternate conduction to convert the center-tapped AC into pulsating DC."
          : "The rectifier is waiting for AC from the transformer secondary.",
      },
      {
        title: "Filter Capacitor",
        state: supplyOn ? `${capacitorBusVoltageValue.toFixed(1)} Vdc` : "Uncharged",
        description: supplyOn
          ? `C2 stores charge and smooths the DC bus. Ripple is currently about ${roundedRipple.toFixed(2)} V.`
          : "The capacitor is discharged while the source is off.",
      },
      {
        title: regulatorModel,
        state: faultActive
          ? "Trip Hold"
          : outputRunning
            ? `${regulatedOutputValue.toFixed(1)} V`
            : regulatorHeadroomOkay
              ? "Standby"
              : "Dropout Risk",
        description: faultActive
          ? `The ${regulatorModel} output branch is faulted, so regulated output is being held off.`
          : outputRunning
            ? `The ${regulatorModel} is regulating the filtered input and supplying a stable output to the load branch.`
            : `The ${regulatorModel} is ready, but the output branch has not been started yet.`,
      },
      {
        title: "LED Load",
        state: outputRunning && !faultActive ? "On" : "Off",
        description: outputRunning && !faultActive
          ? `R1 is limiting current and the ${ledColor} LED load is energized at about ${Math.max(actualLoadCurrent * 1000, 0).toFixed(0)} mA.`
          : "The LED branch is not energized because the output stage is stopped or faulted.",
      },
    ],
    [
      actualLoadCurrent,
      capacitorBusVoltageValue,
      faultActive,
      ledColor,
      outputRunning,
      regulatorHeadroomOkay,
      regulatorModel,
      regulatedOutputValue,
      roundedRipple,
      secondaryVoltageValue,
      supplyOn,
    ],
  );

  useEffect(() => {
    if (!timelinePlaying) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimelineIndex((current) => {
        if (current >= eventTimeline.length - 1) {
          setTimelinePlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 1400);

    return () => window.clearInterval(timer);
  }, [eventTimeline.length, timelinePlaying]);

  const timelineEntries = eventTimeline.map((entry, index) => ({
    ...entry,
    time: `T+0${index + 1}`,
  }));

  return (
    <ProjectWorkspaceTemplate
      badge="LINEAR POWER SUPPLY"
      title="Linear Power Supply Project Workspace"
      initialTabKey="theory"
      headerActions={
        <HeaderActions
          supplyOn={supplyOn}
          outputRunning={outputRunning}
          faultActive={faultActive}
          onSupplyToggle={handleSupplyToggle}
          onStart={handleStart}
          onStop={handleStop}
          onReset={handleReset}
          onFault={handleFault}
        />
      }
      tabs={[
        // Theory stays full-width because this tab is intended for reading, not diagram interaction.
        {
          key: "theory",
          label: "Logic & Theory",
          canvasTitle: "Linear Power Supply Logic & Theory",
          fullWidth: true,
          canvasContent: <LinearPowerSupplyTheory />,
        },
        // Simulation uses the standard panel + canvas split so the circuit can be rebuilt incrementally.
        {
          key: "simulation",
          label: "Semulation CKT",
          canvasTitle: "Simulation CKT Canvas",
          canvasContent: (
            <div className="linear-power-supply-canvas-stack">
              <LinearPowerSupplyCircuit
                supplyOn={supplyOn}
                outputRunning={outputRunning}
                faultActive={faultActive}
                regulatorModel={regulatorModel}
                resistorOhms={resistorOhms}
                capacitorUf={capacitorUf}
                ledColor={ledColor}
                componentStateBadges={circuitComponentStateBadges}
                scaleMode={scaleMode}
                showLabels={showLabels}
                showFlow={showFlow}
              />
              <section className="linear-power-supply-waveform-panel">
                <div className="linear-power-supply-waveform-head">
                  <h3>Waveform Preview</h3>
                  <p>
                    Compare how the signal changes from AC input to regulated
                    DC output.
                  </p>
                </div>
                <LinearPowerSupplyWaveformPreview
                  supplyOn={supplyOn}
                  outputRunning={outputRunning}
                  faultActive={faultActive}
                  secondaryVoltage={secondaryVoltage}
                  rectifiedVoltage={`${rawRectifiedPeak.toFixed(1)} Vpk`}
                  filteredVoltage={capacitorVoltage}
                  regulatedVoltage={outputVoltage}
                  rippleLevel={rippleLevel}
                />
              </section>
            </div>
          ),
          canvasToolbar: (
            <SimulationToolbar
              scaleMode={scaleMode}
              showLabels={showLabels}
              showFlow={showFlow}
              onScaleModeChange={setScaleMode}
              onToggleLabels={() => setShowLabels((current) => !current)}
              onToggleFlow={() => setShowFlow((current) => !current)}
            />
          ),
          panelTitle: "Control Panel",
          panelContent: (
            <LinearPowerSupplyControlPanel
              trainingMode={trainingMode}
              onTrainingModeChange={setTrainingMode}
              supplyOn={supplyOn}
              outputRunning={outputRunning}
              faultActive={faultActive}
              primaryTurns={primaryTurns}
              secondaryTurns={secondaryTurns}
              onPrimaryTurnsChange={(value) =>
                setPrimaryTurns(Math.min(Math.max(value, 60), 400))
              }
              onSecondaryTurnsChange={(value) =>
                setSecondaryTurns(Math.min(Math.max(value, 5), 120))
              }
              capacitorUf={capacitorUf}
              onCapacitorUfChange={(value) =>
                setCapacitorUf(Math.min(Math.max(value, 47), 2200))
              }
              capacitorRatedVoltage={capacitorRatedVoltage}
              onCapacitorRatedVoltageChange={(value) =>
                setCapacitorRatedVoltage(Math.min(Math.max(value, 6.3), 100))
              }
              regulatorModel={regulatorModel}
              onRegulatorModelChange={setRegulatorModel}
              resistorOhms={resistorOhms}
              onResistorOhmsChange={(value) =>
                setResistorOhms(Math.min(Math.max(value, 47), 1000))
              }
              ledColor={ledColor}
              onLedColorChange={setLedColor}
              secondaryVoltage={secondaryVoltage}
              capacitorVoltage={capacitorVoltage}
              capacitorRating={capacitorRating}
              capacitorSafety={capacitorSafety}
              recommendedCapVoltage={recommendedCapVoltage}
              recommendedCapacitance={recommendedCapacitance}
              recommendedResistorOhms={recommendedResistorOhms}
              recommendedResistorWatt={recommendedResistorWatt}
              designFormulaItems={normalizedDesignFormulaItems}
              inputSupply={inputSupply}
              transformer={transformer}
              rectifier={rectifier}
              regulator={regulator}
              fault={fault}
              outputVoltage={outputVoltage}
              rippleLevel={rippleLevel}
              ledLoad={ledLoad}
              loadCurrent={loadCurrent}
              currentStage={guidedLesson.currentStage}
              lessonGoal={guidedLesson.lessonGoal}
              nextStep={guidedLesson.nextStep}
              learningNote={guidedLesson.learningNote}
              guidedStepLabel={`Step ${guidedLessonViewIndex + 1} / ${guidedLessonSteps.length}`}
              guidedStepStatus={guidedLessonStatus}
              guidedStepTitle={guidedLessonCard.title}
              guidedStepDescription={guidedLessonCard.description}
              onGuidedPrev={() =>
                setGuidedLessonViewIndex((current) => Math.max(current - 1, 0))
              }
              onGuidedNext={() =>
                setGuidedLessonViewIndex((current) =>
                  Math.min(current + 1, guidedLessonSteps.length - 1),
                )
              }
              canGuidedPrev={guidedLessonViewIndex > 0}
              canGuidedNext={guidedLessonViewIndex < guidedLessonSteps.length - 1}
              timelineHint="Use replay controls to walk through the power-conversion sequence again."
              timelinePlaying={timelinePlaying}
              timelineEntries={timelineEntries}
              timelineActiveIndex={timelineIndex}
              onTimelinePrev={() =>
                setTimelineIndex((current) => Math.max(current - 1, 0))
              }
              onTimelinePlay={() => setTimelinePlaying((current) => !current)}
              onTimelineNext={() =>
                setTimelineIndex((current) =>
                  Math.min(current + 1, eventTimeline.length - 1),
                )
              }
              onTimelineReset={() => {
                setTimelinePlaying(false);
                setTimelineIndex(0);
              }}
              canTimelinePrev={timelineIndex > 0}
              canTimelineNext={timelineIndex < eventTimeline.length - 1}
              componentLearningItems={componentLearningItems}
              componentLearningActiveKey={componentLearning.activeKey}
              componentFocusTitle={componentLearning.componentFocusTitle}
              componentFocusBody={componentLearning.componentFocusBody}
              componentSummaryItems={componentLearning.componentSummaryItems}
              componentStateBadges={componentStateBadges}
            />
          ),
          layout: "stacked",
        },
      ]}
    />
  );
}
