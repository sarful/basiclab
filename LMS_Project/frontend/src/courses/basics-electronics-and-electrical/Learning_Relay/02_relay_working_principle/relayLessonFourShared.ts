export type RelayContactMode = "auto" | "nc" | "no";
export type RelayTrainerControlMode = "onOff" | "timeline";

export type RelayLessonFourControls = {
  isCoilEnergized: boolean;
  contactMode: RelayContactMode;
  armatureProgress: number;
  controlMode: RelayTrainerControlMode;
  timelineStep: number;
  isTimelinePlaying: boolean;
  showLabels: boolean;
  showDebugDots: boolean;
  showBulbGlow: boolean;
};

export type RelayLessonFourDerivedState = {
  activeContact: "NC" | "NO";
  effectiveArmatureProgress: number;
  bulbActive: boolean;
};

export const DEFAULT_RELAY_LESSON_FOUR_CONTROLS: RelayLessonFourControls = {
  isCoilEnergized: false,
  contactMode: "auto",
  armatureProgress: 0,
  controlMode: "onOff",
  timelineStep: 0,
  isTimelinePlaying: false,
  showLabels: true,
  showDebugDots: false,
  showBulbGlow: true,
};

export const RELAY_WORKING_TIMELINE_STEPS = [
  {
    title: "Rest",
    description: "Coil is OFF, armature is released, and COM rests on NC.",
    isCoilEnergized: false,
    contactMode: "auto",
    armatureProgress: 0,
  },
  {
    title: "Coil ON",
    description: "Current starts flowing through the relay coil.",
    isCoilEnergized: true,
    contactMode: "nc",
    armatureProgress: 0.25,
  },
  {
    title: "Magnetic Field",
    description: "The energized coil builds magnetic pull around the core.",
    isCoilEnergized: true,
    contactMode: "nc",
    armatureProgress: 0.5,
  },
  {
    title: "Armature Moves",
    description: "The armature is pulled toward the relay core.",
    isCoilEnergized: true,
    contactMode: "no",
    armatureProgress: 0.78,
  },
  {
    title: "Output Changed",
    description: "The relay output changes after the armature completes its movement.",
    isCoilEnergized: true,
    contactMode: "no",
    armatureProgress: 1,
  },
] satisfies Array<{
  title: string;
  description: string;
  isCoilEnergized: boolean;
  contactMode: RelayContactMode;
  armatureProgress: number;
}>;

export function getRelayWorkingTimelineStep(index: number) {
  const safeIndex = Math.max(
    0,
    Math.min(RELAY_WORKING_TIMELINE_STEPS.length - 1, Math.round(index)),
  );
  return RELAY_WORKING_TIMELINE_STEPS[safeIndex];
}

export function clampProgress(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function getRelayLessonFourDerivedState(
  controls: RelayLessonFourControls,
): RelayLessonFourDerivedState {
  const baseProgress = controls.isCoilEnergized ? 1 : 0;
  const effectiveArmatureProgress =
    controls.contactMode === "auto"
      ? baseProgress
      : clampProgress(controls.armatureProgress);

  const activeContact =
    controls.contactMode === "nc"
      ? "NC"
      : controls.contactMode === "no"
        ? "NO"
        : controls.isCoilEnergized
          ? "NO"
          : "NC";

  return {
    activeContact,
    effectiveArmatureProgress,
    bulbActive: controls.showBulbGlow && activeContact === "NO",
  };
}
