"use client";

import { useMemo, useState } from "react";

import type { MultimeterJackId } from "../01_what_is_a_multimeter/image_to_component_workspace/DigitalMultimeterProbeJacks";
import type { MultimeterDialStopId } from "../01_what_is_a_multimeter/image_to_component_workspace/DigitalMultimeterRotaryDial";
import {
  getMultimeterMode,
  validateMultimeterLeadSetup,
} from "../01_what_is_a_multimeter/image_to_component_workspace/multimeterModes";
import {
  measuringVoltageScenarios,
  type MeasuringVoltageScenarioId,
  type VoltageProbeTargetId,
} from "./measuringVoltageScenarios";

const OMEGA = "\u03a9";

type UseMeasuringVoltageScenarioOptions = {
  blackLeadJack: MultimeterJackId;
  initialBlackProbeTarget?: VoltageProbeTargetId | null;
  initialRedProbeTarget?: VoltageProbeTargetId | null;
  initialScenarioId?: MeasuringVoltageScenarioId;
  redLeadJack: MultimeterJackId;
  selectedDialStopId: MultimeterDialStopId;
};

export type MeasuringVoltageScenarioStatus =
  | "ready"
  | "solved"
  | "waiting_for_probes"
  | "wrong_dial_family"
  | "wrong_lead_setup";

export type MeasuringVoltageMistakeBadge = {
  text: string;
  tone: "danger" | "info" | "warning";
};

export function useMeasuringVoltageScenario({
  blackLeadJack,
  initialBlackProbeTarget = null,
  initialRedProbeTarget = null,
  initialScenarioId = measuringVoltageScenarios[0].id,
  redLeadJack,
  selectedDialStopId,
}: UseMeasuringVoltageScenarioOptions) {
  const initialScenarioIndex = Math.max(
    0,
    measuringVoltageScenarios.findIndex(
      (scenario) => scenario.id === initialScenarioId,
    ),
  );

  const [scenarioIndex, setScenarioIndex] = useState(initialScenarioIndex);
  const [redProbeTarget, setRedProbeTarget] =
    useState<VoltageProbeTargetId | null>(initialRedProbeTarget);
  const [blackProbeTarget, setBlackProbeTarget] =
    useState<VoltageProbeTargetId | null>(initialBlackProbeTarget);
  const [completedScenarioIds, setCompletedScenarioIds] = useState<
    MeasuringVoltageScenarioId[]
  >([]);

  const scenario = measuringVoltageScenarios[scenarioIndex];
  const selectedMode = useMemo(
    () => getMultimeterMode(selectedDialStopId),
    [selectedDialStopId],
  );
  const baseValidation = useMemo(
    () =>
      validateMultimeterLeadSetup({
        blackLeadJack,
        dialStopId: selectedDialStopId,
        redLeadJack,
      }),
    [blackLeadJack, redLeadJack, selectedDialStopId],
  );

  const positiveTerminal = scenario.terminals.find(
    (terminal) => terminal.role === "positive",
  );
  const referenceTerminal = scenario.terminals.find(
    (terminal) => terminal.role === "negative" || terminal.role === "reference",
  );

  const isDialFamilyCorrect =
    selectedMode.family === scenario.expectedDialFamily;
  const isPreferredRangeSelected = scenario.preferredDialStopIds.includes(
    selectedDialStopId,
  );
  const isBlackJackCorrect =
    blackLeadJack === scenario.expectedBlackLeadJack;
  const isRedJackCorrect = redLeadJack === scenario.expectedRedLeadJack;
  const areLeadJacksCorrect = isBlackJackCorrect && isRedJackCorrect;
  const areProbesPlaced = redProbeTarget !== null && blackProbeTarget !== null;
  const isAcrossCorrectTerminals =
    redProbeTarget === positiveTerminal?.id &&
    blackProbeTarget === referenceTerminal?.id;
  const isPolarityReversed =
    redProbeTarget === referenceTerminal?.id &&
    blackProbeTarget === positiveTerminal?.id;
  const isSameNodeCheck =
    areProbesPlaced && redProbeTarget === blackProbeTarget;

  const measuredDisplayValue = useMemo(() => {
    if (!areProbesPlaced) return "---";
    if (!areLeadJacksCorrect || !isDialFamilyCorrect) return "Err";
    if (isSameNodeCheck) return "0.00";
    if (isAcrossCorrectTerminals) return scenario.expectedDisplayValue;
    if (isPolarityReversed) {
      return scenario.reversePolarityDisplayValue ?? scenario.expectedDisplayValue;
    }

    return "0.00";
  }, [
    areLeadJacksCorrect,
    areProbesPlaced,
    isAcrossCorrectTerminals,
    isDialFamilyCorrect,
    isPolarityReversed,
    isSameNodeCheck,
    scenario.expectedDisplayValue,
    scenario.reversePolarityDisplayValue,
  ]);

  const status: MeasuringVoltageScenarioStatus = !areLeadJacksCorrect
    ? "wrong_lead_setup"
    : !isDialFamilyCorrect
      ? "wrong_dial_family"
      : !areProbesPlaced
        ? "waiting_for_probes"
        : isAcrossCorrectTerminals || isPolarityReversed
          ? "solved"
          : "ready";

  const effectiveCompletedScenarioIds =
    status === "solved" && !completedScenarioIds.includes(scenario.id)
      ? [...completedScenarioIds, scenario.id]
      : completedScenarioIds;
  const isCelebrationReady =
    status === "solved" && !completedScenarioIds.includes(scenario.id);

  const mistakeBadges = useMemo<MeasuringVoltageMistakeBadge[]>(() => {
    const badges: MeasuringVoltageMistakeBadge[] = [];

    if (!isBlackJackCorrect) {
      badges.push({
        text: "Move black lead to COM",
        tone: "danger",
      });
    }

    if (!isRedJackCorrect) {
      badges.push({
        text: `Keep red lead in V${OMEGA}mA`,
        tone: "danger",
      });
    }

    if (!isDialFamilyCorrect) {
      badges.push({
        text: `Switch dial to ${scenario.expectedDialFamily === "ac_voltage" ? "ACV" : "DCV"}`,
        tone: "danger",
      });
    }

    if (areProbesPlaced && isSameNodeCheck) {
      badges.push({
        text: "Place probes on two different terminals",
        tone: "warning",
      });
    }

    if (isPolarityReversed) {
      badges.push({
        text: "Swap red and black probe positions",
        tone: "info",
      });
    } else if (
      areProbesPlaced &&
      !isAcrossCorrectTerminals &&
      !isSameNodeCheck
    ) {
      badges.push({
        text: "Place probes across the intended two points",
        tone: "warning",
      });
    }

    return badges;
  }, [
    areProbesPlaced,
    isAcrossCorrectTerminals,
    isBlackJackCorrect,
    isDialFamilyCorrect,
    isPolarityReversed,
    isRedJackCorrect,
    isSameNodeCheck,
    scenario.expectedDialFamily,
  ]);

  const guidance = useMemo(() => {
    if (!areLeadJacksCorrect) {
      return {
        checklist: [
          `Move the black lead to ${scenario.expectedBlackLeadJack.replace("jack_", "").toUpperCase()}.`,
          `Move the red lead to ${scenario.expectedRedLeadJack.replace("jack_", "").replace("voma", `V${OMEGA}mA`).toUpperCase()}.`,
          scenario.safetyHint,
        ],
        message: baseValidation.message,
        title: "Fix the lead setup first",
      };
    }

    if (!isDialFamilyCorrect) {
      return {
        checklist: [
          `Choose the ${scenario.expectedDialFamily === "ac_voltage" ? "ACV" : "DCV"} family.`,
          isPreferredRangeSelected
            ? "Your range is already suitable for this source."
            : `Good training ranges: ${scenario.preferredDialStopIds.join(", ")}.`,
          scenario.teachingGoal,
        ],
        message: `This scenario expects ${scenario.expectedDialFamily === "ac_voltage" ? "AC voltage" : "DC voltage"} mode.`,
        title: "Switch to the correct voltage family",
      };
    }

    if (!areProbesPlaced) {
      return {
        checklist: [
          `Place the red probe on ${positiveTerminal?.label ?? "the positive point"}.`,
          `Place the black probe on ${referenceTerminal?.label ?? "the reference point"}.`,
          "Remember: voltage is measured across two points.",
        ],
        message:
          "The meter setup is safe. Now place the probes across the source terminals.",
        title: "Place the probes across the source",
      };
    }

    if (isAcrossCorrectTerminals) {
      return {
        checklist: [
          `Red probe is on ${positiveTerminal?.label ?? "the positive point"}.`,
          `Black probe is on ${referenceTerminal?.label ?? "the reference point"}.`,
          `Expected reading: ${scenario.expectedDisplayValue}`,
        ],
        message: "Great. The probes are across the correct two points.",
        title: "Voltage reading is correct",
      };
    }

    if (isPolarityReversed) {
      return {
        checklist: [
          "Reverse the probes if you want a positive display for this DC-style source.",
          `Expected reversed reading: ${scenario.reversePolarityDisplayValue ?? scenario.expectedDisplayValue}`,
          scenario.teachingGoal,
        ],
        message:
          "The probes are on the correct two terminals, but polarity is reversed.",
        title: "Reading is valid but polarity is reversed",
      };
    }

    return {
      checklist: [
        "Move the probes to the two source terminals.",
        "Place the red probe on the positive or live point.",
        "Place the black probe on the negative, neutral, or reference point.",
      ],
      message:
        "The meter is ready, but the probes are not yet across the intended measurement points.",
      title: "Probe placement still needs correction",
    };
  }, [
    areLeadJacksCorrect,
    areProbesPlaced,
    baseValidation.message,
    isAcrossCorrectTerminals,
    isDialFamilyCorrect,
    isPolarityReversed,
    isPreferredRangeSelected,
    positiveTerminal?.label,
    referenceTerminal?.label,
    scenario.expectedBlackLeadJack,
    scenario.expectedDialFamily,
    scenario.expectedDisplayValue,
    scenario.expectedRedLeadJack,
    scenario.preferredDialStopIds,
    scenario.reversePolarityDisplayValue,
    scenario.safetyHint,
    scenario.teachingGoal,
  ]);

  function captureScenarioCompletion() {
    if (status !== "solved") return;

    setCompletedScenarioIds((current) =>
      current.includes(scenario.id) ? current : [...current, scenario.id],
    );
  }

  function selectScenario(nextScenarioId: MeasuringVoltageScenarioId) {
    captureScenarioCompletion();

    const nextIndex = measuringVoltageScenarios.findIndex(
      (item) => item.id === nextScenarioId,
    );

    if (nextIndex < 0) return;

    setScenarioIndex(nextIndex);
    setRedProbeTarget(null);
    setBlackProbeTarget(null);
  }

  function resetScenario() {
    setRedProbeTarget(null);
    setBlackProbeTarget(null);
  }

  function resetProgress() {
    setCompletedScenarioIds([]);
    setRedProbeTarget(null);
    setBlackProbeTarget(null);
    setScenarioIndex(0);
  }

  return {
    areLeadJacksCorrect,
    areProbesPlaced,
    blackProbeTarget,
    completedScenarioCount: effectiveCompletedScenarioIds.length,
    completedScenarioIds: effectiveCompletedScenarioIds,
    guidance,
    isAcrossCorrectTerminals,
    isCelebrationReady,
    isDialFamilyCorrect,
    isPolarityReversed,
    isPreferredRangeSelected,
    isScenarioCompleted: effectiveCompletedScenarioIds.includes(scenario.id),
    measuredDisplayValue,
    mistakeBadges,
    redProbeTarget,
    resetProgress,
    resetScenario,
    scenario,
    scenarioCount: measuringVoltageScenarios.length,
    scenarioIndex,
    scorePercent: Math.round(
      (effectiveCompletedScenarioIds.length / measuringVoltageScenarios.length) *
        100,
    ),
    selectScenario,
    setBlackProbeTarget,
    setRedProbeTarget,
    status,
  };
}
