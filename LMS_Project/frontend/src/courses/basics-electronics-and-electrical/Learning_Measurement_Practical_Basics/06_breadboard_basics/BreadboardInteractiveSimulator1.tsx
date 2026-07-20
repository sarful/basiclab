"use client";

import React, { useEffect, useMemo, useState } from "react";

import BreadboardPracticeCanvas from "./components/BreadboardPracticeCanvas";
import BreadboardSimulatorToolbar from "./components/BreadboardSimulatorToolbar";
import {
  createConnectionKey,
  simulatorOneChallenges,
  validateChallengeAction,
  type ValidationFeedback,
} from "./simulatorOneChallenges";
import {
  breadboardWireColors,
  createSimulatorOneHoles,
  type BreadboardHole,
  type BreadboardWire,
} from "./simulatorOneData";

const AUTO_ADVANCE_DELAY_MS = 1800;

const colorOptions = [
  { label: "Red jumper", value: breadboardWireColors[0] },
  { label: "Blue jumper", value: breadboardWireColors[1] },
  { label: "Green jumper", value: breadboardWireColors[2] },
  { label: "Yellow jumper", value: breadboardWireColors[3] },
  { label: "Black jumper", value: breadboardWireColors[4] },
] as const;

function createReadyFeedback(taskIndex: number): ValidationFeedback {
  return {
    allowCommit: false,
    detail: simulatorOneChallenges[taskIndex].detail,
    ok: false,
    title: "Ready to practice",
    tone: "info",
  };
}

function getNearestIncompleteTaskIndex(currentIndex: number, completedTaskIds: Set<string>) {
  for (let offset = 1; offset <= simulatorOneChallenges.length; offset += 1) {
    const candidateIndex = (currentIndex + offset) % simulatorOneChallenges.length;
    if (!completedTaskIds.has(simulatorOneChallenges[candidateIndex].id)) {
      return candidateIndex;
    }
  }

  return currentIndex;
}

function createStartSelectionFeedback(currentTaskInstruction: string, targetHoleLabel: string, isExpectedStart: boolean) {
  if (isExpectedStart) {
    return {
      allowCommit: false,
      detail: `Good start. Move to the next hole to complete this action: ${currentTaskInstruction.toLowerCase()}`,
      ok: false,
      title: "Start hole selected",
      tone: "info",
    } satisfies ValidationFeedback;
  }

  return {
    allowCommit: false,
    detail: `Selected ${targetHoleLabel}. For this task, begin from the highlighted start hole first.`,
    ok: false,
    title: "Check the start point",
    tone: "warning",
  } satisfies ValidationFeedback;
}

export default function BreadboardInteractiveSimulator() {
  const [selectedHoleId, setSelectedHoleId] = useState<string | null>(null);
  const [hoveredHoleId, setHoveredHoleId] = useState<string | null>(null);
  const [wireColor, setWireColor] = useState<string>(colorOptions[0].value);
  const [showGroups, setShowGroups] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [isCompactLayout, setIsCompactLayout] = useState(false);
  const [feedback, setFeedback] = useState<ValidationFeedback>(createReadyFeedback(0));
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [pendingAdvanceTaskId, setPendingAdvanceTaskId] = useState<string | null>(null);
  const [recentlyCompletedTaskId, setRecentlyCompletedTaskId] = useState<string | null>(null);
  const [identifiedTaskIds, setIdentifiedTaskIds] = useState<string[]>([]);
  const [history, setHistory] = useState<BreadboardWire[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const holes = useMemo(() => createSimulatorOneHoles(), []);

  const holeMap = useMemo(() => {
    const map = new Map<string, BreadboardHole>();
    holes.forEach((hole) => map.set(hole.id, hole));
    return map;
  }, [holes]);

  const wires = useMemo(() => history[historyIndex] ?? [], [history, historyIndex]);
  const currentTask = simulatorOneChallenges[currentTaskIndex];
  const selectedHole = selectedHoleId ? holeMap.get(selectedHoleId) ?? null : null;
  const hoveredHole = hoveredHoleId ? holeMap.get(hoveredHoleId) ?? null : null;
  const activeHole = hoveredHole ?? selectedHole;

  const connectedTaskIds = useMemo(
    () =>
      wires.reduce<Set<string>>((taskIds, wire) => {
        if (wire.taskId) taskIds.add(wire.taskId);
        return taskIds;
      }, new Set<string>()),
    [wires]
  );

  const completedTaskIds = useMemo(() => {
    const taskIds = new Set<string>(identifiedTaskIds);
    connectedTaskIds.forEach((taskId) => taskIds.add(taskId));
    return taskIds;
  }, [connectedTaskIds, identifiedTaskIds]);

  const activeGroupHoles = useMemo(() => {
    if (!activeHole || !showGroups) return [];
    return holes.filter((hole) => hole.group === activeHole.group);
  }, [activeHole, holes, showGroups]);

  const allTasksComplete = completedTaskIds.size === simulatorOneChallenges.length;
  const currentTaskComplete = completedTaskIds.has(currentTask.id);
  const score = completedTaskIds.size * 25;

  useEffect(() => {
    setWireColor(currentTask.preferredColor);
    setFeedback((currentValue) =>
      currentTaskComplete && currentValue.tone === "success" ? currentValue : createReadyFeedback(currentTaskIndex)
    );
    setShowHint(false);
    setSelectedHoleId(null);
    setHoveredHoleId(null);
  }, [currentTask.id, currentTask.preferredColor, currentTaskIndex, currentTaskComplete]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 640px)");

    function applyCompactState(matches: boolean) {
      setIsCompactLayout(matches);
      setShowLabels((currentValue) => (matches ? false : currentValue));
      setZoom((currentValue) => {
        if (matches) return currentValue > 0.88 ? 0.88 : currentValue;
        return currentValue < 1 ? 1 : currentValue;
      });
    }

    applyCompactState(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      applyCompactState(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!pendingAdvanceTaskId || !completedTaskIds.has(pendingAdvanceTaskId) || allTasksComplete) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPendingAdvanceTaskId(null);
      setCurrentTaskIndex((index) => getNearestIncompleteTaskIndex(index, completedTaskIds));
      setRecentlyCompletedTaskId(null);
    }, AUTO_ADVANCE_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [allTasksComplete, completedTaskIds, pendingAdvanceTaskId]);

  function pushWireHistory(nextWires: BreadboardWire[]) {
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(nextWires);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  }

  function clearAdvanceState() {
    setPendingAdvanceTaskId(null);
    setRecentlyCompletedTaskId(null);
  }

  function completeCurrentTask(validation: ValidationFeedback, nextWire?: BreadboardWire) {
    if (currentTask.type === "identify-connected") {
      setIdentifiedTaskIds((previous) =>
        previous.includes(currentTask.id) ? previous : [...previous, currentTask.id]
      );
    } else if (nextWire) {
      pushWireHistory([...wires, nextWire]);
    }

    setFeedback(validation);
    setSelectedHoleId(null);
    setHoveredHoleId(null);
    setShowHint(false);
    setRecentlyCompletedTaskId(currentTask.id);

    if (validation.autoAdvance && !allTasksComplete) {
      setPendingAdvanceTaskId(currentTask.id);
    }
  }

  function handleHoleSelection(id: string) {
    const hole = holeMap.get(id);
    if (!hole) return;

    clearAdvanceState();

    if (!selectedHole) {
      setSelectedHoleId(id);
      setFeedback(createStartSelectionFeedback(currentTask.instruction, hole.label, id === currentTask.startHole));
      return;
    }

    const validation = validateChallengeAction({
      fromHole: selectedHole,
      task: currentTask,
      toHole: hole,
      wires,
    });

    if (!validation.ok) {
      setFeedback(validation);
      return;
    }

    if (validation.allowCommit) {
      const nextWireKey = createConnectionKey(selectedHole.id, hole.id);
      const nextWire: BreadboardWire = {
        color: wireColor,
        from: selectedHole.id,
        id: `${currentTask.id}-${nextWireKey}`,
        taskId: currentTask.id,
        to: hole.id,
      };

      completeCurrentTask(validation, nextWire);
      return;
    }

    completeCurrentTask(validation);
  }

  function onUndo() {
    clearAdvanceState();
    if (historyIndex === 0) return;
    setHistoryIndex((value) => value - 1);
    setSelectedHoleId(null);
    setHoveredHoleId(null);
    setFeedback({
      allowCommit: false,
      detail: "The last jumper action was undone.",
      ok: false,
      title: "Undo complete",
      tone: "info",
    });
  }

  function onRedo() {
    clearAdvanceState();
    if (historyIndex >= history.length - 1) return;
    setHistoryIndex((value) => value + 1);
    setSelectedHoleId(null);
    setHoveredHoleId(null);
    setFeedback({
      allowCommit: false,
      detail: "The previous jumper action was restored.",
      ok: false,
      title: "Redo complete",
      tone: "info",
    });
  }

  function onClear() {
    clearAdvanceState();
    if (wires.length > 0) {
      pushWireHistory([]);
    }
    setIdentifiedTaskIds([]);
    setSelectedHoleId(null);
    setHoveredHoleId(null);
    setShowHint(false);
    setFeedback({
      allowCommit: false,
      detail: "All jumper wires and completed challenge states were cleared.",
      ok: false,
      title: "Workspace reset",
      tone: "info",
    });
  }

  function onResetTask() {
    clearAdvanceState();
    const filteredWires = wires.filter((wire) => wire.taskId !== currentTask.id);
    if (filteredWires.length !== wires.length) {
      pushWireHistory(filteredWires);
    }

    setIdentifiedTaskIds((previous) => previous.filter((taskId) => taskId !== currentTask.id));
    setSelectedHoleId(null);
    setHoveredHoleId(null);
    setShowHint(false);
    setFeedback({
      allowCommit: false,
      detail: `The progress for ${currentTask.title.toLowerCase()} was reset. Try it again from ${currentTask.startHole}.`,
      ok: false,
      title: "Current task reset",
      tone: "info",
    });
  }

  function onNextTask() {
    clearAdvanceState();
    if (allTasksComplete) {
      return;
    }

    setCurrentTaskIndex(getNearestIncompleteTaskIndex(currentTaskIndex, completedTaskIds));
  }

  const statusBanner =
    feedback.tone === "success" ? (
      <div className="mb-4 rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em]">Success</div>
            <div className="mt-1 text-sm font-semibold sm:text-base">{feedback.title}</div>
            <div className="mt-1 text-sm leading-6">{feedback.detail}</div>
          </div>
          {currentTaskComplete ? (
            <button
              type="button"
              onClick={onNextTask}
              className="rounded-xl border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
            >
              {allTasksComplete ? "View summary" : "Continue"}
            </button>
          ) : null}
        </div>
      </div>
    ) : null;

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto max-w-7xl space-y-3 md:space-y-4">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
          <div className="border-b border-slate-200 px-4 py-4 sm:px-5 md:px-6 md:py-5">
            <BreadboardSimulatorToolbar
              layout="top"
              primaryToggleLabel={showGroups ? "Hide connected groups" : "Show connected groups"}
              secondaryToggleLabel={showLabels ? "Hide guide labels" : "Show guide labels"}
              onClear={onClear}
              onTogglePrimary={() => setShowGroups((value) => !value)}
              onToggleSecondary={() => setShowLabels((value) => !value)}
              onZoomIn={() => setZoom((value) => Math.min(1.8, Number((value + 0.15).toFixed(2))))}
              onZoomOut={() => setZoom((value) => Math.max(0.75, Number((value - 0.15).toFixed(2))))}
              onZoomReset={() => setZoom(1)}
            />
          </div>

          <div className="px-2 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5">
            {statusBanner}

            <BreadboardPracticeCanvas
              activeGroupHoles={activeGroupHoles}
              currentTask={currentTask}
              hoveredHoleId={hoveredHoleId}
              holeMap={holeMap}
              holes={holes}
              isCompactLayout={isCompactLayout}
              recentlyCompletedTaskId={recentlyCompletedTaskId}
              selectedHoleId={selectedHoleId}
              showLabels={showLabels}
              wireColor={wireColor}
              wires={wires}
              zoom={zoom}
              onHoleActivate={handleHoleSelection}
              onHoleHover={setHoveredHoleId}
              onHoleLeave={(holeId) =>
                setHoveredHoleId((currentValue) => (currentValue === holeId ? null : currentValue))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
