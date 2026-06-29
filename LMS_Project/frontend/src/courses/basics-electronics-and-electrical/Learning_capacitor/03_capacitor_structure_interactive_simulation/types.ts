export type DielectricOption = {
  name: string;
  label: string;
  k: number;
  color: string;
  note: string;
};

export type StructureSnapshot = {
  capacitance: number;
  relativeEffect: number;
};

export type CapacitorLessonThreeSimulationProps = {
  embedded?: boolean;
};
