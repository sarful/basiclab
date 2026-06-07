"use client";

import { useMemo, useState } from "react";

import type { MultimeterJackId } from "../01_what_is_a_multimeter/image_to_component_workspace/DigitalMultimeterProbeJacks";
import type { MultimeterDialStopId } from "../01_what_is_a_multimeter/image_to_component_workspace/DigitalMultimeterRotaryDial";
import {
  getMultimeterMode,
  validateMultimeterLeadSetup,
} from "../01_what_is_a_multimeter/image_to_component_workspace/multimeterModes";
import {
  polarityAndGroundScenarios,
  type PolarityAndGroundScenarioId,
  type PolarityProbeTargetId,
} from "./polarityAndGroundScenarios";

const OMEGA = "\u03A9";

type UsePolarityAndGroundScenarioOptions = {
  blackLeadJack: MultimeterJackId;
  initialScenarioId?: PolarityAndGroundScenarioId;
  redLeadJack: MultimeterJackId;
  selectedDialStopId: MultimeterDialStopId;
};

export type PolarityAndGroundScenarioStatus =
  | "ready"
  | "solved"
  | "waiting_for_probes"
  | "wrong_dial_family"
  | "wrong_lead_setup";

export type PolarityMistakeBadge = {
  text: string;
  tone: "danger" | "info" | "warning";
};

export function usePolarityAndGroundScenario({
  blackLeadJack,
  initialScenarioId = polarityAndGroundScenarios[0].id,
  redLeadJack,
  selectedDialStopId,
}: UsePolarityAndGroundScenarioOptions) {
  const initialScenarioIndex = Math.max(
    0,
    polarityAndGroundScenarios.findIndex(
      (scenario) => scenario.id === initialScenarioId,
    ),
  );

  const [scenarioIndex, setScenarioIndex] = useState(initialScenarioIndex);
  const [redProbeTarget, setRedProbeTarget] =
    useState<PolarityProbeTargetId | null>(null);
  const [blackProbeTarget, setBlackProbeTarget] =
    useState<PolarityProbeTargetId | null>(null);

  const scenario = polarityAndGroundScenarios[scenarioIndex];
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

  const isDialFamilyCorrect =
    selectedMode.family === scenario.expectedDialFamily;
  const isBlackJackCorrect =
    blackLeadJack === scenario.expectedBlackLeadJack;
  const isRedJackCorrect = redLeadJack === scenario.expectedRedLeadJack;
  const areLeadJacksCorrect = isBlackJackCorrect && isRedJackCorrect;
  const areProbesPlaced = redProbeTarget !== null && blackProbeTarget !== null;
  const isSameNode =
    areProbesPlaced && redProbeTarget === blackProbeTarget;
  const isSolvedPair =
    redProbeTarget === scenario.targetRedTerminalId &&
    blackProbeTarget === scenario.targetBlackTerminalId;
  const isOppositePair =
    redProbeTarget === scenario.targetBlackTerminalId &&
    blackProbeTarget === scenario.targetRedTerminalId;

  const measuredDisplayValue = useMemo(() => {
    if (!areProbesPlaced) return "---";
    if (!areLeadJacksCorrect || !isDialFamilyCorrect) return "Err";
    if (isSameNode) return "0.00";
    if (isSolvedPair) return scenario.expectedDisplayValue;
    if (isOppositePair) return scenario.reverseDisplayValue;

    return "0.00";
  }, [
    areLeadJacksCorrect,
    areProbesPlaced,
    isDialFamilyCorrect,
    isOppositePair,
    isSameNode,
    isSolvedPair,
    scenario.expectedDisplayValue,
    scenario.reverseDisplayValue,
  ]);

  const status: PolarityAndGroundScenarioStatus = !areLeadJacksCorrect
    ? "wrong_lead_setup"
    : !isDialFamilyCorrect
      ? "wrong_dial_family"
      : !areProbesPlaced
        ? "waiting_for_probes"
        : isSolvedPair
          ? "solved"
          : "ready";

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
          "Choose the DCV family.",
          `Good training ranges: ${scenario.preferredDialStopIds.join(", ")}.`,
          scenario.teachingGoal,
        ],
        message: "This lesson expects DC voltage mode for polarity and ground reference practice.",
        title: "Switch to DCV",
      };
    }

    if (!areProbesPlaced) {
      return {
        checklist: [
          `Place the red probe on ${scenario.terminals.find((terminal) => terminal.id === scenario.targetRedTerminalId)?.label ?? "the correct point"}.`,
          `Place the black probe on ${scenario.terminals.find((terminal) => terminal.id === scenario.targetBlackTerminalId)?.label ?? "the reference point"}.`,
          "Watch whether the reading becomes positive or negative.",
        ],
        message: "The meter setup is ready. Now place the probes to test polarity or ground reference.",
        title: "Place the probes on the source",
      };
    }

    if (isSameNode) {
      return {
        checklist: [
          "Move one probe to the opposite terminal.",
          "The meter must compare two different points.",
          scenario.teachingGoal,
        ],
        message: "Both probes are on the same point, so polarity cannot be determined.",
        title: "Use two different points",
      };
    }

    if (isSolvedPair) {
      return {
        checklist: [
          `Expected reading: ${scenario.expectedDisplayValue}`,
          "Red and black are on the intended polarity or ground-reference points.",
          scenario.teachingGoal,
        ],
        message: "The probes are placed correctly for this polarity or ground scenario.",
        title: "Reading matches the target setup",
      };
    }

    if (isOppositePair) {
      return {
        checklist: [
          `Current reversed reading: ${scenario.reverseDisplayValue}`,
          "Swap the probes if you want the opposite sign.",
          "This negative sign is useful for learning polarity direction.",
        ],
        message: "The probes are reversed relative to the target polarity.",
        title: "Reversed polarity detected",
      };
    }

    return {
      checklist: [
        "Move the probes to the labeled source terminals.",
        "Use black on the reference or negative side.",
        "Use red on the positive side unless the lesson asks for reversed polarity.",
      ],
      message:
        "The meter is ready, but the probes are not yet on the intended terminals.",
      title: "Probe placement still needs correction",
    };
  }, [
    areLeadJacksCorrect,
    areProbesPlaced,
    baseValidation.message,
    isDialFamilyCorrect,
    isOppositePair,
    isSameNode,
    isSolvedPair,
    scenario.expectedBlackLeadJack,
    scenario.expectedDisplayValue,
    scenario.expectedRedLeadJack,
    scenario.preferredDialStopIds,
    scenario.reverseDisplayValue,
    scenario.safetyHint,
    scenario.targetBlackTerminalId,
    scenario.targetRedTerminalId,
    scenario.teachingGoal,
    scenario.terminals,
  ]);

  const mistakeBadges = useMemo<PolarityMistakeBadge[]>(() => {
    const badges: PolarityMistakeBadge[] = [];

    if (!isBlackJackCorrect) {
      badges.push({ text: "Move black lead to COM", tone: "danger" });
    }
    if (!isRedJackCorrect) {
      badges.push({ text: `Keep red lead in V${OMEGA}mA`, tone: "danger" });
    }
    if (!isDialFamilyCorrect) {
      badges.push({ text: "Switch dial to DCV", tone: "danger" });
    }
    if (areProbesPlaced && isSameNode) {
      badges.push({ text: "Use two different source points", tone: "warning" });
    }
    if (isOppositePair) {
      badges.push({ text: "Probe polarity is reversed", tone: "info" });
    }

    return badges;
  }, [
    areProbesPlaced,
    isBlackJackCorrect,
    isDialFamilyCorrect,
    isOppositePair,
    isRedJackCorrect,
    isSameNode,
  ]);

  function selectScenario(nextScenarioId: PolarityAndGroundScenarioId) {
    const nextIndex = polarityAndGroundScenarios.findIndex(
      (item) => item.id === nextScenarioId,
    );

    if (nextIndex < 0) return;

    setScenarioIndex(nextIndex);
    setRedProbeTarget(null);
    setBlackProbeTarget(null);
  }

  function setProbeTarget(
    probe: "red" | "black",
    target: PolarityProbeTargetId,
  ) {
    if (probe === "red") {
      setRedProbeTarget((current) => (current === target ? null : target));
      return;
    }

    setBlackProbeTarget((current) => (current === target ? null : target));
  }

  function clearProbeTargets() {
    setRedProbeTarget(null);
    setBlackProbeTarget(null);
  }

  return {
    areLeadJacksCorrect,
    areProbesPlaced,
    blackProbeTarget,
    clearProbeTargets,
    guidance,
    isDialFamilyCorrect,
    isOppositePair,
    isSameNode,
    measuredDisplayValue,
    mistakeBadges,
    redProbeTarget,
    scenario,
    scenarioCount: polarityAndGroundScenarios.length,
    scenarioIndex,
    selectScenario,
    selectedMode,
    setProbeTarget,
    status,
  };
}

