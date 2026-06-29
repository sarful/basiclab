export type DielectricOption = {
  name: string;
  label: string;
  k: number;
  color: string;
  note: string;
};

export type CapacitanceSnapshot = {
  capacitance: number;
  charge: number;
  energy: number;
  capacitanceLevel: number;
};

export type CapacitanceLessonTwoSimulationProps = {
  embedded?: boolean;
};
