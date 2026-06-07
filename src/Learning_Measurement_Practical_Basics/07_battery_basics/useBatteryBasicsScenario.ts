"use client";

import { useMemo, useState } from "react";

import type { MultimeterJackId } from "../01_what_is_a_multimeter/image_to_component_workspace/DigitalMultimeterProbeJacks";
import type { MultimeterDialStopId } from "../01_what_is_a_multimeter/image_to_component_workspace/DigitalMultimeterRotaryDial";
import {
  getMultimeterMode,
  validateMultimeterLeadSetup,
} from "../01_what_is_a_multimeter/image_to_component_workspace/multimeterModes";
import {
  batteryBasicsScenarios,
  type BatteryBasicsScenarioId,
  type BatteryProbeTargetId,
} from "./batteryBasicsScenarios";

const OMEGA = "\u03A9";

type UseBatteryBasicsScenarioOptions = {
  blackLeadJack: MultimeterJackId;
  initialScenarioId?: BatteryBasicsScenarioId;
  redLeadJack: MultimeterJackId;
  selectedDialStopId: MultimeterDialStopId;
};

export type BatteryBasicsScenarioStatus =
  | "ready"
  | "same_node"
  | "solved"
  | "waiting_for_probes"
  | "wrong_dial_family"
  | "wrong_lead_setup";

export type BatteryMistakeBadge = {
  text: string;
  tone: "danger" | "info" | "warning";
};

export function useBatteryBasicsScenario({
  blackLeadJack,
  initialScenarioId = batteryBasicsScenarios[0].id,
  redLeadJack,
  selectedDialStopId,
}: UseBatteryBasicsScenarioOptions) {
  const initialScenarioIndex = Math.max(
    0,
    batteryBasicsScenarios.findIndex(
      (scenario) => scenario.id === initialScenarioId,
    ),
  );

  const [scenarioIndex, setScenarioIndex] = useState(initialScenarioIndex);
  const [redProbeTarget, setRedProbeTarget] =
    useState<BatteryProbeTargetId | null>(null);
  const [blackProbeTarget, setBlackProbeTarget] =
    useState<BatteryProbeTargetId | null>(null);

  const scenario = batteryBasicsScenarios[scenarioIndex];
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

  const status: BatteryBasicsScenarioStatus = !areLeadJacksCorrect
    ? "wrong_lead_setup"
    : !isDialFamilyCorrect
      ? "wrong_dial_family"
      : !areProbesPlaced
        ? "waiting_for_probes"
        : isSameNode
          ? "same_node"
          : isSolvedPair
            ? "solved"
            : "ready";

  const guidance = useMemo(() => {
    if (!areLeadJacksCorrect) {
      return {
        checklist: [
          "Move the black lead to COM.",
          `Move the red lead to V${OMEGA}mA.`,
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
        message: "Battery basics uses a DC voltage range, not ACV, resistance, or current mode.",
        title: "Switch to DCV",
      };
    }

    if (!areProbesPlaced) {
      return {
        checklist: [
          "Place the red probe on the battery positive terminal.",
          "Place the black probe on the battery negative terminal.",
          "Keep the probe tips separated so they do not short together.",
        ],
        message: "The meter setup is ready. Now measure across the battery terminals.",
        title: "Place the probes across the battery",
      };
    }

    if (isSameNode) {
      return {
        checklist: [
          "Move one probe to the opposite terminal.",
          "Battery voltage is measured across + and -.",
          scenario.teachingGoal,
        ],
        message: "Both probes are on the same terminal, so the meter cannot compare battery voltage.",
        title: "Use both battery terminals",
      };
    }

    if (isSolvedPair) {
      return {
        checklist: [
          `Expected reading: ${scenario.expectedDisplayValue}`,
          scenario.health === "low"
            ? "This lower reading suggests the battery is weak."
            : scenario.health === "fresh"
              ? "This reading is healthy for the battery training example."
              : "This demo intentionally uses reversed polarity as the target.",
          scenario.teachingGoal,
        ],
        message: "The battery reading matches the current learning target.",
        title: "Battery reading is correct",
      };
    }

    if (isOppositePair) {
      return {
        checklist: [
          `Current reversed reading: ${scenario.reverseDisplayValue}`,
          "Swap red and black if you want the opposite sign.",
          "A negative sign is normal when the probe polarity is reversed on a DC battery.",
        ],
        message: "The probes are reversed relative to the target battery polarity.",
        title: "Reversed polarity detected",
      };
    }

    return {
      checklist: [
        "Move the probes to the battery + and - terminals.",
        "Red usually goes to +.",
        "Black usually goes to -.",
      ],
      message:
        "The meter is ready, but the probes are not yet on the intended battery terminals.",
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
    scenario.expectedDisplayValue,
    scenario.health,
    scenario.preferredDialStopIds,
    scenario.reverseDisplayValue,
    scenario.safetyHint,
    scenario.teachingGoal,
  ]);

  const mistakeBadges = useMemo<BatteryMistakeBadge[]>(() => {
    const badges: BatteryMistakeBadge[] = [];

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
      badges.push({ text: "Use both battery terminals", tone: "warning" });
    }
    if (isOppositePair) {
      badges.push({ text: "Probe polarity is reversed", tone: "info" });
    }
    if (scenario.health === "low" && isSolvedPair) {
      badges.push({ text: "Battery looks weak", tone: "warning" });
    }

    return badges;
  }, [
    areProbesPlaced,
    isBlackJackCorrect,
    isDialFamilyCorrect,
    isOppositePair,
    isRedJackCorrect,
    isSameNode,
    isSolvedPair,
    scenario.health,
  ]);

  function selectScenario(nextScenarioId: BatteryBasicsScenarioId) {
    const nextIndex = batteryBasicsScenarios.findIndex(
      (item) => item.id === nextScenarioId,
    );

    if (nextIndex < 0) return;

    setScenarioIndex(nextIndex);
    setRedProbeTarget(null);
    setBlackProbeTarget(null);
  }

  function setProbeTarget(
    probe: "red" | "black",
    target: BatteryProbeTargetId,
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
    scenarioCount: batteryBasicsScenarios.length,
    scenarioIndex,
    selectScenario,
    selectedMode,
    setProbeTarget,
    status,
  };
}

