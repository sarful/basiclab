"use client";

import { useMemo, useState } from "react";

import type { MultimeterJackId } from "../01_what_is_a_multimeter/image_to_component_workspace/DigitalMultimeterProbeJacks";
import type { MultimeterDialStopId } from "../01_what_is_a_multimeter/image_to_component_workspace/DigitalMultimeterRotaryDial";
import { getMultimeterMode } from "../01_what_is_a_multimeter/image_to_component_workspace/multimeterModes";
import {
  measuringResistanceScenarios,
  type MeasuringResistanceScenarioId,
  type ResistanceProbeTargetId,
} from "./measuringResistanceScenarios";

const OMEGA = "\u03a9";

type UseMeasuringResistanceScenarioOptions = {
  blackLeadJack: MultimeterJackId;
  initialScenarioId?: MeasuringResistanceScenarioId;
  redLeadJack: MultimeterJackId;
  selectedDialStopId: MultimeterDialStopId;
};

export type MeasuringResistanceScenarioStatus =
  | "waiting_for_probes"
  | "ready"
  | "same_node"
  | "solved"
  | "wrong_dial_family"
  | "wrong_jack"
  | "wrong_range";

export type MeasuringResistanceMistakeBadge = {
  text: string;
  tone: "danger" | "info" | "warning";
};

export function useMeasuringResistanceScenario({
  blackLeadJack,
  initialScenarioId = measuringResistanceScenarios[0].id,
  redLeadJack,
  selectedDialStopId,
}: UseMeasuringResistanceScenarioOptions) {
  const initialScenarioIndex = Math.max(
    0,
    measuringResistanceScenarios.findIndex(
      (scenario) => scenario.id === initialScenarioId,
    ),
  );
  const [scenarioIndex, setScenarioIndex] = useState(initialScenarioIndex);
  const [redProbeTarget, setRedProbeTarget] =
    useState<ResistanceProbeTargetId | null>(null);
  const [blackProbeTarget, setBlackProbeTarget] =
    useState<ResistanceProbeTargetId | null>(null);

  const scenario = measuringResistanceScenarios[scenarioIndex];
  const selectedMode = useMemo(
    () => getMultimeterMode(selectedDialStopId),
    [selectedDialStopId],
  );

  const isDialFamilyCorrect =
    selectedMode.family === scenario.expectedDialFamily;
  const isBlackJackCorrect = blackLeadJack === scenario.expectedBlackLeadJack;
  const isRedJackCorrect = redLeadJack === scenario.expectedRedLeadJack;
  const areLeadJacksCorrect = isBlackJackCorrect && isRedJackCorrect;
  const isPreferredRangeSelected = scenario.preferredDialStopIds.includes(
    selectedDialStopId,
  );
  const areProbesPlaced = Boolean(redProbeTarget && blackProbeTarget);
  const isAcrossResistor =
    redProbeTarget === "terminal_left" && blackProbeTarget === "terminal_right";
  const isAcrossResistorReversed =
    redProbeTarget === "terminal_right" && blackProbeTarget === "terminal_left";
  const isSameNode =
    Boolean(redProbeTarget) &&
    Boolean(blackProbeTarget) &&
    redProbeTarget === blackProbeTarget;

  const status: MeasuringResistanceScenarioStatus = !areLeadJacksCorrect
    ? "wrong_jack"
    : !isDialFamilyCorrect
      ? "wrong_dial_family"
      : !isPreferredRangeSelected
        ? "wrong_range"
        : !areProbesPlaced
          ? "waiting_for_probes"
          : isSameNode
            ? "same_node"
            : isAcrossResistor || isAcrossResistorReversed
              ? "solved"
              : "ready";

  const measuredDisplayValue = useMemo(() => {
    if (!areProbesPlaced) return "---";
    if (!areLeadJacksCorrect || !isDialFamilyCorrect) return "Err";
    if (!isPreferredRangeSelected) return scenario.expectedDisplayValue;
    if (isSameNode) return "0.00";
    if (isAcrossResistor || isAcrossResistorReversed) {
      return scenario.expectedDisplayValue;
    }
    return "---";
  }, [
    areLeadJacksCorrect,
    areProbesPlaced,
    isAcrossResistor,
    isAcrossResistorReversed,
    isDialFamilyCorrect,
    isPreferredRangeSelected,
    isSameNode,
    scenario.expectedDisplayValue,
  ]);

  const guidance = useMemo(() => {
    if (!isBlackJackCorrect) {
      return {
        checklist: [
          "Move the black lead to COM.",
          `Keep the red lead in V${OMEGA}mA.`,
          scenario.safetyHint,
        ],
        message: "Black lead placement is incorrect for resistance measurement.",
        title: "Fix the black lead first",
      };
    }

    if (!isRedJackCorrect) {
      return {
        checklist: [
          `Move the red lead to V${OMEGA}mA.`,
          "Do not use the 10A jack for resistance checks.",
          scenario.safetyHint,
        ],
        message: "Red lead jack selection is incorrect for resistance mode.",
        title: "Fix the red lead jack",
      };
    }

    if (!isDialFamilyCorrect) {
      return {
        checklist: [
          "Turn the dial to an ohms position.",
          `Preferred ranges: ${scenario.preferredDialStopIds.join(", ")}.`,
          scenario.teachingGoal,
        ],
        message: "Resistance measurement requires the ohms family, not voltage or current.",
        title: "Switch to Ω mode",
      };
    }

    if (!isPreferredRangeSelected) {
      return {
        checklist: [
          `Choose one of these ranges: ${scenario.preferredDialStopIds.join(", ")}.`,
          "Keep power removed from the circuit.",
          "Measure directly across both resistor terminals.",
        ],
        message: "The meter family is correct, but the preferred resistance range is not selected yet.",
        title: "Choose the right Ω range",
      };
    }

    if (!areProbesPlaced) {
      return {
        checklist: [
          `Place the red probe on ${scenario.terminalLabels.left}.`,
          `Place the black probe on ${scenario.terminalLabels.right}.`,
          "Measure across the resistor, not on the same side.",
        ],
        message: "Place one probe on each resistor lead to begin the resistance reading.",
        title: "Probe across the resistor",
      };
    }

    if (isSameNode) {
      return {
        checklist: [
          "Move one probe to the opposite resistor lead.",
          `Red can go on ${scenario.terminalLabels.left}.`,
          `Black can go on ${scenario.terminalLabels.right}.`,
        ],
        message: "Both probes are touching the same node, so the meter is not measuring across the resistor.",
        title: "Bridge both resistor leads",
      };
    }

    return {
      checklist: [
        `Expected reading: ${scenario.expectedDisplayValue}`,
        "Power must stay off during resistance measurement.",
        "One probe on each resistor terminal gives the true ohms reading.",
      ],
      message: "The meter is set correctly and the probes are across the resistor.",
      title: "Resistance setup is correct",
    };
  }, [
    areProbesPlaced,
    isBlackJackCorrect,
    isDialFamilyCorrect,
    isPreferredRangeSelected,
    isRedJackCorrect,
    isSameNode,
    scenario.expectedDisplayValue,
    scenario.preferredDialStopIds,
    scenario.safetyHint,
    scenario.teachingGoal,
    scenario.terminalLabels.left,
    scenario.terminalLabels.right,
  ]);

  const mistakeBadges = useMemo<MeasuringResistanceMistakeBadge[]>(() => {
    const badges: MeasuringResistanceMistakeBadge[] = [];

    if (!isBlackJackCorrect) {
      badges.push({ text: "Move black lead to COM", tone: "danger" });
    }
    if (!isRedJackCorrect) {
      badges.push({ text: `Keep red lead in V${OMEGA}mA`, tone: "danger" });
    }
    if (!isDialFamilyCorrect) {
      badges.push({ text: "Switch dial to Ω", tone: "danger" });
    }
    if (areLeadJacksCorrect && isDialFamilyCorrect && !isPreferredRangeSelected) {
      badges.push({ text: "Choose the preferred Ω range", tone: "warning" });
    }
    if (areLeadJacksCorrect && isDialFamilyCorrect && isPreferredRangeSelected) {
      if (!areProbesPlaced) {
        badges.push({ text: "Place probes across the resistor", tone: "info" });
      } else if (isSameNode) {
        badges.push({ text: "Use opposite resistor terminals", tone: "danger" });
      }
    }

    return badges;
  }, [
    areLeadJacksCorrect,
    areProbesPlaced,
    isBlackJackCorrect,
    isDialFamilyCorrect,
    isPreferredRangeSelected,
    isRedJackCorrect,
    isSameNode,
  ]);

  function selectScenario(nextScenarioId: MeasuringResistanceScenarioId) {
    const nextIndex = measuringResistanceScenarios.findIndex(
      (item) => item.id === nextScenarioId,
    );

    if (nextIndex >= 0) {
      setScenarioIndex(nextIndex);
      setRedProbeTarget(null);
      setBlackProbeTarget(null);
    }
  }

  function setProbeTarget(
    probe: "red" | "black",
    target: ResistanceProbeTargetId,
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
    isAcrossResistor,
    isDialFamilyCorrect,
    isPreferredRangeSelected,
    isSameNode,
    measuredDisplayValue,
    mistakeBadges,
    redProbeTarget,
    scenario,
    scenarioCount: measuringResistanceScenarios.length,
    scenarioIndex,
    selectScenario,
    selectedMode,
    setProbeTarget,
    status,
  };
}
