"use client";

import { useMemo, useState } from "react";

import type { MultimeterJackId } from "../01_what_is_a_multimeter/image_to_component_workspace/DigitalMultimeterProbeJacks";
import type { MultimeterDialStopId } from "../01_what_is_a_multimeter/image_to_component_workspace/DigitalMultimeterRotaryDial";
import { getMultimeterMode } from "../01_what_is_a_multimeter/image_to_component_workspace/multimeterModes";
import {
  continuityTestScenarios,
  type ContinuityProbeTargetId,
  type ContinuityTestScenarioId,
} from "./continuityTestScenarios";

const OMEGA = "\u03a9";

type UseContinuityTestScenarioOptions = {
  blackLeadJack: MultimeterJackId;
  initialScenarioId?: ContinuityTestScenarioId;
  redLeadJack: MultimeterJackId;
  selectedDialStopId: MultimeterDialStopId;
};

export type ContinuityTestScenarioStatus =
  | "waiting_for_probes"
  | "ready"
  | "same_node"
  | "solved"
  | "wrong_dial_family"
  | "wrong_jack";

export type ContinuityMistakeBadge = {
  text: string;
  tone: "danger" | "info" | "warning";
};

export function useContinuityTestScenario({
  blackLeadJack,
  initialScenarioId = continuityTestScenarios[0].id,
  redLeadJack,
  selectedDialStopId,
}: UseContinuityTestScenarioOptions) {
  const initialScenarioIndex = Math.max(
    0,
    continuityTestScenarios.findIndex(
      (scenario) => scenario.id === initialScenarioId,
    ),
  );
  const [scenarioIndex, setScenarioIndex] = useState(initialScenarioIndex);
  const [redProbeTarget, setRedProbeTarget] =
    useState<ContinuityProbeTargetId | null>(null);
  const [blackProbeTarget, setBlackProbeTarget] =
    useState<ContinuityProbeTargetId | null>(null);

  const scenario = continuityTestScenarios[scenarioIndex];
  const selectedMode = useMemo(
    () => getMultimeterMode(selectedDialStopId),
    [selectedDialStopId],
  );

  const isDialFamilyCorrect =
    selectedMode.family === scenario.expectedDialFamily;
  const isBlackJackCorrect = blackLeadJack === scenario.expectedBlackLeadJack;
  const isRedJackCorrect = redLeadJack === scenario.expectedRedLeadJack;
  const areLeadJacksCorrect = isBlackJackCorrect && isRedJackCorrect;
  const areProbesPlaced = Boolean(redProbeTarget && blackProbeTarget);
  const isAcrossPath =
    (redProbeTarget === "point_a" && blackProbeTarget === "point_b") ||
    (redProbeTarget === "point_b" && blackProbeTarget === "point_a");
  const isSameNode =
    Boolean(redProbeTarget) &&
    Boolean(blackProbeTarget) &&
    redProbeTarget === blackProbeTarget;

  const status: ContinuityTestScenarioStatus = !areLeadJacksCorrect
    ? "wrong_jack"
    : !isDialFamilyCorrect
      ? "wrong_dial_family"
      : !areProbesPlaced
        ? "waiting_for_probes"
        : isSameNode
          ? "same_node"
          : isAcrossPath
            ? "solved"
            : "ready";

  const continuityDetected =
    status === "solved" && scenario.pathState === "closed";

  const measuredDisplayValue = useMemo(() => {
    if (!areProbesPlaced) return "---";
    if (!areLeadJacksCorrect || !isDialFamilyCorrect) return "Err";
    if (isSameNode) return "---";
    if (!isAcrossPath) return "---";
    return scenario.pathState === "closed" ? "0.00" : "---";
  }, [
    areLeadJacksCorrect,
    areProbesPlaced,
    isAcrossPath,
    isDialFamilyCorrect,
    isSameNode,
    scenario.pathState,
  ]);

  const guidance = useMemo(() => {
    if (!isBlackJackCorrect) {
      return {
        checklist: [
          "Move the black lead to COM.",
          `Keep the red lead in V${OMEGA}mA.`,
          scenario.safetyHint,
        ],
        message: "Black lead placement is incorrect for continuity testing.",
        title: "Fix the black lead first",
      };
    }

    if (!isRedJackCorrect) {
      return {
        checklist: [
          `Move the red lead to V${OMEGA}mA.`,
          "Do not use the 10A jack for continuity checks.",
          scenario.safetyHint,
        ],
        message: "Red lead jack selection is incorrect for continuity mode.",
        title: "Fix the red lead jack",
      };
    }

    if (!isDialFamilyCorrect) {
      return {
        checklist: [
          "Turn the dial to the diode / continuity-style position.",
          "This function is used for continuity-style checks in this trainer.",
          scenario.teachingGoal,
        ],
        message: "Continuity testing uses the diode / continuity-style function, not voltage or ohms.",
        title: "Switch to continuity mode",
      };
    }

    if (!areProbesPlaced) {
      return {
        checklist: [
          `Place the red probe on ${scenario.terminalLabels.left}.`,
          `Place the black probe on ${scenario.terminalLabels.right}.`,
          "Touch one probe to each test point.",
        ],
        message: "Place the probes on both test points to check continuity.",
        title: "Probe both test points",
      };
    }

    if (isSameNode) {
      return {
        checklist: [
          "Move one probe to the opposite continuity point.",
          `Use ${scenario.terminalLabels.left} and ${scenario.terminalLabels.right}.`,
          "The meter must test across the path.",
        ],
        message: "Both probes are on the same point, so the meter is not checking the path.",
        title: "Use opposite test points",
      };
    }

    if (scenario.pathState === "closed") {
      return {
        checklist: [
          "The path is closed, so continuity should be detected.",
          "A near-zero reading indicates a continuous path.",
          "This is the condition that would usually beep on a real meter.",
        ],
        message: "Continuity is present across the tested path.",
        title: "Closed path detected",
      };
    }

    return {
      checklist: [
        "The path is open, so continuity should not be detected.",
        "No beep / no continuity reading means the break is still present.",
        "This is expected for an open fuse or open conductor.",
      ],
      message: "No continuity is present across the tested path.",
      title: "Open path confirmed",
    };
  }, [
    areProbesPlaced,
    isBlackJackCorrect,
    isDialFamilyCorrect,
    isRedJackCorrect,
    isSameNode,
    scenario.pathState,
    scenario.safetyHint,
    scenario.teachingGoal,
    scenario.terminalLabels.left,
    scenario.terminalLabels.right,
  ]);

  const mistakeBadges = useMemo<ContinuityMistakeBadge[]>(() => {
    const badges: ContinuityMistakeBadge[] = [];

    if (!isBlackJackCorrect) {
      badges.push({ text: "Move black lead to COM", tone: "danger" });
    }
    if (!isRedJackCorrect) {
      badges.push({ text: `Keep red lead in V${OMEGA}mA`, tone: "danger" });
    }
    if (!isDialFamilyCorrect) {
      badges.push({ text: "Switch dial to continuity", tone: "danger" });
    }
    if (areLeadJacksCorrect && isDialFamilyCorrect) {
      if (!areProbesPlaced) {
        badges.push({ text: "Touch both continuity points", tone: "info" });
      } else if (isSameNode) {
        badges.push({ text: "Use opposite test points", tone: "danger" });
      } else if (scenario.pathState === "closed") {
        badges.push({ text: "Closed path should beep", tone: "warning" });
      } else {
        badges.push({ text: "Open path should stay silent", tone: "warning" });
      }
    }

    return badges;
  }, [
    areLeadJacksCorrect,
    areProbesPlaced,
    isBlackJackCorrect,
    isDialFamilyCorrect,
    isRedJackCorrect,
    isSameNode,
    scenario.pathState,
  ]);

  function selectScenario(nextScenarioId: ContinuityTestScenarioId) {
    const nextIndex = continuityTestScenarios.findIndex(
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
    target: ContinuityProbeTargetId,
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
    continuityDetected,
    guidance,
    isDialFamilyCorrect,
    isSameNode,
    measuredDisplayValue,
    mistakeBadges,
    redProbeTarget,
    scenario,
    scenarioCount: continuityTestScenarios.length,
    scenarioIndex,
    selectScenario,
    selectedMode,
    setProbeTarget,
    status,
  };
}
