export type PolarityMode = "correct" | "reverse";

export type CeramicOption = never;

export type ElectrolyticSnapshot = {
  capacitanceFarad: number;
  storedEnergy: number;
  voltageStress: number;
  safetyMargin: number;
  smoothingLevel: number;
  heatLoss: number;
  leakageRisk: number;
};

export type CapacitorLessonSixSimulationProps = {
  embedded?: boolean;
};
