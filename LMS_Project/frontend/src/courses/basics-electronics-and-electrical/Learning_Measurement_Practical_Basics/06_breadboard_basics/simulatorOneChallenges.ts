import type { BreadboardHole, BreadboardWire } from "./simulatorOneData";

export type BreadboardChallengeTask = {
  detail: string;
  hint: string;
  id: string;
  instruction: string;
  preferredColor: string;
  startHole: string;
  successText: string;
  title: string;
  type: "connect-specific" | "rail-to-terminal" | "bridge-gap" | "identify-connected";
  validTargets: string[];
};

export type ValidationFeedback = {
  allowCommit: boolean;
  autoAdvance?: boolean;
  detail: string;
  ok: boolean;
  title: string;
  tone: "error" | "info" | "success" | "warning";
};

export const simulatorOneChallenges: BreadboardChallengeTask[] = [
  {
    detail:
      "A jumper is needed because A8 and A14 are on different columns, so the breadboard does not connect them internally.",
    hint: "Start on A8, then move across to column 14. Same row letter does not mean the holes are already connected.",
    id: "specific-jumper",
    instruction: "Connect a jumper wire between A8 and A14.",
    preferredColor: "#ef4444",
    startHole: "A8",
    successText: "You created a valid jumper between two separate terminal columns.",
    title: "Task 1: Specific jumper",
    type: "connect-specific",
    validTargets: ["A14"],
  },
  {
    detail:
      "A power rail feeds many points, but the rail is separate from the terminal strips until you add a jumper wire.",
    hint: "Start at Top + rail 8. Any one of A8, B8, C8, D8, or E8 reaches the same top terminal group.",
    id: "rail-to-row",
    instruction: "Connect Top + rail 8 to the terminal row for column 8.",
    preferredColor: "#ef4444",
    startHole: "TP8",
    successText: "You linked the positive rail to the column 8 terminal strip.",
    title: "Task 2: Rail to row",
    type: "rail-to-terminal",
    validTargets: ["A8", "B8", "C8", "D8", "E8"],
  },
  {
    detail:
      "The center gap breaks the connection between the top and bottom terminal strips. A jumper across the gap is required.",
    hint: "Use E20 and F20. They are in the same column but separated by the breadboard center gap.",
    id: "bridge-gap",
    instruction: "Bridge the center gap by connecting E20 to F20.",
    preferredColor: "#2563eb",
    startHole: "E20",
    successText: "You correctly bridged the breadboard center gap.",
    title: "Task 3: Across the center gap",
    type: "bridge-gap",
    validTargets: ["F20"],
  },
  {
    detail:
      "On this breadboard, A-E in the same numbered column are internally connected. F-J are a separate group below the center gap.",
    hint: "Click C30 first, then choose A30, B30, D30, or E30. Do not place a wire across to F30-J30.",
    id: "identify-group",
    instruction: "Find a hole internally connected to C30.",
    preferredColor: "#22c55e",
    startHole: "C30",
    successText: "You identified a hole in the same internal connection group.",
    title: "Task 4: Identify connected holes",
    type: "identify-connected",
    validTargets: ["A30", "B30", "D30", "E30"],
  },
];

export function createConnectionKey(from: string, to: string) {
  return [from, to].sort().join("::");
}

export function validateChallengeAction({
  fromHole,
  task,
  toHole,
  wires,
}: {
  fromHole: BreadboardHole;
  task: BreadboardChallengeTask;
  toHole: BreadboardHole;
  wires: BreadboardWire[];
}): ValidationFeedback {
  if (fromHole.id === toHole.id) {
    return {
      allowCommit: false,
      detail: "Choose a second hole to create a jumper or test a connected group.",
      ok: false,
      title: "Same node selected",
      tone: "warning",
    };
  }

  if (
    task.type !== "identify-connected" &&
    wires.some((wire) => createConnectionKey(wire.from, wire.to) === createConnectionKey(fromHole.id, toHole.id))
  ) {
    return {
      allowCommit: false,
      detail: "That jumper already exists. Use Undo, Redo, or choose a different pair of holes.",
      ok: false,
      title: "Invalid duplicate connection",
      tone: "error",
    };
  }

  if (task.type === "identify-connected") {
    if (fromHole.id !== task.startHole && toHole.id !== task.startHole) {
      return {
        allowCommit: false,
        detail: `Start from ${task.startHole} so you can compare one hole against its internal connection group.`,
        ok: false,
        title: "Wrong start hole",
        tone: "warning",
      };
    }

    const candidate = fromHole.id === task.startHole ? toHole : fromHole;

    if (task.validTargets.includes(candidate.id)) {
      return {
        allowCommit: false,
        autoAdvance: true,
        detail: task.successText,
        ok: true,
        title: "Correct connection group",
        tone: "success",
      };
    }

    return {
      allowCommit: false,
      detail:
        "That hole is not in the same internal terminal strip. Only A-E in column 30 are connected to C30.",
      ok: false,
      title: "Wrong row",
      tone: "error",
    };
  }

  const matchesTarget =
    (fromHole.id === task.startHole && task.validTargets.includes(toHole.id)) ||
    (toHole.id === task.startHole && task.validTargets.includes(fromHole.id));

  if (matchesTarget) {
    return {
      allowCommit: true,
      autoAdvance: true,
      detail: task.successText,
      ok: true,
      title: "Correct connection",
      tone: "success",
    };
  }

  if (task.type === "rail-to-terminal") {
    const usesRail = fromHole.id === task.startHole || toHole.id === task.startHole;
    if (!usesRail) {
      return {
        allowCommit: false,
        detail: "Begin from the highlighted positive rail hole so you can feed the correct terminal strip.",
        ok: false,
        title: "Wrong rail",
        tone: "warning",
      };
    }

    return {
      allowCommit: false,
      detail:
        "Use a hole in column 8 on rows A-E. Those five holes share the same internal terminal strip group.",
      ok: false,
      title: "Wrong row",
      tone: "error",
    };
  }

  if (task.type === "bridge-gap") {
    const sameColumn = fromHole.column === toHole.column;
    const crossesGap =
      (fromHole.groupType === "terminal-top" && toHole.groupType === "terminal-bottom") ||
      (fromHole.groupType === "terminal-bottom" && toHole.groupType === "terminal-top");

    if (sameColumn && !crossesGap) {
      return {
        allowCommit: false,
        detail: "You stayed on one side of the board. To bridge the gap, jump from the top strip to the bottom strip.",
        ok: false,
        title: "Center gap not crossed",
        tone: "error",
      };
    }

    if (crossesGap && !sameColumn) {
      return {
        allowCommit: false,
        detail: "You crossed the gap, but not in the required column. Use column 20 on both sides of the gap.",
        ok: false,
        title: "Wrong column",
        tone: "error",
      };
    }
  }

  if (fromHole.group === toHole.group) {
    return {
      allowCommit: false,
      detail:
        "Those holes are already internally connected on the breadboard, so a jumper wire is unnecessary here.",
      ok: false,
      title: "Already connected internally",
      tone: "warning",
    };
  }

  return {
    allowCommit: false,
    detail: task.detail,
    ok: false,
    title: "Wrong row",
    tone: "error",
  };
}
