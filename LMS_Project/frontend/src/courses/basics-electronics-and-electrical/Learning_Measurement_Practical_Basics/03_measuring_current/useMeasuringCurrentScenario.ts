"use client";

import { useMemo, useState } from "react";

import type { MultimeterJackId } from "../01_what_is_a_multimeter/image_to_component_workspace/DigitalMultimeterProbeJacks";
import type { MultimeterDialStopId } from "../01_what_is_a_multimeter/image_to_component_workspace/DigitalMultimeterRotaryDial";
import { getMultimeterMode } from "../01_what_is_a_multimeter/image_to_component_workspace/multimeterModes";
import {
  measuringCurrentScenarios,
  type MeasuringCurrentProbeTargetId,
  type MeasuringCurrentScenarioId,
} from "./measuringCurrentScenarios";

const OMEGA = "\u03a9";

type UseMeasuringCurrentScenarioOptions = {
  blackLeadJack: MultimeterJackId;
  initialScenarioId?: MeasuringCurrentScenarioId;
  redLeadJack: MultimeterJackId;
  selectedDialStopId: MultimeterDialStopId;
};

export type MeasuringCurrentScenarioStatus =
  | "waiting_for_probes"
  | "ready"
  | "reversed_polarity"
  | "same_node"
  | "solved"
  | "wrong_dial_family"
  | "wrong_jack"
  | "wrong_range";

export type MeasuringCurrentMistakeBadge = {
  text: string;
  tone: "danger" | "info" | "warning";
};

export function useMeasuringCurrentScenario({
  blackLeadJack,
  initialScenarioId = measuringCurrentScenarios[0].id,
  redLeadJack,
  selectedDialStopId,
}: UseMeasuringCurrentScenarioOptions) {
  const initialScenarioIndex = Math.max(
    0,
    measuringCurrentScenarios.findIndex(
      (scenario) => scenario.id === initialScenarioId,
    ),
  );
  const [scenarioIndex, setScenarioIndex] = useState(initialScenarioIndex);
  const [redProbeTarget, setRedProbeTarget] =
    useState<MeasuringCurrentProbeTargetId | null>(null);
  const [blackProbeTarget, setBlackProbeTarget] =
    useState<MeasuringCurrentProbeTargetId | null>(null);

  const scenario = measuringCurrentScenarios[scenarioIndex];
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
  const isAcrossCorrectSeriesGap =
    redProbeTarget === "gap_left" && blackProbeTarget === "gap_right";
  const isPolarityReversed =
    redProbeTarget === "gap_right" && blackProbeTarget === "gap_left";
  const isSameNode =
    Boolean(redProbeTarget) &&
    Boolean(blackProbeTarget) &&
    redProbeTarget === blackProbeTarget;

  const status: MeasuringCurrentScenarioStatus = !areLeadJacksCorrect
    ? "wrong_jack"
    : !isDialFamilyCorrect
      ? "wrong_dial_family"
      : !isPreferredRangeSelected
        ? "wrong_range"
        : !areProbesPlaced
          ? "waiting_for_probes"
          : isSameNode
            ? "same_node"
            : isPolarityReversed
              ? "reversed_polarity"
              : isAcrossCorrectSeriesGap
                ? "solved"
                : "ready";

  const measuredDisplayValue = useMemo(() => {
    if (!areProbesPlaced) return "---";
    if (!areLeadJacksCorrect || !isDialFamilyCorrect) return "Err";
    if (!isPreferredRangeSelected) return scenario.expectedDisplayValue;
    if (isSameNode) return "0.00";
    if (isPolarityReversed) return `-${scenario.expectedDisplayValue}`;
    if (isAcrossCorrectSeriesGap) return scenario.expectedDisplayValue;

    return "0.00";
  }, [
    areLeadJacksCorrect,
    areProbesPlaced,
    isAcrossCorrectSeriesGap,
    isDialFamilyCorrect,
    isPolarityReversed,
    isPreferredRangeSelected,
    isSameNode,
    scenario.expectedDisplayValue,
  ]);

  const guidance = useMemo(() => {
    if (!isBlackJackCorrect) {
      return {
        checklist: [
          "Move the black lead to COM.",
          `Keep the red lead in ${scenario.expectedRedLeadJack === "jack_10a" ? "10A" : `V${OMEGA}mA`}.`,
          scenario.safetyHint,
        ],
        message: "Black lead placement is incorrect for this current test.",
        title: "Fix the black lead first",
      };
    }

    if (!isRedJackCorrect) {
      return {
        checklist: [
          `Move the red lead to ${scenario.expectedRedLeadJack === "jack_10a" ? "10A" : `V${OMEGA}mA`}.`,
          scenario.safetyHint,
          `After the current test, return the red lead to V${OMEGA}mA for general meter use.`,
        ],
        message: "Red lead jack selection is incorrect for this current range.",
        title: "Fix the red lead jack",
      };
    }

    if (!isDialFamilyCorrect) {
      return {
        checklist: [
          "Turn the dial to a DCA position.",
          `Preferred ranges: ${scenario.preferredDialStopIds.join(", ")}.`,
          scenario.teachingGoal,
        ],
        message: "Current measurement requires the DCA family, not voltage or ohms.",
        title: "Switch to DCA",
      };
    }

    if (!isPreferredRangeSelected) {
      return {
        checklist: [
          `Choose one of these ranges: ${scenario.preferredDialStopIds.join(", ")}.`,
          "Keep the circuit open at the measurement gap.",
          scenario.currentPathHint,
        ],
        message: "The meter family is correct, but the preferred current range is not selected yet.",
        title: "Choose the right current range",
      };
    }

    if (!areProbesPlaced) {
      return {
        checklist: [
          `Place the red probe on ${scenario.seriesGapLabels.left}.`,
          `Place the black probe on ${scenario.seriesGapLabels.right}.`,
          "The meter must bridge the open gap in series.",
        ],
        message: "Set the probes across the open series gap to begin reading current.",
        title: "Place the meter in series",
      };
    }

    if (isSameNode) {
      return {
        checklist: [
          "Move one probe to the opposite side of the open gap.",
          `Red should go on ${scenario.seriesGapLabels.left}.`,
          `Black should go on ${scenario.seriesGapLabels.right}.`,
        ],
        message: "Both probes are on the same node, so no current passes through the meter.",
        title: "Bridge the gap with both probes",
      };
    }

    if (isPolarityReversed) {
      return {
        checklist: [
          `Move the red probe to ${scenario.seriesGapLabels.left}.`,
          `Move the black probe to ${scenario.seriesGapLabels.right}.`,
          "This will keep the current reading positive.",
        ],
        message: "The series placement is correct, but the probe polarity is reversed.",
        title: "Swap the probe order",
      };
    }

    return {
      checklist: [
        `Expected reading: ${scenario.expectedDisplayValue}`,
        scenario.currentPathHint,
        "Current is measured in series, so the circuit must stay open and bridged through the meter.",
      ],
      message: "The meter is correctly inserted in series and ready to show current.",
      title: "Current setup is correct",
    };
  }, [
    areProbesPlaced,
    isBlackJackCorrect,
    isDialFamilyCorrect,
    isPolarityReversed,
    isPreferredRangeSelected,
    isRedJackCorrect,
    isSameNode,
    scenario.currentPathHint,
    scenario.expectedDisplayValue,
    scenario.expectedRedLeadJack,
    scenario.preferredDialStopIds,
    scenario.safetyHint,
    scenario.seriesGapLabels.left,
    scenario.seriesGapLabels.right,
    scenario.teachingGoal,
  ]);

  const mistakeBadges = useMemo<MeasuringCurrentMistakeBadge[]>(() => {
    const badges: MeasuringCurrentMistakeBadge[] = [];

    if (!isBlackJackCorrect) {
      badges.push({ text: "Move black lead to COM", tone: "danger" });
    }

    if (!isRedJackCorrect) {
      badges.push({
        text:
          scenario.expectedRedLeadJack === "jack_10a"
            ? "Move red lead to 10A"
            : `Keep red lead in V${OMEGA}mA`,
        tone: "danger",
      });
    }

    if (!isDialFamilyCorrect) {
      badges.push({ text: "Switch dial to DCA", tone: "danger" });
    }

    if (areLeadJacksCorrect && isDialFamilyCorrect && !isPreferredRangeSelected) {
      badges.push({ text: "Choose the preferred DCA range", tone: "warning" });
    }

    if (areLeadJacksCorrect && isDialFamilyCorrect && isPreferredRangeSelected) {
      if (!areProbesPlaced) {
        badges.push({ text: "Bridge the open series gap", tone: "info" });
      } else if (isSameNode) {
        badges.push({ text: "Place probes on opposite gap nodes", tone: "danger" });
      } else if (isPolarityReversed) {
        badges.push({ text: "Swap red and black probe order", tone: "warning" });
      }
    }

    return badges;
  }, [
    areLeadJacksCorrect,
    areProbesPlaced,
    isBlackJackCorrect,
    isDialFamilyCorrect,
    isPolarityReversed,
    isPreferredRangeSelected,
    isRedJackCorrect,
    isSameNode,
    scenario.expectedRedLeadJack,
  ]);

  function selectScenario(nextScenarioId: MeasuringCurrentScenarioId) {
    const nextIndex = measuringCurrentScenarios.findIndex(
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
    target: MeasuringCurrentProbeTargetId,
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
    isAcrossCorrectSeriesGap,
    isDialFamilyCorrect,
    isPolarityReversed,
    isPreferredRangeSelected,
    isSameNode,
    measuredDisplayValue,
    mistakeBadges,
    redProbeTarget,
    scenario,
    scenarioCount: measuringCurrentScenarios.length,
    scenarioIndex,
    selectScenario,
    selectedMode,
    setProbeTarget,
    status,
  };
}
